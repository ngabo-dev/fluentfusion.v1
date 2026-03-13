"""
FluentFusion AI — Unified Backend
==================================
Combines the FluentFusion language learning platform API with the
PULSE (Predictive Unified Learner State Engine) ML service.

Services:
  - Platform API   → /api/v1/  (auth, users, courses, lessons, practice,
                                 live, community, gamification, payments, admin)
  - PULSE ML API   → /api/v1/pulse/  (predict, batch, states, model-info,
                                       feature-importance)

Ports (default):
  - This unified service runs on port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException
from contextlib import asynccontextmanager
import logging
import time
import os

from .config import settings
from .api.v1 import (
    auth, users, courses, lessons, practice,
    live, community, gamification, payments, admin, instructor,
    pulse as pulse_router,
    student as student_router,
    session as session_router,
    notifications,
)
from .pulse.core.model_loader import ModelLoader
from .middleware.rate_limiter import RateLimitMiddleware

# ── Logging
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)
logger = logging.getLogger("fluentfusion")


# ── Lifespan: optimized startup with minimal DB queries
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 FluentFusion unified service starting...")
    
    # Seed languages if database is empty
    from .database import SessionLocal
    from .models.language import Language
    from .models.course import Course, CourseUnit, Lesson
    from .models.user import User
    
    db = SessionLocal()
    try:
        # Use func.count for efficient counting (single query per count)
        from sqlalchemy import func
        
        # Batch query all counts at once to reduce DB round trips
        super_admin_count = db.query(func.count(User.id)).filter(User.role == "super_admin").scalar() or 0
        instructor_count = db.query(func.count(User.id)).filter(User.role == "instructor").scalar() or 0
        student_count = db.query(func.count(User.id)).filter(User.role == "student").scalar() or 0
        language_count = db.query(func.count(Language.id)).scalar() or 0
        course_count = db.query(func.count(Course.id)).filter(Course.is_published == True).scalar() or 0
        
        # Track if we need to commit
        needs_commit = False
        
        # Seed default super admin if no super_admin exists
        if super_admin_count == 0:
            logger.info("Creating default super admin user...")
            from passlib.context import CryptContext
            pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
            
            # Create super admin user
            super_admin = User(
                email="ngabo40@gmail.com",
                username="ngabo40",
                full_name="Super Administrator",
                password_hash=pwd_context.hash("admin123"),
                role="super_admin",
                is_active=True,
                is_verified=True,
                bio="Super Administrator of FluentFusion Platform"
            )
            db.add(super_admin)
            needs_commit = True
            logger.info("✅ Will create default super admin")
        
        # Create demo instructor if no instructors exist
        if instructor_count == 0:
            logger.info("Creating demo instructor user...")
            from passlib.context import CryptContext
            pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
            
            demo_instructor = User(
                email="j.niyongabo@alustudent.com",
                username="j.niyongabo",
                full_name="Demo Instructor",
                password_hash=pwd_context.hash("instructor123"),
                role="instructor",
                is_active=True,
                is_verified=True,
                bio="Experienced language instructor"
            )
            db.add(demo_instructor)
            needs_commit = True
            logger.info("✅ Will create demo instructor")
        
        # Create demo student if no students exist
        if student_count == 0:
            logger.info("Creating demo student user...")
            from passlib.context import CryptContext
            pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
            
            demo_student = User(
                email="ngabo7834@gmail.com",
                username="ngabo7834",
                full_name="Demo Student",
                password_hash=pwd_context.hash("student123"),
                role="student",
                is_active=True,
                is_verified=True,
                bio="Language learning enthusiast"
            )
            db.add(demo_student)
            needs_commit = True
            logger.info("✅ Will create demo student")
        
        # Commit user creations in one transaction
        if needs_commit:
            db.commit()
            logger.info("✅ Users created successfully")
        
        # Refresh users to get their IDs
        if super_admin_count == 0:
            super_admin = db.query(User).filter(User.email == "ngabo40@gmail.com").first()
            if super_admin:
                logger.info(f"✅ Created super admin: {super_admin.email} (ID: {super_admin.id})")
                logger.info("   Default credentials: ngabo40@gmail.com / admin123")
        
        if instructor_count == 0:
            demo_instructor = db.query(User).filter(User.email == "j.niyongabo@alustudent.com").first()
            if demo_instructor:
                logger.info(f"✅ Created demo instructor: {demo_instructor.email}")
                logger.info("   Default credentials: j.niyongabo@alustudent.com / instructor123")
        
        if student_count == 0:
            demo_student = db.query(User).filter(User.email == "ngabo7834@gmail.com").first()
            if demo_student:
                logger.info(f"✅ Created demo student: {demo_student.email}")
                logger.info("   Default credentials: ngabo7834@gmail.com / student123")
        
        # Seed languages using bulk_save_objects for faster insertion
        if language_count == 0:
            logger.info("Seeding languages...")
            languages = [
                Language(name="English", code="en", flag_emoji="🇬🇧"),
                Language(name="French", code="fr", flag_emoji="🇫🇷"),
                Language(name="Spanish", code="es", flag_emoji="🇪🇸"),
                Language(name="German", code="de", flag_emoji="🇩🇪"),
                Language(name="Italian", code="it", flag_emoji="🇮🇹"),
                Language(name="Portuguese", code="pt", flag_emoji="🇵🇹"),
                Language(name="Chinese", code="zh", flag_emoji="🇨🇳"),
                Language(name="Japanese", code="ja", flag_emoji="🇯🇵"),
                Language(name="Korean", code="ko", flag_emoji="🇰🇷"),
                Language(name="Arabic", code="ar", flag_emoji="🇸🇦"),
                Language(name="Russian", code="ru", flag_emoji="🇷🇺"),
                Language(name="Swahili", code="sw", flag_emoji="🇰🇪"),
                Language(name="Kinyarwanda", code="rw", flag_emoji="🇷🇼"),
            ]
            db.bulk_save_objects(languages)
            db.commit()
            logger.info(f"✅ Seeded {len(languages)} languages")
        else:
            # Check if Kinyarwanda exists, if not add it
            kinyarwanda = db.query(Language).filter(Language.code == "rw").first()
            if not kinyarwanda:
                logger.info("Adding Kinyarwanda to existing languages...")
                kinyarwanda = Language(name="Kinyarwanda", code="rw", flag_emoji="🇷🇼")
                db.add(kinyarwanda)
                db.commit()
                logger.info("✅ Added Kinyarwanda language")
        
        # Seed sample courses if none exist (published courses)
        if course_count == 0:
            logger.info("Seeding sample courses...")
            
            # Get or create a demo instructor - optimize to single query
            instructor = db.query(User).filter(
                (User.email == "j.niyongabo@alustudent.com") | 
                (User.role == "instructor") |
                (User.role == "super_admin") |
                (User.role == "admin")
            ).first()
            
            # If no user exists, create a demo instructor
            if not instructor:
                logger.info("Creating demo instructor user...")
                from passlib.context import CryptContext
                pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
                instructor = User(
                    email="j.niyongabo@alustudent.com",
                    username="j.niyongabo",
                    full_name="Demo Instructor",
                    password_hash=pwd_context.hash("instructor123"),
                    role="instructor",
                    is_active=True,
                    is_verified=True
                )
                db.add(instructor)
                db.commit()
                db.refresh(instructor)
                logger.info(f"✅ Created demo instructor with ID: {instructor.id}")
            
            if instructor:
                # Get all languages in one query
                languages = db.query(Language).all()
                if not languages:
                    logger.warning("No languages found, skipping course seeding")
                else:
                    # Sample course data
                    sample_courses = [
                        {
                            "title": "French for Beginners",
                            "description": "Start your French journey with essential vocabulary, pronunciation, and basic conversation skills. Perfect for absolute beginners.",
                            "level": "beginner",
                            "language_code": "fr",
                            "goal": "conversation",
                            "is_free": True,
                            "thumbnail_url": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
                            "units": [
                                {"title": "Introduction to French", "lessons": ["Greetings", "Numbers 1-10", "Basic Phrases"]},
                                {"title": "Everyday Conversations", "lessons": ["At the Cafe", "Shopping", "Directions"]},
                            ]
                        },
                        {
                            "title": "Spanish Mastery",
                            "description": "Comprehensive Spanish course covering grammar, vocabulary, and cultural insights. Go from beginner to intermediate level.",
                            "level": "intermediate",
                            "language_code": "es",
                            "goal": "business",
                            "is_free": False,
                            "price_usd": 49.99,
                            "thumbnail_url": "https://images.unsplash.com/photo-1489945052260-4f21b52571eb?w=800",
                            "units": [
                                {"title": "Grammar Foundations", "lessons": ["Verbs", "Articles", "Pronouns"]},
                                {"title": "Business Spanish", "lessons": ["Meetings", "Presentations", "Negotiations"]},
                            ]
                        },
                        {
                            "title": "Japanese Essentials",
                            "description": "Learn Japanese from scratch. Master Hiragana, Katakana, and basic Kanji characters with our interactive lessons.",
                            "level": "beginner",
                            "language_code": "ja",
                            "goal": "travel",
                            "is_free": True,
                            "thumbnail_url": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
                            "units": [
                                {"title": "Japanese Alphabet", "lessons": ["Hiragana Basics", "Katakana", "Basic Kanji"]},
                                {"title": "Travel Japanese", "lessons": ["At the Airport", "Hotel Check-in", "Eating Out"]},
                            ]
                        },
                        {
                            "title": "German A1 Complete",
                            "description": "Complete German course for beginners. Learn grammar, vocabulary, and practice speaking with native speakers.",
                            "level": "beginner",
                            "language_code": "de",
                            "goal": "academic",
                            "is_free": True,
                            "thumbnail_url": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800",
                            "units": [
                                {"title": "Getting Started", "lessons": ["Alphabet", "Numbers", "Basic Words"]},
                                {"title": "Simple Conversations", "lessons": ["Introducing Yourself", "Family", "Jobs"]},
                            ]
                        },
                        {
                            "title": "Korean Hangul & Beyond",
                            "description": "Master the Korean alphabet and build your vocabulary with this fun and engaging course designed for beginners.",
                            "level": "beginner",
                            "language_code": "ko",
                            "goal": "general",
                            "is_free": True,
                            "thumbnail_url": "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800",
                            "units": [
                                {"title": "Hangul Mastery", "lessons": ["Consonants", "Vowels", "Syllable Blocks"]},
                                {"title": "Basic Vocabulary", "lessons": ["Numbers", "Colors", "Common Words"]},
                            ]
                        },
                        {
                            "title": "Italian Romance",
                            "description": "Learn beautiful Italian for travel, romance, or personal enrichment. Includes authentic cultural insights.",
                            "level": "intermediate",
                            "language_code": "it",
                            "goal": "conversation",
                            "is_free": False,
                            "price_usd": 39.99,
                            "thumbnail_url": "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800",
                            "units": [
                                {"title": "Italian Basics", "lessons": ["Greetings", "Food & Dining", "Shopping"]},
                                {"title": "Deep Dive", "lessons": ["Past Tense", "Future Tense", "Subjunctive"]},
                            ]
                        },
                        {
                            "title": "Chinese Mandarin Basics",
                            "description": "Start learning Mandarin with Pinyin, tones, and essential vocabulary. Perfect for beginners interested in Chinese culture.",
                            "level": "beginner",
                            "language_code": "zh",
                            "goal": "travel",
                            "is_free": True,
                            "thumbnail_url": "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800",
                            "units": [
                                {"title": "Pinyin & Tones", "lessons": ["Initials", "Finals", "Tone Practice"]},
                                {"title": "Essential Phrases", "lessons": ["Greetings", "Numbers", "Simple Sentences"]},
                            ]
                        },
                        {
                            "title": "Portuguese for Travelers",
                            "description": "Essential Portuguese phrases for your trip to Brazil or Portugal. Learn practical vocabulary for everyday situations.",
                            "level": "beginner",
                            "language_code": "pt",
                            "goal": "travel",
                            "is_free": True,
                            "thumbnail_url": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800",
                            "units": [
                                {"title": "Travel Essentials", "lessons": ["At the Airport", "Transportation", "Hotels"]},
                                {"title": "Getting Around", "lessons": ["Directions", "Taxi", "Restaurant"]},
                            ]
                        },
                    ]
                    
                    for course_data in sample_courses:
                        # Find language
                        lang = next((l for l in languages if l.code == course_data["language_code"]), languages[0])
                        
                        # Create course
                        slug = course_data["title"].lower().replace(" ", "-")
                        course = Course(
                            instructor_id=instructor.id,
                            language_id=lang.id,
                            title=course_data["title"],
                            slug=slug,
                            description=course_data["description"],
                            level=course_data["level"],
                            goal=course_data["goal"],
                            price_usd=course_data.get("price_usd", 0),
                            is_free=course_data["is_free"],
                            is_published=True,
                            approval_status="approved",
                            thumbnail_url=course_data.get("thumbnail_url"),
                            total_enrollments=0,
                            avg_rating=4.5,
                            rating_count=0
                        )
                        db.add(course)
                        db.flush()
                        
                        # Create units and lessons
                        for unit_idx, unit_data in enumerate(course_data["units"]):
                            unit = CourseUnit(
                                course_id=course.id,
                                title=unit_data["title"],
                                order_index=unit_idx
                            )
                            db.add(unit)
                            db.flush()
                            
                            for lesson_idx, lesson_title in enumerate(unit_data["lessons"]):
                                lesson = Lesson(
                                    unit_id=unit.id,
                                    course_id=course.id,
                                    title=lesson_title,
                                    order_index=lesson_idx,
                                    video_duration_sec=600 + (lesson_idx * 300),  # 10-15 min videos
                                    xp_reward=50 + (lesson_idx * 10)
                                )
                                db.add(lesson)
                    
                    db.commit()
                    logger.info(f"✅ Seeded {len(sample_courses)} sample courses")
            else:
                logger.warning("No instructor user found, skipping course seeding")
                
    except Exception as e:
        logger.error(f"Error seeding data: {e}")
    finally:
        db.close()
    
    # Load PULSE ML model
    await ModelLoader.load()
    if ModelLoader.model is not None:
        v = ModelLoader.metadata.get("model_info", {}).get("version", "unknown")
        logger.info(f"✅ PULSE model loaded | version={v}")
    else:
        logger.warning("⚠️ PULSE running in demo mode — model artifacts not found")
    yield
    logger.info("👋 FluentFusion service shutting down")


# ── App
app = FastAPI(
    title="FluentFusion AI",
    version=settings.APP_VERSION,
    description=(
        "AI-Powered Language Learning Platform. "
        "Includes the full platform API (auth, courses, gamification, payments, etc.) "
        "and the PULSE ML engine for real-time learner state prediction and "
        "adaptive curriculum restructuring."
    ),
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan,
)

# ── Exception Handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "path": str(request.url.path)
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation Error",
            "detail": exc.errors(),
            "status_code": 422,
            "path": str(request.url.path)
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred. Please try again later.",
            "status_code": 500,
            "path": str(request.url.path)
        }
    )

# ── CORS
# Allow all origins in development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Security headers
# Only use TrustedHostMiddleware in production with specific allowed hosts
if not settings.DEBUG:
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.ALLOWED_HOSTS if hasattr(settings, 'ALLOWED_HOSTS') else ["localhost", "127.0.0.1"])

# ── Rate Limiting
app.add_middleware(RateLimitMiddleware)


# ── Request timing middleware
@app.middleware("http")
async def add_process_time_header(request, call_next):
    start = time.time()
    response = await call_next(request)
    response.headers["X-Process-Time"] = f"{(time.time() - start) * 1000:.2f}ms"
    return response


# ── Platform routers
app.include_router(auth.router,         prefix="/api/v1")
app.include_router(users.router,        prefix="/api/v1")
app.include_router(courses.router,      prefix="/api/v1")
app.include_router(lessons.router,      prefix="/api/v1")
app.include_router(practice.router,     prefix="/api/v1")
app.include_router(live.router,         prefix="/api/v1")
app.include_router(community.router,    prefix="/api/v1")
app.include_router(gamification.router, prefix="/api/v1")
app.include_router(payments.router,     prefix="/api/v1")
app.include_router(admin.router,        prefix="/api/v1")
app.include_router(instructor.router,   prefix="/api/v1")
app.include_router(student_router.router, prefix="/api/v1")
app.include_router(session_router.router, prefix="/api/v1")
app.include_router(notifications.router,  prefix="/api/v1")

# ── PULSE ML router
app.include_router(pulse_router.router, prefix="/api/v1")

# ── Static files (uploaded videos)
# Create uploads directory if it doesn't exist
upload_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", "videos")
os.makedirs(upload_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")), name="uploads")


# ── Root
@app.get("/", tags=["System"])
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "operational",
        "environment": settings.ENVIRONMENT,
        "services": {
            "platform_api": "/api/v1/",
            "pulse_ml": "/api/v1/pulse/",
            "docs": "/docs",
            "health": "/health",
        }
    }


# ── Unified health check
@app.get("/health", tags=["System"])
async def health_check():
    model_info = ModelLoader.metadata.get("model_info", {})
    return {
        "status": "healthy",
        "platform": "operational",
        "pulse": {
            "model_loaded": ModelLoader.model is not None,
            "model_version": model_info.get("version"),
            "model_accuracy": model_info.get("test_accuracy"),
            "model_f1": model_info.get("test_f1"),
            "n_features": model_info.get("n_features"),
        }
    }
