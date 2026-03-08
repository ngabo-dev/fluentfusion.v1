from sqlalchemy import Column, Integer, String, Boolean, Table, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Language(Base):
    __tablename__ = "languages"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(10), unique=True, nullable=False, index=True)  # ISO 639-1: rw, en, fr
    name = Column(String(100), nullable=False)
    native_name = Column(String(100))
    flag_emoji = Column(String(10))
    learner_count = Column(Integer, default=0)  # Cached
    is_active = Column(Boolean, default=True)
    
    # Relationships
    user_onboarding_native = relationship("UserOnboarding", foreign_keys="UserOnboarding.native_language_id", back_populates="native_language")
    user_onboarding_learning = relationship("UserOnboarding", foreign_keys="UserOnboarding.learning_language_id", back_populates="learning_language")
    user_languages = relationship("UserLanguage", back_populates="language")
    courses = relationship("Course", back_populates="language")
    lesson_vocabulary = relationship("LessonVocabulary", back_populates="language")
    skill_scores = relationship("SkillScore", back_populates="language")
    flashcard_decks = relationship("FlashcardDeck", back_populates="language")
    vocabulary_bank = relationship("VocabularyBank", back_populates="language")
    speaking_exercises = relationship("SpeakingExercise", back_populates="language")
    listening_exercises = relationship("ListeningExercise", back_populates="language")
    live_sessions = relationship("LiveSession", back_populates="language")
    community_posts = relationship("CommunityPost", back_populates="language")
    leaderboards = relationship("Leaderboard", back_populates="language")
    announcements = relationship("Announcement", back_populates="language")

class UserOnboarding(Base):
    __tablename__ = "user_onboarding"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    native_language_id = Column(Integer, ForeignKey("languages.id"), nullable=False)
    learning_language_id = Column(Integer, ForeignKey("languages.id"), nullable=False)
    learning_goal = Column(String(50))  # travel, academic, business, conversation
    initial_level = Column(String(50))  # beginner, intermediate, advanced
    completed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="onboarding")
    native_language = relationship("Language", foreign_keys=[native_language_id])
    learning_language = relationship("Language", foreign_keys=[learning_language_id])

class UserLanguage(Base):
    __tablename__ = "user_languages"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    language_id = Column(Integer, ForeignKey("languages.id"), nullable=False)
    type = Column(String(50), nullable=False)  # native, learning
    level = Column(String(50))  # beginner, intermediate, advanced
    fluency_pct = Column(Integer, default=0)  # 0-100
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="languages")
    language = relationship("Language", back_populates="user_languages")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'language_id', 'type', name='uq_user_language'),
    )