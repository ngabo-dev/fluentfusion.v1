from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import get_db, User, Course, Enrollment, Payment, Payout, LiveSession, Quiz, Lesson, Message, Review, MonthlyRevenue, RoleEnum
from app.auth import require_role, get_current_user
from typing import Optional

router = APIRouter(prefix="/api/instructor", tags=["instructor"])
guard = require_role(RoleEnum.instructor)

@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    courses = db.query(Course).filter(Course.instructor_id == current_user.id).all()
    course_ids = [c.id for c in courses]
    total_students = db.query(Enrollment).filter(Enrollment.course_id.in_(course_ids)).count() if course_ids else 0
    revenue_gross = db.query(func.sum(Payment.amount)).filter(Payment.course_id.in_(course_ids), Payment.status == "completed").scalar() or 0
    avg_rating = db.query(func.avg(Review.rating)).filter(Review.course_id.in_(course_ids)).scalar() or 0
    avg_completion = db.query(func.avg(Enrollment.completion_pct)).filter(Enrollment.course_id.in_(course_ids)).scalar() or 0
    monthly = db.query(MonthlyRevenue).filter(MonthlyRevenue.instructor_id == current_user.id).order_by(MonthlyRevenue.year, MonthlyRevenue.month).all()
    sessions = db.query(LiveSession).filter(LiveSession.course_id.in_(course_ids)).order_by(LiveSession.scheduled_at.desc()).limit(5).all()
    course_data = []
    for c in courses:
        students = db.query(Enrollment).filter(Enrollment.course_id == c.id).count()
        rev = db.query(func.sum(Payment.amount)).filter(Payment.course_id == c.id, Payment.status == "completed").scalar() or 0
        avg_comp = db.query(func.avg(Enrollment.completion_pct)).filter(Enrollment.course_id == c.id).scalar() or 0
        avg_rat = db.query(func.avg(Review.rating)).filter(Review.course_id == c.id).scalar() or 0
        lesson_count = db.query(Lesson).filter(Lesson.course_id == c.id).count()
        course_data.append({"id": c.id, "title": c.title, "language": c.language, "level": c.level, "flag_emoji": c.flag_emoji, "status": c.status, "students": students, "revenue": round(rev * 0.7, 2), "completion": round(avg_comp, 1), "rating": round(avg_rat, 1), "lesson_count": lesson_count})
    return {
        "total_students": total_students,
        "revenue_mtd": round(revenue_gross * 0.7, 2),
        "avg_rating": round(avg_rating, 1),
        "avg_completion": round(avg_completion, 1),
        "monthly_revenue": [{"month": r.month, "year": r.year, "gross": r.gross, "net": r.net} for r in monthly],
        "courses": course_data,
        "sessions": [{"id": s.id, "title": s.title, "scheduled_at": s.scheduled_at, "attendees": s.attendees, "status": s.status} for s in sessions]
    }

@router.get("/courses")
def my_courses(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    courses = db.query(Course).filter(Course.instructor_id == current_user.id).all()
    result = []
    for c in courses:
        students = db.query(Enrollment).filter(Enrollment.course_id == c.id).count()
        rev = db.query(func.sum(Payment.amount)).filter(Payment.course_id == c.id, Payment.status == "completed").scalar() or 0
        avg_comp = db.query(func.avg(Enrollment.completion_pct)).filter(Enrollment.course_id == c.id).scalar() or 0
        avg_rat = db.query(func.avg(Review.rating)).filter(Review.course_id == c.id).scalar() or 0
        lesson_count = db.query(Lesson).filter(Lesson.course_id == c.id).count()
        result.append({"id": c.id, "title": c.title, "description": c.description, "language": c.language, "level": c.level, "flag_emoji": c.flag_emoji, "thumbnail_url": c.thumbnail_url, "status": c.status, "price": c.price, "students": students, "revenue": round(rev * 0.7, 2), "completion": round(avg_comp, 1), "rating": round(avg_rat, 1), "lesson_count": lesson_count})
    return result

@router.get("/courses/{course_id}/lessons")
def course_lessons(course_id: int, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    lessons = db.query(Lesson).filter(Lesson.course_id == course_id).order_by(Lesson.order).all()
    return [{"id": l.id, "title": l.title, "lesson_type": l.lesson_type, "duration_min": l.duration_min, "order": l.order, "description": l.description, "video_url": l.video_url} for l in lessons]

@router.post("/courses/{course_id}/lessons")
def create_lesson(course_id: int, body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    lesson = Lesson(course_id=course_id, title=body["title"], lesson_type=body.get("lesson_type","video"), duration_min=body.get("duration_min",15), description=body.get("description",""), video_url=body.get("video_url",""), order=body.get("order",0))
    db.add(lesson); db.commit(); db.refresh(lesson)
    return {"id": lesson.id}

@router.patch("/courses/{course_id}/lessons/{lesson_id}")
def update_lesson(course_id: int, lesson_id: int, body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if lesson:
        for k, v in body.items(): setattr(lesson, k, v)
        db.commit()
    return {"ok": True}

@router.post("/courses")
def create_course(body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    course = Course(
        title=body["title"],
        description=body.get("description", ""),
        language=body.get("language", ""),
        level=body.get("level", ""),
        flag_emoji=body.get("flag_emoji", ""),
        thumbnail_url=body.get("thumbnail_url", ""),
        instructor_id=current_user.id,
        price=body.get("price", 49.99)
    )
    db.add(course); db.commit(); db.refresh(course)
    return {"id": course.id, "title": course.title, "status": course.status}

@router.patch("/courses/{course_id}")
def update_course(course_id: int, body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    course = db.query(Course).filter(Course.id == course_id, Course.instructor_id == current_user.id).first()
    if not course: return {"error": "not found"}
    for k, v in body.items():
        if hasattr(course, k): setattr(course, k, v)
    db.commit()
    return {"ok": True}

@router.delete("/courses/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    course = db.query(Course).filter(Course.id == course_id, Course.instructor_id == current_user.id).first()
    if course: db.delete(course); db.commit()
    return {"ok": True}

@router.post("/courses/{course_id}/submit")
def submit_for_review(course_id: int, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    course = db.query(Course).filter(Course.id == course_id, Course.instructor_id == current_user.id).first()
    if course: course.status = "pending"; db.commit()
    return {"ok": True}

@router.get("/live-sessions")
def live_sessions(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    course_ids = [c.id for c in db.query(Course).filter(Course.instructor_id == current_user.id).all()]
    sessions = db.query(LiveSession).filter(LiveSession.course_id.in_(course_ids)).order_by(LiveSession.scheduled_at.desc()).all() if course_ids else []
    result = []
    for s in sessions:
        course = db.query(Course).filter(Course.id == s.course_id).first()
        result.append({"id": s.id, "title": s.title, "course": course.title if course else "", "flag_emoji": course.flag_emoji if course else "", "scheduled_at": s.scheduled_at, "attendees": s.attendees, "status": s.status, "recording_url": s.recording_url, "duration_min": s.duration_min})
    return result

@router.post("/live-sessions")
def create_session(body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    from datetime import datetime
    s = LiveSession(course_id=body["course_id"], title=body["title"], scheduled_at=datetime.fromisoformat(body["scheduled_at"]), duration_min=body.get("duration_min",60))
    db.add(s); db.commit()
    return {"ok": True}

@router.get("/quizzes")
def quizzes(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    course_ids = [c.id for c in db.query(Course).filter(Course.instructor_id == current_user.id).all()]
    quizzes = db.query(Quiz).filter(Quiz.course_id.in_(course_ids)).all() if course_ids else []
    result = []
    for q in quizzes:
        course = db.query(Course).filter(Course.id == q.course_id).first()
        result.append({"id": q.id, "title": q.title, "course": course.title if course else "", "flag_emoji": course.flag_emoji if course else "", "question_count": q.question_count, "avg_score": q.avg_score, "attempts": q.attempts})
    return result

@router.get("/students")
def student_roster(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    course_ids = [c.id for c in db.query(Course).filter(Course.instructor_id == current_user.id).all()]
    enrollments = db.query(Enrollment).filter(Enrollment.course_id.in_(course_ids)).all() if course_ids else []
    result = []
    for e in enrollments:
        student = db.query(User).filter(User.id == e.student_id).first()
        course = db.query(Course).filter(Course.id == e.course_id).first()
        if student:
            result.append({"id": student.id, "name": student.name, "email": student.email, "avatar_initials": student.avatar_initials, "course": course.title if course else "", "pulse_state": student.pulse_state, "xp": student.xp, "completion": round(e.completion_pct, 1), "last_active": student.last_active})
    return result

@router.get("/pulse")
def pulse_insights(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    course_ids = [c.id for c in db.query(Course).filter(Course.instructor_id == current_user.id).all()]
    student_ids = [e.student_id for e in db.query(Enrollment).filter(Enrollment.course_id.in_(course_ids)).all()] if course_ids else []
    dist = {}
    for state in ["thriving","coasting","struggling","burning_out","disengaged"]:
        dist[state] = db.query(User).filter(User.id.in_(student_ids), User.pulse_state == state).count() if student_ids else 0
    return {"distribution": dist, "total": len(set(student_ids))}

@router.get("/messages")
def messages(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    conversations = db.query(Message.sender_id).filter(Message.receiver_id == current_user.id).distinct().all()
    result = []
    for (sid,) in conversations:
        sender = db.query(User).filter(User.id == sid).first()
        last_msg = db.query(Message).filter(Message.sender_id == sid, Message.receiver_id == current_user.id).order_by(Message.created_at.desc()).first()
        unread = db.query(Message).filter(Message.sender_id == sid, Message.receiver_id == current_user.id, Message.is_read == False).count()
        if sender:
            result.append({"id": sender.id, "name": sender.name, "avatar_initials": sender.avatar_initials, "last_message": last_msg.content if last_msg else "", "unread": unread, "last_at": last_msg.created_at if last_msg else None})
    return result

@router.get("/messages/{student_id}")
def get_conversation(student_id: int, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    msgs = db.query(Message).filter(
        ((Message.sender_id == current_user.id) & (Message.receiver_id == student_id)) |
        ((Message.sender_id == student_id) & (Message.receiver_id == current_user.id))
    ).order_by(Message.created_at).all()
    db.query(Message).filter(Message.sender_id == student_id, Message.receiver_id == current_user.id).update({"is_read": True})
    db.commit()
    return [{"id": m.id, "sender_id": m.sender_id, "content": m.content, "created_at": m.created_at, "is_read": m.is_read} for m in msgs]

@router.post("/messages/{student_id}")
def send_message(student_id: int, body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    msg = Message(sender_id=current_user.id, receiver_id=student_id, content=body["content"])
    db.add(msg); db.commit()
    return {"ok": True}

@router.get("/reviews")
def reviews(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    course_ids = [c.id for c in db.query(Course).filter(Course.instructor_id == current_user.id).all()]
    reviews = db.query(Review).filter(Review.course_id.in_(course_ids)).order_by(Review.created_at.desc()).all() if course_ids else []
    result = []
    for r in reviews:
        student = db.query(User).filter(User.id == r.student_id).first()
        course = db.query(Course).filter(Course.id == r.course_id).first()
        result.append({"id": r.id, "student": student.name if student else "", "avatar_initials": student.avatar_initials if student else "", "course": course.title if course else "", "rating": r.rating, "comment": r.comment, "reply": r.reply, "created_at": r.created_at})
    dist = {i: db.query(Review).filter(Review.course_id.in_(course_ids), Review.rating == i).count() for i in range(1,6)} if course_ids else {}
    avg = db.query(func.avg(Review.rating)).filter(Review.course_id.in_(course_ids)).scalar() or 0 if course_ids else 0
    return {"reviews": result, "distribution": dist, "avg_rating": round(avg, 1), "total": len(result)}

@router.patch("/reviews/{review_id}/reply")
def reply_review(review_id: int, body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    r = db.query(Review).filter(Review.id == review_id).first()
    if r: r.reply = body["reply"]; db.commit()
    return {"ok": True}

@router.get("/revenue")
def revenue(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    course_ids = [c.id for c in db.query(Course).filter(Course.instructor_id == current_user.id).all()]
    total_gross = db.query(func.sum(Payment.amount)).filter(Payment.course_id.in_(course_ids), Payment.status == "completed").scalar() or 0 if course_ids else 0
    monthly = db.query(MonthlyRevenue).filter(MonthlyRevenue.instructor_id == current_user.id).order_by(MonthlyRevenue.year, MonthlyRevenue.month).all()
    by_course = []
    for c in db.query(Course).filter(Course.instructor_id == current_user.id).all():
        gross = db.query(func.sum(Payment.amount)).filter(Payment.course_id == c.id, Payment.status == "completed").scalar() or 0
        students = db.query(Enrollment).filter(Enrollment.course_id == c.id).count()
        by_course.append({"course": c.title, "students": students, "gross": round(gross, 2), "fee": round(gross * 0.3, 2), "net": round(gross * 0.7, 2)})
    return {
        "total_gross": round(total_gross, 2),
        "total_net": round(total_gross * 0.7, 2),
        "monthly": [{"month": r.month, "year": r.year, "gross": r.gross, "net": r.net} for r in monthly],
        "by_course": by_course
    }

@router.get("/payouts")
def payouts(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    payouts = db.query(Payout).filter(Payout.instructor_id == current_user.id).order_by(Payout.requested_at.desc()).all()
    course_ids = [c.id for c in db.query(Course).filter(Course.instructor_id == current_user.id).all()]
    paid_out = db.query(func.sum(Payout.amount)).filter(Payout.instructor_id == current_user.id, Payout.status == "paid").scalar() or 0
    total_earned = db.query(func.sum(Payment.amount)).filter(Payment.course_id.in_(course_ids), Payment.status == "completed").scalar() or 0 if course_ids else 0
    available = round(total_earned * 0.7 - paid_out, 2)
    return {
        "available_balance": available,
        "payouts": [{"id": p.id, "reference": p.reference, "amount": p.amount, "status": p.status, "requested_at": p.requested_at, "paid_at": p.paid_at} for p in payouts]
    }

@router.post("/payouts")
def request_payout(body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    import random, string
    ref = "#PAY-" + "".join(random.choices(string.digits, k=4))
    p = Payout(instructor_id=current_user.id, amount=body["amount"], reference=ref)
    db.add(p); db.commit()
    return {"ok": True, "reference": ref}

@router.get("/notifications")
def notifications(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    from app.models import Notification
    notifs = db.query(Notification).filter(
        Notification.target.in_(["all", "instructors", str(current_user.id)])
    ).order_by(Notification.sent_at.desc()).limit(50).all()
    return [{"id": n.id, "title": n.title, "message": n.message, "sent_at": n.sent_at} for n in notifs]

@router.get("/analytics")
def analytics(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    course_ids = [c.id for c in db.query(Course).filter(Course.instructor_id == current_user.id).all()]
    total_students = db.query(Enrollment).filter(Enrollment.course_id.in_(course_ids)).count() if course_ids else 0
    total_revenue = db.query(func.sum(Payment.amount)).filter(Payment.course_id.in_(course_ids), Payment.status == "completed").scalar() or 0 if course_ids else 0
    avg_rating = db.query(func.avg(Review.rating)).filter(Review.course_id.in_(course_ids)).scalar() or 0 if course_ids else 0
    avg_completion = db.query(func.avg(Enrollment.completion_pct)).filter(Enrollment.course_id.in_(course_ids)).scalar() or 0 if course_ids else 0
    monthly = db.query(MonthlyRevenue).filter(MonthlyRevenue.instructor_id == current_user.id).order_by(MonthlyRevenue.year, MonthlyRevenue.month).all()
    course_perf = []
    for c in db.query(Course).filter(Course.instructor_id == current_user.id).all():
        students = db.query(Enrollment).filter(Enrollment.course_id == c.id).count()
        rev = db.query(func.sum(Payment.amount)).filter(Payment.course_id == c.id, Payment.status == "completed").scalar() or 0
        comp = db.query(func.avg(Enrollment.completion_pct)).filter(Enrollment.course_id == c.id).scalar() or 0
        rat = db.query(func.avg(Review.rating)).filter(Review.course_id == c.id).scalar() or 0
        course_perf.append({"title": c.title, "students": students, "revenue": round(rev * 0.7, 2), "completion": round(comp, 1), "rating": round(rat, 1)})
    return {
        "total_students": total_students,
        "total_revenue": round(total_revenue * 0.7, 2),
        "avg_rating": round(avg_rating, 1),
        "avg_completion": round(avg_completion, 1),
        "monthly": [{"month": r.month, "year": r.year, "gross": r.gross, "net": r.net} for r in monthly],
        "course_performance": course_perf
    }

@router.get("/profile")
def get_profile(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    return {"id": current_user.id, "name": current_user.name, "email": current_user.email, "bio": current_user.bio, "avatar_initials": current_user.avatar_initials}

@router.patch("/profile")
def update_profile(body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    for k, v in body.items():
        if hasattr(current_user, k): setattr(current_user, k, v)
    db.commit()
    return {"ok": True}
