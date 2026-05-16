from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, date, time
from typing import Tuple, List, Optional
from app.repositories.reminder_repository import ReminderRepository
from app.schemas.reminders import ReminderCreate, ReminderUpdate
from app.models.reminders import Reminder
from app.exceptions.custom import NotFoundException, ValidationException

class ReminderService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = ReminderRepository(db)

    def create_reminder(self, user_id: UUID, obj_in: ReminderCreate) -> Reminder:
        try:
            reminder_datetime = datetime.combine(obj_in.reminder_date, obj_in.reminder_time)
        except Exception:
            raise ValidationException("Invalid date or time format")
            
        if reminder_datetime < datetime.now():
            raise ValidationException("Reminder datetime cannot be in the past")

        return self.repository.create(user_id, obj_in, reminder_datetime)

    def get_reminder(self, reminder_id: UUID, user_id: UUID) -> Reminder:
        reminder = self.repository.get(reminder_id, user_id)
        if not reminder:
            raise NotFoundException("Reminder not found")
        return reminder

    def get_reminders(
        self, 
        user_id: UUID, 
        page: int, 
        limit: int,
        search: Optional[str],
        filter_type: Optional[str],
        sort_by: Optional[str]
    ) -> Tuple[List[Reminder], int]:
        skip = (page - 1) * limit
        return self.repository.get_multi(
            user_id=user_id, 
            skip=skip, 
            limit=limit,
            search=search,
            filter_type=filter_type,
            sort_by=sort_by
        )

    def update_reminder(self, reminder_id: UUID, user_id: UUID, obj_in: ReminderUpdate) -> Reminder:
        reminder = self.get_reminder(reminder_id, user_id)
        
        update_data = obj_in.dict(exclude_unset=True)
        
        # Calculate new datetime if date or time is updated
        new_date = update_data.get('reminder_date', reminder.reminder_date)
        new_time = update_data.get('reminder_time', reminder.reminder_time)
        if 'reminder_date' in update_data or 'reminder_time' in update_data:
            update_data['reminder_datetime'] = datetime.combine(new_date, new_time)
            
        # Tags update logic is omitted for brevity, can be expanded
        if 'tags' in update_data:
            del update_data['tags']
            
        return self.repository.update(reminder, update_data)

    def delete_reminder(self, reminder_id: UUID, user_id: UUID) -> None:
        reminder = self.get_reminder(reminder_id, user_id)
        self.repository.delete(reminder)
        
    def complete_reminder(self, reminder_id: UUID, user_id: UUID) -> Reminder:
        reminder = self.get_reminder(reminder_id, user_id)
        if reminder.status == "completed":
            raise ValidationException("Reminder is already completed")
            
        return self.repository.update(reminder, {"status": "completed", "completed_at": datetime.now()})
