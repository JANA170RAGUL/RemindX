from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    full_name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    avatar_url = Column(String)
    timezone = Column(String(100), default='Asia/Kolkata')
    theme = Column(String(20), default='dark')
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=text("NOW()"))
    updated_at = Column(DateTime, server_default=text("NOW()"))

class UserSettings(Base):
    __tablename__ = "user_settings"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    email_notifications = Column(Boolean, default=True)
    push_notifications = Column(Boolean, default=True)
    telegram_notifications = Column(Boolean, default=False)
    timezone = Column(String(100))
    theme = Column(String(20), default='dark')
    created_at = Column(DateTime, server_default=text("NOW()"))
