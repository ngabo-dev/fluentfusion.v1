import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { adminApi, API_BASE_URL } from '../app/api/config';

interface ExtendedAnalytics {
  period_days: number;
  users: {
    total: number;
    new: number;
    active: number;
    by_role: {
      students: number;
      instructors: number;
      admins: number;
    };
  };
  courses: {
    total: number;
    published: number;
    pending: number;
  };
  enrollments: {
    total: number;
    new: number;
    completed: number;
  };
  certificates: {
    total: number;
  };
  reports: {
    open: number;
    resolved: number;
  };
  charts: {
    daily_registrations: { date: string; count: number }[];
    daily_enrollments: { date: string; count: number }[];
  };
}

export default function Component27AdminAnalytics() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [analytics, setAnalytics] = useState<ExtendedAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const token = localStorage.getItem('ff_access_token');
    const userData = localStorage.getItem('ff_user');
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      if (parsed.role !== 'admin') {
        navigate('/dashboard');
        return;
      }
      setUser(parsed);
    } catch (e) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate, period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getExtendedAnalytics(period);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = () => {
    if (user?.full_name) {
      const names = user.full_name.split(' ');
      if (names.length >= 2) return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      return names[0].substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'AD';
  };

  // Calculate chart max value for scaling
  const maxRegistrations = Math.max(...(analytics?.charts?.daily_registrations?.map(d => d.count) || [1]), 1);
  const maxEnrollments = Math.max(...(analytics?.charts?.daily_enrollments?.map(d => d.count) || [1]), 1);

  if (loading && !analytics) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#bfff00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Navigation */}
      <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-50">
        <div className="absolute border-b border-[#2a2a2a] inset-0 pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="flex items-center justify-between px-[40px] w-full">
            <Link to="/admin/analytics" className="flex gap-[11px] items-center no-underline">
              <div className="bg-[#bfff00] flex items-center justify-center w-[38px] h-[38px] rounded-[10px]">
                <span className="text-[18px]">🧠</span>
              </div>
              <span className="text-[18px] text-white font-bold">
                FLUENT<span className="text-[#bfff00]">FUSION</span>
              </span>
            </Link>
            <div className="flex items-center gap-[12px]">
              <div className="bg-[rgba(255,68,68,0.1)] px-[13px] py-[5px] rounded-[99px]">
                <span className="text-[#f44] text-[11px] font-semibold">🛡 Admin</span>
              </div>
              <div className="w-[32px] h-[32px] rounded-[16px] flex items-center justify-center"
                   style={{ background: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
                <span className="text-[13px] font-bold text-black">{getUserInitials()}</span>
              </div>
              <button 
                onClick={() => {
                  localStorage.removeItem('ff_access_token');
                  localStorage.removeItem('ff_refresh_token');
                  localStorage.removeItem('ff_user');
                  navigate('/login');
                }}
                className="text-[#888] hover:text-white text-sm bg-transparent border-none cursor-pointer ml-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-66px)]">
        {/* Sidebar */}
        <div className="fixed left-0 top-[66px] w-[240px] h-[calc(100vh-66px)] bg-[#0f0f0f] border-r border-[#2a2a2a] overflow-y-auto">
          <div className="flex flex-col py-5 px-0">
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3">Admin Panel</div>
            
            <Link to="/admin/users" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>👥</span>
              <span className="text-[14px]">Users</span>
            </Link>
            
            <Link to="/admin/courses" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📚</span>
              <span className="text-[14px]">Courses</span>
            </Link>
            
            <Link to="/admin/enrollments" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>🎓</span>
              <span className="text-[14px]">Enrollments</span>
            </Link>
            
            <Link to="/admin/analytics" className="w-full bg-[rgba(191,255,0,0.1)] border-l-2 border-[#bfff00] py-3 pl-6 pr-4 flex gap-3 items-center">
              <span className="text-[#bfff00]">📊</span>
              <span className="text-[#bfff00] text-[14px]">Analytics</span>
            </Link>
            
            <Link to="/admin/reports" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📋</span>
              <span className="text-[14px]">Reports</span>
            </Link>

            <Link to="/admin/announcements" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📢</span>
              <span className="text-[14px]">Announcements</span>
            </Link>
            
            <Link to="/admin/audit-log" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📝</span>
              <span className="text-[14px]">Audit Log</span>
            </Link>
            
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4">Account</div>
            
            <Link to="/profile" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>👤</span>
              <span className="text-[14px]">Profile</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-[240px] flex-1 p-9">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[32px] text-white font-bold">
                Platform <span className="text-[#bfff00]">Analytics</span>
              </h1>
              <p className="text-[#888] text-[14px] mt-1">
                Real-time platform performance overview
              </p>
            </div>
            <div className="flex gap-3">
              <select 
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
                className="bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
              >
                <option value={7}>Last 7 Days</option>
                <option value={30}>Last 30 Days</option>
                <option value={90}>Last 90 Days</option>
              </select>
              <button className="bg-[#1f1f1f] text-white px-4 py-3 rounded-[8px] border border-[#333]">
                Export
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-[18px] mb-8">
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-5">
              <div className="text-[#888] text-[10px] uppercase tracking-[1px]">Total Users</div>
              <div className="text-[#bfff00] text-[34px] font-bold mt-2">
                {loading ? '...' : (analytics?.users?.total || 0).toLocaleString()}
              </div>
              <div className="text-[#00ff7f] text-[12px] mt-1">
                +{analytics?.users?.new || 0} new in {period} days
              </div>
            </div>
            
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-5">
              <div className="text-[#888] text-[10px] uppercase tracking-[1px]">Active Users</div>
              <div className="text-[#bfff00] text-[34px] font-bold mt-2">
                {loading ? '...' : (analytics?.users?.active || 0).toLocaleString()}
              </div>
              <div className="text-[#888] text-[12px] mt-1">in last {period} days</div>
            </div>
            
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-5">
              <div className="text-[#888] text-[10px] uppercase tracking-[1px]">Total Courses</div>
              <div className="text-[#bfff00] text-[34px] font-bold mt-2">
                {loading ? '...' : (analytics?.courses?.total || 0)}
              </div>
              <div className="text-[#888] text-[12px] mt-1">
                {analytics?.courses?.published || 0} published, {analytics?.courses?.pending || 0} pending
              </div>
            </div>
            
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-5">
              <div className="text-[#888] text-[10px] uppercase tracking-[1px]">Enrollments</div>
              <div className="text-[#bfff00] text-[34px] font-bold mt-2">
                {loading ? '...' : (analytics?.enrollments?.total || 0).toLocaleString()}
              </div>
              <div className="text-[#888] text-[12px] mt-1">{analytics?.enrollments?.new || 0} new in {period} days</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* User Registrations Chart */}
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6">
              <h3 className="text-white text-[14px] font-bold uppercase tracking-[0.7px] mb-4">User Registrations</h3>
              <div className="h-[200px] flex items-end gap-[2px]">
                {analytics?.charts?.daily_registrations?.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-[#bfff00] rounded-t-[2px] hover:bg-[#a6e600] transition-colors"
                      style={{ height: `${(day.count / maxRegistrations) * 180}px`, minHeight: day.count > 0 ? '4px' : '0' }}
                      title={`${day.date}: ${day.count} registrations`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[#555] text-[10px]">
                <span>{analytics?.charts?.daily_registrations?.[0]?.date?.slice(5) || ''}</span>
                <span>{analytics?.charts?.daily_registrations?.[analytics?.charts?.daily_registrations?.length - 1]?.date?.slice(5) || ''}</span>
              </div>
            </div>

            {/* Enrollments Chart */}
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6">
              <h3 className="text-white text-[14px] font-bold uppercase tracking-[0.7px] mb-4">Course Enrollments</h3>
              <div className="h-[200px] flex items-end gap-[2px]">
                {analytics?.charts?.daily_enrollments?.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-[#00d4ff] rounded-t-[2px] hover:bg-[#00b8e6] transition-colors"
                      style={{ height: `${(day.count / maxEnrollments) * 180}px`, minHeight: day.count > 0 ? '4px' : '0' }}
                      title={`${day.date}: ${day.count} enrollments`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[#555] text-[10px]">
                <span>{analytics?.charts?.daily_enrollments?.[0]?.date?.slice(5) || ''}</span>
                <span>{analytics?.charts?.daily_enrollments?.[analytics?.charts?.daily_enrollments?.length - 1]?.date?.slice(5) || ''}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6">
              <h3 className="text-white text-[14px] font-bold uppercase tracking-[0.7px] mb-4">User Roles</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#888]">Students</span>
                  <span className="text-[#bfff00] font-bold">{analytics?.users?.by_role?.students || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#888]">Instructors</span>
                  <span className="text-[#00d4ff] font-bold">{analytics?.users?.by_role?.instructors || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#888]">Admins</span>
                  <span className="text-[#ff6b6b] font-bold">{analytics?.users?.by_role?.admins || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6">
              <h3 className="text-white text-[14px] font-bold uppercase tracking-[0.7px] mb-4">Course Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#888]">Published</span>
                  <span className="text-[#00ff7f] font-bold">{analytics?.courses?.published || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#888]">Pending Approval</span>
                  <span className="text-[#ffb800] font-bold">{analytics?.courses?.pending || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#888]">Completed Enrollments</span>
                  <span className="text-[#bfff00] font-bold">{analytics?.enrollments?.completed || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6">
              <h3 className="text-white text-[14px] font-bold uppercase tracking-[0.7px] mb-4">Platform Health</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#888]">Certificates Issued</span>
                  <span className="text-[#bfff00] font-bold">{analytics?.certificates?.total || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#888]">Open Reports</span>
                  <span className="text-[#ff6b6b] font-bold">{analytics?.reports?.open || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#888]">Resolved Reports</span>
                  <span className="text-[#00ff7f] font-bold">{analytics?.reports?.resolved || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
