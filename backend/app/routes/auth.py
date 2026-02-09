"""
Authentication routes for FluentFusion API
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from app.database import get_db
from app.models import User
from app.auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
    logout_user,
    log_activity,
    get_token_from_header
)
from app.schemas import (
    UserCreate,
    UserLogin,
    UserResponse,
    Token,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user
    
    - username: Unique username
    - email: Valid email address
    - password: Password (min 8 characters)
    - user_type: 'tourist' or 'tourism_worker'
    - target_language: Language to learn
    - native_language: Native language
    """
    # Check if username exists
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email exists
    existing_email = db.query(User).filter(User.email == user_data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Validate user type
    if user_data.user_type not in ["tourist", "tourism_worker"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User type must be 'tourist' or 'tourism_worker'"
        )
    
    # Validate target language
    valid_languages = ["kinyarwanda", "english", "french"]
    if user_data.target_language not in valid_languages:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Target language must be one of: {', '.join(valid_languages)}"
        )
    
    # Create user
    import uuid
    user = User(
        user_id=str(uuid.uuid4()),
        username=user_data.username,
        email=user_data.email,
        password_hash=get_password_hash(user_data.password),
        user_type=user_data.user_type,
        target_language=user_data.target_language,
        native_language=user_data.native_language
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Login user and return access token
    
    - username: Username
    - password: Password
    """
    user = db.query(User).filter(User.username == form_data.username).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=60 * 24)
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            user_id=user.user_id,
            username=user.username,
            email=user.email,
            user_type=user.user_type,
            target_language=user.target_language,
            native_language=user.native_language,
            created_at=user.created_at
        )
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current user information
    """
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update current user profile
    """
    if "username" in user_data:
        existing = db.query(User).filter(
            User.username == user_data["username"],
            User.user_id != current_user.user_id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        current_user.username = user_data["username"]
    
    if "email" in user_data:
        existing = db.query(User).filter(
            User.email == user_data["email"],
            User.user_id != current_user.user_id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        current_user.email = user_data["email"]
    
    if "target_language" in user_data:
        current_user.target_language = user_data["target_language"]
    
    if "native_language" in user_data:
        current_user.native_language = user_data["native_language"]
    
    db.commit()
    db.refresh(current_user)
    
    return current_user

@router.get("/users", response_model=list[UserResponse])
async def get_all_users(db: Session = Depends(get_db)):
    """
    Get all registered users (admin endpoint)
    """
    users = db.query(User).all()
    return users

@router.post("/logout")
async def logout(request: Request, current_user: User = Depends(get_current_user)):
    """
    Logout user and blacklist token
    """
    token = get_token_from_header(request)
    if token:
        await logout_user(token)
    
    # Log activity
    log_activity(current_user.user_id, "logout", request)
    
    return {"message": "Successfully logged out"}
