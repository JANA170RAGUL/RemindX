# worker/reminder_worker.py
from app.core.database import SessionLocal
from worker.reminder_processor import ReminderProcessor
from datetime import datetime
import logging
import asyncio

logger = logging.getLogger("worker.reminder_worker")

class ReminderWorker:
    @staticmethod
    async def run_worker_cycle():
        """Execute a single 1-minute worker cycle to process all due reminders."""
        logger.info("--- Initiating APScheduler Reminder Automation Worker Cycle ---")
        db = SessionLocal()
        try:
            now = datetime.now()
            processor = ReminderProcessor(db)
            
            # 1. Fetch pending reminders where reminder_datetime <= now
            due_reminders = processor.get_due_reminders(now)
            logger.info(f"Worker Cycle E.g. Detected {len(due_reminders)} reminders due for execution at {now}.")

            # 2. Process each due reminder sequentially or concurrently
            for reminder in due_reminders:
                try:
                    await processor.process_reminder(reminder, now)
                except Exception as e:
                    logger.error(f"Unhandled exception processing reminder {reminder.id}: {str(e)}")
                    
        except Exception as e:
            logger.error(f"Critical failure during worker cycle execution: {str(e)}")
        finally:
            db.close()
            logger.info("--- Completed APScheduler Reminder Automation Worker Cycle ---")

    @staticmethod
    def run_worker_cycle_sync():
        """Synchronous wrapper for APScheduler thread pool execution."""
        try:
            asyncio.run(ReminderWorker.run_worker_cycle())
        except Exception as e:
            logger.error(f"Sync wrapper failure during worker cycle: {str(e)}")
