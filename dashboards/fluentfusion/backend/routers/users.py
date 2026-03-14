from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from database import get_db
from auth import get_current_user, get_current_admin, get_password_hash
from schemas import UserOut, UserUpdate, UserListResponse, UserCreate
import models

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=UserListResponse)
def list_users(
    role: str = None,
    search: str = None,
    is_active: bool = None,
    page: int = 1,
    per_page: int = 20,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_admin)
):
    q = db.query(models.User)
    if role:
        q = q.filter(models.User.role == role)
    if is_active is not None:
        q = q.filter(models.User.is_active == is_active)
    if search:
        q = q.filter(or_(
            models.User.full_name.ilike(f"%{search}%"),
            models.User.email.ilike(f"%{search}%")
        ))
    total = q.count()
    users = q.order_by(models.User.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()
    return UserListResponse(items=[UserOut.model_validate(u) for u in users], total=total, page=page, per_page=per_page)


@router.get("/instructors", response_model=UserListResponse)
def list_instructors(
    search: str = None,
    is_verified: bool = None,
    page: int = 1,
    per_page: int = 20,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_admin)
):
    q = db.query(models.User).filter(models.User.role == models.UserRole.instructor)
    if is_verified is not None:
        q = q.filter(models.User.is_verified == is_verified)
    if search:
        q = q.filter(or_(
            models.User.full_name.ilike(f"%{search}%"),
            models.User.email.ilike(f"%{search}%")
        ))
    total = q.count()
    users = q.order_by(models.User.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()
    return UserListResponse(items=[UserOut.model_validate(u) for u in users], total=total, page=page, per_page=per_page)


@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db), _: models.User = Depends(get_current_admin)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    return user


@router.patch("/{user_id}", response_model=UserOut)
def update_user(
    user_id: int, payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    # Audit log
    db.add(models.AuditLog(
        admin_id=current_user.id,
        action_type="USER",
        description=f"Admin {current_user.full_name} updated user {user.full_name}",
        target_id=user.id, target_type="user"
    ))
    db.commit()
    return user


@router.post("/{user_id}/ban")
def ban_user(user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    user.is_active = False
    db.add(models.AuditLog(
        admin_id=current_user.id, action_type="USER",
        description=f"Admin {current_user.full_name} banned user {user.full_name}",
        target_id=user.id, target_type="user"
    ))
    db.commit()
    return {"message": "User banned"}


@router.post("/{user_id}/unban")
def unban_user(user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    user.is_active = True
    db.add(models.AuditLog(
        admin_id=current_user.id, action_type="USER",
        description=f"Admin {current_user.full_name} unbanned user {user.full_name}",
        target_id=user.id, target_type="user"
    ))
    db.commit()
    return {"message": "User unbanned"}


@router.post("/{user_id}/verify")
def verify_instructor(user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    user.is_verified = True
    db.add(models.AuditLog(
        admin_id=current_user.id, action_type="USER",
        description=f"Admin {current_user.full_name} verified instructor {user.full_name}",
        target_id=user.id, target_type="user"
    ))
    db.commit()
    return {"message": "Instructor verified"}


@router.post("", response_model=UserOut)
def create_user(payload: UserCreate, db: Session = Depends(get_db), _: models.User = Depends(get_current_admin)):
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        raise HTTPException(400, "Email already registered")
    initials = "".join([n[0].upper() for n in payload.full_name.split()[:2]])
    user = models.User(
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=get_password_hash(payload.password),
        role=payload.role,
        avatar_initials=initials,
        is_active=True, is_verified=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
