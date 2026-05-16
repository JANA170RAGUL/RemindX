# app/notifications/email_service.py
import smtplib
from email.message import EmailMessage
from app.core.config import settings
import asyncio
from typing import Optional
import logging

logger = logging.getLogger("app.notifications.email_service")

class EmailService:
    @staticmethod
    async def send_html_email(to_email: str, subject: str, html_content: str, plain_text_content: Optional[str] = None) -> bool:
        if not settings.EMAIL or not settings.EMAIL_PASSWORD:
            logger.warning("Email credentials (EMAIL, EMAIL_PASSWORD) not configured in .env. E.g. skipping SMTP dispatch.")
            return False
            
        def _send():
            msg = EmailMessage()
            msg['Subject'] = subject
            msg['From'] = settings.EMAIL
            msg['To'] = to_email
            
            # Set plain text fallback first, then HTML alternative E.g. standard MIME structure
            if plain_text_content:
                msg.set_content(plain_text_content)
                msg.add_alternative(html_content, subtype='html')
            else:
                msg.set_content(html_content, subtype='html')

            try:
                with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
                    smtp.login(settings.EMAIL, settings.EMAIL_PASSWORD)
                    smtp.send_message(msg)
                logger.info(f"Successfully dispatched HTML email to {to_email}")
                return True
            except Exception as e:
                logger.error(f"SMTP dispatch failure for {to_email}: {str(e)}")
                return False

        try:
            return await asyncio.to_thread(_send)
        except Exception as e:
            logger.error(f"Async thread execution failure during email dispatch: {str(e)}")
            return False
