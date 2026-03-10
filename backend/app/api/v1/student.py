"""
Student-facing API endpoints
============================
Provides students with access to their assignments, submissions, and direct messaging
with instructors.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timezone
from pydantic import BaseModel

from ...database import get_db
from ...models.user import User
from ...models.course import Course
from ...models.progress import Enrollment
from ...models.assignment import Assignment, AssignmentSubmission
from ...models.message import Conversation, Message
from ...models.notification import Notification
from ...models.meeting import Meeting
from ...dependencies import get_current_active_user

router = APIRouter(prefix="/student", tags=["Student"])


# ==================== ASSIGNMENTS ====================

@router.get("/assignments")
async def get_student_assignments(
    course_id: Optional[int] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get all active assignments for the student's enrolled courses."""
    # Find enrolled course IDs
    enrolled_course_ids_query = db.query(Enrollment.course_id).filter(
        Enrollment.user_id == current_user.id
    )
    if course_id:
        enrolled_course_ids_query = enrolled_course_ids_query.filter(
            Enrollment.course_id == course_id
        )
    enrolled_course_ids = [row[0] for row in enrolled_course_ids_query.all()]

    if not enrolled_course_ids:
        return {"assignments": [], "total": 0, "page": page, "total_pages": 0}

    query = db.query(Assignment).filter(
        Assignment.course_id.in_(enrolled_course_ids),
        Assignment.is_active == True,
    )
    total = query.count()
    assignments = (
        query.order_by(Assignment.due_date.asc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    results = []
    for a in assignments:
        course = db.query(Course).filter(Course.id == a.course_id).first()
        submission = (
            db.query(AssignmentSubmission)
            .filter(
                AssignmentSubmission.assignment_id == a.id,
                AssignmentSubmission.student_id == current_user.id,
            )
            .order_by(AssignmentSubmission.submitted_at.desc())
            .first()
        )

        if submission and submission.grade is not None:
            status = "graded"
        elif submission:
            status = "submitted"
        else:
            status = "pending"

        results.append(
            {
                "id": a.id,
                "title": a.title,
                "assignment_type": a.assignment_type,
                "prompt": a.prompt,
                "rubric": a.rubric,
                "course_id": a.course_id,
                "course_title": course.title if course else "Unknown",
                "due_date": a.due_date.isoformat() if a.due_date else None,
                "status": status,
                "submission_id": submission.id if submission else None,
                "grade": float(submission.grade) if submission and submission.grade is not None else None,
                "feedback": submission.feedback if submission else None,
            }
        )

    return {
        "assignments": results,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit,
    }


class SubmissionCreate(BaseModel):
    content: Optional[str] = None
    audio_url: Optional[str] = None


@router.post("/assignments/{assignment_id}/submit")
async def submit_assignment(
    assignment_id: int,
    data: SubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Submit an assignment response."""
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    # Confirm student is enrolled
    enrollment = (
        db.query(Enrollment)
        .filter(
            Enrollment.user_id == current_user.id,
            Enrollment.course_id == assignment.course_id,
        )
        .first()
    )
    if not enrollment:
        raise HTTPException(status_code=403, detail="Not enrolled in this course")

    if not data.content and not data.audio_url:
        raise HTTPException(status_code=400, detail="Submission must include content or audio")

    # Check for existing submission
    existing = (
        db.query(AssignmentSubmission)
        .filter(
            AssignmentSubmission.assignment_id == assignment_id,
            AssignmentSubmission.student_id == current_user.id,
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="You have already submitted this assignment")

    submission = AssignmentSubmission(
        assignment_id=assignment_id,
        student_id=current_user.id,
        content=data.content,
        audio_url=data.audio_url,
    )
    db.add(submission)

    # Notify the instructor
    notification = Notification(
        user_id=assignment.instructor_id,
        type="assignment_submitted",
        title="New Assignment Submission",
        body=f"{current_user.full_name} submitted '{assignment.title}'",
        action_url=f"/instructor/assignments",
        source_type="assignment",
        source_id=assignment.id,
    )
    db.add(notification)
    db.commit()
    db.refresh(submission)

    return {"message": "Assignment submitted successfully", "submission_id": submission.id}


# ==================== MESSAGING ====================

@router.get("/conversations")
async def get_student_conversations(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get all conversations for the student."""
    conversations = (
        db.query(Conversation)
        .filter(Conversation.student_id == current_user.id)
        .order_by(Conversation.last_message_at.desc())
        .all()
    )

    total = len(conversations)
    start = (page - 1) * limit
    paginated = conversations[start : start + limit]

    results = []
    for conv in paginated:
        instructor = db.query(User).filter(User.id == conv.instructor_id).first()
        unread_count = (
            db.query(Message)
            .filter(
                Message.conversation_id == conv.id,
                Message.sender_id != current_user.id,
                Message.is_read == False,
            )
            .count()
        )
        results.append(
            {
                "id": conv.id,
                "instructor_id": instructor.id if instructor else None,
                "instructor_name": instructor.full_name if instructor else "Unknown",
                "instructor_avatar": instructor.avatar_url if instructor else None,
                "last_message_preview": conv.last_message_preview,
                "last_message_at": conv.last_message_at.isoformat()
                if conv.last_message_at
                else None,
                "unread_count": unread_count,
            }
        )

    return {
        "conversations": results,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit,
    }


@router.get("/conversations/{conversation_id}/messages")
async def get_student_conversation_messages(
    conversation_id: int,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get messages in a conversation (student view)."""
    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.student_id == current_user.id,
        )
        .first()
    )
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    total = (
        db.query(Message).filter(Message.conversation_id == conversation_id).count()
    )
    messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    # Mark incoming messages as read
    for msg in messages:
        if msg.sender_id != current_user.id and not msg.is_read:
            msg.is_read = True
            msg.read_at = datetime.now(timezone.utc)
    db.commit()

    results = []
    for msg in messages:
        sender = db.query(User).filter(User.id == msg.sender_id).first()
        results.append(
            {
                "id": msg.id,
                "sender_id": msg.sender_id,
                "sender_name": sender.full_name if sender else "Unknown",
                "sender_avatar": sender.avatar_url if sender else None,
                "content": msg.content,
                "message_type": msg.message_type,
                "is_read": msg.is_read,
                "created_at": msg.created_at.isoformat() if msg.created_at else None,
            }
        )

    return {
        "messages": results,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit,
    }


class StudentMessageCreate(BaseModel):
    instructor_id: int
    content: str
    message_type: str = "text"


class ReplyCreate(BaseModel):
    content: str


class MeetingResponse(BaseModel):
    response: str
    response_note: Optional[str] = None


class MeetingRespondRequest(BaseModel):
    response: str
    response_note: Optional[str] = None


@router.post("/messages")
async def student_send_message(
    message: StudentMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Student sends a message to an instructor."""
    # Verify the instructor exists and is an instructor
    instructor = (
        db.query(User)
        .filter(
            User.id == message.instructor_id,
            User.role.in_(["instructor", "admin", "super_admin"]),
        )
        .first()
    )
    if not instructor:
        raise HTTPException(status_code=404, detail="Instructor not found")

    # Verify the student is enrolled in at least one of the instructor's courses
    instructor_course_ids = [
        row[0]
        for row in db.query(Course.id)
        .filter(Course.instructor_id == message.instructor_id)
        .all()
    ]
    is_enrolled = False
    if instructor_course_ids:
        is_enrolled = (
            db.query(Enrollment)
            .filter(
                Enrollment.user_id == current_user.id,
                Enrollment.course_id.in_(instructor_course_ids),
            )
            .first()
        ) is not None

    if not is_enrolled:
        raise HTTPException(
            status_code=403, detail="You are not enrolled in any of this instructor's courses"
        )

    # Get or create the conversation
    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.instructor_id == message.instructor_id,
            Conversation.student_id == current_user.id,
            Conversation.is_group == False,
        )
        .first()
    )
    if not conversation:
        conversation = Conversation(
            instructor_id=message.instructor_id,
            student_id=current_user.id,
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)

    msg = Message(
        conversation_id=conversation.id,
        sender_id=current_user.id,
        content=message.content,
        message_type=message.message_type,
    )
    db.add(msg)

    conversation.last_message_preview = message.content[:100]
    conversation.last_message_at = datetime.now(timezone.utc)

    # Notify instructor
    notification = Notification(
        user_id=message.instructor_id,
        type="message",
        title=f"New message from {current_user.full_name}",
        body=message.content[:100],
        action_url=f"/instructor/messages",
        source_type="conversation",
        source_id=conversation.id,
    )
    db.add(notification)
    db.commit()
    db.refresh(msg)

    return {
        "message": "Message sent",
        "message_id": msg.id,
        "conversation_id": conversation.id,
    }


# ==================== STUDENT MESSAGES (GET /messages) ====================

@router.get("/messages")
async def get_student_messages(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get all conversations for the student (alias for /conversations)."""
    # This is the same as /conversations but returns in a format expected by frontend
    conversations = (
        db.query(Conversation)
        .filter(Conversation.student_id == current_user.id)
        .order_by(Conversation.last_message_at.desc())
        .all()
    )

    total = len(conversations)
    start = (page - 1) * limit
    paginated = conversations[start : start + limit]

    results = []
    for conv in paginated:
        instructor = db.query(User).filter(User.id == conv.instructor_id).first()
        unread_count = (
            db.query(Message)
            .filter(
                Message.conversation_id == conv.id,
                Message.sender_id != current_user.id,
                Message.is_read == False,
            )
            .count()
        )
        # Get last message
        last_msg = (
            db.query(Message)
            .filter(Message.conversation_id == conv.id)
            .order_by(Message.created_at.desc())
            .first()
        )
        results.append(
            {
                "id": conv.id,
                "instructor_id": instructor.id if instructor else None,
                "instructor_name": instructor.full_name if instructor else "Unknown",
                "instructor_avatar": instructor.avatar_url if instructor else None,
                "last_message": {
                    "content": last_msg.content if last_msg else None,
                    "created_at": last_msg.created_at.isoformat() if last_msg and last_msg.created_at else None,
                },
                "last_message_preview": conv.last_message_preview,
                "last_message_at": conv.last_message_at.isoformat()
                if conv.last_message_at
                else None,
                "unread_count": unread_count,
            }
        )

    return {
        "conversations": results,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit,
    }


@router.post("/messages/{conversation_id}/reply")
async def student_reply_to_message(
    conversation_id: int,
    data: ReplyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Reply to a conversation."""
    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.student_id == current_user.id,
        )
        .first()
    )
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Create the reply message
    msg = Message(
        conversation_id=conversation_id,
        sender_id=current_user.id,
        content=data.content,
        message_type="text",
    )
    db.add(msg)

    conversation.last_message_preview = data.content[:100]
    conversation.last_message_at = datetime.now(timezone.utc)

    # Notify instructor
    notification = Notification(
        user_id=conversation.instructor_id,
        type="message",
        title=f"New reply from {current_user.full_name}",
        body=data.content[:100],
        action_url=f"/instructor/messages",
        source_type="conversation",
        source_id=conversation.id,
    )
    db.add(notification)
    db.commit()
    db.refresh(msg)

    return {
        "message": "Reply sent",
        "message_id": msg.id,
        "conversation_id": conversation.id,
    }


# ==================== STUDENT MEETINGS ====================

@router.get("/meetings")
async def get_student_meetings(
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get all meetings where the student is invited."""
    # Get all meetings and filter in Python
    # We need to query using SQLAlchemy's JSON column access
    from sqlalchemy import and_
    import json
    
    # Get all non-cancelled meetings
    all_meetings = db.query(Meeting).filter(Meeting.status != "cancelled").all()
    
    # Filter meetings where user is in invitee_ids
    # Since the JSON column may return None or a list, we handle both cases
    user_meetings = []
    for meeting in all_meetings:
        # Access the raw database column value
        invitee_ids_raw = meeting.invitee_ids
        
        # Parse the invitee_ids - could be None, a list, or a JSON string
        invitee_list = []
        if invitee_ids_raw is not None:
            if isinstance(invitee_ids_raw, list):
                invitee_list = invitee_ids_raw
            elif isinstance(invitee_ids_raw, str):
                try:
                    invitee_list = json.loads(invitee_ids_raw)
                except:
                    invitee_list = []
        
        # Check if current user's ID is in the invitee list
        user_id_str = str(current_user.id)
        if user_id_str in [str(x) for x in invitee_list]:
            user_meetings.append(meeting)
    
    # Apply status filter if provided
    if status:
        user_meetings = [m for m in user_meetings if m.status == status]
    
    total = len(user_meetings)
    start = (page - 1) * limit
    paginated = user_meetings[start : start + limit]

    results = []
    for meeting in paginated:
        organizer = db.query(User).filter(User.id == meeting.organizer_id).first()
        results.append(
            {
                "id": meeting.id,
                "title": meeting.title,
                "description": meeting.description,
                "meeting_type": meeting.meeting_type,
                "scheduled_at": meeting.scheduled_at.isoformat() if meeting.scheduled_at else None,
                "duration_minutes": meeting.duration_minutes,
                "timezone": meeting.timezone,
                "meeting_link": meeting.meeting_link,
                "meeting_platform": meeting.meeting_platform,
                "status": meeting.status,
                "reason": meeting.reason,
                "response": meeting.response,
                "organizer_id": meeting.organizer_id,
                "organizer_name": organizer.full_name if organizer else "Unknown",
                "organizer_avatar": organizer.avatar_url if organizer else None,
                "created_at": meeting.created_at.isoformat() if meeting.created_at else None,
            }
        )

    return {
        "meetings": results,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit,
    }


@router.post("/meetings/{meeting_id}/respond")
async def student_respond_to_meeting(
    meeting_id: int,
    data: MeetingRespondRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Respond to a meeting invitation (accept/decline)."""
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    # Verify student is invited
    if meeting.invitee_ids and str(current_user.id) not in str(meeting.invitee_ids):
        raise HTTPException(status_code=403, detail="You are not invited to this meeting")
    
    if data.response not in ["accepted", "declined"]:
        raise HTTPException(status_code=400, detail="Response must be 'accepted' or 'declined'")
    
    meeting.response = data.response
    meeting.response_at = datetime.now(timezone.utc)
    meeting.response_note = data.response_note
    
    # Update meeting status
    if data.response == "accepted":
        meeting.status = "confirmed"
    elif data.response == "declined":
        meeting.status = "declined"
    
    db.commit()
    db.refresh(meeting)
    
    return {
        "message": f"Meeting {data.response}",
        "meeting_id": meeting.id,
        "response": meeting.response,
        "status": meeting.status,
    }
