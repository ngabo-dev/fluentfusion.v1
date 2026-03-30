import React, { useState } from 'react'
import api from '../api/client'
import { Mic, MicOff } from 'lucide-react'

interface Props {
  sessionId: string | number
  onAllow: () => void
  onDecline: () => void
}

export default function RecordingConsentModal({ sessionId, onAllow, onDecline }: Props) {
  const [loading, setLoading] = useState(false)

  async function respond(accepted: boolean) {
    setLoading(true)
    try {
      await api.post('/api/v1/ethics/consent', {
        consent_type: 'live_session_recording',
        accepted,
        version: '1.0',
        session_id: String(sessionId),
      })
    } catch { /* non-blocking */ }
    setLoading(false)
    if (accepted) onAllow()
    else onDecline()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#151515', border: '1px solid #2a2a2a', borderRadius: 16, padding: 32, width: 'min(460px, 100%)', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, background: 'rgba(255,68,68,.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#FF4444' }}>
          <Mic size={28} />
        </div>

        <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, marginBottom: 12 }}>
          This session may be recorded
        </div>

        <p style={{ fontSize: 14, color: '#888', lineHeight: 1.7, marginBottom: 24 }}>
          Your instructor has requested to record this session for educational review purposes.
          Recordings are stored for <strong style={{ color: '#fff' }}>30 days</strong> and then permanently deleted.
          You can request early deletion at any time via your{' '}
          <a href="/dashboard/data-rights" style={{ color: '#BFFF00' }}>Data Rights Dashboard</a>.
        </p>

        <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 10, padding: 14, marginBottom: 24, fontSize: 12, color: '#666', textAlign: 'left' }}>
          <div style={{ marginBottom: 6 }}>✓ Recording is used only for educational review</div>
          <div style={{ marginBottom: 6 }}>✓ Only enrolled students and the instructor can access it</div>
          <div>✓ You can request deletion at any time</div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => respond(true)} disabled={loading}
            style={{ flex: 1, background: '#BFFF00', color: '#000', border: 'none', borderRadius: 10, padding: '13px 0', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Mic size={16} /> Allow Recording
          </button>
          <button onClick={() => respond(false)} disabled={loading}
            style={{ flex: 1, background: 'none', border: '1px solid #2a2a2a', borderRadius: 10, padding: '13px 0', color: '#888', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <MicOff size={16} /> Join Without Recording
          </button>
        </div>

        <p style={{ fontSize: 11, color: '#555', marginTop: 14 }}>
          Your choice is recorded and stored per our{' '}
          <a href="/privacy" style={{ color: '#BFFF00' }}>Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}
