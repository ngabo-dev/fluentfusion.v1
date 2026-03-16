import React from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { section: 'Overview', items: [
    { to: '/instructor', label: 'Dashboard', icon: '⬛' },
    { to: '/instructor/analytics', label: 'Analytics', icon: '📊' },
  ]},
  { section: 'Teaching', items: [
    { to: '/instructor/courses', label: 'My Courses', icon: '📚', badge: '3' },
    { to: '/instructor/lessons', label: 'Lessons', icon: '✏️' },
    { to: '/instructor/live-sessions', label: 'Live Sessions', icon: '🎙️' },
    { to: '/instructor/quizzes', label: 'Quizzes & Assessments', icon: '📝' },
  ]},
  { section: 'Students', items: [
    { to: '/instructor/students', label: 'Student Roster', icon: '👥' },
    { to: '/instructor/pulse', label: 'PULSE Insights', icon: '🧠' },
    { to: '/instructor/messages', label: 'Messages', icon: '💬', badge: '5' },
    { to: '/instructor/reviews', label: 'Reviews', icon: '⭐' },
  ]},
  { section: 'Earnings', items: [
    { to: '/instructor/revenue', label: 'Revenue', icon: '💰' },
    { to: '/instructor/payouts', label: 'Payouts', icon: '🧾' },
  ]},
  { section: 'Settings', items: [
    { to: '/instructor/notifications', label: 'Notifications', icon: '🔔' },
    { to: '/instructor/settings', label: 'Profile & Settings', icon: '⚙️' },
  ]},
]

export default function Sidebar() {
  return (
    <aside className="sb">
      {links.map(group => (
        <React.Fragment key={group.section}>
          <div className="ss">{group.section}</div>
          {group.items.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/instructor'} className={({ isActive }) => `si${isActive ? ' active' : ''}`}>
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
