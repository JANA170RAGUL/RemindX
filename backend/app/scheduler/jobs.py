# app/scheduler/jobs.py
from app.scheduler.scheduler import AutomationScheduler

def start_scheduler():
    AutomationScheduler.start()

def shutdown_scheduler():
    AutomationScheduler.shutdown()
