from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime, timedelta
from pydantic import BaseModel
import re

from ...database import get_db
from ...models.user import User
from ...models.course import Course, Lesson
from ...models.progress import Enrollment, LessonCompletion
from ...models.certificate import Certificate
from ...models.message import Conversation, Message
from ...models.notification import Notification
from ...models.report import Report, ReportComment
from ...models.activity import UserActivity
from ...models.instructor import InstructorProfile, InstructorEarning
from ...models.admin import AdminAuditLog
from ...dependencies import get_current_user, require_instructor

router = APIRouter(prefix="/instructor", tags=["Instructor"])

# ==================== PYDANTIC SCHEMAS ====================

class MessageCreate(BaseModel):
    student_id: int
    content: str
    message_type: str = "text"
    attachment_url: Optional[str] = None

class ReportResponseCreate(BaseModel):
    report_type: str
    title: str
    description: str
    related_type: Optional[str] = None
    related_id: Optional[int] = None

# ==================== HELPER FUNCTIONS ====================

def extract_mentions(text: str, db: Session) -> List[dict]:
    """Extract @mentions from text and return user info"""
    mention_pattern = r'@(\w+)'
    mentions = re.findall(mention_pattern, text)
    
    results = []
    for username in mentions:
        user = db.query(User).filter(User.full_name.ilike(f"%{username}%")).first()
        if user:
            results.append({
                "user_id": user.id,
                "username": user.full_name,
                "position": text.find(f"@{username}")
            })
    return results

# ==================== DASHBOARD ====================

@router.get("/dashboard")
async def get_instructor_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get instructor dashboard stats"""
    instructor_id = current_user.id
    
    # Get instructor profile (create if not exists)
    profile = db.query(InstructorProfile).filter(
        InstructorProfile.user_id == instructor_id
    ).first()
    
    if not profile:
        # Create a new instructor profile
        profile = InstructorProfile(
            user_id=instructor_id,
            bio="",
            headline="",
            total_students=0,
            total_earnings_usd=0,
            avg_rating=0
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    # Course stats
    courses = db.query(Course).filter(Course.instructor_id == instructor_id).all()
    total_courses = len(courses)
    published_courses = len([c for c in courses if c.is_published])
    pending_courses = len([c for c in courses if c.approval_status == "pending"])
    
    # Student stats
    total_students = profile.total_students or 0
    
    # Enrollment stats
    course_ids = [c.id for c in courses]
    if course_ids:
        total_enrollments = db.query(Enrollment).filter(
            Enrollment.course_id.in_(course_ids)
        ).count()
        
        active_enrollments = db.query(Enrollment).filter(
            Enrollment.course_id.in_(course_ids),
            Enrollment.completion_pct < 100
        ).count()
    else:
        total_enrollments = 0
        active_enrollments = 0
    
    # Revenue stats
    total_earnings = float(profile.total_earnings_usd or 0)
    
    # Rating
    avg_rating = float(profile.avg_rating or 0)
    
    return {
        "profile": {
            "total_students": total_students,
            "total_courses": total_courses,
            "avg_rating": avg_rating,
            "total_earnings": total_earnings
        },
        "courses": {
            "total": total_courses,
            "published": published_courses,
            "pending": pending_courses
        },
        "enrollments": {
            "total": total_enrollments,
            "active": active_enrollments
        },
        "earnings": {
            "total": total_earnings
        }
    }

# ==================== STUDENT MANAGEMENT ====================

@router.get("/students")
async def get_my_students(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    course_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get all students enrolled in instructor's courses"""
    instructor_id = current_user.id
    
    # Get instructor's course IDs
    courses = db.query(Course).filter(Course.instructor_id == instructor_id).all()
    course_ids = [c.id for c in courses]
    
    if not course_ids:
        return {"students": [], "total": 0, "page": page}
    
    # Get enrollments
    query = db.query(Enrollment).filter(Enrollment.course_id.in_(course_ids))
    
    if course_id:
        query = query.filter(Enrollment.course_id == course_id)
    
    enrollments = query.all()
    
    # Get unique students
    student_ids = list(set([e.user_id for e in enrollments]))
    
    # Build student data with search
    students_data = []
    for sid in student_ids:
        student = db.query(User).filter(User.id == sid).first()
        if not student:
            continue
            
        if search:
            if search.lower() not in student.full_name.lower() and search.lower() not in student.email.lower():
                continue
        
        # Get student's enrollments for this instructor's courses
        student_enrollments = [e for e in enrollments if e.user_id == sid]
        courses_data = []
        for e in student_enrollments:
            course = db.query(Course).filter(Course.id == e.course_id).first()
            if course:
                courses_data.append({
                    "enrollment_id": e.id,
                    "course_id": course.id,
                    "course_title": course.title,
                    "progress": e.completion_pct,
                    "enrolled_at": e.enrolled_at.isoformat() if e.enrolled_at else None,
                    "last_accessed": e.last_accessed_at.isoformat() if e.last_accessed_at else None
                })
        
        students_data.append({
            "id": student.id,
            "email": student.email,
            "full_name": student.full_name,
            "avatar_url": student.avatar_url,
            "is_active": student.is_active,
            "created_at": student.created_at.isoformat() if student.created_at else None,
            "last_active": student.last_active_at.isoformat() if student.last_active_at else None,
            "courses": courses_data,
            "total_courses": len(courses_data)
        })
    
    # Paginate
    total = len(students_data)
    start = (page - 1) * limit
    end = start + limit
    paginated_students = students_data[start:end]
    
    return {
        "students": paginated_students,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit
    }

@router.get("/students/{student_id}")
async def get_student_details(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get detailed info about a specific student"""
    instructor_id = current_user.id
    
    # Verify student is enrolled in instructor's course
    courses = db.query(Course).filter(Course.instructor_id == instructor_id).all()
    course_ids = [c.id for c in courses]
    
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == student_id,
        Enrollment.course_id.in_(course_ids)
    ).first()
    
    if not enrollment:
        raise HTTPException(status_code=404, detail="Student not found in your courses")
    
    student = db.query(User).filter(User.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get all enrollments for this student in instructor's courses
    enrollments = db.query(Enrollment).filter(
        Enrollment.user_id == student_id,
        Enrollment.course_id.in_(course_ids)
    ).all()
    
    courses_data = []
    for e in enrollments:
        course = db.query(Course).filter(Course.id == e.course_id).first()
        if course:
            # Get lesson completions
            completed_lessons = db.query(LessonCompletion).filter(
                LessonCompletion.enrollment_id == e.id
            ).count()
            
            # Get total lessons
            total_lessons = db.query(Lesson).filter(Lesson.course_id == course.id).count()
            
            # Get certificate if any
            certificate = db.query(Certificate).filter(
                Certificate.enrollment_id == e.id
            ).first()
            
            courses_data.append({
                "enrollment_id": e.id,
                "course_id": course.id,
                "course_title": course.title,
                "progress": e.completion_pct,
                "completed_lessons": completed_lessons,
                "total_lessons": total_lessons,
                "enrolled_at": e.enrolled_at.isoformat() if e.enrolled_at else None,
                "completed_at": e.completed_at.isoformat() if e.completed_at else None,
                "last_accessed": e.last_accessed_at.isoformat() if e.last_accessed_at else None,
                "certificate": {
                    "id": certificate.id,
                    "certificate_number": certificate.certificate_number,
                    "certificate_url": certificate.certificate_url,
                    "issued_at": certificate.issued_at.isoformat() if certificate.issued_at else None
                } if certificate else None
            })
    
    # Get recent activity
    activities = db.query(UserActivity).filter(
        UserActivity.user_id == student_id
    ).order_by(UserActivity.created_at.desc()).limit(10).all()
    
    return {
        "student": {
            "id": student.id,
            "email": student.email,
            "full_name": student.full_name,
            "avatar_url": student.avatar_url,
            "bio": student.bio,
            "location": student.location,
            "is_active": student.is_active,
            "created_at": student.created_at.isoformat() if student.created_at else None,
            "last_active": student.last_active_at.isoformat() if student.last_active_at else None
        },
        "courses": courses_data,
        "recent_activity": [
            {
                "id": a.id,
                "activity_type": a.activity_type,
                "target_type": a.target_type,
                "target_title": a.target_title,
                "xp_earned": a.xp_earned,
                "created_at": a.created_at.isoformat() if a.created_at else None
            }
            for a in activities
        ]
    }

# ==================== ENROLLMENT MANAGEMENT ====================

@router.get("/enrollments")
async def get_enrollments(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    course_id: Optional[int] = None,
    status: Optional[str] = None,  # active, completed, refunded
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get enrollments for instructor's courses"""
    instructor_id = current_user.id
    
    courses = db.query(Course).filter(Course.instructor_id == instructor_id).all()
    course_ids = [c.id for c in courses]
    
    if not course_ids:
        return {"enrollments": [], "total": 0, "page": page}
    
    query = db.query(Enrollment).filter(Enrollment.course_id.in_(course_ids))
    
    if course_id:
        query = query.filter(Enrollment.course_id == course_id)
    
    if status == "active":
        query = query.filter(Enrollment.completion_pct < 100, Enrollment.refunded_at.is_(None))
    elif status == "completed":
        query = query.filter(Enrollment.completion_pct == 100)
    elif status == "refunded":
        query = query.filter(Enrollment.refunded_at.isnot(None))
    
    total = query.count()
    enrollments = query.order_by(Enrollment.enrolled_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    results = []
    for e in enrollments:
        student = db.query(User).filter(User.id == e.user_id).first()
        course = db.query(Course).filter(Course.id == e.course_id).first()
        
        results.append({
            "id": e.id,
            "student_id": student.id if student else None,
            "student_name": student.full_name if student else "Unknown",
            "student_email": student.email if student else "Unknown",
            "course_id": course.id if course else None,
            "course_title": course.title if course else "Unknown",
            "progress": e.completion_pct,
            "enrolled_at": e.enrolled_at.isoformat() if e.enrolled_at else None,
            "completed_at": e.completed_at.isoformat() if e.completed_at else None,
            "last_accessed": e.last_accessed_at.isoformat() if e.last_accessed_at else None,
            "is_refunded": e.refunded_at is not None
        })
    
    return {
        "enrollments": results,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit
    }

@router.get("/enrollments/{enrollment_id}")
async def get_enrollment_details(
    enrollment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get detailed enrollment info"""
    instructor_id = current_user.id
    
    enrollment = db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    # Verify instructor owns the course
    course = db.query(Course).filter(Course.id == enrollment.course_id).first()
    if course.instructor_id != instructor_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    student = db.query(User).filter(User.id == enrollment.user_id).first()
    
    # Get lesson completions
    completions = db.query(LessonCompletion).filter(
        LessonCompletion.enrollment_id == enrollment_id
    ).all()
    
    completed_lesson_ids = [c.lesson_id for c in completions]
    
    # Get all lessons in course
    lessons = db.query(Lesson).filter(Lesson.course_id == course.id).order_by(Lesson.order_index).all()
    
    lesson_progress = []
    for lesson in lessons:
        completion = next((c for c in completions if c.lesson_id == lesson.id), None)
        lesson_progress.append({
            "lesson_id": lesson.id,
            "lesson_title": lesson.title,
            "completed": lesson.id in completed_lesson_ids,
            "completed_at": completion.completed_at.isoformat() if completion and completion.completed_at else None,
            "time_spent": completion.time_spent_sec if completion else 0
        })
    
    return {
        "enrollment": {
            "id": enrollment.id,
            "progress": enrollment.completion_pct,
            "enrolled_at": enrollment.enrolled_at.isoformat() if enrollment.enrolled_at else None,
            "completed_at": enrollment.completed_at.isoformat() if enrollment.completed_at else None,
            "last_accessed": enrollment.last_accessed_at.isoformat() if enrollment.last_accessed_at else None
        },
        "student": {
            "id": student.id,
            "email": student.email,
            "full_name": student.full_name,
            "avatar_url": student.avatar_url
        },
        "course": {
            "id": course.id,
            "title": course.title
        },
        "lessons": lesson_progress
    }

# ==================== CERTIFICATE MANAGEMENT ====================

@router.post("/certificates/issue")
async def issue_certificate(
    enrollment_id: int,
    final_score: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Issue a certificate to a student"""
    instructor_id = current_user.id
    
    enrollment = db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    # Verify instructor owns the course
    course = db.query(Course).filter(Course.id == enrollment.course_id).first()
    if course.instructor_id != instructor_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Check if already has certificate
    existing = db.query(Certificate).filter(Certificate.enrollment_id == enrollment_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Certificate already issued")
    
    # Check if course has certificate enabled
    if not course.has_certificate:
        raise HTTPException(status_code=400, detail="Course does not have certificates enabled")
    
    # Generate certificate number
    import uuid
    cert_number = f"CERT-{uuid.uuid4().hex[:8].upper()}"
    verification_code = f"VERIFY-{uuid.uuid4().hex[:12].upper()}"
    
    # Calculate grade
    grade = "F"
    if final_score:
        if final_score >= 90:
            grade = "A"
        elif final_score >= 80:
            grade = "B"
        elif final_score >= 70:
            grade = "C"
        elif final_score >= 60:
            grade = "D"
    
    certificate = Certificate(
        enrollment_id=enrollment_id,
        user_id=enrollment.user_id,
        course_id=course.id,
        certificate_number=cert_number,
        verification_code=verification_code,
        final_score=final_score,
        grade=grade,
        issued_by_instructor_id=instructor_id
    )
    
    db.add(certificate)
    
    # Update enrollment
    enrollment.certificate_url = f"/certificates/{cert_number}"
    enrollment.completion_pct = 100
    enrollment.completed_at = datetime.utcnow()
    
    # Create notification for student
    notification = Notification(
        user_id=enrollment.user_id,
        type="certificate",
        title="Certificate Issued! 🎓",
        body=f"Congratulations! You've received your certificate for completing {course.title}",
        action_url=f"/certificates/{cert_number}",
        source_type="certificate",
        source_id=certificate.id
    )
    db.add(notification)
    
    db.commit()
    db.refresh(certificate)
    
    return {
        "message": "Certificate issued successfully",
        "certificate": {
            "id": certificate.id,
            "certificate_number": certificate.certificate_number,
            "verification_code": certificate.verification_code,
            "final_score": certificate.final_score,
            "grade": certificate.grade
        }
    }

@router.get("/certificates")
async def get_certificates(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    course_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get certificates issued by instructor"""
    instructor_id = current_user.id
    
    courses = db.query(Course).filter(Course.instructor_id == instructor_id).all()
    course_ids = [c.id for c in courses]
    
    if not course_ids:
        return {"certificates": [], "total": 0, "page": page}
    
    query = db.query(Certificate).filter(Certificate.course_id.in_(course_ids))
    
    if course_id:
        query = query.filter(Certificate.course_id == course_id)
    
    total = query.count()
    certificates = query.order_by(Certificate.issued_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    results = []
    for cert in certificates:
        student = db.query(User).filter(User.id == cert.user_id).first()
        course = db.query(Course).filter(Course.id == cert.course_id).first()
        
        results.append({
            "id": cert.id,
            "certificate_number": cert.certificate_number,
            "verification_code": cert.verification_code,
            "student_name": student.full_name if student else "Unknown",
            "student_email": student.email if student else "Unknown",
            "course_title": course.title if course else "Unknown",
            "final_score": cert.final_score,
            "grade": cert.grade,
            "issued_at": cert.issued_at.isoformat() if cert.issued_at else None,
            "is_revoked": cert.is_revoked
        })
    
    return {
        "certificates": results,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit
    }

@router.post("/certificates/{certificate_id}/revoke")
async def revoke_certificate(
    certificate_id: int,
    reason: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Revoke a certificate"""
    instructor_id = current_user.id
    
    certificate = db.query(Certificate).filter(Certificate.id == certificate_id).first()
    if not certificate:
        raise HTTPException(status_code=404, detail="Certificate not found")
    
    # Verify instructor owns the course
    course = db.query(Course).filter(Course.id == certificate.course_id).first()
    if course.instructor_id != instructor_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    certificate.is_revoked = True
    certificate.revoked_reason = reason
    
    # Log action
    audit = AdminAuditLog(
        admin_user_id=current_user.id,
        action="revoke_certificate",
        target_type="certificate",
        target_id=certificate_id,
        notes=reason
    )
    db.add(audit)
    db.commit()
    
    return {"message": "Certificate revoked"}

@router.get("/certificates/verify/{code}")
async def verify_certificate(
    code: str,
    db: Session = Depends(get_db)
):
    """Verify a certificate by code (public endpoint)"""
    certificate = db.query(Certificate).filter(
        Certificate.verification_code == code
    ).first()
    
    if not certificate:
        raise HTTPException(status_code=404, detail="Certificate not found")
    
    if certificate.is_revoked:
        raise HTTPException(status_code=400, detail="Certificate has been revoked")
    
    student = db.query(User).filter(User.id == certificate.user_id).first()
    course = db.query(Course).filter(Course.id == certificate.course_id).first()
    
    return {
        "valid": True,
        "certificate": {
            "certificate_number": certificate.certificate_number,
            "student_name": student.full_name if student else "Unknown",
            "course_title": course.title if course else "Unknown",
            "completion_date": certificate.completion_date.isoformat() if certificate.completion_date else None,
            "final_score": certificate.final_score,
            "grade": certificate.grade,
            "issued_at": certificate.issued_at.isoformat() if certificate.issued_at else None
        }
    }

# ==================== MESSAGING ====================

@router.get("/conversations")
async def get_conversations(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get instructor's conversations with students"""
    instructor_id = current_user.id
    
    conversations = db.query(Conversation).filter(
        Conversation.instructor_id == instructor_id
    ).order_by(Conversation.last_message_at.desc()).all()
    
    total = len(conversations)
    start = (page - 1) * limit
    end = start + limit
    paginated = conversations[start:end]
    
    results = []
    for conv in paginated:
        student = db.query(User).filter(User.id == conv.student_id).first()
        
        # Get unread count
        unread_count = db.query(Message).filter(
            Message.conversation_id == conv.id,
            Message.sender_id != instructor_id,
            Message.is_read == False
        ).count()
        
        results.append({
            "id": conv.id,
            "student_id": student.id if student else None,
            "student_name": student.full_name if student else "Unknown",
            "student_avatar": student.avatar_url if student else None,
            "last_message_preview": conv.last_message_preview,
            "last_message_at": conv.last_message_at.isoformat() if conv.last_message_at else None,
            "unread_count": unread_count,
            "is_archived": conv.is_archived_by_instructor
        })
    
    return {
        "conversations": results,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit
    }

@router.get("/conversations/{conversation_id}/messages")
async def get_conversation_messages(
    conversation_id: int,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get messages in a conversation"""
    instructor_id = current_user.id
    
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.instructor_id == instructor_id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(Message.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    total = db.query(Message).filter(Message.conversation_id == conversation_id).count()
    
    # Mark messages as read
    for msg in messages:
        if msg.sender_id != instructor_id and not msg.is_read:
            msg.is_read = True
            msg.read_at = datetime.utcnow()
    db.commit()
    
    results = []
    for msg in messages:
        sender = db.query(User).filter(User.id == msg.sender_id).first()
        results.append({
            "id": msg.id,
            "sender_id": msg.sender_id,
            "sender_name": sender.full_name if sender else "Unknown",
            "sender_avatar": sender.avatar_url if sender else None,
            "content": msg.content,
            "message_type": msg.message_type,
            "attachment_url": msg.attachment_url,
            "is_read": msg.is_read,
            "created_at": msg.created_at.isoformat() if msg.created_at else None,
            "mentions": msg.mentions
        })
    
    return {
        "messages": results,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit
    }

@router.post("/messages")
async def send_message(
    message: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Send a message to a student"""
    instructor_id = current_user.id
    
    # Verify student is enrolled in instructor's course
    courses = db.query(Course).filter(Course.instructor_id == instructor_id).all()
    course_ids = [c.id for c in courses]
    
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == message.student_id,
        Enrollment.course_id.in_(course_ids)
    ).first()
    
    if not enrollment and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Student not enrolled in your course")
    
    # Get or create conversation
    conversation = db.query(Conversation).filter(
        Conversation.instructor_id == instructor_id,
        Conversation.student_id == message.student_id,
        Conversation.is_group == False
    ).first()
    
    if not conversation:
        conversation = Conversation(
            instructor_id=instructor_id,
            student_id=message.student_id
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
    
    # Extract mentions
    mentions = extract_mentions(message.content, db)
    
    # Create message
    msg = Message(
        conversation_id=conversation.id,
        sender_id=instructor_id,
        content=message.content,
        message_type=message.message_type,
        attachment_url=message.attachment_url,
        mentions=mentions
    )
    db.add(msg)
    
    # Update conversation
    conversation.last_message_preview = message.content[:100]
    conversation.last_message_at = datetime.utcnow()
    
    # Create notification for student
    student = db.query(User).filter(User.id == message.student_id).first()
    notification = Notification(
        user_id=message.student_id,
        type="message",
        title=f"New message from {current_user.full_name}",
        body=message.content[:100],
        action_url=f"/messages/{conversation.id}",
        source_type="conversation",
        source_id=conversation.id
    )
    db.add(notification)
    
    db.commit()
    db.refresh(msg)
    
    return {
        "message": "Message sent",
        "message_id": msg.id,
        "conversation_id": conversation.id
    }

# ==================== REPORTS (for students to report concerns) ====================

@router.get("/reports")
async def get_student_reports(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    report_type: Optional[str] = None,
    priority: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get reports from students in instructor's courses"""
    instructor_id = current_user.id
    
    # Get course IDs
    courses = db.query(Course).filter(Course.instructor_id == instructor_id).all()
    course_ids = [c.id for c in courses]
    
    # Get student IDs from enrollments
    enrollments = db.query(Enrollment).filter(
        Enrollment.course_id.in_(course_ids)
    ).all() if course_ids else []
    student_ids = list(set([e.user_id for e in enrollments]))
    
    if not student_ids:
        return {"reports": [], "total": 0, "page": page}
    
    # Get reports filed by students
    query = db.query(Report).filter(Report.reporter_id.in_(student_ids))
    
    if status:
        query = query.filter(Report.status == status)
    if report_type:
        query = query.filter(Report.report_type == report_type)
    if priority:
        query = query.filter(Report.priority == priority)
    
    total = query.count()
    reports = query.order_by(Report.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    results = []
    for r in reports:
        reporter = db.query(User).filter(User.id == r.reporter_id).first()
        
        results.append({
            "id": r.id,
            "reporter_name": reporter.full_name if reporter else "Unknown",
            "report_type": r.report_type,
            "title": r.title,
            "description": r.description,
            "priority": r.priority,
            "status": r.status,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "mentions": r.mentions
        })
    
    return {
        "reports": results,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit
    }

@router.post("/reports/{report_id}/respond")
async def respond_to_report(
    report_id: int,
    response: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Respond to a student report"""
    instructor_id = current_user.id
    
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Add comment
    mentions = extract_mentions(response, db)
    
    comment = ReportComment(
        report_id=report_id,
        author_id=instructor_id,
        content=response,
        mentions=mentions,
        is_internal=False
    )
    db.add(comment)
    
    # Update report status
    if report.status == "submitted":
        report.status = "acknowledged"
    elif report.status == "acknowledged":
        report.status = "in_progress"
    
    # Notify reporter
    notification = Notification(
        user_id=report.reporter_id,
        type="report_response",
        title=f"Response to your {report.report_type}",
        body=response[:100],
        action_url=f"/reports/{report_id}",
        source_type="report",
        source_id=report_id
    )
    db.add(notification)
    
    db.commit()
    
    return {"message": "Response added"}

# ==================== ANNOUNCEMENTS ====================

from ...models.announcement import Announcement

@router.get("/announcements")
async def get_announcements(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    course_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get announcements for instructor's courses"""
    instructor_id = current_user.id
    
    # Get instructor's course IDs
    courses = db.query(Course).filter(Course.instructor_id == instructor_id).all()
    course_ids = [c.id for c in courses]
    
    if not course_ids:
        return {"announcements": [], "total": 0, "page": page}
    
    query = db.query(Announcement).filter(Announcement.course_id.in_(course_ids))
    
    if course_id:
        query = query.filter(Announcement.course_id == course_id)
    
    total = query.count()
    announcements = query.order_by(Announcement.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    results = []
    for a in announcements:
        course = db.query(Course).filter(Course.id == a.course_id).first()
        results.append({
            "id": a.id,
            "title": a.title,
            "content": a.content,
            "course_id": a.course_id,
            "course_title": course.title if course else "Unknown",
            "is_published": a.is_published,
            "created_at": a.created_at.isoformat() if a.created_at else None,
            "scheduled_for": a.scheduled_for.isoformat() if a.scheduled_for else None
        })
    
    return {
        "announcements": results,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit
    }

@router.post("/announcements")
async def create_announcement(
    title: str,
    content: str,
    course_id: int,
    is_published: bool = True,
    scheduled_for: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Create an announcement for a course"""
    instructor_id = current_user.id
    
    # Verify course belongs to instructor
    course = db.query(Course).filter(Course.id == course_id, Course.instructor_id == instructor_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found or not authorized")
    
    from datetime import datetime
    scheduled = None
    if scheduled_for:
        scheduled = datetime.fromisoformat(scheduled_for.replace('Z', '+00:00'))
    
    announcement = Announcement(
        title=title,
        content=content,
        course_id=course_id,
        is_published=is_published,
        scheduled_for=scheduled
    )
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    
    return {
        "message": "Announcement created",
        "announcement_id": announcement.id
    }

@router.delete("/announcements/{announcement_id}")
async def delete_announcement(
    announcement_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Delete an announcement"""
    instructor_id = current_user.id
    
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    
    # Verify course belongs to instructor
    course = db.query(Course).filter(Course.id == announcement.course_id, Course.instructor_id == instructor_id).first()
    if not course:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db.delete(announcement)
    db.commit()
    
    return {"message": "Announcement deleted"}

# ==================== STUDENT PERFORMANCE ====================

@router.get("/courses/{course_id}/performance")
async def get_course_performance(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get performance analytics for a specific course"""
    instructor_id = current_user.id
    
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course or course.instructor_id != instructor_id:
        raise HTTPException(status_code=404, detail="Course not found")
    
    enrollments = db.query(Enrollment).filter(Enrollment.course_id == course_id).all()
    
    # Calculate stats
    total_students = len(enrollments)
    active_students = len([e for e in enrollments if e.completion_pct < 100 and not e.refunded_at])
    completed_students = len([e for e in enrollments if e.completion_pct == 100])
    avg_progress = sum([e.completion_pct for e in enrollments]) / total_students if total_students > 0 else 0
    
    # Get lesson-level stats
    lessons = db.query(Lesson).filter(Lesson.course_id == course_id).order_by(Lesson.order_index).all()
    lesson_stats = []
    
    for lesson in lessons:
        completions = db.query(LessonCompletion).filter(
            LessonCompletion.lesson_id == lesson.id
        ).count()
        
        avg_time = db.query(LessonCompletion).filter(
            LessonCompletion.lesson_id == lesson.id
        ).all()
        avg_time_spent = sum([c.time_spent_sec for c in avg_time]) / len(avg_time) if avg_time else 0
        
        lesson_stats.append({
            "lesson_id": lesson.id,
            "title": lesson.title,
            "completion_count": completions,
            "completion_rate": (completions / total_students * 100) if total_students > 0 else 0,
            "avg_time_seconds": int(avg_time_spent)
        })
    
    return {
        "course": {
            "id": course.id,
            "title": course.title,
            "total_students": total_students,
            "active_students": active_students,
            "completed_students": completed_students,
            "avg_progress": int(avg_progress)
        },
        "lessons": lesson_stats,
        "total_enrollments": total_students
    }

@router.get("/courses/{course_id}/students/struggling")
async def get_struggling_students(
    course_id: int,
    threshold: int = Query(30, ge=0, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get students who are struggling (low progress) in a course"""
    instructor_id = current_user.id
    
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course or course.instructor_id != instructor_id:
        raise HTTPException(status_code=404, detail="Course not found")
    
    enrollments = db.query(Enrollment).filter(
        Enrollment.course_id == course_id,
        Enrollment.completion_pct < threshold,
        Enrollment.refunded_at.is_(None)
    ).all()
    
    results = []
    for e in enrollments:
        student = db.query(User).filter(User.id == e.user_id).first()
        
        # Get last activity
        last_activity = db.query(UserActivity).filter(
            UserActivity.user_id == e.user_id,
            UserActivity.target_type == "lesson"
        ).order_by(UserActivity.created_at.desc()).first()
        
        results.append({
            "student_id": student.id if student else None,
            "student_name": student.full_name if student else "Unknown",
            "student_email": student.email if student else "Unknown",
            "progress": e.completion_pct,
            "last_accessed": e.last_accessed_at.isoformat() if e.last_accessed_at else None,
            "last_activity": last_activity.created_at.isoformat() if last_activity and last_activity.created_at else None
        })
    
    return {
        "students": results,
        "total": len(results)
    }
