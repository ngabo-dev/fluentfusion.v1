"""
SQLAlchemy database models for FluentFusion
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    """User model for storing user information"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(36), unique=True, index=True, nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    user_type = Column(String(20), default="tourist")  # tourist or tourism_worker
    target_language = Column(String(20), default="kinyarwanda")  # kinyarwanda, english, french
    native_language = Column(String(20), default="english")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    progress = relationship("UserProgress", back_populates="user")
    badges = relationship("UserBadge", back_populates="user")

class Lesson(Base):
    """Lesson model for storing lesson content"""
    __tablename__ = "lessons"
    
    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(String(10), unique=True, index=True, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String(20), default="beginner")  # beginner, intermediate, advanced
    category = Column(String(50), index=True)  # greetings, accommodation, food, transportation, shopping, emergency
    target_language = Column(String(20), nullable=False)  # kinyarwanda, english, french
    duration = Column(Integer, default=15)  # Duration in minutes
    vocabulary_count = Column(Integer, default=0)
    thumbnail = Column(String(100))
    content = Column(JSON)  # Stores vocabulary, phrases, cultural notes as JSON
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    exercises = relationship("Exercise", back_populates="lesson")
    progress = relationship("UserProgress", back_populates="lesson")

class Exercise(Base):
    """Exercise model for storing lesson exercises"""
    __tablename__ = "exercises"
    
    id = Column(Integer, primary_key=True, index=True)
    exercise_id = Column(String(10), unique=True, index=True, nullable=False)
    lesson_id = Column(String(10), ForeignKey("lessons.lesson_id"), index=True)
    type = Column(String(30))  # multiple_choice, fill_blank, matching
    prompt = Column(Text, nullable=False)
    options = Column(JSON)  # Array of options for multiple choice
    correct_answer = Column(Text, nullable=False)
    explanation = Column(Text)
    points = Column(Integer, default=10)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    lesson = relationship("Lesson", back_populates="exercises")

class UserProgress(Base):
    """User progress tracking model"""
    __tablename__ = "user_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    progress_id = Column(String(36), unique=True, index=True, nullable=False)
    user_id = Column(String(36), ForeignKey("users.user_id"), index=True)
    lesson_id = Column(String(10), ForeignKey("lessons.lesson_id"), index=True)
    score = Column(Float, default=0.0)
    time_spent = Column(Integer, default=0)  # Time in seconds
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime)
    answers = Column(JSON)  # Stores user answers
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="progress")
    lesson = relationship("Lesson", back_populates="progress")

class Badge(Base):
    """Badge model for achievements"""
    __tablename__ = "badges"
    
    id = Column(Integer, primary_key=True, index=True)
    badge_id = Column(String(10), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    icon = Column(String(50))
    criteria = Column(JSON)  # Criteria for earning the badge
    created_at = Column(DateTime, default=datetime.utcnow)

class UserBadge(Base):
    """User-Badge relationship model"""
    __tablename__ = "user_badges"
    
    id = Column(Integer, primary_key=True, index=True)
    user_badge_id = Column(String(36), unique=True, index=True, nullable=False)
    user_id = Column(String(36), ForeignKey("users.user_id"), index=True)
    badge_id = Column(String(10), ForeignKey("badges.badge_id"), index=True)
    earned_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="badges")
    badge = relationship("Badge")
