import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../../api/client'

export default function ConfirmEmailChange() {
  const [params] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const token = params.get('token')
    if (!token) { setStatus('error'); setMsg('Invalid link.'); return }
    api.get(`/api/auth/confirm-email-change?token=${token}`)
      .then(r => {
        // Update stored user email
        const stored = localStorage.getItem('ff_user')
        if (stored) {
          const u = JSON.parse(stored)
          u.email = r.data.email
          localStorage.setItem('ff_user', JSON.stringify(u))
        }
        setMsg(`Your email has been updated to ${r.data.email}`)
        setStatus('ok')
      })
      .catch(e => { setStatus('error'); setMsg(e?.response?.data?.detail || e?.message || 'Link invalid or expired.') })
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 16, padding: 40, maxWidth: 420, width: '100%', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 800, marginBottom: 24 }}>
          FLUENT<span style={{ color: 'var(--neon)' }}>FUSION</span>
        </div>
        {status === 'loading' && <div style={{ color: 'var(--mu)', fontSize: 14 }}>Confirming your new email…</div>}
        {status === 'ok' && (
          <>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <div style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Email Updated!</div>
            <div style={{ fontSize: 13, color: 'var(--mu)', marginBottom: 24 }}>{msg}</div>
            <Link to="/login" className="btn bp" style={{ display: 'inline-block', textDecoration: 'none' }}>Back to Login</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ fontSize: 40, marginBottom: 12 }}>❌</div>
            <div style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--er)' }}>Link Invalid</div>
            <div style={{ fontSize: 13, color: 'var(--mu)', marginBottom: 24 }}>{msg}</div>
            <Link to="/login" className="btn bo" style={{ display: 'inline-block', textDecoration: 'none' }}>Back to Login</Link>
          </>
        )}
      </div>
    </div>
  )
}
