"""Seed the database with realistic FluentFusion data."""
import sys
from datetime import datetime, timedelta
import random
from database import SessionLocal, create_tables
from models import (
    User, UserRole, Course, CourseStatus, Lesson, Enrollment,
    PulseRecord, PulseState, Quiz, Message, Notification,
    Payout, AuditLog, PlatformSetting, LiveSession
)
from auth import get_password_hash

def seed():
    create_tables()
    db = SessionLocal()
    try:
        # Skip if already seeded
        if db.query(User).count() > 0:
            print("Database already seeded.")
            return

        now = datetime.utcnow()

        # ── Platform Settings ──
        settings_data = [
            ("platform_name", "FluentFusion", "general"),
            ("platform_tagline", "Learn Languages. Change Lives.", "general"),
            ("default_language", "English", "general"),
            ("allow_registrations", "true", "general"),
            ("require_instructor_verification", "true", "general"),
            ("enable_pulse", "true", "general"),
            ("platform_fee_percent", "20", "finance"),
            ("min_payout_amount", "50", "finance"),
            ("payout_schedule", "monthly", "finance"),
            ("smtp_host", "smtp.sendgrid.net", "email"),
            ("smtp_port", "587", "email"),
            ("smtp_from", "no-reply@fluentfusion.com", "email"),
            ("max_login_attempts", "5", "security"),
            ("session_timeout_minutes", "60", "security"),
            ("livekit_url", "wss://livekit.fluentfusion.com", "integrations"),
            ("maintenance_mode", "false", "maintenance"),
        ]
        for key, val, cat in settings_data:
            db.add(PlatformSetting(key=key, value=val, category=cat))

        # ── Admins ──
        admin1 = User(
            email="chidi@fluentfusion.com", full_name="Chidi Okafor",
            hashed_password=get_password_hash("admin123"),
            role=UserRole.admin, avatar_initials="CO",
            is_active=True, is_verified=True, country="Nigeria",
            created_at=now - timedelta(days=400)
        )
        admin2 = User(
            email="rania@fluentfusion.com", full_name="Rania Ahmed",
            hashed_password=get_password_hash("admin123"),
            role=UserRole.admin, avatar_initials="RA",
            is_active=True, is_verified=True, country="Egypt",
            created_at=now - timedelta(days=350)
        )
        db.add_all([admin1, admin2])
        db.flush()

        # ── Instructors ──
        instructors_data = [
            ("amara@fluentfusion.com", "Amara Ndiaye", "AN", "Senegal", 4.9, 847, 18400),
            ("malik@fluentfusion.com", "Malik Braun", "MB", "Germany", 4.7, 612, 14200),
            ("lena@fluentfusion.com", "Lena Chen", "LC", "Taiwan", 4.8, 531, 12800),
            ("yuki@fluentfusion.com", "Yuki Tanaka", "YT", "Japan", 4.6, 389, 9100),
            ("omar@fluentfusion.com", "Omar Hassan", "OH", "Morocco", 4.5, 298, 6700),
        ]
        instructors = []
        for i, (email, name, initials, country, rating, students, revenue) in enumerate(instructors_data):
            inst = User(
                email=email, full_name=name,
                hashed_password=get_password_hash("instructor123"),
                role=UserRole.instructor, avatar_initials=initials,
                is_active=True, is_verified=True, country=country,
                rating=rating, total_students=students, total_revenue=revenue,
                is_featured=(i < 2),
                bio=f"Expert language instructor with 10+ years of experience.",
                payout_email=email,
                created_at=now - timedelta(days=300 - i * 20)
            )
            instructors.append(inst)
        db.add_all(instructors)
        db.flush()

        # ── Courses ──
        courses_data = [
            (instructors[0].id, "French B2 Advanced", "Master advanced French grammar and conversation", "French", "B2", CourseStatus.active, 89.0, False, 48, 2160),
            (instructors[0].id, "IELTS Writing Mastery", "Comprehensive IELTS writing preparation", "English", "IELTS", CourseStatus.active, 79.0, False, 36, 1620),
            (instructors[1].id, "Spanish A2 Fundamentals", "Build your Spanish foundation", "Spanish", "A2", CourseStatus.active, 0.0, True, 54, 2430),
            (instructors[1].id, "German B1 Intermediate", "Take your German to the next level", "German", "B1", CourseStatus.active, 69.0, False, 42, 1890),
            (instructors[2].id, "Mandarin for Beginners", "Start your Mandarin journey", "Mandarin", "A1", CourseStatus.active, 49.0, False, 30, 1350),
            (instructors[3].id, "Japanese JLPT N5 Prep", "Prepare for JLPT N5 certification", "Japanese", "N5", CourseStatus.active, 59.0, False, 28, 1260),
            (instructors[4].id, "Arabic Modern Standard", "Learn Modern Standard Arabic", "Arabic", "A2", CourseStatus.pending, 79.0, False, 20, 900),
            (instructors[2].id, "Portuguese Basics", "Essential Portuguese for travellers", "Portuguese", "A1", CourseStatus.draft, 39.0, False, 10, 450),
        ]
        courses = []
        for inst_id, title, desc, lang, level, status, price, is_free, lessons_count, duration in courses_data:
            c = Course(
                title=title, description=desc, language=lang, level=level,
                status=status, instructor_id=inst_id, price=price, is_free=is_free,
                total_lessons=lessons_count, total_duration_minutes=duration,
                rating=round(random.uniform(4.3, 4.9), 1),
                total_reviews=random.randint(50, 400),
                total_enrollments=random.randint(100, 900),
                created_at=now - timedelta(days=random.randint(30, 200)),
                published_at=now - timedelta(days=random.randint(10, 150)) if status == CourseStatus.active else None
            )
            courses.append(c)
        db.add_all(courses)
        db.flush()

        # ── Lessons ──
        lesson_titles = [
            "Introduction & Overview", "Core Vocabulary", "Grammar Foundations",
            "Listening Comprehension", "Speaking Practice", "Reading Strategies",
            "Writing Skills", "Cultural Context", "Advanced Structures",
            "Review & Assessment", "Conversation Masterclass", "Exam Techniques",
        ]
        for course in courses[:6]:
            for i in range(min(course.total_lessons, 12)):
                db.add(Lesson(
                    course_id=course.id,
                    title=lesson_titles[i % len(lesson_titles)],
                    description="In-depth lesson covering key concepts",
                    duration_minutes=random.randint(25, 65),
                    order_index=i + 1,
                    attendees=random.randint(80, 500),
                    recorded_at=now - timedelta(days=random.randint(1, 60)),
                    created_at=now - timedelta(days=random.randint(10, 90))
                ))

        # ── Students ──
        students_data = [
            ("kwame@example.com", "Kwame Larbi", "KL", "Ghana"),
            ("fatima@example.com", "Fatima Al-Rashid", "FA", "Saudi Arabia"),
            ("amara.d@example.com", "Amara Diallo", "AD", "Senegal"),
            ("jeanpaul@example.com", "Jean-Paul Nkurikiye", "JN", "Rwanda"),
            ("sofia@example.com", "Sofia Mendez", "SM", "Mexico"),
            ("priya@example.com", "Priya Sharma", "PS", "India"),
            ("carlos@example.com", "Carlos Rivera", "CR", "Colombia"),
            ("aisha@example.com", "Aisha Mohammed", "AM", "Nigeria"),
            ("lucas@example.com", "Lucas Dupont", "LD", "France"),
            ("mei@example.com", "Mei Lin", "ML", "China"),
            ("tobias@example.com", "Tobias Müller", "TM", "Germany"),
            ("chioma@example.com", "Chioma Eze", "CE", "Nigeria"),
            ("hassan@example.com", "Hassan Al-Farsi", "HF", "UAE"),
            ("isabela@example.com", "Isabela Costa", "IC", "Brazil"),
            ("yuna@example.com", "Yuna Park", "YP", "South Korea"),
        ]
        students = []
        for email, name, initials, country in students_data:
            s = User(
                email=email, full_name=name,
                hashed_password=get_password_hash("student123"),
                role=UserRole.student, avatar_initials=initials,
                is_active=True, is_verified=True, country=country,
                created_at=now - timedelta(days=random.randint(10, 200)),
                last_active_at=now - timedelta(hours=random.randint(1, 168))
            )
            students.append(s)
        db.add_all(students)
        db.flush()

        # ── Enrollments + PULSE ──
        pulse_states = [PulseState.thriving, PulseState.coasting, PulseState.struggling,
                        PulseState.burning_out, PulseState.disengaged]
        pulse_weights = [0.24, 0.28, 0.18, 0.16, 0.14]

        for student in students:
            num_courses = random.randint(1, 3)
            enrolled_courses = random.sample(courses[:6], min(num_courses, 6))
            for course in enrolled_courses:
                progress = random.uniform(10, 95)
                xp = int(progress * random.uniform(80, 150))
                enrollment = Enrollment(
                    student_id=student.id,
                    course_id=course.id,
                    progress_percent=progress,
                    xp=xp,
                    enrolled_at=now - timedelta(days=random.randint(5, 150)),
                    last_active_at=student.last_active_at
                )
                db.add(enrollment)

            # PULSE record
            state = random.choices(pulse_states, weights=pulse_weights)[0]
            db.add(PulseRecord(
                user_id=student.id,
                state=state,
                score=round(random.uniform(20, 95), 1),
                factors={"activity": random.randint(1, 10), "progress": random.randint(1, 10)},
                recorded_at=now - timedelta(hours=random.randint(1, 48))
            ))

        # ── Quizzes ──
        quiz_data = [
            (courses[0].id, "Subjunctive Quiz #1", 12, 341, 84.0),
            (courses[2].id, "Verb Conjugation Test", 15, 218, 77.0),
            (courses[1].id, "IELTS Task 2 Assessment", 8, 156, 71.0),
            (courses[3].id, "German Dative Case Quiz", 10, 134, 68.0),
            (courses[4].id, "Tones & Pronunciation", 12, 98, 79.0),
        ]
        for course_id, title, questions, attempts, avg_score in quiz_data:
            db.add(Quiz(
                course_id=course_id, title=title,
                total_questions=questions, total_attempts=attempts, avg_score=avg_score,
                questions=[
                    {"id": i+1, "text": f"Sample question {i+1}", "type": "mcq",
                     "options": ["A", "B", "C", "D"], "answer": "A"}
                    for i in range(questions)
                ],
                created_at=now - timedelta(days=random.randint(5, 60))
            ))

        # ── Messages ──
        for i in range(8):
            db.add(Message(
                sender_id=students[i % len(students)].id,
                recipient_id=instructors[i % len(instructors)].id,
                subject=f"Question about lesson {i+1}",
                body="Hello, I have a question about the recent lesson content. Could you clarify the grammar rule we discussed?",
                is_read=(i > 3),
                created_at=now - timedelta(hours=random.randint(1, 72))
            ))

        # ── Notifications ──
        notifications_data = [
            ("Platform maintenance — March 10", "Scheduled maintenance on March 10 from 2-4 AM UTC.", "all", 28441, 84.0),
            ("New instructor verification process", "We've updated the instructor onboarding flow.", "instructor", 312, 71.0),
            ("IELTS course collection launched", "Explore our new IELTS preparation courses.", "student", 24820, 61.0),
        ]
        for title, msg, target, recipients, read_rate in notifications_data:
            db.add(Notification(
                title=title, message=msg, target_role=target,
                recipients_count=recipients, read_rate=read_rate,
                sent_at=now - timedelta(days=random.randint(1, 10))
            ))

        # ── Payouts ──
        for i, inst in enumerate(instructors):
            for month_offset in range(3):
                period_start = now - timedelta(days=30 * (month_offset + 1))
                period_end = now - timedelta(days=30 * month_offset)
                db.add(Payout(
                    instructor_id=inst.id,
                    amount=round(inst.total_revenue * 0.8 / 12, 2),
                    status="approved" if month_offset > 0 else "pending",
                    period_start=period_start,
                    period_end=period_end,
                    processed_at=period_end if month_offset > 0 else None,
                    created_at=period_end
                ))

        # ── Audit Logs ──
        audit_entries = [
            (admin1.id, "USER", f"Admin {admin1.full_name} banned user Unknown_7841 for spam"),
            (admin2.id, "COURSE", f"Admin {admin2.full_name} rejected course 'Python Basics' — not language learning"),
            (admin1.id, "FINANCE", f"Admin {admin1.full_name} approved payout #PAY-0039 for $2,340 to Malik Braun"),
            (None, "SYSTEM", "System auto-flagged: CDN latency breach · +340ms above threshold"),
            (admin2.id, "USER", f"Admin {admin2.full_name} approved instructor Lena Chen verification"),
            (None, "SYSTEM", "PULSE Engine re-evaluated 28,441 learners — classification updated"),
            (None, "SYSTEM", "System health check passed · API ONLINE · DB HEALTHY · REDIS 12ms"),
        ]
        for i, (admin_id, action_type, desc) in enumerate(audit_entries):
            db.add(AuditLog(
                admin_id=admin_id,
                action_type=action_type,
                description=desc,
                created_at=now - timedelta(hours=i * 2)            ))

        # ── Live Sessions ──
        for i, course in enumerate(courses[:4]):
            db.add(LiveSession(
                course_id=course.id,
                instructor_id=course.instructor_id,
                title=f"Live Q&A — {course.title}",
                scheduled_at=now + timedelta(days=random.randint(1, 14)),
                duration_minutes=60,
                max_participants=100,
                current_participants=random.randint(0, 45),
                status="scheduled",
                room_id=f"room-{course.id}-{i}",
                created_at=now - timedelta(days=2)
            ))

        db.commit()
        print("✅ Database seeded successfully!")
        print(f"   Admins: 2")
        print(f"   Instructors: {len(instructors)}")
        print(f"   Students: {len(students)}")
        print(f"   Courses: {len(courses)}")

    except Exception as e:
        db.rollback()
        print(f"❌ Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
