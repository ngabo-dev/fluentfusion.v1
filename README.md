<div align="center">

# 🧠 FluentFusion
### AI-Powered Language Learning Platform

Break language barriers through personalized lessons, live instructor sessions, and a global community — all powered by the **PULSE** ML engine.

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Latest-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![License](https://img.shields.io/badge/License-Proprietary-red)](./LICENSE)

</div>

---

## 📺 Demo Video

> **▶️ [Watch the 5-minute Demo Video](#)**

---

## 🌐 Live Deployment

> **🚀 [Open the Live App](https://fluentfusionv1.vercel.app/)**

---

## 📋 Table of Contents

1. [About the Project](#-about-the-project)
2. [Features](#-features)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Prerequisites](#-prerequisites)
6. [Installation & Setup](#-installation--setup)
   - [Quick Start (Docker)](#option-a-quick-start-with-docker-recommended)
   - [Manual Setup](#option-b-manual-setup)
7. [Environment Variables](#-environment-variables)
8. [Running the Application](#-running-the-application)
9. [Related Files](#-related-files)
10. [API Overview](#-api-overview)
11. [Design System](#-design-system)
12. [Roadmap](#-roadmap)
13. [Author](#-author)
14. [License](#-license)

---

## 🎯 About the Project

**FluentFusion** is a full-stack, AI-powered language learning platform that combines:

- 🤖 **PULSE ML Engine** — A Gradient Boosting classifier (97.5% accuracy) that predicts each learner's engagement state and personalizes their learning journey in real time.
- 🎥 **Live Instructor Sessions** — Book and join real-time video lessons with certified language instructors.
- 🌍 **Global Community** — Discussion forums, language exchange, and study groups with learners worldwide.
- 🏆 **Gamification** — XP points, daily streaks, badges, leaderboards, and achievement milestones to keep learners motivated.
- 💳 **Monetization** — Stripe-powered subscriptions, payments, and billing.

The platform supports three roles: **Students**, **Instructors**, and **Admins**, each with a dedicated dashboard and feature set.

---

## 🚀 Features

### ✅ Implemented

| Feature | Details |
|---------|---------|
| **Authentication** | Email/password, JWT tokens (30-min access + 7-day refresh), OTP email verification, password reset |
| **Onboarding** | 4-step progressive setup: native language → target language → goal → proficiency level |
| **Dashboard** | XP tracking, daily streak, fluency score, course progress, live session reminders, daily challenges |
| **PULSE ML** | Learner state prediction, batch scoring (up to 500), feature importance, intervention recommendations |
| **Courses API** | Full CRUD, enrollment, curriculum management, reviews |
| **Practice API** | Vocabulary drills, grammar exercises, quizzes, flashcards |
| **Live Sessions API** | Booking, streaming, recordings management |
| **Community API** | Forums, threads, messages, language exchange, study groups |
| **Gamification API** | XP system, badges, leaderboards, achievements, streaks |
| **Payments API** | Stripe integration, subscriptions, billing, invoices |
| **Admin API** | User management, analytics, content moderation, reports |
| **Instructor API** | Course creation, student management, earnings dashboard |

### 🔜 Coming Soon (Frontend Pages)

- Course catalog & detail pages
- Lesson player
- Practice exercises (vocabulary, grammar, speaking, listening, writing)
- Live session booking interface
- Community forums UI
- Profile & settings
- Analytics & progress tracking
- Achievement & badge gallery
- Instructor & admin dashboards

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.3.1 | UI framework |
| **TypeScript** | Latest | Type safety |
| **Vite** | 6.3.5 | Build tool & dev server |
| **Tailwind CSS v4** | 4.1.12 | Utility-first styling |
| **React Router** | 7.13.0 | Client-side routing |
| **shadcn/ui (Radix UI)** | Multiple | 30+ accessible UI components |
| **Lucide React** | 0.487.0 | Icon library |
| **Recharts** | 2.15.2 | Data visualization / charts |
| **Motion (Framer Motion)** | 12.23.24 | Animations |
| **React Hook Form** | 7.55.0 | Form state management |
| **Sonner** | 2.0.3 | Toast notifications |
| **Embla Carousel** | 8.6.0 | Carousel / sliders |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **FastAPI** | 0.104.1 | REST API framework |
| **Uvicorn** | 0.24.0 | ASGI server (4 workers in prod) |
| **PostgreSQL** | 15 | Primary relational database |
| **SQLAlchemy** | 2.0.23 | ORM |
| **Alembic** | 1.12.1 | Database migrations |
| **Redis** | 7 | Caching layer |
| **Celery** | 5.3.4 | Async task queue |
| **Python-Jose + Passlib** | Latest | JWT auth & bcrypt hashing |
| **Stripe** | 7.5.0 | Payment processing |
| **SendGrid** | 6.10.0 | Transactional email |
| **boto3 (AWS S3)** | 1.34.0 | File/media storage |
| **scikit-learn** | 1.3.0+ | PULSE ML engine |
| **Pytest** | 7.4.3 | Testing framework |

---

## 📁 Project Structure

```
fluentfusion.v1/
├── backend/                          # Python FastAPI backend
│   ├── app/
│   │   ├── api/v1/                  # REST API endpoints (13 modules)
│   │   │   ├── auth.py              # Authentication & JWT
│   │   │   ├── users.py             # User profiles
│   │   │   ├── courses.py           # Course management
│   │   │   ├── lessons.py           # Lesson content
│   │   │   ├── practice.py          # Practice & quizzes
│   │   │   ├── live.py              # Live sessions
│   │   │   ├── community.py         # Forums & social
│   │   │   ├── gamification.py      # XP, badges, leaderboards
│   │   │   ├── payments.py          # Stripe billing
│   │   │   ├── admin.py             # Admin dashboard
│   │   │   ├── instructor.py        # Instructor tools
│   │   │   └── pulse.py             # PULSE ML endpoints
│   │   ├── models/                  # SQLAlchemy models (21 tables)
│   │   ├── schemas/                 # Pydantic request/response schemas
│   │   ├── middleware/              # CORS, rate limiting, trusted hosts
│   │   ├── utils/                   # Security, email, S3 helpers
│   │   ├── pulse/                   # PULSE ML sub-package
│   │   │   ├── core/model_loader.py # Artifact loading singleton
│   │   │   ├── services/pulse_service.py # Inference logic
│   │   │   └── pulse.py             # PULSE Pydantic schemas
│   │   ├── main.py                  # FastAPI app entry point
│   │   ├── config.py                # Settings (60+ options)
│   │   ├── database.py              # DB connection & session
│   │   └── dependencies.py          # Dependency injection
│   ├── alembic/                     # Database migration scripts
│   ├── pulse_artifacts/             # Pre-trained ML model files
│   │   ├── pulse_model.pkl          # GradientBoosting classifier
│   │   ├── pulse_scaler.pkl         # StandardScaler
│   │   ├── label_encoders.pkl       # LabelEncoders
│   │   └── pulse_metadata.json      # Model metadata & features
│   ├── Dockerfile                   # Production container image
│   ├── docker-compose.yml           # Dev environment (API + DB + Redis)
│   ├── docker-compose.prod.yml      # Production environment
│   ├── requirements.txt             # Python dependencies (52 packages)
│   ├── .env.example                 # Backend env template
│   ├── seed_flashcards.py           # Database seeding script
│   └── README.md                    # Backend-specific documentation
│
├── src/                             # React frontend source
│   ├── app/
│   │   ├── App.tsx                  # Root routing component
│   │   ├── components/
│   │   │   ├── Logo.tsx             # Reusable logo (sm/md/lg)
│   │   │   ├── NavBar.tsx           # Top navigation bar
│   │   │   ├── Sidebar.tsx          # Side navigation menu
│   │   │   ├── RoleGuards.tsx       # AdminRoute, InstructorRoute, etc.
│   │   │   ├── Layout.tsx           # Page layout wrapper
│   │   │   └── ui/                  # 30+ shadcn/ui components
│   │   ├── pages/
│   │   │   └── CourseCatalog.tsx    # Course catalog page
│   │   ├── api/
│   │   │   └── config.ts            # Axios client & API config
│   │   └── hooks/
│   │       └── useFluentNavigation.ts # Navigation helper hook
│   ├── imports/                     # Figma-imported page components
│   │   ├── 01Welcome.tsx            # Landing page
│   │   ├── 02Signup.tsx             # Registration
│   │   ├── 03Login.tsx              # Login
│   │   ├── 04ForgotPassword.tsx     # Password reset
│   │   ├── 05VerifyEmail.tsx        # OTP verification
│   │   ├── 06OnboardNative.tsx      # Native language selection
│   │   ├── 07OnboardLearn.tsx       # Target language selection
│   │   ├── 08OnboardGoal.tsx        # Learning goal
│   │   ├── 09OnboardLevel.tsx       # Proficiency level
│   │   ├── 10Dashboard.tsx          # Main dashboard
│   │   └── ...                      # 30+ planned pages
│   ├── styles/
│   │   ├── fonts.css                # Syne, DM Sans, JetBrains Mono
│   │   ├── theme.css                # CSS variables & design tokens
│   │   ├── tailwind.css             # Tailwind directives
│   │   └── index.css                # Global reset styles
│   └── main.tsx                     # React entry point
│
├── files/                           # Static assets & screenshots
├── guidelines/                      # Design & development guidelines
├── .env.example                     # Frontend env template
├── index.html                       # HTML entry point
├── package.json                     # Frontend deps & scripts
├── vite.config.ts                   # Vite configuration
├── tailwind.config.ts               # Tailwind CSS v4 config
├── postcss.config.mjs               # PostCSS configuration
├── QUICKSTART.md                    # Quick-start guide
├── BACKEND_API.md                   # API specification reference
├── IMPLEMENTATION.md                # Implementation status & roadmap
└── ATTRIBUTIONS.md                  # Third-party license attributions
```

---

## 🔧 Prerequisites

Before running FluentFusion, make sure the following are installed on your machine:

| Requirement | Minimum Version | Notes |
|------------|----------------|-------|
| **Node.js** | 18+ | [Download](https://nodejs.org) |
| **pnpm** or **npm** | Latest | `npm install -g pnpm` |
| **Python** | 3.12+ | [Download](https://python.org) |
| **PostgreSQL** | 15+ | [Download](https://www.postgresql.org/download) |
| **Redis** | 7+ | [Download](https://redis.io/download) |
| **Docker & Docker Compose** | Latest | Only required for Docker setup |

---

## ⚙️ Installation & Setup

### Option A: Quick Start with Docker (Recommended)

> Docker handles PostgreSQL, Redis, the FastAPI backend, and (in production) the Nginx-served frontend — all in one command.

#### Step 1 — Clone the repository

```bash
git clone https://github.com/ngabo-dev/fluentfusion.v1.git
cd fluentfusion.v1
```

#### Step 2 — Configure the backend environment

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and fill in the required values (see [Environment Variables](#-environment-variables) below). At minimum, set:

```env
SECRET_KEY=your-super-secret-key-at-least-32-chars
JWT_SECRET_KEY=your-jwt-secret-key
DATABASE_URL=postgresql://fluentfusion:secret@db:5432/fluentfusion
REDIS_URL=redis://redis:6379
```

#### Step 3 — Start the development stack

```bash
# From the backend/ directory
docker-compose up --build
```

This spins up:
- `api` — FastAPI server on `http://localhost:8000`
- `db` — PostgreSQL 15 on port `5432`
- `redis` — Redis 7 on port `6379`
- `worker` — Celery background worker

#### Step 4 — Configure and run the frontend

In a **new terminal**, from the project root:

```bash
cd ..   # back to fluentfusion.v1/
cp .env.example .env
```

Set the API URL in the frontend `.env`:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_FRONTEND_URL=http://localhost:5173
```

Install dependencies and start the dev server:

```bash
pnpm install   # or: npm install
pnpm dev       # or: npm run dev
```

The frontend is now live at **http://localhost:5173** 🎉

---

### Option B: Manual Setup

#### Step 1 — Clone the repository

```bash
git clone https://github.com/ngabo-dev/fluentfusion.v1.git
cd fluentfusion.v1
```

#### Step 2 — Set up PostgreSQL

```bash
# Connect to postgres as superuser
psql -U postgres

# Create user and database
CREATE USER fluentfusion WITH PASSWORD 'your_secure_password';
CREATE DATABASE fluentfusion OWNER fluentfusion;
\q
```

#### Step 3 — Set up Redis

```bash
# macOS (Homebrew)
brew install redis && brew services start redis

# Ubuntu/Debian
sudo apt update && sudo apt install redis-server
sudo systemctl enable redis-server && sudo systemctl start redis-server

# Windows
# Use Redis for Windows: https://github.com/microsoftarchive/redis/releases
```

#### Step 4 — Configure the backend

```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL URL, Redis URL, JWT secret, etc.
```

#### Step 5 — Install Python dependencies

```bash
# Create and activate a virtual environment (recommended)
python -m venv venv
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate           # Windows

pip install -r requirements.txt
```

#### Step 6 — Run database migrations

```bash
alembic upgrade head
```

#### Step 7 — (Optional) Seed the database

```bash
python seed_flashcards.py
```

#### Step 8 — Start the backend server

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API is now live at **http://localhost:8000**
Interactive Swagger docs: **http://localhost:8000/docs**

#### Step 9 — Configure the frontend

Back in the project root:

```bash
cd ..   # back to fluentfusion.v1/
cp .env.example .env
```

Edit the frontend `.env`:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_FRONTEND_URL=http://localhost:5173
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...   # optional for local testing
```

#### Step 10 — Install frontend dependencies and start the dev server

```bash
pnpm install   # or: npm install
pnpm dev       # or: npm run dev
```

Frontend is live at **http://localhost:5173** 🎉

---

## 🔐 Environment Variables

### Frontend (`.env` in project root)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | ✅ | `http://localhost:8000/api/v1` | Backend API base URL |
| `VITE_FRONTEND_URL` | ✅ | `http://localhost:5173` | Frontend URL (used for OAuth callbacks) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | ⚠️ | — | Stripe public key (for payment UI) |

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DEBUG` | ✅ | `true` for dev, `false` for prod |
| `ENVIRONMENT` | ✅ | `development` or `production` |
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `REDIS_URL` | ✅ | Redis connection string |
| `SECRET_KEY` | ✅ | App secret (min 32 chars) |
| `JWT_SECRET_KEY` | ✅ | JWT signing secret |
| `JWT_ALGORITHM` | ✅ | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | ✅ | `30` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | ✅ | `7` |
| `STRIPE_SECRET_KEY` | ⚠️ | Stripe secret key (for payments) |
| `STRIPE_WEBHOOK_SECRET` | ⚠️ | Stripe webhook signing secret |
| `AWS_ACCESS_KEY_ID` | ⚠️ | AWS S3 access key (for file uploads) |
| `AWS_SECRET_ACCESS_KEY` | ⚠️ | AWS S3 secret key |
| `AWS_REGION` | ⚠️ | AWS region (e.g. `us-east-1`) |
| `S3_BUCKET` | ⚠️ | S3 bucket name |
| `SENDGRID_API_KEY` | ⚠️ | SendGrid key (for transactional email) |
| `SENDGRID_FROM_EMAIL` | ⚠️ | Sender email address |
| `SMTP_HOST` | ⚠️ | SMTP fallback host (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | ⚠️ | SMTP port (e.g. `587`) |
| `SMTP_USER` | ⚠️ | SMTP username |
| `SMTP_PASSWORD` | ⚠️ | SMTP password / app password |
| `FRONTEND_URL` | ✅ | `http://localhost:5173` |
| `CORS_ORIGINS` | ✅ | JSON array of allowed origins |
| `ADMIN_EMAILS` | ⚠️ | JSON array of admin email addresses |

> **Legend**: ✅ Required · ⚠️ Required for the specific feature to work

---

## ▶️ Running the Application

### Development

```bash
# Backend (from backend/)
uvicorn app.main:app --port 8000 --reload

# Frontend (from project root)
pnpm dev
```

### Production (Docker)

```bash
cd backend
docker-compose -f docker-compose.prod.yml up --build
```

This starts the full production stack:
- **Nginx** serving the React build on port `3000`
- **FastAPI** (4 Uvicorn workers) on port `8000`
- **PostgreSQL 15** with persistent volume
- **Redis 7** with persistent volume
- **Celery** worker for background jobs

### Useful Commands

```bash
# Backend tests
cd backend
pytest                    # Run all tests
pytest --cov              # With coverage report

# Database migrations
alembic upgrade head      # Apply pending migrations
alembic downgrade -1      # Roll back last migration
alembic revision --autogenerate -m "description"  # Create new migration

# Code quality
black app/                # Auto-format code
isort app/                # Sort imports
flake8 app/               # Lint code

# Frontend build
pnpm build                # Build for production (outputs to dist/)
```

---

## 📂 Related Files

| File | Description |
|------|-------------|
| [`backend/README.md`](./backend/README.md) | Backend-specific documentation: setup, API reference, Docker, PULSE ML |
| [`QUICKSTART.md`](./QUICKSTART.md) | Condensed quick-start guide for developers |
| [`BACKEND_API.md`](./BACKEND_API.md) | Full API endpoint specification with request/response schemas |
| [`IMPLEMENTATION.md`](./IMPLEMENTATION.md) | Implementation status, progress tracker, and roadmap |
| [`ATTRIBUTIONS.md`](./ATTRIBUTIONS.md) | Third-party licenses and attributions |
| [`backend/.env.example`](./backend/.env.example) | Backend environment variable template |
| [`.env.example`](./.env.example) | Frontend environment variable template |
| [`backend/requirements.txt`](./backend/requirements.txt) | Python dependencies list |
| [`package.json`](./package.json) | Frontend dependencies and scripts |
| [`vite.config.ts`](./vite.config.ts) | Vite build configuration |
| [`tailwind.config.ts`](./tailwind.config.ts) | Tailwind CSS v4 configuration |
| [`backend/docker-compose.yml`](./backend/docker-compose.yml) | Docker Compose for development |
| [`backend/docker-compose.prod.yml`](./backend/docker-compose.prod.yml) | Docker Compose for production |
| [`backend/Dockerfile`](./backend/Dockerfile) | Backend production container image |
| [`backend/alembic/`](./backend/alembic/) | Database migration scripts |
| [`backend/pulse_artifacts/`](./backend/pulse_artifacts/) | Pre-trained PULSE ML model files |
| [`src/app/api/config.ts`](./src/app/api/config.ts) | Frontend API client configuration |
| [`src/app/App.tsx`](./src/app/App.tsx) | React routing configuration |

---

## 🌐 API Overview

All API endpoints live under `/api/v1/`. Interactive documentation is available at `http://localhost:8000/docs` when the backend is running.

| Prefix | Module | Key Functionality |
|--------|--------|------------------|
| `/api/v1/auth/` | Authentication | Register, login, email verify, password reset, JWT refresh |
| `/api/v1/users/` | Users | Profiles, settings, preferences |
| `/api/v1/courses/` | Courses | CRUD, enrollment, curriculum, reviews |
| `/api/v1/lessons/` | Lessons | Content, materials, prerequisites |
| `/api/v1/practice/` | Practice | Quizzes, vocabulary, grammar, flashcards |
| `/api/v1/live/` | Live Sessions | Booking, streaming, recordings |
| `/api/v1/community/` | Community | Forums, discussions, language exchange, study groups |
| `/api/v1/gamification/` | Gamification | XP, badges, leaderboards, achievements, streaks |
| `/api/v1/payments/` | Payments | Stripe subscriptions, billing, invoices |
| `/api/v1/admin/` | Admin | User management, analytics, moderation, reports |
| `/api/v1/instructor/` | Instructor | Course creation, student management, earnings |
| `/api/v1/pulse/` | PULSE ML | Learner state prediction, batch scoring, feature importance |

### Authentication

```
POST /api/v1/auth/register    → Register a new user
POST /api/v1/auth/login       → Login & receive JWT tokens
POST /api/v1/auth/verify      → Verify email with OTP
POST /api/v1/auth/refresh     → Refresh access token
POST /api/v1/auth/logout      → Invalidate token
POST /api/v1/auth/forgot-password → Send reset email
POST /api/v1/auth/reset-password  → Set new password
```

### PULSE ML Engine

```
GET  /api/v1/pulse/states           → 5 learner states with descriptions
POST /api/v1/pulse/predict          → Single learner state prediction
POST /api/v1/pulse/batch            → Batch predictions (up to 500)
GET  /api/v1/pulse/model-info       → Model version, accuracy, F1 score
GET  /api/v1/pulse/feature-importance → Top contributing features
GET  /health                         → Unified health check (API + DB + PULSE)
```

---

## 🎨 Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--neon-primary` | `#BFFF00` | Primary accent, CTAs |
| `--neon-alt` | `#8FEF00` | Hover states, secondary accent |
| `--ff-background` | `#0A0A0A` | App background |
| `--ff-card` | `#151515` | Card surfaces |
| `--ff-border` | `#2A2A2A` | Borders & dividers |
| `--ff-muted-text` | `#888888` | Secondary/muted text |
| `--ff-success` | `#00FF7F` | Success states |
| `--ff-warning` | `#FFB800` | Warning states |
| `--ff-danger` | `#FF4444` | Error / danger states |
| `--ff-info` | `#00CFFF` | Informational states |

### Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| **H1** | Syne | 800 (ExtraBold) | 52px |
| **H2** | Syne | 800 | 32px |
| **H3** | Syne | 800 | 22px |
| **Body** | DM Sans | 400 (Regular) | 15px |
| **Caption** | DM Sans | 400 | 12px |
| **Label / Mono** | JetBrains Mono | 500 (Medium) | 10px |

### Responsive Breakpoints

| Breakpoint | Range |
|-----------|-------|
| Mobile | 320px – 767px |
| Tablet | 768px – 1439px |
| Desktop | 1440px+ |

---

## 🗺️ Roadmap

### Phase 1 — Foundation ✅
- [x] Authentication & onboarding (4-step)
- [x] Main dashboard
- [x] Full backend API (13 endpoint groups)
- [x] PULSE ML engine integration
- [x] Docker deployment

### Phase 2 — Learning Core 🔄
- [ ] Course catalog & detail pages
- [ ] Lesson player
- [ ] Practice exercises (vocab, grammar, speaking, listening, writing)
- [ ] Flashcard system

### Phase 3 — Social & Live 📋
- [ ] Live session booking & video interface
- [ ] Community forums & threads
- [ ] Language exchange matching
- [ ] Study group creation

### Phase 4 — Advanced Features 📋
- [ ] Profile & settings pages
- [ ] Analytics & progress charts
- [ ] Achievement gallery & badge showcase
- [ ] Instructor & admin dashboards
- [ ] Certificate generation
- [ ] Mobile app (React Native)
- [ ] Offline mode & PWA
- [ ] Voice recognition for speaking practice

---

## 👤 Author

**Jean Pierre Niyongabo**
📧 [j.niyongabo@alustudent.com](mailto:j.niyongabo@alustudent.com)

---

## 📄 License

Proprietary — All rights reserved © 2026 FluentFusion AI

---

<div align="center">
Built with ❤️ for language learners worldwide.
</div>
