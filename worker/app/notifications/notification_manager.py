# app/notifications/notification_manager.py
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime
from typing import Optional, List
from app.models.reminders import ReminderNotification
import logging

logger = logging.getLogger("app.notifications.notification_manager")

class NotificationManager:
    def __init__(self, db: Session):
        self.db = db

    def get_pending_notifications(self, limit: int = 50) -> List[ReminderNotification]:
        return self.db.query(ReminderNotification).filter(
            ReminderNotification.status == 'pending'
        ).limit(limit).all()

    def record_notification_sent(self, notification_id: UUID) -> Optional[ReminderNotification]:
        try:
            notif = self.db.query(ReminderNotification).filter(ReminderNotification.id == notification_id).first()
            if notif:
                notif.status = 'sent'
                notif.sent_at = datetime.now()
                self.db.commit()
                self.db.refresh(notif)
                logger.info(f"Notification {notification_id} marked as SENT.")
                return notif
        except Exception as e:
            self.db.rollback()
            logger.error(f"Failed to record notification sent for {notification_id}: {str(e)}")
        return None

    def record_notification_failed(self, notification_id: UUID, reason: str) -> Optional[ReminderNotification]:
        try:
            notif = self.db.query(ReminderNotification).filter(ReminderNotification.id == notification_id).first()
            if notif:
                notif.retry_count += 1
                notif.failure_reason = reason
                if notif.retry_count >= 3:
                    notif.status = 'failed'
                    logger.warning(f"Notification {notification_id} reached max retries (3) E.g. marked as FAILED.")
                else:
                    notif.status = 'pending' # Keep pending for retry
                    logger.info(f"Notification {notification_id} failed (retry {notif.retry_count}/3). Reason: {reason}")
                self.db.commit()
                self.db.refresh(notif)
                return notif
        except Exception as e:
            self.db.rollback()
            logger.error(f"Failed to record notification failure for {notification_id}: {str(e)}")
        return None
