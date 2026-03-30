import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/client'
import { AlertTriangle, Check, CheckCircle, ClipboardList, Download, FileText, RefreshCw, Shield, Users } from 'lucide-react'

// ── Overview ──────────────────────────────────────────────────────────────

export function EthicsOverview() {
  const nav = useNavigate()
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    api.get('/api/v1/ethics/overview').then(r => setStats(r.data)).catch(() => {})
  }, [])

  const cards = stats ? [
    { label: 'REC Approval', value: stats.rec_approval.code, sub: `Valid to ${stats.rec_approval.valid_to}`, color: 'var(--ok)', icon: <Shield size={20} /> },
    { label: 'Consent Records', value: stats.total_consent_records, sub: 'Total collected', color: 'var(--neon)', icon: <CheckCircle size={20} /> },
    { label: 'Pending DSRs', value: stats.pending_dsrs, sub: 'Data subject requests', color: stats.pending_dsrs > 0 ? 'var(--wa)' : 'var(--ok)', icon: <Users size={20} /> },
    { label: 'PULSE Feedback', value: stats.pending_pulse_feedback, sub: 'Disagreements logged', color: 'var(--in)', icon: <RefreshCw size={20} /> },
    { label: 'Ethics Changes', value: stats.ethics_change_log_count, sub: 'Logged changes', color: 'var(--mu)', icon: <ClipboardList size={20} /> },
    { label: 'Processing Activities', value: stats.processing_activities, sub: 'GDPR Art. 30 register', color: 'var(--neon)', icon: <FileText size={20} /> },
  ] : []

  const subPages = [
    { path: '/admin/ethics/data-requests', label: 'Data Subject Requests', desc: 'Review and resolve user data requests' },
    { path: '/admin/ethics/processing-register', label: 'Processing Register', desc: 'GDPR Article 30 activity register' },
    { path: '/admin/ethics/change-log', label: 'Ethics Change Log', desc: 'Log changes and notify REC' },
    { path: '/admin/ethics/pulse-fairness', label: 'PULSE Fairness', desc: 'Fairness audits and feedback analysis' },
    { path: '/admin/ethics/consent-versions', label: 'Consent Versions', desc: 'Manage document versions' },
  ]

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Ethics &amp; Compliance</h1><p>REC Approval: J26BSE087 · GDPR + Rwanda Law 058/2021</p></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,255,127,.08)', border: '1px solid rgba(0,255,127,.2)', borderRadius: 8, padding: '6px 14px' }}>
          <Check size={14} style={{ color: 'var(--ok)' }} />
          <span style={{ fontSize: 12, color: 'var(--ok)', fontFamily: 'JetBrains Mono' }}>REC Active</span>
        </div>
      </div>

      <div className="sr sr3" style={{ marginBottom: 28 }}>
        {cards.map(c => (
          <div key={c.label} className="card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ width: 40, height: 40, background: `${c.color}18`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color, flexShrink: 0 }}>{c.icon}</div>
            <div>
              <div style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 800, color: c.color }}>{c.value ?? '—'}</div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{c.label}</div>
              <div style={{ fontSize: 11, color: 'var(--mu)' }}>{c.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="g3">
        {subPages.map(p => (
          <div key={p.path} className="card" style={{ cursor: 'pointer' }} onClick={() => nav(p.path)}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{p.label}</div>
            <div style={{ fontSize: 12, color: 'var(--mu)' }}>{p.desc}</div>
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--neon)' }}>Open →</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Data Subject Requests ─────────────────────────────────────────────────

export function EthicsDataRequests() {
  const [dsrs, setDsrs] = useState<any[]>([])
  const [filter, setFilter] = useState('')
  const [acting, setActing] = useState<number | null>(null)
  const [notes, setNotes] = useState<Record<number, string>>({})

  const load = () => api.get('/api/v1/ethics/data-rights', { params: filter ? { status: filter } : {} }).then(r => setDsrs(r.data)).catch(() => {})
  useEffect(() => { load() }, [filter])

  async function resolve(id: number, status: string) {
    setActing(id)
    await api.patch(`/api/v1/ethics/data-rights/${id}`, { status, resolution_notes: notes[id] || '' }).catch(() => {})
    setActing(null)
    load()
  }

  const STATUS_COLOR: Record<string, string> = { pending: 'var(--wa)', in_progress: '#00CFFF', completed: 'var(--ok)', rejected: 'var(--er)' }

  return (
    <div className="pg">
      <div className="ph"><div><h1>Data Subject Requests</h1><p>Review and resolve user data requests within 30 days</p></div></div>
      <div className="ab" style={{ marginBottom: 16 }}>
        <select className="sel" value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="">All Status</option>
          {['pending', 'in_progress', 'completed', 'rejected'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>
      <div className="card" style={{ padding: 0 }}>
        <table className="tbl">
          <thead><tr><th>User</th><th>Type</th><th>Status</th><th>Submitted</th><th>Details</th><th>Actions</th></tr></thead>
          <tbody>
            {dsrs.map(d => (
              <tr key={d.id}>
                <td><div style={{ fontWeight: 500 }}>{d.user}</div><div style={{ fontSize: 11, color: 'var(--mu)' }}>{d.email}</div></td>
                <td style={{ textTransform: 'capitalize' }}>{d.request_type}</td>
                <td><span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: STATUS_COLOR[d.status] }}>{d.status.replace('_', ' ')}</span></td>
                <td style={{ fontSize: 12, color: 'var(--mu)' }}>{new Date(d.created_at).toLocaleDateString()}</td>
                <td style={{ fontSize: 12, color: 'var(--mu)', maxWidth: 200 }}>{d.details || '—'}</td>
                <td>
                  {d.status === 'pending' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <input className="inp" placeholder="Resolution notes…" value={notes[d.id] || ''} onChange={e => setNotes(p => ({ ...p, [d.id]: e.target.value }))} style={{ fontSize: 11, padding: '4px 8px' }} />
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn bp sm" disabled={acting === d.id} onClick={() => resolve(d.id, 'in_progress')}>In Progress</button>
                        <button className="btn bo sm" disabled={acting === d.id} onClick={() => resolve(d.id, 'completed')}>Complete</button>
                        <button className="btn bd sm" disabled={acting === d.id} onClick={() => resolve(d.id, 'rejected')}>Reject</button>
                      </div>
                    </div>
                  )}
                  {d.status !== 'pending' && <span style={{ fontSize: 11, color: 'var(--mu)' }}>{d.resolved_at ? new Date(d.resolved_at).toLocaleDateString() : '—'}</span>}
                </td>
              </tr>
            ))}
            {dsrs.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--mu)', padding: 40 }}>No requests found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Processing Register ───────────────────────────────────────────────────

export function EthicsProcessingRegister() {
  const [items, setItems] = useState<any[]>([])
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ activity_name: '', purpose: '', legal_basis: '', data_categories: '', data_subjects: '', recipients: '', retention_period: '', cross_border_transfer: false, safeguards: '' })

  useEffect(() => { api.get('/api/v1/ethics/processing-register').then(r => setItems(r.data)).catch(() => {}) }, [])

  async function add() {
    await api.post('/api/v1/ethics/processing-register', form).catch(() => {})
    setAdding(false)
    api.get('/api/v1/ethics/processing-register').then(r => setItems(r.data)).catch(() => {})
  }

  const ff = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Processing Register</h1><p>GDPR Article 30 — Record of Processing Activities</p></div>
        <button className="btn bp" onClick={() => setAdding(p => !p)}>+ Add Activity</button>
      </div>

      {adding && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 15, marginBottom: 16 }}>New Processing Activity</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[['activity_name', 'Activity Name *'], ['purpose', 'Purpose'], ['legal_basis', 'Legal Basis'], ['data_categories', 'Data Categories'], ['data_subjects', 'Data Subjects'], ['recipients', 'Recipients'], ['retention_period', 'Retention Period'], ['safeguards', 'Safeguards']].map(([k, label]) => (
              <div key={k} className="fg" style={{ marginBottom: 0 }}>
                <label className="lbl">{label}</label>
                <input className="inp" value={(form as any)[k]} onChange={e => ff(k, e.target.value)} />
              </div>
            ))}
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginTop: 12, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.cross_border_transfer} onChange={e => ff('cross_border_transfer', e.target.checked)} />
            Cross-border data transfer
          </label>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="btn bp" onClick={add}>Save Activity</button>
            <button className="btn bo" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <table className="tbl">
          <thead><tr><th>Activity</th><th>Purpose</th><th>Legal Basis</th><th>Retention</th><th>Cross-Border</th><th>Updated</th></tr></thead>
          <tbody>
            {items.map(i => (
              <tr key={i.id}>
                <td style={{ fontWeight: 500 }}>{i.activity_name}</td>
                <td style={{ fontSize: 12, color: 'var(--mu)' }}>{i.purpose}</td>
                <td style={{ fontSize: 12, color: 'var(--mu)' }}>{i.legal_basis}</td>
                <td style={{ fontSize: 12, color: 'var(--mu)' }}>{i.retention_period}</td>
                <td>{i.cross_border_transfer ? <span style={{ color: 'var(--wa)', fontSize: 12 }}>Yes</span> : <span style={{ color: 'var(--ok)', fontSize: 12 }}>No</span>}</td>
                <td style={{ fontSize: 11, color: 'var(--mu)' }}>{i.updated_at ? new Date(i.updated_at).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Ethics Change Log ─────────────────────────────────────────────────────

export function EthicsChangeLog() {
  const [entries, setEntries] = useState<any[]>([])
  const [form, setForm] = useState({ change_type: 'Procedure', description: '', notify_rec: true })
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState('')

  const load = () => api.get('/api/v1/ethics/ethics-change-log').then(r => setEntries(r.data)).catch(() => {})
  useEffect(() => { load() }, [])

  async function submit() {
    setSubmitting(true)
    await api.post('/api/v1/ethics/ethics-change-log', form).catch(() => {})
    setMsg(form.notify_rec ? 'Change logged and REC notified via email.' : 'Change logged.')
    setForm({ change_type: 'Procedure', description: '', notify_rec: true })
    setSubmitting(false)
    load()
  }

  return (
    <div className="pg">
      <div className="ph"><div><h1>Ethics Change Log</h1><p>Log changes and notify the Research Ethics Committee</p></div></div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        <div className="card">
          <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 15, marginBottom: 16 }}>Log New Change</div>
          {msg && <div style={{ background: 'rgba(0,255,127,.08)', border: '1px solid rgba(0,255,127,.2)', borderRadius: 8, padding: '8px 12px', color: 'var(--ok)', fontSize: 13, marginBottom: 12 }}>{msg}</div>}
          <div className="fg">
            <label className="lbl">Change Type</label>
            <select className="inp" value={form.change_type} onChange={e => setForm(p => ({ ...p, change_type: e.target.value }))}>
              {['Procedure', 'Methodology', 'Scope', 'Other'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="fg">
            <label className="lbl">Description *</label>
            <textarea className="inp" rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe the change in detail..." style={{ resize: 'vertical' }} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', marginBottom: 16 }}>
            <input type="checkbox" checked={form.notify_rec} onChange={e => setForm(p => ({ ...p, notify_rec: e.target.checked }))} />
            Notify REC automatically (researchethics@alueducation.com)
          </label>
          <button className="btn bp" onClick={submit} disabled={submitting || !form.description.trim()} style={{ width: '100%', justifyContent: 'center' }}>
            {submitting ? 'Logging…' : 'Log Change'}
          </button>
        </div>

        <div>
          <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 15, marginBottom: 12 }}>Change History</div>
          {entries.map(e => (
            <div key={e.id} className="card" style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{e.change_type}</span>
                <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: e.notified_rec ? 'var(--ok)' : 'var(--mu)' }}>
                  {e.notified_rec ? '✓ REC Notified' : 'Not notified'}
                </span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--mu)', marginBottom: 4 }}>{e.description}</div>
              <div style={{ fontSize: 11, color: 'var(--mu)', fontFamily: 'JetBrains Mono' }}>{new Date(e.created_at).toLocaleString()}</div>
            </div>
          ))}
          {entries.length === 0 && <div style={{ color: 'var(--mu)', fontSize: 13 }}>No changes logged yet.</div>}
        </div>
      </div>
    </div>
  )
}

// ── PULSE Fairness ────────────────────────────────────────────────────────

export function EthicsPulseFairness() {
  const [data, setData] = useState<any>(null)

  useEffect(() => { api.get('/api/v1/ethics/pulse-feedback').then(r => setData(r.data)).catch(() => {}) }, [])

  const STATE_COLORS: Record<string, string> = { thriving: '#2ecc71', coasting: '#3498db', struggling: '#e67e22', burning_out: '#e74c3c', disengaged: '#95a5a6' }

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>PULSE Fairness Dashboard</h1><p>Monitor classification fairness and learner feedback</p></div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn bo"><RefreshCw size={16} /> Run Fairness Audit</button>
          <button className="btn bp"><Download size={16} /> Export for Retraining</button>
        </div>
      </div>

      <div className="sr sr3" style={{ marginBottom: 24 }}>
        <div className="card">
          <div style={{ fontSize: 11, color: 'var(--mu)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', marginBottom: 4 }}>Total Feedback</div>
          <div style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, color: 'var(--neon)' }}>{data?.total ?? '—'}</div>
          <div style={{ fontSize: 12, color: 'var(--mu)' }}>Disagreements logged</div>
        </div>
        <div className="card">
          <div style={{ fontSize: 11, color: 'var(--mu)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', marginBottom: 4 }}>Last Audit</div>
          <div style={{ fontFamily: 'Syne', fontSize: 18, fontWeight: 800 }}>06 Feb 2026</div>
          <div style={{ fontSize: 12, color: 'var(--mu)' }}>REC approved</div>
        </div>
        <div className="card">
          <div style={{ fontSize: 11, color: 'var(--mu)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', marginBottom: 4 }}>REC Approval</div>
          <div style={{ fontFamily: 'Syne', fontSize: 18, fontWeight: 800, color: 'var(--ok)' }}>J26BSE087</div>
          <div style={{ fontSize: 12, color: 'var(--mu)' }}>Valid to 06 Aug 2026</div>
        </div>
      </div>

      {data?.by_state && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 15, marginBottom: 16 }}>Feedback by State</div>
          {Object.entries(data.by_state).map(([state, count]: any) => (
            <div key={state} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{ width: 110, fontSize: 12, color: STATE_COLORS[state] || 'var(--mu)', textTransform: 'capitalize' }}>{state.replace('_', ' ')}</span>
              <div style={{ flex: 1, height: 6, background: 'var(--bdr)', borderRadius: 99 }}>
                <div style={{ height: '100%', width: `${data.total ? (count / data.total) * 100 : 0}%`, background: STATE_COLORS[state] || 'var(--mu)', borderRadius: 99 }} />
              </div>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--mu)', width: 30, textAlign: 'right' }}>{count}</span>
            </div>
          ))}
        </div>
      )}

      {data?.recent?.length > 0 && (
        <div className="card">
          <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 15, marginBottom: 12 }}>Recent Feedback</div>
          <table className="tbl">
            <thead><tr><th>User ID</th><th>Classified As</th><th>Self-Reported</th><th>Comment</th><th>Date</th></tr></thead>
            <tbody>
              {data.recent.map((f: any) => (
                <tr key={f.id}>
                  <td style={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}>#{f.user_id}</td>
                  <td style={{ color: STATE_COLORS[f.current_state], fontSize: 12, textTransform: 'capitalize' }}>{f.current_state?.replace('_', ' ')}</td>
                  <td style={{ color: STATE_COLORS[f.user_reported_state] || 'var(--mu)', fontSize: 12, textTransform: 'capitalize' }}>{f.user_reported_state?.replace('_', ' ') || '—'}</td>
                  <td style={{ fontSize: 12, color: 'var(--mu)' }}>{f.comment || '—'}</td>
                  <td style={{ fontSize: 11, color: 'var(--mu)' }}>{new Date(f.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Consent Versions ──────────────────────────────────────────────────────

export function EthicsConsentVersions() {
  const [versions, setVersions] = useState<any[]>([])

  useEffect(() => { api.get('/api/v1/ethics/consent/versions').then(r => setVersions(r.data)).catch(() => {}) }, [])

  const DOC_LABELS: Record<string, string> = {
    terms: 'Terms and Conditions', privacy_policy: 'Privacy Policy',
    eula: 'EULA', pulse_disclosure: 'PULSE Disclosure',
    cookie_policy: 'Cookie Policy', children_policy: "Children's Data Policy",
  }

  return (
    <div className="pg">
      <div className="ph"><div><h1>Consent Versions</h1><p>Track document versions and user consent history</p></div></div>
      <div className="card" style={{ padding: 0 }}>
        <table className="tbl">
          <thead><tr><th>Document</th><th>Version</th><th>Effective Date</th><th>Created</th></tr></thead>
          <tbody>
            {versions.map(v => (
              <tr key={v.id}>
                <td style={{ fontWeight: 500 }}>{DOC_LABELS[v.document_type] || v.document_type}</td>
                <td style={{ fontFamily: 'JetBrains Mono', fontSize: 12 }}>v{v.version_number}</td>
                <td style={{ fontSize: 12, color: 'var(--mu)' }}>{new Date(v.effective_date).toLocaleDateString()}</td>
                <td style={{ fontSize: 12, color: 'var(--mu)' }}>{new Date(v.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
