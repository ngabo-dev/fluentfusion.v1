# FluentFusion
### ML-Powered Language Learning Platform with AI Live Translation

> Bridging communication gaps for Rwanda tourism through real-time Kinyarwanda translation, personalized learning, and the PULSE engagement engine.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-2.0+-FF6600?logo=python&logoColor=white)
![License](https://img.shields.io/badge/License-Proprietary-red)

---

## 📺 Demo Video
▶️ [Watch the Demo Video](https://drive.google.com/file/d/1Jmw5G3UtJNtFh7zO59kEKoAO31h9_hs4/view?usp=sharing)

## 🌐 Live App
🚀 [Open the Live App](https://fluentfusionv1.vercel.app/)
🔧 [Backend API](https://fluentfusion-v1.onrender.com)
📖 [Swagger Docs](https://fluentfusion-v1.onrender.com/docs)
📦 [GitHub Repository](https://github.com/ngabo-dev/fluentfusion.v1)

---

## 🗣️ Panel Feedback & How It Was Addressed

This section documents the feedback received from the defense panel and the specific changes made in response.

### Feedback 1: "The use of the term AI should be discouraged from the title — ML was used, not AI"
**Response:** The title has been updated from *"AI-Powered Language Learning Platform"* to *"ML-Powered Language Learning Platform with AI Live Translation"*. The distinction is now explicit: PULSE uses **ML** (XGBoost classifier) for engagement prediction, while the new **Live Translation** feature uses a genuine **AI** component — Google Translate via the `deep-translator` library — to provide real-time Kinyarwanda translation. This directly addresses the concern by separating the two technologies and ensuring the AI label is only applied where a language model is actually used.

### Feedback 2: "The use of a dataset from Kaggle to learn a local language in Rwanda may not work. Consider using an LLM API to help foreigners learn the local language"
**Response:** A dedicated **Live Translation** feature has been implemented (`/dashboard/translate`). It uses `deep-translator` (Google Translate API wrapper) to provide real-time, accurate translation between English and Kinyarwanda (and 8 other languages). The feature includes:
- Phonetic romanization guides (e.g. "Murakoze" → `/mu-ra-KO-ze/`) to help tourists pronounce Kinyarwanda correctly
- Rwanda tourism-specific quick phrases (hospital, transport, costs, national parks)
- Bidirectional translation (English ↔ Kinyarwanda)
- No API key required, no rate limits — works immediately for any user

The OULAD dataset is no longer used for language learning. It is used exclusively for the PULSE engagement classifier, which predicts learner engagement states — a task it is appropriate for (student behaviour data). Language learning for tourists is now handled by the translation engine.

### Feedback 3: "The literature review does not critically justify why an AI-driven personalized learning system is the most appropriate solution"
**Response:** Acknowledged in the report. The literature review has been revised to include a critical comparison section that evaluates simpler alternatives (phrasebooks, Google Translate standalone, human guides) against the platform approach, and justifies the hybrid solution: immediate translation for tourists who need quick communication, combined with structured learning for longer-stay visitors and language students.

### Feedback 4: "The system design is built on weak assumptions — tourists will not engage in structured language learning"
**Response:** Acknowledged and addressed in the report. The system design section now explicitly distinguishes two user personas: (1) **tourists** who use the Live Translation feature for immediate communication needs without any structured learning, and (2) **language learners** (students, diaspora, professionals) who engage with courses, quizzes, and the PULSE engine. The platform no longer assumes all users will follow a structured curriculum.

### Feedback 5: "Lack of benchmarking against simpler alternatives"
**Response:** A benchmarking section has been added to the evaluation chapter comparing FluentFusion's Live Translation against Google Translate standalone and phrasebook apps on metrics of: accuracy for Kinyarwanda, phonetic guidance, cultural context, and offline availability. The PULSE engine is benchmarked against a baseline random classifier and a simple rule-based threshold system.

### Feedback 6: "Results evaluation focuses on vocabulary improvement rather than actual communication outcomes"
**Response:** The evaluation chapter has been revised to include communication outcome metrics: translation accuracy for tourism-relevant phrases (verified against native speaker review), task completion rate (can a tourist successfully ask for directions using the tool?), and a discussion of the limitations of measuring real-world adoption without a field study.

### Feedback 7: "Conclusions overstate the system's ability to bridge communication gaps"
**Response:** The conclusion has been revised to use measured language. Claims are now scoped to what was demonstrated: the system provides accurate Kinyarwanda translation for common tourism phrases, and the PULSE engine achieves 72.93% accuracy on engagement classification. No claims are made about real-world adoption without empirical evidence.

---

## 🎯 About the Project

FluentFusion is a full-stack language learning and communication platform built for the ALU Capstone Project. It addresses the communication barrier between tourists and local communities in Rwanda by providing two complementary tools:

1. **Live Translation** — instant Kinyarwanda ↔ English translation powered by Google Translate, with phonetic guides and tourism-specific phrases. No account needed for translation.
2. **Structured Learning** — full language learning platform with courses, quizzes, live sessions, and the PULSE ML engine for engagement tracking.

Three roles — **Students, Instructors, Admins** — each with a fully dedicated dashboard, sidebar navigation, and feature set.

Key highlights:
- 🔐 **JWT Authentication** — Register, login, OTP email verification, password reset, Google OAuth
- 🎓 **4-Step Onboarding** — Native language → target language → goal → level (persisted to DB)
- 📊 **Role-Based Dashboards** — Separate layouts and routes for all three roles
- 📧 **Dual Email Provider** — SendGrid API (production) with Gmail SMTP fallback (local dev)
- 🧠 **PULSE ML Engine** — XGBoost classifier (72.93% accuracy) trained on OULAD dataset for engagement prediction
- 🌍 **Live Translation** — Real-time Kinyarwanda translation via Google Translate (deep-translator), no API key needed
- 🎥 **WebRTC Live Sessions** — Real-time video/audio meetings with WebSocket signaling
- 🔒 **Ethics & Compliance** — GDPR consent management, data subject requests, REC approval J26BSE087

---

## 🚀 Features

### ✅ Implemented

| Feature | Details |
|---|---|
| Authentication | Email/password signup & login, JWT, OTP verification, password reset, Google OAuth |
| Onboarding | 4-step setup persisted to DB: native lang → learn lang → goal → level |
| Student Dashboard | XP, pulse state, enrolled courses, live sessions, leaderboard (real DB data) |
| Instructor Dashboard | Courses, students, sessions, quizzes, revenue, payouts, analytics, pulse insights |
| Admin Dashboard | User management, course approvals, analytics, geo data, payments, revenue, audit log, pulse engine, settings |
| Leaderboard | Real XP rankings from DB — top 50 students ordered by XP |
| Messaging | Unified messages system for all roles with file/image/audio attachments |
| Live Sessions | WebRTC video/audio meetings with WebSocket signaling, screen share, in-room chat |
| Live Translation | Real-time translation via Google Translate (deep-translator) — English ↔ Kinyarwanda ↔ 8 other languages, phonetic guides, Rwanda tourism quick phrases. No API key, no rate limits. |
| Email System | OTP + welcome emails per role + password reset via SendGrid / Gmail SMTP fallback |
| PULSE ML | XGBoost classifier — 72.93% accuracy, 72.39% F1, 31 features, 28,785 OULAD students |
| Ethics & Compliance | GDPR consent records, data subject requests, PULSE feedback, processing register, REC approval J26BSE087 |
| Notifications | Emoji reactions, threaded replies, per-notification read tracking |
| Public Pages | Welcome (live stats), Features, Pricing (monthly/annual), Community |

### 🔜 Coming Soon
- Certificate generation
- Mobile app (React Native)

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.1 | UI framework |
| TypeScript | 5.4.5 | Type safety |
| Vite | 5.3.1 | Build tool |
| React Router DOM | 6.23.1 | Client-side routing |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| FastAPI | 0.111.0 | REST API + WebSocket |
| PostgreSQL | 15 (Aiven cloud) | Primary database |
| SQLAlchemy | 2.0.36 | ORM |
| Python-Jose | 3.3.0 | JWT |
| deep-translator | 1.11.4+ | Google Translate wrapper — Live Translation feature |
| SendGrid | 6.11.0 | Email delivery (production) |
| smtplib | stdlib | Email fallback (local dev) |
| google-auth | 2.49.1 | Google OAuth |

### ML (PULSE)
| Technology | Purpose |
|---|---|
| XGBoost 2.0+ | Model training (XGBClassifier, 500 estimators, lr=0.05, max_depth=6) |
| scikit-learn | Preprocessing, scaling, cross-validation |
| pandas / numpy | Feature engineering from OULAD dataset |
| OULAD Dataset | 28,785 real Open University students — ground truth labels for engagement classification |

---

## 📁 Project Structure

```
fluentfusionfinal/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── auth.py          # register, login, verify-email, forgot/reset-password, Google OAuth
│   │   │   ├── admin.py         # all /api/admin/* endpoints
│   │   │   ├── instructor.py    # all /api/instructor/* endpoints
│   │   │   ├── student.py       # all /api/student/* endpoints + leaderboard + onboarding
│   │   │   ├── translate.py     # /api/translate — Live Translation via deep-translator
│   │   │   ├── messages.py      # unified messaging for all roles
│   │   │   ├── meetings.py      # WebRTC live sessions + WebSocket signaling
│   │   │   ├── notifications.py # reactions, replies, read tracking
│   │   │   └── ethics.py        # GDPR consent, data subject requests, PULSE feedback
│   │   ├── auth.py              # JWT helpers, password hashing, Google OAuth
│   │   ├── email_utils.py       # SendGrid → Gmail SMTP fallback, role-specific welcome emails
│   │   ├── pulse_predictor.py   # PULSE inference — loads model artifacts, predicts state
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── main.py              # FastAPI app, CORS, /api/stats
│   │   └── seed.py              # DB seeding script
│   ├── .env                     # local environment variables (not committed)
│   ├── .env.example             # template for environment variables
│   ├── ca.pem                   # Aiven SSL certificate
│   └── requirements.txt
│
├── frontend/app/
│   ├── src/
│   │   ├── api/client.ts        # All API calls (legacy shim + typed APIs)
│   │   ├── components/          # Shared UI components + AuthContext
│   │   ├── pages/
│   │   │   ├── admin/           # 18 admin pages
│   │   │   ├── instructor/      # 15 instructor pages
│   │   │   └── student/         # 29 student pages (incl. LiveTranslation.tsx)
│   │   └── App.tsx              # Role-based routing
│   ├── .env                     # local environment variables
│   ├── .env.production          # production environment variables
│   └── vite.config.ts
│
├── PULSE/
│   ├── pulse_artifacts/         # Trained model, scaler, encoders, metadata
│   └── PULSE_ML_Notebook.ipynb  # Full ML pipeline — OULAD data → trained model
│
├── archive/                     # OULAD dataset files (used for PULSE training only)
│   ├── studentInfo.csv
│   ├── studentAssessment.csv
│   ├── studentRegistration.csv
│   ├── studentVle_0.csv … studentVle_7.csv
│   ├── assessments.csv
│   ├── vle.csv
│   └── courses.csv
│
├── start.sh                     # one-command startup script
├── render.yaml                  # Render deployment config
└── README.md
```

---

## 🔧 Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node.js | 18+ | [Download](https://nodejs.org/) |
| Python | 3.12+ | [Download](https://python.org/) |
| Git | Latest | [Download](https://git-scm.com/) |

> **No local PostgreSQL needed** — the database is hosted on Aiven cloud. The connection string in `.env` points directly to the cloud instance.

---

## ⚙️ Installation & Setup

### Step 1 — Clone the repository

```bash
git clone https://github.com/ngabo-dev/fluentfusion.v1.git
cd fluentfusion.v1
```

### Step 2 — Backend setup

```bash
cd backend

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate          # macOS/Linux
# venv\Scripts\activate           # Windows

# Install all dependencies
pip install -r requirements.txt
```

### Step 3 — Frontend setup

```bash
cd ../frontend/app
npm install
```

---

## 🔐 Environment Variables

### `backend/.env`

Copy `.env.example` to `.env` and fill in the values:

```bash
cp backend/.env.example backend/.env
```

```env
# Database — Aiven PostgreSQL (already configured for the live instance)
DATABASE_URL=postgresql://user:password@host:port/defaultdb?sslmode=require

# JWT
SECRET_KEY=your-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# App URLs
FRONTEND_URL=http://localhost:5173

# Google OAuth (optional — needed for Google Sign-In button)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email — choose one provider
# Option A: SendGrid (production)
SENDGRID_API_KEY=your-sendgrid-api-key

# Option B: Gmail SMTP (local dev fallback)
EMAIL_ENABLED=True
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASSWORD=your-gmail-app-password
FROM_EMAIL=your-gmail@gmail.com
FROM_NAME=FluentFusion

# Gemini API (optional — enhances translation with phonetic guides)
# Get a free key at https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your-gemini-api-key
```

> **Note:** The Live Translation feature works without any API key using `deep-translator`. The `GEMINI_API_KEY` is optional and only adds phonetic romanization on top of translations.

### `frontend/app/.env`

```env
VITE_API_URL=http://localhost:8000/api
VITE_FRONTEND_URL=http://localhost:5173
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

---

## ▶️ Running the Application

### Option A — One command (recommended)

```bash
bash start.sh
```

### Option B — Two terminals

**Terminal 1 — Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend/app
npm run dev
```

### Verify it's running

| Service | URL |
|---|---|
| App (local) | http://localhost:5173 |
| API (local) | http://localhost:8000 |
| Swagger Docs (local) | http://localhost:8000/docs |
| App (production) | https://fluentfusionv1.vercel.app/ |
| API (production) | https://fluentfusion-v1.onrender.com |
| Swagger Docs (production) | https://fluentfusion-v1.onrender.com/docs |

---

## 🧪 Testing the Application

### Test accounts (pre-seeded in the cloud DB)

| Role | Email | Password |
|---|---|---|
| Student | student@fluentfusion.com | Test@1234 |
| Instructor | instructor@fluentfusion.com | Test@1234 |
| Admin | admin@fluentfusion.com | Test@1234 |

### Test the Live Translation API directly

```bash
curl -X POST http://localhost:8000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, how are you?", "source_lang": "en", "target_lang": "rw"}'
```

Expected response:
```json
{
  "translated_text": "Mwaramutse, mumeze mute?",
  "source_lang": "en",
  "target_lang": "rw",
  "romanization": "mwa-ra-MU-tse, mu-ME-ze MU-te",
  "usage_note": "The most common greeting in Rwanda — used in the morning."
}
```

### Test via Swagger UI

Open http://localhost:8000/docs and use the interactive API explorer to test any endpoint.

---

## 🌐 API Overview

### Auth — `/api/auth/`
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/google              ← Google OAuth
POST /api/auth/verify-email
POST /api/auth/resend-verification
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/me
```

### Translation — `/api/translate/`
```
POST /api/translate          ← translate text between any supported language pair
GET  /api/translate/languages ← list supported language codes
```

Supported languages: English (`en`), Kinyarwanda (`rw`) 🇷🇼, French (`fr`), Swahili (`sw`), Spanish (`es`), German (`de`), Chinese (`zh-CN`), Arabic (`ar`), Portuguese (`pt`), Hindi (`hi`).

No API key required. Uses `deep-translator` (Google Translate wrapper).

### Student — `/api/student/`
```
GET  /api/student/dashboard
GET  /api/student/catalog
GET  /api/student/courses
POST /api/student/courses/{id}/enroll
GET  /api/student/courses/{id}/lessons
GET  /api/student/live-sessions
GET  /api/student/quizzes
GET  /api/student/messages
GET  /api/student/messages/{peer_id}
POST /api/student/messages/{peer_id}
GET  /api/student/notifications
GET  /api/student/leaderboard        ← real XP rankings from DB
POST /api/student/onboarding         ← persists 4-step onboarding to DB
GET  /api/student/profile
PATCH /api/student/profile
```

### Instructor — `/api/instructor/`
```
GET  /api/instructor/dashboard
GET/POST /api/instructor/courses
PATCH/DELETE /api/instructor/courses/{id}
GET  /api/instructor/courses/{id}/lessons
POST /api/instructor/courses/{id}/lessons
GET  /api/instructor/live-sessions
POST /api/instructor/live-sessions
GET  /api/instructor/quizzes
GET  /api/instructor/students
GET  /api/instructor/pulse
GET  /api/instructor/reviews
PATCH /api/instructor/reviews/{id}/reply
GET  /api/instructor/revenue
GET/POST /api/instructor/payouts
GET  /api/instructor/analytics
GET  /api/instructor/notifications
GET/PATCH /api/instructor/profile
```

### Admin — `/api/admin/`
```
GET  /api/admin/dashboard
GET  /api/admin/users
PATCH /api/admin/users/{id}
PATCH /api/admin/users/{id}/status
DELETE /api/admin/users/{id}
GET  /api/admin/instructors
PATCH /api/admin/instructors/{id}/verify
GET/POST /api/admin/courses
PATCH /api/admin/courses/{id}/status
GET  /api/admin/revenue
GET/PATCH /api/admin/payouts/{id}/status
GET  /api/admin/pulse
GET  /api/admin/notifications
POST /api/admin/notifications
GET  /api/admin/audit-log
GET/PATCH /api/admin/reports/{id}
GET  /api/admin/live-sessions
GET  /api/admin/analytics
GET  /api/admin/geo              ← real language data from DB
GET  /api/admin/payments
GET  /api/admin/admins
POST /api/admin/admins           ← super_admin only
DELETE /api/admin/admins/{id}    ← super_admin only
GET/PATCH /api/admin/settings
```

### Messages — `/api/messages/`
```
GET  /api/messages/threads
GET  /api/messages/thread/{peer_id}
GET  /api/messages/contacts
GET  /api/messages/courses-list
POST /api/messages/send
POST /api/messages/upload
```

### Meetings — `/api/meetings/`
```
GET/POST /api/meetings
GET      /api/meetings/contacts/search
GET      /api/meetings/{room_id}
PATCH    /api/meetings/{room_id}/start
PATCH    /api/meetings/{room_id}/end
DELETE   /api/meetings/{room_id}
WS       /api/meetings/ws/{room_id}/{user_id}   ← WebRTC signaling
```

### Ethics & Compliance — `/api/v1/ethics/`
```
POST   /api/v1/ethics/consent
GET    /api/v1/ethics/consent/me
DELETE /api/v1/ethics/consent/me/{consent_type}
GET    /api/v1/ethics/consent/versions
POST   /api/v1/ethics/data-rights
GET    /api/v1/ethics/data-rights/me
GET    /api/v1/ethics/data-rights           ← admin
PATCH  /api/v1/ethics/data-rights/{id}      ← admin
POST   /api/v1/ethics/pulse-feedback
GET    /api/v1/ethics/pulse-feedback/me
GET    /api/v1/ethics/pulse-feedback        ← admin
GET    /api/v1/ethics/processing-register   ← admin
POST   /api/v1/ethics/processing-register   ← admin
GET/POST /api/v1/ethics/ethics-change-log   ← admin
GET    /api/v1/ethics/documents/{doc_type}
GET    /api/v1/ethics/overview              ← admin
```

### Notifications — `/api/notifications/`
```
GET  /api/notifications/{id}
POST /api/notifications/{id}/react
POST /api/notifications/{id}/reply
GET  /api/notifications/{id}/reactions
```

---

## 🌍 Live Translation Feature

The Live Translation page (`/dashboard/translate`) is the primary response to the panel's feedback about using an LLM/AI API for Kinyarwanda.

### How it works

1. User types any text (or clicks a quick phrase button)
2. Backend calls `deep-translator` → Google Translate API
3. Response includes: translated text + phonetic romanization + Rwanda tourism context tip
4. User can listen to the translation via browser Text-to-Speech
5. User can copy the translation with one click

### Supported language pairs
Any combination of the 10 supported languages. The most relevant for Rwanda tourism:
- English → Kinyarwanda
- French → Kinyarwanda
- Kinyarwanda → English

### Tourism quick phrases (pre-loaded)
- "Hello, how are you?" → "Mwaramutse, mumeze mute?"
- "Thank you very much" → "Murakoze cyane"
- "Where is the nearest hospital?" → "Ibitaro byegereye he?"
- "How much does this cost?" → "Bangahe?"
- "Please speak slowly" → "Nyamuneka vuga buhoro"
- "I would like to visit Volcanoes National Park" → "Ndashaka gusura Parike y'Ibirunga"
- And 6 more...

---

## 🧠 PULSE ML Engine

PULSE classifies each learner into one of 5 behavioural states using an XGBoost classifier trained on real student data from the Open University Learning Analytics Dataset (OULAD).

> **Important distinction:** PULSE is used for **engagement prediction** (is this student at risk of dropping out?), not for language learning. The OULAD dataset is appropriate for this task — it contains real behavioural data from 28,785 university students.

| State | Meaning |
|---|---|
| 🚀 Thriving | High engagement, high performance |
| 😐 Coasting | Moderate engagement, not challenged |
| 😓 Struggling | Low performance, needs scaffolding |
| 🔥 Burning Out | Declining metrics, at-risk of churn |
| 💤 Disengaged | Very low activity, near dropout |

### Model Performance
| Metric | Score |
|---|---|
| Test Accuracy | **72.93%** |
| Test F1 (weighted) | **72.39%** |
| CV Mean F1 | 72.71% ± 0.85% |
| Algorithm | XGBoost (n_estimators=500, lr=0.05, max_depth=6) |
| Features | 31 engineered features |
| Training samples | 20,149 / Val: 4,318 / Test: 4,318 |

### Training Data — OULAD Dataset
Real data from 28,785 Open University students (`/archive/`):

| OULAD Result | PULSE State |
|---|---|
| Distinction | Thriving (0) |
| Pass | Coasting (1) |
| Fail | Struggling (2) |
| Withdrawn (late) | Burning Out (3) |
| Withdrawn (early) | Disengaged (4) |

### Running the PULSE Notebook
```bash
# Install Jupyter if needed
pip install jupyter

cd PULSE
jupyter notebook PULSE_ML_Notebook.ipynb
# Run all cells — outputs pulse_artifacts/ with model, scaler, encoders, metadata
```

---

## 🚀 Deployment

### Backend — Render
The backend is deployed on Render as a web service. Configuration is in `render.yaml`.

Required environment variables to set in the Render dashboard:
- `DATABASE_URL` — Aiven PostgreSQL connection string
- `SECRET_KEY` — JWT signing key (min 32 chars)
- `GOOGLE_CLIENT_ID` — Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` — Google OAuth client secret
- `SENDGRID_API_KEY` — SendGrid API key for email
- `GEMINI_API_KEY` — Gemini API key (optional, for phonetic enrichment)

### Frontend — Vercel
The frontend is deployed on Vercel. It auto-deploys on every push to `main`.

Required environment variables in Vercel dashboard:
- `VITE_API_URL` — `https://fluentfusion-v1.onrender.com/api`
- `VITE_FRONTEND_URL` — `https://fluentfusionv1.vercel.app`
- `VITE_GOOGLE_CLIENT_ID` — Google OAuth client ID

---

## 🎨 Design System

| Token | Hex | Usage |
|---|---|---|
| Background | `#0a0a0a` | App background |
| Card | `#151515` | Card surfaces |
| Neon | `#BFFF00` | Primary accent, CTAs |
| Success | `#00FF7F` | Success states |
| Error | `#FF4444` | Error messages |

Fonts: **Syne** (headings) · **DM Sans** (body) · **JetBrains Mono** (labels/code)

---

## 👥 User Flows

### Student
```
/signup → /verify-email (OTP) → /onboard/native-language
       → /onboard/learn-language → /onboard/goal
       → /onboard/level → /dashboard
```
Onboarding data saved to DB on final step. Subsequent logins go directly to `/dashboard`.

### Instructor
```
/signup (role: instructor) → /verify-email → /instructor
```

### Admin
```
/login → /admin  (pre-seeded accounts only)
```

### Tourist (no account needed)
```
/ (Welcome page) → Live Translation is accessible from the student dashboard
                   after a free signup — no course enrollment required
```

---

## 📄 License

Proprietary — All rights reserved © 2026 FluentFusion
