"""
PULSE Prediction Service
========================
Core inference engine. Converts raw learner features into:
  - State prediction + confidence
  - Feature-level explanation
  - Curriculum intervention plan
"""

import numpy as np
import logging
from typing import List, Dict, Any, Tuple

from .core.model_loader import ModelLoader
from ..config import settings
from ..schemas.pulse import (
    LearnerFeaturesRequest, PULSEPrediction,
    FeatureFactor, InterventionPlan, LessonTypeWeights
)

logger = logging.getLogger("pulse.service")

# Human-readable labels for key features (shown in FluentFusion UI)
FEATURE_HUMAN_LABELS = {
    "sessions_last_7d": "Sessions this week",
    "sessions_last_14d": "Sessions last 2 weeks",
    "sessions_last_30d": "Sessions this month",
    "avg_session_duration_min": "Avg session length",
    "session_duration_trend": "Session length trend",
    "lesson_completion_rate_7d": "Lesson completion (7d)",
    "lesson_completion_rate_30d": "Lesson completion (30d)",
    "lesson_skip_rate": "Lesson skip rate",
    "lessons_abandoned_7d": "Lessons abandoned",
    "quiz_avg_score_7d": "Quiz average (7d)",
    "quiz_avg_score_30d": "Quiz average (30d)",
    "quiz_score_trend": "Quiz score trend",
    "quiz_retake_rate": "Quiz retake rate",
    "error_rate_7d": "Error rate (7d)",
    "error_rate_30d": "Error rate (30d)",
    "error_rate_trend": "Error rate trend",
    "avg_response_latency_sec": "Response speed",
    "response_latency_trend": "Response speed trend",
    "current_streak_days": "Current streak",
    "streak_consistency_30d": "Streak consistency",
    "streak_breaks_30d": "Streak breaks",
    "xp_earned_7d": "XP earned this week",
    "xp_earned_30d": "XP earned this month",
    "xp_trend_score": "XP growth trend",
    "daily_challenge_completion_rate": "Daily challenge rate",
    "flashcard_reviews_7d": "Flashcard reviews",
    "flashcard_accuracy": "Flashcard accuracy",
    "speaking_attempts_7d": "Speaking practice",
    "speaking_avg_score": "Speaking score",
    "listening_completion_rate": "Listening completion",
    "session_time_variance": "Schedule regularity",
    "weekend_activity_ratio": "Weekend activity",
    "community_posts_30d": "Community posts",
    "live_sessions_attended_30d": "Live sessions attended",
    "engagement_score": "Overall engagement",
    "performance_score": "Learning performance",
    "decline_index": "Decline indicator",
    "consistency_score": "Habit consistency",
    "speaking_engagement": "Speaking engagement",
}


def _compute_composite_features(req: LearnerFeaturesRequest, enc_native: int, enc_target: int, enc_sub: int) -> Dict[str, float]:
    """Compute composite features from raw input."""
    engagement_score = float(np.clip(
        req.sessions_last_7d * req.lesson_completion_rate_7d * (1 - req.lesson_skip_rate),
        0, 10
    ))
    performance_score = float(np.clip(
        (req.quiz_avg_score_7d / 100) * (1 - req.error_rate_7d),
        0, 1
    ))
    decline_index = float(
        req.error_rate_trend + req.response_latency_trend - req.xp_trend_score
    )
    consistency_score = float(np.clip(
        req.streak_consistency_30d * max(0, 1 - req.streak_breaks_30d / 30),
        0, 1
    ))
    speaking_engagement = float(np.clip(
        req.speaking_attempts_7d * req.speaking_avg_score / 100,
        0, 10
    ))

    return {
        "native_language_enc": enc_native,
        "target_language_enc": enc_target,
        "subscription_enc": enc_sub,
        "engagement_score": engagement_score,
        "performance_score": performance_score,
        "decline_index": decline_index,
        "consistency_score": consistency_score,
        "speaking_engagement": speaking_engagement,
    }


def _encode_categoricals(req: LearnerFeaturesRequest) -> Tuple[int, int, int]:
    """Encode categorical fields using loaded label encoders."""
    encoders = ModelLoader.encoders
    meta = ModelLoader.metadata

    def safe_encode(classes_list, value):
        try:
            return list(classes_list).index(value)
        except (ValueError, TypeError):
            return 0

    enc_native = safe_encode(meta.get("native_language_classes", []), req.native_language)
    enc_target = safe_encode(meta.get("target_language_classes", []), req.target_language)
    enc_sub = safe_encode(meta.get("subscription_classes", []), req.subscription_tier)

    return enc_native, enc_target, enc_sub


def _build_feature_vector(req: LearnerFeaturesRequest) -> Tuple[List[float], Dict[str, float]]:
    """Build ordered feature vector matching training feature order."""
    enc_native, enc_target, enc_sub = _encode_categoricals(req)
    composites = _compute_composite_features(req, enc_native, enc_target, enc_sub)

    # Raw feature dict from request
    raw = req.model_dump()
    raw.update(composites)

    feature_cols = ModelLoader.metadata["feature_cols"]
    vector = []
    for col in feature_cols:
        val = raw.get(col, 0.0)
        vector.append(float(val) if val is not None else 0.0)

    return vector, raw


def _get_top_factors(feature_vector: List[float], raw_features: Dict[str, float]) -> List[FeatureFactor]:
    """Extract top contributing factors with human-readable labels and direction."""
    if ModelLoader.model is None:
        return []

    importances = ModelLoader.model.feature_importances_
    feature_cols = ModelLoader.metadata["feature_cols"]
    scaled = ModelLoader.scaler.transform([feature_vector])[0]

    # Sort by importance, take top 8
    top_idx = np.argsort(importances)[::-1][:8]

    # Features where high value = concern (negative signal)
    concern_when_high = {
        "error_rate_7d", "error_rate_30d", "error_rate_trend",
        "lesson_skip_rate", "lessons_abandoned_7d",
        "avg_response_latency_sec", "response_latency_trend",
        "streak_breaks_30d", "quiz_retake_rate", "decline_index",
        "session_time_variance",
    }

    factors = []
    for i in top_idx:
        feat_name = feature_cols[i]
        val = float(raw_features.get(feat_name, 0.0))
        s_val = float(scaled[i])

        # Determine direction
        if feat_name in concern_when_high:
            direction = "concern" if s_val > 0 else "positive"
        else:
            direction = "positive" if s_val > 0 else "concern"

        factors.append(FeatureFactor(
            feature=feat_name,
            value=val,
            importance=float(importances[i]),
            direction=direction,
            human_label=FEATURE_HUMAN_LABELS.get(feat_name, feat_name.replace("_", " ").title()),
        ))

    return factors


def predict_single(req: LearnerFeaturesRequest) -> PULSEPrediction:
    """
    Main inference function. Returns full PULSE prediction for one learner.
    Called by the API endpoint on every request.
    """
    if not ModelLoader.is_ready():
        raise RuntimeError("PULSE model not loaded. Run the ML notebook first.")

    # Build feature vector
    feature_vector, raw_features = _build_feature_vector(req)

    # Scale
    x_scaled = ModelLoader.scaler.transform([feature_vector])

    # Predict
    predicted_state = int(ModelLoader.model.predict(x_scaled)[0])
    probabilities = ModelLoader.model.predict_proba(x_scaled)[0]
    confidence = float(probabilities[predicted_state])

    state_labels = ModelLoader.STATE_LABELS
    all_probs = {state_labels[i]: float(p) for i, p in enumerate(probabilities)}

    # Get top factors
    top_factors = _get_top_factors(feature_vector, raw_features)

    # Get intervention plan
    inv_raw = ModelLoader.INTERVENTION_MAP[predicted_state]
    lw = inv_raw["lesson_type_weights"]
    intervention = InterventionPlan(
        curriculum_action=inv_raw["curriculum_action"],
        session_target_minutes=inv_raw["session_target_minutes"],
        difficulty_adjustment=inv_raw["difficulty_adjustment"],
        lesson_type_weights=LessonTypeWeights(
            grammar=lw["grammar"],
            vocabulary=lw["vocabulary"],
            speaking=lw["speaking"],
            listening=lw["listening"],
        ),
        flashcard_daily_target=inv_raw["flashcard_daily_target"],
        notification_type=inv_raw["notification_type"],
        streak_action=inv_raw["streak_action"],
        community_prompt=inv_raw["community_prompt"],
        message=inv_raw["message"],
    )

    # Build explanation summary
    primary_factor = top_factors[0].human_label if top_factors else "behavioral patterns"
    explanation_summary = (
        f"Learner classified as '{state_labels[predicted_state]}' "
        f"with {confidence*100:.1f}% confidence. "
        f"Primary driver: {primary_factor}. "
        f"Curriculum action: {inv_raw['curriculum_action']}."
    )

    return PULSEPrediction(
        learner_id=req.learner_id,
        predicted_state=predicted_state,
        predicted_label=state_labels[predicted_state],
        confidence=confidence,
        is_uncertain=confidence < settings.PULSE_CONFIDENCE_THRESHOLD,
        all_probabilities=all_probs,
        top_factors=top_factors,
        intervention=intervention,
        explanation_summary=explanation_summary,
    )


def predict_batch(requests: List[LearnerFeaturesRequest]) -> List[PULSEPrediction]:
    """Batch inference for multiple learners (Celery daily job)."""
    results = []
    for req in requests:
        try:
            results.append(predict_single(req))
        except Exception as e:
            logger.error(f"Error predicting for learner {req.learner_id}: {e}")
    return results
