from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, DECIMAL, JSON, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Quiz(Base):
    __tablename__ = "quizzes"
    
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    unit_id = Column(Integer, ForeignKey("course_units.id", ondelete="CASCADE"))
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"))
    
    title = Column(String(255), nullable=False)
    description = Column(Text)
    passing_score = Column(Integer, default=70)  # Min % to pass
    order_index = Column(Integer, default=0)
    xp_reward = Column(Integer, default=100)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    course = relationship("Course", back_populates="quizzes")
    unit = relationship("CourseUnit", back_populates="quizzes")
    lesson = relationship("Lesson", back_populates="quizzes")
    questions = relationship("QuizQuestion", back_populates="quiz", cascade="all, delete-orphan")
    attempts = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('ix_quizzes_course_id', course_id),
        Index('ix_quizzes_lesson_id', lesson_id),
    )

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"
    
    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    
    question_type = Column(String(50), nullable=False)  # multiple_choice, fill_blank, listening, speaking, translation
    question_text = Column(Text, nullable=False)
    audio_url = Column(String(500))  # For listening questions
    image_url = Column(String(500))
    order_index = Column(Integer, default=0)
    points = Column(Integer, default=10)
    
    # Relationships
    quiz = relationship("Quiz", back_populates="questions")
    options = relationship("QuizQuestionOption", back_populates="question", cascade="all, delete-orphan")
    answers = relationship("QuizAnswer", back_populates="question", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('ix_quiz_questions_quiz_id', quiz_id),
    )

class QuizQuestionOption(Base):
    __tablename__ = "quiz_question_options"
    
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("quiz_questions.id", ondelete="CASCADE"), nullable=False)
    
    option_text = Column(String(500), nullable=False)
    is_correct = Column(Boolean, default=False)
    order_index = Column(Integer, default=0)
    
    # Relationships
    question = relationship("QuizQuestion", back_populates="options")
    selected_in_answers = relationship("QuizAnswer", foreign_keys="[QuizAnswer.selected_option_id]")
    
    __table_args__ = (
        Index('ix_quiz_options_question_id', question_id),
    )

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    enrollment_id = Column(Integer, ForeignKey("enrollments.id", ondelete="CASCADE"), nullable=False)
    
    score_pct = Column(Integer, nullable=False)  # 0-100
    points_earned = Column(Integer, default=0)
    passed = Column(Boolean, default=False)
    time_taken_sec = Column(Integer, default=0)
    started_at = Column(DateTime(timezone=True), nullable=False)
    completed_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User", back_populates="quiz_attempts")
    quiz = relationship("Quiz", back_populates="attempts")
    enrollment = relationship("Enrollment", back_populates="quiz_attempts")
    answers = relationship("QuizAnswer", back_populates="attempt", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('ix_quiz_attempts_user_id', user_id),
        Index('ix_quiz_attempts_quiz_id', quiz_id),
    )

class QuizAnswer(Base):
    __tablename__ = "quiz_answers"
    
    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("quiz_attempts.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, ForeignKey("quiz_questions.id", ondelete="CASCADE"), nullable=False)
    selected_option_id = Column(Integer, ForeignKey("quiz_question_options.id"))
    
    text_answer = Column(Text)  # For fill_blank, speaking, translation
    audio_url = Column(String(500))  # For speaking responses
    is_correct = Column(Boolean)
    ai_score_pct = Column(Integer)  # AI grading for open-ended answers
    ai_feedback = Column(Text)
    
    # Relationships
    attempt = relationship("QuizAttempt", back_populates="answers")
    question = relationship("QuizQuestion", back_populates="answers")
    selected_option = relationship("QuizQuestionOption", foreign_keys=[selected_option_id])
    
    __table_args__ = (
        Index('ix_quiz_answers_attempt_id', attempt_id),
    )