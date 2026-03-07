from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None
    language_id: int
    level: Optional[str] = None
    goal: Optional[str] = None
    price_usd: Optional[Decimal] = 0.00
    is_free: Optional[bool] = False
    thumbnail_url: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    level: Optional[str] = None
    goal: Optional[str] = None
    price_usd: Optional[Decimal] = None
    is_free: Optional[bool] = None
    thumbnail_url: Optional[str] = None
    is_published: Optional[bool] = None

class CourseResponse(CourseBase):
    id: int
    instructor_id: int
    slug: str
    is_published: bool
    approval_status: str
    has_certificate: bool
    has_offline_access: bool
    total_duration_min: int
    total_lessons: int
    total_enrollments: int
    avg_rating: Decimal
    rating_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Nested
    instructor_name: Optional[str] = None
    language_name: Optional[str] = None
    
    class Config:
        from_attributes = True

class CourseListResponse(BaseModel):
    courses: List[CourseResponse]
    total: int
    page: int
    pages: int