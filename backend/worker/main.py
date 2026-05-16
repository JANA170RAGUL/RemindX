# worker/main.py
"""Standalone entrypoint for running the RemindX background automation worker process."""
from worker.scheduler import start_scheduler, shutdown_scheduler
import logging
import time
import sys

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("worker.main")

def main():
    logger.info("Starting RemindX Standalone Background Worker Process...")
    start_scheduler()
    logger.info("Standalone Worker Process active. Press Ctrl+C to exit.")
    
    try:
        while True:
            time.sleep(3600)
    except KeyboardInterrupt:
        logger.info("Keyboard interrupt detected. Initiating shutdown...")
    finally:
        shutdown_scheduler()
        logger.info("Standalone Worker Process shut down successfully.")

if __name__ == "__main__":
    main()
