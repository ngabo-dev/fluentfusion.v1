# FluentFusion Backend API Specification (FastAPI)

## 🐍 Tech Stack

- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions
- **SQLAlchemy** - ORM
- **Alembic** - Database migrations
- **Celery** - Background tasks
- **WebSockets** - Real-time features
- **JWT** - Authentication
- **S3/MinIO** - File storage
- **SendGrid/AWS SES** - Email service

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI app initialization
│   ├── config.py               # Configuration
│   ├── database.py             # Database connection
│   ├── dependencies.py         # Dependency injection
│   ├── models/                 # SQLAlchemy models
│   │   ├── user.py
│   │   ├── course.py
│   │   ├── lesson.py
│   │   ├── progress.py
│   │   └── ...
│   ├── schemas/                # Pydantic schemas
│   │   ├── user.py
│   │   ├── course.py
│   │   └── ...
│   ├── api/                    # API routes
│   │   ├── v1/
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── courses.py
│   │   │   ├── lessons.py
│   │   │   ├── practice.py
│   │   │   ├── live.py
│   │   │   ├── community.py
│   │   │   └── analytics.py
│   │   └── __init__.py
│   ├── services/               # Business logic
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   ├── ai_service.py       # AI recommendations
│   │   └── ...
│   ├── utils/
│   │   ├── security.py         # Password hashing, JWT
│   │   ├── email.py            # Email sending
│   │   ├── storage.py          # File storage
│   │   └── ...
│   └── tasks/                  # Celery tasks
│       ├── email_tasks.py
│       └── analytics_tasks.py
├── tests/
├── alembic/                    # Database migrations
├── requirements.txt
└── .env.example
```

## 🔐 Authentication Endpoints

### POST `/api/v1/auth/register`
Register new user
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "Jean Pierre Habimana",
  "role": "student"  // or "instructor"
}
```

Response:
```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "message": "Verification email sent"
}
```

### POST `/api/v1/auth/verify-email`
Verify email with OTP
```json
{
  "email": "user@example.com",
  "code": "472XXX"
}
```

### POST `/api/v1/auth/login`
Login user
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "access_token": "jwt_token",
  "refresh_token": "refresh_token",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "Jean Pierre"
  }
}
```

### POST `/api/v1/auth/forgot-password`
Request password reset
```json
{
  "email": "user@example.com"
}
```

### POST `/api/v1/auth/reset-password`
Reset password with token
```json
{
  "token": "reset_token",
  "new_password": "newpassword123"
}
```

### POST `/api/v1/auth/refresh`
Refresh access token
```json
{
  "refresh_token": "refresh_token"
}
```

### POST `/api/v1/auth/logout`
Logout user (blacklist token)

## 👤 User Endpoints

### GET `/api/v1/users/me`
Get current user profile

### PUT `/api/v1/users/me`
Update user profile
```json
{
  "full_name": "Jean Pierre Habimana",
  "bio": "Language enthusiast",
  "avatar_url": "https://...",
  "timezone": "Africa/Kigali"
}
```

### POST `/api/v1/users/onboarding`
Complete onboarding
```json
{
  "native_language": "kinyarwanda",
  "target_language": "english",
  "learning_goal": "travel",
  "proficiency_level": "beginner"
}
```

### GET `/api/v1/users/{user_id}`
Get public user profile

## 📚 Course Endpoints

### GET `/api/v1/courses`
List all courses
Query params: `language`, `level`, `category`, `page`, `limit`

Response:
```json
{
  "courses": [
    {
      "id": "uuid",
      "title": "English for Tourism",
      "description": "...",
      "language": "english",
      "level": "beginner",
      "total_lessons": 12,
      "enrolled_students": 12500,
      "rating": 4.8,
      "thumbnail_url": "...",
      "price": 0
    }
  ],
  "total": 500,
  "page": 1,
  "pages": 50
}
```

### GET `/api/v1/courses/{course_id}`
Get course details

### POST `/api/v1/courses/{course_id}/enroll`
Enroll in course

### GET `/api/v1/courses/enrolled`
Get user's enrolled courses

### GET `/api/v1/courses/{course_id}/progress`
Get course progress

## 📖 Lesson Endpoints

### GET `/api/v1/lessons/{lesson_id}`
Get lesson content
```json
{
  "id": "uuid",
  "title": "Check-in phrases",
  "type": "video",  // video, audio, text, interactive
  "content": "...",
  "duration": 900,  // seconds
  "exercises": [...],
  "resources": [...]
}
```

### POST `/api/v1/lessons/{lesson_id}/complete`
Mark lesson as complete
```json
{
  "score": 85,
  "time_spent": 720,  // seconds
  "answers": {...}
}
```

### GET `/api/v1/lessons/{lesson_id}/next`
Get next lesson in sequence

## 🎯 Practice Endpoints

### GET `/api/v1/practice/vocabulary`
Get vocabulary exercise
Query params: `language`, `level`, `type`

### POST `/api/v1/practice/vocabulary/submit`
Submit vocabulary answers
```json
{
  "exercise_id": "uuid",
  "answers": [
    {"question_id": "uuid", "answer": "hello"}
  ],
  "time_spent": 120
}
```

Response:
```json
{
  "score": 8,
  "total": 10,
  "correct_answers": [...],
  "xp_earned": 40
}
```

### GET `/api/v1/practice/speaking`
Get speaking exercise

### POST `/api/v1/practice/speaking/upload`
Upload speaking recording (multipart/form-data)

### GET `/api/v1/practice/daily-challenge`
Get today's challenge

## 🎥 Live Session Endpoints

### GET `/api/v1/live/sessions`
List upcoming sessions
Query params: `language`, `level`, `instructor`, `date`

### GET `/api/v1/live/sessions/{session_id}`
Get session details
```json
{
  "id": "uuid",
  "title": "Business English Masterclass",
  "instructor": {
    "id": "uuid",
    "name": "Dr. Mary K.",
    "avatar_url": "..."
  },
  "start_time": "2026-02-27T15:00:00Z",
  "duration": 60,
  "enrolled": 47,
  "max_participants": 50,
  "language": "english",
  "level": "intermediate",
  "price": 15.00
}
```

### POST `/api/v1/live/sessions/{session_id}/book`
Book a session

### DELETE `/api/v1/live/sessions/{session_id}/cancel`
Cancel booking

### GET `/api/v1/live/sessions/my-bookings`
Get user's booked sessions

### POST `/api/v1/live/sessions/{session_id}/join`
Join live session (returns WebSocket URL)

### GET `/api/v1/live/instructors`
List instructors

## 🌍 Community Endpoints

### GET `/api/v1/community/forums`
List forums

### GET `/api/v1/community/forums/{forum_id}/threads`
Get forum threads

### POST `/api/v1/community/threads`
Create new thread
```json
{
  "forum_id": "uuid",
  "title": "How to improve pronunciation?",
  "content": "I'm struggling with..."
}
```

### GET `/api/v1/community/threads/{thread_id}`
Get thread with replies

### POST `/api/v1/community/threads/{thread_id}/replies`
Reply to thread

### POST `/api/v1/community/threads/{thread_id}/like`
Like/unlike thread

## 📊 Analytics Endpoints

### GET `/api/v1/analytics/dashboard`
Get dashboard stats
```json
{
  "xp_points": 1240,
  "xp_today": 80,
  "daily_streak": 7,
  "streak_best": 14,
  "lessons_completed": 24,
  "lessons_this_month": 24,
  "fluency_score": 68,
  "time_spent_today": 1800,  // seconds
  "achievements_unlocked": 12
}
```

### GET `/api/v1/analytics/progress`
Get detailed progress
Query params: `period` (day, week, month, year)

### GET `/api/v1/analytics/achievements`
Get achievements and badges

### GET `/api/v1/analytics/leaderboard`
Get leaderboard
Query params: `scope` (global, friends, course), `period`

## 🤖 AI Endpoints

### GET `/api/v1/ai/recommendations`
Get AI-powered lesson recommendations

### POST `/api/v1/ai/chat`
AI conversation partner
```json
{
  "message": "Hello, how are you?",
  "language": "english",
  "level": "beginner"
}
```

### POST `/api/v1/ai/pronunciation-check`
Check pronunciation (audio upload)

## 🔔 Notification Endpoints

### GET `/api/v1/notifications`
Get user notifications

### PUT `/api/v1/notifications/{notification_id}/read`
Mark as read

### GET `/api/v1/notifications/preferences`
Get notification preferences

### PUT `/api/v1/notifications/preferences`
Update preferences

## 💳 Payment Endpoints (Future)

### POST `/api/v1/payments/create-checkout`
Create Stripe checkout session

### POST `/api/v1/payments/webhook`
Stripe webhook handler

### GET `/api/v1/payments/subscription`
Get subscription status

## 🔌 WebSocket Endpoints

### WS `/ws/live/{session_id}`
Live session WebSocket connection

Events:
- `participant_joined`
- `participant_left`
- `message`
- `screen_share`
- `hand_raised`

### WS `/ws/chat/{user_id}`
Real-time chat

## 📝 Database Models

### User
```python
class User(Base):
    id: UUID
    email: str (unique)
    hashed_password: str
    full_name: str
    role: str  # student, instructor, admin
    avatar_url: str
    native_language: str
    target_language: str
    learning_goal: str
    proficiency_level: str
    xp_points: int
    daily_streak: int
    created_at: datetime
    updated_at: datetime
    is_verified: bool
    is_active: bool
```

### Course
```python
class Course(Base):
    id: UUID
    title: str
    description: str
    language: str
    level: str
    category: str
    instructor_id: UUID
    thumbnail_url: str
    price: Decimal
    rating: float
    total_enrollments: int
    created_at: datetime
    updated_at: datetime
```

### Lesson
```python
class Lesson(Base):
    id: UUID
    course_id: UUID
    unit_id: UUID
    title: str
    type: str  # video, audio, text, interactive
    content: JSON
    duration: int
    order: int
    xp_reward: int
    created_at: datetime
```

### UserProgress
```python
class UserProgress(Base):
    id: UUID
    user_id: UUID
    lesson_id: UUID
    course_id: UUID
    status: str  # not_started, in_progress, completed
    score: int
    time_spent: int
    completed_at: datetime
    created_at: datetime
```

### LiveSession
```python
class LiveSession(Base):
    id: UUID
    title: str
    instructor_id: UUID
    language: str
    level: str
    start_time: datetime
    duration: int
    max_participants: int
    price: Decimal
    meeting_url: str
    status: str  # scheduled, live, completed, cancelled
    created_at: datetime
```

## 🔒 Security

### Authentication
- JWT tokens (access + refresh)
- Password hashing with bcrypt
- Rate limiting on auth endpoints
- Email verification required
- 2FA optional

### Authorization
- Role-based access control (RBAC)
- Resource ownership checks
- Token blacklisting for logout

### Data Protection
- HTTPS only
- SQL injection prevention (ORM)
- XSS prevention
- CORS configuration
- Input validation with Pydantic
- File upload validation

## 🚀 Deployment

### Environment Variables
```
DATABASE_URL=postgresql://user:pass@localhost/fluentfusion
REDIS_URL=redis://localhost:6379
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
EMAIL_API_KEY=sendgrid-key
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=fluentfusion-files
STRIPE_SECRET_KEY=...
OPENAI_API_KEY=...  # For AI features
```

### Docker Compose
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: fluentfusion
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
  
  redis:
    image: redis:7
    
  celery:
    build: .
    command: celery -A app.tasks worker
    depends_on:
      - redis
```

## 📚 API Documentation

FastAPI provides automatic interactive API documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- OpenAPI JSON: `http://localhost:8000/openapi.json`

## 🧪 Testing

```bash
# Run tests
pytest

# With coverage
pytest --cov=app

# Integration tests
pytest tests/integration/
```

---

**Ready to build!** 🚀
