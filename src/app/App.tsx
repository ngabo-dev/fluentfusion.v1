import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { Dashboard } from './components/Dashboard';
import { LessonBrowser } from './components/LessonBrowser';
import { LessonViewer } from './components/LessonViewer';
import { ProgressTracker } from './components/ProgressTracker';
import { ProfilePage } from './components/ProfilePage';
import { ChatbotInterface } from './components/ChatbotInterface';
import { User, UserProgress } from './types';
import { api, useApiLoading } from './services/api';

type Page = 'landing' | 'login' | 'register' | 'dashboard' | 'lessons' | 'lesson-viewer' | 'progress' | 'profile' | 'chatbot';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const isLoading = useApiLoading();

  // Load user from token on mount
  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          api.setToken(token);
          const userData = await api.getCurrentUser();
          const user: User = {
            userId: userData.user_id,
            username: userData.username,
            email: userData.email,
            userType: userData.user_type,
            targetLanguage: userData.target_language,
            nativeLanguage: userData.native_language,
            joinedDate: userData.created_at,
          };
          setCurrentUser(user);
          setCurrentPage('dashboard');
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('authToken');
          api.logout();
        }
      }
    };

    loadUserFromToken();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleRegister = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  const handleViewLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setCurrentPage('lesson-viewer');
  };

  const handleLessonComplete = (progress: UserProgress) => {
    // Update user progress in localStorage
    const savedProgress = localStorage.getItem('userProgress') || '[]';
    const progressArray = JSON.parse(savedProgress);
    progressArray.push(progress);
    localStorage.setItem('userProgress', JSON.stringify(progressArray));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage
            onNavigateToLogin={() => setCurrentPage('login')}
            onNavigateToRegister={() => setCurrentPage('register')}
          />
        );
      case 'login':
        return (
          <LoginPage
            onLogin={handleLogin}
            onNavigateToRegister={() => setCurrentPage('register')}
            onBack={() => setCurrentPage('landing')}
          />
        );
      case 'register':
        return (
          <RegisterPage
            onRegister={handleRegister}
            onNavigateToLogin={() => setCurrentPage('login')}
            onBack={() => setCurrentPage('landing')}
          />
        );
      case 'dashboard':
        return currentUser ? (
          <Dashboard
            user={currentUser}
            onNavigateToLessons={() => setCurrentPage('lessons')}
            onNavigateToProgress={() => setCurrentPage('progress')}
            onNavigateToProfile={() => setCurrentPage('profile')}
            onNavigateToChatbot={() => setCurrentPage('chatbot')}
            onViewLesson={handleViewLesson}
            onLogout={handleLogout}
          />
        ) : null;
      case 'lessons':
        return currentUser ? (
          <LessonBrowser
            user={currentUser}
            onViewLesson={handleViewLesson}
            onNavigateToDashboard={() => setCurrentPage('dashboard')}
            onNavigateToProgress={() => setCurrentPage('progress')}
            onNavigateToProfile={() => setCurrentPage('profile')}
            onNavigateToChatbot={() => setCurrentPage('chatbot')}
            onLogout={handleLogout}
          />
        ) : null;
      case 'lesson-viewer':
        return currentUser && selectedLessonId ? (
          <LessonViewer
            lessonId={selectedLessonId}
            user={currentUser}
            onComplete={handleLessonComplete}
            onBack={() => setCurrentPage('lessons')}
            onNavigateToDashboard={() => setCurrentPage('dashboard')}
            onNavigateToLessons={() => setCurrentPage('lessons')}
            onNavigateToProgress={() => setCurrentPage('progress')}
            onNavigateToProfile={() => setCurrentPage('profile')}
            onNavigateToChatbot={() => setCurrentPage('chatbot')}
            onLogout={handleLogout}
          />
        ) : null;
      case 'progress':
        return currentUser ? (
          <ProgressTracker
            user={currentUser}
            onNavigateToDashboard={() => setCurrentPage('dashboard')}
            onNavigateToLessons={() => setCurrentPage('lessons')}
            onNavigateToProfile={() => setCurrentPage('profile')}
            onNavigateToChatbot={() => setCurrentPage('chatbot')}
            onLogout={handleLogout}
          />
        ) : null;
      case 'profile':
        return currentUser ? (
          <ProfilePage
            user={currentUser}
            onUpdateUser={setCurrentUser}
            onNavigateToDashboard={() => setCurrentPage('dashboard')}
            onNavigateToLessons={() => setCurrentPage('lessons')}
            onNavigateToProgress={() => setCurrentPage('progress')}
            onNavigateToChatbot={() => setCurrentPage('chatbot')}
            onLogout={handleLogout}
          />
        ) : null;
      case 'chatbot':
        return currentUser ? (
          <ChatbotInterface
            user={currentUser}
            onNavigateToDashboard={() => setCurrentPage('dashboard')}
            onNavigateToLessons={() => setCurrentPage('lessons')}
            onNavigateToProgress={() => setCurrentPage('progress')}
            onNavigateToProfile={() => setCurrentPage('profile')}
            onLogout={handleLogout}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-700 font-medium">Loading...</span>
          </div>
        </div>
      )}
      {renderPage()}
    </div>
  );
}

export default App;
