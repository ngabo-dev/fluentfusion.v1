import React, { useEffect, useState } from 'react'
import api from '../../api/client'

export default function Notifications() {
  const [notifs, setNotifs] = useState<any[]>([])
  const [stats, setStats] = useState({ all: 0, students: 0, instructors: 0 })
  const [form, setForm] = useState({ title: '', message: '', target: 'all' })
  const [emailToggle, setEmailToggle] = useState(true)
  const [pushToggle, setPushToggle] = useState(false)

  useEffect(() => {
    api.get('/api/admin/notifications').then(r => setNotifs(r.data))
    api.get('/api/admin/users', { params: { role: 'student' } }).then(r => {
      const students = Array.isArray(r.data) ? r.data.length : 0
      api.get('/api/admin/users', { params: { role: 'instructor' } }).then(r2 => {
        const instructors = Array.isArray(r2.data) ? r2.data.length : 0
        setStats({ students, instructors, all: students + instructors })
      })
    })
  }, [])

  async function send() {
    if (!form.title || !form.message) return
    const recipients = form.target === 'all' ? stats.all : form.target === 'instructors' ? stats.instructors : stats.students
    await api.post('/api/admin/notifications', { ...form, recipients })
    setForm({ title: '', message: '', target: 'all' })
    api.get('/api/admin/notifications').then(r => setNotifs(r.data))
  }

  return (
    <div className="pg">
      <div className="ph"><div><h1>Notifications</h1><p>Send platform-wide announcements</p></div></div>
      <div className="card" style={{ marginBottom: 16, borderColor: 'rgba(191,255,0,.2)' }}>
        <div style={{ fontFamily: 'Syne', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', marginBottom: 14 }}>Send Notification</div>
        <div className="g2">
          <div className="fg"><label className="lbl">Notification Title</label><input className="inp" placeholder="Enter notification title..." value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div className="fg"><label className="lbl">Target Audience</label>
            <select className="sel" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))}>
              <option value="all">All Users</option><option value="students">Students Only</option><option value="instructors">Instructors Only</option>
            </select>
          </div>
        </div>
        <div className="fg"><label className="lbl">Message</label><textarea className="inp" rows={3} placeholder="Write your notification message... (max 500 chars)" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} /></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }} onClick={() => setEmailToggle(v => !v)}>
            <div className={`tgl${emailToggle ? ' on' : ''}`} />Also send by email
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }} onClick={() => setPushToggle(v => !v)}>
            <div className={`tgl${pushToggle ? ' on' : ''}`} />Send as push notification
          </label>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn bo sm">Preview</button>
          <button className="btn bp" onClick={send}>Send Now</button>
        </div>
      </div>
      <div className="card">
        <div className="ch"><span className="ch-t">Notification History</span></div>
        <table className="tbl"><thead><tr><th>Title</th><th>Target</th><th>Sent At</th><th>Recipients</th><th>Read Rate</th></tr></thead>
        <tbody>{notifs.map(n => (
          <tr key={n.id}>
            <td><b>{n.title}</b></td>
            <td><span className={`bdg ${n.target === 'all' ? 'bm' : n.target === 'instructors' ? 'bi' : 'bm'}`}>{n.target === 'all' ? 'All Users' : n.target === 'instructors' ? 'Instructors' : 'Students'}</span></td>
            <td style={{ color: 'var(--mu)', fontSize: 10 }}>{n.sent_at?.slice(0,16).replace('T',' ')}</td>
            <td>{n.recipients?.toLocaleString()}</td>
            <td><div className="mp"><div className="mt"><div className="mf" style={{ width: `${n.read_rate}%` }} /></div><span style={{ color: n.read_rate > 70 ? 'var(--ok)' : 'var(--wa)' }}>{n.read_rate}%</span></div></td>
          </tr>
        ))}</tbody></table>
      </div>
    </div>
  )
}
