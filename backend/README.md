<div align="center">

# 🧠 FluentFusion — Backend API

**FastAPI-powered REST API + PULSE ML Engine**

The unified backend service for the FluentFusion language learning platform, combining a full-featured REST API with the PULSE (Predictive Unified Learner State Engine) machine learning model.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.12+-3776AB?logo=python&logoColor=white)](https://python.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)](https://redis.io)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://docker.com)

</div>

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Services at a Glance](#-services-at-a-glance)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Prerequisites](#-prerequisites)
6. [Installation & Setup](#-installation--setup)
   - [Option A: Docker (Recommended)](#option-a-docker-recommended)
   - [Option B: Manual Setup](#option-b-manual-setup)
7. [Environment Variables](#-environment-variables)
8. [Database Migrations](#-database-migrations)
9. [Running the Server](#-running-the-server)
10. [API Reference](#-api-reference)
11. [PULSE ML Engine](#-pulse-ml-engine)
12. [Authentication & Security](#-authentication--security)
13. [Database Models](#-database-models)
14. [Background Tasks](#-background-tasks)
15. [File Storage](#-file-storage)
16. [Email Service](#-email-service)
17. [Testing](#-testing)
18. [Code Quality](#-code-quality)
19. [Deployment](#-deployment)
20. [Author](#-author)

---

## 🎯 Overview

The FluentFusion backend is a **single unified service** that exposes:

- **Platform REST API** — Handles all business logic for users, courses, lessons, practice, live sessions, community, gamification, payments, admin, and instructors.
- **PULSE ML Service** — An embedded machine learning engine that predicts each learner's current engagement state and generates personalized intervention recommendations in real time.

All endpoints live under the `/api/v1/` prefix and are documented via the **interactive Swagger UI** at `http://localhost:8000/docs`.

---

## 🔍 Services at a Glance

| Service | Prefix | Description |
|---------|--------|-------------|
| **Authentication** | `/api/v1/auth/` | Register, login, JWT, OTP email verification, password reset |
| **Users** | `/api/v1/users/` | User profiles, settings, preferences |
| **Courses** | `/api/v1/courses/` | Course CRUD, enrollment, curriculum, reviews |
| **Lessons** | `/api/v1/lessons/` | Lesson content, materials, prerequisites |
| **Practice** | `/api/v1/practice/` | Quizzes, vocabulary, grammar drills, flashcards |
| **Live Sessions** | `/api/v1/live/` | Booking, streaming, recordings |
| **Community** | `/api/v1/community/` | Forums, discussions, language exchange, study groups |
| **Gamification** | `/api/v1/gamification/` | XP, badges, leaderboards, achievements, streaks |
| **Payments** | `/api/v1/payments/` | Stripe subscriptions, billing, invoices |
| **Admin** | `/api/v1/admin/` | User management, analytics, content moderation |
| **Instructor** | `/api/v1/instructor/` | Course creation, student management, earnings |
| **PULSE ML** | `/api/v1/pulse/` | Learner state prediction, batch scoring, explainability |
| **Health Check** | `/health` | Unified service health (API + DB + PULSE) |

---

## 🛠️ Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Framework** | FastAPI | 0.104.1 |
| **ASGI Server** | Uvicorn | 0.24.0 |
| **Language** | Python | 3.12+ |
| **Database** | PostgreSQL | 15 |
| **ORM** | SQLAlchemy | 2.0.23 |
| **Migrations** | Alembic | 1.12.1 |
| **Caching** | Redis | 7 |
| **Task Queue** | Celery | 5.3.4 |
| **Auth** | Python-Jose | Latest |
| **Password Hashing** | Passlib (bcrypt) | Latest |
| **Payments** | Stripe | 7.5.0 |
| **Email** | SendGrid | 6.10.0 |
| **File Storage** | boto3 (AWS S3) | 1.34.0 |
| **ML Engine** | scikit-learn | 1.3.0+ |
| **Data Validation** | Pydantic v2 | Latest |
| **Testing** | Pytest | 7.4.3 |
| **Containerization** | Docker + Compose | Latest |

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py                  # FastAPI application entry point
│   ├── config.py                # Settings class (60+ configuration options)
│   ├── database.py              # SQLAlchemy engine, session factory
│   ├── dependencies.py          # Shared FastAPI dependency functions
│   │
│   ├── api/
│   │   └── v1/                  # Versioned API route handlers
│   │       ├── auth.py          # Authentication endpoints (JWT, OTP, password)
│   │       ├── users.py         # User profile & settings endpoints
│   │       ├── courses.py       # Course management endpoints
│   │       ├── lessons.py       # Lesson content endpoints
│   │       ├── practice.py      # Practice & quiz endpoints
│   │       ├── live.py          # Live session endpoints
│   │       ├── community.py     # Community & forum endpoints
│   │       ├── gamification.py  # XP, badge, leaderboard endpoints
│   │       ├── payments.py      # Stripe payment endpoints
│   │       ├── admin.py         # Admin management endpoints
│   │       ├── instructor.py    # Instructor dashboard endpoints
│   │       └── pulse.py         # PULSE ML endpoints
│   │
│   ├── models/                  # SQLAlchemy ORM models (21 tables)
│   │   ├── user.py              # User, Instructor, Student models
│   │   ├── course.py            # Course, Lesson, CourseReview, Progress
│   │   ├── live.py              # LiveSession model
│   │   ├── community.py         # Post, Thread, Message models
│   │   ├── practice.py          # Quiz, Exercise, Flashcard models
│   │   ├── gamification.py      # Badge, Achievement, Leaderboard models
│   │   ├── payment.py           # Payment, Subscription models
│   │   ├── admin.py             # Report, Announcement, Notification models
│   │   └── pulse.py             # PulsePrediction model
│   │
│   ├── schemas/                 # Pydantic request/response schemas
│   │   ├── auth.py              # Auth request/response types
│   │   ├── user.py              # User schemas
│   │   ├── course.py            # Course schemas
│   │   └── ...                  # One schema file per domain
│   │
│   ├── middleware/              # Custom FastAPI middleware
│   │   ├── cors.py              # CORS configuration
│   │   ├── rate_limit.py        # Rate limiting middleware
│   │   └── trusted_host.py      # Trusted host middleware
│   │
│   ├── utils/                   # Utility / helper modules
│   │   ├── security.py          # JWT creation, password hashing
│   │   ├── email.py             # Email sending (SendGrid/SMTP)
│   │   └── storage.py           # AWS S3 file operations
│   │
│   └── pulse/                   # PULSE ML sub-package
│       ├── core/
│       │   └── model_loader.py  # Singleton artifact loader
│       ├── services/
│       │   └── pulse_service.py # Inference & intervention logic
│       └── pulse.py             # Pydantic schemas for PULSE
│
├── alembic/                     # Database migration files
│   ├── env.py                   # Alembic environment config
│   └── versions/                # Migration scripts
│
├── pulse_artifacts/             # Pre-trained ML model artifacts
│   ├── pulse_model.pkl          # GradientBoosting classifier (97.5% acc)
│   ├── pulse_scaler.pkl         # StandardScaler for features
│   ├── label_encoders.pkl       # LabelEncoders for categorical features
│   └── pulse_metadata.json      # Model metadata, feature list, classes
│
├── Dockerfile                   # Production Docker image
├── docker-compose.yml           # Development environment (API + DB + Redis)
├── docker-compose.prod.yml      # Production environment (+ Nginx + Celery)
├── requirements.txt             # Python dependencies (52 packages)
├── .env.example                 # Environment variable template
├── alembic.ini                  # Alembic configuration
└── seed_flashcards.py           # Database seeding script
```

---

## 🔧 Prerequisites

| Requirement | Version | Notes |
|------------|---------|-------|
| **Python** | 3.12+ | [Download](https://python.org) |
| **pip** | Latest | Bundled with Python |
| **PostgreSQL** | 15+ | [Download](https://www.postgresql.org/download) |
| **Redis** | 7+ | [Download](https://redis.io/download) |
| **Docker** | Latest | Only required for Docker setup |
| **Docker Compose** | Latest | Bundled with Docker Desktop |

---

## ⚙️ Installation & Setup

### Option A: Docker (Recommended)

Docker automatically provisions PostgreSQL, Redis, the FastAPI server, and the Celery worker.

#### Step 1 — Clone the repository

```bash
git clone https://github.com/ngabo-dev/fluentfusion.v1.git
cd fluentfusion.v1/backend
```

#### Step 2 — Create the environment file

```bash
cp .env.example .env
```

Edit `.env` and fill in the required values. At minimum:

```env
DEBUG=true
ENVIRONMENT=development
DATABASE_URL=postgresql://fluentfusion:secret@db:5432/fluentfusion
REDIS_URL=redis://redis:6379
SECRET_KEY=your-super-secret-key-at-least-32-characters-long
JWT_SECRET_KEY=your-jwt-secret-key-at-least-32-characters-long
```

#### Step 3 — Build and start the stack

```bash
docker-compose up --build
```

Docker Compose starts four services:

| Service | Port | Description |
|---------|------|-------------|
| `api` | `8000` | FastAPI application server |
| `db` | `5432` | PostgreSQL 15 database |
| `redis` | `6379` | Redis 7 cache / broker |
| `worker` | — | Celery background task worker |

#### Step 4 — Verify the service is running

```bash
curl http://localhost:8000/health
```

Expected response:

```json
{
  "status": "healthy",
  "database": "connected",
  "pulse_model": "loaded"
}
```

Interactive API docs are live at: **http://localhost:8000/docs**

---

### Option B: Manual Setup

#### Step 1 — Clone the repository

```bash
git clone https://github.com/ngabo-dev/fluentfusion.v1.git
cd fluentfusion.v1/backend
```

#### Step 2 — Create and activate a Python virtual environment

```bash
# Create virtual environment
python -m venv venv

# Activate (macOS / Linux)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate
```

#### Step 3 — Install Python dependencies

```bash
pip install -r requirements.txt
```

#### Step 4 — Set up PostgreSQL

```bash
# Connect to postgres as superuser
psql -U postgres

# Run the following SQL commands:
CREATE USER fluentfusion WITH PASSWORD 'your_secure_password';
CREATE DATABASE fluentfusion OWNER fluentfusion;
GRANT ALL PRIVILEGES ON DATABASE fluentfusion TO fluentfusion;
\q
```

#### Step 5 — Set up Redis

**macOS (Homebrew)**:
```bash
brew install redis
brew services start redis
```

**Ubuntu / Debian**:
```bash
sudo apt update && sudo apt install redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

**Windows**:
Download the Redis installer from [github.com/microsoftarchive/redis/releases](https://github.com/microsoftarchive/redis/releases)

#### Step 6 — Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values. See the [Environment Variables](#-environment-variables) section for the full reference.

#### Step 7 — Run database migrations

```bash
alembic upgrade head
```

This creates all 21 database tables.

#### Step 8 — (Optional) Seed the database

```bash
python seed_flashcards.py
```

Populates the database with starter flashcard data for development and testing.

#### Step 9 — Start the backend server

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The server is now live at:
- **API**: `http://localhost:8000`
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **Health Check**: `http://localhost:8000/health`

#### Step 10 — (Optional) Start the Celery worker

In a separate terminal:

```bash
celery -A app.celery worker --loglevel=info
```

The worker handles background tasks like email sending, notification dispatch, and batch predictions.

---

## 🔐 Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure all required values.

### Application

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DEBUG` | ✅ | `true` | Enable debug mode (`false` in production) |
| `ENVIRONMENT` | ✅ | `development` | `development` or `production` |

### Database

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string, e.g. `postgresql://user:password@localhost:5432/fluentfusion` |

### Caching & Task Queue

| Variable | Required | Description |
|----------|----------|-------------|
| `REDIS_URL` | ✅ | Redis connection string, e.g. `redis://localhost:6379` |

### JWT Authentication

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SECRET_KEY` | ✅ | — | Application secret (min 32 characters) |
| `JWT_SECRET_KEY` | ✅ | — | JWT signing secret (min 32 characters) |
| `JWT_ALGORITHM` | ✅ | `HS256` | Signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | ✅ | `30` | Access token TTL |
| `REFRESH_TOKEN_EXPIRE_DAYS` | ✅ | `7` | Refresh token TTL |

### CORS & Frontend

| Variable | Required | Description |
|----------|----------|-------------|
| `FRONTEND_URL` | ✅ | Frontend origin, e.g. `http://localhost:5173` |
| `CORS_ORIGINS` | ✅ | JSON array of allowed origins, e.g. `["http://localhost:5173"]` |

### Payments (Stripe)

| Variable | Required | Description |
|----------|----------|-------------|
| `STRIPE_SECRET_KEY` | ⚠️ | Stripe secret key (`sk_test_...` or `sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | ⚠️ | Stripe webhook endpoint signing secret (`whsec_...`) |

### File Storage (AWS S3)

| Variable | Required | Description |
|----------|----------|-------------|
| `AWS_ACCESS_KEY_ID` | ⚠️ | AWS access key ID |
| `AWS_SECRET_ACCESS_KEY` | ⚠️ | AWS secret access key |
| `AWS_REGION` | ⚠️ | AWS region, e.g. `us-east-1` |
| `S3_BUCKET` | ⚠️ | S3 bucket name |

### Email (SendGrid — Primary)

| Variable | Required | Description |
|----------|----------|-------------|
| `SENDGRID_API_KEY` | ⚠️ | SendGrid API key (`SG...`) |
| `SENDGRID_FROM_EMAIL` | ⚠️ | Sender email address |

### Email (SMTP — Fallback)

| Variable | Required | Description |
|----------|----------|-------------|
| `SMTP_HOST` | ⚠️ | SMTP server host, e.g. `smtp.gmail.com` |
| `SMTP_PORT` | ⚠️ | SMTP port, e.g. `587` |
| `SMTP_USER` | ⚠️ | SMTP username / email |
| `SMTP_PASSWORD` | ⚠️ | SMTP password or app-specific password |

### PULSE ML Engine

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PULSE_MODEL_PATH` | ✅ | `/app/pulse_artifacts/pulse_model.pkl` | Path to the trained model |
| `PULSE_SCALER_PATH` | ✅ | `/app/pulse_artifacts/pulse_scaler.pkl` | Path to the feature scaler |
| `PULSE_ENCODERS_PATH` | ✅ | `/app/pulse_artifacts/label_encoders.pkl` | Path to label encoders |
| `PULSE_METADATA_PATH` | ✅ | `/app/pulse_artifacts/pulse_metadata.json` | Path to model metadata |
| `PULSE_CONFIDENCE_THRESHOLD` | ✅ | `0.55` | Minimum confidence to accept a prediction |
| `PULSE_REEVAL_INTERVAL_HOURS` | ✅ | `24` | How often to re-evaluate learner states |

### Rate Limiting

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RATE_LIMIT_ENABLED` | ✅ | `true` | Enable/disable rate limiting |
| `RATE_LIMIT_REQUESTS` | ✅ | `100` | Max requests per window |
| `RATE_LIMIT_PERIOD` | ✅ | `60` | Rate limit window in seconds |

### Admin

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_EMAILS` | ⚠️ | JSON array of admin email addresses |

> **Legend**: ✅ Required · ⚠️ Required for the specific feature to work

---

## 🗄️ Database Migrations

FluentFusion uses **Alembic** for database schema version control.

```bash
# Apply all pending migrations (first-time setup)
alembic upgrade head

# Check current revision
alembic current

# View migration history
alembic history --verbose

# Rollback last migration
alembic downgrade -1

# Rollback to a specific revision
alembic downgrade <revision_id>

# Generate a new migration from model changes
alembic revision --autogenerate -m "add new column to users"

# Upgrade to a specific revision
alembic upgrade <revision_id>
```

### Database Tables (21 Models)

| Table | Model | Description |
|-------|-------|-------------|
| `users` | `User` | Core user accounts |
| `instructors` | `Instructor` | Instructor profiles & certifications |
| `students` | `Student` | Student profiles & settings |
| `courses` | `Course` | Course catalog |
| `lessons` | `Lesson` | Lesson content & materials |
| `course_reviews` | `CourseReview` | Student course reviews |
| `progress` | `Progress` | Lesson completion tracking |
| `live_sessions` | `LiveSession` | Scheduled video sessions |
| `community_posts` | `Post` | Forum posts |
| `community_threads` | `Thread` | Discussion threads |
| `messages` | `Message` | Direct messages |
| `quizzes` | `Quiz` | Practice quizzes |
| `exercises` | `Exercise` | Grammar / vocab exercises |
| `badges` | `Badge` | Achievement badges |
| `achievements` | `Achievement` | User achievements |
| `leaderboard` | `Leaderboard` | XP rankings |
| `payments` | `Payment` | Payment records |
| `subscriptions` | `Subscription` | Active subscriptions |
| `notifications` | `Notification` | User notifications |
| `reports` | `Report` | Admin moderation reports |
| `pulse_predictions` | `PulsePrediction` | PULSE ML prediction history |

---

## ▶️ Running the Server

### Development

```bash
# With auto-reload (recommended for development)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# With specific number of workers (no --reload in multi-worker mode)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Production (Docker)

```bash
docker-compose -f docker-compose.prod.yml up --build
```

The production compose file includes:
- **FastAPI** with 4 Uvicorn workers on port `8000`
- **PostgreSQL 15** with persistent data volume
- **Redis 7** with persistent data volume
- **Celery** worker for async background tasks
- **Nginx** serving the compiled React frontend on port `3000`

### Useful Management Commands

```bash
# View running containers
docker-compose ps

# View API logs
docker-compose logs -f api

# Exec into the API container
docker-compose exec api bash

# Run migrations inside container
docker-compose exec api alembic upgrade head

# Seed the database inside container
docker-compose exec api python seed_flashcards.py
```

---

## 📖 API Reference

The full interactive documentation is available at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI JSON**: `http://localhost:8000/openapi.json`

### Authentication

All protected endpoints require a Bearer token in the `Authorization` header:

```http
Authorization: Bearer <access_token>
```

### Auth Endpoints (`/api/v1/auth/`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/auth/register` | ❌ | Register a new user |
| `POST` | `/api/v1/auth/login` | ❌ | Login and receive JWT tokens |
| `POST` | `/api/v1/auth/verify-email` | ❌ | Verify email with OTP code |
| `POST` | `/api/v1/auth/resend-otp` | ❌ | Resend verification OTP |
| `POST` | `/api/v1/auth/refresh` | ❌ | Refresh expired access token |
| `POST` | `/api/v1/auth/logout` | ✅ | Invalidate current token |
| `POST` | `/api/v1/auth/forgot-password` | ❌ | Send password reset email |
| `POST` | `/api/v1/auth/reset-password` | ❌ | Set a new password with reset token |
| `GET` | `/api/v1/auth/me` | ✅ | Get current authenticated user |

**Example — Login request:**

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "your_password"}'
```

**Example — Login response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "student"
  }
}
```

### Users Endpoints (`/api/v1/users/`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/users/profile` | ✅ | Get own profile |
| `PUT` | `/api/v1/users/profile` | ✅ | Update profile |
| `GET` | `/api/v1/users/{user_id}` | ✅ | Get another user's public profile |
| `PUT` | `/api/v1/users/settings` | ✅ | Update app settings & preferences |

### Courses Endpoints (`/api/v1/courses/`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/courses/` | ❌ | List all courses (with filters) |
| `POST` | `/api/v1/courses/` | ✅ Instructor | Create a new course |
| `GET` | `/api/v1/courses/{id}` | ❌ | Get course details |
| `PUT` | `/api/v1/courses/{id}` | ✅ Instructor | Update course |
| `DELETE` | `/api/v1/courses/{id}` | ✅ Instructor | Delete course |
| `POST` | `/api/v1/courses/{id}/enroll` | ✅ Student | Enroll in a course |
| `GET` | `/api/v1/courses/{id}/curriculum` | ✅ | Get course curriculum |
| `POST` | `/api/v1/courses/{id}/reviews` | ✅ Student | Post a course review |
| `GET` | `/api/v1/courses/{id}/reviews` | ❌ | List course reviews |

### Practice Endpoints (`/api/v1/practice/`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/practice/exercises` | ✅ | Get practice exercises |
| `POST` | `/api/v1/practice/submit` | ✅ | Submit exercise answers |
| `GET` | `/api/v1/practice/flashcards` | ✅ | Get flashcard deck |
| `POST` | `/api/v1/practice/quiz/start` | ✅ | Start a quiz session |
| `POST` | `/api/v1/practice/quiz/submit` | ✅ | Submit quiz answers |

### Live Sessions (`/api/v1/live/`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/live/sessions` | ❌ | List upcoming live sessions |
| `POST` | `/api/v1/live/sessions` | ✅ Instructor | Create a live session |
| `POST` | `/api/v1/live/sessions/{id}/book` | ✅ Student | Book a session |
| `GET` | `/api/v1/live/sessions/{id}/join` | ✅ | Get session join link |
| `GET` | `/api/v1/live/recordings` | ✅ | List session recordings |

### Community (`/api/v1/community/`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/community/threads` | ❌ | List forum threads |
| `POST` | `/api/v1/community/threads` | ✅ | Create a thread |
| `GET` | `/api/v1/community/threads/{id}/posts` | ❌ | Get thread posts |
| `POST` | `/api/v1/community/threads/{id}/posts` | ✅ | Reply to a thread |
| `GET` | `/api/v1/community/exchange` | ✅ | Language exchange listings |
| `GET` | `/api/v1/community/groups` | ✅ | Study groups |

### Gamification (`/api/v1/gamification/`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/gamification/leaderboard` | ✅ | Global XP leaderboard |
| `GET` | `/api/v1/gamification/badges` | ✅ | User badges |
| `GET` | `/api/v1/gamification/achievements` | ✅ | User achievements |
| `GET` | `/api/v1/gamification/streak` | ✅ | Current daily streak |
| `POST` | `/api/v1/gamification/xp` | ✅ | Award XP (admin only) |

### Payments (`/api/v1/payments/`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/payments/subscribe` | ✅ | Create a subscription |
| `GET` | `/api/v1/payments/subscription` | ✅ | Get current subscription |
| `DELETE` | `/api/v1/payments/subscription` | ✅ | Cancel subscription |
| `GET` | `/api/v1/payments/invoices` | ✅ | List invoices |
| `POST` | `/api/v1/payments/webhook` | ❌ | Stripe webhook handler |

### Admin (`/api/v1/admin/`)

All admin endpoints require the `admin` role.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/admin/users` | List all users |
| `PUT` | `/api/v1/admin/users/{id}` | Update any user |
| `DELETE` | `/api/v1/admin/users/{id}` | Delete a user |
| `GET` | `/api/v1/admin/analytics` | Platform analytics |
| `GET` | `/api/v1/admin/reports` | Moderation reports |
| `POST` | `/api/v1/admin/announcements` | Post a platform announcement |

### Instructor (`/api/v1/instructor/`)

All instructor endpoints require the `instructor` role.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/instructor/dashboard` | Instructor dashboard stats |
| `GET` | `/api/v1/instructor/courses` | Instructor's own courses |
| `GET` | `/api/v1/instructor/students` | Enrolled students |
| `GET` | `/api/v1/instructor/earnings` | Earnings & payout history |

---

## 🤖 PULSE ML Engine

**PULSE** (Predictive Unified Learner State Engine) is an embedded ML pipeline that predicts each learner's current engagement state and provides actionable intervention recommendations.

### Model Details

| Attribute | Value |
|-----------|-------|
| **Algorithm** | Gradient Boosting Classifier |
| **Accuracy** | 97.5% |
| **Training Data** | Synthetic learner activity dataset |
| **Artifacts** | `pulse_artifacts/` (included in repo) |

### Learner States

| State | Label | Description |
|-------|-------|-------------|
| 0 | **At Risk** | Learner is disengaged; needs immediate intervention |
| 1 | **Struggling** | Learner is behind; needs extra support |
| 2 | **On Track** | Learner is progressing normally |
| 3 | **Excelling** | Learner is ahead of schedule |
| 4 | **Completed** | Learner has finished their goal |

### PULSE Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/pulse/states` | ❌ | Get all 5 learner states with descriptions |
| `POST` | `/api/v1/pulse/predict` | ✅ | Single learner state prediction |
| `POST` | `/api/v1/pulse/batch` | ✅ | Batch predictions (up to 500 learners) |
| `GET` | `/api/v1/pulse/model-info` | ✅ | Model version, accuracy, F1 score |
| `GET` | `/api/v1/pulse/feature-importance` | ✅ | Top N most important features |

### Example — Single Prediction

**Request:**

```bash
curl -X POST http://localhost:8000/api/v1/pulse/predict \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "learner_id": "user-uuid",
    "days_since_last_activity": 3,
    "total_xp": 1250,
    "lessons_completed": 12,
    "quiz_average_score": 0.74,
    "current_streak": 5,
    "sessions_per_week": 3.5
  }'
```

**Response:**

```json
{
  "learner_id": "user-uuid",
  "predicted_state": "On Track",
  "state_code": 2,
  "confidence": 0.89,
  "recommendations": [
    "Keep up the current pace — you are on track to hit your goal.",
    "Try the advanced grammar module to keep progressing.",
    "Consider joining a live session this week."
  ]
}
```

### Artifacts (Pre-trained, Included)

```
pulse_artifacts/
├── pulse_model.pkl       # Serialized GradientBoosting model
├── pulse_scaler.pkl      # Fitted StandardScaler
├── label_encoders.pkl    # Fitted LabelEncoders for categorical features
└── pulse_metadata.json   # Feature names, class labels, version, accuracy
```

> The model artifacts are included in the repository and are loaded at startup. No retraining is required.

---

## 🔒 Authentication & Security

### JWT Token Flow

```
1. POST /api/v1/auth/register  →  Creates user, sends OTP email
2. POST /api/v1/auth/verify-email  →  Verifies OTP, activates account
3. POST /api/v1/auth/login  →  Returns access_token + refresh_token
4. (Every 30 min) POST /api/v1/auth/refresh  →  New access_token
5. POST /api/v1/auth/logout  →  Invalidates refresh token
```

### Token Configuration

| Token | Expiry | Stored In |
|-------|--------|-----------|
| `access_token` | 30 minutes | Memory / `localStorage` |
| `refresh_token` | 7 days | `HttpOnly` cookie / `localStorage` |

### Password Security

- Passwords are hashed using **bcrypt** via Passlib
- Minimum strength requirements enforced at schema level

### Middleware Stack

| Middleware | Purpose |
|-----------|---------|
| **CORS** | Restrict cross-origin requests to allowed origins |
| **Trusted Host** | Block requests from untrusted host headers |
| **Rate Limiting** | 100 requests / 60 seconds per IP (configurable) |

### Role-Based Access Control

| Role | Access Level |
|------|-------------|
| `student` | Own profile, courses, practice, community |
| `instructor` | Student access + course creation, student management |
| `admin` | Full platform access, user management, analytics |

---

## 🗃️ Background Tasks

The Celery worker handles asynchronous jobs that should not block API responses:

| Task | Trigger | Description |
|------|---------|-------------|
| **Send verification email** | Registration | Sends OTP to new user's email |
| **Send password reset email** | Password reset request | Sends reset link via email |
| **Send notification** | Various events | Dispatches in-app and email notifications |
| **Batch PULSE scoring** | Scheduled | Re-evaluates learner states every 24 hours |
| **Stripe webhook processing** | Payment events | Updates subscription status |

### Starting the Worker

```bash
# Development
celery -A app.celery worker --loglevel=info

# Production (with concurrency)
celery -A app.celery worker --loglevel=info --concurrency=4

# Monitor tasks (web UI)
celery -A app.celery flower
```

---

## 📦 File Storage

Files (course materials, profile pictures, recording assets) are stored in **AWS S3** via the `app/utils/storage.py` module.

```python
# Upload a file
upload_file(file_bytes, key="courses/thumbnails/course-123.jpg")

# Generate a pre-signed download URL (valid 1 hour)
get_presigned_url("courses/thumbnails/course-123.jpg")
```

> For local development without S3, you can use [MinIO](https://min.io/) as a local S3-compatible alternative.

---

## 📧 Email Service

FluentFusion supports two email providers, with automatic fallback:

1. **SendGrid** (primary) — Configure `SENDGRID_API_KEY`
2. **SMTP** (fallback) — Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`

Email templates are sent for:
- Email address verification (OTP)
- Password reset
- New course enrollment confirmation
- Live session reminders
- Achievement unlocked

---

## 🧪 Testing

FluentFusion uses **Pytest** as the testing framework.

```bash
# Run all tests
pytest

# Run with coverage report
pytest --cov=app --cov-report=term-missing

# Run a specific test file
pytest tests/test_auth.py

# Run a specific test function
pytest tests/test_auth.py::test_register_user

# Run with verbose output
pytest -v

# Run only tests matching a keyword
pytest -k "auth"
```

### Test Configuration

Tests use a separate in-memory SQLite database (configured in `conftest.py`) so they do not affect your development PostgreSQL instance.

---

## 🎨 Code Quality

```bash
# Auto-format code (Black)
black app/

# Sort imports (isort)
isort app/

# Lint code (Flake8)
flake8 app/

# Type checking (mypy)
mypy app/
```

---

## 🚀 Deployment

### Production Docker Compose

```bash
# Start the full production stack
docker-compose -f docker-compose.prod.yml up --build -d

# Run migrations after first deploy
docker-compose -f docker-compose.prod.yml exec api alembic upgrade head

# View logs
docker-compose -f docker-compose.prod.yml logs -f api

# Stop the stack
docker-compose -f docker-compose.prod.yml down
```

### Production Services

| Service | Port | Description |
|---------|------|-------------|
| `frontend` (Nginx) | `3000` | Compiled React app |
| `api` (FastAPI) | `8000` | FastAPI with 4 Uvicorn workers |
| `db` (PostgreSQL 15) | `5432` | Persistent DB with volume |
| `redis` (Redis 7) | `6379` | Persistent cache with volume |
| `worker` (Celery) | — | Background task processor |

### Production Checklist

Before going live, ensure:

- [ ] `DEBUG=false` in `.env`
- [ ] `ENVIRONMENT=production` in `.env`
- [ ] Strong `SECRET_KEY` and `JWT_SECRET_KEY` (32+ chars)
- [ ] Real Stripe keys (`sk_live_...`)
- [ ] Real SendGrid or SMTP credentials
- [ ] Real AWS S3 bucket configured
- [ ] CORS origins set to your production frontend domain
- [ ] Database backed up and migration applied
- [ ] HTTPS termination configured (Nginx or load balancer)

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
