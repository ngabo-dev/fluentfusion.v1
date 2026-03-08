from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime, timedelta
import re

from ...database import get_db
from ...models.user import User
from ...models.course import Course, Lesson
from ...models.admin import AdminAuditLog, ModerationReport, PlatformAnalyticsSnapshot
from ...models.progress import Enrollment, LessonCompletion
from ...models.notification import Notification
from ...models.report import Report, ReportComment
from ...models.certificate import Certificate
from ...models.announcement import Announcement, AnnouncementView
from ...models.activity import UserActivity
from ...models.instructor import InstructorProfile
from ...dependencies import get_current_user, require_admin
from ...utils.security import get_password_hash

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
    if new_role not in ["student", "instructor", "admin", "super_admin"]:
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
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
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

@router.get("/moderation-reports")
async def get_moderation_reports(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get platform moderation queue (ModerationReport entities for content moderation).
    Use GET /reports to fetch user-submitted Report entities instead."""
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

# ==================== USER CRUD ====================

@router.post("/users")
async def create_user(
    email: str,
    password: str,
    full_name: str,
    role: str = "student",
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Create a new user (admin only)"""
    if role not in ["student", "instructor", "admin", "super_admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    # Check if email exists
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    user = User(
        email=email,
        password_hash=get_password_hash(password),
        full_name=full_name,
        role=role,
        is_email_verified=True  # Admin-created users are verified by default
    )
    db.add(user)
    
    # Log action
    audit = AdminAuditLog(
        admin_user_id=current_user.id,
        action="create_user",
        target_type="user",
        target_id=0,  # Will be updated after commit
        notes=f"Created user: {email} with role: {role}"
    )
    db.add(audit)
    db.commit()
    db.refresh(user)
    
    # Update audit with actual user_id
    audit.target_id = user.id
    db.commit()
    
    return {
        "message": f"User created with role: {role}",
        "user_id": user.id,
        "email": user.email
    }

@router.patch("/users/{user_id}")
async def update_user(
    user_id: int,
    full_name: Optional[str] = None,
    bio: Optional[str] = None,
    location: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Update user details (admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    changes = []
    
    if full_name is not None:
        user.full_name = full_name
        changes.append("full_name")
    if bio is not None:
        user.bio = bio
        changes.append("bio")
    if location is not None:
        user.location = location
        changes.append("location")
    if is_active is not None:
        user.is_active = is_active
        changes.append(f"is_active={is_active}")
    
    # Log action
    audit = AdminAuditLog(
        admin_user_id=current_user.id,
        action="update_user",
        target_type="user",
        target_id=user_id,
        notes=f"Updated fields: {', '.join(changes)}"
    )
    db.add(audit)
    db.commit()
    
    return {
        "message": "User updated successfully",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "is_active": user.is_active
        }
    }

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Delete a user (admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.role == "admin":
        raise HTTPException(status_code=400, detail="Cannot delete an admin")
    
    email = user.email
    
    # Log before deletion
    audit = AdminAuditLog(
        admin_user_id=current_user.id,
        action="delete_user",
        target_type="user",
        target_id=user_id,
        notes=f"Deleted user: {email}"
    )
    db.add(audit)
    
    db.delete(user)
    db.commit()
    
    return {"message": f"User {email} deleted successfully"}

# ==================== STUDENT PROGRESS ====================

@router.get("/students/{student_id}/progress")
async def get_student_progress(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get detailed progress for a student across all courses"""
    student = db.query(User).filter(User.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Get all enrollments for this student
    enrollments = db.query(Enrollment).filter(
        Enrollment.user_id == student_id
    ).all()
    
    courses_data = []
    for enrollment in enrollments:
        course = db.query(Course).filter(Course.id == enrollment.course_id).first()
        if course:
            # Get completed lessons
            completed_lessons = db.query(LessonCompletion).filter(
                LessonCompletion.enrollment_id == enrollment.id
            ).count()
            
            # Get total lessons in course
            from ...models.course import Lesson
            total_lessons = db.query(Lesson).filter(
                Lesson.course_id == course.id
            ).count()
            
            courses_data.append({
                "course_id": course.id,
                "course_title": course.title,
                "progress": enrollment.completion_pct,
                "enrolled_at": enrollment.enrolled_at.isoformat() if enrollment.enrolled_at else None,
                "completed_at": enrollment.completed_at.isoformat() if enrollment.completed_at else None,
                "lessons_completed": completed_lessons,
                "total_lessons": total_lessons,
                "last_accessed": enrollment.last_accessed_at.isoformat() if enrollment.last_accessed_at else None
            })
    
    return {
        "student": {
            "id": student.id,
            "email": student.email,
            "full_name": student.full_name,
            "role": student.role,
            "is_active": student.is_active,
            "created_at": student.created_at.isoformat() if student.created_at else None
        },
        "courses": courses_data
    }

# ==================== MODERATION REPORTS ====================

@router.post("/reports")
async def create_report(
    reporter_id: int,
    reported_user_id: int,
    reason: str,
    description: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Create a moderation report for a user (admin can report users)"""
    reported_user = db.query(User).filter(User.id == reported_user_id).first()
    if not reported_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    report = ModerationReport(
        reporter_id=reporter_id,
        reported_user_id=reported_user_id,
        reason=reason,
        description=description,
        status="open"
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    
    return {
        "message": "Report created successfully",
        "report_id": report.id
    }

# ==================== ACTIVATION/DEACTIVATION ====================

@router.post("/users/{user_id}/activate")
async def activate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Activate a user account"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = True
    
    # Log action
    audit = AdminAuditLog(
        admin_user_id=current_user.id,
        action="activate_user",
        target_type="user",
        target_id=user_id,
        notes="User account activated"
    )
    db.add(audit)
    db.commit()
    
    return {"message": "User activated successfully"}

@router.post("/users/{user_id}/deactivate")
async def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Deactivate a user account (soft delete)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.role == "admin":
        raise HTTPException(status_code=400, detail="Cannot deactivate an admin")
    
    user.is_active = False
    
    # Log action
    audit = AdminAuditLog(
        admin_user_id=current_user.id,
        action="deactivate_user",
        target_type="user",
        target_id=user_id,
        notes="User account deactivated"
    )
    db.add(audit)
    db.commit()
    
    return {"message": "User deactivated successfully"}

# ==================== USER REPORTS (with @mention support) ====================

def extract_mentions(text: str, db: Session) -> List[dict]:
    """Extract @mentions from text"""
    mention_pattern = r'@(\w+)'
    mentions = re.findall(mention_pattern, text)
    
    results = []
    for username in mentions:
        user = db.query(User).filter(User.full_name.ilike(f"%{username}%")).first()
        if user:
            results.append({
                "user_id": user.id,
                "username": user.full_name,
                "position": text.find(f"@{username}")
            })
    return results

@router.get("/reports")
async def get_all_reports(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    report_type: Optional[str] = None,
    priority: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get all user reports with @mention support"""
    query = db.query(Report)
    
    if status:
        query = query.filter(Report.status == status)
    if report_type:
        query = query.filter(Report.report_type == report_type)
    if priority:
        query = query.filter(Report.priority == priority)
    
    total = query.count()
    reports = query.order_by(Report.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    results = []
    for r in reports:
        reporter = db.query(User).filter(User.id == r.reporter_id).first()
        assignee = db.query(User).filter(User.id == r.assigned_to).first() if r.assigned_to else None
        
        results.append({
            "id": r.id,
            "reporter": {
                "id": reporter.id if reporter else None,
                "name": reporter.full_name if reporter else "Unknown",
                "email": reporter.email if reporter else "Unknown"
            },
            "report_type": r.report_type,
            "title": r.title,
            "description": r.description,
            "mentions": r.mentions,
            "priority": r.priority,
            "status": r.status,
            "assignee": {
                "id": assignee.id if assignee else None,
                "name": assignee.full_name if assignee else None
            } if assignee else None,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "updated_at": r.updated_at.isoformat() if r.updated_at else None
        })
    
    return {
        "reports": results,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit
    }

@router.get("/reports/{report_id}")
async def get_report_details(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get detailed report info with comments"""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    reporter = db.query(User).filter(User.id == report.reporter_id).first()
    assignee = db.query(User).filter(User.id == report.assigned_to).first() if report.assigned_to else None
    
    # Get comments
    comments = db.query(ReportComment).filter(ReportComment.report_id == report_id).order_by(ReportComment.created_at.asc()).all()
    
    comment_list = []
    for c in comments:
        author = db.query(User).filter(User.id == c.author_id).first()
        comment_list.append({
            "id": c.id,
            "author": {
                "id": author.id if author else None,
                "name": author.full_name if author else "Unknown"
            },
            "content": c.content,
            "mentions": c.mentions,
            "is_internal": c.is_internal,
            "created_at": c.created_at.isoformat() if c.created_at else None
        })
    
    return {
        "report": {
            "id": report.id,
            "reporter": {
                "id": reporter.id if reporter else None,
                "name": reporter.full_name if reporter else "Unknown",
                "email": reporter.email if reporter else "Unknown"
            },
            "report_type": report.report_type,
            "title": report.title,
            "description": report.description,
            "mentions": report.mentions,
            "priority": report.status,
            "status": report.status,
            "related_type": report.related_type,
            "related_id": report.related_id,
            "related_title": report.related_title,
            "contact_email": report.contact_email,
            "resolution": report.resolution,
            "resolved_at": report.resolved_at.isoformat() if report.resolved_at else None,
            "assignee": {
                "id": assignee.id if assignee else None,
                "name": assignee.full_name if assignee else None
            } if assignee else None,
            "created_at": report.created_at.isoformat() if report.created_at else None,
            "updated_at": report.updated_at.isoformat() if report.updated_at else None
        },
        "comments": comment_list
    }

@router.post("/reports/{report_id}/assign")
async def assign_report(
    report_id: int,
    assignee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Assign a report to an admin/instructor"""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    assignee = db.query(User).filter(User.id == assignee_id).first()
    if not assignee:
        raise HTTPException(status_code=404, detail="Assignee not found")
    
    report.assigned_to = assignee_id
    if report.status == "submitted":
        report.status = "acknowledged"
    
    db.commit()
    
    return {"message": f"Report assigned to {assignee.full_name}"}

@router.post("/reports/{report_id}/status")
async def update_report_status(
    report_id: int,
    status: str,
    resolution: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Update report status"""
    valid_statuses = ["submitted", "acknowledged", "in_progress", "resolved", "closed", "rejected"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}")
    
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    old_status = report.status
    report.status = status
    
    if status == "resolved" or status == "closed":
        report.resolved_at = datetime.utcnow()
        report.resolution = resolution
        if report.created_at:
            delta = report.resolved_at - report.created_at
            report.resolution_time_hours = int(delta.total_seconds() / 3600)
    
    # Notify reporter
    notification = Notification(
        user_id=report.reporter_id,
        type="report_update",
        title=f"Report status updated: {status}",
        body=f"Your report '{report.title}' has been updated to {status}",
        action_url=f"/reports/{report.id}",
        source_type="report",
        source_id=report.id
    )
    db.add(notification)
    
    db.commit()
    
    return {"message": f"Report status updated from {old_status} to {status}"}

@router.post("/reports/{report_id}/comments")
async def add_report_comment(
    report_id: int,
    content: str,
    is_internal: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Add a comment to a report"""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    mentions = extract_mentions(content, db)
    
    comment = ReportComment(
        report_id=report_id,
        author_id=current_user.id,
        content=content,
        mentions=mentions,
        is_internal=is_internal
    )
    db.add(comment)
    
    # Notify reporter about new comment
    notification = Notification(
        user_id=report.reporter_id,
        type="report_comment",
        title=f"New comment on your report",
        body=content[:100],
        action_url=f"/reports/{report.id}",
        source_type="report",
        source_id=report.id
    )
    db.add(notification)
    
    # Notify mentioned users
    for mention in mentions:
        mentioned_user_id = mention.get("user_id")
        if mentioned_user_id:
            mention_notif = Notification(
                user_id=mentioned_user_id,
                type="mention",
                title=f"You were mentioned in a report",
                body=content[:100],
                action_url=f"/reports/{report.id}",
                source_type="report",
                source_id=report.id
            )
            db.add(mention_notif)
    
    db.commit()
    db.refresh(comment)
    
    return {"message": "Comment added", "comment_id": comment.id}

# ==================== NOTIFICATIONS ====================

@router.get("/notifications")
async def get_notifications(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    user_id: Optional[int] = None,
    is_read: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get all notifications (admin view)"""
    query = db.query(Notification)
    
    if user_id:
        query = query.filter(Notification.user_id == user_id)
    if is_read is not None:
        query = query.filter(Notification.is_read == is_read)
    
    total = query.count()
    notifications = query.order_by(Notification.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    results = []
    for n in notifications:
        user = db.query(User).filter(User.id == n.user_id).first()
        results.append({
            "id": n.id,
            "user": {
                "id": user.id if user else None,
                "name": user.full_name if user else "Unknown",
                "email": user.email if user else "Unknown"
            },
            "type": n.type,
            "title": n.title,
            "body": n.body,
            "action_url": n.action_url,
            "is_read": n.is_read,
            "created_at": n.created_at.isoformat() if n.created_at else None
        })
    
    return {
        "notifications": results,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit
    }

@router.post("/notifications/broadcast")
async def broadcast_notification(
    user_ids: List[int],
    type: str,
    title: str,
    body: str,
    action_url: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Broadcast notification to multiple users"""
    notifications = []
    for user_id in user_ids:
        notification = Notification(
            user_id=user_id,
            type=type,
            title=title,
            body=body,
            action_url=action_url,
            sent_via="push"
        )
        notifications.append(notification)
    
    db.add_all(notifications)
    db.commit()
    
    return {
        "message": f"Notification sent to {len(notifications)} users",
        "count": len(notifications)
    }

@router.post("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Mark a notification as read"""
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_read = True
    db.commit()
    
    return {"message": "Notification marked as read"}

# ==================== ANNOUNCEMENTS ====================

@router.get("/announcements")
async def get_announcements(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    target_role: Optional[str] = None,
    is_published: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get all announcements"""
    query = db.query(Announcement)
    
    if target_role:
        query = query.filter(Announcement.target_role == target_role)
    if is_published is not None:
        query = query.filter(Announcement.is_published == is_published)
    
    total = query.count()
    announcements = query.order_by(Announcement.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    results = []
    for a in announcements:
        author = db.query(User).filter(User.id == a.author_id).first()
        results.append({
            "id": a.id,
            "author": {
                "id": author.id if author else None,
                "name": author.full_name if author else "Unknown"
            },
            "title": a.title,
            "summary": a.summary,
            "announcement_type": a.announcement_type,
            "priority": a.priority,
            "target_role": a.target_role,
            "is_published": a.is_published,
            "published_at": a.published_at.isoformat() if a.published_at else None,
            "scheduled_for": a.scheduled_for.isoformat() if a.scheduled_for else None,
            "expires_at": a.expires_at.isoformat() if a.expires_at else None,
            "view_count": a.view_count,
            "created_at": a.created_at.isoformat() if a.created_at else None
        })
    
    return {
        "announcements": results,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit
    }

@router.post("/announcements")
async def create_announcement(
    title: str,
    content: str,
    summary: Optional[str] = None,
    announcement_type: str = "general",
    priority: str = "normal",
    target_role: Optional[str] = None,
    target_language_id: Optional[int] = None,
    target_course_id: Optional[int] = None,
    image_url: Optional[str] = None,
    action_url: Optional[str] = None,
    scheduled_for: Optional[datetime] = None,
    expires_at: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Create a new announcement"""
    announcement = Announcement(
        author_id=current_user.id,
        title=title,
        content=content,
        summary=summary,
        announcement_type=announcement_type,
        priority=priority,
        target_role=target_role,
        target_language_id=target_language_id,
        target_course_id=target_course_id,
        image_url=image_url,
        action_url=action_url,
        scheduled_for=scheduled_for,
        expires_at=expires_at
    )
    
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    
    # If scheduled for now, publish immediately
    if not scheduled_for or scheduled_for <= datetime.utcnow():
        announcement.is_published = True
        announcement.published_at = datetime.utcnow()
        db.commit()
    
    return {
        "message": "Announcement created",
        "announcement_id": announcement.id
    }

@router.patch("/announcements/{announcement_id}")
async def update_announcement(
    announcement_id: int,
    title: Optional[str] = None,
    content: Optional[str] = None,
    summary: Optional[str] = None,
    priority: Optional[str] = None,
    is_published: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Update an announcement"""
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    
    if title:
        announcement.title = title
    if content:
        announcement.content = content
    if summary:
        announcement.summary = summary
    if priority:
        announcement.priority = priority
    if is_published is not None:
        announcement.is_published = is_published
        if is_published and not announcement.published_at:
            announcement.published_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Announcement updated"}

@router.delete("/announcements/{announcement_id}")
async def delete_announcement(
    announcement_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Delete an announcement"""
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    
    db.delete(announcement)
    db.commit()
    
    return {"message": "Announcement deleted"}

# ==================== ADVANCED ANALYTICS ====================

@router.get("/analytics/extended")
async def get_extended_analytics(
    days: int = Query(30, ge=1, le=90),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get extended platform analytics with charts data"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # User stats
    total_users = db.query(User).count()
    new_users = db.query(User).filter(User.created_at >= start_date).count()
    active_users = db.query(User).filter(User.last_active_at >= start_date).count()
    
    # Role breakdown
    students = db.query(User).filter(User.role == "student").count()
    instructors = db.query(User).filter(User.role == "instructor").count()
    admins = db.query(User).filter(User.role == "admin").count()
    
    # Course stats
    total_courses = db.query(Course).count()
    published_courses = db.query(Course).filter(Course.is_published == True).count()
    pending_courses = db.query(Course).filter(Course.approval_status == "pending").count()
    
    # Enrollment stats
    total_enrollments = db.query(Enrollment).count()
    new_enrollments = db.query(Enrollment).filter(Enrollment.enrolled_at >= start_date).count()
    completed_enrollments = db.query(Enrollment).filter(Enrollment.completion_pct == 100).count()
    
    # Certificate stats
    total_certificates = db.query(Certificate).count()
    
    # Report stats
    open_reports = db.query(Report).filter(Report.status.in_(["submitted", "acknowledged", "in_progress"])).count()
    resolved_reports = db.query(Report).filter(Report.status == "resolved").count()
    
    # Daily user registrations for chart
    daily_registrations = []
    for i in range(days):
        day_start = datetime.utcnow() - timedelta(days=days - i - 1)
        day_end = day_start + timedelta(days=1)
        count = db.query(User).filter(
            User.created_at >= day_start,
            User.created_at < day_end
        ).count()
        daily_registrations.append({
            "date": day_start.strftime("%Y-%m-%d"),
            "count": count
        })
    
    # Daily enrollments for chart
    daily_enrollments = []
    for i in range(days):
        day_start = datetime.utcnow() - timedelta(days=days - i - 1)
        day_end = day_start + timedelta(days=1)
        count = db.query(Enrollment).filter(
            Enrollment.enrolled_at >= day_start,
            Enrollment.enrolled_at < day_end
        ).count()
        daily_enrollments.append({
            "date": day_start.strftime("%Y-%m-%d"),
            "count": count
        })
    
    return {
        "period_days": days,
        "users": {
            "total": total_users,
            "new": new_users,
            "active": active_users,
            "by_role": {
                "students": students,
                "instructors": instructors,
                "admins": admins
            }
        },
        "courses": {
            "total": total_courses,
            "published": published_courses,
            "pending": pending_courses
        },
        "enrollments": {
            "total": total_enrollments,
            "new": new_enrollments,
            "completed": completed_enrollments
        },
        "certificates": {
            "total": total_certificates
        },
        "reports": {
            "open": open_reports,
            "resolved": resolved_reports
        },
        "charts": {
            "daily_registrations": daily_registrations,
            "daily_enrollments": daily_enrollments
        }
    }

# ==================== ACTIVITY LOGS ====================

@router.get("/activity")
async def get_activity_logs(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    user_id: Optional[int] = None,
    activity_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get user activity logs"""
    from ...models.activity import UserActivity
    
    query = db.query(UserActivity)
    
    if user_id:
        query = query.filter(UserActivity.user_id == user_id)
    if activity_type:
        query = query.filter(UserActivity.activity_type == activity_type)
    
    total = query.count()
    activities = query.order_by(UserActivity.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    results = []
    for a in activities:
        user = db.query(User).filter(User.id == a.user_id).first()
        results.append({
            "id": a.id,
            "user": {
                "id": user.id if user else None,
                "name": user.full_name if user else "Unknown"
            },
            "activity_type": a.activity_type,
            "target_type": a.target_type,
            "target_id": a.target_id,
            "target_title": a.target_title,
            "xp_earned": a.xp_earned,
            "is_public": a.is_public,
            "created_at": a.created_at.isoformat() if a.created_at else None
        })
    
    return {
        "activities": results,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit
    }

# ==================== COURSE MANAGEMENT ====================

@router.get("/courses")
async def get_all_courses(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    level: Optional[str] = None,
    instructor_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get all courses with filters"""
    query = db.query(Course)
    
    if status:
        if status == "published":
            query = query.filter(Course.is_published == True)
        elif status == "draft":
            query = query.filter(Course.is_published == False)
        elif status == "pending":
            query = query.filter(Course.approval_status == "pending")
    
    if level:
        query = query.filter(Course.level == level)
    
    if instructor_id:
        query = query.filter(Course.instructor_id == instructor_id)
    
    if search:
        query = query.filter(Course.title.ilike(f"%{search}%"))
    
    total = query.count()
    courses = query.order_by(Course.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    results = []
    for c in courses:
        instructor = db.query(User).filter(User.id == c.instructor_id).first()
        enrollment_count = db.query(Enrollment).filter(Enrollment.course_id == c.id).count()
        
        results.append({
            "id": c.id,
            "title": c.title,
            "slug": c.slug,
            "instructor": {
                "id": instructor.id if instructor else None,
                "name": instructor.full_name if instructor else "Unknown"
            },
            "level": c.level,
            "goal": c.goal,
            "price_usd": float(c.price_usd) if c.price_usd else 0,
            "is_free": c.is_free,
            "is_published": c.is_published,
            "approval_status": c.approval_status,
            "total_enrollments": enrollment_count,
            "avg_rating": float(c.avg_rating) if c.avg_rating else 0,
            "rating_count": c.rating_count,
            "created_at": c.created_at.isoformat() if c.created_at else None
        })
    
    return {
        "courses": results,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit
    }

@router.get("/courses/{course_id}")
async def get_course_details(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get detailed course info"""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    instructor = db.query(User).filter(User.id == course.instructor_id).first()
    
    # Get enrollments
    enrollments = db.query(Enrollment).filter(Enrollment.course_id == course_id).all()
    
    # Get lessons count
    from ...models.course import Lesson
    lessons_count = db.query(Lesson).filter(Lesson.course_id == course_id).count()
    
    return {
        "course": {
            "id": course.id,
            "title": course.title,
            "slug": course.slug,
            "description": course.description,
            "thumbnail_url": course.thumbnail_url,
            "level": course.level,
            "goal": course.goal,
            "price_usd": float(course.price_usd) if course.price_usd else 0,
            "is_free": course.is_free,
            "is_published": course.is_published,
            "approval_status": course.approval_status,
            "rejection_reason": course.rejection_reason,
            "has_certificate": course.has_certificate,
            "has_offline_access": course.has_offline_access,
            "total_duration_min": course.total_duration_min,
            "total_lessons": lessons_count,
            "avg_rating": float(course.avg_rating) if course.avg_rating else 0,
            "rating_count": course.rating_count,
            "created_at": course.created_at.isoformat() if course.created_at else None,
            "updated_at": course.updated_at.isoformat() if course.updated_at else None
        },
        "instructor": {
            "id": instructor.id if instructor else None,
            "name": instructor.full_name if instructor else "Unknown",
            "email": instructor.email if instructor else "Unknown"
        },
        "enrollments": {
            "total": len(enrollments),
            "completed": len([e for e in enrollments if e.completion_pct == 100]),
            "active": len([e for e in enrollments if e.completion_pct < 100 and not e.refunded_at])
        }
    }

@router.post("/courses/{course_id}/publish")
async def publish_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Publish a course"""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    course.is_published = True
    course.approval_status = "approved"
    
    # Log action
    audit = AdminAuditLog(
        admin_user_id=current_user.id,
        action="publish_course",
        target_type="course",
        target_id=course_id
    )
    db.add(audit)
    db.commit()
    
    return {"message": "Course published"}

@router.post("/courses/{course_id}/unpublish")
async def unpublish_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Unpublish a course"""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    course.is_published = False
    
    # Log action
    audit = AdminAuditLog(
        admin_user_id=current_user.id,
        action="unpublish_course",
        target_type="course",
        target_id=course_id
    )
    db.add(audit)
    db.commit()
    
    return {"message": "Course unpublished"}

# ==================== ENROLLMENT MANAGEMENT ====================

@router.get("/enrollments")
async def get_all_enrollments(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    course_id: Optional[int] = None,
    user_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get all enrollments with filters"""
    query = db.query(Enrollment)
    
    if course_id:
        query = query.filter(Enrollment.course_id == course_id)
    if user_id:
        query = query.filter(Enrollment.user_id == user_id)
    
    if status == "active":
        query = query.filter(Enrollment.completion_pct < 100, Enrollment.refunded_at.is_(None))
    elif status == "completed":
        query = query.filter(Enrollment.completion_pct == 100)
    elif status == "refunded":
        query = query.filter(Enrollment.refunded_at.isnot(None))
    
    total = query.count()
    enrollments = query.order_by(Enrollment.enrolled_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    results = []
    for e in enrollments:
        student = db.query(User).filter(User.id == e.user_id).first()
        course = db.query(Course).filter(Course.id == e.course_id).first()
        
        results.append({
            "id": e.id,
            "student": {
                "id": student.id if student else None,
                "name": student.full_name if student else "Unknown",
                "email": student.email if student else "Unknown"
            },
            "course": {
                "id": course.id if course else None,
                "title": course.title if course else "Unknown"
            },
            "progress": e.completion_pct,
            "enrolled_at": e.enrolled_at.isoformat() if e.enrolled_at else None,
            "completed_at": e.completed_at.isoformat() if e.completed_at else None,
            "last_accessed_at": e.last_accessed_at.isoformat() if e.last_accessed_at else None,
            "has_certificate": e.certificate_url is not None,
            "is_refunded": e.refunded_at is not None
        })
    
    return {
        "enrollments": results,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit
    }

# ==================== COURSE EDIT/DELETE APPROVAL WORKFLOW ====================

from ...models.course import CourseEditRequest

@router.get("/course-requests")
async def get_course_requests(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    request_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get all course edit/delete requests"""
    query = db.query(CourseEditRequest)
    
    if status:
        query = query.filter(CourseEditRequest.status == status)
    if request_type:
        query = query.filter(CourseEditRequest.request_type == request_type)
    
    total = query.count()
    requests = query.order_by(CourseEditRequest.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    results = []
    for r in requests:
        course = db.query(Course).filter(Course.id == r.course_id).first()
        instructor = db.query(User).filter(User.id == r.instructor_id).first()
        
        results.append({
            "id": r.id,
            "course_id": r.course_id,
            "course_title": course.title if course else "Unknown",
            "instructor_id": r.instructor_id,
            "instructor_name": instructor.full_name if instructor else "Unknown",
            "request_type": r.request_type,
            "status": r.status,
            "old_values": r.old_values,
            "new_values": r.new_values,
            "reason": r.reason,
            "admin_comment": r.admin_comment,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "reviewed_at": r.reviewed_at.isoformat() if r.reviewed_at else None
        })
    
    return {
        "requests": results,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit
    }

@router.get("/course-requests/{request_id}")
async def get_course_request_details(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get course request details"""
    request = db.query(CourseEditRequest).filter(CourseEditRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    course = db.query(Course).filter(Course.id == request.course_id).first()
    instructor = db.query(User).filter(User.id == request.instructor_id).first()
    
    return {
        "request": {
            "id": request.id,
            "course_id": request.course_id,
            "course_title": course.title if course else "Unknown",
            "instructor_id": request.instructor_id,
            "instructor_name": instructor.full_name if instructor else "Unknown",
            "request_type": request.request_type,
            "status": request.status,
            "old_values": request.old_values,
            "new_values": request.new_values,
            "reason": request.reason,
            "admin_comment": request.admin_comment,
            "created_at": request.created_at.isoformat() if request.created_at else None,
            "reviewed_at": request.reviewed_at.isoformat() if request.reviewed_at else None
        }
    }

@router.post("/course-requests/{request_id}/approve")
async def approve_course_request(
    request_id: int,
    comment: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Approve a course edit/delete request"""
    request = db.query(CourseEditRequest).filter(CourseEditRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    if request.status != "pending":
        raise HTTPException(status_code=400, detail="Request is not pending")
    
    course = db.query(Course).filter(Course.id == request.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Process the request based on type
    if request.request_type == "edit":
        # Apply the changes
        if request.new_values:
            for key, value in request.new_values.items():
                if hasattr(course, key):
                    setattr(course, key, value)
    elif request.request_type == "delete":
        # Mark course for deletion (soft delete)
        course.is_deleted = True
    
    # Update request status
    request.status = "approved"
    request.admin_comment = comment
    request.reviewed_at = datetime.utcnow()
    request.reviewed_by = current_user.id
    
    # Log action
    audit = AdminAuditLog(
        admin_user_id=current_user.id,
        action=f"approve_course_{request.request_type}",
        target_type="course",
        target_id=request.course_id,
        notes=f"Approved {request.request_type} request"
    )
    db.add(audit)
    
    # Notify instructor
    notification = Notification(
        user_id=request.instructor_id,
        type="course_approved",
        title=f"Course {request.request_type} approved",
        body=f"Your {request.request_type} request for '{course.title}' has been approved.",
        action_url=f"/instructor/my-courses",
        source_type="course",
        source_id=course.id
    )
    db.add(notification)
    
    db.commit()
    
    return {"message": f"Course {request.request_type} request approved"}

@router.post("/course-requests/{request_id}/reject")
async def reject_course_request(
    request_id: int,
    reason: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Reject a course edit/delete request"""
    request = db.query(CourseEditRequest).filter(CourseEditRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    if request.status != "pending":
        raise HTTPException(status_code=400, detail="Request is not pending")
    
    course = db.query(Course).filter(Course.id == request.course_id).first()
    
    # Update request status
    request.status = "rejected"
    request.admin_comment = reason
    request.reviewed_at = datetime.utcnow()
    request.reviewed_by = current_user.id
    
    # Log action
    audit = AdminAuditLog(
        admin_user_id=current_user.id,
        action=f"reject_course_{request.request_type}",
        target_type="course",
        target_id=request.course_id,
        notes=reason
    )
    db.add(audit)
    
    # Notify instructor
    notification = Notification(
        user_id=request.instructor_id,
        type="course_rejected",
        title=f"Course {request.request_type} rejected",
        body=f"Your {request.request_type} request for '{course.title if course else 'a course'}' has been rejected. Reason: {reason}",
        action_url=f"/instructor/my-courses",
        source_type="course",
        source_id=request.course_id
    )
    db.add(notification)
    
    db.commit()
    
    return {"message": f"Course {request.request_type} request rejected"}
