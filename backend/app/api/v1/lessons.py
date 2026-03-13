from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from ...database import get_db
from ...models.course import Course, CourseUnit, Lesson, LessonVocabulary, LessonTranscript, LessonTranscriptSegment
from ...models.progress import Enrollment
from ...models.user import User
from ...dependencies import get_current_user, get_current_active_user

router = APIRouter(prefix="/lessons", tags=["Lessons"])

# Pydantic models for request bodies
class LessonCreate(BaseModel):
    title: str
    description: Optional[str] = None
    video_url: Optional[str] = None
    video_duration_sec: int = 0
    order_index: int = 0
    is_free_preview: bool = False

@router.get("/{lesson_id}")
async def get_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get lesson details with transcript and vocabulary"""
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    # Get course and unit info
    course = db.query(Course).filter(Course.id == lesson.course_id).first()
    unit = db.query(CourseUnit).filter(CourseUnit.id == lesson.unit_id).first()
    
    # Check enrollment
    enrollment = None
    if current_user:
        enrollment = db.query(Enrollment).filter(
            Enrollment.user_id == current_user.id,
            Enrollment.course_id == lesson.course_id
        ).first()
    
    if not enrollment:
        # Check if it's a free preview
        if not lesson.is_free_preview:
            raise HTTPException(status_code=403, detail="Please enroll in the course to access this lesson")
    
    # Get vocabulary
    vocabulary = db.query(LessonVocabulary).filter(
        LessonVocabulary.lesson_id == lesson_id
    ).all()
    
    # Get transcript
    transcript = db.query(LessonTranscript).filter(
        LessonTranscript.lesson_id == lesson_id
    ).first()
    
    segments = []
    if transcript:
        segments = db.query(LessonTranscriptSegment).filter(
            LessonTranscriptSegment.lesson_id == lesson_id
        ).order_by(LessonTranscriptSegment.order_index).all()
    
    return {
        "lesson": {
            "id": lesson.id,
            "title": lesson.title,
            "description": lesson.description,
            "video_url": lesson.video_url,
            "video_duration_sec": lesson.video_duration_sec,
            "order_index": lesson.order_index,
            "is_free_preview": lesson.is_free_preview,
            "xp_reward": lesson.xp_reward,
            "course": {
                "id": course.id,
                "title": course.title
            } if course else None,
            "unit": {
                "id": unit.id,
                "title": unit.title
            } if unit else None
        },
        "vocabulary": [{
            "id": v.id,
            "word": v.word,
            "definition": v.definition,
            "translation": v.translation,
            "order_index": v.order_index
        } for v in vocabulary],
        "transcript": {
            "id": transcript.id,
            "title": transcript.title,
            "content": transcript.content
        } if transcript else None,
        "transcript_segments": [{
            "id": s.id,
            "text": s.text,
            "start_time_sec": s.start_time_sec,
            "end_time_sec": s.end_time_sec,
            "order_index": s.order_index
        } for s in segments]
    }

@router.get("/{lesson_id}/vocabulary")
async def get_lesson_vocabulary(
    lesson_id: int,
    db: Session = Depends(get_db)
):
    """Get vocabulary words from a lesson"""
    vocabulary = db.query(LessonVocabulary).filter(
        LessonVocabulary.lesson_id == lesson_id
    ).order_by(LessonVocabulary.order_index).all()
    
    return {"vocabulary": vocabulary}

@router.get("/{lesson_id}/transcript")
async def get_lesson_transcript(
    lesson_id: int,
    db: Session = Depends(get_db)
):
    """Get lesson transcript with timestamps"""
    transcript = db.query(LessonTranscript).filter(
        LessonTranscript.lesson_id == lesson_id
    ).first()
    
    if not transcript:
        raise HTTPException(status_code=404, detail="Transcript not found")
    
    segments = db.query(LessonTranscriptSegment).filter(
        LessonTranscriptSegment.lesson_id == lesson_id
    ).order_by(LessonTranscriptSegment.order_index).all()
    
    return {
        "transcript": transcript,
        "segments": segments
    }

# Units endpoints
@router.get("/units/{unit_id}")
async def get_unit(
    unit_id: int,
    db: Session = Depends(get_db)
):
    """Get unit with all lessons"""
    unit = db.query(CourseUnit).filter(CourseUnit.id == unit_id).first()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    
    lessons = db.query(Lesson).filter(
        Lesson.unit_id == unit_id
    ).order_by(Lesson.order_index).all()
    
    return {
        "unit": unit,
        "lessons": lessons
    }

@router.post("/units/{unit_id}/lessons")
async def create_lesson(
    unit_id: int,
    lesson_data: LessonCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a lesson in a unit (instructor only)"""
    unit = db.query(CourseUnit).filter(CourseUnit.id == unit_id).first()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    
    # Check ownership
    if unit.course.instructor_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    lesson = Lesson(
        unit_id=unit_id,
        course_id=unit.course_id,
        title=lesson_data.title,
        description=lesson_data.description,
        video_url=lesson_data.video_url,
        video_duration_sec=lesson_data.video_duration_sec,
        order_index=lesson_data.order_index,
        is_free_preview=lesson_data.is_free_preview
    )
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    
    return {"message": "Lesson created", "lesson_id": lesson.id}

class LessonUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    video_url: Optional[str] = None
    video_duration_sec: Optional[int] = None
    order_index: Optional[int] = None
    is_free_preview: Optional[bool] = None
    xp_reward: Optional[int] = None

@router.patch("/{lesson_id}")
async def update_lesson(
    lesson_id: int,
    lesson_data: LessonUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update a lesson (instructor only)"""
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    course = db.query(Course).filter(Course.id == lesson.course_id).first()
    if course.instructor_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Update fields
    update_dict = lesson_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        if value is not None:
            setattr(lesson, key, value)
    
    db.commit()
    db.refresh(lesson)
    
    return {"message": "Lesson updated", "lesson_id": lesson.id}

@router.delete("/{lesson_id}")
async def delete_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete a lesson (instructor only)"""
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    course = db.query(Course).filter(Course.id == lesson.course_id).first()
    if course.instructor_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db.delete(lesson)
    db.commit()
    
    return {"message": "Lesson deleted"}
