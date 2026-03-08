from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, ForeignKey, JSON, Table, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="student")  # student, instructor, admin, super_admin
    username = Column(String(255), unique=True, nullable=True, index=True)
    avatar_url = Column(String(500))
    bio = Column(Text)
    location = Column(String(255))
    
    # Status
    is_email_verified = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)  # Alias for is_email_verified
    is_active = Column(Boolean, default=True)
    is_banned = Column(Boolean, default=False)
    ban_reason = Column(Text)
    last_active_at = Column(DateTime(timezone=True))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    settings = relationship("UserSettings", back_populates="user", uselist=False, cascade="all, delete-orphan")
    onboarding = relationship("UserOnboarding", back_populates="user", uselist=False, cascade="all, delete-orphan")
    social_logins = relationship("UserSocialLogin", back_populates="user", cascade="all, delete-orphan")
    email_verifications = relationship("EmailVerification", back_populates="user", cascade="all, delete-orphan")
    password_resets = relationship("PasswordReset", back_populates="user", cascade="all, delete-orphan")
    
    # Languages
    languages = relationship("UserLanguage", back_populates="user", cascade="all, delete-orphan")
    
    # Courses
    enrollments = relationship("Enrollment", back_populates="user", cascade="all, delete-orphan")
    lesson_completions = relationship("LessonCompletion", back_populates="user", cascade="all, delete-orphan")
    skill_scores = relationship("SkillScore", back_populates="user", cascade="all, delete-orphan")
    weekly_activities = relationship("WeeklyActivity", back_populates="user", cascade="all, delete-orphan")
    quiz_attempts = relationship("QuizAttempt", back_populates="user", cascade="all, delete-orphan")
    
    # Practice
    speaking_attempts = relationship("SpeakingAttempt", back_populates="user", cascade="all, delete-orphan")
    listening_attempts = relationship("ListeningAttempt", back_populates="user", cascade="all, delete-orphan")
    
    # Flashcard
    flashcard_progress = relationship("FlashcardProgress", back_populates="user", cascade="all, delete-orphan")
    vocabulary_bank = relationship("VocabularyBank", back_populates="user", cascade="all, delete-orphan")
    
    # Live sessions
    live_registrations = relationship("LiveSessionRegistration", back_populates="user", cascade="all, delete-orphan")
    live_messages = relationship("LiveSessionMessage", back_populates="user", cascade="all, delete-orphan")
    
    # Community
    community_posts = relationship("CommunityPost", back_populates="user", cascade="all, delete-orphan")
    community_comments = relationship("CommunityComment", back_populates="user", cascade="all, delete-orphan")
    community_likes = relationship("CommunityPostLike", back_populates="user", cascade="all, delete-orphan")
    community_saves = relationship("CommunityPostSave", back_populates="user", cascade="all, delete-orphan")
    
    # Reviews
    course_reviews = relationship("CourseReview", back_populates="user", cascade="all, delete-orphan")
    
    # Gamification
    xp = relationship("UserXP", back_populates="user", uselist=False, cascade="all, delete-orphan")
    xp_transactions = relationship("XPTransaction", back_populates="user", cascade="all, delete-orphan")
    streak = relationship("Streak", back_populates="user", uselist=False, cascade="all, delete-orphan")
    streak_days = relationship("StreakDay", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    daily_challenge_progress = relationship("UserDailyChallengeProgress", back_populates="user", cascade="all, delete-orphan")
    leaderboard_entries = relationship("Leaderboard", back_populates="user", cascade="all, delete-orphan")
    
    # Instructor
    instructor_profile = relationship("InstructorProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    taught_courses = relationship("Course", back_populates="instructor", cascade="all, delete-orphan")
    taught_sessions = relationship("LiveSession", back_populates="instructor", cascade="all, delete-orphan")
    certificates = relationship("Certificate", back_populates="user", foreign_keys="Certificate.user_id", cascade="all, delete-orphan")
    conversations_as_instructor = relationship("Conversation", back_populates="instructor", foreign_keys="Conversation.instructor_id", cascade="all, delete-orphan")
    conversations_as_student = relationship("Conversation", back_populates="student", foreign_keys="Conversation.student_id", cascade="all, delete-orphan")
    
    # Payments
    subscriptions = relationship("UserSubscription", back_populates="user", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="user", cascade="all, delete-orphan")
    course_purchases = relationship("CoursePurchase", back_populates="user", cascade="all, delete-orphan")
    
    # Notifications
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    
    # Announcements
    announcements = relationship("Announcement", back_populates="author", cascade="all, delete-orphan")
    announcement_views = relationship("AnnouncementView", back_populates="user", cascade="all, delete-orphan")
    
    # Reports
    reports_filed = relationship("Report", back_populates="reporter", foreign_keys="Report.reporter_id", cascade="all, delete-orphan")
    report_comments = relationship("ReportComment", back_populates="author", cascade="all, delete-orphan")
    
    # Messages
    sent_messages = relationship("Message", back_populates="sender", cascade="all, delete-orphan")
    
    # User Activity
    activities = relationship("UserActivity", back_populates="user", cascade="all, delete-orphan")
    sessions = relationship("UserSession", back_populates="user", cascade="all, delete-orphan")

class UserSettings(Base):
    __tablename__ = "user_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Notifications
    notif_daily_streak = Column(Boolean, default=True)
    notif_new_lesson = Column(Boolean, default=True)
    notif_live_session_reminder = Column(Boolean, default=True)
    notif_community_replies = Column(Boolean, default=False)
    notif_achievements = Column(Boolean, default=True)
    
    # Email
    email_weekly_report = Column(Boolean, default=True)
    email_promotions = Column(Boolean, default=False)
    email_instructor_messages = Column(Boolean, default=True)
    
    # Appearance
    theme = Column(String(50), default="dark")
    
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="settings")

class EmailVerification(Base):
    __tablename__ = "email_verifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    otp_code = Column(String(6), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    verified_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="email_verifications")

class PasswordReset(Base):
    __tablename__ = "password_resets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String(255), unique=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="password_resets")

class UserSocialLogin(Base):
    __tablename__ = "user_social_logins"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    provider = Column(String(50), nullable=False)  # google, apple, facebook
    provider_id = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="social_logins")
    
    __table_args__ = (
        UniqueConstraint('provider', 'provider_id', name='uq_social_login_provider'),
    )