from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Request
from sqlalchemy.orm import Session
from datetime import timedelta, datetime, timezone
import random
import string
import logging

logger = logging.getLogger(__name__)

from ...database import get_db
from ...models.user import User, EmailVerification, PasswordReset
from ...schemas.user import (
    UserCreate, UserLogin, TokenResponse, EmailVerificationRequest,
    ForgotPasswordRequest, ResetPasswordRequest, RefreshTokenRequest
)
from ...utils.security import (
    verify_password, get_password_hash,
    create_access_token, create_refresh_token, decode_token
)
from ...utils.email import send_verification_email, send_password_reset_email, send_verification_success_email, send_welcome_login_email
from ...utils.redis_client import redis_client
from ...config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=dict)
async def register(
    user_data: UserCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    import logging
    logger = logging.getLogger(__name__)
    
    # Log incoming data (excluding password)
    logger.info(f"=== REGISTRATION START ===")
    logger.info(f"Email: {user_data.email}")
    logger.info(f"Full Name: {user_data.full_name}")
    logger.info(f"Role: {user_data.role}")
    logger.info(f"UserCreate fields: {user_data.model_fields}")
    logger.info(f"UserCreate model dump: {user_data.model_dump()}")
    
    # Validate email format
    if not user_data.email or '@' not in user_data.email:
        logger.error(f"Invalid email format: {user_data.email}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid email format"
        )
    
    # Validate password
    if not user_data.password or len(user_data.password) < 8:
        logger.error(f"Password too short: {len(user_data.password)} chars")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Password must be at least 8 characters"
        )
    
    # Validate full name
    if not user_data.full_name or len(user_data.full_name.strip()) == 0:
        logger.error(f"Empty full name")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Full name is required"
        )
    
    # Check if user exists
    try:
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            logger.warning(f"Email already registered: {user_data.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Database error checking user: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    # Create user - ensure role is valid
    hashed_password = get_password_hash(user_data.password)
    
    # For admin role, require approval by super_admin
    # Admin accounts need to be approved before activation
    is_active = True
    approval_message = "Verification email sent"
    if user_data.role == "admin":
        # Admins need super_admin approval
        is_active = False
        approval_message = "Admin registration submitted. Pending approval from super admin."
        logger.info(f"Admin user {user_data.email} requires super_admin approval")
    
    user_role = user_data.role if user_data.role in ["student", "instructor", "admin", "super_admin"] else "student"
    
    logger.info(f"Creating user with: email={user_data.email}, full_name={user_data.full_name}, role={user_role}, is_active={is_active}")
    
    try:
        user = User(
            email=user_data.email,
            password_hash=hashed_password,
            full_name=user_data.full_name,
            role=user_role,
            is_active=is_active,
            is_email_verified=True  # Auto-verify in development for testing
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info(f"User created successfully: id={user.id}, email_verified={user.is_email_verified}")
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")
    
    # Create email verification
    otp = ''.join(random.choices(string.digits, k=6))
    verification = EmailVerification(
        user_id=user.id,
        otp_code=otp,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=10)
    )
    db.add(verification)
    
    try:
        db.commit()
        logger.info(f"Email verification created for user {user.id}")
    except Exception as e:
        logger.error(f"Error creating email verification: {e}")
        db.rollback()
    
    # Send email in background (don't fail registration if email fails)
    try:
        background_tasks.add_task(
            send_verification_email,
            to_email=user.email,
            full_name=user.full_name,
            otp_code=otp,
            role=user.role
        )
    except Exception as e:
        logger.warning(f"Could not queue verification email: {e}")
    
    return {
        "user_id": user.id,
        "email": user.email,
        "message": approval_message,
        "requires_approval": user_data.role == "admin"
    }

@router.post("/verify-email", response_model=dict)
async def verify_email(
    verification_data: EmailVerificationRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == verification_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    verification = db.query(EmailVerification).filter(
        EmailVerification.user_id == user.id,
        EmailVerification.otp_code == verification_data.code,
        EmailVerification.verified_at.is_(None)
    ).first()
    
    if not verification:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code"
        )
    
    if verification.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification code expired"
        )
    
    # Mark as verified
    verification.verified_at = datetime.now(timezone.utc)
    user.is_email_verified = True
    db.commit()
    
    # Send welcome email
    background_tasks.add_task(
        send_verification_success_email,
        to_email=user.email,
        full_name=user.full_name,
        role=user.role
    )
    
    return {"message": "Email verified successfully"}

@router.post("/resend-verification", response_model=dict)
async def resend_verification(
    request: EmailVerificationRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.is_email_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified"
        )
    
    # Delete old verification codes
    db.query(EmailVerification).filter(
        EmailVerification.user_id == user.id,
        EmailVerification.verified_at.is_(None)
    ).delete()
    
    # Create new verification
    otp = ''.join(random.choices(string.digits, k=6))
    verification = EmailVerification(
        user_id=user.id,
        otp_code=otp,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=10)
    )
    db.add(verification)
    db.commit()
    
    # Send email in background
    background_tasks.add_task(
        send_verification_email,
        to_email=user.email,
        full_name=user.full_name,
        otp_code=otp,
        role=user.role
    )
    
    return {"message": "New verification code sent"}

@router.post("/change-email", response_model=dict)
async def change_email(
    request: dict,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Change email before verification - generates new code for new email"""
    old_email = request.get("old_email")
    new_email = request.get("new_email")
    
    if not old_email or not new_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Both old_email and new_email are required"
        )
    
    user = db.query(User).filter(User.email == old_email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if new email is already taken
    existing = db.query(User).filter(User.email == new_email).first()
    if existing and existing.id != user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already in use"
        )
    
    # Update email
    user.email = new_email
    user.is_email_verified = False
    
    # Delete old verification codes
    db.query(EmailVerification).filter(
        EmailVerification.user_id == user.id,
        EmailVerification.verified_at.is_(None)
    ).delete()
    
    # Create new verification
    otp = ''.join(random.choices(string.digits, k=6))
    verification = EmailVerification(
        user_id=user.id,
        otp_code=otp,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=10)
    )
    db.add(verification)
    db.commit()
    
    # Send email in background
    background_tasks.add_task(
        send_verification_email,
        to_email=user.email,
        full_name=user.full_name,
        otp_code=otp,
        role=user.role
    )
    
    return {"message": "Verification code sent to new email", "email": new_email}

@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: UserLogin,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    logger.info(f"Login attempt for email: {login_data.email}")
    
    user = db.query(User).filter(User.email == login_data.email).first()
    
    # Debug: Log all users in DB
    all_users = db.query(User.email, User.role).all()
    logger.info(f"All users in DB: {all_users}")
    
    if not user:
        logger.warning(f"User not found: {login_data.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No account found with this email"
        )
    
    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Password is incorrect"
        )
    
    if not user.is_email_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please verify your email first"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account pending approval. Please contact super admin."
        )
    
    if user.is_banned:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Account banned: {user.ban_reason or 'No reason provided'}"
        )
    
    # Update last active
    user.last_active_at = datetime.now(timezone.utc)
    
    # Check if first login - send welcome email
    is_first_login = user.last_active_at is None
    
    db.commit()
    
    # Send welcome email on first login
    if is_first_login:
        background_tasks.add_task(
            send_welcome_login_email,
            to_email=user.email,
            full_name=user.full_name,
            role=user.role
        )
    
    # Create tokens (now returns tuple with jti)
    access_token, access_jti = create_access_token({"sub": str(user.id), "role": user.role})
    refresh_token, refresh_jti = create_refresh_token({"sub": str(user.id)})
    
    # Create Redis session
    session_data = {
        "user_id": str(user.id),
        "email": user.email,
        "role": user.role,
        "access_jti": access_jti,
        "refresh_jti": refresh_jti,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "ip_address": "unknown",
        "user_agent": "unknown"
    }
    
    # Store session in Redis (expires with access token) - gracefully handle if Redis unavailable
    try:
        await redis_client.create_session(
            session_id=access_jti,
            user_id=str(user.id),
            session_data=session_data,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
    except Exception as e:
        logger.warning(f"Could not create Redis session: {e}")
    
    # Convert user to response model
    user_response = {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "avatar_url": user.avatar_url,
        "bio": user.bio,
        "location": user.location,
        "is_email_verified": user.is_email_verified,
        "is_active": user.is_active,
        "created_at": user.created_at
    }
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=user_response
    )

@router.post("/refresh", response_model=dict)
async def refresh_token(
    refresh_data: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    payload = decode_token(refresh_data.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    # Check if token is blacklisted
    jti = payload.get("jti")
    if jti:
        try:
            if await redis_client.is_token_blacklisted(jti):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token has been revoked"
                )
        except Exception:
            pass  # Continue if Redis unavailable
    
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    # Create new tokens (returns tuple with jti)
    access_token, access_jti = create_access_token({"sub": str(user.id), "role": user.role})
    refresh_token, refresh_jti = create_refresh_token({"sub": str(user.id)})
    
    # Blacklist old refresh token
    if jti:
        try:
            await redis_client.blacklist_token(
                jti=jti,
                expires_in=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
            )
        except Exception:
            pass  # Continue if Redis unavailable
    
    # Update session with new JTIs
    session_data = {
        "user_id": str(user.id),
        "email": user.email,
        "role": user.role,
        "access_jti": access_jti,
        "refresh_jti": refresh_jti,
        "refreshed_at": datetime.now(timezone.utc).isoformat()
    }
    
    try:
        await redis_client.create_session(
            session_id=access_jti,
            user_id=str(user.id),
            session_data=session_data,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
    except Exception:
        pass  # Continue if Redis unavailable
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }

@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        # Return success even if user not found (security)
        return {"message": "If email exists, reset link will be sent"}
    
    # Generate reset token
    token = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
    reset = PasswordReset(
        user_id=user.id,
        token=token,
        expires_at=datetime.now(timezone.utc) + timedelta(hours=1)
    )
    db.add(reset)
    db.commit()
    
    # Send email
    background_tasks.add_task(
        send_password_reset_email,
        to_email=user.email,
        full_name=user.full_name,
        token=token
    )
    
    return {"message": "If email exists, reset link will be sent"}

@router.post("/reset-password")
async def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    reset = db.query(PasswordReset).filter(
        PasswordReset.token == request.token,
        PasswordReset.used_at.is_(None)
    ).first()
    
    if not reset:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    if reset.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token expired"
        )
    
    user = db.query(User).filter(User.id == reset.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update password
    user.password_hash = get_password_hash(request.new_password)
    reset.used_at = datetime.now(timezone.utc)
    db.commit()
    
    return {"message": "Password reset successfully"}

@router.post("/logout")
async def logout(request: Request):
    """
    Logout endpoint that blacklists the current access token.
    Optionally logout from all devices.
    """
    # Get token from header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        payload = decode_token(token)
        
        if payload:
            jti = payload.get("jti")
            token_type = payload.get("type")
            exp = payload.get("exp")
            
            if jti and exp:
                # Calculate TTL for blacklisting
                exp_datetime = datetime.fromtimestamp(exp, tz=timezone.utc)
                ttl = int((exp_datetime - datetime.now(timezone.utc)).total_seconds())
                
                if ttl > 0:
                    # Blacklist this token
                    try:
                        await redis_client.blacklist_token(jti, ttl)
                    except Exception:
                        pass  # Continue if Redis unavailable
    
    return {"message": "Logged out successfully"}

@router.post("/logout-all-devices")
async def logout_all_devices(request: Request, db: Session = Depends(get_db)):
    """
    Logout from all devices - blacklist all sessions for this user.
    """
    # Get token from header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        payload = decode_token(token)
        
        if payload:
            user_id = payload.get("sub")
            if user_id:
                # Delete all sessions for this user
                try:
                    await redis_client.delete_user_sessions(user_id)
                except Exception:
                    pass  # Continue if Redis unavailable
                
                # Also blacklist the current token
                jti = payload.get("jti")
                if jti:
                    try:
                        await redis_client.blacklist_token(
                            jti,
                            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
                        )
                    except Exception:
                        pass  # Continue if Redis unavailable
    
    return {"message": "Logged out from all devices successfully"}

@router.get("/sessions")
async def get_sessions(request: Request, db: Session = Depends(get_db)):
    """
    Get all active sessions for the current user.
    """
    # Get token from header
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    token = auth_header.split(" ")[1]
    payload = decode_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    # Get all sessions for user
    try:
        sessions = await redis_client.get_user_sessions(user_id)
    except Exception:
        sessions = []  # Return empty if Redis unavailable
    
    return {
        "sessions": sessions,
        "total": len(sessions)
    }