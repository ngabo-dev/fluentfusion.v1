import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'

export default function LiveSessionBanner({ endpoint }: { endpoint: string }) {
  const [session, setSession] = useState<any>(null)
  const [visible, setVisible] = useState(true)
  const [blink, setBlink] = useState(true)
  const nav = useNavigate()
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const check = () =>
      api.get(endpoint).then(r => {
        const list: any[] = Array.isArray(r.data) ? r.data : (r.data.sessions ?? r.data.meetings ?? [])
        const live = list.find((s: any) => s.status === 'live')
        setSession(live ?? null)
      }).catch(() => {})

    check()
    timerRef.current = setInterval(check, 15000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [endpoint])

  useEffect(() => {
    if (!session) return
    const t = setInterval(() => setBlink(b => !b), 700)
    return () => clearInterval(t)
  }, [session])

  if (!session || !visible) return null

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      background: 'rgba(255,68,68,0.08)',
      border: '1px solid rgba(255,68,68,0.35)',
      borderRadius: 12, padding: '10px 16px', marginBottom: 16,
      animation: 'none', position: 'relative', flexWrap: 'wrap',
    }}>
      {/* Blinking dot */}
      <div style={{
        width: 10, height: 10, borderRadius: '50%',
        background: '#FF4444',
        boxShadow: blink ? '0 0 8px #FF4444' : 'none',
        flexShrink: 0, transition: 'box-shadow .3s',
      }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#FF4444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          🔴 Live Now
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginLeft: 10 }}>
          {session.title}
        </span>
        <span style={{ fontSize: 11, color: '#888', marginLeft: 8 }}>
          · hosted by {session.host_name}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button
          onClick={() => nav(`/meeting/${session.room_id}`, { state: { meeting: session } })}
          style={{
            padding: '6px 14px', borderRadius: 8, background: 'transparent',
            border: '1px solid rgba(255,68,68,0.5)', color: '#FF4444',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>
          View Details
        </button>
        <button
          onClick={() => nav(`/meeting/${session.room_id}`)}
          style={{
            padding: '6px 14px', borderRadius: 8, background: '#FF4444',
            border: 'none', color: '#fff',
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}>
          Join Now →
        </button>
      </div>

      <button
        onClick={() => setVisible(false)}
        style={{ position: 'absolute', top: 8, right: 10, background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>
        ✕
      </button>
    </div>
  )
}
