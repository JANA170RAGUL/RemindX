# app/notifications/templates/email_templates.py
from typing import Optional

class EmailTemplates:
    
    BASE_TEMPLATE = """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{subject}</title>
        <style>
            body {{
                margin: 0;
                padding: 0;
                background-color: #0b0f19;
                color: #f1f5f9;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                -webkit-font-smoothing: antialiased;
            }}
            .container {{
                max-width: 600px;
                margin: 40px auto;
                background-color: #101423;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 24px;
                padding: 40px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            }}
            .header {{
                text-align: center;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding-bottom: 30px;
                margin-bottom: 30px;
            }}
            .logo {{
                font-size: 24px;
                font-weight: 800;
                background: linear-gradient(135deg, #00e5ff, #ff4fd8);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin: 0;
            }}
            .subtitle {{
                font-size: 12px;
                color: #00e5ff;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin-top: 5px;
            }}
            .content {{
                font-size: 15px;
                line-height: 1.6;
                color: #cbd5e1;
            }}
            .card {{
                background: linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
                border: 1px solid rgba(255, 79, 216, 0.3);
                border-radius: 16px;
                padding: 24px;
                margin: 25px 0;
                box-shadow: 0 10px 25px rgba(236, 72, 153, 0.1);
            }}
            .task-title {{
                font-size: 20px;
                font-weight: 700;
                color: #ffffff;
                margin: 0 0 10px 0;
            }}
            .meta-grid {{
                display: table;
                width: 100%;
                margin-top: 15px;
                border-top: 1px solid rgba(255,255,255,0.1);
                padding-top: 15px;
            }}
            .meta-row {{
                display: table-row;
            }}
            .meta-label {{
                display: table-cell;
                font-weight: 600;
                color: #94a3b8;
                padding-bottom: 8px;
                width: 120px;
            }}
            .meta-value {{
                display: table-cell;
                color: #f8fafc;
                font-weight: 600;
                padding-bottom: 8px;
            }}
            .priority-badge {{
                display: inline-block;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
            }}
            .priority-high {{
                background-color: rgba(249, 115, 22, 0.2);
                color: #f97316;
                border: 1px solid rgba(249, 115, 22, 0.4);
            }}
            .priority-medium {{
                background-color: rgba(245, 158, 11, 0.2);
                color: #f59e0b;
                border: 1px solid rgba(245, 158, 11, 0.4);
            }}
            .priority-low {{
                background-color: rgba(0, 229, 255, 0.2);
                color: #00e5ff;
                border: 1px solid rgba(0, 229, 255, 0.4);
            }}
            .btn-container {{
                text-align: center;
                margin: 35px 0 20px 0;
            }}
            .btn {{
                display: inline-block;
                background: linear-gradient(135deg, #00e5ff, #ff4fd8);
                color: #ffffff;
                font-weight: 700;
                font-size: 15px;
                text-decoration: none;
                padding: 14px 32px;
                border-radius: 16px;
                box-shadow: 0 10px 25px rgba(0, 229, 255, 0.3);
                text-transform: uppercase;
                letter-spacing: 1px;
            }}
            .footer {{
                text-align: center;
                margin-top: 40px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                padding-top: 25px;
                font-size: 12px;
                color: #64748b;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="logo">RemindX</h1>
                <div class="subtitle">Autonomous Dispatch Engine</div>
            </div>
            <div class="content">
                {body_content}
            </div>
            <div class="footer">
                <p>RemindX Dashboard • Secure Background Automation</p>
                <p>You received this automated notification based on your schedule preferences.</p>
            </div>
        </div>
    </body>
    </html>
    """

    @classmethod
    def get_reminder_alert_template(cls, title: str, description: Optional[str], reminder_time: str, priority: str, action_url: str = "http://localhost:5173/dashboard") -> str:
        priority_class = "priority-medium"
        if priority.lower() in ["high", "urgent"]:
            priority_class = "priority-high"
        elif priority.lower() == "low":
            priority_class = "priority-low"

        body = f"""
        <p>Hello,</p>
        <p>Your automated AI reminder is currently due. Please review the task details and telemetry below:</p>
        
        <div class="card">
            <h2 class="task-title">{title}</h2>
            <p style="color: #94a3b8; font-size: 14px; margin-bottom: 20px;">{description or 'No additional description provided.'}</p>
            
            <div class="meta-grid">
                <div class="meta-row">
                    <div class="meta-label">Scheduled Time:</div>
                    <div class="meta-value">{reminder_time}</div>
                </div>
                <div class="meta-row">
                    <div class="meta-label">Priority Level:</div>
                    <div class="meta-value">
                        <span class="priority-badge {priority_class}">{priority.upper()}</span>
                    </div>
                </div>
                <div class="meta-row">
                    <div class="meta-label">AI Status:</div>
                    <div class="meta-value" style="color: #00e5ff;">Autonomous Trigger Active</div>
                </div>
            </div>
        </div>
        
        <div class="btn-container">
            <a href="{action_url}" class="btn">View Dashboard</a>
        </div>
        """
        return cls.BASE_TEMPLATE.format(subject=f"RemindX Alert: {title}", body_content=body)

    @classmethod
    def get_event_reminder_template(cls, title: str, start_time: str, end_time: str, meeting_link: Optional[str] = None, action_url: str = "http://localhost:5173/dashboard") -> str:
        link_html = f"""
        <div class="meta-row">
            <div class="meta-label">Meeting Link:</div>
            <div class="meta-value"><a href="{meeting_link}" style="color: #00e5ff; text-decoration: underline;">Join Meeting</a></div>
        </div>
        """ if meeting_link else ""

        body = f"""
        <p>Hello,</p>
        <p>You have an upcoming event scheduled on your calendar. Please find the event details below:</p>
        
        <div class="card" style="border-color: rgba(0, 229, 255, 0.3);">
            <h2 class="task-title" style="color: #00e5ff;">{title}</h2>
            
            <div class="meta-grid">
                <div class="meta-row">
                    <div class="meta-label">Start Time:</div>
                    <div class="meta-value">{start_time}</div>
                </div>
                <div class="meta-row">
                    <div class="meta-label">End Time:</div>
                    <div class="meta-value">{end_time}</div>
                </div>
                {link_html}
            </div>
        </div>
        
        <div class="btn-container">
            <a href="{action_url}" class="btn">Open Calendar</a>
        </div>
        """
        return cls.BASE_TEMPLATE.format(subject=f"Upcoming Event: {title}", body_content=body)

    @classmethod
    def get_verification_template(cls, verification_code: str, action_url: str = "http://localhost:5173/verify") -> str:
        body = f"""
        <p>Hello,</p>
        <p>Welcome to RemindX. To activate your account and enable autonomous background notifications, please verify your email address.</p>
        
        <div class="card" style="text-align: center; border-color: rgba(168, 85, 247, 0.4);">
            <p style="color: #94a3b8; font-size: 14px; margin-bottom: 15px;">Your Secure Verification Code</p>
            <h2 style="font-size: 36px; letter-spacing: 8px; color: #ff4fd8; margin: 0; font-family: monospace;">{verification_code}</h2>
        </div>
        
        <div class="btn-container">
            <a href="{action_url}?code={verification_code}" class="btn">Verify Account</a>
        </div>
        """
        return cls.BASE_TEMPLATE.format(subject="Verify Your Account - RemindX", body_content=body)

    @classmethod
    def get_password_reset_template(cls, reset_token: str, action_url: str = "http://localhost:5173/reset-password") -> str:
        body = f"""
        <p>Hello,</p>
        <p>We received a request to reset your password for your RemindX account. E.g. if you did not request this, please ignore this email.</p>
        
        <div class="card" style="border-color: rgba(244, 63, 94, 0.4);">
            <h2 class="task-title" style="color: #f43f5e;">Password Reset Request</h2>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 10px;">Click the button below to configure a new secure password for your account. E.g. this link will expire in 15 minutes.</p>
        </div>
        
        <div class="btn-container">
            <a href="{action_url}?token={reset_token}" class="btn" style="background: linear-gradient(135deg, #f43f5e, #fb7185); box-shadow: 0 10px 25px rgba(244, 63, 94, 0.3);">Reset Password</a>
        </div>
        """
        return cls.BASE_TEMPLATE.format(subject="Password Reset Request - RemindX", body_content=body)
