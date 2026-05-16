from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from uuid import UUID
from datetime import date, time, datetime

class ReminderBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    reminder_date: date
    reminder_time: time
    repeat_type: Optional[str] = "one_time"
    priority: Optional[str] = "medium"
    category_id: Optional[UUID] = None
    ai_generated: Optional[bool] = False
    voice_input: Optional[bool] = False
    tags: Optional[List[str]] = []
    notify_type: Optional[str] = "email"

class ReminderCreate(ReminderBase):
    pass

class ReminderUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    reminder_date: Optional[date] = None
    reminder_time: Optional[time] = None
    repeat_type: Optional[str] = None
    priority: Optional[str] = None
    category_id: Optional[UUID] = None
    tags: Optional[List[str]] = None

class ReminderResponse(ReminderBase):
    id: UUID
    user_id: UUID
    reminder_datetime: datetime
    status: str
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    @field_validator('tags', mode='before')
    def parse_tags(cls, v):
        if not v:
            return []
        return [tag.tag_name if hasattr(tag, 'tag_name') else str(tag) for tag in v]

    class Config:
        from_attributes = True

class ReminderListResponse(BaseModel):
    total: int
    page: int
    limit: int
    data: List[ReminderResponse]
