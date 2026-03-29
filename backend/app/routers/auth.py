from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.models import get_db, User, RoleEnum, StatusEnum
from app.auth import verify_password, hash_password, create_access_token, get_current_user
from app.email_utils import send_otp_email, send_reset_email, send_welcome_email
from pydantic import BaseModel
from datetime import datetime, timedelta
import random, secrets, os

router = APIRouter(prefix="/api/auth", tags=["auth"])

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    name: str
    id: int
    is_first_login: bool = False

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str = "student"

@router.post("/register", response_model=TokenResponse)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if body.role not in ("student", "instructor"):
        raise HTTPException(status_code=400, detail="Role must be student or instructor")
    validate_password(body.password)
    parts = body.name.strip().split()
    initials = (parts[0][0] + parts[-1][0]).upper() if len(parts) >= 2 else parts[0][:2].upper()
    otp = str(random.randint(100000, 999999))
    user = User(
        name=body.name.strip(),
        email=body.email.lower().strip(),
        hashed_password=hash_password(body.password),
        role=RoleEnum(body.role),
        status=StatusEnum.active,
        avatar_initials=initials,
        xp=0,
        is_verified=False,
        first_login=True,
        otp_code=otp,
        otp_expiry=datetime.utcnow() + timedelta(minutes=10),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    email_sent = send_otp_email(user.email, user.name, otp)
    # If email delivery failed, auto-verify so the user is never locked out
    if not email_sent:
        user.is_verified = True
        user.otp_code = None
        user.otp_expiry = None
        db.commit()
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer", "role": user.role, "name": user.name, "id": user.id, "is_first_login": True}

@router.post("/login", response_model=TokenResponse)
def login(form: OAuth2PasswordRequestForm = Depends(), remember: bool = True, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.username).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if user.status == "banned":
        raise HTTPException(status_code=403, detail="Account suspended")
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="EMAIL_NOT_VERIFIED")
    is_first = bool(user.first_login)
    if is_first:
        user.first_login = False
        db.commit()
        send_welcome_email(user.email, user.name, str(user.role))
    user.last_active = datetime.utcnow()
    db.commit()
    # Short-lived token (60 min) for session-only logins, full expiry for remember-me
    expires = None if remember else 60
    token = create_access_token({"sub": str(user.id), "role": user.role}, expires_minutes=expires)
    return {"access_token": token, "token_type": "bearer", "role": user.role, "name": user.name, "id": user.id, "is_first_login": is_first}

@router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "name": current_user.name, "email": current_user.email, "role": current_user.role, "avatar_initials": current_user.avatar_initials}


# ── Email Verification ────────────────────────────────────────────────────
class VerifyEmailRequest(BaseModel):
    email: str
    code: str

class ResendRequest(BaseModel):
    email: str

@router.post("/verify-email")
def verify_email(body: VerifyEmailRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email.lower().strip()).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_verified:
        return {"message": "Email already verified", "role": str(user.role)}
    if not user.otp_code or user.otp_code != body.code:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    if user.otp_expiry and datetime.utcnow() > user.otp_expiry:
        raise HTTPException(status_code=400, detail="Code expired. Request a new one.")
    user.is_verified = True
    user.otp_code = None
    user.otp_expiry = None
    db.commit()
    send_welcome_email(user.email, user.name, str(user.role))
    return {"message": "Email verified successfully", "role": str(user.role)}

@router.post("/resend-verification")
def resend_verification(body: ResendRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email.lower().strip()).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_verified:
        return {"message": "Email already verified"}
    otp = str(random.randint(100000, 999999))
    user.otp_code = otp
    user.otp_expiry = datetime.utcnow() + timedelta(minutes=10)
    db.commit()
    email_sent = send_otp_email(user.email, user.name, otp)
    # If email delivery failed, auto-verify so the user is never locked out
    if not email_sent:
        user.is_verified = True
        user.otp_code = None
        user.otp_expiry = None
        db.commit()
        return {"message": "Email verified automatically"}
    return {"message": "Verification code resent"}


# ── Google OAuth ─────────────────────────────────────────────────────────
class GoogleAuthRequest(BaseModel):
    credential: str
    role: str = "student"  # only used on first sign-up

@router.post("/google", response_model=TokenResponse)
def google_auth(body: GoogleAuthRequest, db: Session = Depends(get_db)):
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=501, detail="Google OAuth not configured")
    try:
        from google.oauth2 import id_token
        from google.auth.transport import requests as google_requests
        info = id_token.verify_oauth2_token(
            body.credential, google_requests.Request(), GOOGLE_CLIENT_ID
        )
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    email = info.get("email", "").lower().strip()
    name  = info.get("name") or email.split("@")[0]
    if not email:
        raise HTTPException(status_code=400, detail="Google account has no email")

    user = db.query(User).filter(User.email == email).first()
    is_new = user is None
    if is_new:
        role = body.role if body.role in ("student", "instructor") else "student"
        parts = name.strip().split()
        initials = (parts[0][0] + parts[-1][0]).upper() if len(parts) >= 2 else parts[0][:2].upper()
        user = User(
            name=name, email=email,
            hashed_password=hash_password(secrets.token_urlsafe(32)),  # unusable password
            role=RoleEnum(role), status=StatusEnum.active,
            avatar_initials=initials, xp=0,
            is_verified=True, first_login=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        send_welcome_email(user.email, user.name, str(user.role))
    else:
        if user.status == "banned":
            raise HTTPException(status_code=403, detail="Account suspended")

    is_first = bool(user.first_login)
    if is_first:
        user.first_login = False
    user.last_active = datetime.utcnow()
    db.commit()

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer", "role": user.role,
            "name": user.name, "id": user.id, "is_first_login": is_first}


# ── Password Reset ────────────────────────────────────────────────────────
class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

PASSWORD_RULES = "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character."

def validate_password(pw: str):
    import re
    if len(pw) < 8: raise HTTPException(status_code=400, detail=PASSWORD_RULES)
    if not re.search(r'[A-Z]', pw): raise HTTPException(status_code=400, detail=PASSWORD_RULES)
    if not re.search(r'[a-z]', pw): raise HTTPException(status_code=400, detail=PASSWORD_RULES)
    if not re.search(r'[0-9]', pw): raise HTTPException(status_code=400, detail=PASSWORD_RULES)
    if not re.search(r'[^A-Za-z0-9]', pw): raise HTTPException(status_code=400, detail=PASSWORD_RULES)

@router.post("/forgot-password")
def forgot_password(body: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email.lower().strip()).first()
    if user:
        token = secrets.token_urlsafe(32)
        user.reset_token = token
        user.reset_token_expiry = datetime.utcnow() + timedelta(hours=1)
        db.commit()
        reset_link = f"{FRONTEND_URL}/reset-password?token={token}"
        send_reset_email(user.email, user.name, reset_link)
    return {"message": "If this email exists, a reset link has been sent."}

@router.post("/reset-password")
def reset_password(body: ResetPasswordRequest, db: Session = Depends(get_db)):
    validate_password(body.new_password)
    user = db.query(User).filter(User.reset_token == body.token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset link")
    if user.reset_token_expiry and datetime.utcnow() > user.reset_token_expiry:
        raise HTTPException(status_code=400, detail="Reset link has expired. Request a new one.")
    user.hashed_password = hash_password(body.new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    db.commit()
    return {"message": "Password reset successfully"}


# ── Profile Update (password-gated) ──────────────────────────────────────
class ProfileUpdateRequest(BaseModel):
    current_password: str
    name: str | None = None
    bio: str | None = None

@router.patch("/profile")
def update_profile(body: ProfileUpdateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not verify_password(body.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    if body.name is not None:
        name = body.name.strip()
        if not name:
            raise HTTPException(status_code=400, detail="Name cannot be empty")
        current_user.name = name
        parts = name.split()
        current_user.avatar_initials = (parts[0][0] + parts[-1][0]).upper() if len(parts) >= 2 else parts[0][:2].upper()
    if body.bio is not None:
        current_user.bio = body.bio
    db.commit()
    return {"ok": True, "name": current_user.name, "avatar_initials": current_user.avatar_initials}


# ── Email Change (password-gated, confirmation link) ─────────────────────
class EmailChangeRequest(BaseModel):
    current_password: str
    new_email: str

@router.post("/request-email-change")
def request_email_change(body: EmailChangeRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not verify_password(body.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    new_email = body.new_email.lower().strip()
    if new_email == current_user.email:
        raise HTTPException(status_code=400, detail="That is already your current email")
    if db.query(User).filter(User.email == new_email).first():
        raise HTTPException(status_code=400, detail="Email already in use")
    token = secrets.token_urlsafe(32)
    current_user.pending_email = new_email
    current_user.email_change_token = token
    current_user.email_change_expiry = datetime.utcnow() + timedelta(hours=1)
    db.commit()
    confirm_link = f"{FRONTEND_URL}/confirm-email-change?token={token}"
    from app.email_utils import send_email, _BASE
    html = _BASE.format(body=f"""
      <h2 style="color:#BFFF00;margin:0 0 8px;">Confirm Your New Email</h2>
      <p style="color:#888;margin-bottom:24px;">Hi {current_user.name}, click below to confirm <b style="color:#fff;">{new_email}</b> as your new email address.</p>
      <a href="{confirm_link}" style="display:inline-block;background:#BFFF00;color:#0a0a0a;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:15px;margin-bottom:24px;">Confirm New Email →</a>
      <p style="color:#555;font-size:12px;">This link expires in 1 hour. If you didn't request this, ignore it — your email stays unchanged.</p>
    """)
    send_email(new_email, "Confirm your new FluentFusion email", html)
    return {"message": "Confirmation link sent to your new email"}

@router.get("/confirm-email-change")
def confirm_email_change(token: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email_change_token == token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired link")
    if user.email_change_expiry and datetime.utcnow() > user.email_change_expiry:
        raise HTTPException(status_code=400, detail="Link has expired. Request a new one.")
    user.email = user.pending_email
    user.pending_email = None
    user.email_change_token = None
    user.email_change_expiry = None
    db.commit()
    return {"message": "Email updated successfully", "email": user.email}
