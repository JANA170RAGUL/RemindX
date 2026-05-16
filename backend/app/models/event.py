from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base

class Event(Base):
    __tablename__ = "events"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String(255), nullable=False)
    description = Column(String)
    start_datetime = Column(DateTime, nullable=False)
    end_datetime = Column(DateTime, nullable=False)
    meeting_link = Column(String)
    event_color = Column(String(30))
    repeat_type = Column(String(50))
    ai_scheduled = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=text("NOW()"))
    updated_at = Column(DateTime, server_default=text("NOW()"))

class EventAttendee(Base):
    __tablename__ = "event_attendees"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id", ondelete="CASCADE"))
    attendee_email = Column(String(255))
