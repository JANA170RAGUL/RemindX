import smtplib
from email.message import EmailMessage
import sys

email = "janaragul566@gmail.com"
password = "tmlsneuthfcpkqpn"

msg = EmailMessage()
msg['Subject'] = "Test RemindX SMTP"
msg['From'] = email
msg['To'] = email
msg.set_content("This is a test email from RemindX diagnostics.")

print("Attempting SMTP SSL on Port 465...")
try:
    with smtplib.SMTP_SSL('smtp.gmail.com', 465, timeout=10) as smtp:
        smtp.set_debuglevel(2)
        smtp.login(email, password)
        smtp.send_message(msg)
    print("SUCCESS SSL 465!")
    sys.exit(0)
except Exception as e:
    print(f"FAILED SSL 465: {str(e)}")

print("\nAttempting SMTP STARTTLS on Port 587...")
try:
    with smtplib.SMTP('smtp.gmail.com', 587, timeout=10) as smtp:
        smtp.set_debuglevel(2)
        smtp.ehlo()
        smtp.starttls()
        smtp.login(email, password)
        smtp.send_message(msg)
    print("SUCCESS STARTTLS 587!")
    sys.exit(0)
except Exception as e:
    print(f"FAILED STARTTLS 587: {str(e)}")
    sys.exit(1)
