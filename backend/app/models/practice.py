from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, DECIMAL, JSON, Index, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

# Flashcard Models
class FlashcardDeck(Base):
    __tablename__ = "flashcard_decks"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))  # NULL if system deck
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"))
    language_id = Column(Integer, ForeignKey("languages.id"), nullable=False)
    
    name = Column(String(255), nullable=False)
    description = Column(Text)
    is_system = Column(Boolean, default=False)  # Created by instructor
    card_count = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User")
    course = relationship("Course", back_populates="flashcard_decks")
    language = relationship("Language", back_populates="flashcard_decks")
    flashcards = relationship("Flashcard", back_populates="deck", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('ix_flashcard_decks_user_id', user_id),
        Index('ix_flashcard_decks_language_id', language_id),
    )

class Flashcard(Base):
    __tablename__ = "flashcards"
    
    id = Column(Integer, primary_key=True, index=True)
    deck_id = Column(Integer, ForeignKey("flashcard_decks.id", ondelete="CASCADE"), nullable=False)
    
    front_text = Column(String(500), nullable=False)  # Word in target language
    back_text = Column(String(500), nullable=False)   # Translation
    phonetic = Column(String(255))  # Pronunciation hint
    example_sentence = Column(Text)
    audio_url = Column(String(500))
    image_url = Column(String(500))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    deck = relationship("FlashcardDeck", back_populates="flashcards")
    progress = relationship("FlashcardProgress", back_populates="flashcard", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('ix_flashcards_deck_id', deck_id),
    )

class FlashcardProgress(Base):
    __tablename__ = "flashcard_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    flashcard_id = Column(Integer, ForeignKey("flashcards.id", ondelete="CASCADE"), nullable=False)
    
    status = Column(String(50), nullable=False, default="new")  # new, learning, known
    review_count = Column(Integer, default=0)
    last_reviewed_at = Column(DateTime(timezone=True))
    next_review_at = Column(DateTime(timezone=True))  # Spaced repetition schedule
    ease_factor = Column(DECIMAL(4,2), default=2.50)  # SM-2 algorithm ease factor
    
    # Relationships
    user = relationship("User", back_populates="flashcard_progress")
    flashcard = relationship("Flashcard", back_populates="progress")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'flashcard_id', name='uq_flashcard_progress'),
        Index('ix_flashcard_progress_user_id', user_id),
        Index('ix_flashcard_progress_next_review_at', next_review_at),
    )

# Vocabulary Bank
class VocabularyBank(Base):
    __tablename__ = "vocabulary_bank"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    word = Column(String(255), nullable=False)
    translation = Column(String(255), nullable=False)
    language_id = Column(Integer, ForeignKey("languages.id"), nullable=False)
    category = Column(String(100))  # Greetings, Places, Food, Business, etc.
    notes = Column(Text)
    mastery_level = Column(Integer, default=0)  # 0-5 star rating
    is_bookmarked = Column(Boolean, default=False)
    source_lesson_id = Column(Integer, ForeignKey("lessons.id"))
    
    added_at = Column(DateTime(timezone=True), server_default=func.now())
    last_reviewed_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User", back_populates="vocabulary_bank")
    language = relationship("Language", back_populates="vocabulary_bank")
    source_lesson = relationship("Lesson", foreign_keys=[source_lesson_id])
    
    __table_args__ = (
        Index('ix_vocabulary_bank_user_id', user_id),
        Index('ix_vocabulary_bank_is_bookmarked', is_bookmarked),
        UniqueConstraint('user_id', 'word', 'language_id', name='uq_vocabulary_word'),
    )

# Speaking Practice
class SpeakingExercise(Base):
    __tablename__ = "speaking_exercises"
    
    id = Column(Integer, primary_key=True, index=True)
    language_id = Column(Integer, ForeignKey("languages.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    
    phrase_target = Column(String(500), nullable=False)  # Phrase to pronounce
    phrase_phonetic = Column(String(500))  # Pronunciation guide
    reference_audio_url = Column(String(500))  # Model pronunciation
    difficulty = Column(String(50))  # beginner, intermediate, advanced
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    language = relationship("Language", back_populates="speaking_exercises")
    lesson = relationship("Lesson")
    attempts = relationship("SpeakingAttempt", back_populates="exercise", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('ix_speaking_exercises_language_id', language_id),
        Index('ix_speaking_exercises_lesson_id', lesson_id),
    )

class SpeakingAttempt(Base):
    __tablename__ = "speaking_attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    exercise_id = Column(Integer, ForeignKey("speaking_exercises.id", ondelete="CASCADE"), nullable=False)
    
    audio_url = Column(String(500), nullable=False)
    overall_score_pct = Column(Integer)  # 0-100 AI score
    tone_score_pct = Column(Integer)
    vowel_score_pct = Column(Integer)
    rhythm_score_pct = Column(Integer)
    ai_feedback = Column(Text)
    
    attempted_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="speaking_attempts")
    exercise = relationship("SpeakingExercise", back_populates="attempts")
    
    __table_args__ = (
        Index('ix_speaking_attempts_user_id', user_id),
        Index('ix_speaking_attempts_exercise_id', exercise_id),
    )

# Listening Practice
class ListeningExercise(Base):
    __tablename__ = "listening_exercises"
    
    id = Column(Integer, primary_key=True, index=True)
    language_id = Column(Integer, ForeignKey("languages.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    
    audio_url = Column(String(500), nullable=False)
    transcript = Column(Text, nullable=False)
    difficulty = Column(String(50))
    duration_sec = Column(Integer)
    hint_words = Column(Text)  # JSON array of hint words
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    language = relationship("Language", back_populates="listening_exercises")
    lesson = relationship("Lesson")
    attempts = relationship("ListeningAttempt", back_populates="exercise", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('ix_listening_exercises_language_id', language_id),
        Index('ix_listening_exercises_lesson_id', lesson_id),
    )

class ListeningAttempt(Base):
    __tablename__ = "listening_attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    exercise_id = Column(Integer, ForeignKey("listening_exercises.id", ondelete="CASCADE"), nullable=False)
    
    answer_text = Column(Text, nullable=False)
    is_correct = Column(Boolean)
    accuracy_pct = Column(Integer)  # 0-100 text match score
    playback_speed = Column(DECIMAL(3,2), default=1.00)
    
    attempted_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="listening_attempts")
    exercise = relationship("ListeningExercise", back_populates="attempts")
    
    __table_args__ = (
        Index('ix_listening_attempts_user_id', user_id),
        Index('ix_listening_attempts_exercise_id', exercise_id),
    )