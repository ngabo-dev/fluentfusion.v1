import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { useSidebar } from './SidebarContext'
import { useTheme } from './ThemeContext'
import api from '../api/client'
import { playNotificationSound } from '../utils/sounds'
import {
  Bell, MessageSquare, Search, Settings, LogOut,
  Zap, Brain, BarChart2, BookOpen, Sun, Moon,
} from 'lucide-react'

type Role = 'student' | 'instructor' | 'admin' | 'super_admin'

const ROUTES: Record<string, { bell: string; markRead: string; messages: string; search: string; settings: string; analytics?: string; pulse?: string }> = {
  student:     { bell: '/api/student/notifications/unread-count',    markRead: '/api/student/notifications/mark-read',    messages: '/dashboard/messages',      search: '/dashboard/catalog',      settings: '/dashboard/settings',      analytics: '/dashboard/progress', pulse: '/dashboard/progress' },
  instructor:  { bell: '/api/instructor/notifications/unread-count', markRead: '/api/instructor/notifications/mark-read', messages: '/instructor/messages',     search: '/instructor/students',    settings: '/instructor/settings',     analytics: '/instructor/analytics', pulse: '/instructor/pulse' },
  admin:       { bell: '/api/admin/notifications/unread-count',      markRead: '/api/admin/notifications/mark-read',      messages: '/admin/messages',          search: '/admin/users',            settings: '/admin/settings',          analytics: '/admin/analytics',      pulse: '/admin/pulse' },
  super_admin: { bell: '/api/admin/notifications/unread-count',      markRead: '/api/admin/notifications/mark-read',      messages: '/admin/messages',          search: '/admin/users',            settings: '/admin/settings',          analytics: '/admin/analytics',      pulse: '/admin/pulse' },
}

const PORTAL_LABEL: Record<string, { label: string; color: string; bg: string; border: string }> = {
  student:     { label: 'STUDENT',    color: 'var(--ok)',   bg: 'rgba(0,255,127,.08)',   border: 'rgba(0,255,127,.2)' },
  instructor:  { label: 'INSTRUCTOR', color: 'var(--in)',   bg: 'rgba(0,207,255,.08)',   border: 'rgba(0,207,255,.2)' },
  admin:       { label: 'ADMIN',      color: 'var(--er)',   bg: 'rgba(255,68,68,.08)',   border: 'rgba(255,68,68,.2)' },
  super_admin: { label: 'SUPER ADMIN',color: 'var(--er)',   bg: 'rgba(255,68,68,.08)',   border: 'rgba(255,68,68,.2)' },
}

export default function AppNavbar({ showThemeToggle = false }: { showThemeToggle?: boolean }) {
  const { user, logout } = useAuth()
  const { collapsed } = useSidebar()
  const { theme, toggleTheme } = useTheme()
  const nav = useNavigate()
  const role = (user?.role ?? 'student') as Role
  const routes = ROUTES[role] ?? ROUTES.student
  const portal = PORTAL_LABEL[role] ?? PORTAL_LABEL.student

  const [unread, setUnread] = useState(0)
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)
  const prevUnread = useRef(0)

  useEffect(() => {
    const fetch = () => api.get(routes.bell).then(r => {
      const count = r.data.count ?? 0
      if (prevUnread.current > 0 && count > prevUnread.current) playNotificationSound()
      prevUnread.current = count
      setUnread(count)
    }).catch(() => {})
    fetch()
    const t = setInterval(fetch, 30000)
    return () => clearInterval(t)
  }, [routes.bell])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function goNotifications() {
    api.post(routes.markRead).catch(() => {})
    setUnread(0)
    nav(routes.bell.replace('/unread-count', '').replace('/api/student', '/dashboard').replace('/api/instructor', '/instructor').replace('/api/admin', '/admin'))
  }

  const notifPath = role === 'student' ? '/dashboard/notifications' : role === 'instructor' ? '/instructor/notifications' : '/admin/notifications'

  return (
    <nav className="nav" data-collapsed={collapsed ? 'true' : 'false'}>
      <div className="nav-r">
        {/* Role portal badge */}
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: portal.color, background: portal.bg, padding: '3px 8px', borderRadius: 4, border: `1px solid ${portal.border}`, letterSpacing: '.1em' }}>
          {portal.label}
        </span>

        {/* XP — students only */}
        {role === 'student' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--neon)', background: 'var(--ndim)', padding: '3px 8px', borderRadius: 4, border: '1px solid rgba(191,255,0,.2)' }}>
            <Zap size={10} /> {user?.xp ?? 0} XP
          </div>
        )}

        <div className="nav-sep" />

        {/* Search / Catalog */}
        <button className="nav-icon" onClick={() => nav(routes.search)} title={role === 'student' ? 'Course Catalog' : role === 'instructor' ? 'Students' : 'Users'}>
          <Search size={17} />
        </button>

        {/* Analytics */}
        {routes.analytics && (
          <button className="nav-icon" onClick={() => nav(routes.analytics!)} title="Analytics">
            <BarChart2 size={17} />
          </button>
        )}

        {/* PULSE */}
        {routes.pulse && (
          <button className="nav-icon" onClick={() => nav(routes.pulse!)} title="PULSE">
            <Brain size={17} />
          </button>
        )}

        {/* Messages */}
        <button className="nav-icon" onClick={() => nav(routes.messages)} title="Messages">
          <MessageSquare size={17} />
        </button>

        {/* Notifications bell */}
        <button className="nav-icon" onClick={() => { api.post(routes.markRead).catch(() => {}); setUnread(0); nav(notifPath) }} title="Notifications">
          <Bell size={17} />
          {unread > 0 && <span className="nav-icon-badge">{unread > 9 ? '9+' : unread}</span>}
        </button>

        {/* Theme toggle — shown only when enabled (admin) */}
        {showThemeToggle && (
          <button
            className="nav-icon"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        )}

        <div className="nav-sep" />

        {/* Settings */}
        <button className="nav-icon" onClick={() => nav(routes.settings)} title="Settings">
          <Settings size={17} />
        </button>

        {/* Avatar + dropdown */}
        <div ref={dropRef} style={{ position: 'relative' }}>
          <div onClick={() => setDropOpen(o => !o)} style={{ cursor: 'pointer', marginLeft: 4 }}>
            {user?.avatar_url
              ? <img src={user.avatar_url} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${portal.border}` }} />
              : <div className="nav-ava">{user?.avatar_initials || role.slice(0,2).toUpperCase()}</div>
            }
          </div>

          {dropOpen && (
            <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, minWidth: 200, zIndex: 300, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', gap: 10 }}>
                {user?.avatar_url
                  ? <img src={user.avatar_url} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                  : <div style={{ width: 32, height: 32, borderRadius: '50%', background: portal.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: portal.color }}>{user?.avatar_initials || '??'}</div>
                }
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
                  <div style={{ fontSize: 10, color: portal.color, fontFamily: 'JetBrains Mono', marginTop: 1 }}>{portal.label}</div>
                </div>
              </div>
              {[
                { label: 'My Courses', icon: <BookOpen size={14} />, path: role === 'student' ? '/dashboard/courses' : role === 'instructor' ? '/instructor/courses' : '/admin/approvals' },
                { label: 'Settings',   icon: <Settings size={14} />, path: routes.settings },
                { label: 'Notifications', icon: <Bell size={14} />, path: notifPath },
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
