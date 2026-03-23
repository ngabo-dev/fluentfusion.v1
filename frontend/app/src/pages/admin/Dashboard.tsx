import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import StatCard from '../../components/StatCard'
import BarChart from '../../components/BarChart'
import LiveSessionBanner from '../../components/LiveSessionBanner'

const MONTHS = ['J','F','M','A','M','J','J','A','S','O','N','D']

export default function AdminDashboard() {
  const [dash, setDash] = useState<any>(null)
  const [geo, setGeo] = useState<any>(null)
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/api/admin/dashboard'),
      api.get('/api/admin/geo'),
      api.get('/api/admin/reports'),
    ]).then(([d, g, r]) => {
      setDash(d.data)
      setGeo(g.data)
      setReports(Array.isArray(r.data) ? r.data : [])
    }).finally(() => setLoading(false))
  }, [])

  if (loading || !dash) return <div className="loading" />

  const monthly = dash.monthly_revenue ?? []
  const grossBars = monthly.map((m: any) => ({ value: Math.round(m.gross / 1000), label: MONTHS[m.month - 1] ?? '' }))
  const netBars   = monthly.map((m: any) => ({ value: Math.round(m.net   / 1000), label: '' }))

  const pd = dash.pulse_distribution ?? {}
  const pulseTotal = Object.values(pd).reduce((a: any, b: any) => a + b, 0) as number
  const atRisk = (pd.burning_out ?? 0) + (pd.disengaged ?? 0)
  const openReports = dash.open_reports ?? 0
  const languages = geo?.languages ?? []
  const maxLang   = languages[0]?.users ?? 1

  return (
    <div className="pg">
      <LiveSessionBanner endpoint="/api/meetings" />
      <div className="ph">
        <div>
          <h1>Admin Overview</h1>
          <p>Production · {new Date().toISOString().slice(0, 10)} · {new Date().toUTCString().slice(17, 22)} UTC</p>
        </div>
      </div>

      {/* KPI row */}
      <div className="sr sr5" style={{ marginBottom: 16 }}>
        <StatCard label="Total Users"      value={dash.total_users?.toLocaleString()}                        deltaUp />
        <StatCard label="Students"         value={dash.total_students?.toLocaleString()}                    deltaUp variant="in" />
        <StatCard label="Platform Revenue" value={`$${(dash.total_revenue / 1000).toFixed(1)}k`}            deltaUp variant="ok" />
        <StatCard label="Active Courses"   value={dash.active_courses}                                      deltaUp variant="in" />
        <StatCard label="Pending Actions"  value={(dash.pending_payouts ?? 0) + (dash.open_reports ?? 0) + (dash.pending_courses ?? 0)} sub={`${dash.pending_courses ?? 0} courses · ${dash.pending_payouts ?? 0} payouts · ${dash.open_reports ?? 0} reports`} variant={(dash.pending_payouts ?? 0) + (dash.open_reports ?? 0) + (dash.pending_courses ?? 0) > 0 ? 'wa' : undefined} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr', gap: 12, marginBottom: 12 }}>

        {/* Revenue chart */}
        <div className="card">
          <div className="ch">
            <span className="ch-t">Platform Revenue — {new Date().getFullYear()}</span>
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'var(--mu)' }}>TOTAL GROSS</div>
              <div style={{ fontFamily: 'Syne', fontSize: 17, fontWeight: 800, color: 'var(--ok)' }}>${(dash.total_revenue / 1000).toFixed(1)}k</div>
            </div>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'var(--mu)' }}>PLATFORM FEES (30%)</div>
              <div style={{ fontFamily: 'Syne', fontSize: 17, fontWeight: 800, color: 'var(--neon)' }}>${(dash.total_revenue * 0.3 / 1000).toFixed(1)}k</div>
            </div>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'var(--mu)' }}>INSTRUCTOR PAYOUTS</div>
              <div style={{ fontFamily: 'Syne', fontSize: 17, fontWeight: 800, color: 'var(--wa)' }}>${(dash.total_revenue * 0.7 / 1000).toFixed(1)}k</div>
            </div>
          </div>
          {grossBars.length > 0
            ? <BarChart bars={grossBars} dual={netBars} />
            : <div style={{ textAlign: 'center', padding: 24, color: 'var(--mu)', fontSize: 12, fontFamily: 'JetBrains Mono' }}>No revenue data yet</div>
          }
        </div>

        {/* PULSE distribution */}
        <div className="card">
          <div className="ch"><span className="ch-t">PULSE Platform</span></div>
          {pulseTotal === 0
            ? <div style={{ textAlign: 'center', padding: 24, color: 'var(--mu)', fontSize: 12, fontFamily: 'JetBrains Mono' }}>No learner data yet</div>
            : (
              <div className="gr">
                {([
                  ['🚀 Thriving',    pd.thriving,    'var(--ok)'],
                  ['😐 Coasting',    pd.coasting,    'var(--in)'],
                  ['😓 Struggling',  pd.struggling,  'var(--wa)'],
                  ['🔥 Burning Out', pd.burning_out, '#FF8C00'],
                  ['💤 Disengaged',  pd.disengaged,  'var(--er)'],
                ] as [string, number, string][]).map(([label, val, color]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 10, color: 'var(--mu)', width: 84, flexShrink: 0 }}>{label}</span>
                    <div style={{ flex: 1, height: 4, background: 'var(--bdr)', borderRadius: 99 }}>
                      <div style={{ width: `${pulseTotal ? Math.round((val || 0) / pulseTotal * 100) : 0}%`, height: '100%', background: color, borderRadius: 99 }} />
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color, width: 32, textAlign: 'right' }}>{(val || 0).toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ marginTop: 10, padding: 8, background: 'rgba(255,68,68,.06)', borderRadius: 'var(--r)', border: '1px solid rgba(255,68,68,.15)' }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'var(--mu)' }}>AT-RISK LEARNERS</div>
                  <div style={{ fontFamily: 'Syne', fontSize: 17, fontWeight: 800, color: 'var(--er)' }}>{atRisk.toLocaleString()}</div>
                </div>
              </div>
            )
          }
        </div>

        {/* Top languages from DB */}
        <div className="card">
          <div className="ch"><span className="ch-t">Top Languages</span></div>
          {languages.length === 0
            ? <div style={{ textAlign: 'center', padding: 24, color: 'var(--mu)', fontSize: 12, fontFamily: 'JetBrains Mono' }}>No language data yet</div>
            : (
              <div className="gr">
                {languages.map((l: any) => (
                  <div key={l.name} className="geo">
                    <span className="gf">{l.flag}</span>
                    <span className="gn">{l.name}</span>
                    <div className="gb"><div className="gfil" style={{ width: `${Math.round(l.users / maxLang * 100)}%` }} /></div>
                    <span className="gv">{l.users.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>

      {/* Open reports list */}
      {openReports > 0 && (
        <div className="card">
          <div className="ch">
            <span className="ch-t">Open Reports</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--er)' }}>{openReports} unresolved</span>
          </div>
          <table className="tbl">
            <thead><tr><th>Type</th><th>Content</th><th>Opened</th><th>Status</th></tr></thead>
            <tbody>
              {reports.filter((r: any) => r.status === 'open').slice(0, 5).map((r: any) => (
                <tr key={r.id}>
                  <td><span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(255,68,68,.1)', color: 'var(--er)' }}>{r.report_type}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--mu)', maxWidth: 340 }}>{r.content?.slice(0, 80)}…</td>
                  <td style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--mu)' }}>{r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'}</td>
                  <td><span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(255,184,0,.1)', color: 'var(--wa)' }}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
