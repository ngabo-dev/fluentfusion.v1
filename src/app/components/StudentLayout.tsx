import { useNavigate, useLocation, Link } from 'react-router';
import { useEffect, useState } from 'react';
import { authApi } from '../api/config';

interface StudentLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
}

export default function StudentLayout({ children, title, subtitle, headerAction }: StudentLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('ff_user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    authApi.logout().catch(() => {
      // Ignore logout API errors, always clear local state
    }).finally(() => {
      localStorage.removeItem('ff_access_token');
      localStorage.removeItem('ff_refresh_token');
      localStorage.removeItem('ff_user');
      navigate('/login');
    });
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navLinks = [
    { to: '/dashboard', icon: '⚡', label: 'Dashboard' },
    { to: '/courses', icon: '📚', label: 'My Courses' },
    { to: '/assignments', icon: '📝', label: 'Assignments' },
    { to: '/messages', icon: '💬', label: 'Messages' },
    { to: '/live-sessions', icon: '🎥', label: 'Live Sessions' },
    { to: '/community', icon: '🌍', label: 'Community' },
    { to: '/practice/flashcards', icon: '🎯', label: 'Practice' },
  ];

  const progressLinks = [
    { to: '/progress', icon: '📊', label: 'Progress' },
    { to: '/achievements', icon: '🏆', label: 'Achievements' },
    { to: '/leaderboard', icon: '🥇', label: 'Leaderboard' },
  ];

  const accountLinks = [
    { to: '/profile', icon: '👤', label: 'Profile' },
    { to: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className="bg-[#0a0a0a] min-h-screen flex flex-col">
      {/* Top Navigation */}
      <nav className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-50 border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between h-full px-[40px]">
          <Link to="/dashboard" className="flex gap-[11px] items-center no-underline">
            <div className="bg-[#bfff00] flex items-center justify-center w-[38px] h-[38px] rounded-[10px]">
              <span className="text-[18px]">🧠</span>
            </div>
            <span className="text-[18px] text-white font-bold">
              FLUENT<span className="text-[#bfff00]">FUSION</span>
            </span>
          </Link>

          <div className="flex items-center gap-[12px]">
            {user && (
              <div className="flex items-center gap-2">
                <div
                  className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[13px] font-bold text-black"
                  style={{ background: 'linear-gradient(135deg, #bfff00 0%, #8fef00 100%)' }}
                >
                  {getInitials(user.full_name || '')}
                </div>
                <span className="text-white text-[13px] hidden md:block">{user.full_name}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-[#888] hover:text-white text-sm bg-transparent border-none cursor-pointer ml-2 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 min-h-[calc(100vh-66px)]">
        {/* Sidebar */}
        <aside className="fixed left-0 top-[66px] w-[240px] h-[calc(100vh-66px)] bg-[#0f0f0f] border-r border-[#2a2a2a] overflow-y-auto">
          <div className="flex flex-col py-5">
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3">Learning</div>

            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`w-full py-3 pl-6 pr-4 flex gap-3 items-center transition-colors no-underline ${
                  isActive(link.to)
                    ? 'bg-[rgba(191,255,0,0.1)] border-l-2 border-[#bfff00]'
                    : 'border-l-2 border-transparent hover:bg-[rgba(255,255,255,0.03)]'
                }`}
              >
                <span className="text-[16px]">{link.icon}</span>
                <span className={`text-[14px] ${isActive(link.to) ? 'text-[#bfff00]' : 'text-[#888] hover:text-white'}`}>
                  {link.label}
                </span>
              </Link>
            ))}

            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4">Progress</div>

            {progressLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`w-full py-3 pl-6 pr-4 flex gap-3 items-center transition-colors no-underline ${
                  isActive(link.to)
                    ? 'bg-[rgba(191,255,0,0.1)] border-l-2 border-[#bfff00]'
                    : 'border-l-2 border-transparent hover:bg-[rgba(255,255,255,0.03)]'
                }`}
              >
                <span className="text-[16px]">{link.icon}</span>
                <span className={`text-[14px] ${isActive(link.to) ? 'text-[#bfff00]' : 'text-[#888] hover:text-white'}`}>
                  {link.label}
                </span>
              </Link>
            ))}

            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4">Account</div>

            {accountLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`w-full py-3 pl-6 pr-4 flex gap-3 items-center transition-colors no-underline ${
                  isActive(link.to)
                    ? 'bg-[rgba(191,255,0,0.1)] border-l-2 border-[#bfff00]'
                    : 'border-l-2 border-transparent hover:bg-[rgba(255,255,255,0.03)]'
                }`}
              >
                <span className="text-[16px]">{link.icon}</span>
                <span className={`text-[14px] ${isActive(link.to) ? 'text-[#bfff00]' : 'text-[#888] hover:text-white'}`}>
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-[240px] flex-1 p-8">
          {(title || headerAction) && (
            <div className="flex items-center justify-between mb-8">
              {title && (
                <div>
                  <h1 className="text-[28px] text-white font-bold">{title}</h1>
                  {subtitle && <p className="text-[#888] text-[14px] mt-1">{subtitle}</p>}
                </div>
              )}
              {headerAction && <div>{headerAction}</div>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
