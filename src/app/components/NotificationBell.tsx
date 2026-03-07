import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

interface Notification {
  id: number;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
  action_url?: string;
}

interface NotificationBellProps {
  userRole: string;
}

export default function NotificationBell({ userRole }: NotificationBellProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call when backend endpoint is ready
      // const res = await fetch(`${API_BASE_URL}/notifications`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // Mock data for now
      const mockNotifications: Notification[] = [
        {
          id: 1,
          type: "message",
          title: "New Message",
          body: "You have a new message from your instructor",
          is_read: false,
          created_at: new Date().toISOString(),
          action_url: "/messages"
        },
        {
          id: 2,
          type: "achievement",
          title: "Badge Earned!",
          body: "You've earned the 'First Step' badge",
          is_read: false,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          action_url: "/achievements"
        },
        {
          id: 3,
          type: "session",
          title: "Live Session Reminder",
          body: "Your live session starts in 15 minutes",
          is_read: true,
          created_at: new Date(Date.now() - 7200000).toISOString(),
          action_url: "/live-sessions"
        }
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      //   method: 'POST',
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`${API_BASE_URL}/notifications/read-all`, {
      //   method: 'POST',
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    if (notification.action_url) {
      navigate(notification.action_url);
    }
    setShowDropdown(false);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = diff / (1000 * 60);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${Math.floor(minutes)}m ago`;
    const hours = minutes / 60;
    if (hours < 24) return `${Math.floor(hours)}h ago`;
    const days = hours / 24;
    if (days < 7) return `${Math.floor(days)}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message': return '💬';
      case 'achievement': return '🏆';
      case 'session': return '🎥';
      case 'certificate': return '🎓';
      case 'assignment': return '📝';
      case 'announcement': return '📢';
      default: return '🔔';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-[#888] hover:text-white transition-colors"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-[#151515] border border-[#2a2a2a] rounded-[14px] shadow-xl z-[100]">
          <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
            <h3 className="text-white font-bold">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-[#bfff00] text-sm hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-[#888]">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-[#888]">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-[#2a2a2a] cursor-pointer hover:bg-[#1a1a1a] transition-colors ${
                    !notification.is_read ? 'bg-[rgba(191,255,0,0.05)]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium text-sm">{notification.title}</h4>
                        {!notification.is_read && (
                          <span className="w-2 h-2 bg-[#bfff00] rounded-full"></span>
                        )}
                      </div>
                      <p className="text-[#888] text-sm truncate">{notification.body}</p>
                      <p className="text-[#555] text-xs mt-1">{formatTime(notification.created_at)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-3 border-t border-[#2a2a2a]">
            <button 
              onClick={() => {
                setShowDropdown(false);
                navigate('/notifications');
              }}
              className="w-full text-center text-[#bfff00] text-sm hover:underline"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
