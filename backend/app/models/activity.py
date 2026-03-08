from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, JSON, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class UserActivity(Base):
    """Tracks all user activities on the platform for analytics and feed"""
    __tablename__ = "user_activities"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Activity type and details
    activity_type = Column(String(50), nullable=False)  # lesson_completed, quiz_passed, course_enrolled, streak_milestone, achievement_unlocked, etc.
    
    # Context - what the activity is related to
    target_type = Column(String(50))  # course, lesson, quiz, achievement, streak, etc.
    target_id = Column(Integer)
    target_title = Column(String(255))  # Denormalized for feed display
    
    # Additional data
    activity_metadata = Column(JSON)  # Extra info like score, duration, etc.
    
    # Points/XP earned
    xp_earned = Column(Integer, default=0)
    
    # For generating activity feed
    is_public = Column(Boolean, default=True)  # Show in community feed
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="activities")
    
    __table_args__ = (
        Index('ix_user_activities_user_id', user_id),
        Index('ix_user_activities_activity_type', activity_type),
        Index('ix_user_activities_created_at', created_at),
        Index('ix_user_activities_target', target_type, target_id),
    )

class UserSession(Base):
    """Tracks user login sessions"""
    __tablename__ = "user_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Session info
    session_token = Column(String(500), unique=True, nullable=False)
    ip_address = Column(String(50))
    user_agent = Column(String(500))
    device_type = Column(String(50))  # mobile, desktop, tablet
    browser = Column(String(50))
    os = Column(String(50))
    
    # Location
    country = Column(String(100))
    city = Column(String(100))
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    last_active_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True))
    
    # Duration in seconds
    duration_seconds = Column(Integer, default=0)
    
    # Relationships
    user = relationship("User", back_populates="sessions")
    
    __table_args__ = (
        Index('ix_user_sessions_user_id', user_id),
        Index('ix_user_sessions_is_active', is_active),
        Index('ix_user_sessions_started_at', started_at),
    )
