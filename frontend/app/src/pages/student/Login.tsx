import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../components/AuthContext'
import api from '../../api/client'
import { AlertTriangle, Brain, Check, Eye, EyeOff, Lock, Mail } from 'lucide-react'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const AppleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
)

export default function Login() {
  const nav = useNavigate()
  const { login, loginWithToken } = useAuth()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPw, setShowPw] = useState(false)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)
  const googleBtnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = () => {
      ;(window as any).google?.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
      })
      if (googleBtnRef.current) {
        googleBtnRef.current.innerHTML = ''
        ;(window as any).google?.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'filled_black', size: 'large', width: 280, text: 'continue_with',
        })
      }
    }
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  async function handleGoogleCredential(response: any) {
    setGoogleLoading(true)
    setErr('')
    try {
      const res = await api.post('/api/auth/google', { credential: response.credential })
      const { access_token, role, name, id, is_first_login } = res.data
      loginWithToken(access_token, { role, name, id })
      if (role === 'admin' || role === 'super_admin') nav('/admin')
      else if (role === 'instructor') nav('/instructor')
      else if (is_first_login) nav('/onboard/native-language')
      else nav('/dashboard')
    } catch (e: any) {
      setErr(e.response?.data?.detail || 'Google sign-in failed')
    } finally {
      setGoogleLoading(false)
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr(''); setLoading(true)
    try {
      const res = await login(email, pw, remember)
      const role = res?.user?.role
      const isFirst = res?.is_first_login
      setSuccess('Welcome! Redirecting...')
      setTimeout(() => {
        if (role === 'admin' || role === 'super_admin') nav('/admin')
        else if (role === 'instructor') nav('/instructor')
        else {
          // Students always go through onboarding on first login
          if (isFirst) {
            localStorage.removeItem('onboarding_native_lang')
            localStorage.removeItem('onboarding_learn_lang')
            localStorage.removeItem('onboarding_goal')
            localStorage.removeItem('onboarding_level')
            nav('/onboard/native-language')
          } else {
            const steps = [
              { key: 'onboarding_native_lang', path: '/onboard/native-language' },
              { key: 'onboarding_learn_lang',  path: '/onboard/learn-language' },
              { key: 'onboarding_goal',        path: '/onboard/goal' },
              { key: 'onboarding_level',       path: '/onboard/level' },
            ]
            const next = steps.find(s => !localStorage.getItem(s.key))
            nav(next ? next.path : '/dashboard')
          }
        }
      }, 800)
    } catch (ex: any) {
      const msg = ex?.message || 'Invalid credentials'
      if (msg.includes('EMAIL_NOT_VERIFIED')) {
        localStorage.setItem('verification_email', email)
        setErr('Please verify your email first. Redirecting to verification...')
        setTimeout(() => nav(`/verify-email?email=${encodeURIComponent(email)}`), 1800)
      } else if (msg.includes('401') || msg.toLowerCase().includes('invalid')) {
        setErr('Incorrect email or password. Please try again.')
      } else if (msg.includes('suspended') || msg.includes('banned')) {
        setErr('Your account has been suspended. Contact support.')
      } else if (msg.includes('network') || msg.includes('fetch')) {
        setErr('Cannot connect to server. Make sure the backend is running.')
      } else {
        setErr(msg)
      }
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
          <div style={{ width: 38, height: 38, background: '#BFFF00', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}><Brain size={16} /></div>
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
            <div style={{ width: 34, height: 34, background: '#BFFF00', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}><Brain size={16} /></div>
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
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#555' }}><Mail size={16} />️</span>
                <input style={inputStyle} type="email" placeholder="jean@example.com" value={email} onChange={e => setEmail(e.target.value)} required
                  onFocus={e => (e.target.style.borderColor = '#BFFF00')}
                  onBlur={e => (e.target.style.borderColor = '#2a2a2a')} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 0 }}>
              <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 7 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#555' }}><Lock size={16} /></span>
                <input style={inputStyle} type={showPw ? 'text' : 'password'} placeholder="••••••••" value={pw} onChange={e => setPw(e.target.value)} required
                  onFocus={e => (e.target.style.borderColor = '#BFFF00')}
                  onBlur={e => (e.target.style.borderColor = '#2a2a2a')} />
                <span onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: 15, color: '#555', userSelect: 'none' }}>{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</span>
              </div>
            </div>

            {/* Remember me + Forgot */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '16px 0 20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#888', cursor: 'pointer' }}>
                <div onClick={() => setRemember(!remember)}
                  style={{ width: 16, height: 16, border: `1px solid ${remember ? '#BFFF00' : '#333'}`, borderRadius: 4, background: remember ? 'rgba(191,255,0,0.10)' : '#1f1f1f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#BFFF00', cursor: 'pointer' }}>
                  {remember ? <Check size={16} /> : ''}
                </div>
                Remember me
              </label>
              <a onClick={() => nav('/forgot-password')} style={{ fontSize: 13, color: '#BFFF00', textDecoration: 'none', fontWeight: 600, cursor: 'pointer' }}>Forgot Password?</a>
            </div>

            {success && (
              <div style={{ background: 'rgba(0,255,127,0.08)', border: '1px solid rgba(0,255,127,0.25)', borderRadius: 8, padding: '8px 12px', color: '#00FF7F', fontSize: 13, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Check size={16} /> {success}
              </div>
            )}
            {err && (
              <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: 8, padding: '8px 12px', color: '#FF4444', fontSize: 13, marginBottom: 14 }}>
                <AlertTriangle size={16} /> {err}
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
          {GOOGLE_CLIENT_ID ? (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10, opacity: googleLoading ? 0.6 : 1 }}>
              <div ref={googleBtnRef} />
            </div>
          ) : (
            <button type="button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', maxWidth: 280, margin: '0 auto 10px', background: '#1f1f1f', border: '1px solid #2a2a2a', borderRadius: 8, padding: '11px 20px', fontSize: 14, fontWeight: 500, cursor: 'pointer', color: '#fff' }}>
              <GoogleIcon /> Continue with Google
            </button>
          )}
          <button type="button" disabled style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', maxWidth: 280, margin: '0 auto 10px', background: '#1f1f1f', border: '1px solid #2a2a2a', borderRadius: 8, padding: '11px 20px', fontSize: 14, fontWeight: 500, cursor: 'not-allowed', color: '#555' }}
            title="Apple Sign-In coming soon">
            <AppleIcon /> Continue with Apple
          </button>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#888', marginTop: 20 }}>
            Don't have an account?{' '}
            <a onClick={() => nav('/signup')} style={{ color: '#BFFF00', textDecoration: 'none', fontWeight: 600, cursor: 'pointer' }}>Sign Up Free</a>
          </p>
        </div>
      </div>
    </div>
  )
}
