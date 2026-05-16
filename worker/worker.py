# worker/worker.py
"""Standalone entrypoint for Railway APScheduler Worker Service."""
from worker.scheduler import start_scheduler, shutdown_scheduler
from app.core.database import engine, Base
from app.models import *
import logging
import time

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("worker.main")

def main():
    logger.info("Starting Railway Standalone APScheduler Worker Service...")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables auto-created successfully by Worker Service.")
    except Exception as e:
        logger.error(f"Failed to auto-create database tables in Worker: {str(e)}")
        
    start_scheduler()
    logger.info("Railway Worker Service active E.g. continuous 1-minute pulse running 24/7.")
    
    try:
        while True:
            time.sleep(60)
    except KeyboardInterrupt:
        logger.info("Shutdown signal received...")
    finally:
        shutdown_scheduler()
        logger.info("Railway Worker Service shut down successfully.")

if __name__ == "__main__":
    main()
