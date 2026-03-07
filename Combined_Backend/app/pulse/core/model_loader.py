"""
Model Loader
============
Loads PULSE model artifacts on service startup.
Keeps them in memory for fast inference on every request.
"""

import pickle
import json
import logging
import os
from typing import Optional, Dict, Any

logger = logging.getLogger("pulse.model_loader")


class ModelLoader:
    """Singleton that holds all PULSE model artifacts in memory."""

    model = None
    scaler = None
    encoders = None
    metadata: Dict[str, Any] = {}

    # ── Intervention map: state_id → curriculum action config
    INTERVENTION_MAP = {
        0: {  # Thriving
            "curriculum_action": "accelerate",
            "session_target_minutes": 35,
            "difficulty_adjustment": 1,
            "lesson_type_weights": {"grammar": 0.35, "vocabulary": 0.25, "speaking": 0.25, "listening": 0.15},
            "flashcard_daily_target": 30,
            "notification_type": "challenge",
            "streak_action": "maintain",
            "community_prompt": True,
            "message": "You are in peak learning mode! We have unlocked advanced content for you.",
        },
        1: {  # Coasting
            "curriculum_action": "challenge",
            "session_target_minutes": 25,
            "difficulty_adjustment": 1,
            "lesson_type_weights": {"grammar": 0.30, "vocabulary": 0.30, "speaking": 0.25, "listening": 0.15},
            "flashcard_daily_target": 25,
            "notification_type": "motivate",
            "streak_action": "maintain",
            "community_prompt": False,
            "message": "You're making steady progress! Let's add some new challenges to keep you growing.",
        },
        2: {  # Struggling
            "curriculum_action": "scaffold",
            "session_target_minutes": 20,
            "difficulty_adjustment": -1,
            "lesson_type_weights": {"grammar": 0.20, "vocabulary": 0.40, "speaking": 0.15, "listening": 0.25},
            "flashcard_daily_target": 40,
            "notification_type": "support",
            "streak_action": "encourage",
            "community_prompt": False,
            "message": "We noticed some areas need more practice. We have adjusted your plan to build your confidence.",
        },
        3: {  # Burning Out
            "curriculum_action": "recovery",
            "session_target_minutes": 10,
            "difficulty_adjustment": -2,
            "lesson_type_weights": {"grammar": 0.15, "vocabulary": 0.25, "speaking": 0.20, "listening": 0.40},
            "flashcard_daily_target": 10,
            "notification_type": "rest",
            "streak_action": "protect",
            "community_prompt": False,
            "message": "You have been working hard. Today, let us take it easy with a lighter session.",
        },
        4: {  # Disengaged
            "curriculum_action": "reactivate",
            "session_target_minutes": 5,
            "difficulty_adjustment": -2,
            "lesson_type_weights": {"grammar": 0.10, "vocabulary": 0.30, "speaking": 0.10, "listening": 0.50},
            "flashcard_daily_target": 5,
            "notification_type": "reengagement",
            "streak_action": "rebuild",
            "community_prompt": True,
            "message": "We miss you! Here is a 5-minute micro-lesson to get back on track. No pressure.",
        },
    }

    STATE_LABELS = {
        0: "Thriving",
        1: "Coasting",
        2: "Struggling",
        3: "Burning Out",
        4: "Disengaged",
    }

    @classmethod
    async def load(cls):
        """Load all artifacts. Called once on FastAPI startup."""
        from app.config import settings

        # Resolve paths — support both relative and absolute
        def resolve(path):
            return os.path.abspath(path)

        try:
            with open(resolve(settings.PULSE_MODEL_PATH), "rb") as f:
                cls.model = pickle.load(f)
            logger.info("✅ PULSE model loaded")

            with open(resolve(settings.PULSE_SCALER_PATH), "rb") as f:
                cls.scaler = pickle.load(f)
            logger.info("✅ StandardScaler loaded")

            with open(resolve(settings.PULSE_ENCODERS_PATH), "rb") as f:
                cls.encoders = pickle.load(f)
            logger.info("✅ Label encoders loaded")

            with open(resolve(settings.PULSE_METADATA_PATH)) as f:
                cls.metadata = json.load(f)
            logger.info(f"✅ Metadata loaded | {len(cls.metadata['feature_cols'])} features")

        except FileNotFoundError as e:
            logger.error(f"❌ Artifact not found: {e}")
            logger.warning("⚠️  Running in DEMO mode — model artifacts not found")
            cls._load_demo_mode()

    @classmethod
    def _load_demo_mode(cls):
        """Fallback when artifacts are not yet generated (before notebook is run)."""
        cls.metadata = {
            "feature_cols": [],
            "state_labels": {str(k): v for k, v in cls.STATE_LABELS.items()},
            "model_info": {"version": "demo", "test_accuracy": None, "test_f1": None, "n_features": 0},
            "native_language_classes": ["Kinyarwanda", "French", "Swahili", "Arabic", "Mandarin", "Spanish", "English"],
            "target_language_classes": ["English", "French", "Spanish", "German", "Japanese", "Mandarin"],
            "subscription_classes": ["enterprise", "free", "pro"],
        }
        logger.warning("Running in DEMO mode — run the ML notebook first to generate artifacts")

    @classmethod
    def is_ready(cls) -> bool:
        return cls.model is not None and cls.scaler is not None
