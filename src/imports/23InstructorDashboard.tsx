import { useState, useEffect } from "react";
import { Link } from "react-router";
import { instructorApi, authApi } from "../app/api/config";
import InstructorLayout from "../app/components/InstructorLayout";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// Types
interface DashboardStats {
  total_students: number;
  students_delta: number;
  revenue_mtd: number;
  revenue_delta: number;
  avg_rating: number;
  rating_delta: number;
  completion_rate: number;
  completion_delta: number;
}

interface RevenueMonth {
  month: number;
  gross: number;
  net: number;
}

interface Session {
  id: number;
  title: string;
  language: string;
  start_time: string;
  enrolled_count: number;
  status: string;
  day_label: string;
}

interface Notification {
  id: number;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
}

interface CourseWithStats {
  id: number;
  title: string;
  language_flag: string;
  level: string;
  lesson_count: number;
  status: string;
  student_count: number;
  completion_rate: number;
  avg_rating: number;
  revenue_mtd: number;
}

interface PulseStudent {
  student_id: number;
  student_name: string;
  pulse_state: 'thriving' | 'coasting' | 'struggling' | 'burning_out' | 'disengaged';
}

interface LeaderboardStudent {
  rank: number;
  user_id: number;
  name: string;
  course_title: string;
  xp_total: number;
  avatar_color_start: string;
  avatar_color_end: string;
}

interface EarningsSummary {
  mtd_gross: number;
  mtd_net: number;
  pending_payout: number;
  all_time_net: number;
  platform_fee_rate: number;
  by_course: Array<{
    course_id: number;
    title: string;
    revenue: number;
    percentage: number;
  }>;
}

// Utility functions
const formatCurrency = (amount: number) => {
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}k`;
  return `$${amount.toFixed(0)}`;
};

const formatPercent = (val: number) => {
  const sign = val >= 0 ? '+' : '';
  return `${sign}${val.toFixed(1)}%`;
};

const getRelativeTime = (dateStr: string) => {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const getPulseStateColor = (state: string) => {
  switch (state) {
    case 'thriving': return 'var(--success)';
    case 'coasting': return 'var(--info)';
    case 'struggling': return 'var(--warning)';
    case 'burning_out': return '#FF8C00';
    case 'disengaged': return 'var(--danger)';
    default: return 'var(--muted)';
  }
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'enroll': return { icon: '🎓', color: 'var(--success)' };
    case 'review': return { icon: '⭐', color: 'var(--warning)' };
    case 'pulse-alert': return { icon: '🧠', color: 'var(--warning)' };
    case 'message': return { icon: '💬', color: 'var(--info)' };
    case 'approval': return { icon: '✅', color: 'var(--success)' };
    default: return { icon: '📌', color: 'var(--neon)' };
  }
};

export default function Component23InstructorDashboard() {
  // State
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueMonth[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [courses, setCourses] = useState<CourseWithStats[]>([]);
  const [pulseData, setPulseData] = useState<PulseStudent[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardStudent[]>([]);
  const [earnings, setEarnings] = useState<EarningsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [error, setError] = useState<string | null>(null);

  // Fetch all dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, [selectedYear]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled([
        instructorApi.getDashboardStats(),
        instructorApi.getRevenueMonthly(selectedYear),
        instructorApi.getSessions({ upcoming: true, limit: 5 }),
        instructorApi.getNotifications({ limit: 10 }),
        instructorApi.getCoursesWithStats(),
        instructorApi.getPulseHeatmap(),
        instructorApi.getLeaderboard(5),
        instructorApi.getEarningsSummary(),
      ]);

      if (results[0].status === 'fulfilled') setStats(results[0].value);
      if (results[1].status === 'fulfilled') setRevenueData(results[1].value.months || []);
      if (results[2].status === 'fulfilled') setSessions(results[2].value.sessions || []);
      if (results[3].status === 'fulfilled') setNotifications(results[3].value.notifications || []);
      if (results[4].status === 'fulfilled') setCourses(results[4].value.courses || []);
      if (results[5].status === 'fulfilled') setPulseData(results[5].value.students || []);
      if (results[6].status === 'fulfilled') setLeaderboard(results[6].value.students || []);
      if (results[7].status === 'fulfilled') setEarnings(results[7].value);

    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load some dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await instructorApi.markNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark notifications as read:', err);
    }
  };

  // Generate revenue chart data
  const revenueChartData = revenueData.map(item => {
    const monthLabels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
    return {
      month: monthLabels[item.month - 1],
      gross: item.gross,
      net: item.net,
    };
  });

  // Header action
  const headerAction = (
    <div className="flex items-center gap-3">
      <Link to="/instructor/create-course" className="btn-primary text-[14px] py-2 px-5">
        + New Course
      </Link>
    </div>
  );

  // Get user info
  const user = authApi.getCurrentUser();

  return (
    <InstructorLayout 
      title="Dashboard" 
      subtitle="Welcome back! Here's your teaching overview"
      headerAction={headerAction}
    >
      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-[rgba(255,68,68,0.1)] border border-[var(--danger)] rounded-lg">
          <p className="text-[var(--danger)] text-[13px]">{error}</p>
        </div>
      )}

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[14px] mb-8">
        {/* Total Students */}
        <div className="stat-card" style={{ '--accent': 'var(--info)' } as React.CSSProperties}>
          <div className="flex items-start justify-between mb-3">
            <span className="label">Total Students</span>
            <span className="text-[20px]">👥</span>
          </div>
          <div className="stat-value">
            {loading ? '...' : stats?.total_students?.toLocaleString() || 0}
          </div>
          <div className="stat-sub">
            {stats?.students_delta !== undefined && (
              <span style={{ color: stats.students_delta >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                {formatPercent(stats.students_delta)}
              </span>
            )}
            {' '}vs last month
          </div>
        </div>

        {/* Revenue This Month */}
        <div className="stat-card" style={{ '--accent': 'var(--neon)' } as React.CSSProperties}>
          <div className="flex items-start justify-between mb-3">
            <span className="label">Revenue This Month</span>
            <span className="text-[20px]">💰</span>
          </div>
          <div className="stat-value">
            {loading ? '...' : formatCurrency(stats?.revenue_mtd || 0)}
          </div>
          <div className="stat-sub">
            {stats?.revenue_delta !== undefined && (
              <span style={{ color: stats.revenue_delta >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                {formatPercent(stats.revenue_delta)}
              </span>
            )}
            {' '}vs last month
          </div>
        </div>

        {/* Avg Rating */}
        <div className="stat-card" style={{ '--accent': 'var(--warning)' } as React.CSSProperties}>
          <div className="flex items-start justify-between mb-3">
            <span className="label">Avg Rating</span>
            <span className="text-[20px]">⭐</span>
          </div>
          <div className="stat-value">
            {loading ? '...' : (stats?.avg_rating?.toFixed(1) || 'N/A')}
          </div>
          <div className="stat-sub">
            {stats?.rating_delta !== undefined && (
              <span style={{ color: stats.rating_delta >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                {formatPercent(stats.rating_delta)}
              </span>
            )}
            {' '}vs last period
          </div>
        </div>

        {/* Completion Rate */}
        <div className="stat-card" style={{ '--accent': 'var(--success)' } as React.CSSProperties}>
          <div className="flex items-start justify-between mb-3">
            <span className="label">Completion Rate</span>
            <span className="text-[20px]">✅</span>
          </div>
          <div className="stat-value">
            {loading ? '...' : `${stats?.completion_rate?.toFixed(0) || 0}%`}
          </div>
          <div className="stat-sub">
            {stats?.completion_delta !== undefined && (
              <span style={{ color: stats.completion_delta >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                {formatPercent(stats.completion_delta)}
              </span>
            )}
            {' '}vs last month
          </div>
        </div>
      </div>

      {/* Row 2: Revenue Chart + Live Sessions + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-[14px] mb-8">
           {/* Revenue Chart */}
           <div className="lg:col-span-2 card p-6">
             <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                 <h3 className="h3 text-white">Revenue Overview</h3>
                 <div className="flex gap-2">
                   <button 
                     onClick={() => setSelectedYear(y => y - 1)}
                     className="btn-ghost text-[12px] hover:text-[var(--neon)]"
                   >
                     ‹
                   </button>
                   <button 
                     onClick={() => setSelectedYear(y => y + 1)}
                     className="btn-ghost text-[12px] hover:text-[var(--neon)]"
                   >
                     ›
                   </button>
                 </div>
               </div>
               <button className="btn-ghost text-[11px]">Export CSV</button>
             </div>
          <div className="flex items-center gap-4 mb-4 text-[11px]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--neon)]"></div>
              <span className="muted">Gross</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--info)]"></div>
              <span className="muted">Net (after 30% fee)</span>
            </div>
          </div>
          {loading ? (
            <div className="h-[160px] flex items-center justify-center muted">Loading chart...</div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={revenueChartData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted2)" tick={{ fill: 'var(--muted)', fontSize: 10 }} />
                <YAxis stroke="var(--muted2)" tick={{ fill: 'var(--muted)', fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
                <Bar dataKey="gross" fill="url(#neonGrad)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="net" fill="url(#infoGrad)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="neonGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--neon)" />
                    <stop offset="100%" stopColor="rgba(191,255,0,0.3)" />
                  </linearGradient>
                  <linearGradient id="infoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--info)" />
                    <stop offset="100%" stopColor="rgba(0,207,255,0.3)" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Live Sessions */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="h3 text-white">Live Sessions</h3>
            <button className="btn-ghost text-[11px]">+ Schedule</button>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="muted text-[12px]">Loading...</div>
            ) : sessions.length === 0 ? (
              <div className="muted text-[12px]">No upcoming sessions</div>
            ) : (
              sessions.slice(0, 3).map(session => (
                <div key={session.id} className="p-3 bg-[var(--bg2)] rounded-lg border border-[var(--border)] hover:border-[var(--neon)] transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded ${session.status === 'live' ? 'bg-[var(--danger)] text-white animate-pulse' : 'bg-[var(--neon-dim)] text-[var(--neon)]'}`}>
                      {session.status === 'live' ? 'LIVE' : session.day_label}
                    </span>
                    <span className="text-[11px] text-[var(--muted)]">{new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-white text-[13px] font-medium truncate">{session.title}</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-[var(--muted)]">
                    <span>{session.language}</span>
                    <span>•</span>
                    <span>{session.enrolled_count} enrolled</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="h3 text-white">Activity Feed</h3>
            <button className="btn-ghost text-[11px]" onClick={handleMarkAllRead}>Mark all read</button>
          </div>
          <div className="space-y-3 max-h-[220px] overflow-y-auto">
            {loading ? (
              <div className="muted text-[12px]">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="muted text-[12px]">No activity</div>
            ) : (
              notifications.slice(0, 5).map(notif => {
                const { icon, color } = getNotificationIcon(notif.type);
                return (
                  <div 
                    key={notif.id} 
                    className={`flex gap-3 p-2 rounded-lg ${!notif.read ? 'bg-[rgba(191,255,0,0.05)]' : ''}`}
                  >
                    <div 
                      className="w-7 h-7 rounded flex items-center justify-center text-[14px] flex-shrink-0"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-white leading-snug line-clamp-2">{notif.message}</p>
                      <p className="text-[10px] text-[var(--muted2)] mt-1">{getRelativeTime(notif.created_at)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* My Courses Table */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="h3 text-white">My Courses</h3>
          <Link to="/instructor/my-courses" className="btn-ghost text-[12px]">View All →</Link>
        </div>
        {loading ? (
          <div className="muted text-center py-8">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-[48px] mb-3">📚</div>
            <p className="muted mb-4">You haven't created any courses yet.</p>
            <Link to="/instructor/create-course" className="btn-primary">Create Your First Course</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 px-4 label">Course</th>
                  <th className="text-left py-3 px-4 label">Status</th>
                  <th className="text-left py-3 px-4 label">Students</th>
                  <th className="text-left py-3 px-4 label">Completion</th>
                  <th className="text-left py-3 px-4 label">Rating</th>
                  <th className="text-left py-3 px-4 label">Revenue</th>
                  <th className="text-left py-3 px-4 label">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.slice(0, 5).map(course => (
                  <tr key={course.id} className="border-b border-[var(--border)] hover:bg-[var(--bg2)]">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[24px]">{course.language_flag || '📖'}</span>
                        <div>
                          <p className="text-white text-[13px] font-medium">{course.title}</p>
                          <p className="text-[11px] text-[var(--muted)]">{course.level} • {course.lesson_count} lessons</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge ${
                        course.status === 'published' ? 'badge-success' : 
                        course.status === 'pending' ? 'badge-warning' : 'badge-muted'
                      }`}>
                        {course.status?.toUpperCase() || 'DRAFT'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white text-[13px]">{course.student_count}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="progress-track w-16">
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${course.completion_rate}%`,
                              background: course.completion_rate >= 70 ? 'var(--success)' : 
                                          course.completion_rate >= 50 ? 'var(--neon)' : 
                                          course.completion_rate >= 30 ? 'var(--warning)' : 'var(--danger)'
                            }}
                          />
                        </div>
                        <span className="text-[11px] text-[var(--muted)]">{course.completion_rate?.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[var(--warning)] text-[13px]">
                        {course.avg_rating > 0 ? `⭐ ${course.avg_rating.toFixed(1)}` : '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[var(--neon)] text-[13px] font-mono">
                      ${course.revenue_mtd?.toLocaleString() || 0}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link to={`/instructor/curriculum/${course.id}`} className="btn-ghost text-[11px] p-1">✏️</Link>
                        <Link to={`/course/${course.id}`} className="btn-ghost text-[11px] p-1">👁️</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Row 4: PULSE Heatmap + Top Students + Earnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[14px]">
        {/* PULSE Heatmap */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="h3 text-white">🧠 PULSE — Student State Map</h3>
            <button className="btn-ghost text-[11px]">Details →</button>
          </div>
          <p className="text-[11px] text-[var(--muted)] mb-4">Each cell = 1 student. Hover for name.</p>
          {loading ? (
            <div className="muted text-[12px]">Loading...</div>
          ) : pulseData.length === 0 ? (
            <div className="muted text-[12px]">No student data available</div>
          ) : (
            <div className="flex flex-wrap gap-[3px]">
              {pulseData.slice(0, 50).map(student => (
                <div
                  key={student.student_id}
                  className="pulse-cell w-[14px] h-[14px] rounded-sm cursor-pointer"
                  style={{ backgroundColor: getPulseStateColor(student.pulse_state) }}
                  title={`${student.student_name} — ${student.pulse_state}`}
                />
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-3 mt-4 text-[10px]">
            {[
              { state: 'Thriving', color: 'var(--success)' },
              { state: 'Coasting', color: 'var(--info)' },
              { state: 'Struggling', color: 'var(--warning)' },
              { state: 'Burning Out', color: '#FF8C00' },
              { state: 'Disengaged', color: 'var(--danger)' },
            ].map(item => (
              <div key={item.state} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: item.color }} />
                <span className="muted">{item.state}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Students Leaderboard */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="h3 text-white">Top Students</h3>
            <Link to="/instructor/students" className="btn-ghost text-[11px]">All →</Link>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="muted text-[12px]">Loading...</div>
            ) : leaderboard.length === 0 ? (
              <div className="muted text-[12px]">No student data</div>
            ) : (
              leaderboard.map((student, idx) => (
                <div key={student.user_id} className="flex items-center gap-3">
                  <span className={`text-[14px] font-mono w-5 ${
                    student.rank === 1 ? 'text-[#FFD700]' : 
                    student.rank === 2 ? 'text-[#C0C0C0]' : 
                    student.rank === 3 ? 'text-[#CD7F32]' : 'text-[var(--muted)]'
                  }`}>
                    {student.rank}
                  </span>
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-black"
                    style={{ background: `linear-gradient(135deg, ${student.avatar_color_start || 'var(--neon)'}, ${student.avatar_color_end || 'var(--neon2)'})` }}
                  >
                    {student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-[13px] truncate">{student.name}</p>
                    <p className="text-[11px] text-[var(--muted)] truncate">{student.course_title}</p>
                  </div>
                  <span className="text-[var(--neon)] text-[13px] font-mono">{student.xp_total} XP</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Earnings Breakdown */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="h3 text-white">Earnings</h3>
            <Link to="/instructor/earnings" className="btn-ghost text-[11px]">Payout →</Link>
          </div>
          {loading ? (
            <div className="muted text-[12px]">Loading...</div>
          ) : !earnings ? (
            <div className="muted text-[12px]">No earnings data</div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-[var(--bg2)] rounded-lg">
                  <p className="label text-[9px]">March MTD</p>
                  <p className="text-[var(--success)] text-[18px] font-head">${earnings.mtd_gross?.toLocaleString() || 0}</p>
                </div>
                <div className="p-3 bg-[var(--bg2)] rounded-lg">
                  <p className="label text-[9px]">Pending</p>
                  <p className="text-[var(--warning)] text-[18px] font-head">${earnings.pending_payout?.toLocaleString() || 0}</p>
                </div>
                <div className="p-3 bg-[var(--bg2)] rounded-lg">
                  <p className="label text-[9px]">All-Time</p>
                  <p className="text-[var(--info)] text-[18px] font-head">${earnings.all_time_net?.toLocaleString() || 0}</p>
                </div>
                <div className="p-3 bg-[var(--bg2)] rounded-lg">
                  <p className="label text-[9px]">Platform Fee</p>
                  <p className="text-[var(--danger)] text-[18px] font-head">{(earnings.platform_fee_rate || 30)}%</p>
                </div>
              </div>
              <p className="label text-[9px] mb-2">Revenue by Course</p>
              <div className="space-y-2">
                {earnings.by_course?.slice(0, 4).map(course => (
                  <div key={course.course_id} className="flex items-center gap-2">
                    <span className="text-[11px] text-white truncate flex-1 w-0">{course.title}</span>
                    <span className="text-[11px] text-[var(--muted)] font-mono">${course.revenue?.toLocaleString()}</span>
                    <div className="w-16 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[var(--neon)] rounded-full" 
                        style={{ width: `${course.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </InstructorLayout>
  );
}
