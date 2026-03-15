import React, { useEffect, useState } from 'react'
import api from '../../api/client'

const ICONS: Record<string, string> = { course: '📚', session: '🎙️', quiz: '📝', system: '⚙️', achievement: '🏆', payment: '💳' }

function getIcon(title: string) {
  const t = title.toLowerCase()
  if (t.includes('course')) return ICONS.course
  if (t.includes('session') || t.includes('live')) return ICONS.session
  if (t.includes('quiz') || t.includes('test')) return ICONS.quiz
  if (t.includes('payment') || t.includes('enroll')) return ICONS.payment
  if (t.includes('achievement') || t.includes('xp') || t.includes('level')) return ICONS.achievement
  return ICONS.system
}

export default function Notifications() {
  const [notifs, setNotifs] = useState<any[]>([])
  const [read, setRead] = useState<Set<number>>(new Set())
  useEffect(() => { api.get('/api/student/notifications').then(r => setNotifs(r.data)) }, [])

  function markRead(id: number) { setRead(prev => new Set([...prev, id])) }
  function markAll() { setRead(new Set(notifs.map(n => n.id))) }

  const unread = notifs.filter(n => !read.has(n.id)).length

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Notifications</h1><p>{unread} unread notification{unread !== 1 ? 's' : ''}</p></div>
        <div className="pa">
          <button className="btn bo sm" onClick={markAll}>Mark All Read</button>
        </div>
      </div>
      <div className="card">
        {notifs.length === 0 && <div style={{ color: 'var(--mu)', textAlign: 'center', padding: 40, fontFamily: 'JetBrains Mono', fontSize: 11 }}>No notifications</div>}
        {notifs.map(n => (
          <div key={n.id} className={`ni${!read.has(n.id) ? ' unr' : ''}`} onClick={() => markRead(n.id)} style={{ cursor: 'pointer' }}>
            <div className="nc" style={{ background: 'rgba(191,255,0,.08)' }}>{getIcon(n.title)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <span style={{ fontSize: 12, fontWeight: read.has(n.id) ? 400 : 600 }}>{n.title}</span>
                {!read.has(n.id) && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--neon)', display: 'inline-block', marginTop: 4, flexShrink: 0 }} />}
              </div>
              <div style={{ fontSize: 11, color: 'var(--mu)', lineHeight: 1.5 }}>{n.message}</div>
              <div style={{ fontSize: 9, color: 'var(--mu2)', fontFamily: 'JetBrains Mono', marginTop: 4 }}>
                {new Date(n.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
