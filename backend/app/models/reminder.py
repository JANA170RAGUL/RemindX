from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Date, Time, text
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base

class Reminder(Base):
    __tablename__ = "reminders"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String(255), nullable=False)
    description = Column(String)
    reminder_date = Column(Date, nullable=False)
    reminder_time = Column(Time, nullable=False)
    reminder_datetime = Column(DateTime, nullable=False, index=True)
    repeat_type = Column(String(50), default='one_time')
    priority = Column(String(20), default='medium')
    status = Column(String(20), default='pending')
    category_id = Column(UUID(as_uuid=True))
    ai_generated = Column(Boolean, default=False)
    voice_input = Column(Boolean, default=False)
    completed_at = Column(DateTime)
    created_at = Column(DateTime, server_default=text("NOW()"))
    updated_at = Column(DateTime, server_default=text("NOW()"))

class ReminderTag(Base):
    __tablename__ = "reminder_tags"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    reminder_id = Column(UUID(as_uuid=True), ForeignKey("reminders.id", ondelete="CASCADE"))
    tag_name = Column(String(50), nullable=False)

class ReminderNotification(Base):
    __tablename__ = "reminder_notifications"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    reminder_id = Column(UUID(as_uuid=True), ForeignKey("reminders.id", ondelete="CASCADE"))
    notification_type = Column(String(50))
    notification_time = Column(DateTime)
    status = Column(String(20), default='pending', index=True)
    sent_at = Column(DateTime)
    created_at = Column(DateTime, server_default=text("NOW()"))

class Category(Base):
    __tablename__ = "categories"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    name = Column(String(100), nullable=False)
    color = Column(String(30))
    created_at = Column(DateTime, server_default=text("NOW()"))
