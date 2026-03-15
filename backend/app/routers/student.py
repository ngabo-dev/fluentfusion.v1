from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import get_db, User, Course, Enrollment, Payment, LiveSession, Quiz, Lesson, Message, Review, Notification, RoleEnum
from app.auth import require_role

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

@router.get("/courses/{course_id}/lessons")
def course_lessons(course_id: int, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    lessons = db.query(Lesson).filter(Lesson.course_id == course_id).order_by(Lesson.order).all()
    return [{"id": l.id, "title": l.title, "lesson_type": l.lesson_type, "duration_min": l.duration_min, "order": l.order, "description": l.description} for l in lessons]

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
    db.add(msg); db.commit()
    return {"ok": True}

@router.get("/notifications")
def notifications(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    notifs = db.query(Notification).filter(Notification.target.in_(["all", "students"])).order_by(Notification.sent_at.desc()).limit(20).all()
    return [{"id": n.id, "title": n.title, "message": n.message, "sent_at": n.sent_at} for n in notifs]

@router.get("/profile")
def get_profile(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    return {"id": current_user.id, "name": current_user.name, "email": current_user.email, "bio": current_user.bio, "avatar_initials": current_user.avatar_initials, "xp": current_user.xp, "pulse_state": current_user.pulse_state, "created_at": current_user.created_at}

@router.patch("/profile")
def update_profile(body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    for k, v in body.items():
        if hasattr(current_user, k): setattr(current_user, k, v)
    db.commit()
    return {"ok": True}
