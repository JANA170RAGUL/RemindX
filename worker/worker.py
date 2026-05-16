# worker/worker.py
"""Standalone entrypoint for Railway APScheduler Worker Service."""
from worker.scheduler import start_scheduler, shutdown_scheduler
import logging
import time

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("worker.main")

def main():
    logger.info("Starting Railway Standalone APScheduler Worker Service...")
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
