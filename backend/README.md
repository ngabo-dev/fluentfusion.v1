# 🧠 FluentFusion — Backend API

> FastAPI backend powering the FluentFusion language learning platform.

![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-009688?logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.12+-3776AB?logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0.30-red)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Project Structure](#-project-structure)
- [Database Models](#-database-models)
- [Setup & Running](#-setup--running)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
  - [Auth](#auth---apiauth)
  - [Admin](#admin---apiadmin)
  - [Instructor](#instructor---apiinstructor)
  - [Student](#student---apistudent)
  - [Public](#public-endpoints)
- [Email System](#-email-system)
- [Authentication & Security](#-authentication--security)
- [Demo Accounts](#-demo-accounts)

---

## 🎯 Overview

The FluentFusion backend is a REST API built with **FastAPI** and **SQLAlchemy**, connected to a cloud-hosted **PostgreSQL** database on Aiven. It handles:

- JWT-based authentication with OTP email verification and password reset
- Role-based access control (student, instructor, admin)
- Full CRUD for courses, lessons, enrollments, live sessions, quizzes
- Messaging between students and instructors
- Revenue, payout, and payment tracking
- PULSE engagement state tracking per learner
- Transactional email via Gmail SMTP

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── routers/
│   │   ├── auth.py             # Register, login, OTP verify, forgot/reset password
│   │   ├── admin.py            # Admin-only endpoints (requires admin role)
│   │   ├── instructor.py       # Instructor endpoints (requires instructor role)
│   │   └── student.py          # Student endpoints (requires student role)
│   ├── auth.py                 # JWT creation, password hashing, get_current_user, require_role
│   ├── email_utils.py          # SMTP sender, OTP email template, reset email template
│   ├── models.py               # All SQLAlchemy models (14 tables)
│   ├── main.py                 # FastAPI app, CORS config, router registration, /api/stats
│   └── seed.py                 # Database seeding script (Faker-generated data)
├── .env                        # Environment variables (not committed)
├── ca.pem                      # Aiven SSL certificate for PostgreSQL
└── requirements.txt            # Python dependencies
```

---

## 🗄️ Database Models

All models are defined in `app/models.py` using SQLAlchemy ORM. The database is hosted on **Aiven PostgreSQL 15** — no local setup needed.

| Model | Table | Description |
|---|---|---|
| User | `users` | All users (students, instructors, admins). Includes OTP, reset token, PULSE state, XP |
| Course | `courses` | Courses created by instructors |
| Lesson | `lessons` | Individual lessons belonging to a course |
| Enrollment | `enrollments` | Student ↔ Course relationship with completion % |
| LiveSession | `live_sessions` | Scheduled or completed live sessions |
| Quiz | `quizzes` | Quizzes attached to courses |
| Payment | `payments` | Payment records per user/course |
| Payout | `payouts` | Instructor payout requests |
| Message | `messages` | Direct messages between users |
| Review | `reviews` | Student reviews on courses |
| Notification | `notifications` | Platform-wide notifications |
| AuditLog | `audit_logs` | Admin action audit trail |
| Report | `reports` | User-submitted reports |
| MonthlyRevenue | `monthly_revenue` | Aggregated monthly revenue per instructor |

### User Model — Key Fields

```python
id               # Primary key
name             # Full name
email            # Unique, indexed
hashed_password  # bcrypt hash
role             # student | instructor | admin
status           # active | banned | pending
is_verified      # Email verified flag
otp_code         # 6-digit OTP (expires in 10 min)
otp_expiry       # OTP expiry datetime
reset_token      # Password reset token (expires in 1 hour)
reset_token_expiry
avatar_initials  # e.g. "JP"
xp               # Experience points
pulse_state      # thriving | coasting | struggling | burning_out | disengaged
created_at
last_active
```

---

## ⚙️ Setup & Running

### Step 1 — Create virtual environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate       # macOS/Linux
# venv\Scripts\activate        # Windows
```

### Step 2 — Install dependencies

```bash
pip install -r requirements.txt
```

### Step 3 — Configure environment

```bash
cp .env.example .env
# Edit .env with your values (see Environment Variables below)
```

### Step 4 — Start the server

```bash
uvicorn app.main:app --reload --port 8000
```

The API is live at **http://localhost:8000**
Swagger docs at **http://localhost:8000/docs**

### Step 5 — (Optional) Seed the database

```bash
python app/seed.py
```

This populates the database with demo users, courses, enrollments, payments, and more using Faker.

### Run database column migrations (if needed)

If you added new columns to models.py and the DB doesn't have them yet:

```bash
python3 -c "
from app.models import engine
from sqlalchemy import text
with engine.connect() as conn:
    conn.execute(text('ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_code VARCHAR(6)'))
    conn.execute(text('ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_expiry TIMESTAMP'))
    conn.execute(text('ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token VARCHAR'))
    conn.execute(text('ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP'))
    conn.commit()
"
```

---

## 🔐 Environment Variables

Create a `backend/.env` file with the following:

```env
# ── Database (Aiven PostgreSQL — already configured) ──────────────────────
DATABASE_URL=postgresql://user:password@host:port/defaultdb?sslmode=require

# ── JWT ───────────────────────────────────────────────────────────────────
SECRET_KEY=your-secret-key-minimum-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# ── Frontend URL (used in password reset email links) ─────────────────────
FRONTEND_URL=http://localhost:5173

# ── Email (Gmail SMTP) ────────────────────────────────────────────────────
EMAIL_ENABLED=True
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=your-gmail@gmail.com
FROM_NAME=FluentFusion AI
```

> **Gmail App Password**: Google Account → Security → 2-Step Verification → App Passwords → generate one for "Mail". Use this as `SMTP_PASSWORD`, not your regular Gmail password.

> Set `EMAIL_ENABLED=False` during development to skip sending real emails (OTP codes will be printed to the console instead).

---

## 🌐 API Reference

Base URL: `http://localhost:8000`
All protected endpoints require: `Authorization: Bearer <token>`

---

### Auth — `/api/auth/`

#### `POST /api/auth/register`
Register a new user. Sends a 6-digit OTP to the user's email.

**Request body (JSON):**
```json
{
  "name": "Jean Pierre",
  "email": "jp@example.com",
  "password": "secret123",
  "role": "student"
}
```
> `role` must be `"student"` or `"instructor"`. Admins are seeded only.

**Response `201`:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "role": "student",
  "name": "Jean Pierre",
  "id": 42
}
```

**Errors:**
| Code | Detail |
|---|---|
| 400 | Email already registered |
| 400 | Role must be student or instructor |
| 400 | Password must be at least 6 characters |

---

#### `POST /api/auth/login`
Login with email and password. Uses **OAuth2 form encoding** (not JSON).

**Request body (`application/x-www-form-urlencoded`):**
```
username=jp@example.com&password=secret123
```

**Response `200`:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "role": "student",
  "name": "Jean Pierre",
  "id": 42
}
```

**Errors:**
| Code | Detail |
|---|---|
| 401 | Invalid credentials |
| 403 | Account suspended |

---

#### `POST /api/auth/verify-email`
Verify email with the 6-digit OTP sent on registration.

**Request body (JSON):**
```json
{ "email": "jp@example.com", "code": "482910" }
```

**Response `200`:**
```json
{ "message": "Email verified successfully" }
```

**Errors:**
| Code | Detail |
|---|---|
| 400 | Invalid verification code |
| 400 | Code expired. Request a new one. |
| 404 | User not found |

---

#### `POST /api/auth/resend-verification`
Resend a new OTP to the user's email.

**Request body (JSON):**
```json
{ "email": "jp@example.com" }
```

**Response `200`:**
```json
{ "message": "Verification code resent" }
```

---

#### `POST /api/auth/forgot-password`
Send a password reset link to the user's email. Always returns 200 to prevent email enumeration.

**Request body (JSON):**
```json
{ "email": "jp@example.com" }
```

**Response `200`:**
```json
{ "message": "If this email exists, a reset link has been sent." }
```

---

#### `POST /api/auth/reset-password`
Set a new password using the token from the reset email link.

**Request body (JSON):**
```json
{ "token": "abc123...", "new_password": "newpassword123" }
```

**Response `200`:**
```json
{ "message": "Password reset successfully" }
```

**Errors:**
| Code | Detail |
|---|---|
| 400 | Invalid or expired reset link |
| 400 | Reset link has expired. Request a new one. |
| 400 | Password must be at least 6 characters |

---

#### `GET /api/auth/me`
Get the currently authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response `200`:**
```json
{
  "id": 42,
  "name": "Jean Pierre",
  "email": "jp@example.com",
  "role": "student",
  "avatar_initials": "JP"
}
```

---

### Admin — `/api/admin/`

All endpoints require a valid JWT token with role `admin` or `super_admin`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Total users, revenue, active courses, pending payouts, PULSE distribution, monthly revenue |
| GET | `/api/admin/users` | List all users. Query params: `role`, `status`, `search` |
| PATCH | `/api/admin/users/{id}/status` | Update user status (`active` / `banned`) |
| GET | `/api/admin/instructors` | List instructors with course count, student count, revenue |
| PATCH | `/api/admin/instructors/{id}/verify` | Verify and activate an instructor |
| GET | `/api/admin/courses` | List all courses. Query param: `status` |
| PATCH | `/api/admin/courses/{id}/status` | Update course status (`draft` / `pending` / `published` / `rejected`) |
| GET | `/api/admin/revenue` | Total gross, platform fee, instructor payouts, monthly breakdown, top courses |
| GET | `/api/admin/payouts` | List all payout requests. Query param: `status` |
| PATCH | `/api/admin/payouts/{id}/status` | Approve or reject a payout |
| GET | `/api/admin/pulse` | PULSE state distribution + at-risk learners |
| GET | `/api/admin/notifications` | List all platform notifications |
| POST | `/api/admin/notifications` | Send a new notification |
| GET | `/api/admin/audit-log` | Last 100 admin audit log entries |
| GET | `/api/admin/reports` | List user reports. Query param: `status` |
| PATCH | `/api/admin/reports/{id}` | Update report status |
| GET | `/api/admin/live-sessions` | List all live sessions with course and instructor info |
| GET | `/api/admin/analytics` | Platform-wide analytics: users, revenue, completion, top courses |
| GET | `/api/admin/geo` | Geographic distribution of users and languages |
| GET | `/api/admin/payments` | List all payments. Query params: `status`, `search` |
| GET | `/api/admin/admins` | List all admin accounts |
| GET | `/api/admin/settings` | Get platform settings |
| PATCH | `/api/admin/settings` | Update platform settings |

---

### Instructor — `/api/instructor/`

All endpoints require a valid JWT token with role `instructor`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/instructor/dashboard` | Students, revenue, avg rating, completion, monthly revenue, courses, sessions |
| GET | `/api/instructor/courses` | My courses with student count, revenue, completion, rating |
| POST | `/api/instructor/courses` | Create a new course |
| PATCH | `/api/instructor/courses/{id}` | Update a course |
| GET | `/api/instructor/courses/{id}/lessons` | List lessons for a course |
| POST | `/api/instructor/courses/{id}/lessons` | Add a lesson to a course |
| PATCH | `/api/instructor/courses/{id}/lessons/{lid}` | Update a lesson |
| GET | `/api/instructor/live-sessions` | My live sessions |
| POST | `/api/instructor/live-sessions` | Schedule a new live session |
| GET | `/api/instructor/quizzes` | My quizzes across all courses |
| GET | `/api/instructor/students` | Full student roster with PULSE state, XP, completion |
| GET | `/api/instructor/pulse` | PULSE state distribution for my students |
| GET | `/api/instructor/messages` | Inbox — list of conversations |
| GET | `/api/instructor/messages/{student_id}` | Full conversation with a student |
| POST | `/api/instructor/messages/{student_id}` | Send a message to a student |
| GET | `/api/instructor/reviews` | All reviews on my courses with rating distribution |
| PATCH | `/api/instructor/reviews/{id}/reply` | Reply to a student review |
| GET | `/api/instructor/revenue` | Revenue breakdown by course, monthly chart |
| GET | `/api/instructor/payouts` | My payout history + available balance |
| POST | `/api/instructor/payouts` | Request a new payout |
| GET | `/api/instructor/notifications` | Notifications targeted to instructors or all |
| GET | `/api/instructor/analytics` | Detailed analytics: students, revenue, completion, course performance |
| GET | `/api/instructor/profile` | My profile |
| PATCH | `/api/instructor/profile` | Update my profile |

---

### Student — `/api/student/`

All endpoints require a valid JWT token with role `student`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/student/dashboard` | Enrolled courses, XP, completion, upcoming sessions, total spent |
| GET | `/api/student/courses` | My enrolled courses with progress |
| GET | `/api/student/courses/{id}/lessons` | Lessons for an enrolled course |
| GET | `/api/student/live-sessions` | Upcoming and past live sessions for my courses |
| GET | `/api/student/quizzes` | Quizzes for my enrolled courses |
| GET | `/api/student/messages` | Inbox — conversations with instructors |
| GET | `/api/student/messages/{peer_id}` | Full conversation with a peer |
| POST | `/api/student/messages/{peer_id}` | Send a message |
| GET | `/api/student/notifications` | Notifications targeted to students or all |
| GET | `/api/student/profile` | My profile with XP and PULSE state |
| PATCH | `/api/student/profile` | Update my profile |

---

### Public Endpoints

No authentication required.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/stats` | Platform stats: active learners, instructors, courses, languages, success rate |
| GET | `/health` | API health check — returns `{ "status": "ok" }` |
| GET | `/docs` | Interactive Swagger UI |
| GET | `/redoc` | ReDoc API documentation |

**`/api/stats` response:**
```json
{
  "active_learners": 1240,
  "instructors": 9,
  "courses": 14,
  "languages": 6,
  "success_rate": 98
}
```

---

## 📧 Email System

Email is handled in `app/email_utils.py` using Python's built-in `smtplib`.

### How it works

1. `send_email(to, subject, html)` — core SMTP sender using `starttls` on port 587
2. `send_otp_email(to, name, otp)` — called on register and resend-verification
3. `send_reset_email(to, name, reset_link)` — called on forgot-password

### Disabling email in development

Set `EMAIL_ENABLED=False` in `.env`. The OTP code will be printed to the terminal instead of sent:

```
[EMAIL DISABLED] To: jp@example.com | Subject: Your FluentFusion verification code
```

### OTP details
- 6-digit random number (`100000`–`999999`)
- Expires in **10 minutes**
- Stored in `users.otp_code` and `users.otp_expiry`
- Cleared from DB after successful verification

### Reset token details
- `secrets.token_urlsafe(32)` — cryptographically secure
- Expires in **1 hour**
- Stored in `users.reset_token` and `users.reset_token_expiry`
- Cleared from DB after successful password reset
- Reset link format: `{FRONTEND_URL}/reset-password?token=<token>`

---

## 🔐 Authentication & Security

### JWT Tokens

Tokens are created in `app/auth.py` using `python-jose`:

```python
create_access_token({"sub": str(user.id), "role": user.role})
```

- Algorithm: `HS256`
- Expiry: `ACCESS_TOKEN_EXPIRE_MINUTES` (default 1440 = 24 hours)
- Signed with `SECRET_KEY` from `.env`

### Password Hashing

Passwords are hashed with `bcrypt` via `passlib`:

```python
hash_password(plain)     # returns bcrypt hash
verify_password(plain, hashed)  # returns bool
```

### Role Guards

```python
require_role(RoleEnum.admin)       # admin only
require_role(RoleEnum.instructor)  # instructor only
require_role(RoleEnum.student)     # student only
```

Used as FastAPI dependencies on protected routes.

### CORS

Configured in `app/main.py` to allow requests from:
- `http://localhost:5173`
- `http://localhost:5174`
- `http://localhost:5175`
- `http://localhost:3000`

---

## 👤 Demo Accounts

These accounts are pre-seeded by `app/seed.py`:

| Role | Email | Password |
|---|---|---|
| Admin | c.okafor@fluentfusion.com | admin123 |
| Admin | r.ahmed@fluentfusion.com | admin123 |
| Instructor | a.ndiaye@ff.com | instructor123 |
| Instructor | l.chen@ff.com | instructor123 |
| Student | k.larbi@gmail.com | student123 |
| Student | f.rashid@univ.edu | student123 |

---

## 📦 Dependencies

```
fastapi==0.111.0          # REST API framework
uvicorn[standard]==0.29.0 # ASGI server
sqlalchemy==2.0.30        # ORM
psycopg2-binary==2.9.9    # PostgreSQL driver
python-jose[cryptography]==3.3.0  # JWT
passlib[bcrypt]==1.7.4    # Password hashing
bcrypt==4.0.1             # bcrypt backend
python-multipart==0.0.9   # Form data (OAuth2 login)
python-dotenv==1.0.1      # .env loading
faker==24.11.0            # Seeding fake data
```

---

*FluentFusion Backend — Built with FastAPI · PostgreSQL · Aiven Cloud*
