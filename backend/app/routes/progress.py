"""
Progress routes for FluentFusion API
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List, Optional
import uuid
from app.database import get_db
from app.models import User, UserProgress, Lesson, Badge, UserBadge, Exercise
from app.auth import get_current_user
from app.schemas import (
    ProgressResponse,
    LessonProgress,
    UserStats,
    QuizSubmit,
    QuizResult,
    ExerciseResult,
    BadgeResponse,
    RecommendationResponse,
    LessonResponse,
)

router = APIRouter(prefix="/progress", tags=["Progress"])

@router.get("/", response_model=ProgressResponse)
async def get_user_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get user progress for all completed lessons
    """
    # Get user's progress
    progress_records = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.user_id
    ).all()
    
    lessons_progress = []
    for progress in progress_records:
        lesson = db.query(Lesson).filter(
            Lesson.lesson_id == progress.lesson_id
        ).first()
        
        if lesson:
            lessons_progress.append(LessonProgress(
                lesson_id=lesson.lesson_id,
                title=lesson.title,
                category=lesson.category,
                difficulty=lesson.difficulty,
                score=progress.score,
                completed=progress.completed,
                completed_at=progress.completed_at,
                time_spent=progress.time_spent
            ))
    
    # Calculate statistics
    completed_count = len([p for p in progress_records if p.completed])
    total_points = sum(p.score * 100 for p in progress_records if p.completed)
    avg_score = sum(p.score for p in progress_records if p.completed) / completed_count if completed_count > 0 else 0
    
    # Get badges
    badges = db.query(UserBadge).filter(
        UserBadge.user_id == current_user.user_id
    ).count()
    
    # Calculate vocabulary learned (simplified)
    vocab_learned = completed_count * 15  # ~15 words per lesson
    
    stats = UserStats(
        total_lessons_completed=completed_count,
        total_points=int(total_points),
        current_streak=1,  # Simplified
        average_score=round(avg_score, 2),
        vocabulary_learned=vocab_learned,
        badges_earned=badges
    )
    
    return ProgressResponse(
        lessons=sorted(lessons_progress, key=lambda x: x.completed_at or datetime.min, reverse=True),
        stats=stats
    )

@router.get("/stats", response_model=UserStats)
async def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get user statistics
    """
    # Get completed lessons count
    completed = db.query(func.count(UserProgress.id)).filter(
        UserProgress.user_id == current_user.user_id,
        UserProgress.completed == True
    ).scalar() or 0
    
    # Get total points
    total_points = db.query(func.sum(UserProgress.score)).filter(
        UserProgress.user_id == current_user.user_id,
        UserProgress.completed == True
    ).scalar() or 0
    total_points = int(total_points * 100)
    
    # Get average score
    avg_score_result = db.query(func.avg(UserProgress.score)).filter(
        UserProgress.user_id == current_user.user_id,
        UserProgress.completed == True
    ).scalar()
    avg_score = round(avg_score_result, 2) if avg_score_result else 0
    
    # Get badges count
    badges_count = db.query(func.count(UserBadge.id)).filter(
        UserBadge.user_id == current_user.user_id
    ).scalar() or 0
    
    return UserStats(
        total_lessons_completed=completed,
        total_points=total_points,
        current_streak=1,
        average_score=avg_score,
        vocabulary_learned=completed * 15,
        badges_earned=badges_count
    )

@router.post("/quiz/{lesson_id}", response_model=QuizResult)
async def submit_quiz(
    lesson_id: str,
    quiz: QuizSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submit quiz answers for a lesson
    """
    lesson = db.query(Lesson).filter(Lesson.lesson_id == lesson_id).first()
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )
    
    # Get all exercises for the lesson
    exercises = db.query(Exercise).filter(
        Exercise.lesson_id == lesson_id
    ).all()
    
    exercise_dict = {ex.exercise_id: ex for ex in exercises}
    
    # Grade answers
    results = []
    earned_points = 0
    total_points = 0
    
    for answer in quiz.answers:
        if answer.exercise_id in exercise_dict:
            ex = exercise_dict[answer.exercise_id]
            total_points += ex.points
            correct = answer.answer.lower().strip() == ex.correct_answer.lower().strip()
            
            if correct:
                earned_points += ex.points
            
            results.append(ExerciseResult(
                exercise_id=ex.exercise_id,
                correct=correct,
                user_answer=answer.answer,
                correct_answer=ex.correct_answer,
                explanation=ex.explanation,
                points_earned=ex.points if correct else 0
            ))
    
    # Calculate score
    score = earned_points / total_points if total_points > 0 else 0
    completed = score >= 0.7  # 70% to pass
    
    # Save progress
    import uuid
    progress_id = str(uuid.uuid4())
    
    # Check if progress already exists
    existing_progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.user_id,
        UserProgress.lesson_id == lesson_id
    ).first()
    
    if existing_progress:
        existing_progress.score = score
        existing_progress.time_spent = quiz.time_spent
        existing_progress.completed = completed
        existing_progress.completed_at = datetime.utcnow() if completed else None
        existing_progress.answers = [a.model_dump() for a in quiz.answers]
        progress = existing_progress
    else:
        progress = UserProgress(
            progress_id=progress_id,
            user_id=current_user.user_id,
            lesson_id=lesson_id,
            score=score,
            time_spent=quiz.time_spent,
            completed=completed,
            completed_at=datetime.utcnow() if completed else None,
            answers=[a.model_dump() for a in quiz.answers]
        )
        db.add(progress)
    
    db.commit()
    
    # Check for new badge
    new_badge = None
    completed_count = db.query(func.count(UserProgress.id)).filter(
        UserProgress.user_id == current_user.user_id,
        UserProgress.completed == True
    ).scalar() or 0
    
    # Badge for first lesson
    if completed_count == 1:
        badge = db.query(Badge).filter(Badge.badge_id == "B001").first()
        if badge:
            existing = db.query(UserBadge).filter(
                UserBadge.user_id == current_user.user_id,
                UserBadge.badge_id == "B001"
            ).first()
            if not existing:
                user_badge = UserBadge(
                    user_badge_id=str(uuid.uuid4()),
                    user_id=current_user.user_id,
                    badge_id="B001"
                )
                db.add(user_badge)
                db.commit()
                new_badge = badge.name
    
    return QuizResult(
        lesson_id=lesson_id,
        score=round(score, 2),
        total_points=total_points,
        earned_points=earned_points,
        completed=completed,
        results=results,
        new_badge_earned=new_badge
    )

@router.get("/badges", response_model=List[BadgeResponse])
async def get_user_badges(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all badges earned by user
    """
    user_badges = db.query(UserBadge).filter(
        UserBadge.user_id == current_user.user_id
    ).all()
    
    return [BadgeResponse(
        badge_id=ub.badge.badge_id,
        name=ub.badge.name,
        description=ub.badge.description,
        icon=ub.badge.icon,
        earned_at=ub.earned_at
    ) for ub in user_badges]

@router.get("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get personalized lesson recommendations
    """
    # Get completed lessons
    completed = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.user_id,
        UserProgress.completed == True
    ).all()
    completed_ids = [p.lesson_id for p in completed]
    
    # Get lessons by target language
    query = db.query(Lesson).filter(
        Lesson.target_language == current_user.target_language
    )
    
    if completed_ids:
        query = query.filter(~Lesson.lesson_id.in_(completed_ids))
    
    # Order by category (group similar lessons)
    query = query.order_by(Lesson.category, Lesson.difficulty)
    
    recommended = query.limit(5).all()
    
    # Generate reason based on user type
    if current_user.user_type == "tourist":
        reason = "Recommended lessons based on your progress learning Kinyarwanda for your trip"
    else:
        reason = "Recommended lessons to improve your English for working with tourists"
    
    return RecommendationResponse(
        recommended_lessons=[LessonResponse.model_validate(l) for l in recommended],
        reason=reason
    )
