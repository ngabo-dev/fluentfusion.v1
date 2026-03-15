import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import StatCard from '../../components/StatCard'
import BarChart from '../../components/BarChart'

const MONTHS = ['J','F','M','A','M','J','J','A','S','O','N','D']

export default function Revenue() {
  const [data, setData] = useState<any>(null)
  useEffect(() => { api.get('/api/admin/revenue').then(r => setData(r.data)) }, [])
  if (!data) return <div className="loading" />

  const monthly = data.monthly ?? []
  const grossBars = monthly.map((m: any) => ({ value: Math.round(m.gross / 1000), label: MONTHS[m.month - 1] ?? '' }))
  const netBars = monthly.map((m: any) => ({ value: Math.round(m.net / 1000), label: '' }))

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Revenue Reports</h1><p>Platform-wide financial overview</p></div>
        <div className="pa"><button className="btn bo sm">Export CSV</button></div>
      </div>
      <div className="sr">
        <StatCard label="Gross Revenue MTD" value={`$${(data.total_gross/1000).toFixed(1)}k`} />
        <StatCard label="Platform Fees (30%)" value={`$${(data.platform_fee/1000).toFixed(1)}k`} variant="in" />
        <StatCard label="Instructor Payouts" value={`$${(data.instructor_payouts/1000).toFixed(1)}k`} variant="wa" />
        <StatCard label="Net Platform Profit" value={`$${(data.platform_fee/1000).toFixed(1)}k`} variant="ok" />
      </div>
      <div className="g21">
        <div className="card">
          <div className="ch"><span className="ch-t">Monthly Revenue Breakdown</span></div>
          <div className="cl"><div className="li"><div className="ld" style={{ background: 'var(--neon)' }} />Gross</div><div className="li"><div className="ld" style={{ background: 'var(--in)' }} />Net</div></div>
          <BarChart bars={grossBars} dual={netBars} />
        </div>
        <div className="card">
          <div className="ch"><span className="ch-t">By Language</span></div>
          <div className="gr">
            {[['🇫🇷','French','$42k',82,'var(--neon)'],['🇬🇧','English','$36k',70,'var(--ok)'],['🇪🇸','Spanish','$24k',52,'var(--in)'],['🇩🇪','German','$11k',24,'var(--wa)']].map(([flag,name,val,w,color]) => (
              <div key={String(name)} className="geo">
                <span className="gf">{flag}</span><span className="gn">{name}</span>
                <div className="gb"><div className="gfil" style={{ width: `${w}%`, background: String(color) }} /></div>
                <span className="gv" style={{ color: String(color) }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card">
        <div className="ch"><span className="ch-t">Revenue by Course</span></div>
        <table className="tbl"><thead><tr><th>Course</th><th>Instructor</th><th>Students</th><th>Gross</th><th>Fee (30%)</th><th>Instructor Net</th></tr></thead>
        <tbody>{data.top_courses?.map((c: any) => (
          <tr key={c.title}>
            <td><b>{c.title}</b></td>
            <td style={{ color: 'var(--mu)' }}>—</td>
            <td style={{ color: 'var(--neon)' }}>{c.students}</td>
            <td>${c.gross?.toLocaleString()}</td>
            <td style={{ color: 'var(--in)' }}>${(c.gross * 0.3).toFixed(0)}</td>
            <td style={{ color: 'var(--ok)', fontWeight: 600 }}>${(c.gross * 0.7).toFixed(0)}</td>
          </tr>
        ))}</tbody></table>
      </div>
    </div>
  )
}
