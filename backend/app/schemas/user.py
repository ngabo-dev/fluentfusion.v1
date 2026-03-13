from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: Optional[str] = "student"

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if len(v.encode('utf-8')) > 72:
            raise ValueError('Password must not exceed 72 bytes when encoded as UTF-8')
        return v  # Must return the value!
    
    @validator('role', pre=True, always=True)
    def validate_role(cls, v):
        if v is None:
            return 'student'
        valid_roles = ['student', 'instructor', 'admin']
        if v not in valid_roles:
            return 'student'
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

    @validator('password')
    def validate_password(cls, v):
        if len(v.encode('utf-8')) > 72:
            raise ValueError('Password must not exceed 72 bytes when encoded as UTF-8')
        return v

class UserResponse(UserBase):
    id: int
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    is_email_verified: bool
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None

# Onboarding
class UserOnboardingCreate(BaseModel):
    native_language_id: int
    learning_language_id: int
    learning_goal: str  # travel, academic, business, conversation
    initial_level: str  # beginner, intermediate, advanced

# Settings
class UserSettingsUpdate(BaseModel):
    notif_daily_streak: Optional[bool] = None
    notif_new_lesson: Optional[bool] = None
    notif_live_session_reminder: Optional[bool] = None
    notif_community_replies: Optional[bool] = None
    notif_achievements: Optional[bool] = None
    email_weekly_report: Optional[bool] = None
    email_promotions: Optional[bool] = None
    email_instructor_messages: Optional[bool] = None
    theme: Optional[str] = None

class UserSettingsResponse(BaseModel):
    notif_daily_streak: bool
    notif_new_lesson: bool
    notif_live_session_reminder: bool
    notif_community_replies: bool
    notif_achievements: bool
    email_weekly_report: bool
    email_promotions: bool
    email_instructor_messages: bool
    theme: str
    
    class Config:
        from_attributes = True

# Email verification
class EmailVerificationRequest(BaseModel):
    email: EmailStr
    code: str

class EmailVerificationSend(BaseModel):
    email: EmailStr

# Password reset
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)

    @validator('new_password')
    def validate_new_password(cls, v):
        if len(v.encode('utf-8')) > 72:
            raise ValueError('Password must not exceed 72 bytes when encoded as UTF-8')
        return v

# Tokens
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # Token expiration in seconds
    user: UserResponse

class RefreshTokenRequest(BaseModel):
    refresh_token: str