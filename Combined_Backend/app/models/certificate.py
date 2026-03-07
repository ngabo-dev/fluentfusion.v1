from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, JSON, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Certificate(Base):
    __tablename__ = "certificates"
    
    id = Column(Integer, primary_key=True, index=True)
    enrollment_id = Column(Integer, ForeignKey("enrollments.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    
    # Certificate details
    certificate_number = Column(String(50), unique=True, nullable=False)
    certificate_url = Column(String(500))  # URL to generated PDF
    verification_code = Column(String(100), unique=True, nullable=False)
    
    # Status
    is_verified = Column(Boolean, default=True)
    is_revoked = Column(Boolean, default=False)
    revoked_reason = Column(Text)
    
    # Completion data
    completion_date = Column(DateTime(timezone=True), server_default=func.now())
    issued_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Grade/Score
    final_score = Column(Integer)  # 0-100
    grade = Column(String(10))  # A, B, C, D, F
    
    # Instructor who issued
    issued_by_instructor_id = Column(Integer, ForeignKey("users.id"))
    
    # Metadata
    cert_metadata = Column(JSON)  # Additional certificate data
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    enrollment = relationship("Enrollment", back_populates="certificate")
    user = relationship("User", foreign_keys=[user_id], back_populates="certificates")
    course = relationship("Course", back_populates="certificates")
    issued_by = relationship("User", foreign_keys=[issued_by_instructor_id])
    
    __table_args__ = (
        Index('ix_certificates_user_id', user_id),
        Index('ix_certificates_course_id', course_id),
        Index('ix_certificates_enrollment_id', enrollment_id),
        Index('ix_certificates_verification_code', verification_code),
    )
