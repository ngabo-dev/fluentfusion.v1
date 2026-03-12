-- FluentFusion Database Schema + Data
-- Cleaned for Aiven PostgreSQL

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
SET default_tablespace = '';
SET default_table_access_method = heap;

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.achievement_definitions (
    id integer NOT NULL,
    key character varying(100) NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    icon_name character varying(100),
    rarity character varying(50),
    xp_reward integer,
    trigger_type character varying(50) NOT NULL,
    trigger_value integer,
    is_active boolean,
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.achievement_definitions_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.achievement_definitions_id_seq OWNED BY public.achievement_definitions.id;

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
    id integer NOT NULL,
    admin_user_id integer NOT NULL,
    action character varying(100) NOT NULL,
    target_type character varying(50) NOT NULL,
    target_id integer NOT NULL,
    notes text,
    extra_data json,
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.admin_audit_log_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.admin_audit_log_id_seq OWNED BY public.admin_audit_log.id;

CREATE TABLE IF NOT EXISTS public.announcement_views (
    id integer NOT NULL,
    announcement_id integer NOT NULL,
    user_id integer NOT NULL,
    viewed_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.announcement_views_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.announcement_views_id_seq OWNED BY public.announcement_views.id;

CREATE TABLE IF NOT EXISTS public.announcements (
    id integer NOT NULL,
    author_id integer NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    summary character varying(500),
    announcement_type character varying(50) DEFAULT 'general'::character varying,
    priority character varying(20) DEFAULT 'normal'::character varying,
    target_role character varying(50),
    target_language_id integer,
    target_course_id integer,
    image_url character varying(500),
    action_url character varying(500),
    is_published boolean DEFAULT false,
    published_at timestamp with time zone,
    scheduled_for timestamp with time zone,
    expires_at timestamp with time zone,
    view_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);

CREATE SEQUENCE IF NOT EXISTS public.announcements_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.announcements_id_seq OWNED BY public.announcements.id;

CREATE TABLE IF NOT EXISTS public.assignment_submissions (
    id integer NOT NULL,
    assignment_id integer NOT NULL,
    student_id integer NOT NULL,
    content text,
    audio_url character varying(500),
    submitted_at timestamp with time zone DEFAULT now(),
    grade numeric(5,2),
    feedback text,
    graded_at timestamp with time zone,
    graded_by integer
);

CREATE SEQUENCE IF NOT EXISTS public.assignment_submissions_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.assignment_submissions_id_seq OWNED BY public.assignment_submissions.id;

CREATE TABLE IF NOT EXISTS public.assignments (
    id integer NOT NULL,
    course_id integer NOT NULL,
    unit_id integer,
    instructor_id integer NOT NULL,
    title character varying(255) NOT NULL,
    assignment_type character varying(50) DEFAULT 'writing'::character varying,
    prompt text NOT NULL,
    rubric text,
    due_date timestamp with time zone,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);

CREATE SEQUENCE IF NOT EXISTS public.assignments_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.assignments_id_seq OWNED BY public.assignments.id;

CREATE TABLE IF NOT EXISTS public.certificates (
    id integer NOT NULL,
    enrollment_id integer NOT NULL,
    user_id integer NOT NULL,
    course_id integer NOT NULL,
    certificate_number character varying(50) NOT NULL,
    certificate_url character varying(500),
    verification_code character varying(100) NOT NULL,
    is_verified boolean DEFAULT true,
    is_revoked boolean DEFAULT false,
    revoked_reason text,
    completion_date timestamp with time zone DEFAULT now(),
    issued_at timestamp with time zone DEFAULT now(),
    final_score integer,
    grade character varying(10),
    issued_by_instructor_id integer,
    cert_metadata jsonb,
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.certificates_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.certificates_id_seq OWNED BY public.certificates.id;

CREATE TABLE IF NOT EXISTS public.community_comments (
    id integer NOT NULL,
    post_id integer NOT NULL,
    user_id integer NOT NULL,
    parent_id integer,
    body text NOT NULL,
    like_count integer,
    is_deleted boolean,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);

CREATE SEQUENCE IF NOT EXISTS public.community_comments_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.community_comments_id_seq OWNED BY public.community_comments.id;

CREATE TABLE IF NOT EXISTS public.community_post_likes (
    id integer NOT NULL,
    post_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.community_post_likes_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.community_post_likes_id_seq OWNED BY public.community_post_likes.id;

CREATE TABLE IF NOT EXISTS public.community_post_saves (
    id integer NOT NULL,
    post_id integer NOT NULL,
    user_id integer NOT NULL,
    saved_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.community_post_saves_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.community_post_saves_id_seq OWNED BY public.community_post_saves.id;

CREATE TABLE IF NOT EXISTS public.community_post_tags (
    id integer NOT NULL,
    post_id integer NOT NULL,
    tag character varying(50) NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.community_post_tags_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.community_post_tags_id_seq OWNED BY public.community_post_tags.id;

CREATE TABLE IF NOT EXISTS public.community_posts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    language_id integer,
    body text NOT NULL,
    post_type character varying(50),
    like_count integer,
    comment_count integer,
    is_pinned boolean,
    is_deleted boolean,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);

CREATE SEQUENCE IF NOT EXISTS public.community_posts_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.community_posts_id_seq OWNED BY public.community_posts.id;

CREATE TABLE IF NOT EXISTS public.conversations (
    id integer NOT NULL,
    instructor_id integer NOT NULL,
    student_id integer NOT NULL,
    is_group boolean DEFAULT false,
    group_name character varying(255),
    last_message_preview character varying(255),
    last_message_at timestamp with time zone,
    is_archived_by_instructor boolean DEFAULT false,
    is_archived_by_student boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);

CREATE SEQUENCE IF NOT EXISTS public.conversations_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.conversations_id_seq OWNED BY public.conversations.id;

CREATE TABLE IF NOT EXISTS public.course_edit_requests (
    id integer NOT NULL,
    course_id integer NOT NULL,
    instructor_id integer NOT NULL,
    request_type character varying(20) NOT NULL,
    status character varying(20),
    old_values json,
    new_values json,
    reason text NOT NULL,
    admin_comment text,
    reviewed_by integer,
    created_at timestamp with time zone DEFAULT now(),
    reviewed_at timestamp with time zone
);

CREATE SEQUENCE IF NOT EXISTS public.course_edit_requests_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.course_edit_requests_id_seq OWNED BY public.course_edit_requests.id;

CREATE TABLE IF NOT EXISTS public.course_purchases (
    id integer NOT NULL,
    user_id integer NOT NULL,
    course_id integer NOT NULL,
    payment_id integer NOT NULL,
    amount_paid numeric(8,2) NOT NULL,
    purchased_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.course_purchases_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.course_purchases_id_seq OWNED BY public.course_purchases.id;

CREATE TABLE IF NOT EXISTS public.course_reviews (
    id integer NOT NULL,
    course_id integer NOT NULL,
    user_id integer NOT NULL,
    rating integer NOT NULL,
    title character varying(255),
    content text,
    content_quality_rating integer,
    instructor_rating integer,
    value_rating integer,
    is_approved character varying(20),
    rejection_reason text,
    helpful_count integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);

CREATE SEQUENCE IF NOT EXISTS public.course_reviews_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.course_reviews_id_seq OWNED BY public.course_reviews.id;

CREATE TABLE IF NOT EXISTS public.course_units (
    id integer NOT NULL,
    course_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    order_index integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.course_units_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.course_units_id_seq OWNED BY public.course_units.id;

CREATE TABLE IF NOT EXISTS public.courses (
    id integer NOT NULL,
    instructor_id integer NOT NULL,
    language_id integer NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    description text,
    thumbnail_url character varying(500),
    level character varying(50),
    goal character varying(50),
    price_usd numeric(8,2),
    is_free boolean,
    is_published boolean,
    approval_status character varying(50),
    rejection_reason text,
    has_certificate boolean,
    has_offline_access boolean,
    total_duration_min integer,
    total_lessons integer,
    total_enrollments integer,
    avg_rating numeric(3,2),
    rating_count integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    is_deleted boolean DEFAULT false
);

CREATE SEQUENCE IF NOT EXISTS public.courses_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;

CREATE TABLE IF NOT EXISTS public.daily_challenge_tasks (
    id integer NOT NULL,
    challenge_id integer NOT NULL,
    task_type character varying(50) NOT NULL,
    description character varying(255) NOT NULL,
    target_count integer NOT NULL,
    xp_reward integer,
    order_index integer
);

CREATE SEQUENCE IF NOT EXISTS public.daily_challenge_tasks_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.daily_challenge_tasks_id_seq OWNED BY public.daily_challenge_tasks.id;

CREATE TABLE IF NOT EXISTS public.daily_challenges (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    challenge_date timestamp without time zone NOT NULL,
    bonus_xp integer,
    task_count integer,
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.daily_challenges_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.daily_challenges_id_seq OWNED BY public.daily_challenges.id;

CREATE TABLE IF NOT EXISTS public.email_verifications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    otp_code character varying(6) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.email_verifications_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.email_verifications_id_seq OWNED BY public.email_verifications.id;

CREATE TABLE IF NOT EXISTS public.enrollments (
    id integer NOT NULL,
    user_id integer NOT NULL,
    course_id integer NOT NULL,
    enrolled_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone,
    last_accessed_at timestamp with time zone,
    completion_pct integer,
    last_lesson_id integer,
    certificate_url character varying(500),
    refunded_at timestamp with time zone
);

CREATE SEQUENCE IF NOT EXISTS public.enrollments_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.enrollments_id_seq OWNED BY public.enrollments.id;

CREATE TABLE IF NOT EXISTS public.flashcard_decks (
    id integer NOT NULL,
    user_id integer,
    course_id integer,
    language_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    is_system boolean,
    card_count integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);

CREATE SEQUENCE IF NOT EXISTS public.flashcard_decks_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.flashcard_decks_id_seq OWNED BY public.flashcard_decks.id;

CREATE TABLE IF NOT EXISTS public.flashcard_progress (
    id integer NOT NULL,
    user_id integer NOT NULL,
    flashcard_id integer NOT NULL,
    status character varying(50) NOT NULL,
    review_count integer,
    last_reviewed_at timestamp with time zone,
    next_review_at timestamp with time zone,
    ease_factor numeric(4,2)
);

CREATE SEQUENCE IF NOT EXISTS public.flashcard_progress_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.flashcard_progress_id_seq OWNED BY public.flashcard_progress.id;

CREATE TABLE IF NOT EXISTS public.flashcards (
    id integer NOT NULL,
    deck_id integer NOT NULL,
    front_text character varying(500) NOT NULL,
    back_text character varying(500) NOT NULL,
    phonetic character varying(255),
    example_sentence text,
    audio_url character varying(500),
    image_url character varying(500),
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.flashcards_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.flashcards_id_seq OWNED BY public.flashcards.id;

CREATE TABLE IF NOT EXISTS public.instructor_earnings (
    id integer NOT NULL,
    instructor_id integer NOT NULL,
    course_id integer NOT NULL,
    enrollment_id integer NOT NULL,
    gross_amount numeric(8,2) NOT NULL,
    platform_fee_pct numeric(4,2),
    net_amount numeric(8,2) NOT NULL,
    currency character varying(10),
    status character varying(50),
    paid_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.instructor_earnings_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.instructor_earnings_id_seq OWNED BY public.instructor_earnings.id;

CREATE TABLE IF NOT EXISTS public.instructor_payout_requests (
    id integer NOT NULL,
    instructor_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    method character varying(50),
    account_details text,
    status character varying(50),
    requested_at timestamp with time zone DEFAULT now(),
    processed_at timestamp with time zone
);

CREATE SEQUENCE IF NOT EXISTS public.instructor_payout_requests_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.instructor_payout_requests_id_seq OWNED BY public.instructor_payout_requests.id;

CREATE TABLE IF NOT EXISTS public.instructor_profiles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    headline character varying(255),
    bio text,
    website_url character varying(500),
    total_students integer,
    total_courses integer,
    avg_rating numeric(3,2),
    total_earnings_usd numeric(10,2),
    is_verified boolean,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);

CREATE SEQUENCE IF NOT EXISTS public.instructor_profiles_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.instructor_profiles_id_seq OWNED BY public.instructor_profiles.id;

CREATE TABLE IF NOT EXISTS public.languages (
    id integer NOT NULL,
    code character varying(10) NOT NULL,
    name character varying(100) NOT NULL,
    native_name character varying(100),
    flag_emoji character varying(10),
    learner_count integer,
    is_active boolean
);

CREATE SEQUENCE IF NOT EXISTS public.languages_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.languages_id_seq OWNED BY public.languages.id;

CREATE TABLE IF NOT EXISTS public.leaderboards (
    id integer NOT NULL,
    user_id integer NOT NULL,
    language_id integer,
    period character varying(50) NOT NULL,
    period_start timestamp without time zone NOT NULL,
    xp_total integer,
    rank integer,
    updated_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.leaderboards_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.leaderboards_id_seq OWNED BY public.leaderboards.id;

CREATE TABLE IF NOT EXISTS public.lesson_completions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    lesson_id integer NOT NULL,
    enrollment_id integer NOT NULL,
    completed_at timestamp with time zone DEFAULT now(),
    time_spent_sec integer,
    notes text
);

CREATE SEQUENCE IF NOT EXISTS public.lesson_completions_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.lesson_completions_id_seq OWNED BY public.lesson_completions.id;

CREATE TABLE IF NOT EXISTS public.lesson_transcript_segments (
    id integer NOT NULL,
    lesson_id integer NOT NULL,
    start_sec numeric(8,2) NOT NULL,
    end_sec numeric(8,2) NOT NULL,
    text text NOT NULL,
    order_index integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS public.lesson_transcript_segments_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.lesson_transcript_segments_id_seq OWNED BY public.lesson_transcript_segments.id;

CREATE TABLE IF NOT EXISTS public.lesson_transcripts (
    id integer NOT NULL,
    lesson_id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.lesson_transcripts_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.lesson_transcripts_id_seq OWNED BY public.lesson_transcripts.id;

CREATE TABLE IF NOT EXISTS public.lesson_vocabulary (
    id integer NOT NULL,
    lesson_id integer NOT NULL,
    word character varying(255) NOT NULL,
    translation character varying(255) NOT NULL,
    language_id integer NOT NULL,
    phonetic character varying(255),
    example_usage text,
    order_index integer
);

CREATE SEQUENCE IF NOT EXISTS public.lesson_vocabulary_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.lesson_vocabulary_id_seq OWNED BY public.lesson_vocabulary.id;

CREATE TABLE IF NOT EXISTS public.lessons (
    id integer NOT NULL,
    unit_id integer NOT NULL,
    course_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    video_url character varying(500),
    video_duration_sec integer,
    order_index integer NOT NULL,
    is_free_preview boolean,
    xp_reward integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);

CREATE SEQUENCE IF NOT EXISTS public.lessons_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.lessons_id_seq OWNED BY public.lessons.id;

CREATE TABLE IF NOT EXISTS public.listening_attempts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    exercise_id integer NOT NULL,
    answer_text text NOT NULL,
    is_correct boolean,
    accuracy_pct integer,
    playback_speed numeric(3,2),
    attempted_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.listening_attempts_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.listening_attempts_id_seq OWNED BY public.listening_attempts.id;

CREATE TABLE IF NOT EXISTS public.listening_exercises (
    id integer NOT NULL,
    language_id integer NOT NULL,
    lesson_id integer,
    audio_url character varying(500) NOT NULL,
    transcript text NOT NULL,
    difficulty character varying(50),
    duration_sec integer,
    hint_words text,
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.listening_exercises_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.listening_exercises_id_seq OWNED BY public.listening_exercises.id;

CREATE TABLE IF NOT EXISTS public.live_session_messages (
    id integer NOT NULL,
    session_id integer NOT NULL,
    user_id integer NOT NULL,
    message text NOT NULL,
    sent_at timestamp with time zone DEFAULT now(),
    is_pinned boolean,
    is_deleted boolean
);

CREATE SEQUENCE IF NOT EXISTS public.live_session_messages_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.live_session_messages_id_seq OWNED BY public.live_session_messages.id;

CREATE TABLE IF NOT EXISTS public.live_session_registrations (
    id integer NOT NULL,
    session_id integer NOT NULL,
    user_id integer NOT NULL,
    registered_at timestamp with time zone DEFAULT now(),
    joined_at timestamp with time zone,
    left_at timestamp with time zone,
    hand_raised boolean
);

CREATE SEQUENCE IF NOT EXISTS public.live_session_registrations_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.live_session_registrations_id_seq OWNED BY public.live_session_registrations.id;

CREATE TABLE IF NOT EXISTS public.live_sessions (
    id integer NOT NULL,
    instructor_id integer NOT NULL,
    course_id integer,
    language_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    level character varying(50),
    scheduled_at timestamp with time zone NOT NULL,
    duration_min integer NOT NULL,
    max_participants integer,
    current_viewers integer,
    hands_raised integer,
    status character varying(50),
    stream_url character varying(500),
    recording_url character varying(500),
    started_at timestamp with time zone,
    ended_at timestamp with time zone,
    room_name character varying(255),
    egress_id character varying(255),
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.live_sessions_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.live_sessions_id_seq OWNED BY public.live_sessions.id;

CREATE TABLE IF NOT EXISTS public.meetings (
    id integer NOT NULL,
    organizer_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    meeting_type character varying(50) NOT NULL,
    scheduled_at timestamp with time zone NOT NULL,
    duration_minutes integer,
    timezone character varying(100),
    meeting_link character varying(500),
    meeting_platform character varying(50),
    status character varying(50),
    invitee_ids json,
    invitee_count integer,
    group_name character varying(255),
    reason text,
    response character varying(50),
    response_at timestamp with time zone,
    response_note text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);

CREATE SEQUENCE IF NOT EXISTS public.meetings_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.meetings_id_seq OWNED BY public.meetings.id;

CREATE TABLE IF NOT EXISTS public.messages (
    id integer NOT NULL,
    conversation_id integer NOT NULL,
    sender_id integer NOT NULL,
    content text NOT NULL,
    message_type character varying(50) DEFAULT 'text'::character varying,
    attachment_url character varying(500),
    attachment_name character varying(255),
    attachment_type character varying(100),
    attachment_size integer,
    is_read boolean DEFAULT false,
    read_at timestamp with time zone,
    reply_to_id integer,
    mentions jsonb,
    is_system_message boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.messages_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;

CREATE TABLE IF NOT EXISTS public.moderation_reports (
    id integer NOT NULL,
    reporter_id integer NOT NULL,
    target_type character varying(50) NOT NULL,
    target_id integer NOT NULL,
    reason character varying(50) NOT NULL,
    details text,
    status character varying(50),
    resolved_by integer,
    resolved_at timestamp with time zone,
    resolution_note text,
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.moderation_reports_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.moderation_reports_id_seq OWNED BY public.moderation_reports.id;

CREATE TABLE IF NOT EXISTS public.notifications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    type character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    body text,
    action_url character varying(500),
    source_type character varying(50),
    source_id integer,
    is_read boolean,
    sent_via character varying(50),
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.notifications_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;

CREATE TABLE IF NOT EXISTS public.password_resets (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token character varying(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    used_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.password_resets_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.password_resets_id_seq OWNED BY public.password_resets.id;

CREATE TABLE IF NOT EXISTS public.payments (
    id integer NOT NULL,
    user_id integer NOT NULL,
    subscription_id integer,
    course_id integer,
    amount numeric(8,2) NOT NULL,
    currency character varying(10),
    status character varying(50) NOT NULL,
    payment_method character varying(50),
    processor character varying(50),
    processor_payment_id character varying(255),
    card_last4 character varying(4),
    card_brand character varying(50),
    card_exp_month integer,
    card_exp_year integer,
    receipt_url character varying(500),
    refunded_at timestamp with time zone,
    refund_reason text,
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.payments_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;

CREATE TABLE IF NOT EXISTS public.platform_analytics_snapshots (
    id integer NOT NULL,
    snapshot_date timestamp without time zone NOT NULL,
    total_users integer,
    new_users_today integer,
    daily_active_users integer,
    monthly_active_users integer,
    total_lessons_completed integer,
    total_revenue_usd numeric(12,2),
    new_enrollments integer,
    avg_session_min numeric(6,2),
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.platform_analytics_snapshots_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.platform_analytics_snapshots_id_seq OWNED BY public.platform_analytics_snapshots.id;

CREATE TABLE IF NOT EXISTS public.pulse_predictions (
    id integer NOT NULL,
    student_id integer NOT NULL,
    course_id integer,
    predicted_state character varying(50) NOT NULL,
    confidence_score double precision NOT NULL,
    feature_snapshot json,
    model_version character varying(50),
    predicted_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.pulse_predictions_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.pulse_predictions_id_seq OWNED BY public.pulse_predictions.id;

CREATE TABLE IF NOT EXISTS public.quiz_answers (
    id integer NOT NULL,
    attempt_id integer NOT NULL,
    question_id integer NOT NULL,
    selected_option_id integer,
    text_answer text,
    audio_url character varying(500),
    is_correct boolean,
    ai_score_pct integer,
    ai_feedback text
);

CREATE SEQUENCE IF NOT EXISTS public.quiz_answers_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.quiz_answers_id_seq OWNED BY public.quiz_answers.id;

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    quiz_id integer NOT NULL,
    enrollment_id integer NOT NULL,
    score_pct integer NOT NULL,
    points_earned integer,
    passed boolean,
    time_taken_sec integer,
    started_at timestamp with time zone NOT NULL,
    completed_at timestamp with time zone
);

CREATE SEQUENCE IF NOT EXISTS public.quiz_attempts_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.quiz_attempts_id_seq OWNED BY public.quiz_attempts.id;

CREATE TABLE IF NOT EXISTS public.quiz_question_options (
    id integer NOT NULL,
    question_id integer NOT NULL,
    option_text character varying(500) NOT NULL,
    is_correct boolean,
    order_index integer
);

CREATE SEQUENCE IF NOT EXISTS public.quiz_question_options_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.quiz_question_options_id_seq OWNED BY public.quiz_question_options.id;

CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id integer NOT NULL,
    quiz_id integer NOT NULL,
    question_type character varying(50) NOT NULL,
    question_text text NOT NULL,
    audio_url character varying(500),
    image_url character varying(500),
    order_index integer,
    points integer
);

CREATE SEQUENCE IF NOT EXISTS public.quiz_questions_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.quiz_questions_id_seq OWNED BY public.quiz_questions.id;

CREATE TABLE IF NOT EXISTS public.quizzes (
    id integer NOT NULL,
    course_id integer NOT NULL,
    unit_id integer,
    lesson_id integer,
    title character varying(255) NOT NULL,
    description text,
    pass_score integer,
    order_index integer,
    xp_reward integer,
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.quizzes_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.quizzes_id_seq OWNED BY public.quizzes.id;

CREATE TABLE IF NOT EXISTS public.report_comments (
    id integer NOT NULL,
    report_id integer NOT NULL,
    author_id integer NOT NULL,
    content text NOT NULL,
    mentions jsonb,
    is_internal boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.report_comments_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.report_comments_id_seq OWNED BY public.report_comments.id;

CREATE TABLE IF NOT EXISTS public.reports (
    id integer NOT NULL,
    reporter_id integer NOT NULL,
    report_type character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    status character varying(50) DEFAULT 'submitted'::character varying,
    priority character varying(20) DEFAULT 'normal'::character varying,
    related_type character varying(50),
    related_id integer,
    mentions jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);

CREATE SEQUENCE IF NOT EXISTS public.reports_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.reports_id_seq OWNED BY public.reports.id;

CREATE TABLE IF NOT EXISTS public.skill_scores (
    id integer NOT NULL,
    user_id integer NOT NULL,
    language_id integer NOT NULL,
    skill character varying(50) NOT NULL,
    score_pct integer NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.skill_scores_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.skill_scores_id_seq OWNED BY public.skill_scores.id;

CREATE TABLE IF NOT EXISTS public.speaking_attempts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    exercise_id integer NOT NULL,
    audio_url character varying(500) NOT NULL,
    overall_score_pct integer,
    tone_score_pct integer,
    vowel_score_pct integer,
    rhythm_score_pct integer,
    ai_feedback text,
    attempted_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.speaking_attempts_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.speaking_attempts_id_seq OWNED BY public.speaking_attempts.id;

CREATE TABLE IF NOT EXISTS public.speaking_exercises (
    id integer NOT NULL,
    language_id integer NOT NULL,
    lesson_id integer,
    phrase_target character varying(500) NOT NULL,
    phrase_phonetic character varying(500),
    reference_audio_url character varying(500),
    difficulty character varying(50),
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.speaking_exercises_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.speaking_exercises_id_seq OWNED BY public.speaking_exercises.id;

CREATE TABLE IF NOT EXISTS public.streak_days (
    id integer NOT NULL,
    user_id integer NOT NULL,
    activity_date timestamp without time zone NOT NULL,
    did_practice boolean
);

CREATE SEQUENCE IF NOT EXISTS public.streak_days_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.streak_days_id_seq OWNED BY public.streak_days.id;

CREATE TABLE IF NOT EXISTS public.streaks (
    id integer NOT NULL,
    user_id integer NOT NULL,
    current_streak integer,
    longest_streak integer,
    last_activity_date timestamp without time zone,
    total_active_days integer,
    updated_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.streaks_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.streaks_id_seq OWNED BY public.streaks.id;

CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    tier character varying(50) NOT NULL,
    price_monthly numeric(8,2),
    price_annual numeric(8,2),
    billing_interval character varying(50),
    max_free_courses integer,
    has_ai_pronunciation boolean,
    live_sessions_per_month integer,
    has_certificates boolean,
    has_offline_access boolean,
    has_custom_path boolean,
    has_priority_support boolean,
    has_advanced_analytics boolean,
    has_early_access boolean,
    has_tutoring boolean,
    is_active boolean,
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.subscription_plans_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.subscription_plans_id_seq OWNED BY public.subscription_plans.id;

CREATE TABLE IF NOT EXISTS public.user_achievements (
    id integer NOT NULL,
    user_id integer NOT NULL,
    achievement_id integer NOT NULL,
    earned_at timestamp with time zone DEFAULT now(),
    is_notified boolean
);

CREATE SEQUENCE IF NOT EXISTS public.user_achievements_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.user_achievements_id_seq OWNED BY public.user_achievements.id;

CREATE TABLE IF NOT EXISTS public.user_activities (
    id integer NOT NULL,
    user_id integer NOT NULL,
    activity_type character varying(50) NOT NULL,
    target_type character varying(50),
    target_id integer,
    target_title character varying(255),
    activity_metadata json,
    xp_earned integer,
    is_public boolean,
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.user_activities_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.user_activities_id_seq OWNED BY public.user_activities.id;

CREATE TABLE IF NOT EXISTS public.user_daily_challenge_progress (
    id integer NOT NULL,
    user_id integer NOT NULL,
    challenge_id integer NOT NULL,
    task_id integer NOT NULL,
    current_count integer,
    is_completed boolean,
    completed_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.user_daily_challenge_progress_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.user_daily_challenge_progress_id_seq OWNED BY public.user_daily_challenge_progress.id;

CREATE TABLE IF NOT EXISTS public.user_languages (
    id integer NOT NULL,
    user_id integer NOT NULL,
    language_id integer NOT NULL,
    type character varying(50) NOT NULL,
    level character varying(50),
    fluency_pct integer,
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.user_languages_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.user_languages_id_seq OWNED BY public.user_languages.id;

CREATE TABLE IF NOT EXISTS public.user_onboarding (
    id integer NOT NULL,
    user_id integer NOT NULL,
    native_language_id integer NOT NULL,
    learning_language_id integer NOT NULL,
    learning_goal character varying(50),
    initial_level character varying(50),
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.user_onboarding_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.user_onboarding_id_seq OWNED BY public.user_onboarding.id;

CREATE TABLE IF NOT EXISTS public.user_sessions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    session_token character varying(500) NOT NULL,
    ip_address character varying(50),
    user_agent character varying(500),
    device_type character varying(50),
    browser character varying(50),
    os character varying(50),
    country character varying(100),
    city character varying(100),
    is_active boolean,
    started_at timestamp with time zone DEFAULT now(),
    last_active_at timestamp with time zone DEFAULT now(),
    ended_at timestamp with time zone,
    duration_seconds integer
);

CREATE SEQUENCE IF NOT EXISTS public.user_sessions_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.user_sessions_id_seq OWNED BY public.user_sessions.id;

CREATE TABLE IF NOT EXISTS public.user_settings (
    id integer NOT NULL,
    user_id integer NOT NULL,
    notif_daily_streak boolean,
    notif_new_lesson boolean,
    notif_live_session_reminder boolean,
    notif_community_replies boolean,
    notif_achievements boolean,
    email_weekly_report boolean,
    email_promotions boolean,
    email_instructor_messages boolean,
    theme character varying(50),
    updated_at timestamp with time zone
);

CREATE SEQUENCE IF NOT EXISTS public.user_settings_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.user_settings_id_seq OWNED BY public.user_settings.id;

CREATE TABLE IF NOT EXISTS public.user_social_logins (
    id integer NOT NULL,
    user_id integer NOT NULL,
    provider character varying(50) NOT NULL,
    provider_id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.user_social_logins_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.user_social_logins_id_seq OWNED BY public.user_social_logins.id;

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    plan_id integer NOT NULL,
    status character varying(50) NOT NULL,
    billing_interval character varying(50) NOT NULL,
    current_period_start timestamp with time zone NOT NULL,
    current_period_end timestamp with time zone NOT NULL,
    trial_start timestamp with time zone,
    trial_end timestamp with time zone,
    cancelled_at timestamp with time zone,
    cancel_reason text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);

CREATE SEQUENCE IF NOT EXISTS public.user_subscriptions_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.user_subscriptions_id_seq OWNED BY public.user_subscriptions.id;

CREATE TABLE IF NOT EXISTS public.user_xp (
    id integer NOT NULL,
    user_id integer NOT NULL,
    total_xp integer,
    current_level integer,
    xp_to_next_level integer,
    updated_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.user_xp_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.user_xp_id_seq OWNED BY public.user_xp.id;

CREATE TABLE IF NOT EXISTS public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    avatar_url character varying(500),
    bio text,
    location character varying(255),
    is_email_verified boolean,
    is_active boolean,
    is_banned boolean,
    ban_reason text,
    last_active_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    username character varying(255),
    is_verified boolean DEFAULT false
);

CREATE SEQUENCE IF NOT EXISTS public.users_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

CREATE TABLE IF NOT EXISTS public.vocabulary_bank (
    id integer NOT NULL,
    user_id integer NOT NULL,
    word character varying(255) NOT NULL,
    translation character varying(255) NOT NULL,
    language_id integer NOT NULL,
    category character varying(100),
    notes text,
    mastery_level integer,
    is_bookmarked boolean,
    source_lesson_id integer,
    added_at timestamp with time zone DEFAULT now(),
    last_reviewed_at timestamp with time zone
);

CREATE SEQUENCE IF NOT EXISTS public.vocabulary_bank_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.vocabulary_bank_id_seq OWNED BY public.vocabulary_bank.id;

CREATE TABLE IF NOT EXISTS public.weekly_activity (
    id integer NOT NULL,
    user_id integer NOT NULL,
    week_start timestamp without time zone NOT NULL,
    lessons_done integer,
    xp_earned integer,
    minutes_spent integer
);

CREATE SEQUENCE IF NOT EXISTS public.weekly_activity_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.weekly_activity_id_seq OWNED BY public.weekly_activity.id;

CREATE TABLE IF NOT EXISTS public.xp_transactions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    amount integer NOT NULL,
    source_type character varying(50) NOT NULL,
    source_id integer,
    note character varying(255),
    created_at timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS public.xp_transactions_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.xp_transactions_id_seq OWNED BY public.xp_transactions.id;

-- ============================================================
-- SET DEFAULT IDs FROM SEQUENCES
-- ============================================================

ALTER TABLE ONLY public.achievement_definitions ALTER COLUMN id SET DEFAULT nextval('public.achievement_definitions_id_seq'::regclass);
ALTER TABLE ONLY public.admin_audit_log ALTER COLUMN id SET DEFAULT nextval('public.admin_audit_log_id_seq'::regclass);
ALTER TABLE ONLY public.announcement_views ALTER COLUMN id SET DEFAULT nextval('public.announcement_views_id_seq'::regclass);
ALTER TABLE ONLY public.announcements ALTER COLUMN id SET DEFAULT nextval('public.announcements_id_seq'::regclass);
ALTER TABLE ONLY public.assignment_submissions ALTER COLUMN id SET DEFAULT nextval('public.assignment_submissions_id_seq'::regclass);
ALTER TABLE ONLY public.assignments ALTER COLUMN id SET DEFAULT nextval('public.assignments_id_seq'::regclass);
ALTER TABLE ONLY public.certificates ALTER COLUMN id SET DEFAULT nextval('public.certificates_id_seq'::regclass);
ALTER TABLE ONLY public.community_comments ALTER COLUMN id SET DEFAULT nextval('public.community_comments_id_seq'::regclass);
ALTER TABLE ONLY public.community_post_likes ALTER COLUMN id SET DEFAULT nextval('public.community_post_likes_id_seq'::regclass);
ALTER TABLE ONLY public.community_post_saves ALTER COLUMN id SET DEFAULT nextval('public.community_post_saves_id_seq'::regclass);
ALTER TABLE ONLY public.community_post_tags ALTER COLUMN id SET DEFAULT nextval('public.community_post_tags_id_seq'::regclass);
ALTER TABLE ONLY public.community_posts ALTER COLUMN id SET DEFAULT nextval('public.community_posts_id_seq'::regclass);
ALTER TABLE ONLY public.conversations ALTER COLUMN id SET DEFAULT nextval('public.conversations_id_seq'::regclass);
ALTER TABLE ONLY public.course_edit_requests ALTER COLUMN id SET DEFAULT nextval('public.course_edit_requests_id_seq'::regclass);
ALTER TABLE ONLY public.course_purchases ALTER COLUMN id SET DEFAULT nextval('public.course_purchases_id_seq'::regclass);
ALTER TABLE ONLY public.course_reviews ALTER COLUMN id SET DEFAULT nextval('public.course_reviews_id_seq'::regclass);
ALTER TABLE ONLY public.course_units ALTER COLUMN id SET DEFAULT nextval('public.course_units_id_seq'::regclass);
ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);
ALTER TABLE ONLY public.daily_challenge_tasks ALTER COLUMN id SET DEFAULT nextval('public.daily_challenge_tasks_id_seq'::regclass);
ALTER TABLE ONLY public.daily_challenges ALTER COLUMN id SET DEFAULT nextval('public.daily_challenges_id_seq'::regclass);
ALTER TABLE ONLY public.email_verifications ALTER COLUMN id SET DEFAULT nextval('public.email_verifications_id_seq'::regclass);
ALTER TABLE ONLY public.enrollments ALTER COLUMN id SET DEFAULT nextval('public.enrollments_id_seq'::regclass);
ALTER TABLE ONLY public.flashcard_decks ALTER COLUMN id SET DEFAULT nextval('public.flashcard_decks_id_seq'::regclass);
ALTER TABLE ONLY public.flashcard_progress ALTER COLUMN id SET DEFAULT nextval('public.flashcard_progress_id_seq'::regclass);
ALTER TABLE ONLY public.flashcards ALTER COLUMN id SET DEFAULT nextval('public.flashcards_id_seq'::regclass);
ALTER TABLE ONLY public.instructor_earnings ALTER COLUMN id SET DEFAULT nextval('public.instructor_earnings_id_seq'::regclass);
ALTER TABLE ONLY public.instructor_payout_requests ALTER COLUMN id SET DEFAULT nextval('public.instructor_payout_requests_id_seq'::regclass);
ALTER TABLE ONLY public.instructor_profiles ALTER COLUMN id SET DEFAULT nextval('public.instructor_profiles_id_seq'::regclass);
ALTER TABLE ONLY public.languages ALTER COLUMN id SET DEFAULT nextval('public.languages_id_seq'::regclass);
ALTER TABLE ONLY public.leaderboards ALTER COLUMN id SET DEFAULT nextval('public.leaderboards_id_seq'::regclass);
ALTER TABLE ONLY public.lesson_completions ALTER COLUMN id SET DEFAULT nextval('public.lesson_completions_id_seq'::regclass);
ALTER TABLE ONLY public.lesson_transcript_segments ALTER COLUMN id SET DEFAULT nextval('public.lesson_transcript_segments_id_seq'::regclass);
ALTER TABLE ONLY public.lesson_transcripts ALTER COLUMN id SET DEFAULT nextval('public.lesson_transcripts_id_seq'::regclass);
ALTER TABLE ONLY public.lesson_vocabulary ALTER COLUMN id SET DEFAULT nextval('public.lesson_vocabulary_id_seq'::regclass);
ALTER TABLE ONLY public.lessons ALTER COLUMN id SET DEFAULT nextval('public.lessons_id_seq'::regclass);
ALTER TABLE ONLY public.listening_attempts ALTER COLUMN id SET DEFAULT nextval('public.listening_attempts_id_seq'::regclass);
ALTER TABLE ONLY public.listening_exercises ALTER COLUMN id SET DEFAULT nextval('public.listening_exercises_id_seq'::regclass);
ALTER TABLE ONLY public.live_session_messages ALTER COLUMN id SET DEFAULT nextval('public.live_session_messages_id_seq'::regclass);
ALTER TABLE ONLY public.live_session_registrations ALTER COLUMN id SET DEFAULT nextval('public.live_session_registrations_id_seq'::regclass);
ALTER TABLE ONLY public.live_sessions ALTER COLUMN id SET DEFAULT nextval('public.live_sessions_id_seq'::regclass);
ALTER TABLE ONLY public.meetings ALTER COLUMN id SET DEFAULT nextval('public.meetings_id_seq'::regclass);
ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);
ALTER TABLE ONLY public.moderation_reports ALTER COLUMN id SET DEFAULT nextval('public.moderation_reports_id_seq'::regclass);
ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);
ALTER TABLE ONLY public.password_resets ALTER COLUMN id SET DEFAULT nextval('public.password_resets_id_seq'::regclass);
ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);
ALTER TABLE ONLY public.platform_analytics_snapshots ALTER COLUMN id SET DEFAULT nextval('public.platform_analytics_snapshots_id_seq'::regclass);
ALTER TABLE ONLY public.pulse_predictions ALTER COLUMN id SET DEFAULT nextval('public.pulse_predictions_id_seq'::regclass);
ALTER TABLE ONLY public.quiz_answers ALTER COLUMN id SET DEFAULT nextval('public.quiz_answers_id_seq'::regclass);
ALTER TABLE ONLY public.quiz_attempts ALTER COLUMN id SET DEFAULT nextval('public.quiz_attempts_id_seq'::regclass);
ALTER TABLE ONLY public.quiz_question_options ALTER COLUMN id SET DEFAULT nextval('public.quiz_question_options_id_seq'::regclass);
ALTER TABLE ONLY public.quiz_questions ALTER COLUMN id SET DEFAULT nextval('public.quiz_questions_id_seq'::regclass);
ALTER TABLE ONLY public.quizzes ALTER COLUMN id SET DEFAULT nextval('public.quizzes_id_seq'::regclass);
ALTER TABLE ONLY public.report_comments ALTER COLUMN id SET DEFAULT nextval('public.report_comments_id_seq'::regclass);
ALTER TABLE ONLY public.reports ALTER COLUMN id SET DEFAULT nextval('public.reports_id_seq'::regclass);
ALTER TABLE ONLY public.skill_scores ALTER COLUMN id SET DEFAULT nextval('public.skill_scores_id_seq'::regclass);
ALTER TABLE ONLY public.speaking_attempts ALTER COLUMN id SET DEFAULT nextval('public.speaking_attempts_id_seq'::regclass);
ALTER TABLE ONLY public.speaking_exercises ALTER COLUMN id SET DEFAULT nextval('public.speaking_exercises_id_seq'::regclass);
ALTER TABLE ONLY public.streak_days ALTER COLUMN id SET DEFAULT nextval('public.streak_days_id_seq'::regclass);
ALTER TABLE ONLY public.streaks ALTER COLUMN id SET DEFAULT nextval('public.streaks_id_seq'::regclass);
ALTER TABLE ONLY public.subscription_plans ALTER COLUMN id SET DEFAULT nextval('public.subscription_plans_id_seq'::regclass);
ALTER TABLE ONLY public.user_achievements ALTER COLUMN id SET DEFAULT nextval('public.user_achievements_id_seq'::regclass);
ALTER TABLE ONLY public.user_activities ALTER COLUMN id SET DEFAULT nextval('public.user_activities_id_seq'::regclass);
ALTER TABLE ONLY public.user_daily_challenge_progress ALTER COLUMN id SET DEFAULT nextval('public.user_daily_challenge_progress_id_seq'::regclass);
ALTER TABLE ONLY public.user_languages ALTER COLUMN id SET DEFAULT nextval('public.user_languages_id_seq'::regclass);
ALTER TABLE ONLY public.user_onboarding ALTER COLUMN id SET DEFAULT nextval('public.user_onboarding_id_seq'::regclass);
ALTER TABLE ONLY public.user_sessions ALTER COLUMN id SET DEFAULT nextval('public.user_sessions_id_seq'::regclass);
ALTER TABLE ONLY public.user_settings ALTER COLUMN id SET DEFAULT nextval('public.user_settings_id_seq'::regclass);
ALTER TABLE ONLY public.user_social_logins ALTER COLUMN id SET DEFAULT nextval('public.user_social_logins_id_seq'::regclass);
ALTER TABLE ONLY public.user_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.user_subscriptions_id_seq'::regclass);
ALTER TABLE ONLY public.user_xp ALTER COLUMN id SET DEFAULT nextval('public.user_xp_id_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
ALTER TABLE ONLY public.vocabulary_bank ALTER COLUMN id SET DEFAULT nextval('public.vocabulary_bank_id_seq'::regclass);
ALTER TABLE ONLY public.weekly_activity ALTER COLUMN id SET DEFAULT nextval('public.weekly_activity_id_seq'::regclass);
ALTER TABLE ONLY public.xp_transactions ALTER COLUMN id SET DEFAULT nextval('public.xp_transactions_id_seq'::regclass);

-- ============================================================
-- PRIMARY KEYS
-- ============================================================

ALTER TABLE ONLY public.achievement_definitions ADD CONSTRAINT achievement_definitions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.admin_audit_log ADD CONSTRAINT admin_audit_log_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.announcement_views ADD CONSTRAINT announcement_views_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.announcements ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.assignment_submissions ADD CONSTRAINT assignment_submissions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.assignments ADD CONSTRAINT assignments_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.certificates ADD CONSTRAINT certificates_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.community_comments ADD CONSTRAINT community_comments_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.community_post_likes ADD CONSTRAINT community_post_likes_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.community_post_saves ADD CONSTRAINT community_post_saves_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.community_post_tags ADD CONSTRAINT community_post_tags_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.community_posts ADD CONSTRAINT community_posts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.conversations ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.course_edit_requests ADD CONSTRAINT course_edit_requests_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.course_purchases ADD CONSTRAINT course_purchases_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.course_reviews ADD CONSTRAINT course_reviews_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.course_units ADD CONSTRAINT course_units_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.courses ADD CONSTRAINT courses_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.daily_challenge_tasks ADD CONSTRAINT daily_challenge_tasks_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.daily_challenges ADD CONSTRAINT daily_challenges_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.email_verifications ADD CONSTRAINT email_verifications_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.enrollments ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.flashcard_decks ADD CONSTRAINT flashcard_decks_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.flashcard_progress ADD CONSTRAINT flashcard_progress_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.flashcards ADD CONSTRAINT flashcards_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.instructor_earnings ADD CONSTRAINT instructor_earnings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.instructor_payout_requests ADD CONSTRAINT instructor_payout_requests_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.instructor_profiles ADD CONSTRAINT instructor_profiles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.languages ADD CONSTRAINT languages_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.leaderboards ADD CONSTRAINT leaderboards_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.lesson_completions ADD CONSTRAINT lesson_completions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.lesson_transcript_segments ADD CONSTRAINT lesson_transcript_segments_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.lesson_transcripts ADD CONSTRAINT lesson_transcripts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.lesson_vocabulary ADD CONSTRAINT lesson_vocabulary_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.lessons ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.listening_attempts ADD CONSTRAINT listening_attempts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.listening_exercises ADD CONSTRAINT listening_exercises_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.live_session_messages ADD CONSTRAINT live_session_messages_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.live_session_registrations ADD CONSTRAINT live_session_registrations_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.live_sessions ADD CONSTRAINT live_sessions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.meetings ADD CONSTRAINT meetings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.messages ADD CONSTRAINT messages_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.moderation_reports ADD CONSTRAINT moderation_reports_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.notifications ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.password_resets ADD CONSTRAINT password_resets_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.payments ADD CONSTRAINT payments_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.platform_analytics_snapshots ADD CONSTRAINT platform_analytics_snapshots_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.pulse_predictions ADD CONSTRAINT pulse_predictions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.quiz_answers ADD CONSTRAINT quiz_answers_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.quiz_attempts ADD CONSTRAINT quiz_attempts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.quiz_question_options ADD CONSTRAINT quiz_question_options_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.quiz_questions ADD CONSTRAINT quiz_questions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.quizzes ADD CONSTRAINT quizzes_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.report_comments ADD CONSTRAINT report_comments_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.reports ADD CONSTRAINT reports_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.skill_scores ADD CONSTRAINT skill_scores_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.speaking_attempts ADD CONSTRAINT speaking_attempts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.speaking_exercises ADD CONSTRAINT speaking_exercises_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.streak_days ADD CONSTRAINT streak_days_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.streaks ADD CONSTRAINT streaks_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.subscription_plans ADD CONSTRAINT subscription_plans_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_achievements ADD CONSTRAINT user_achievements_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_activities ADD CONSTRAINT user_activities_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_daily_challenge_progress ADD CONSTRAINT user_daily_challenge_progress_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_languages ADD CONSTRAINT user_languages_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_onboarding ADD CONSTRAINT user_onboarding_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_sessions ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_settings ADD CONSTRAINT user_settings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_social_logins ADD CONSTRAINT user_social_logins_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_subscriptions ADD CONSTRAINT user_subscriptions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_xp ADD CONSTRAINT user_xp_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.vocabulary_bank ADD CONSTRAINT vocabulary_bank_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.weekly_activity ADD CONSTRAINT weekly_activity_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.xp_transactions ADD CONSTRAINT xp_transactions_pkey PRIMARY KEY (id);

-- ============================================================
-- UNIQUE CONSTRAINTS
-- ============================================================

ALTER TABLE ONLY public.achievement_definitions ADD CONSTRAINT achievement_definitions_key_key UNIQUE (key);
ALTER TABLE ONLY public.certificates ADD CONSTRAINT certificates_certificate_number_key UNIQUE (certificate_number);
ALTER TABLE ONLY public.certificates ADD CONSTRAINT certificates_verification_code_key UNIQUE (verification_code);
ALTER TABLE ONLY public.courses ADD CONSTRAINT courses_slug_key UNIQUE (slug);
ALTER TABLE ONLY public.languages ADD CONSTRAINT languages_code_key UNIQUE (code);
ALTER TABLE ONLY public.live_sessions ADD CONSTRAINT live_sessions_room_name_key UNIQUE (room_name);
ALTER TABLE ONLY public.subscription_plans ADD CONSTRAINT subscription_plans_slug_key UNIQUE (slug);
ALTER TABLE ONLY public.users ADD CONSTRAINT users_email_key UNIQUE (email);

-- ============================================================
-- FOREIGN KEYS
-- ============================================================

ALTER TABLE ONLY public.admin_audit_log ADD CONSTRAINT admin_audit_log_admin_user_id_fkey FOREIGN KEY (admin_user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.announcement_views ADD CONSTRAINT announcement_views_announcement_id_fkey FOREIGN KEY (announcement_id) REFERENCES public.announcements(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.announcement_views ADD CONSTRAINT announcement_views_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.announcements ADD CONSTRAINT announcements_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.announcements ADD CONSTRAINT announcements_target_course_id_fkey FOREIGN KEY (target_course_id) REFERENCES public.courses(id);
ALTER TABLE ONLY public.announcements ADD CONSTRAINT announcements_target_language_id_fkey FOREIGN KEY (target_language_id) REFERENCES public.languages(id);
ALTER TABLE ONLY public.assignment_submissions ADD CONSTRAINT assignment_submissions_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignments(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.assignment_submissions ADD CONSTRAINT assignment_submissions_graded_by_fkey FOREIGN KEY (graded_by) REFERENCES public.users(id);
ALTER TABLE ONLY public.assignment_submissions ADD CONSTRAINT assignment_submissions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.assignments ADD CONSTRAINT assignments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.assignments ADD CONSTRAINT assignments_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.assignments ADD CONSTRAINT assignments_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.course_units(id);
ALTER TABLE ONLY public.certificates ADD CONSTRAINT certificates_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);
ALTER TABLE ONLY public.certificates ADD CONSTRAINT certificates_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id);
ALTER TABLE ONLY public.certificates ADD CONSTRAINT certificates_issued_by_instructor_id_fkey FOREIGN KEY (issued_by_instructor_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.certificates ADD CONSTRAINT certificates_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.community_comments ADD CONSTRAINT community_comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.community_posts(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.community_comments ADD CONSTRAINT community_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.community_post_likes ADD CONSTRAINT community_post_likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.community_posts(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.community_post_likes ADD CONSTRAINT community_post_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.community_post_saves ADD CONSTRAINT community_post_saves_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.community_posts(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.community_post_saves ADD CONSTRAINT community_post_saves_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.community_post_tags ADD CONSTRAINT community_post_tags_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.community_posts(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.community_posts ADD CONSTRAINT community_posts_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);
ALTER TABLE ONLY public.community_posts ADD CONSTRAINT community_posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.conversations ADD CONSTRAINT conversations_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.conversations ADD CONSTRAINT conversations_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.course_edit_requests ADD CONSTRAINT course_edit_requests_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.course_edit_requests ADD CONSTRAINT course_edit_requests_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.course_edit_requests ADD CONSTRAINT course_edit_requests_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(id);
ALTER TABLE ONLY public.course_purchases ADD CONSTRAINT course_purchases_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);
ALTER TABLE ONLY public.course_purchases ADD CONSTRAINT course_purchases_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id);
ALTER TABLE ONLY public.course_purchases ADD CONSTRAINT course_purchases_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.course_reviews ADD CONSTRAINT course_reviews_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.course_reviews ADD CONSTRAINT course_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.course_units ADD CONSTRAINT course_units_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.courses ADD CONSTRAINT courses_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.courses ADD CONSTRAINT courses_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);
ALTER TABLE ONLY public.daily_challenge_tasks ADD CONSTRAINT daily_challenge_tasks_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.daily_challenges(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.email_verifications ADD CONSTRAINT email_verifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.enrollments ADD CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);
ALTER TABLE ONLY public.enrollments ADD CONSTRAINT enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.flashcard_decks ADD CONSTRAINT flashcard_decks_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);
ALTER TABLE ONLY public.flashcard_decks ADD CONSTRAINT flashcard_decks_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);
ALTER TABLE ONLY public.flashcard_decks ADD CONSTRAINT flashcard_decks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.flashcard_progress ADD CONSTRAINT flashcard_progress_flashcard_id_fkey FOREIGN KEY (flashcard_id) REFERENCES public.flashcards(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.flashcard_progress ADD CONSTRAINT flashcard_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.flashcards ADD CONSTRAINT flashcards_deck_id_fkey FOREIGN KEY (deck_id) REFERENCES public.flashcard_decks(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.instructor_earnings ADD CONSTRAINT instructor_earnings_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);
ALTER TABLE ONLY public.instructor_earnings ADD CONSTRAINT instructor_earnings_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id);
ALTER TABLE ONLY public.instructor_earnings ADD CONSTRAINT instructor_earnings_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.instructor_payout_requests ADD CONSTRAINT instructor_payout_requests_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.instructor_profiles ADD CONSTRAINT instructor_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.leaderboards ADD CONSTRAINT leaderboards_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);
ALTER TABLE ONLY public.leaderboards ADD CONSTRAINT leaderboards_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.lesson_completions ADD CONSTRAINT lesson_completions_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id);
ALTER TABLE ONLY public.lesson_completions ADD CONSTRAINT lesson_completions_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id);
ALTER TABLE ONLY public.lesson_completions ADD CONSTRAINT lesson_completions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.lesson_transcript_segments ADD CONSTRAINT lesson_transcript_segments_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.lesson_transcripts ADD CONSTRAINT lesson_transcripts_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.lesson_vocabulary ADD CONSTRAINT lesson_vocabulary_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);
ALTER TABLE ONLY public.lesson_vocabulary ADD CONSTRAINT lesson_vocabulary_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.lessons ADD CONSTRAINT lessons_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.lessons ADD CONSTRAINT lessons_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.course_units(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.listening_attempts ADD CONSTRAINT listening_attempts_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.listening_exercises(id);
ALTER TABLE ONLY public.listening_attempts ADD CONSTRAINT listening_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.listening_exercises ADD CONSTRAINT listening_exercises_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);
ALTER TABLE ONLY public.listening_exercises ADD CONSTRAINT listening_exercises_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id);
ALTER TABLE ONLY public.live_session_messages ADD CONSTRAINT live_session_messages_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.live_sessions(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.live_session_messages ADD CONSTRAINT live_session_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.live_session_registrations ADD CONSTRAINT live_session_registrations_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.live_sessions(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.live_session_registrations ADD CONSTRAINT live_session_registrations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.live_sessions ADD CONSTRAINT live_sessions_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.live_sessions ADD CONSTRAINT live_sessions_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.live_sessions ADD CONSTRAINT live_sessions_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);
ALTER TABLE ONLY public.meetings ADD CONSTRAINT meetings_organizer_id_fkey FOREIGN KEY (organizer_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.messages ADD CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.messages ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.moderation_reports ADD CONSTRAINT moderation_reports_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.moderation_reports ADD CONSTRAINT moderation_reports_resolved_by_fkey FOREIGN KEY (resolved_by) REFERENCES public.users(id);
ALTER TABLE ONLY public.notifications ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.password_resets ADD CONSTRAINT password_resets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.payments ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.pulse_predictions ADD CONSTRAINT pulse_predictions_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);
ALTER TABLE ONLY public.pulse_predictions ADD CONSTRAINT pulse_predictions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.quiz_answers ADD CONSTRAINT quiz_answers_attempt_id_fkey FOREIGN KEY (attempt_id) REFERENCES public.quiz_attempts(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.quiz_answers ADD CONSTRAINT quiz_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.quiz_questions(id);
ALTER TABLE ONLY public.quiz_attempts ADD CONSTRAINT quiz_attempts_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id);
ALTER TABLE ONLY public.quiz_attempts ADD CONSTRAINT quiz_attempts_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id);
ALTER TABLE ONLY public.quiz_attempts ADD CONSTRAINT quiz_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.quiz_question_options ADD CONSTRAINT quiz_question_options_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.quiz_questions(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.quiz_questions ADD CONSTRAINT quiz_questions_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.quizzes ADD CONSTRAINT quizzes_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.quizzes ADD CONSTRAINT quizzes_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id);
ALTER TABLE ONLY public.quizzes ADD CONSTRAINT quizzes_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.course_units(id);
ALTER TABLE ONLY public.report_comments ADD CONSTRAINT report_comments_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.report_comments ADD CONSTRAINT report_comments_report_id_fkey FOREIGN KEY (report_id) REFERENCES public.reports(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.reports ADD CONSTRAINT reports_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.skill_scores ADD CONSTRAINT skill_scores_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);
ALTER TABLE ONLY public.skill_scores ADD CONSTRAINT skill_scores_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.speaking_attempts ADD CONSTRAINT speaking_attempts_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.speaking_exercises(id);
ALTER TABLE ONLY public.speaking_attempts ADD CONSTRAINT speaking_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.speaking_exercises ADD CONSTRAINT speaking_exercises_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);
ALTER TABLE ONLY public.speaking_exercises ADD CONSTRAINT speaking_exercises_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id);
ALTER TABLE ONLY public.streak_days ADD CONSTRAINT streak_days_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.streaks ADD CONSTRAINT streaks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.user_achievements ADD CONSTRAINT user_achievements_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.achievement_definitions(id);
ALTER TABLE ONLY public.user_achievements ADD CONSTRAINT user_achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.user_activities ADD CONSTRAINT user_activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.user_daily_challenge_progress ADD CONSTRAINT user_daily_challenge_progress_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.daily_challenges(id);
ALTER TABLE ONLY public.user_daily_challenge_progress ADD CONSTRAINT user_daily_challenge_progress_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.daily_challenge_tasks(id);
ALTER TABLE ONLY public.user_daily_challenge_progress ADD CONSTRAINT user_daily_challenge_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.user_languages ADD CONSTRAINT user_languages_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);
ALTER TABLE ONLY public.user_languages ADD CONSTRAINT user_languages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.user_onboarding ADD CONSTRAINT user_onboarding_learning_language_id_fkey FOREIGN KEY (learning_language_id) REFERENCES public.languages(id);
ALTER TABLE ONLY public.user_onboarding ADD CONSTRAINT user_onboarding_native_language_id_fkey FOREIGN KEY (native_language_id) REFERENCES public.languages(id);
ALTER TABLE ONLY public.user_onboarding ADD CONSTRAINT user_onboarding_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.user_sessions ADD CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.user_settings ADD CONSTRAINT user_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.user_social_logins ADD CONSTRAINT user_social_logins_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.user_subscriptions ADD CONSTRAINT user_subscriptions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id);
ALTER TABLE ONLY public.user_subscriptions ADD CONSTRAINT user_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.user_xp ADD CONSTRAINT user_xp_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.vocabulary_bank ADD CONSTRAINT vocabulary_bank_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);
ALTER TABLE ONLY public.vocabulary_bank ADD CONSTRAINT vocabulary_bank_source_lesson_id_fkey FOREIGN KEY (source_lesson_id) REFERENCES public.lessons(id);
ALTER TABLE ONLY public.vocabulary_bank ADD CONSTRAINT vocabulary_bank_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.weekly_activity ADD CONSTRAINT weekly_activity_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.xp_transactions ADD CONSTRAINT xp_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
