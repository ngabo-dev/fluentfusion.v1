from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from database import get_db
from auth import get_current_user, get_current_admin, get_current_instructor
from schemas import CourseOut, CourseCreate, CourseUpdate, CourseListResponse, LessonOut, LessonCreate
import models
from datetime import datetime

router = APIRouter(prefix="/courses", tags=["courses"])


def _course_out(c: models.Course) -> CourseOut:
    data = CourseOut.model_validate(c)
    if c.instructor:
        data.instructor_name = c.instructor.full_name
    return data


@router.get("", response_model=CourseListResponse)
def list_courses(
    status: str = None,
    instructor_id: int = None,
    language: str = None,
    search: str = None,
    page: int = 1,
    per_page: int = 20,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    q = db.query(models.Course).join(models.User, models.Course.instructor_id == models.User.id)

    # Instructors can only see their own courses
    if current_user.role == models.UserRole.instructor:
        q = q.filter(models.Course.instructor_id == current_user.id)
    elif instructor_id:
        q = q.filter(models.Course.instructor_id == instructor_id)

    if status:
        q = q.filter(models.Course.status == status)
    if language:
        q = q.filter(models.Course.language.ilike(f"%{language}%"))
    if search:
        q = q.filter(or_(
            models.Course.title.ilike(f"%{search}%"),
            models.Course.description.ilike(f"%{search}%")
        ))
    total = q.count()
    courses = q.order_by(models.Course.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()
    return CourseListResponse(items=[_course_out(c) for c in courses], total=total)


@router.get("/{course_id}", response_model=CourseOut)
def get_course(course_id: int, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    c = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not c:
        raise HTTPException(404, "Course not found")
    return _course_out(c)


@router.post("", response_model=CourseOut)
def create_course(
    payload: CourseCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_instructor)
):
    c = models.Course(
        **payload.model_dump(),
        instructor_id=current_user.id,
        status=models.CourseStatus.draft
    )
    db.add(c)
    db.commit()
    db.refresh(c)
    return _course_out(c)


@router.patch("/{course_id}", response_model=CourseOut)
def update_course(
    course_id: int, payload: CourseUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    c = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not c:
        raise HTTPException(404, "Course not found")
    if current_user.role == models.UserRole.instructor and c.instructor_id != current_user.id:
        raise HTTPException(403, "Not your course")

    old_status = c.status
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(c, field, value)

    # If approved, set published_at
    if payload.status == models.CourseStatus.active and old_status != models.CourseStatus.active:
        c.published_at = datetime.utcnow()

    if current_user.role == models.UserRole.admin:
        db.add(models.AuditLog(
            admin_id=current_user.id, action_type="COURSE",
            description=f"Admin {current_user.full_name} updated course '{c.title}' status to {payload.status}",
            target_id=c.id, target_type="course"
        ))

    db.commit()
    db.refresh(c)
    return _course_out(c)


@router.post("/{course_id}/submit")
def submit_for_review(course_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_instructor)):
    c = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not c:
        raise HTTPException(404, "Course not found")
    if c.instructor_id != current_user.id:
        raise HTTPException(403, "Not your course")
    c.status = models.CourseStatus.pending
    db.commit()
    return {"message": "Course submitted for review"}


@router.post("/{course_id}/approve")
def approve_course(course_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin)):
    c = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not c:
        raise HTTPException(404, "Course not found")
    c.status = models.CourseStatus.active
    c.published_at = datetime.utcnow()
    db.add(models.AuditLog(
        admin_id=current_user.id, action_type="COURSE",
        description=f"Admin {current_user.full_name} approved course '{c.title}'",
        target_id=c.id, target_type="course"
    ))
    db.commit()
    return {"message": "Course approved"}


@router.post("/{course_id}/reject")
def reject_course(course_id: int, reason: str = "", db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin)):
    c = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not c:
        raise HTTPException(404, "Course not found")
    c.status = models.CourseStatus.rejected
    c.rejection_reason = reason
    db.add(models.AuditLog(
        admin_id=current_user.id, action_type="COURSE",
        description=f"Admin {current_user.full_name} rejected course '{c.title}': {reason}",
        target_id=c.id, target_type="course"
    ))
    db.commit()
    return {"message": "Course rejected"}


# ── Lessons ────────────────────────────────────────────
@router.get("/{course_id}/lessons", response_model=list[LessonOut])
def get_lessons(course_id: int, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    return db.query(models.Lesson).filter(models.Lesson.course_id == course_id).order_by(models.Lesson.order_index).all()


@router.post("/{course_id}/lessons", response_model=LessonOut)
def add_lesson(
    course_id: int, payload: LessonCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_instructor)
):
    c = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not c or (current_user.role == models.UserRole.instructor and c.instructor_id != current_user.id):
        raise HTTPException(403, "Not authorized")
    lesson = models.Lesson(**payload.model_dump(), course_id=course_id)
    c.total_lessons += 1
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson


@router.delete("/{course_id}/lessons/{lesson_id}")
def delete_lesson(
    course_id: int, lesson_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_instructor)
):
    lesson = db.query(models.Lesson).filter(
        models.Lesson.id == lesson_id, models.Lesson.course_id == course_id
    ).first()
    if not lesson:
        raise HTTPException(404, "Lesson not found")
    db.delete(lesson)
    db.commit()
    return {"message": "Lesson deleted"}
