# 📐 FluentFusion — System Diagrams

> All diagrams are written in [Mermaid](https://mermaid.js.org/) syntax.
> Render them in GitHub, VS Code (Mermaid Preview), or [mermaid.live](https://mermaid.live).

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
    U --> V[POST /api/student/onboarding — save to DB]
    V --> W[/dashboard — Student Dashboard]

    L -- student + returning --> W
    L -- instructor --> X[/instructor — Instructor Dashboard]
    L -- admin / super_admin --> Y[/admin — Admin Dashboard]

    D -- student --> W
    D -- instructor --> X
    D -- admin --> Y

    W --> W1[Browse Catalog]
    W --> W2[Enroll in Course]
    W --> W3[Take Quiz]
    W --> W4[Join Live Session]
    W --> W5[View Leaderboard]
    W --> W6[Send Messages]

    X --> X1[Create / Edit Course]
    X --> X2[Manage Lessons]
    X --> X3[Schedule Live Session]
    X --> X4[View PULSE Insights]
    X --> X5[Request Payout]

    Y --> Y1[Approve / Reject Courses]
    Y --> Y2[Manage Users]
    Y --> Y3[Run PULSE Engine]
    Y --> Y4[View Revenue & Payments]
    Y --> Y5[Audit Log]
```

---

## 2. 👤 Use Case Diagram

```mermaid
flowchart LR
    subgraph Actors
        ST([🎓 Student])
        IN([👨‍🏫 Instructor])
        AD([🛡️ Admin])
        SA([🔑 Super Admin])
        SY([⚙️ System])
    end

    subgraph Authentication
        UC1[Register]
        UC2[Login]
        UC3[Verify Email OTP]
        UC4[Forgot / Reset Password]
    end

    subgraph Student Features
        UC5[Complete Onboarding]
        UC6[Browse Course Catalog]
        UC7[Enroll in Course]
        UC8[Watch Lessons]
        UC9[Take Quiz]
        UC10[Join Live Session]
        UC11[View Leaderboard]
        UC12[Track Progress & XP]
        UC13[Send Messages]
        UC14[View PULSE State]
    end

    subgraph Instructor Features
        UC15[Create / Edit Course]
        UC16[Add Lessons]
        UC17[Schedule Live Session]
        UC18[Create Quiz]
        UC19[View Student Roster]
        UC20[View PULSE Insights]
        UC21[View Revenue & Request Payout]
        UC22[Reply to Reviews]
    end

    subgraph Admin Features
        UC23[Approve / Reject Courses]
        UC24[Manage All Users]
        UC25[Ban / Unban Users]
        UC26[Run PULSE Engine]
        UC27[View Analytics & Geo Data]
        UC28[Manage Payments & Payouts]
        UC29[View Audit Log]
        UC30[Send Platform Notifications]
        UC31[Manage Platform Settings]
    end

    subgraph Super Admin Only
        UC32[Create Admin Accounts]
        UC33[Delete Admin Accounts]
    end

    subgraph System Automated
        UC34[Send OTP Email]
        UC35[Send Welcome Email]
        UC36[Send Password Reset Email]
        UC37[Classify Learner via PULSE ML]
    end

    ST --> UC1 & UC2 & UC3 & UC4
    ST --> UC5 & UC6 & UC7 & UC8 & UC9 & UC10 & UC11 & UC12 & UC13 & UC14

    IN --> UC1 & UC2 & UC3 & UC4
    IN --> UC15 & UC16 & UC17 & UC18 & UC19 & UC20 & UC21 & UC22 & UC13

    AD --> UC2
    AD --> UC23 & UC24 & UC25 & UC26 & UC27 & UC28 & UC29 & UC30 & UC31 & UC13

    SA --> UC32 & UC33

    SY --> UC34 & UC35 & UC36 & UC37

    UC1 -.triggers.-> UC34
    UC3 -.triggers.-> UC35
    UC4 -.triggers.-> UC36
    UC26 -.triggers.-> UC37
```

---

## 3. 🔁 Sequence Diagram — Student Registration & Onboarding

```mermaid
sequenceDiagram
    actor U as Student
    participant FE as React Frontend
    participant API as FastAPI Backend
    participant DB as PostgreSQL (Aiven)
    participant EM as Email Service (Resend/SMTP)

    U->>FE: Fill signup form (name, email, password)
    FE->>API: POST /api/auth/register
    API->>DB: Check email uniqueness
    DB-->>API: Not found
    API->>DB: INSERT User (is_verified=false, otp_code=XXXXXX)
    API->>EM: send_otp_email(email, name, otp)
    EM-->>U: Email with 6-digit OTP
    API-->>FE: { access_token, role, is_first_login: true }
    FE->>FE: Redirect → /verify-email

    U->>FE: Enter OTP code
    FE->>API: POST /api/auth/verify-email { email, code }
    API->>DB: Validate otp_code & otp_expiry
    DB-->>API: Valid
    API->>DB: UPDATE User SET is_verified=true, otp_code=null
    API->>EM: send_welcome_email(email, name, "student")
    EM-->>U: Welcome email
    API-->>FE: { message: "verified", role: "student" }
    FE->>FE: Redirect → /onboard/native-language

    Note over U,FE: 4-Step Onboarding
    U->>FE: Select native language
    U->>FE: Select target language
    U->>FE: Select learning goal
    U->>FE: Select proficiency level
    FE->>API: POST /api/student/onboarding { native_lang, learn_lang, goal, level }
    API->>DB: UPDATE User onboarding fields
    DB-->>API: OK
    API-->>FE: { message: "onboarding saved" }
    FE->>FE: Redirect → /dashboard
```

---

## 4. 🗄️ Entity Relationship Diagram (ERD)

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
        text description
        string language
        string level
        string flag_emoji
        string thumbnail_url
        enum status
        int instructor_id FK
        float price
        datetime created_at
    }

    LESSONS {
        int id PK
        int course_id FK
        string title
        string lesson_type
        string video_url
        int duration_min
        text description
        int order
    }

    ENROLLMENTS {
        int id PK
        int student_id FK
        int course_id FK
        float completion_pct
        datetime enrolled_at
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

    QUIZZES {
        int id PK
        int course_id FK
        string title
        int question_count
        float avg_score
        int attempts
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

    REVIEWS {
        int id PK
        int student_id FK
        int course_id FK
        int rating
        text comment
        text reply
        datetime created_at
    }

    NOTIFICATIONS {
        int id PK
        string title
        text message
        string target
        datetime sent_at
        int recipients
        float read_rate
    }

    AUDIT_LOGS {
        int id PK
        int admin_id FK
        string action_type
        text description
        datetime created_at
    }

    REPORTS {
        int id PK
        int reporter_id FK
        string report_type
        text content
        string status
        datetime created_at
    }

    MONTHLY_REVENUE {
        int id PK
        int year
        int month
        float gross
        float net
        int instructor_id FK
    }

    USERS ||--o{ COURSES : "teaches"
    USERS ||--o{ ENROLLMENTS : "enrolls"
    COURSES ||--o{ ENROLLMENTS : "has"
    COURSES ||--o{ LESSONS : "contains"
    COURSES ||--o{ LIVE_SESSIONS : "hosts"
    COURSES ||--o{ QUIZZES : "has"
    COURSES ||--o{ REVIEWS : "receives"
    USERS ||--o{ PAYMENTS : "makes"
    COURSES ||--o{ PAYMENTS : "paid for"
    USERS ||--o{ PAYOUTS : "requests"
    USERS ||--o{ MESSAGES : "sends"
    USERS ||--o{ MESSAGES : "receives"
    USERS ||--o{ REVIEWS : "writes"
    USERS ||--o{ AUDIT_LOGS : "generates"
    USERS ||--o{ REPORTS : "files"
    USERS ||--o{ MONTHLY_REVENUE : "earns"
```

---

## 5. 🧠 PULSE ML Engine — State Machine

```mermaid
stateDiagram-v2
    direction LR

    [*] --> DataCollection : Student activity recorded

    state DataCollection {
        VLE_Clicks : VLE Click Logs\n(studentVle)
        Assessments : Assessment Scores\n(studentAssessment)
        Registration : Registration Dates\n(studentRegistration)
        Demographics : Demographics\n(studentInfo)
    }

    DataCollection --> FeatureEngineering : Aggregate & derive

    state FeatureEngineering {
        F1 : total_clicks
        F2 : active_days
        F3 : avg_clicks_per_day
        F4 : avg_score
        F5 : num_assessments
        F6 : days_to_first_submit
        F7 : withdrew_early
        F8 : studied_credits
        F9 : num_of_prev_attempts
        F10 : days_registered_before_start
    }

    FeatureEngineering --> Preprocessing : Scale + Encode

    state Preprocessing {
        Scaler : StandardScaler\n(pulse_scaler.pkl)
        Encoder : LabelEncoders\n(label_encoders.pkl)
    }

    Preprocessing --> Model : Scaled feature vector

    state Model {
        GBC : GradientBoostingClassifier\n(pulse_model.pkl)\nTrained on 32k OULAD students
    }

    Model --> Classification : Predict state + probabilities

    state Classification {
        S0 : 🚀 Thriving\n(Distinction)
        S1 : 😐 Coasting\n(Pass)
        S2 : 😓 Struggling\n(Fail)
        S3 : 🔥 Burning Out\n(Withdrawn late)
        S4 : 💤 Disengaged\n(Withdrawn early)
    }

    Classification --> DB : UPDATE users SET pulse_state = ?
    DB --> Dashboard : Displayed on Student / Instructor / Admin dashboards

    S0 --> S1 : Engagement drops
    S1 --> S2 : Scores decline
    S1 --> S3 : Activity declining
    S2 --> S4 : No activity
    S3 --> S4 : Withdrawal
    S4 --> S0 : Re-engagement
    S2 --> S0 : Improvement
```

---

## 6. 🏗️ System Architecture Diagram

```mermaid
flowchart TB
    subgraph Client["🖥️ Client (Browser)"]
        FE["React 18 + TypeScript\nVite 5\nReact Router DOM 6"]
    end

    subgraph Vercel["☁️ Vercel (Frontend Hosting)"]
        FE_PROD["fluentfusionv1.vercel.app"]
    end

    subgraph Render["☁️ Render (Backend Hosting)"]
        API["FastAPI 0.111\nUvicorn\nPython 3.12"]
        UPLOADS["Static File Server\n/uploads"]
    end

    subgraph Aiven["☁️ Aiven Cloud (Database)"]
        PG["PostgreSQL 15\nSSL (ca.pem)"]
    end

    subgraph Email["📧 Email Providers"]
        RESEND["Resend API\n(Production)"]
        SMTP["Gmail SMTP\n(Fallback / Dev)"]
    end

    subgraph PULSE_SYS["🧠 PULSE ML (Embedded in API)"]
        MODEL["GradientBoostingClassifier\npulse_model.pkl"]
        SCALER["StandardScaler\npulse_scaler.pkl"]
        ENCODERS["LabelEncoders\nlabel_encoders.pkl"]
    end

    FE -- "VITE_API_URL\nHTTP/REST + JWT" --> API
    FE_PROD -- "HTTPS/REST + JWT" --> API
    API -- "SQLAlchemy ORM\nSSL" --> PG
    API -- "serve static files" --> UPLOADS
    API -- "send_otp / welcome / reset" --> RESEND
    RESEND -- "fallback" --> SMTP
    API -- "predict_one / predict_batch" --> MODEL
    MODEL --- SCALER
    MODEL --- ENCODERS

    style Client fill:#151515,color:#BFFF00
    style Vercel fill:#1a1a2e,color:#fff
    style Render fill:#1a2e1a,color:#fff
    style Aiven fill:#1a1a2e,color:#fff
    style Email fill:#2e1a1a,color:#fff
    style PULSE_SYS fill:#2e2a1a,color:#fff
```

---

## 7. 🔐 Sequence Diagram — JWT Authentication & Role-Based Access

```mermaid
sequenceDiagram
    actor U as User
    participant FE as React Frontend
    participant AC as AuthContext
    participant API as FastAPI Backend
    participant DB as PostgreSQL

    U->>FE: POST credentials to /login
    FE->>API: POST /api/auth/login { username, password }
    API->>DB: SELECT user WHERE email = ?
    DB-->>API: User record
    API->>API: verify_password(plain, hashed)
    API->>API: Check is_verified & status != banned
    API->>API: create_access_token({ sub: user_id, role })
    API-->>FE: { access_token, role, name, id, is_first_login }

    FE->>AC: setToken(access_token), setUser({ role, name, id })
    AC->>AC: Persist token to localStorage

    Note over FE,AC: Every subsequent request
    FE->>API: GET /api/student/dashboard\nAuthorization: Bearer <token>
    API->>API: get_current_user(token)\ndecode JWT → user_id
    API->>DB: SELECT user WHERE id = user_id
    DB-->>API: User record
    API->>API: Check role matches route guard
    API-->>FE: Dashboard data

    Note over FE: Role-based redirect
    FE->>FE: role == "student" → /dashboard
    FE->>FE: role == "instructor" → /instructor
    FE->>FE: role == "admin" | "super_admin" → /admin

    Note over U,FE: Token expiry (1440 min)
    FE->>API: Request with expired token
    API-->>FE: 401 Unauthorized
    FE->>AC: clearToken()
    FE->>FE: Redirect → /login
```

---

## Summary

| # | Diagram | What it shows |
|---|---|---|
| 1 | Flowchart | Complete user journey from landing to all 3 dashboards |
| 2 | Use Case | All actors and their system interactions |
| 3 | Sequence | Student registration, OTP verification, and onboarding flow |
| 4 | ERD | Full database schema with all 14 tables and relationships |
| 5 | State Machine | PULSE ML pipeline from raw data to learner state classification |
| 6 | Architecture | Full system: frontend, backend, DB, email, ML, hosting |
| 7 | Sequence | JWT auth flow, role-based routing, and token expiry handling |
