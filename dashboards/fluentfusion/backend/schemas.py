from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any, Dict
from datetime import datetime
from models import UserRole, PulseState, CourseStatus


# ─── Auth ───────────────────────────────────────────────
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: "UserOut"

class RefreshRequest(BaseModel):
    refresh_token: str


# ─── User ───────────────────────────────────────────────
class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: UserRole
    avatar_initials: Optional[str]
    is_active: bool
    is_verified: bool
    bio: Optional[str]
    country: Optional[str]
    rating: Optional[float]
    total_students: Optional[int]
    total_revenue: Optional[float]
    created_at: datetime
    last_active_at: Optional[datetime]
    is_featured: Optional[bool]
    payout_email: Optional[str]

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role: UserRole = UserRole.student

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    country: Optional[str] = None
    payout_email: Optional[str] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None
    is_featured: Optional[bool] = None

class UserListResponse(BaseModel):
    items: List[UserOut]
    total: int
    page: int
    per_page: int


# ─── Course ─────────────────────────────────────────────
class CourseOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    language: Optional[str]
    level: Optional[str]
    status: CourseStatus
    instructor_id: int
    instructor_name: Optional[str] = None
    price: float
    is_free: bool
    total_lessons: int
    total_duration_minutes: int
    rating: float
    total_reviews: int
    total_enrollments: int
    rejection_reason: Optional[str]
    created_at: datetime
    published_at: Optional[datetime]

    class Config:
        from_attributes = True

class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    language: Optional[str] = None
    level: Optional[str] = None
    price: float = 0.0
    is_free: bool = True

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    language: Optional[str] = None
    level: Optional[str] = None
    status: Optional[CourseStatus] = None
    price: Optional[float] = None
    is_free: Optional[bool] = None
    rejection_reason: Optional[str] = None

class CourseListResponse(BaseModel):
    items: List[CourseOut]
    total: int


# ─── Lesson ─────────────────────────────────────────────
class LessonOut(BaseModel):
    id: int
    course_id: int
    title: str
    description: Optional[str]
    video_url: Optional[str]
    duration_minutes: int
    order_index: int
    attendees: int
    recorded_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True

class LessonCreate(BaseModel):
    title: str
    description: Optional[str] = None
    video_url: Optional[str] = None
    duration_minutes: int = 0
    order_index: int = 0


# ─── Quiz ───────────────────────────────────────────────
class QuizOut(BaseModel):
    id: int
    course_id: int
    title: str
    description: Optional[str]
    questions: Optional[List[Dict[str, Any]]]
    total_questions: int
    total_attempts: int
    avg_score: float
    created_at: datetime

    class Config:
        from_attributes = True

class QuizCreate(BaseModel):
    title: str
    description: Optional[str] = None
    questions: List[Dict[str, Any]] = []


# ─── Enrollment ─────────────────────────────────────────
class EnrollmentOut(BaseModel):
    id: int
    student_id: int
    course_id: int
    progress_percent: float
    xp: int
    enrolled_at: datetime
    last_active_at: Optional[datetime]
    student_name: Optional[str] = None
    student_email: Optional[str] = None
    course_title: Optional[str] = None
    pulse_state: Optional[str] = None

    class Config:
        from_attributes = True


# ─── Pulse ──────────────────────────────────────────────
class PulseRecordOut(BaseModel):
    id: int
    user_id: int
    state: PulseState
    score: Optional[float]
    factors: Optional[Dict[str, Any]]
    recorded_at: datetime

    class Config:
        from_attributes = True

class PulseStats(BaseModel):
    thriving: int
    coasting: int
    struggling: int
    burning_out: int
    disengaged: int
    total: int


# ─── Message ────────────────────────────────────────────
class MessageOut(BaseModel):
    id: int
    sender_id: int
    recipient_id: int
    subject: Optional[str]
    body: str
    is_read: bool
    created_at: datetime
    sender_name: Optional[str] = None

    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    recipient_id: int
    subject: Optional[str] = None
    body: str


# ─── Notification ───────────────────────────────────────
class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    target_role: Optional[str]
    is_email: bool
    is_push: bool
    recipients_count: int
    read_rate: float
    sent_at: datetime

    class Config:
        from_attributes = True

class NotificationCreate(BaseModel):
    title: str
    message: str
    target_role: str = "all"
    is_email: bool = False
    is_push: bool = False


# ─── Payout ─────────────────────────────────────────────
class PayoutOut(BaseModel):
    id: int
    instructor_id: int
    amount: float
    status: str
    period_start: Optional[datetime]
    period_end: Optional[datetime]
    processed_at: Optional[datetime]
    notes: Optional[str]
    created_at: datetime
    instructor_name: Optional[str] = None

    class Config:
        from_attributes = True

class PayoutUpdate(BaseModel):
    status: str
    notes: Optional[str] = None


# ─── AuditLog ───────────────────────────────────────────
class AuditLogOut(BaseModel):
    id: int
    admin_id: Optional[int]
    action_type: str
    description: str
    target_id: Optional[int]
    target_type: Optional[str]
    extra_data: Optional[Dict[str, Any]]
    created_at: datetime
    admin_name: Optional[str] = None

    class Config:
        from_attributes = True


# ─── Settings ───────────────────────────────────────────
class SettingOut(BaseModel):
    key: str
    value: Optional[str]
    category: str

    class Config:
        from_attributes = True

class SettingUpdate(BaseModel):
    value: str


# ─── Dashboard stats ────────────────────────────────────
class AdminDashboardStats(BaseModel):
    total_users: int
    total_students: int
    total_instructors: int
    total_courses: int
    active_courses: int
    pending_courses: int
    total_revenue: float
    monthly_revenue: float
    total_enrollments: int
    active_learners: int

class InstructorDashboardStats(BaseModel):
    total_students: int
    total_courses: int
    total_revenue: float
    monthly_revenue: float
    avg_rating: float
    total_lessons: int
    pulse_stats: PulseStats


# ─── Live Session ───────────────────────────────────────
class LiveSessionOut(BaseModel):
    id: int
    course_id: int
    instructor_id: int
    title: str
    scheduled_at: Optional[datetime]
    duration_minutes: int
    max_participants: int
    current_participants: int
    status: str
    room_id: Optional[str]
    created_at: datetime
    course_title: Optional[str] = None

    class Config:
        from_attributes = True

class LiveSessionCreate(BaseModel):
    course_id: int
    title: str
    scheduled_at: Optional[datetime] = None
    duration_minutes: int = 60
    max_participants: int = 100


TokenResponse.model_rebuild()
