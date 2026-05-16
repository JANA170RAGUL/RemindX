import uuid
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin

class Category(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "categories"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    color: Mapped[str | None] = mapped_column(String(30))

    user: Mapped["User"] = relationship("User", back_populates="categories")
    reminders: Mapped[list["Reminder"]] = relationship("Reminder", back_populates="category", cascade="all, delete-orphan")
