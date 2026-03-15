import React, { useEffect, useState } from 'react'
import api from '../../api/client'

export default function Reports() {
  const [reports, setReports] = useState<any[]>([])
  const [tab, setTab] = useState('open')
  const load = () => api.get('/api/admin/reports', { params: { status: tab } }).then(r => setReports(r.data))
  useEffect(() => { load() }, [tab])

  async function update(id: number, status: string) { await api.patch(`/api/admin/reports/${id}`, { status }); load() }

  const typeColor: any = { HARASSMENT: 'var(--er)', SPAM: 'var(--wa)', CONTENT: 'var(--in)' }
  const typeBg: any = { HARASSMENT: 'rgba(255,68,68,.1)', SPAM: 'rgba(255,184,0,.1)', CONTENT: 'rgba(0,207,255,.1)' }

  return (
    <div className="pg">
      <div className="ph"><div><h1>Reports</h1><p>Community-flagged content requiring review</p></div></div>
      {tab === 'open' && reports.some(r => r.report_type === 'HARASSMENT') && (
        <div className="alr ac" style={{ marginBottom: 14 }}>
          <span>🚨</span><div style={{ flex: 1 }}><b>Harassment reports require immediate review</b></div>
        </div>
      )}
      <div className="tabs">
        {['open','resolved','dismissed'].map(t => (
          <div key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)} {tab === t ? `(${reports.length})` : ''}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {reports.map(r => (
          <div key={r.id} className="card" style={{ borderLeft: `3px solid ${typeColor[r.report_type] || 'var(--mu)'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
              <span className="mb2" style={{ background: typeBg[r.report_type], color: typeColor[r.report_type] }}>{r.report_type}</span>
              <span style={{ fontSize: 9, color: 'var(--mu)' }}>{r.created_at?.slice(0,10)}</span>
            </div>
            <div style={{ background: 'var(--card2)', borderRadius: 'var(--r)', padding: 9, border: '1px solid var(--bdr)', fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--mu)', marginBottom: 9 }}>{r.content}</div>
            {tab === 'open' && (
              <div style={{ display: 'flex', gap: 6 }}>
                {r.report_type === 'HARASSMENT' && <button className="btn bd sm" onClick={() => update(r.id, 'resolved')}>Ban User</button>}
                <button className="btn bd sm" onClick={() => update(r.id, 'resolved')}>Remove Content</button>
                <button className="btn bg sm" onClick={() => update(r.id, 'dismissed')}>Dismiss</button>
              </div>
            )}
          </div>
        ))}
        {reports.length === 0 && <div style={{ color: 'var(--mu)', fontSize: 12, padding: 20, textAlign: 'center' }}>No reports in this category</div>}
      </div>
    </div>
  )
}
