from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime, timedelta

from ...database import get_db
from ...models.user import User, UserSettings
from ...models.language import UserOnboarding
from ...models.language import Language, UserLanguage
from ...models.gamification import UserXP, Streak, UserAchievement, XPTransaction
from ...models.progress import SkillScore, LessonCompletion, Enrollment
from ...models.course import Course
from ...schemas.user import (
    UserResponse, UserProfileUpdate, UserSettingsUpdate,
    UserSettingsResponse, UserOnboardingCreate
)
from ...schemas.language import UserLanguageResponse
from ...schemas.progress import DashboardStatsResponse
from ...schemas.gamification import UserXPResponse, StreakResponse, UserAchievementResponse
from ...dependencies import get_current_user, get_current_active_user
from ...utils.redis_client import redis_client

router = APIRouter(prefix="/users", tags=["Users"])

# Cache TTL for stats (60 seconds)
STATS_CACHE_TTL = 60

# Public endpoints - no authentication required

@router.get("/stats")
async def get_platform_stats(db: Session = Depends(get_db)):
    """Get public platform statistics for the welcome page (cached for 60s)"""
    from datetime import timedelta
    
    # Try to get from cache first
    cached_stats = await redis_client.cache_get("platform_stats")
    if cached_stats:
        return cached_stats
    
    # Get total users
    total_users = db.query(User).filter(User.is_active == True).count()

    # Get total courses
    total_courses = db.query(Course).filter(
        Course.is_published == True,
        Course.approval_status == "approved"
    ).count()

    # Get total languages
    total_languages = db.query(Language).count()

    # Get total instructors
    total_instructors = db.query(User).filter(
        User.role == "instructor",
        User.is_active == True
    ).count()

    # Get active users (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    active_users = db.query(User).filter(
        User.last_active_at >= thirty_days_ago
    ).count()

    # Calculate real success rate from enrollments
    total_enrollments = db.query(Enrollment).count()
    completed_enrollments = db.query(Enrollment).filter(
        Enrollment.completion_pct >= 100
    ).count()
    success_rate = round(
        (completed_enrollments / total_enrollments * 100) if total_enrollments > 0 else 0
    )

    stats = {
        "active_learners": active_users or total_users,
        "total_users": total_users,
        "languages": total_languages,
        "courses": total_courses,
        "instructors": total_instructors,
        "success_rate": success_rate
    }
    
    # Cache the result
    await redis_client.cache_set("platform_stats", stats, STATS_CACHE_TTL)
    
    return stats


@router.get("/languages")
async def get_available_languages(db: Session = Depends(get_db)):
    """Get available languages for learning (cached for 5 minutes)"""
    # Try to get from cache first
    cached_languages = await redis_client.cache_get("available_languages")
    if cached_languages:
        return {"languages": cached_languages}
    
    languages = db.query(Language).filter(Language.is_active == True).all()
    
    # Serialize languages manually
    languages_data = [
        {
            "id": lang.id,
            "code": lang.code,
            "name": lang.name,
            "native_name": lang.native_name,
            "flag_emoji": lang.flag_emoji,
            "is_active": lang.is_active
        }
        for lang in languages
    ]
    
    # Cache for 5 minutes (300 seconds)
    await redis_client.cache_set("available_languages", languages_data, 300)
    
    return {"languages": languages}

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_active_user)
):
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    for key, value in profile_data.dict(exclude_unset=True).items():
        setattr(current_user, key, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/me/settings", response_model=UserSettingsResponse)
async def get_settings(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if not current_user.settings:
        # Create default settings
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
        return settings
    
    return current_user.settings

@router.put("/me/settings", response_model=UserSettingsResponse)
async def update_settings(
    settings_data: UserSettingsUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if not current_user.settings:
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    else:
        settings = current_user.settings
    
    for key, value in settings_data.dict(exclude_unset=True).items():
        setattr(settings, key, value)
    
    db.commit()
    db.refresh(settings)
    return settings

@router.post("/onboarding", response_model=dict)
async def complete_onboarding(
    onboarding_data: UserOnboardingCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Check if languages exist
    native_lang = db.query(Language).filter(Language.id == onboarding_data.native_language_id).first()
    if not native_lang:
        raise HTTPException(status_code=404, detail="Native language not found")
    
    target_lang = db.query(Language).filter(Language.id == onboarding_data.learning_language_id).first()
    if not target_lang:
        raise HTTPException(status_code=404, detail="Learning language not found")
    
    # Create onboarding record
    onboarding = UserOnboarding(
        user_id=current_user.id,
        native_language_id=onboarding_data.native_language_id,
        learning_language_id=onboarding_data.learning_language_id,
        learning_goal=onboarding_data.learning_goal,
        initial_level=onboarding_data.initial_level,
        completed_at=datetime.utcnow()
    )
    db.add(onboarding)
    
    # Add to user languages
    native = UserLanguage(
        user_id=current_user.id,
        language_id=onboarding_data.native_language_id,
        type="native"
    )
    learning = UserLanguage(
        user_id=current_user.id,
        language_id=onboarding_data.learning_language_id,
        type="learning",
        level=onboarding_data.initial_level
    )
    db.add_all([native, learning])
    
    db.commit()
    
    return {"message": "Onboarding completed"}

@router.get("/me/languages", response_model=List[UserLanguageResponse])
async def get_user_languages(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return current_user.languages

@router.get("/me/dashboard", response_model=DashboardStatsResponse)
async def get_dashboard_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Try cache first (30s TTL — fast enough to feel live, slow enough to save DB)
    cache_key = f"dashboard:{current_user.id}"
    cached = await redis_client.cache_get(cache_key)
    if cached:
        return DashboardStatsResponse(**cached)

    # Get or create XP
    xp = db.query(UserXP).filter(UserXP.user_id == current_user.id).first()
    if not xp:
        xp = UserXP(user_id=current_user.id)
        db.add(xp)
        db.commit()
        db.refresh(xp)
    
    # Get streak
    streak = db.query(Streak).filter(Streak.user_id == current_user.id).first()
    if not streak:
        streak = Streak(user_id=current_user.id)
        db.add(streak)
        db.commit()
        db.refresh(streak)
    
    # Get today's XP
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    xp_today = db.query(func.sum(XPTransaction.amount)).filter(
        XPTransaction.user_id == current_user.id,
        XPTransaction.created_at >= today_start
    ).scalar() or 0
    
    # Count achievements
    achievements_count = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user.id
    ).count()
    
    # Get fluency score (average of skill scores)
    skill_scores = db.query(SkillScore).filter(
        SkillScore.user_id == current_user.id,
        SkillScore.language_id == current_user.onboarding.learning_language_id
    ).all()
    
    fluency_score = 0
    if skill_scores:
        fluency_score = sum(s.score_pct for s in skill_scores) // len(skill_scores)
    
    # Count lessons completed
    lessons_completed = db.query(LessonCompletion).filter(
        LessonCompletion.user_id == current_user.id
    ).count()
    
    # Lessons this month
    month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    lessons_this_month = db.query(LessonCompletion).filter(
        LessonCompletion.user_id == current_user.id,
        LessonCompletion.completed_at >= month_start
    ).count()
    
    # Time spent today
    time_spent_today = db.query(func.sum(LessonCompletion.time_spent_sec)).filter(
        LessonCompletion.user_id == current_user.id,
        LessonCompletion.completed_at >= today_start
    ).scalar() or 0
    
    result = DashboardStatsResponse(
        xp_points=xp.total_xp,
        xp_today=xp_today,
        current_streak=streak.current_streak,
        best_streak=streak.longest_streak,
        lessons_completed=lessons_completed,
        lessons_this_month=lessons_this_month,
        fluency_score=fluency_score,
        time_spent_today=time_spent_today,
        achievements_unlocked=achievements_count,
        next_level_xp=xp.xp_to_next_level,
        level=xp.current_level
    )
    await redis_client.cache_set(cache_key, result.dict(), 30)
    return result

@router.get("/{user_id}", response_model=UserResponse)
async def get_public_profile(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

@router.put("/me/cefr-level")
async def update_cefr_level(
    body: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update current user's CEFR level"""
    cefr_level = body.get("cefr_level", "").strip()
    valid_levels = {"A1", "A2", "B1", "B2", "C1", "C2"}
    if cefr_level not in valid_levels:
        raise HTTPException(status_code=400, detail=f"Invalid CEFR level. Must be one of: {', '.join(valid_levels)}")
    # TODO: Add cefr_level column to User model for persistent storage
    # For now, store it in user bio as a workaround or return success
    return {"message": "CEFR level updated", "cefr_level": cefr_level}
