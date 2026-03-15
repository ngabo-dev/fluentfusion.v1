import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <nav className="nav">
      <Link to="/" className="logo">
        <div className="logo-mark">FF</div>
        <div className="logo-name">Fluent<span>Fusion</span></div>
      </Link>
      <div className="nav-r">
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--ok)', background: 'rgba(0,255,127,.1)', padding: '3px 8px', borderRadius: 4, border: '1px solid rgba(0,255,127,.2)' }}>STUDENT PORTAL</span>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--neon)', background: 'var(--ndim)', padding: '3px 8px', borderRadius: 4, border: '1px solid rgba(191,255,0,.2)' }}>
          ⚡ {user?.xp ?? 0} XP
        </div>
        <div className="nav-ava" onClick={logout} title="Logout">{user?.avatar_initials || 'ST'}</div>
      </div>
    </nav>
  )
}
