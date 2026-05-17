from app.core.database import SessionLocal
from app.models.reminders import ReminderNotification

db = SessionLocal()
try:
    notifs = db.query(ReminderNotification).all()
    print(f"Total Notifications in DB: {len(notifs)}")
    for n in notifs:
        print(f"\nID: {n.id}")
        print(f"Reminder ID: {n.reminder_id}")
        print(f"Status: {n.status}")
        print(f"Sent At: {n.sent_at}")
        print(f"Failure Reason: {n.failure_reason}")
finally:
    db.close()
