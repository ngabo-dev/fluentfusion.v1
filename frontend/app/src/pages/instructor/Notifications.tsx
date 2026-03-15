import React, { useEffect, useState } from 'react'
import api from '../../api/client'

export default function Notifications() {
  const [notifs, setNotifs] = useState<any[]>([])
  const [tab, setTab] = useState('all')
  useEffect(() => { api.get('/api/instructor/notifications').then(r => setNotifs(r.data)) }, [])

  const icons: any = { enrollment: '🎓', review: '⭐', pulse: '🧠', message: '💬', system: '✅' }

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Notifications</h1><p>Stay up to date with your activity</p></div>
        <div className="pa"><button className="btn bg sm">Mark all read</button></div>
      </div>
      <div className="tabs">
        {['all','unread','enrollments','reviews','pulse','system'].map(t => (
          <div key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)} {t === 'all' ? `(${notifs.length})` : ''}
          </div>
        ))}
      </div>
      <div className="card">
        {notifs.length === 0 && <div style={{ color: 'var(--mu)', fontSize: 12, padding: 20, textAlign: 'center' }}>No notifications</div>}
        {notifs.map(n => (
          <div key={n.id} className="ni">
            <div className="nc" style={{ background: 'rgba(0,255,127,.1)' }}>✅</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, lineHeight: 1.4 }}><b>{n.title}</b></div>
              <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 3 }}>{n.message}</div>
              <div style={{ fontSize: 10, color: 'var(--mu)', fontFamily: 'JetBrains Mono', marginTop: 2 }}>{n.sent_at?.slice(0,16).replace('T',' ')}</div>
            </div>
          </div>
        ))}
        {/* Static demo notifications */}
        <div className="ni unr"><div className="nc" style={{ background: 'rgba(0,255,127,.1)' }}>🎓</div><div style={{ flex: 1 }}><div style={{ fontSize: 12, lineHeight: 1.4 }}>3 new students enrolled in <b>French B2</b></div><div style={{ fontSize: 10, color: 'var(--mu)', fontFamily: 'JetBrains Mono', marginTop: 2 }}>2 min ago</div></div></div>
        <div className="ni unr"><div className="nc" style={{ background: 'rgba(255,184,0,.1)' }}>⭐</div><div style={{ flex: 1 }}><div style={{ fontSize: 12, lineHeight: 1.4 }}>Kwame L. left a 5-star review on <b>French B2</b></div><div style={{ fontSize: 10, color: 'var(--mu)', fontFamily: 'JetBrains Mono', marginTop: 2 }}>18 min ago</div></div></div>
        <div className="ni unr"><div className="nc" style={{ background: 'rgba(255,68,68,.1)' }}>🧠</div><div style={{ flex: 1 }}><div style={{ fontSize: 12, lineHeight: 1.4 }}>PULSE flagged <b>7 students</b> as Burning Out in French B2</div><div style={{ fontSize: 10, color: 'var(--mu)', fontFamily: 'JetBrains Mono', marginTop: 2 }}>1 hr ago</div></div></div>
      </div>
    </div>
  )
}
