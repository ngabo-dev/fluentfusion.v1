from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.models import Base, engine
from app.routers import auth, admin, instructor, student, messages, meetings, notifications
import os

Base.metadata.create_all(bind=engine)

# Safe column migrations — add new columns if they don't exist yet
def _run_migrations():
    from sqlalchemy import text
    migrations = [
        ("notifications", "notif_type", "VARCHAR DEFAULT 'announcement'"),
        ("notifications", "link",       "VARCHAR"),
        ("users",         "avatar_url", "VARCHAR"),
    ]
    with engine.connect() as conn:
        for table, col, definition in migrations:
            try:
                conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {col} {definition}"))
                conn.commit()
            except Exception:
                conn.rollback()

_run_migrations()

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
app.include_router(meetings.router)
app.include_router(notifications.router)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/test-email")
def test_email():
    import smtplib
    from app.email_utils import (
        EMAIL_ENABLED, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD,
        FROM_EMAIL, FROM_NAME, RESEND_API_KEY, send_email
    )
    smtp_ok = False
    smtp_error = None
    delivery_ok = False
    delivery_error = None

    # 1. Test SMTP login
    try:
        import ssl as _ssl
        ctx = _ssl.create_default_context()
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=ctx, timeout=15) as s:
            s.login(SMTP_USER, SMTP_PASSWORD.strip())
            smtp_ok = True
    except Exception as e:
        smtp_error = str(e)

    # 2. Send a real test email to FROM_EMAIL to confirm delivery
    try:
        ok = send_email(
            FROM_EMAIL,
            "FluentFusion — Email Delivery Test",
            "<p>This is a delivery test from the FluentFusion backend. If you see this, emails are working ✅</p>"
        )
        delivery_ok = ok
        if not ok:
            delivery_error = "send_email() returned False — check provider config"
    except Exception as e:
        delivery_error = str(e)

    return {
        "EMAIL_ENABLED": EMAIL_ENABLED,
        "provider": "resend" if RESEND_API_KEY else "smtp",
        "SMTP_HOST": SMTP_HOST,
        "SMTP_USER": SMTP_USER,
        "FROM_EMAIL": FROM_EMAIL,
        "SMTP_PASSWORD_LEN": len(SMTP_PASSWORD),
        "smtp_login_ok": smtp_ok,
        "smtp_login_error": smtp_error,
        "delivery_ok": delivery_ok,
        "delivery_error": delivery_error,
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
