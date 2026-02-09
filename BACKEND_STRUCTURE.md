# Backend Implementation Guide - FluentFusion

## Overview

This document outlines the complete backend structure for FluentFusion. While the MVP currently uses frontend-only mock data, this guide provides the complete backend implementation for production deployment.

## Technology Stack

- **Framework**: FastAPI 0.104+
- **Database**: PostgreSQL 15+
- **ORM**: SQLAlchemy 2.0+
- **Caching**: Redis 7+
- **Authentication**: JWT (PyJWT)
- **Validation**: Pydantic
- **Testing**: Pytest
- **Documentation**: Auto-generated Swagger/OpenAPI

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Configuration and environment variables
│   ├── database.py             # Database connection and session
│   ├── models/                 # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── lesson.py
│   │   ├── exercise.py
│   │   ├── progress.py
│   │   └── badge.py
│   ├── schemas/                # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── lesson.py
│   │   ├── exercise.py
│   │   └── progress.py
│   ├── api/                    # API routes
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── lessons.py
│   │   ├── progress.py
│   │   └── recommendations.py
│   ├── core/                   # Core functionality
│   │   ├── __init__.py
│   │   ├── security.py         # Password hashing, JWT
│   │   ├── dependencies.py     # FastAPI dependencies
│   │   └── middleware.py       # Custom middleware
│   ├── services/               # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── lesson_service.py
│   │   └── recommendation_service.py
│   └── ml/                     # Machine learning
│       ├── __init__.py
│       ├── recommender.py      # Recommendation engine
│       └── models/             # Trained ML models
├── migrations/                 # Alembic migrations
│   └── versions/
├── tests/                      # Unit and integration tests
│   ├── __init__.py
│   ├── test_auth.py
│   ├── test_lessons.py
│   └── test_recommendations.py
├── requirements.txt            # Python dependencies
├── .env.example               # Environment variables template
├── docker-compose.yml         # Docker setup
└── README.md                  # Backend documentation
```

## Installation

### requirements.txt

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
alembic==1.12.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
pydantic==2.5.0
pydantic-settings==2.1.0
redis==5.0.1
python-dotenv==1.0.0
httpx==0.25.2
pytest==7.4.3
pytest-asyncio==0.21.1
scikit-learn==1.3.2
pandas==2.1.4
numpy==1.26.2
```

### Setup Commands

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Configuration

### .env.example

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/fluentfusion
TEST_DATABASE_URL=postgresql://user:password@localhost:5432/fluentfusion_test

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=http://localhost:5173,https://fluentfusion.com

# Environment
ENVIRONMENT=development
DEBUG=True

# AWS (for production)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
S3_BUCKET=fluentfusion-assets
```

### app/config.py

```python
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # Redis
    REDIS_URL: str
    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173"]
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"

settings = Settings()
```

## Database Models

### app/models/user.py

```python
from sqlalchemy import Column, String, Enum, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base

class UserType(str, enum.Enum):
    TOURIST = "tourist"
    TOURISM_WORKER = "tourism_worker"

class TargetLanguage(str, enum.Enum):
    KINYARWANDA = "kinyarwanda"
    ENGLISH = "english"
    FRENCH = "french"

class User(Base):
    __tablename__ = "users"
    
    user_id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    user_type = Column(Enum(UserType), nullable=False)
    target_language = Column(Enum(TargetLanguage), nullable=False)
    profile_image = Column(String, nullable=True)
    joined_date = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    # Relationships
    progress = relationship("UserProgress", back_populates="user")
    badges = relationship("UserBadge", back_populates="user")
```

### app/models/lesson.py

```python
from sqlalchemy import Column, String, Integer, Enum, JSON, Text
from sqlalchemy.orm import relationship
import enum
from app.database import Base

class DifficultyLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class LessonCategory(str, enum.Enum):
    GREETINGS = "greetings"
    ACCOMMODATION = "accommodation"
    FOOD = "food"
    TRANSPORTATION = "transportation"
    SHOPPING = "shopping"
    EMERGENCY = "emergency"

class Lesson(Base):
    __tablename__ = "lessons"
    
    lesson_id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    difficulty = Column(Enum(DifficultyLevel), nullable=False)
    category = Column(Enum(LessonCategory), nullable=False)
    target_language = Column(String, nullable=False)
    duration = Column(Integer)  # in minutes
    vocabulary_count = Column(Integer)
    thumbnail = Column(String)
    content = Column(JSON)  # Stores vocabulary, phrases, cultural notes
    
    # Relationships
    exercises = relationship("Exercise", back_populates="lesson")
    progress = relationship("UserProgress", back_populates="lesson")
```

### app/models/progress.py

```python
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class UserProgress(Base):
    __tablename__ = "user_progress"
    
    progress_id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)
    lesson_id = Column(String, ForeignKey("lessons.lesson_id"), nullable=False)
    score = Column(Float, nullable=False)  # Percentage
    completed_at = Column(DateTime, default=datetime.utcnow)
    time_spent = Column(Integer)  # in seconds
    exercises_completed = Column(Integer)
    total_exercises = Column(Integer)
    
    # Relationships
    user = relationship("User", back_populates="progress")
    lesson = relationship("Lesson", back_populates="progress")
```

## API Routes

### app/api/auth.py

```python
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.database import get_db
from app.schemas.user import UserCreate, UserResponse, Token
from app.core.security import verify_password, get_password_hash, create_access_token
from app.config import settings
from app.models.user import User

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    
    # Check if user exists
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or username already exists"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        user_id=f"U{int(datetime.now().timestamp() * 1000)}",
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        user_type=user_data.user_type,
        target_language=user_data.target_language
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login user and return JWT token"""
    
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.user_id}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}
```

### app/api/lessons.py

```python
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.schemas.lesson import LessonResponse, LessonDetail
from app.models.lesson import Lesson, DifficultyLevel, LessonCategory
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/api/lessons", tags=["Lessons"])

@router.get("/", response_model=List[LessonResponse])
async def get_lessons(
    target_language: Optional[str] = None,
    difficulty: Optional[DifficultyLevel] = None,
    category: Optional[LessonCategory] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=100),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get all lessons with optional filters"""
    
    query = db.query(Lesson)
    
    if target_language:
        query = query.filter(Lesson.target_language == target_language)
    if difficulty:
        query = query.filter(Lesson.difficulty == difficulty)
    if category:
        query = query.filter(Lesson.category == category)
    
    lessons = query.offset(skip).limit(limit).all()
    return lessons

@router.get("/{lesson_id}", response_model=LessonDetail)
async def get_lesson(
    lesson_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get specific lesson with full content"""
    
    lesson = db.query(Lesson).filter(Lesson.lesson_id == lesson_id).first()
    
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    return lesson
```

### app/api/recommendations.py

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.recommendation import RecommendationResponse
from app.services.recommendation_service import RecommendationService
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

@router.get("/", response_model=List[RecommendationResponse])
async def get_recommendations(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get personalized lesson recommendations for current user"""
    
    recommendation_service = RecommendationService(db)
    recommendations = recommendation_service.generate_recommendations(current_user.user_id)
    
    return recommendations
```

## Services Layer

### app/services/recommendation_service.py

```python
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import numpy as np

from app.models.user import User
from app.models.lesson import Lesson
from app.models.progress import UserProgress

class RecommendationService:
    def __init__(self, db: Session):
        self.db = db
    
    def generate_recommendations(self, user_id: str, limit: int = 5) -> List[dict]:
        """Generate personalized lesson recommendations"""
        
        # Get user
        user = self.db.query(User).filter(User.user_id == user_id).first()
        if not user:
            return []
        
        # Get user's progress
        user_progress = self.db.query(UserProgress).filter(
            UserProgress.user_id == user_id
        ).all()
        
        # Get available lessons for user's target language
        available_lessons = self.db.query(Lesson).filter(
            Lesson.target_language == user.target_language
        ).all()
        
        # Filter out completed lessons
        completed_lesson_ids = [p.lesson_id for p in user_progress]
        incomplete_lessons = [
            l for l in available_lessons 
            if l.lesson_id not in completed_lesson_ids
        ]
        
        if not user_progress:
            # New user - recommend beginner lessons
            beginner_lessons = [
                l for l in incomplete_lessons 
                if l.difficulty == "beginner"
            ]
            return self._format_recommendations(
                beginner_lessons[:limit],
                reason="Perfect for beginners",
                confidence=0.9
            )
        
        # Calculate average score
        avg_score = np.mean([p.score for p in user_progress])
        
        # Get last completed lesson
        last_progress = max(user_progress, key=lambda p: p.completed_at)
        last_lesson = self.db.query(Lesson).filter(
            Lesson.lesson_id == last_progress.lesson_id
        ).first()
        
        if avg_score >= 80:
            # Good performance - suggest same or higher difficulty
            if last_lesson.difficulty == "beginner":
                target_difficulties = ["beginner", "intermediate"]
            elif last_lesson.difficulty == "intermediate":
                target_difficulties = ["intermediate", "advanced"]
            else:
                target_difficulties = ["advanced"]
            
            recommended = [
                l for l in incomplete_lessons
                if l.difficulty in target_difficulties
            ]
            
            return self._format_recommendations(
                recommended[:limit],
                reason="Based on your excellent progress",
                confidence=0.85
            )
        else:
            # Lower performance - suggest same difficulty
            recommended = [
                l for l in incomplete_lessons
                if l.difficulty == last_lesson.difficulty
            ]
            
            return self._format_recommendations(
                recommended[:limit],
                reason="Practice makes perfect",
                confidence=0.75
            )
    
    def _format_recommendations(
        self, lessons: List[Lesson], reason: str, confidence: float
    ) -> List[dict]:
        """Format lessons into recommendation objects"""
        
        return [
            {
                "lesson_id": lesson.lesson_id,
                "title": lesson.title,
                "description": lesson.description,
                "difficulty": lesson.difficulty,
                "category": lesson.category,
                "duration": lesson.duration,
                "reason": reason,
                "confidence": confidence
            }
            for lesson in lessons
        ]
```

## Security

### app/core/security.py

```python
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    
    return encoded_jwt

def decode_access_token(token: str) -> dict:
    """Decode and verify JWT token"""
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        return None
```

## Database Setup

### app/database.py

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

## Main Application

### app/main.py

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import auth, users, lessons, progress, recommendations

app = FastAPI(
    title="FluentFusion API",
    description="AI-Driven Language Learning Platform for Rwanda's Tourism Sector",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(lessons.router)
app.include_router(progress.router)
app.include_router(recommendations.router)

@app.get("/")
async def root():
    return {
        "message": "FluentFusion API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }
```

## Testing

### tests/test_auth.py

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_user():
    response = client.post("/api/auth/register", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123",
        "user_type": "tourist",
        "target_language": "kinyarwanda"
    })
    
    assert response.status_code == 201
    assert "user_id" in response.json()

def test_login_user():
    response = client.post("/api/auth/login", data={
        "username": "test@example.com",
        "password": "password123"
    })
    
    assert response.status_code == 200
    assert "access_token" in response.json()
```

## Docker Setup

### docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/fluentfusion
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./app:/app/app
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=fluentfusion
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

## API Documentation

Once the server is running, access:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Next Steps

1. Implement the models and schemas
2. Create database migrations with Alembic
3. Implement all API endpoints
4. Add comprehensive tests
5. Set up CI/CD pipeline
6. Deploy to production

---

**For complete implementation details, refer to the individual files in the backend/ directory.**
