import numpy as np
import pandas as pd
import pickle
import json
from pathlib import Path

# --- 1. Define Paths to Artifacts ---
# Adjust this path if your artifacts are in a different location relative to the script
ARTIFACTS_DIR = Path("pulse_artifacts")

MODEL_PATH = ARTIFACTS_DIR / "pulse_model.pkl"
SCALER_PATH = ARTIFACTS_DIR / "pulse_scaler.pkl"
LABEL_ENCODERS_PATH = ARTIFACTS_DIR / "label_encoders.pkl"
METADATA_PATH = ARTIFACTS_DIR / "pulse_metadata.json"

# --- 2. Load all artifacts from disk ---
print("Loading PULSE artifacts...")
with open(MODEL_PATH, 'rb') as f: 
    pulse_model = pickle.load(f)
with open(SCALER_PATH, 'rb') as f: 
    scaler = pickle.load(f)
with open(LABEL_ENCODERS_PATH, 'rb') as f: 
    label_encoders = pickle.load(f)
with open(METADATA_PATH, 'r') as f: 
    metadata = json.load(f)

FEATURE_COLS = metadata['features']
STATE_LABELS = {int(k): v for k, v in metadata['state_labels'].items()}
INTERVENTION_MAP = {int(k): v for k, v in metadata['intervention_map'].items()}
CAT_COLS = metadata['categorical_features']

print("✅  All artifacts loaded successfully.")

# --- 3. Recreate explain_learner function and constants (from notebook Section 8) ---
FEATURE_HUMAN_LABELS = {
    'xp_trend_score'             : 'XP trend (weekly)',
    'decline_index'              : 'Decline risk index',
    'engagement_score'           : 'Overall engagement',
    'performance_score'          : 'Overall performance',
    'consistency_score'          : 'Study consistency',
    'speaking_engagement'        : 'Speaking engagement',
    'streak_days'                : 'Current streak (days)',
    'avg_quiz_score'             : 'Avg quiz score',
    'session_dropout_rate'       : 'Session dropout rate',
    'daily_challenge_completion' : 'Daily challenge rate',
    'days_since_last_activity'   : 'Days since last activity',
    'session_completion_rate'    : 'Session completion rate',
    'quiz_pass_rate'             : 'Quiz pass rate',
    'lesson_completion_pct'      : 'Lesson completion %',
    'flashcards_reviewed_per_day': 'Flashcards / day',
}

HIGH_IS_BAD = {
    'session_dropout_rate', 'decline_index', 'days_since_last_activity',
    'days_since_last_session', 'grammar_errors_per_session',
    'pronunciation_errors', 'lesson_skip_rate', 'hint_usage_rate'
}

def explain_learner(feature_vector: np.ndarray, top_n: int = 5) -> list:
    """
    Returns top_n most influential features for a single learner.
    feature_vector: 1-D array of raw (unscaled) feature values.
    """
    # Ensure feature_vector has the correct shape for scaling
    scaled = scaler.transform(feature_vector.reshape(1, -1))[0]
    weighted = np.abs(scaled) * pulse_model.feature_importances_
    top_idx = np.argsort(weighted)[::-1][:top_n]
    factors = []
    for idx in top_idx:
        name = FEATURE_COLS[idx]
        label = FEATURE_HUMAN_LABELS.get(name, name.replace('_', ' ').title())
        val = feature_vector[idx]
        # Determine direction based on whether higher values are generally 'bad'
        direction = '↑' if (val > np.mean(feature_vector)) != (name in HIGH_IS_BAD) else '↓'

        factors.append({
            'feature': name,
            'label': label,
            'value': round(float(val), 3),
            'importance': round(float(pulse_model.feature_importances_[idx]), 4),
            'direction': direction,
        })
    return factors

# --- 4. Define a sample learner's raw input data ---
sample_learner_data = {
    'num_of_prev_attempts'        : 1,
    'studied_credits'             : 60,
    'total_clicks'                : 120,
    'active_days'                 : 8,
    'avg_clicks_per_day'          : 15.0,
    'avg_score'                   : 48.0,
    'num_assessments'             : 2,
    'days_to_first_submit'        : 25,
    'days_registered_before_start': -5,
    'withdrew_early'              : 0,
    'engagement_score'            : 0.18,
    'performance_score'           : 0.48,
    'decline_index'               : 0.65,
    'consistency_score'           : 0.20,
    # Categorical features - use their raw string values
    'gender'             : 'M',
    'highest_education'  : 'A Level or Equivalent',
    'imd_band'           : '20-30%',
    'age_band'           : '35-55',
    'disability'         : 'N',
}

# --- 5. Preprocess the sample learner data ---
# Encode categorical features
processed_learner_data = sample_learner_data.copy()
for col in CAT_COLS:
    raw_value = processed_learner_data[col]
    le = label_encoders[col]
    # Handle unseen categories: map to a default (e.g., 0) or the most frequent category
    if raw_value in le.classes_:
        processed_learner_data[col] = int(le.transform([raw_value])[0])
    else:
        # Assign a default (e.g., 0) for unseen categories
        # In a real system, you might log this or have a more sophisticated strategy
        processed_learner_data[col] = 0 
        print(f"Warning: Unseen category '{raw_value}' for feature '{col}'. Assigning 0.")

# Build ordered feature vector
feature_vector = np.array(
    [processed_learner_data[f] for f in FEATURE_COLS], dtype=float)

# Scale numerical features
scaled_vector = scaler.transform(feature_vector.reshape(1, -1))

# --- 6. Make a prediction ---
pred_state = int(pulse_model.predict(scaled_vector)[0])
pred_proba = pulse_model.predict_proba(scaled_vector)[0]
confidence = float(pred_proba[pred_state])

# --- 7. Interpret Results ---
intervention = INTERVENTION_MAP[pred_state]
factors = explain_learner(feature_vector, top_n=5)

# --- 8. Print full result ---
print("\n" + "=" * 60)
print("  PULSE Prediction Result (from VS Code)")
print("=" * 60)
print(f"  Predicted State : {pred_state} — {STATE_LABELS[pred_state]}")
print(f"  Confidence      : {confidence:.2%}")
print("  State Probabilities:")
for i, p in enumerate(pred_proba):
    bar = chr(9608) * int(p * 30) # Visual bar for probability
    print(f"    {STATE_LABELS[i]:<15} {p:.3f}  {bar}")
print("  Top 5 Driving Factors:")
for f in factors:
    print(f"    {f['direction']} {f['label']:<35} {f['value']}")
print("  Intervention Plan:")
print(f"    Action         : {intervention['curriculum_action']}")
print(f"    Session target : {intervention['session_target_min']} min")
print(f"    Difficulty     : {intervention['difficulty_adjustment']:+d}")
print(f"    Flashcards/day : {intervention['flashcards_per_day']}")
print(f"    Message        : {intervention['notification_message']}")
print("=" * 60)