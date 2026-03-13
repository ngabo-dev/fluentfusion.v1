-- ============================================================
-- COMPREHENSIVE MIGRATION: Fix all model/DB mismatches
-- Run this script against the Aiven PostgreSQL database
-- ============================================================

-- ============================================================
-- COURSES TABLE - Already done in first migration
-- ============================================================
-- These should already exist from the first migration:
-- ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'draft';
-- ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;
-- ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS requirements JSONB DEFAULT '[]'::jsonb;
-- ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS learning_outcomes JSONB DEFAULT '[]'::jsonb;

-- ============================================================
-- QUIZZES TABLE
-- ============================================================

-- Rename pass_score to passing_score if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'quizzes' AND column_name = 'pass_score'
    ) THEN
        ALTER TABLE public.quizzes RENAME COLUMN pass_score TO passing_score;
    END IF;
END $$;

-- Add time_limit column if it doesn't exist
ALTER TABLE public.quizzes 
ADD COLUMN IF NOT EXISTS time_limit INTEGER DEFAULT 600;

-- Add allow_retakes column if it doesn't exist
ALTER TABLE public.quizzes 
ADD COLUMN IF NOT EXISTS allow_retakes BOOLEAN DEFAULT true;

-- ============================================================
-- QUIZ_QUESTIONS TABLE
-- ============================================================

-- Add correct_answer column if it doesn't exist
ALTER TABLE public.quiz_questions 
ADD COLUMN IF NOT EXISTS correct_answer TEXT;

-- Add matching_pairs column if it doesn't exist
ALTER TABLE public.quiz_questions 
ADD COLUMN IF NOT EXISTS matching_pairs JSONB;

-- Add correct_order column if it doesn't exist
ALTER TABLE public.quiz_questions 
ADD COLUMN IF NOT EXISTS correct_order JSONB;

-- ============================================================
-- VERIFICATION: Check the columns
-- ============================================================

-- Check quizzes columns
SELECT 'quizzes' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'quizzes' 
AND column_name IN ('passing_score', 'time_limit', 'allow_retakes')
ORDER BY column_name;

-- Check quiz_questions columns
SELECT 'quiz_questions' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'quiz_questions' 
AND column_name IN ('correct_answer', 'matching_pairs', 'correct_order')
ORDER BY column_name;

-- Check courses columns (from first migration)
SELECT 'courses' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'courses' 
AND column_name IN ('status', 'published_at', 'requirements', 'learning_outcomes')
ORDER BY column_name;
