from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class LessonBase(BaseModel):
    title: str
    description: Optional[str] = None
    video_url: Optional[str] = None
    video_duration_sec: Optional[int] = 0
    is_free_preview: Optional[bool] = False
    xp_reward: Optional[int] = 50

class LessonCreate(LessonBase):
    unit_id: int
    order_index: int

class LessonResponse(LessonBase):
    id: int
    unit_id: int
    course_id: int
    order_index: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class LessonDetailResponse(LessonResponse):
    transcript: Optional[str] = None
    vocabulary: List[dict] = []  # Simplified vocabulary list

class LessonTranscriptSegment(BaseModel):
    id: int
    start_sec: float
    end_sec: float
    text: str
    order_index: int
    
    class Config:
        from_attributes = True

class LessonVocabularyItem(BaseModel):
    id: int
    word: str
    translation: str
    phonetic: Optional[str] = None
    example_usage: Optional[str] = None
    
    class Config:
        from_attributes = True

class LessonCompleteRequest(BaseModel):
    time_spent_sec: int
    notes: Optional[str] = None