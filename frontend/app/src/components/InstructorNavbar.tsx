import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <nav className="nav">
      <Link to="/instructor" className="logo">
        <div className="logo-mark">FF</div>
        <div className="logo-name">Fluent<span>Fusion</span></div>
      </Link>
      <div className="nav-r">
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--in)', background: 'rgba(0,207,255,.1)', padding: '3px 8px', borderRadius: 4, border: '1px solid rgba(0,207,255,.2)' }}>INSTRUCTOR PORTAL</span>
        <div className="nav-ava" onClick={logout} title="Logout">{user?.avatar_initials || 'IN'}</div>
      </div>
    </nav>
  )
}
