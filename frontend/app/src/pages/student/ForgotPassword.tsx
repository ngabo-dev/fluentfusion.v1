import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../api/client'

export default function ForgotPassword() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return setErr('Please enter your email address')
    setLoading(true); setErr(''); setMsg('')
    try {
      await authApi.forgotPassword({ email })
      setMsg('If this email exists, a reset link has been sent. Check your inbox.')
    } catch (ex: any) {
      setErr(ex.message || 'Failed to send reset email. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* NAV */}
      <nav style={{ height: 60, background: 'rgba(10,10,10,.97)', borderBottom: '1px solid var(--bdr)', display: 'flex', alignItems: 'center', padding: '0 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => nav('/')}>
          <div className="logo-mark">FF</div>
          <div className="logo-name">Fluent<span>Fusion</span></div>
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: 420, background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 'var(--rl)', padding: '40px 40px 36px' }}>
          <button onClick={() => nav('/login')} style={{ background: 'none', border: 'none', color: 'var(--mu)', fontSize: 13, cursor: 'pointer', marginBottom: 24, padding: 0 }}>← Back to Login</button>

          <div style={{ width: 56, height: 56, background: 'rgba(191,255,0,.1)', border: '1px solid rgba(191,255,0,.2)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 20 }}>🔑</div>

          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, textTransform: 'uppercase', marginBottom: 8 }}>
            Forgot<br /><span style={{ color: 'var(--neon)' }}>Password</span>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--mu)', marginBottom: 28, lineHeight: 1.6 }}>
            No worries! Enter your email and we'll send you reset instructions.
          </p>

          {err && <div style={{ background: 'rgba(255,68,68,.08)', border: '1px solid rgba(255,68,68,.2)', borderRadius: 'var(--r)', padding: '10px 14px', color: 'var(--er)', fontSize: 13, marginBottom: 16 }}>⚠ {err}</div>}
          {msg && <div style={{ background: 'rgba(0,255,127,.08)', border: '1px solid rgba(0,255,127,.2)', borderRadius: 'var(--r)', padding: '10px 14px', color: 'var(--ok)', fontSize: 13, marginBottom: 16 }}>✓ {msg}</div>}

          <form onSubmit={handleSubmit}>
            <div className="fg">
              <label className="lbl">Email Address</label>
              <input className="inp" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button className="btn bp" style={{ width: '100%', padding: '12px 0', fontSize: 15 }} disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <span style={{ fontSize: 14, color: 'var(--mu)' }}>Remember your password? </span>
            <button onClick={() => nav('/login')} style={{ background: 'none', border: 'none', color: 'var(--neon)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Sign In</button>
          </div>
        </div>
      </div>
    </div>
  )
}
