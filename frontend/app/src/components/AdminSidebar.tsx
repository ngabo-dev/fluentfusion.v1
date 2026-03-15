import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const links = [
  { section: 'Platform', items: [
    { to: '/', label: 'Overview', icon: '▦' },
    { to: '/analytics', label: 'Analytics', icon: '📈' },
    { to: '/geo', label: 'Geographic Data', icon: '🌍' },
  ]},
  { section: 'Users', items: [
    { to: '/users', label: 'All Users', icon: '👥', badge: '28.4k' },
    { to: '/students', label: 'Students', icon: '🎓' },
    { to: '/instructors', label: 'Instructors', icon: '👩‍🏫', badge: '12', badgeClass: 'w' },
    { to: '/admins', label: 'Admins', icon: '🔑' },
  ]},
  { section: 'Content', items: [
    { to: '/approvals', label: 'Course Approvals', icon: '📚', badge: '7', badgeClass: 'w' },
    { to: '/live-sessions', label: 'Live Sessions', icon: '🎙️' },
    { to: '/reports', label: 'Reports', icon: '🚩', badge: '23', badgeClass: 'r' },
  ]},
  { section: 'Finance', items: [
    { to: '/payments', label: 'Payments', icon: '💳' },
    { to: '/payouts', label: 'Payouts', icon: '💸', badge: '4', badgeClass: 'w' },
    { to: '/revenue', label: 'Revenue Reports', icon: '💰' },
  ]},
  { section: 'System', items: [
    { to: '/pulse', label: 'PULSE Engine', icon: '🧠' },
    { to: '/notifications', label: 'Notifications', icon: '🔔' },
    { to: '/audit-log', label: 'Audit Log', icon: '🚨' },
    { to: '/settings', label: 'Platform Settings', icon: '⚙️' },
  ]},
]

export default function Sidebar() {
  return (
    <aside className="sb">
      {links.map(group => (
        <React.Fragment key={group.section}>
          <div className="ss">{group.section}</div>
          {group.items.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `si${isActive ? ' active' : ''}`}>
              <span>{item.icon}</span> {item.label}
              {item.badge && <span className={`sbg${item.badgeClass ? ' ' + item.badgeClass : ''}`}>{item.badge}</span>}
            </NavLink>
          ))}
        </React.Fragment>
      ))}
      <div className="sb-bot">
        <div className="pl"><span className="pd" />SUPERADMIN · PROD</div>
      </div>
    </aside>
  )
}
