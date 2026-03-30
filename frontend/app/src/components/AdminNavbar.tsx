import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import api from '../api/client'
import { useSidebar } from './SidebarContext'
import { playNotificationSound } from '../utils/sounds'
import { Bell, Settings, LogOut, Megaphone, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { collapsed, toggle } = useSidebar()
  const nav = useNavigate()
  const [dropOpen, setDropOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const dropRef = useRef<HTMLDivElement>(null)
  const prevUnread = useRef(0)

  useEffect(() => {
    const fetch = () => api.get('/api/admin/notifications/unread-count').then(r => {
      const count = r.data.count ?? 0
      if (prevUnread.current > 0 && count > prevUnread.current) playNotificationSound()
      prevUnread.current = count
      setUnread(count)
    }).catch(() => {})
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
    api.post('/api/admin/notifications/mark-read').catch(() => {})
    setUnread(0)
    nav('/admin/notifications')
  }

  return (
    <nav className="nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={toggle} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mu)', padding: '4px 6px', borderRadius: 6, display: 'flex', alignItems: 'center', transition: 'color .15s' }}
          title={collapsed ? 'Show sidebar' : 'Hide sidebar'}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        <Link to="/admin" className="logo">
          <div className="logo-mark">FF</div>
          <div className="logo-name">Fluent<span>Fusion</span></div>
        </Link>
      </div>

      <div className="nav-r">
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--er)', background: 'rgba(255,68,68,.1)', padding: '3px 8px', borderRadius: 4, border: '1px solid rgba(255,68,68,.2)' }}>ADMIN PORTAL</span>

        {/* Bell */}
        <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={goNotifications}>
          <Bell size={20} color="var(--mu)" strokeWidth={1.8} />
          {unread > 0 && (
            <span style={{ position: 'absolute', top: -5, right: -5, background: '#FF4444', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </div>

        {/* Avatar dropdown */}
        <div ref={dropRef} style={{ position: 'relative' }}>
          <div onClick={() => setDropOpen(o => !o)} style={{ cursor: 'pointer' }}>
            {user?.avatar_url
              ? <img src={user.avatar_url} alt="" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,68,68,.3)' }} />
              : <div className="nav-ava" style={{ cursor: 'pointer', margin: 0 }}>{user?.avatar_initials || 'AD'}</div>
            }
          </div>

          {dropOpen && (
            <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, minWidth: 190, zIndex: 200, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', gap: 10 }}>
                {user?.avatar_url
                  ? <img src={user.avatar_url} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                  : <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,68,68,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--er)' }}>{user?.avatar_initials || 'AD'}</div>
                }
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
                  <div style={{ fontSize: 11, color: '#666', marginTop: 1 }}>Admin</div>
                </div>
              </div>
              {[
                { label: 'Announcements', icon: <Megaphone size={14} />, path: '/admin/announcements' },
                { label: 'Notifications',  icon: <Bell size={14} />,     path: '/admin/notifications' },
                { label: 'Settings',       icon: <Settings size={14} />, path: '/admin/settings' },
              ].map(item => (
                <div key={item.label} onClick={() => { nav(item.path); setDropOpen(false) }}
                  style={{ padding: '10px 16px', fontSize: 13, cursor: 'pointer', color: '#ccc', display: 'flex', alignItems: 'center', gap: 10 }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#222')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  {item.icon} {item.label}
                </div>
              ))}
              <div style={{ borderTop: '1px solid #2a2a2a' }}>
                <div onClick={() => { logout(); setDropOpen(false) }}
                  style={{ padding: '10px 16px', fontSize: 13, cursor: 'pointer', color: '#FF4444', display: 'flex', alignItems: 'center', gap: 10 }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,68,68,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <LogOut size={14} /> Logout
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
