from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, DECIMAL, Index, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class UserXP(Base):
    __tablename__ = "user_xp"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    total_xp = Column(Integer, default=0)
    current_level = Column(Integer, default=1)
    xp_to_next_level = Column(Integer, default=2000)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="xp")

class XPTransaction(Base):
    __tablename__ = "xp_transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Integer, nullable=False)  # Can be negative
    source_type = Column(String(50), nullable=False)  # lesson_complete, quiz_pass, daily_challenge, achievement, streak, speaking, listening
    source_id = Column(Integer)  # ID of triggering record
    note = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="xp_transactions")
    
    __table_args__ = (
        Index('ix_xp_transactions_user_id', user_id),
        Index('ix_xp_transactions_source_type', source_type),
        Index('ix_xp_transactions_created_at', created_at),
    )

class Streak(Base):
    __tablename__ = "streaks"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    last_activity_date = Column(DateTime)
    total_active_days = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="streak")

class StreakDay(Base):
    __tablename__ = "streak_days"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    activity_date = Column(DateTime, nullable=False)
    did_practice = Column(Boolean, default=True)
    
    # Relationships
    user = relationship("User", back_populates="streak_days")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'activity_date', name='uq_streak_day'),
        Index('ix_streak_days_user_id', user_id),
    )

class AchievementDefinition(Base):
    __tablename__ = "achievement_definitions"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=False)  # first_lesson, streak_7, perfect_quiz, etc.
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    icon_name = Column(String(100))
    rarity = Column(String(50), default="common")  # common, rare, epic, legendary
    xp_reward = Column(Integer, default=50)
    trigger_type = Column(String(50), nullable=False)  # lesson_count, streak, quiz_score, course_complete, speaking_score, etc.
    trigger_value = Column(Integer)  # Threshold to unlock, e.g., streak=7
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class UserAchievement(Base):
    __tablename__ = "user_achievements"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievement_definitions.id", ondelete="CASCADE"), nullable=False)
    earned_at = Column(DateTime(timezone=True), server_default=func.now())
    is_notified = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("User", back_populates="achievements")
    achievement = relationship("AchievementDefinition")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'achievement_id', name='uq_user_achievement'),
        Index('ix_user_achievements_user_id', user_id),
    )

class DailyChallenge(Base):
    __tablename__ = "daily_challenges"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    challenge_date = Column(DateTime, unique=True, nullable=False)
    bonus_xp = Column(Integer, default=300)
    task_count = Column(Integer, default=3)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DailyChallengeTask(Base):
    __tablename__ = "daily_challenge_tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(Integer, ForeignKey("daily_challenges.id", ondelete="CASCADE"), nullable=False)
    task_type = Column(String(50), nullable=False)  # vocabulary, speaking, listening, lesson, quiz
    description = Column(String(255), nullable=False)
    target_count = Column(Integer, nullable=False)  # e.g., 10 words, 3 exercises
    xp_reward = Column(Integer, default=100)
    order_index = Column(Integer, default=0)
    
    # Relationships
    challenge = relationship("DailyChallenge", back_populates="tasks")
    user_progress = relationship("UserDailyChallengeProgress", back_populates="task", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('ix_daily_challenge_tasks_challenge_id', challenge_id),
    )

DailyChallenge.tasks = relationship("DailyChallengeTask", back_populates="challenge", cascade="all, delete-orphan", order_by="DailyChallengeTask.order_index")

class UserDailyChallengeProgress(Base):
    __tablename__ = "user_daily_challenge_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    challenge_id = Column(Integer, ForeignKey("daily_challenges.id", ondelete="CASCADE"), nullable=False)
    task_id = Column(Integer, ForeignKey("daily_challenge_tasks.id", ondelete="CASCADE"), nullable=False)
    
    current_count = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime(timezone=True))
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="daily_challenge_progress")
    challenge = relationship("DailyChallenge")
    task = relationship("DailyChallengeTask", back_populates="user_progress")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'challenge_id', 'task_id', name='uq_daily_challenge_progress'),
        Index('ix_daily_challenge_progress_user_id', user_id),
    )

class Leaderboard(Base):
    __tablename__ = "leaderboards"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    language_id = Column(Integer, ForeignKey("languages.id"))  # NULL = global leaderboard
    period = Column(String(50), nullable=False)  # weekly, alltime
    period_start = Column(DateTime, nullable=False)  # Start of week for weekly
    xp_total = Column(Integer, default=0)
    rank = Column(Integer)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="leaderboard_entries")
    language = relationship("Language", back_populates="leaderboards")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'language_id', 'period', 'period_start', name='uq_leaderboard_entry'),
        Index('ix_leaderboards_period', period),
        Index('ix_leaderboards_period_start', period_start),
        Index('ix_leaderboards_xp_total', xp_total),
    )