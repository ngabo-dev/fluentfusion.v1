import React, { useState } from 'react'
import { useAuth } from '../../components/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('c.okafor@fluentfusion.com')
  const [pw, setPw] = useState('admin123')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setErr('')
    try { await login(email, pw); nav('/') }
    catch { setErr('Invalid credentials') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ width: 360, background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 'var(--rl)', padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 28 }}>
          <div className="logo-mark">FF</div>
          <div className="logo-name">Fluent<span>Fusion</span></div>
          <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--er)', background: 'rgba(255,68,68,.1)', padding: '2px 7px', borderRadius: 4 }}>ADMIN</span>
        </div>
        <form onSubmit={submit}>
          <div className="fg"><label className="lbl">Email</label><input className="inp" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div className="fg"><label className="lbl">Password</label><input className="inp" type="password" value={pw} onChange={e => setPw(e.target.value)} /></div>
          {err && <div style={{ color: 'var(--er)', fontSize: 11, marginBottom: 12 }}>{err}</div>}
          <button className="btn bp" style={{ width: '100%' }} disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <div style={{ marginTop: 16, fontSize: 10, color: 'var(--mu)', fontFamily: 'JetBrains Mono' }}>
          Demo: c.okafor@fluentfusion.com / admin123
        </div>
      </div>
    </div>
  )
}
