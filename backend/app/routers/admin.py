from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import get_db, User, Course, Enrollment, Payment, Payout, LiveSession, MonthlyRevenue, RoleEnum, StatusEnum
from app.auth import require_role
from typing import Optional

router = APIRouter(prefix="/api/admin", tags=["admin"])
guard = require_role(RoleEnum.admin)

@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db), _=Depends(guard)):
    total_users = db.query(User).count()
    total_revenue = db.query(func.sum(Payment.amount)).filter(Payment.status == "completed").scalar() or 0
    active_courses = db.query(Course).filter(Course.status == "published").count()
    pending_payouts = db.query(Payout).filter(Payout.status == "pending").count()
    pulse_dist = {}
    for state in ["thriving","coasting","struggling","burning_out","disengaged"]:
        pulse_dist[state] = db.query(User).filter(User.pulse_state == state).count()
    monthly = db.query(MonthlyRevenue).filter(MonthlyRevenue.instructor_id == None).order_by(MonthlyRevenue.year, MonthlyRevenue.month).all()
    return {
        "total_users": total_users,
        "total_revenue": round(total_revenue, 2),
        "active_courses": active_courses,
        "pending_payouts": pending_payouts,
        "pulse_distribution": pulse_dist,
        "monthly_revenue": [{"month": r.month, "year": r.year, "gross": r.gross, "net": r.net} for r in monthly]
    }

@router.get("/users")
def list_users(role: Optional[str] = None, status: Optional[str] = None, search: Optional[str] = None, db: Session = Depends(get_db), _=Depends(guard)):
    q = db.query(User)
    if role: q = q.filter(User.role == role)
    if status: q = q.filter(User.status == status)
    if search: q = q.filter((User.name.ilike(f"%{search}%")) | (User.email.ilike(f"%{search}%")))
    users = q.order_by(User.created_at.desc()).limit(100).all()
    return [{"id": u.id, "name": u.name, "email": u.email, "role": u.role, "status": u.status, "avatar_initials": u.avatar_initials, "created_at": u.created_at, "last_active": u.last_active, "is_verified": u.is_verified} for u in users]

@router.patch("/users/{user_id}/status")
def update_user_status(user_id: int, body: dict, db: Session = Depends(get_db), _=Depends(guard)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user: return {"error": "not found"}
    user.status = body.get("status", user.status)
    db.commit()
    return {"ok": True}

@router.get("/instructors")
def list_instructors(db: Session = Depends(get_db), _=Depends(guard)):
    instructors = db.query(User).filter(User.role == RoleEnum.instructor).all()
    result = []
    for ins in instructors:
        courses = db.query(Course).filter(Course.instructor_id == ins.id).count()
        students = db.query(Enrollment).join(Course).filter(Course.instructor_id == ins.id).count()
        revenue = db.query(func.sum(Payment.amount)).join(Course, Payment.course_id == Course.id).filter(Course.instructor_id == ins.id, Payment.status == "completed").scalar() or 0
        result.append({"id": ins.id, "name": ins.name, "email": ins.email, "status": ins.status, "is_verified": ins.is_verified, "avatar_initials": ins.avatar_initials, "courses": courses, "students": students, "revenue_mtd": round(revenue * 0.7, 2)})
    return result

@router.patch("/instructors/{user_id}/verify")
def verify_instructor(user_id: int, db: Session = Depends(get_db), _=Depends(guard)):
    user = db.query(User).filter(User.id == user_id).first()
    if user: user.is_verified = True; user.status = StatusEnum.active; db.commit()
    return {"ok": True}

@router.get("/courses")
def list_courses(status: Optional[str] = None, db: Session = Depends(get_db), _=Depends(guard)):
    q = db.query(Course)
    if status: q = q.filter(Course.status == status)
    courses = q.order_by(Course.created_at.desc()).all()
    result = []
    for c in courses:
        students = db.query(Enrollment).filter(Enrollment.course_id == c.id).count()
        revenue = db.query(func.sum(Payment.amount)).filter(Payment.course_id == c.id, Payment.status == "completed").scalar() or 0
        ins = db.query(User).filter(User.id == c.instructor_id).first()
        result.append({"id": c.id, "title": c.title, "language": c.language, "level": c.level, "flag_emoji": c.flag_emoji, "status": c.status, "instructor": ins.name if ins else "", "students": students, "revenue": round(revenue, 2), "created_at": c.created_at})
    return result

@router.patch("/courses/{course_id}/status")
def update_course_status(course_id: int, body: dict, db: Session = Depends(get_db), _=Depends(guard)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if course: course.status = body.get("status"); db.commit()
    return {"ok": True}

@router.get("/revenue")
def revenue_report(db: Session = Depends(get_db), _=Depends(guard)):
    total_gross = db.query(func.sum(Payment.amount)).filter(Payment.status == "completed").scalar() or 0
    monthly = db.query(MonthlyRevenue).filter(MonthlyRevenue.instructor_id == None).order_by(MonthlyRevenue.year, MonthlyRevenue.month).all()
    top_courses = db.query(Course.title, func.sum(Payment.amount).label("gross"), func.count(Enrollment.id).label("students")).join(Payment, Payment.course_id == Course.id).join(Enrollment, Enrollment.course_id == Course.id).filter(Payment.status == "completed").group_by(Course.id).order_by(func.sum(Payment.amount).desc()).limit(10).all()
    return {
        "total_gross": round(total_gross, 2),
        "platform_fee": round(total_gross * 0.3, 2),
        "instructor_payouts": round(total_gross * 0.7, 2),
        "monthly": [{"month": r.month, "year": r.year, "gross": r.gross, "net": r.net} for r in monthly],
        "top_courses": [{"title": t, "gross": round(g, 2), "students": s} for t, g, s in top_courses]
    }

@router.get("/payouts")
def list_payouts(status: Optional[str] = None, db: Session = Depends(get_db), _=Depends(guard)):
    q = db.query(Payout)
    if status: q = q.filter(Payout.status == status)
    payouts = q.order_by(Payout.requested_at.desc()).all()
    result = []
    for p in payouts:
        ins = db.query(User).filter(User.id == p.instructor_id).first()
        result.append({"id": p.id, "reference": p.reference, "instructor": ins.name if ins else "", "avatar_initials": ins.avatar_initials if ins else "", "amount": p.amount, "status": p.status, "requested_at": p.requested_at, "paid_at": p.paid_at})
    return result

@router.patch("/payouts/{payout_id}/status")
def update_payout(payout_id: int, body: dict, db: Session = Depends(get_db), _=Depends(guard)):
    payout = db.query(Payout).filter(Payout.id == payout_id).first()
    if payout:
        payout.status = body.get("status")
        if body.get("status") == "paid":
            from datetime import datetime
            payout.paid_at = datetime.utcnow()
        db.commit()
    return {"ok": True}

@router.get("/pulse")
def pulse_engine(db: Session = Depends(get_db), _=Depends(guard)):
    dist = {}
    for state in ["thriving","coasting","struggling","burning_out","disengaged"]:
        dist[state] = db.query(User).filter(User.pulse_state == state).count()
    at_risk = db.query(User).filter(User.pulse_state.in_(["burning_out","disengaged"])).order_by(User.last_active).limit(10).all()
    return {
        "distribution": dist,
        "total": sum(dist.values()),
        "at_risk": [{"id": u.id, "name": u.name, "pulse_state": u.pulse_state, "last_active": u.last_active} for u in at_risk]
    }

@router.get("/notifications")
def list_notifications(db: Session = Depends(get_db), _=Depends(guard)):
    notifs = db.query(Notification).order_by(Notification.sent_at.desc()).all()
    return [{"id": n.id, "title": n.title, "message": n.message, "target": n.target, "sent_at": n.sent_at, "recipients": n.recipients, "read_rate": n.read_rate} for n in notifs]

@router.post("/notifications")
def send_notification(body: dict, db: Session = Depends(get_db), _=Depends(guard)):
    from app.models import Notification
    n = Notification(title=body["title"], message=body["message"], target=body.get("target","all"), recipients=body.get("recipients",0))
    db.add(n); db.commit()
    return {"ok": True}

@router.get("/audit-log")
def audit_log(db: Session = Depends(get_db), _=Depends(guard)):
    from app.models import AuditLog
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(100).all()
    result = []
    for l in logs:
        admin = db.query(User).filter(User.id == l.admin_id).first()
        result.append({"id": l.id, "admin": admin.name if admin else "System", "action_type": l.action_type, "description": l.description, "created_at": l.created_at})
    return result

@router.get("/reports")
def list_reports(status: Optional[str] = None, db: Session = Depends(get_db), _=Depends(guard)):
    from app.models import Report
    q = db.query(Report)
    if status: q = q.filter(Report.status == status)
    reports = q.order_by(Report.created_at.desc()).all()
    return [{"id": r.id, "report_type": r.report_type, "content": r.content, "status": r.status, "created_at": r.created_at} for r in reports]

@router.patch("/reports/{report_id}")
def update_report(report_id: int, body: dict, db: Session = Depends(get_db), _=Depends(guard)):
    from app.models import Report
    r = db.query(Report).filter(Report.id == report_id).first()
    if r: r.status = body.get("status", r.status); db.commit()
    return {"ok": True}

@router.get("/live-sessions")
def admin_live_sessions(db: Session = Depends(get_db), _=Depends(guard)):
    sessions = db.query(LiveSession).order_by(LiveSession.scheduled_at.desc()).limit(50).all()
    result = []
    for s in sessions:
        course = db.query(Course).filter(Course.id == s.course_id).first()
        ins = db.query(User).filter(User.id == course.instructor_id).first() if course else None
        result.append({"id": s.id, "title": s.title, "course": course.title if course else "", "instructor": ins.name if ins else "", "scheduled_at": s.scheduled_at, "attendees": s.attendees, "status": s.status, "recording_url": s.recording_url})
    return result

@router.get("/analytics")
def analytics(db: Session = Depends(get_db), _=Depends(guard)):
    total_users = db.query(User).count()
    total_revenue = db.query(func.sum(Payment.amount)).filter(Payment.status == "completed").scalar() or 0
    active_courses = db.query(Course).filter(Course.status == "published").count()
    avg_completion = db.query(func.avg(Enrollment.completion_pct)).scalar() or 0
    monthly = db.query(MonthlyRevenue).filter(MonthlyRevenue.instructor_id == None).order_by(MonthlyRevenue.year, MonthlyRevenue.month).all()
    top_courses = db.query(Course.title, func.count(Enrollment.id).label("students"), func.sum(Payment.amount).label("revenue")).outerjoin(Enrollment, Enrollment.course_id == Course.id).outerjoin(Payment, Payment.course_id == Course.id).group_by(Course.id).order_by(func.count(Enrollment.id).desc()).limit(5).all()
    top_instructors = db.query(User).filter(User.role == RoleEnum.instructor).limit(5).all()
    return {
        "total_users": total_users,
        "total_revenue": round(total_revenue, 2),
        "active_courses": active_courses,
        "avg_completion": round(avg_completion, 1),
        "monthly": [{"month": r.month, "year": r.year, "gross": r.gross, "net": r.net} for r in monthly],
        "top_courses": [{"title": t, "students": s or 0, "revenue": round(r or 0, 2)} for t, s, r in top_courses],
        "top_instructors": [{"id": u.id, "name": u.name, "avatar_initials": u.avatar_initials} for u in top_instructors]
    }

@router.get("/geo")
def geo_data(db: Session = Depends(get_db), _=Depends(guard)):
    return {
        "countries": [
            {"flag": "🇷🇼", "name": "Rwanda", "users": 6420},
            {"flag": "🇳🇬", "name": "Nigeria", "users": 5440},
            {"flag": "🇬🇭", "name": "Ghana", "users": 4160},
            {"flag": "🇰🇪", "name": "Kenya", "users": 3620},
            {"flag": "🇸🇦", "name": "Saudi Arabia", "users": 2415},
            {"flag": "🇫🇷", "name": "France", "users": 1970},
            {"flag": "🇧🇷", "name": "Brazil", "users": 1360},
            {"flag": "🌍", "name": "Other (40)", "users": 3056}
        ],
        "languages": [
            {"flag": "🇫🇷", "name": "French", "users": 9820},
            {"flag": "🇬🇧", "name": "English", "users": 8401},
            {"flag": "🇪🇸", "name": "Spanish", "users": 6234},
            {"flag": "🇩🇪", "name": "German", "users": 2880},
            {"flag": "🇯🇵", "name": "Japanese", "users": 1920},
            {"flag": "🇨🇳", "name": "Mandarin", "users": 1080}
        ]
    }

@router.get("/payments")
def list_payments(status: Optional[str] = None, search: Optional[str] = None, db: Session = Depends(get_db), _=Depends(guard)):
    q = db.query(Payment)
    if status: q = q.filter(Payment.status == status)
    payments = q.order_by(Payment.created_at.desc()).limit(100).all()
    result = []
    for p in payments:
        user = db.query(User).filter(User.id == p.user_id).first()
        course = db.query(Course).filter(Course.id == p.course_id).first()
        result.append({"id": p.id, "user": user.name if user else "", "course": course.title if course else "", "amount": p.amount, "method": p.method, "status": p.status, "created_at": p.created_at})
    return result

@router.get("/admins")
def list_admins(db: Session = Depends(get_db), _=Depends(guard)):
    admins = db.query(User).filter(User.role == RoleEnum.admin).all()
    return [{"id": u.id, "name": u.name, "email": u.email, "avatar_initials": u.avatar_initials, "last_active": u.last_active} for u in admins]

@router.get("/settings")
def get_settings(_=Depends(guard)):
    return {
        "platform_name": "FluentFusion",
        "tagline": "Learn Languages. Change Lives.",
        "default_language": "English",
        "allow_registrations": True,
        "require_instructor_verification": True,
        "enable_pulse": True,
        "platform_fee_pct": 30
    }

@router.patch("/settings")
def update_settings(body: dict, _=Depends(guard)):
    return {"ok": True, "settings": body}
