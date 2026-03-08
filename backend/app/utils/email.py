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

async def send_verification_email(to_email: str, full_name: str, otp_code: str, role: str = "student"):
    """Send email verification code with role-specific content"""
    is_instructor = role == "instructor"
    
    subject = "Verify your FluentFusion email" if not is_instructor else "Verify your FluentFusion Instructor Account"
    
    if is_instructor:
        html_content = f"""
        <html>
            <body style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
                <div style="background: #0A0A0A; border: 1px solid #2A2A2A; border-radius: 16px; padding: 32px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <span style="font-size: 48px;">🎓</span>
                        <h1 style="font-family: 'Syne', sans-serif; color: #FFFFFF;">FLUENT<span style="color: #BFFF00;">FUSION</span></h1>
                        <p style="color: #BFFF00; font-size: 14px;">INSTRUCTOR VERIFICATION</p>
                    </div>
                    <h2 style="color: #FFFFFF;">Hello Instructor {full_name},</h2>
                    <p style="color: #888888;">Welcome to FluentFusion! Your instructor verification code is:</p>
                    <div style="background: #151515; border: 1px solid #2A2A2A; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
                        <span style="font-family: monospace; font-size: 36px; font-weight: bold; color: #BFFF00; letter-spacing: 8px;">{otp_code}</span>
                    </div>
                    <p style="color: #888888;">This code expires in 10 minutes.</p>
                    <p style="color: #888888;">After verification, you'll be able to:</p>
                    <ul style="color: #888888; line-height: 1.8;">
                        <li>📚 Create and manage your courses</li>
                        <li>👥 Teach live sessions</li>
                        <li>📊 Track student progress</li>
                        <li>💰 Manage your earnings</li>
                    </ul>
                    <p style="color: #888888;">If you didn't request this, please ignore this email.</p>
                </div>
            </body>
        </html>
        """
    else:
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
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
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

async def send_verification_success_email(to_email: str, full_name: str, role: str = "student"):
    """Send email after successful verification with role-specific content"""
    is_instructor = role == "instructor"
    
    if is_instructor:
        subject = "🎓 Welcome to FluentFusion - Instructor Account Verified!"
        home_url = f"{settings.FRONTEND_URL}/instructor/dashboard"
        html_content = f"""
        <html>
            <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #0A0A0A; border: 1px solid #2A2A2A; border-radius: 16px; padding: 40px;">
                    <div style="text-align: center; margin-bottom: 32px;">
                        <span style="font-size: 64px;">🎓</span>
                        <h1 style="font-family: 'Syne', sans-serif; color: #FFFFFF; font-size: 28px;">FLUENT<span style="color: #BFFF00;">FUSION</span></h1>
                        <p style="color: #BFFF00; font-size: 14px;">INSTRUCTOR ACCOUNT</p>
                    </div>
                    
                    <h2 style="color: #FFFFFF; font-size: 24px; text-align: center;">Instructor Account Verified! 🎉</h2>
                    
                    <p style="color: #FFFFFF; font-size: 18px; text-align: center;">Hello Instructor {full_name},</p>
                    
                    <p style="color: #888888; font-size: 16px; line-height: 1.6;">
                        <strong style="color: #BFFF00;">Congratulations!</strong> Your instructor account has been verified. You're now ready to start teaching!
                    </p>
                    
                    <div style="background: linear-gradient(145deg, rgba(191,255,0,0.1) 0%, rgba(191,255,0,0) 50%); border: 1px solid #2A2A2A; border-radius: 12px; padding: 24px; margin: 32px 0;">
                        <h3 style="color: #BFFF00; margin-top: 0;">🎯 Your Instructor Dashboard</h3>
                        <ul style="color: #888888; line-height: 2;">
                            <li>📚 <strong style="color: #FFFFFF;">Create Courses</strong> - Build engaging language courses</li>
                            <li>🎓 <strong style="color: #FFFFFF;">Teach Live Sessions</strong> - Host real-time classes</li>
                            <li>👥 <strong style="color: #FFFFFF;">Manage Students</strong> - Track student progress</li>
                            <li>💰 <strong style="color: #FFFFFF;">Earn Revenue</strong> - Get paid for your teaching</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="{home_url}" style="background: #BFFF00; color: #000000; text-decoration: none; padding: 16px 32px; border-radius: 10px; font-weight: bold; font-size: 16px; display: inline-block;">Go to Instructor Dashboard →</a>
                    </div>
                    
                    <div style="border-top: 1px solid #2A2A2A; padding-top: 24px; margin-top: 32px; text-align: center;">
                        <p style="color: #555555; font-size: 12px;">
                            With gratitude,<br>
                            <strong style="color: #FFFFFF;">The FluentFusion Team</strong><br>
                            🧠💚
                        </p>
                    </div>
                </div>
            </body>
        </html>
        """
    else:
        subject = "🎉 Welcome to FluentFusion - Your Journey Begins!"
        home_url = f"{settings.FRONTEND_URL}/"
        html_content = f"""
        <html>
            <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #0A0A0A; border: 1px solid #2A2A2A; border-radius: 16px; padding: 40px;">
                    <div style="text-align: center; margin-bottom: 32px;">
                        <span style="font-size: 64px;">🎉</span>
                        <h1 style="font-family: 'Syne', sans-serif; color: #FFFFFF; font-size: 28px;">FLUENT<span style="color: #BFFF00;">FUSION</span></h1>
                    </div>
                    
                    <h2 style="color: #FFFFFF; font-size: 24px; text-align: center;">You're In! 🎉</h2>
                    
                    <p style="color: #FFFFFF; font-size: 18px; text-align: center;">Hello {full_name},</p>
                    
                    <p style="color: #888888; font-size: 16px; line-height: 1.6;">
                        Your email has been verified and your account is now active. 
                        <strong style="color: #BFFF00;">Welcome to the FluentFusion family!</strong>
                    </p>
                    
                    <div style="background: linear-gradient(145deg, rgba(191,255,0,0.1) 0%, rgba(191,255,0,0) 50%); border: 1px solid #2A2A2A; border-radius: 12px; padding: 24px; margin: 32px 0;">
                        <h3 style="color: #BFFF00; margin-top: 0;">🌟 What's Next?</h3>
                        <ul style="color: #888888; line-height: 2;">
                            <li>🚀 <strong style="color: #FFFFFF;">Start Learning</strong> - Pick your first language and begin your journey</li>
                            <li>📚 <strong style="color: #FFFFFF;">Join Live Sessions</strong> - Connect with native speakers in real-time</li>
                            <li>👥 <strong style="color: #FFFFFF;">Join Community</strong> - Connect with fellow learners worldwide</li>
                            <li>🏆 <strong style="color: #FFFFFF;">Track Progress</strong> - Earn achievements and build your streak</li>
                        </ul>
                    </div>
                    
                    <p style="color: #888888; font-size: 14px; text-align: center;">
                        Remember: Every expert was once a beginner. Your journey to fluency starts with a single step.
                    </p>
                    
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="{home_url}" style="background: #BFFF00; color: #000000; text-decoration: none; padding: 16px 32px; border-radius: 10px; font-weight: bold; font-size: 16px; display: inline-block;">Start Learning Now →</a>
                    </div>
                    
                    <div style="border-top: 1px solid #2A2A2A; padding-top: 24px; margin-top: 32px; text-align: center;">
                        <p style="color: #555555; font-size: 12px;">
                            With warmth,<br>
                            <strong style="color: #FFFFFF;">The FluentFusion Team</strong><br>
                            🧠💚
                        </p>
                    </div>
                </div>
            </body>
        </html>
        """
    await send_email(to_email, subject, html_content)

async def send_welcome_login_email(to_email: str, full_name: str, role: str = "student"):
    """Send welcome email after first login with role-specific content"""
    is_instructor = role == "instructor"
    
    if is_instructor:
        subject = "👋 Welcome Back, Instructor! - FluentFusion"
        dashboard_url = f"{settings.FRONTEND_URL}/instructor/dashboard"
        html_content = f"""
        <html>
            <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #0A0A0A; border: 1px solid #2A2A2A; border-radius: 16px; padding: 40px;">
                    <div style="text-align: center; margin-bottom: 32px;">
                        <span style="font-size: 64px;">👋</span>
                        <h1 style="font-family: 'Syne', sans-serif; color: #FFFFFF; font-size: 28px;">FLUENT<span style="color: #BFFF00;">FUSION</span></h1>
                        <p style="color: #BFFF00; font-size: 14px;">INSTRUCTOR PORTAL</p>
                    </div>
                    
                    <h2 style="color: #FFFFFF; font-size: 24px; text-align: center;">Welcome Back, Instructor {full_name}! 🎓</h2>
                    
                    <p style="color: #888888; font-size: 16px; line-height: 1.6; text-align: center;">
                        Great to have you back! Your students are waiting for you.
                    </p>
                    
                    <div style="background: linear-gradient(145deg, rgba(191,255,0,0.1) 0%, rgba(191,255,0,0) 50%); border: 1px solid #2A2A2A; border-radius: 12px; padding: 24px; margin: 32px 0;">
                        <h3 style="color: #BFFF00; margin-top: 0; text-align: center;">💫 Quick Actions</h3>
                        
                        <div style="display: flex; gap: 16px; margin-top: 20px;">
                            <div style="flex: 1; background: #151515; border-radius: 8px; padding: 16px; text-align: center;">
                                <span style="font-size: 32px;">📚</span>
                                <p style="color: #FFFFFF; font-weight: bold; margin: 8px 0 4px;">Courses</p>
                                <p style="color: #888888; font-size: 12px;">Create & Manage</p>
                            </div>
                            <div style="flex: 1; background: #151515; border-radius: 8px; padding: 16px; text-align: center;">
                                <span style="font-size: 32px;">🎓</span>
                                <p style="color: #FFFFFF; font-weight: bold; margin: 8px 0 4px;">Live</p>
                                <p style="color: #888888; font-size: 12px;">Host Classes</p>
                            </div>
                            <div style="flex: 1; background: #151515; border-radius: 8px; padding: 16px; text-align: center;">
                                <span style="font-size: 32px;">📊</span>
                                <p style="color: #FFFFFF; font-weight: bold; margin: 8px 0 4px;">Analytics</p>
                                <p style="color: #888888; font-size: 12px;">Track Progress</p>
                            </div>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="{dashboard_url}" style="background: #BFFF00; color: #000000; text-decoration: none; padding: 16px 32px; border-radius: 10px; font-weight: bold; font-size: 16px; display: inline-block;">Go to Instructor Dashboard →</a>
                    </div>
                    
                    <div style="border-top: 1px solid #2A2A2A; padding-top: 24px; margin-top: 32px; text-align: center;">
                        <p style="color: #555555; font-size: 12px;">
                            Happy teaching!<br>
                            <strong style="color: #FFFFFF;">The FluentFusion Team</strong><br>
                            🧠💚🎓
                        </p>
                    </div>
                </div>
            </body>
        </html>
        """
    else:
        subject = "🌟 Welcome Back to FluentFusion - Your Adventure Awaits!"
        dashboard_url = f"{settings.FRONTEND_URL}/dashboard"
        html_content = f"""
        <html>
            <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #0A0A0A; border: 1px solid #2A2A2A; border-radius: 16px; padding: 40px;">
                    <div style="text-align: center; margin-bottom: 32px;">
                        <span style="font-size: 64px;">👋</span>
                        <h1 style="font-family: 'Syne', sans-serif; color: #FFFFFF; font-size: 28px;">FLUENT<span style="color: #BFFF00;">FUSION</span></h1>
                    </div>
                    
                    <h2 style="color: #FFFFFF; font-size: 24px; text-align: center;">Welcome Home, {full_name}! 🏠</h2>
                    
                    <p style="color: #888888; font-size: 16px; line-height: 1.6; text-align: center;">
                        The FluentFusion family is thrilled to have you back! You've taken the first step toward 
                        mastering a new language, and we're here to support you every step of the way.
                    </p>
                    
                    <div style="background: linear-gradient(145deg, rgba(191,255,0,0.1) 0%, rgba(191,255,0,0) 50%); border: 1px solid #2A2A2A; border-radius: 12px; padding: 24px; margin: 32px 0;">
                        <h3 style="color: #BFFF00; margin-top: 0; text-align: center;">💫 Your Language Journey</h3>
                        
                        <div style="display: flex; gap: 16px; margin-top: 20px;">
                            <div style="flex: 1; background: #151515; border-radius: 8px; padding: 16px; text-align: center;">
                                <span style="font-size: 32px;">📖</span>
                                <p style="color: #FFFFFF; font-weight: bold; margin: 8px 0 4px;">Learn</p>
                                <p style="color: #888888; font-size: 12px;">Courses & Lessons</p>
                            </div>
                            <div style="flex: 1; background: #151515; border-radius: 8px; padding: 16px; text-align: center;">
                                <span style="font-size: 32px;">🎯</span>
                                <p style="color: #FFFFFF; font-weight: bold; margin: 8px 0 4px;">Practice</p>
                                <p style="color: #888888; font-size: 12px;">Speaking & Listening</p>
                            </div>
                            <div style="flex: 1; background: #151515; border-radius: 8px; padding: 16px; text-align: center;">
                                <span style="font-size: 32px;">👥</span>
                                <p style="color: #FFFFFF; font-weight: bold; margin: 8px 0 4px;">Connect</p>
                                <p style="color: #888888; font-size: 12px;">Live Sessions</p>
                            </div>
                        </div>
                    </div>
                    
                    <p style="color: #888888; font-size: 14px; text-align: center;">
                        <strong style="color: #BFFF00;">💡 Pro Tip:</strong> Consistency is key! Even 10 minutes daily can lead to fluency over time.
                    </p>
                    
                    <p style="color: #888888; font-size: 14px; text-align: center;">
                        You're not just learning a language—you're opening doors to new cultures, friends, and opportunities.
                    </p>
                    
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="{dashboard_url}" style="background: #BFFF00; color: #000000; text-decoration: none; padding: 16px 32px; border-radius: 10px; font-weight: bold; font-size: 16px; display: inline-block;">Continue Your Journey →</a>
                    </div>
                    
                    <div style="border-top: 1px solid #2A2A2A; padding-top: 24px; margin-top: 32px; text-align: center;">
                        <p style="color: #555555; font-size: 12px;">
                            Here's to your success,<br>
                            <strong style="color: #FFFFFF;">The FluentFusion Family</strong><br>
                            🧠💚🌟
                        </p>
                    </div>
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