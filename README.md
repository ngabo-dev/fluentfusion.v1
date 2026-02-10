# FluentFusion - AI-Driven Language Learning Platform for Rwanda's Tourism Sector

## 📖 Project Description

FluentFusion is a comprehensive web-based language learning platform designed to bridge communication gaps in Rwanda's thriving tourism sector. The platform serves two primary user groups:
- **Tourists** learning Kinyarwanda to enhance their travel experience
- **Tourism workers** improving their English/French skills to better serve international visitors

The application features tourism-specific content including lessons on greetings, hotel/accommodation phrases, food ordering, transportation, shopping, and emergency situations.

## 🔗 Links

- **Live Demo**: [FluentFusion Demo](https://fluentfusion.vercel.app)
- **GitHub Repository**: [https://github.com/ngabo-dev/fluentfusion.v1](https://github.com/ngabo-dev/fluentfusion.v1)
- **Video Demonstration**: [Watch Demo](https://your-video-link.com)

## 🎯 Key Features

### ✅ Implemented Features (MVP)

#### Frontend (React.js + TypeScript)
- **User Authentication**: Complete registration and login system with user type selection
- **Interactive Lessons**: 7 comprehensive tourism-focused lessons with:
  - Vocabulary learning with pronunciations
  - Common phrases with context
  - Cultural notes for better understanding
  - Interactive exercises (multiple choice, fill-in-blank, matching)
- **Progress Tracking**: Detailed analytics including:
  - Score tracking and visualization
  - Time spent learning
  - Completion badges and achievements
  - Performance charts (line and bar charts)
- **AI-Powered Recommendations**: Smart lesson suggestions based on:
  - User performance and scores
  - Learning patterns and history
  - Difficulty progression
- **AI Chatbot**: Interactive conversational practice with context-aware responses
- **User Profile Management**: Edit profile, change learning preferences
- **Responsive Design**: Works seamlessly on desktop and mobile devices

#### Backend (FastAPI + PostgreSQL)
- **RESTful API**: Complete API with endpoints for lessons, exercises, users, progress, and recommendations
- **PostgreSQL Database**: Aiven PostgreSQL for production, SQLite for local development
- **Redis Caching**: Session management and caching for improved performance
- **JWT Authentication**: Secure token-based authentication
- **SQLAlchemy ORM**: Database operations with type safety

#### ML/AI Components
- **Recommendation Engine**: Rule-based collaborative filtering algorithm that:
  - Analyzes user performance
  - Considers completion history
  - Suggests appropriate difficulty levels
  - Provides confidence scores for recommendations
- **Performance Analytics**: Data visualization and progress tracking
- **Chatbot AI**: Context-aware conversational responses

## 🎨 Designs

### Figma Mockups
The application designs are available in the [`Designs/`](Designs/) folder:

| Screenshot | Description |
|------------|-------------|
| [`Designs/Pasted image (1).png`] | Landing Page - Hero section with call-to-action |
| [`Designs/Pasted image (2).png`] | Dashboard - User overview with recommendations |
| [`Designs/Pasted image (3).png`] | Lesson Viewer - Vocabulary and phrases |
| [`Designs/Pasted image (4).png`] | Progress Tracker - Analytics charts |
| [`Designs/Pasted image (5).png`] | Chatbot Interface - AI conversation |
| [`Designs/Pasted image (6).png`] | Profile Page - User settings |
| [`Designs/Pasted image (7).png`] | Login/Register - Authentication flow |
| [`Designs/Pasted image (8).png`] | Mobile View - Responsive design |
| [`Designs/Pasted image (9).png`] | Badge System - Achievement display |
| [`Designs/Pasted image (10).png`] | Exercise Types - Multiple choice |
| [`Designs/Pasted image (11).png`] | Exercise Types - Fill in the blank |
| [`Designs/Pasted image (12).png`] | Navigation - Sidebar menu |

### System Architecture
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Vercel CDN    │────▶│   FastAPI       │────▶│   Aiven         │
│   Frontend      │     │   Backend       │     │   PostgreSQL    │
│   (React + TS)  │     │   (Python)      │     │   Database      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Aiven Redis   │
                       │   (Caching)     │
                       └─────────────────┘
```

## 🚀 Deployment

### Production Deployment

#### Frontend (Vercel/Netlify)
1. Connect your GitHub repository to Vercel
2. Vercel auto-detects React + Vite configuration
3. Deploy with zero configuration

**Quick Deploy:**
```bash
npm i -g vercel
vercel
```

#### Backend (Railway/Fly.io/AWS)
**Aiven PostgreSQL:**
- Create an Aiven PostgreSQL service at [aiven.io](https://aiven.io)
- Get your connection string from the Aiven console
- Set `DATABASE_URL` environment variable

**Environment Variables:**
```env
DATABASE_URL=postgresql://user:password@host:port/dbname?sslmode=require
REDIS_URL=redis://:password@host:port
SECRET_KEY=your-secret-key-change-in-production
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:5173,https://your-domain.com
```

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for detailed deployment instructions.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.12
- **UI Components**: Radix UI + Custom components
- **State Management**: React Hooks + Local Storage
- **Charts**: Recharts 2.15.2
- **Icons**: Lucide React 0.487.0
- **Routing**: Client-side navigation

### Backend
- **Framework**: Python FastAPI
- **Authentication**: JWT tokens
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Caching**: Redis
- **ML**: TensorFlow/Scikit-learn for recommendations

### Development Tools
- **Package Manager**: pnpm
- **Type Checking**: TypeScript
- **Code Quality**: ESLint + Prettier
- **Version Control**: Git

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- pnpm (or npm)
- Python 3.12+
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/ngabo-dev/fluentfusion.v1.git
cd fluentfusion.v1
```

### Step 2: Frontend Setup
```bash
# Navigate to project root
cd fluentfusion.v1

# Install dependencies
pnpm install

# Or using npm
npm install

# Start development server
pnpm dev

# Build for production
pnpm build
```
The frontend will be available at `http://localhost:5173`

### Step 3: Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# or
.venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
# Copy .env.example to .env and fill in your credentials
cp .env.example .env

# Start development server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The backend API will be available at `http://localhost:8000`

### Step 4: Database Setup
```bash
cd backend

# For SQLite (default - no setup needed)
python seed.py

# For PostgreSQL (Aiven)
# Update .env with your DATABASE_URL
python seed.py
```

### Step 5: Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 👤 Demo Credentials

To quickly test the application, use these demo credentials:

**Tourist Account:**
- Email: `tourist@demo.com`
- Password: `demo123`

**Tourism Worker Account:**
- Email: `worker@demo.com`
- Password: `demo123`

Or create your own account by clicking "Sign Up" on the landing page.

## 📱 Application Structure

```
fluentfusion.v1/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── ui/                    # Reusable UI components (shadcn/ui)
│   │   │   ├── LandingPage.tsx        # Landing/marketing page
│   │   │   ├── LoginPage.tsx          # User login
│   │   │   ├── RegisterPage.tsx       # User registration
│   │   │   ├── Dashboard.tsx          # Main dashboard with AI recommendations
│   │   │   ├── LessonBrowser.tsx      # Browse and filter lessons
│   │   │   ├── LessonViewer.tsx       # Interactive lesson content
│   │   │   ├── ProgressTracker.tsx    # Analytics and progress
│   │   │   ├── ProfilePage.tsx        # User profile management
│   │   │   ├── ChatbotInterface.tsx   # AI conversational practice
│   │   │   └── Navigation.tsx         # Main navigation component
│   │   ├── data/
│   │   │   └── mockData.ts            # Lesson content and badges
│   │   ├── services/
│   │   │   └── api.ts                 # API client for backend communication
│   │   ├── types.ts                   # TypeScript type definitions
│   │   └── App.tsx                   # Main application component
│   ├── styles/
│   │   ├── index.css                  # Global styles
│   │   ├── tailwind.css               # Tailwind config
│   │   └── theme.css                  # Theme tokens
│   └── main.tsx                       # Application entry point
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    # FastAPI application entry point
│   │   ├── database.py               # Database connection and configuration
│   │   ├── models.py                 #
