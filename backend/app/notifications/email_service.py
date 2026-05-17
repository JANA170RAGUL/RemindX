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
            email_clean = settings.EMAIL.replace('"', '').replace("'", "").strip()
            password_clean = settings.EMAIL_PASSWORD.replace('"', '').replace("'", "").replace(" ", "").strip()

            msg = EmailMessage()
            msg['Subject'] = subject
            msg['From'] = email_clean
            msg['To'] = to_email
            
            # Set plain text fallback first, then HTML alternative E.g. standard MIME structure
            if plain_text_content:
                msg.set_content(plain_text_content)
                msg.add_alternative(html_content, subtype='html')
            else:
                msg.set_content(html_content, subtype='html')



            try:
                with smtplib.SMTP_SSL('smtp.gmail.com', 465, timeout=10) as smtp:
                    smtp.login(email_clean, password_clean)
                    smtp.send_message(msg)
                logger.info(f"Successfully dispatched HTML email to {to_email} via SSL (465)")
                return True
            except Exception as e_ssl:
                logger.warning(f"SMTP SSL (465) failed: {str(e_ssl)}. E.g. attempting STARTTLS (587)...")
                try:
                    with smtplib.SMTP('smtp.gmail.com', 587, timeout=10) as smtp:
                        smtp.ehlo()
                        smtp.starttls()
                        smtp.login(email_clean, password_clean)
                        smtp.send_message(msg)
                    logger.info(f"Successfully dispatched HTML email to {to_email} via STARTTLS (587)")
                    return True
                except Exception as e_tls:
                    logger.error(f"SMTP STARTTLS (587) dispatch failure for {to_email}: {str(e_tls)}")
                    return False

        try:
            return await asyncio.to_thread(_send)
        except Exception as e:
            logger.error(f"Async thread execution failure during email dispatch: {str(e)}")
            return False
