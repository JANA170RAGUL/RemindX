from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.user import User
from app.models.event import Event
from app.schemas.event import EventCreate, EventResponse
from app.api.dependencies.auth import get_current_user
from app.utils.response import success_response

router = APIRouter()

@router.post("")
def create_event(event: EventCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_event = Event(**event.dict(), user_id=current_user.id)
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return success_response({"id": str(new_event.id)}, "Event created successfully")

@router.get("")
def get_events(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    events = db.query(Event).filter(Event.user_id == current_user.id).all()
    data = [{"id": str(e.id), "title": e.title} for e in events]
    return success_response(data, "Fetched events successfully")
