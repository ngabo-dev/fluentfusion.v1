import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authApi } from '../../api/client'
import PasswordStrength, { validatePassword } from '../../components/PasswordStrength'
import { AlertTriangle, Brain, Check, Eye, EyeOff, KeyRound, Lock } from 'lucide-react'

export default function ResetPassword() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [success, setSuccess] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    const pwErr = validatePassword(pw)
    if (pwErr) return setErr(pwErr)
    if (pw !== confirm) return setErr('Passwords do not match')
    if (!token) return setErr('Invalid reset link. Please request a new one.')
    setLoading(true)
    try {
      await authApi.resetPassword({ token, new_password: pw })
      setSuccess('Password reset! Redirecting to login...')
      setTimeout(() => nav('/login'), 2000)
    } catch (ex: any) {
      setErr(ex.message || 'Failed to reset password. The link may have expired.')
    } finally { setLoading(false) }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#1f1f1f', border: '1px solid #2a2a2a',
    borderRadius: 8, padding: '12px 16px 12px 44px',
    fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: '#fff', outline: 'none',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'DM Sans', sans-serif" }}>
      <nav style={{ height: 66, background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', padding: '0 40px' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
          <div style={{ width: 38, height: 38, background: '#BFFF00', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}><Brain size={16} /></div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, textTransform: 'uppercase', color: '#fff' }}>
            FLUENT<span style={{ color: '#BFFF00' }}>FUSION</span>
          </div>
        </a>
      </nav>

      <div style={{ minHeight: 'calc(100vh - 66px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, position: 'relative' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, background: 'radial-gradient(circle, rgba(191,255,0,0.06) 0%, transparent 65%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: 420, background: '#151515', border: '1px solid #2a2a2a', borderRadius: 20, padding: 44, position: 'relative', zIndex: 2 }}>
          <a onClick={() => nav('/login')} style={{ fontSize: 13, color: '#888', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28, cursor: 'pointer' }}>← Back to Login</a>

          <div style={{ width: 56, height: 56, background: 'rgba(191,255,0,0.1)', border: '1px solid rgba(191,255,0,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 20px' }}><KeyRound size={16} /></div>

          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, textTransform: 'uppercase', textAlign: 'center', marginBottom: 8 }}>
            New <span style={{ color: '#BFFF00' }}>Password</span>
          </div>
          <p style={{ fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 28 }}>Enter your new password below.</p>

          {err && <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: 8, padding: '10px 14px', color: '#FF4444', fontSize: 13, marginBottom: 16 }}><AlertTriangle size={16} /> {err}</div>}
          {success && <div style={{ background: 'rgba(0,255,127,0.08)', border: '1px solid rgba(0,255,127,0.25)', borderRadius: 8, padding: '10px 14px', color: '#00FF7F', fontSize: 13, marginBottom: 16 }}><Check size={16} /> {success}</div>}

          <form onSubmit={submit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 7 }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#555' }}><Lock size={16} /></span>
                <input style={inputStyle} type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters" value={pw} onChange={e => setPw(e.target.value)} required
                  onFocus={e => (e.target.style.borderColor = '#BFFF00')} onBlur={e => (e.target.style.borderColor = '#2a2a2a')} />
                <span onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: 15, color: '#555', userSelect: 'none' }}>{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</span>
              </div>
              <PasswordStrength password={pw} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 7 }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#555' }}><Lock size={16} /></span>
                <input style={{ ...inputStyle, borderColor: confirm && confirm !== pw ? '#FF4444' : '#2a2a2a' }} type={showPw ? 'text' : 'password'} placeholder="Repeat password" value={confirm} onChange={e => setConfirm(e.target.value)} required
                  onFocus={e => (e.target.style.borderColor = '#BFFF00')} onBlur={e => (e.target.style.borderColor = confirm !== pw ? '#FF4444' : '#2a2a2a')} />
              </div>
            </div>
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '15px', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', border: 'none', background: '#BFFF00', color: '#0a0a0a', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Resetting...' : 'Reset Password →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
