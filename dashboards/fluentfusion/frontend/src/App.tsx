import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import {
  AdminInstructors, AdminCourses, AdminRevenue, AdminPayouts,
  AdminPulse, AdminNotifications, AdminAuditLog, AdminSettings,
} from './pages/admin/AdminPages';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import {
  InstructorCourses, InstructorLessons, InstructorQuizzes, InstructorSessions,
  InstructorRoster, InstructorPulse, InstructorMessages, InstructorEarnings,
} from './pages/instructor/InstructorPages';

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg)' }}>
      <div style={{ width:32, height:32, border:'2px solid var(--bdr2)', borderTop:'2px solid var(--neon)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (role === 'admin' && user.role !== 'admin') return <Navigate to="/instructor" replace />;
  return <>{children}</>;
}

function AdminApp() {
  return (
    <Layout role="admin">
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="instructors" element={<AdminInstructors />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="revenue" element={<AdminRevenue />} />
        <Route path="payouts" element={<AdminPayouts />} />
        <Route path="pulse" element={<AdminPulse />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="audit" element={<AdminAuditLog />} />
        <Route path="settings" element={<AdminSettings />} />
      </Routes>
    </Layout>
  );
}

function InstructorApp() {
  return (
    <Layout role="instructor">
      <Routes>
        <Route index element={<InstructorDashboard />} />
        <Route path="courses" element={<InstructorCourses />} />
        <Route path="lessons" element={<InstructorLessons />} />
        <Route path="quizzes" element={<InstructorQuizzes />} />
        <Route path="sessions" element={<InstructorSessions />} />
        <Route path="roster" element={<InstructorRoster />} />
        <Route path="pulse" element={<InstructorPulse />} />
        <Route path="messages" element={<InstructorMessages />} />
        <Route path="earnings" element={<InstructorEarnings />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/*" element={<ProtectedRoute role="admin"><AdminApp /></ProtectedRoute>} />
          <Route path="/instructor/*" element={<ProtectedRoute><InstructorApp /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
