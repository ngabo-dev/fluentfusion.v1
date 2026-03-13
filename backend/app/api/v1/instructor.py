from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime, timedelta, timezone
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

# ==================== INSTRUCTOR PROFILE ====================

class InstructorProfileUpdate(BaseModel):
    headline: Optional[str] = None
    bio: Optional[str] = None
    website_url: Optional[str] = None

class InstructorPayoutRequest(BaseModel):
    amount: float
    method: str  # bank, mobile_money, paypal
    account_details: str

@router.get("/profile")
async def get_instructor_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get instructor profile"""
    profile = db.query(InstructorProfile).filter(
        InstructorProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        profile = InstructorProfile(
            user_id=current_user.id,
            bio="",
            headline="",
            total_students=0,
            total_courses=0,
            total_earnings_usd=0,
            avg_rating=0
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "headline": profile.headline,
        "bio": profile.bio,
        "website_url": profile.website_url,
        "total_students": profile.total_students,
        "total_courses": profile.total_courses,
        "avg_rating": float(profile.avg_rating) if profile.avg_rating else 0,
        "total_earnings_usd": float(profile.total_earnings_usd) if profile.total_earnings_usd else 0,
        "is_verified": profile.is_verified,
        "created_at": profile.created_at.isoformat() if profile.created_at else None
    }

@router.put("/profile")
async def update_instructor_profile(
    profile_data: InstructorProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Update instructor profile"""
    profile = db.query(InstructorProfile).filter(
        InstructorProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        profile = InstructorProfile(
            user_id=current_user.id,
            headline=profile_data.headline or "",
            bio=profile_data.bio or "",
            website_url=profile_data.website_url
        )
        db.add(profile)
    else:
        if profile_data.headline is not None:
            profile.headline = profile_data.headline
        if profile_data.bio is not None:
            profile.bio = profile_data.bio
        if profile_data.website_url is not None:
            profile.website_url = profile_data.website_url
    
    db.commit()
    db.refresh(profile)
    
    return {
        "message": "Profile updated successfully",
        "profile": {
            "headline": profile.headline,
            "bio": profile.bio,
            "website_url": profile.website_url
        }
    }

@router.get("/earnings")
async def get_instructor_earnings(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get instructor earnings history"""
    from ...models.instructor import InstructorPayoutRequest as PayoutReq
    
    profile = db.query(InstructorProfile).filter(
        InstructorProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        return {"earnings": [], "total": 0, "page": page, "total_earnings": 0}
    
    query = db.query(InstructorEarning).filter(
        InstructorEarning.instructor_id == current_user.id
    )
    
    total = query.count()
    earnings = query.order_by(InstructorEarning.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    # Batch load courses (avoid N+1)
    earning_course_ids = list({e.course_id for e in earnings if e.course_id})
    earning_course_map = {c.id: c for c in db.query(Course).filter(Course.id.in_(earning_course_ids)).all()}

    results = []
    for e in earnings:
        course = earning_course_map.get(e.course_id)
        results.append({
            "id": e.id,
            "course_id": e.course_id,
            "course_title": course.title if course else "Unknown",
            "gross_amount": float(e.gross_amount),
            "platform_fee_pct": float(e.platform_fee_pct),
            "net_amount": float(e.net_amount),
            "currency": e.currency,
            "status": e.status,
            "paid_at": e.paid_at.isoformat() if e.paid_at else None,
            "created_at": e.created_at.isoformat() if e.created_at else None
        })
    
    return {
        "earnings": results,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit,
        "total_earnings": float(profile.total_earnings_usd or 0)
    }

@router.post("/payout/request")
async def request_payout(
    payout_data: InstructorPayoutRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Request a payout"""
    from ...models.instructor import InstructorPayoutRequest as PayoutReq
    
    profile = db.query(InstructorProfile).filter(
        InstructorProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Instructor profile not found")
    
    available_balance = float(profile.total_earnings_usd or 0)
    if available_balance < payout_data.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    payout_request = PayoutReq(
        instructor_id=current_user.id,
        amount=payout_data.amount,
        method=payout_data.method,
        account_details=payout_data.account_details
    )
    db.add(payout_request)
    db.commit()
    db.refresh(payout_request)
    
    return {
        "message": "Payout request submitted",
        "payout_id": payout_request.id,
        "amount": float(payout_request.amount),
        "status": payout_request.status
    }

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
            total_courses=0,
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
    
    # Enrollment stats — batch query for all courses at once
    course_ids = [c.id for c in courses]
    if course_ids:
        from sqlalchemy import func as sql_func

        # Count all enrollments per course in one query
        enrollment_rows = (
            db.query(Enrollment.course_id, sql_func.count(Enrollment.id))
            .filter(Enrollment.course_id.in_(course_ids))
            .group_by(Enrollment.course_id)
            .all()
        )
        enrollment_count_map = {row[0]: row[1] for row in enrollment_rows}

        # Count completed enrollments per course in one query
        completed_rows = (
            db.query(Enrollment.course_id, sql_func.count(Enrollment.id))
            .filter(
                Enrollment.course_id.in_(course_ids),
                Enrollment.completed_at.isnot(None)
            )
            .group_by(Enrollment.course_id)
            .all()
        )
        completed_count_map = {row[0]: row[1] for row in completed_rows}

        total_enrollments = sum(enrollment_count_map.values())
        active_enrollments = db.query(Enrollment).filter(
            Enrollment.course_id.in_(course_ids),
            Enrollment.completion_pct < 100
        ).count()

        # Distinct students
        total_students = (
            db.query(Enrollment.user_id)
            .filter(Enrollment.course_id.in_(course_ids))
            .distinct()
            .count()
        )
    else:
        enrollment_count_map = {}
        completed_count_map = {}
        total_enrollments = 0
        active_enrollments = 0
        total_students = 0

    # Revenue stats
    total_earnings = float(profile.total_earnings_usd or 0)
    
    # Rating
    avg_rating = float(profile.avg_rating or 0)

    # Recent enrollments (last 10) — pre-fetch users and courses to avoid N+1
    recent_enrollments = []
    if course_ids:
        recent_rows = (
            db.query(Enrollment)
            .filter(Enrollment.course_id.in_(course_ids))
            .order_by(Enrollment.enrolled_at.desc())
            .limit(10)
            .all()
        )
        # Collect unique user_ids needed
        user_ids_needed = list({e.user_id for e in recent_rows})
        users_map = {
            u.id: u
            for u in db.query(User).filter(User.id.in_(user_ids_needed)).all()
        }
        # courses are already loaded in `courses`; build a quick lookup map
        courses_map = {c.id: c for c in courses}

        for enrollment in recent_rows:
            student = users_map.get(enrollment.user_id)
            course = courses_map.get(enrollment.course_id)
            if student and course:
                recent_enrollments.append({
                    "student_id": student.id,
                    "student_name": student.full_name,
                    "student_email": student.email,
                    "course_id": course.id,
                    "course_title": course.title,
                    "enrolled_at": enrollment.enrolled_at.isoformat() if enrollment.enrolled_at else None
                })
    
    # Build per-course statistics array expected by the frontend
    courses_data = []
    for course in courses:
        enrollment_count = enrollment_count_map.get(course.id, 0)
        completed_count = completed_count_map.get(course.id, 0)
        language_name = ""
        if course.language:
            language_name = course.language.name or ""
        approval = course.approval_status or "pending"
        derived_status = (
            "active" if (approval == "approved" and course.is_published)
            else approval if approval in ("rejected", "pending")
            else "active"
        )
        courses_data.append({
            "id": course.id,
            "title": course.title,
            "slug": course.slug if hasattr(course, "slug") else "",
            "description": course.description,
            "thumbnail_url": course.thumbnail_url,
            "level": course.level,
            "language": language_name,
            "is_published": course.is_published,
            "approval_status": approval,
            "status": derived_status,
            "total_enrollments": enrollment_count,
            "enrollment_count": enrollment_count,
            "completed_count": completed_count,
            "in_progress": enrollment_count - completed_count,
            "avg_rating": float(course.avg_rating) if course.avg_rating else 0,
            "average_rating": float(course.avg_rating) if course.avg_rating else 0,
            "price_usd": float(course.price_usd) if course.price_usd else 0,
            "created_at": course.created_at.isoformat() if course.created_at else None,
        })

    return {
        # Flat fields expected by the frontend dashboard component
        "total_courses": total_courses,
        "published_courses": published_courses,
        "pending_courses": pending_courses,
        "total_students": total_students,
        "total_enrollments": total_enrollments,
        "active_enrollments": active_enrollments,
        "total_earnings": total_earnings,
        "avg_rating": avg_rating,
        "recent_enrollments": recent_enrollments,
        "courses": courses_data,
        # Keep nested keys for backwards compatibility
        "profile": {
            "total_students": total_students,
            "total_courses": total_courses,
            "avg_rating": avg_rating,
            "total_earnings": total_earnings
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
    enrollment.completed_at = datetime.now(timezone.utc)
    
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

@router.get("/messages")
async def get_instructor_messages(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get instructor's conversations with students (alias for /conversations)"""
    return await get_conversations(page=page, limit=limit, db=db, current_user=current_user)


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
            msg.read_at = datetime.now(timezone.utc)
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
    # Allow messaging ANY student - bypass enrollment check for instructor flexibility
    courses = db.query(Course).filter(Course.instructor_id == instructor_id).all()
    course_ids = [c.id for c in courses]
    
    # Check enrollment but don't block - instructors can message any student
    enrollment = None
    if course_ids:
        enrollment = db.query(Enrollment).filter(
            Enrollment.user_id == message.student_id,
            Enrollment.course_id.in_(course_ids)
        ).first()
    
    # Removed enrollment requirement - instructors can message any student
    # if not enrollment and current_user.role != "admin":
    #     raise HTTPException(status_code=403, detail="Student not enrolled in your course")
    
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
    conversation.last_message_at = datetime.now(timezone.utc)
    
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

class AnnouncementCreate(BaseModel):
    title: str
    content: str
    course_id: int
    is_published: bool = True
    scheduled_for: Optional[str] = None
    target_type: Optional[str] = "course"  # course, students, all_students
    target_student_ids: Optional[List[int]] = None  # Specific student IDs for "students" target_type

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
    
    query = db.query(Announcement).filter(Announcement.target_course_id.in_(course_ids))
    
    if course_id:
        query = query.filter(Announcement.target_course_id == course_id)
    
    total = query.count()
    announcements = query.order_by(Announcement.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    results = []
    for a in announcements:
        course = db.query(Course).filter(Course.id == a.target_course_id).first()
        results.append({
            "id": a.id,
            "title": a.title,
            "content": a.content,
            "course_id": a.target_course_id,
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

@router.post("/announcements", status_code=status.HTTP_201_CREATED)
async def create_announcement(
    announcement_data: AnnouncementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Create an announcement for a course or specific students"""
    instructor_id = current_user.id
    
    # Verify course belongs to instructor
    course = db.query(Course).filter(Course.id == announcement_data.course_id, Course.instructor_id == instructor_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found or not authorized")
    
    from datetime import datetime
    scheduled = None
    if announcement_data.scheduled_for:
        scheduled = datetime.fromisoformat(announcement_data.scheduled_for.replace('Z', '+00:00'))
    
    # Determine target based on target_type
    target_role = "student"
    target_students = None
    
    if announcement_data.target_type == "all_students":
        # Get all students enrolled in instructor's courses
        enrollments = db.query(Enrollment).filter(Enrollment.course_id == announcement_data.course_id).all()
        target_students = [e.user_id for e in enrollments]
    elif announcement_data.target_type == "students" and announcement_data.target_student_ids:
        target_students = announcement_data.target_student_ids
    # Default is "course" - sends to all enrolled students
    
    announcement = Announcement(
        author_id=current_user.id,
        title=announcement_data.title,
        content=announcement_data.content,
        target_course_id=announcement_data.course_id,
        is_published=announcement_data.is_published,
        scheduled_for=scheduled,
        announcement_type="course",
        target_role=target_role
    )
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    
    # Create notifications for targeted students
    from ...models.notification import Notification
    if target_students:
        for student_id in target_students:
            notification = Notification(
                user_id=student_id,
                type="announcement",
                title=f"New announcement: {announcement_data.title}",
                body=announcement_data.content[:200],
                action_url=f"/courses/{announcement_data.course_id}",
                source_type="announcement",
                source_id=announcement.id
            )
            db.add(notification)
        db.commit()
    
    return {
        "message": "Announcement created",
        "announcement_id": announcement.id,
        "title": announcement.title,
        "recipients_count": len(target_students) if target_students else 0
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
    course = db.query(Course).filter(Course.id == announcement.target_course_id, Course.instructor_id == instructor_id).first()
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

# ==================== ASSIGNMENTS ====================

from ...models.assignment import Assignment, AssignmentSubmission
from pydantic import BaseModel as _BaseModel
from typing import Optional as _Optional

class InstructorSettingsResponse(BaseModel):
    email_notifications: bool = True
    sms_notifications: bool = False
    course_updates: bool = True
    student_messages: bool = True
    weekly_digest: bool = True
    marketing_emails: bool = False
    payout_method: Optional[str] = None
    bank_account_last4: Optional[str] = None
    paypal_email: Optional[str] = None
    mobile_money_number: Optional[str] = None

class InstructorSettingsUpdate(BaseModel):
    email_notifications: Optional[bool] = None
    sms_notifications: Optional[bool] = None
    course_updates: Optional[bool] = None
    student_messages: Optional[bool] = None
    weekly_digest: Optional[bool] = None
    marketing_emails: Optional[bool] = None
    payout_method: Optional[str] = None
    bank_account_last4: Optional[str] = None
    paypal_email: Optional[str] = None
    mobile_money_number: Optional[str] = None

class AssignmentCreatePayload(BaseModel):
    title: str
    assignment_type: str = "writing"
    prompt: str
    rubric: _Optional[str] = None
    due_date: _Optional[str] = None
    unit_id: _Optional[int] = None
    course_id: int

class GradeSubmission(_BaseModel):
    grade: float
    feedback: _Optional[str] = None

@router.get("/assignments")
async def get_assignments(
    course_id: _Optional[int] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get all assignments created by this instructor"""
    query = db.query(Assignment).filter(Assignment.instructor_id == current_user.id)
    if course_id:
        query = query.filter(Assignment.course_id == course_id)

    total = query.count()
    assignments = query.order_by(Assignment.created_at.desc()).offset((page - 1) * limit).limit(limit).all()

    results = []
    for a in assignments:
        course = db.query(Course).filter(Course.id == a.course_id).first()
        results.append({
            "id": a.id,
            "title": a.title,
            "assignment_type": a.assignment_type,
            "prompt": a.prompt,
            "rubric": a.rubric,
            "due_date": a.due_date.isoformat() if a.due_date else None,
            "course_id": a.course_id,
            "course_title": course.title if course else "Unknown",
            "unit_id": a.unit_id,
            "is_active": a.is_active,
            "created_at": a.created_at.isoformat() if a.created_at else None,
        })

    return {"assignments": results, "total": total, "page": page, "total_pages": (total + limit - 1) // limit}

@router.post("/assignments", status_code=status.HTTP_201_CREATED)
async def create_assignment(
    data: AssignmentCreatePayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Create an assignment for a course"""
    # Verify course belongs to instructor
    course = db.query(Course).filter(Course.id == data.course_id, Course.instructor_id == current_user.id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found or not authorized")

    due = None
    if data.due_date:
        due = datetime.fromisoformat(data.due_date.replace("Z", "+00:00"))

    assignment = Assignment(
        course_id=data.course_id,
        instructor_id=current_user.id,
        unit_id=data.unit_id,
        title=data.title,
        assignment_type=data.assignment_type,
        prompt=data.prompt,
        rubric=data.rubric,
        due_date=due,
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return {"message": "Assignment created", "assignment_id": assignment.id, "title": assignment.title}

@router.delete("/assignments/{assignment_id}")
async def delete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Delete an assignment"""
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    if assignment.instructor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(assignment)
    db.commit()
    return {"message": "Assignment deleted"}

@router.get("/assignments/{assignment_id}/submissions")
async def get_assignment_submissions(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get all student submissions for an assignment"""
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    if assignment.instructor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    submissions = db.query(AssignmentSubmission).filter(
        AssignmentSubmission.assignment_id == assignment_id
    ).order_by(AssignmentSubmission.submitted_at.desc()).all()

    results = []
    for sub in submissions:
        student = db.query(User).filter(User.id == sub.student_id).first()
        results.append({
            "id": sub.id,
            "student_name": student.full_name if student else "Unknown",
            "student_email": student.email if student else "Unknown",
            "content": sub.content,
            "audio_url": sub.audio_url,
            "submitted_at": sub.submitted_at.isoformat() if sub.submitted_at else None,
            "grade": float(sub.grade) if sub.grade is not None else None,
            "feedback": sub.feedback,
            "graded_at": sub.graded_at.isoformat() if sub.graded_at else None,
        })

    return {"submissions": results, "total": len(results)}

@router.post("/assignments/{assignment_id}/submissions/{submission_id}/grade")
async def grade_submission(
    assignment_id: int,
    submission_id: int,
    grade_data: GradeSubmission,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Grade a student submission"""
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    if assignment.instructor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if not (0 <= grade_data.grade <= 100):
        raise HTTPException(status_code=400, detail="Grade must be between 0 and 100")

    submission = db.query(AssignmentSubmission).filter(
        AssignmentSubmission.id == submission_id,
        AssignmentSubmission.assignment_id == assignment_id
    ).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    submission.grade = grade_data.grade
    submission.feedback = grade_data.feedback
    submission.graded_at = datetime.now(timezone.utc)
    submission.graded_by = current_user.id
    db.commit()

    # Notify student
    notification = Notification(
        user_id=submission.student_id,
        type="assignment_graded",
        title="Assignment Graded",
        body=f"Your submission for '{assignment.title}' has been graded: {grade_data.grade:.0f}/100",
        action_url=f"/courses/{assignment.course_id}",
        source_type="assignment",
        source_id=assignment_id
    )
    db.add(notification)
    db.commit()

    return {"message": "Submission graded successfully"}

# ==================== INSTRUCTOR SETTINGS ====================

class InstructorSettingsResponse(BaseModel):
    email_notifications: bool = True
    sms_notifications: bool = False
    course_updates: bool = True
    student_messages: bool = True
    weekly_digest: bool = True
    marketing_emails: bool = False
    payout_method: Optional[str] = None
    bank_account_last4: Optional[str] = None
    paypal_email: Optional[str] = None
    mobile_money_number: Optional[str] = None

class InstructorSettingsUpdate(BaseModel):
    email_notifications: Optional[bool] = None
    sms_notifications: Optional[bool] = None
    course_updates: Optional[bool] = None
    student_messages: Optional[bool] = None
    weekly_digest: Optional[bool] = None
    marketing_emails: Optional[bool] = None
    payout_method: Optional[str] = None
    bank_account_last4: Optional[str] = None
    paypal_email: Optional[str] = None
    mobile_money_number: Optional[str] = None

# In-memory store for instructor settings (in production, use database)
_instructor_settings = {}

@router.get("/settings", response_model=InstructorSettingsResponse)
async def get_instructor_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get instructor settings"""
    user_id = current_user.id
    if user_id not in _instructor_settings:
        _instructor_settings[user_id] = {
            "email_notifications": True,
            "sms_notifications": False,
            "course_updates": True,
            "student_messages": True,
            "weekly_digest": True,
            "marketing_emails": False,
            "payout_method": None,
            "bank_account_last4": None,
            "paypal_email": None,
            "mobile_money_number": None
        }
    return _instructor_settings[user_id]

@router.put("/settings", response_model=InstructorSettingsResponse)
async def update_instructor_settings(
    settings_data: InstructorSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Update instructor settings"""
    user_id = current_user.id
    if user_id not in _instructor_settings:
        _instructor_settings[user_id] = {
            "email_notifications": True,
            "sms_notifications": False,
            "course_updates": True,
            "student_messages": True,
            "weekly_digest": True,
            "marketing_emails": False,
            "payout_method": None,
            "bank_account_last4": None,
            "paypal_email": None,
            "mobile_money_number": None
        }
    
    settings = _instructor_settings[user_id]
    for key, value in settings_data.dict(exclude_unset=True).items():
        if value is not None:
            settings[key] = value
    
    _instructor_settings[user_id] = settings
    return settings


# ==================== NEW: MESSAGING TO ANY USER, BULK MESSAGING, AND MEETINGS ====================

from ...models.meeting import Meeting
from ...utils.email import send_message_notification_email, send_meeting_invitation_email, send_bulk_message_notification_email

# Pydantic schemas for new endpoints

class MessageToUserPayload(BaseModel):
    """Send message to any user on the platform"""
    recipient_id: int
    content: str
    message_type: str = "text"
    attachment_url: Optional[str] = None


class BulkMessagePayload(BaseModel):
    """Send bulk messages to groups"""
    target_group: str  # all_students, all_instructors, all_admins, all_students_enrolled
    content: str
    message_type: str = "text"
    attachment_url: Optional[str] = None


class MeetingCreatePayload(BaseModel):
    """Schedule a meeting"""
    title: str
    description: Optional[str] = None
    meeting_type: str  # individual, group, all_students, all_instructors, all_admins
    scheduled_at: str  # ISO format datetime
    duration_minutes: int = 60
    timezone: str = "UTC"
    meeting_link: Optional[str] = None
    meeting_platform: Optional[str] = None
    reason: Optional[str] = None
    invitee_ids: Optional[List[int]] = None  # For individual/group meetings


class MeetingResponsePayload(BaseModel):
    """Respond to a meeting invitation"""
    response: str  # accepted, declined
    response_note: Optional[str] = None


@router.get("/users")
async def get_all_users(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    role: Optional[str] = None,  # student, instructor, admin
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """
    Get list of all users on the platform (students, instructors, admins).
    Instructors can see all users to send messages or schedule meetings.
    """
    query = db.query(User).filter(User.is_banned == False)
    
    if role:
        query = query.filter(User.role == role)
    
    if search:
        query = query.filter(
            (User.full_name.ilike(f"%{search}%")) | 
            (User.email.ilike(f"%{search}%"))
        )
    
    total = query.count()
    users = query.order_by(User.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    results = []
    for user in users:
        # Get additional info based on role
        extra_info = {}
        
        if user.role == "instructor":
            profile = db.query(InstructorProfile).filter(InstructorProfile.user_id == user.id).first()
            if profile:
                extra_info = {
                    "total_courses": profile.total_courses,
                    "total_students": profile.total_students,
                    "headline": profile.headline
                }
        elif user.role == "student":
            # Get enrollment count
            enrollment_count = db.query(Enrollment).filter(Enrollment.user_id == user.id).count()
            extra_info = {"enrollment_count": enrollment_count}
        
        results.append({
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "avatar_url": user.avatar_url,
            "is_active": user.is_active,
            "is_email_verified": user.is_email_verified,
            "created_at": user.created_at.isoformat() if user.created_at else None,
            "last_active": user.last_active_at.isoformat() if user.last_active_at else None,
            **extra_info
        })
    
    return {
        "users": results,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit
    }


@router.post("/messages/to-user", status_code=status.HTTP_201_CREATED)
async def send_message_to_any_user(
    payload: MessageToUserPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """
    Send a message to ANY user on the platform (student, instructor, or admin).
    The recipient doesn't need to be enrolled in any of instructor's courses.
    """
    instructor_id = current_user.id
    
    # Verify recipient exists
    recipient = db.query(User).filter(User.id == payload.recipient_id).first()
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")
    
    # Can't message yourself
    if payload.recipient_id == instructor_id:
        raise HTTPException(status_code=400, detail="Cannot send message to yourself")
    
    # Get or create conversation
    # For cross-role messages, we use different conversation types
    if recipient.role == "student":
        # Use the existing conversation model for instructor-student
        conversation = db.query(Conversation).filter(
            Conversation.instructor_id == instructor_id,
            Conversation.student_id == payload.recipient_id,
            Conversation.is_group == False
        ).first()
        
        if not conversation:
            conversation = Conversation(
                instructor_id=instructor_id,
                student_id=payload.recipient_id
            )
            db.add(conversation)
            db.commit()
            db.refresh(conversation)
    else:
        # For instructor-to-instructor or instructor-to-admin, create a simple conversation
        # We'll create a generic conversation with the recipient
        conversation = db.query(Conversation).filter(
            Conversation.instructor_id == instructor_id,
            Conversation.student_id == payload.recipient_id,
            Conversation.is_group == False
        ).first()
        
        if not conversation:
            conversation = Conversation(
                instructor_id=instructor_id,
                student_id=payload.recipient_id
            )
            db.add(conversation)
            db.commit()
            db.refresh(conversation)
    
    # Extract mentions
    mentions = extract_mentions(payload.content, db)
    
    # Create message
    msg = Message(
        conversation_id=conversation.id,
        sender_id=instructor_id,
        content=payload.content,
        message_type=payload.message_type,
        attachment_url=payload.attachment_url,
        mentions=mentions
    )
    db.add(msg)
    
    # Update conversation
    conversation.last_message_preview = payload.content[:100]
    conversation.last_message_at = datetime.now(timezone.utc)
    
    # Create in-app notification
    notification = Notification(
        user_id=payload.recipient_id,
        type="message",
        title=f"New message from {current_user.full_name}",
        body=payload.content[:100],
        action_url=f"/messages/{conversation.id}",
        source_type="conversation",
        source_id=conversation.id
    )
    db.add(notification)
    
    db.commit()
    db.refresh(msg)
    
    # Send email notification (async - won't block response)
    try:
        import asyncio
        loop = asyncio.get_event_loop()
        loop.run_until_complete(
            send_message_notification_email(
                to_email=recipient.email,
                recipient_name=recipient.full_name,
                sender_name=current_user.full_name,
                message_preview=payload.content
            )
        )
    except Exception as e:
        print(f"Failed to send email notification: {e}")
    
    return {
        "message": "Message sent successfully",
        "message_id": msg.id,
        "conversation_id": conversation.id,
        "recipient": {
            "id": recipient.id,
            "name": recipient.full_name,
            "role": recipient.role
        }
    }


@router.post("/messages/bulk", status_code=status.HTTP_201_CREATED)
async def send_bulk_message(
    payload: BulkMessagePayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """
    Send bulk messages to groups:
    - all_students: All students on the platform
    - all_instructors: All instructors on the platform
    - all_admins: All admins on the platform
    - all_students_enrolled: All students enrolled in instructor's courses
    """
    instructor_id = current_user.id
    
    # Determine target users based on group
    target_user_ids = []
    group_name = ""
    
    if payload.target_group == "all_students":
        students = db.query(User).filter(User.role == "student", User.is_banned == False).all()
        target_user_ids = [s.id for s in students]
        group_name = "All Students"
    
    elif payload.target_group == "all_instructors":
        instructors = db.query(User).filter(User.role == "instructor", User.is_banned == False).all()
        target_user_ids = [i.id for i in instructors if i.id != instructor_id]  # Exclude self
        group_name = "All Instructors"
    
    elif payload.target_group == "all_admins":
        admins = db.query(User).filter(User.role.in_(["admin", "super_admin"]), User.is_banned == False).all()
        target_user_ids = [a.id for a in admins]
        group_name = "All Admins"
    
    elif payload.target_group == "all_students_enrolled":
        # Get students enrolled in instructor's courses
        courses = db.query(Course).filter(Course.instructor_id == instructor_id).all()
        course_ids = [c.id for c in courses]
        if course_ids:
            enrollments = db.query(Enrollment).filter(Enrollment.course_id.in_(course_ids)).all()
            target_user_ids = list(set([e.user_id for e in enrollments]))
        group_name = "My Students"
    
    else:
        raise HTTPException(status_code=400, detail="Invalid target group")
    
    if not target_user_ids:
        return {
            "message": "No recipients found",
            "recipients_count": 0
        }
    
    # Create a group conversation for bulk messages
    conversation = Conversation(
        instructor_id=instructor_id,
        student_id=0,  # Placeholder for group
        is_group=True,
        group_name=group_name
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    
    # Extract mentions
    mentions = extract_mentions(payload.content, db)
    
    # Create message
    msg = Message(
        conversation_id=conversation.id,
        sender_id=instructor_id,
        content=payload.content,
        message_type=payload.message_type,
        attachment_url=payload.attachment_url,
        mentions=mentions
    )
    db.add(msg)
    
    # Update conversation
    conversation.last_message_preview = payload.content[:100]
    conversation.last_message_at = datetime.now(timezone.utc)
    
    # Create notifications and send emails
    notifications_created = 0
    for user_id in target_user_ids:
        # Create in-app notification
        notification = Notification(
            user_id=user_id,
            type="group_message",
            title=f"New message from {current_user.full_name} - {group_name}",
            body=payload.content[:100],
            action_url=f"/messages/{conversation.id}",
            source_type="conversation",
            source_id=conversation.id
        )
        db.add(notification)
        notifications_created += 1
    
    db.commit()
    
    # Send email notifications in background
    try:
        import asyncio
        loop = asyncio.get_event_loop()
        for recipient in recipients[:10]:  # Limit emails
            try:
                loop.run_until_complete(
                    send_bulk_message_notification_email(
                        to_email=recipient.email,
                        recipient_name=recipient.full_name,
                        sender_name=current_user.full_name,
                        group_name=group_name,
                        message_preview=payload.content
                    )
                )
            except Exception as email_err:
                print(f"Failed to send bulk email: {email_err}")
    except Exception as e:
        print(f"Failed to send bulk email notifications: {e}")
    
    return {
        "message": f"Bulk message sent to {len(target_user_ids)} users",
        "recipients_count": len(target_user_ids),
        "group_name": group_name,
        "message_id": msg.id,
        "conversation_id": conversation.id
    }


@router.get("/meetings")
async def get_meetings(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,  # scheduled, confirmed, declined, cancelled, completed
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get meetings scheduled by this instructor"""
    query = db.query(Meeting).filter(Meeting.organizer_id == current_user.id)
    
    if status:
        query = query.filter(Meeting.status == status)
    
    total = query.count()
    meetings = query.order_by(Meeting.scheduled_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    results = []
    for meeting in meetings:
        # Get invitee details if any
        invitee_details = []
        if meeting.invitee_ids:
            invitees = db.query(User).filter(User.id.in_(meeting.invitee_ids)).all()
            invitee_details = [{"id": i.id, "name": i.full_name, "email": i.email} for i in invitees]
        
        results.append({
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
            "invitee_count": meeting.invitee_count,
            "invitees": invitee_details,
            "group_name": meeting.group_name,
            "reason": meeting.reason,
            "created_at": meeting.created_at.isoformat() if meeting.created_at else None
        })
    
    return {
        "meetings": results,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit
    }


@router.post("/meetings", status_code=status.HTTP_201_CREATED)
async def create_meeting(
    payload: MeetingCreatePayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """
    Schedule a meeting with users.
    
    meeting_type options:
    - individual: Schedule with specific user(s) - provide invitee_ids
    - group: Schedule with a specific group - provide invitee_ids
    - all_students: Schedule with all students on platform
    - all_instructors: Schedule with all instructors
    - all_admins: Schedule with all admins
    """
    instructor_id = current_user.id
    
    # Parse scheduled time
    try:
        scheduled_at = datetime.fromisoformat(payload.scheduled_at.replace("Z", "+00:00"))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid datetime format. Use ISO format.")
    
    # Verify scheduled time is in the future
    # Handle both naive and timezone-aware datetimes
    now = datetime.now(timezone.utc)
    if scheduled_at.tzinfo is None:
        scheduled_at = scheduled_at.replace(tzinfo=timezone.utc)
    if scheduled_at <= now:
        raise HTTPException(status_code=400, detail="Meeting must be scheduled in the future")
    
    # Determine invitees based on meeting type
    invitee_ids = []
    group_name = ""
    
    if payload.meeting_type == "individual" or payload.meeting_type == "group":
        if not payload.invitee_ids:
            raise HTTPException(status_code=400, detail="invitee_ids required for individual/group meetings")
        # Verify all invitees exist
        invitees = db.query(User).filter(User.id.in_(payload.invitee_ids)).all()
        if len(invitees) != len(payload.invitee_ids):
            raise HTTPException(status_code=404, detail="One or more invitees not found")
        invitee_ids = payload.invitee_ids
        group_name = f"Meeting with {current_user.full_name}"
    
    elif payload.meeting_type == "all_students":
        students = db.query(User).filter(User.role == "student", User.is_banned == False).all()
        invitee_ids = [s.id for s in students]
        group_name = "All Students"
    
    elif payload.meeting_type == "all_instructors":
        instructors = db.query(User).filter(User.role == "instructor", User.is_banned == False).all()
        invitee_ids = [i.id for i in instructors if i.id != instructor_id]
        group_name = "All Instructors"
    
    elif payload.meeting_type == "all_admins":
        admins = db.query(User).filter(User.role.in_(["admin", "super_admin"]), User.is_banned == False).all()
        invitee_ids = [a.id for a in admins]
        group_name = "All Admins"
    
    else:
        raise HTTPException(status_code=400, detail="Invalid meeting type")
    
    # Create meeting
    meeting = Meeting(
        organizer_id=instructor_id,
        title=payload.title,
        description=payload.description,
        meeting_type=payload.meeting_type,
        scheduled_at=scheduled_at,
        duration_minutes=payload.duration_minutes,
        timezone=payload.timezone,
        meeting_link=payload.meeting_link,
        meeting_platform=payload.meeting_platform,
        reason=payload.reason,
        status="scheduled",
        invitee_ids=invitee_ids,
        invitee_count=len(invitee_ids),
        group_name=group_name
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    
    # Create notifications and send emails for each invitee
    scheduled_at_str = scheduled_at.strftime("%Y-%m-%d at %H:%M %Z")
    
    for invitee_id in invitee_ids:
        invitee = db.query(User).filter(User.id == invitee_id).first()
        if not invitee:
            continue
        
        # Create in-app notification
        notification = Notification(
            user_id=invitee_id,
            type="meeting_invitation",
            title=f"Meeting Invitation: {payload.title}",
            body=f"{current_user.full_name} scheduled a meeting with you on {scheduled_at_str}",
            action_url=f"/meetings/{meeting.id}",
            source_type="meeting",
            source_id=meeting.id
        )
        db.add(notification)
    
    db.commit()
    
    # Send email notifications
    try:
        import asyncio
        loop = asyncio.get_event_loop()
        for invitee_id in invitee_ids[:10]:  # Limit emails
            invitee = db.query(User).filter(User.id == invitee_id).first()
            if not invitee:
                continue
            
            try:
                loop.run_until_complete(
                    send_meeting_invitation_email(
                        to_email=invitee.email,
                        recipient_name=invitee.full_name,
                        organizer_name=current_user.full_name,
                        meeting_title=payload.title,
                        meeting_description=payload.description or "",
                        scheduled_at=scheduled_at_str,
                        duration_minutes=payload.duration_minutes,
                        reason=payload.reason or "",
                        meeting_link=payload.meeting_link or ""
                    )
                )
            except Exception as email_err:
                print(f"Failed to send meeting email: {email_err}")
    except Exception as e:
        print(f"Failed to send meeting email notifications: {e}")
    
    return {
        "message": "Meeting scheduled successfully",
        "meeting_id": meeting.id,
        "title": meeting.title,
        "scheduled_at": meeting.scheduled_at.isoformat(),
        "invitee_count": meeting.invitee_count,
        "status": meeting.status
    }


@router.delete("/meetings/{meeting_id}")
async def cancel_meeting(
    meeting_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Cancel a meeting"""
    meeting = db.query(Meeting).filter(
        Meeting.id == meeting_id,
        Meeting.organizer_id == current_user.id
    ).first()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    if meeting.status == "cancelled":
        raise HTTPException(status_code=400, detail="Meeting already cancelled")
    
    if meeting.status == "completed":
        raise HTTPException(status_code=400, detail="Cannot cancel completed meeting")
    
    meeting.status = "cancelled"
    
    # Notify invitees
    if meeting.invitee_ids:
        for invitee_id in meeting.invitee_ids:
            notification = Notification(
                user_id=invitee_id,
                type="meeting_cancelled",
                title=f"Meeting Cancelled: {meeting.title}",
                body=f"The meeting scheduled by {current_user.full_name} has been cancelled",
                action_url=f"/meetings/{meeting.id}",
                source_type="meeting",
                source_id=meeting.id
            )
            db.add(notification)
    
    db.commit()
    
    return {"message": "Meeting cancelled successfully"}


class MeetingUpdatePayload(BaseModel):
    """Update a meeting"""
    title: Optional[str] = None
    description: Optional[str] = None
    meeting_type: Optional[str] = None
    scheduled_at: Optional[str] = None
    duration_minutes: Optional[int] = None
    timezone: Optional[str] = None
    meeting_link: Optional[str] = None
    meeting_platform: Optional[str] = None
    reason: Optional[str] = None
    invitee_ids: Optional[List[int]] = None


@router.patch("/meetings/{meeting_id}")
async def update_meeting(
    meeting_id: int,
    payload: MeetingUpdatePayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Update a meeting"""
    meeting = db.query(Meeting).filter(
        Meeting.id == meeting_id,
        Meeting.organizer_id == current_user.id
    ).first()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    if meeting.status == "cancelled":
        raise HTTPException(status_code=400, detail="Cannot update cancelled meeting")
    
    if meeting.status == "completed":
        raise HTTPException(status_code=400, detail="Cannot update completed meeting")
    
    # Update fields if provided
    if payload.title is not None:
        meeting.title = payload.title
    if payload.description is not None:
        meeting.description = payload.description
    if payload.meeting_type is not None:
        meeting.meeting_type = payload.meeting_type
    if payload.scheduled_at is not None:
        try:
            scheduled_at = datetime.fromisoformat(payload.scheduled_at.replace("Z", "+00:00"))
            if scheduled_at.tzinfo is None:
                scheduled_at = scheduled_at.replace(tzinfo=timezone.utc)
            # Check if meeting is in the future
            now = datetime.now(timezone.utc)
            if scheduled_at <= now:
                raise HTTPException(status_code=400, detail="Meeting must be scheduled in the future")
            meeting.scheduled_at = scheduled_at
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid datetime format. Use ISO format.")
    if payload.duration_minutes is not None:
        meeting.duration_minutes = payload.duration_minutes
    if payload.timezone is not None:
        meeting.timezone = payload.timezone
    if payload.meeting_link is not None:
        meeting.meeting_link = payload.meeting_link
    if payload.meeting_platform is not None:
        meeting.meeting_platform = payload.meeting_platform
    if payload.reason is not None:
        meeting.reason = payload.reason
    
    # Handle invitee updates
    if payload.invitee_ids is not None and payload.meeting_type in ["individual", "group"]:
        # Verify all invitees exist
        invitees = db.query(User).filter(User.id.in_(payload.invitee_ids)).all()
        if len(invitees) != len(payload.invitee_ids):
            raise HTTPException(status_code=404, detail="One or more invitees not found")
        meeting.invitee_ids = payload.invitee_ids
        meeting.invitee_count = len(payload.invitee_ids)
    
    db.commit()
    db.refresh(meeting)
    
    return {
        "message": "Meeting updated successfully",
        "meeting_id": meeting.id
    }

# ==================== INSTRUCTOR APPLICATION ====================

class ApplicationSubmit(BaseModel):
    bio: str
    expertise: list


@router.get("/application/status")
async def get_application_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get instructor application status for current user"""
    from ...models.extras import InstructorApplication
    if current_user.role == "instructor":
        return {"status": "approved", "bio": None, "expertise": []}
    app = db.query(InstructorApplication).filter(
        InstructorApplication.user_id == current_user.id
    ).first()
    if not app:
        return {"status": "no_application"}
    return {
        "status": app.status,
        "bio": app.bio,
        "expertise": app.expertise_tags or [],
        "applied_at": app.applied_at.isoformat() if app.applied_at else None,
        "rejection_reason": app.rejection_reason,
    }


@router.post("/apply")
async def submit_instructor_application(
    body: ApplicationSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit an instructor application"""
    from ...models.extras import InstructorApplication
    if current_user.role == "instructor":
        return {"message": "Already an instructor", "status": "approved"}
    existing = db.query(InstructorApplication).filter(
        InstructorApplication.user_id == current_user.id
    ).first()
    if existing:
        if existing.status == "pending":
            raise HTTPException(status_code=400, detail="Application already pending")
        existing.bio = body.bio
        existing.expertise_tags = body.expertise
        existing.status = "pending"
        existing.rejection_reason = None
        existing.applied_at = datetime.utcnow()
        db.commit()
        db.refresh(existing)
        return {"message": "Application resubmitted", "status": "pending"}
    application = InstructorApplication(
        user_id=current_user.id,
        bio=body.bio,
        expertise_tags=body.expertise,
        status="pending"
    )
    db.add(application)
    db.commit()
    return {"message": "Application submitted", "status": "pending"}


# ==================== NEW: INSTRUCTOR DASHBOARD API ENDPOINTS ====================

class DashboardStatsResponse(BaseModel):
    total_students: int
    total_students_delta: float
    mtd_revenue: float
    mtd_revenue_delta: float
    avg_rating: float
    avg_rating_delta: float
    completion_rate: float
    completion_rate_delta: float


class RevenueMonthlyItem(BaseModel):
    month: int
    gross: float
    net: float


class SessionItem(BaseModel):
    id: int
    title: str
    language: str
    start_time: str
    enrolled_count: int
    status: str
    day_label: str


class NotificationItem(BaseModel):
    id: int
    type: str
    message: str
    read: bool
    created_at: str


class CourseWithStats(BaseModel):
    id: int
    title: str
    language_flag: str
    level: str
    lesson_count: int
    status: str
    student_count: int
    completion_rate: float
    avg_rating: float
    revenue_mtd: float


class PulseHeatmapItem(BaseModel):
    student_id: int
    student_name: str
    pulse_state: str


class LeaderboardItem(BaseModel):
    rank: int
    user_id: int
    name: str
    course_title: str
    xp_total: int


class EarningsSummary(BaseModel):
    mtd_gross: float
    mtd_net: float
    pending_payout: float
    all_time_net: float
    platform_fee_rate: float
    by_course: list


@router.get("/dashboard/stats", response_model=DashboardStatsResponse)
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get instructor dashboard stat cards data"""
    instructor_id = current_user.id
    
    # Get instructor profile
    profile = db.query(InstructorProfile).filter(
        InstructorProfile.user_id == instructor_id
    ).first()
    
    if not profile:
        profile = InstructorProfile(
            user_id=instructor_id,
            total_students=0,
            total_courses=0,
            total_earnings_usd=0,
            avg_rating=0
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    # Get instructor courses
    courses = db.query(Course).filter(Course.instructor_id == instructor_id).all()
    course_ids = [c.id for c in courses]
    
    # Total students enrolled
    total_students = 0
    total_students_delta = 0.0  # Placeholder for % change
    if course_ids:
        from sqlalchemy import func
        student_count_query = db.query(Enrollment.user_id).filter(
            Enrollment.course_id.in_(course_ids)
        ).distinct()
        total_students = student_count_query.count()
        # Calculate delta (mock for now - would need historical data)
        total_students_delta = 12.5  # Mock 12.5% increase
    
    # MTD Revenue (gross)
    mtd_revenue = float(profile.total_earnings_usd or 0)
    mtd_revenue_delta = 8.3  # Mock 8.3% increase
    
    # Average rating
    avg_rating = float(profile.avg_rating or 0)
    avg_rating_delta = 0.2  # Mock +0.2 rating change
    
    # Completion rate
    completion_rate = 0.0
    completion_rate_delta = 0.0
    if course_ids:
        completed_query = db.query(Enrollment).filter(
            Enrollment.course_id.in_(course_ids),
            Enrollment.completion_pct == 100
        )
        completed_count = completed_query.count()
        total_enrollments = db.query(Enrollment).filter(
            Enrollment.course_id.in_(course_ids)
        ).count()
        if total_enrollments > 0:
            completion_rate = (completed_count / total_enrollments) * 100
            completion_rate_delta = 5.2  # Mock +5.2%
    
    return {
        "total_students": total_students,
        "total_students_delta": total_students_delta,
        "mtd_revenue": mtd_revenue,
        "mtd_revenue_delta": mtd_revenue_delta,
        "avg_rating": round(avg_rating, 1),
        "avg_rating_delta": avg_rating_delta,
        "completion_rate": round(completion_rate, 1),
        "completion_rate_delta": completion_rate_delta
    }


@router.get("/revenue/monthly", response_model=List[RevenueMonthlyItem])
async def get_revenue_monthly(
    year: int = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get monthly revenue data for the year"""
    if year is None:
        year = datetime.now().year
    
    instructor_id = current_user.id
    
    # Get instructor courses
    courses = db.query(Course).filter(Course.instructor_id == instructor_id).all()
    course_ids = [c.id for c in courses]
    
    # Get earnings for the year
    earnings = db.query(InstructorEarning).filter(
        InstructorEarning.instructor_id == instructor_id
    ).all()
    
    # Group by month
    monthly_data = {m: {"gross": 0.0, "net": 0.0} for m in range(1, 13)}
    
    for earning in earnings:
        if earning.created_at and earning.created_at.year == year:
            month = earning.created_at.month
            monthly_data[month]["gross"] += float(earning.gross_amount or 0)
            monthly_data[month]["net"] += float(earning.net_amount or 0)
    
    # Convert to list format
    result = []
    for month in range(1, 13):
        result.append({
            "month": month,
            "gross": round(monthly_data[month]["gross"], 2),
            "net": round(monthly_data[month]["net"], 2)
        })
    
    return result


@router.get("/sessions", response_model=List[SessionItem])
async def get_instructor_sessions(
    upcoming: bool = Query(default=True),
    limit: int = Query(default=5, le=20),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get instructor's upcoming/live sessions"""
    from ...models.live_session import LiveSession
    
    instructor_id = current_user.id
    
    query = db.query(LiveSession).filter(LiveSession.instructor_id == instructor_id)
    
    if upcoming:
        query = query.filter(LiveSession.scheduled_at >= datetime.now(timezone.utc))
    
    sessions = query.order_by(LiveSession.scheduled_at.asc()).limit(limit).all()
    
    results = []
    now = datetime.now(timezone.utc)
    
    for session in sessions:
        # Determine status
        if session.status == "live":
            status = "live"
            day_label = "LIVE"
        else:
            # Calculate day label
            if session.scheduled_at:
                days_diff = (session.scheduled_at.date() - now.date()).days
                if days_diff == 0:
                    day_label = "Today"
                elif days_diff == 1:
                    day_label = "Tomorrow"
                else:
                    day_label = session.scheduled_at.strftime("%a")
            else:
                day_label = "TBD"
            status = "scheduled"
        
        # Get enrolled count
        enrolled_count = session.enrolled_count or 0
        
        # Get language
        language = session.language or "English"
        
        results.append({
            "id": session.id,
            "title": session.title,
            "language": language,
            "start_time": session.scheduled_at.isoformat() if session.scheduled_at else None,
            "enrolled_count": enrolled_count,
            "status": status,
            "day_label": day_label
        })
    
    return results


@router.get("/notifications", response_model=List[NotificationItem])
async def get_instructor_notifications(
    limit: int = Query(default=10, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get instructor activity feed / notifications"""
    instructor_id = current_user.id
    
    # Get notifications for this instructor
    notifications = db.query(Notification).filter(
        Notification.user_id == instructor_id
    ).order_by(Notification.created_at.desc()).limit(limit).all()
    
    results = []
    for n in notifications:
        # Map notification type to activity feed format
        type_mapping = {
            "enrollment": "enroll",
            "review": "review",
            "pulse": "pulse-alert",
            "message": "message",
            "certificate": "approval"
        }
        
        results.append({
            "id": n.id,
            "type": type_mapping.get(n.type, n.type),
            "message": f"{n.title}: {n.body}",
            "read": n.is_read,
            "created_at": n.created_at.isoformat() if n.created_at else None
        })
    
    return results


@router.post("/notifications/read-all")
async def mark_notifications_read_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Mark all notifications as read"""
    instructor_id = current_user.id
    
    db.query(Notification).filter(
        Notification.user_id == instructor_id,
        Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    
    return {"message": "All notifications marked as read"}


@router.get("/courses", response_model=List[CourseWithStats])
async def get_instructor_courses_with_stats(
    include_stats: bool = Query(default=True),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get instructor courses with stats (completion_rate, avg_rating, revenue)"""
    from sqlalchemy import func
    
    instructor_id = current_user.id
    
    courses = db.query(Course).filter(Course.instructor_id == instructor_id).all()
    
    results = []
    for course in courses:
        # Get enrollment count
        enrollment_count = db.query(Enrollment).filter(
            Enrollment.course_id == course.id
        ).count()
        
        # Get completion rate
        completed_count = db.query(Enrollment).filter(
            Enrollment.course_id == course.id,
            Enrollment.completion_pct == 100
        ).count()
        
        completion_rate = 0.0
        if enrollment_count > 0:
            completion_rate = (completed_count / enrollment_count) * 100
        
        # Get lesson count
        lesson_count = db.query(Lesson).filter(Lesson.course_id == course.id).count()
        
        # Get revenue MTD (sum of earnings for this course this month)
        earnings = db.query(InstructorEarning).filter(
            InstructorEarning.course_id == course.id,
            InstructorEarning.created_at >= datetime.now(timezone.utc).replace(day=1, hour=0, minute=0, second=0)
        ).all()
        revenue_mtd = sum(float(e.net_amount or 0) for e in earnings)
        
        # Determine status
        if course.is_published and course.approval_status == "approved":
            status = "Published"
        elif course.approval_status == "pending":
            status = "Pending"
        else:
            status = "Draft"
        
        # Get language flag
        language_flag = course.language_flag if hasattr(course, 'language_flag') and course.language_flag else "🌐"
        
        results.append({
            "id": course.id,
            "title": course.title,
            "language_flag": language_flag,
            "level": course.level or "Beginner",
            "lesson_count": lesson_count,
            "status": status,
            "student_count": enrollment_count,
            "completion_rate": round(completion_rate, 1),
            "avg_rating": float(course.avg_rating or 0),
            "revenue_mtd": round(revenue_mtd, 2)
        })
    
    return results


@router.get("/pulse/heatmap", response_model=List[PulseHeatmapItem])
async def get_pulse_heatmap(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get PULSE state for all students enrolled in instructor's courses"""
    from ...models.pulse_prediction import UserPulseScore
    
    instructor_id = current_user.id
    
    # Get instructor course IDs
    courses = db.query(Course).filter(Course.instructor_id == instructor_id).all()
    course_ids = [c.id for c in courses]
    
    if not course_ids:
        return []
    
    # Get all enrolled student IDs
    student_ids = db.query(Enrollment.user_id).filter(
        Enrollment.course_id.in_(course_ids)
    ).distinct().all()
    student_ids = [s[0] for s in student_ids]
    
    if not student_ids:
        return []
    
    # Get PULSE scores for these students
    pulse_scores = db.query(UserPulseScore).filter(
        UserPulseScore.user_id.in_(student_ids)
    ).all()
    
    results = []
    for ps in pulse_scores:
        user = db.query(User).filter(User.id == ps.user_id).first()
        if user:
            # Map pulse state
            state = "coasting"  # default
            if ps.predicted_state:
                state = ps.predicted_state.lower().replace(" ", "_")
            elif ps.risk_level:
                if ps.risk_level <= 0.2:
                    state = "thriving"
                elif ps.risk_level <= 0.4:
                    state = "coasting"
                elif ps.risk_level <= 0.6:
                    state = "struggling"
                elif ps.risk_level <= 0.8:
                    state = "burning_out"
                else:
                    state = "disengaged"
            
            results.append({
                "student_id": user.id,
                "student_name": user.full_name,
                "pulse_state": state
            })
    
    return results


@router.get("/students/leaderboard", response_model=List[LeaderboardItem])
async def get_students_leaderboard(
    limit: int = Query(default=5, le=20),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get top students by XP for instructor's courses"""
    from ...models.gamification import UserXP
    
    instructor_id = current_user.id
    
    # Get instructor course IDs
    courses = db.query(Course).filter(Course.instructor_id == instructor_id).all()
    course_ids = [c.id for c in courses]
    
    if not course_ids:
        return []
    
    # Get enrolled student IDs
    student_ids = db.query(Enrollment.user_id).filter(
        Enrollment.course_id.in_(course_ids)
    ).distinct().all()
    student_ids = [s[0] for s in student_ids]
    
    if not student_ids:
        return []
    
    # Get XP for these students
    xp_records = db.query(UserXP).filter(
        UserXP.user_id.in_(student_ids)
    ).order_by(UserXP.total_xp.desc()).limit(limit).all()
    
    results = []
    for rank, xp in enumerate(xp_records, 1):
        user = db.query(User).filter(User.id == xp.user_id).first()
        if user:
            # Get one of the courses they're enrolled in
            enrollment = db.query(Enrollment).filter(
                Enrollment.user_id == xp.user_id,
                Enrollment.course_id.in_(course_ids)
            ).first()
            
            course_title = "General"
            if enrollment:
                course = db.query(Course).filter(Course.id == enrollment.course_id).first()
                if course:
                    course_title = course.title
            
            results.append({
                "rank": rank,
                "user_id": user.id,
                "name": user.full_name,
                "course_title": course_title,
                "xp_total": xp.total_xp or 0
            })
    
    return results


@router.get("/earnings/summary", response_model=EarningsSummary)
async def get_earnings_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_instructor)
):
    """Get earnings summary: MTD, all-time, pending, by-course breakdown"""
    from sqlalchemy import func
    
    instructor_id = current_user.id
    
    # Get instructor profile
    profile = db.query(InstructorProfile).filter(
        InstructorProfile.user_id == instructor_id
    ).first()
    
    # MTD gross and net
    now = datetime.now(timezone.utc)
    mtd_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    mtd_earnings = db.query(InstructorEarning).filter(
        InstructorEarning.instructor_id == instructor_id,
        InstructorEarning.created_at >= mtd_start
    ).all()
    
    mtd_gross = sum(float(e.gross_amount or 0) for e in mtd_earnings)
    mtd_net = sum(float(e.net_amount or 0) for e in mtd_earnings)
    
    # Pending payout (earnings not yet paid)
    pending_earnings = db.query(InstructorEarning).filter(
        InstructorEarning.instructor_id == instructor_id,
        InstructorEarning.status == "pending"
    ).all()
    pending_payout = sum(float(e.net_amount or 0) for e in pending_earnings)
    
    # All-time net
    all_time_net = float(profile.total_earnings_usd or 0) if profile else 0
    
    # Platform fee rate (30%)
    platform_fee_rate = 30.0
    
    # By course breakdown
    courses = db.query(Course).filter(Course.instructor_id == instructor_id).all()
    by_course = []
    
    max_revenue = 0.0
    for course in courses:
        course_earnings = db.query(InstructorEarning).filter(
            InstructorEarning.course_id == course.id
        ).all()
        revenue = sum(float(e.net_amount or 0) for e in course_earnings)
        if revenue > max_revenue:
            max_revenue = revenue
        
        by_course.append({
            "course_id": course.id,
            "title": course.title,
            "revenue": round(revenue, 2),
            "percentage": 0.0  # Will calculate after
        })
    
    # Calculate percentages
    if max_revenue > 0:
        for item in by_course:
            item["percentage"] = round((item["revenue"] / max_revenue) * 100, 1)
    
    return {
        "mtd_gross": round(mtd_gross, 2),
        "mtd_net": round(mtd_net, 2),
        "pending_payout": round(pending_payout, 2),
        "all_time_net": round(all_time_net, 2),
        "platform_fee_rate": platform_fee_rate,
        "by_course": by_course
    }
