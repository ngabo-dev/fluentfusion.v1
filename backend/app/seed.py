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
    tables = [
        'meeting_invites', 'meetings',
        'notification_replies', 'notification_reactions', 'notification_reads',
        'monthly_revenue', 'audit_logs', 'reports', 'messages', 'reviews',
        'payments', 'payouts', 'notifications',
        'enrollments', 'quiz_attempts', 'quiz_questions', 'module_quizzes',
        'quizzes', 'lessons', 'modules',
        'live_sessions', 'courses', 'users',
    ]
    for t in tables:
        try:
            db.execute(text(f'TRUNCATE TABLE {t} RESTART IDENTITY CASCADE'))
        except Exception:
            db.rollback()
    db.commit()

def seed():
    clear()

    # ── Users ──────────────────────────────────────────────────────────────
    admin = User(
        name="Chioma Okafor", email="c.okafor@fluentfusion.com",
        hashed_password=hash_password("admin123"),
        role=RoleEnum.admin, status=StatusEnum.active,
        avatar_initials="CO", is_verified=True, last_active=datetime.utcnow(),
    )
    db.add(admin)


    # ── Courses ────────────────────────────────────────────────────────────
    COURSES = [
        dict(
            title="French B2 — Advanced Grammar",
            subtitle="Master the subjunctive, conditional and complex sentence structures",
            description="Take your French to the next level. This course covers advanced grammar topics including the subjunctive mood, conditional tenses, relative clauses, and sophisticated vocabulary. Perfect for learners who already have a solid B1 foundation and want to reach fluency.",
            language="French", level="Advanced", flag_emoji="🇫🇷",
            status=CourseStatusEnum.published, price=49.99,
            what_you_learn="Use the subjunctive mood correctly\nMaster all conditional tenses\nWrite complex, nuanced sentences\nUnderstand native-speed French audio\nPass the DALF C1 preparation exercises",
            requirements="B1 level French or equivalent\nBasic understanding of verb conjugation",
            target_audience="Intermediate French learners aiming for fluency",
        ),
        dict(
            title="Spanish A2 — Everyday Conversation",
            subtitle="Build confidence speaking Spanish in real-life situations",
            description="This practical course focuses on conversational Spanish for everyday situations — shopping, travel, work, and social settings. You will build vocabulary, improve pronunciation, and gain the confidence to hold real conversations.",
            language="Spanish", level="Elementary", flag_emoji="🇪🇸",
            status=CourseStatusEnum.published, price=39.99,
            what_you_learn="Hold basic conversations in Spanish\nDescribe your daily routine\nAsk for and give directions\nOrder food and shop confidently\nUnderstand common Spanish expressions",
            requirements="A1 Spanish or complete beginner with some exposure",
            target_audience="Beginners who want to start speaking Spanish fast",
        ),
        dict(
            title="IELTS Writing Mastery",
            subtitle="Score 7.0+ on IELTS Academic Writing Tasks 1 & 2",
            description="A comprehensive IELTS Academic Writing preparation course. Learn the exact strategies, structures, and vocabulary needed to score Band 7 or above. Includes full mock tasks with model answers and detailed feedback frameworks.",
            language="English", level="Intermediate", flag_emoji="🇬🇧",
            status=CourseStatusEnum.published, price=59.99,
            what_you_learn="Write a Band 7+ Task 1 report in 20 minutes\nStructure a compelling Task 2 essay\nUse academic vocabulary naturally\nAvoid the most common IELTS mistakes\nManage your time under exam conditions",
            requirements="B2 English level minimum\nFamiliarity with the IELTS exam format",
            target_audience="Students and professionals preparing for IELTS Academic",
        ),
        dict(
            title="Mandarin HSK 1 — Complete Starter",
            subtitle="Learn 150 essential words and pass the HSK 1 exam",
            description="Start your Mandarin journey with this structured HSK 1 preparation course. You will learn all 150 vocabulary words, basic sentence patterns, pinyin pronunciation, and the most common characters. By the end you will be ready to sit the HSK 1 exam.",
            language="Mandarin", level="Beginner", flag_emoji="🇨🇳",
            status=CourseStatusEnum.published, price=44.99,
            what_you_learn="Pronounce Mandarin using pinyin\nLearn all 150 HSK 1 vocabulary words\nForm basic sentences in Mandarin\nRead and write 50 common characters\nPass the official HSK 1 exam",
            requirements="No prior Mandarin knowledge needed",
            target_audience="Complete beginners curious about Mandarin Chinese",
        ),
        dict(
            title="German A1 — Absolute Beginner",
            subtitle="Your first steps into the German language",
            description="Start speaking German from day one. This course introduces you to German pronunciation, basic grammar, essential vocabulary, and everyday phrases. Ideal for complete beginners.",
            language="German", level="Beginner", flag_emoji="🇩🇪",
            status=CourseStatusEnum.pending, price=34.99,
            what_you_learn="Introduce yourself in German\nCount, tell the time and use dates\nAsk and answer simple questions\nUnderstand basic written German",
            requirements="No prior German knowledge needed",
            target_audience="Complete beginners starting German from scratch",
        ),
        dict(
            title="German A2 — Daily Life",
            subtitle="Communicate confidently in everyday German situations",
            description="Build on your A1 foundation and start communicating in real German situations — at work, in shops, with neighbours. Covers past tense, modal verbs, and practical vocabulary.",
            language="German", level="Elementary", flag_emoji="🇩🇪",
            status=CourseStatusEnum.published, price=39.99,
            what_you_learn="Talk about past events in German\nUse modal verbs correctly\nNavigate everyday situations in German\nExpand your vocabulary to 500+ words",
            requirements="A1 German or equivalent",
            target_audience="A1 German learners ready to progress",
        ),
        dict(
            title="German B1 — Intermediate",
            subtitle="Reach conversational fluency in German",
            description="The B1 course takes you to conversational fluency. You will master the subjunctive, passive voice, complex sentence structures, and develop the vocabulary needed for professional and social contexts.",
            language="German", level="Intermediate", flag_emoji="🇩🇪",
            status=CourseStatusEnum.published, price=49.99,
            what_you_learn="Use the Konjunktiv II naturally\nUnderstand German news and podcasts\nWrite formal emails in German\nDiscuss opinions and abstract topics",
            requirements="A2 German or equivalent",
            target_audience="A2 learners aiming for B1 certification",
        ),
        dict(
            title="Japanese N5 — Complete Starter",
            subtitle="Master hiragana, katakana and basic Japanese grammar",
            description="A complete beginner course covering the JLPT N5 syllabus. Learn hiragana and katakana scripts, essential grammar patterns, and the 800 most common vocabulary words.",
            language="Japanese", level="Beginner", flag_emoji="🇯🇵",
            status=CourseStatusEnum.pending, price=49.99,
            what_you_learn="Read and write hiragana and katakana\nLearn 800 essential vocabulary words\nForm basic Japanese sentences\nUnderstand simple Japanese conversations\nPrepare for the JLPT N5 exam",
            requirements="No prior Japanese knowledge needed",
            target_audience="Complete beginners interested in Japanese",
        ),
    ]

    for cd in COURSES:
        c = Course(
            instructor_id=admin.id,
            created_at=datetime.utcnow() - timedelta(days=random.randint(30, 365)),
            **cd,
        )
        db.add(c)
    db.commit()

    def gc(fragment):
        return db.query(Course).filter(Course.title.like(f"%{fragment}%")).first()

    fr    = gc("French B2")
    es    = gc("Spanish A2")
    ielts = gc("IELTS")
    zh    = gc("Mandarin")

    # ── Modules + Lessons ──────────────────────────────────────────────────
    def add_module(course, title, order, lessons):
        m = Module(course_id=course.id, title=title, order=order)
        db.add(m)
        db.flush()
        for i, (ltitle, ltype, dur, desc) in enumerate(lessons):
            db.add(Lesson(
                course_id=course.id, module_id=m.id,
                title=ltitle, lesson_type=ltype,
                duration_min=dur, description=desc,
                order=i + 1, is_preview=(i == 0),
            ))

    # French B2
    add_module(fr, "The Subjunctive Mood", 1, [
        ("What is the Subjunctive?", "video", 14, "An introduction to the subjunctive mood — when and why French uses it."),
        ("Forming the Present Subjunctive", "video", 18, "Step-by-step guide to conjugating regular and irregular verbs in the subjunctive."),
        ("Subjunctive Triggers", "text", 12, "The key conjunctions and expressions that always require the subjunctive."),
        ("Practice: Subjunctive Drills", "quiz", 20, "Consolidate your knowledge with targeted conjugation exercises."),
    ])
    add_module(fr, "Conditional Tenses", 2, [
        ("Present Conditional", "video", 16, "How to form and use the present conditional for hypothetical situations."),
        ("Past Conditional", "video", 20, "Expressing what would have happened — the past conditional explained."),
        ("Si Clauses", "text", 15, "Combining conditional tenses with si clauses for complex hypotheticals."),
        ("Conditional Quiz", "quiz", 25, "Test your mastery of both conditional tenses."),
    ])
    add_module(fr, "Advanced Sentence Structures", 3, [
        ("Relative Clauses with Dont & Où", "video", 18, "Using dont and où to build sophisticated relative clauses."),
        ("Nominalization", "text", 14, "Turning verbs and adjectives into nouns for formal writing."),
        ("Reading: Le Monde Article", "text", 20, "Analyse a real Le Monde article and identify advanced structures."),
        ("Final Assessment", "quiz", 30, "Comprehensive test covering all three modules."),
    ])

    # Spanish A2
    add_module(es, "Core Verbs & Tenses", 1, [
        ("Ser vs Estar — The Full Picture", "video", 20, "Master the distinction between ser and estar with real-world examples."),
        ("Present Tense: Regular Verbs", "video", 15, "Conjugating -ar, -er and -ir verbs in the present tense."),
        ("Present Tense: Irregular Verbs", "video", 18, "The 20 most common irregular verbs you must know."),
        ("Verb Quiz", "quiz", 20, "Practice conjugating the verbs from this module."),
    ])
    add_module(es, "Everyday Conversations", 2, [
        ("Greetings & Introductions", "video", 12, "How to introduce yourself and greet people naturally in Spanish."),
        ("Shopping & Ordering Food", "video", 16, "Essential phrases for markets, restaurants and cafés."),
        ("Asking for Directions", "text", 14, "Vocabulary and phrases for navigating a Spanish-speaking city."),
        ("Conversation Practice Quiz", "quiz", 20, "Test your conversational vocabulary."),
    ])
    add_module(es, "Past Tense", 3, [
        ("Preterite Tense Introduction", "video", 22, "Talking about completed past actions with the preterite."),
        ("Imperfect Tense", "video", 20, "Describing ongoing past states and habitual actions."),
        ("Preterite vs Imperfect", "text", 18, "The key to choosing the right past tense every time."),
        ("Past Tense Assessment", "quiz", 25, "Final test on both past tenses."),
    ])

    # IELTS
    add_module(ielts, "Task 1 — Data Reports", 1, [
        ("Understanding Task 1 Requirements", "video", 15, "What the examiner is looking for and how the band descriptors work."),
        ("Describing Charts & Graphs", "video", 20, "Language for trends, comparisons and data description."),
        ("Model Answer Walkthrough", "text", 18, "Annotated Band 8 model answer with examiner commentary."),
        ("Task 1 Practice", "quiz", 30, "Write and self-assess a full Task 1 response."),
    ])
    add_module(ielts, "Task 2 — Academic Essays", 2, [
        ("Essay Types & Structures", "video", 18, "Opinion, discussion, problem-solution and two-part question essays."),
        ("Introduction & Conclusion Formulas", "video", 16, "Proven templates for opening and closing your essay."),
        ("Body Paragraph Development", "text", 20, "How to build a coherent, well-supported argument."),
        ("Vocabulary for Academic Writing", "text", 22, "High-scoring lexical resource — collocations, hedging and discourse markers."),
        ("Full Mock Essay", "quiz", 40, "Write a complete Task 2 essay under timed conditions."),
    ])

    # Mandarin HSK 1
    add_module(zh, "Pronunciation & Pinyin", 1, [
        ("The Four Tones", "video", 16, "Master Mandarin tones with audio examples and minimal pair practice."),
        ("Pinyin System", "video", 18, "Complete guide to the pinyin romanisation system."),
        ("Pronunciation Drills", "audio", 20, "Listen and repeat exercises for all pinyin combinations."),
    ])
    add_module(zh, "HSK 1 Vocabulary", 2, [
        ("People & Greetings (Words 1–30)", "video", 20, "The first 30 HSK 1 words — greetings, family and basic nouns."),
        ("Numbers, Time & Dates (Words 31–70)", "video", 22, "Counting, telling the time and expressing dates in Mandarin."),
        ("Daily Life Vocabulary (Words 71–150)", "text", 25, "The remaining HSK 1 words covering food, transport and daily activities."),
        ("Vocabulary Quiz", "quiz", 30, "Test all 150 HSK 1 vocabulary words."),
    ])
    add_module(zh, "Basic Grammar & Characters", 3, [
        ("Basic Sentence Structure", "video", 18, "Subject-Verb-Object order and question formation in Mandarin."),
        ("50 Essential Characters", "text", 30, "Learn to read and write the 50 most common HSK 1 characters."),
        ("HSK 1 Mock Exam", "quiz", 40, "Full practice exam in the official HSK 1 format."),
    ])

    db.commit()

    # ── Quizzes (dashboard stats) ──────────────────────────────────────────
    for title, cobj, qcount, avg, attempts in [
        ("Subjunctive Quiz #1",     fr,    12, 84.0, 341),
        ("Verb Conjugation Test",   es,    15, 77.0, 218),
        ("IELTS Task 2 Assessment", ielts,  8, 71.0, 156),
        ("HSK 1 Vocabulary Quiz",   zh,    20, 79.0, 289),
    ]:
        db.add(Quiz(course_id=cobj.id, title=title, question_count=qcount, avg_score=avg, attempts=attempts))
    db.commit()

    # ── Live Sessions ──────────────────────────────────────────────────────
    now = datetime.utcnow()
    for cobj, title, delta, attendees, status, dur, rec in [
        (fr,    "French B2 — Subjunctive Deep Dive",      timedelta(hours=-1), 48, SessionStatusEnum.live,      60, None),
        (es,    "Spanish A2 — Verb Conjugation Workshop", timedelta(hours=5),   0, SessionStatusEnum.scheduled,  60, None),
        (ielts, "IELTS Writing Task 2 Masterclass",       timedelta(days=3),    0, SessionStatusEnum.scheduled,  90, None),
        (fr,    "Passé Composé Deep Dive",                timedelta(days=-2),  53, SessionStatusEnum.completed,  62, "https://example.com/rec/1"),
        (es,    "Ser vs Estar Workshop",                  timedelta(days=-4),  38, SessionStatusEnum.completed,  45, "https://example.com/rec/2"),
        (ielts, "Task 1 Writing Techniques",              timedelta(days=-7),  61, SessionStatusEnum.completed,  58, None),
        (zh,    "Mandarin Tones Workshop",                timedelta(hours=-2), 62, SessionStatusEnum.live,       60, None),
    ]:
        db.add(LiveSession(
            course_id=cobj.id, title=title,
            scheduled_at=now + delta, attendees=attendees,
            status=status, duration_min=dur, recording_url=rec,
        ))
    db.commit()

    # ── Student ────────────────────────────────────────────────────────────
    student = User(
        name="Kofi Larbi", email="k.larbi@gmail.com",
        hashed_password=hash_password("student123"),
        role=RoleEnum.student, status=StatusEnum.active,
        avatar_initials="KL",
        pulse_state=PulseStateEnum.thriving, xp=12400,
        is_verified=True, last_active=datetime.utcnow(),
        created_at=datetime.utcnow() - timedelta(days=90),
    )
    db.add(student)
    db.commit()

    stu = db.query(User).filter(User.email == "k.larbi@gmail.com").first()

    for cid in random.sample([fr.id, es.id, ielts.id, zh.id], 3):
        db.add(Enrollment(
            student_id=stu.id, course_id=cid,
            completion_pct=random.uniform(20, 85),
            enrolled_at=datetime.utcnow() - timedelta(days=random.randint(10, 80)),
        ))
    db.commit()

    for e in db.query(Enrollment).filter(Enrollment.student_id == stu.id).all():
        c = db.query(Course).filter(Course.id == e.course_id).first()
        if c:
            db.add(Payment(
                user_id=stu.id, course_id=c.id, amount=c.price,
                method=random.choice(["Card", "Mobile", "PayPal"]),
                status="completed", created_at=e.enrolled_at,
            ))
    db.commit()

    # ── Revenue ────────────────────────────────────────────────────────────
    for yr, mo, gross in [
        (2025,3,32000),(2025,4,38000),(2025,5,41000),(2025,6,44000),
        (2025,7,39000),(2025,8,42000),(2025,9,48000),(2025,10,51000),
        (2025,11,46000),(2025,12,53000),(2026,1,58000),(2026,2,61000),(2026,3,92400),
    ]:
        db.add(MonthlyRevenue(year=yr, month=mo, gross=gross, net=round(gross*0.7, 2)))
    for yr, mo, gross in [
        (2025,3,2800),(2025,4,3200),(2025,5,3600),(2025,6,3900),
        (2025,7,3400),(2025,8,3700),(2025,9,4200),(2025,10,4500),
        (2025,11,4100),(2025,12,4700),(2026,1,5100),(2026,2,5400),(2026,3,6114),
    ]:
        db.add(MonthlyRevenue(year=yr, month=mo, gross=gross, net=round(gross*0.7, 2), instructor_id=adm.id))
    db.commit()

    # ── Payouts ────────────────────────────────────────────────────────────
    for amt, status, ref, days_ago, paid_ago in [
        (2996, PayoutStatusEnum.pending, "#PAY-0042", 0,  None),
        (3240, PayoutStatusEnum.paid,    "#PAY-0038", 29, 24),
        (2780, PayoutStatusEnum.paid,    "#PAY-0031", 61, 56),
    ]:
        db.add(Payout(
            instructor_id=adm.id, amount=amt, status=status, reference=ref,
            requested_at=datetime.utcnow() - timedelta(days=days_ago),
            paid_at=datetime.utcnow() - timedelta(days=paid_ago) if paid_ago else None,
        ))
    db.commit()

    # ── Reviews ────────────────────────────────────────────────────────────
    db.add(Review(student_id=stu.id, course_id=fr.id, rating=5,
        comment="Absolutely the best French course I've found online. The live sessions are gold.",
        reply="Thank you! Your dedication makes teaching so rewarding.",
        created_at=datetime.utcnow() - timedelta(days=2)))
    db.add(Review(student_id=stu.id, course_id=es.id, rating=4,
        comment="Great course structure. Would love more speaking exercises.",
        created_at=datetime.utcnow() - timedelta(days=7)))
    db.commit()

    # ── Messages ───────────────────────────────────────────────────────────
    for sid, rid, content, hrs, read in [
        (stu.id, adm.id, "Bonjour! I watched the subjunctive lesson — very clear. When is the next live session?", 3,    True),
        (adm.id, stu.id, "The next session is today at 2PM — see it in your dashboard. See you there! 🎉",          2.83, True),
        (stu.id, adm.id, "Perfect! Also, is there a cheat sheet for the irregular verbs in lesson 3?",              2.5,  False),
    ]:
        db.add(Message(sender_id=sid, receiver_id=rid, content=content,
                       is_read=read, created_at=datetime.utcnow() - timedelta(hours=hrs)))
    db.commit()

    # ── Notifications ──────────────────────────────────────────────────────
    for title, msg, target, days_ago, recipients, read_rate, ntype in [
        ("Platform maintenance — March 10",
         "Scheduled maintenance on March 10 from 02:00–04:00 UTC. Expect brief downtime.",
         "all", 1, 28441, 84.0, "notification"),
        ("New instructor verification process",
         "We've updated our instructor verification process. Please review the new requirements.",
         "instructors", 2, 312, 71.0, "notification"),
        ("IELTS course collection launched",
         "Explore our new IELTS preparation courses from top instructors.",
         "students", 6, 24820, 61.0, "announcement"),
    ]:
        db.add(Notification(title=title, message=msg, target=target,
                            sent_at=datetime.utcnow() - timedelta(days=days_ago),
                            recipients=recipients, read_rate=read_rate, notif_type=ntype))
    db.commit()

    # ── Audit Logs ─────────────────────────────────────────────────────────
    adm = db.query(User).filter(User.email == "c.okafor@fluentfusion.com").first()
    for atype, desc, hrs in [
        ("COURSE", 'Admin approved course "IELTS Writing Mastery"', 1),
        ("SYSTEM", "System auto-flagged: CDN latency breach · +340ms above threshold", 2),
        ("SYSTEM", "PULSE Engine re-evaluated learners — classification updated", 3),
        ("SYSTEM", "System health check passed · API ONLINE · DB HEALTHY", 4),
        ("USER",   "Admin verified new instructor account", 25),
    ]:
        db.add(AuditLog(
            admin_id=adm.id if atype != "SYSTEM" else None,
            action_type=atype, description=desc,
            created_at=datetime.utcnow() - timedelta(hours=hrs),
        ))
    db.commit()

    # ── Reports ────────────────────────────────────────────────────────────
    for rtype, content, status, days_ago in [
        ("HARASSMENT", "Community post by User_4421: [Offensive content targeting ethnic background...]", "open", 2),
        ("SPAM",       "Quiz answer reported as incorrect on French B2 Lesson 12 — 8 students flagged",  "open", 0.25),
        ("CONTENT",    "IELTS Writing Lesson 7 — vocabulary list appears to contain outdated exam terms","open", 0.5),
        ("SPAM",       "User repeatedly posting promotional links in course comments",                    "resolved", 3),
        ("HARASSMENT", "Instructor received threatening messages from student account",                   "resolved", 5),
    ]:
        db.add(Report(reporter_id=stu.id, report_type=rtype, content=content,
                      status=status, created_at=datetime.utcnow() - timedelta(days=days_ago)))
    db.commit()

    print("✅ Seed complete!")
    print(f"  Admins:      {db.query(User).filter(User.role==RoleEnum.admin).count()}")
    print(f"  Instructors: {db.query(User).filter(User.role==RoleEnum.instructor).count()}")
    print(f"  Students:    {db.query(User).filter(User.role==RoleEnum.student).count()}")
    print(f"  Courses:     {db.query(Course).count()} ({db.query(Course).filter(Course.status=='published').count()} published)")
    print(f"  Modules:     {db.query(Module).count()}")
    print(f"  Lessons:     {db.query(Lesson).count()}")
    print(f"  Enrollments: {db.query(Enrollment).count()}")

if __name__ == "__main__":
    seed()
