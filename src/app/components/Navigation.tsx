import { Button } from './ui/button';
import { Home, BookOpen, TrendingUp, User, MessageCircle, LogOut } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigateToDashboard: () => void;
  onNavigateToLessons: () => void;
  onNavigateToProgress: () => void;
  onNavigateToProfile: () => void;
  onNavigateToChatbot: () => void;
  onLogout: () => void;
}

export function Navigation({
  currentPage,
  onNavigateToDashboard,
  onNavigateToLessons,
  onNavigateToProgress,
  onNavigateToProfile,
  onNavigateToChatbot,
  onLogout,
}: NavigationProps) {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-blue-900">FluentFusion</span>
          </div>

          <div className="flex gap-2">
            <Button
              variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
              onClick={onNavigateToDashboard}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>

            <Button
              variant={currentPage === 'lessons' ? 'default' : 'ghost'}
              onClick={onNavigateToLessons}
              className="flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Lessons</span>
            </Button>

            <Button
              variant={currentPage === 'progress' ? 'default' : 'ghost'}
              onClick={onNavigateToProgress}
              className="flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Progress</span>
            </Button>

            <Button
              variant={currentPage === 'chatbot' ? 'default' : 'ghost'}
              onClick={onNavigateToChatbot}
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Chat</span>
            </Button>

            <Button
              variant={currentPage === 'profile' ? 'default' : 'ghost'}
              onClick={onNavigateToProfile}
              className="flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </Button>

            <Button
              variant="ghost"
              onClick={onLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
