from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
import os, uuid
from app.models import get_db, User, Course, Module, Enrollment, Payment, Payout, LiveSession, Quiz, Lesson, Message, Review, MonthlyRevenue, Notification, NotificationRead, RoleEnum, CourseStatusEnum, ModuleQuiz, QuizQuestion, QuizAttempt, QuizPositionEnum, ContentVersion, CourseDraft
from app.auth import require_role, get_current_user
from app.notify import notify
from typing import Optional
import json
from datetime import timedelta

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
        module_count = db.query(Module).filter(Module.course_id == c.id).count()
        course_data.append({"id": c.id, "title": c.title, "language": c.language, "level": c.level, "flag_emoji": c.flag_emoji, "status": c.status, "students": students, "revenue": round(rev * 0.7, 2), "completion": round(avg_comp, 1), "rating": round(avg_rat, 1), "lesson_count": lesson_count, "module_count": module_count})
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
    courses = db.query(Course).filter(Course.instructor_id == current_user.id).order_by(Course.updated_at.desc()).all()
    result = []
    for c in courses:
        students = db.query(Enrollment).filter(Enrollment.course_id == c.id).count()
        rev = db.query(func.sum(Payment.amount)).filter(Payment.course_id == c.id, Payment.status == "completed").scalar() or 0
        lesson_count = db.query(Lesson).filter(Lesson.course_id == c.id).count()
        module_count = db.query(Module).filter(Module.course_id == c.id).count()
        result.append({
            "id": c.id, "title": c.title, "subtitle": c.subtitle, "description": c.description,
            "category": c.category, "language": c.language, "level": c.level, "flag_emoji": c.flag_emoji,
            "thumbnail_url": c.thumbnail_url, "intro_video_url": c.intro_video_url,
            "status": c.status, "price": c.price, "is_free": c.is_free,
            "what_you_learn": c.what_you_learn, "requirements": c.requirements, "target_audience": c.target_audience,
            "rejection_feedback": c.rejection_feedback, "admin_notes": c.admin_notes,
            "students": students, "revenue": round(rev * 0.7, 2), "lesson_count": lesson_count, "module_count": module_count,
            "submitted_at": c.submitted_at, "approved_at": c.approved_at, "published_at": c.published_at,
            "created_at": c.created_at, "updated_at": c.updated_at,
        })
    return result

@router.get("/courses/{course_id}")
def get_course(course_id: int, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    c = db.query(Course).filter(Course.id == course_id, Course.instructor_id == current_user.id).first()
    if not c: raise HTTPException(status_code=404, detail="Not found")
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
            "lessons": [{"id": l.id, "title": l.title, "lesson_type": l.lesson_type, "duration_min": l.duration_min,
                         "video_url": l.video_url, "content": l.content, "resource_url": l.resource_url,
                         "description": l.description, "order": l.order, "is_preview": l.is_preview} for l in lessons],
            "quizzes": quiz_data
        })
    # Lessons not in any module
    loose = db.query(Lesson).filter(Lesson.course_id == c.id, Lesson.module_id == None).order_by(Lesson.order).all()
    return {
        "id": c.id, "title": c.title, "subtitle": c.subtitle, "description": c.description,
        "category": c.category, "language": c.language, "level": c.level, "flag_emoji": c.flag_emoji,
        "thumbnail_url": c.thumbnail_url, "intro_video_url": c.intro_video_url,
        "status": c.status, "price": c.price, "is_free": c.is_free,
        "what_you_learn": c.what_you_learn, "requirements": c.requirements, "target_audience": c.target_audience,
        "rejection_feedback": c.rejection_feedback, "admin_notes": c.admin_notes,
        "modules": module_data,
        "loose_lessons": [{"id": l.id, "title": l.title, "lesson_type": l.lesson_type, "duration_min": l.duration_min,
                           "video_url": l.video_url, "content": l.content, "resource_url": l.resource_url,
                           "description": l.description, "order": l.order, "is_preview": l.is_preview} for l in loose],
        "submitted_at": c.submitted_at, "approved_at": c.approved_at, "published_at": c.published_at,
        "created_at": c.created_at, "updated_at": c.updated_at,
    }

@router.post("/courses")
def create_course(body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    lang = body.get("language", "")
    flag_map = {"French":"🇫🇷","English":"🇬🇧","Spanish":"🇪🇸","German":"🇩🇪","Japanese":"🇯🇵",
                "Mandarin":"🇨🇳","Portuguese":"🇵🇹","Italian":"🇮🇹","Russian":"🇷🇺","Korean":"🇰🇷","Arabic":"🇸🇦","Dutch":"🇳🇱"}
    course = Course(
        title=body["title"], subtitle=body.get("subtitle"),
        description=body.get("description"), category=body.get("category"),
        language=lang, level=body.get("level"),
        flag_emoji=body.get("flag_emoji") or flag_map.get(lang, "📚"),
        thumbnail_url=body.get("thumbnail_url"), intro_video_url=body.get("intro_video_url"),
        instructor_id=current_user.id,
        price=body.get("price", 49.99), is_free=body.get("is_free", False),
        what_you_learn=body.get("what_you_learn"), requirements=body.get("requirements"),
        target_audience=body.get("target_audience"),
        status=CourseStatusEnum.draft,
    )
    db.add(course); db.commit(); db.refresh(course)
    return {"id": course.id, "title": course.title, "status": course.status}

@router.patch("/courses/{course_id}")
def update_course(course_id: int, body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    course = db.query(Course).filter(Course.id == course_id, Course.instructor_id == current_user.id).first()
    if not course: raise HTTPException(status_code=404, detail="Not found")
    if course.status == CourseStatusEnum.pending:
        raise HTTPException(status_code=403, detail="Cannot edit a course under review")
    allowed = ["title","subtitle","description","category","language","level","flag_emoji",
               "thumbnail_url","intro_video_url","price","is_free","what_you_learn","requirements","target_audience"]
    for k in allowed:
        if k in body: setattr(course, k, body[k])
    course.updated_at = datetime.utcnow()
    db.commit()
    return {"ok": True}

@router.delete("/courses/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    course = db.query(Course).filter(Course.id == course_id, Course.instructor_id == current_user.id).first()
    if not course: raise HTTPException(status_code=404, detail="Not found")
    if course.status in (CourseStatusEnum.published, CourseStatusEnum.pending):
        raise HTTPException(status_code=403, detail="Cannot delete a published or pending course")
    db.delete(course); db.commit()
    return {"ok": True}

# ── Modules ──────────────────────────────────────────────────────────────

@router.get("/courses/{course_id}/modules")
def get_modules(course_id: int, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    course = db.query(Course).filter(Course.id == course_id, Course.instructor_id == current_user.id).first()
    if not course: raise HTTPException(status_code=404, detail="Not found")
    modules = db.query(Module).filter(Module.course_id == course_id).order_by(Module.order).all()
    result = []
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
        result.append({
            "id": m.id, "title": m.title, "description": m.description, "order": m.order,
            "lessons": [{"id": l.id, "title": l.title, "lesson_type": l.lesson_type, "duration_min": l.duration_min,
                         "video_url": l.video_url, "content": l.content, "resource_url": l.resource_url,
                         "description": l.description, "order": l.order, "is_preview": l.is_preview} for l in lessons],
            "quizzes": quiz_data
        })
    return result

@router.post("/courses/{course_id}/modules")
def create_module(course_id: int, body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    course = db.query(Course).filter(Course.id == course_id, Course.instructor_id == current_user.id).first()
    if not course: raise HTTPException(status_code=404, detail="Not found")
    max_order = db.query(func.max(Module.order)).filter(Module.course_id == course_id).scalar() or 0
    m = Module(course_id=course_id, title=body["title"], description=body.get("description", ""), order=max_order + 1)
    db.add(m); db.commit(); db.refresh(m)
    return {"id": m.id, "title": m.title, "description": m.description, "order": m.order, "lessons": [], "quizzes": []}

@router.patch("/courses/{course_id}/modules/{module_id}")
def update_module(course_id: int, module_id: int, body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    m = db.query(Module).filter(Module.id == module_id, Module.course_id == course_id).first()
    if not m: raise HTTPException(status_code=404, detail="Not found")
    if "title" in body: m.title = body["title"]
    if "description" in body: m.description = body["description"]
    if "order" in body: m.order = body["order"]
    db.commit()
    return {"ok": True}

@router.delete("/courses/{course_id}/modules/{module_id}")
def delete_module(course_id: int, module_id: int, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    m = db.query(Module).filter(Module.id == module_id, Module.course_id == course_id).first()
    if m: db.delete(m); db.commit()
    return {"ok": True}

# ── Lessons ───────────────────────────────────────────────────────────────

@router.get("/courses/{course_id}/lessons")
def course_lessons(course_id: int, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    lessons = db.query(Lesson).filter(Lesson.course_id == course_id).order_by(Lesson.order).all()
    return [{"id": l.id, "title": l.title, "lesson_type": l.lesson_type, "duration_min": l.duration_min,
             "order": l.order, "description": l.description, "video_url": l.video_url,
             "content": l.content, "resource_url": l.resource_url, "module_id": l.module_id,
             "is_preview": l.is_preview} for l in lessons]

@router.post("/courses/{course_id}/lessons")
def create_lesson(course_id: int, body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    module_id = body.get("module_id")
    max_order = db.query(func.max(Lesson.order)).filter(Lesson.course_id == course_id).scalar() or 0
    lesson = Lesson(
        course_id=course_id, module_id=module_id,
        title=body["title"], lesson_type=body.get("lesson_type", "video"),
        duration_min=body.get("duration_min", 15), description=body.get("description", ""),
        video_url=body.get("video_url", ""), content=body.get("content", ""),
        resource_url=body.get("resource_url", ""),
        order=body.get("order", max_order + 1), is_preview=body.get("is_preview", False),
        external_embed_code=body.get("external_embed_code"),
        transcript=body.get("transcript"),
        is_downloadable=body.get("is_downloadable", False),
    )
    db.add(lesson); db.commit(); db.refresh(lesson)
    return {"id": lesson.id, "title": lesson.title, "lesson_type": lesson.lesson_type,
            "duration_min": lesson.duration_min, "order": lesson.order, "module_id": lesson.module_id}

@router.patch("/courses/{course_id}/lessons/{lesson_id}")
def update_lesson(course_id: int, lesson_id: int, body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.course_id == course_id).first()
    if not lesson: raise HTTPException(status_code=404, detail="Not found")
    for k in ["title","lesson_type","duration_min","description","video_url","content","resource_url","order","module_id","is_preview","external_embed_code","transcript","is_downloadable","mime_type","file_size_bytes","thumbnail_url"]:
        if k in body: setattr(lesson, k, body[k])
    db.commit()
    return {"ok": True}

@router.delete("/courses/{course_id}/lessons/{lesson_id}")
def delete_lesson(course_id: int, lesson_id: int, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.course_id == course_id).first()
    if lesson: db.delete(lesson); db.commit()
    return {"ok": True}

# ── Module Quizzes ─────────────────────────────────────────────────────────

@router.get("/courses/{course_id}/modules/{module_id}/quizzes")
def get_module_quizzes(course_id: int, module_id: int, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    module = db.query(Module).filter(Module.id == module_id, Module.course_id == course_id).first()
    if not module: raise HTTPException(status_code=404, detail="Module not found")
    quizzes = db.query(ModuleQuiz).filter(ModuleQuiz.module_id == module_id).order_by(ModuleQuiz.order).all()
    result = []
    for q in quizzes:
        questions = db.query(QuizQuestion).filter(QuizQuestion.quiz_id == q.id).order_by(QuizQuestion.order).all()
        result.append({
            "id": q.id, "title": q.title, "position": q.position,
            "passing_score": q.passing_score, "time_limit_min": q.time_limit_min,
            "is_required": q.is_required, "order": q.order,
            "questions": [{"id": qu.id, "question_text": qu.question_text, "question_type": qu.question_type,
                           "options": qu.options, "correct_answer": qu.correct_answer,
                           "explanation": qu.explanation, "points": qu.points, "order": qu.order}
                          for qu in questions]
        })
    return result

@router.post("/courses/{course_id}/modules/{module_id}/quizzes")
def create_module_quiz(course_id: int, module_id: int, body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    module = db.query(Module).filter(Module.id == module_id, Module.course_id == course_id).first()
    if not module: raise HTTPException(status_code=404, detail="Module not found")
    max_order = db.query(func.max(ModuleQuiz.order)).filter(ModuleQuiz.module_id == module_id).scalar() or 0
    quiz = ModuleQuiz(
        module_id=module_id,
        title=body["title"],
        position=body.get("position", "end"),
        passing_score=body.get("passing_score", 70),
        time_limit_min=body.get("time_limit_min"),
        is_required=body.get("is_required", True),
        order=max_order + 1
    )
    db.add(quiz); db.commit(); db.refresh(quiz)
    return {"id": quiz.id, "title": quiz.title, "position": quiz.position, "passing_score": quiz.passing_score,
            "time_limit_min": quiz.time_limit_min, "is_required": quiz.is_required, "order": quiz.order, "questions": []}

@router.patch("/courses/{course_id}/modules/{module_id}/quizzes/{quiz_id}")
def update_module_quiz(course_id: int, module_id: int, quiz_id: int, body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    quiz = db.query(ModuleQuiz).filter(ModuleQuiz.id == quiz_id, ModuleQuiz.module_id == module_id).first()
    if not quiz: raise HTTPException(status_code=404, detail="Quiz not found")
    for k in ["title", "position", "passing_score", "time_limit_min", "is_required", "order"]:
        if k in body: setattr(quiz, k, body[k])
    db.commit()
    return {"ok": True}

@router.delete("/courses/{course_id}/modules/{module_id}/quizzes/{quiz_id}")
def delete_module_quiz(course_id: int, module_id: int, quiz_id: int, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    quiz = db.query(ModuleQuiz).filter(ModuleQuiz.id == quiz_id, ModuleQuiz.module_id == module_id).first()
    if quiz: db.delete(quiz); db.commit()
    return {"ok": True}

@router.post("/courses/{course_id}/modules/{module_id}/quizzes/{quiz_id}/questions")
def add_quiz_question(course_id: int, module_id: int, quiz_id: int, body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    quiz = db.query(ModuleQuiz).filter(ModuleQuiz.id == quiz_id, ModuleQuiz.module_id == module_id).first()
    if not quiz: raise HTTPException(status_code=404, detail="Quiz not found")
    max_order = db.query(func.max(QuizQuestion.order)).filter(QuizQuestion.quiz_id == quiz_id).scalar() or 0
    question = QuizQuestion(
        quiz_id=quiz_id,
        question_text=body["question_text"],
        question_type=body.get("question_type", "multiple_choice"),
        options=body.get("options"),  # JSON string
        correct_answer=body["correct_answer"],
        explanation=body.get("explanation"),
        points=body.get("points", 1),
        order=max_order + 1
    )
    db.add(question); db.commit(); db.refresh(question)
    return {"id": question.id, "question_text": question.question_text, "question_type": question.question_type,
            "options": question.options, "correct_answer": question.correct_answer, "explanation": question.explanation,
            "points": question.points, "order": question.order}

@router.patch("/courses/{course_id}/modules/{module_id}/quizzes/{quiz_id}/questions/{question_id}")
def update_quiz_question(course_id: int, module_id: int, quiz_id: int, question_id: int, body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    question = db.query(QuizQuestion).filter(QuizQuestion.id == question_id, QuizQuestion.quiz_id == quiz_id).first()
    if not question: raise HTTPException(status_code=404, detail="Question not found")
    for k in ["question_text", "question_type", "options", "correct_answer", "explanation", "points", "order"]:
        if k in body: setattr(question, k, body[k])
    db.commit()
    return {"ok": True}

@router.delete("/courses/{course_id}/modules/{module_id}/quizzes/{quiz_id}/questions/{question_id}")
def delete_quiz_question(course_id: int, module_id: int, quiz_id: int, question_id: int, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    question = db.query(QuizQuestion).filter(QuizQuestion.id == question_id, QuizQuestion.quiz_id == quiz_id).first()
    if question: db.delete(question); db.commit()
    return {"ok": True}

# ── Autosave / Versions ───────────────────────────────────────────────────

@router.post("/courses/{course_id}/autosave")
def autosave_course(course_id: int, body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    course = db.query(Course).filter(Course.id == course_id, Course.instructor_id == current_user.id).first()
    if not course: raise HTTPException(status_code=404, detail="Not found")
    # Upsert autosave draft
    draft = db.query(CourseDraft).filter(
        CourseDraft.course_id == course_id,
        CourseDraft.instructor_id == current_user.id,
        CourseDraft.is_autosave == True
    ).first()
    snapshot = json.dumps(body)
    expires = datetime.utcnow() + timedelta(days=30)
    if draft:
        draft.draft_data = snapshot
        draft.updated_at = datetime.utcnow()
        draft.expires_at = expires
    else:
        draft = CourseDraft(course_id=course_id, instructor_id=current_user.id,
                            draft_data=snapshot, is_autosave=True, expires_at=expires)
        db.add(draft)
    # Also create a version entry
    last_ver = db.query(func.max(ContentVersion.version_number)).filter(
        ContentVersion.content_type == "course", ContentVersion.content_id == course_id
    ).scalar() or 0
    db.add(ContentVersion(
        content_type="course", content_id=course_id,
        version_number=last_ver + 1, created_by=current_user.id,
        change_summary="Autosave", snapshot_data=snapshot, is_autosave=True
    ))
    db.commit()
    return {"ok": True, "version": last_ver + 1}

@router.get("/courses/{course_id}/versions")
def get_versions(course_id: int, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    course = db.query(Course).filter(Course.id == course_id, Course.instructor_id == current_user.id).first()
    if not course: raise HTTPException(status_code=404, detail="Not found")
    versions = db.query(ContentVersion).filter(
        ContentVersion.content_type == "course",
        ContentVersion.content_id == course_id
    ).order_by(ContentVersion.version_number.desc()).limit(50).all()
    return [{"id": v.id, "version_number": v.version_number, "change_summary": v.change_summary,
             "is_autosave": v.is_autosave, "created_at": v.created_at} for v in versions]

@router.post("/courses/{course_id}/versions/{version_id}/restore")
def restore_version(course_id: int, version_id: int, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    course = db.query(Course).filter(Course.id == course_id, Course.instructor_id == current_user.id).first()
    if not course: raise HTTPException(status_code=404, detail="Not found")
    version = db.query(ContentVersion).filter(
        ContentVersion.id == version_id,
        ContentVersion.content_type == "course",
        ContentVersion.content_id == course_id
    ).first()
    if not version: raise HTTPException(status_code=404, detail="Version not found")
    return {"ok": True, "snapshot": json.loads(version.snapshot_data)}

@router.post("/courses/{course_id}/versions/save")
def save_version(course_id: int, body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    """Manual save with a descriptive note."""
    course = db.query(Course).filter(Course.id == course_id, Course.instructor_id == current_user.id).first()
    if not course: raise HTTPException(status_code=404, detail="Not found")
    last_ver = db.query(func.max(ContentVersion.version_number)).filter(
        ContentVersion.content_type == "course", ContentVersion.content_id == course_id
    ).scalar() or 0
    db.add(ContentVersion(
        content_type="course", content_id=course_id,
        version_number=last_ver + 1, created_by=current_user.id,
        change_summary=body.get("change_summary", "Manual save"),
        snapshot_data=json.dumps(body.get("snapshot", {})),
        is_autosave=False
    ))
    db.commit()
    return {"ok": True, "version": last_ver + 1}

# ── Lesson file uploads ────────────────────────────────────────────────────

@router.post("/lessons/{lesson_id}/upload-video")
async def upload_lesson_video(lesson_id: int, file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(guard)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson: raise HTTPException(status_code=404, detail="Not found")
    content_type = file.content_type or ""
    if content_type not in ALLOWED["video"]:
        raise HTTPException(status_code=400, detail=f"File type '{content_type}' not allowed for video")
    ext = os.path.splitext(file.filename or "file")[1].lower() or ".mp4"
    filename = f"{uuid.uuid4().hex}{ext}"
    path = os.path.join(UPLOAD_DIR, filename)
    content = await file.read()
    with open(path, "wb") as f:
        f.write(content)
    lesson.video_url = f"/uploads/{filename}"
    lesson.mime_type = content_type
    lesson.file_size_bytes = len(content)
    db.commit()
    return {"url": lesson.video_url, "filename": file.filename, "content_type": content_type}

@router.post("/lessons/{lesson_id}/upload-resource")
async def upload_lesson_resource(lesson_id: int, file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(guard)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson: raise HTTPException(status_code=404, detail="Not found")
    content_type = file.content_type or ""
    if content_type not in ALLOWED["resource"]:
        raise HTTPException(status_code=400, detail=f"File type '{content_type}' not allowed for resource")
    ext = os.path.splitext(file.filename or "file")[1].lower() or ".pdf"
    filename = f"{uuid.uuid4().hex}{ext}"
    path = os.path.join(UPLOAD_DIR, filename)
    content = await file.read()
    with open(path, "wb") as f:
        f.write(content)
    lesson.resource_url = f"/uploads/{filename}"
    lesson.mime_type = content_type
    lesson.file_size_bytes = len(content)
    db.commit()
    return {"url": lesson.resource_url, "filename": file.filename, "content_type": content_type}

# ── Submit / Publish ───────────────────────────────────────────────────────

@router.post("/courses/{course_id}/submit")
def submit_for_review(course_id: int, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    course = db.query(Course).filter(Course.id == course_id, Course.instructor_id == current_user.id).first()
    if not course: raise HTTPException(status_code=404, detail="Not found")
    if course.status == CourseStatusEnum.pending:
        raise HTTPException(status_code=400, detail="Already under review")
    if course.status == CourseStatusEnum.published:
        raise HTTPException(status_code=400, detail="Already published")
    # Validation
    if not course.title or not course.description or not course.language or not course.level:
        raise HTTPException(status_code=400, detail="Complete all required fields: title, description, language, level")
    
    # Validate modules and lessons
    modules = db.query(Module).filter(Module.course_id == course_id).all()
    if len(modules) < 1:
        raise HTTPException(status_code=400, detail="Course must have at least 1 module before submitting")
    
    total_lessons = db.query(Lesson).filter(Lesson.course_id == course_id).count()
    if total_lessons < 1:
        raise HTTPException(status_code=400, detail="Course must have at least 1 lesson before submitting")
    
    course.status = CourseStatusEnum.pending
    course.submitted_at = datetime.utcnow()
    course.rejection_feedback = None
    db.commit()
    notify(db, title="📚 Course Submitted for Review",
           message=f"{current_user.name} submitted '{course.title}' for review.",
           target="admins", link="/admin/approvals", course_id=course.id)
    db.commit()
    return {"ok": True}

@router.post("/courses/{course_id}/publish")
def publish_course(course_id: int, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    course = db.query(Course).filter(Course.id == course_id, Course.instructor_id == current_user.id).first()
    if not course: raise HTTPException(status_code=404, detail="Not found")
    if course.status != CourseStatusEnum.approved:
        raise HTTPException(status_code=403, detail="Course must be approved before publishing")
    course.status = CourseStatusEnum.published
    course.published_at = datetime.utcnow()
    db.commit()
    # Notify all enrolled students
    enrolled = db.query(Enrollment).filter(Enrollment.course_id == course_id).all()
    for e in enrolled:
        notify(db, title="🚀 Course Now Live!",
               message=f"'{course.title}' is now published and ready for you.",
               target=str(e.student_id), link="/dashboard/courses", course_id=course_id)
    db.commit()
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
    db.add(s)
    db.commit()
    # Notify enrolled students
    course = db.query(Course).filter(Course.id == body["course_id"]).first()
    enrolled = db.query(Enrollment).filter(Enrollment.course_id == body["course_id"]).all()
    scheduled_str = datetime.fromisoformat(body["scheduled_at"]).strftime("%b %d at %H:%M")
    for e in enrolled:
        notify(db, title="🎤 Live Session Scheduled",
               message=f"{current_user.name} scheduled '{body['title']}' for {scheduled_str}.",
               target=str(e.student_id), link="/dashboard/live-sessions", course_id=body["course_id"])
    db.commit()
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
    db.add(msg)
    notify(db, title="💬 New Message",
           message=f"{current_user.name} sent you a message.",
           target=str(student_id), link="/dashboard/messages")
    db.commit()
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
    db.add(p)
    # Notify admins
    notify(db, title="💸 Payout Requested",
           message=f"{current_user.name} requested a payout of ${body['amount']:.2f} ({ref}).",
           target="admins", link="/admin/payouts")
    db.commit()
    return {"ok": True, "reference": ref}

@router.get("/notifications")
def notifications(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    targets = ["all", "instructors", str(current_user.id)]
    notifs = db.query(Notification).filter(
        Notification.target.in_(targets),
        Notification.notif_type == "notification"
    ).order_by(Notification.sent_at.desc()).limit(50).all()
    read_ids = {r.notification_id for r in db.query(NotificationRead).filter(NotificationRead.user_id == current_user.id).all()}
    return [{"id": n.id, "title": n.title, "message": n.message, "link": n.link, "sent_at": n.sent_at, "is_read": n.id in read_ids} for n in notifs]

@router.get("/notifications/unread-count")
def notifications_unread_count(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    targets = ["all", "instructors", str(current_user.id)]
    total = db.query(Notification).filter(Notification.target.in_(targets), Notification.notif_type == "notification").count()
    read = db.query(NotificationRead).filter(
        NotificationRead.user_id == current_user.id,
        NotificationRead.notification_id.in_(
            db.query(Notification.id).filter(Notification.target.in_(targets), Notification.notif_type == "notification")
        )
    ).count()
    return {"count": max(0, total - read)}

@router.post("/notifications/mark-read")
def mark_notifications_read(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    targets = ["all", "instructors", str(current_user.id)]
    notif_ids = [n.id for n in db.query(Notification.id).filter(Notification.target.in_(targets), Notification.notif_type == "notification").all()]
    existing = {r.notification_id for r in db.query(NotificationRead).filter(NotificationRead.user_id == current_user.id).all()}
    for nid in notif_ids:
        if nid not in existing:
            db.add(NotificationRead(user_id=current_user.id, notification_id=nid))
    db.commit()
    return {"ok": True}

@router.get("/announcements")
def list_announcements(db: Session = Depends(get_db), current_user: User = Depends(guard)):
    notifs = db.query(Notification).filter(
        Notification.sender_id == current_user.id,
        Notification.notif_type == "announcement"
    ).order_by(Notification.sent_at.desc()).limit(50).all()
    return [{"id": n.id, "title": n.title, "message": n.message, "target": n.target or "", "sent_at": n.sent_at, "recipients": n.recipients, "allow_replies": n.allow_replies} for n in notifs]

@router.post("/announcements")
def send_announcement(body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    target = body.get("target", "all_students")
    course_id = body.get("course_id")
    recipients = 0
    if target == "all_students":
        recipients = db.query(User).filter(User.role == RoleEnum.student).count()
    elif target == "course" and course_id:
        recipients = db.query(Enrollment).filter(Enrollment.course_id == course_id).count()
        target = f"course_{course_id}"
    n = Notification(
        title=body["title"], message=body["message"],
        target=target, recipients=recipients, sender_id=current_user.id,
        course_id=course_id, allow_replies=body.get("allow_replies", False),
        notif_type="announcement"
    )
    db.add(n); db.commit()
    return {"ok": True}

@router.post("/notifications")
def send_notification(body: dict, db: Session = Depends(get_db), current_user: User = Depends(guard)):
    """Legacy endpoint — kept for backward compat."""
    return send_announcement(body, db, current_user)

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

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED = {
    "video": ["video/mp4", "video/webm", "video/ogg", "video/quicktime"],
    "audio": ["audio/mpeg", "audio/mp3", "audio/ogg", "audio/wav", "audio/webm"],
    "resource": ["application/pdf", "application/msword",
                 "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
}

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), _: User = Depends(guard)):
    content_type = file.content_type or ""
    all_allowed = [m for types in ALLOWED.values() for m in types]
    if content_type not in all_allowed:
        raise HTTPException(status_code=400, detail=f"File type '{content_type}' not allowed")
    ext = os.path.splitext(file.filename or "file")[1].lower() or ".bin"
    filename = f"{uuid.uuid4().hex}{ext}"
    path = os.path.join(UPLOAD_DIR, filename)
    with open(path, "wb") as f:
        f.write(await file.read())
    return {"url": f"/uploads/{filename}", "filename": file.filename, "content_type": content_type}
