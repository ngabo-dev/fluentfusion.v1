import React from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { section: 'Overview', items: [
    { to: '/', label: 'Dashboard', icon: '⬛' },
    { to: '/analytics', label: 'Analytics', icon: '📊' },
  ]},
  { section: 'Teaching', items: [
    { to: '/courses', label: 'My Courses', icon: '📚', badge: '3' },
    { to: '/lessons', label: 'Lessons', icon: '✏️' },
    { to: '/live-sessions', label: 'Live Sessions', icon: '🎙️' },
    { to: '/quizzes', label: 'Quizzes & Assessments', icon: '📝' },
  ]},
  { section: 'Students', items: [
    { to: '/students', label: 'Student Roster', icon: '👥' },
    { to: '/pulse', label: 'PULSE Insights', icon: '🧠' },
    { to: '/messages', label: 'Messages', icon: '💬', badge: '5' },
    { to: '/reviews', label: 'Reviews', icon: '⭐' },
  ]},
  { section: 'Earnings', items: [
    { to: '/revenue', label: 'Revenue', icon: '💰' },
    { to: '/payouts', label: 'Payouts', icon: '🧾' },
  ]},
  { section: 'Settings', items: [
    { to: '/notifications', label: 'Notifications', icon: '🔔' },
    { to: '/settings', label: 'Profile & Settings', icon: '⚙️' },
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
              {item.badge && <span className="sbg">{item.badge}</span>}
            </NavLink>
          ))}
        </React.Fragment>
      ))}
      <div className="sb-bot">
        <div className="pl"><span className="pd" />PULSE Active · v2.0</div>
      </div>
    </aside>
  )
}
