# app/scheduler/reminder_processor.py
from sqlalchemy.orm import Session
from sqlalchemy import asc
from typing import List, Optional
from datetime import datetime, timedelta
from app.models.reminders import Reminder, ReminderNotification
from app.models.users import User
from app.notifications.email_service import EmailService
from app.notifications.templates.email_templates import EmailTemplates
from app.notifications.notification_manager import NotificationManager
import logging
import asyncio

logger = logging.getLogger("app.scheduler.reminder_processor")

class ReminderProcessor:
    def __init__(self, db: Session):
        self.db = db
        self.notification_manager = NotificationManager(db)

    def get_due_reminders(self, now: datetime) -> List[Reminder]:
        """Fetch pending reminders where reminder_datetime <= current timestamp."""
        try:
            return self.db.query(Reminder).filter(
                Reminder.status == 'pending',
                Reminder.reminder_datetime <= now
            ).order_by(asc(Reminder.reminder_datetime)).all()
        except Exception as e:
            logger.error(f"Database error fetching due reminders: {str(e)}")
            return []

    async def process_reminder(self, reminder: Reminder, now: datetime) -> bool:
        """Process a single reminder: dispatch email, update notification tracking, and handle recurrence."""
        logger.info(f"Processing due reminder E.g. ID: {reminder.id}, Title: '{reminder.title}'")
        
        # 1. Fetch User
        user = self.db.query(User).filter(User.id == reminder.user_id).first()
        if not user or not user.email:
            logger.warning(f"User not found or email missing for reminder {reminder.id}. E.g. marking completed.")
            reminder.status = 'completed'
            reminder.completed_at = now
            self.db.commit()
            return False

        # 2. Find or create ReminderNotification tracking record
        notification = self.db.query(ReminderNotification).filter(
            ReminderNotification.reminder_id == reminder.id,
            ReminderNotification.status == 'pending'
        ).first()

        if not notification:
            notification = ReminderNotification(
                reminder_id=reminder.id,
                notification_type=reminder.notifications[0].notification_type if reminder.notifications else 'email',
                notification_time=reminder.reminder_datetime,
                status='pending'
            )
            self.db.add(notification)
            self.db.commit()
            self.db.refresh(notification)

        # 3. Construct HTML Email Content E.g. premium dark-themed SaaS template
        html_content = EmailTemplates.get_reminder_alert_template(
            title=reminder.title,
            description=reminder.description,
            reminder_time=reminder.reminder_time.strftime("%I:%M %p"),
            priority=reminder.priority
        )
        plain_text = f"AI Reminder: {reminder.title}\nTime: {reminder.reminder_time}\nDescription: {reminder.description or 'None'}"

        # 4. Dispatch Email
        success = await EmailService.send_html_email(
            to_email=user.email,
            subject=f"AI Reminder: {reminder.title}",
            html_content=html_content,
            plain_text_content=plain_text
        )

        # 5. Update Notification Tracking Status
        if success:
            self.notification_manager.record_notification_sent(notification.id)
        else:
            self.notification_manager.record_notification_failed(notification.id, reason="SMTP dispatch failure E.g. check credentials or network.")

        # 6. Handle Recurrence Engine or One-Time Completion
        try:
            if reminder.repeat_type and reminder.repeat_type.lower() != 'one_time':
                self._schedule_next_occurrence(reminder, now)
            else:
                reminder.status = 'completed'
                reminder.completed_at = now
                logger.info(f"One-time reminder {reminder.id} marked as COMPLETED.")
            
            self.db.commit()
            return success
        except Exception as e:
            self.db.rollback()
            logger.error(f"Failed to update reminder state for {reminder.id}: {str(e)}")
            return False

    def _schedule_next_occurrence(self, reminder: Reminder, now: datetime):
        """Calculate and update the next occurrence for recurring reminders."""
        repeat_type = reminder.repeat_type.lower()
        old_datetime = reminder.reminder_datetime
        
        if repeat_type == 'daily':
            next_date = reminder.reminder_date + timedelta(days=1)
        elif repeat_type == 'weekly':
            next_date = reminder.reminder_date + timedelta(days=7)
        elif repeat_type == 'monthly':
            # Add 30 days as a safe monthly approximation or use calendar
            next_date = reminder.reminder_date + timedelta(days=30)
        elif repeat_type == 'custom':
            # Custom placeholder E.g. default to 1 day or custom interval if stored
            next_date = reminder.reminder_date + timedelta(days=1)
        else:
            next_date = reminder.reminder_date + timedelta(days=1)

        reminder.reminder_date = next_date
        reminder.reminder_datetime = datetime.combine(next_date, reminder.reminder_time)
        reminder.status = 'pending' # Keep active for next cycle
        logger.info(f"Recurring reminder {reminder.id} ({repeat_type}) rescheduled from {old_datetime} to {reminder.reminder_datetime}.")
