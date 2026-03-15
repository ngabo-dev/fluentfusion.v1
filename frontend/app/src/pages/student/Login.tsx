import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../components/AuthContext'

export default function Login() {
  const nav = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPw, setShowPw] = useState(false)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr(''); setLoading(true)
    try {
      const res = await login(email, pw, remember)
      setSuccess('Welcome back! Redirecting...')
      const role = res?.user?.role
      setTimeout(() => {
        if (role === 'admin' || role === 'super_admin') nav('/admin')
        else if (role === 'instructor') nav('/instructor')
        else {
          const steps = [
            { key: 'onboarding_native_lang', path: '/onboard/native-language' },
            { key: 'onboarding_learn_lang',  path: '/onboard/learn-language' },
            { key: 'onboarding_goal',        path: '/onboard/goal' },
            { key: 'onboarding_level',       path: '/onboard/level' },
          ]
          const next = steps.find(s => !localStorage.getItem(s.key))
          nav(next ? next.path : '/dashboard')
        }
      }, 800)
    } catch (ex: any) {
      const msg = ex?.message || 'Invalid credentials'
      if (msg.includes('401') || msg.toLowerCase().includes('invalid')) setErr('Incorrect email or password. Please try again.')
      else if (msg.includes('suspended') || msg.includes('banned')) setErr('Your account has been suspended. Contact support.')
      else if (msg.includes('network') || msg.includes('fetch')) setErr('Cannot connect to server. Make sure the backend is running.')
      else setErr(msg)
    } finally { setLoading(false) }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#1f1f1f', border: '1px solid #2a2a2a',
    borderRadius: 8, padding: '12px 16px 12px 44px',
    fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: '#fff', outline: 'none',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'DM Sans', sans-serif" }}>

      {/* NAV */}
      <nav style={{ height: 66, background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid #2a2a2a', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
          <div style={{ width: 38, height: 38, background: '#BFFF00', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🧠</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#fff' }}>
            FLUENT<span style={{ color: '#BFFF00' }}>FUSION</span>
          </div>
        </a>
        <div style={{ fontSize: 14, color: '#888' }}>
          Don't have an account?{' '}
          <a onClick={() => nav('/signup')} style={{ color: '#BFFF00', textDecoration: 'none', fontWeight: 600, cursor: 'pointer' }}>Sign Up</a>
        </div>
      </nav>

      {/* CENTER WRAP */}
      <div style={{ minHeight: 'calc(100vh - 66px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, position: 'relative', overflow: 'hidden' }}>
        {/* bg glow */}
        <div style={{ position: 'absolute', width: 600, height: 600, background: 'radial-gradient(circle, rgba(191,255,0,0.06) 0%, transparent 65%)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />

        {/* AUTH CARD */}
        <div style={{ width: '100%', maxWidth: 440, background: '#151515', border: '1px solid #2a2a2a', borderRadius: 20, padding: 44, position: 'relative', zIndex: 2 }}>

          {/* back link */}
          <a onClick={() => nav('/')} style={{ fontSize: 13, color: '#888', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28, cursor: 'pointer' }}>← Back to Home</a>

          {/* logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{ width: 34, height: 34, background: '#BFFF00', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🧠</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#fff' }}>
              FLUENT<span style={{ color: '#BFFF00' }}>FUSION</span>
            </div>
          </div>

          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 6 }}>Welcome Back</div>
          <div style={{ fontSize: 14, color: '#888', marginBottom: 28 }}>Sign in to continue your learning journey</div>

          <form onSubmit={submit}>
            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 7 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#555' }}>✉️</span>
                <input style={inputStyle} type="email" placeholder="jean@example.com" value={email} onChange={e => setEmail(e.target.value)} required
                  onFocus={e => (e.target.style.borderColor = '#BFFF00')}
                  onBlur={e => (e.target.style.borderColor = '#2a2a2a')} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 0 }}>
              <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 7 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#555' }}>🔒</span>
                <input style={inputStyle} type={showPw ? 'text' : 'password'} placeholder="••••••••" value={pw} onChange={e => setPw(e.target.value)} required
                  onFocus={e => (e.target.style.borderColor = '#BFFF00')}
                  onBlur={e => (e.target.style.borderColor = '#2a2a2a')} />
                <span onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: 15, color: '#555', userSelect: 'none' }}>{showPw ? '🙈' : '👁'}</span>
              </div>
            </div>

            {/* Remember me + Forgot */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '16px 0 20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#888', cursor: 'pointer' }}>
                <div onClick={() => setRemember(!remember)}
                  style={{ width: 16, height: 16, border: `1px solid ${remember ? '#BFFF00' : '#333'}`, borderRadius: 4, background: remember ? 'rgba(191,255,0,0.10)' : '#1f1f1f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#BFFF00', cursor: 'pointer' }}>
                  {remember ? '✓' : ''}
                </div>
                Remember me
              </label>
              <a onClick={() => nav('/forgot-password')} style={{ fontSize: 13, color: '#BFFF00', textDecoration: 'none', fontWeight: 600, cursor: 'pointer' }}>Forgot Password?</a>
            </div>

            {success && (
              <div style={{ background: 'rgba(0,255,127,0.08)', border: '1px solid rgba(0,255,127,0.25)', borderRadius: 8, padding: '8px 12px', color: '#00FF7F', fontSize: 13, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                ✓ {success}
              </div>
            )}
            {err && (
              <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: 8, padding: '8px 12px', color: '#FF4444', fontSize: 13, marginBottom: 14 }}>
                ⚠ {err}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '15px 36px', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', border: 'none', background: '#BFFF00', color: '#0a0a0a', opacity: loading ? 0.7 : 1, transition: 'all .18s' }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#2a2a2a' }} />
            <span style={{ fontSize: 12, color: '#888' }}>or</span>
            <div style={{ flex: 1, height: 1, background: '#2a2a2a' }} />
          </div>

          {/* Social */}
          {[['🇬', 'Continue with Google'], ['🍎', 'Continue with Apple']].map(([icon, label]) => (
            <div key={String(label)} style={{ width: '100%', background: '#1f1f1f', border: '1px solid #2a2a2a', borderRadius: 8, padding: '11px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer', color: '#fff', marginBottom: 10, transition: 'border-color .15s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#333')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a2a')}>
              <span>{String(icon)}</span> {String(label)}
            </div>
          ))}

          <p style={{ textAlign: 'center', fontSize: 14, color: '#888', marginTop: 20 }}>
            Don't have an account?{' '}
            <a onClick={() => nav('/signup')} style={{ color: '#BFFF00', textDecoration: 'none', fontWeight: 600, cursor: 'pointer' }}>Sign Up Free</a>
          </p>
        </div>
      </div>
    </div>
  )
}
