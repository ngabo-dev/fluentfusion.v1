from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ...database import get_db
from ...models.course import Lesson, CourseUnit, LessonVocabulary, LessonTranscript, LessonTranscriptSegment
from ...models.progress import Enrollment
from ...models.user import User
from ...dependencies import get_current_user, get_current_active_user

router = APIRouter(prefix="/lessons", tags=["Lessons"])

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
    
    # Check enrollment
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
        "lesson": lesson,
        "vocabulary": vocabulary,
        "transcript": transcript,
        "transcript_segments": segments
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
    title: str,
    description: Optional[str] = None,
    video_url: Optional[str] = None,
    video_duration_sec: int = 0,
    order_index: int = 0,
    is_free_preview: bool = False,
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
        title=title,
        description=description,
        video_url=video_url,
        video_duration_sec=video_duration_sec,
        order_index=order_index,
        is_free_preview=is_free_preview
    )
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    
    return {"message": "Lesson created", "lesson_id": lesson.id}
