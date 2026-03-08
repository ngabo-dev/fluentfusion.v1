from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, DECIMAL, Text, Index, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Enrollment(Base):
    __tablename__ = "enrollments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    
    enrolled_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))
    last_accessed_at = Column(DateTime(timezone=True))
    completion_pct = Column(Integer, default=0)  # 0-100
    last_lesson_id = Column(Integer, ForeignKey("lessons.id"))
    certificate_url = Column(String(500))
    refunded_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
    last_lesson = relationship("Lesson")
    lesson_completions = relationship("LessonCompletion", back_populates="enrollment", cascade="all, delete-orphan")
    quiz_attempts = relationship("QuizAttempt", back_populates="enrollment", cascade="all, delete-orphan")
    instructor_earnings = relationship("InstructorEarning", back_populates="enrollment")
    certificate = relationship("Certificate", back_populates="enrollment", uselist=False)
    
    __table_args__ = (
        UniqueConstraint('user_id', 'course_id', name='uq_enrollment'),
        Index('ix_enrollments_user_id', user_id),
        Index('ix_enrollments_course_id', course_id),
    )

class LessonCompletion(Base):
    __tablename__ = "lesson_completions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    enrollment_id = Column(Integer, ForeignKey("enrollments.id", ondelete="CASCADE"), nullable=False)
    
    completed_at = Column(DateTime(timezone=True), server_default=func.now())
    time_spent_sec = Column(Integer, default=0)
    notes = Column(Text)
    
    # Relationships
    user = relationship("User", back_populates="lesson_completions")
    lesson = relationship("Lesson", back_populates="completions")
    enrollment = relationship("Enrollment", back_populates="lesson_completions")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'lesson_id', name='uq_lesson_completion'),
        Index('ix_lesson_completions_enrollment_id', enrollment_id),
    )

class SkillScore(Base):
    __tablename__ = "skill_scores"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    language_id = Column(Integer, ForeignKey("languages.id"), nullable=False)
    skill = Column(String(50), nullable=False)  # vocabulary, grammar, speaking, listening, reading, writing
    score_pct = Column(Integer, nullable=False, default=0)  # 0-100
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="skill_scores")
    language = relationship("Language", back_populates="skill_scores")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'language_id', 'skill', name='uq_skill_score'),
    )

class WeeklyActivity(Base):
    __tablename__ = "weekly_activity"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    week_start = Column(DateTime, nullable=False)  # Monday of the week
    lessons_done = Column(Integer, default=0)
    xp_earned = Column(Integer, default=0)
    minutes_spent = Column(Integer, default=0)
    
    # Relationships
    user = relationship("User", back_populates="weekly_activities")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'week_start', name='uq_weekly_activity'),
        Index('ix_weekly_activity_user_id', user_id),
    )