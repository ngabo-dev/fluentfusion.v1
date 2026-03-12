import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router';
import { useEffect, useState, useCallback, useRef, Component, ReactNode } from 'react';
import { Toaster } from 'sonner';
import Welcome from '../imports/01Welcome';
import Signup from '../imports/02Signup';
import Login from '../imports/03Login';
import ForgotPassword from '../imports/04ForgotPassword';
import EmailVerify from '../imports/05EmailVerify';
import OnboardNativeLang from '../imports/06OnboardNativeLang';
import OnboardLearnLang from '../imports/07OnboardLearnLang';
import OnboardGoal from '../imports/08OnboardGoal';
import OnboardLevel from '../imports/09OnboardLevel';
import Dashboard from '../imports/10Dashboard';
import Component11CourseCatalog from '../imports/11CourseCatalog';
import Component12CourseDetails from '../imports/12CourseDetails';
import Component13LessonView from '../imports/13LessonView';
import Component14Quiz from '../imports/14Quiz';
import Component15Progress from '../imports/15Progress';
import Component16Flashcards from '../imports/16Flashcards';
import Component17SpeakingPractice from '../imports/17SpeakingPractice';
import Component18ListeningPractice from '../imports/18ListeningPractice';
import Component19VocabularyBank from '../imports/19VocabularyBank';
import Component20LiveSessionsList from '../imports/20LiveSessionsList';
import Component21LiveClass from '../imports/21LiveClass';
import Component22CommunityFeed from '../imports/22CommunityFeed';
import Component23InstructorDashboard from '../imports/23InstructorDashboard';
import Component24CreateCourse from '../imports/24CreateCourse';
import Component25ManageStudents from '../imports/25ManageStudents';
import Component26AdminUsers from '../imports/26AdminUsers';
import Component27AdminAnalytics from '../imports/27AdminAnalytics';
import Component28Profile from '../imports/28Profile';
import Component29Settings from '../imports/29Settings';
import Component30Achievements from '../imports/30Achievements';
import Component31Leaderboard from '../imports/31Leaderboard';
import Component32DailyChallenge from '../imports/32DailyChallenge';
import Component33StreakTracker from '../imports/33StreakTracker';
import Component34Pricing from '../imports/34Pricing';
import Component35Checkout from '../imports/35Checkout';
import Component36NotFound from '../imports/36404';
import Component37NoInternet from '../imports/37NoInternet';
import Component38EmptyStates from '../imports/38EmptyStates';
import Component39LoadingPopups from '../imports/39LoadingPopups';
import { AdminRoute, InstructorRoute, StudentRoute, GuestRoute, SuperAdminRoute } from './components/RoleGuards';
import AdminCourses from '../imports/AdminCourses';
import AdminEnrollments from '../imports/AdminEnrollments';
import AdminReports from '../imports/AdminReports';
import AdminAnnouncements from '../imports/AdminAnnouncements';
import AdminPulse from '../imports/AdminPulse';
import AdminAuditLog from '../imports/AdminAuditLog';
import AdminDashboard from '../imports/AdminDashboard';
import AdminRevenue from '../imports/AdminRevenue';
import AdminCourseApprovals from '../imports/AdminCourseApprovals';
import AdminInstructorApplications from '../imports/AdminInstructorApplications';
import InstructorCertificates from '../imports/InstructorCertificates';
import InstructorAnnouncements from '../imports/InstructorAnnouncements';
import InstructorMessages from '../imports/InstructorMessages';
import InstructorCurriculumEditor from '../imports/InstructorCurriculumEditor';
import InstructorQuizBuilder from '../imports/InstructorQuizBuilder';
import InstructorAssignmentBuilder from '../imports/InstructorAssignmentBuilder';
import StudentAssignments from '../imports/StudentAssignments';
import StudentMessages from '../imports/StudentMessages';
import InstructorMyCourses from '../imports/InstructorMyCourses';
import InstructorLiveSessions from '../imports/InstructorLiveSessions';
import InstructorProfile from '../imports/InstructorProfile';
import InstructorSettings from '../imports/InstructorSettings';

// Session configuration - 30 minutes inactive timeout (matches backend ACCESS_TOKEN_EXPIRE_MINUTES)
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const SESSION_WARNING_MS = 5 * 60 * 1000; // Show warning 5 minutes before

// Error Boundary to catch rendering errors
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error?: Error }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-white text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-[#888] mb-4">Please refresh the page or try again later.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-[#bfff00] text-black px-6 py-2 rounded-lg font-semibold"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Session timeout hook
function useSessionTimeout(onTimeout: () => void, onWarning: (show: boolean) => void) {
  const timeoutRef = useRef<number | null>(null);
  const warningRef = useRef<number | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    
    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    
    // Set warning timer
    warningRef.current = window.setTimeout(() => {
      onWarning(true);
    }, SESSION_TIMEOUT_MS - SESSION_WARNING_MS);
    
    // Set timeout timer
    timeoutRef.current = window.setTimeout(() => {
      onWarning(false);
      onTimeout();
    }, SESSION_TIMEOUT_MS);
  }, [onTimeout, onWarning]);

  useEffect(() => {
    // Track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      const now = Date.now();
      // Only reset if user was inactive for more than 30 seconds
      if (now - lastActivityRef.current > 30000) {
        resetTimer();
      }
    };

    events.forEach(event => window.addEventListener(event, handleActivity));
    
    // Initial timer
    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, [resetTimer]);
}

// Protected route wrapper - redirects to login if not authenticated
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('ff_access_token');
      const user = localStorage.getItem('ff_user');
      
      if (!token || !user) {
        setIsAuthenticated(false);
        setIsValidating(false);
        return;
      }
      
      try {
        // Validate by parsing user and checking token exists
        const userData = JSON.parse(user);
        if (userData && token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        localStorage.removeItem('ff_access_token');
        localStorage.removeItem('ff_refresh_token');
        localStorage.removeItem('ff_user');
        setIsAuthenticated(false);
      }
      
      setIsValidating(false);
    };
    
    validateToken();
  }, []);
  
  if (isValidating) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="text-[#bfff00]">Loading...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Role-based protected route
function RoleBasedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles: string[] 
}) {
  const token = localStorage.getItem('ff_access_token');
  const user = localStorage.getItem('ff_user');
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!token || !user) {
      navigate('/login', { replace: true });
      return;
    }
    
    try {
      const userData = JSON.parse(user);
      if (!allowedRoles.includes(userData.role)) {
        // Redirect based on user's actual role
        if (userData.role === 'super_admin' || userData.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else if (userData.role === 'instructor') {
          navigate('/instructor/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch {
      navigate('/login', { replace: true });
    }
  }, [token, user, navigate, allowedRoles]);
  
  if (!token || !user) {
    return null;
  }
  
  try {
    const userData = JSON.parse(user);
    if (!allowedRoles.includes(userData.role)) {
      return null; // Still redirecting
    }
  } catch {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Home page wrapper - redirects to dashboard if already logged in
function HomePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('ff_access_token');
      const user = localStorage.getItem('ff_user');
      
      if (token && user) {
        try {
          // Validate token by checking if user data is valid
          const userData = JSON.parse(user);
          
          if (userData.role === 'super_admin' || userData.role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
          } else if (userData.role === 'instructor') {
            navigate('/instructor/dashboard', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        } catch {
          // Invalid user data - clear and stay on welcome
          localStorage.removeItem('ff_access_token');
          localStorage.removeItem('ff_refresh_token');
          localStorage.removeItem('ff_user');
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, [navigate]);
  
  if (isLoading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="text-[#bfff00]">Loading...</div>
      </div>
    );
  }
  
  return <Welcome />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

// Separate component that has access to Router context
function AppRoutes() {
  const navigate = useNavigate();
  const [showSessionWarning, setShowSessionWarning] = useState(false);

  const handleSessionTimeout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem('ff_access_token');
    localStorage.removeItem('ff_refresh_token');
    localStorage.removeItem('ff_user');
    // Redirect to login
    navigate('/login', { replace: true });
  }, [navigate]);

  // Use session timeout hook
  useSessionTimeout(handleSessionTimeout, setShowSessionWarning);

  return (
    <>
      {showSessionWarning && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80">
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6 max-w-md text-center">
            <div className="text-4xl mb-4">⏰</div>
            <h2 className="text-white text-xl font-bold mb-2">Session Expiring</h2>
            <p className="text-[#888] mb-4">
              Your session will expire in 5 minutes due to inactivity. Move your mouse or press any key to stay logged in.
            </p>
            <button
              onClick={() => setShowSessionWarning(false)}
              className="bg-[#bfff00] text-black px-6 py-2 rounded-lg font-semibold"
            >
              Stay Logged In
            </button>
          </div>
        </div>
      )}
      <Routes>
        {/* Auth & Onboarding */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<EmailVerify />} />
        <Route path="/onboard/native-language" element={<OnboardNativeLang />} />
        <Route path="/onboard/learn-language" element={<OnboardLearnLang />} />
        <Route path="/onboard/goal" element={<OnboardGoal />} />
        <Route path="/onboard/level" element={<OnboardLevel />} />
        
        {/* Core Platform - Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute><Component11CourseCatalog /></ProtectedRoute>} />
        <Route path="/course/:id" element={<ProtectedRoute><Component12CourseDetails /></ProtectedRoute>} />
        <Route path="/lesson/:id" element={<ProtectedRoute><Component13LessonView /></ProtectedRoute>} />
        <Route path="/quiz/:id" element={<ProtectedRoute><Component14Quiz /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><Component15Progress /></ProtectedRoute>} />
        <Route path="/assignments" element={<ProtectedRoute><StudentAssignments /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><StudentMessages /></ProtectedRoute>} />
        
        {/* Practice */}
        <Route path="/practice/flashcards" element={<ProtectedRoute><Component16Flashcards /></ProtectedRoute>} />
        <Route path="/practice/speaking" element={<ProtectedRoute><Component17SpeakingPractice /></ProtectedRoute>} />
        <Route path="/practice/listening" element={<ProtectedRoute><Component18ListeningPractice /></ProtectedRoute>} />
        <Route path="/vocabulary" element={<ProtectedRoute><Component19VocabularyBank /></ProtectedRoute>} />
        
        {/* Live Sessions */}
        <Route path="/live-sessions" element={<ProtectedRoute><Component20LiveSessionsList /></ProtectedRoute>} />
        <Route path="/live-session/:id" element={<ProtectedRoute><Component21LiveClass /></ProtectedRoute>} />
        
        {/* Community - Public for viewing, protected for posting */}
        <Route path="/community" element={<Component22CommunityFeed />} />
        
        {/* Instructor Routes */}
        <Route path="/instructor/dashboard" element={<InstructorRoute><Component23InstructorDashboard /></InstructorRoute>} />
        <Route path="/instructor/my-courses" element={<InstructorRoute><InstructorMyCourses /></InstructorRoute>} />
        <Route path="/instructor/create-course" element={<InstructorRoute><Component24CreateCourse /></InstructorRoute>} />
        <Route path="/instructor/curriculum/:courseId" element={<InstructorRoute><InstructorCurriculumEditor /></InstructorRoute>} />
        <Route path="/instructor/quiz/:quizId" element={<InstructorRoute><InstructorQuizBuilder /></InstructorRoute>} />
        <Route path="/instructor/quiz/new/:courseId" element={<InstructorRoute><InstructorQuizBuilder /></InstructorRoute>} />
        <Route path="/instructor/assignments" element={<InstructorRoute><InstructorAssignmentBuilder /></InstructorRoute>} />
        <Route path="/instructor/assignment-builder" element={<InstructorRoute><InstructorAssignmentBuilder /></InstructorRoute>} />
        <Route path="/instructor/students" element={<InstructorRoute><Component25ManageStudents /></InstructorRoute>} />
        <Route path="/instructor/certificates" element={<InstructorRoute><InstructorCertificates /></InstructorRoute>} />
        <Route path="/instructor/announcements" element={<InstructorRoute><InstructorAnnouncements /></InstructorRoute>} />
        <Route path="/instructor/messages" element={<InstructorRoute><InstructorMessages /></InstructorRoute>} />
        <Route path="/instructor/live-sessions" element={<InstructorRoute><InstructorLiveSessions /></InstructorRoute>} />
        <Route path="/instructor/profile" element={<InstructorRoute><InstructorProfile /></InstructorRoute>} />
        <Route path="/instructor/settings" element={<InstructorRoute><InstructorSettings /></InstructorRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/course-approvals" element={<AdminRoute><AdminCourseApprovals /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><Component26AdminUsers /></AdminRoute>} />
        <Route path="/admin/analytics" element={<AdminRoute><Component27AdminAnalytics /></AdminRoute>} />
        <Route path="/admin/courses" element={<AdminRoute><AdminCourses /></AdminRoute>} />
        <Route path="/admin/enrollments" element={<AdminRoute><AdminEnrollments /></AdminRoute>} />
        <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
        <Route path="/admin/announcements" element={<AdminRoute><AdminAnnouncements /></AdminRoute>} />
        <Route path="/admin/pulse" element={<AdminRoute><AdminPulse /></AdminRoute>} />
        <Route path="/admin/audit-log" element={<AdminRoute><AdminAuditLog /></AdminRoute>} />
        <Route path="/admin/revenue" element={<AdminRoute><AdminRevenue /></AdminRoute>} />
        <Route path="/admin/instructor-applications" element={<AdminRoute><AdminInstructorApplications /></AdminRoute>} />
        
        {/* Super Admin Routes */}
        <Route path="/superadmin/dashboard" element={<SuperAdminRoute><AdminDashboard /></SuperAdminRoute>} />
        <Route path="/superadmin/users" element={<SuperAdminRoute><Component26AdminUsers /></SuperAdminRoute>} />
        <Route path="/superadmin/analytics" element={<SuperAdminRoute><Component27AdminAnalytics /></SuperAdminRoute>} />
        <Route path="/superadmin/courses" element={<SuperAdminRoute><AdminCourses /></SuperAdminRoute>} />
        <Route path="/superadmin/enrollments" element={<SuperAdminRoute><AdminEnrollments /></SuperAdminRoute>} />
        <Route path="/superadmin/reports" element={<SuperAdminRoute><AdminReports /></SuperAdminRoute>} />
        <Route path="/superadmin/announcements" element={<SuperAdminRoute><AdminAnnouncements /></SuperAdminRoute>} />
        <Route path="/superadmin/pulse" element={<SuperAdminRoute><AdminPulse /></SuperAdminRoute>} />
        <Route path="/superadmin/audit-log" element={<SuperAdminRoute><AdminAuditLog /></SuperAdminRoute>} />
        <Route path="/superadmin/revenue" element={<SuperAdminRoute><AdminRevenue /></SuperAdminRoute>} />
        <Route path="/superadmin/instructor-applications" element={<SuperAdminRoute><AdminInstructorApplications /></SuperAdminRoute>} />
        
        {/* User Profile & Settings */}
        <Route path="/profile" element={<ProtectedRoute><Component28Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Component29Settings /></ProtectedRoute>} />
        
        {/* Gamification */}
        <Route path="/achievements" element={<ProtectedRoute><Component30Achievements /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Component31Leaderboard /></ProtectedRoute>} />
        <Route path="/daily-challenge" element={<ProtectedRoute><Component32DailyChallenge /></ProtectedRoute>} />
        <Route path="/streak" element={<ProtectedRoute><Component33StreakTracker /></ProtectedRoute>} />
        
        {/* Public Marketing Pages */}
        <Route path="/features" element={<Welcome />} />
        <Route path="/pricing" element={<Component34Pricing />} />
        <Route path="/checkout" element={<ProtectedRoute><Component35Checkout /></ProtectedRoute>} />
        
        {/* 404 & System */}
        <Route path="/404" element={<Component36NotFound />} />
        <Route path="/no-internet" element={<Component37NoInternet />} />
        <Route path="/empty-states" element={<Component38EmptyStates />} />
        <Route path="/loading-popups" element={<Component39LoadingPopups />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </>
  );
}