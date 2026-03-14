# FluentFusion — Admin & Instructor Dashboards

Full-stack dashboards built with **FastAPI + PostgreSQL** (backend) and **React 18 + TypeScript + Vite** (frontend).

---

## Quick Start

### 1. PostgreSQL
```sql
CREATE DATABASE fluentfusion;
```

### 2. Backend
```bash
cd backend
cp .env.example .env        # Edit DATABASE_URL and SECRET_KEY
pip install -r requirements.txt
uvicorn main:app --reload --port 8000   # Tables auto-created on startup
python seed.py              # Seed demo data
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

---

## Demo Accounts

| Role       | Email                      | Password     |
|------------|----------------------------|--------------|
| Admin      | chidi@fluentfusion.com     | admin123     |
| Admin      | rania@fluentfusion.com     | admin123     |
| Instructor | amara@fluentfusion.com     | instructor123|
| Instructor | malik@fluentfusion.com     | instructor123|
| Student    | kwame@example.com          | student123   |

Or click the **Quick Access** buttons on the login page.

---

## Admin Pages
- **Dashboard** — Stats, revenue chart, PULSE overview, pending courses  
- **Users** — List/search/filter, ban/unban, create  
- **Instructors** — Verify, ban, view ratings and revenue  
- **Courses** — Approve/reject pending, filter by status  
- **Revenue** — Revenue trend + enrollment charts  
- **Payouts** — Approve/reject instructor payouts  
- **PULSE Engine** — Platform-wide AI learner state distribution  
- **Notifications** — Send announcements, view read rates  
- **Audit Log** — Immutable admin action log  
- **Settings** — Toggle features, update config by category  

## Instructor Pages
- **Dashboard** — Student count, revenue, PULSE, course list  
- **My Courses** — Create, submit for review, view stats  
- **Lessons** — Add/delete lessons, view attendance  
- **Quizzes** — Create quizzes, view attempt stats  
- **Live Sessions** — Schedule, go live, end sessions  
- **Student Roster** — PULSE states, progress, XP  
- **PULSE Insights** — AI state distribution for your students  
- **Messages** — Read/reply/compose messages  
- **Earnings** — Payout history  

---

## API: http://localhost:8000/docs
