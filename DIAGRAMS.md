# 📐 FluentFusion — System Diagrams

> Render each diagram at [mermaid.live](https://mermaid.live) → Actions → PNG → insert into Google Docs at 16cm width.

---

## 1. 🏗️ System Architecture Diagram

```mermaid
flowchart TB
    subgraph Users["👥 Users"]
        direction LR
        ST["🎓 Student"]
        IN["👨‍🏫 Instructor"]
        AD["🛡️ Admin"]
        TO["✈️ Tourist"]
    end

    subgraph Frontend["☁️ Frontend — Vercel"]
        direction TB
        FE["React 18 + TypeScript\nVite 5 · React Router 6\nfluentfusionv1.vercel.app"]
        subgraph Pages["Pages"]
            P1["Student Dashboard\n/dashboard/*"]
            P2["Instructor Dashboard\n/instructor/*"]
            P3["Admin Dashboard\n/admin/*"]
            P4["Live Translation\n/dashboard/translate"]
        end
    end

    subgraph Backend["☁️ Backend — Render"]
        direction TB
        API["FastAPI 0.111\nPython 3.12 · Uvicorn\nfluentfusion-v1.onrender.com"]
        subgraph Routers["API Routers"]
            R1["/api/auth"]
            R2["/api/student"]
            R3["/api/instructor"]
            R4["/api/admin"]
            R5["/api/translate"]
            R6["/api/messages"]
            R7["/api/meetings (WebRTC)"]
            R8["/api/v1/ethics"]
        end
        subgraph ML["🧠 PULSE ML Engine"]
            M1["XGBoost Classifier\npulse_model.pkl"]
            M2["StandardScaler\npulse_scaler.pkl"]
            M3["LabelEncoders\nlabel_encoders.pkl"]
        end
    end

    subgraph External["External Services"]
        direction TB
        DB[("🗄️ PostgreSQL 15\nAiven Cloud\nSSL encrypted")]
        GT["🌍 Google Translate\ndeep-translator\nNo API key needed"]
        SG["📧 SendGrid\nEmail Production"]
        GM["📧 Gmail SMTP\nEmail Dev Fallback"]
        GO["🔑 Google OAuth\nSign-in with Google"]
        CJ["⏰ cron-job.org\nKeep-alive ping\nevery 10 min"]
    end

    Users --> FE
    FE --> API
    API --> DB
    API --> GT
    API --> SG
    SG -. fallback .-> GM
    API --> GO
    API --> M1
    M1 --- M2
    M1 --- M3
    CJ -. "GET /health" .-> API
```

---

## 2. 🔄 Flowchart — Complete User Journey

```mermaid
flowchart TD
    START([User opens FluentFusion]) --> AUTH{Has account?}

    AUTH -- No --> SIGNUP["/signup\nEnter name, email,\npassword, role"]
    AUTH -- Yes --> LOGIN["/login\nEnter email & password\nor Google OAuth"]

    SIGNUP --> OTP["OTP sent to email\n6-digit code, 10 min expiry"]
    OTP --> VERIFY["/verify-email\nEnter OTP code"]
    VERIFY --> VALID{OTP valid?}
    VALID -- No --> RESEND[Resend OTP]
    RESEND --> VERIFY
    VALID -- Yes --> WELCOME["Welcome email sent\nAccount activated"]
    WELCOME --> ROLE1{Role?}

    LOGIN --> CREDS{Credentials valid?}
    CREDS -- No --> ERR1["❌ Invalid credentials"]
    CREDS -- Yes --> VERIFIED{Email verified?}
    VERIFIED -- No --> ERR2["❌ Please verify email"]
    VERIFIED -- Yes --> ROLE1

    ROLE1 -- "Student\n(first login)" --> ONBOARD

    subgraph ONBOARD["4-Step Onboarding"]
        O1["Step 1: Native Language"] --> O2["Step 2: Target Language"]
        O2 --> O3["Step 3: Learning Goal"]
        O3 --> O4["Step 4: Proficiency Level"]
        O4 --> O5["Save to DB\nPOST /api/student/onboarding"]
    end

    ROLE1 -- "Student\n(returning)" --> SDASH
    ONBOARD --> SDASH

    subgraph SDASH["/dashboard — Student"]
        S1["📚 Browse Course Catalog"]
        S2["🎓 Enroll & Watch Lessons"]
        S3["📝 Take Quizzes"]
        S4["🎥 Join Live Sessions"]
        S5["🌍 Live Translation"]
        S6["🏆 Leaderboard & XP"]
        S7["💬 Messages"]
        S8["🧠 View PULSE State"]
    end

    ROLE1 -- Instructor --> IDASH

    subgraph IDASH["/instructor — Instructor"]
        I1["📖 Create & Edit Courses"]
        I2["🎬 Add Lessons & Modules"]
        I3["📅 Schedule Live Sessions"]
        I4["📊 View PULSE Insights"]
        I5["💰 Revenue & Payouts"]
        I6["⭐ Manage Reviews"]
    end

    ROLE1 -- "Admin /\nSuper Admin" --> ADASH

    subgraph ADASH["/admin — Admin"]
        A1["✅ Approve / Reject Courses"]
        A2["👥 Manage All Users"]
        A3["🧠 Run PULSE Engine"]
        A4["📈 Analytics & Geo Data"]
        A5["💳 Payments & Payouts"]
        A6["📋 Audit Log"]
        A7["🔒 Ethics & GDPR"]
    end
```

---

## 3. 👤 Use Case Diagram — All Actors

```mermaid
flowchart LR
    subgraph Actors["Actors"]
        ST(["🎓 Student"])
        IN(["👨‍🏫 Instructor"])
        AD(["🛡️ Admin"])
        SA(["🔑 Super Admin"])
        SY(["⚙️ System"])
    end

    subgraph UC_AUTH["Authentication"]
        A1["Register with email"]
        A2["Login with email/password"]
        A3["Login with Google OAuth"]
        A4["Verify email via OTP"]
        A5["Reset forgotten password"]
    end

    subgraph UC_ST["Student Features"]
        B1["Complete 4-step onboarding"]
        B2["Browse course catalog"]
        B3["Enroll in a course"]
        B4["Watch video lessons"]
        B5["Take quizzes"]
        B6["Join live sessions (WebRTC)"]
        B7["Use Live Translation"]
        B8["View XP & leaderboard"]
        B9["Track PULSE state"]
        B10["Send & receive messages"]
        B11["Speaking practice"]
        B12["Flashcards & daily challenge"]
        B13["Manage GDPR data rights"]
    end

    subgraph UC_IN["Instructor Features"]
        C1["Create & edit courses"]
        C2["Add lessons & modules"]
        C3["Create quizzes"]
        C4["Schedule live sessions"]
        C5["View student roster"]
        C6["View PULSE engagement insights"]
        C7["View revenue & request payout"]
        C8["Reply to student reviews"]
        C9["Send messages to students"]
    end

    subgraph UC_AD["Admin Features"]
        D1["Approve or reject courses"]
        D2["Manage all platform users"]
        D3["Ban or unban users"]
        D4["Run PULSE ML engine"]
        D5["View analytics & geo data"]
        D6["Manage payments & payouts"]
        D7["View audit log"]
        D8["Send platform notifications"]
        D9["Manage platform settings"]
        D10["Oversee ethics & compliance"]
    end

    subgraph UC_SA["Super Admin Only"]
        E1["Create admin accounts"]
        E2["Delete admin accounts"]
    end

    subgraph UC_SYS["System Automated"]
        F1["Send OTP verification email"]
        F2["Send welcome email on signup"]
        F3["Send password reset email"]
        F4["Classify learner via PULSE ML"]
        F5["Keep-alive ping via cron-job.org"]
    end

    ST --> A1 & A2 & A3 & A4 & A5
    ST --> B1 & B2 & B3 & B4 & B5 & B6 & B7 & B8 & B9 & B10 & B11 & B12 & B13

    IN --> A1 & A2 & A3 & A4 & A5
    IN --> C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8 & C9

    AD --> A2
    AD --> D1 & D2 & D3 & D4 & D5 & D6 & D7 & D8 & D9 & D10

    SA --> E1 & E2

    SY --> F1 & F2 & F3 & F4 & F5

    A1 -.triggers.-> F1
    A4 -.triggers.-> F2
    A5 -.triggers.-> F3
    D4 -.triggers.-> F4
```

---

## 4. 🔁 Sequence Diagram — Student Registration & Onboarding

```mermaid
sequenceDiagram
    actor U as Student
    participant FE as React Frontend
    participant API as FastAPI Backend
    participant DB as PostgreSQL (Aiven)
    participant EM as Email Service

    rect rgb(20, 30, 20)
        Note over U,EM: Step 1 — Registration
        U->>FE: Fill signup form (name, email, password, role)
        FE->>API: POST /api/auth/register
        API->>DB: SELECT user WHERE email = ?
        DB-->>API: Not found (email available)
        API->>DB: INSERT User (is_verified=false, otp_code=XXXXXX)
        DB-->>API: User created (id=N)
        API->>EM: send_otp_email(email, name, otp)
        EM-->>U: Email with 6-digit OTP code
        API-->>FE: { access_token, role, id }
        FE->>FE: Redirect → /verify-email
    end

    rect rgb(20, 20, 30)
        Note over U,EM: Step 2 — Email Verification
        U->>FE: Enter 6-digit OTP code
        FE->>API: POST /api/auth/verify-email { email, code }
        API->>DB: SELECT user WHERE email = ?
        DB-->>API: User record with otp_code
        API->>API: Validate code & check expiry
        API->>DB: UPDATE SET is_verified=true, otp_code=null
        API->>EM: send_welcome_email(email, name, role)
        EM-->>U: Welcome email
        API-->>FE: { message: "verified", role: "student" }
        FE->>FE: Redirect → /onboard/native-language
    end

    rect rgb(30, 20, 20)
        Note over U,FE: Step 3 — 4-Step Onboarding
        U->>FE: Select native language
        FE->>FE: Save to localStorage
        U->>FE: Select target language
        FE->>FE: Save to localStorage
        U->>FE: Select learning goal
        FE->>FE: Save to localStorage
        U->>FE: Select proficiency level
        FE->>API: POST /api/student/onboarding\n{ native_lang, learn_lang, goal, level }
        API->>DB: UPDATE users SET onboarding fields
        DB-->>API: OK
        API-->>FE: { message: "onboarding saved" }
        FE->>FE: Redirect → /dashboard
    end
```

---

## 5. 🔐 Sequence Diagram — JWT Authentication & Role Routing

```mermaid
sequenceDiagram
    actor U as User
    participant FE as React Frontend
    participant AC as AuthContext
    participant API as FastAPI Backend
    participant DB as PostgreSQL

    rect rgb(20, 30, 20)
        Note over U,DB: Login Flow
        U->>FE: Enter email & password → Submit
        FE->>API: POST /api/auth/login\n(form: username, password)
        API->>DB: SELECT user WHERE email = ?
        DB-->>API: User record
        API->>API: verify_password(plain, hashed)
        API->>API: Check is_verified = true
        API->>API: Check status != banned
        API->>API: create_access_token({ sub: user_id, role })
        API-->>FE: { access_token, role, name, id, is_first_login }
        FE->>AC: setToken() + setUser()
        AC->>AC: Persist to localStorage
    end

    rect rgb(20, 20, 30)
        Note over FE,FE: Role-Based Redirect
        FE->>FE: role = "student" → /dashboard
        FE->>FE: role = "instructor" → /instructor
        FE->>FE: role = "admin" → /admin
        FE->>FE: role = "super_admin" → /admin
    end

    rect rgb(30, 25, 10)
        Note over FE,DB: Protected API Request
        FE->>API: GET /api/student/dashboard\nAuthorization: Bearer <token>
        API->>API: decode JWT → user_id + role
        API->>DB: SELECT user WHERE id = user_id
        DB-->>API: User record
        API->>API: Verify role matches route guard
        API-->>FE: Dashboard data (JSON)
    end

    rect rgb(30, 10, 10)
        Note over U,FE: Token Expiry (1440 min)
        FE->>API: Request with expired token
        API-->>FE: 401 Unauthorized
        FE->>AC: clearToken()
        FE->>FE: Redirect → /login?reason=expired
    end
```

---

## 6. 🗄️ ERD — Core Tables (Users, Courses, Learning)

```mermaid
erDiagram
    USERS {
        int id PK
        string name
        string email
        string hashed_password
        enum role "student|instructor|admin|super_admin"
        enum status "active|banned|pending"
        string avatar_initials
        string avatar_url
        text bio
        bool is_verified
        string otp_code
        datetime otp_expiry
        string reset_token
        enum pulse_state "thriving|coasting|struggling|burning_out|disengaged"
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
        enum status "draft|pending|approved|published|rejected"
        int instructor_id FK
        float price
        bool is_free
        text what_you_learn
        text requirements
        datetime created_at
        datetime published_at
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
        string lesson_type "video|text|pdf|audio"
        string video_url
        text content
        int duration_min
        int order
        bool is_preview
        bool is_downloadable
    }

    ENROLLMENTS {
        int id PK
        int student_id FK
        int course_id FK
        float completion_pct
        datetime enrolled_at
    }

    MODULE_QUIZZES {
        int id PK
        int module_id FK
        string title
        int passing_score
        int time_limit_min
        bool is_required
        int order
    }

    QUIZ_QUESTIONS {
        int id PK
        int quiz_id FK
        text question_text
        string question_type "multiple_choice|true_false|fill_blank"
        text options
        string correct_answer
        text explanation
        int points
    }

    QUIZ_ATTEMPTS {
        int id PK
        int quiz_id FK
        int student_id FK
        int score
        bool passed
        text answers
        datetime completed_at
    }

    USERS ||--o{ COURSES : "teaches (instructor)"
    USERS ||--o{ ENROLLMENTS : "enrolls in"
    COURSES ||--o{ ENROLLMENTS : "enrolled by students"
    COURSES ||--o{ MODULES : "organised into"
    MODULES ||--o{ LESSONS : "contains"
    MODULES ||--o{ MODULE_QUIZZES : "assessed by"
    MODULE_QUIZZES ||--o{ QUIZ_QUESTIONS : "has"
    MODULE_QUIZZES ||--o{ QUIZ_ATTEMPTS : "attempted by"
    USERS ||--o{ QUIZ_ATTEMPTS : "takes"
```

---

## 7. 🗄️ ERD — Payments, Sessions & Communication

```mermaid
erDiagram
    USERS {
        int id PK
        string name
        string email
        enum role
    }

    COURSES {
        int id PK
        string title
        int instructor_id FK
    }

    LIVE_SESSIONS {
        int id PK
        int course_id FK
        string title
        datetime scheduled_at
        int duration_min
        int attendees
        enum status "scheduled|live|completed"
        string recording_url
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
        enum status "pending|approved|paid|rejected"
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

    MESSAGES {
        int id PK
        int sender_id FK
        int receiver_id FK
        text content
        string attachment_url
        string attachment_type "image|audio|document"
        bool is_read
        datetime created_at
    }

    MEETINGS {
        int id PK
        string title
        int host_id FK
        datetime scheduled_at
        int duration_min
        enum status "scheduled|live|ended|cancelled"
        string room_id
    }

    MEETING_INVITES {
        int id PK
        int meeting_id FK
        int user_id FK
        bool accepted
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
        string notif_type "announcement|notification"
        int sender_id FK
        bool allow_replies
        datetime sent_at
    }

    AUDIT_LOGS {
        int id PK
        int admin_id FK
        string action_type
        text description
        datetime created_at
    }

    COURSES ||--o{ LIVE_SESSIONS : "hosts"
    COURSES ||--o{ PAYMENTS : "purchased via"
    COURSES ||--o{ REVIEWS : "reviewed by"
    USERS ||--o{ PAYMENTS : "makes"
    USERS ||--o{ PAYOUTS : "requests"
    USERS ||--o{ MONTHLY_REVENUE : "earns"
    USERS ||--o{ MESSAGES : "sends"
    USERS ||--o{ MESSAGES : "receives"
    USERS ||--o{ MEETINGS : "hosts"
    MEETINGS ||--o{ MEETING_INVITES : "invites"
    USERS ||--o{ MEETING_INVITES : "invited to"
    USERS ||--o{ REVIEWS : "writes"
    USERS ||--o{ AUDIT_LOGS : "logged by"
```

---

## 8. 🗄️ ERD — Ethics & Compliance

```mermaid
erDiagram
    USERS {
        int id PK
        string name
        string email
    }

    CONSENT_RECORDS {
        int id PK
        int user_id FK
        enum consent_type "terms|privacy|pulse_processing|marketing|cookie"
        string version
        bool accepted
        string ip_address
        datetime accepted_at
        datetime revoked_at
    }

    DATA_SUBJECT_REQUESTS {
        int id PK
        int user_id FK
        enum request_type "access|correction|deletion|portability|restriction"
        enum status "pending|in_progress|completed|rejected"
        text details
        datetime created_at
        datetime resolved_at
        int resolved_by FK
    }

    PULSE_STATE_FEEDBACK {
        int id PK
        int user_id FK
        enum current_state
        bool disagreed
        enum user_reported_state
        text comment
        datetime created_at
    }

    CONSENT_VERSIONS {
        int id PK
        enum document_type "terms|privacy_policy|pulse_disclosure|cookie_policy"
        string version_number
        string content_hash
        datetime effective_date
    }

    PROCESSING_ACTIVITY_LOGS {
        int id PK
        string activity_name
        text purpose
        string legal_basis
        text data_categories
        string retention_period
        bool cross_border_transfer
        datetime created_at
    }

    ETHICS_CHANGE_LOGS {
        int id PK
        string change_type
        text description
        bool notified_rec
        datetime created_at
        int created_by FK
    }

    USERS ||--o{ CONSENT_RECORDS : "gives consent"
    USERS ||--o{ DATA_SUBJECT_REQUESTS : "files request"
    USERS ||--o{ PULSE_STATE_FEEDBACK : "submits feedback"
    USERS ||--o{ ETHICS_CHANGE_LOGS : "logs change"
```

---

## 9. 🌍 Sequence — Live Translation

```mermaid
sequenceDiagram
    actor U as Tourist / User
    participant FE as React Frontend
    participant API as FastAPI Backend
    participant CA as In-Memory Cache
    participant GT as Google Translate (deep-translator)
    participant PH as Phonetic Dictionary

    U->>FE: Type text or click quick phrase button
    FE->>FE: Set source lang + target lang
    FE->>API: POST /api/translate\n{ text, source_lang, target_lang }

    API->>CA: Check cache (md5 key)
    alt Cache hit
        CA-->>API: Cached result
        API-->>FE: { translated_text, romanization, usage_note }
    else Cache miss
        API->>GT: GoogleTranslator(src, tgt).translate(text)
        GT-->>API: Translated text
        API->>PH: Lookup phonetic guide\n(Kinyarwanda dictionary)
        PH-->>API: romanization + usage_note
        API->>CA: Store result in cache
        API-->>FE: { translated_text, romanization, usage_note }
    end

    FE->>U: Display translation
    FE->>U: Show phonetic guide (e.g. mu-ra-KO-ze)
    FE->>U: Show Rwanda tourism tip

    alt User clicks Listen
        FE->>FE: SpeechSynthesisUtterance(text, lang)
        FE->>U: Browser reads translation aloud
    end

    alt User clicks Copy
        FE->>FE: navigator.clipboard.writeText()
        FE->>U: ✅ Copied confirmation
    end
```

---

## Summary

| # | Diagram | Page in Report |
|---|---|---|
| 1 | System Architecture | Implementation chapter |
| 2 | Flowchart — User Journey | System Design chapter |
| 3 | Use Case — All Actors | System Design chapter |
| 4 | Sequence — Registration & Onboarding | System Design chapter |
| 5 | Sequence — JWT Auth & Role Routing | System Design chapter |
| 6 | ERD — Core Tables | Database Design chapter |
| 7 | ERD — Payments, Sessions & Communication | Database Design chapter |
| 8 | ERD — Ethics & Compliance | Ethics chapter |
| 9 | Sequence — Live Translation | Implementation chapter |
