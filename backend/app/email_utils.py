import os, resend
from dotenv import load_dotenv

load_dotenv()

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
FROM_EMAIL     = os.getenv("FROM_EMAIL", "onboarding@resend.dev")
FROM_NAME      = os.getenv("FROM_NAME", "FluentFusion AI")
EMAIL_ENABLED  = os.getenv("EMAIL_ENABLED", "False").lower() == "true"

resend.api_key = RESEND_API_KEY


def send_email(to: str, subject: str, html: str) -> bool:
    if not EMAIL_ENABLED:
        print(f"[EMAIL DISABLED] To: {to} | Subject: {subject}")
        return True
    try:
        resend.Emails.send({
            "from": f"{FROM_NAME} <{FROM_EMAIL}>",
            "to": [to],
            "subject": subject,
            "html": html,
        })
        print(f"[EMAIL SENT] To: {to} | Subject: {subject}")
        return True
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")
        return False


def send_otp_email(to: str, name: str, otp: str) -> bool:
    html = f"""
    <div style="background:#0a0a0a;padding:40px;font-family:sans-serif;color:#fff;max-width:480px;margin:auto;border-radius:16px;">
      <div style="font-size:28px;font-weight:800;text-transform:uppercase;margin-bottom:8px;">
        FLUENT<span style="color:#BFFF00;">FUSION</span>
      </div>
      <h2 style="color:#BFFF00;margin:24px 0 8px;">Verify Your Email</h2>
      <p style="color:#888;margin-bottom:24px;">Hi {name}, use the code below to verify your email address.</p>
      <div style="background:#151515;border:1px solid #2a2a2a;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
        <div style="font-size:40px;font-weight:800;letter-spacing:12px;color:#BFFF00;">{otp}</div>
        <div style="color:#888;font-size:13px;margin-top:8px;">Expires in 10 minutes</div>
      </div>
      <p style="color:#555;font-size:12px;">If you didn't create a FluentFusion account, ignore this email.</p>
    </div>"""
    return send_email(to, "Your FluentFusion verification code", html)


def send_reset_email(to: str, name: str, reset_link: str) -> bool:
    html = f"""
    <div style="background:#0a0a0a;padding:40px;font-family:sans-serif;color:#fff;max-width:480px;margin:auto;border-radius:16px;">
      <div style="font-size:28px;font-weight:800;text-transform:uppercase;margin-bottom:8px;">
        FLUENT<span style="color:#BFFF00;">FUSION</span>
      </div>
      <h2 style="color:#BFFF00;margin:24px 0 8px;">Reset Your Password</h2>
      <p style="color:#888;margin-bottom:24px;">Hi {name}, click the button below to reset your password.</p>
      <a href="{reset_link}" style="display:inline-block;background:#BFFF00;color:#0a0a0a;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;margin-bottom:24px;">Reset Password →</a>
      <p style="color:#555;font-size:12px;">This link expires in 1 hour. If you didn't request a reset, ignore this email.</p>
    </div>"""
    return send_email(to, "Reset your FluentFusion password", html)
