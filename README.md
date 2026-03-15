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

▶️ [Watch the Demo Video](#) <!-- TODO: Replace # with your demo video URL -->

## 🌐 Live App

🚀 [Open the Live App](#) <!-- TODO: Replace # with your deployed app URL -->

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Overview](#-api-overview)
- [Design System](#-design-system)
- [User Roles & Flow](#-user-roles--flow)
- [Roadmap](#-roadmap)
- [Author](#-author)
- [License](#-license)

---

## 🎯 About the Project

FluentFusion is a full-stack language learning platform built for the ALU Capstone Project. It combines a modern React frontend with a FastAPI backend connected to a cloud-hosted PostgreSQL database (Aiven).

The platform supports **three roles** — Students, Instructors, and Admins — each with a fully dedicated dashboard, sidebar navigation, and feature set.

Key highlights:
- 🔐 **JWT Authentication** — Register, login, OTP email verification, and password reset via SMTP
- 🎓 **4-Step Onboarding** — Native language → target language → learning goal → proficiency level
- 📊 **Role-Based Dashboards** — Separate layouts and routes for students, instructors, and admins
- 📧 **Real Email Delivery** — OTP codes and password reset links sent via Gmail SMTP
- 🌍 **Public Pages** — Welcome, Features, Pricing, and Community pages with live platform stats

---

## 🚀 Features

### ✅ Implemented

| Feature | Details |
|---|---|
| Authentication | Email/password signup & login, JWT tokens, OTP email verification, password reset via email link |
| Onboarding | 4-step progressive setup: native language → target language → goal → proficiency level. Resumes from last completed step |
| Student Dashboard | XP tracking, streak, course progress, live session reminders, leaderboard, quizzes, messages |
| Instructor Dashboard | Course management, student roster, live sessions, quizzes, revenue, payouts, analytics, pulse insights |
| Admin Dashboard | User management, course approvals, analytics, geo data, payments, revenue, audit log, platform settings, pulse engine |
| Email System | OTP verification codes + password reset links via Gmail SMTP (branded HTML emails) |
| Remember Me | Checked → persists in `localStorage`; unchecked → session-only via `sessionStorage` |
| Public Pages | Welcome (with live stats), Features, Pricing (monthly/annual toggle), Community |
| Role Routing | After login: admin → `/admin`, instructor → `/instructor`, student → onboarding or `/dashboard` |
| Platform Stats | Live learner count, instructor count, course count fetched from `/api/stats` |

### 🔜 Coming Soon

- Course catalog & lesson player
- Practice exercises (vocabulary, grammar, speaking, listening)
- Live session booking & video interface
- Community forums UI
- Certificate generation
- Mobile app (React Native)

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.1 | UI framework |
| TypeScript | 5.4.5 | Type safety |
| Vite | 5.3.1 | Build tool & dev server |
| React Router DOM | 6.23.1 | Client-side routing |
| Axios | 1.7.2 | HTTP client (legacy shim) |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| FastAPI | 0.111.0 | REST API framework |
| Uvicorn | 0.29.0 | ASGI server |
| PostgreSQL | 15 (Aiven cloud) | Primary database |
| SQLAlchemy | 2.0.30 | ORM |
| Psycopg2 | 2.9.9 | PostgreSQL driver |
| Python-Jose | 3.3.0 | JWT token signing |
| Passlib + bcrypt | 1.7.4 / 4.0.1 | Password hashing |
| Python-dotenv | 1.0.1 | Environment config |
| Faker | 24.11.0 | Database seeding |
| smtplib (stdlib) | — | SMTP email delivery |

---

## 📁 Project Structure

```
Instructo&admin/
├── backend/                        # Python FastAPI backend
│   ├── app/
│   │   ├── routers/                # API route handlers
│   │   │   ├── auth.py             # Register, login, verify-email, forgot/reset-password
│   │   │   ├── admin.py            # Admin-only endpoints
│   │   │   ├── instructor.py       # Instructor endpoints
│   │   │   └── student.py          # Student endpoints
│   │   ├── auth.py                 # JWT helpers, password hashing, get_current_user
│   │   ├── email_utils.py          # SMTP email sender, OTP & reset email templates
│   │   ├── models.py               # SQLAlchemy models (User, Course, Enrollment, etc.)
│   │   ├── main.py                 # FastAPI app entry point, CORS, /api/stats
│   │   └── seed.py                 # Database seeding script
│   ├── .env                        # Backend environment variables
│   ├── ca.pem                      # Aiven SSL certificate
│   └── requirements.txt            # Python dependencies
│
├── frontend/
│   └── app/                        # Single unified Vite app (port 5173)
│       ├── public/
│       │   └── favicon.svg
│       ├── src/
│       │   ├── api/
│       │   │   └── client.ts       # Full API client (authApi, adminApi, instructorApi, etc.)
│       │   ├── components/
│       │   │   ├── AuthContext.tsx  # Global auth state (token, user, login, register, logout)
│       │   │   ├── AdminNavbar.tsx / AdminSidebar.tsx
│       │   │   ├── InstructorNavbar.tsx / InstructorSidebar.tsx
│       │   │   ├── StudentNavbar.tsx / StudentSidebar.tsx
│       │   │   ├── Avatar.tsx
│       │   │   ├── Badge.tsx
│       │   │   ├── BarChart.tsx
│       │   │   ├── Progress.tsx
│       │   │   └── StatCard.tsx
│       │   ├── pages/
│       │   │   ├── student/
│       │   │   │   ├── Welcome.tsx         # Landing page with live stats
│       │   │   │   ├── Signup.tsx          # Registration → email verify
│       │   │   │   ├── Login.tsx           # Login with remember me
│       │   │   │   ├── ForgotPassword.tsx  # Request reset email
│       │   │   │   ├── ResetPassword.tsx   # Set new password via token
│       │   │   │   ├── EmailVerify.tsx     # 6-digit OTP verification
│       │   │   │   ├── Onboarding.tsx      # 4 steps: native lang, learn lang, goal, level
│       │   │   │   ├── Dashboard.tsx
│       │   │   │   ├── MyCourses.tsx
│       │   │   │   ├── Lessons.tsx
│       │   │   │   ├── LiveSessions.tsx
│       │   │   │   ├── Quizzes.tsx
│       │   │   │   ├── Messages.tsx
│       │   │   │   ├── Leaderboard.tsx
│       │   │   │   ├── Notifications.tsx
│       │   │   │   ├── Settings.tsx
│       │   │   │   ├── Pricing.tsx         # Monthly/annual toggle
│       │   │   │   ├── Features.tsx
│       │   │   │   └── Community.tsx
│       │   │   ├── instructor/             # 15 instructor pages
│       │   │   │   ├── Dashboard.tsx
│       │   │   │   ├── MyCourses.tsx
│       │   │   │   ├── Lessons.tsx
│       │   │   │   ├── LiveSessions.tsx
│       │   │   │   ├── Quizzes.tsx
│       │   │   │   ├── StudentRoster.tsx
│       │   │   │   ├── PulseInsights.tsx
│       │   │   │   ├── Messages.tsx
│       │   │   │   ├── Reviews.tsx
│       │   │   │   ├── Revenue.tsx
│       │   │   │   ├── Payouts.tsx
│       │   │   │   ├── Analytics.tsx
│       │   │   │   ├── Notifications.tsx
│       │   │   │   └── Settings.tsx
│       │   │   └── admin/                  # 18 admin pages
│       │   │       ├── Dashboard.tsx
│       │   │       ├── Analytics.tsx
│       │   │       ├── GeoData.tsx
│       │   │       ├── AllUsers.tsx
│       │   │       ├── Students.tsx
│       │   │       ├── Instructors.tsx
│       │   │       ├── Admins.tsx
│       │   │       ├── CourseApprovals.tsx
│       │   │       ├── LiveSessions.tsx
│       │   │       ├── Reports.tsx
│       │   │       ├── Payments.tsx
│       │   │       ├── Payouts.tsx
│       │   │       ├── Revenue.tsx
│       │   │       ├── PulseEngine.tsx
│       │   │       ├── Notifications.tsx
│       │   │       ├── AuditLog.tsx
│       │   │       └── PlatformSettings.tsx
│       │   ├── App.tsx                     # Role-based routing
│       │   ├── index.css                   # Global styles & CSS variables
│       │   └── main.tsx                    # React entry point
│       ├── .env                            # Frontend environment variables
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
│
├── start.sh                        # One-command startup script
└── README.md                       # This file
```

---

## 🔧 Prerequisites

| Requirement | Minimum Version | Notes |
|---|---|---|
| Node.js | 18+ | [Download](https://nodejs.org) |
| npm | Latest | Comes with Node.js |
| Python | 3.12+ | [Download](https://python.org) |
| Git | Latest | [Download](https://git-scm.com) |

> **No local PostgreSQL or Redis needed** — the database is hosted on Aiven cloud and configured in `backend/.env`.

---

## ⚙️ Installation & Setup

### Step 1 — Clone the repository

```bash
git clone https://github.com/ngabo-dev/fluentfusion.git
cd fluentfusion
```

### Step 2 — Backend setup

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate          # macOS/Linux
# venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt
```

### Step 3 — Frontend setup

```bash
cd frontend/app
npm install
```

That's it — the database is already hosted on Aiven cloud. No local DB setup needed.

---

## 🔐 Environment Variables

### Backend — `backend/.env`

```env
# Database (Aiven PostgreSQL — already configured)
DATABASE_URL=postgresql://user:password@host:port/defaultdb?sslmode=require

# JWT
SECRET_KEY=your-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Frontend URL (for password reset links in emails)
FRONTEND_URL=http://localhost:5173

# Email (Gmail SMTP)
EMAIL_ENABLED=True
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASSWORD=your-app-password        # Gmail App Password (not your login password)
FROM_EMAIL=your-gmail@gmail.com
FROM_NAME=FluentFusion AI
```

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App Passwords → generate one for "Mail".

### Frontend — `frontend/app/.env`

```env
VITE_API_URL=http://localhost:8000/api
VITE_FRONTEND_URL=http://localhost:5173
```

---

## ▶️ Running the Application

### Option A — One command (recommended)

```bash
# From the project root
bash start.sh
```

This starts both backend and frontend together. Press `Ctrl+C` to stop everything.

### Option B — Two separate terminals

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

### URLs

| Service | URL |
|---|---|
| App | http://localhost:5173 |
| API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |

### Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | c.okafor@fluentfusion.com | admin123 |
| Instructor | a.ndiaye@ff.com | instructor123 |
| Student | k.larbi@gmail.com | student123 |

---

## 🌐 API Overview

All API endpoints live under `/api/`. Interactive Swagger docs at `http://localhost:8000/docs`.

### Authentication — `/api/auth/`

```
POST /api/auth/register           → Register new user (sends OTP email)
POST /api/auth/login              → Login (OAuth2 form, returns JWT)
POST /api/auth/verify-email       → Verify email with 6-digit OTP
POST /api/auth/resend-verification → Resend OTP code
POST /api/auth/forgot-password    → Send password reset email
POST /api/auth/reset-password     → Set new password via reset token
GET  /api/auth/me                 → Get current user profile
```

### Other Endpoints

| Prefix | Purpose |
|---|---|
| `/api/admin/` | User management, analytics, course approvals, audit log |
| `/api/instructor/` | Course creation, student roster, earnings, sessions |
| `/api/student/` | Assignments, messages, meetings, announcements |
| `/api/stats` | Public platform stats (learners, instructors, courses) |
| `/health` | API health check |

### Authentication Flow

```
POST /api/auth/register
  → 201: { access_token, token_type, role, name, id }
  → OTP sent to email

POST /api/auth/login  (form-encoded: username, password)
  → 200: { access_token, token_type, role, name, id }
  → 401: Invalid credentials

POST /api/auth/verify-email  { email, code }
  → 200: { message: "Email verified successfully" }
  → 400: Invalid or expired code

POST /api/auth/forgot-password  { email }
  → 200: { message: "If this email exists, a reset link has been sent." }

POST /api/auth/reset-password  { token, new_password }
  → 200: { message: "Password reset successfully" }
  → 400: Invalid or expired token
```

> **Note:** Login uses OAuth2 form encoding (`application/x-www-form-urlencoded`) with fields `username` and `password`. Register uses JSON with fields `name`, `email`, `password`, `role`.

---

## 🎨 Design System

All pages use a consistent dark design system with inline styles.

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| Background | `#0a0a0a` | App background |
| Card | `#151515` | Card surfaces |
| Card 2 | `#1f1f1f` | Input backgrounds |
| Border | `#2a2a2a` | Borders & dividers |
| Neon | `#BFFF00` | Primary accent, CTAs, highlights |
| Muted | `#888888` | Secondary text |
| Success | `#00FF7F` | Success banners |
| Error | `#FF4444` | Error messages |
| Foreground | `#ffffff` | Primary text |

### Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Headings | Syne | 800 ExtraBold | 24–52px |
| Body | DM Sans | 400 Regular | 14–16px |
| Labels / Code | JetBrains Mono | 500 Medium | 10–13px |

### CSS Variables (defined in `index.css`)

```css
--bg:    #0a0a0a
--card:  #151515
--card2: #1f1f1f
--bdr:   #2a2a2a
--neon:  #BFFF00
--mu:    #888888
--fg:    #ffffff
```

---

## 👥 User Roles & Flow

### Student Flow
```
/signup → /verify-email (OTP) → /onboard/native-language
       → /onboard/learn-language → /onboard/goal
       → /onboard/level → /dashboard
```

On subsequent logins, onboarding resumes from the last incomplete step. Once all 4 steps are done, login goes directly to `/dashboard`.

### Instructor Flow
```
/signup (role: instructor) → /verify-email → /instructor
```

### Admin Flow
```
/login → /admin  (pre-seeded admin accounts only)
```

### Route Guards
- `/dashboard/*` — requires valid JWT token, student role
- `/instructor/*` — requires valid JWT token, instructor role
- `/admin/*` — requires valid JWT token, admin or super_admin role
- `/onboard/*` — public (no auth required)

---

## 🗺️ Roadmap

### Phase 1 — Foundation ✅
- [x] Authentication (register, login, JWT, OTP verify, password reset)
- [x] 4-step onboarding with smart resume
- [x] Student, Instructor, Admin dashboards
- [x] Role-based routing & layout guards
- [x] Email delivery via Gmail SMTP
- [x] Remember Me (localStorage vs sessionStorage)
- [x] Public pages (Welcome, Features, Pricing, Community)
- [x] Live platform stats from database

### Phase 2 — Learning Core 🔄
- [ ] Course catalog & detail pages
- [ ] Lesson player with progress tracking
- [ ] Practice exercises (vocabulary, grammar, quizzes)
- [ ] Flashcard system

### Phase 3 — Social & Live 📋
- [ ] Live session booking & video interface
- [ ] Community forums & discussion threads
- [ ] Language exchange matching
- [ ] Study group creation

### Phase 4 — Advanced 📋
- [ ] Progress analytics & charts
- [ ] Achievement gallery & badge showcase
- [ ] Certificate generation & download
- [ ] Mobile app (React Native)
- [ ] Offline mode & PWA support
- [ ] Voice recognition for speaking practice

---

## 👤 Author

**Jean Pierre Niyongabo**
📧 j.niyongabo@alustudent.com
🎓 African Leadership University — Capstone Project 2026

---

## 📄 License

Proprietary — All rights reserved © 2026 FluentFusion AI

---

*Built with ❤️ for language learners worldwide.*
