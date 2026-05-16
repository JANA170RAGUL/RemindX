import uuid
from datetime import date, time, datetime
from sqlalchemy import String, Boolean, Date, Time, DateTime, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin

class Reminder(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "reminders"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(String)
    reminder_date: Mapped[date] = mapped_column(Date, nullable=False)
    reminder_time: Mapped[time] = mapped_column(Time, nullable=False)
    reminder_datetime: Mapped[datetime] = mapped_column(DateTime, nullable=False, index=True)
    repeat_type: Mapped[str] = mapped_column(String(50), default='one_time')
    priority: Mapped[str] = mapped_column(String(20), default='medium', index=True)
    status: Mapped[str] = mapped_column(String(20), default='pending', index=True)
    category_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("categories.id", ondelete="SET NULL"))
    ai_generated: Mapped[bool] = mapped_column(Boolean, default=False)
    voice_input: Mapped[bool] = mapped_column(Boolean, default=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime)

    user: Mapped["User"] = relationship("User", back_populates="reminders")
    category: Mapped["Category"] = relationship("Category", back_populates="reminders")
    tags: Mapped[list["ReminderTag"]] = relationship("ReminderTag", back_populates="reminder", cascade="all, delete-orphan")
    notifications: Mapped[list["ReminderNotification"]] = relationship("ReminderNotification", back_populates="reminder", cascade="all, delete-orphan")

class ReminderTag(Base, UUIDMixin):
    __tablename__ = "reminder_tags"

    reminder_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("reminders.id", ondelete="CASCADE"), index=True)
    tag_name: Mapped[str] = mapped_column(String(50), nullable=False)

    reminder: Mapped["Reminder"] = relationship("Reminder", back_populates="tags")

class ReminderNotification(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "reminder_notifications"

    reminder_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("reminders.id", ondelete="CASCADE"), index=True)
    notification_type: Mapped[str | None] = mapped_column(String(50))
    notification_time: Mapped[datetime | None] = mapped_column(DateTime)
    status: Mapped[str] = mapped_column(String(20), default='pending', index=True)
    sent_at: Mapped[datetime | None] = mapped_column(DateTime)
    failure_reason: Mapped[str | None] = mapped_column(String)
    retry_count: Mapped[int] = mapped_column(Integer, default=0)

    reminder: Mapped["Reminder"] = relationship("Reminder", back_populates="notifications")
