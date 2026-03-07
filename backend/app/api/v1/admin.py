from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timedelta

from ...database import get_db
from ...models.user import User
from ...models.course import Course
from ...models.admin import AdminAuditLog, ModerationReport, PlatformAnalyticsSnapshot
from ...dependencies import get_current_user, require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

# ==================== DASHBOARD ====================

@router.get("/dashboard")
async def get_admin_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get admin dashboard stats"""
    # User stats
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    new_users_today = db.query(User).filter(
        User.created_at >= datetime.utcnow().replace(hour=0, minute=0, second=0)
    ).count()
    
    # Course stats
    total_courses = db.query(Course).count()
    published_courses = db.query(Course).filter(Course.is_published == True).count()
    pending_courses = db.query(Course).filter(Course.approval_status == "pending").count()
    
    return {
        "users": {
            "total": total_users,
            "active": active_users,
            "new_today": new_users_today
        },
        "courses": {
            "total": total_courses,
            "published": published_courses,
            "pending": pending_courses
        }
    }

# ==================== USER MANAGEMENT ====================

@router.get("/users")
async def get_users(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    role: Optional[str] = None,
    is_banned: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get all users with filters"""
    query = db.query(User)
    
    if role:
        query = query.filter(User.role == role)
    if is_banned is not None:
        query = query.filter(User.is_banned == is_banned)
    if search:
        query = query.filter(
            (User.email.ilike(f"%{search}%")) | 
            (User.full_name.ilike(f"%{search}%"))
        )
    
    total = query.count()
    users = query.order_by(User.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    return {
        "users": users,
        "total": total,
        "page": page
    }

@router.post("/users/{user_id}/ban")
async def ban_user(
    user_id: int,
    reason: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Ban a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.role == "admin":
        raise HTTPException(status_code=400, detail="Cannot ban an admin")
    
    user.is_banned = True
    user.ban_reason = reason
    
    # Log action
    audit = AdminAuditLog(
        admin_user_id=current_user.id,
        action="ban_user",
        target_type="user",
        target_id=user_id,
        notes=reason
    )
    db.add(audit)
    db.commit()
    
    return {"message": "User banned"}

@router.post("/users/{user_id}/unban")
async def unban_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Unban a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_banned = False
    user.ban_reason = None
    
    # Log action
    audit = AdminAuditLog(
        admin_user_id=current_user.id,
        action="unban_user",
        target_type="user",
        target_id=user_id
    )
    db.add(audit)
    db.commit()
    
    return {"message": "User unbanned"}

@router.post("/users/{user_id}/promote")
async def promote_user(
    user_id: int,
    new_role: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Promote/demote user role"""
    if new_role not in ["student", "instructor", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    old_role = user.role
    user.role = new_role
    
    # Log action
    audit = AdminAuditLog(
        admin_user_id=current_user.id,
        action="change_role",
        target_type="user",
        target_id=user_id,
        notes=f"Changed from {old_role} to {new_role}"
    )
    db.add(audit)
    db.commit()
    
    return {"message": f"User promoted to {new_role}"}

# ==================== COURSE APPROVAL ====================

@router.get("/courses/pending")
async def get_pending_courses(
    db: Session = Depends(require_admin)
):
    """Get courses pending approval"""
    courses = db.query(Course).filter(
        Course.approval_status == "pending"
    ).all()
    
    return {"courses": courses}

@router.post("/courses/{course_id}/approve")
async def approve_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Approve a course"""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    course.approval_status = "approved"
    course.is_published = True
    
    # Log action
    audit = AdminAuditLog(
        admin_user_id=current_user.id,
        action="approve_course",
        target_type="course",
        target_id=course_id
    )
    db.add(audit)
    db.commit()
    
    return {"message": "Course approved"}

@router.post("/courses/{course_id}/reject")
async def reject_course(
    course_id: int,
    reason: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Reject a course"""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    course.approval_status = "rejected"
    course.rejection_reason = reason
    
    # Log action
    audit = AdminAuditLog(
        admin_user_id=current_user.id,
        action="reject_course",
        target_type="course",
        target_id=course_id,
        notes=reason
    )
    db.add(audit)
    db.commit()
    
    return {"message": "Course rejected"}

# ==================== MODERATION ====================

@router.get("/reports")
async def get_reports(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get moderation reports"""
    query = db.query(ModerationReport)
    
    if status:
        query = query.filter(ModerationReport.status == status)
    else:
        query = query.filter(ModerationReport.status == "open")
    
    reports = query.order_by(ModerationReport.created_at.desc()).all()
    
    return {"reports": reports}

@router.post("/reports/{report_id}/resolve")
async def resolve_report(
    report_id: int,
    resolution: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Resolve a moderation report"""
    report = db.query(ModerationReport).filter(ModerationReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    report.status = "resolved"
    report.resolved_by = current_user.id
    report.resolved_at = datetime.utcnow()
    report.resolution_note = resolution
    
    db.commit()
    
    return {"message": "Report resolved"}

# ==================== ANALYTICS ====================

@router.get("/analytics")
async def get_analytics(
    days: int = Query(30, ge=1, le=90),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get platform analytics"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Users
    total_users = db.query(User).count()
    new_users = db.query(User).filter(User.created_at >= start_date).count()
    
    # Active users (last 30 days)
    active_users = db.query(User).filter(
        User.last_active_at >= start_date
    ).count()
    
    # Courses
    total_courses = db.query(Course).count()
    published_courses = db.query(Course).filter(Course.is_published == True).count()
    
    # Enrollments
    from ...models.progress import Enrollment
    total_enrollments = db.query(Enrollment).filter(
        Enrollment.enrolled_at >= start_date
    ).count()
    
    return {
        "period_days": days,
        "users": {
            "total": total_users,
            "new": new_users,
            "active": active_users
        },
        "courses": {
            "total": total_courses,
            "published": published_courses
        },
        "enrollments": {
            "total": total_enrollments
        }
    }

# ==================== AUDIT LOG ====================

@router.get("/audit-log")
async def get_audit_log(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    action: Optional[str] = None,
    target_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get admin audit log"""
    query = db.query(AdminAuditLog)
    
    if action:
        query = query.filter(AdminAuditLog.action == action)
    if target_type:
        query = query.filter(AdminAuditLog.target_type == target_type)
    
    total = query.count()
    logs = query.order_by(AdminAuditLog.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    return {
        "logs": logs,
        "total": total,
        "page": page
    }
