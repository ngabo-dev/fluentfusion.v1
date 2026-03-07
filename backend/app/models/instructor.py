from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, DECIMAL, Index, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class InstructorProfile(Base):
    __tablename__ = "instructor_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    headline = Column(String(255))  # e.g., "TEFL Certified English Instructor"
    bio = Column(Text)
    website_url = Column(String(500))
    
    total_students = Column(Integer, default=0)
    total_courses = Column(Integer, default=0)
    avg_rating = Column(DECIMAL(3,2), default=0.00)
    total_earnings_usd = Column(DECIMAL(10,2), default=0.00)
    
    is_verified = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="instructor_profile")
    earnings = relationship("InstructorEarning", back_populates="instructor", cascade="all, delete-orphan")
    payout_requests = relationship("InstructorPayoutRequest", back_populates="instructor", cascade="all, delete-orphan")

class InstructorEarning(Base):
    __tablename__ = "instructor_earnings"
    
    id = Column(Integer, primary_key=True, index=True)
    instructor_id = Column(Integer, ForeignKey("instructor_profiles.user_id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    enrollment_id = Column(Integer, ForeignKey("enrollments.id", ondelete="CASCADE"), nullable=False)
    
    gross_amount = Column(DECIMAL(8,2), nullable=False)
    platform_fee_pct = Column(DECIMAL(4,2), default=30.00)
    net_amount = Column(DECIMAL(8,2), nullable=False)
    currency = Column(String(10), default="USD")
    status = Column(String(50), default="pending")  # pending, paid, refunded
    paid_at = Column(DateTime(timezone=True))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    instructor = relationship("InstructorProfile", back_populates="earnings")
    course = relationship("Course", back_populates="instructor_earnings")
    enrollment = relationship("Enrollment", back_populates="instructor_earnings")
    
    __table_args__ = (
        Index('ix_instructor_earnings_instructor_id', instructor_id),
        Index('ix_instructor_earnings_course_id', course_id),
        Index('ix_instructor_earnings_status', status),
    )

class InstructorPayoutRequest(Base):
    __tablename__ = "instructor_payout_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    instructor_id = Column(Integer, ForeignKey("instructor_profiles.user_id", ondelete="CASCADE"), nullable=False)
    
    amount = Column(DECIMAL(10,2), nullable=False)
    method = Column(String(50))  # bank, mobile_money, paypal
    account_details = Column(Text)  # Encrypted payout info
    status = Column(String(50), default="pending")  # pending, processing, paid, rejected
    
    requested_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_at = Column(DateTime(timezone=True))
    
    # Relationships
    instructor = relationship("InstructorProfile", back_populates="payout_requests")
    
    __table_args__ = (
        Index('ix_instructor_payout_requests_instructor_id', instructor_id),
        Index('ix_instructor_payout_requests_status', status),
    )