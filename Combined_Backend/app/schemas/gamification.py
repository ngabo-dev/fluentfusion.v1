from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date

class UserXPResponse(BaseModel):
    total_xp: int
    current_level: int
    xp_to_next_level: int
    
    class Config:
        from_attributes = True

class StreakResponse(BaseModel):
    current_streak: int
    longest_streak: int
    last_activity_date: Optional[date] = None
    total_active_days: int
    
    class Config:
        from_attributes = True

class AchievementDefinitionResponse(BaseModel):
    id: int
    key: str
    name: str
    description: str
    icon_name: Optional[str] = None
    rarity: str
    xp_reward: int
    
    class Config:
        from_attributes = True

class UserAchievementResponse(BaseModel):
    id: int
    achievement: AchievementDefinitionResponse
    earned_at: datetime
    
    class Config:
        from_attributes = True

class DailyChallengeResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    challenge_date: date
    bonus_xp: int
    tasks: List[dict] = []
    progress: Optional[dict] = None

class LeaderboardEntryResponse(BaseModel):
    user_id: int
    user_name: str
    avatar_url: Optional[str] = None
    xp_total: int
    rank: int
    streak: Optional[int] = None
    
    class Config:
        from_attributes = True