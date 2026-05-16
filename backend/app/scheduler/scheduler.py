# app/scheduler/scheduler.py
from apscheduler.schedulers.background import BackgroundScheduler
from app.workers.reminder_worker import ReminderWorker
import logging
import atexit

logger = logging.getLogger("app.scheduler.scheduler")

class AutomationScheduler:
    _scheduler = None

    @classmethod
    def start(cls):
        """Initialize and start the background automation scheduler."""
        if cls._scheduler is not None and cls._scheduler.running:
            logger.warning("AutomationScheduler is already running.")
            return

        logger.info("Initializing Production-Grade APScheduler Background Automation Engine...")
        cls._scheduler = BackgroundScheduler()
        
        # Register 1-minute interval job calling the ReminderWorker cycle
        cls._scheduler.add_job(
            ReminderWorker.run_worker_cycle_sync, 
            'interval', 
            minutes=1, 
            id='reminder_automation_worker_job',
            replace_existing=True
        )
        
        cls._scheduler.start()
        logger.info("APScheduler Automation Engine started successfully E.g. 1-minute pulse active.")
        
        # Ensure clean shutdown on exit if not handled by lifespan
        atexit.register(cls.shutdown)

    @classmethod
    def shutdown(cls):
        """Gracefully shut down the background automation scheduler."""
        if cls._scheduler is not None and cls._scheduler.running:
            logger.info("Gracefully shutting down APScheduler Automation Engine...")
            cls._scheduler.shutdown(wait=True)
            logger.info("APScheduler Automation Engine shut down successfully.")
