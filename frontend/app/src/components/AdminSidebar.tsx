import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import api from '../api/client'
import { useSidebar } from './SidebarContext'

export default function AdminSidebar() {
  const { collapsed } = useSidebar()
  const [counts, setCounts] = useState({ students: 0, instructors: 0, admins: 0, pendingPayouts: 0, openReports: 0 })

  useEffect(() => {
    Promise.all([
      api.get('/api/admin/users', { params: { role: 'student' } }),
      api.get('/api/admin/instructors'),
      api.get('/api/admin/admins'),
      api.get('/api/admin/payouts', { params: { status: 'pending' } }),
      api.get('/api/admin/reports', { params: { status: 'open' } }),
    ]).then(([s, i, a, p, r]) => {
      const students    = Array.isArray(s.data) ? s.data.length : 0
      const instructors = Array.isArray(i.data) ? i.data.length : 0
      const admins      = Array.isArray(a.data) ? a.data.length : 0
      setCounts({
        students,
        instructors,
        admins,
        pendingPayouts: Array.isArray(p.data) ? p.data.length : 0,
        openReports:   Array.isArray(r.data) ? r.data.length : 0,
      })
    }).catch(() => {})
  }, [])

  const links = [
    { section: 'Platform', items: [
      { to: '/admin',            label: 'Overview',         icon: '▦' },
      { to: '/admin/analytics',  label: 'Analytics',        icon: '📈' },
      { to: '/admin/geo',        label: 'Geographic Data',  icon: '🌍' },
    ]},
    { section: 'Users', items: [
      { to: '/admin/users',       label: 'All Users',    icon: '👥', badge: String(counts.students + counts.instructors + counts.admins) },
      { to: '/admin/students',    label: 'Students',     icon: '🎓',  badge: counts.students   > 0 ? String(counts.students)   : undefined },
      { to: '/admin/instructors', label: 'Instructors',  icon: '👩🏫', badge: counts.instructors > 0 ? String(counts.instructors) : undefined, badgeClass: 'w' },
      { to: '/admin/admins',      label: 'Admins',       icon: '🔑',  badge: counts.admins     > 0 ? String(counts.admins)     : undefined },
    ]},
    { section: 'Content', items: [
      { to: '/admin/approvals',     label: 'Course Approvals', icon: '📚' },
      { to: '/admin/live-sessions', label: 'Live Sessions',    icon: '🎙️' },
      { to: '/admin/reports',       label: 'Reports',          icon: '🚩', badge: counts.openReports > 0 ? String(counts.openReports) : undefined, badgeClass: 'r' },
    ]},
    { section: 'Finance', items: [
      { to: '/admin/payments', label: 'Payments',        icon: '💳' },
      { to: '/admin/payouts',  label: 'Payouts',         icon: '💸', badge: counts.pendingPayouts > 0 ? String(counts.pendingPayouts) : undefined, badgeClass: 'w' },
      { to: '/admin/revenue',  label: 'Revenue Reports', icon: '💰' },
    ]},
    { section: 'System', items: [
      { to: '/admin/pulse',         label: 'PULSE Engine',      icon: '🧠' },
      { to: '/admin/messages',      label: 'Messages',          icon: '💬' },
      { to: '/admin/announcements', label: 'Announcements',     icon: '📢' },
      { to: '/admin/notifications', label: 'Notifications',     icon: '🔔' },
      { to: '/admin/audit-log',     label: 'Audit Log',         icon: '🚨' },
      { to: '/admin/settings',      label: 'Platform Settings', icon: '⚙️' },
    ]},
  ]

  return (
    <aside className="sb" data-collapsed={collapsed ? 'true' : 'false'} style={{ overflow: collapsed ? 'hidden' : undefined }}>
      {!collapsed && <>
        {links.map(group => (
          <React.Fragment key={group.section}>
            <div className="ss">{group.section}</div>
            {group.items.map((item: any) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/admin'} className={({ isActive }) => `si${isActive ? ' active' : ''}`}>
                <span>{item.icon}</span> {item.label}
                {item.badge && <span className={`sbg${item.badgeClass ? ' ' + item.badgeClass : ''}`}>{item.badge}</span>}
              </NavLink>
            ))}
          </React.Fragment>
        ))}
        <div className="sb-bot">
          <div className="pl"><span className="pd" />ADMIN · PROD</div>
        </div>
      </>}
    </aside>
  )
}
