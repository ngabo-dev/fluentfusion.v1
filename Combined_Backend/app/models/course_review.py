from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, DECIMAL, Index, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class CourseReview(Base):
    __tablename__ = "course_reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    rating = Column(Integer, nullable=False)  # 1-5 stars
    title = Column(String(255))
    content = Column(Text)
    
    # Feedback on course aspects
    content_quality_rating = Column(Integer)  # 1-5
    instructor_rating = Column(Integer)  # 1-5
    value_rating = Column(Integer)  # 1-5
    
    is_approved = Column(String(20), default="pending")  # pending, approved, rejected
    rejection_reason = Column(Text)
    
    helpful_count = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="course_reviews")
    course = relationship("Course", back_populates="reviews")
    
    __table_args__ = (
        UniqueConstraint('course_id', 'user_id', name='uq_course_review'),
        Index('ix_course_reviews_course_id', course_id),
        Index('ix_course_reviews_user_id', user_id),
    )
