from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Text,
    ForeignKey, Enum as SAEnum, JSON, BigInteger
)
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func
import enum

Base = declarative_base()


class UserRole(str, enum.Enum):
    student = "student"
    instructor = "instructor"
    admin = "admin"


class PulseState(str, enum.Enum):
    thriving = "thriving"
    coasting = "coasting"
    struggling = "struggling"
    burning_out = "burning_out"
    disengaged = "disengaged"


class CourseStatus(str, enum.Enum):
    draft = "draft"
    pending = "pending"
    active = "active"
    rejected = "rejected"
    archived = "archived"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SAEnum(UserRole), default=UserRole.student, nullable=False)
    avatar_initials = Column(String(4))
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    bio = Column(Text)
    country = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_active_at = Column(DateTime(timezone=True))

    # Instructor fields
    payout_email = Column(String)
    rating = Column(Float, default=0.0)
    total_students = Column(Integer, default=0)
    total_revenue = Column(Float, default=0.0)
    is_featured = Column(Boolean, default=False)

    # Relationships
    courses = relationship("Course", back_populates="instructor", foreign_keys="Course.instructor_id")
    enrollments = relationship("Enrollment", back_populates="student")
    pulse_records = relationship("PulseRecord", back_populates="user")
    sent_messages = relationship("Message", back_populates="sender", foreign_keys="Message.sender_id")
    notifications = relationship("Notification", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="admin")
    payouts = relationship("Payout", back_populates="instructor")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    language = Column(String)
    level = Column(String)  # A1, A2, B1, B2, C1, C2, IELTS, etc.
    status = Column(SAEnum(CourseStatus), default=CourseStatus.draft)
    instructor_id = Column(Integer, ForeignKey("users.id"))
    thumbnail_url = Column(String)
    price = Column(Float, default=0.0)
    is_free = Column(Boolean, default=False)
    total_lessons = Column(Integer, default=0)
    total_duration_minutes = Column(Integer, default=0)
    rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    total_enrollments = Column(Integer, default=0)
    rejection_reason = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    published_at = Column(DateTime(timezone=True))

    instructor = relationship("User", back_populates="courses", foreign_keys=[instructor_id])
    enrollments = relationship("Enrollment", back_populates="course")
    lessons = relationship("Lesson", back_populates="course")
    quizzes = relationship("Quiz", back_populates="course")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    title = Column(String, nullable=False)
    description = Column(Text)
    video_url = Column(String)
    duration_minutes = Column(Integer, default=0)
    order_index = Column(Integer, default=0)
    attendees = Column(Integer, default=0)
    recorded_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    course = relationship("Course", back_populates="lessons")


class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    progress_percent = Column(Float, default=0.0)
    xp = Column(Integer, default=0)
    enrolled_at = Column(DateTime(timezone=True), server_default=func.now())
    last_active_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))

    student = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")


class PulseRecord(Base):
    __tablename__ = "pulse_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    state = Column(SAEnum(PulseState), nullable=False)
    score = Column(Float)
    factors = Column(JSON)  # dict of contributing factors
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="pulse_records")


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    title = Column(String, nullable=False)
    description = Column(Text)
    questions = Column(JSON)  # list of question objects
    total_questions = Column(Integer, default=0)
    total_attempts = Column(Integer, default=0)
    avg_score = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    course = relationship("Course", back_populates="quizzes")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    recipient_id = Column(Integer, ForeignKey("users.id"))
    subject = Column(String)
    body = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    sender = relationship("User", back_populates="sent_messages", foreign_keys=[sender_id])


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # null = all users
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    target_role = Column(String)  # all, student, instructor
    is_email = Column(Boolean, default=False)
    is_push = Column(Boolean, default=False)
    recipients_count = Column(Integer, default=0)
    read_rate = Column(Float, default=0.0)
    sent_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="notifications")


class Payout(Base):
    __tablename__ = "payouts"

    id = Column(Integer, primary_key=True, index=True)
    instructor_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float, nullable=False)
    status = Column(String, default="pending")  # pending, approved, rejected
    period_start = Column(DateTime(timezone=True))
    period_end = Column(DateTime(timezone=True))
    processed_at = Column(DateTime(timezone=True))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    instructor = relationship("User", back_populates="payouts")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action_type = Column(String, nullable=False)  # USER, COURSE, FINANCE, SYSTEM
    description = Column(Text, nullable=False)
    target_id = Column(Integer)
    target_type = Column(String)
    extra_data = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    admin = relationship("User", back_populates="audit_logs")


class PlatformSetting(Base):
    __tablename__ = "platform_settings"

    id = Column(Integer, primary_key=True)
    key = Column(String, unique=True, nullable=False)
    value = Column(Text)
    category = Column(String, default="general")
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class LiveSession(Base):
    __tablename__ = "live_sessions"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    instructor_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    scheduled_at = Column(DateTime(timezone=True))
    duration_minutes = Column(Integer, default=60)
    max_participants = Column(Integer, default=100)
    current_participants = Column(Integer, default=0)
    status = Column(String, default="scheduled")  # scheduled, live, ended
    room_id = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
