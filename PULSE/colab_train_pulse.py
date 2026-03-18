# ╔══════════════════════════════════════════════════════════════════╗
# ║  PULSE ML — Google Colab Training Script                        ║
# ║  1. Upload your archive/ CSVs when prompted                     ║
# ║  2. Run all cells                                               ║
# ║  3. Download pulse_artifacts.zip from the Files panel           ║
# ║  4. Unzip into PULSE/pulse_artifacts/ in your local project     ║
# ╚══════════════════════════════════════════════════════════════════╝

# ── Cell 1: Install & imports ─────────────────────────────────────
!pip install -q scikit-learn joblib

import numpy as np
import pandas as pd
import pickle, json, warnings, zipfile
from pathlib import Path
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, f1_score

warnings.filterwarnings('ignore')
ARTIFACTS_DIR = Path('pulse_artifacts')
ARTIFACTS_DIR.mkdir(exist_ok=True)
print("✅ Ready")

# ── Cell 2: Upload archive CSVs ───────────────────────────────────
# Upload these 10 files from your local archive/ folder:
#   studentInfo.csv, studentAssessment.csv, studentRegistration.csv,
#   studentVle_0.csv … studentVle_7.csv
from google.colab import files
uploaded = files.upload()   # <-- file picker appears here
print("Uploaded:", list(uploaded.keys()))

# ── Cell 3: Load data ─────────────────────────────────────────────
RANDOM_STATE = 42
STATE_LABELS = {0: "thriving", 1: "coasting", 2: "struggling", 3: "burning_out", 4: "disengaged"}

print("Loading OULAD data...")
info   = pd.read_csv('studentInfo.csv')
assess = pd.read_csv('studentAssessment.csv')
reg    = pd.read_csv('studentRegistration.csv')
vle    = pd.concat([pd.read_csv(f'studentVle_{i}.csv') for i in range(8)], ignore_index=True)
print(f"  info={info.shape}, assess={assess.shape}, reg={reg.shape}, vle={vle.shape}")

# ── Cell 4: Feature engineering ───────────────────────────────────
# Deduplicate — one row per student (keep best result)
RESULT_PRIORITY = {'Distinction': 0, 'Pass': 1, 'Fail': 2, 'Withdrawn': 3}
info['_priority'] = info['final_result'].map(RESULT_PRIORITY).fillna(3)
info = info.sort_values('_priority').drop_duplicates('id_student', keep='first').drop(columns='_priority')
print(f"  Unique students: {len(info)}")

# Registration features
reg['date_unregistration'] = pd.to_numeric(reg['date_unregistration'], errors='coerce')
reg_feats = (
    reg.groupby('id_student')
       .agg(days_registered_before_start=('date_registration', 'min'),
            date_unregistration=('date_unregistration', 'min'))
       .reset_index()
)
reg_feats['withdrew_early'] = (
    reg_feats['date_unregistration'].notna() & (reg_feats['date_unregistration'] <= 0)
).astype(int)

# Map final_result → PULSE state
def map_state(row):
    if row['final_result'] == 'Distinction': return 0
    if row['final_result'] == 'Pass':        return 1
    if row['final_result'] == 'Fail':        return 2
    unreg = reg_feats.loc[reg_feats['id_student'] == row['id_student'], 'date_unregistration']
    if unreg.empty or pd.isna(unreg.iloc[0]) or unreg.iloc[0] <= 0:
        return 4  # Disengaged
    return 3      # Burning Out

info['learner_state'] = info.apply(map_state, axis=1)

# VLE features
vle_feats = (
    vle.groupby('id_student')
       .agg(total_clicks=('sum_click', 'sum'), active_days=('date', 'nunique'))
       .reset_index()
)
vle_feats['avg_clicks_per_day'] = vle_feats['total_clicks'] / vle_feats['active_days'].replace(0, 1)

# Assessment features
assess_clean = assess[assess['score'].notna()].copy()
assess_feats = (
    assess_clean.groupby('id_student')
                .agg(avg_score=('score', 'mean'),
                     num_assessments=('id_assessment', 'count'),
                     days_to_first_submit=('date_submitted', 'min'))
                .reset_index()
)

# Merge
df = (
    info[['id_student', 'num_of_prev_attempts', 'studied_credits',
          'gender', 'highest_education', 'imd_band', 'age_band',
          'disability', 'learner_state']]
    .merge(vle_feats,    on='id_student', how='left')
    .merge(assess_feats, on='id_student', how='left')
    .merge(reg_feats[['id_student', 'days_registered_before_start', 'withdrew_early']],
           on='id_student', how='left')
)

df['total_clicks']               = df['total_clicks'].fillna(0)
df['active_days']                = df['active_days'].fillna(0)
df['avg_clicks_per_day']         = df['avg_clicks_per_day'].fillna(0)
df['avg_score']                  = df['avg_score'].fillna(0)
df['num_assessments']            = df['num_assessments'].fillna(0)
df['days_to_first_submit']       = df['days_to_first_submit'].fillna(999)
df['withdrew_early']             = df['withdrew_early'].fillna(0)
df['days_registered_before_start'] = df['days_registered_before_start'].fillna(0)

# Composite scores
max_clicks = df['total_clicks'].quantile(0.95).clip(1)
df['engagement_score']  = (df['total_clicks'] / max_clicks).clip(0, 1)
df['performance_score'] = (df['avg_score'] / 100).clip(0, 1)
df['decline_index']     = (
    df['withdrew_early'] * 0.5 +
    (1 - df['engagement_score']) * 0.3 +
    (df['num_of_prev_attempts'] / (df['num_of_prev_attempts'].max() + 1)) * 0.2
).clip(0, 1)
df['consistency_score'] = (df['active_days'] / df['active_days'].quantile(0.95).clip(1)).clip(0, 1)

df = df.drop(columns=['id_student'])
print(f"  Dataset shape: {df.shape}")
print("  State distribution:", df['learner_state'].value_counts().sort_index().to_dict())

# ── Cell 5: Encode + split + scale ───────────────────────────────
df_model = df.copy()
label_encoders = {}
CAT_COLS = [c for c in ['gender', 'highest_education', 'imd_band', 'age_band', 'disability'] if c in df_model.columns]
for col in CAT_COLS:
    df_model[col] = df_model[col].astype(str).fillna('Unknown')
    le = LabelEncoder()
    df_model[col] = le.fit_transform(df_model[col])
    label_encoders[col] = le

FEATURE_COLS = [c for c in df_model.columns if c != 'learner_state']
X = df_model[FEATURE_COLS].values
y = df_model['learner_state'].values

X_temp, X_test, y_temp, y_test = train_test_split(X, y, test_size=0.15, random_state=RANDOM_STATE, stratify=y)
X_train, X_val, y_train, y_val = train_test_split(X_temp, y_temp, test_size=0.15/0.85, random_state=RANDOM_STATE, stratify=y_temp)

scaler    = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s  = scaler.transform(X_test)
print(f"  Train={X_train.shape[0]}, Val={X_val.shape[0]}, Test={X_test.shape[0]}")

# ── Cell 6: Train ─────────────────────────────────────────────────
# Note: GradientBoosting is CPU-only in sklearn — Colab CPU is still
# much faster than local due to more RAM for the 10M-row VLE data.
print("Training GradientBoostingClassifier (this takes ~3-5 min on Colab)...")
model = GradientBoostingClassifier(
    n_estimators=300, learning_rate=0.08, max_depth=5, random_state=RANDOM_STATE
)
model.fit(X_train_s, y_train)

y_pred   = model.predict(X_test_s)
test_acc = accuracy_score(y_test, y_pred)
test_f1  = f1_score(y_test, y_pred, average='weighted')
print(f"  Test accuracy : {test_acc:.4f}")
print(f"  Test F1       : {test_f1:.4f}")

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)
cv_scores = cross_val_score(model, X_train_s, y_train, cv=cv, scoring='f1_weighted')
print(f"  CV F1 mean    : {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

# ── Cell 7: Save artifacts + zip for download ─────────────────────
with open(ARTIFACTS_DIR / 'pulse_model.pkl',    'wb') as f: pickle.dump(model, f)
with open(ARTIFACTS_DIR / 'pulse_scaler.pkl',   'wb') as f: pickle.dump(scaler, f)
with open(ARTIFACTS_DIR / 'label_encoders.pkl', 'wb') as f: pickle.dump(label_encoders, f)

metadata = {
    'model_info': {
        'algorithm'    : 'GradientBoostingClassifier',
        'version'      : '1.0.0',
        'n_estimators' : int(model.n_estimators),
        'learning_rate': float(model.learning_rate),
        'max_depth'    : int(model.max_depth),
        'n_features'   : len(FEATURE_COLS),
        'n_classes'    : 5,
        'test_accuracy': round(test_acc, 4),
        'test_f1'      : round(test_f1, 4),
        'cv_mean_f1'   : round(float(cv_scores.mean()), 4),
        'cv_std_f1'    : round(float(cv_scores.std()), 4),
    },
    'training_info': {
        'n_samples'    : int(len(df)),
        'train_samples': int(X_train.shape[0]),
        'test_samples' : int(X_test.shape[0]),
        'random_state' : RANDOM_STATE,
    },
    'features'             : FEATURE_COLS,
    'categorical_features' : list(label_encoders.keys()),
    'state_labels'         : {str(k): v for k, v in STATE_LABELS.items()},
}
with open(ARTIFACTS_DIR / 'pulse_metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

# Zip everything for one-click download
with zipfile.ZipFile('pulse_artifacts.zip', 'w') as z:
    for p in ARTIFACTS_DIR.iterdir():
        z.write(p, p.name)

print("\n✅ Artifacts saved:")
for name in ['pulse_model.pkl', 'pulse_scaler.pkl', 'label_encoders.pkl', 'pulse_metadata.json']:
    p = ARTIFACTS_DIR / name
    print(f"   {name:<30} {p.stat().st_size:>10,} bytes")

# Auto-download the zip
files.download('pulse_artifacts.zip')
print("\n✅ pulse_artifacts.zip downloaded — unzip into PULSE/pulse_artifacts/ in your project.")
