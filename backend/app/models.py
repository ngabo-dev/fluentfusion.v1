from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from datetime import datetime
import enum, os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

_ssl_args = {}
_ca = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ca.pem")
if os.path.exists(_ca):
    import ssl
    _ctx = ssl.create_default_context(cafile=_ca)
    _ssl_args = {"connect_args": {"sslrootcert": _ca, "sslmode": "require"}}

engine = create_engine(DATABASE_URL, **_ssl_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class RoleEnum(str, enum.Enum):
    student = "student"
    instructor = "instructor"
    admin = "admin"
    super_admin = "super_admin"

class StatusEnum(str, enum.Enum):
    active = "active"
    banned = "banned"
    pending = "pending"

class CourseStatusEnum(str, enum.Enum):
    draft = "draft"
    pending = "pending"
    approved = "approved"
    published = "published"
    rejected = "rejected"

class PulseStateEnum(str, enum.Enum):
    thriving = "thriving"
    coasting = "coasting"
    struggling = "struggling"
    burning_out = "burning_out"
    disengaged = "disengaged"

class PayoutStatusEnum(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    paid = "paid"
    rejected = "rejected"

class SessionStatusEnum(str, enum.Enum):
    scheduled = "scheduled"
    live = "live"
    completed = "completed"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.student)
    status = Column(Enum(StatusEnum), default=StatusEnum.active)
    avatar_initials = Column(String(4))
    bio = Column(Text)
    is_verified = Column(Boolean, default=False)
    otp_code = Column(String(6), nullable=True)
    otp_expiry = Column(DateTime, nullable=True)
    reset_token = Column(String, nullable=True)
    reset_token_expiry = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_active = Column(DateTime, default=datetime.utcnow)
    courses = relationship("Course", back_populates="instructor", foreign_keys="Course.instructor_id")
    enrollments = relationship("Enrollment", back_populates="student")
    pulse_state = Column(Enum(PulseStateEnum), default=PulseStateEnum.coasting)
    xp = Column(Integer, default=0)
    first_login = Column(Boolean, default=True)
    avatar_url = Column(String, nullable=True)
    pending_email = Column(String, nullable=True)
    email_change_token = Column(String, nullable=True)
    email_change_expiry = Column(DateTime, nullable=True)

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    subtitle = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=True)
    language = Column(String)
    level = Column(String)
    flag_emoji = Column(String(4))
    thumbnail_url = Column(String, nullable=True)
    intro_video_url = Column(String, nullable=True)
    status = Column(Enum(CourseStatusEnum), default=CourseStatusEnum.draft)
    instructor_id = Column(Integer, ForeignKey("users.id"))
    price = Column(Float, default=49.99)
    is_free = Column(Boolean, default=False)
    what_you_learn = Column(Text, nullable=True)   # newline-separated
    requirements = Column(Text, nullable=True)
    target_audience = Column(Text, nullable=True)
    rejection_feedback = Column(Text, nullable=True)
    admin_notes = Column(Text, nullable=True)
    submitted_at = Column(DateTime, nullable=True)
    approved_at = Column(DateTime, nullable=True)
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    instructor = relationship("User", back_populates="courses", foreign_keys=[instructor_id])
    sections = relationship("CourseSection", back_populates="course", order_by="CourseSection.order", cascade="all, delete-orphan")
    lessons = relationship("Lesson", back_populates="course")
    enrollments = relationship("Enrollment", back_populates="course")
    sessions = relationship("LiveSession", back_populates="course")
    quizzes = relationship("Quiz", back_populates="course")

class CourseSection(Base):
    __tablename__ = "course_sections"
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    order = Column(Integer, default=0)
    course = relationship("Course", back_populates="sections")
    lessons = relationship("Lesson", back_populates="section", order_by="Lesson.order", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    section_id = Column(Integer, ForeignKey("course_sections.id"), nullable=True)
    title = Column(String)
    lesson_type = Column(String, default="video")  # video | text | pdf | quiz
    video_url = Column(String, nullable=True)
    content = Column(Text, nullable=True)          # for text lessons
    resource_url = Column(String, nullable=True)   # for PDFs
    duration_min = Column(Integer, default=15)
    description = Column(Text)
    order = Column(Integer, default=0)
    is_preview = Column(Boolean, default=False)
    course = relationship("Course", back_populates="lessons")
    section = relationship("CourseSection", back_populates="lessons")

class Enrollment(Base):
    __tablename__ = "enrollments"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    completion_pct = Column(Float, default=0.0)
    enrolled_at = Column(DateTime, default=datetime.utcnow)
    student = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")

class LiveSession(Base):
    __tablename__ = "live_sessions"
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    title = Column(String)
    scheduled_at = Column(DateTime)
    duration_min = Column(Integer, default=60)
    attendees = Column(Integer, default=0)
    status = Column(Enum(SessionStatusEnum), default=SessionStatusEnum.scheduled)
    recording_url = Column(String)
    course = relationship("Course", back_populates="sessions")

class Quiz(Base):
    __tablename__ = "quizzes"
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    title = Column(String)
    question_count = Column(Integer, default=10)
    avg_score = Column(Float, default=75.0)
    attempts = Column(Integer, default=0)
    course = relationship("Course", back_populates="quizzes")

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    amount = Column(Float)
    method = Column(String, default="Card")
    status = Column(String, default="completed")
    created_at = Column(DateTime, default=datetime.utcnow)

class Payout(Base):
    __tablename__ = "payouts"
    id = Column(Integer, primary_key=True, index=True)
    instructor_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    status = Column(Enum(PayoutStatusEnum), default=PayoutStatusEnum.pending)
    reference = Column(String)
    requested_at = Column(DateTime, default=datetime.utcnow)
    paid_at = Column(DateTime)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    message = Column(Text)
    target = Column(String, default="all")
    sent_at = Column(DateTime, default=datetime.utcnow)
    recipients = Column(Integer, default=0)
    read_rate = Column(Float, default=0.0)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    allow_replies = Column(Boolean, default=False)
    # 'notification' = system-generated event alert | 'announcement' = human-composed broadcast
    notif_type = Column(String, default="announcement")
    link = Column(String, nullable=True)   # e.g. "/dashboard/quizzes" — rendered as clickable link

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("users.id"))
    action_type = Column(String)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    reporter_id = Column(Integer, ForeignKey("users.id"))
    report_type = Column(String)
    content = Column(Text)
    status = Column(String, default="open")
    created_at = Column(DateTime, default=datetime.utcnow)

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    receiver_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    attachment_url = Column(String, nullable=True)
    attachment_type = Column(String, nullable=True)  # image | audio | document
    attachment_name = Column(String, nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    rating = Column(Integer)
    comment = Column(Text)
    reply = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class MonthlyRevenue(Base):
    __tablename__ = "monthly_revenue"
    id = Column(Integer, primary_key=True, index=True)
    year = Column(Integer)
    month = Column(Integer)
    gross = Column(Float, default=0)
    net = Column(Float, default=0)
    instructor_id = Column(Integer, ForeignKey("users.id"), nullable=True)

class NotificationRead(Base):
    __tablename__ = "notification_reads"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    notification_id = Column(Integer, ForeignKey("notifications.id"), nullable=False)
    read_at = Column(DateTime, default=datetime.utcnow)

class NotificationReaction(Base):
    __tablename__ = "notification_reactions"
    id = Column(Integer, primary_key=True, index=True)
    notification_id = Column(Integer, ForeignKey("notifications.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    emoji = Column(String(8), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class NotificationReply(Base):
    __tablename__ = "notification_replies"
    id = Column(Integer, primary_key=True, index=True)
    notification_id = Column(Integer, ForeignKey("notifications.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class MeetingStatusEnum(str, enum.Enum):
    scheduled = "scheduled"
    live = "live"
    ended = "ended"
    cancelled = "cancelled"

class MeetingAudienceEnum(str, enum.Enum):
    individual = "individual"
    course = "course"
    all_students = "all_students"
    all_instructors = "all_instructors"
    everyone = "everyone"

class Meeting(Base):
    __tablename__ = "meetings"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    host_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    audience = Column(Enum(MeetingAudienceEnum), default=MeetingAudienceEnum.individual)
    scheduled_at = Column(DateTime, nullable=False)
    duration_min = Column(Integer, default=60)
    status = Column(Enum(MeetingStatusEnum), default=MeetingStatusEnum.scheduled)
    room_id = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    invites = relationship("MeetingInvite", back_populates="meeting")

class MeetingInvite(Base):
    __tablename__ = "meeting_invites"
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    accepted = Column(Boolean, default=False)
    notified_email = Column(Boolean, default=False)
    meeting = relationship("Meeting", back_populates="invites")
