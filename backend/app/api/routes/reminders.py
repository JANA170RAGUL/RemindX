from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional
from app.core.database import get_db
from app.schemas.reminders import ReminderCreate, ReminderUpdate, ReminderResponse, ReminderListResponse
from app.services.reminder_service import ReminderService
from app.utils.response import success_response
from app.models.users import User
from app.api.dependencies.auth import get_current_user

router = APIRouter()

@router.post("", status_code=status.HTTP_201_CREATED)
def create_reminder(
    payload: ReminderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = ReminderService(db)
    reminder = service.create_reminder(current_user.id, payload)
    return success_response(
        data=ReminderResponse.from_orm(reminder).dict(),
        message="Reminder created successfully"
    )

@router.get("")
def get_reminders(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    filter_type: Optional[str] = None,
    sort_by: Optional[str] = "upcoming",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = ReminderService(db)
    reminders, total = service.get_reminders(current_user.id, page, limit, search, filter_type, sort_by)
    
    data = [ReminderResponse.from_orm(r) for r in reminders]
    response_data = ReminderListResponse(
        total=total,
        page=page,
        limit=limit,
        data=data
    ).dict()
    
    return success_response(data=response_data, message="Reminders fetched successfully")

@router.get("/{id}")
def get_reminder(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = ReminderService(db)
    reminder = service.get_reminder(id, current_user.id)
    return success_response(
        data=ReminderResponse.from_orm(reminder).dict(),
        message="Reminder fetched successfully"
    )

@router.put("/{id}")
def update_reminder(
    id: UUID,
    payload: ReminderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = ReminderService(db)
    reminder = service.update_reminder(id, current_user.id, payload)
    return success_response(
        data=ReminderResponse.from_orm(reminder).dict(),
        message="Reminder updated successfully"
    )

@router.delete("/{id}")
def delete_reminder(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = ReminderService(db)
    service.delete_reminder(id, current_user.id)
    return success_response(message="Reminder deleted successfully")

@router.patch("/{id}/complete")
def complete_reminder(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = ReminderService(db)
    reminder = service.complete_reminder(id, current_user.id)
    return success_response(
        data=ReminderResponse.from_orm(reminder).dict(),
        message="Reminder completed successfully"
    )
