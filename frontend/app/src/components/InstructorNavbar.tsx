import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import api from '../api/client'
import { useSidebar } from './SidebarContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { collapsed, toggle } = useSidebar()
  const nav = useNavigate()
  const [dropOpen, setDropOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const dropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetch = () => api.get('/api/instructor/notifications/unread-count').then(r => setUnread(r.data.count ?? 0)).catch(() => {})
    fetch()
    const t = setInterval(fetch, 30000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function goNotifications() {
    api.post('/api/instructor/notifications/mark-read').catch(() => {})
    setUnread(0)
    nav('/instructor/notifications')
  }

  return (
    <nav className="nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={toggle} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mu)', fontSize: 18, padding: '4px 6px', borderRadius: 6, lineHeight: 1, transition: 'color .15s' }}
          title={collapsed ? 'Show sidebar' : 'Hide sidebar'}>
          {collapsed ? '▶' : '◀'}
        </button>
        <Link to="/instructor" className="logo">
          <div className="logo-mark">FF</div>
          <div className="logo-name">Fluent<span>Fusion</span></div>
        </Link>
      </div>
      <div className="nav-r">
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--in)', background: 'rgba(0,207,255,.1)', padding: '3px 8px', borderRadius: 4, border: '1px solid rgba(0,207,255,.2)' }}>INSTRUCTOR PORTAL</span>

        {/* Bell */}
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={goNotifications}>
          <span style={{ fontSize: 18 }}>🔔</span>
          {unread > 0 && (
            <span style={{ position: 'absolute', top: -4, right: -4, background: '#FF4444', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </div>

        {/* Avatar only */}
        <div ref={dropRef} style={{ position: 'relative' }}>
          <div onClick={() => setDropOpen(o => !o)} style={{ cursor: 'pointer' }}>
            {user?.avatar_url
              ? <img src={user.avatar_url} alt="" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,207,255,.3)' }} />
              : <div className="nav-ava" style={{ cursor: 'pointer', margin: 0 }}>{user?.avatar_initials || 'IN'}</div>
            }
          </div>

          {dropOpen && (
            <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, minWidth: 190, zIndex: 200, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', gap: 10 }}>
                {user?.avatar_url
                  ? <img src={user.avatar_url} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                  : <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,207,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--in)' }}>{user?.avatar_initials || 'IN'}</div>
                }
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
                  <div style={{ fontSize: 11, color: '#666', marginTop: 1 }}>Instructor</div>
                </div>
              </div>
              {[
                { label: '📢 Announcements', path: '/instructor/announcements' },
                { label: '🔔 Notifications', path: '/instructor/notifications' },
                { label: '⚙️ Settings', path: '/instructor/settings' },
              ].map(item => (
                <div key={item.label} onClick={() => { nav(item.path); setDropOpen(false) }}
                  style={{ padding: '10px 16px', fontSize: 13, cursor: 'pointer', color: '#ccc' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#222')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  {item.label}
                </div>
              ))}
              <div style={{ borderTop: '1px solid #2a2a2a' }}>
                <div onClick={() => { logout(); setDropOpen(false) }}
                  style={{ padding: '10px 16px', fontSize: 13, cursor: 'pointer', color: '#FF4444' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,68,68,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  🚪 Logout
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
