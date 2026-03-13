-- Migration: Add quiz columns and rename pass_score to passing_score
-- Run this script against the Aiven PostgreSQL database

-- Rename pass_score to passing_score if it exists
ALTER TABLE public.quizzes RENAME COLUMN pass_score TO passing_score;

-- Add time_limit column if it doesn't exist
ALTER TABLE public.quizzes 
ADD COLUMN IF NOT EXISTS time_limit INTEGER DEFAULT 600;

-- Add allow_retakes column if it doesn't exist
ALTER TABLE public.quizzes 
ADD COLUMN IF NOT EXISTS allow_retakes BOOLEAN DEFAULT true;

-- Add matching_pairs column to quiz_questions if it doesn't exist
ALTER TABLE public.quiz_questions 
ADD COLUMN IF NOT EXISTS matching_pairs JSONB;

-- Add correct_order column to quiz_questions if it doesn't exist
ALTER TABLE public.quiz_questions 
ADD COLUMN IF NOT EXISTS correct_order JSONB;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'quizzes' 
AND column_name IN ('passing_score', 'time_limit', 'allow_retakes');

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'quiz_questions' 
AND column_name IN ('matching_pairs', 'correct_order');
