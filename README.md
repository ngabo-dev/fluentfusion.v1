# 🧠 FluentFusion
### AI-Powered Language Learning Platform

> Break language barriers through personalized lessons, live instructor sessions, and a global community — powered by the PULSE engagement engine.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/License-Proprietary-red)

---

## 📺 Demo Video
▶️ [Watch the Demo Video](#)

## 🌐 Live App
🚀 [Open the Live App](https://fluentfusionv1.vercel.app/)
🔧 [Backend API](https://fluentfusion-v1.onrender.com)
📖 [Swagger Docs](https://fluentfusion-v1.onrender.com/docs)

---

## 🎯 About the Project

FluentFusion is a full-stack language learning platform built for the ALU Capstone Project. It combines a React + TypeScript frontend with a FastAPI backend connected to a cloud-hosted PostgreSQL database (Aiven).

Three roles — **Students, Instructors, Admins** — each with a fully dedicated dashboard, sidebar navigation, and feature set.

Key highlights:
- 🔐 **JWT Authentication** — Register, login, OTP email verification, password reset
- 🎓 **4-Step Onboarding** — Native language → target language → goal → level (persisted to DB)
- 📊 **Role-Based Dashboards** — Separate layouts and routes for all three roles
- 📧 **Dual Email Provider** — Resend API (production) with SMTP fallback (local dev)
- 🧠 **PULSE ML Engine** — Classifies learners into 5 behavioural states using OULAD dataset
- 🌍 **Public Pages** — Welcome, Features, Pricing, Community with live platform stats

---

## 🚀 Features

### ✅ Implemented

| Feature | Details |
|---|---|
| Authentication | Email/password signup & login, JWT, OTP verification, password reset |
| Onboarding | 4-step setup persisted to DB: native lang → learn lang → goal → level |
| Student Dashboard | XP, pulse state, enrolled courses, live sessions, leaderboard (real DB data) |
| Instructor Dashboard | Courses, students, sessions, quizzes, revenue, payouts, analytics, pulse insights |
| Admin Dashboard | User management, course approvals, analytics, geo data, payments, revenue, audit log, pulse engine, settings |
| Leaderboard | Real XP rankings from DB — top 50 students ordered by XP |
| Messaging | Unified messages system for all roles with file/image/audio attachments |
| Email System | OTP + welcome emails per role + password reset via Resend API / SMTP fallback |
| PULSE ML | 5-state learner classifier trained on OULAD dataset (32k real students) |
| Public Pages | Welcome (live stats), Features, Pricing (monthly/annual), Community |

### 🔜 Coming Soon
- Live session video interface
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
| FastAPI | 0.111.0 | REST API |
| PostgreSQL | 15 (Aiven cloud) | Primary database |
| SQLAlchemy | 2.0.30 | ORM |
| Python-Jose | 3.3.0 | JWT |
| Resend | 2.24.0 | Email delivery (production) |
| smtplib | stdlib | Email fallback (local dev) |

### ML (PULSE)
| Technology | Purpose |
|---|---|
| scikit-learn | Model training (GradientBoostingClassifier) |
| pandas / numpy | Feature engineering from OULAD dataset |
| OULAD Dataset | 32k real Open University students — ground truth labels |

---

## 📁 Project Structure

```
Instructo&admin/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── auth.py          # register, login, verify-email, forgot/reset-password
│   │   │   ├── admin.py         # all /api/admin/* endpoints
│   │   │   ├── instructor.py    # all /api/instructor/* endpoints
│   │   │   ├── student.py       # all /api/student/* endpoints + leaderboard + onboarding
│   │   │   └── messages.py      # unified messaging for all roles
│   │   ├── auth.py              # JWT helpers, password hashing
│   │   ├── email_utils.py       # Resend → SMTP fallback, role-specific welcome emails
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── main.py              # FastAPI app, CORS, /api/stats
│   │   └── seed.py              # DB seeding script
│   ├── .env
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
│   │   │   └── student/         # 28 student pages
│   │   └── App.tsx              # Role-based routing
│   ├── .env
│   └── vite.config.ts
│
├── PULSE/
│   └── PULSE_ML_Notebook.ipynb  # Full ML pipeline — OULAD data → trained model
│
├── archive/                     # OULAD dataset files
│   ├── studentInfo.csv
│   ├── studentAssessment.csv
│   ├── studentRegistration.csv
│   ├── studentVle_0-7.csv
│   ├── assessments.csv
│   ├── vle.csv
│   └── courses.csv
│
├── start.sh
├── render.yaml
└── README.md
```

---

## 🔧 Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 18+ |
| Python | 3.12+ |
| Git | Latest |

> No local PostgreSQL needed — database is hosted on Aiven cloud.

---

## ⚙️ Installation & Setup

```bash
# 1. Clone
git clone https://github.com/ngabo-dev/fluentfusion.git
cd fluentfusion

# 2. Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 3. Frontend
cd ../frontend/app
npm install
```

---

## 🔐 Environment Variables

### `backend/.env`
```env
DATABASE_URL=postgresql://user:password@host:port/defaultdb?sslmode=require
SECRET_KEY=your-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
FRONTEND_URL=http://localhost:5173
RESEND_API_KEY=your-resend-api-key
EMAIL_ENABLED=True
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=your-gmail@gmail.com
FROM_NAME=FluentFusion AI
```

### `frontend/app/.env`
```env
VITE_API_URL=http://localhost:8000/api
VITE_FRONTEND_URL=http://localhost:5173
```

---

## ▶️ Running the Application

```bash
# One command (recommended)
bash start.sh

# Or two terminals:
# Terminal 1 — Backend
cd backend && source venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend/app && npm run dev
```

| Service | URL |
|---|---|
| App (local) | http://localhost:5173 |
| API (local) | http://localhost:8000 |
| Swagger Docs (local) | http://localhost:8000/docs |
| App (production) | https://fluentfusionv1.vercel.app/ |
| API (production) | https://fluentfusion-v1.onrender.com |
| Swagger Docs (production) | https://fluentfusion-v1.onrender.com/docs |

### Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | c.okafor@fluentfusion.com | admin123 |
| Instructor | a.ndiaye@ff.com | instructor123 |
| Student | k.larbi@gmail.com | student123 |

---

## 🌐 API Overview

### Auth — `/api/auth/`
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-email
POST /api/auth/resend-verification
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/me
```

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

---

## 🧠 PULSE ML Engine

PULSE classifies each learner into one of 5 behavioural states:

| State | Meaning |
|---|---|
| 🚀 Thriving | High engagement, high performance |
| 😐 Coasting | Moderate engagement, not challenged |
| 😓 Struggling | Low performance, needs scaffolding |
| 🔥 Burning Out | Declining metrics, at-risk of churn |
| 💤 Disengaged | Very low activity, near dropout |

### Training Data — OULAD Dataset
Real data from 32,000 Open University students (`/archive/`):

| OULAD Result | PULSE State |
|---|---|
| Distinction | Thriving (0) |
| Pass | Coasting (1) |
| Fail | Struggling (2) |
| Withdrawn (late) | Burning Out (3) |
| Withdrawn (early) | Disengaged (4) |

### Engineered Features
`total_clicks`, `active_days`, `avg_clicks_per_day`, `avg_score`, `num_assessments`, `days_to_first_submit`, `num_of_prev_attempts`, `studied_credits`, `days_registered_before_start`, `withdrew_early`, plus 4 composite scores.

### Running the Notebook
```bash
cd PULSE
jupyter notebook PULSE_ML_Notebook.ipynb
# Run all cells — outputs pulse_artifacts/ with model, scaler, encoders, metadata
```

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

---

## 👤 Author

**Jean Pierre Niyongabo**
📧 j.niyongabo@alustudent.com
🎓 African Leadership University — Capstone Project 2026

---

## 📄 License

Proprietary — All rights reserved © 2026 FluentFusion AI
