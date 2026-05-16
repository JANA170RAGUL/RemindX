import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin

class Event(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "events"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(String)
    start_datetime: Mapped[datetime] = mapped_column(DateTime, nullable=False, index=True)
    end_datetime: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    meeting_link: Mapped[str | None] = mapped_column(String)
    event_color: Mapped[str | None] = mapped_column(String(30))
    repeat_type: Mapped[str | None] = mapped_column(String(50))
    ai_scheduled: Mapped[bool] = mapped_column(Boolean, default=False)

    user: Mapped["User"] = relationship("User", back_populates="events")
    attendees: Mapped[list["EventAttendee"]] = relationship("EventAttendee", back_populates="event", cascade="all, delete-orphan")

class EventAttendee(Base, UUIDMixin):
    __tablename__ = "event_attendees"

    event_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("events.id", ondelete="CASCADE"), index=True)
    attendee_email: Mapped[str | None] = mapped_column(String(255))

    event: Mapped["Event"] = relationship("Event", back_populates="attendees")
