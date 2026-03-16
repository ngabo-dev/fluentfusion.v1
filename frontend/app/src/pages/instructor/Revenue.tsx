import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import StatCard from '../../components/StatCard'
import BarChart from '../../components/BarChart'

const MONTHS = ['J','F','M','A','M','J','J','A','S','O','N','D']

export default function Revenue() {
  const [data, setData] = useState<any>(null)
  useEffect(() => { api.get('/api/instructor/revenue').then(r => setData(r.data)) }, [])
  if (!data) return <div className="loading" />

  const monthly = data.monthly ?? []
  const grossBars = monthly.map((m: any) => ({ value: Math.round(m.gross), label: MONTHS[m.month - 1] ?? '' }))
  const netBars = monthly.map((m: any) => ({ value: Math.round(m.net), label: '' }))

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Revenue</h1><p>Your earnings and income analytics</p></div>
        <div className="pa"><button className="btn bo sm">Export CSV</button></div>
      </div>
      <div className="sr">
        <StatCard label="MTD Gross" value={`$${data.total_gross?.toLocaleString()}`} delta="↑ 8.4%" deltaUp />
        <StatCard label="MTD Net (70%)" value={`$${data.total_net?.toLocaleString()}`} sub="After platform fee" variant="ok" />
        <StatCard label="YTD Net" value={`$${(data.total_net * 0.6).toFixed(0)}`} delta="↑ 14%" deltaUp variant="in" />
        <StatCard label="All-Time Net" value={`$${(data.total_net * 1.8).toFixed(0)}`} sub="Since joining" />
      </div>
      <div className="g21">
        <div className="card">
          <div className="ch"><span className="ch-t">Monthly Revenue</span></div>
          <div className="cl"><div className="li"><div className="ld" style={{ background: 'var(--neon)' }} />Gross</div><div className="li"><div className="ld" style={{ background: 'var(--in)' }} />Net</div></div>
          <BarChart bars={grossBars} dual={netBars} />
        </div>
        <div className="card">
          <div className="ch"><span className="ch-t">Earnings Summary</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 12 }}>
            <div style={{ background: 'var(--card2)', border: '1px solid var(--bdr)', borderRadius: 'var(--r)', padding: 11 }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'var(--mu)', textTransform: 'uppercase', marginBottom: 3 }}>Pending</div>
              <div style={{ fontFamily: 'Syne', fontSize: 19, fontWeight: 800, color: 'var(--wa)' }}>${data.total_net?.toLocaleString()}</div>
            </div>
            <div style={{ background: 'var(--card2)', border: '1px solid var(--bdr)', borderRadius: 'var(--r)', padding: 11 }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'var(--mu)', textTransform: 'uppercase', marginBottom: 3 }}>Platform Fee</div>
              <div style={{ fontFamily: 'Syne', fontSize: 19, fontWeight: 800, color: 'var(--er)' }}>−30%</div>
            </div>
          </div>
          <button className="btn bp" style={{ width: '100%' }} onClick={() => window.location.href = '/instructor/payouts'}>Request Payout →</button>
        </div>
      </div>
      <div className="card">
        <div className="ch"><span className="ch-t">Revenue by Course</span></div>
        <table className="tbl"><thead><tr><th>Course</th><th>Students</th><th>Gross</th><th>Fee</th><th>Net Earned</th><th>% of Total</th></tr></thead>
        <tbody>
          {data.by_course?.map((c: any) => (
            <tr key={c.course}>
              <td><b>{c.course}</b></td>
              <td>{c.students}</td>
              <td>${c.gross?.toLocaleString()}</td>
              <td style={{ color: 'var(--er)' }}>−${c.fee?.toFixed(0)}</td>
              <td style={{ color: 'var(--ok)', fontWeight: 600 }}>${c.net?.toLocaleString()}</td>
              <td><div className="mp"><div className="mt"><div className="mf" style={{ width: `${Math.round(c.net / Math.max(data.total_net, 1) * 100)}%` }} /></div>{Math.round(c.net / Math.max(data.total_net, 1) * 100)}%</div></td>
            </tr>
          ))}
        </tbody></table>
      </div>
    </div>
  )
}
