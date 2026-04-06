# 📐 FluentFusion — System Diagrams

> Render at [mermaid.live](https://mermaid.live) then export as PNG (1920×1080, scale 2) for Google Docs.
> Insert as image — never paste Mermaid code directly into Google Docs.

---

## 1. 🔄 Flowchart — Full User Journey

```mermaid
flowchart TD
    A([User visits /]) --> B{Logged in?}
    B -- No --> C[Welcome Page]
    B -- Yes --> D{Role?}

    C --> E[/signup]
    C --> F[/login]

    E --> G[Register: name, email, password, role]
    G --> H[OTP sent via Email]
    H --> I[/verify-email — Enter 6-digit OTP]
    I --> J{OTP valid?}
    J -- No --> K[Resend OTP]
    K --> I
    J -- Yes --> L{Role?}

    F --> M[Enter credentials]
    M --> N{Valid?}
    N -- No --> O[Error: Invalid credentials]
    N -- Yes --> P{Email verified?}
    P -- No --> Q[Error: EMAIL_NOT_VERIFIED]
    P -- Yes --> L

    L -- student + first login --> R[Onboarding Step 1: Native Language]
    R --> S[Step 2: Target Language]
    S --> T[Step 3: Goal]
    T --> U[Step 4: Level]
    U --> V[POST /api/student/onboarding]
    V --> W[/dashboard]

    L -- student + returning --> W
    L -- instructor --> X[/instructor]
    L -- admin / super_admin --> Y[/admin]

    D -- student --> W
    D -- instructor --> X
    D -- admin --> Y

    W --> W1[Browse Catalog]
    W --> W2[Live Translation]
    W --> W3[Take Quiz]
    W --> W4[Join Live Session]
    W --> W5[View Leaderboard]

    X --> X1[Create Course]
    X --> X2[Schedule Live Session]
    X --> X3[View PULSE Insights]

    Y --> Y1[Approve Courses]
    Y --> Y2[Manage Users]
    Y --> Y3[Run PULSE Engine]
```

---

## 2a. 👤 Use Case Diagram — Student & Auth

```mermaid
flowchart LR
    ST([Student])
    SY([System])

    subgraph Auth
        UC1[Register]
        UC2[Login / Google OAuth]
        UC3[Verify Email OTP]
        UC4[Reset Password]
    end

    subgraph Student
        UC5[Complete Onboarding]
        UC6[Browse Course Catalog]
        UC7[Enroll in Course]
        UC8[Watch Lessons]
        UC9[Take Quiz]
        UC10[Join Live Session]
        UC11[View Leaderboard & XP]
        UC12[Live Translation]
        UC13[Send Messages]
        UC14[View PULSE State]
        UC15[Speaking Practice]
        UC16[Flashcards & Daily Challenge]
    end

    subgraph SystemAuto[System Automated]
        UC17[Send OTP Email]
        UC18[Send Welcome Email]
        UC19[Classify via PULSE ML]
    end

    ST --> UC1 & UC2 & UC3 & UC4
    ST --> UC5 & UC6 & UC7 & UC8 & UC9 & UC10
    ST --> UC11 & UC12 & UC13 & UC14 & UC15 & UC16
    SY --> UC17 & UC18 & UC19
    UC1 -.-> UC17
    UC3 -.-> UC18
```

---

## 2b. 👤 Use Case Diagram — Instructor & Admin

```mermaid
flowchart LR
    IN([Instructor])
    AD([Admin])
    SA([Super Admin])

    subgraph Instructor
        UC1[Create / Edit Course]
        UC2[Add Lessons & Modules]
        UC3[Schedule Live Session]
        UC4[Create Quiz]
        UC5[View Student Roster]
        UC6[View PULSE Insights]
        UC7[View Revenue & Request Payout]
        UC8[Reply to Reviews]
        UC9[Send Messages]
    end

    subgraph Admin
        UC10[Approve / Reject Courses]
        UC11[Manage All Users]
        UC12[Ban / Unban Users]
        UC13[Run PULSE Engine]
        UC14[View Analytics & Geo Data]
        UC15[Manage Payments & Payouts]
        UC16[View Audit Log]
        UC17[Send Platform Notifications]
        UC18[Manage Platform Settings]
        UC19[Ethics & GDPR Compliance]
    end

    subgraph SuperAdmin[Super Admin Only]
        UC20[Create Admin Accounts]
        UC21[Delete Admin Accounts]
    end

    IN --> UC1 & UC2 & UC3 & UC4 & UC5 & UC6 & UC7 & UC8 & UC9
    AD --> UC10 & UC11 & UC12 & UC13 & UC14 & UC15 & UC16 & UC17 & UC18 & UC19
    SA --> UC20 & UC21
```

---

## 3. 🔁 Sequence Diagram — Registration & Onboarding

```mermaid
sequenceDiagram
    actor U as Student
    participant FE as React Frontend
    participant API as FastAPI Backend
    participant DB as PostgreSQL
    participant EM as Email Service

    U->>FE: Fill signup form
    FE->>API: POST /api/auth/register
    API->>DB: Check email uniqueness
    DB-->>API: Not found
    API->>DB: INSERT User (is_verified=false)
    API->>EM: send_otp_email(otp)
    EM-->>U: 6-digit OTP email
    API-->>FE: access_token

    U->>FE: Enter OTP
    FE->>API: POST /api/auth/verify-email
    API->>DB: Validate OTP
    API->>DB: SET is_verified=true
    API->>EM: send_welcome_email()
    API-->>FE: verified

    Note over U,FE: 4-Step Onboarding
    U->>FE: native lang → target lang → goal → level
    FE->>API: POST /api/student/onboarding
    API->>DB: UPDATE user onboarding fields
    API-->>FE: saved
    FE->>FE: Redirect /dashboard
```

---

## 4a. 🗄️ ERD — Core Tables

```mermaid
erDiagram
    USERS {
        int id PK
        string name
        string email
        string hashed_password
        enum role
        enum status
        string avatar_initials
        string avatar_url
        text bio
        bool is_verified
        string otp_code
        datetime otp_expiry
        string reset_token
        enum pulse_state
        int xp
        bool first_login
        datetime created_at
        datetime last_active
    }

    COURSES {
        int id PK
        string title
        string subtitle
        text description
        string category
        string language
        string level
        string flag_emoji
        string thumbnail_url
        enum status
        int instructor_id FK
        float price
        bool is_free
        text what_you_learn
        text requirements
        datetime created_at
    }

    MODULES {
        int id PK
        int course_id FK
        string title
        text description
        int order
    }

    LESSONS {
        int id PK
        int course_id FK
        int module_id FK
        string title
        string lesson_type
        string video_url
        text content
        int duration_min
        int order
        bool is_preview
    }

    ENROLLMENTS {
        int id PK
        int student_id FK
        int course_id FK
        float completion_pct
        datetime enrolled_at
    }

    USERS ||--o{ COURSES : "teaches"
    USERS ||--o{ ENROLLMENTS : "enrolls"
    COURSES ||--o{ ENROLLMENTS : "has"
    COURSES ||--o{ MODULES : "contains"
    MODULES ||--o{ LESSONS : "has"
    COURSES ||--o{ LESSONS : "has"
```

---

## 4b. 🗄️ ERD — Sessions, Quizzes & Payments

```mermaid
erDiagram
    COURSES {
        int id PK
        string title
    }

    USERS {
        int id PK
        string name
        string email
    }

    LIVE_SESSIONS {
        int id PK
        int course_id FK
        string title
        datetime scheduled_at
        int duration_min
        int attendees
        enum status
        string recording_url
    }

    MODULE_QUIZZES {
        int id PK
        int module_id FK
        string title
        int passing_score
        int time_limit_min
        bool is_required
    }

    QUIZ_QUESTIONS {
        int id PK
        int quiz_id FK
        text question_text
        string question_type
        text options
        string correct_answer
        int points
    }

    QUIZ_ATTEMPTS {
        int id PK
        int quiz_id FK
        int student_id FK
        int score
        bool passed
        datetime completed_at
    }

    PAYMENTS {
        int id PK
        int user_id FK
        int course_id FK
        float amount
        string method
        string status
        datetime created_at
    }

    PAYOUTS {
        int id PK
        int instructor_id FK
        float amount
        enum status
        string reference
        datetime requested_at
        datetime paid_at
    }

    MONTHLY_REVENUE {
        int id PK
        int year
        int month
        float gross
        float net
        int instructor_id FK
    }

    COURSES ||--o{ LIVE_SESSIONS : "hosts"
    COURSES ||--o{ PAYMENTS : "paid for"
    USERS ||--o{ PAYMENTS : "makes"
    USERS ||--o{ PAYOUTS : "requests"
    USERS ||--o{ MONTHLY_REVENUE : "earns"
    MODULE_QUIZZES ||--o{ QUIZ_QUESTIONS : "has"
    MODULE_QUIZZES ||--o{ QUIZ_ATTEMPTS : "attempted by"
    USERS ||--o{ QUIZ_ATTEMPTS : "takes"
```

---

## 4c. 🗄️ ERD — Communication & Compliance

```mermaid
erDiagram
    USERS {
        int id PK
        string name
    }

    MESSAGES {
        int id PK
        int sender_id FK
        int receiver_id FK
        text content
        string attachment_url
        string attachment_type
        bool is_read
        datetime created_at
    }

    NOTIFICATIONS {
        int id PK
        string title
        text message
        string target
        string notif_type
        int sender_id FK
        datetime sent_at
    }

    NOTIFICATION_READS {
        int id PK
        int user_id FK
        int notification_id FK
        datetime read_at
    }

    MEETINGS {
        int id PK
        string title
        int host_id FK
        datetime scheduled_at
        int duration_min
        enum status
        string room_id
    }

    MEETING_INVITES {
        int id PK
        int meeting_id FK
        int user_id FK
        bool accepted
    }

    CONSENT_RECORDS {
        int id PK
        int user_id FK
        enum consent_type
        string version
        bool accepted
        datetime accepted_at
    }

    DATA_SUBJECT_REQUESTS {
        int id PK
        int user_id FK
        enum request_type
        enum status
        text details
        datetime created_at
    }

    PULSE_STATE_FEEDBACK {
        int id PK
        int user_id FK
        enum current_state
        bool disagreed
        enum user_reported_state
        datetime created_at
    }

    AUDIT_LOGS {
        int id PK
        int admin_id FK
        string action_type
        text description
        datetime created_at
    }

    USERS ||--o{ MESSAGES : "sends"
    USERS ||--o{ MESSAGES : "receives"
    USERS ||--o{ NOTIFICATION_READS : "reads"
    USERS ||--o{ MEETINGS : "hosts"
    USERS ||--o{ MEETING_INVITES : "invited to"
    MEETINGS ||--o{ MEETING_INVITES : "has"
    USERS ||--o{ CONSENT_RECORDS : "gives"
    USERS ||--o{ DATA_SUBJECT_REQUESTS : "files"
    USERS ||--o{ PULSE_STATE_FEEDBACK : "submits"
    USERS ||--o{ AUDIT_LOGS : "generates"
```

---

## 5. 🧠 PULSE ML Pipeline

```mermaid
flowchart TD
    A[OULAD Dataset\n28785 students] --> B[Feature Engineering\n31 features]

    B --> B1[Behavioural\ntotal_clicks, active_days\navg_clicks_per_day]
    B --> B2[Assessment\navg_score, num_assessments\ndays_to_first_submit]
    B --> B3[Demographic\ngender, age_band\nstudied_credits]
    B --> B4[Composite\nengagement_score\ndecline_index]

    B1 & B2 & B3 & B4 --> C[Preprocessing\nStandardScaler + LabelEncoders]

    C --> D[XGBoost Classifier\nn_estimators=500\nlr=0.05, max_depth=6]

    D --> E{Prediction}

    E --> S0[🚀 Thriving\nAccuracy: 72.93%]
    E --> S1[😐 Coasting]
    E --> S2[😓 Struggling]
    E --> S3[🔥 Burning Out]
    E --> S4[💤 Disengaged]

    S0 & S1 & S2 & S3 & S4 --> F[UPDATE users.pulse_state]
    F --> G[Student Dashboard\nInstructor Insights\nAdmin PULSE Engine]
```

---

## 6. 🏗️ System Architecture

```mermaid
flowchart TB
    subgraph Client["Browser"]
        FE["React 18 + TypeScript\nVite 5 / React Router 6"]
    end

    subgraph Vercel["Vercel — Frontend"]
        PROD["fluentfusionv1.vercel.app"]
    end

    subgraph Render["Render — Backend"]
        API["FastAPI 0.111\nPython 3.12\nUvicorn"]
        TRANS["deep-translator\nLive Translation"]
        PULSE["XGBoost\nPULSE ML Engine"]
    end

    subgraph Aiven["Aiven Cloud"]
        PG["PostgreSQL 15\nSSL ca.pem"]
    end

    subgraph Email["Email"]
        SG["SendGrid\nProduction"]
        SMTP["Gmail SMTP\nDev Fallback"]
    end

    subgraph Cron["cron-job.org"]
        PING["Keep-alive ping\nevery 10 min"]
    end

    FE -- "HTTP/REST + JWT" --> API
    PROD -- "HTTPS/REST + JWT" --> API
    API -- "SQLAlchemy ORM" --> PG
    API --> TRANS
    API --> PULSE
    API --> SG
    SG -- fallback --> SMTP
    PING -- "GET /health" --> API
```

---

## 7. 🔐 Sequence — JWT Auth & Role Routing

```mermaid
sequenceDiagram
    actor U as User
    participant FE as React Frontend
    participant API as FastAPI Backend
    participant DB as PostgreSQL

    U->>FE: Submit login form
    FE->>API: POST /api/auth/login
    API->>DB: SELECT user WHERE email=?
    DB-->>API: User record
    API->>API: verify_password()
    API->>API: check is_verified & not banned
    API->>API: create_access_token(sub, role)
    API-->>FE: access_token + role

    FE->>FE: Store token in localStorage
    FE->>FE: role=student → /dashboard
    FE->>FE: role=instructor → /instructor
    FE->>FE: role=admin → /admin

    Note over FE,API: Protected request
    FE->>API: GET /api/student/dashboard\nBearer token
    API->>API: decode JWT → user_id
    API->>DB: SELECT user WHERE id=?
    API->>API: verify role guard
    API-->>FE: dashboard data

    Note over FE,API: Token expired
    FE->>API: Request with expired token
    API-->>FE: 401 Unauthorized
    FE->>FE: clear token → /login
```

---

## 8. 🌍 Live Translation Flow

```mermaid
sequenceDiagram
    actor U as Tourist / User
    participant FE as React Frontend
    participant API as FastAPI Backend
    participant GT as Google Translate\n(deep-translator)

    U->>FE: Type text or click quick phrase
    FE->>API: POST /api/translate\n{text, source_lang, target_lang}
    API->>API: Check in-memory cache
    alt Cache hit
        API-->>FE: Cached translation
    else Cache miss
        API->>GT: GoogleTranslator(src, tgt).translate(text)
        GT-->>API: Translated text
        API->>API: Lookup phonetic guide\n(Kinyarwanda dictionary)
        API->>API: Store in cache
        API-->>FE: {translated_text, romanization, usage_note}
    end
    FE->>U: Show translation + phonetic guide
    U->>FE: Click Listen → browser TTS
    U->>FE: Click Copy → clipboard
```

---

## Summary

| # | Diagram | What it shows |
|---|---|---|
| 1 | Flowchart | Complete user journey — signup, onboarding, all 3 dashboards |
| 2a | Use Case | Student & Auth actor interactions |
| 2b | Use Case | Instructor, Admin & Super Admin interactions |
| 3 | Sequence | Registration, OTP verification, onboarding |
| 4a | ERD | Core tables: Users, Courses, Modules, Lessons, Enrollments |
| 4b | ERD | Sessions, Quizzes, Payments, Payouts |
| 4c | ERD | Messages, Notifications, Meetings, Ethics & Compliance |
| 5 | ML Pipeline | PULSE: OULAD data → XGBoost → 5 engagement states |
| 6 | Architecture | Full system: Vercel, Render, Aiven, Email, cron-job.org |
| 7 | Sequence | JWT auth, role-based routing, token expiry |
| 8 | Sequence | Live Translation: cache → deep-translator → phonetic guide |
