import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { adminApi } from "../app/api/config";

interface DashboardStats {
  total_users: number;
  total_students: number;
  total_instructors: number;
  total_courses: number;
  total_enrollments: number;
  recent_users: any[];
  active_users_today: number;
}

interface PendingApplication {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  bio: string;
  expertise: string[];
  submitted_at: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingApplications, setPendingApplications] = useState<PendingApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
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
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, applicationsRes] = await Promise.all([
        adminApi.getDashboard(),
        // TODO: Get pending applications when API is ready
        Promise.resolve({ applications: [] })
      ]);
      setStats(statsRes);
      setPendingApplications(applicationsRes.applications || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="text-[#bfff00] text-xl">Loading dashboard...</div>
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
            <Link to="/admin/dashboard" className="flex gap-[11px] items-center no-underline">
              <div className="bg-[#bfff00] flex items-center justify-center w-[38px] h-[38px] rounded-[10px]">
                <span className="text-[18px]">🧠</span>
              </div>
              <span className="text-[18px] text-white font-bold">
                FLUENT<span className="text-[#bfff00]">FUSION</span>
              </span>
            </Link>
            <div className="flex items-center gap-[12px]">
              <div className="bg-[rgba(255,0,0,0.1)] px-[13px] py-[5px] rounded-[99px]">
                <span className="text-[#ff4444] text-[11px] font-semibold">👑 Admin</span>
              </div>
              <button 
                onClick={() => {
                  localStorage.removeItem('access_token');
                  localStorage.removeItem('refresh_token');
                  localStorage.removeItem('user');
                  navigate('/login');
                }}
                className="text-[#888] hover:text-white text-sm bg-transparent border-none cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-66px)]">
        {/* Sidebar */}
        <div className="fixed left-0 top-[66px] w-[260px] h-[calc(100vh-66px)] bg-[#0f0f0f] border-r border-[#2a2a2a] overflow-y-auto">
          <div className="flex flex-col py-5 px-0">
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3">Main</div>
            
            <Link to="/admin/dashboard" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center bg-[rgba(191,255,0,0.1)] border-l-2 border-[#bfff00]">
              <span className="text-[#bfff00]">📊</span>
              <span className="text-[#bfff00] text-[14px]">Dashboard</span>
            </Link>
            
            <Link to="/admin/analytics" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📈</span>
              <span className="text-[14px]">Analytics</span>
            </Link>
            
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4">Management</div>
            
            <Link to="/admin/users" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>👥</span>
              <span className="text-[14px]">Users</span>
            </Link>
            
            <Link to="/admin/instructor-applications" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📝</span>
              <span className="text-[14px]">Instructor Applications</span>
              {pendingApplications.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingApplications.length}</span>
              )}
            </Link>
            
            <Link to="/admin/courses" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📚</span>
              <span className="text-[14px]">Courses</span>
            </Link>
            
            <Link to="/admin/enrollments" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>🎫</span>
              <span className="text-[14px]">Enrollments</span>
            </Link>
            
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4">Platform</div>
            
            <Link to="/admin/languages" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>🌍</span>
              <span className="text-[14px]">Languages</span>
            </Link>
            
            <Link to="/admin/content" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📋</span>
              <span className="text-[14px]">Content Moderation</span>
            </Link>
            
            <Link to="/admin/announcements" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📢</span>
              <span className="text-[14px]">Announcements</span>
            </Link>
            
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4">Billing</div>
            
            <Link to="/admin/revenue" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>💰</span>
              <span className="text-[14px]">Revenue</span>
            </Link>
            
            <Link to="/admin/payouts" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>💳</span>
              <span className="text-[14px]">Payouts</span>
            </Link>
            
            <Link to="/admin/subscriptions" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📦</span>
              <span className="text-[14px]">Subscriptions</span>
            </Link>
            
            <Link to="/admin/promos" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>🏷️</span>
              <span className="text-[14px]">Promo Codes</span>
            </Link>
            
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4">Settings</div>
            
            <Link to="/admin/settings" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>⚙️</span>
              <span className="text-[14px]">Platform Settings</span>
            </Link>
            
            <Link to="/admin/audit-log" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📜</span>
              <span className="text-[14px]">Audit Log</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-[260px] flex-1 p-9">
          <div className="mb-8">
            <h1 className="text-[32px] text-white font-bold">
              Welcome back, <span className="text-[#bfff00]">{user?.full_name || 'Admin'}</span>
            </h1>
            <p className="text-[#888] text-[14px] mt-1">
              Here's what's happening on FluentFusion today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6">
              <div className="text-[#888] text-[12px] uppercase">Total Users</div>
              <div className="text-[32px] text-white font-bold mt-2">{stats?.total_users || 0}</div>
              <div className="text-[#00ff7f] text-[12px] mt-2">↑ {stats?.active_users_today || 0} today</div>
            </div>
            
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6">
              <div className="text-[#888] text-[12px] uppercase">Students</div>
              <div className="text-[32px] text-white font-bold mt-2">{stats?.total_students || 0}</div>
              <div className="text-[#888] text-[12px] mt-2">Active learners</div>
            </div>
            
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6">
              <div className="text-[#888] text-[12px] uppercase">Instructors</div>
              <div className="text-[32px] text-white font-bold mt-2">{stats?.total_instructors || 0}</div>
              <div className="text-[#888] text-[12px] mt-2">Platform educators</div>
            </div>
            
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6">
              <div className="text-[#888] text-[12px] uppercase">Total Courses</div>
              <div className="text-[32px] text-white font-bold mt-2">{stats?.total_courses || 0}</div>
              <div className="text-[#888] text-[12px] mt-2">{stats?.total_enrollments || 0} enrollments</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Link to="/admin/users" className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-[14px] p-6 hover:border-[#bfff00] transition-colors">
              <div className="text-[24px] mb-3">👥</div>
              <div className="text-white font-bold">Manage Users</div>
              <div className="text-[#888] text-sm mt-1">View, edit, and manage all platform users</div>
            </Link>
            
            <Link to="/admin/instructor-applications" className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-[14px] p-6 hover:border-[#bfff00] transition-colors">
              <div className="text-[24px] mb-3">📝</div>
              <div className="text-white font-bold">Instructor Applications</div>
              <div className="text-[#888] text-sm mt-1">Review pending instructor applications</div>
              {pendingApplications.length > 0 && (
                <div className="mt-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full inline-block">
                  {pendingApplications.length} pending
                </div>
              )}
            </Link>
            
            <Link to="/admin/analytics" className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-[14px] p-6 hover:border-[#bfff00] transition-colors">
              <div className="text-[24px] mb-3">📈</div>
              <div className="text-white font-bold">View Analytics</div>
              <div className="text-[#888] text-sm mt-1">Platform performance and insights</div>
            </Link>
          </div>

          {/* Recent Users */}
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">Recent Users</h2>
              <Link to="/admin/users" className="text-[#bfff00] text-sm hover:underline">View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[#888] text-[12px] uppercase border-b border-[#2a2a2a]">
                    <th className="text-left py-3">Name</th>
                    <th className="text-left py-3">Email</th>
                    <th className="text-left py-3">Role</th>
                    <th className="text-left py-3">Joined</th>
                    <th className="text-left py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recent_users && stats.recent_users.length > 0 ? (
                    stats.recent_users.map((u: any) => (
                      <tr key={u.id} className="border-b border-[#2a2a2a]">
                        <td className="py-3 text-white">{u.full_name}</td>
                        <td className="py-3 text-[#888]">{u.email}</td>
                        <td className="py-3 text-[#888] capitalize">{u.role}</td>
                        <td className="py-3 text-[#888]">{u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-[4px] text-xs ${u.is_active ? 'bg-[rgba(0,255,127,0.1)] text-[#00ff7f]' : 'bg-[rgba(255,0,0,0.1)] text-red-500'}`}>
                            {u.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[#888]">No recent users</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
