"""Seed realistic demo data for FluentFusion"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.models import *
from app.auth import hash_password
from datetime import datetime, timedelta
import random

db = SessionLocal()

def clear():
    from sqlalchemy import text
    tables = ['monthly_revenue','audit_logs','reports','messages','reviews','payments','payouts','notifications','enrollments','quizzes','lessons','live_sessions','courses','users']
    for t in tables:
        db.execute(text(f'TRUNCATE TABLE {t} CASCADE'))
    db.commit()

def seed():
    clear()

    # Admin
    admin = User(
        name="Jean Pierre Niyongabo",
        email="ngabo470@gmail.com",
        hashed_password=hash_password("Admin@123"),
        role=RoleEnum.admin,
        status=StatusEnum.active,
        avatar_initials="JP",
        is_verified=True,
        last_active=datetime.utcnow(),
    )
    db.add(admin)

    # Instructor
    instructor = User(
        name="Jean Pierre Niyongabo",
        email="j.niyongabo@alustudent.com",
        hashed_password=hash_password("Instructor@123"),
        role=RoleEnum.instructor,
        status=StatusEnum.active,
        avatar_initials="JN",
        bio="Language educator and ALU student — teaching French, English, and Kinyarwanda.",
        is_verified=True,
        last_active=datetime.utcnow(),
    )
    db.add(instructor)
    db.commit()

    ins = db.query(User).filter(User.email == "j.niyongabo@alustudent.com").first()

    # Courses
    courses_data = [
        (ins.id, "French B2 — Advanced Grammar", "French", "Advanced", "🇫🇷", CourseStatusEnum.published, 49.99),
        (ins.id, "Spanish A2 — Conversation", "Spanish", "Elementary", "🇪🇸", CourseStatusEnum.published, 39.99),
        (ins.id, "IELTS Writing Mastery", "English", "Intermediate", "🇬🇧", CourseStatusEnum.published, 59.99),
        (ins.id, "German A1 — Absolute Beginner", "German", "Beginner", "🇩🇪", CourseStatusEnum.pending, 34.99),
        (ins.id, "Mandarin HSK 1", "Mandarin", "Beginner", "🇨🇳", CourseStatusEnum.published, 44.99),
        (ins.id, "Japanese N5 — Complete Starter", "Japanese", "Beginner", "🇯🇵", CourseStatusEnum.pending, 49.99),
        (ins.id, "German A2 — Daily Life", "German", "Elementary", "🇩🇪", CourseStatusEnum.published, 39.99),
        (ins.id, "German B1 — Intermediate", "German", "Intermediate", "🇩🇪", CourseStatusEnum.published, 49.99),
    ]
    courses = []
    for ins_id, title, lang, level, flag, status, price in courses_data:
        c = Course(instructor_id=ins_id, title=title, language=lang, level=level, flag_emoji=flag, status=status, price=price, created_at=datetime.utcnow() - timedelta(days=random.randint(30,365)))
        db.add(c)
        courses.append(c)
    db.commit()

    french_b2 = db.query(Course).filter(Course.title.like("French B2%")).first()
    spanish_a2 = db.query(Course).filter(Course.title.like("Spanish A2%")).first()
    ielts = db.query(Course).filter(Course.title.like("IELTS%")).first()
    mandarin = db.query(Course).filter(Course.title.like("Mandarin%")).first()

    # Lessons for French B2
    lessons_fr = [
        ("Introduction to Subjunctive", "video", 18, "Explore the subjunctive mood in French."),
        ("Irregular Verb Forms", "text", 12, "Master irregular verbs in subjunctive."),
        ("Practice Quiz — Part 1", "quiz", 20, "Test your knowledge."),
        ("Conversational Drills", "live", 45, "Live practice session."),
        ("Reading Comprehension", "text", 15, "Advanced reading exercises."),
        ("Mid-Course Assessment", "quiz", 30, "Comprehensive mid-course test."),
        ("Advanced Sentence Structures", "video", 22, "Complex sentence construction."),
        ("Final Live Session", "live", 60, "Final review and Q&A."),
    ]
    for i, (title, ltype, dur, desc) in enumerate(lessons_fr):
        db.add(Lesson(course_id=french_b2.id, title=title, lesson_type=ltype, duration_min=dur, description=desc, order=i+1))

    # Lessons for Spanish A2
    lessons_es = [
        ("Ser vs Estar", "video", 20, "Master the two forms of 'to be'."),
        ("Present Tense Conjugation", "video", 18, "Regular and irregular verbs."),
        ("Vocabulary: Daily Routines", "text", 15, "Essential daily vocabulary."),
        ("Conversation Practice", "live", 45, "Live conversation session."),
        ("Past Tense Introduction", "video", 22, "Preterite and imperfect."),
        ("Quiz: Verb Conjugation", "quiz", 25, "Test your conjugation skills."),
    ]
    for i, (title, ltype, dur, desc) in enumerate(lessons_es):
        db.add(Lesson(course_id=spanish_a2.id, title=title, lesson_type=ltype, duration_min=dur, description=desc, order=i+1))
    db.commit()

    # Quizzes
    quizzes = [
        Quiz(course_id=french_b2.id, title="Subjunctive Quiz #1", question_count=12, avg_score=84.0, attempts=341),
        Quiz(course_id=spanish_a2.id, title="Verb Conjugation Test", question_count=15, avg_score=77.0, attempts=218),
        Quiz(course_id=ielts.id, title="IELTS Task 2 Assessment", question_count=8, avg_score=71.0, attempts=156),
        Quiz(course_id=mandarin.id, title="HSK 1 Vocabulary Quiz", question_count=20, avg_score=79.0, attempts=289),
    ]
    for q in quizzes: db.add(q)
    db.commit()

    # Live Sessions
    now = datetime.utcnow()
    sessions = [
        LiveSession(course_id=french_b2.id, title="French B2 — Subjunctive Deep Dive", scheduled_at=now - timedelta(hours=1), attendees=48, status=SessionStatusEnum.live),
        LiveSession(course_id=spanish_a2.id, title="Spanish A2 — Verb Conjugation Workshop", scheduled_at=now + timedelta(hours=5), attendees=0, status=SessionStatusEnum.scheduled),
        LiveSession(course_id=ielts.id, title="IELTS Writing Task 2 Masterclass", scheduled_at=now + timedelta(days=3), attendees=0, status=SessionStatusEnum.scheduled),
        LiveSession(course_id=french_b2.id, title="Passé Composé Deep Dive", scheduled_at=now - timedelta(days=2), attendees=53, status=SessionStatusEnum.completed, duration_min=62, recording_url="https://example.com/rec/1"),
        LiveSession(course_id=spanish_a2.id, title="Ser vs Estar Workshop", scheduled_at=now - timedelta(days=4), attendees=38, status=SessionStatusEnum.completed, duration_min=45, recording_url="https://example.com/rec/2"),
        LiveSession(course_id=ielts.id, title="Task 1 Writing Techniques", scheduled_at=now - timedelta(days=7), attendees=61, status=SessionStatusEnum.completed, duration_min=58),
        LiveSession(course_id=mandarin.id, title="Mandarin Tones Workshop", scheduled_at=now - timedelta(hours=2), attendees=62, status=SessionStatusEnum.live),
    ]
    for s in sessions: db.add(s)
    db.commit()

    # Student
    student = User(
        name="Jean Pierre Niyongabo",
        email="ngabo7834@gmail.com",
        hashed_password=hash_password("Student@123"),
        role=RoleEnum.student,
        status=StatusEnum.active,
        avatar_initials="JN",
        pulse_state=PulseStateEnum.thriving,
        xp=12400,
        is_verified=True,
        last_active=datetime.utcnow(),
        created_at=datetime.utcnow() - timedelta(days=90),
    )
    db.add(student)
    db.commit()

    stu = db.query(User).filter(User.email == "ngabo7834@gmail.com").first()

    # Enrollments
    published_courses = [french_b2.id, spanish_a2.id, ielts.id, mandarin.id]
    for cid in random.sample(published_courses, 3):
        db.add(Enrollment(student_id=stu.id, course_id=cid, completion_pct=random.uniform(20, 90), enrolled_at=datetime.utcnow() - timedelta(days=random.randint(10, 80))))
    db.commit()

    # Payments
    enrolls = db.query(Enrollment).filter(Enrollment.student_id == stu.id).all()
    for e in enrolls:
        course = db.query(Course).filter(Course.id == e.course_id).first()
        if course:
            db.add(Payment(user_id=stu.id, course_id=course.id, amount=course.price, method=random.choice(["Card", "Mobile", "PayPal"]), status="completed", created_at=e.enrolled_at))
    db.commit()

    # Monthly Revenue (platform-wide)
    months_data = [(2025,3,32000),(2025,4,38000),(2025,5,41000),(2025,6,44000),(2025,7,39000),(2025,8,42000),(2025,9,48000),(2025,10,51000),(2025,11,46000),(2025,12,53000),(2026,1,58000),(2026,2,61000),(2026,3,92400)]
    for yr, mo, gross in months_data:
        db.add(MonthlyRevenue(year=yr, month=mo, gross=gross, net=round(gross*0.7,2), instructor_id=None))

    # Monthly Revenue (instructor)
    ins_months = [(2025,3,2800),(2025,4,3200),(2025,5,3600),(2025,6,3900),(2025,7,3400),(2025,8,3700),(2025,9,4200),(2025,10,4500),(2025,11,4100),(2025,12,4700),(2026,1,5100),(2026,2,5400),(2026,3,6114)]
    for yr, mo, gross in ins_months:
        db.add(MonthlyRevenue(year=yr, month=mo, gross=gross, net=round(gross*0.7,2), instructor_id=ins.id))
    db.commit()

    # Payouts
    payouts = [
        Payout(instructor_id=ins.id, amount=2996, status=PayoutStatusEnum.pending, reference="#PAY-0042", requested_at=datetime.utcnow()),
        Payout(instructor_id=ins.id, amount=3240, status=PayoutStatusEnum.paid, reference="#PAY-0038", requested_at=datetime.utcnow()-timedelta(days=29), paid_at=datetime.utcnow()-timedelta(days=24)),
        Payout(instructor_id=ins.id, amount=2780, status=PayoutStatusEnum.paid, reference="#PAY-0031", requested_at=datetime.utcnow()-timedelta(days=61), paid_at=datetime.utcnow()-timedelta(days=56)),
    ]
    for p in payouts: db.add(p)
    db.commit()

    # Reviews
    reviews = [
        Review(student_id=stu.id, course_id=french_b2.id, rating=5, comment="Absolutely the best French course I've found online. The live sessions are gold.", reply="Thank you! Your dedication makes teaching so rewarding.", created_at=datetime.utcnow()-timedelta(days=2)),
        Review(student_id=stu.id, course_id=spanish_a2.id, rating=4, comment="Great course structure. Would love more speaking exercises.", created_at=datetime.utcnow()-timedelta(days=7)),
    ]
    for r in reviews: db.add(r)
    db.commit()

    # Messages
    messages = [
        Message(sender_id=stu.id, receiver_id=ins.id, content="Bonjour! I watched the subjunctive lesson — very clear. When is the next live session?", created_at=datetime.utcnow()-timedelta(hours=3)),
        Message(sender_id=ins.id, receiver_id=stu.id, content="The next session is today at 2PM — see it in your dashboard. See you there! 🎉", created_at=datetime.utcnow()-timedelta(hours=2, minutes=50)),
        Message(sender_id=stu.id, receiver_id=ins.id, content="Perfect! Also, is there a cheat sheet for the irregular verbs in lesson 3?", is_read=False, created_at=datetime.utcnow()-timedelta(hours=2, minutes=30)),
    ]
    for m in messages: db.add(m)
    db.commit()

    # Notifications
    notifications = [
        Notification(title="Platform maintenance — March 10", message="Scheduled maintenance on March 10 from 02:00-04:00 UTC. Expect brief downtime.", target="all", sent_at=datetime.utcnow()-timedelta(days=1), recipients=28441, read_rate=84.0),
        Notification(title="New instructor verification process", message="We've updated our instructor verification process. Please review the new requirements.", target="instructors", sent_at=datetime.utcnow()-timedelta(days=2), recipients=312, read_rate=71.0),
        Notification(title="IELTS course collection launched", message="Explore our new IELTS preparation courses from top instructors.", target="students", sent_at=datetime.utcnow()-timedelta(days=6), recipients=24820, read_rate=61.0),
    ]
    for n in notifications: db.add(n)
    db.commit()

    # Audit Logs
    adm = db.query(User).filter(User.email == "ngabo470@gmail.com").first()
    logs = [
        AuditLog(admin_id=adm.id, action_type="COURSE", description='Admin approved course "IELTS Writing Mastery"', created_at=datetime.utcnow()-timedelta(hours=1)),
        AuditLog(admin_id=None, action_type="SYSTEM", description="System auto-flagged: CDN latency breach · +340ms above threshold", created_at=datetime.utcnow()-timedelta(hours=2)),
        AuditLog(admin_id=None, action_type="SYSTEM", description="PULSE Engine re-evaluated learners — classification updated", created_at=datetime.utcnow()-timedelta(hours=3)),
        AuditLog(admin_id=None, action_type="SYSTEM", description="System health check passed · API ONLINE · DB HEALTHY", created_at=datetime.utcnow()-timedelta(hours=4)),
        AuditLog(admin_id=adm.id, action_type="USER", description="Admin verified instructor j.niyongabo@alustudent.com", created_at=datetime.utcnow()-timedelta(days=1)),
    ]
    for l in logs: db.add(l)
    db.commit()

    # Reports
    reports = [
        Report(report_type="HARASSMENT", content="Community post by User_4421: [Offensive content targeting ethnic background...]", status="open", created_at=datetime.utcnow()-timedelta(days=2)),
        Report(report_type="SPAM", content="Quiz answer reported as incorrect on French B2 Lesson 12 — 8 students flagged", status="open", created_at=datetime.utcnow()-timedelta(hours=6)),
        Report(report_type="CONTENT", content="IELTS Writing Lesson 7 — vocabulary list appears to contain outdated exam terms", status="open", created_at=datetime.utcnow()-timedelta(hours=12)),
        Report(report_type="SPAM", content="User repeatedly posting promotional links in course comments", status="resolved", created_at=datetime.utcnow()-timedelta(days=3)),
        Report(report_type="HARASSMENT", content="Instructor received threatening messages from student account", status="resolved", created_at=datetime.utcnow()-timedelta(days=5)),
    ]
    for r in reports: db.add(r)
    db.commit()

    print("✅ Seed complete!")
    print(f"  Admin: 1")
    print(f"  Instructors: {db.query(User).filter(User.role==RoleEnum.instructor).count()}")
    print(f"  Students: {db.query(User).filter(User.role==RoleEnum.student).count()}")
    print(f"  Courses: {db.query(Course).count()}")
    print(f"  Enrollments: {db.query(Enrollment).count()}")
    print(f"  Payments: {db.query(Payment).count()}")
    print()
    print("Login credentials:")
    print("  Admin:      ngabo470@gmail.com / Admin@123")
    print("  Instructor: j.niyongabo@alustudent.com / Instructor@123")
    print("  Student:    ngabo7834@gmail.com / Student@123")

if __name__ == "__main__":
    seed()
