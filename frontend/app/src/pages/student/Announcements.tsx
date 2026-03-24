import React, { useEffect, useState } from 'react'
import api from '../../api/client'

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function Announcements() {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    api.get('/api/student/announcements').then(r => setItems(Array.isArray(r.data) ? r.data : []))
    api.post('/api/student/announcements/mark-read').catch(() => {})
  }, [])

  const unread = items.filter(n => !n.is_read).length

  return (
    <div className="pg">
      <div className="ph">
        <div>
          <h1>Announcements</h1>
          <p>{unread > 0 ? `${unread} unread` : 'All caught up'}</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {items.length === 0 && (
          <div style={{ color: 'var(--mu)', textAlign: 'center', padding: 48, fontFamily: 'JetBrains Mono', fontSize: 11 }}>
            No announcements yet
          </div>
        )}
        {items.map((n, i) => (
          <div key={n.id} style={{
            display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 20px',
            borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none',
            background: !n.is_read ? 'rgba(191,255,0,.03)' : 'transparent',
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: !n.is_read ? 'rgba(191,255,0,.1)' : 'rgba(255,255,255,.05)',
              border: `1px solid ${!n.is_read ? 'rgba(191,255,0,.2)' : 'rgba(255,255,255,.08)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>📢</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: !n.is_read ? 700 : 500, color: !n.is_read ? '#fff' : '#bbb' }}>
                  {n.title}
                </span>
                {!n.is_read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--neon)', display: 'inline-block' }} />}
              </div>
              <div style={{ fontSize: 12, color: 'var(--mu)', lineHeight: 1.6 }}>{n.message}</div>
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
