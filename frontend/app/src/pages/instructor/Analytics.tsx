import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import StatCard from '../../components/StatCard'
import BarChart from '../../components/BarChart'

const MONTHS = ['J','F','M','A','M','J','J','A','S','O','N','D']

export default function Analytics() {
  const [data, setData] = useState<any>(null)
  useEffect(() => { api.get('/api/instructor/analytics').then(r => setData(r.data)) }, [])
  if (!data) return <div className="loading" />

  const monthly = data.monthly ?? []
  const grossBars = monthly.map((m: any) => ({ value: Math.round(m.gross), label: MONTHS[m.month - 1] ?? '' }))
  const netBars = monthly.map((m: any) => ({ value: Math.round(m.net), label: '' }))

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Analytics</h1><p>Track your teaching performance</p></div>
        <div className="pa"><button className="btn bo sm">Export CSV</button></div>
      </div>
      <div className="sr">
        <StatCard label="Total Students" value={data.total_students?.toLocaleString()} delta="↑ 12%" deltaUp />
        <StatCard label="Total Revenue" value={`$${(data.total_revenue/1000).toFixed(1)}k`} delta="↑ 8.4%" deltaUp />
        <StatCard label="Avg Rating" value={data.avg_rating || '—'} delta="↑ 0.2" deltaUp variant="ok" />
        <StatCard label="Avg Completion" value={`${data.avg_completion?.toFixed(0)}%`} delta="↓ 2%" variant="wa" />
      </div>
      <div className="g2">
        <div className="card"><div className="ch"><span className="ch-t">Revenue Trend</span><span className="ch-a">12 months</span></div><div className="cl"><div className="li"><div className="ld" style={{ background: 'var(--neon)' }} />Gross</div><div className="li"><div className="ld" style={{ background: 'var(--in)' }} />Net</div></div><BarChart bars={grossBars} dual={netBars} /></div>
        <div className="card"><div className="ch"><span className="ch-t">Student Growth</span><span className="ch-a">12 months</span></div><BarChart bars={grossBars.map((b: any, i: number) => ({ ...b, value: Math.round(b.value / 20) }))} /></div>
      </div>
      <div className="card">
        <div className="ch"><span className="ch-t">Course Performance</span></div>
        <table className="tbl"><thead><tr><th>Course</th><th>Students</th><th>Completion</th><th>Revenue</th><th>Rating</th></tr></thead>
        <tbody>{data.course_performance?.map((c: any) => (
          <tr key={c.title}>
            <td><b>{c.title}</b></td>
            <td>{c.students}</td>
            <td><div className="mp"><div className="mt"><div className="mf" style={{ width: `${c.completion}%` }} /></div>{c.completion}%</div></td>
            <td style={{ color: 'var(--ok)' }}>${c.revenue?.toLocaleString()}</td>
            <td style={{ color: 'var(--wa)' }}>{c.rating ? `★ ${c.rating}` : '—'}</td>
          </tr>
        ))}</tbody></table>
      </div>
    </div>
  )
}
