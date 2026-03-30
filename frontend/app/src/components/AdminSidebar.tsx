import React, { useEffect, useState, useRef } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useSidebar } from './SidebarContext'
import { useAuth } from './AuthContext'
import { playNotificationSound } from '../utils/sounds'
import {
  LayoutDashboard, BarChart2, Globe, Users, GraduationCap,
  UserCheck, KeyRound, BookOpen, Video, Flag, CreditCard,
  Banknote, DollarSign, Brain, MessageSquare, Megaphone,
  Bell, ClipboardList, Settings, PanelLeft, LogOut, ShieldCheck,
} from 'lucide-react'

const SIZE = 16

export default function AdminSidebar() {
  const { collapsed, toggle } = useSidebar()
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const [dropOpen, setDropOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const [counts, setCounts] = useState({ students: 0, instructors: 0, admins: 0, pendingPayouts: 0, openReports: 0 })
  const dropRef = useRef<HTMLDivElement>(null)
  const prevUnread = useRef(0)

  useEffect(() => {
    Promise.all([
      api.get('/api/admin/users', { params: { role: 'student' } }),
      api.get('/api/admin/instructors'),
      api.get('/api/admin/admins'),
      api.get('/api/admin/payouts', { params: { status: 'pending' } }),
      api.get('/api/admin/reports', { params: { status: 'open' } }),
    ]).then(([s, i, a, p, r]) => {
      setCounts({
        students:      Array.isArray(s.data) ? s.data.length : 0,
        instructors:   Array.isArray(i.data) ? i.data.length : 0,
        admins:        Array.isArray(a.data) ? a.data.length : 0,
        pendingPayouts:Array.isArray(p.data) ? p.data.length : 0,
        openReports:   Array.isArray(r.data) ? r.data.length : 0,
      })
    }).catch(() => {})
  }, [])

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

  const links = [
    { section: 'Platform', items: [
      { to: '/admin',           label: 'Overview',        icon: <LayoutDashboard size={SIZE} /> },
      { to: '/admin/analytics', label: 'Analytics',       icon: <BarChart2 size={SIZE} /> },
      { to: '/admin/geo',       label: 'Geographic Data', icon: <Globe size={SIZE} /> },
    ]},
    { section: 'Users', items: [
      { to: '/admin/users',       label: 'All Users',   icon: <Users size={SIZE} />,        badge: String(counts.students + counts.instructors + counts.admins) },
      { to: '/admin/students',    label: 'Students',    icon: <GraduationCap size={SIZE} />, badge: counts.students    > 0 ? String(counts.students)    : undefined },
      { to: '/admin/instructors', label: 'Instructors', icon: <UserCheck size={SIZE} />,     badge: counts.instructors > 0 ? String(counts.instructors) : undefined, badgeClass: 'w' },
      { to: '/admin/admins',      label: 'Admins',      icon: <KeyRound size={SIZE} />,      badge: counts.admins      > 0 ? String(counts.admins)      : undefined },
    ]},
    { section: 'Content', items: [
      { to: '/admin/approvals',     label: 'Course Approvals', icon: <BookOpen size={SIZE} /> },
      { to: '/admin/live-sessions', label: 'Live Sessions',    icon: <Video size={SIZE} /> },
      { to: '/admin/reports',       label: 'Reports',          icon: <Flag size={SIZE} />, badge: counts.openReports > 0 ? String(counts.openReports) : undefined, badgeClass: 'r' },
    ]},
    { section: 'Finance', items: [
      { to: '/admin/payments', label: 'Payments',        icon: <CreditCard size={SIZE} /> },
      { to: '/admin/payouts',  label: 'Payouts',         icon: <Banknote size={SIZE} />, badge: counts.pendingPayouts > 0 ? String(counts.pendingPayouts) : undefined, badgeClass: 'w' },
      { to: '/admin/revenue',  label: 'Revenue Reports', icon: <DollarSign size={SIZE} /> },
    ]},
    { section: 'System', items: [
      { to: '/admin/pulse',         label: 'PULSE Engine',      icon: <Brain size={SIZE} /> },
      { to: '/admin/messages',      label: 'Messages',          icon: <MessageSquare size={SIZE} /> },
      { to: '/admin/announcements', label: 'Announcements',     icon: <Megaphone size={SIZE} /> },
      { to: '/admin/notifications', label: 'Notifications',     icon: <Bell size={SIZE} /> },
      { to: '/admin/audit-log',     label: 'Audit Log',         icon: <ClipboardList size={SIZE} /> },
      { to: '/admin/settings',      label: 'Platform Settings', icon: <Settings size={SIZE} /> },
    ]},
    { section: 'Ethics', items: [
      { to: '/admin/ethics',                      label: 'Ethics Overview',      icon: <ShieldCheck size={SIZE} /> },
      { to: '/admin/ethics/data-requests',        label: 'Data Requests',        icon: <ClipboardList size={SIZE} /> },
      { to: '/admin/ethics/processing-register',  label: 'Processing Register',  icon: <Bell size={SIZE} /> },
      { to: '/admin/ethics/change-log',           label: 'Change Log',           icon: <Settings size={SIZE} /> },
      { to: '/admin/ethics/pulse-fairness',       label: 'PULSE Fairness',       icon: <Brain size={SIZE} /> },
      { to: '/admin/ethics/consent-versions',     label: 'Consent Versions',     icon: <ShieldCheck size={SIZE} /> },
    ]},
  ]

  return (
    <aside className="sb" data-collapsed={collapsed ? 'true' : 'false'}>
      {/* Header */}
      <div className={`sb-head${collapsed ? ' sb-head-collapsed' : ''}`}>
        {!collapsed && (
          <Link to="/admin" className="logo">
            <div className="logo-mark">FF</div>
          </Link>
        )}
        <button className="sb-toggle" onClick={toggle} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          <PanelLeft size={18} />
        </button>
      </div>

      {/* Nav links */}
      <div className="sb-scroll">
        {links.map(group => (
          <React.Fragment key={group.section}>
            {!collapsed && <div className="ss">{group.section}</div>}
            {collapsed && <div style={{ height: 8 }} />}
            {group.items.map((item: any) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/admin'} className={({ isActive }) => `si${isActive ? ' active' : ''}`}
                title={collapsed ? item.label : undefined}>
                {item.icon}
                <span className="si-label">{item.label}</span>
                {item.badge && !collapsed && <span className={`sbg${item.badgeClass ? ' ' + item.badgeClass : ''}`}>{item.badge}</span>}
              </NavLink>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* PULSE status */}
      <div className="sb-bot">
        <div className="pl">
          <span className="pd" />
          {!collapsed && 'ADMIN · PROD'}
        </div>
      </div>

      {/* User footer */}
      <div ref={dropRef} className="sb-user" onClick={() => setDropOpen(o => !o)}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {user?.avatar_url
            ? <img src={user.avatar_url} alt="" style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,68,68,.3)' }} />
            : <div className="nav-ava" style={{ width: 30, height: 30, fontSize: 11, background: 'rgba(255,68,68,.15)', color: 'var(--er)' }}>{user?.avatar_initials || 'AD'}</div>
          }
          {unread > 0 && (
            <span style={{ position: 'absolute', top: -4, right: -4, background: '#FF4444', color: '#fff', borderRadius: '50%', width: 14, height: 14, fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </div>
        <div className="sb-user-info">
          <div className="sb-user-name">{user?.name}</div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--er)' }}>ADMIN PORTAL</div>
        </div>

        {dropOpen && (
          <div style={{ position: 'absolute', left: collapsed ? 56 : 0, bottom: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, minWidth: 190, zIndex: 300, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
            {[
              { label: 'Announcements', icon: <Megaphone size={14} />, path: '/admin/announcements' },
              { label: 'Notifications',  icon: <Bell size={14} />,     path: '/admin/notifications' },
              { label: 'Settings',       icon: <Settings size={14} />, path: '/admin/settings' },
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
