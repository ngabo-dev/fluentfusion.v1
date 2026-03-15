import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import StatCard from '../../components/StatCard'
import BarChart from '../../components/BarChart'
import Avatar from '../../components/Avatar'
import Badge from '../../components/Badge'

const MONTHS = ['J','F','M','A','M','J','J','A','S','O','N','D']

export default function PulseEngine() {
  const [data, setData] = useState<any>(null)
  useEffect(() => { api.get('/api/admin/pulse').then(r => setData(r.data)) }, [])
  if (!data) return <div className="loading" />

  const pd = data.distribution ?? {}
  const total = data.total || 1
  const atRisk = (pd.burning_out ?? 0) + (pd.disengaged ?? 0)

  const trendBars = Array.from({ length: 30 }, (_, i) => ({
    value: Math.round(atRisk * (0.4 + 0.6 * Math.abs(Math.sin(i * 0.7 + 1)))),
    label: ''
  }))

  return (
    <div className="pg">
      <div className="ph"><div><h1>PULSE Engine</h1><p>AI-powered learner state classification · Platform-wide</p></div></div>
      <div className="card" style={{ marginBottom: 14, borderColor: 'rgba(191,255,0,.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'var(--mu)', textTransform: 'uppercase', marginBottom: 3 }}>Last Evaluated</div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Today, 07:10 UTC+2 · <span style={{ color: 'var(--ok)' }}>{total.toLocaleString()} learners classified</span></div>
          </div>
          <div style={{ display: 'flex', gap: 7 }}>
            <button className="btn bo sm">Schedule</button>
            <button className="btn bp">▶ Run PULSE Now</button>
          </div>
        </div>
      </div>
      <div className="sr sr5">
        <StatCard label="🚀 Thriving" value={(pd.thriving ?? 0).toLocaleString()} sub={`${Math.round((pd.thriving??0)/total*100)}% of learners`} variant="ok" />
        <StatCard label="😐 Coasting" value={(pd.coasting ?? 0).toLocaleString()} sub={`${Math.round((pd.coasting??0)/total*100)}% of learners`} variant="in" />
        <StatCard label="😓 Struggling" value={(pd.struggling ?? 0).toLocaleString()} sub={`${Math.round((pd.struggling??0)/total*100)}% of learners`} variant="wa" />
        <StatCard label="🔥 Burning Out" value={(pd.burning_out ?? 0).toLocaleString()} sub={`${Math.round((pd.burning_out??0)/total*100)}% of learners`} />
        <StatCard label="💤 Disengaged" value={(pd.disengaged ?? 0).toLocaleString()} sub={`${Math.round((pd.disengaged??0)/total*100)}% of learners`} variant="er" />
      </div>
      <div className="g21">
        <div className="card">
          <div className="ch"><span className="ch-t">30-Day State Trend</span></div>
          <BarChart bars={trendBars} />
        </div>
        <div className="card">
          <div className="ch"><span className="ch-t">At-Risk Detail</span></div>
          <div style={{ padding: 12, background: 'rgba(255,68,68,.06)', borderRadius: 'var(--r)', border: '1px solid rgba(255,68,68,.15)', marginBottom: 12 }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'var(--mu)' }}>AT-RISK (BURNING + DISENGAGED)</div>
            <div style={{ fontFamily: 'Syne', fontSize: 30, fontWeight: 800, color: 'var(--er)' }}>{atRisk.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: 'var(--mu)' }}>{Math.round(atRisk/total*100)}% of total platform learners</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.at_risk?.slice(0, 5).map((u: any) => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar initials={u.name.slice(0,2).toUpperCase()} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 500 }}>{u.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--mu)' }}>{u.last_active?.slice(0,10)}</div>
                </div>
                <Badge variant={u.pulse_state === 'disengaged' ? 'e' : 'e'}>{u.pulse_state?.replace('_',' ')}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
