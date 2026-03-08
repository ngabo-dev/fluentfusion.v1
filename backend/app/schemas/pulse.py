"""
PULSE Schema Definitions
========================
Pydantic schemas for PULSE ML engine request/response models.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any


class LearnerFeaturesRequest(BaseModel):
    """Input features for a single learner prediction."""
    learner_id: str
    
    # Session metrics
    sessions_last_7d: int = Field(default=0, ge=0, description="Number of sessions in last 7 days")
    sessions_last_14d: int = Field(default=0, ge=0)
    sessions_last_30d: int = Field(default=0, ge=0)
    avg_session_duration_min: float = Field(default=0.0, ge=0)
    session_duration_trend: float = Field(default=0.0, description="Trend in session duration")
    
    # Lesson metrics
    lesson_completion_rate_7d: float = Field(default=0.0, ge=0, le=1)
    lesson_completion_rate_30d: float = Field(default=0.0, ge=0, le=1)
    lesson_skip_rate: float = Field(default=0.0, ge=0, le=1)
    lessons_abandoned_7d: int = Field(default=0, ge=0)
    
    # Quiz metrics
    quiz_avg_score_7d: float = Field(default=0.0, ge=0, le=100)
    quiz_avg_score_30d: float = Field(default=0.0, ge=0, le=100)
    quiz_score_trend: float = Field(default=0.0)
    quiz_retake_rate: float = Field(default=0.0, ge=0, le=1)
    
    # Error metrics
    error_rate_7d: float = Field(default=0.0, ge=0, le=1)
    error_rate_30d: float = Field(default=0.0, ge=0, le=1)
    error_rate_trend: float = Field(default=0.0)
    
    # Response time
    avg_response_latency_sec: float = Field(default=0.0, ge=0)
    response_latency_trend: float = Field(default=0.0)
    
    # Streak metrics
    current_streak_days: int = Field(default=0, ge=0)
    streak_consistency_30d: float = Field(default=0.0, ge=0, le=1)
    streak_breaks_30d: int = Field(default=0, ge=0)
    
    # XP metrics
    xp_earned_7d: int = Field(default=0, ge=0)
    xp_earned_30d: int = Field(default=0, ge=0)
    xp_trend_score: float = Field(default=0.0)
    
    # Activity metrics
    daily_challenge_completion_rate: float = Field(default=0.0, ge=0, le=1)
    flashcard_reviews_7d: int = Field(default=0, ge=0)
    flashcard_accuracy: float = Field(default=0.0, ge=0, le=1)
    speaking_attempts_7d: int = Field(default=0, ge=0)
    speaking_avg_score: float = Field(default=0.0, ge=0, le=100)
    listening_completion_rate: float = Field(default=0.0, ge=0, le=1)
    session_time_variance: float = Field(default=0.0, ge=0)
    weekend_activity_ratio: float = Field(default=0.0, ge=0, le=1)
    
    # Social/Community
    community_posts_30d: int = Field(default=0, ge=0)
    live_sessions_attended_30d: int = Field(default=0, ge=0)
    
    # Categorical features
    native_language: str = Field(default="English")
    target_language: str = Field(default="Spanish")
    subscription_tier: str = Field(default="free")


class LessonTypeWeights(BaseModel):
    """Recommended weight distribution for lesson types."""
    grammar: float = Field(default=0.25, ge=0, le=1)
    vocabulary: float = Field(default=0.25, ge=0, le=1)
    speaking: float = Field(default=0.25, ge=0, le=1)
    listening: float = Field(default=0.25, ge=0, le=1)


class InterventionPlan(BaseModel):
    """Curriculum restructuring intervention plan based on learner state."""
    curriculum_action: str
    session_target_minutes: int = Field(default=15, ge=1, le=120)
    difficulty_adjustment: str = Field(default="maintain")
    lesson_type_weights: LessonTypeWeights
    flashcard_daily_target: int = Field(default=20, ge=0)
    notification_type: str = Field(default="motivation")
    streak_action: str = Field(default="none")
    community_prompt: Optional[str] = None
    message: str


class FeatureFactor(BaseModel):
    """A behavioral factor contributing to the prediction."""
    feature: str
    value: float
    importance: float
    direction: str = Field(description="positive or concern")
    human_label: str


class PULSEPrediction(BaseModel):
    """Full PULSE prediction result for a learner."""
    learner_id: str
    predicted_state: int = Field(ge=0, le=4)
    predicted_label: str
    confidence: float = Field(ge=0, le=1)
    is_uncertain: bool
    all_probabilities: Dict[str, float]
    top_factors: List[FeatureFactor]
    intervention: InterventionPlan
    explanation_summary: str


class BatchPredictRequest(BaseModel):
    """Request for batch prediction."""
    learners: List[LearnerFeaturesRequest] = Field(max_length=500)


class BatchPredictResponse(BaseModel):
    """Response for batch prediction."""
    predictions: List[PULSEPrediction]
    total: int
    processing_time_ms: float


class StateInfoResponse(BaseModel):
    """Information about a PULSE learner state."""
    state_id: int = Field(ge=0, le=4)
    label: str
    description: str
    color: str
    intervention_summary: str
