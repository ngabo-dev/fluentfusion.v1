"""
Lesson routes for FluentFusion API
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Lesson, Exercise, User
from app.auth import get_current_user, get_current_userOptional
from app.schemas import (
    LessonResponse,
    LessonListResponse,
    LessonContent,
    ExerciseResponse,
    ExerciseSubmit,
    ExerciseResult,
    VocabularyItem,
    PhraseItem,
)

router = APIRouter(prefix="/lessons", tags=["Lessons"])

@router.get("/", response_model=LessonListResponse)
async def get_lessons(
    category: Optional[str] = Query(None, description="Filter by category"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty"),
    language: Optional[str] = Query(None, description="Filter by target language"),
    search: Optional[str] = Query(None, description="Search in title and description"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_userOptional),
    db: Session = Depends(get_db)
):
    """
    Get list of lessons with optional filters
    
    - category: greetings, accommodation, food, transportation, shopping, emergency
    - difficulty: beginner, intermediate, advanced
    - language: kinyarwanda, english, french
    - search: Search term for title/description
    - skip: Pagination offset
    - limit: Number of results to return
    """
    query = db.query(Lesson)
    
    # Filter by target language
    if language:
        query = query.filter(Lesson.target_language == language)
    elif current_user:
        query = query.filter(Lesson.target_language == current_user.target_language)
    else:
        # Default to Kinyarwanda for tourists
        query = query.filter(Lesson.target_language == "kinyarwanda")
    
    # Filter by category
    if category:
        query = query.filter(Lesson.category == category)
    
    # Filter by difficulty
    if difficulty:
        query = query.filter(Lesson.difficulty == difficulty)
    
    # Search
    if search:
        query = query.filter(
            (Lesson.title.contains(search)) |
            (Lesson.description.contains(search))
        )
    
    total = query.count()
    lessons = query.offset(skip).limit(limit).all()
    
    return LessonListResponse(
        lessons=[LessonResponse.model_validate(lesson) for lesson in lessons],
        total=total
    )

@router.get("/categories")
async def get_categories(
    current_user: User = Depends(get_current_userOptional),
    db: Session = Depends(get_db)
):
    """
    Get all available categories
    """
    from sqlalchemy import func
    
    if current_user:
        language = current_user.target_language
    else:
        language = "kinyarwanda"
    
    categories = db.query(
        Lesson.category,
        func.count(Lesson.lesson_id).label('count')
    ).filter(
        Lesson.target_language == language
    ).group_by(Lesson.category).all()
    
    return [{"category": c[0], "count": c[1]} for c in categories]

@router.get("/{lesson_id}", response_model=LessonResponse)
async def get_lesson(
    lesson_id: str,
    include_content: bool = Query(True, description="Include lesson content"),
    current_user: User = Depends(get_current_userOptional),
    db: Session = Depends(get_db)
):
    """
    Get a single lesson by ID
    """
    lesson = db.query(Lesson).filter(Lesson.lesson_id == lesson_id).first()
    
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )
    
    response = LessonResponse.model_validate(lesson)
    
    if include_content and lesson.content:
        content_dict = lesson.content
        
        # Parse vocabulary
        if "vocabulary" in content_dict:
            response.content = LessonContent(
                vocabulary=[VocabularyItem(**v) for v in content_dict["vocabulary"]],
                phrases=[PhraseItem(**p) for p in content_dict.get("phrases", [])],
                cultural_notes=content_dict.get("cultural_notes", []),
                exercises=[]
            )
        
        # Parse exercises
        if include_content:
            exercises = db.query(Exercise).filter(
                Exercise.lesson_id == lesson_id
            ).all()
            response.content = LessonContent(
                vocabulary=[VocabularyItem(**v) for v in content_dict.get("vocabulary", [])],
                phrases=[PhraseItem(**p) for p in content_dict.get("phrases", [])],
                cultural_notes=content_dict.get("cultural_notes", []),
                exercises=[ExerciseResponse.model_validate(ex) for ex in exercises]
            )
    
    return response

@router.get("/{lesson_id}/exercises", response_model=List[ExerciseResponse])
async def get_lesson_exercises(
    lesson_id: str,
    current_user: User = Depends(get_current_userOptional),
    db: Session = Depends(get_db)
):
    """
    Get all exercises for a lesson
    """
    lesson = db.query(Lesson).filter(Lesson.lesson_id == lesson_id).first()
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )
    
    exercises = db.query(Exercise).filter(
        Exercise.lesson_id == lesson_id
    ).all()
    
    return [ExerciseResponse.model_validate(ex) for ex in exercises]

@router.post("/{lesson_id}/submit", response_model=List[ExerciseResult])
async def submit_exercise(
    lesson_id: str,
    submission: ExerciseSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submit answer for a single exercise
    """
    exercise = db.query(Exercise).filter(
        Exercise.lesson_id == lesson_id,
        Exercise.exercise_id == submission.exercise_id
    ).first()
    
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found"
        )
    
    correct = submission.answer.lower().strip() == exercise.correct_answer.lower().strip()
    points_earned = exercise.points if correct else 0
    
    return [ExerciseResult(
        exercise_id=exercise.exercise_id,
        correct=correct,
        user_answer=submission.answer,
        correct_answer=exercise.correct_answer,
        explanation=exercise.explanation,
        points_earned=points_earned
    )]
