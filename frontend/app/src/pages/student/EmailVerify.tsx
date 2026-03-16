import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authApi } from '../../api/client'

export default function EmailVerify() {
  const nav = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [success, setSuccess] = useState('')
  const [resendTimer, setResendTimer] = useState(47)

  useEffect(() => {
    const stored = localStorage.getItem('verification_email')
    const urlEmail = new URLSearchParams(location.search).get('email')
    if (stored) setEmail(stored)
    else if (urlEmail) setEmail(urlEmail)

    const t = setInterval(() => setResendTimer(p => p > 0 ? p - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [location])

  const code = otp.join('')

  useEffect(() => {
    if (code.length === 6 && !loading) handleVerify(code)
  }, [code])

  async function handleVerify(c?: string) {
    const verifyCode = c || code
    if (verifyCode.length !== 6) return setErr('Please enter the 6-digit code')
    setLoading(true); setErr(''); setSuccess('')
    try {
      await authApi.verifyEmail({ email, code: verifyCode })
      setSuccess('Email verified! Setting up your profile...')
      localStorage.removeItem('verification_email')
      const stored = localStorage.getItem('ff_user') || sessionStorage.getItem('ff_user')
      const role = stored ? JSON.parse(stored).role : 'student'
      setTimeout(() => {
        if (role === 'instructor') nav('/instructor')
        else if (role === 'admin' || role === 'super_admin') nav('/admin')
        else nav('/onboard/native-language')
      }, 1500)
    } catch (ex: any) {
      setErr(ex.message || 'Invalid code. Please try again.')
      setOtp(['', '', '', '', '', ''])
    } finally { setLoading(false) }
  }

  async function handleResend() {
    if (resendTimer > 0) return
    setLoading(true); setErr('')
    try {
      await authApi.resendVerification({ email })
      setSuccess('New code sent to your email.')
      setResendTimer(47)
    } catch (ex: any) {
      setErr(ex.message || 'Failed to resend. Try again.')
    } finally { setLoading(false) }
  }

  function handleDigit(i: number, val: string) {
    const d = val.replace(/[^0-9]/g, '').slice(-1)
    const next = [...otp]; next[i] = d; setOtp(next)
    if (d && i < 5) (document.querySelectorAll('.otp-box')[i + 1] as HTMLInputElement)?.focus()
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      (document.querySelectorAll('.otp-box')[i - 1] as HTMLInputElement)?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const digits = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6).split('')
    const next = [...otp]; digits.forEach((d, i) => { next[i] = d }); setOtp(next)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <nav style={{ height: 60, background: 'rgba(10,10,10,.97)', borderBottom: '1px solid var(--bdr)', display: 'flex', alignItems: 'center', padding: '0 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => nav('/')}>
          <div className="logo-mark">FF</div>
          <div className="logo-name">Fluent<span>Fusion</span></div>
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: 460, background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 'var(--rl)', padding: '44px 44px 40px', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, background: 'rgba(191,255,0,.1)', border: '1px solid rgba(191,255,0,.2)', borderRadius: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 24px' }}>📧</div>

          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, textTransform: 'uppercase', marginBottom: 8 }}>
            Check Your<br /><span style={{ color: 'var(--neon)' }}>Email</span>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--mu)', marginBottom: 8, lineHeight: 1.6 }}>We sent a verification code to</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg)', marginBottom: 28 }}>{email || 'your email'}</p>

          {err && <div style={{ background: 'rgba(255,68,68,.08)', border: '1px solid rgba(255,68,68,.2)', borderRadius: 'var(--r)', padding: '10px 14px', color: 'var(--er)', fontSize: 13, marginBottom: 16 }}>⚠ {err}</div>}
          {success && <div style={{ background: 'rgba(0,255,127,.08)', border: '1px solid rgba(0,255,127,.2)', borderRadius: 'var(--r)', padding: '10px 14px', color: 'var(--ok)', fontSize: 13, marginBottom: 16 }}>✓ {success}</div>}

          {/* OTP boxes */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 28 }}>
            {otp.map((d, i) => (
              <input
                key={i}
                className="otp-box"
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleDigit(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                onPaste={handlePaste}
                style={{
                  width: 52, height: 60, textAlign: 'center', fontSize: 24, fontFamily: "'Syne', sans-serif", fontWeight: 800,
                  background: 'var(--inp)', border: `1px solid ${d ? 'var(--neon)' : 'var(--bdr)'}`,
                  borderRadius: 'var(--r)', color: 'var(--neon)', outline: 'none'
                }}
              />
            ))}
          </div>

          <button className="btn bp" style={{ width: '100%', padding: '12px 0', fontSize: 15, marginBottom: 20 }} onClick={() => handleVerify()} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Email →'}
          </button>

          <div style={{ fontSize: 13, color: 'var(--mu)' }}>
            Didn't receive the code?{' '}
            <button onClick={handleResend} disabled={resendTimer > 0} style={{ background: 'none', border: 'none', color: resendTimer > 0 ? 'var(--mu2)' : 'var(--neon)', fontSize: 13, fontWeight: 600, cursor: resendTimer > 0 ? 'default' : 'pointer' }}>
              {resendTimer > 0 ? `Resend in 0:${String(resendTimer).padStart(2,'0')}` : 'Resend Code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
