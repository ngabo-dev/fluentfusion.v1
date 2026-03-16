import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/client'
import StatCard from '../../components/StatCard'
import BarChart from '../../components/BarChart'
import Badge from '../../components/Badge'
import Progress from '../../components/Progress'

const MONTHS = ['J','F','M','A','M','J','J','A','S','O','N','D']

export default function Dashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState<any>(null)
  useEffect(() => { api.get('/api/instructor/dashboard').then(r => setData(r.data)) }, [])
  if (!data) return <div className="loading" />

  const monthly = data.monthly_revenue ?? []
  const grossBars = monthly.map((m: any) => ({ value: Math.round(m.gross), label: MONTHS[m.month - 1] ?? '' }))
  const netBars = monthly.map((m: any) => ({ value: Math.round(m.net), label: '' }))

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Dashboard</h1><p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
        <div className="pa"><button className="btn bp" onClick={() => navigate('/instructor/courses/new')}>＋ New Course</button><button className="btn bo sm">🎙️</button></div>
      </div>
      <div className="sr">
        <StatCard label="Total Students" value={data.total_students?.toLocaleString()} sub="↑ 12% this month" />
        <StatCard label="Revenue MTD" value={`$${data.revenue_mtd?.toLocaleString()}`} sub="↑ 8.4% vs last month" variant="wa" />
        <StatCard label="Avg Rating" value={data.avg_rating || '—'} sub="↑ 0.2 vs last period" variant="ok" />
        <StatCard label="Completion Rate" value={`${data.avg_completion?.toFixed(0)}%`} sub="↓ 2% vs last month" variant="in" />
      </div>
      <div className="g21">
        <div className="card">
          <div className="ch"><span className="ch-t">Revenue Overview</span><span className="ch-a">This Year ▾</span></div>
          <div className="cl"><div className="li"><div className="ld" style={{ background: 'var(--neon)' }} />Gross</div><div className="li"><div className="ld" style={{ background: 'var(--in)' }} />Net</div></div>
          <BarChart bars={grossBars} dual={netBars} />
        </div>
        <div className="card">
          <div className="ch"><span className="ch-t">Live Sessions</span><span className="ch-a">+ Schedule</span></div>
          {data.sessions?.slice(0, 3).map((s: any) => {
            const dt = new Date(s.scheduled_at)
            const hr = dt.getHours().toString().padStart(2,'0')
            const ampm = dt.getHours() < 12 ? 'AM' : 'PM'
            return (
              <div key={s.id} className="sesk" style={s.status === 'live' ? { borderColor: 'rgba(255,68,68,.4)' } : {}}>
                <div className="stb"><div className="hr">{hr}</div><div className="ap">{ampm}</div></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: s.status === 'live' ? 600 : 500 }}>{s.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--mu)' }}>{s.attendees} {s.status === 'live' ? 'attendees live' : 'enrolled'}</div>
                </div>
                {s.status === 'live' ? <span className="lv">LIVE</span> : <span className="sv2">Soon</span>}
              </div>
            )
          })}
        </div>
      </div>
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="ch"><span className="ch-t">My Courses</span><span className="ch-a">View All →</span></div>
        <table className="tbl"><thead><tr><th>Course</th><th>Status</th><th>Students</th><th>Completion</th><th>Rating</th><th>Revenue</th></tr></thead>
        <tbody>{data.courses?.map((c: any) => (
          <tr key={c.id}>
            <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 24, background: 'rgba(191,255,0,.08)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.flag_emoji}</div>
              <div><div style={{ fontSize: 12, fontWeight: 500 }}>{c.title}</div><div style={{ fontSize: 10, color: 'var(--mu)' }}>{c.level} · {c.lesson_count} lessons</div></div>
            </div></td>
            <td><Badge variant={c.status === 'published' ? 'k' : c.status === 'pending' ? 'w' : 'm'}>{c.status}</Badge></td>
            <td>{c.students || '—'}</td>
            <td>{c.completion ? <Progress pct={Math.round(c.completion)} /> : '—'}</td>
            <td style={{ color: 'var(--wa)' }}>{c.rating ? `★ ${c.rating}` : '—'}</td>
            <td style={{ color: 'var(--ok)', fontWeight: 600 }}>{c.revenue ? `$${c.revenue.toLocaleString()}` : '—'}</td>
          </tr>
        ))}</tbody></table>
      </div>
    </div>
  )
}
