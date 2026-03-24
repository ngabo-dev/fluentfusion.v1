from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import get_db, User, Course, Enrollment, Payment, LiveSession, Quiz, Lesson, Message, Review, Notification, NotificationRead, RoleEnum
from app.auth import require_role
from app.notify import notify

router = APIRouter(prefix="/api/student", tags=["student"])
guard = require_role(RoleEnum.student)

@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    enrollments = db.query(Enrollment).filter(Enrollment.student_id == current_user.id).all()
    course_ids = [e.course_id for e in enrollments]
    avg_completion = db.query(func.avg(Enrollment.completion_pct)).filter(Enrollment.student_id == current_user.id).scalar() or 0
    total_spent = db.query(func.sum(Payment.amount)).filter(Payment.user_id == current_user.id, Payment.status == "completed").scalar() or 0
    upcoming = db.query(LiveSession).filter(LiveSession.course_id.in_(course_ids), LiveSession.status.in_(["scheduled", "live"])).order_by(LiveSession.scheduled_at).limit(3).all() if course_ids else []
    enrolled_courses = []
    for e in enrollments:
        c = db.query(Course).filter(Course.id == e.course_id).first()
        if c:
            instructor = db.query(User).filter(User.id == c.instructor_id).first()
            lesson_count = db.query(Lesson).filter(Lesson.course_id == c.id).count()
            enrolled_courses.append({"id": c.id, "title": c.title, "language": c.language, "level": c.level, "flag_emoji": c.flag_emoji, "instructor": instructor.name if instructor else "", "completion": round(e.completion_pct, 1), "lesson_count": lesson_count, "enrolled_at": e.enrolled_at})
    return {
        "total_courses": len(course_ids),
        "avg_completion": round(avg_completion, 1),
        "total_spent": round(total_spent, 2),
        "xp": current_user.xp,
        "pulse_state": current_user.pulse_state,
        "enrolled_courses": enrolled_courses,
        "upcoming_sessions": [{"id": s.id, "title": s.title, "scheduled_at": s.scheduled_at, "status": s.status, "attendees": s.attendees} for s in upcoming]
    }

@router.get("/catalog")
def course_catalog(search: str = "", language: str = "", level: str = "", db: Session = Depends(get_db), current_user: User = Depends(guard)):
    q = db.query(Course).filter(Course.status == "published")
    if search: q = q.filter(Course.title.ilike(f"%{search}%"))
    if language: q = q.filter(Course.language.ilike(f"%{language}%"))
    if level: q = q.filter(Course.level == level)
    courses = q.order_by(Course.created_at.desc()).all()
    enrolled_ids = {e.course_id for e in db.query(Enrollment).filter(Enrollment.student_id == current_user.id).all()}
    result = []
    for c in courses:
        instructor = db.query(User).filter(User.id == c.instructor_id).first()
        lesson_count = db.query(Lesson).filter(Lesson.course_id == c.id).count()
        student_count = db.query(Enrollment).filter(Enrollment.course_id == c.id).count()
        avg_rat = db.query(func.avg(Review.rating)).filter(Review.course_id == c.id).scalar() or 0
        result.append({"id": c.id, "title": c.title, "description": c.description, "language": c.language, "level": c.level, "flag_emoji": c.flag_emoji, "thumbnail_url": c.thumbnail_url, "price": c.price, "instructor": instructor.name if instructor else "", "instructor_initials": instructor.avatar_initials if instructor else "", "lesson_count": lesson_count, "student_count": student_count, "rating": round(avg_rat, 1), "enrolled": c.id in enrolled_ids})
    return result

@router.post("/courses/{course_id}/enroll")
def enroll(course_id: int, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    existing = db.query(Enrollment).filter(Enrollment.student_id == current_user.id, Enrollment.course_id == course_id).first()
    if existing: return {"ok": True, "already_enrolled": True}
    course = db.query(Course).filter(Course.id == course_id, Course.status == "published").first()
    if not course: return {"error": "Course not found"}
    db.add(Enrollment(student_id=current_user.id, course_id=course_id))
    db.commit()
    # Notify instructor
    notify(db, title="🎓 New Enrollment",
           message=f"{current_user.name} just enrolled in your course '{course.title}'.",
           target=str(course.instructor_id), link="/instructor/students", course_id=course_id)
    db.commit()
    return {"ok": True, "enrolled": True}

@router.get("/courses")
def my_courses(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    enrollments = db.query(Enrollment).filter(Enrollment.student_id == current_user.id).all()
    result = []
    for e in enrollments:
        c = db.query(Course).filter(Course.id == e.course_id).first()
        if c:
            instructor = db.query(User).filter(User.id == c.instructor_id).first()
            lesson_count = db.query(Lesson).filter(Lesson.course_id == c.id).count()
            avg_rat = db.query(func.avg(Review.rating)).filter(Review.course_id == c.id).scalar() or 0
            result.append({"id": c.id, "title": c.title, "language": c.language, "level": c.level, "flag_emoji": c.flag_emoji, "instructor": instructor.name if instructor else "", "instructor_initials": instructor.avatar_initials if instructor else "", "completion": round(e.completion_pct, 1), "lesson_count": lesson_count, "rating": round(avg_rat, 1), "price": c.price, "enrolled_at": e.enrolled_at})
    return result

@router.get("/catalog/{course_id}")
def course_detail(course_id: int, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    c = db.query(Course).filter(Course.id == course_id, Course.status == "published").first()
    if not c:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Course not found")
    instructor = db.query(User).filter(User.id == c.instructor_id).first()
    lesson_count = db.query(Lesson).filter(Lesson.course_id == c.id).count()
    student_count = db.query(Enrollment).filter(Enrollment.course_id == c.id).count()
    avg_rat = db.query(func.avg(Review.rating)).filter(Review.course_id == c.id).scalar() or 0
    enrolled = db.query(Enrollment).filter(Enrollment.student_id == current_user.id, Enrollment.course_id == c.id).first() is not None
    from app.models import CourseSection
    sections = db.query(CourseSection).filter(CourseSection.course_id == c.id).order_by(CourseSection.order).all()
    curriculum = []
    for s in sections:
        lessons = db.query(Lesson).filter(Lesson.section_id == s.id).order_by(Lesson.order).all()
        curriculum.append({"title": s.title, "lessons": [{"id": l.id, "title": l.title, "lesson_type": l.lesson_type, "duration_min": l.duration_min, "is_preview": l.is_preview} for l in lessons]})
    if not curriculum:
        all_lessons = db.query(Lesson).filter(Lesson.course_id == c.id).order_by(Lesson.order).all()
        if all_lessons:
            curriculum = [{"title": "Course Content", "lessons": [{"id": l.id, "title": l.title, "lesson_type": l.lesson_type, "duration_min": l.duration_min, "is_preview": l.is_preview} for l in all_lessons]}]
    return {
        "id": c.id, "title": c.title, "subtitle": c.subtitle, "description": c.description,
        "language": c.language, "level": c.level, "flag_emoji": c.flag_emoji,
        "thumbnail_url": c.thumbnail_url, "price": c.price, "is_free": c.is_free,
        "what_you_learn": c.what_you_learn, "requirements": c.requirements, "target_audience": c.target_audience,
        "instructor": instructor.name if instructor else "",
        "instructor_initials": instructor.avatar_initials if instructor else "",
        "instructor_bio": instructor.bio if instructor else "",
        "lesson_count": lesson_count, "student_count": student_count,
        "rating": round(avg_rat, 1), "enrolled": enrolled, "curriculum": curriculum,
    }

@router.get("/courses/{course_id}/lessons")
def course_lessons(course_id: int, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    lessons = db.query(Lesson).filter(Lesson.course_id == course_id).order_by(Lesson.order).all()
    return [{"id": l.id, "title": l.title, "lesson_type": l.lesson_type, "duration_min": l.duration_min, "order": l.order, "description": l.description} for l in lessons]

@router.post("/courses/{course_id}/lessons/{lesson_id}/complete")
def complete_lesson(course_id: int, lesson_id: int, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    enrollment = db.query(Enrollment).filter(Enrollment.student_id == current_user.id, Enrollment.course_id == course_id).first()
    if not enrollment:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Not enrolled")
    total = db.query(Lesson).filter(Lesson.course_id == course_id).count()
    if total > 0:
        enrollment.completion_pct = min(100.0, enrollment.completion_pct + round(100.0 / total, 1))
    current_user.xp = (current_user.xp or 0) + 10
    db.commit()
    return {"ok": True, "completion": round(enrollment.completion_pct, 1), "xp": current_user.xp}

@router.get("/live-sessions")
def live_sessions(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    course_ids = [e.course_id for e in db.query(Enrollment).filter(Enrollment.student_id == current_user.id).all()]
    sessions = db.query(LiveSession).filter(LiveSession.course_id.in_(course_ids)).order_by(LiveSession.scheduled_at.desc()).all() if course_ids else []
    result = []
    for s in sessions:
        course = db.query(Course).filter(Course.id == s.course_id).first()
        result.append({"id": s.id, "title": s.title, "course": course.title if course else "", "flag_emoji": course.flag_emoji if course else "", "scheduled_at": s.scheduled_at, "attendees": s.attendees, "status": s.status, "recording_url": s.recording_url, "duration_min": s.duration_min})
    return result

@router.get("/quizzes")
def quizzes(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    course_ids = [e.course_id for e in db.query(Enrollment).filter(Enrollment.student_id == current_user.id).all()]
    quizzes = db.query(Quiz).filter(Quiz.course_id.in_(course_ids)).all() if course_ids else []
    result = []
    for q in quizzes:
        course = db.query(Course).filter(Course.id == q.course_id).first()
        result.append({"id": q.id, "title": q.title, "course": course.title if course else "", "flag_emoji": course.flag_emoji if course else "", "question_count": q.question_count, "avg_score": q.avg_score, "attempts": q.attempts})
    return result

@router.get("/messages")
def messages(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    sent_to = db.query(Message.receiver_id).filter(Message.sender_id == current_user.id).distinct().all()
    received_from = db.query(Message.sender_id).filter(Message.receiver_id == current_user.id).distinct().all()
    peer_ids = set([r for (r,) in sent_to] + [s for (s,) in received_from])
    result = []
    for pid in peer_ids:
        peer = db.query(User).filter(User.id == pid).first()
        last_msg = db.query(Message).filter(
            ((Message.sender_id == current_user.id) & (Message.receiver_id == pid)) |
            ((Message.sender_id == pid) & (Message.receiver_id == current_user.id))
        ).order_by(Message.created_at.desc()).first()
        unread = db.query(Message).filter(Message.sender_id == pid, Message.receiver_id == current_user.id, Message.is_read == False).count()
        if peer:
            result.append({"id": peer.id, "name": peer.name, "role": peer.role, "avatar_initials": peer.avatar_initials, "last_message": last_msg.content if last_msg else "", "unread": unread, "last_at": last_msg.created_at if last_msg else None})
    return result

@router.get("/messages/{peer_id}")
def get_conversation(peer_id: int, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    msgs = db.query(Message).filter(
        ((Message.sender_id == current_user.id) & (Message.receiver_id == peer_id)) |
        ((Message.sender_id == peer_id) & (Message.receiver_id == current_user.id))
    ).order_by(Message.created_at).all()
    db.query(Message).filter(Message.sender_id == peer_id, Message.receiver_id == current_user.id).update({"is_read": True})
    db.commit()
    return [{"id": m.id, "sender_id": m.sender_id, "content": m.content, "created_at": m.created_at} for m in msgs]

@router.post("/messages/{peer_id}")
def send_message(peer_id: int, body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    msg = Message(sender_id=current_user.id, receiver_id=peer_id, content=body["content"])
    db.add(msg)
    # Notify recipient
    notify(db, title="💬 New Message",
           message=f"{current_user.name} sent you a message.",
           target=str(peer_id), link="/dashboard/messages")
    db.commit()
    return {"ok": True}

@router.get("/notifications")
def notifications(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    enrolled_course_ids = [e.course_id for e in db.query(Enrollment).filter(Enrollment.student_id == current_user.id).all()]
    course_targets = [f"course_{cid}" for cid in enrolled_course_ids]
    targets = ["all", "students", str(current_user.id)] + course_targets
    notifs = db.query(Notification).filter(
        Notification.target.in_(targets),
        Notification.notif_type == "notification"
    ).order_by(Notification.sent_at.desc()).limit(50).all()
    read_ids = {r.notification_id for r in db.query(NotificationRead).filter(NotificationRead.user_id == current_user.id).all()}
    return [{"id": n.id, "title": n.title, "message": n.message, "link": n.link, "sent_at": n.sent_at, "is_read": n.id in read_ids} for n in notifs]

@router.get("/notifications/unread-count")
def notifications_unread_count(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    enrolled_course_ids = [e.course_id for e in db.query(Enrollment).filter(Enrollment.student_id == current_user.id).all()]
    course_targets = [f"course_{cid}" for cid in enrolled_course_ids]
    notif_targets = ["all", "students", str(current_user.id)] + course_targets
    annc_targets  = ["all", "students"] + course_targets

    # unread system notifications
    notif_ids = [n.id for n in db.query(Notification.id).filter(
        Notification.target.in_(notif_targets), Notification.notif_type == "notification").all()]
    # unread announcements
    annc_ids = [n.id for n in db.query(Notification.id).filter(
        Notification.target.in_(annc_targets), Notification.notif_type == "announcement").all()]

    all_ids = list(set(notif_ids + annc_ids))
    read = db.query(NotificationRead).filter(
        NotificationRead.user_id == current_user.id,
        NotificationRead.notification_id.in_(all_ids)
    ).count() if all_ids else 0
    return {"count": max(0, len(all_ids) - read)}

@router.post("/notifications/mark-read")
def mark_notifications_read(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    enrolled_course_ids = [e.course_id for e in db.query(Enrollment).filter(Enrollment.student_id == current_user.id).all()]
    course_targets = [f"course_{cid}" for cid in enrolled_course_ids]
    targets = ["all", "students", str(current_user.id)] + course_targets
    notif_ids = [n.id for n in db.query(Notification.id).filter(Notification.target.in_(targets), Notification.notif_type == "notification").all()]
    existing = {r.notification_id for r in db.query(NotificationRead).filter(NotificationRead.user_id == current_user.id).all()}
    for nid in notif_ids:
        if nid not in existing:
            db.add(NotificationRead(user_id=current_user.id, notification_id=nid))
    db.commit()
    return {"ok": True}

@router.get("/profile")
def get_profile(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    return {"id": current_user.id, "name": current_user.name, "email": current_user.email, "bio": current_user.bio, "avatar_initials": current_user.avatar_initials, "xp": current_user.xp, "pulse_state": current_user.pulse_state, "created_at": current_user.created_at}

@router.patch("/profile")
def update_profile(body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    for k, v in body.items():
        if hasattr(current_user, k): setattr(current_user, k, v)
    db.commit()
    return {"ok": True}

@router.get("/leaderboard")
def leaderboard(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    students = db.query(User).filter(User.role == RoleEnum.student).order_by(User.xp.desc()).limit(50).all()
    result = []
    for i, s in enumerate(students):
        course_count = db.query(Enrollment).filter(Enrollment.student_id == s.id).count()
        result.append({
            "rank": i + 1,
            "id": s.id,
            "name": s.name,
            "avatar_initials": s.avatar_initials,
            "xp": s.xp or 0,
            "pulse_state": s.pulse_state,
            "courses": course_count,
            "is_me": s.id == current_user.id,
        })
    return result

@router.get("/announcements")
def get_announcements(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    enrolled_course_ids = [e.course_id for e in db.query(Enrollment).filter(Enrollment.student_id == current_user.id).all()]
    course_targets = [f"course_{cid}" for cid in enrolled_course_ids]
    targets = ["all", "students"] + course_targets
    notifs = db.query(Notification).filter(
        Notification.target.in_(targets),
        Notification.notif_type == "announcement"
    ).order_by(Notification.sent_at.desc()).limit(50).all()
    read_ids = {r.notification_id for r in db.query(NotificationRead).filter(NotificationRead.user_id == current_user.id).all()}
    return [{"id": n.id, "title": n.title, "message": n.message, "sent_at": n.sent_at, "is_read": n.id in read_ids, "allow_replies": n.allow_replies} for n in notifs]

@router.post("/announcements/mark-read")
def mark_announcements_read(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    enrolled_course_ids = [e.course_id for e in db.query(Enrollment).filter(Enrollment.student_id == current_user.id).all()]
    course_targets = [f"course_{cid}" for cid in enrolled_course_ids]
    targets = ["all", "students"] + course_targets
    annc_ids = [n.id for n in db.query(Notification.id).filter(Notification.target.in_(targets), Notification.notif_type == "announcement").all()]
    existing = {r.notification_id for r in db.query(NotificationRead).filter(NotificationRead.user_id == current_user.id).all()}
    for nid in annc_ids:
        if nid not in existing:
            db.add(NotificationRead(user_id=current_user.id, notification_id=nid))
    db.commit()
    return {"ok": True}

@router.post("/onboarding")
def save_onboarding(body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    """Persist onboarding selections to user profile bio field as JSON."""
    import json
    data = {
        "native_lang": body.get("native_lang"),
        "learn_lang": body.get("learn_lang"),
        "goal": body.get("goal"),
        "level": body.get("level"),
    }
    current_user.bio = json.dumps(data)
    db.commit()
    return {"ok": True}
