import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { usersApi, gamificationApi, API_BASE_URL } from '../app/api/config';
import StudentLayout from '../app/components/StudentLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';

// Build a 12-week × 7-day grid of dates (Mon-Sun columns, week 0 = oldest)
function buildHeatmapGrid(weeks: number): string[][] {
  const grid: string[][] = [];
  // Find the most recent Sunday
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  // Advance to end of current week (Sunday)
  const endSunday = new Date(today);
  endSunday.setDate(today.getDate() + (7 - dayOfWeek) % 7);

  for (let w = weeks - 1; w >= 0; w--) {
    const weekDates: string[] = [];
    // Monday of this week
    const monday = new Date(endSunday);
    monday.setDate(endSunday.getDate() - w * 7 - 6);
    for (let d = 0; d < 7; d++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + d);
      weekDates.push(day.toISOString().slice(0, 10));
    }
    grid.push(weekDates);
  }
  return grid;
}

function getHeatmapColor(count: number): string {
  if (count === 0) return 'var(--bg-tertiary)';
  if (count <= 2) return 'rgba(191,255,0,0.2)';
  if (count <= 5) return 'rgba(191,255,0,0.5)';
  return 'var(--accent-primary)';
}

function ActivityHeatmap({ activityMap }: { activityMap: Map<string, number> }) {
  const WEEKS = 12;
  const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const grid = buildHeatmapGrid(WEEKS);
  const [tooltip, setTooltip] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2">
        {/* Day labels on Y-axis */}
        <div className="flex flex-col gap-[2px] pt-[18px]">
          {DAY_LABELS.map(d => (
            <div key={d} className="h-[14px] text-[9px] text-[#555] flex items-center pr-1 leading-none">{d}</div>
          ))}
        </div>
        {/* Grid columns (weeks) */}
        <div className="flex flex-col gap-1">
          {/* Week number labels */}
          <div className="flex gap-[2px]">
            {grid.map((_, wi) => (
              <div key={wi} className="w-[14px] text-[9px] text-[#555] text-center leading-none">{wi + 1}</div>
            ))}
          </div>
          {/* Day rows */}
          {DAY_LABELS.map((_, di) => (
            <div key={di} className="flex gap-[2px]">
              {grid.map((week, wi) => {
                const date = week[di];
                const count = activityMap.get(date) || 0;
                return (
                  <div
                    key={wi}
                    className="w-[14px] h-[14px] rounded-sm cursor-pointer transition-opacity hover:opacity-80 relative"
                    style={{ backgroundColor: getHeatmapColor(count) }}
                    onMouseEnter={(e) => {
                      const rect = (e.target as HTMLElement).getBoundingClientRect();
                      setTooltip({ date, count, x: rect.left + rect.width / 2, y: rect.top });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-[11px] text-white shadow-lg"
          style={{ left: tooltip.x, top: tooltip.y - 44, transform: 'translateX(-50%)' }}
        >
          <span className="font-semibold text-[#bfff00]">{tooltip.count}</span> {tooltip.count === 1 ? 'activity' : 'activities'} · {tooltip.date}
        </div>
      )}
    </div>
  );
}

export default function Component15Progress() {
  const [stats, setStats] = useState<any>(null);
  const [streak, setStreak] = useState<any>(null);
  const [xp, setXP] = useState<any>(null);
  const [xpHistory, setXPHistory] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityMap, setActivityMap] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const token = localStorage.getItem('ff_access_token');
    if (!token) return;

    Promise.allSettled([
      usersApi.getDashboardStats(),
      gamificationApi.getStreak(),
      gamificationApi.getXP(),
      gamificationApi.getXPTransactions(1, 7),
      fetch(`${API_BASE_URL}/courses/enrolled`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_BASE_URL}/gamification/activity-heatmap?weeks=12`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : { data: [] }),
    ]).then(([statsRes, streakRes, xpRes, xpHistRes, coursesRes, heatmapRes]) => {
      if (statsRes.status === 'fulfilled') setStats(statsRes.value);
      if (streakRes.status === 'fulfilled') setStreak(streakRes.value);
      if (xpRes.status === 'fulfilled') setXP(xpRes.value);
      if (xpHistRes.status === 'fulfilled') {
        const txns = xpHistRes.value.transactions || [];
        // Build last 7 days chart
        const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        const chartData = days.map((day, i) => ({
          day,
          xp: txns[i]?.amount || 0,
        }));
        setXPHistory(chartData);
      }
      if (coursesRes.status === 'fulfilled') {
        const data = coursesRes.value;
        const list = Array.isArray(data) ? data : (data.courses || []);
        setCourses(list.slice(0, 5));
      }
      if (heatmapRes.status === 'fulfilled') {
        const entries: { date: string; count: number }[] = heatmapRes.value?.data || [];
        const map = new Map<string, number>();
        entries.forEach(e => map.set(e.date, e.count));
        setActivityMap(map);
      }
      setLoading(false);
    });
  }, []);

  const skillData = [
    { skill: 'Speaking', score: stats?.fluency_score || 0 },
    { skill: 'Listening', score: Math.max(0, (stats?.fluency_score || 0) - 10) },
    { skill: 'Reading', score: Math.min(100, (stats?.fluency_score || 0) + 5) },
    { skill: 'Writing', score: Math.max(0, (stats?.fluency_score || 0) - 5) },
    { skill: 'Vocabulary', score: Math.min(100, (stats?.lessons_completed || 0) * 2) },
  ];

  return (
    <StudentLayout title="Progress" subtitle="Track your learning journey">
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px] text-[#888]">Loading...</div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total XP', value: (xp?.total_xp || 0).toLocaleString(), sub: `Level ${xp?.current_level || 1}`, color: '#bfff00' },
              { label: 'Current Streak', value: `${streak?.current_streak || 0} 🔥`, sub: `Best: ${streak?.longest_streak || 0} days`, color: '#ff6b35' },
              { label: 'Lessons Done', value: stats?.lessons_completed || 0, sub: `${stats?.lessons_this_month || 0} this month`, color: '#00ff7f' },
              { label: 'Fluency Score', value: `${stats?.fluency_score || 0}%`, sub: 'Overall', color: '#bfff00' },
            ].map(card => (
              <div key={card.label} className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-5">
                <div className="text-[#888] text-[10px] uppercase tracking-widest mb-2">{card.label}</div>
                <div className="text-[28px] font-bold mb-1" style={{ color: card.color }}>{card.value}</div>
                <div className="text-[#555] text-[11px]">{card.sub}</div>
              </div>
            ))}
          </div>

          {/* XP Chart + Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-[#151515] border border-[#2a2a2a] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-[14px] font-semibold">Weekly XP Activity</h2>
                <span className="text-[#555] text-[10px]">Last 7 transactions</span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={xpHistory}>
                  <defs>
                    <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#bfff00" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#bfff00" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="day" stroke="#555" tick={{ fill: '#888', fontSize: 11 }} />
                  <YAxis stroke="#555" tick={{ fill: '#888', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8 }} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#bfff00' }} />
                  <Area type="monotone" dataKey="xp" stroke="#bfff00" fill="url(#xpGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6">
              <h2 className="text-white text-[14px] font-semibold mb-4">Skill Breakdown</h2>
              <ResponsiveContainer width="100%" height={180}>
                <RadarChart data={skillData}>
                  <PolarGrid stroke="#2a2a2a" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: '#888', fontSize: 10 }} />
                  <Radar name="Score" dataKey="score" stroke="#bfff00" fill="#bfff00" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* XP Level Progress */}
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-white font-semibold">Level {xp?.current_level || 1}</span>
                <span className="text-[#555] text-[12px] ml-2">→ Level {(xp?.current_level || 1) + 1}</span>
              </div>
              <span className="text-[#bfff00] text-[13px] font-semibold">{(xp?.xp_to_next_level || 0).toLocaleString()} XP to go</span>
            </div>
            <div className="bg-[#2a2a2a] h-[8px] rounded-[99px] overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#8fef00] to-[#bfff00] h-full rounded-[99px] transition-all"
                style={{
                  width: xp?.xp_to_next_level
                    ? `${Math.max(5, 100 - Math.round((xp.xp_to_next_level / 1000) * 100))}%`
                    : '5%'
                }}
              />
            </div>
          </div>

          {/* Activity Heatmap */}
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-white font-semibold">Activity Heatmap</h2>
                <span className="text-[#555] text-[11px]">Last 12 weeks</span>
              </div>
            </div>
            <ActivityHeatmap activityMap={activityMap} />
          </div>

          {/* Courses Progress */}
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold">Course Progress</h2>
              <Link to="/courses" className="text-[#bfff00] text-[12px] hover:underline no-underline">View All →</Link>
            </div>
            {courses.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-[40px] mb-2">📚</div>
                <p className="text-[#888] text-[13px] mb-3">No courses enrolled yet</p>
                <Link to="/courses" className="bg-[#bfff00] text-black px-5 py-2 rounded-lg font-semibold text-[13px] inline-block no-underline">Browse Courses</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map((course: any) => (
                  <div key={course.id} className="flex items-center gap-4">
                    <span className="text-[24px]">{course.flag || '🌍'}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-[13px] font-medium">{course.title}</span>
                        <span className="text-[#bfff00] text-[12px] font-semibold">{course.progress || 0}%</span>
                      </div>
                      <div className="bg-[#2a2a2a] h-[5px] rounded-[99px] overflow-hidden">
                        <div className="bg-gradient-to-r from-[#8fef00] to-[#bfff00] h-full rounded-[99px]" style={{ width: `${course.progress || 0}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </StudentLayout>
  );
}
