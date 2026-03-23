import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import NotificationDetailModal from '../../components/NotificationDetailModal'

const TARGET_LABELS: Record<string, string> = {
  all: 'All Users', students: 'Students', instructors: 'Instructors'
}

const ACTIVITY_ICONS: Record<string, string> = {
  USER_REGISTERED: '👤', ENROLLMENT: '🎓', PAYMENT: '💳', PAYOUT: '💰', COURSE_SUBMITTED: '📚'
}

export default function Notifications() {
  const [tab, setTab] = useState<'send' | 'activity'>('send')
  const [notifs, setNotifs] = useState<any[]>([])
  const [activity, setActivity] = useState<any[]>([])
  const [stats, setStats] = useState({ all: 0, students: 0, instructors: 0 })
  const [form, setForm] = useState({ title: '', message: '', target: 'all', allow_replies: false })
  const [editing, setEditing] = useState<any>(null)
  const [sending, setSending] = useState(false)
  const [loadingActivity, setLoadingActivity] = useState(false)
  const [openId, setOpenId] = useState<number | null>(null)

  const loadNotifs = () =>
    api.get('/api/admin/notifications').then(r => setNotifs(Array.isArray(r.data) ? r.data : []))

  useEffect(() => {
    loadNotifs()
    api.post('/api/admin/notifications/mark-read').catch(() => {})
    Promise.all([
      api.get('/api/admin/users', { params: { role: 'student' } }),
      api.get('/api/admin/users', { params: { role: 'instructor' } }),
    ]).then(([s, i]) => setStats({ students: s.data.length, instructors: i.data.length, all: s.data.length + i.data.length }))
  }, [])

  useEffect(() => {
    if (tab === 'activity' && activity.length === 0) {
      setLoadingActivity(true)
      api.get('/api/admin/activity').then(r => setActivity(Array.isArray(r.data) ? r.data : [])).finally(() => setLoadingActivity(false))
    }
  }, [tab])

  async function send() {
    if (!form.title.trim() || !form.message.trim()) return
    setSending(true)
    await api.post('/api/admin/notifications', { ...form })
    setForm({ title: '', message: '', target: 'all', allow_replies: false })
    await loadNotifs()
    setSending(false)
  }

  async function saveEdit() {
    if (!editing) return
    await api.patch(`/api/admin/notifications/${editing.id}`, { title: editing.title, message: editing.message, target: editing.target })
    setEditing(null)
    loadNotifs()
  }

  async function del(id: number) {
    if (!confirm('Delete this notification?')) return
    await api.delete(`/api/admin/notifications/${id}`)
    loadNotifs()
  }

  const targetLabel = (t: string) => TARGET_LABELS[t] ?? t

  return (
    <div className="pg">
      <div className="ph"><div><h1>Notifications</h1><p>Send announcements and monitor platform activity</p></div></div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 16 }}>
        <div className={`tab${tab === 'send' ? ' active' : ''}`} onClick={() => setTab('send')}>📢 Notifications</div>
        <div className={`tab${tab === 'activity' ? ' active' : ''}`} onClick={() => setTab('activity')}>🔍 Platform Activity</div>
      </div>

      {tab === 'send' && (
        <>
          {/* Send form */}
          <div className="card" style={{ marginBottom: 16, borderColor: 'rgba(191,255,0,.2)' }}>
            <div style={{ fontFamily: 'Syne', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', marginBottom: 14 }}>Send Notification</div>
            <div className="g2">
              <div className="fg">
                <label className="lbl">Title</label>
                <input className="inp" placeholder="Notification title..." value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="fg">
                <label className="lbl">Target Audience</label>
                <select className="sel" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))}>
                  <option value="all">All Users ({stats.all})</option>
                  <option value="students">Students Only ({stats.students})</option>
                  <option value="instructors">Instructors Only ({stats.instructors})</option>
                </select>
              </div>
            </div>
            <div className="fg">
              <label className="lbl">Message</label>
              <textarea className="inp" rows={3} placeholder="Write your message..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer', marginBottom: 12 }}>
              <div className={`tgl${form.allow_replies ? ' on' : ''}`} onClick={() => setForm(f => ({ ...f, allow_replies: !f.allow_replies }))} />
              Allow recipients to reply
            </label>
            <button className="btn bp" onClick={send} disabled={sending}>{sending ? 'Sending...' : 'Send Now'}</button>
          </div>

          {/* History */}
          <div className="card">
            <div className="ch">
              <span className="ch-t">Notification History</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--mu)' }}>{notifs.length} total</span>
            </div>
            {notifs.length === 0 && <div style={{ color: 'var(--mu)', fontSize: 12, padding: '20px 0', textAlign: 'center' }}>No notifications sent yet</div>}
            <table className="tbl">
              <thead><tr><th>Title</th><th>Message</th><th>Target</th><th>Sent At</th><th>Recipients</th><th>Actions</th></tr></thead>
              <tbody>
                {notifs.map(n => (
                  <tr key={n.id} style={{ opacity: n.is_read === false ? 1 : 0.8, cursor: 'pointer' }} onClick={() => setOpenId(n.id)}>
                    <td style={{ fontWeight: 600, fontSize: 12 }}>
                      {n.is_read === false && <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#BFFF00', marginRight: 6, verticalAlign: 'middle' }} />}
                      {n.title}
                    </td>
                    <td style={{ fontSize: 11, color: 'var(--mu)', maxWidth: 260 }}>{n.message?.slice(0, 80)}{(n.message?.length ?? 0) > 80 ? '…' : ''}</td>
                    <td><span className="bdg bm">{targetLabel(n.target)}</span></td>
                    <td style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--mu)' }}>{n.sent_at?.slice(0, 16).replace('T', ' ')}</td>
                    <td style={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}>{n.recipients?.toLocaleString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn bo sm" style={{ fontSize: 11, padding: '3px 10px' }} onClick={() => setEditing({ ...n })}>Edit</button>
                        <button onClick={() => del(n.id)} style={{ background: 'rgba(255,68,68,.1)', border: '1px solid rgba(255,68,68,.3)', color: '#FF4444', borderRadius: 6, padding: '3px 10px', fontSize: 11, cursor: 'pointer' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'activity' && (
        <div className="card">
          <div className="ch">
            <span className="ch-t">Platform Activity Feed</span>
            <button className="btn bo sm" style={{ fontSize: 11 }} onClick={() => {
              setLoadingActivity(true)
              api.get('/api/admin/activity').then(r => setActivity(Array.isArray(r.data) ? r.data : [])).finally(() => setLoadingActivity(false))
            }}>↻ Refresh</button>
          </div>
          {loadingActivity && <div style={{ color: 'var(--mu)', fontSize: 12, padding: 20, textAlign: 'center' }}>Loading activity...</div>}
          {!loadingActivity && activity.length === 0 && <div style={{ color: 'var(--mu)', fontSize: 12, padding: 20, textAlign: 'center' }}>No activity yet</div>}
          <div className="ll">
            {activity.map((a, i) => (
              <div key={i} className="llog" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                  {ACTIVITY_ICONS[a.type] ?? '📌'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{a.text}</div>
                  {a.detail && <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 2 }}>{a.detail}</div>}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--mu)', flexShrink: 0, textAlign: 'right' }}>
                  <div>{a.ts ? new Date(a.ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</div>
                  <div>{a.ts ? new Date(a.ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {openId !== null && (
        <NotificationDetailModal notifId={openId} onClose={() => setOpenId(null)} />
      )}

      {/* Edit modal */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#151515', border: '1px solid #2a2a2a', borderRadius: 14, padding: 28, width: 480, maxWidth: '90vw' }}>
            <div style={{ fontFamily: 'Syne', fontSize: 15, fontWeight: 800, marginBottom: 18 }}>Edit Notification</div>
            <div className="fg" style={{ marginBottom: 12 }}>
              <label className="lbl">Title</label>
              <input className="inp" value={editing.title} onChange={e => setEditing((v: any) => ({ ...v, title: e.target.value }))} />
            </div>
            <div className="fg" style={{ marginBottom: 12 }}>
              <label className="lbl">Target</label>
              <select className="sel" value={editing.target} onChange={e => setEditing((v: any) => ({ ...v, target: e.target.value }))}>
                <option value="all">All Users</option>
                <option value="students">Students Only</option>
                <option value="instructors">Instructors Only</option>
              </select>
            </div>
            <div className="fg" style={{ marginBottom: 18 }}>
              <label className="lbl">Message</label>
              <textarea className="inp" rows={3} value={editing.message} onChange={e => setEditing((v: any) => ({ ...v, message: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn bp" onClick={saveEdit}>Save Changes</button>
              <button className="btn bo" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
