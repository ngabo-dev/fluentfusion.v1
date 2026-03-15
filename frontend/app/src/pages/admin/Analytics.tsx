import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import StatCard from '../../components/StatCard'
import BarChart from '../../components/BarChart'

const MONTHS = ['J','F','M','A','M','J','J','A','S','O','N','D']

export default function Analytics() {
  const [data, setData] = useState<any>(null)
  useEffect(() => { api.get('/api/admin/analytics').then(r => setData(r.data)) }, [])
  if (!data) return <div className="loading" />

  const monthly = data.monthly ?? []
  const grossBars = monthly.map((m: any) => ({ value: Math.round(m.gross / 1000), label: MONTHS[m.month - 1] ?? '' }))
  const netBars = monthly.map((m: any) => ({ value: Math.round(m.net / 1000), label: '' }))

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Platform Analytics</h1><p>Comprehensive platform-wide metrics</p></div>
        <div className="pa"><button className="btn bo sm">Export</button></div>
      </div>
      <div className="sr sr5">
        <StatCard label="Total Users" value={data.total_users?.toLocaleString()} delta="↑ 1,204" deltaUp />
        <StatCard label="Revenue YTD" value={`$${(data.total_revenue/1000).toFixed(0)}k`} delta="↑ 18%" deltaUp variant="ok" />
        <StatCard label="Active Courses" value={data.active_courses} delta="↑ 12" deltaUp variant="in" />
        <StatCard label="Avg Completion" value={`${data.avg_completion}%`} delta="↑ 2%" deltaUp variant="wa" />
        <StatCard label="Churn Rate" value="7.8%" delta="↑ 0.5%" variant="er" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div className="card"><div className="ch"><span className="ch-t">Revenue Trend (12 months)</span></div><BarChart bars={grossBars} dual={netBars} /></div>
        <div className="card"><div className="ch"><span className="ch-t">Gross (12m)</span></div><BarChart bars={grossBars} /></div>
        <div className="card"><div className="ch"><span className="ch-t">Net (12m)</span></div><BarChart bars={netBars} /></div>
      </div>
      <div className="g2">
        <div className="card">
          <div className="ch"><span className="ch-t">Top 5 Courses</span></div>
          <table className="tbl"><thead><tr><th>#</th><th>Course</th><th>Students</th><th>Revenue</th></tr></thead>
          <tbody>{data.top_courses?.map((c: any, i: number) => (
            <tr key={i}><td style={{ color: i === 0 ? 'var(--wa)' : 'var(--mu)', fontWeight: 800 }}>{i+1}</td><td>{c.title}</td><td style={{ color: 'var(--neon)' }}>{c.students}</td><td style={{ color: 'var(--ok)' }}>${(c.revenue/1000).toFixed(1)}k</td></tr>
          ))}</tbody></table>
        </div>
        <div className="card">
          <div className="ch"><span className="ch-t">Top Instructors</span></div>
          <table className="tbl"><thead><tr><th>#</th><th>Instructor</th></tr></thead>
          <tbody>{data.top_instructors?.map((u: any, i: number) => (
            <tr key={i}><td style={{ color: i === 0 ? 'var(--wa)' : 'var(--mu)', fontWeight: 800 }}>{i+1}</td>
            <td><div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div className="av avs" style={{ width: 20, height: 20, fontSize: 8 }}>{u.avatar_initials}</div>{u.name}</div></td></tr>
          ))}</tbody></table>
        </div>
      </div>
    </div>
  )
}
