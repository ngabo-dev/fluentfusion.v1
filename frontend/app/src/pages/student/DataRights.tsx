import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import { AlertTriangle, Check, Download, FileText, Shield, Trash2 } from 'lucide-react'

const TABS = ['My Consents', 'Data Requests', 'Download My Data', 'Delete Account']

const CONSENT_LABELS: Record<string, string> = {
  terms_and_conditions: 'Terms and Conditions',
  privacy_policy: 'Privacy Policy',
  pulse_automated_processing: 'PULSE Automated Processing',
  marketing_communications: 'Marketing Communications',
  live_session_recording: 'Live Session Recording',
  parental_consent: 'Parental Consent',
  cookie_consent: 'Cookie Consent',
  data_processing_general: 'General Data Processing',
}

const DSR_TYPES = ['access', 'correction', 'deletion', 'portability', 'restriction', 'objection']
const DSR_STATUS_COLOR: Record<string, string> = {
  pending: 'var(--wa)', in_progress: '#00CFFF', completed: 'var(--ok)', rejected: 'var(--er)'
}

export default function DataRights() {
  const [tab, setTab] = useState(0)
  const [consents, setConsents] = useState<any[]>([])
  const [dsrs, setDsrs] = useState<any[]>([])
  const [dsrType, setDsrType] = useState('access')
  const [dsrDetails, setDsrDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deletePw, setDeletePw] = useState('')

  useEffect(() => {
    api.get('/api/v1/ethics/consent/me').then(r => setConsents(r.data)).catch(() => {})
    api.get('/api/v1/ethics/data-rights/me').then(r => setDsrs(r.data)).catch(() => {})
  }, [])

  async function revoke(consent_type: string) {
    if (!confirm(`Revoke consent for "${CONSENT_LABELS[consent_type] || consent_type}"? This may affect some platform features.`)) return
    await api.delete(`/api/v1/ethics/consent/me/${consent_type}`).catch(() => {})
    api.get('/api/v1/ethics/consent/me').then(r => setConsents(r.data)).catch(() => {})
  }

  async function submitDSR() {
    setSubmitting(true); setMsg(''); setErr('')
    try {
      const r = await api.post('/api/v1/ethics/data-rights', { request_type: dsrType, details: dsrDetails })
      setMsg(`Request submitted. Reference: ${r.data.reference}. We will respond within 30 days.`)
      setDsrDetails('')
      api.get('/api/v1/ethics/data-rights/me').then(r => setDsrs(r.data)).catch(() => {})
    } catch (e: any) {
      setErr(e.response?.data?.detail || 'Failed to submit request')
    } finally { setSubmitting(false) }
  }

  async function requestExport() {
    setSubmitting(true); setMsg(''); setErr('')
    try {
      const r = await api.post('/api/v1/ethics/data-rights', { request_type: 'access', details: 'Data export request — please compile and email all my data.' })
      setMsg(`Export requested (${r.data.reference}). You will receive an email within 72 hours with a secure download link.`)
    } catch (e: any) {
      setErr(e.response?.data?.detail || 'Failed to request export')
    } finally { setSubmitting(false) }
  }

  async function requestDeletion() {
    if (!deletePw.trim()) { setErr('Please enter your password to confirm deletion.'); return }
    setSubmitting(true); setMsg(''); setErr('')
    try {
      const r = await api.post('/api/v1/ethics/data-rights', {
        request_type: 'deletion',
        details: `Account deletion request confirmed by user. Password provided for verification.`,
      })
      setMsg(`Deletion request submitted (${r.data.reference}). Your account will be deactivated and all data deleted within 30 days. A confirmation email has been sent.`)
    } catch (e: any) {
      setErr(e.response?.data?.detail || 'Failed to submit deletion request')
    } finally { setSubmitting(false) }
  }

  // Deduplicate consents — show latest per type
  const latestConsents = Object.values(
    consents.reduce((acc: any, c: any) => {
      if (!acc[c.consent_type] || new Date(c.accepted_at) > new Date(acc[c.consent_type].accepted_at)) {
        acc[c.consent_type] = c
      }
      return acc
    }, {})
  ) as any[]

  return (
    <div className="pg">
      <div className="ph">
        <div>
          <h1>Data &amp; Privacy</h1>
          <p>Manage your consents, data requests, and account privacy</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={16} style={{ color: 'var(--neon)' }} />
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--mu)' }}>GDPR + Law 058/2021</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--bdr)', marginBottom: 24, gap: 0 }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => { setTab(i); setMsg(''); setErr('') }}
            style={{ padding: '12px 20px', background: 'none', border: 'none', borderBottom: `2px solid ${tab === i ? 'var(--neon)' : 'transparent'}`, color: tab === i ? 'var(--neon)' : 'var(--mu)', cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
            {t}
          </button>
        ))}
      </div>

      {msg && <div style={{ background: 'rgba(0,255,127,.08)', border: '1px solid rgba(0,255,127,.2)', borderRadius: 8, padding: '10px 14px', color: 'var(--ok)', fontSize: 13, marginBottom: 16, display: 'flex', gap: 8 }}><Check size={16} />{msg}</div>}
      {err && <div style={{ background: 'rgba(255,68,68,.08)', border: '1px solid rgba(255,68,68,.2)', borderRadius: 8, padding: '10px 14px', color: 'var(--er)', fontSize: 13, marginBottom: 16, display: 'flex', gap: 8 }}><AlertTriangle size={16} />{err}</div>}

      {/* Tab 0 — My Consents */}
      {tab === 0 && (
        <div>
          <p style={{ fontSize: 13, color: 'var(--mu)', marginBottom: 16 }}>
            These are the consents you have given to FluentFusion. You can revoke optional consents at any time.
          </p>
          {latestConsents.length === 0 && (
            <div style={{ color: 'var(--mu)', fontSize: 13, padding: 40, textAlign: 'center' }}>No consent records found.</div>
          )}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {latestConsents.map((c: any, i: number) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: i < latestConsents.length - 1 ? '1px solid var(--bdr)' : 'none', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{CONSENT_LABELS[c.consent_type] || c.consent_type}</div>
                  <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 2, fontFamily: 'JetBrains Mono' }}>
                    v{c.version || '1.0'} · {c.accepted ? `Accepted ${new Date(c.accepted_at).toLocaleDateString()}` : `Revoked ${c.revoked_at ? new Date(c.revoked_at).toLocaleDateString() : ''}`}
                  </div>
                </div>
                <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', padding: '3px 10px', borderRadius: 99, background: c.accepted ? 'rgba(0,255,127,.1)' : 'rgba(255,68,68,.1)', color: c.accepted ? 'var(--ok)' : 'var(--er)' }}>
                  {c.accepted ? 'Active' : 'Revoked'}
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <a href={`/${c.consent_type.replace(/_/g, '-')}`} target="_blank" rel="noreferrer"
                    style={{ fontSize: 11, color: 'var(--neon)', textDecoration: 'none', padding: '4px 10px', border: '1px solid rgba(191,255,0,.2)', borderRadius: 6 }}>
                    View
                  </a>
                  {c.accepted && !['terms_and_conditions', 'privacy_policy'].includes(c.consent_type) && (
                    <button onClick={() => revoke(c.consent_type)}
                      style={{ fontSize: 11, color: 'var(--er)', background: 'none', border: '1px solid rgba(255,68,68,.2)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 1 — Data Requests */}
      {tab === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
          <div className="card">
            <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 15, marginBottom: 16 }}>Submit a Request</div>
            <div className="fg">
              <label className="lbl">Request Type</label>
              <select className="inp" value={dsrType} onChange={e => setDsrType(e.target.value)}>
                {DSR_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div className="fg">
              <label className="lbl">Details (optional)</label>
              <textarea className="inp" rows={4} value={dsrDetails} onChange={e => setDsrDetails(e.target.value)}
                placeholder="Describe your request in more detail..." style={{ resize: 'vertical' }} />
            </div>
            <button className="btn bp" onClick={submitDSR} disabled={submitting} style={{ width: '100%', justifyContent: 'center' }}>
              {submitting ? 'Submitting…' : 'Submit Request'}
            </button>
            <p style={{ fontSize: 11, color: 'var(--mu)', marginTop: 10, textAlign: 'center' }}>
              We will respond within 30 days as required by law.
            </p>
          </div>

          <div>
            <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 15, marginBottom: 12 }}>Past Requests</div>
            {dsrs.length === 0 && <div style={{ color: 'var(--mu)', fontSize: 13 }}>No requests submitted yet.</div>}
            {dsrs.map((d: any) => (
              <div key={d.id} className="card" style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{d.request_type.charAt(0).toUpperCase() + d.request_type.slice(1)}</span>
                  <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: DSR_STATUS_COLOR[d.status] || 'var(--mu)' }}>{d.status.replace('_', ' ')}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--mu)' }}>Submitted: {new Date(d.created_at).toLocaleDateString()}</div>
                {d.resolution_notes && <div style={{ fontSize: 12, color: 'var(--mu)', marginTop: 6, padding: '6px 10px', background: 'var(--card2)', borderRadius: 6 }}>{d.resolution_notes}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2 — Download My Data */}
      {tab === 2 && (
        <div className="card" style={{ maxWidth: 560 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, background: 'rgba(191,255,0,.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--neon)', flexShrink: 0 }}>
              <Download size={22} />
            </div>
            <div>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16, marginBottom: 4 }}>Request Data Export</div>
              <p style={{ fontSize: 13, color: 'var(--mu)', lineHeight: 1.6 }}>
                We will compile all data we hold about you — account information, learning history, PULSE records, consent logs — into a JSON file and email it to you within <strong style={{ color: 'var(--fg)' }}>72 hours</strong>.
              </p>
            </div>
          </div>
          <div style={{ background: 'var(--card2)', border: '1px solid var(--bdr)', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 12, color: 'var(--mu)' }}>
            <strong style={{ color: 'var(--fg)' }}>What is included:</strong> Profile data, enrolled courses, lesson progress, quiz scores, PULSE state history, consent records, messages, payment history.
          </div>
          <button className="btn bp" onClick={requestExport} disabled={submitting} style={{ width: '100%', justifyContent: 'center' }}>
            <Download size={16} /> {submitting ? 'Requesting…' : 'Request Data Export'}
          </button>
        </div>
      )}

      {/* Tab 3 — Delete Account */}
      {tab === 3 && (
        <div className="card" style={{ maxWidth: 560, border: '1px solid rgba(255,68,68,.2)' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, background: 'rgba(255,68,68,.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--er)', flexShrink: 0 }}>
              <Trash2 size={22} />
            </div>
            <div>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16, marginBottom: 4, color: 'var(--er)' }}>Delete My Account</div>
              <p style={{ fontSize: 13, color: 'var(--mu)', lineHeight: 1.6 }}>
                This will permanently delete your account and all associated data within 30 days. This action cannot be undone.
              </p>
            </div>
          </div>
          <div style={{ background: 'rgba(255,68,68,.05)', border: '1px solid rgba(255,68,68,.15)', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 12, color: '#FF8888' }}>
            <strong>What will be deleted:</strong> Your profile, enrolled courses, learning progress, messages, payment history, and all personal data. Anonymised PULSE data may be retained for research purposes per our Privacy Policy.
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', marginBottom: 14 }}>
            <input type="checkbox" checked={deleteConfirm} onChange={e => setDeleteConfirm(e.target.checked)} />
            I understand this action is permanent and cannot be undone.
          </label>
          {deleteConfirm && (
            <div className="fg">
              <label className="lbl">Confirm with your password</label>
              <input className="inp" type="password" value={deletePw} onChange={e => setDeletePw(e.target.value)} placeholder="Enter your password" />
            </div>
          )}
          <button className="btn bd" onClick={requestDeletion} disabled={!deleteConfirm || submitting}
            style={{ width: '100%', justifyContent: 'center', opacity: deleteConfirm ? 1 : 0.4 }}>
            <Trash2 size={16} /> {submitting ? 'Submitting…' : 'Submit Deletion Request'}
          </button>
        </div>
      )}
    </div>
  )
}
