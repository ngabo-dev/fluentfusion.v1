from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, JSON, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Report(Base):
    """
    User-generated reports/concerns with @mention support.
    This is different from ModerationReport - these are user-to-user or user-to-platform concerns.
    """
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    reporter_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Report type
    report_type = Column(String(50), nullable=False)  # concern, complaint, bug, feedback, abuse, harassment, billing, technical
    priority = Column(String(20), default="normal")  # low, normal, high, urgent
    
    # Content
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    
    # @mentions in the description (stored as JSON array)
    mentions = Column(JSON)  # [{"user_id": 1, "username": "john", "position": 45}, ...]
    
    # Related content (optional)
    related_type = Column(String(50))  # course, lesson, live_session, community_post, user
    related_id = Column(Integer)
    related_title = Column(String(255))  # Denormalized for display
    
    # Status workflow
    status = Column(String(50), default="submitted")  # submitted, acknowledged, in_progress, resolved, closed, rejected
    assigned_to = Column(Integer, ForeignKey("users.id"))  # Admin/Instructor handling this
    
    # Resolution
    resolution = Column(Text)
    resolved_at = Column(DateTime(timezone=True))
    resolution_time_hours = Column(Integer)  # Time to resolve
    
    # Attachments
    attachments = Column(JSON)  # [{"url": "...", "type": "image"}]
    
    # Contact preference
    contact_email = Column(String(255))
    contact_phone = Column(String(50))
    prefer_email_contact = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    reporter = relationship("User", foreign_keys=[reporter_id], back_populates="reports_filed")
    assignee = relationship("User", foreign_keys=[assigned_to])
    comments = relationship("ReportComment", back_populates="report", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('ix_reports_reporter_id', reporter_id),
        Index('ix_reports_status', status),
        Index('ix_reports_report_type', report_type),
        Index('ix_reports_priority', priority),
        Index('ix_reports_created_at', created_at),
    )

class ReportComment(Base):
    """Comments on reports for communication with reporter"""
    __tablename__ = "report_comments"
    
    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id", ondelete="CASCADE"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    content = Column(Text, nullable=False)
    
    # @mentions in comment
    mentions = Column(JSON)
    
    # Is this an internal note (only visible to staff)?
    is_internal = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    report = relationship("Report", back_populates="comments")
    author = relationship("User", back_populates="report_comments")
    
    __table_args__ = (
        Index('ix_report_comments_report_id', report_id),
        Index('ix_report_comments_author_id', author_id),
    )
