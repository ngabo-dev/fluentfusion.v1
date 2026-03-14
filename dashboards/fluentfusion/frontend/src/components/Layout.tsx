import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Avatar, SectionLabel } from './UI';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: string | number;
  badgeType?: 'neon' | 'warn' | 'error';
}

interface NavSection {
  section: string;
  items: NavItem[];
}

const ADMIN_NAV: NavSection[] = [
  {
    section: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '⬡', path: '/admin' },
    ],
  },
  {
    section: 'Platform',
    items: [
      { id: 'users', label: 'Users', icon: '◈', path: '/admin/users' },
      { id: 'instructors', label: 'Instructors', icon: '◉', path: '/admin/instructors' },
      { id: 'courses', label: 'Courses', icon: '▣', path: '/admin/courses' },
      { id: 'pulse', label: 'PULSE Engine', icon: '◎', path: '/admin/pulse' },
    ],
  },
  {
    section: 'Finance',
    items: [
      { id: 'revenue', label: 'Revenue', icon: '◈', path: '/admin/revenue' },
      { id: 'payouts', label: 'Payouts', icon: '◇', path: '/admin/payouts' },
    ],
  },
  {
    section: 'System',
    items: [
      { id: 'notifications', label: 'Notifications', icon: '◐', path: '/admin/notifications' },
      { id: 'audit', label: 'Audit Log', icon: '◑', path: '/admin/audit' },
      { id: 'settings', label: 'Platform Settings', icon: '◍', path: '/admin/settings' },
    ],
  },
];

const INSTRUCTOR_NAV: NavSection[] = [
  {
    section: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '⬡', path: '/instructor' },
    ],
  },
  {
    section: 'Teaching',
    items: [
      { id: 'courses', label: 'My Courses', icon: '▣', path: '/instructor/courses' },
      { id: 'lessons', label: 'Lessons', icon: '▤', path: '/instructor/lessons' },
      { id: 'quizzes', label: 'Quizzes', icon: '▦', path: '/instructor/quizzes' },
      { id: 'sessions', label: 'Live Sessions', icon: '◉', path: '/instructor/sessions' },
    ],
  },
  {
    section: 'Students',
    items: [
      { id: 'roster', label: 'Student Roster', icon: '◈', path: '/instructor/roster' },
      { id: 'pulse', label: 'PULSE Insights', icon: '◎', path: '/instructor/pulse' },
      { id: 'messages', label: 'Messages', icon: '◐', path: '/instructor/messages' },
    ],
  },
  {
    section: 'Finance',
    items: [
      { id: 'earnings', label: 'Earnings', icon: '◇', path: '/instructor/earnings' },
    ],
  },
];

export function Layout({ children, role }: { children: React.ReactNode; role: 'admin' | 'instructor' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const nav = role === 'admin' ? ADMIN_NAV : INSTRUCTOR_NAV;

  const isActive = (path: string) => {
    if (path === '/admin' || path === '/instructor') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Nav */}
      <nav style={{
        height: 'var(--nh)', background: 'rgba(10,10,10,.97)', borderBottom: '1px solid var(--bdr)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 22px', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 28, height: 28, background: 'var(--neon)', borderRadius: 7,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, color: '#000', fontFamily: 'Syne, sans-serif', fontWeight: 800,
          }}>FF</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-.02em' }}>
            Fluent<span style={{ color: 'var(--neon)' }}>Fusion</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Role switcher */}
          <div style={{ display: 'flex', background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
            <button
              onClick={() => navigate('/admin')}
              style={{
                padding: '5px 14px', fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer',
                background: role === 'admin' ? 'var(--neon)' : 'transparent',
                color: role === 'admin' ? '#000' : 'var(--mu)',
                letterSpacing: '.03em',
              }}>ADMIN</button>
            <button
              onClick={() => navigate('/instructor')}
              style={{
                padding: '5px 14px', fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer',
                background: role === 'instructor' ? 'var(--neon)' : 'transparent',
                color: role === 'instructor' ? '#000' : 'var(--mu)',
                letterSpacing: '.03em',
              }}>INSTRUCTOR</button>
          </div>
          <Avatar initials={user?.avatar_initials || user?.full_name?.slice(0, 2).toUpperCase()} size="sm" />
          <button onClick={logout} style={{ background: 'none', border: '1px solid var(--bdr)', borderRadius: 'var(--r)', padding: '4px 10px', color: 'var(--mu)', fontSize: 11, cursor: 'pointer' }}>
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ display: 'flex', marginTop: 'var(--nh)', height: 'calc(100vh - var(--nh))' }}>
        {/* Sidebar */}
        <aside style={{
          width: 'var(--sw)', background: 'var(--bg2)', borderRight: '1px solid var(--bdr)',
          display: 'flex', flexDirection: 'column', overflowY: 'auto', flexShrink: 0,
        }}>
          {nav.map(section => (
            <div key={section.section}>
              <SectionLabel>{section.section}</SectionLabel>
              {section.items.map(item => (
                <div
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '7px 18px',
                    fontSize: 12, fontWeight: 500, cursor: 'pointer',
                    color: isActive(item.path) ? 'var(--neon)' : 'var(--mu)',
                    borderLeft: `2px solid ${isActive(item.path) ? 'var(--neon)' : 'transparent'}`,
                    background: isActive(item.path) ? 'var(--ndim)' : 'transparent',
                    transition: 'all .13s', userSelect: 'none',
                  }}
                  onMouseEnter={e => {
                    if (!isActive(item.path)) {
                      (e.currentTarget as HTMLElement).style.color = 'var(--fg)';
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.03)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive(item.path)) {
                      (e.currentTarget as HTMLElement).style.color = 'var(--mu)';
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }
                  }}
                >
                  <span style={{ fontSize: 14 }}>{item.icon}</span>
                  {item.label}
                  {item.badge && (
                    <span style={{
                      marginLeft: 'auto', fontSize: 9, fontWeight: 700, padding: '1px 6px',
                      borderRadius: 99, fontFamily: 'JetBrains Mono, monospace',
                      background: item.badgeType === 'error' ? 'var(--er)' : item.badgeType === 'warn' ? 'var(--wa)' : 'var(--neon)',
                      color: item.badgeType === 'error' ? '#fff' : '#000',
                    }}>{item.badge}</span>
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* Sidebar footer */}
          <div style={{ marginTop: 'auto', padding: '10px 18px', borderTop: '1px solid var(--bdr)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--ok)', fontFamily: 'JetBrains Mono, monospace' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ok)', animation: 'blink 1.5s infinite' }} />
              SYSTEM ONLINE
            </div>
            <div style={{ marginTop: 6, fontSize: 10, color: 'var(--mu)' }}>{user?.full_name}</div>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }} className="fade-up">
          {children}
        </main>
      </div>
    </div>
  );
}
