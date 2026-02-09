"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# ============ User Schemas ============

class UserCreate(BaseModel):
    """Schema for creating a new user"""
    username: str
    email: EmailStr
    password: str
    user_type: str = "tourist"
    target_language: str = "kinyarwanda"
    native_language: str = "english"

class UserLogin(BaseModel):
    """Schema for user login"""
    username: str
    password: str

class UserResponse(BaseModel):
    """Schema for user response"""
    user_id: str
    username: str
    email: str
    user_type: str
    target_language: str
    native_language: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    """Schema for updating user profile"""
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    target_language: Optional[str] = None
    native_language: Optional[str] = None

# ============ Token Schemas ============

class Token(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# ============ Vocabulary & Phrase Schemas ============

class VocabularyItem(BaseModel):
    """Schema for vocabulary item"""
    word: str
    translation: str
    pronunciation: str
    example: str

class PhraseItem(BaseModel):
    """Schema for phrase item"""
    phrase: str
    translation: str
    pronunciation: str
    context: str

class CulturalNote(BaseModel):
    """Schema for cultural note"""
    note: str

# ============ Exercise Schemas ============

class ExerciseResponse(BaseModel):
    """Schema for exercise response"""
    exercise_id: str
    type: str
    prompt: str
    options: List[str]
    points: int
    
    class Config:
        from_attributes = True

class ExerciseSubmit(BaseModel):
    """Schema for submitting exercise answer"""
    exercise_id: str
    answer: str

class ExerciseResult(BaseModel):
    """Schema for exercise result"""
    exercise_id: str
    correct: bool
    user_answer: str
    correct_answer: str
    explanation: Optional[str] = None
    points_earned: int

# ============ Lesson Schemas ============

class LessonContent(BaseModel):
    """Schema for lesson content"""
    vocabulary: List[VocabularyItem]
    phrases: List[PhraseItem]
    cultural_notes: List[str]
    exercises: List[ExerciseResponse]

class LessonResponse(BaseModel):
    """Schema for lesson response"""
    lesson_id: str
    title: str
    description: str
    difficulty: str
    category: str
    target_language: str
    duration: int
    vocabulary_count: int
    thumbnail: Optional[str] = None
    content: Optional[LessonContent] = None
    
    class Config:
        from_attributes = True

class LessonListResponse(BaseModel):
    """Schema for lesson list response"""
    lessons: List[LessonResponse]
    total: int

# ============ Progress Schemas ============

class LessonProgress(BaseModel):
    """Schema for lesson progress"""
    lesson_id: str
    title: str
    category: str
    difficulty: str
    score: float
    completed: bool
    completed_at: Optional[datetime] = None
    time_spent: int

class UserStats(BaseModel):
    """Schema for user statistics"""
    total_lessons_completed: int
    total_points: int
    current_streak: int
    average_score: float
    vocabulary_learned: int
    badges_earned: int

class ProgressResponse(BaseModel):
    """Schema for progress response"""
    lessons: List[LessonProgress]
    stats: UserStats

class QuizSubmit(BaseModel):
    """Schema for submitting quiz answers"""
    lesson_id: str
    answers: List[ExerciseSubmit]
    time_spent: int = 0

class QuizResult(BaseModel):
    """Schema for quiz result"""
    lesson_id: str
    score: float
    total_points: int
    earned_points: int
    completed: bool
    results: List[ExerciseResult]
    new_badge_earned: Optional[str] = None

# ============ Badge Schemas ============

class BadgeResponse(BaseModel):
    """Schema for badge response"""
    badge_id: str
    name: str
    description: str
    icon: str
    earned_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# ============ Recommendation Schemas ============

class RecommendationResponse(BaseModel):
    """Schema for lesson recommendations"""
    recommended_lessons: List[LessonResponse]
    reason: str
