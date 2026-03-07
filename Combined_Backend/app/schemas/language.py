from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LanguageBase(BaseModel):
    code: str
    name: str
    native_name: Optional[str] = None
    flag_emoji: Optional[str] = None

class LanguageResponse(LanguageBase):
    id: int
    learner_count: int
    is_active: bool
    
    class Config:
        from_attributes = True

class UserLanguageResponse(BaseModel):
    id: int
    language: LanguageResponse
    type: str  # native, learning
    level: Optional[str] = None
    fluency_pct: int
    
    class Config:
        from_attributes = True