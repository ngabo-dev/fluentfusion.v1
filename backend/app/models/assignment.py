from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, DECIMAL, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    unit_id = Column(Integer, ForeignKey("course_units.id", ondelete="SET NULL"), nullable=True)
    instructor_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    title = Column(String(255), nullable=False)
    assignment_type = Column(String(50), default="writing")  # writing, speaking
    prompt = Column(Text, nullable=False)
    rubric = Column(Text)
    due_date = Column(DateTime(timezone=True), nullable=True)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    course = relationship("Course", back_populates="assignments")
    instructor = relationship("User", foreign_keys=[instructor_id])
    unit = relationship("CourseUnit", back_populates="assignments")
    submissions = relationship("AssignmentSubmission", back_populates="assignment", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_assignments_course_id", course_id),
        Index("ix_assignments_instructor_id", instructor_id),
    )


class AssignmentSubmission(Base):
    __tablename__ = "assignment_submissions"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    content = Column(Text)
    audio_url = Column(String(500))
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())

    # Grading
    grade = Column(DECIMAL(5, 2), nullable=True)   # 0.00 – 100.00; validated at application layer
    feedback = Column(Text, nullable=True)
    graded_at = Column(DateTime(timezone=True), nullable=True)
    graded_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Relationships
    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("User", foreign_keys=[student_id])
    grader = relationship("User", foreign_keys=[graded_by])

    __table_args__ = (
        Index("ix_assignment_submissions_assignment_id", assignment_id),
        Index("ix_assignment_submissions_student_id", student_id),
    )
