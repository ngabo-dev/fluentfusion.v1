import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './components/AuthContext'
import { SidebarProvider, useSidebar } from './components/SidebarContext'

// Shared auth pages
import Login from './pages/student/Login'
import Signup from './pages/student/Signup'
import ForgotPassword from './pages/student/ForgotPassword'
import ResetPassword from './pages/student/ResetPassword'
import EmailVerify from './pages/student/EmailVerify'
import ConfirmEmailChange from './pages/student/ConfirmEmailChange'
import MeetingRoom from './pages/MeetingRoom'
import Pricing from './pages/student/Pricing'
import Features from './pages/student/Features'
import Community from './pages/student/Community'
import Welcome from './pages/student/Welcome'
import { OnboardNativeLang, OnboardLearnLang, OnboardGoal, OnboardLevel } from './pages/student/Onboarding'

// Student pages
import StudentNavbar from './components/StudentNavbar'
import StudentSidebar from './components/StudentSidebar'
import StudentDashboard from './pages/student/Dashboard'
import MyCourses from './pages/student/MyCourses'
import CourseCatalog from './pages/student/CourseCatalog'
import CourseDetails from './pages/student/CourseDetails'
import StudentLessons from './pages/student/Lessons'
import LessonView from './pages/student/LessonView'
import StudentLiveSessions from './pages/student/LiveSessions'
import StudentQuizzes from './pages/student/Quizzes'
import QuizPage from './pages/student/QuizPage'
import StudentMessages from './pages/student/Messages'
import Leaderboard from './pages/student/Leaderboard'
import StudentNotifications from './pages/student/Notifications'
import StudentSettings from './pages/student/Settings'
import Progress from './pages/student/Progress'
import Achievements from './pages/student/Achievements'
import StreakTracker from './pages/student/StreakTracker'
import DailyChallenge from './pages/student/DailyChallenge'
import Flashcards from './pages/student/Flashcards'
import SpeakingPractice from './pages/student/SpeakingPractice'
import StudentAnnouncements from './pages/student/Announcements'

// Admin pages
import AdminNavbar from './components/AdminNavbar'
import AdminSidebar from './components/AdminSidebar'
import AdminDashboard from './pages/admin/Dashboard'
import Analytics from './pages/admin/Analytics'
import GeoData from './pages/admin/GeoData'
import AllUsers from './pages/admin/AllUsers'
import Students from './pages/admin/Students'
import Instructors from './pages/admin/Instructors'
import Admins from './pages/admin/Admins'
import CourseApprovals from './pages/admin/CourseApprovals'
import AdminLiveSessions from './pages/admin/LiveSessions'
import Reports from './pages/admin/Reports'
import Payments from './pages/admin/Payments'
import Payouts from './pages/admin/Payouts'
import Revenue from './pages/admin/Revenue'
import PulseEngine from './pages/admin/PulseEngine'
import AdminMessages from './pages/admin/Messages'
import AdminNotifications from './pages/admin/Notifications'
import AdminAnnouncements from './pages/admin/Announcements'
import AuditLog from './pages/admin/AuditLog'
import PlatformSettings from './pages/admin/PlatformSettings'

// Instructor pages
import InstructorNavbar from './components/InstructorNavbar'
import InstructorSidebar from './components/InstructorSidebar'
import InstructorDashboard from './pages/instructor/Dashboard'
import InstructorAnalytics from './pages/instructor/Analytics'
import InstructorCourses from './pages/instructor/MyCourses'
import InstructorLessons from './pages/instructor/Lessons'
import InstructorLiveSessions from './pages/instructor/LiveSessions'
import InstructorQuizzes from './pages/instructor/Quizzes'
import StudentRoster from './pages/instructor/StudentRoster'
import PulseInsights from './pages/instructor/PulseInsights'
import InstructorMessages from './pages/instructor/Messages'
import Reviews from './pages/instructor/Reviews'
import InstructorRevenue from './pages/instructor/Revenue'
import InstructorPayouts from './pages/instructor/Payouts'
import InstructorNotifications from './pages/instructor/Notifications'
import InstructorAnnouncements from './pages/instructor/Announcements'
import InstructorSettings from './pages/instructor/Settings'
import CreateCourse from './pages/instructor/CreateCourse'
import CourseEditor from './pages/instructor/CourseEditor'

const Loading = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)', color: 'var(--neon)', fontFamily: 'JetBrains Mono', fontSize: 13 }}>
    Loading...
  </div>
)

function OnboardGuard({ children }: { children: React.ReactNode }) {
  const { token, user, ready } = useAuth()
  if (!ready) return <Loading />
  if (!token) return <Navigate to="/login" replace />
  const role = user?.role
  if (role === 'admin' || role === 'super_admin') return <Navigate to="/admin" replace />
  if (role === 'instructor') return <Navigate to="/instructor" replace />
  return <>{children}</>
}

function StudentLayout() {
  const { token, ready } = useAuth()
  if (!ready) return <Loading />
  if (!token) return <Navigate to="/login" replace />
  return (
    <SidebarProvider>
      <StudentLayoutInner />
    </SidebarProvider>
  )
}

function StudentLayoutInner() {
  const { collapsed } = useSidebar()
  return (
    <div className="app-shell">
      <StudentNavbar />
      <StudentSidebar />
      <main className="main" data-collapsed={collapsed ? 'true' : 'false'}>
        <Routes>
          <Route path="/" element={<StudentDashboard />} />
          <Route path="/courses" element={<MyCourses />} />
          <Route path="/catalog" element={<CourseCatalog />} />
          <Route path="/catalog/:id" element={<CourseDetails />} />
          <Route path="/lessons" element={<StudentLessons />} />
          <Route path="/lesson" element={<LessonView />} />
          <Route path="/live-sessions" element={<StudentLiveSessions />} />
          <Route path="/quizzes" element={<StudentQuizzes />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/messages" element={<StudentMessages />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/notifications" element={<StudentNotifications />} />
          <Route path="/settings" element={<StudentSettings />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/streak" element={<StreakTracker />} />
          <Route path="/daily-challenge" element={<DailyChallenge />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/speaking" element={<SpeakingPractice />} />
          <Route path="announcements" element={<StudentAnnouncements />} />
        </Routes>
      </main>
    </div>
  )
}

function AdminLayout() {
  const { token, user, ready } = useAuth()
  if (!ready) return <Loading />
  if (!token) return <Navigate to="/login" replace />
  const role = user?.role
  if (role !== 'admin' && role !== 'super_admin') return <Navigate to="/" replace />
  return (
    <SidebarProvider>
      <AdminLayoutInner />
    </SidebarProvider>
  )
}

function AdminLayoutInner() {
  const { collapsed } = useSidebar()
  return (
    <div className="app-shell">
      <AdminNavbar />
      <AdminSidebar />
      <main className="main" data-collapsed={collapsed ? 'true' : 'false'}>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="geo" element={<GeoData />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="students" element={<Students />} />
          <Route path="instructors" element={<Instructors />} />
          <Route path="admins" element={<Admins />} />
          <Route path="approvals" element={<CourseApprovals />} />
          <Route path="live-sessions" element={<AdminLiveSessions />} />
          <Route path="reports" element={<Reports />} />
          <Route path="payments" element={<Payments />} />
          <Route path="payouts" element={<Payouts />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="pulse" element={<PulseEngine />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="audit-log" element={<AuditLog />} />
          <Route path="settings" element={<PlatformSettings />} />
        </Routes>
      </main>
    </div>
  )
}

function InstructorLayout() {
  const { token, user, ready } = useAuth()
  if (!ready) return <Loading />
  if (!token) return <Navigate to="/login" replace />
  if (user?.role !== 'instructor') return <Navigate to="/" replace />
  return (
    <SidebarProvider>
      <InstructorLayoutInner />
    </SidebarProvider>
  )
}

function InstructorLayoutInner() {
  const { collapsed } = useSidebar()
  return (
    <div className="app-shell">
      <InstructorNavbar />
      <InstructorSidebar />
      <main className="main" data-collapsed={collapsed ? 'true' : 'false'}>
        <Routes>
          <Route path="/" element={<InstructorDashboard />} />
          <Route path="/analytics" element={<InstructorAnalytics />} />
          <Route path="/courses" element={<InstructorCourses />} />
          <Route path="/courses/new" element={<CreateCourse />} />
          <Route path="/courses/:id/edit" element={<CourseEditor />} />
          <Route path="/lessons" element={<InstructorLessons />} />
          <Route path="/live-sessions" element={<InstructorLiveSessions />} />
          <Route path="/quizzes" element={<InstructorQuizzes />} />
          <Route path="/students" element={<StudentRoster />} />
          <Route path="/pulse" element={<PulseInsights />} />
          <Route path="/messages" element={<InstructorMessages />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/revenue" element={<InstructorRevenue />} />
          <Route path="/payouts" element={<InstructorPayouts />} />
          <Route path="/notifications" element={<InstructorNotifications />} />
          <Route path="/announcements" element={<InstructorAnnouncements />} />
          <Route path="/settings" element={<InstructorSettings />} />
        </Routes>
      </main>
    </div>
  )
}

function GuestHome() {
  const { token, user } = useAuth()
  if (token) {
    const role = user?.role
    if (role === 'admin' || role === 'super_admin') return <Navigate to="/admin" replace />
    if (role === 'instructor') return <Navigate to="/instructor" replace />
    return <Navigate to="/dashboard" replace />
  }
  return <Welcome />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<GuestHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<EmailVerify />} />
          <Route path="/confirm-email-change" element={<ConfirmEmailChange />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/features" element={<Features />} />
          <Route path="/community" element={<Community />} />

          {/* Onboarding — students only */}
          <Route path="/onboard/native-language" element={<OnboardGuard><OnboardNativeLang /></OnboardGuard>} />
          <Route path="/onboard/learn-language" element={<OnboardGuard><OnboardLearnLang /></OnboardGuard>} />
          <Route path="/onboard/goal" element={<OnboardGuard><OnboardGoal /></OnboardGuard>} />
          <Route path="/onboard/level" element={<OnboardGuard><OnboardLevel /></OnboardGuard>} />

          {/* Student dashboard */}
          <Route path="/dashboard/*" element={<StudentLayout />} />

          {/* Admin dashboard */}
          <Route path="/admin/*" element={<AdminLayout />} />

          {/* Instructor dashboard */}
          <Route path="/instructor/*" element={<InstructorLayout />} />

          {/* Fallback */}
          <Route path="/meeting/:roomId" element={<MeetingRoom />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
