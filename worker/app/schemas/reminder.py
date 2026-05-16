from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import date, time, datetime

class ReminderCreate(BaseModel):
    title: str
    description: Optional[str] = None
    reminder_date: date
    reminder_time: time
    repeat_type: Optional[str] = 'one_time'
    priority: Optional[str] = 'medium'
    category_id: Optional[UUID] = None

class ReminderResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    reminder_date: date
    reminder_time: time
    reminder_datetime: datetime
    repeat_type: str
    priority: str
    status: str

    class Config:
        from_attributes = True
