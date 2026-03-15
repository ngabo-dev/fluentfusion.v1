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

    # Admins
    admins = [
        User(name="Chidi Okafor", email="c.okafor@fluentfusion.com", hashed_password=hash_password("admin123"), role=RoleEnum.admin, status=StatusEnum.active, avatar_initials="CO", is_verified=True, last_active=datetime.utcnow()),
        User(name="Rania Ahmed", email="r.ahmed@fluentfusion.com", hashed_password=hash_password("admin123"), role=RoleEnum.admin, status=StatusEnum.active, avatar_initials="RA", is_verified=True, last_active=datetime.utcnow() - timedelta(hours=3)),
        User(name="Bola Mensah", email="b.mensah@fluentfusion.com", hashed_password=hash_password("admin123"), role=RoleEnum.admin, status=StatusEnum.active, avatar_initials="BM", is_verified=True, last_active=datetime.utcnow() - timedelta(days=1)),
    ]
    for a in admins: db.add(a)
    db.commit()

    # Instructors
    instructors_data = [
        ("Amara Ndiaye", "a.ndiaye@ff.com", "AN", "Passionate language educator with 10+ years teaching French, Spanish, and English."),
        ("Lena Chen", "l.chen@ff.com", "LC", "Mandarin and Japanese specialist with HSK certification."),
        ("Malik Braun", "m.braun@ff.com", "MB", "German language expert, native speaker, 8 years teaching experience."),
        ("Riku Tanaka", "r.tanaka@ff.com", "RT", "Japanese language instructor, JLPT N1 certified."),
        ("Lucas Ferreira", "l.ferreira@ff.com", "LF", "Brazilian Portuguese instructor, linguistics PhD."),
        ("Claude Hiroshi", "c.hiroshi@teach.net", "CH", "Pending verification — Japanese and Korean instructor."),
    ]
    instructors = []
    for name, email, initials, bio in instructors_data:
        status = StatusEnum.pending if email == "c.hiroshi@teach.net" else StatusEnum.active
        verified = email != "c.hiroshi@teach.net"
        u = User(name=name, email=email, hashed_password=hash_password("instructor123"), role=RoleEnum.instructor, status=status, avatar_initials=initials, bio=bio, is_verified=verified, last_active=datetime.utcnow() - timedelta(hours=random.randint(1,48)))
        db.add(u)
        instructors.append(u)
    db.commit()

    amara = db.query(User).filter(User.email == "a.ndiaye@ff.com").first()
    lena = db.query(User).filter(User.email == "l.chen@ff.com").first()
    malik = db.query(User).filter(User.email == "m.braun@ff.com").first()

    # Courses
    courses_data = [
        (amara.id, "French B2 — Advanced Grammar", "French", "Advanced", "🇫🇷", CourseStatusEnum.published, 49.99),
        (amara.id, "Spanish A2 — Conversation", "Spanish", "Elementary", "🇪🇸", CourseStatusEnum.published, 39.99),
        (amara.id, "IELTS Writing Mastery", "English", "Intermediate", "🇬🇧", CourseStatusEnum.published, 59.99),
        (amara.id, "German A1 — Absolute Beginner", "German", "Beginner", "🇩🇪", CourseStatusEnum.pending, 34.99),
        (lena.id, "Mandarin HSK 1", "Mandarin", "Beginner", "🇨🇳", CourseStatusEnum.published, 44.99),
        (lena.id, "Japanese N5 — Complete Starter", "Japanese", "Beginner", "🇯🇵", CourseStatusEnum.pending, 49.99),
        (malik.id, "German A2 — Daily Life", "German", "Elementary", "🇩🇪", CourseStatusEnum.published, 39.99),
        (malik.id, "German B1 — Intermediate", "German", "Intermediate", "🇩🇪", CourseStatusEnum.published, 49.99),
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

    # Students
    students_data = [
        ("Kwame Larbi", "k.larbi@gmail.com", "KL", PulseStateEnum.thriving, 12400),
        ("Fatima Al-Rashid", "f.rashid@univ.edu", "FA", PulseStateEnum.coasting, 11100),
        ("Amara Diallo", "amara.d@school.rw", "AD", PulseStateEnum.struggling, 9800),
        ("Jean-Paul Nkurikiye", "jp.nkurikiye@alu.edu", "JN", PulseStateEnum.burning_out, 8600),
        ("Sofia Mendez", "s.mendez@mail.es", "SM", PulseStateEnum.disengaged, 7900),
        ("Aisha Kamara", "a.kamara@gmail.com", "AK", PulseStateEnum.thriving, 13200),
        ("Yuki Tanaka", "y.tanaka@mail.jp", "YT", PulseStateEnum.coasting, 10500),
        ("Omar Hassan", "o.hassan@edu.ke", "OH", PulseStateEnum.struggling, 8200),
        ("Marie Dupont", "m.dupont@mail.fr", "MD", PulseStateEnum.thriving, 14100),
        ("Carlos Rivera", "c.rivera@mail.mx", "CR", PulseStateEnum.coasting, 9300),
    ]
    students = []
    for name, email, initials, pulse, xp in students_data:
        last_active = datetime.utcnow() - timedelta(days=random.randint(0,10))
        u = User(name=name, email=email, hashed_password=hash_password("student123"), role=RoleEnum.student, status=StatusEnum.active, avatar_initials=initials, pulse_state=pulse, xp=xp, last_active=last_active, created_at=datetime.utcnow() - timedelta(days=random.randint(60,400)))
        db.add(u)
        students.append(u)

    # Banned user
    banned = User(name="Unknown_7841", email="spam@temp-mail.org", hashed_password=hash_password("x"), role=RoleEnum.student, status=StatusEnum.banned, avatar_initials="X", created_at=datetime.utcnow() - timedelta(days=1))
    db.add(banned)
    db.commit()

    kwame = db.query(User).filter(User.email == "k.larbi@gmail.com").first()
    fatima = db.query(User).filter(User.email == "f.rashid@univ.edu").first()
    amara_d = db.query(User).filter(User.email == "amara.d@school.rw").first()
    jean_paul = db.query(User).filter(User.email == "jp.nkurikiye@alu.edu").first()
    sofia = db.query(User).filter(User.email == "s.mendez@mail.es").first()

    # Enrollments
    enrollments = [
        (kwame.id, french_b2.id, 88.0),
        (kwame.id, spanish_a2.id, 72.0),
        (fatima.id, spanish_a2.id, 72.0),
        (fatima.id, ielts.id, 65.0),
        (amara_d.id, french_b2.id, 54.0),
        (jean_paul.id, ielts.id, 41.0),
        (sofia.id, spanish_a2.id, 28.0),
    ]
    for sid, cid, comp in enrollments:
        db.add(Enrollment(student_id=sid, course_id=cid, completion_pct=comp, enrolled_at=datetime.utcnow() - timedelta(days=random.randint(10,120))))

    # Add more enrollments for realistic counts
    published_courses = [french_b2.id, spanish_a2.id, ielts.id, mandarin.id]
    all_students = db.query(User).filter(User.role == RoleEnum.student).all()
    for student in all_students:
        for cid in random.sample(published_courses, random.randint(1,3)):
            existing = db.query(Enrollment).filter(Enrollment.student_id == student.id, Enrollment.course_id == cid).first()
            if not existing:
                db.add(Enrollment(student_id=student.id, course_id=cid, completion_pct=random.uniform(10,95), enrolled_at=datetime.utcnow() - timedelta(days=random.randint(5,200))))
    db.commit()

    # Payments
    for student in all_students:
        enrolls = db.query(Enrollment).filter(Enrollment.student_id == student.id).all()
        for e in enrolls:
            course = db.query(Course).filter(Course.id == e.course_id).first()
            if course:
                status = random.choices(["completed","failed","refunded"], weights=[90,7,3])[0]
                db.add(Payment(user_id=student.id, course_id=course.id, amount=course.price, method=random.choice(["Card","Mobile","PayPal"]), status=status, created_at=e.enrolled_at))
    db.commit()

    # Monthly Revenue (platform-wide)
    months_data = [(2025,3,32000),(2025,4,38000),(2025,5,41000),(2025,6,44000),(2025,7,39000),(2025,8,42000),(2025,9,48000),(2025,10,51000),(2025,11,46000),(2025,12,53000),(2026,1,58000),(2026,2,61000),(2026,3,92400)]
    for yr, mo, gross in months_data:
        db.add(MonthlyRevenue(year=yr, month=mo, gross=gross, net=round(gross*0.7,2), instructor_id=None))

    # Monthly Revenue (Amara)
    amara_months = [(2025,3,2800),(2025,4,3200),(2025,5,3600),(2025,6,3900),(2025,7,3400),(2025,8,3700),(2025,9,4200),(2025,10,4500),(2025,11,4100),(2025,12,4700),(2026,1,5100),(2026,2,5400),(2026,3,6114)]
    for yr, mo, gross in amara_months:
        db.add(MonthlyRevenue(year=yr, month=mo, gross=gross, net=round(gross*0.7,2), instructor_id=amara.id))
    db.commit()

    # Payouts
    payouts = [
        Payout(instructor_id=amara.id, amount=2996, status=PayoutStatusEnum.pending, reference="#PAY-0042", requested_at=datetime.utcnow()),
        Payout(instructor_id=amara.id, amount=3240, status=PayoutStatusEnum.paid, reference="#PAY-0038", requested_at=datetime.utcnow()-timedelta(days=29), paid_at=datetime.utcnow()-timedelta(days=24)),
        Payout(instructor_id=amara.id, amount=2780, status=PayoutStatusEnum.paid, reference="#PAY-0031", requested_at=datetime.utcnow()-timedelta(days=61), paid_at=datetime.utcnow()-timedelta(days=56)),
        Payout(instructor_id=lena.id, amount=4120, status=PayoutStatusEnum.pending, reference="#PAY-0041", requested_at=datetime.utcnow()),
        Payout(instructor_id=malik.id, amount=2340, status=PayoutStatusEnum.approved, reference="#PAY-0039", requested_at=datetime.utcnow()-timedelta(days=1)),
    ]
    for p in payouts: db.add(p)
    db.commit()

    # Reviews
    reviews = [
        Review(student_id=kwame.id, course_id=french_b2.id, rating=5, comment="Absolutely the best French course I've found online. The live sessions are gold.", reply="Thank you Kwame! Your dedication makes teaching so rewarding.", created_at=datetime.utcnow()-timedelta(days=2)),
        Review(student_id=fatima.id, course_id=spanish_a2.id, rating=5, comment="I went from zero Spanish to holding conversations in 2 months. Really well thought-out.", created_at=datetime.utcnow()-timedelta(days=4)),
        Review(student_id=jean_paul.id, course_id=ielts.id, rating=3, comment="Good content but the pacing felt fast for Task 2. Would love more example essays.", created_at=datetime.utcnow()-timedelta(days=7)),
        Review(student_id=amara_d.id, course_id=french_b2.id, rating=4, comment="Very comprehensive. The grammar explanations are crystal clear.", created_at=datetime.utcnow()-timedelta(days=10)),
        Review(student_id=sofia.id, course_id=spanish_a2.id, rating=4, comment="Great course structure. Would love more speaking exercises.", created_at=datetime.utcnow()-timedelta(days=14)),
    ]
    for r in reviews: db.add(r)
    db.commit()

    # Messages
    messages = [
        Message(sender_id=kwame.id, receiver_id=amara.id, content="Bonjour! I watched the subjunctive lesson — very clear. When is the next live session?", created_at=datetime.utcnow()-timedelta(hours=3)),
        Message(sender_id=amara.id, receiver_id=kwame.id, content="Hi Kwame! The next session is today at 2PM — see it in your dashboard. See you there! 🎉", created_at=datetime.utcnow()-timedelta(hours=2, minutes=50)),
        Message(sender_id=kwame.id, receiver_id=amara.id, content="Perfect! Also, is there a cheat sheet for the irregular verbs in lesson 3?", is_read=False, created_at=datetime.utcnow()-timedelta(hours=2, minutes=30)),
        Message(sender_id=fatima.id, receiver_id=amara.id, content="Thank you for the feedback on my essay!", created_at=datetime.utcnow()-timedelta(hours=5)),
        Message(sender_id=amara_d.id, receiver_id=amara.id, content="I'm struggling with lesson 4, the subjunctive forms are confusing.", is_read=False, created_at=datetime.utcnow()-timedelta(days=1)),
        Message(sender_id=jean_paul.id, receiver_id=amara.id, content="Can I get an extension on the final assessment?", created_at=datetime.utcnow()-timedelta(days=2)),
        Message(sender_id=sofia.id, receiver_id=amara.id, content="I might need to pause my subscription for a month.", is_read=False, created_at=datetime.utcnow()-timedelta(days=3)),
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
    chidi = db.query(User).filter(User.email == "c.okafor@fluentfusion.com").first()
    rania = db.query(User).filter(User.email == "r.ahmed@fluentfusion.com").first()
    bola = db.query(User).filter(User.email == "b.mensah@fluentfusion.com").first()
    logs = [
        AuditLog(admin_id=chidi.id, action_type="USER", description="Admin Chidi Okafor banned user Unknown_7841 for spam", created_at=datetime.utcnow()-timedelta(minutes=45)),
        AuditLog(admin_id=rania.id, action_type="COURSE", description='Admin Rania Ahmed rejected course "Python Basics" — not language learning', created_at=datetime.utcnow()-timedelta(hours=1)),
        AuditLog(admin_id=chidi.id, action_type="FINANCE", description="Admin Chidi Okafor approved payout #PAY-0039 for $2,340 to Malik Braun", created_at=datetime.utcnow()-timedelta(hours=1, minutes=30)),
        AuditLog(admin_id=None, action_type="SYSTEM", description="System auto-flagged: CDN latency breach · +340ms above threshold", created_at=datetime.utcnow()-timedelta(hours=2)),
        AuditLog(admin_id=rania.id, action_type="USER", description="Admin Rania Ahmed approved instructor Lena Chen verification", created_at=datetime.utcnow()-timedelta(hours=2, minutes=30)),
        AuditLog(admin_id=None, action_type="SYSTEM", description="PULSE Engine re-evaluated 28,441 learners — classification updated", created_at=datetime.utcnow()-timedelta(hours=3)),
        AuditLog(admin_id=None, action_type="SYSTEM", description="System health check passed · API ONLINE · DB HEALTHY · REDIS 12ms", created_at=datetime.utcnow()-timedelta(hours=4)),
        AuditLog(admin_id=bola.id, action_type="USER", description="Admin Bola Mensah banned 3 spam accounts from moderation queue", created_at=datetime.utcnow()-timedelta(days=1)),
        AuditLog(admin_id=chidi.id, action_type="COURSE", description='Admin Chidi Okafor approved course "IELTS Writing Mastery" by Amara Ndiaye', created_at=datetime.utcnow()-timedelta(days=2)),
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
    print(f"  Admins: {db.query(User).filter(User.role==RoleEnum.admin).count()}")
    print(f"  Instructors: {db.query(User).filter(User.role==RoleEnum.instructor).count()}")
    print(f"  Students: {db.query(User).filter(User.role==RoleEnum.student).count()}")
    print(f"  Courses: {db.query(Course).count()}")
    print(f"  Enrollments: {db.query(Enrollment).count()}")
    print(f"  Payments: {db.query(Payment).count()}")
    print()
    print("Login credentials:")
    print("  Admin:      c.okafor@fluentfusion.com / admin123")
    print("  Instructor: a.ndiaye@ff.com / instructor123")
    print("  Student:    k.larbi@gmail.com / student123")

if __name__ == "__main__":
    seed()
