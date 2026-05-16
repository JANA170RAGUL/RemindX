from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc, asc
from typing import List, Optional, Tuple
from uuid import UUID
from datetime import datetime, timedelta, date, time
from app.models.reminders import Reminder, ReminderTag, ReminderNotification
from app.schemas.reminders import ReminderCreate, ReminderUpdate

class ReminderRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: UUID, obj_in: ReminderCreate, reminder_datetime: datetime) -> Reminder:
        db_obj = Reminder(
            user_id=user_id,
            title=obj_in.title,
            description=obj_in.description,
            reminder_date=obj_in.reminder_date,
            reminder_time=obj_in.reminder_time,
            reminder_datetime=reminder_datetime,
            repeat_type=obj_in.repeat_type,
            priority=obj_in.priority,
            category_id=obj_in.category_id,
            ai_generated=obj_in.ai_generated,
            voice_input=obj_in.voice_input,
            status="pending"
        )
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        
        if obj_in.tags:
            for tag_name in obj_in.tags:
                tag = ReminderTag(reminder_id=db_obj.id, tag_name=tag_name)
                self.db.add(tag)
            self.db.commit()
            
        notification = ReminderNotification(
            reminder_id=db_obj.id,
            notification_type=obj_in.notify_type,
            notification_time=reminder_datetime,
            status="pending"
        )
        self.db.add(notification)
        self.db.commit()
            
        return db_obj

    def get(self, reminder_id: UUID, user_id: UUID) -> Optional[Reminder]:
        return self.db.query(Reminder).filter(Reminder.id == reminder_id, Reminder.user_id == user_id).first()

    def get_multi(
        self, 
        user_id: UUID, 
        skip: int = 0, 
        limit: int = 10,
        search: Optional[str] = None,
        filter_type: Optional[str] = None,
        sort_by: Optional[str] = "upcoming"
    ) -> Tuple[List[Reminder], int]:
        
        query = self.db.query(Reminder).filter(Reminder.user_id == user_id)
        
        # Search
        if search:
            search_filter = or_(
                Reminder.title.ilike(f"%{search}%"),
                Reminder.description.ilike(f"%{search}%"),
                Reminder.tags.any(ReminderTag.tag_name.ilike(f"%{search}%"))
            )
            query = query.filter(search_filter)
            
        # Filtering
        today = date.today()
        if filter_type == "today":
            query = query.filter(Reminder.reminder_date == today)
        elif filter_type == "tomorrow":
            query = query.filter(Reminder.reminder_date == today + timedelta(days=1))
        elif filter_type == "this_week":
            end_of_week = today + timedelta(days=7)
            query = query.filter(Reminder.reminder_date >= today, Reminder.reminder_date <= end_of_week)
        elif filter_type == "completed":
            query = query.filter(Reminder.status == "completed")
        elif filter_type == "pending":
            query = query.filter(Reminder.status == "pending")
        elif filter_type == "high_priority":
            query = query.filter(Reminder.priority == "high")
            
        # Sorting
        if sort_by == "upcoming":
            query = query.order_by(asc(Reminder.reminder_datetime))
        elif sort_by == "newest":
            query = query.order_by(desc(Reminder.created_at))
        elif sort_by == "oldest":
            query = query.order_by(asc(Reminder.created_at))
        elif sort_by == "priority":
            # high > medium > low
            query = query.order_by(desc(Reminder.priority))
            
        total = query.count()
        reminders = query.offset(skip).limit(limit).all()
        return reminders, total

    def update(self, db_obj: Reminder, obj_in: dict) -> Reminder:
        for field in obj_in:
            if hasattr(db_obj, field):
                setattr(db_obj, field, obj_in[field])
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def delete(self, db_obj: Reminder) -> None:
        self.db.delete(db_obj)
        self.db.commit()
