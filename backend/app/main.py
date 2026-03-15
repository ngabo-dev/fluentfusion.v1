from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models import Base, engine
from app.routers import auth, admin, instructor, student

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FluentFusion API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(instructor.router)
app.include_router(student.router)

@app.get("/health")
def health():
    return {"status": "ok"}

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
