import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../components/AuthContext'
import PasswordStrength, { validatePassword } from '../../components/PasswordStrength'
import { AlertTriangle, Brain, Check, ClipboardList, Diamond, Eye, EyeOff, Flame, GraduationCap, Lock, Mail, Target, User, Video } from 'lucide-react'

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

export default function Signup() {
  const nav = useNavigate()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [role, setRole] = useState<'student' | 'instructor'>('student')
  const [showPw, setShowPw] = useState(false)
  const [err, setErr] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    if (!name.trim()) return setErr('Full name is required')
    const pwErr = validatePassword(pw)
    if (pwErr) return setErr(pwErr)
    setLoading(true)
    try {
      const res = await register(name, email, pw, role)
      setSuccess(`Account created! Welcome, ${res?.user?.name || name}. Check your email for a verification code.`)
      localStorage.setItem('verification_email', email)
      nav('/verify-email')
    } catch (ex: any) {
      const msg = ex?.message || 'Registration failed'
      if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already exists')) setErr('This email is already registered. Try signing in instead.')
      else if (msg.toLowerCase().includes('password')) setErr('Password must be at least 6 characters.')
      else if (msg.toLowerCase().includes('role')) setErr('Invalid role selected.')
      else if (msg.includes('network') || msg.includes('fetch') || msg.includes('Failed')) setErr('Cannot connect to server. Make sure the backend is running.')
      else setErr(msg)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#1f1f1f', border: '1px solid #2a2a2a',
    borderRadius: 8, padding: '12px 16px 12px 44px',
    fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: '#fff',
    outline: 'none',
  }
  const iconStyle: React.CSSProperties = {
    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
    fontSize: 16, color: '#555',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0a0a', color: '#fff', fontFamily: "'DM Sans', sans-serif" }}>

      {/* NAV */}
      <nav style={{ height: 66, background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid #2a2a2a', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
          <div style={{ width: 38, height: 38, background: '#BFFF00', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}><Brain size={16} /></div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#fff' }}>
            FLUENT<span style={{ color: '#BFFF00' }}>FUSION</span>
          </div>
        </a>
        <div style={{ fontSize: 14, color: '#888' }}>
          Already have an account?{' '}
          <a onClick={() => nav('/login')} style={{ color: '#BFFF00', textDecoration: 'none', fontWeight: 600, cursor: 'pointer' }}>Sign In</a>
        </div>
      </nav>

      {/* BODY */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 66px)' }}>

        {/* LEFT PANEL */}
        <div style={{ background: '#0f0f0f', borderRight: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 90% 70% at 20% 50%, rgba(191,255,0,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 2, maxWidth: 380 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(191,255,0,0.10)', border: '1px solid rgba(191,255,0,0.2)', borderRadius: 99, padding: '4px 12px', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#BFFF00', marginBottom: 16 }}>
              <Diamond size={16} /> Start for Free
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 24 }}>
              JOIN 2 MILLION<br /><span style={{ color: '#BFFF00' }}>LEARNERS</span><br />WORLDWIDE
            </div>
            <p style={{ fontSize: 15, color: '#888', lineHeight: 1.7, marginBottom: 36 }}>
              Create your free account and start your language learning journey today.
            </p>
            {[
              [<Target size={16} />, 'Personalized AI Learning', 'Adapts to your skill level automatically'],
              [<Flame size={16} />, 'Daily Streaks & Gamification', 'Stay motivated with XP and achievements'],
              [<Video size={16} />, 'Live Instructor Sessions', 'Practice with native speakers in real time'],
            ].map(([icon, title, desc]) => (
              <div key={String(title)} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, background: 'rgba(191,255,0,0.10)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{String(icon)}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{String(title)}</div>
                  <div style={{ fontSize: 13, color: '#888' }}>{String(desc)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 40px', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: 440 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 6 }}>Create Account</div>
            <div style={{ fontSize: 14, color: '#888', marginBottom: 32 }}>Start your language learning journey</div>

            <form onSubmit={submit}>
              {/* Full Name */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 7 }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconStyle}><User size={16} /></span>
                  <input style={inputStyle} type="text" placeholder="Jean Pierre Habimana" value={name} onChange={e => setName(e.target.value)} required
                    onFocus={e => (e.target.style.borderColor = '#BFFF00')}
                    onBlur={e => (e.target.style.borderColor = '#2a2a2a')} />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 7 }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconStyle}><Mail size={16} />️</span>
                  <input style={inputStyle} type="email" placeholder="jean@example.com" value={email} onChange={e => setEmail(e.target.value)} required
                    onFocus={e => (e.target.style.borderColor = '#BFFF00')}
                    onBlur={e => (e.target.style.borderColor = '#2a2a2a')} />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 7 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconStyle}><Lock size={16} /></span>
                  <input style={inputStyle} type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters" value={pw} onChange={e => setPw(e.target.value)} required
                    onFocus={e => (e.target.style.borderColor = '#BFFF00')}
                    onBlur={e => (e.target.style.borderColor = '#2a2a2a')} />
                  <span onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: 15, color: '#555', userSelect: 'none' }}>{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</span>
                </div>
                <PasswordStrength password={pw} />
              </div>

              {/* Role */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 7 }}>I Am A...</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {([['student', <GraduationCap size={16} />, 'Student', 'I want to learn'], ['instructor', <ClipboardList size={16} />, 'Instructor', 'I want to teach']] as const).map(([r, icon, label, desc]) => (
                    <div key={r} onClick={() => setRole(r)}
                      style={{ background: role === r ? 'rgba(191,255,0,0.10)' : '#1f1f1f', border: `1px solid ${role === r ? '#BFFF00' : '#2a2a2a'}`, borderRadius: 14, padding: 18, textAlign: 'center', cursor: 'pointer', transition: 'all .15s' }}>
                      <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
                      <div style={{ fontSize: 12, color: '#888', marginTop: 3 }}>{desc}</div>
                    </div>
                  ))}
                </div>
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
                style={{ width: '100%', padding: '15px 36px', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', border: 'none', background: '#BFFF00', color: '#0a0a0a', marginTop: 8, opacity: loading ? 0.7 : 1, transition: 'all .18s' }}>
                {loading ? 'Creating account...' : 'Create Free Account →'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#2a2a2a' }} />
              <span style={{ fontSize: 12, color: '#888', whiteSpace: 'nowrap' }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: '#2a2a2a' }} />
            </div>

            {/* Social buttons */}
            {[[<GoogleIcon />, 'Continue with Google'], [<AppleIcon />, 'Continue with Apple']].map(([icon, label]) => (
              <div key={String(label)} style={{ width: '100%', background: '#1f1f1f', border: '1px solid #2a2a2a', borderRadius: 8, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer', color: '#fff', marginBottom: 10, transition: 'border-color .15s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#333')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a2a')}>
                <span>{String(icon)}</span> {String(label)}
              </div>
            ))}

            <p style={{ fontSize: 12, color: '#888', textAlign: 'center', marginTop: 20 }}>
              By signing up you agree to our{' '}
              <a href="#" style={{ color: '#BFFF00', textDecoration: 'none' }}>Terms</a> and{' '}
              <a href="#" style={{ color: '#BFFF00', textDecoration: 'none' }}>Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
