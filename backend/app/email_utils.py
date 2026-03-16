import os
from dotenv import load_dotenv

load_dotenv()

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
FROM_EMAIL     = os.getenv("FROM_EMAIL", "onboarding@resend.dev")
FROM_NAME      = os.getenv("FROM_NAME", "FluentFusion AI")
EMAIL_ENABLED  = os.getenv("EMAIL_ENABLED", "False").lower() == "true"
SMTP_HOST      = os.getenv("SMTP_HOST", "")
SMTP_PORT      = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER      = os.getenv("SMTP_USER", "")
SMTP_PASSWORD  = os.getenv("SMTP_PASSWORD", "")


def send_email(to: str, subject: str, html: str) -> bool:
    if not EMAIL_ENABLED:
        print(f"[EMAIL DISABLED] To: {to} | Subject: {subject}")
        return True
    # Try Resend first (production), fall back to SMTP (local dev)
    if RESEND_API_KEY:
        try:
            import resend as _resend
            _resend.api_key = RESEND_API_KEY
            _resend.Emails.send({
                "from": f"{FROM_NAME} <{FROM_EMAIL}>",
                "to": [to],
                "subject": subject,
                "html": html,
            })
            print(f"[EMAIL SENT via Resend] To: {to} | Subject: {subject}")
            return True
        except Exception as e:
            print(f"[RESEND ERROR] {e}")
    if SMTP_HOST and SMTP_USER and SMTP_PASSWORD:
        try:
            import smtplib
            from email.mime.multipart import MIMEMultipart
            from email.mime.text import MIMEText
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"]    = f"{FROM_NAME} <{SMTP_USER}>"
            msg["To"]      = to
            msg.attach(MIMEText(html, "html"))
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as s:
                s.ehlo(); s.starttls(); s.login(SMTP_USER, SMTP_PASSWORD)
                s.sendmail(SMTP_USER, to, msg.as_string())
            print(f"[EMAIL SENT via SMTP] To: {to} | Subject: {subject}")
            return True
        except Exception as e:
            print(f"[SMTP ERROR] {e}")
    print(f"[EMAIL FAILED] No working provider configured. To: {to}")
    return False


_BASE = """
<div style="background:#0a0a0a;padding:40px;font-family:sans-serif;color:#fff;max-width:520px;margin:auto;border-radius:16px;border:1px solid #1f1f1f;">
  <div style="font-size:26px;font-weight:800;text-transform:uppercase;margin-bottom:24px;letter-spacing:-0.02em;">
    FLUENT<span style="color:#BFFF00;">FUSION</span>
  </div>
  {body}
  <div style="margin-top:32px;padding-top:20px;border-top:1px solid #1f1f1f;font-size:11px;color:#444;">
    © 2026 FluentFusion AI · All rights reserved
  </div>
</div>
"""


def send_otp_email(to: str, name: str, otp: str) -> bool:
    body = f"""
      <h2 style="color:#BFFF00;margin:0 0 8px;">Verify Your Email</h2>
      <p style="color:#888;margin-bottom:24px;">Hi {name}, use the code below to verify your email address.</p>
      <div style="background:#151515;border:1px solid #2a2a2a;border-radius:12px;padding:28px;text-align:center;margin-bottom:24px;">
        <div style="font-size:44px;font-weight:800;letter-spacing:14px;color:#BFFF00;font-family:monospace;">{otp}</div>
        <div style="color:#888;font-size:13px;margin-top:10px;">Expires in 10 minutes</div>
      </div>
      <p style="color:#555;font-size:12px;">If you didn't create a FluentFusion account, you can safely ignore this email.</p>
    """
    return send_email(to, "Your FluentFusion verification code", _BASE.format(body=body))


def send_reset_email(to: str, name: str, reset_link: str) -> bool:
    body = f"""
      <h2 style="color:#BFFF00;margin:0 0 8px;">Reset Your Password</h2>
      <p style="color:#888;margin-bottom:24px;">Hi {name}, click the button below to set a new password for your account.</p>
      <a href="{reset_link}" style="display:inline-block;background:#BFFF00;color:#0a0a0a;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:15px;margin-bottom:24px;">Reset Password →</a>
      <p style="color:#555;font-size:12px;margin-top:16px;">This link expires in 1 hour. If you didn't request a password reset, ignore this email.</p>
    """
    return send_email(to, "Reset your FluentFusion password", _BASE.format(body=body))


def send_welcome_email(to: str, name: str, role: str) -> bool:
    first_name = name.split()[0]

    if role == "student":
        subject = f"Welcome to FluentFusion, {first_name}! 🎓"
        body = f"""
          <h2 style="color:#BFFF00;margin:0 0 8px;">Welcome aboard, {first_name}! 🎉</h2>
          <p style="color:#aaa;margin-bottom:20px;line-height:1.7;">
            Your account is verified and ready. Here's what you can do right now:
          </p>
          <div style="background:#111;border-radius:12px;padding:20px;margin-bottom:20px;">
            <div style="margin-bottom:12px;display:flex;align-items:center;gap:10px;">
              <span style="font-size:20px;">🌍</span>
              <span style="color:#ddd;font-size:14px;"><b style="color:#fff;">Complete your profile</b> — set your native language, target language, and learning goal</span>
            </div>
            <div style="margin-bottom:12px;display:flex;align-items:center;gap:10px;">
              <span style="font-size:20px;">📚</span>
              <span style="color:#ddd;font-size:14px;"><b style="color:#fff;">Browse courses</b> — find the perfect course for your level</span>
            </div>
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:20px;">⚡</span>
              <span style="color:#ddd;font-size:14px;"><b style="color:#fff;">Earn XP & climb the leaderboard</b> — every lesson counts</span>
            </div>
          </div>
          <p style="color:#888;font-size:13px;">Your learning journey starts now. We're excited to have you!</p>
        """

    elif role == "instructor":
        subject = f"Welcome to FluentFusion, {first_name}! 🏫"
        body = f"""
          <h2 style="color:#BFFF00;margin:0 0 8px;">Welcome, {first_name}! Your classroom awaits. 🚀</h2>
          <p style="color:#aaa;margin-bottom:20px;line-height:1.7;">
            Your instructor account is active. Here's how to get started:
          </p>
          <div style="background:#111;border-radius:12px;padding:20px;margin-bottom:20px;">
            <div style="margin-bottom:12px;display:flex;align-items:center;gap:10px;">
              <span style="font-size:20px;">📝</span>
              <span style="color:#ddd;font-size:14px;"><b style="color:#fff;">Create your first course</b> — use the 5-step wizard to build and submit for review</span>
            </div>
            <div style="margin-bottom:12px;display:flex;align-items:center;gap:10px;">
              <span style="font-size:20px;">🎥</span>
              <span style="color:#ddd;font-size:14px;"><b style="color:#fff;">Schedule live sessions</b> — connect with students in real time</span>
            </div>
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:20px;">💰</span>
              <span style="color:#ddd;font-size:14px;"><b style="color:#fff;">Track your revenue</b> — monitor earnings and request payouts from your dashboard</span>
            </div>
          </div>
          <p style="color:#888;font-size:13px;">Courses are reviewed within 24–48 hours. Thank you for joining our educator community!</p>
        """

    else:  # admin / super_admin
        subject = f"FluentFusion Admin Access Granted — {first_name}"
        body = f"""
          <h2 style="color:#BFFF00;margin:0 0 8px;">Admin Access Confirmed, {first_name} 🛡️</h2>
          <p style="color:#aaa;margin-bottom:20px;line-height:1.7;">
            Your admin account on FluentFusion is now active. You have full access to the platform control panel.
          </p>
          <div style="background:#111;border-radius:12px;padding:20px;margin-bottom:20px;">
            <div style="margin-bottom:12px;display:flex;align-items:center;gap:10px;">
              <span style="font-size:20px;">👥</span>
              <span style="color:#ddd;font-size:14px;"><b style="color:#fff;">Manage users</b> — view, edit, ban, or remove students and instructors</span>
            </div>
            <div style="margin-bottom:12px;display:flex;align-items:center;gap:10px;">
              <span style="font-size:20px;">✅</span>
              <span style="color:#ddd;font-size:14px;"><b style="color:#fff;">Review courses</b> — approve or reject instructor submissions</span>
            </div>
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:20px;">📊</span>
              <span style="color:#ddd;font-size:14px;"><b style="color:#fff;">Platform analytics</b> — monitor revenue, PULSE engine, and audit logs</span>
            </div>
          </div>
          <p style="color:#888;font-size:13px;">Keep your credentials secure. This account has elevated privileges.</p>
        """

    return send_email(to, subject, _BASE.format(body=body))
