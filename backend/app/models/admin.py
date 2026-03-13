from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, JSON, Index, DECIMAL
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class AdminAuditLog(Base):
    __tablename__ = "admin_audit_log"
    
    id = Column(Integer, primary_key=True, index=True)
    admin_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    action = Column(String(100), nullable=False)  # ban_user, approve_course, reject_course, payout, etc.
    target_type = Column(String(50), nullable=False)  # user, course, session, payment
    target_id = Column(Integer, nullable=False)
    notes = Column(Text)
    extra_data = Column(JSON)  # JSON blob of before/after state
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    admin = relationship("User")
    
    __table_args__ = (
        Index('ix_admin_audit_log_admin_user_id', admin_user_id),
        Index('ix_admin_audit_log_action', action),
        Index('ix_admin_audit_log_target_type', target_type),
        Index('ix_admin_audit_log_created_at', created_at),
    )

class ModerationReport(Base):
    __tablename__ = "moderation_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    reporter_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    target_type = Column(String(50), nullable=False)  # post, comment, session, course, user
    target_id = Column(Integer, nullable=False)
    reason = Column(String(50), nullable=False)  # spam, hate_speech, inappropriate, copyright
    details = Column(Text)
    
    status = Column(String(50), default="open")  # open, reviewing, resolved, dismissed
    resolved_by = Column(Integer, ForeignKey("users.id"))
    resolved_at = Column(DateTime(timezone=True))
    resolution_note = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    reporter = relationship("User", foreign_keys=[reporter_id])
    resolver = relationship("User", foreign_keys=[resolved_by])
    
    __table_args__ = (
        Index('ix_moderation_reports_reporter_id', reporter_id),
        Index('ix_moderation_reports_target_type', target_type),
        Index('ix_moderation_reports_status', status),
        Index('ix_moderation_reports_created_at', created_at),
    )

class PlatformAnalyticsSnapshot(Base):
    __tablename__ = "platform_analytics_snapshots"
    
    id = Column(Integer, primary_key=True, index=True)
    snapshot_date = Column(DateTime, unique=True, nullable=False)
    
    total_users = Column(Integer, default=0)
    new_users_today = Column(Integer, default=0)
    daily_active_users = Column(Integer, default=0)
    monthly_active_users = Column(Integer, default=0)
    total_lessons_completed = Column(Integer, default=0)
    total_revenue_usd = Column(DECIMAL(12,2), default=0.00)
    new_enrollments = Column(Integer, default=0)
    avg_session_min = Column(DECIMAL(6,2), default=0.00)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SystemLog(Base):
    """System log for admin dashboard - tracks platform events"""
    __tablename__ = "system_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    level = Column(String(20), nullable=False)  # INFO, WARN, ERROR
    message = Column(Text, nullable=False)
    log_data = Column(JSON)  # Optional extra data (user_id, action, etc.)
    source = Column(String(50))  # api, pulse, payment, cdn, auth, etc.
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    __table_args__ = (
        Index('ix_system_logs_level', level),
        Index('ix_system_logs_created_at', created_at),
    )


class PlatformAlert(Base):
    """Platform alerts for admin dashboard - critical warnings"""
    __tablename__ = "platform_alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    level = Column(String(20), nullable=False)  # critical, warning, info
    title = Column(String(200), nullable=False)
    description = Column(Text)
    action_label = Column(String(50))  # INVESTIGATE, REVIEW, etc.
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True))
    resolved_by = Column(Integer, ForeignKey("users.id"))
    
    __table_args__ = (
        Index('ix_platform_alerts_level', level),
        Index('ix_platform_alerts_is_active', is_active),
    )


class ModerationQueueItem(Base):
    """Moderation queue items for admin dashboard"""
    __tablename__ = "moderation_queue_items"
    
    id = Column(Integer, primary_key=True, index=True)
    item_type = Column(String(30), nullable=False)  # course, report, payout, verify
    subject = Column(String(200), nullable=False)
    description = Column(Text)
    status = Column(String(20), default="pending")  # pending, approved, rejected
    
    reference_id = Column(Integer)  # ID of the course/report/payout/user being moderated
    reference_type = Column(String(50))  # course, report, payout, user_verification
    reference_data = Column(JSON)  # Extra data about the reference
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True))
    resolved_by = Column(Integer, ForeignKey("users.id"))
    
    __table_args__ = (
        Index('ix_moderation_queue_item_type', item_type),
        Index('ix_moderation_queue_status', status),
    )