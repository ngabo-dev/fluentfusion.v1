import React, { useEffect, useState } from 'react';
import { dashboardApi, coursesApi } from '../../api';
import { StatCard, Card, PageHeader, Badge, ProgressBar, Spinner, PulseBar, Mono } from '../../components/UI';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [trend, setTrend] = useState<any[]>([]);
  const [pulse, setPulse] = useState<any>(null);
  const [pendingCourses, setPendingCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardApi.adminStats(),
      dashboardApi.revenueTrend(),
      dashboardApi.pulsePlatform(),
      coursesApi.list({ status: 'pending', per_page: 5 }),
    ]).then(([s, t, p, c]) => {
      setStats(s); setTrend(t); setPulse(p); setPendingCourses(c.items || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}><Spinner size={32} /></div>;

  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
  const fmtMoney = (n: number) => `$${n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toFixed(0)}`;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Platform overview · ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
      />

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18 }}>
        <StatCard label="Total Users" value={fmt(stats.total_users)} sub={`${stats.total_students} students · ${stats.total_instructors} instructors`} color="neon" />
        <StatCard label="Active Courses" value={stats.active_courses} sub={`${stats.pending_courses} pending review`} color="ok" accent="ok" />
        <StatCard label="Monthly Revenue" value={fmtMoney(stats.monthly_revenue)} sub="Current month" color="info" accent="info" />
        <StatCard label="Active Learners" value={fmt(stats.active_learners)} sub="Last 30 days" color="warn" accent="warn" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Revenue chart */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em' }}>Revenue Trend</div>
            <div style={{ fontSize: 10, color: 'var(--mu)' }}>Last 12 months</div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#BFFF00" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#BFFF00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`$${v.toFixed(0)}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#BFFF00" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* PULSE */}
        <Card>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em', marginBottom: 14 }}>PULSE State</div>
          {pulse && <PulseBar {...pulse} />}
          <div style={{ marginTop: 12, padding: '8px 10px', background: 'rgba(255,68,68,.06)', border: '1px solid rgba(255,68,68,.15)', borderRadius: 'var(--r)' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: 'var(--mu)', marginBottom: 2 }}>AT-RISK</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--er)' }}>
              {pulse ? pulse.burning_out + pulse.disengaged : 0}
            </div>
            <div style={{ fontSize: 10, color: 'var(--mu)' }}>Burning out + disengaged</div>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Enrollment chart */}
        <Card>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em', marginBottom: 12 }}>New Enrollments</div>
          <ResponsiveContainer width="100%" height={110}>
            <BarChart data={trend}>
              <XAxis dataKey="month" tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="enrollments" fill="#BFFF00" radius={[3, 3, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pending courses */}
        <Card>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.02em', marginBottom: 12 }}>
            Pending Review
            {pendingCourses.length > 0 && (
              <span style={{ marginLeft: 8, background: 'var(--wa)', color: '#000', fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 99, fontFamily: 'JetBrains Mono, monospace' }}>
                {pendingCourses.length}
              </span>
            )}
          </div>
          {pendingCourses.length === 0 ? (
            <div style={{ color: 'var(--mu)', fontSize: 11, padding: '20px 0', textAlign: 'center' }}>✅ No pending courses</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pendingCourses.map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{c.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--mu)' }}>{c.instructor_name} · {c.language} {c.level}</div>
                  </div>
                  <Badge variant="warn">Pending</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Platform totals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 14 }}>
        <StatCard label="Total Enrollments" value={fmt(stats.total_enrollments)} color="neon" />
        <StatCard label="Total Revenue" value={fmtMoney(stats.total_revenue)} color="ok" accent="ok" />
        <StatCard label="Total Courses" value={stats.total_courses} sub={`${stats.active_courses} live`} color="info" accent="info" />
        <StatCard label="All Users" value={fmt(stats.total_users)} sub="Across all roles" color="neon" />
      </div>
    </div>
  );
}
