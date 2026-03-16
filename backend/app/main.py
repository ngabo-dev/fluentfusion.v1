from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.models import Base, engine
from app.routers import auth, admin, instructor, student, messages
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FluentFusion API")

_frontend = os.getenv("FRONTEND_URL", "http://localhost:5173")
_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000",
    "https://fluentfusionv1.vercel.app",
    "https://fluentfusion-v1.vercel.app",
]
if _frontend not in _origins:
    _origins.append(_frontend)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(instructor.router)
app.include_router(student.router)
app.include_router(messages.router)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/test-email")
def test_email():
    import os, smtplib
    from app.email_utils import EMAIL_ENABLED, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, FROM_EMAIL
    error = None
    sent = False
    try:
        password = SMTP_PASSWORD.strip()
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as s:
            s.ehlo()
            s.starttls()
            s.ehlo()
            s.login(SMTP_USER, password)
            sent = True
    except Exception as e:
        error = str(e)
    return {
        "EMAIL_ENABLED": EMAIL_ENABLED,
        "SMTP_USER": SMTP_USER,
        "SMTP_PASSWORD_LEN": len(SMTP_PASSWORD),
        "sent": sent,
        "error": error
    }

@app.get("/api/stats")
def public_stats():
    from app.models import SessionLocal, User, Course, RoleEnum
    from sqlalchemy import func
    db = SessionLocal()
    try:
        total_students = db.query(func.count(User.id)).filter(User.role == RoleEnum.student).scalar() or 0
        total_instructors = db.query(func.count(User.id)).filter(User.role == RoleEnum.instructor).scalar() or 0
        total_courses = db.query(func.count(Course.id)).scalar() or 0
        languages = db.query(Course.language).distinct().count() or 0
        return {
            "active_learners": total_students,
            "instructors": total_instructors,
            "courses": total_courses,
            "languages": languages,
            "success_rate": 98
        }
    finally:
        db.close()
