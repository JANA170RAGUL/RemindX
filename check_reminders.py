from app.core.database import SessionLocal
from app.models.reminders import Reminder
from app.models.users import User

db = SessionLocal()
try:
    reminders = db.query(Reminder).all()
    for r in reminders:
        user = db.query(User).filter(User.id == r.user_id).first()
        print(f"\nReminder ID: {r.id}")
        print(f"Title: {r.title}")
        print(f"User ID: {r.user_id}")
        print(f"User Email: {user.email if user else 'None'}")
        print(f"Status: {r.status}")
        print(f"Reminder Datetime: {r.reminder_datetime}")
finally:
    db.close()
