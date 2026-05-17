from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.api import api_router
from app.middleware.cors import setup_cors_middleware
from app.middleware.logging import RequestLoggingMiddleware
from app.exceptions.handlers import add_exception_handlers
from contextlib import asynccontextmanager

from worker.scheduler import start_scheduler, shutdown_scheduler
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

import os
from app.core.database import engine, Base
from app.models import *

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    logging.info("Starting RemindX Backend...")
    try:
        Base.metadata.create_all(bind=engine)
        from sqlalchemy import text
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE reminder_notifications ADD COLUMN IF NOT EXISTS failure_reason TEXT;"))
            conn.execute(text("ALTER TABLE reminder_notifications ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0;"))
            conn.execute(text("ALTER TABLE reminder_notifications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();"))
            conn.commit()
        logging.info("Database tables and schema auto-migrated successfully E.g. ready for production.")
    except Exception as e:
        logging.error(f"Failed to auto-create database tables: {str(e)}")
        
    if os.getenv("RUN_BACKGROUND_WORKER", "true").lower() == "true":
        start_scheduler()
        logging.info("APScheduler automation engine started successfully.")
    else:
        logging.info("RUN_BACKGROUND_WORKER is false E.g. skipping embedded scheduler (dedicated worker mode).")
    yield
    # Shutdown logic
    logging.info("Shutting down RemindX Backend...")
    if os.getenv("RUN_BACKGROUND_WORKER", "true").lower() == "true":
        shutdown_scheduler()
    logging.info("Backend shut down successfully.")

app = FastAPI(
    title="RemindX API",
    description="Production-grade API for modern AI-powered reminders.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Setup Middlewares
setup_cors_middleware(app)
app.add_middleware(RequestLoggingMiddleware)

import os
from fastapi.staticfiles import StaticFiles

# Setup Exception Handlers
add_exception_handlers(app)

# Ensure static avatars directory exists
os.makedirs("static/avatars", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include Routers
app.include_router(api_router, prefix="/api/v1")

@app.get("/", tags=["Root"])
async def root():
    return {"status": "ok", "message": "Welcome to RemindX API", "version": "1.0.0"}
