from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, JSON, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Meeting(Base):
    __tablename__ = "meetings"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Organizer (instructor)
    organizer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Meeting details
    title = Column(String(255), nullable=False)
    description = Column(Text)
    meeting_type = Column(String(50), nullable=False)  # individual, group, all_students, all_instructors, all_admins
    
    # Scheduled time
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    duration_minutes = Column(Integer, default=60)
    timezone = Column(String(100), default="UTC")
    
    # Meeting link (optional - can be generated or provided)
    meeting_link = Column(String(500))
    meeting_platform = Column(String(50))  # zoom, google_meet, custom
    
    # Status
    status = Column(String(50), default="scheduled")  # scheduled, confirmed, declined, cancelled, completed
    
    # Invitations (stored as JSON for multiple recipients)
    invitee_ids = Column(JSON)  # List of user IDs for individual/group meetings
    invitee_count = Column(Integer, default=0)
    
    # For group meetings
    group_name = Column(String(255))
    
    # Reason/purpose
    reason = Column(Text)
    
    # Response
    response = Column(String(50))  # pending, accepted, declined
    response_at = Column(DateTime(timezone=True))
    response_note = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    organizer = relationship("User", back_populates="organized_meetings")
    
    __table_args__ = (
        Index('ix_meetings_organizer_id', organizer_id),
        Index('ix_meetings_scheduled_at', scheduled_at),
        Index('ix_meetings_status', status),
    )


# Add meeting relationship to User model
# This will be added to user.py relationships
