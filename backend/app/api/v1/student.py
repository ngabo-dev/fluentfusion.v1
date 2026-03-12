"""
Student-facing API endpoints
============================
Provides students with access to their assignments, submissions, and direct messaging
with instructors.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, text
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
from ...models.announcement import Announcement
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

    # Batch load courses (avoid N+1)
    course_ids = list({a.course_id for a in assignments})
    course_map = {c.id: c for c in db.query(Course).filter(Course.id.in_(course_ids)).all()}

    # Batch load latest submission per assignment for this student (avoid N+1)
    assignment_ids = [a.id for a in assignments]
    all_subs = (
        db.query(AssignmentSubmission)
        .filter(
            AssignmentSubmission.assignment_id.in_(assignment_ids),
            AssignmentSubmission.student_id == current_user.id,
        )
        .order_by(AssignmentSubmission.submitted_at.desc())
        .all()
    )
    submission_map: dict = {}
    for s in all_subs:
        if s.assignment_id not in submission_map:
            submission_map[s.assignment_id] = s

    results = []
    for a in assignments:
        course = course_map.get(a.course_id)
        submission = submission_map.get(a.id)

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

    # Batch load instructors (avoid N+1)
    instructor_ids = list({c.instructor_id for c in paginated})
    instructor_map = {u.id: u for u in db.query(User).filter(User.id.in_(instructor_ids)).all()}

    # Batch unread counts with a single GROUP BY query (avoid N+1)
    conv_ids = [c.id for c in paginated]
    unread_rows = (
        db.query(Message.conversation_id, func.count(Message.id))
        .filter(
            Message.conversation_id.in_(conv_ids),
            Message.sender_id != current_user.id,
            Message.is_read == False,
        )
        .group_by(Message.conversation_id)
        .all()
    )
    unread_map = {row[0]: row[1] for row in unread_rows}

    results = []
    for conv in paginated:
        instructor = instructor_map.get(conv.instructor_id)
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
                "unread_count": unread_map.get(conv.id, 0),
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

    # Batch load senders (avoid N+1)
    sender_ids = list({msg.sender_id for msg in messages})
    sender_map = {u.id: u for u in db.query(User).filter(User.id.in_(sender_ids)).all()}

    results = []
    for msg in messages:
        sender = sender_map.get(msg.sender_id)
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
    # NOTE: Allow messaging even if not enrolled - students can message any instructor
    # This was previously blocking student-initiated messages
    instructor_course_ids = [
        row[0]
        for row in db.query(Course.id)
        .filter(Course.instructor_id == message.instructor_id)
        .all()
    ]
    # Allow messaging even if not enrolled - comment out the enrollment check
    # is_enrolled = False
    # if instructor_course_ids:
    #     is_enrolled = (
    #         db.query(Enrollment)
    #         .filter(
    #             Enrollment.user_id == current_user.id,
    #             Enrollment.course_id.in_(instructor_course_ids),
    #         )
    #         .first()
    #     ) is not None

    # if not is_enrolled:
    #     raise HTTPException(
    #         status_code=403, detail="You are not enrolled in any of this instructor's courses"
    #     )

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

    # Batch load instructors (avoid N+1)
    msg_instructor_ids = list({c.instructor_id for c in paginated})
    msg_instructor_map = {u.id: u for u in db.query(User).filter(User.id.in_(msg_instructor_ids)).all()}

    # Batch unread counts with GROUP BY (avoid N+1)
    msg_conv_ids = [c.id for c in paginated]
    msg_unread_rows = (
        db.query(Message.conversation_id, func.count(Message.id))
        .filter(
            Message.conversation_id.in_(msg_conv_ids),
            Message.sender_id != current_user.id,
            Message.is_read == False,
        )
        .group_by(Message.conversation_id)
        .all()
    )
    msg_unread_map = {row[0]: row[1] for row in msg_unread_rows}

    # Batch last messages: get max message id per conversation, then fetch those
    last_msg_subq = (
        db.query(Message.conversation_id, func.max(Message.id).label("max_id"))
        .filter(Message.conversation_id.in_(msg_conv_ids))
        .group_by(Message.conversation_id)
        .subquery()
    )
    last_msgs = (
        db.query(Message)
        .join(last_msg_subq, Message.id == last_msg_subq.c.max_id)
        .all()
    )
    last_msg_map = {m.conversation_id: m for m in last_msgs}

    results = []
    for conv in paginated:
        instructor = msg_instructor_map.get(conv.instructor_id)
        last_msg = last_msg_map.get(conv.id)
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
                "unread_count": msg_unread_map.get(conv.id, 0),
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
    # Use PostgreSQL's JSONB containment operator to filter in the DB
    # This avoids loading the entire meetings table into Python memory
    query = db.query(Meeting).filter(
        Meeting.status != "cancelled",
        text("invitee_ids::jsonb @> :val").bindparams(val=f'[{current_user.id}]'),
    )

    if status:
        query = query.filter(Meeting.status == status)

    total = query.count()
    paginated = (
        query.order_by(Meeting.scheduled_at.asc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    # Batch load organizers (avoid N+1)
    organizer_ids = list({m.organizer_id for m in paginated})
    organizer_map = {u.id: u for u in db.query(User).filter(User.id.in_(organizer_ids)).all()}

    results = []
    for meeting in paginated:
        organizer = organizer_map.get(meeting.organizer_id)
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


# ==================== STUDENT ANNOUNCEMENTS ====================

@router.get("/announcements")
async def get_student_announcements(
    course_id: Optional[int] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get announcements for student's enrolled courses."""
    # Find enrolled course IDs
    enrolled_course_ids = [
        row[0] for row in db.query(Enrollment.course_id).filter(
            Enrollment.user_id == current_user.id
        ).all()
    ]
    
    if not enrolled_course_ids:
        return {"announcements": [], "total": 0, "page": page, "total_pages": 0}
    
    # Query announcements for enrolled courses
    query = db.query(Announcement).filter(
        Announcement.target_course_id.in_(enrolled_course_ids),
        Announcement.is_published == True,
    )
    
    # Filter by course_id if provided
    if course_id:
        query = query.filter(Announcement.target_course_id == course_id)
    
    total = query.count()
    announcements = (
        query.order_by(Announcement.published_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
    
    # Batch load authors and courses (avoid N+1)
    ann_author_ids = list({a.author_id for a in announcements if a.author_id})
    ann_author_map = {u.id: u for u in db.query(User).filter(User.id.in_(ann_author_ids)).all()}
    ann_course_ids = list({a.target_course_id for a in announcements if a.target_course_id})
    ann_course_map = {c.id: c for c in db.query(Course).filter(Course.id.in_(ann_course_ids)).all()}

    results = []
    for a in announcements:
        author = ann_author_map.get(a.author_id)
        course = ann_course_map.get(a.target_course_id)

        results.append(
            {
                "id": a.id,
                "title": a.title,
                "content": a.content,
                "summary": a.summary,
                "course_id": a.target_course_id,
                "course_title": course.title if course else "Unknown",
                "author_name": author.full_name if author else "Unknown",
                "author_avatar": author.avatar_url if author else None,
                "announcement_type": a.announcement_type,
                "priority": a.priority,
                "image_url": a.image_url,
                "action_url": a.action_url,
                "published_at": a.published_at.isoformat() if a.published_at else None,
                "created_at": a.created_at.isoformat() if a.created_at else None,
            }
        )
    
    return {
        "announcements": results,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit,
    }
