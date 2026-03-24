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
        # notifications
        ("notifications", "notif_type",           "VARCHAR DEFAULT 'announcement'"),
        ("notifications", "link",                  "VARCHAR"),
        ("notifications", "sender_id",             "INTEGER"),
        ("notifications", "course_id",             "INTEGER"),
        ("notifications", "recipients",            "INTEGER DEFAULT 0"),
        ("notifications", "read_rate",             "FLOAT DEFAULT 0.0"),
        ("notifications", "allow_replies",         "BOOLEAN DEFAULT FALSE"),
        # users
        ("users",         "avatar_url",            "VARCHAR"),
        ("users",         "first_login",           "BOOLEAN DEFAULT TRUE"),
        ("users",         "xp",                    "INTEGER DEFAULT 0"),
        ("users",         "pulse_state",           "VARCHAR DEFAULT 'coasting'"),
        ("users",         "pending_email",         "VARCHAR"),
        ("users",         "email_change_token",    "VARCHAR"),
        ("users",         "email_change_expiry",   "TIMESTAMP"),
        # courses
        ("courses",       "subtitle",              "VARCHAR"),
        ("courses",       "category",              "VARCHAR"),
        ("courses",       "is_free",               "BOOLEAN DEFAULT FALSE"),
        ("courses",       "intro_video_url",        "VARCHAR"),
        ("courses",       "what_you_learn",         "TEXT"),
        ("courses",       "requirements",           "TEXT"),
        ("courses",       "target_audience",        "TEXT"),
        ("courses",       "rejection_feedback",     "TEXT"),
        ("courses",       "admin_notes",            "TEXT"),
        ("courses",       "submitted_at",           "TIMESTAMP"),
        ("courses",       "approved_at",            "TIMESTAMP"),
        ("courses",       "published_at",           "TIMESTAMP"),
        ("courses",       "updated_at",             "TIMESTAMP"),
        # lessons
        ("lessons",       "section_id",             "INTEGER"),
        ("lessons",       "content",                "TEXT"),
        ("lessons",       "resource_url",           "VARCHAR"),
        ("lessons",       "is_preview",             "BOOLEAN DEFAULT FALSE"),
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
    from app.email_utils import EMAIL_ENABLED, SENDGRID_API_KEY, FROM_EMAIL, send_email
    delivery_ok = False
    delivery_error = None
    try:
        ok = send_email(FROM_EMAIL, "FluentFusion — Email Delivery Test",
            "<p>Test email from FluentFusion backend. SendGrid is working ✅</p>")
        delivery_ok = ok
        if not ok:
            delivery_error = "send_email() returned False — check Render logs for SENDGRID ERROR"
    except Exception as e:
        delivery_error = str(e)
    return {
        "EMAIL_ENABLED": EMAIL_ENABLED,
        "provider": "sendgrid",
        "FROM_EMAIL": FROM_EMAIL,
        "api_key_set": bool(SENDGRID_API_KEY),
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
