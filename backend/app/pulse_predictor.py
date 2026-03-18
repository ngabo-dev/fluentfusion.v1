"""
PULSE inference helper.
Loaded once at startup via module-level singleton.
Used by POST /api/admin/pulse/predict  and  POST /api/admin/pulse/run
"""
import pickle, json, warnings
import numpy as np
from pathlib import Path

warnings.filterwarnings("ignore")

ARTIFACTS_DIR = Path(__file__).parent.parent.parent / "PULSE" / "pulse_artifacts"

STATE_MAP = {
    0: "thriving",
    1: "coasting",
    2: "struggling",
    3: "burning_out",
    4: "disengaged",
}

class _PulsePredictor:
    def __init__(self):
        self._model    = None
        self._scaler   = None
        self._encoders = None
        self._meta     = None

    def _load(self):
        if self._model is not None:
            return
        if not (ARTIFACTS_DIR / "pulse_model.pkl").exists():
            raise FileNotFoundError(
                "PULSE artifacts not found. "
                "Run PULSE/colab_train_pulse.py on Colab, then unzip "
                "pulse_artifacts.zip into PULSE/pulse_artifacts/."
            )
        with open(ARTIFACTS_DIR / "pulse_model.pkl",    "rb") as f: self._model    = pickle.load(f)
        with open(ARTIFACTS_DIR / "pulse_scaler.pkl",   "rb") as f: self._scaler   = pickle.load(f)
        with open(ARTIFACTS_DIR / "label_encoders.pkl", "rb") as f: self._encoders = pickle.load(f)
        with open(ARTIFACTS_DIR / "pulse_metadata.json","r")  as f: self._meta     = json.load(f)

    @property
    def is_ready(self) -> bool:
        return (ARTIFACTS_DIR / "pulse_model.pkl").exists()

    @property
    def metadata(self) -> dict:
        self._load()
        return self._meta

    def predict_one(self, features: dict) -> dict:
        """
        features: dict with keys matching FEATURE_COLS from metadata.
        Categorical fields (gender, highest_education, imd_band, age_band, disability)
        should be passed as raw strings — encoding is handled here.
        Returns: { state_id, state_label, confidence, probabilities }
        """
        self._load()
        feat_copy = dict(features)

        # Encode categoricals
        for col, enc in self._encoders.items():
            raw = str(feat_copy.get(col, "Unknown"))
            feat_copy[col] = int(enc.transform([raw])[0]) if raw in enc.classes_ else 0

        # Build ordered feature vector
        vec = np.array(
            [feat_copy.get(f, 0) for f in self._meta["features"]], dtype=float
        ).reshape(1, -1)

        scaled     = self._scaler.transform(vec)
        state_id   = int(self._model.predict(scaled)[0])
        proba      = self._model.predict_proba(scaled)[0]
        confidence = float(proba[state_id])

        return {
            "state_id"    : state_id,
            "state_label" : STATE_MAP[state_id],
            "confidence"  : round(confidence, 4),
            "probabilities": {STATE_MAP[i]: round(float(p), 4) for i, p in enumerate(proba)},
        }

    def predict_batch(self, rows: list[dict]) -> list[dict]:
        """rows: list of feature dicts. Returns list of prediction dicts."""
        self._load()
        results = []
        for row in rows:
            feat_copy = dict(row)
            for col, enc in self._encoders.items():
                raw = str(feat_copy.get(col, "Unknown"))
                feat_copy[col] = int(enc.transform([raw])[0]) if raw in enc.classes_ else 0
            vec    = np.array([feat_copy.get(f, 0) for f in self._meta["features"]], dtype=float)
            results.append(vec)

        matrix = np.array(results)
        scaled  = self._scaler.transform(matrix)
        states  = self._model.predict(scaled).tolist()
        probas  = self._model.predict_proba(scaled).tolist()

        return [
            {
                "state_id"    : int(s),
                "state_label" : STATE_MAP[int(s)],
                "confidence"  : round(float(probas[i][int(s)]), 4),
                "probabilities": {STATE_MAP[j]: round(float(p), 4) for j, p in enumerate(probas[i])},
            }
            for i, s in enumerate(states)
        ]


# Singleton — imported by admin router
predictor = _PulsePredictor()
