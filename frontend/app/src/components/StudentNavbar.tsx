import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import api from '../api/client'

export default function Navbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const [dropOpen, setDropOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const dropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api.get('/api/student/notifications').then(r => setUnread(r.data.length)).catch(() => {})
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <nav className="nav">
      <Link to="/dashboard" className="logo">
        <div className="logo-mark">FF</div>
        <div className="logo-name">Fluent<span>Fusion</span></div>
      </Link>
      <div className="nav-r">
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--ok)', background: 'rgba(0,255,127,.1)', padding: '3px 8px', borderRadius: 4, border: '1px solid rgba(0,255,127,.2)' }}>STUDENT PORTAL</span>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--neon)', background: 'var(--ndim)', padding: '3px 8px', borderRadius: 4, border: '1px solid rgba(191,255,0,.2)' }}>
          ⚡ {user?.xp ?? 0} XP
        </div>

        {/* Bell */}
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => nav('/dashboard/notifications')}>
          <span style={{ fontSize: 18 }}>🔔</span>
          {unread > 0 && (
            <span style={{ position: 'absolute', top: -4, right: -4, background: '#FF4444', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </div>

        {/* Profile dropdown */}
        <div ref={dropRef} style={{ position: 'relative' }}>
          <div onClick={() => setDropOpen(o => !o)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '4px 8px', borderRadius: 8, background: dropOpen ? 'rgba(255,255,255,0.05)' : 'transparent', transition: 'background .15s' }}>
            <div className="nav-ava" style={{ cursor: 'pointer', margin: 0 }}>{user?.avatar_initials || 'ST'}</div>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#ddd', whiteSpace: 'nowrap' }}>{user?.name}</span>
            <span style={{ fontSize: 10, color: '#555' }}>{dropOpen ? '▲' : '▼'}</span>
          </div>

          {dropOpen && (
            <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, minWidth: 180, zIndex: 200, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #2a2a2a' }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>Student</div>
              </div>
              {[
                { label: '👤 Profile', path: '/dashboard/settings' },
                { label: '🔔 Notifications', path: '/dashboard/notifications' },
                { label: '⚙️ Settings', path: '/dashboard/settings' },
              ].map(item => (
                <div key={item.label} onClick={() => { nav(item.path); setDropOpen(false) }}
                  style={{ padding: '10px 16px', fontSize: 13, cursor: 'pointer', color: '#ccc', transition: 'background .1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#222')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  {item.label}
                </div>
              ))}
              <div style={{ borderTop: '1px solid #2a2a2a' }}>
                <div onClick={() => { logout(); setDropOpen(false) }}
                  style={{ padding: '10px 16px', fontSize: 13, cursor: 'pointer', color: '#FF4444', transition: 'background .1s' }}
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
