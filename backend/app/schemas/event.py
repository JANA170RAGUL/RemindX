from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_datetime: datetime
    end_datetime: datetime
    meeting_link: Optional[str] = None
    event_color: Optional[str] = None
    repeat_type: Optional[str] = None

class EventResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    start_datetime: datetime
    end_datetime: datetime
    meeting_link: Optional[str]
    event_color: Optional[str]
    repeat_type: Optional[str]
    ai_scheduled: bool

    class Config:
        from_attributes = True
