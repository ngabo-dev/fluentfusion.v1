import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import StatCard from '../../components/StatCard'
import BarChart from '../../components/BarChart'
import Avatar from '../../components/Avatar'
import Badge from '../../components/Badge'
import Progress from '../../components/Progress'

const MONTHS = ['J','F','M','A','M','J','J','A','S','O','N','D']

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null)

  useEffect(() => { api.get('/api/admin/dashboard').then(r => setData(r.data)) }, [])

  if (!data) return <div className="loading" />

  const monthly = data.monthly_revenue ?? []
  const grossBars = monthly.map((m: any, i: number) => ({ value: Math.round(m.gross / 1000), label: MONTHS[m.month - 1] ?? '' }))
  const netBars = monthly.map((m: any) => ({ value: Math.round(m.net / 1000), label: '' }))
  const pd = data.pulse_distribution ?? {}
  const atRisk = (pd.burning_out ?? 0) + (pd.disengaged ?? 0)

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>// Admin Overview</h1><p>Production · {new Date().toISOString().slice(0,10)} · {new Date().toUTCString().slice(17,22)} UTC</p></div>
        <div className="pa">
          <button className="btn bd sm">⚠ 2 Critical Alerts</button>
          <button className="btn bg sm">🔔</button>
        </div>
      </div>

      <div className="alr ac" style={{ marginBottom: 7 }}>
        <span style={{ fontSize: 13, flexShrink: 0 }}>🚨</span>
        <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 700, color: 'var(--er)', marginBottom: 2 }}>CDN Degraded — Media delivery latency +340ms above baseline</div><div style={{ fontSize: 11, color: 'var(--mu)' }}>Affecting lesson video playback. Auto-failover initiated. ETA 15min.</div></div>
        <button className="btn bo sm">INVESTIGATE</button>
      </div>
      <div className="alr aw" style={{ marginBottom: 16 }}>
        <span>⚠️</span>
        <div style={{ flex: 1 }}><b>23 Unresolved Reports — Oldest 48h ago</b><div style={{ fontSize: 11, color: 'var(--mu)' }}>8 reports involve potential harassment. SLA breached.</div></div>
        <button className="btn bo sm">REVIEW</button>
      </div>

      <div className="sr sr5">
        <StatCard label="Total Users" value={data.total_users?.toLocaleString()} delta="↑ +1,204 this month" deltaUp />
        <StatCard label="Platform Revenue" value={`$${(data.total_revenue/1000).toFixed(1)}k`} delta="↑ +14.2%" deltaUp variant="ok" />
        <StatCard label="Active Courses" value={data.active_courses} delta="↑ +12 this week" deltaUp variant="in" />
        <StatCard label="Retention Rate" value="73.8%" delta="↑ +2.1%" deltaUp variant="wa" />
        <StatCard label="Pending Reviews" value={data.pending_payouts + 7} sub="⚠ 7 courses · 23 reports" variant="er" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div className="card">
          <div className="ch"><span className="ch-t">Platform Revenue — {new Date().getFullYear()}</span><span className="ch-a">Export</span></div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
            <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'var(--mu)' }}>MTD GROSS</div><div style={{ fontFamily: 'Syne', fontSize: 17, fontWeight: 800, color: 'var(--ok)' }}>${(data.total_revenue/1000).toFixed(1)}k</div></div>
            <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'var(--mu)' }}>FEES</div><div style={{ fontFamily: 'Syne', fontSize: 17, fontWeight: 800, color: 'var(--neon)' }}>${(data.total_revenue*0.3/1000).toFixed(1)}k</div></div>
            <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'var(--mu)' }}>PAYOUTS</div><div style={{ fontFamily: 'Syne', fontSize: 17, fontWeight: 800, color: 'var(--wa)' }}>${(data.total_revenue*0.7/1000).toFixed(1)}k</div></div>
          </div>
          <BarChart bars={grossBars} dual={netBars} />
        </div>

        <div className="card">
          <div className="ch"><span className="ch-t">PULSE Platform</span><span className="ch-a">Drill ↗</span></div>
          <div className="gr">
            {[['🚀 Thriving', pd.thriving, 'var(--ok)'], ['😐 Coasting', pd.coasting, 'var(--in)'], ['😓 Struggling', pd.struggling, 'var(--wa)'], ['🔥 Burning Out', pd.burning_out, '#FF8C00'], ['💤 Disengaged', pd.disengaged, 'var(--er)']].map(([label, val, color]) => (
              <div key={String(label)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 10, color: 'var(--mu)', width: 80 }}>{label}</span>
                <div style={{ flex: 1, height: 4, background: 'var(--bdr)', borderRadius: 99 }}><div style={{ width: `${Math.round((Number(val)||0) / (data.total_users||1) * 100)}%`, height: '100%', background: String(color), borderRadius: 99 }} /></div>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: String(color) }}>{(Number(val)||0).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ marginTop: 10, padding: 8, background: 'rgba(255,68,68,.06)', borderRadius: 'var(--r)', border: '1px solid rgba(255,68,68,.15)' }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'var(--mu)' }}>AT-RISK</div>
              <div style={{ fontFamily: 'Syne', fontSize: 17, fontWeight: 800, color: 'var(--er)' }}>{atRisk.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="ch"><span className="ch-t">Top Languages</span></div>
          <div className="gr">
            {[['🇫🇷','French',9820,'var(--neon)'],['🇬🇧','English',8401,'var(--ok)'],['🇪🇸','Spanish',6234,'var(--in)'],['🇩🇪','German',2880,'var(--wa)'],['🇯🇵','Japanese',1920,'var(--er)']].map(([flag,name,val,color]) => (
              <div key={String(name)} className="geo">
                <span className="gf">{flag}</span><span className="gn">{name}</span>
                <div className="gb"><div className="gfil" style={{ width: `${Math.round(Number(val)/9820*82)}%`, background: String(color) }} /></div>
                <span className="gv" style={{ color: String(color) }}>{Number(val).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
