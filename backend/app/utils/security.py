from datetime import datetime, timedelta
from typing import Optional, Union, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
import secrets
from ..config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# bcrypt has a hard 72-byte limit; truncate to avoid ValueError
_BCRYPT_MAX_BYTES = 72

def _truncate_password(password: str) -> str:
    """Return the password truncated so its UTF-8 encoding fits within bcrypt's 72-byte limit."""
    encoded = password.encode("utf-8")
    if len(encoded) > _BCRYPT_MAX_BYTES:
        encoded = encoded[:_BCRYPT_MAX_BYTES]
        # Decode back, ignoring a possible partial multi-byte character at the cut point
        return encoded.decode("utf-8", errors="ignore")
    return password

# Password utilities
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(_truncate_password(plain_password), hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(_truncate_password(password))

# JWT utilities
def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> tuple[str, str]:
    """
    Create an access token with a unique JTI.
    
    Returns:
        Tuple of (token, jti)
    """
    to_encode = data.copy()
    
    # Add unique JWT ID for blacklisting
    jti = secrets.token_urlsafe(16)
    to_encode.update({"jti": jti})
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt, jti

def create_refresh_token(data: Dict[str, Any]) -> tuple[str, str]:
    """
    Create a refresh token with a unique JTI.
    
    Returns:
        Tuple of (token, jti)
    """
    to_encode = data.copy()
    
    # Add unique JWT ID for blacklisting
    jti = secrets.token_urlsafe(16)
    to_encode.update({"jti": jti})
    
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt, jti

def decode_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return {}