# FluentFusion AI — Unified Backend

One service combining the **FluentFusion language learning platform API** with the **PULSE ML engine**.

## Services at a Glance

| Service | Prefix | Description |
|---------|--------|-------------|
| Platform API | `/api/v1/` | Auth, users, courses, lessons, practice, live, community, gamification, payments, admin |
| PULSE ML | `/api/v1/pulse/` | Learner state prediction, batch scoring, interventions, explainability |

## Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Set up environment
cp .env.example .env
# Edit .env with your DB, Redis, Stripe, etc.

# 3. Run
uvicorn app.main:app --port 8000 --reload

# Docs available at http://localhost:8000/docs
```

## Docker

```bash
docker-compose up --build
```

## PULSE Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/pulse/states` | All 5 learner states with descriptions |
| `POST` | `/api/v1/pulse/predict` | Single learner state prediction |
| `POST` | `/api/v1/pulse/batch` | Batch predict up to 500 learners |
| `GET` | `/api/v1/pulse/model-info` | Model version, accuracy, F1 |
| `GET` | `/api/v1/pulse/feature-importance` | Top N features |
| `GET` | `/health` | Unified health (platform + PULSE model status) |

## Project Structure

```
app/
├── main.py              # Unified FastAPI entry point
├── config.py            # All settings (platform + PULSE)
├── database.py          # SQLAlchemy engine & session
├── dependencies.py      # Shared FastAPI dependencies
├── models/              # SQLAlchemy models (12 tables)
├── schemas/             # Pydantic request/response schemas
├── utils/               # Security, email helpers
├── api/v1/              # All route handlers
│   ├── auth.py          # JWT login/register
│   ├── users.py
│   ├── courses.py
│   ├── lessons.py
│   ├── practice.py
│   ├── live.py
│   ├── community.py
│   ├── gamification.py
│   ├── payments.py
│   ├── admin.py
│   └── pulse.py         # PULSE ML endpoints
└── pulse/               # PULSE ML sub-package
    ├── core/
    │   └── model_loader.py   # Artifact loading singleton
    ├── services/
    │   └── pulse_service.py  # Inference logic
    └── pulse.py              # Pydantic schemas for PULSE

pulse_artifacts/         # Trained model files (included)
├── pulse_model.pkl      # GradientBoosting classifier (97.5% accuracy)
├── pulse_scaler.pkl     # StandardScaler
├── label_encoders.pkl   # LabelEncoders for categorical features
└── pulse_metadata.json  # Model metadata & feature list
```
