from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.models import get_db, User, RoleEnum, StatusEnum
from app.auth import verify_password, hash_password, create_access_token, get_current_user
from app.email_utils import send_otp_email, send_reset_email
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
import random, secrets, os

router = APIRouter(prefix="/api/auth", tags=["auth"])

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    name: str
    id: int

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
    if len(body.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
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
        otp_code=otp,
        otp_expiry=datetime.utcnow() + timedelta(minutes=10),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    send_otp_email(user.email, user.name, otp)
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer", "role": user.role, "name": user.name, "id": user.id}

@router.post("/login", response_model=TokenResponse)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.username).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if user.status == "banned":
        raise HTTPException(status_code=403, detail="Account suspended")
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer", "role": user.role, "name": user.name, "id": user.id}

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
        return {"message": "Email already verified"}
    if not user.otp_code or user.otp_code != body.code:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    if user.otp_expiry and datetime.utcnow() > user.otp_expiry:
        raise HTTPException(status_code=400, detail="Code expired. Request a new one.")
    user.is_verified = True
    user.otp_code = None
    user.otp_expiry = None
    db.commit()
    return {"message": "Email verified successfully"}

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
    send_otp_email(user.email, user.name, otp)
    return {"message": "Verification code resent"}


# ── Password Reset ────────────────────────────────────────────────────────
class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

@router.post("/forgot-password")
def forgot_password(body: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email.lower().strip()).first()
    # Always return 200 to avoid email enumeration
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
    if len(body.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
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
