import React, { useEffect, useState } from 'react'
import api from '../../api/client'

export default function Notifications() {
  const [notifs, setNotifs] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [form, setForm] = useState({ title: '', message: '', target: 'all_students', course_id: '' })
  const [sending, setSending] = useState(false)

  const load = () => api.get('/api/instructor/notifications').then(r => setNotifs(Array.isArray(r.data) ? r.data : []))

  useEffect(() => {
    load()
    api.get('/api/instructor/courses').then(r => setCourses(Array.isArray(r.data) ? r.data : []))
  }, [])

  async function send() {
    if (!form.title.trim() || !form.message.trim()) return
    setSending(true)
    const payload: any = { title: form.title, message: form.message, target: form.target }
    if (form.target === 'course' && form.course_id) payload.course_id = Number(form.course_id)
    await api.post('/api/instructor/notifications', payload)
    setForm({ title: '', message: '', target: 'all_students', course_id: '' })
    await load()
    setSending(false)
  }

  const targetLabel = (t: string) => {
    if (t === 'all_students') return 'All Students'
    if (t.startsWith('course_')) {
      const cid = Number(t.replace('course_', ''))
      const c = courses.find(x => x.id === cid)
      return c ? `Course: ${c.title}` : t
    }
    return t
  }

  return (
    <div className="pg">
      <div className="ph"><div><h1>Notifications</h1><p>Send announcements to your students</p></div></div>

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
            <select className="sel" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value, course_id: '' }))}>
              <option value="all_students">All My Students</option>
              <option value="course">Specific Course Students</option>
            </select>
          </div>
        </div>
        {form.target === 'course' && (
          <div className="fg" style={{ marginBottom: 12 }}>
            <label className="lbl">Select Course</label>
            <select className="sel" value={form.course_id} onChange={e => setForm(f => ({ ...f, course_id: e.target.value }))}>
              <option value="">— Choose a course —</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.flag_emoji} {c.title}</option>)}
            </select>
          </div>
        )}
        <div className="fg">
          <label className="lbl">Message</label>
          <textarea className="inp" rows={3} placeholder="Write your message..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
        </div>
        <button className="btn bp" onClick={send} disabled={sending || (form.target === 'course' && !form.course_id)}>
          {sending ? 'Sending...' : 'Send Now'}
        </button>
      </div>

      {/* Received + sent history */}
      <div className="card">
        <div className="ch"><span className="ch-t">Notifications</span></div>
        {notifs.length === 0 && <div style={{ color: 'var(--mu)', fontSize: 12, padding: '20px 0', textAlign: 'center' }}>No notifications</div>}
        {notifs.map(n => (
          <div key={n.id} className="ni">
            <div className="nc" style={{ background: 'rgba(0,255,127,.1)' }}>🔔</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{n.title}</span>
                <span className="bdg bm" style={{ fontSize: 9 }}>{targetLabel(n.target)}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 3 }}>{n.message}</div>
              <div style={{ fontSize: 10, color: 'var(--mu)', fontFamily: 'JetBrains Mono', marginTop: 2 }}>{n.sent_at?.slice(0, 16).replace('T', ' ')}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
