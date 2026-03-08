from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class PulsePrediction(Base):
    """Stores PULSE ML model predictions for student learner states."""
    __tablename__ = "pulse_predictions"

    id = Column(Integer, primary_key=True, index=True)

    # Who was evaluated
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="SET NULL"), nullable=True, index=True)

    # Prediction result
    predicted_state = Column(String(50), nullable=False)  # thriving, coasting, struggling, burning_out, disengaged
    confidence_score = Column(Float, nullable=False)

    # Snapshot of features fed into the model
    feature_snapshot = Column(JSON)

    # Model metadata
    model_version = Column(String(50))

    # Timestamps
    predicted_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    student = relationship("User", foreign_keys=[student_id], backref="pulse_predictions")
    course = relationship("Course", foreign_keys=[course_id], backref="pulse_predictions")

    __table_args__ = (
        Index("ix_pulse_predictions_student_course", "student_id", "course_id"),
        Index("ix_pulse_predictions_predicted_at", "predicted_at"),
    )
