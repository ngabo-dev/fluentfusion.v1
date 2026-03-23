import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/client'

const TYPE_ICON: Record<string, string> = {
  course: '📚', session: '🎙️', quiz: '📝', payment: '💳',
  achievement: '🏆', message: '💬', system: '⚙️',
}

function getIcon(title: string) {
  const t = title?.toLowerCase() ?? ''
  if (t.includes('course') || t.includes('approved') || t.includes('rejected')) return TYPE_ICON.course
  if (t.includes('session') || t.includes('live') || t.includes('meeting')) return TYPE_ICON.session
  if (t.includes('quiz') || t.includes('test') || t.includes('due')) return TYPE_ICON.quiz
  if (t.includes('payment') || t.includes('enroll')) return TYPE_ICON.payment
  if (t.includes('achievement') || t.includes('xp') || t.includes('level')) return TYPE_ICON.achievement
  if (t.includes('message') || t.includes('messaged')) return TYPE_ICON.message
  return TYPE_ICON.system
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function Notifications() {
  const [notifs, setNotifs] = useState<any[]>([])

  useEffect(() => {
    api.get('/api/student/notifications').then(r => setNotifs(Array.isArray(r.data) ? r.data : []))
    api.post('/api/student/notifications/mark-read').catch(() => {})
  }, [])

  const unread = notifs.filter(n => !n.is_read).length

  return (
    <div className="pg">
      <div className="ph">
        <div>
          <h1>Notifications</h1>
          <p>{unread > 0 ? `${unread} unread` : 'All caught up'}</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {notifs.length === 0 && (
          <div style={{ color: 'var(--mu)', textAlign: 'center', padding: 48, fontFamily: 'JetBrains Mono', fontSize: 11 }}>
            No notifications yet
          </div>
        )}
        {notifs.map((n, i) => (
          <div key={n.id} style={{
            display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 20px',
            borderBottom: i < notifs.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none',
            background: !n.is_read ? 'rgba(191,255,0,.03)' : 'transparent',
            transition: 'background .15s',
          }}>
            {/* Icon */}
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: !n.is_read ? 'rgba(191,255,0,.1)' : 'rgba(255,255,255,.05)',
              border: `1px solid ${!n.is_read ? 'rgba(191,255,0,.2)' : 'rgba(255,255,255,.08)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>
              {getIcon(n.title)}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: !n.is_read ? 700 : 500, color: !n.is_read ? '#fff' : '#bbb' }}>
                  {n.title}
                </span>
                {!n.is_read && (
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--neon)', flexShrink: 0, display: 'inline-block' }} />
                )}
              </div>

              {/* Message with clickable link word */}
              <div style={{ fontSize: 12, color: 'var(--mu)', lineHeight: 1.6 }}>
                {n.message}
                {n.link && (
                  <> — <Link to={n.link} style={{ color: 'var(--neon)', textDecoration: 'underline', fontWeight: 600 }}>
                    View →
                  </Link></>
                )}
              </div>

              <div style={{ fontSize: 10, color: 'var(--mu2)', fontFamily: 'JetBrains Mono', marginTop: 5 }}>
                {timeAgo(n.sent_at)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
