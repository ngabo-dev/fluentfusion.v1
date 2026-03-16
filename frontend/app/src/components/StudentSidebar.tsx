import React from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { section: 'Overview', items: [
    { to: '/dashboard', label: 'Dashboard', icon: '⬛' },
  ]},
  { section: 'Learning', items: [
    { to: '/dashboard/courses', label: 'My Courses', icon: '📚' },
    { to: '/dashboard/lessons', label: 'Lessons', icon: '▶️' },
    { to: '/dashboard/live-sessions', label: 'Live Sessions', icon: '🎙️' },
    { to: '/dashboard/quizzes', label: 'Quizzes', icon: '📝' },
  ]},
  { section: 'Community', items: [
    { to: '/dashboard/messages', label: 'Messages', icon: '💬', badge: '2' },
    { to: '/dashboard/leaderboard', label: 'Leaderboard', icon: '🏆' },
  ]},
  { section: 'Account', items: [
    { to: '/dashboard/notifications', label: 'Notifications', icon: '🔔' },
    { to: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
  ]},
]

export default function Sidebar() {
  return (
    <aside className="sb">
      {links.map(group => (
        <React.Fragment key={group.section}>
          <div className="ss">{group.section}</div>
          {group.items.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/dashboard'} className={({ isActive }) => `si${isActive ? ' active' : ''}`}>
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
