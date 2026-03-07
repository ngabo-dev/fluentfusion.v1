from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from datetime import datetime, date

from ...database import get_db
from ...models.gamification import (
    UserXP, XPTransaction, Streak, StreakDay,
    AchievementDefinition, UserAchievement,
    DailyChallenge, DailyChallengeTask, UserDailyChallengeProgress,
    Leaderboard
)
from ...models.user import User
from ...dependencies import get_current_user, get_current_active_user

router = APIRouter(prefix="/gamification", tags=["Gamification"])

# ==================== XP & LEVEL ====================

@router.get("/xp")
async def get_xp(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user's XP and level"""
    xp = db.query(UserXP).filter(UserXP.user_id == current_user.id).first()
    
    if not xp:
        xp = UserXP(user_id=current_user.id)
        db.add(xp)
        db.commit()
        db.refresh(xp)
    
    return xp

@router.get("/xp/transactions")
async def get_xp_transactions(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user's XP transaction history"""
    query = db.query(XPTransaction).filter(
        XPTransaction.user_id == current_user.id
    ).order_by(XPTransaction.created_at.desc())
    
    total = query.count()
    transactions = query.offset((page - 1) * limit).limit(limit).all()
    
    return {
        "transactions": transactions,
        "total": total,
        "page": page
    }

# ==================== STREAKS ====================

@router.get("/streak")
async def get_streak(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user's streak info"""
    streak = db.query(Streak).filter(Streak.user_id == current_user.id).first()
    
    if not streak:
        streak = Streak(user_id=current_user.id)
        db.add(streak)
        db.commit()
        db.refresh(streak)
    
    return streak

@router.post("/streak/record")
async def record_activity(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Record today's activity for streak"""
    today = date.today()
    
    streak = db.query(Streak).filter(Streak.user_id == current_user.id).first()
    if not streak:
        streak = Streak(user_id=current_user.id)
        db.add(streak)
        db.flush()
    
    # Check if already recorded today
    existing = db.query(StreakDay).filter(
        StreakDay.user_id == current_user.id,
        func.date(StreakDay.activity_date) == today
    ).first()
    
    if existing:
        return {"message": "Already recorded today", "current_streak": streak.current_streak}
    
    # Record today
    day = StreakDay(user_id=current_user.id, activity_date=today)
    db.add(day)
    
    # Update streak
    if streak.last_activity_date:
        last_date = streak.last_activity_date.date() if isinstance(streak.last_activity_date, datetime) else streak.last_activity_date
        days_diff = (today - last_date).days
        
        if days_diff == 1:
            # Consecutive day
            streak.current_streak += 1
        elif days_diff > 1:
            # Streak broken
            streak.current_streak = 1
        # Same day = no change
    else:
        streak.current_streak = 1
    
    if streak.current_streak > streak.longest_streak:
        streak.longest_streak = streak.current_streak
    
    streak.last_activity_date = today
    streak.total_active_days += 1
    
    db.commit()
    db.refresh(streak)
    
    return {
        "message": "Activity recorded",
        "current_streak": streak.current_streak,
        "longest_streak": streak.longest_streak
    }

# ==================== ACHIEVEMENTS ====================

@router.get("/achievements")
async def get_all_achievements(
    db: Session = Depends(get_db)
):
    """Get all achievement definitions"""
    achievements = db.query(AchievementDefinition).filter(
        AchievementDefinition.is_active == True
    ).all()
    return {"achievements": achievements}

@router.get("/achievements/mine")
async def get_my_achievements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user's earned achievements"""
    achievements = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user.id
    ).all()
    
    # Get all available
    all_achievements = db.query(AchievementDefinition).filter(
        AchievementDefinition.is_active == True
    ).all()
    
    earned_ids = [a.achievement_id for a in achievements]
    
    return {
        "earned": achievements,
        "available": all_achievements,
        "earned_ids": earned_ids
    }

# ==================== DAILY CHALLENGES ====================

@router.get("/daily-challenge/today")
async def get_today_challenge(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get today's daily challenge"""
    today = date.today()
    
    challenge = db.query(DailyChallenge).filter(
        DailyChallenge.challenge_date == today
    ).first()
    
    if not challenge:
        return {"challenge": None, "message": "No challenge today"}
    
    # Get tasks
    tasks = db.query(DailyChallengeTask).filter(
        DailyChallengeTask.challenge_id == challenge.id
    ).order_by(DailyChallengeTask.order_index).all()
    
    # Get user's progress
    progress = db.query(UserDailyChallengeProgress).filter(
        UserDailyChallengeProgress.user_id == current_user.id,
        UserDailyChallengeProgress.challenge_id == challenge.id
    ).all()
    
    progress_dict = {p.task_id: p for p in progress}
    
    # Calculate completion
    completed_count = sum(1 for p in progress if p.is_completed)
    
    return {
        "challenge": challenge,
        "tasks": tasks,
        "progress": progress_dict,
        "completed_count": completed_count,
        "total_tasks": len(tasks)
    }

@router.post("/daily-challenge/{task_id}/complete")
async def complete_challenge_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Mark a daily challenge task as complete"""
    task = db.query(DailyChallengeTask).filter(DailyChallengeTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Get or create progress
    progress = db.query(UserDailyChallengeProgress).filter(
        UserDailyChallengeProgress.user_id == current_user.id,
        UserDailyChallengeProgress.task_id == task_id,
        UserDailyChallengeProgress.challenge_id == task.challenge_id
    ).first()
    
    if not progress:
        progress = UserDailyChallengeProgress(
            user_id=current_user.id,
            challenge_id=task.challenge_id,
            task_id=task_id,
            current_count=1,
            is_completed=True,
            completed_at=datetime.utcnow()
        )
        db.add(progress)
        
        xp_earned = task.xp_reward
    else:
        if progress.is_completed:
            return {"message": "Already completed", "xp_earned": 0}
        
        progress.current_count += 1
        if progress.current_count >= task.target_count:
            progress.is_completed = True
            progress.completed_at = datetime.utcnow()
            xp_earned = task.xp_reward
        else:
            xp_earned = 0
    
    db.commit()
    
    return {
        "message": "Task progress updated",
        "xp_earned": xp_earned,
        "is_completed": progress.is_completed
    }

# ==================== LEADERBOARD ====================

@router.get("/leaderboard")
async def get_leaderboard(
    language_id: Optional[int] = None,
    period: str = "weekly",
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get global or language-specific leaderboard"""
    query = db.query(Leaderboard).filter(
        Leaderboard.period == period,
        Leaderboard.language_id == language_id
    ).order_by(Leaderboard.xp_total.desc()).limit(limit)
    
    entries = query.all()
    
    # Get user details for each entry
    results = []
    for entry in entries:
        user = db.query(User).filter(User.id == entry.user_id).first()
        if user:
            results.append({
                "rank": entry.rank,
                "user_id": entry.user_id,
                "user_name": user.full_name,
                "avatar_url": user.avatar_url,
                "xp": entry.xp_total
            })
    
    return {"leaderboard": results, "period": period}

@router.get("/leaderboard/my-rank")
async def get_my_rank(
    language_id: Optional[int] = None,
    period: str = "weekly",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get current user's rank"""
    entry = db.query(Leaderboard).filter(
        Leaderboard.user_id == current_user.id,
        Leaderboard.period == period,
        Leaderboard.language_id == language_id
    ).first()
    
    if not entry:
        return {"rank": None, "xp": 0}
    
    return {"rank": entry.rank, "xp": entry.xp_total}

# ==================== DASHBOARD STATS ====================

@router.get("/stats")
async def get_gamification_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all gamification stats for dashboard"""
    # XP
    xp = db.query(UserXP).filter(UserXP.user_id == current_user.id).first()
    if not xp:
        xp = UserXP(user_id=current_user.id)
        db.add(xp)
        db.commit()
        db.refresh(xp)
    
    # Streak
    streak = db.query(Streak).filter(Streak.user_id == current_user.id).first()
    if not streak:
        streak = Streak(user_id=current_user.id)
        db.add(streak)
        db.commit()
        db.refresh(streak)
    
    # Achievements count
    achievements_count = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user.id
    ).count()
    
    return {
        "xp": xp,
        "streak": streak,
        "achievements_count": achievements_count,
        "level": xp.current_level,
        "total_xp": xp.total_xp,
        "current_streak": streak.current_streak,
        "longest_streak": streak.longest_streak
    }
