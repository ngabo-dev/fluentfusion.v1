from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, DECIMAL, Index, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class LiveSession(Base):
    __tablename__ = "live_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    instructor_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"))
    language_id = Column(Integer, ForeignKey("languages.id"), nullable=False)
    
    title = Column(String(255), nullable=False)
    description = Column(Text)
    level = Column(String(50))  # beginner, intermediate, advanced
    
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    duration_min = Column(Integer, nullable=False, default=60)
    max_participants = Column(Integer, default=100)
    current_viewers = Column(Integer, default=0)
    hands_raised = Column(Integer, default=0)
    
    status = Column(String(50), default="scheduled")  # scheduled, live, ended, cancelled
    stream_url = Column(String(500))  # Video stream URL when live
    recording_url = Column(String(500))  # Set after session ends
    ended_at = Column(DateTime(timezone=True))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    instructor = relationship("User", back_populates="taught_sessions")
    course = relationship("Course", back_populates="live_sessions")
    language = relationship("Language", back_populates="live_sessions")
    registrations = relationship("LiveSessionRegistration", back_populates="session", cascade="all, delete-orphan")
    messages = relationship("LiveSessionMessage", back_populates="session", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('ix_live_sessions_instructor_id', instructor_id),
        Index('ix_live_sessions_language_id', language_id),
        Index('ix_live_sessions_status', status),
        Index('ix_live_sessions_scheduled_at', scheduled_at),
    )

class LiveSessionRegistration(Base):
    __tablename__ = "live_session_registrations"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("live_sessions.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    registered_at = Column(DateTime(timezone=True), server_default=func.now())
    joined_at = Column(DateTime(timezone=True))
    left_at = Column(DateTime(timezone=True))
    hand_raised = Column(Boolean, default=False)
    
    # Relationships
    session = relationship("LiveSession", back_populates="registrations")
    user = relationship("User", back_populates="live_registrations")
    
    __table_args__ = (
        UniqueConstraint('session_id', 'user_id', name='uq_live_registration'),
        Index('ix_live_registrations_user_id', user_id),
    )

class LiveSessionMessage(Base):
    __tablename__ = "live_session_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("live_sessions.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    message = Column(Text, nullable=False)
    sent_at = Column(DateTime(timezone=True), server_default=func.now())
    is_pinned = Column(Boolean, default=False)
    is_deleted = Column(Boolean, default=False)
    
    # Relationships
    session = relationship("LiveSession", back_populates="messages")
    user = relationship("User", back_populates="live_messages")
    
    __table_args__ = (
        Index('ix_live_messages_session_id', session_id),
        Index('ix_live_messages_sent_at', sent_at),
    )