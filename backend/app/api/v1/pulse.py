"""
PULSE API Routes
================
All PULSE prediction endpoints.

GET  /api/v1/pulse/states           — List all 5 learner states
POST /api/v1/pulse/predict          — Predict state for one learner
POST /api/v1/pulse/batch            — Batch predict for multiple learners
GET  /api/v1/pulse/model-info       — Model metadata and performance stats
GET  /api/v1/pulse/feature-importance — Top features driving state classification
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import time
import logging

from app.pulse.pulse import (
    LearnerFeaturesRequest, BatchPredictRequest,
    PULSEPrediction, BatchPredictResponse, StateInfoResponse
)
from app.pulse.services.pulse_service import predict_single, predict_batch
from app.pulse.core.model_loader import ModelLoader

logger = logging.getLogger("pulse.router")
router = APIRouter(prefix="/pulse", tags=["PULSE Engine"])


# ── State catalog
STATE_INFO = {
    0: {
        "label": "Thriving",
        "description": "Highly engaged learner showing consistent progress and strong performance. "
                       "Completing lessons regularly, maintaining streaks, high quiz scores.",
        "color": "#bfff00",
        "intervention_summary": "Accelerate: increase difficulty, unlock advanced content, add community challenges.",
    },
    1: {
        "label": "Coasting",
        "description": "Stable but not progressing. Completing work but not being challenged. "
                       "Scores are adequate but XP growth is flat.",
        "color": "#00cfff",
        "intervention_summary": "Challenge: introduce harder content variants, peer leaderboard comparisons.",
    },
    2: {
        "label": "Struggling",
        "description": "High error rates, slow response times, and declining quiz scores indicate "
                       "the learner needs additional scaffolding and support.",
        "color": "#ffcc00",
        "intervention_summary": "Scaffold: reduce difficulty, increase flashcard reviews, slow content pace.",
    },
    3: {
        "label": "Burning Out",
        "description": "Was performing well but now showing rapid decline. Short sessions, "
                       "high skip rates, and broken streaks signal fatigue.",
        "color": "#ff8800",
        "intervention_summary": "Recovery: micro-sessions, confidence-building easy content, streak protection.",
    },
    4: {
        "label": "Disengaged",
        "description": "Near-dropout state. Minimal activity, very low completion, "
                       "long gaps between sessions. Requires immediate reactivation.",
        "color": "#ff4444",
        "intervention_summary": "Reactivate: 5-minute micro-lessons, gamification push, re-engagement notification.",
    },
}


@router.get("/states", response_model=List[StateInfoResponse], summary="List all PULSE learner states")
async def get_states():
    """
    Returns information about all 5 PULSE learner states including
    description, color code, and intervention summary.
    """
    return [
        StateInfoResponse(
            state_id=sid,
            label=info["label"],
            description=info["description"],
            color=info["color"],
            intervention_summary=info["intervention_summary"],
        )
        for sid, info in STATE_INFO.items()
    ]


@router.post("/predict", response_model=PULSEPrediction, summary="Predict learner state (single)")
async def predict(request: LearnerFeaturesRequest):
    """
    Classifies a single learner into one of 5 PULSE states and returns:
    - Predicted state + confidence
    - State probabilities across all 5 states
    - Top behavioral factors driving the prediction
    - Full intervention plan (curriculum restructuring instructions)
    - Human-readable explanation summary

    **Called by the FluentFusion backend every 24 hours per learner (Celery task),
    and on-demand when a learner logs in.**
    """
    if not ModelLoader.is_ready():
        raise HTTPException(
            status_code=503,
            detail="PULSE model not loaded. Run the ML notebook first to generate artifacts."
        )

    try:
        result = predict_single(request)
        logger.info(
            f"Predicted learner={request.learner_id} "
            f"state={result.predicted_label} "
            f"confidence={result.confidence:.3f}"
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Prediction error for learner {request.learner_id}: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed")


@router.post("/batch", response_model=BatchPredictResponse, summary="Predict states for multiple learners")
async def batch_predict(request: BatchPredictRequest):
    """
    Batch prediction for up to 500 learners.

    **Used by the daily Celery task** that re-evaluates all active learners
    and updates the `learner_state` column in the FluentFusion PostgreSQL database.
    """
    if not ModelLoader.is_ready():
        raise HTTPException(
            status_code=503,
            detail="PULSE model not loaded."
        )

    t0 = time.time()
    try:
        predictions = predict_batch(request.learners)
        elapsed_ms = (time.time() - t0) * 1000

        logger.info(
            f"Batch prediction complete: {len(predictions)} learners "
            f"in {elapsed_ms:.1f}ms ({elapsed_ms/len(predictions):.2f}ms/learner)"
        )

        return BatchPredictResponse(
            predictions=predictions,
            total=len(predictions),
            processing_time_ms=elapsed_ms,
        )
    except Exception as e:
        logger.error(f"Batch prediction error: {e}")
        raise HTTPException(status_code=500, detail="Batch prediction failed")


@router.get("/model-info", summary="PULSE model metadata and performance")
async def model_info():
    """Returns model version, training accuracy, F1 score, and feature count."""
    meta = ModelLoader.metadata
    model_info = meta.get("model_info", {})

    return {
        "model_name": "Gradient Boosting Classifier",
        "version": model_info.get("version", "unknown"),
        "trained_on": model_info.get("trained_on"),
        "test_accuracy": model_info.get("test_accuracy"),
        "test_f1": model_info.get("test_f1"),
        "n_features": model_info.get("n_features"),
        "n_classes": 5,
        "classes": ModelLoader.STATE_LABELS,
        "supported_native_languages": meta.get("native_language_classes", []),
        "supported_target_languages": meta.get("target_language_classes", []),
        "model_ready": ModelLoader.is_ready(),
    }


@router.get("/feature-importance", summary="Top features driving PULSE state classification")
async def feature_importance(top_n: int = Query(default=20, ge=5, le=45)):
    """
    Returns the top N most important features for the PULSE classification model.
    Used by the FluentFusion admin analytics dashboard.
    """
    if not ModelLoader.is_ready():
        raise HTTPException(status_code=503, detail="Model not loaded.")

    import numpy as np
    importances = ModelLoader.model.feature_importances_
    feature_cols = ModelLoader.metadata["feature_cols"]

    top_idx = np.argsort(importances)[::-1][:top_n]

    from app.pulse.services.pulse_service import FEATURE_HUMAN_LABELS
    return {
        "top_features": [
            {
                "rank": i + 1,
                "feature": feature_cols[idx],
                "human_label": FEATURE_HUMAN_LABELS.get(feature_cols[idx], feature_cols[idx]),
                "importance": float(importances[idx]),
                "importance_pct": float(importances[idx] / importances.sum() * 100),
            }
            for i, idx in enumerate(top_idx)
        ],
        "total_features": len(feature_cols),
    }
