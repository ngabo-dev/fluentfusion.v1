from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    type = Column(String(50), nullable=False)  # streak_reminder, new_lesson, live_session, achievement, community_reply, payment, system
    title = Column(String(255), nullable=False)
    body = Column(Text)
    action_url = Column(String(500))  # Deep link destination
    source_type = Column(String(50))  # live_session, achievement, post, etc.
    source_id = Column(Integer)
    
    is_read = Column(Boolean, default=False)
    sent_via = Column(String(50))  # push, email, both
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="notifications")
    
    __table_args__ = (
        Index('ix_notifications_user_id', user_id),
        Index('ix_notifications_is_read', is_read),
        Index('ix_notifications_created_at', created_at),
    )