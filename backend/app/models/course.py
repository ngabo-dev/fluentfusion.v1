from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, DECIMAL, JSON, Index, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    instructor_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    language_id = Column(Integer, ForeignKey("languages.id"), nullable=False)
    
    # Core fields
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    description = Column(Text)
    thumbnail_url = Column(String(500))
    level = Column(String(50))  # beginner, intermediate, advanced
    goal = Column(String(50))  # travel, academic, business, conversation, general
    price_usd = Column(DECIMAL(8,2), default=0.00)
    is_free = Column(Boolean, default=False)
    
    # Status
    is_published = Column(Boolean, default=False)
    approval_status = Column(String(50), default="pending")  # pending, approved, rejected
    rejection_reason = Column(Text)
    
    # Features
    has_certificate = Column(Boolean, default=False)
    has_offline_access = Column(Boolean, default=False)
    
    # Stats (cached)
    total_duration_min = Column(Integer, default=0)
    total_lessons = Column(Integer, default=0)
    total_enrollments = Column(Integer, default=0)
    avg_rating = Column(DECIMAL(3,2), default=0.00)
    rating_count = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    instructor = relationship("User", back_populates="taught_courses")
    language = relationship("Language", back_populates="courses")
    units = relationship("CourseUnit", back_populates="course", cascade="all, delete-orphan", order_by="CourseUnit.order_index")
    enrollments = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")
    lessons = relationship("Lesson", back_populates="course", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="course", cascade="all, delete-orphan")
    reviews = relationship("CourseReview", back_populates="course", cascade="all, delete-orphan")
    flashcard_decks = relationship("FlashcardDeck", back_populates="course")
    live_sessions = relationship("LiveSession", back_populates="course")
    purchases = relationship("CoursePurchase", back_populates="course")
    instructor_earnings = relationship("InstructorEarning", back_populates="course")
    
    __table_args__ = (
        Index('ix_courses_instructor_id', instructor_id),
        Index('ix_courses_language_id', language_id),
        Index('ix_courses_level', level),
        Index('ix_courses_is_published', is_published),
        Index('ix_courses_approval_status', approval_status),
    )

class CourseUnit(Base):
    __tablename__ = "course_units"
    
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    order_index = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    course = relationship("Course", back_populates="units")
    lessons = relationship("Lesson", back_populates="unit", cascade="all, delete-orphan", order_by="Lesson.order_index")
    quizzes = relationship("Quiz", back_populates="unit", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('ix_course_units_course_id', course_id),
        UniqueConstraint('course_id', 'order_index', name='uq_unit_order'),
    )

class Lesson(Base):
    __tablename__ = "lessons"
    
    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("course_units.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    
    title = Column(String(255), nullable=False)
    description = Column(Text)
    video_url = Column(String(500))
    video_duration_sec = Column(Integer, default=0)
    order_index = Column(Integer, nullable=False, default=0)
    is_free_preview = Column(Boolean, default=False)
    xp_reward = Column(Integer, default=50)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    unit = relationship("CourseUnit", back_populates="lessons")
    course = relationship("Course", back_populates="lessons")
    transcript = relationship("LessonTranscript", back_populates="lesson", uselist=False, cascade="all, delete-orphan")
    transcript_segments = relationship("LessonTranscriptSegment", back_populates="lesson", cascade="all, delete-orphan")
    vocabulary = relationship("LessonVocabulary", back_populates="lesson", cascade="all, delete-orphan")
    completions = relationship("LessonCompletion", back_populates="lesson", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="lesson", cascade="all, delete-orphan")
    vocabulary_bank_items = relationship("VocabularyBank", foreign_keys="[VocabularyBank.source_lesson_id]")
    
    __table_args__ = (
        Index('ix_lessons_unit_id', unit_id),
        Index('ix_lessons_course_id', course_id),
        UniqueConstraint('unit_id', 'order_index', name='uq_lesson_order'),
    )

class LessonTranscript(Base):
    __tablename__ = "lesson_transcripts"
    
    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), unique=True, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    lesson = relationship("Lesson", back_populates="transcript")

class LessonTranscriptSegment(Base):
    __tablename__ = "lesson_transcript_segments"
    
    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    start_sec = Column(DECIMAL(8,2), nullable=False)
    end_sec = Column(DECIMAL(8,2), nullable=False)
    text = Column(Text, nullable=False)
    order_index = Column(Integer, nullable=False)
    
    # Relationships
    lesson = relationship("Lesson", back_populates="transcript_segments")
    
    __table_args__ = (
        Index('ix_transcript_segments_lesson_id', lesson_id),
    )

class LessonVocabulary(Base):
    __tablename__ = "lesson_vocabulary"
    
    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    word = Column(String(255), nullable=False)
    translation = Column(String(255), nullable=False)
    language_id = Column(Integer, ForeignKey("languages.id"), nullable=False)
    phonetic = Column(String(255))
    example_usage = Column(Text)
    order_index = Column(Integer, default=0)
    
    # Relationships
    lesson = relationship("Lesson", back_populates="vocabulary")
    language = relationship("Language", back_populates="lesson_vocabulary")
    
    __table_args__ = (
        Index('ix_lesson_vocab_lesson_id', lesson_id),
    )