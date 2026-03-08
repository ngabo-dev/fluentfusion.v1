"""
PULSE Schemas
=============
Pydantic models for all PULSE API requests and responses.
Directly aligned with the FluentFusion database schema and frontend design.
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, List, Any
from enum import IntEnum


class LearnerState(IntEnum):
    THRIVING = 0
    COASTING = 1
    STRUGGLING = 2
    BURNING_OUT = 3
    DISENGAGED = 4


# ── Input schema: behavioral features computed from the FluentFusion database
class LearnerFeaturesRequest(BaseModel):
    """
    Behavioral snapshot for a single learner.
    All fields are computed from the FluentFusion backend database
    (sessions, lesson_completions, quiz_attempts, xp_transactions, etc.)
    """

    # Learner identity
    learner_id: int = Field(..., description="FluentFusion user ID")
    native_language: str = Field(..., description="Learner's native language")
    target_language: str = Field(..., description="Language being learned")
    subscription_tier: str = Field("free", description="free | pro | enterprise")
    account_age_days: int = Field(..., ge=0, description="Days since account creation")
    current_level: int = Field(..., ge=1, le=20, description="Current platform level")

    # Session behavior
    sessions_last_7d: int = Field(..., ge=0, description="Sessions completed in last 7 days")
    sessions_last_14d: int = Field(..., ge=0)
    sessions_last_30d: int = Field(..., ge=0)
    avg_session_duration_min: float = Field(..., ge=0, description="Average session duration in minutes")
    session_duration_trend: float = Field(..., description="Positive=increasing, Negative=declining")

    # Lesson engagement
    lesson_completion_rate_7d: float = Field(..., ge=0, le=1)
    lesson_completion_rate_30d: float = Field(..., ge=0, le=1)
    lesson_skip_rate: float = Field(..., ge=0, le=1)
    lessons_abandoned_7d: int = Field(..., ge=0)

    # Quiz performance
    quiz_avg_score_7d: float = Field(..., ge=0, le=100)
    quiz_avg_score_30d: float = Field(..., ge=0, le=100)
    quiz_score_trend: float = Field(..., description="Positive=improving, Negative=declining")
    quiz_retake_rate: float = Field(..., ge=0, le=1)

    # Error patterns
    error_rate_7d: float = Field(..., ge=0, le=1)
    error_rate_30d: float = Field(..., ge=0, le=1)
    error_rate_trend: float = Field(..., description="Positive=more errors, Negative=fewer")
    avg_response_latency_sec: float = Field(..., ge=0, description="Average response time in seconds")
    response_latency_trend: float = Field(...)

    # Gamification
    current_streak_days: int = Field(..., ge=0)
    streak_consistency_30d: float = Field(..., ge=0, le=1)
    streak_breaks_30d: int = Field(..., ge=0)
    xp_earned_7d: int = Field(..., ge=0)
    xp_earned_30d: int = Field(..., ge=0)
    xp_trend_score: float = Field(..., description="XP weekly growth multiplier")
    daily_challenge_completion_rate: float = Field(..., ge=0, le=1)

    # Practice activity
    flashcard_reviews_7d: int = Field(..., ge=0)
    flashcard_accuracy: float = Field(..., ge=0, le=1)
    speaking_attempts_7d: int = Field(..., ge=0)
    speaking_avg_score: float = Field(..., ge=0, le=100)
    listening_completion_rate: float = Field(..., ge=0, le=1)

    # Time patterns
    preferred_hour_of_day: int = Field(..., ge=0, le=23)
    session_time_variance: float = Field(..., ge=0)
    weekend_activity_ratio: float = Field(..., ge=0, le=1)

    # Community
    community_posts_30d: int = Field(..., ge=0)
    live_sessions_attended_30d: int = Field(..., ge=0)

    class Config:
        json_schema_extra = {
            "example": {
                "learner_id": 9999,
                "native_language": "Kinyarwanda",
                "target_language": "French",
                "subscription_tier": "pro",
                "account_age_days": 145,
                "current_level": 4,
                "sessions_last_7d": 2,
                "sessions_last_14d": 5,
                "sessions_last_30d": 16,
                "avg_session_duration_min": 9.5,
                "session_duration_trend": -0.35,
                "lesson_completion_rate_7d": 0.42,
                "lesson_completion_rate_30d": 0.58,
                "lesson_skip_rate": 0.31,
                "lessons_abandoned_7d": 2,
                "quiz_avg_score_7d": 71.2,
                "quiz_avg_score_30d": 74.8,
                "quiz_score_trend": -0.18,
                "quiz_retake_rate": 0.42,
                "error_rate_7d": 0.34,
                "error_rate_30d": 0.28,
                "error_rate_trend": 0.22,
                "avg_response_latency_sec": 7.1,
                "response_latency_trend": 0.28,
                "current_streak_days": 3,
                "streak_consistency_30d": 0.38,
                "streak_breaks_30d": 4,
                "xp_earned_7d": 310,
                "xp_earned_30d": 2100,
                "xp_trend_score": 0.52,
                "daily_challenge_completion_rate": 0.40,
                "flashcard_reviews_7d": 8,
                "flashcard_accuracy": 0.72,
                "speaking_attempts_7d": 1,
                "speaking_avg_score": 61.0,
                "listening_completion_rate": 0.48,
                "preferred_hour_of_day": 22,
                "session_time_variance": 3.8,
                "weekend_activity_ratio": 0.31,
                "community_posts_30d": 1,
                "live_sessions_attended_30d": 0,
            }
        }


class BatchPredictRequest(BaseModel):
    learners: List[LearnerFeaturesRequest] = Field(..., min_length=1, max_length=500)


# ── Output schemas

class FeatureFactor(BaseModel):
    feature: str
    value: float
    importance: float
    direction: str  # "concern" | "positive"
    human_label: str  # Human-readable name for display in FluentFusion UI


class LessonTypeWeights(BaseModel):
    grammar: float
    vocabulary: float
    speaking: float
    listening: float


class InterventionPlan(BaseModel):
    curriculum_action: str
    session_target_minutes: int
    difficulty_adjustment: int
    lesson_type_weights: LessonTypeWeights
    flashcard_daily_target: int
    notification_type: str
    streak_action: str
    community_prompt: bool
    message: str


class PULSEPrediction(BaseModel):
    learner_id: int
    predicted_state: int
    predicted_label: str
    confidence: float
    is_uncertain: bool  # True if confidence < threshold
    all_probabilities: Dict[str, float]
    top_factors: List[FeatureFactor]
    intervention: InterventionPlan
    explanation_summary: str


class BatchPredictResponse(BaseModel):
    predictions: List[PULSEPrediction]
    total: int
    processing_time_ms: float


class StateInfoResponse(BaseModel):
    state_id: int
    label: str
    description: str
    color: str
    intervention_summary: str
