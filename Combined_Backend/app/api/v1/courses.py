from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
import os
import uuid

from ...schemas.course import CourseCreate, CourseUpdate, CourseResponse
from ...schemas.progress import EnrollmentResponse
from ...database import get_db
from ...models.course import Course, CourseUnit, Lesson
from ...models.progress import Enrollment, LessonCompletion
from ...models.quiz import Quiz, QuizQuestion, QuizQuestionOption, QuizAttempt, QuizAnswer
from ...models.user import User
from ...models.language import Language
from ...dependencies import get_current_user, get_current_active_user

router = APIRouter(prefix="/courses", tags=["Courses"])

# Pydantic models for request bodies - must be defined before use
class UnitCreate(BaseModel):
    title: str
    description: Optional[str] = None
    order_index: int = 0

class QuizCreate(BaseModel):
    title: str
    description: Optional[str] = None
    unit_id: Optional[int] = None
    lesson_id: Optional[int] = None
    passing_score: int = 70
    order_index: int = 0

class QuizQuestionCreate(BaseModel):
    question_text: str
    question_type: str = "multiple_choice"
    options: List[dict] = []
    correct_answer: Optional[str] = None
    points: int = 10
    order_index: int = 0

class QuizSubmit(BaseModel):
    answers: List[dict]

class LessonCompleteRequest(BaseModel):
    time_spent: int = 0

@router.get("")
async def get_courses(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    language_id: Optional[int] = None,
    level: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
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
    
    # Transform courses to include relationship fields
    courses_data = []
    for course in courses:
        # Get language info
        language_name = ""
        language_flag = ""
        if course.language:
            language_name = course.language.name or ""
            language_flag = course.language.flag_emoji or ""
        
        # Get instructor info
        instructor_name = "Instructor"
        if course.instructor:
            instructor_name = course.instructor.full_name or "Instructor"
        
        # Check enrollment if user is authenticated
        is_enrolled = False
        if current_user:
            enrollment = db.query(Enrollment).filter(
                Enrollment.user_id == current_user.id,
                Enrollment.course_id == course.id
            ).first()
            is_enrolled = enrollment is not None
        
        courses_data.append({
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "thumbnail_url": course.thumbnail_url,
            "level": course.level or "beginner",
            "language_id": course.language_id,
            "language_name": language_name,
            "language_flag": language_flag,
            "instructor_name": instructor_name,
            "price_usd": float(course.price_usd) if course.price_usd else 0,
            "is_free": course.is_free,
            "is_published": course.is_published,
            "total_enrollments": course.total_enrollments or 0,
            "avg_rating": float(course.avg_rating) if course.avg_rating else 0,
            "review_count": course.rating_count or 0,
            "created_at": course.created_at.isoformat() if course.created_at else None,
            "is_enrolled": is_enrolled,
        })
    
    return {
        "courses": courses_data,
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
    
    # Serialize units
    units_data = []
    for unit in units:
        lessons = db.query(Lesson).filter(
            Lesson.unit_id == unit.id
        ).order_by(Lesson.order_index).all()
        
        units_data.append({
            "id": unit.id,
            "title": unit.title,
            "description": unit.description,
            "order_index": unit.order_index,
            "lessons": [{
                "id": l.id,
                "title": l.title,
                "description": l.description,
                "video_url": l.video_url,
                "video_duration_sec": l.video_duration_sec,
                "order_index": l.order_index,
                "is_free_preview": l.is_free_preview
            } for l in lessons]
        })
    
    # Get language and instructor info
    language = db.query(Language).filter(Language.id == course.language_id).first()
    instructor = db.query(User).filter(User.id == course.instructor_id).first()
    
    return {
        "course": {
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "thumbnail_url": course.thumbnail_url,
            "level": course.level,
            "price_usd": float(course.price_usd) if course.price_usd else 0,
            "is_free": course.is_free,
            "is_published": course.is_published,
            "language": {
                "id": language.id,
                "name": language.name,
                "flag_emoji": language.flag_emoji
            } if language else None,
            "instructor": {
                "id": instructor.id,
                "full_name": instructor.full_name,
                "avatar_url": instructor.avatar_url
            } if instructor else None
        },
        "units": units_data,
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
    request_data: LessonCompleteRequest,
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
        time_spent_sec=request_data.time_spent
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

@router.get("/enrolled")
async def get_enrolled_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user's enrolled courses with progress"""
    from ...models.progress import Enrollment
    
    enrollments = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id
    ).all()
    
    enrolled_courses = []
    for enrollment in enrollments:
        course = db.query(Course).filter(Course.id == enrollment.course_id).first()
        if course:
            # Safely get language info
            language_name = ""
            language_flag = ""
            if course.language:
                language_name = course.language.name or ""
                language_flag = course.language.flag_emoji or ""
            
            # Get unit counts
            units_count = course.units.count() if hasattr(course, 'units') else 0
            units_completed = (enrollment.completion_pct * units_count) // 100 if units_count > 0 else 0
            
            enrolled_courses.append({
                "id": course.id,
                "title": course.title,
                "language": language_name,
                "flag": language_flag,
                "progress": enrollment.completion_pct or 0,
                "units_completed": units_completed,
                "total_units": units_count,
                "last_lesson_id": enrollment.last_lesson_id
            })
    
    return enrolled_courses

@router.post("")
async def create_course(
    course_data: CourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new course (instructor only)"""
    import logging
    logger = logging.getLogger(__name__)
    
    logger.info(f"Creating course: {course_data.title} by user {current_user.id}")
    
    if current_user.role not in ["instructor", "admin"]:
        raise HTTPException(status_code=403, detail="Only instructors can create courses")
    
    # Check language exists - if not, use default (first available or create English)
    language = db.query(Language).filter(Language.id == course_data.language_id).first()
    if not language:
        # Try to find any language, or create a default one
        language = db.query(Language).first()
        if not language:
            # Create default English language
            language = Language(
                name="English",
                code="en",
                flag_emoji="🇬🇧"
            )
            db.add(language)
            db.commit()
            db.refresh(language)
        course_data.language_id = language.id
    
    # Create slug - make it unique
    base_slug = course_data.title.lower().replace(" ", "-")[:50]
    slug = base_slug
    counter = 1
    
    # Check if slug exists and make it unique
    while db.query(Course).filter(Course.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    try:
        course = Course(
            instructor_id=current_user.id,
            language_id=course_data.language_id,
            title=course_data.title,
            slug=slug,
            description=course_data.description or "",
            level=course_data.level or "beginner",
            goal=course_data.goal,
            price_usd=course_data.price_usd or 0,
            is_free=course_data.is_free or (course_data.price_usd == 0),
            thumbnail_url=course_data.thumbnail_url
        )
        db.add(course)
        db.commit()
        db.refresh(course)
        
        logger.info(f"Course created successfully: {course.id}")
        
        return {"message": "Course created", "course_id": course.id}
    except Exception as e:
        logger.error(f"Error creating course: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create course: {str(e)}")

# ==================== INSTRUCTOR: STUDENT MANAGEMENT ====================

@router.get("/instructor/{course_id}/students")
async def get_course_students(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all students enrolled in a specific course (instructor only)"""
    if current_user.role not in ["instructor", "admin"]:
        raise HTTPException(status_code=403, detail="Only instructors can view enrolled students")
    
    # Verify course belongs to instructor (or admin can view any)
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    if current_user.role == "instructor" and course.instructor_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only view students in your own courses")
    
    # Get all enrollments
    enrollments = db.query(Enrollment).filter(
        Enrollment.course_id == course_id
    ).all()
    
    students = []
    for enrollment in enrollments:
        student = db.query(User).filter(User.id == enrollment.user_id).first()
        if student:
            # Get completed lessons count
            completed_lessons = db.query(LessonCompletion).filter(
                LessonCompletion.enrollment_id == enrollment.id
            ).count()
            
            # Get total lessons
            total_lessons = db.query(Lesson).filter(
                Lesson.course_id == course_id
            ).count()
            
            students.append({
                "id": student.id,
                "email": student.email,
                "full_name": student.full_name,
                "avatar_url": student.avatar_url,
                "progress": enrollment.completion_pct or 0,
                "lessons_completed": completed_lessons,
                "total_lessons": total_lessons,
                "enrolled_at": enrollment.enrolled_at.isoformat() if enrollment.enrolled_at else None,
                "completed_at": enrollment.completed_at.isoformat() if enrollment.completed_at else None,
                "last_accessed": enrollment.last_accessed_at.isoformat() if enrollment.last_accessed_at else None
            })
    
    return {
        "course": {
            "id": course.id,
            "title": course.title
        },
        "students": students,
        "total_students": len(students)
    }

@router.get("/instructor/students")
async def get_all_my_students(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all students across all instructor's courses"""
    if current_user.role not in ["instructor", "admin"]:
        raise HTTPException(status_code=403, detail="Only instructors can view enrolled students")
    
    # Get all courses for this instructor
    if current_user.role == "instructor":
        courses = db.query(Course).filter(Course.instructor_id == current_user.id).all()
    else:
        # Admin can see all
        courses = db.query(Course).all()
    
    course_ids = [c.id for c in courses]
    
    # Get all enrollments for these courses
    enrollments = db.query(Enrollment).filter(
        Enrollment.course_id.in_(course_ids)
    ).all()
    
    # Group by student
    student_map = {}
    for enrollment in enrollments:
        student = db.query(User).filter(User.id == enrollment.user_id).first()
        course = db.query(Course).filter(Course.id == enrollment.course_id).first()
        
        if student and course:
            if student.id not in student_map:
                student_map[student.id] = {
                    "id": student.id,
                    "email": student.email,
                    "full_name": student.full_name,
                    "avatar_url": student.avatar_url,
                    "courses": []
                }
            
            # Get completed lessons
            completed_lessons = db.query(LessonCompletion).filter(
                LessonCompletion.enrollment_id == enrollment.id
            ).count()
            
            total_lessons = db.query(Lesson).filter(
                Lesson.course_id == course.id
            ).count()
            
            student_map[student.id]["courses"].append({
                "course_id": course.id,
                "course_title": course.title,
                "progress": enrollment.completion_pct or 0,
                "lessons_completed": completed_lessons,
                "total_lessons": total_lessons,
                "enrolled_at": enrollment.enrolled_at.isoformat() if enrollment.enrolled_at else None,
                "completed": enrollment.completed_at is not None
            })
    
    return {
        "students": list(student_map.values()),
        "total_students": len(student_map)
    }

@router.get("/instructor/dashboard")
async def get_instructor_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get instructor dashboard data"""
    if current_user.role not in ["instructor", "admin"]:
        raise HTTPException(status_code=403, detail="Only instructors can view dashboard")
    
    # Get instructor's courses
    if current_user.role == "instructor":
        courses = db.query(Course).filter(Course.instructor_id == current_user.id).all()
    else:
        courses = db.query(Course).all()
    
    course_ids = [c.id for c in courses]
    
    # Get enrollments count
    total_enrollments = db.query(Enrollment).filter(
        Enrollment.course_id.in_(course_ids)
    ).count() if course_ids else 0
    
    # Get unique students count
    unique_students = db.query(Enrollment.course_id).filter(
        Enrollment.course_id.in_(course_ids)
    ).distinct(Enrollment.user_id).count() if course_ids else 0
    
    # Get recent enrollments
    recent_enrollments = db.query(Enrollment).filter(
        Enrollment.course_id.in_(course_ids)
    ).order_by(Enrollment.enrolled_at.desc()).limit(10).all() if course_ids else []
    
    recent_enrollments_list = []
    for enrollment in recent_enrollments:
        student = db.query(User).filter(User.id == enrollment.user_id).first()
        course = db.query(Course).filter(Course.id == enrollment.course_id).first()
        if student and course:
            recent_enrollments_list.append({
                "student_id": student.id,
                "student_name": student.full_name,
                "student_email": student.email,
                "course_id": course.id,
                "course_title": course.title,
                "enrolled_at": enrollment.enrolled_at.isoformat() if enrollment.enrolled_at else None
            })
    
    # Course statistics
    courses_data = []
    for course in courses:
        enrollments_count = db.query(Enrollment).filter(
            Enrollment.course_id == course.id
        ).count()
        
        completed_count = db.query(Enrollment).filter(
            Enrollment.course_id == course.id,
            Enrollment.completed_at.isnot(None)
        ).count()
        
        courses_data.append({
            "id": course.id,
            "title": course.title,
            "total_enrollments": enrollments_count,
            "completed": completed_count,
            "in_progress": enrollments_count - completed_count,
            "is_published": course.is_published,
            "avg_rating": course.avg_rating
        })
    
    return {
        "total_courses": len(courses),
        "total_students": unique_students,
        "total_enrollments": total_enrollments,
        "recent_enrollments": recent_enrollments_list,
        "courses": courses_data
    }

# ==================== COURSE CONTENT MANAGEMENT ====================

@router.post("/{course_id}/units")
async def create_unit(
    course_id: int,
    unit_data: UnitCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a unit in a course (instructor only)"""
    if current_user.role not in ["instructor", "admin"]:
        raise HTTPException(status_code=403, detail="Only instructors can create units")
    
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    if course.instructor_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to modify this course")
    
    unit = CourseUnit(
        course_id=course_id,
        title=unit_data.title,
        description=unit_data.description,
        order_index=unit_data.order_index
    )
    db.add(unit)
    db.commit()
    db.refresh(unit)
    
    return {"message": "Unit created", "unit_id": unit.id}

@router.get("/{course_id}/units")
async def get_course_units(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all units and lessons for a course"""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    units = db.query(CourseUnit).filter(
        CourseUnit.course_id == course_id
    ).order_by(CourseUnit.order_index).all()
    
    units_data = []
    for unit in units:
        lessons = db.query(Lesson).filter(
            Lesson.unit_id == unit.id
        ).order_by(Lesson.order_index).all()
        
        quizzes = db.query(Quiz).filter(
            Quiz.unit_id == unit.id
        ).all()
        
        units_data.append({
            "id": unit.id,
            "title": unit.title,
            "description": unit.description,
            "order_index": unit.order_index,
            "lessons": lessons,
            "quizzes": quizzes
        })
    
    return {"units": units_data}

# ==================== QUIZ MANAGEMENT ====================

@router.post("/{course_id}/quizzes")
async def create_quiz(
    course_id: int,
    quiz_data: QuizCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a quiz for a course (instructor only)"""
    if current_user.role not in ["instructor", "admin"]:
        raise HTTPException(status_code=403, detail="Only instructors can create quizzes")
    
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    if course.instructor_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to modify this course")
    
    quiz = Quiz(
        course_id=course_id,
        unit_id=quiz_data.unit_id,
        lesson_id=quiz_data.lesson_id,
        title=quiz_data.title,
        description=quiz_data.description,
        passing_score=quiz_data.passing_score,
        order_index=quiz_data.order_index
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    
    return {"message": "Quiz created", "quiz_id": quiz.id}

@router.post("/quizzes/{quiz_id}/questions")
async def add_quiz_question(
    quiz_id: int,
    question_data: QuizQuestionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Add a question to a quiz (instructor only)"""
    if current_user.role not in ["instructor", "admin"]:
        raise HTTPException(status_code=403, detail="Only instructors can add questions")
    
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Verify ownership
    course = db.query(Course).filter(Course.id == quiz.course_id).first()
    if course.instructor_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    question = QuizQuestion(
        quiz_id=quiz_id,
        question_text=question_data.question_text,
        question_type=question_data.question_type,
        correct_answer=question_data.correct_answer,
        points=question_data.points,
        order_index=question_data.order_index
    )
    db.add(question)
    db.commit()
    db.refresh(question)
    
    # Add options if provided
    for opt in question_data.options:
        option = QuizQuestionOption(
            question_id=question.id,
            option_text=opt.get("text", ""),
            is_correct=opt.get("is_correct", False),
            order_index=opt.get("order", 0)
        )
        db.add(option)
    
    db.commit()
    
    return {"message": "Question added", "question_id": question.id}

@router.get("/quizzes/{quiz_id}")
async def get_quiz(
    quiz_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get quiz with questions"""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Get course for context
    course = db.query(Course).filter(Course.id == quiz.course_id).first()
    
    questions = db.query(QuizQuestion).filter(
        QuizQuestion.quiz_id == quiz_id
    ).order_by(QuizQuestion.order_index).all()
    
    questions_data = []
    for q in questions:
        options = db.query(QuizQuestionOption).filter(
            QuizQuestionOption.question_id == q.id
        ).order_by(QuizQuestionOption.order_index).all()
        
        questions_data.append({
            "id": q.id,
            "question_text": q.question_text,
            "question_type": q.question_type,
            "points": q.points,
            "order_index": q.order_index,
            "options": [{
                "id": opt.id,
                "text": opt.option_text,
                "is_correct": opt.is_correct,
                "order": opt.order_index
            } for opt in options]
        })
    
    return {
        "quiz": {
            "id": quiz.id,
            "title": quiz.title,
            "description": quiz.description,
            "course_id": quiz.course_id,
            "unit_id": quiz.unit_id,
            "lesson_id": quiz.lesson_id,
            "passing_score": quiz.passing_score,
            "time_limit": quiz.time_limit or 600,
            "course": {
                "id": course.id,
                "title": course.title
            } if course else None
        },
        "questions": questions_data
    }

@router.post("/quizzes/{quiz_id}/submit")
async def submit_quiz(
    quiz_id: int,
    submit_data: QuizSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Submit quiz answers and get score"""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Check enrollment
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == quiz.course_id
    ).first()
    
    if not enrollment:
        raise HTTPException(status_code=403, detail="Not enrolled in this course")
    
    # Create attempt
    attempt = QuizAttempt(
        quiz_id=quiz_id,
        user_id=current_user.id,
        enrollment_id=enrollment.id,
        score=0,
        passed=False
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    
    # Calculate score
    total_points = 0
    earned_points = 0
    
    for answer in submit_data.answers:
        question = db.query(QuizQuestion).filter(
            QuizQuestion.id == answer.get("question_id")
        ).first()
        
        if question:
            total_points += question.points
            
            # Check answer
            is_correct = False
            if question.question_type == "multiple_choice":
                selected_option = db.query(QuizQuestionOption).filter(
                    QuizQuestionOption.id == answer.get("selected_option_id")
                ).first()
                if selected_option and selected_option.is_correct:
                    is_correct = True
            elif question.question_type in ["true_false", "fill_blank"]:
                if answer.get("answer", "").lower() == question.correct_answer.lower():
                    is_correct = True
            
            if is_correct:
                earned_points += question.points
            
            # Record answer
            quiz_answer = QuizAnswer(
                attempt_id=attempt.id,
                question_id=question.id,
                selected_option_id=answer.get("selected_option_id"),
                answer_text=answer.get("answer"),
                is_correct=is_correct,
                points_earned=question.points if is_correct else 0
            )
            db.add(quiz_answer)
    
    # Update attempt
    attempt.score = int((earned_points / total_points * 100) if total_points > 0 else 0)
    attempt.passed = attempt.score >= quiz.passing_score
    db.commit()
    
    return {
        "message": "Quiz submitted",
        "score": attempt.score,
        "passed": attempt.passed,
        "passing_score": quiz.passing_score,
        "total_points": total_points,
        "earned_points": earned_points
    }

# ==================== COURSE UPDATE (for pricing/publishing) ====================

class CourseUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    price_usd: Optional[float] = None
    is_free: Optional[bool] = None
    is_published: Optional[bool] = None
    approval_status: Optional[str] = None

@router.patch("/{course_id}")
async def update_course(
    course_id: int,
    update_data: CourseUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update course details (instructor only) - used for pricing and publishing"""
    import logging
    logger = logging.getLogger(__name__)
    
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check authorization
    if current_user.role not in ["instructor", "admin"]:
        raise HTTPException(status_code=403, detail="Only instructors can update courses")
    
    if current_user.role == "instructor" and course.instructor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this course")
    
    # Update fields
    update_dict = update_data.model_dump(exclude_unset=True)
    
    # Handle price_usd and is_free relationship
    if 'price_usd' in update_dict and update_dict['price_usd'] is not None:
        course.price_usd = update_dict['price_usd']
        course.is_free = update_dict['price_usd'] == 0
        del update_dict['price_usd']
    
    if 'is_free' in update_dict and update_dict['is_free'] is not None:
        course.is_free = update_dict['is_free']
        if course.is_free:
            course.price_usd = 0
        del update_dict['is_free']
    
    # Apply remaining updates
    for key, value in update_dict.items():
        if value is not None:
            setattr(course, key, value)
    
    db.commit()
    db.refresh(course)
    
    logger.info(f"Course {course_id} updated by user {current_user.id}: {update_data.model_dump(exclude_unset=True)}")
    
    return {"message": "Course updated", "course_id": course.id, "is_published": course.is_published}

@router.delete("/{course_id}")
async def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete a course (instructor only)"""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    if current_user.role not in ["instructor", "admin"]:
        raise HTTPException(status_code=403, detail="Only instructors can delete courses")
    
    if current_user.role == "instructor" and course.instructor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this course")
    
    db.delete(course)
    db.commit()
    
    return {"message": "Course deleted"}

# ==================== VIDEO UPLOAD ====================

@router.post("/upload/video")
async def upload_video(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Upload a video file (instructor only)"""
    import logging
    logger = logging.getLogger(__name__)
    
    if current_user.role not in ["instructor", "admin"]:
        raise HTTPException(status_code=403, detail="Only instructors can upload videos")
    
    # Log the file info for debugging
    logger.info(f"Video upload attempt: filename={file.filename}, content_type={file.content_type}")
    
    # Validate file type - be more lenient with video types
    allowed_types = [
        "video/mp4", "video/mov", "video/webm", "video/avi",
        "video/x-msvideo", "video/quicktime", "video/x-matroska",
        "video/mpeg", "video/webm", "video/ogg"
    ]
    
    # Also check by extension if content_type doesn't match
    file_ext = ""
    if file.filename:
        file_ext = file.filename.split(".")[-1].lower() if "." in file.filename else ""
    
    allowed_extensions = ["mp4", "mov", "webm", "avi", "mkv", "mpeg", "mpg", "ogv"]
    
    content_type_valid = file.content_type in allowed_types if file.content_type else False
    extension_valid = file_ext in allowed_extensions if file_ext else False
    
    if not content_type_valid and not extension_valid:
        logger.warning(f"Invalid file type: {file.content_type}, extension: {file_ext}")
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type: {file.content_type or 'unknown'}. Allowed: MP4, MOV, WebM, AVI, MKV"
        )
    
    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}.{file_ext or 'mp4'}"
    
    # In production, upload to cloud storage (S3, Cloudinary, etc.)
    # For now, save locally
    upload_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads", "videos")
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.join(upload_dir, unique_filename)
    
    content = await file.read()
    # Limit to 2GB
    if len(content) > 2 * 1024 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Maximum 2GB allowed")
    
    logger.info(f"Saving video to: {file_path}, size: {len(content)} bytes")
    
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Return URL (in production, this would be a cloud URL)
    video_url = f"/uploads/videos/{unique_filename}"
    
    return {
        "message": "Video uploaded",
        "video_url": video_url,
        "filename": unique_filename
    }
