from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_
from database import get_db
from auth import get_current_user, get_current_admin, get_current_instructor
from schemas import (
    AdminDashboardStats, InstructorDashboardStats, PulseStats,
    EnrollmentOut, PulseRecordOut, QuizOut, QuizCreate,
    MessageOut, MessageCreate, NotificationOut, NotificationCreate,
    PayoutOut, PayoutUpdate, AuditLogOut, SettingOut, SettingUpdate,
    LiveSessionOut, LiveSessionCreate
)
import models
from datetime import datetime, timedelta
import random

# ─── Dashboard ──────────────────────────────────────────
dashboard_router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@dashboard_router.get("/admin", response_model=AdminDashboardStats)
def admin_dashboard(db: Session = Depends(get_db), _: models.User = Depends(get_current_admin)):
    total_users = db.query(models.User).count()
    total_students = db.query(models.User).filter(models.User.role == models.UserRole.student).count()
    total_instructors = db.query(models.User).filter(models.User.role == models.UserRole.instructor).count()
    total_courses = db.query(models.Course).count()
    active_courses = db.query(models.Course).filter(models.Course.status == models.CourseStatus.active).count()
    pending_courses = db.query(models.Course).filter(models.Course.status == models.CourseStatus.pending).count()

    total_revenue = db.query(func.coalesce(func.sum(models.User.total_revenue), 0)).filter(
        models.User.role == models.UserRole.instructor
    ).scalar() or 0

    # Approximate monthly revenue from payouts
    now = datetime.utcnow()
    month_start = now.replace(day=1, hour=0, minute=0, second=0)
    monthly_revenue = db.query(func.coalesce(func.sum(models.Payout.amount), 0)).filter(
        models.Payout.created_at >= month_start
    ).scalar() or 0

    total_enrollments = db.query(models.Enrollment).count()
    active_learners = db.query(models.Enrollment).filter(
        models.Enrollment.last_active_at >= now - timedelta(days=30)
    ).distinct(models.Enrollment.student_id).count()

    return AdminDashboardStats(
        total_users=total_users,
        total_students=total_students,
        total_instructors=total_instructors,
        total_courses=total_courses,
        active_courses=active_courses,
        pending_courses=pending_courses,
        total_revenue=float(total_revenue),
        monthly_revenue=float(monthly_revenue),
        total_enrollments=total_enrollments,
        active_learners=active_learners
    )


@dashboard_router.get("/instructor", response_model=InstructorDashboardStats)
def instructor_dashboard(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_instructor)):
    courses = db.query(models.Course).filter(models.Course.instructor_id == current_user.id).all()
    course_ids = [c.id for c in courses]

    total_students = db.query(models.Enrollment).filter(
        models.Enrollment.course_id.in_(course_ids)
    ).distinct(models.Enrollment.student_id).count() if course_ids else 0

    total_lessons = db.query(models.Lesson).filter(
        models.Lesson.course_id.in_(course_ids)
    ).count() if course_ids else 0

    avg_rating = db.query(func.avg(models.Course.rating)).filter(
        models.Course.instructor_id == current_user.id
    ).scalar() or 0

    now = datetime.utcnow()
    month_start = now.replace(day=1, hour=0, minute=0, second=0)
    monthly_revenue = db.query(func.coalesce(func.sum(models.Payout.amount), 0)).filter(
        models.Payout.instructor_id == current_user.id,
        models.Payout.created_at >= month_start
    ).scalar() or 0

    # Pulse stats for instructor's students
    student_ids_subq = db.query(models.Enrollment.student_id).filter(
        models.Enrollment.course_id.in_(course_ids)
    ).distinct().subquery() if course_ids else None

    pulse_counts = {s.value: 0 for s in models.PulseState}
    if student_ids_subq is not None:
        latest_pulses = db.query(models.PulseRecord).filter(
            models.PulseRecord.user_id.in_(student_ids_subq)
        ).all()
        seen = {}
        for p in sorted(latest_pulses, key=lambda x: x.recorded_at, reverse=True):
            if p.user_id not in seen:
                seen[p.user_id] = p
                pulse_counts[p.state.value] += 1

    total_pulse = sum(pulse_counts.values())
    pulse_stats = PulseStats(
        thriving=pulse_counts.get("thriving", 0),
        coasting=pulse_counts.get("coasting", 0),
        struggling=pulse_counts.get("struggling", 0),
        burning_out=pulse_counts.get("burning_out", 0),
        disengaged=pulse_counts.get("disengaged", 0),
        total=total_pulse
    )

    return InstructorDashboardStats(
        total_students=total_students,
        total_courses=len(courses),
        total_revenue=float(current_user.total_revenue or 0),
        monthly_revenue=float(monthly_revenue),
        avg_rating=float(avg_rating),
        total_lessons=total_lessons,
        pulse_stats=pulse_stats
    )


@dashboard_router.get("/admin/revenue-trend")
def admin_revenue_trend(db: Session = Depends(get_db), _: models.User = Depends(get_current_admin)):
    """Return monthly revenue for the last 12 months."""
    now = datetime.utcnow()
    months = []
    for i in range(11, -1, -1):
        month_start = (now.replace(day=1) - timedelta(days=30 * i)).replace(day=1, hour=0, minute=0, second=0)
        month_end = (month_start + timedelta(days=32)).replace(day=1)
        revenue = db.query(func.coalesce(func.sum(models.Payout.amount), 0)).filter(
            models.Payout.created_at >= month_start,
            models.Payout.created_at < month_end
        ).scalar() or 0
        months.append({
            "month": month_start.strftime("%b"),
            "revenue": float(revenue),
            "enrollments": random.randint(200, 800)
        })
    return months


@dashboard_router.get("/admin/pulse-platform")
def admin_pulse_platform(db: Session = Depends(get_db), _: models.User = Depends(get_current_admin)):
    """Platform-wide PULSE statistics."""
    pulse_counts = {s.value: 0 for s in models.PulseState}
    latest_pulses = db.query(models.PulseRecord).all()
    seen = {}
    for p in sorted(latest_pulses, key=lambda x: x.recorded_at, reverse=True):
        if p.user_id not in seen:
            seen[p.user_id] = p
            pulse_counts[p.state.value] += 1
    total = sum(pulse_counts.values())
    return {**pulse_counts, "total": total}


# ─── Enrollments ────────────────────────────────────────
enrollment_router = APIRouter(prefix="/enrollments", tags=["enrollments"])


@enrollment_router.get("", response_model=list[EnrollmentOut])
def list_enrollments(
    course_id: int = None,
    student_id: int = None,
    page: int = 1,
    per_page: int = 20,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    q = db.query(models.Enrollment)
    if current_user.role == models.UserRole.instructor:
        course_ids = [c.id for c in db.query(models.Course).filter(models.Course.instructor_id == current_user.id).all()]
        q = q.filter(models.Enrollment.course_id.in_(course_ids))
    elif current_user.role == models.UserRole.student:
        q = q.filter(models.Enrollment.student_id == current_user.id)

    if course_id:
        q = q.filter(models.Enrollment.course_id == course_id)
    if student_id and current_user.role == models.UserRole.admin:
        q = q.filter(models.Enrollment.student_id == student_id)

    enrollments = q.offset((page - 1) * per_page).limit(per_page).all()
    result = []
    for e in enrollments:
        out = EnrollmentOut.model_validate(e)
        if e.student:
            out.student_name = e.student.full_name
            out.student_email = e.student.email
        if e.course:
            out.course_title = e.course.title
        # Get latest pulse
        pulse = db.query(models.PulseRecord).filter(
            models.PulseRecord.user_id == e.student_id
        ).order_by(desc(models.PulseRecord.recorded_at)).first()
        if pulse:
            out.pulse_state = pulse.state.value
        result.append(out)
    return result


# ─── PULSE ──────────────────────────────────────────────
pulse_router = APIRouter(prefix="/pulse", tags=["pulse"])


@pulse_router.get("/stats", response_model=PulseStats)
def pulse_stats(
    course_id: int = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    q = db.query(models.PulseRecord)
    if course_id or current_user.role == models.UserRole.instructor:
        if current_user.role == models.UserRole.instructor:
            course_ids = [c.id for c in db.query(models.Course).filter(
                models.Course.instructor_id == current_user.id).all()]
            student_ids = db.query(models.Enrollment.student_id).filter(
                models.Enrollment.course_id.in_(course_ids)).distinct()
            q = q.filter(models.PulseRecord.user_id.in_(student_ids))
        elif course_id:
            student_ids = db.query(models.Enrollment.student_id).filter(
                models.Enrollment.course_id == course_id).distinct()
            q = q.filter(models.PulseRecord.user_id.in_(student_ids))

    records = q.all()
    seen = {}
    counts = {s.value: 0 for s in models.PulseState}
    for p in sorted(records, key=lambda x: x.recorded_at, reverse=True):
        if p.user_id not in seen:
            seen[p.user_id] = p
            counts[p.state.value] += 1

    return PulseStats(
        thriving=counts["thriving"],
        coasting=counts["coasting"],
        struggling=counts["struggling"],
        burning_out=counts["burning_out"],
        disengaged=counts["disengaged"],
        total=sum(counts.values())
    )


# ─── Quizzes ────────────────────────────────────────────
quiz_router = APIRouter(prefix="/quizzes", tags=["quizzes"])


@quiz_router.get("", response_model=list[QuizOut])
def list_quizzes(
    course_id: int = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    q = db.query(models.Quiz)
    if current_user.role == models.UserRole.instructor:
        course_ids = [c.id for c in db.query(models.Course).filter(
            models.Course.instructor_id == current_user.id).all()]
        q = q.filter(models.Quiz.course_id.in_(course_ids))
    if course_id:
        q = q.filter(models.Quiz.course_id == course_id)
    return q.all()


@quiz_router.post("", response_model=QuizOut)
def create_quiz(
    course_id: int, payload: QuizCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_instructor)
):
    quiz = models.Quiz(
        **payload.model_dump(),
        course_id=course_id,
        total_questions=len(payload.questions)
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    return quiz


@quiz_router.patch("/{quiz_id}", response_model=QuizOut)
def update_quiz(quiz_id: int, payload: QuizCreate, db: Session = Depends(get_db), _: models.User = Depends(get_current_instructor)):
    quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(404, "Quiz not found")
    quiz.title = payload.title
    quiz.description = payload.description
    quiz.questions = payload.questions
    quiz.total_questions = len(payload.questions)
    db.commit()
    db.refresh(quiz)
    return quiz


@quiz_router.delete("/{quiz_id}")
def delete_quiz(quiz_id: int, db: Session = Depends(get_db), _: models.User = Depends(get_current_instructor)):
    quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(404, "Quiz not found")
    db.delete(quiz)
    db.commit()
    return {"message": "Quiz deleted"}


# ─── Messages ───────────────────────────────────────────
message_router = APIRouter(prefix="/messages", tags=["messages"])


@message_router.get("", response_model=list[MessageOut])
def list_messages(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    msgs = db.query(models.Message).filter(models.Message.recipient_id == current_user.id).order_by(
        desc(models.Message.created_at)
    ).limit(50).all()
    result = []
    for m in msgs:
        out = MessageOut.model_validate(m)
        if m.sender:
            out.sender_name = m.sender.full_name
        result.append(out)
    return result


@message_router.post("", response_model=MessageOut)
def send_message(payload: MessageCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    msg = models.Message(
        sender_id=current_user.id,
        recipient_id=payload.recipient_id,
        subject=payload.subject,
        body=payload.body
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    out = MessageOut.model_validate(msg)
    out.sender_name = current_user.full_name
    return out


@message_router.post("/{message_id}/read")
def mark_read(message_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    msg = db.query(models.Message).filter(
        models.Message.id == message_id, models.Message.recipient_id == current_user.id
    ).first()
    if not msg:
        raise HTTPException(404, "Message not found")
    msg.is_read = True
    db.commit()
    return {"message": "Marked as read"}


# ─── Notifications ──────────────────────────────────────
notification_router = APIRouter(prefix="/notifications", tags=["notifications"])


@notification_router.get("", response_model=list[NotificationOut])
def list_notifications(db: Session = Depends(get_db), _: models.User = Depends(get_current_admin)):
    return db.query(models.Notification).order_by(desc(models.Notification.sent_at)).all()


@notification_router.post("", response_model=NotificationOut)
def send_notification(
    payload: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin)
):
    target_role = payload.target_role
    if target_role == "all":
        recipients = db.query(models.User).count()
    elif target_role == "student":
        recipients = db.query(models.User).filter(models.User.role == models.UserRole.student).count()
    else:
        recipients = db.query(models.User).filter(models.User.role == models.UserRole.instructor).count()

    notif = models.Notification(
        title=payload.title,
        message=payload.message,
        target_role=payload.target_role,
        is_email=payload.is_email,
        is_push=payload.is_push,
        recipients_count=recipients,
        read_rate=0.0
    )
    db.add(notif)
    db.add(models.AuditLog(
        admin_id=current_user.id, action_type="SYSTEM",
        description=f"Admin {current_user.full_name} sent notification '{payload.title}' to {target_role}"
    ))
    db.commit()
    db.refresh(notif)
    return notif


# ─── Payouts ────────────────────────────────────────────
payout_router = APIRouter(prefix="/payouts", tags=["payouts"])


@payout_router.get("", response_model=list[PayoutOut])
def list_payouts(
    status: str = None,
    instructor_id: int = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    q = db.query(models.Payout)
    if current_user.role == models.UserRole.instructor:
        q = q.filter(models.Payout.instructor_id == current_user.id)
    elif instructor_id:
        q = q.filter(models.Payout.instructor_id == instructor_id)
    if status:
        q = q.filter(models.Payout.status == status)
    payouts = q.order_by(desc(models.Payout.created_at)).all()
    result = []
    for p in payouts:
        out = PayoutOut.model_validate(p)
        if p.instructor:
            out.instructor_name = p.instructor.full_name
        result.append(out)
    return result


@payout_router.patch("/{payout_id}", response_model=PayoutOut)
def update_payout(
    payout_id: int, payload: PayoutUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin)
):
    payout = db.query(models.Payout).filter(models.Payout.id == payout_id).first()
    if not payout:
        raise HTTPException(404, "Payout not found")
    payout.status = payload.status
    payout.notes = payload.notes
    if payload.status == "approved":
        payout.processed_at = datetime.utcnow()
    db.add(models.AuditLog(
        admin_id=current_user.id, action_type="FINANCE",
        description=f"Admin {current_user.full_name} {payload.status} payout #{payout_id} (${payout.amount})",
        target_id=payout_id, target_type="payout"
    ))
    db.commit()
    db.refresh(payout)
    out = PayoutOut.model_validate(payout)
    if payout.instructor:
        out.instructor_name = payout.instructor.full_name
    return out


# ─── Audit Log ──────────────────────────────────────────
audit_router = APIRouter(prefix="/audit", tags=["audit"])


@audit_router.get("", response_model=list[AuditLogOut])
def list_audit_logs(
    action_type: str = None,
    admin_id: int = None,
    page: int = 1,
    per_page: int = 50,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_admin)
):
    q = db.query(models.AuditLog)
    if action_type:
        q = q.filter(models.AuditLog.action_type == action_type)
    if admin_id:
        q = q.filter(models.AuditLog.admin_id == admin_id)
    logs = q.order_by(desc(models.AuditLog.created_at)).offset((page - 1) * per_page).limit(per_page).all()
    result = []
    for log in logs:
        out = AuditLogOut.model_validate(log)
        if log.admin:
            out.admin_name = log.admin.full_name
        result.append(out)
    return result


# ─── Platform Settings ──────────────────────────────────
settings_router = APIRouter(prefix="/settings", tags=["settings"])


@settings_router.get("", response_model=list[SettingOut])
def get_settings(category: str = None, db: Session = Depends(get_db), _: models.User = Depends(get_current_admin)):
    q = db.query(models.PlatformSetting)
    if category:
        q = q.filter(models.PlatformSetting.category == category)
    return q.all()


@settings_router.patch("/{key}")
def update_setting(key: str, payload: SettingUpdate, db: Session = Depends(get_db), _: models.User = Depends(get_current_admin)):
    setting = db.query(models.PlatformSetting).filter(models.PlatformSetting.key == key).first()
    if not setting:
        raise HTTPException(404, "Setting not found")
    setting.value = payload.value
    db.commit()
    return {"key": key, "value": payload.value}


# ─── Live Sessions ──────────────────────────────────────
sessions_router = APIRouter(prefix="/sessions", tags=["sessions"])


@sessions_router.get("", response_model=list[LiveSessionOut])
def list_sessions(
    course_id: int = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    q = db.query(models.LiveSession)
    if current_user.role == models.UserRole.instructor:
        q = q.filter(models.LiveSession.instructor_id == current_user.id)
    if course_id:
        q = q.filter(models.LiveSession.course_id == course_id)
    sessions = q.order_by(desc(models.LiveSession.scheduled_at)).all()
    result = []
    for s in sessions:
        out = LiveSessionOut.model_validate(s)
        course = db.query(models.Course).filter(models.Course.id == s.course_id).first()
        if course:
            out.course_title = course.title
        result.append(out)
    return result


@sessions_router.post("", response_model=LiveSessionOut)
def create_session(
    payload: LiveSessionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_instructor)
):
    import uuid
    session = models.LiveSession(
        **payload.model_dump(),
        instructor_id=current_user.id,
        room_id=str(uuid.uuid4())[:8]
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    out = LiveSessionOut.model_validate(session)
    course = db.query(models.Course).filter(models.Course.id == session.course_id).first()
    if course:
        out.course_title = course.title
    return out


@sessions_router.patch("/{session_id}/status")
def update_session_status(session_id: int, status: str, db: Session = Depends(get_db), _: models.User = Depends(get_current_instructor)):
    session = db.query(models.LiveSession).filter(models.LiveSession.id == session_id).first()
    if not session:
        raise HTTPException(404, "Session not found")
    session.status = status
    db.commit()
    return {"message": f"Session status updated to {status}"}
