import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/client'
import StatCard from '../../components/StatCard'
import BarChart from '../../components/BarChart'
import Badge from '../../components/Badge'
import Progress from '../../components/Progress'
import LiveSessionBanner from '../../components/LiveSessionBanner'
import { BarChart2, Mic, Plus, Star, TrendingDown, TrendingUp, Users } from 'lucide-react'

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
      <LiveSessionBanner endpoint="/api/meetings" />
      <div className="ph">
        <div><h1>Dashboard</h1><p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
        <div className="pa"><button className="btn bp" onClick={() => navigate('/instructor/courses/new')}><Plus size={16} /> New Course</button><button className="btn bo sm"><Mic size={16} />️</button></div>
      </div>
      <div className="sr">
        <StatCard label="Total Students" value={data.total_students?.toLocaleString()} delta="12% this month" deltaUp icon={<Users size={16} />} />
        <StatCard label="Revenue MTD" value={`$${data.revenue_mtd?.toLocaleString()}`} delta="8.4% vs last month" deltaUp icon={<BarChart2 size={16} />} variant="wa" />
        <StatCard label="Avg Rating" value={data.avg_rating || '—'} delta="0.2 vs last period" deltaUp icon={<Star size={16} />} variant="ok" />
        <StatCard label="Completion Rate" value={`${data.avg_completion?.toFixed(0)}%`} delta="2% vs last month" deltaUp={false} icon={<TrendingDown size={16} />} variant="in" />
      </div>
      <div className="g21">
        <div className="card">
          <div className="ch"><span className="ch-t">Revenue Overview</span><span className="ch-a">This Year ▾</span></div>
          <BarChart bars={grossBars} dual={netBars} legend={['Gross', 'Net']} height={130} />
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
            <td style={{ color: 'var(--wa)', display: 'flex', alignItems: 'center', gap: 4 }}>{c.rating ? <><Star size={12} />{c.rating}</> : '—'}</td>
            <td style={{ color: 'var(--ok)', fontWeight: 600 }}>{c.revenue ? `$${c.revenue.toLocaleString()}` : '—'}</td>
          </tr>
        ))}</tbody></table>
      </div>
    </div>
  )
}
