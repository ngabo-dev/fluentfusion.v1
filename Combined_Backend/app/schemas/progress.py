from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class EnrollmentResponse(BaseModel):
    id: int
    course_id: int
    course_title: Optional[str] = None
    enrolled_at: datetime
    completed_at: Optional[datetime] = None
    last_accessed_at: Optional[datetime] = None
    completion_pct: int
    last_lesson_id: Optional[int] = None
    certificate_url: Optional[str] = None
    
    class Config:
        from_attributes = True

class LessonCompletionResponse(BaseModel):
    id: int
    lesson_id: int
    lesson_title: Optional[str] = None
    completed_at: datetime
    time_spent_sec: int
    
    class Config:
        from_attributes = True

class SkillScoreResponse(BaseModel):
    skill: str
    score_pct: int
    updated_at: datetime
    
    class Config:
        from_attributes = True

class DashboardStatsResponse(BaseModel):
    xp_points: int
    xp_today: int
    current_streak: int
    best_streak: int
    lessons_completed: int
    lessons_this_month: int
    fluency_score: int
    time_spent_today: int  # seconds
    achievements_unlocked: int
    next_level_xp: int
    level: int