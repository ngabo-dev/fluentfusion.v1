# FluentFusion - AI-Powered Language Learning Platform

A modern, comprehensive language learning platform built with React, TypeScript, and Tailwind CSS. This is the frontend implementation of FluentFusion, designed to break language barriers through AI-personalized lessons, live sessions, and a global community.

## 🎨 Design System

### Colors
- **Primary Neon**: `#BFFF00`
- **Neon Alt**: `#8FEF00`
- **Background**: `#0A0A0A`
- **Card**: `#151515`
- **Border**: `#2A2A2A`
- **Muted Text**: `#888888`
- **Success**: `#00FF7F`
- **Warning**: `#FFB800`
- **Danger**: `#FF4444`
- **Info**: `#00CFFF`

### Typography
- **H1**: Syne 800 · 52px
- **H2**: Syne 800 · 32px
- **H3**: Syne 800 · 22px
- **Body**: DM Sans 400 · 15px
- **Caption**: DM Sans 400 · 12px · Muted
- **Label/Mono**: JetBrains Mono 500 · 10px

## 🚀 Features

### Current Implementation (10 Pages)
1. **Welcome Page** - Landing page with hero section
2. **Sign Up** - User registration with role selection
3. **Login** - Authentication page
4. **Forgot Password** - Password reset flow
5. **Email Verification** - OTP verification
6. **Onboarding: Native Language** - Select native language
7. **Onboarding: Learn Language** - Choose target language
8. **Onboarding: Goal** - Set learning objectives
9. **Onboarding: Level** - Select proficiency level
10. **Dashboard** - Main user interface with stats and courses

### Upcoming Features (30+ Pages)
- Course catalog and detail pages
- Practice exercises (vocabulary, grammar, speaking)
- Live session booking and interface
- Community forums and discussion threads
- Progress tracking and analytics
- Achievement and badge system
- Profile management
- Settings and preferences
- And more...

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons
- **Recharts** - Data visualization
- **Motion (Framer Motion)** - Animations

### Backend (Planned)
- **Python FastAPI** - REST API
- **PostgreSQL** - Database
- **Redis** - Caching
- **WebSockets** - Real-time features

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## 🎯 Key Features by Section

### Authentication & Onboarding
- Social login (Google, Apple)
- Email verification with OTP
- Progressive onboarding (4 steps)
- Personalized experience based on goals

### Dashboard
- XP points tracking
- Daily streak counter
- Lessons completed metrics
- Fluency score
- Course progress
- Live session reminders
- Daily challenges

### Learning Experience
- AI-personalized lessons
- Live instructor sessions
- Gamification (XP, badges, leaderboards)
- Practice exercises
- Real-time feedback

### Community
- Discussion forums
- Language exchange
- Study groups
- Global learner network

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1440px and above)
- Tablet (768px - 1439px)
- Mobile (320px - 767px)

## 🎨 Icon System

Using emoji icons for consistency:
- 🧠 Logo
- ⚡ Dashboard
- 📚 Courses
- 🎯 Practice
- 🎥 Live
- 🌍 Community
- 🏆 Achievement
- 🔥 Streak
- 📊 Analytics
- 🎙 Speaking
- 👤 Profile
- ⚙️ Settings

## 🚀 Development

### Project Structure
```
src/
├── app/
│   ├── App.tsx                 # Main app with routing
│   └── components/
│       ├── figma/             # Figma import utilities
│       └── ui/                # Reusable UI components
├── imports/                   # Imported Figma screens
│   ├── 01Welcome.tsx
│   ├── 02Signup.tsx
│   ├── 03Login.tsx
│   └── ...
├── styles/
│   ├── fonts.css             # Font imports
│   ├── theme.css             # CSS variables
│   └── tailwind.css          # Tailwind config
└── main.tsx                   # Entry point
```

### Adding New Pages
1. Create page component in `src/app/pages/`
2. Add route in `App.tsx`
3. Implement navigation in relevant components

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow the design system colors
- Use provided typography scales
- Maintain consistent spacing

## 🎓 Learning Path

1. **Onboarding** → Set up profile and preferences
2. **Dashboard** → View progress and recommendations
3. **Courses** → Browse and enroll in courses
4. **Practice** → Daily exercises and drills
5. **Live Sessions** → Join instructor-led classes
6. **Community** → Connect with other learners
7. **Achievement** → Track milestones and badges

## 🔒 Authentication Flow

```
Landing → Sign Up/Login → Email Verification → Onboarding (4 steps) → Dashboard
```

## 📊 Metrics & Gamification

- **XP Points**: Earned through lessons and activities
- **Daily Streak**: Consecutive days of learning
- **Fluency Score**: Overall proficiency (0-100%)
- **Badges**: Achievement milestones
- **Leaderboards**: Competition with peers

## 🌐 API Integration (Planned)

### Backend Endpoints
```
/api/auth/*          - Authentication
/api/users/*         - User management
/api/courses/*       - Course catalog
/api/lessons/*       - Lesson content
/api/practice/*      - Exercise data
/api/live/*          - Live sessions
/api/community/*     - Forums & discussions
/api/analytics/*     - Progress tracking
```

## 🎯 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Offline mode
- [ ] Voice recognition for speaking practice
- [ ] AI conversation partner
- [ ] Certificate generation
- [ ] Premium subscription tiers
- [ ] Instructor dashboard
- [ ] Content creation tools
- [ ] Advanced analytics
- [ ] Multi-language support for UI

## 📄 License

Proprietary - All rights reserved © 2026 FluentFusion AI

## 👥 Team

Built with ❤️ for language learners worldwide.

---

**Note**: This is the frontend implementation. Backend API and additional features are under development.
