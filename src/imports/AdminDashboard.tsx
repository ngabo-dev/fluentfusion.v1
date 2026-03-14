import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { adminApi, authApi } from "../app/api/config";
import ThemeToggle from "../app/components/ui/ThemeToggle";

// Types
interface KpiData {
  total_users: number;
  total_users_delta: number;
  platform_revenue_mtd: number;
  revenue_delta_pct: number;
  active_courses: number;
  courses_new_this_week: number;
  retention_rate: number;
  retention_delta: number;
  pending_course_reviews: number;
  pending_reports: number;
}

interface SystemHealth {
  api: string;
  db: string;
  redis_latency_ms: number;
  pulse: string;
  cdn: string;
}

interface SystemLog {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  highlights: Array<{ text: string; is_highlight: boolean }>;
}

interface RevenueDaily {
  date: string;
  gross: number;
  fees: number;
}

interface PulseDistribution {
  total_learners: number;
  thriving: number;
  coasting: number;
  struggling: number;
  burning_out: number;
  disengaged: number;
  at_risk_count: number;
}

interface LanguageData {
  language: string;
  flag_emoji: string;
  learner_count: number;
  bar_pct: number;
  color_start: string;
  color_end: string;
}

interface CountryData {
  country: string;
  flag_emoji: string;
  user_count: number;
  bar_pct: number;
}

interface HealthMetrics {
  dau: number;
  mau: number;
  avg_session_minutes: number;
  course_completion_pct: number;
  premium_conversion_pct: number;
  churn_rate_pct: number;
  api_uptime_pct: number;
  avg_api_latency_ms: number;
}

interface ModerationItem {
  id: number;
  type: 'course' | 'report' | 'payout' | 'verify';
  subject: string;
  description: string;
  created_at: string;
  action_data: any;
}

interface Alert {
  id: number;
  level: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  action_label: string;
  created_at: string;
}

interface UserItem {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  avatar_initials?: string;
  avatar_gradient?: string;
}

// Utility functions
const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const formatCurrency = (amount: number) => {
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}k`;
  return `$${amount.toFixed(0)}`;
};

const formatPercent = (val: number) => {
  const sign = val >= 0 ? '+' : '';
  return `${sign}${val.toFixed(1)}%`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online':
    case 'healthy':
    case 'running':
    case 'ok':
      return 'var(--success)';
    case 'degraded':
      return 'var(--warning)';
    default:
      return 'var(--muted)';
  }
};

const getLogLevelColor = (level: string) => {
  switch (level) {
    case 'INFO': return 'var(--info)';
    case 'WARN': return 'var(--warning)';
    case 'ERROR': return 'var(--danger)';
    default: return 'var(--muted)';
  }
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueDaily[]>([]);
  const [pulseDist, setPulseDist] = useState<PulseDistribution | null>(null);
  const [languages, setLanguages] = useState<LanguageData[]>([]);
  const [geography, setGeography] = useState<CountryData[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null);
  const [moderationQueue, setModerationQueue] = useState<ModerationItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);

  // Selected month for revenue
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Month selector handler
  const handleMonthChange = (offset: number) => {
    const date = new Date(selectedMonth);
    date.setMonth(date.getMonth() + offset);
    setSelectedMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  };

  const logIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('ff_access_token');
    const userData = localStorage.getItem('ff_user');
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      if (parsed.role !== 'admin' && parsed.role !== 'super_admin') {
        navigate('/dashboard');
        return;
      }
      setUser(parsed);
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch all dashboard data
  useEffect(() => {
    fetchDashboardData();
    // Auto-refresh system logs every 30 seconds
    logIntervalRef.current = window.setInterval(() => {
      fetchSystemLogs();
    }, 30000);
    return () => {
      if (logIntervalRef.current) clearInterval(logIntervalRef.current);
    };
  }, [selectedMonth]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
       const results = await Promise.allSettled([
         adminApi.getKpis(),
         adminApi.getActiveAlerts(),
         adminApi.getSystemHealth(),
         adminApi.getSystemLogs({ limit: 10 }),
         adminApi.getRevenueDaily(selectedMonth),
         adminApi.getPulseDistribution(),
         adminApi.getTopLanguages({ limit: 6 }),
         adminApi.getGeography({ limit: 8 }),
         adminApi.getHealthMetrics(),
         adminApi.getModerationQueue({ limit: 5 }),
         adminApi.getUsers({ limit: 10, page: 1 }),
       ]);

      if (results[0].status === 'fulfilled') setKpis(results[0].value);
      if (results[1].status === 'fulfilled') setAlerts(results[1].value.alerts || []);
      if (results[2].status === 'fulfilled') setSystemHealth(results[2].value);
      if (results[3].status === 'fulfilled') setSystemLogs(results[3].value.logs || []);
      if (results[4].status === 'fulfilled') setRevenueData(results[4].value.data || []);
      if (results[5].status === 'fulfilled') setPulseDist(results[5].value);
      if (results[6].status === 'fulfilled') setLanguages(results[6].value.languages || []);
      if (results[7].status === 'fulfilled') setGeography(results[7].value.countries || []);
      if (results[8].status === 'fulfilled') setHealthMetrics(results[8].value);
      if (results[9].status === 'fulfilled') setModerationQueue(results[9].value.items || []);
      if (results[10].status === 'fulfilled') setUsers(results[10].value.users || []);

    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load some dashboard data');
    } finally {
      setLoading(false);
    }
  };

   const fetchSystemLogs = async () => {
     try {
       const result = await adminApi.getSystemLogs({ limit: 10 });
       setSystemLogs(result.logs || []);
     } catch (err) {
       console.error('Failed to fetch logs:', err);
     }
   };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Calculate totals for sparkline
  const totalGross = revenueData.reduce((sum, d) => sum + d.gross, 0);
  const totalFees = revenueData.reduce((sum, d) => sum + d.fees, 0);
  const totalNet = totalGross - totalFees;

  if (loading && !kpis) {
    return (
      <div className="bg-[var(--bg)] min-h-screen flex items-center justify-center">
        <div className="text-[var(--neon)] text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="ff-page min-h-screen">
      {/* Top Navigation */}
      <div className="ff-nav h-[66px] shrink-0 sticky top-0 w-full z-50">
        <div className="absolute inset-0 pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="flex items-center justify-between px-[40px] w-full">
            <Link to="/admin/dashboard" className="flex gap-[11px] items-center no-underline">
              <div className="bg-[var(--neon)] flex items-center justify-center w-[38px] h-[38px] rounded-[10px]">
                <span className="text-[18px]">🧠</span>
              </div>
              <span className="text-[18px] text-white font-bold">
                FLUENT<span className="text-[var(--neon)]">FUSION</span>
              </span>
              <span className="ml-4 px-3 py-1 bg-[rgba(191,255,0,0.1)] text-[var(--neon)] text-xs rounded font-mono">Admin Console</span>
            </Link>
            <div className="flex items-center gap-[12px]">
              <span className="text-[var(--info)] text-xs px-2 py-1 bg-[rgba(0,207,255,0.1)] rounded font-mono">PRODUCTION</span>
              <span className="text-[var(--warning)] text-xs">{new Date().toLocaleString()}</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛡️</span>
                <div>
                  <div className="text-white text-sm font-medium">{user?.full_name || 'Admin'}</div>
                  <div className="text-[var(--neon)] text-xs font-mono uppercase">{user?.role === 'super_admin' ? 'SUPERADMIN' : 'ADMIN'}</div>
                </div>
              </div>
              <ThemeToggle />
              <button
                onClick={() => {
                  authApi.logout();
                  window.location.href = '/login';
                }}
                className="text-[var(--muted)] hover:text-white text-sm bg-transparent border-none cursor-pointer ml-4"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-66px)]">
        {/* Sidebar */}
        <div className="ff-sidebar fixed left-0 top-[66px] w-[280px] h-[calc(100vh-66px)] overflow-y-auto">
          <div className="flex flex-col py-5 px-0">
            
            {/* Platform Section */}
            <div className="text-[var(--muted2)] text-[9px] uppercase tracking-[1.35px] px-6 py-3 font-mono">Platform</div>
            
            <Link to="/admin/dashboard" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center bg-[var(--neon-dim)] border-l-2 border-[var(--neon)]">
              <span className="text-[var(--neon)]">▦</span>
              <span className="text-[var(--neon)] text-[14px]">Overview</span>
            </Link>
            
            <Link to="/admin/analytics" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--muted)] hover:text-white">
              <span>📈</span>
              <span className="text-[14px]">Analytics</span>
            </Link>
            
            <Link to="/admin/geographic" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--muted)] hover:text-white">
              <span>🌍</span>
              <span className="text-[14px]">Geographic Data</span>
            </Link>
            
            {/* Users Section */}
            <div className="text-[var(--muted2)] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4 font-mono">Users</div>
            
            <Link to="/admin/users" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--muted)] hover:text-white">
              <span>👥</span>
              <span className="text-[14px]">All Users</span>
              <span className="ml-auto bg-[var(--info)] text-black text-[10px] px-2 py-0.5 rounded font-mono">
                {kpis?.total_users ? formatNumber(kpis.total_users) : '0'}
              </span>
            </Link>
            
            <Link to="/admin/students" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--muted)] hover:text-white">
              <span>🎓</span>
              <span className="text-[14px]">Students</span>
            </Link>
            
            <Link to="/admin/instructors" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--muted)] hover:text-white">
              <span>👩‍🏫</span>
              <span className="text-[14px]">Instructors</span>
              <span className="ml-auto bg-[var(--warning)] text-black text-[10px] px-2 py-0.5 rounded font-mono">0</span>
            </Link>
            
            <Link to="/admin/admins" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--muted)] hover:text-white">
              <span>🔑</span>
              <span className="text-[14px]">Admins</span>
            </Link>
            
            {/* Content Section */}
            <div className="text-[var(--muted2)] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4 font-mono">Content</div>
            
            <Link to="/admin/course-approvals" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--muted)] hover:text-white">
              <span>📚</span>
              <span className="text-[14px]">Course Approvals</span>
              {(kpis?.pending_course_reviews || 0) > 0 && (
                <span className="ml-auto bg-[var(--warning)] text-black text-[10px] px-2 py-0.5 rounded font-mono">
                  {kpis?.pending_course_reviews}
                </span>
              )}
            </Link>
            
            <Link to="/admin/live-sessions" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--muted)] hover:text-white">
              <span>🎙️</span>
              <span className="text-[14px]">Live Sessions</span>
            </Link>
            
            <Link to="/admin/reports" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--muted)] hover:text-white">
              <span>🚩</span>
              <span className="text-[14px]">Reports</span>
              {(kpis?.pending_reports || 0) > 0 && (
                <span className="ml-auto bg-[var(--danger)] text-white text-[10px] px-2 py-0.5 rounded font-mono">
                  {kpis?.pending_reports}
                </span>
              )}
            </Link>
            
            {/* Finance Section */}
            <div className="text-[var(--muted2)] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4 font-mono">Finance</div>
            
            <Link to="/admin/payments" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--muted)] hover:text-white">
              <span>💳</span>
              <span className="text-[14px]">Payments</span>
            </Link>
            
            <Link to="/admin/payouts" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--muted)] hover:text-white">
              <span>💸</span>
              <span className="text-[14px]">Payouts</span>
            </Link>
            
            <Link to="/admin/revenue" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--muted)] hover:text-white">
              <span>💰</span>
              <span className="text-[14px]">Revenue Reports</span>
            </Link>
            
            {/* System Section */}
            <div className="text-[var(--muted2)] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4 font-mono">System</div>
            
            <Link to="/admin/pulse" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--muted)] hover:text-white">
              <span>🧠</span>
              <span className="text-[14px]">PULSE Engine</span>
            </Link>
            
            <Link to="/admin/notifications" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--muted)] hover:text-white">
              <span>🔔</span>
              <span className="text-[14px]">Notifications</span>
            </Link>
            
            <Link to="/admin/audit-log" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--muted)] hover:text-white">
              <span>🚨</span>
              <span className="text-[14px]">Audit Log</span>
            </Link>
            
            <Link to="/admin/settings" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--muted)] hover:text-white">
              <span>⚙️</span>
              <span className="text-[14px]">Platform Settings</span>
            </Link>

            {/* System Status */}
            <div className="mt-6 px-4">
              <div className="p-3 bg-[var(--bg2)] rounded-lg border border-[var(--border)]">
                <div className="text-[var(--muted2)] text-[9px] uppercase tracking-wider mb-2 font-mono">System Status</div>
                <div className="space-y-1.5 text-[10px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">API</span>
                    <span style={{ color: getStatusColor(systemHealth?.api || 'unknown') }}>
                      ● {systemHealth?.api?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">DB</span>
                    <span style={{ color: getStatusColor(systemHealth?.db || 'unknown') }}>
                      ● {systemHealth?.db?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">REDIS</span>
                    <span style={{ color: getStatusColor(
                      (systemHealth?.redis_latency_ms || 0) < 50 ? 'ok' : 
                      (systemHealth?.redis_latency_ms || 0) < 150 ? 'degraded' : 'error'
                    )}}>
                      ● {(systemHealth?.redis_latency_ms || 0)}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">PULSE</span>
                    <span style={{ color: getStatusColor(systemHealth?.pulse || 'unknown') }}>
                      ● {systemHealth?.pulse?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">CDN</span>
                    <span style={{ color: getStatusColor(systemHealth?.cdn || 'ok') }}>
                      {(systemHealth?.cdn || 'ok') === 'degraded' ? '⚠' : '●'} {(systemHealth?.cdn || 'ok').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-[280px] flex-1 p-6">
          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-[rgba(255,68,68,0.1)] border border-[var(--danger)] rounded-lg">
              <p className="text-[var(--danger)] text-[13px]">{error}</p>
            </div>
          )}

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-[32px] text-white font-bold font-head">
              <span className="text-[var(--info)]">// </span>ADMIN OVERVIEW
            </h1>
            <p className="text-[var(--muted)] text-[14px] mt-1">
              Here's what's happening on FluentFusion today.
            </p>
          </div>

          {/* Critical Alerts */}
          {alerts.length > 0 && (
            <div className="mb-6 space-y-2">
              {alerts.map(alert => (
                <div 
                  key={alert.id} 
                  className={`p-4 rounded-lg border flex items-center gap-3 ${
                    alert.level === 'critical' 
                      ? 'bg-[rgba(255,68,68,0.1)] border-[var(--danger)]' 
                      : alert.level === 'warning'
                      ? 'bg-[rgba(255,184,0,0.1)] border-[var(--warning)]'
                      : 'bg-[rgba(0,207,255,0.1)] border-[var(--info)]'
                  }`}
                >
                  <span className="text-[20px]">{alert.level === 'critical' ? '🚨' : alert.level === 'warning' ? '⚠️' : 'ℹ️'}</span>
                  <div className="flex-1">
                    <p className={`text-[14px] font-semibold ${
                      alert.level === 'critical' ? 'text-[var(--danger)]' : 
                      alert.level === 'warning' ? 'text-[var(--warning)]' : 'text-[var(--info)]'
                    }`}>
                      {alert.title}
                    </p>
                    <p className="text-[12px] text-[var(--muted)]">{alert.description}</p>
                  </div>
                  <button className={`px-4 py-2 rounded text-[12px] font-semibold ${
                    alert.level === 'critical' ? 'bg-[var(--danger)] text-white' : 
                    alert.level === 'warning' ? 'bg-[var(--warning)] text-black' : 'bg-[var(--info)] text-black'
                  }`}>
                    {alert.action_label}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* KPI Row */}
          <div className="grid grid-cols-5 gap-[10px] mb-6">
            {/* Total Users */}
            <div className="card p-4">
              <div className="label text-[9px]">TOTAL USERS</div>
              <div className="text-[22px] font-mono text-white mt-1">
                {loading ? '...' : formatNumber(kpis?.total_users || 0)}
              </div>
              <div className="text-[11px] text-[var(--success)] mt-1">
                ↑ {kpis?.total_users_delta || 0} this month
              </div>
            </div>

            {/* Platform Revenue */}
            <div className="card p-4">
              <div className="label text-[9px]">PLATFORM REVENUE</div>
              <div className="text-[22px] font-mono text-[var(--success)] mt-1">
                {loading ? '...' : formatCurrency(kpis?.platform_revenue_mtd || 0)}
              </div>
              <div className="text-[11px] text-[var(--success)] mt-1">
                ↑ {formatPercent(kpis?.revenue_delta_pct || 0)} vs last month
              </div>
            </div>

            {/* Active Courses */}
            <div className="card p-4">
              <div className="label text-[9px]">ACTIVE COURSES</div>
              <div className="text-[22px] font-mono text-[var(--info)] mt-1">
                {loading ? '...' : kpis?.active_courses || 0}
              </div>
              <div className="text-[11px] text-[var(--success)] mt-1">
                ↑ {kpis?.courses_new_this_week || 0} new this week
              </div>
            </div>

            {/* Retention Rate */}
            <div className="card p-4">
              <div className="label text-[9px]">RETENTION RATE</div>
              <div className="text-[22px] font-mono text-[var(--warning)] mt-1">
                {loading ? '...' : `${kpis?.retention_rate?.toFixed(1) || 0}%`}
              </div>
              <div className="text-[11px] text-[var(--success)] mt-1">
                ↑ {formatPercent(kpis?.retention_delta || 0)} vs last month
              </div>
            </div>

            {/* Pending Reviews */}
            <div className="card p-4">
              <div className="label text-[9px]">PENDING REVIEWS</div>
              <div className="text-[22px] font-mono text-[var(--danger)] mt-1">
                {loading ? '...' : (kpis?.pending_course_reviews || 0) + (kpis?.pending_reports || 0)}
              </div>
              <div className="text-[11px] text-[var(--muted)] mt-1">
                {(kpis?.pending_course_reviews || 0)} courses · {(kpis?.pending_reports || 0)} reports
              </div>
            </div>
          </div>

          {/* Row 2: Revenue + PULSE + Languages */}
          <div className="grid grid-cols-3 gap-[14px] mb-6">
           {/* Platform Revenue Sparkline */}
             <div className="card p-5 col-span-2">
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                   <h3 className="h3 text-white">Platform Revenue — {selectedMonth}</h3>
                   <div className="flex gap-2">
                     <button 
                       onClick={() => handleMonthChange(-1)}
                       className="btn-ghost text-[11px] hover:text-[var(--neon)]"
                     >
                       ‹
                     </button>
                     <button 
                       onClick={() => handleMonthChange(1)}
                       className="btn-ghost text-[11px] hover:text-[var(--neon)]"
                     >
                       ›
                     </button>
                   </div>
                 </div>
                 <button className="btn-ghost text-[11px]">Export CSV</button>
               </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="label text-[9px]">MTD GROSS</div>
                  <div className="text-[18px] font-mono text-[var(--success)]">{formatCurrency(totalGross)}</div>
                </div>
                <div>
                  <div className="label text-[9px]">PLATFORM FEES (30%)</div>
                  <div className="text-[18px] font-mono text-[var(--info)]">{formatCurrency(totalFees)}</div>
                </div>
                <div>
                  <div className="label text-[9px]">INSTRUCTOR PAYOUT</div>
                  <div className="text-[18px] font-mono text-[var(--warning)]">{formatCurrency(totalNet)}</div>
                </div>
              </div>
              {/* SVG Sparkline */}
              <div className="h-[100px] w-full">
                {revenueData.length > 0 ? (
                  <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="w-full h-full">
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--info)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="var(--info)" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="areaGrad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--success)" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="var(--success)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Gross line */}
                    <path
                      d={`M 0 ${100 - (revenueData[0].gross / Math.max(...revenueData.map(d => d.gross), 1)) * 100} ${revenueData.map((d, i) => `L ${(i / (revenueData.length - 1)) * 400} ${100 - (d.gross / Math.max(...revenueData.map(d => d.gross), 1)) * 100}`).join(' ')}`}
                      fill="none"
                      stroke="var(--info)"
                      strokeWidth="2"
                    />
                    {/* Fees line */}
                    <path
                      d={`M 0 ${100 - (revenueData[0].fees / Math.max(...revenueData.map(d => d.fees), 1)) * 100} ${revenueData.map((d, i) => `L ${(i / (revenueData.length - 1)) * 400} ${100 - (d.fees / Math.max(...revenueData.map(d => d.fees), 1)) * 100}`).join(' ')}`}
                      fill="none"
                      stroke="var(--success)"
                      strokeWidth="1.5"
                    />
                  </svg>
                ) : (
                  <div className="flex items-center justify-center h-full text-[var(--muted)]">No data</div>
                )}
              </div>
              <div className="flex gap-4 text-[10px]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-[var(--info)]"></div>
                  <span className="muted">Total Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-[var(--success)]"></div>
                  <span className="muted">Platform Fees</span>
                </div>
              </div>
            </div>

            {/* PULSE Distribution */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="h3 text-white">PULSE Engine</h3>
                <button className="btn-ghost text-[11px]">Drill down</button>
              </div>
              <p className="label text-[9px] mb-4">{pulseDist?.total_learners || 0} learners classified</p>
              <div className="space-y-2">
                {[
                  { label: 'Thriving', count: pulseDist?.thriving || 0, color: 'var(--success)', emoji: '🚀' },
                  { label: 'Coasting', count: pulseDist?.coasting || 0, color: 'var(--info)', emoji: '😐' },
                  { label: 'Struggling', count: pulseDist?.struggling || 0, color: 'var(--warning)', emoji: '😓' },
                  { label: 'Burning Out', count: pulseDist?.burning_out || 0, color: '#FF8C00', emoji: '🔥' },
                  { label: 'Disengaged', count: pulseDist?.disengaged || 0, color: 'var(--danger)', emoji: '💤' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="text-[12px] w-6">{item.emoji}</span>
                    <span className="text-[11px] text-white w-[70px]">{item.label}</span>
                    <div className="flex-1 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-700"
                        style={{ 
                          width: `${((item.count / Math.max(pulseDist?.total_learners || 1)) * 100)}%`,
                          backgroundColor: item.color 
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-mono w-8" style={{ color: item.color }}>{item.count}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-2 bg-[rgba(255,68,68,0.1)] rounded border border-[var(--danger)]">
                <span className="text-[10px] text-[var(--danger)]">AT-RISK USERS: {pulseDist?.at_risk_count || 0}</span>
              </div>
            </div>
          </div>

          {/* Top Languages */}
          <div className="card p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="h3 text-white">Top Languages</h3>
              <button className="btn-ghost text-[11px]">Full report</button>
            </div>
            <div className="grid grid-cols-6 gap-4">
              {languages.map(lang => (
                <div key={lang.language} className="text-center">
                  <div className="text-[24px] mb-1">{lang.flag_emoji}</div>
                  <div className="text-[11px] text-white truncate">{lang.language}</div>
                  <div className="h-1.5 bg-[var(--border)] rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${lang.bar_pct}%`,
                        background: `linear-gradient(90deg, ${lang.color_start}, ${lang.color_end})`
                      }}
                    />
                  </div>
                  <div className="text-[10px] font-mono text-[var(--muted)] mt-1">{formatNumber(lang.learner_count)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 3: User Management + Moderation */}
          <div className="grid grid-cols-3 gap-[14px] mb-6">
            {/* User Management Table */}
            <div className="card p-5 col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="h3 text-white">User Management</h3>
                <div className="flex gap-2">
                  <button className="btn-primary text-[11px] py-1 px-3">+ Add User</button>
                  <button className="btn-ghost text-[11px] py-1 px-3">Filter ▾</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="text-left py-2 px-3 label text-[9px]">User</th>
                      <th className="text-left py-2 px-3 label text-[9px]">Role</th>
                      <th className="text-left py-2 px-3 label text-[9px]">Status</th>
                      <th className="text-left py-2 px-3 label text-[9px]">Joined</th>
                      <th className="text-left py-2 px-3 label text-[9px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 5).map(u => (
                      <tr key={u.id} className="border-b border-[var(--border)] hover:bg-[rgba(6,182,212,0.03)]">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-bold text-black" style={{ background: 'linear-gradient(135deg, var(--neon), var(--neon2))' }}>
                              {getInitials(u.full_name)}
                            </div>
                            <div>
                              <div className="text-white text-[12px]">{u.full_name}</div>
                              <div className="text-[10px] text-[var(--muted)]">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`badge ${
                            u.role === 'admin' || u.role === 'super_admin' ? 'badge-info' :
                            u.role === 'instructor' ? 'bg-[rgba(139,92,246,0.2)] text-[#8b5cf6]' : 'bg-[rgba(100,116,139,0.2)] text-[#64748b]'
                          }`}>
                            {u.role?.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-[var(--success)]' : 'bg-[var(--danger)]'}`}></div>
                            <span className="text-[11px] text-[var(--muted)]">{u.is_active ? 'Active' : 'Banned'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-[10px] font-mono text-[var(--muted)]">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex gap-1">
                            <button className="btn-ghost text-[10px] px-1">👁️</button>
                            <button className="btn-ghost text-[10px] px-1">✏️</button>
                            {u.is_active ? (
                              <button className="btn-ghost text-[10px] px-1 text-[var(--danger)]">🚫</button>
                            ) : (
                              <button className="btn-ghost text-[10px] px-1 text-[var(--success)]">✅</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Moderation Queue */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="h3 text-white">Moderation Queue</h3>
                <button className="btn-ghost text-[11px]">View all ({moderationQueue.length})</button>
              </div>
              <div className="space-y-3">
                {moderationQueue.length === 0 ? (
                  <div className="text-[var(--muted)] text-[12px] text-center py-4">No pending items</div>
                ) : (
                  moderationQueue.map(item => (
                    <div key={item.id} className="p-3 bg-[var(--bg2)] rounded-lg border border-[var(--border)]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`badge text-[9px] ${
                          item.type === 'course' ? 'badge-info' :
                          item.type === 'report' ? 'badge-danger' :
                          item.type === 'payout' ? 'badge-warning' : 'badge-success'
                        }`}>
                          {item.type?.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-[var(--muted)]">{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-white text-[12px] font-medium mb-1">{item.subject}</p>
                      <p className="text-[10px] text-[var(--muted)] mb-2 line-clamp-2">{item.description}</p>
                      <div className="flex gap-2">
                        <button className="btn-primary text-[10px] py-1 px-2 flex-1">APPROVE</button>
                        <button className="btn-danger text-[10px] py-1 px-2 flex-1">REJECT</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Row 4: Geo Distribution + Platform Health + System Log */}
          <div className="grid grid-cols-3 gap-[14px]">
            {/* Geographic Distribution */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="h3 text-white">Geographic Distribution</h3>
                <button className="btn-ghost text-[11px]">Full map</button>
              </div>
              <div className="space-y-2">
                {geography.map(country => (
                  <div key={country.country} className="flex items-center gap-2">
                    <span className="text-[14px] w-5">{country.flag_emoji}</span>
                    <span className="text-[11px] text-white flex-1">{country.country}</span>
                    <div className="w-20 h-1 bg-[rgba(6,182,212,0.3)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--info)]" style={{ width: `${country.bar_pct}%` }} />
                    </div>
                    <span className="text-[10px] font-mono text-[var(--muted)] w-8">{formatNumber(country.user_count)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Health Metrics */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="h3 text-white">Platform Health</h3>
                <button className="btn-ghost text-[11px]">Refresh</button>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'DAU', value: healthMetrics?.dau || 0 },
                  { label: 'MAU', value: healthMetrics?.mau || 0 },
                  { label: 'Avg Session', value: `${healthMetrics?.avg_session_minutes || 0}m` },
                  { label: 'Course Completion', value: `${healthMetrics?.course_completion_pct?.toFixed(1) || 0}%`, color: 'var(--success)' },
                  { label: 'Premium Conv', value: `${healthMetrics?.premium_conversion_pct?.toFixed(1) || 0}%`, color: 'var(--info)' },
                  { label: 'Churn Rate', value: `${healthMetrics?.churn_rate_pct?.toFixed(1) || 0}%`, color: healthMetrics && healthMetrics.churn_rate_pct > 5 ? 'var(--danger)' : 'var(--muted)' },
                  { label: 'API Uptime', value: `${healthMetrics?.api_uptime_pct?.toFixed(2) || 0}%`, color: 'var(--success)' },
                  { label: 'Avg Latency', value: `${healthMetrics?.avg_api_latency_ms || 0}ms`, color: (healthMetrics?.avg_api_latency_ms || 0) > 200 ? 'var(--warning)' : 'var(--muted)' },
                ].map(metric => (
                  <div key={metric.label} className="flex items-center justify-between">
                    <span className="text-[10px] text-[var(--muted2)]">{metric.label}</span>
                    <span className="text-[11px] font-mono" style={{ color: metric.color || 'white' }}>
                      {typeof metric.value === 'number' ? formatNumber(metric.value) : metric.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* System Log */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="h3 text-white">System Log</h3>
                <button className="btn-ghost text-[11px]">Full log</button>
              </div>
              <div className="space-y-1 max-h-[200px] overflow-y-auto">
                {systemLogs.map((log, idx) => (
                  <div key={idx} className="flex gap-2 text-[10px] py-1">
                    <span className="text-[var(--muted2)] font-mono whitespace-nowrap">
                      {log.timestamp.split('T')[1]?.split('.')[0] || log.timestamp}
                    </span>
                    <span 
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono w-[42px] text-center ${
                        log.level === 'ERROR' ? 'bg-[var(--danger)] text-white animate-pulse' :
                        log.level === 'WARN' ? 'bg-[var(--warning)] text-black' : 'bg-[var(--info)] text-black'
                      }`}
                    >
                      {log.level}
                    </span>
                    <span className="text-[var(--muted2)] flex-1 truncate">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
