"""
Migration script to update database from CourseSection to Module structure.
Run this script to migrate existing data to the new module-based structure.
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("ERROR: DATABASE_URL not set in environment")
    sys.exit(1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def migrate():
    db = SessionLocal()
    try:
        print("Starting migration from CourseSection to Module structure...")
        
        # Step 1: Create new tables if they don't exist
        print("Step 1: Creating new tables...")
        
        # Create modules table
        db.execute(text("""
            CREATE TABLE IF NOT EXISTS modules (
                id SERIAL PRIMARY KEY,
                course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
                title VARCHAR NOT NULL,
                description TEXT,
                "order" INTEGER DEFAULT 0
            )
        """))
        
        # Create module_quizzes table
        db.execute(text("""
            CREATE TABLE IF NOT EXISTS module_quizzes (
                id SERIAL PRIMARY KEY,
                module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
                title VARCHAR NOT NULL,
                position VARCHAR DEFAULT 'end',
                passing_score INTEGER DEFAULT 70,
                time_limit_min INTEGER,
                is_required BOOLEAN DEFAULT TRUE,
                "order" INTEGER DEFAULT 0
            )
        """))
        
        # Create quiz_questions table
        db.execute(text("""
            CREATE TABLE IF NOT EXISTS quiz_questions (
                id SERIAL PRIMARY KEY,
                quiz_id INTEGER NOT NULL REFERENCES module_quizzes(id) ON DELETE CASCADE,
                question_text TEXT NOT NULL,
                question_type VARCHAR DEFAULT 'multiple_choice',
                options TEXT,
                correct_answer VARCHAR NOT NULL,
                explanation TEXT,
                points INTEGER DEFAULT 1,
                "order" INTEGER DEFAULT 0
            )
        """))
        
        # Create quiz_attempts table
        db.execute(text("""
            CREATE TABLE IF NOT EXISTS quiz_attempts (
                id SERIAL PRIMARY KEY,
                quiz_id INTEGER NOT NULL REFERENCES module_quizzes(id) ON DELETE CASCADE,
                student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                score INTEGER DEFAULT 0,
                passed BOOLEAN DEFAULT FALSE,
                answers TEXT,
                started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP
            )
        """))
        
        db.commit()
        print("✓ New tables created")
        
        # Step 2: Add module_id column to lessons if missing
        print("Step 2: Adding module_id column to lessons if missing...")
        col_exists = db.execute(text("""
            SELECT EXISTS (
                SELECT FROM information_schema.columns
                WHERE table_name = 'lessons' AND column_name = 'module_id'
            )
        """)).scalar()
        if not col_exists:
            db.execute(text("ALTER TABLE lessons ADD COLUMN module_id INTEGER REFERENCES modules(id)"))
            db.commit()
            print("✓ Added module_id column to lessons")
        else:
            print("✓ module_id column already exists")

        # Step 3: Migrate data from course_sections to modules
        print("Step 3: Migrating course_sections to modules...")
        
        sections_exist = db.execute(text("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'course_sections'
            )
        """)).scalar()
        
        if sections_exist:
            db.execute(text("""
                INSERT INTO modules (id, course_id, title, "order")
                SELECT id, course_id, title, "order"
                FROM course_sections
                ON CONFLICT (id) DO NOTHING
            """))
            
            section_col_exists = db.execute(text("""
                SELECT EXISTS (
                    SELECT FROM information_schema.columns
                    WHERE table_name = 'lessons' AND column_name = 'section_id'
                )
            """)).scalar()
            if section_col_exists:
                db.execute(text("""
                    UPDATE lessons 
                    SET module_id = section_id 
                    WHERE section_id IS NOT NULL AND module_id IS NULL
                """))
            
            db.commit()
            print("✓ Migrated course_sections to modules")
        else:
            print("✓ No course_sections table found, skipping migration")
        
        # Step 4: Update sequence values
        print("Step 4: Updating sequence values...")
        
        db.execute(text("""
            SELECT setval('modules_id_seq', COALESCE((SELECT MAX(id) FROM modules), 1))
        """))
        
        db.execute(text("""
            SELECT setval('module_quizzes_id_seq', COALESCE((SELECT MAX(id) FROM module_quizzes), 1))
        """))
        
        db.execute(text("""
            SELECT setval('quiz_questions_id_seq', COALESCE((SELECT MAX(id) FROM quiz_questions), 1))
        """))
        
        db.execute(text("""
            SELECT setval('quiz_attempts_id_seq', COALESCE((SELECT MAX(id) FROM quiz_attempts), 1))
        """))
        
        db.commit()
        print("✓ Sequence values updated")
        
        # Step 5: Verify migration
        print("Step 5: Verifying migration...")
        
        module_count = db.execute(text("SELECT COUNT(*) FROM modules")).scalar()
        lesson_count = db.execute(text("SELECT COUNT(*) FROM lessons WHERE module_id IS NOT NULL")).scalar()
        
        print(f"✓ Migration complete!")
        print(f"  - Modules: {module_count}")
        print(f"  - Lessons with modules: {lesson_count}")
        
    except Exception as e:
        db.rollback()
        print(f"ERROR during migration: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    migrate()
