import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List
import logging

from ..config import settings

logger = logging.getLogger(__name__)

async def send_email(
    to_email: str,
    subject: str,
    html_content: str,
    text_content: str = None
):
    """Send email using configured provider"""
    if not settings.EMAIL_ENABLED:
        logger.info(f"Email disabled - would send to {to_email}: {subject}")
        return
    
    if settings.EMAIL_PROVIDER == "smtp":
        await _send_smtp_email(to_email, subject, html_content, text_content)
    elif settings.EMAIL_PROVIDER == "sendgrid":
        await _send_sendgrid_email(to_email, subject, html_content)
    elif settings.EMAIL_PROVIDER == "ses":
        await _send_ses_email(to_email, subject, html_content)

async def _send_smtp_email(to_email: str, subject: str, html_content: str, text_content: str = None):
    """Send email via SMTP"""
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{settings.FROM_NAME} <{settings.FROM_EMAIL}>"
    msg["To"] = to_email
    
    if text_content:
        msg.attach(MIMEText(text_content, "plain"))
    
    msg.attach(MIMEText(html_content, "html"))
    
    try:
        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
        server.starttls()
        if settings.SMTP_USER and settings.SMTP_PASSWORD:
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(settings.FROM_EMAIL, [to_email], msg.as_string())
        server.quit()
        logger.info(f"Email sent to {to_email}")
    except Exception as e:
        logger.error(f"Failed to send email: {e}")

async def send_verification_email(to_email: str, full_name: str, otp_code: str):
    """Send email verification code"""
    subject = "Verify your FluentFusion email"
    html_content = f"""
    <html>
        <body style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
            <div style="background: #0A0A0A; border: 1px solid #2A2A2A; border-radius: 16px; padding: 32px;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <span style="font-size: 48px;">🧠</span>
                    <h1 style="font-family: 'Syne', sans-serif; color: #FFFFFF;">FLUENT<span style="color: #BFFF00;">FUSION</span></h1>
                </div>
                <h2 style="color: #FFFFFF;">Hello {full_name},</h2>
                <p style="color: #888888;">Your verification code is:</p>
                <div style="background: #151515; border: 1px solid #2A2A2A; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
                    <span style="font-family: monospace; font-size: 36px; font-weight: bold; color: #BFFF00; letter-spacing: 8px;">{otp_code}</span>
                </div>
                <p style="color: #888888;">This code expires in 10 minutes.</p>
                <p style="color: #888888;">If you didn't request this, please ignore this email.</p>
            </div>
        </body>
    </html>
    """
    await send_email(to_email, subject, html_content)

async def send_password_reset_email(to_email: str, full_name: str, token: str):
    """Send password reset email"""
    reset_link = f"http://localhost:3000/reset-password?token={token}"
    subject = "Reset your FluentFusion password"
    html_content = f"""
    <html>
        <body style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
            <div style="background: #0A0A0A; border: 1px solid #2A2A2A; border-radius: 16px; padding: 32px;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <span style="font-size: 48px;">🧠</span>
                    <h1 style="font-family: 'Syne', sans-serif; color: #FFFFFF;">FLUENT<span style="color: #BFFF00;">FUSION</span></h1>
                </div>
                <h2 style="color: #FFFFFF;">Hello {full_name},</h2>
                <p style="color: #888888;">We received a request to reset your password. Click the button below to create a new password:</p>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="{reset_link}" style="background: #BFFF00; color: #000000; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold;">Reset Password</a>
                </div>
                <p style="color: #888888;">This link expires in 1 hour.</p>
                <p style="color: #888888;">If you didn't request this, please ignore this email.</p>
            </div>
        </body>
    </html>
    """
    await send_email(to_email, subject, html_content)

# Placeholder for other email providers
async def _send_sendgrid_email(to_email: str, subject: str, html_content: str):
    # Implement SendGrid
    pass

async def _send_ses_email(to_email: str, subject: str, html_content: str):
    # Implement AWS SES
    pass