import uuid
from datetime import date
from sqlalchemy import Float, Integer, Date, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin

class Analytics(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "analytics"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True)
    completed_tasks: Mapped[int] = mapped_column(Integer, default=0)
    missed_tasks: Mapped[int] = mapped_column(Integer, default=0)
    productivity_score: Mapped[float] = mapped_column(Float, default=0)
    tracked_date: Mapped[date | None] = mapped_column(Date)

    user: Mapped["User"] = relationship("User", back_populates="analytics")

class AISuggestion(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "ai_suggestions"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True)
    input_text: Mapped[str | None] = mapped_column(String)
    generated_schedule: Mapped[dict | None] = mapped_column(JSONB)
    confidence_score: Mapped[float | None] = mapped_column(Float)

    user: Mapped["User"] = relationship("User", back_populates="ai_suggestions")
