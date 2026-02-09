"""
Authentication module for FluentFusion
Uses Redis for session management and token blacklisting
"""
import os
import uuid
from datetime import datetime, timedelta
from jose import JWTError, jwt
import bcrypt
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.session import session_store

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "fluentfusion-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return bcrypt.checkpw(
        plain_password.encode('utf-8'), 
        hashed_password.encode('utf-8')
    )

def get_password_hash(password: str) -> str:
    """Generate password hash"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "jti": str(uuid.uuid4())})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> dict:
    """Decode JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user from token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = decode_token(token)
        
        # Check if token is blacklisted
        jti = payload.get("jti")
        if jti and session_store.is_token_blacklisted(jti):
            raise credentials_exception
        
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except HTTPException:
        raise credentials_exception
    
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated"
        )
    
    # Update user activity in Redis
    session_store.update_last_activity(user.user_id)
    session_store.set_user_online(user.user_id)
    
    return user

async def get_current_userOptional(
    token: str = Depends(OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)),
    db: Session = Depends(get_db)
) -> User:
    """Get current user if authenticated, None otherwise"""
    if token is None:
        return None
    
    try:
        return await get_current_user(token, db)
    except HTTPException:
        return None

async def logout_user(token: str) -> bool:
    """Logout user by blacklisting their token"""
    try:
        payload = decode_token(token)
        jti = payload.get("jti")
        if jti:
            # Get remaining expiration time
            exp = payload.get("exp")
            if exp:
                remaining = int(exp - datetime.utcnow().timestamp())
                if remaining > 0:
                    session_store.blacklist_token(jti, remaining)
            
            # Get user_id from payload and mark as offline
            user_id = payload.get("sub")
            if user_id:
                # Look up user_id from username
                session_store.set_user_offline(user_id)
        
        return True
    except Exception:
        return False

def get_client_ip(request: Request) -> str:
    """Get client IP address from request"""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"

def log_activity(user_id: str, action: str, request: Request, metadata: dict = None):
    """Log user activity to Redis"""
    activity_data = {
        "user_id": user_id,
        "action": action,
        "ip": get_client_ip(request),
        "timestamp": datetime.utcnow().isoformat(),
        "metadata": metadata or {}
    }
    # Store in Redis with 7-day retention
    session_store.cache_set(
        f"activity:{user_id}:{int(datetime.utcnow().timestamp())}",
        activity_data,
        86400 * 7
    )

def get_token_from_header(request: Request) -> str | None:
    """Extract token from Authorization header"""
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header[7:]
    return None
