import { useNavigate, useLocation, Link } from 'react-router';
import { useEffect, useState, useRef } from 'react';
import { authApi, API_BASE_URL } from '../api/config';
import ThemeToggle from './ui/ThemeToggle';

interface Notification {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  type: string;
}

function getRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

interface InstructorLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
}

export default function InstructorLayout({ children, title, subtitle, headerAction }: InstructorLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('ff_access_token');
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/notifications`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications((data.notifications || []).slice(0, 10));
        setUnreadCount(data.unread_count ?? 0);
      }
    } catch {
      // silently fail
    }
  };

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('ff_access_token');
      if (!token) return;
      await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {
      // silently fail
    }
  };

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

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    authApi.logout();
    window.location.href = '/login';
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navLinks = [
    { to: '/instructor/dashboard', icon: '📊', label: 'Overview' },
    { to: '/instructor/my-courses', icon: '📚', label: 'My Courses' },
    { to: '/instructor/create-course', icon: '➕', label: 'Create Course' },
    { to: '/instructor/students', icon: '👥', label: 'Students' },
    { to: '/instructor/announcements', icon: '📣', label: 'Announcements' },
    { to: '/instructor/assignments', icon: '📝', label: 'Assignments' },
    { to: '/instructor/messages', icon: '💬', label: 'Messages' },
    { to: '/instructor/certificates', icon: '🏆', label: 'Certificates' },
  ];

  const accountLinks = [
    { to: '/instructor/live-sessions', icon: '🎥', label: 'Live Sessions' },
    { to: '/instructor/profile', icon: '👤', label: 'Profile' },
    { to: '/instructor/settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className="ff-page min-h-screen flex flex-col">
      {/* Top Navigation */}
      <nav className="ff-nav h-[66px] shrink-0 sticky top-0 w-full z-50">
        <div className="flex items-center justify-between h-full px-[40px]">
          <Link to="/instructor/dashboard" className="flex gap-[11px] items-center no-underline">
            <div className="bg-[#bfff00] flex items-center justify-center w-[38px] h-[38px] rounded-[10px]">
              <span className="text-[18px]">🧠</span>
            </div>
            <span className="text-[18px] text-white font-bold">
              FLUENT<span className="text-[#bfff00]">FUSION</span>
            </span>
          </Link>

          <div className="flex items-center gap-[12px]">
            <div className="bg-[rgba(191,255,0,0.1)] px-[13px] py-[5px] rounded-[99px]">
              <span className="text-[#bfff00] text-[11px] font-semibold">📋 Instructor</span>
            </div>
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
            {/* Notifications Bell */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setShowNotifications(prev => !prev)}
                className="relative w-9 h-9 flex items-center justify-center rounded-full bg-[#1a1a1a] hover:bg-[#222] text-white cursor-pointer border-none"
              >
                🔔
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center text-white">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-[48px] w-[360px] max-h-[420px] overflow-y-auto bg-[#151515] border border-[#2a2a2a] rounded-xl shadow-2xl z-[100]">
                  <div className="flex justify-between items-center px-4 py-3 border-b border-[#1a1a1a]">
                    <span className="text-white text-sm font-semibold">Notifications</span>
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="text-[#bfff00] text-xs hover:underline bg-transparent border-none cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-[#555] text-sm">No notifications</div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        className="flex gap-3 px-4 py-3 hover:bg-[#1a1a1a] border-b border-[#1a1a1a] last:border-0"
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notif.is_read ? 'bg-[#333]' : 'bg-[#bfff00]'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm leading-snug">{notif.message}</p>
                          <p className="text-[#555] text-xs mt-1">{getRelativeTime(notif.created_at)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <ThemeToggle />
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
        <aside className="ff-sidebar fixed left-0 top-[66px] w-[240px] h-[calc(100vh-66px)] overflow-y-auto">
          <div className="flex flex-col py-5">
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3">Instructor</div>

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
