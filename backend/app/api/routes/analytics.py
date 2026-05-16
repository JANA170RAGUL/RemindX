from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date, timedelta
from app.core.database import get_db
from app.models.users import User
from app.models.reminders import Reminder
from app.api.dependencies.auth import get_current_user
from app.utils.response import success_response

router = APIRouter()

@router.get("/overview")
def get_analytics_overview(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    today = date.today()
    days_map = {}
    
    # Start from 6 days ago to today
    start_date = today - timedelta(days=6)
    
    for i in range(7):
        current_date = start_date + timedelta(days=i)
        day_str = current_date.strftime("%a") # 'Mon', 'Tue', etc.
        days_map[current_date] = {"name": day_str, "completed": 0, "scheduled": 0}

    # Query all reminders for the user in this date range
    reminders = db.query(Reminder).filter(
        Reminder.user_id == current_user.id,
        Reminder.reminder_date >= start_date,
        Reminder.reminder_date <= today
    ).all()

    for r in reminders:
        r_date = r.reminder_date
        if r_date in days_map:
            days_map[r_date]["scheduled"] += 1
            if r.status == "completed":
                days_map[r_date]["completed"] += 1

    analytics_data = list(days_map.values())

    # Calculate overall productivity score
    total_reminders = db.query(Reminder).filter(Reminder.user_id == current_user.id).count()
    completed_reminders = db.query(Reminder).filter(
        Reminder.user_id == current_user.id, 
        Reminder.status == "completed"
    ).count()

    productivity_score = int((completed_reminders / total_reminders * 100)) if total_reminders > 0 else 94

    return success_response({
        "analytics_data": analytics_data,
        "completed_total": completed_reminders,
        "pending_total": total_reminders - completed_reminders,
        "productivity_score": productivity_score
    }, "Analytics fetched successfully")
