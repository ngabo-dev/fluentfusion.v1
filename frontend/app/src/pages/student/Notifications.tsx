import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import NotificationDetailModal from '../../components/NotificationDetailModal'

const ICONS: Record<string, string> = { course: '📚', session: '🎙️', quiz: '📝', system: '⚙️', achievement: '🏆', payment: '💳' }

function getIcon(title: string) {
  const t = title?.toLowerCase() ?? ''
  if (t.includes('course')) return ICONS.course
  if (t.includes('session') || t.includes('live')) return ICONS.session
  if (t.includes('quiz') || t.includes('test')) return ICONS.quiz
  if (t.includes('payment') || t.includes('enroll')) return ICONS.payment
  if (t.includes('achievement') || t.includes('xp') || t.includes('level')) return ICONS.achievement
  return ICONS.system
}

export default function Notifications() {
  const [notifs, setNotifs] = useState<any[]>([])
  const [openId, setOpenId] = useState<number | null>(null)

  useEffect(() => {
    api.get('/api/student/notifications').then(r => setNotifs(Array.isArray(r.data) ? r.data : []))
    api.post('/api/student/notifications/mark-read').catch(() => {})
  }, [])

  const unread = notifs.filter(n => n.is_read === false).length

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Notifications</h1><p>{unread > 0 ? `${unread} unread` : 'All caught up'}</p></div>
      </div>
      <div className="card">
        {notifs.length === 0 && <div style={{ color: 'var(--mu)', textAlign: 'center', padding: 40, fontFamily: 'JetBrains Mono', fontSize: 11 }}>No notifications</div>}
        {notifs.map(n => (
          <div key={n.id} className={`ni${n.is_read === false ? ' unr' : ''}`}
            onClick={() => setOpenId(n.id)}
            style={{ cursor: 'pointer' }}>
            <div className="nc" style={{ background: 'rgba(191,255,0,.08)' }}>{getIcon(n.title)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <span style={{ fontSize: 12, fontWeight: n.is_read === false ? 600 : 400 }}>{n.title}</span>
                {n.is_read === false && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--neon)', display: 'inline-block', marginTop: 4, flexShrink: 0 }} />}
              </div>
              <div style={{ fontSize: 11, color: 'var(--mu)', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 400 }}>{n.message}</div>
              <div style={{ fontSize: 9, color: 'var(--mu2)', fontFamily: 'JetBrains Mono', marginTop: 4 }}>
                {new Date(n.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#444', flexShrink: 0 }}>→</div>
          </div>
        ))}
      </div>

      {openId !== null && (
        <NotificationDetailModal notifId={openId} onClose={() => setOpenId(null)} />
      )}
    </div>
  )
}
