-- Run this SQL in Supabase SQL Editor to create all tables
-- This creates all the tables needed for FluentFusion

-- Users table (core)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'student',
    avatar_url VARCHAR(500),
    bio TEXT,
    location VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    is_email_verified BOOLEAN DEFAULT false,
    is_banned BOOLEAN DEFAULT false,
    ban_reason TEXT,
    last_active_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Settings
CREATE TABLE IF NOT EXISTS user_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    native_language_id INTEGER,
    learning_language_id INTEGER,
    proficiency_level VARCHAR(50),
    daily_goal_minutes INTEGER DEFAULT 15,
    email_notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Verification
CREATE TABLE IF NOT EXISTS email_verifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    otp_code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Password Reset
CREATE TABLE IF NOT EXISTS password_resets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Languages
CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    flag_emoji VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Onboarding
CREATE TABLE IF NOT EXISTS user_onboarding (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    step VARCHAR(50) NOT NULL,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Languages
CREATE TABLE IF NOT EXISTS user_languages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    language_id INTEGER REFERENCES languages(id),
    proficiency_level VARCHAR(50),
    is_native BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    instructor_id INTEGER REFERENCES users(id),
    language_id INTEGER REFERENCES languages(id),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    thumbnail_url VARCHAR(500),
    level VARCHAR(50),
    price_usd DECIMAL(10,2) DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    approval_status VARCHAR(50) DEFAULT 'pending',
    has_certificate BOOLEAN DEFAULT false,
    total_lessons INTEGER DEFAULT 0,
    total_duration_minutes INTEGER DEFAULT 0,
    avg_rating DECIMAL(3,2) DEFAULT 0,
    total_enrollments INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course Units
CREATE TABLE IF NOT EXISTS course_units (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    unit_id INTEGER REFERENCES course_units(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    video_url VARCHAR(500),
    duration_minutes INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    completion_pct DECIMAL(5,2) DEFAULT 0,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    certificate_url VARCHAR(500),
    refunded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lesson Completions
CREATE TABLE IF NOT EXISTS lesson_completions (
    id SERIAL PRIMARY KEY,
    enrollment_id INTEGER REFERENCES enrollments(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    time_spent_sec INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Announcements
CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    summary VARCHAR(500),
    announcement_type VARCHAR(50) DEFAULT 'general',
    priority VARCHAR(20) DEFAULT 'normal',
    target_role VARCHAR(50),
    target_language_id INTEGER REFERENCES languages(id),
    target_course_id INTEGER REFERENCES courses(id),
    image_url VARCHAR(500),
    action_url VARCHAR(500),
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Announcement Views
CREATE TABLE IF NOT EXISTS announcement_views (
    id SERIAL PRIMARY KEY,
    announcement_id INTEGER REFERENCES announcements(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assignments
CREATE TABLE IF NOT EXISTS assignments (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    instructor_id INTEGER REFERENCES users(id),
    unit_id INTEGER REFERENCES course_units(id),
    title VARCHAR(255) NOT NULL,
    assignment_type VARCHAR(50) DEFAULT 'writing',
    prompt TEXT,
    rubric TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assignment Submissions
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES users(id),
    content TEXT,
    audio_url VARCHAR(500),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    grade DECIMAL(5,2),
    feedback TEXT,
    graded_at TIMESTAMP WITH TIME ZONE,
    graded_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    enrollment_id INTEGER REFERENCES enrollments(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    course_id INTEGER REFERENCES courses(id),
    certificate_number VARCHAR(50) UNIQUE,
    verification_code VARCHAR(50) UNIQUE,
    final_score DECIMAL(5,2),
    grade VARCHAR(5),
    issued_by_instructor_id INTEGER REFERENCES users(id),
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completion_date DATE,
    is_revoked BOOLEAN DEFAULT false,
    revoked_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    instructor_id INTEGER REFERENCES users(id),
    student_id INTEGER,
    is_group BOOLEAN DEFAULT false,
    group_name VARCHAR(255),
    last_message_preview TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE,
    is_archived_by_instructor BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id),
    content TEXT,
    message_type VARCHAR(50) DEFAULT 'text',
    attachment_url VARCHAR(500),
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    mentions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    action_url VARCHAR(500),
    source_type VARCHAR(50),
    source_id INTEGER,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meetings
CREATE TABLE IF NOT EXISTS meetings (
    id SERIAL PRIMARY KEY,
    organizer_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    meeting_type VARCHAR(50),
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    timezone VARCHAR(50) DEFAULT 'UTC',
    meeting_link VARCHAR(500),
    meeting_platform VARCHAR(50),
    status VARCHAR(50) DEFAULT 'scheduled',
    reason TEXT,
    response VARCHAR(50),
    response_note TEXT,
    response_at TIMESTAMP WITH TIME ZONE,
    invitee_ids JSONB,
    invitee_count INTEGER DEFAULT 0,
    group_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Activities
CREATE TABLE IF NOT EXISTS user_activities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    target_type VARCHAR(50),
    target_id INTEGER,
    target_title VARCHAR(255),
    xp_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_key VARCHAR(255),
    ip_address VARCHAR(50),
    user_agent TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    reporter_id INTEGER REFERENCES users(id),
    report_type VARCHAR(50),
    title VARCHAR(255),
    description TEXT,
    priority VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(50) DEFAULT 'submitted',
    mentions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Report Comments
CREATE TABLE IF NOT EXISTS report_comments (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES users(id),
    content TEXT,
    mentions JSONB,
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Live Sessions
CREATE TABLE IF NOT EXISTS live_sessions (
    id SERIAL PRIMARY KEY,
    instructor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL,
    language_id INTEGER REFERENCES languages(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    level VARCHAR(50),
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_min INTEGER DEFAULT 60,
    max_participants INTEGER DEFAULT 100,
    current_viewers INTEGER DEFAULT 0,
    hands_raised INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'scheduled',
    stream_url VARCHAR(500),
    recording_url VARCHAR(500),
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    room_name VARCHAR(255) UNIQUE,
    egress_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Live Session Registrations
CREATE TABLE IF NOT EXISTS live_session_registrations (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES live_sessions(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    joined_at TIMESTAMP WITH TIME ZONE,
    left_at TIMESTAMP WITH TIME ZONE,
    hand_raised BOOLEAN DEFAULT false,
    UNIQUE(session_id, user_id)
);

-- Live Session Messages
CREATE TABLE IF NOT EXISTS live_session_messages (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES live_sessions(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_pinned BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_language ON courses(language_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_announcements_course ON announcements(target_course_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_user ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_live_sessions_instructor ON live_sessions(instructor_id);
CREATE INDEX IF NOT EXISTS idx_live_sessions_status ON live_sessions(status);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
