import React, { useEffect, useState, useRef } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useSidebar } from './SidebarContext'
import { useAuth } from './AuthContext'
import api from '../api/client'
import { playNotificationSound } from '../utils/sounds'
import {
  LayoutDashboard, BarChart2, BookOpen, Video,
  Users, Brain, MessageSquare, Star, DollarSign, Receipt,
  Megaphone, Bell, Settings, PanelLeft, LogOut, PlusCircle, List, FlaskConical,
} from 'lucide-react'

const SIZE = 16

const links = [
  { section: 'Overview', items: [
    { to: '/instructor',           label: 'Dashboard',  icon: <LayoutDashboard size={SIZE} /> },
    { to: '/instructor/analytics', label: 'Analytics',  icon: <BarChart2 size={SIZE} /> },
  ]},
  { section: 'Course Creation', items: [
    { to: '/instructor/courses',     label: 'My Courses',    icon: <BookOpen size={SIZE} /> },
    { to: '/instructor/courses/new', label: 'Create Course', icon: <PlusCircle size={SIZE} /> },
    { to: '/instructor/lessons',     label: 'Lesson Library', icon: <List size={SIZE} /> },
    { to: '/instructor/quizzes',     label: 'Quiz Overview',  icon: <FlaskConical size={SIZE} /> },
  ]},
  { section: 'Teaching', items: [
    { to: '/instructor/live-sessions', label: 'Live Sessions', icon: <Video size={SIZE} /> },
  ]},
  { section: 'Students', items: [
    { to: '/instructor/students', label: 'Student Roster', icon: <Users size={SIZE} /> },
    { to: '/instructor/pulse',    label: 'PULSE Insights', icon: <Brain size={SIZE} /> },
    { to: '/instructor/messages', label: 'Messages',       icon: <MessageSquare size={SIZE} />, badge: '5' },
    { to: '/instructor/reviews',  label: 'Reviews',        icon: <Star size={SIZE} /> },
  ]},
  { section: 'Earnings', items: [
    { to: '/instructor/revenue', label: 'Revenue', icon: <DollarSign size={SIZE} /> },
    { to: '/instructor/payouts', label: 'Payouts', icon: <Receipt size={SIZE} /> },
  ]},
  { section: 'Settings', items: [
    { to: '/instructor/announcements', label: 'Announcements',      icon: <Megaphone size={SIZE} /> },
    { to: '/instructor/notifications', label: 'Notifications',      icon: <Bell size={SIZE} /> },
    { to: '/instructor/settings',      label: 'Profile & Settings', icon: <Settings size={SIZE} /> },
  ]},
]

export default function Sidebar() {
  const { collapsed, toggle } = useSidebar()
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const [dropOpen, setDropOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const dropRef = useRef<HTMLDivElement>(null)
  const prevUnread = useRef(0)

  useEffect(() => {
    const fetch = () => api.get('/api/instructor/notifications/unread-count').then(r => {
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

  return (
    <aside className="sb" data-collapsed={collapsed ? 'true' : 'false'}>
      <div className={`sb-head${collapsed ? ' sb-head-collapsed' : ''}`}>
        {!collapsed && (
          <Link to="/instructor" className="logo">
            <div className="logo-mark">FF</div>
          </Link>
        )}
        <button className="sb-toggle" onClick={toggle} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          <PanelLeft size={18} />
        </button>
      </div>

      <div className="sb-scroll">
        {links.map(group => (
          <React.Fragment key={group.section}>
            {!collapsed && <div className="ss">{group.section}</div>}
            {collapsed && <div style={{ height: 8 }} />}
            {group.items.map((item: any) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/instructor'} className={({ isActive }) => `si${isActive ? ' active' : ''}`}
                title={collapsed ? item.label : undefined}>
                {item.icon}
                <span className="si-label">{item.label}</span>
                {item.badge && !collapsed && <span className="sbg">{item.badge}</span>}
              </NavLink>
            ))}
          </React.Fragment>
        ))}
      </div>

      <div className="sb-bot">
        <div className="pl">
          <span className="pd" />
          {!collapsed && 'PULSE Active · v2.0'}
        </div>
      </div>

      <div ref={dropRef} className="sb-user" onClick={() => setDropOpen(o => !o)}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {user?.avatar_url
            ? <img src={user.avatar_url} alt="" style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,207,255,.3)' }} />
            : <div className="nav-ava" style={{ width: 30, height: 30, fontSize: 11, background: 'rgba(0,207,255,.12)', color: 'var(--in)' }}>{user?.avatar_initials || 'IN'}</div>
          }
          {unread > 0 && (
            <span style={{ position: 'absolute', top: -4, right: -4, background: '#FF4444', color: '#fff', borderRadius: '50%', width: 14, height: 14, fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </div>
        <div className="sb-user-info">
          <div className="sb-user-name">{user?.name}</div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--in)' }}>INSTRUCTOR PORTAL</div>
        </div>

        {dropOpen && (
          <div style={{ position: 'absolute', left: collapsed ? 56 : 0, bottom: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, minWidth: 190, zIndex: 300, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
            {[
              { label: 'Announcements', icon: <Megaphone size={14} />, path: '/instructor/announcements' },
              { label: 'Notifications',  icon: <Bell size={14} />,     path: '/instructor/notifications' },
              { label: 'Settings',       icon: <Settings size={14} />, path: '/instructor/settings' },
            ].map(item => (
              <div key={item.label} onClick={(e) => { e.stopPropagation(); nav(item.path); setDropOpen(false) }}
                style={{ padding: '10px 16px', fontSize: 13, cursor: 'pointer', color: '#ccc', display: 'flex', alignItems: 'center', gap: 10 }}
                onMouseEnter={e => (e.currentTarget.style.background = '#222')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                {item.icon} {item.label}
              </div>
            ))}
            <div style={{ borderTop: '1px solid #2a2a2a' }}>
              <div onClick={(e) => { e.stopPropagation(); logout(); setDropOpen(false) }}
                style={{ padding: '10px 16px', fontSize: 13, cursor: 'pointer', color: '#FF4444', display: 'flex', alignItems: 'center', gap: 10 }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,68,68,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <LogOut size={14} /> Logout
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
