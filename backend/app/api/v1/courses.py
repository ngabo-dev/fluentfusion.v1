from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ...database import get_db
from ...models.course import Course, CourseUnit, Lesson
from ...models.progress import Enrollment, LessonCompletion
from ...models.quiz import Quiz, QuizAttempt
from ...models.user import User
from ...models.language import Language
from ...dependencies import get_current_user, get_current_active_user

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.get("")
async def get_courses(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    language_id: Optional[int] = None,
    level: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all published courses with optional filters"""
    query = db.query(Course).filter(Course.is_published == True)
    
    if language_id:
        query = query.filter(Course.language_id == language_id)
    if level:
        query = query.filter(Course.level == level)
    if search:
        query = query.filter(Course.title.ilike(f"%{search}%"))
    
    total = query.count()
    courses = query.offset((page - 1) * limit).limit(limit).all()
    
    return {
        "courses": courses,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }

@router.get("/featured")
async def get_featured_courses(
    limit: int = Query(6, ge=1, le=20),
    db: Session = Depends(get_db)
):
    """Get featured courses (highest rated)"""
    courses = db.query(Course).filter(
        Course.is_published == True,
        Course.approval_status == "approved"
    ).order_by(Course.avg_rating.desc()).limit(limit).all()
    
    return {"courses": courses}

@router.get("/{course_id}")
async def get_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get course details with units and lessons"""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check enrollment
    enrollment = None
    if current_user:
        enrollment = db.query(Enrollment).filter(
            Enrollment.user_id == current_user.id,
            Enrollment.course_id == course_id
        ).first()
    
    # Get units with lessons
    units = db.query(CourseUnit).filter(
        CourseUnit.course_id == course_id
    ).order_by(CourseUnit.order_index).all()
    
    return {
        "course": course,
        "units": units,
        "is_enrolled": enrollment is not None
    }

@router.post("/{course_id}/enroll")
async def enroll_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Enroll in a course"""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    if not course.is_published:
        raise HTTPException(status_code=400, detail="Course is not available")
    
    # Check if already enrolled
    existing = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == course_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled")
    
    # Create enrollment
    enrollment = Enrollment(
        user_id=current_user.id,
        course_id=course_id
    )
    db.add(enrollment)
    
    # Update course enrollment count
    course.total_enrollments += 1
    
    db.commit()
    db.refresh(enrollment)
    
    return {"message": "Enrolled successfully", "enrollment_id": enrollment.id}

@router.get("/{course_id}/progress")
async def get_course_progress(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user's progress in a course"""
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == course_id
    ).first()
    
    if not enrollment:
        raise HTTPException(status_code=404, detail="Not enrolled in this course")
    
    # Get completed lessons
    completed = db.query(LessonCompletion).filter(
        LessonCompletion.user_id == current_user.id,
        LessonCompletion.enrollment_id == enrollment.id
    ).all()
    
    completed_lesson_ids = [c.lesson_id for c in completed]
    
    # Get all lessons
    lessons = db.query(Lesson).filter(Lesson.course_id == course_id).all()
    
    return {
        "enrollment": enrollment,
        "completed_lessons": completed_lesson_ids,
        "total_lessons": len(lessons),
        "completion_pct": enrollment.completion_pct
    }

@router.post("/{course_id}/lessons/{lesson_id}/complete")
async def complete_lesson(
    course_id: int,
    lesson_id: int,
    time_spent: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Mark a lesson as completed"""
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == course_id
    ).first()
    
    if not enrollment:
        raise HTTPException(status_code=404, detail="Not enrolled in this course")
    
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson or lesson.course_id != course_id:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    # Check if already completed
    existing = db.query(LessonCompletion).filter(
        LessonCompletion.user_id == current_user.id,
        LessonCompletion.lesson_id == lesson_id,
        LessonCompletion.enrollment_id == enrollment.id
    ).first()
    
    if existing:
        return {"message": "Lesson already completed", "xp_earned": 0}
    
    # Create completion
    completion = LessonCompletion(
        user_id=current_user.id,
        lesson_id=lesson_id,
        enrollment_id=enrollment.id,
        time_spent_sec=time_spent
    )
    db.add(completion)
    
    # Update enrollment
    total_lessons = db.query(Lesson).filter(Lesson.course_id == course_id).count()
    completed_count = db.query(LessonCompletion).filter(
        LessonCompletion.enrollment_id == enrollment.id
    ).count() + 1
    
    enrollment.completion_pct = (completed_count * 100) // total_lessons
    enrollment.last_lesson_id = lesson_id
    enrollment.last_accessed_at = datetime.utcnow()
    
    if enrollment.completion_pct == 100:
        enrollment.completed_at = datetime.utcnow()
    
    db.commit()
    
    return {
        "message": "Lesson completed",
        "xp_earned": lesson.xp_reward or 50
    }

@router.get("/instructor/my-courses")
async def get_my_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get instructor's own courses"""
    if current_user.role not in ["instructor", "admin"]:
        raise HTTPException(status_code=403, detail="Only instructors can view their courses")
    
    courses = db.query(Course).filter(Course.instructor_id == current_user.id).all()
    return {"courses": courses}

@router.post("")
async def create_course(
    title: str,
    description: str,
    language_id: int,
    level: str,
    goal: Optional[str] = None,
    price_usd: float = 0.0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new course (instructor only)"""
    if current_user.role not in ["instructor", "admin"]:
        raise HTTPException(status_code=403, detail="Only instructors can create courses")
    
    # Check language exists
    language = db.query(Language).filter(Language.id == language_id).first()
    if not language:
        raise HTTPException(status_code=404, detail="Language not found")
    
    # Create slug
    slug = title.lower().replace(" ", "-")[:50]
    
    course = Course(
        instructor_id=current_user.id,
        language_id=language_id,
        title=title,
        slug=slug,
        description=description,
        level=level,
        goal=goal,
        price_usd=price_usd,
        is_free=price_usd == 0
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    
    return {"message": "Course created", "course_id": course.id}
