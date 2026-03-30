# Course Creation Process Redesign

## Overview

This document outlines the comprehensive redesign of the course creation process to support a more organized and structured approach with modules, lessons, and quizzes.

## Key Changes

### 1. Backend Model Changes

#### New Models Added:
- **Module**: Replaces `CourseSection` for clearer naming
  - `id`, `course_id`, `title`, `description`, `order`
  - Has many `Lesson` and `ModuleQuiz`

- **ModuleQuiz**: Quizzes at module level
  - `id`, `module_id`, `title`, `position` (start/middle/end), `passing_score`, `time_limit_min`, `is_required`, `order`
  - Has many `QuizQuestion`

- **QuizQuestion**: Individual quiz questions
  - `id`, `quiz_id`, `question_text`, `question_type`, `options` (JSON), `correct_answer`, `explanation`, `points`, `order`

- **QuizAttempt**: Track student quiz attempts
  - `id`, `quiz_id`, `student_id`, `score`, `passed`, `answers` (JSON), `started_at`, `completed_at`

#### Updated Models:
- **Lesson**: Changed `section_id` to `module_id`
- **Course**: Changed `sections` relationship to `modules`

### 2. Backend API Changes

#### New Endpoints:
- `POST /api/instructor/courses/{course_id}/modules` - Create a module
- `PATCH /api/instructor/courses/{course_id}/modules/{module_id}` - Update a module
- `DELETE /api/instructor/courses/{course_id}/modules/{module_id}` - Delete a module
- `POST /api/instructor/courses/{course_id}/modules/{module_id}/quizzes` - Create a quiz
- `PATCH /api/instructor/courses/{course_id}/modules/{module_id}/quizzes/{quiz_id}` - Update a quiz
- `DELETE /api/instructor/courses/{course_id}/modules/{module_id}/quizzes/{quiz_id}` - Delete a quiz
- `POST /api/instructor/courses/{course_id}/modules/{module_id}/quizzes/{quiz_id}/questions` - Add a question
- `PATCH /api/instructor/courses/{course_id}/modules/{module_id}/quizzes/{quiz_id}/questions/{question_id}` - Update a question
- `DELETE /api/instructor/courses/{course_id}/modules/{module_id}/quizzes/{quiz_id}/questions/{question_id}` - Delete a question

#### Updated Endpoints:
- `GET /api/instructor/courses/{course_id}` - Now returns modules with quizzes
- `GET /api/instructor/courses/{course_id}/modules` - Renamed from sections
- `POST /api/instructor/courses/{course_id}/submit` - Now validates:
  - At least 3 modules required
  - Each module must have at least 10 lessons

### 3. Frontend Changes

#### CourseEditor.tsx - Complete Redesign:
- **Module-based structure**: Courses are now organized into modules
- **Quiz support**: Add quizzes at module level with position (start/middle/end)
- **Quiz questions**: Add multiple choice questions with options, correct answers, and explanations
- **Validation**: Enforces 3+ modules with 10+ lessons each before submission
- **Better UX**: Clear module tabs, lesson management, and quiz creation

#### InstructorSidebar.tsx - Reorganized Navigation:
- **Course Creation** section: My Courses, Create Course
- **Teaching** section: Live Sessions, Quizzes, Lessons
- **Students** section: Student Roster, PULSE Insights, Messages, Reviews
- **Earnings** section: Revenue, Payouts
- **Settings** section: Announcements, Notifications, Profile & Settings

### 4. Database Migration

Created `migrate_to_modules.py` script to:
1. Create new tables (modules, module_quizzes, quiz_questions, quiz_attempts)
2. Migrate data from course_sections to modules
3. Update lesson references from section_id to module_id
4. Update sequence values

## Course Structure

### New Course Hierarchy:
```
Course
├── Module 1 (e.g., "Introduction to French")
│   ├── Lesson 1 (Video: "Greetings")
│   ├── Lesson 2 (Text: "Basic Vocabulary")
│   ├── Lesson 3 (Audio: "Pronunciation")
│   ├── ... (10+ lessons required)
│   ├── Quiz: Start of Module (optional)
│   ├── Quiz: Middle of Module (optional)
│   └── Quiz: End of Module (required)
├── Module 2 (e.g., "French Grammar")
│   ├── Lessons...
│   └── Quizzes...
└── Module 3 (e.g., "Conversational French")
    ├── Lessons...
    └── Quizzes...
```

### Quiz Positions:
- **Start**: Pre-assessment before module content
- **Middle**: Check understanding mid-module
- **End**: Final assessment to verify learning

### Quiz Features:
- Configurable passing score (default 70%)
- Optional time limit
- Required/optional flag
- Multiple question types (multiple choice, true/false, fill-in-blank)
- Explanations for each question

## Validation Rules

Before submitting a course for review:
1. Title, description, language, and level are required
2. At least 3 modules must be created
3. Each module must have at least 10 lessons
4. All module titles must be filled

## Benefits

1. **Better Organization**: Clear module-based structure
2. **Comprehensive Assessment**: Quizzes at start, middle, and end of modules
3. **Quality Control**: Enforced minimum content requirements
4. **Improved UX**: Intuitive interface for course creation
5. **Scalability**: Easy to add more quiz types and question formats

## Migration Steps

1. Run the migration script:
   ```bash
   cd backend
   python migrate_to_modules.py
   ```

2. Restart the backend server

3. Test the new course creation flow

## Future Enhancements

- Add more question types (fill-in-blank, matching, ordering)
- Add quiz analytics and student performance tracking
- Add module prerequisites (must complete Module 1 before Module 2)
- Add certificate generation based on quiz scores
- Add adaptive learning paths based on quiz performance
