from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import get_db, User, Course, Module, Enrollment, Payment, Payout, LiveSession, MonthlyRevenue, RoleEnum, StatusEnum, CourseStatusEnum, Lesson, Quiz, Notification, NotificationRead, ModuleQuiz, QuizQuestion
from app.auth import require_role, hash_password
from app.pulse_predictor import predictor as pulse_predictor
from app.notify import notify
from typing import Optional

router = APIRouter(prefix="/api/admin", tags=["admin"])
guard = require_role(RoleEnum.admin, RoleEnum.super_admin)
super_guard = require_role(RoleEnum.super_admin)

@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db), _=Depends(guard)):
    total_users = db.query(User).count()
    total_students = db.query(User).filter(User.role == RoleEnum.student).count()
    total_instructors = db.query(User).filter(User.role == RoleEnum.instructor).count()
    total_revenue = db.query(func.sum(Payment.amount)).filter(Payment.status == "completed").scalar() or 0
    active_courses = db.query(Course).filter(Course.status == "published").count()
    pending_courses = db.query(Course).filter(Course.status == "pending").count()
    total_enrollments = db.query(Enrollment).count()
    pending_payouts = db.query(Payout).filter(Payout.status == "pending").count()
    from app.models import Report
    open_reports = db.query(Report).filter(Report.status == "open").count()
    pulse_dist = {}
    for state in ["thriving","coasting","struggling","burning_out","disengaged"]:
        pulse_dist[state] = db.query(User).filter(User.pulse_state == state).count()
    monthly = db.query(MonthlyRevenue).filter(MonthlyRevenue.instructor_id == None).order_by(MonthlyRevenue.year, MonthlyRevenue.month).all()
    return {
        "total_users": total_users,
        "total_students": total_students,
        "total_instructors": total_instructors,
        "total_revenue": round(total_revenue, 2),
        "active_courses": active_courses,
        "pending_courses": pending_courses,
        "total_enrollments": total_enrollments,
        "pending_payouts": pending_payouts,
        "open_reports": open_reports,
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
    new_status = body.get("status", user.status)
    user.status = new_status
    if new_status == "banned":
        notify(db, title="🚫 Account Suspended",
               message="Your account has been suspended by an administrator. Contact support if you believe this is an error.",
               target=str(user_id), link=None)
    elif new_status == "active":
        notify(db, title="✅ Account Reinstated",
               message="Your account has been reinstated. You can now access the platform again.",
               target=str(user_id), link="/dashboard")
    db.commit()
    return {"ok": True}

@router.patch("/users/{user_id}")
def update_user(user_id: int, body: dict, db: Session = Depends(get_db), _=Depends(guard)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user: return {"error": "not found"}
    if "name" in body: user.name = body["name"]
    if "email" in body: user.email = body["email"]
    if "role" in body and body["role"] in ("student", "instructor", "admin"): user.role = body["role"]
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
    if user:
        user.is_verified = True
        user.status = StatusEnum.active
        notify(db, title="✅ Account Verified",
               message="Your instructor account has been verified. You can now create and publish courses.",
               target=str(user_id), link="/instructor/courses")
        db.commit()
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
        result.append({"id": c.id, "title": c.title, "description": c.description, "language": c.language, "level": c.level, "flag_emoji": c.flag_emoji, "thumbnail_url": c.thumbnail_url, "status": c.status, "price": c.price, "instructor": ins.name if ins else "", "instructor_id": c.instructor_id, "students": students, "revenue": round(revenue, 2), "created_at": c.created_at})
    return result

@router.get("/courses/{course_id}")
def get_course(course_id: int, db: Session = Depends(get_db), _=Depends(guard)):
    c = db.query(Course).filter(Course.id == course_id).first()
    if not c: return {"error": "not found"}
    ins = db.query(User).filter(User.id == c.instructor_id).first()
    modules = db.query(Module).filter(Module.course_id == c.id).order_by(Module.order).all()
    module_data = []
    for m in modules:
        lessons = db.query(Lesson).filter(Lesson.module_id == m.id).order_by(Lesson.order).all()
        quizzes = db.query(ModuleQuiz).filter(ModuleQuiz.module_id == m.id).order_by(ModuleQuiz.order).all()
        quiz_data = []
        for q in quizzes:
            questions = db.query(QuizQuestion).filter(QuizQuestion.quiz_id == q.id).order_by(QuizQuestion.order).all()
            quiz_data.append({
                "id": q.id, "title": q.title, "position": q.position, "passing_score": q.passing_score,
                "time_limit_min": q.time_limit_min, "is_required": q.is_required, "order": q.order,
                "questions": [{
                    "id": qu.id, "question_text": qu.question_text, "question_type": qu.question_type,
                    "options": qu.options, "correct_answer": qu.correct_answer, "explanation": qu.explanation,
                    "points": qu.points, "order": qu.order
                } for qu in questions]
            })
        module_data.append({
            "id": m.id, "title": m.title, "description": m.description, "order": m.order,
            "lessons": [{"id": l.id, "title": l.title, "lesson_type": l.lesson_type,
                         "duration_min": l.duration_min, "description": l.description,
                         "video_url": l.video_url, "is_preview": l.is_preview} for l in lessons],
            "quizzes": quiz_data
        })
    loose = db.query(Lesson).filter(Lesson.course_id == c.id, Lesson.module_id == None).order_by(Lesson.order).all()
    quizzes = db.query(Quiz).filter(Quiz.course_id == c.id).all()
    students = db.query(Enrollment).filter(Enrollment.course_id == c.id).count()
    total_lessons = db.query(Lesson).filter(Lesson.course_id == c.id).count()
    return {
        "id": c.id, "title": c.title, "subtitle": c.subtitle, "description": c.description,
        "category": c.category, "language": c.language, "level": c.level, "flag_emoji": c.flag_emoji,
        "thumbnail_url": c.thumbnail_url, "intro_video_url": c.intro_video_url,
        "status": c.status, "price": c.price, "is_free": c.is_free,
        "what_you_learn": c.what_you_learn, "requirements": c.requirements, "target_audience": c.target_audience,
        "rejection_feedback": c.rejection_feedback, "admin_notes": c.admin_notes,
        "instructor": ins.name if ins else "", "instructor_email": ins.email if ins else "",
        "created_at": c.created_at, "submitted_at": c.submitted_at, "approved_at": c.approved_at,
        "students": students, "total_lessons": total_lessons,
        "modules": module_data,
        "loose_lessons": [{"id": l.id, "title": l.title, "lesson_type": l.lesson_type,
                           "duration_min": l.duration_min, "description": l.description} for l in loose],
        "quizzes": [{"id": q.id, "title": q.title, "question_count": q.question_count, "avg_score": q.avg_score} for q in quizzes],
    }

@router.post("/courses")
def create_course(body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    """Admin creates a course — auto-published, assigned to a chosen instructor or self."""
    course = Course(
        title=body["title"],
        description=body.get("description", ""),
        language=body.get("language", ""),
        level=body.get("level", ""),
        flag_emoji=body.get("flag_emoji", ""),
        thumbnail_url=body.get("thumbnail_url", ""),
        instructor_id=body.get("instructor_id") or current_user.id,
        price=body.get("price", 49.99),
        status="published",
    )
    db.add(course); db.commit(); db.refresh(course)
    return {"id": course.id, "title": course.title}

@router.patch("/courses/{course_id}/status")
def update_course_status(course_id: int, body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    from datetime import datetime
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course: raise HTTPException(status_code=404, detail="Not found")
    new_status = body.get("status")
    feedback = body.get("feedback", "").strip()
    admin_notes = body.get("admin_notes", "").strip()

    try:
        course.status = CourseStatusEnum(new_status)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid status: {new_status}")
    if admin_notes: course.admin_notes = admin_notes

    instructor = db.query(User).filter(User.id == course.instructor_id).first()

    if new_status == "approved":
        course.approved_at = datetime.utcnow()
        course.rejection_feedback = None
        notify(db, title="✅ Course Approved!",
               message=f"Your course '{course.title}' has been approved. You can now publish it to make it available to students.",
               target=str(course.instructor_id), link="/instructor/courses", course_id=course.id)
        from app.models import AuditLog
        db.add(AuditLog(admin_id=current_user.id, action_type="COURSE", description=f"Approved course: {course.title}"))

    elif new_status == "rejected":
        if not feedback:
            raise HTTPException(status_code=400, detail="Feedback is required when rejecting a course")
        course.rejection_feedback = feedback
        notify(db, title="❌ Course Rejected",
               message=f"Your course '{course.title}' was rejected. Feedback: {feedback}",
               target=str(course.instructor_id), link="/instructor/courses", course_id=course.id)
        from app.models import AuditLog
        db.add(AuditLog(admin_id=current_user.id, action_type="COURSE", description=f"Rejected course: {course.title}. Feedback: {feedback}"))

    db.commit()
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
        new_status = body.get("status")
        payout.status = new_status
        if new_status == "paid":
            from datetime import datetime
            payout.paid_at = datetime.utcnow()
            notify(db, title="💰 Payout Processed",
                   message=f"Your payout of ${payout.amount:.2f} ({payout.reference}) has been paid.",
                   target=str(payout.instructor_id), link="/instructor/payouts")
        elif new_status == "rejected":
            notify(db, title="❌ Payout Rejected",
                   message=f"Your payout request of ${payout.amount:.2f} ({payout.reference}) was rejected. Contact support for details.",
                   target=str(payout.instructor_id), link="/instructor/payouts")
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
        "model_ready": pulse_predictor.is_ready,
        "at_risk": [{"id": u.id, "name": u.name, "pulse_state": u.pulse_state, "last_active": u.last_active} for u in at_risk]
    }


@router.post("/pulse/predict")
def pulse_predict(body: dict, _=Depends(guard)):
    """
    Predict PULSE state for a single learner.
    Pass raw feature values — categoricals as strings, numerics as numbers.
    Required numeric fields:
      num_of_prev_attempts, studied_credits, total_clicks, active_days,
      avg_clicks_per_day, avg_score, num_assessments, days_to_first_submit,
      days_registered_before_start, withdrew_early,
      engagement_score, performance_score, decline_index, consistency_score
    Optional categorical fields (defaults to 'Unknown' if omitted):
      gender, highest_education, imd_band, age_band, disability
    """
    if not pulse_predictor.is_ready:
        raise HTTPException(
            status_code=503,
            detail="PULSE model not trained yet. Run PULSE/colab_train_pulse.py on Colab, "
                   "then unzip pulse_artifacts.zip into PULSE/pulse_artifacts/."
        )
    return pulse_predictor.predict_one(body)


@router.post("/pulse/run")
def pulse_run(db: Session = Depends(get_db), _=Depends(guard)):
    """
    Re-score ALL students in the DB using the trained PULSE model.
    Builds each student's feature vector from live DB data, runs batch
    inference, and updates user.pulse_state in-place.
    Returns a summary of how many students moved to each state.
    """
    if not pulse_predictor.is_ready:
        raise HTTPException(
            status_code=503,
            detail="PULSE model not trained yet. Run PULSE/colab_train_pulse.py on Colab, "
                   "then unzip pulse_artifacts.zip into PULSE/pulse_artifacts/."
        )

    students = db.query(User).filter(User.role == RoleEnum.student).all()
    if not students:
        return {"updated": 0, "distribution": {}}

    rows, user_ids = [], []
    for u in students:
        enrollments  = db.query(Enrollment).filter(Enrollment.student_id == u.id).all()
        num_courses  = len(enrollments)
        avg_comp     = sum(e.completion_pct for e in enrollments) / num_courses if num_courses else 0
        # Map DB fields → PULSE feature names
        rows.append({
            "num_of_prev_attempts"        : num_courses,
            "studied_credits"             : num_courses * 60,
            "total_clicks"                : (u.xp or 0) * 10,
            "active_days"                 : min((u.xp or 0), 200),
            "avg_clicks_per_day"          : ((u.xp or 0) * 10) / max(min((u.xp or 0), 200), 1),
            "avg_score"                   : avg_comp,
            "num_assessments"             : num_courses * 2,
            "days_to_first_submit"        : 7 if num_courses > 0 else 999,
            "days_registered_before_start": 0,
            "withdrew_early"              : 0,
            "engagement_score"            : min((u.xp or 0) / 1000, 1.0),
            "performance_score"           : avg_comp / 100,
            "decline_index"               : max(0, 1 - min((u.xp or 0) / 500, 1.0)) * 0.5,
            "consistency_score"           : min((u.xp or 0) / 500, 1.0),
            "gender"                      : "Unknown",
            "highest_education"           : "Unknown",
            "imd_band"                    : "Unknown",
            "age_band"                    : "Unknown",
            "disability"                  : "Unknown",
        })
        user_ids.append(u.id)

    predictions = pulse_predictor.predict_batch(rows)

    distribution = {}
    for user_id, pred in zip(user_ids, predictions):
        new_state = pred["state_label"]
        distribution[new_state] = distribution.get(new_state, 0) + 1
        db.query(User).filter(User.id == user_id).update({"pulse_state": new_state})

    db.commit()
    return {"updated": len(user_ids), "distribution": distribution}

def _notifs_for_user(db: Session, user_id: int, role: str):
    """Return notifications targeted at this specific user, their role, or 'all'."""
    return (
        db.query(Notification)
        .filter(
            Notification.notif_type == "notification",
            Notification.target.in_([str(user_id), role, "admins", "all"])
        )
        .order_by(Notification.sent_at.desc())
        .limit(100)
        .all()
    )

# Notifications = system-generated event alerts (notif_type='notification')
@router.get("/notifications")
def list_notifications(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    notifs = _notifs_for_user(db, current_user.id, str(current_user.role.value if hasattr(current_user.role, 'value') else current_user.role))
    read_ids = {r.notification_id for r in db.query(NotificationRead).filter(NotificationRead.user_id == current_user.id).all()}
    return [{"id": n.id, "title": n.title, "message": n.message, "link": n.link, "sent_at": n.sent_at, "is_read": n.id in read_ids} for n in notifs]

@router.get("/notifications/unread-count")
def notifications_unread_count(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    notifs = _notifs_for_user(db, current_user.id, str(current_user.role.value if hasattr(current_user.role, 'value') else current_user.role))
    notif_ids = [n.id for n in notifs]
    read = db.query(NotificationRead).filter(
        NotificationRead.user_id == current_user.id,
        NotificationRead.notification_id.in_(notif_ids)
    ).count()
    return {"count": max(0, len(notif_ids) - read)}

@router.post("/notifications/mark-read")
def mark_notifications_read(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    notifs = _notifs_for_user(db, current_user.id, str(current_user.role.value if hasattr(current_user.role, 'value') else current_user.role))
    existing = {r.notification_id for r in db.query(NotificationRead).filter(NotificationRead.user_id == current_user.id).all()}
    for n in notifs:
        if n.id not in existing:
            db.add(NotificationRead(user_id=current_user.id, notification_id=n.id))
    db.commit()
    return {"ok": True}

# Announcements = human-composed broadcasts (notif_type='announcement')
@router.get("/announcements")
def list_announcements(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    notifs = db.query(Notification).filter(Notification.notif_type == "announcement").order_by(Notification.sent_at.desc()).limit(100).all()
    return [{"id": n.id, "title": n.title, "message": n.message, "target": n.target or "", "sent_at": n.sent_at, "recipients": n.recipients, "allow_replies": n.allow_replies} for n in notifs]

@router.post("/announcements")
def send_announcement(body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    target = body.get("target", "all")
    recipients = 0
    if target == "all": recipients = db.query(User).filter(User.role.in_([RoleEnum.student, RoleEnum.instructor])).count()
    elif target == "students": recipients = db.query(User).filter(User.role == RoleEnum.student).count()
    elif target == "instructors": recipients = db.query(User).filter(User.role == RoleEnum.instructor).count()
    n = Notification(title=body["title"], message=body["message"], target=target, recipients=recipients,
                     sender_id=current_user.id, allow_replies=body.get("allow_replies", False),
                     notif_type="announcement")
    db.add(n); db.commit(); db.refresh(n)
    return {"ok": True, "id": n.id}

@router.post("/notifications")
def send_notification(body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    """Legacy endpoint — kept for backward compat, creates announcement."""
    return send_announcement(body, db, current_user)

@router.patch("/notifications/{notif_id}")
def update_notification(notif_id: int, body: dict, db: Session = Depends(get_db), _=Depends(guard)):
    from app.models import Notification
    n = db.query(Notification).filter(Notification.id == notif_id).first()
    if not n: raise HTTPException(status_code=404, detail="Not found")
    if "title" in body: n.title = body["title"]
    if "message" in body: n.message = body["message"]
    if "target" in body: n.target = body["target"]
    db.commit()
    return {"ok": True}

@router.delete("/notifications/{notif_id}")
def delete_notification(notif_id: int, db: Session = Depends(get_db), _=Depends(guard)):
    from app.models import Notification
    n = db.query(Notification).filter(Notification.id == notif_id).first()
    if n: db.delete(n); db.commit()
    return {"ok": True}

@router.get("/activity")
def platform_activity(limit: int = 50, db: Session = Depends(get_db), _=Depends(guard)):
    """Aggregated real-time platform activity feed for admins."""
    from datetime import datetime
    events = []

    # New user registrations
    for u in db.query(User).order_by(User.created_at.desc()).limit(30).all():
        events.append({"type": "USER_REGISTERED", "icon": "👤", "color": "var(--in)",
            "text": f"{u.name} registered as {u.role}",
            "detail": u.email, "ts": u.created_at})

    # Enrollments
    for e in db.query(Enrollment).order_by(Enrollment.enrolled_at.desc()).limit(20).all():
        student = db.query(User).filter(User.id == e.student_id).first()
        course = db.query(Course).filter(Course.id == e.course_id).first()
        if student and course:
            events.append({"type": "ENROLLMENT", "icon": "🎓", "color": "var(--ok)",
                "text": f"{student.name} enrolled in {course.title}",
                "detail": f"{course.language} · {course.level}", "ts": e.enrolled_at})

    # Payments
    for p in db.query(Payment).order_by(Payment.created_at.desc()).limit(20).all():
        user = db.query(User).filter(User.id == p.user_id).first()
        course = db.query(Course).filter(Course.id == p.course_id).first()
        if user and course:
            events.append({"type": "PAYMENT", "icon": "💳", "color": "var(--wa)",
                "text": f"{user.name} paid ${p.amount:.2f} for {course.title}",
                "detail": f"via {p.method} · {p.status}", "ts": p.created_at})

    # Payout requests
    for p in db.query(Payout).order_by(Payout.requested_at.desc()).limit(10).all():
        ins = db.query(User).filter(User.id == p.instructor_id).first()
        if ins:
            events.append({"type": "PAYOUT", "icon": "💰", "color": "#FF8C00",
                "text": f"{ins.name} requested payout of ${p.amount:.2f}",
                "detail": f"{p.reference} · {p.status}", "ts": p.requested_at})

    # Course submissions
    for c in db.query(Course).filter(Course.status == "pending").order_by(Course.created_at.desc()).limit(10).all():
        ins = db.query(User).filter(User.id == c.instructor_id).first()
        events.append({"type": "COURSE_SUBMITTED", "icon": "📚", "color": "var(--neon)",
            "text": f"{ins.name if ins else 'Unknown'} submitted course for review: {c.title}",
            "detail": f"{c.language} · {c.level}", "ts": c.created_at})

    # Sort all events by timestamp descending
    events.sort(key=lambda x: x["ts"] or datetime.min, reverse=True)
    return events[:limit]

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
    from sqlalchemy import func as sqlfunc
    # Real language enrollment data from DB
    lang_rows = (
        db.query(Course.language, Course.flag_emoji, sqlfunc.count(Enrollment.id).label("cnt"))
        .outerjoin(Enrollment, Enrollment.course_id == Course.id)
        .filter(Course.language != None, Course.language != "")
        .group_by(Course.language, Course.flag_emoji)
        .order_by(sqlfunc.count(Enrollment.id).desc())
        .limit(8).all()
    )
    languages = [{"flag": flag or "🌐", "name": lang, "users": cnt} for lang, flag, cnt in lang_rows]
    # Country data derived from target language enrollments as a proxy
    country_map = {
        "French":     ("🇫🇷", "France / Francophone"),
        "Spanish":    ("🇪🇸", "Spain / Latin America"),
        "English":    ("🇬🇧", "UK / Global"),
        "German":     ("🇩🇪", "Germany"),
        "Mandarin":   ("🇨🇳", "China"),
        "Japanese":   ("🇯🇵", "Japan"),
        "Portuguese": ("🇧🇷", "Brazil"),
        "Arabic":     ("🇸🇦", "Arab World"),
    }
    countries = []
    for lang, flag, cnt in lang_rows:
        mapped = country_map.get(lang)
        if mapped:
            countries.append({"flag": mapped[0], "name": mapped[1], "users": cnt})
    return {"countries": countries, "languages": languages}

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
    admins = db.query(User).filter(User.role.in_([RoleEnum.admin, RoleEnum.super_admin])).all()
    return [{"id": u.id, "name": u.name, "email": u.email, "role": u.role, "avatar_initials": u.avatar_initials, "last_active": u.last_active, "is_verified": u.is_verified, "status": u.status} for u in admins]

# ── Super Admin only endpoints ────────────────────────────────────────────

@router.post("/admins")
def create_admin(body: dict, db: Session = Depends(get_db), current_user: User = Depends(super_guard)):
    """Super admin creates a new admin account."""
    if db.query(User).filter(User.email == body["email"]).first():
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Email already registered")
    initials = "".join(w[0].upper() for w in body["name"].split()[:2])
    user = User(
        name=body["name"],
        email=body["email"],
        hashed_password=hash_password(body["password"]),
        role=RoleEnum.admin,
        status=StatusEnum.active,
        avatar_initials=initials,
        is_verified=True,
    )
    db.add(user); db.commit(); db.refresh(user)
    from app.models import AuditLog
    db.add(AuditLog(admin_id=current_user.id, action_type="USER", description=f"Super admin created new admin account: {user.email}"))
    notify(db, title="🔑 Admin Account Created",
           message=f"Welcome {user.name}! Your admin account has been created. You can now log in.",
           target=str(user.id), link="/admin")
    db.commit()
    return {"id": user.id, "name": user.name, "email": user.email, "role": user.role}

@router.delete("/admins/{user_id}")
def delete_admin(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(super_guard)):
    """Super admin removes an admin account."""
    user = db.query(User).filter(User.id == user_id, User.role == RoleEnum.admin).first()
    if not user:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Admin not found")
    db.delete(user); db.commit()
    from app.models import AuditLog
    db.add(AuditLog(admin_id=current_user.id, action_type="USER", description=f"Super admin removed admin account: {user.email}"))
    db.commit()
    return {"ok": True}

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    from fastapi import HTTPException
    from app.models import Payment, Payout, Enrollment, AuditLog, Report, Message, Review, MonthlyRevenue
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.role == RoleEnum.super_admin:
        raise HTTPException(status_code=403, detail="Cannot delete super admin")
    email = user.email
    # Delete related records to avoid FK violations
    db.query(Enrollment).filter(Enrollment.student_id == user_id).delete()
    db.query(Payment).filter(Payment.user_id == user_id).delete()
    db.query(Payout).filter(Payout.instructor_id == user_id).delete()
    db.query(Report).filter(Report.reporter_id == user_id).delete()
    db.query(Message).filter((Message.sender_id == user_id) | (Message.receiver_id == user_id)).delete(synchronize_session=False)
    db.query(Review).filter(Review.student_id == user_id).delete()
    db.query(MonthlyRevenue).filter(MonthlyRevenue.instructor_id == user_id).delete()
    db.query(AuditLog).filter(AuditLog.admin_id == user_id).delete()
    # Nullify instructor_id on courses rather than deleting them
    db.query(Course).filter(Course.instructor_id == user_id).update({"instructor_id": None})
    db.delete(user); db.commit()
    db.add(AuditLog(admin_id=current_user.id, action_type="USER", description=f"Admin deleted user: {email}"))
    db.commit()
    return {"ok": True}

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
