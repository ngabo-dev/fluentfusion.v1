from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, JSON, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Announcement(Base):
    __tablename__ = "announcements"
    
    id = Column(Integer, primary_key=True, index=True)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Announcement content
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    summary = Column(String(500))  # Short preview for lists
    
    # Type and priority
    announcement_type = Column(String(50), default="general")  # general, system, maintenance, feature, event, promotion
    priority = Column(String(20), default="normal")  # low, normal, high, urgent
    
    # Target audience
    target_role = Column(String(50))  # all, student, instructor, admin
    target_language_id = Column(Integer, ForeignKey("languages.id"))  # For language-specific announcements
    target_course_id = Column(Integer, ForeignKey("courses.id"))  # For course-specific announcements
    
    # Media
    image_url = Column(String(500))
    action_url = Column(String(500))  # CTA link
    
    # Scheduling
    is_published = Column(Boolean, default=False)
    published_at = Column(DateTime(timezone=True))
    scheduled_for = Column(DateTime(timezone=True))  # Future publish date
    expires_at = Column(DateTime(timezone=True))  # Expiration date
    
    # Stats
    view_count = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    author = relationship("User", back_populates="announcements")
    language = relationship("Language", back_populates="announcements")
    course = relationship("Course", back_populates="announcements")
    views = relationship("AnnouncementView", back_populates="announcement", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('ix_announcements_author_id', author_id),
        Index('ix_announcements_is_published', is_published),
        Index('ix_announcements_scheduled_for', scheduled_for),
        Index('ix_announcements_target_role', target_role),
    )

class AnnouncementView(Base):
    __tablename__ = "announcement_views"
    
    id = Column(Integer, primary_key=True, index=True)
    announcement_id = Column(Integer, ForeignKey("announcements.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    viewed_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    announcement = relationship("Announcement", back_populates="views")
    user = relationship("User", back_populates="announcement_views")
    
    __table_args__ = (
        Index('ix_announcement_views_announcement_id', announcement_id),
        Index('ix_announcement_views_user_id', user_id),
        Index('ix_announcement_views_unique', announcement_id, user_id, unique=True),
    )
