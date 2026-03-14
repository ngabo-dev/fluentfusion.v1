import React, { useEffect, useState } from 'react';
import { dashboardApi, coursesApi, sessionsApi } from '../../api';
import { StatCard, Card, PageHeader, Badge, ProgressBar, Spinner, PulseBar, Btn } from '../../components/UI';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function InstructorDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      dashboardApi.instructorStats(),
      coursesApi.list({ per_page: 5 }),
      sessionsApi.list(),
    ]).then(([s, c, sess]) => {
      setStats(s); setCourses(c.items || []); setSessions(sess.slice(0, 3));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}><Spinner size={32} /></div>;

  const mockMonthlyData = [
    { month: 'Oct', students: 120, revenue: 1200 },
    { month: 'Nov', students: 145, revenue: 1450 },
    { month: 'Dec', students: 138, revenue: 1380 },
    { month: 'Jan', students: 162, revenue: 1620 },
    { month: 'Feb', students: 178, revenue: 1780 },
    { month: 'Mar', students: stats?.total_students || 190, revenue: stats?.monthly_revenue || 1900 },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle={`Welcome back · ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
        actions={<Btn onClick={() => navigate('/instructor/courses')}>+ New Course</Btn>} />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18 }}>
        <StatCard label="Total Students" value={(stats.total_students || 0).toLocaleString()} sub="Across all courses" color="neon" />
        <StatCard label="Total Courses" value={stats.total_courses || 0} sub={`${courses.filter(c => c.status === 'active').length} published`} color="info" accent="info" />
        <StatCard label="Monthly Revenue" value={`$${(stats.monthly_revenue || 0).toFixed(0)}`} sub="This month" color="ok" accent="ok" />
        <StatCard label="Avg Rating" value={(stats.avg_rating || 0).toFixed(1)} sub="⭐ Across all courses" color="warn" accent="warn" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Growth chart */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>Student Growth</div>
            <div style={{ fontSize: 10, color: 'var(--mu)' }}>Last 6 months</div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={mockMonthlyData}>
              <XAxis dataKey="month" tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 8, fontSize: 11 }} />
              <Line type="monotone" dataKey="students" stroke="#BFFF00" strokeWidth={2} dot={{ fill: '#BFFF00', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* PULSE */}
        <Card>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>Student PULSE</div>
          {stats.pulse_stats && <PulseBar {...stats.pulse_stats} />}
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* My courses */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>My Courses</div>
            <span onClick={() => navigate('/instructor/courses')} style={{ fontSize: 10, color: 'var(--neon)', cursor: 'pointer', padding: '3px 8px', border: '1px solid rgba(191,255,0,.2)', borderRadius: 5, fontFamily: 'JetBrains Mono, monospace' }}>VIEW ALL →</span>
          </div>
          {courses.length === 0 ? (
            <div style={{ color: 'var(--mu)', fontSize: 11, padding: '20px 0', textAlign: 'center' }}>
              No courses yet. <span style={{ color: 'var(--neon)', cursor: 'pointer' }} onClick={() => navigate('/instructor/courses')}>Create your first →</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {courses.map(c => (
                <div key={c.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{c.title}</div>
                    <Badge variant={c.status === 'active' ? 'ok' : c.status === 'pending' ? 'warn' : 'muted'}>{c.status}</Badge>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--mu)', marginBottom: 6 }}>
                    <span>{c.total_enrollments} students</span>
                    <span>⭐ {c.rating.toFixed(1)}</span>
                  </div>
                  <ProgressBar value={c.total_enrollments} max={Math.max(c.total_enrollments, 500)} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Upcoming sessions */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>Live Sessions</div>
            <Btn size="sm" variant="outline" onClick={() => navigate('/instructor/sessions')}>Schedule →</Btn>
          </div>
          {sessions.length === 0 ? (
            <div style={{ color: 'var(--mu)', fontSize: 11, padding: '20px 0', textAlign: 'center' }}>No upcoming sessions</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sessions.map(s => (
                <div key={s.id} style={{ padding: 10, background: 'var(--card2)', borderRadius: 'var(--r)', border: '1px solid var(--bdr)' }}>
                  <div style={{ fontWeight: 500, marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--mu)' }}>{s.course_title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                    <span style={{ fontSize: 10, color: 'var(--neon)' }}>
                      {s.scheduled_at ? new Date(s.scheduled_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'TBD'}
                    </span>
                    <Badge variant={s.status === 'live' ? 'ok' : 'muted'}>{s.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
