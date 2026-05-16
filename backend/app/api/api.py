from fastapi import APIRouter
from app.api.routes import auth

api_router = APIRouter()

from app.api.routes import reminders, analytics

# Include Routers
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(reminders.router, prefix="/reminders", tags=["Reminders"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])

# Placeholders for future modules:
# api_router.include_router(events.router, prefix="/events", tags=["Events"])
# api_router.include_router(users.router, prefix="/users", tags=["Users"])
# api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
