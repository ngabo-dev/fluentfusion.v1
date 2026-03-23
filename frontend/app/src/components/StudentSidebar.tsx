import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSidebar } from './SidebarContext'

type NavItem = { to: string; label: string; icon: string; badge?: string }
type NavGroup = { section: string; items: NavItem[] }

const links: NavGroup[] = [
  { section: 'Overview', items: [
    { to: '/dashboard', label: 'Dashboard', icon: '⚡' },
  ]},
  { section: 'Learning', items: [
    { to: '/dashboard/courses', label: 'My Courses', icon: '📚' },
    { to: '/dashboard/catalog', label: 'Course Catalog', icon: '🔍' },
    { to: '/dashboard/lessons', label: 'Lessons', icon: '▶️' },
    { to: '/dashboard/live-sessions', label: 'Live Sessions', icon: '🎙️' },
    { to: '/dashboard/quizzes', label: 'Quizzes', icon: '📝' },
  ]},
  { section: 'Practice', items: [
    { to: '/dashboard/flashcards', label: 'Flashcards', icon: '🃏' },
    { to: '/dashboard/speaking', label: 'Speaking Practice', icon: '🎤' },
    { to: '/dashboard/daily-challenge', label: 'Daily Challenge', icon: '🎯' },
  ]},
  { section: 'Progress', items: [
    { to: '/dashboard/progress', label: 'My Progress', icon: '📊' },
    { to: '/dashboard/achievements', label: 'Achievements', icon: '🏆' },
    { to: '/dashboard/streak', label: 'Streak Tracker', icon: '🔥' },
    { to: '/dashboard/leaderboard', label: 'Leaderboard', icon: '📈' },
  ]},
  { section: 'Community', items: [
    { to: '/dashboard/messages', label: 'Messages', icon: '💬', badge: '2' },
  ]},
  { section: 'Account', items: [
    { to: '/dashboard/notifications', label: 'Notifications', icon: '🔔' },
    { to: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
  ]},
]

export default function Sidebar() {
  const { collapsed } = useSidebar()
  return (
    <aside className="sb" style={{ width: collapsed ? 0 : 'var(--sw)', overflow: collapsed ? 'hidden' : 'auto', transition: 'width .25s ease', flexShrink: 0 }}>
      {!collapsed && <>
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
      </>}
    </aside>
  )
}
