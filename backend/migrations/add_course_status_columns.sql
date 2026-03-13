-- Migration: Add course status columns to the courses table
-- Run this script against the Aiven PostgreSQL database

-- Add status column (draft, published, archived, unpublished)
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'draft';

-- Add published_at timestamp
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Add requirements JSON field
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS requirements JSONB DEFAULT '[]'::jsonb;

-- Add learning_outcomes JSON field
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS learning_outcomes JSONB DEFAULT '[]'::jsonb;

-- Set default value for existing courses
UPDATE public.courses 
SET status = CASE 
    WHEN is_published = true THEN 'published' 
    ELSE 'draft' 
END
WHERE status IS NULL;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'courses' 
AND column_name IN ('status', 'published_at', 'requirements', 'learning_outcomes');
