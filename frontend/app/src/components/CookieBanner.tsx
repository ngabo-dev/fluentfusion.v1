import React, { useEffect, useState } from 'react'
import api from '../api/client'
import { useAuth } from './AuthContext'

const STORAGE_KEY = 'ff_cookie_consent'

interface Prefs { analytics: boolean; preferences: boolean }

export default function CookieBanner() {
  const { token } = useAuth()
  const [show, setShow] = useState(false)
  const [managing, setManaging] = useState(false)
  const [prefs, setPrefs] = useState<Prefs>({ analytics: false, preferences: false })

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) setShow(true)
  }, [])

  async function save(analytics: boolean, preferences: boolean) {
    const choice = { analytics, preferences, necessary: true, timestamp: Date.now() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(choice))
    setShow(false)
    if (token) {
      try {
        await api.post('/api/v1/ethics/consent', { consent_type: 'cookie_consent', accepted: true, version: '1.0' })
      } catch { /* non-blocking */ }
    }
  }

  if (!show) return null

  return (
    <>
      {/* Backdrop for manage modal */}
      {managing && (
        <div onClick={() => setManaging(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9998 }} />
      )}

      {/* Manage preferences modal */}
      {managing && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          background: '#151515', border: '1px solid #2a2a2a', borderRadius: 16,
          padding: 28, width: 'min(480px, 90vw)', zIndex: 9999,
        }}>
          <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 18, marginBottom: 20 }}>Cookie Preferences</div>
          {[
            { key: 'necessary' as const, label: 'Strictly Necessary', desc: 'Required for login and core platform features. Cannot be disabled.', locked: true, value: true },
            { key: 'analytics' as const, label: 'Analytics', desc: 'Help us understand how the platform is used (Google Analytics).', locked: false, value: prefs.analytics },
            { key: 'preferences' as const, label: 'Preferences', desc: 'Remember your theme and language settings.', locked: false, value: prefs.preferences },
          ].map(item => (
            <div key={item.key} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '14px 0', borderBottom: '1px solid #1f1f1f' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: '#666' }}>{item.desc}</div>
              </div>
              <div
                onClick={() => !item.locked && setPrefs(p => ({ ...p, [item.key]: !p[item.key as keyof Prefs] }))}
                style={{
                  width: 44, height: 24, borderRadius: 12, flexShrink: 0, cursor: item.locked ? 'not-allowed' : 'pointer',
                  background: item.value ? '#BFFF00' : '#2a2a2a',
                  position: 'relative', transition: 'background .2s',
                  opacity: item.locked ? 0.5 : 1,
                }}>
                <div style={{
                  position: 'absolute', top: 3, left: item.value ? 23 : 3,
                  width: 18, height: 18, borderRadius: '50%',
                  background: item.value ? '#000' : '#555', transition: 'left .2s',
                }} />
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button onClick={() => { setManaging(false); save(prefs.analytics, prefs.preferences) }}
              style={{ flex: 1, background: '#BFFF00', color: '#000', border: 'none', borderRadius: 8, padding: '11px 0', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
              Save Preferences
            </button>
            <button onClick={() => setManaging(false)}
              style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: 8, padding: '11px 16px', color: '#888', cursor: 'pointer', fontSize: 14 }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Banner */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9997,
        background: '#111', borderTop: '1px solid #2a2a2a',
        padding: '16px 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>🍪 We use cookies</div>
          <div style={{ fontSize: 12, color: '#666', lineHeight: 1.5 }}>
            We use strictly necessary cookies to run the platform, and optional analytics and preference cookies to improve your experience.{' '}
            <a href="/cookies" style={{ color: '#BFFF00' }}>Cookie Policy</a>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
          <button onClick={() => setManaging(true)}
            style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: 8, padding: '9px 16px', color: '#888', cursor: 'pointer', fontSize: 13 }}>
            Manage Preferences
          </button>
          <button onClick={() => save(false, false)}
            style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: 8, padding: '9px 16px', color: '#888', cursor: 'pointer', fontSize: 13 }}>
            Reject Non-Essential
          </button>
          <button onClick={() => save(true, true)}
            style={{ background: '#BFFF00', color: '#000', border: 'none', borderRadius: 8, padding: '9px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
            Accept All
          </button>
        </div>
      </div>
    </>
  )
}
