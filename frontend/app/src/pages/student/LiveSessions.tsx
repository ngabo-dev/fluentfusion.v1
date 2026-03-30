import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/client'
import { Circle, Play } from 'lucide-react'

export default function LiveSessions() {
  const nav = useNavigate()
  const [meetings, setMeetings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')

  useEffect(() => {
    api.get('/api/meetings')
      .then(r => setMeetings(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="pgload" />

  const upcoming = meetings.filter(m => m.status === 'scheduled' || m.status === 'live')
  const past = meetings.filter(m => m.status === 'ended' || m.status === 'cancelled')
  const list = tab === 'upcoming' ? upcoming : past

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Live Sessions</h1><p>Join sessions you've been invited to</p></div>
      </div>

      <div className="tabs" style={{ marginBottom: 16 }}>
        <div className={`tab${tab === 'upcoming' ? ' active' : ''}`} onClick={() => setTab('upcoming')}>Upcoming ({upcoming.length})</div>
        <div className={`tab${tab === 'past' ? ' active' : ''}`} onClick={() => setTab('past')}>Past ({past.length})</div>
      </div>

      {list.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--mu)', fontFamily: 'JetBrains Mono', fontSize: 11 }}>
          {tab === 'upcoming' ? 'No upcoming sessions.' : 'No past sessions.'}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {list.map(m => {
          const dt = new Date(m.scheduled_at)
          const isLive = m.status === 'live'
          const isCancelled = m.status === 'cancelled'
          return (
            <div key={m.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: isCancelled ? 0.5 : 1 }}>
              <div style={{ textAlign: 'center', minWidth: 52, background: isLive ? 'rgba(255,68,68,0.1)' : 'rgba(191,255,0,0.07)', borderRadius: 8, padding: '8px 10px' }}>
                <div style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, color: isLive ? '#FF4444' : 'var(--neon)', lineHeight: 1 }}>{dt.getDate()}</div>
                <div style={{ fontSize: 9, color: 'var(--mu)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }}>{dt.toLocaleString('en', { month: 'short' })}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{m.title}</span>
                  {isLive && <span className="lv">● LIVE</span>}
                  {isCancelled && <span className="bdg bk">Cancelled</span>}
                  {m.is_host && <span style={{ fontSize: 10, color: '#BFFF00', fontFamily: 'JetBrains Mono', background: 'rgba(191,255,0,0.1)', padding: '2px 6px', borderRadius: 4 }}>HOST</span>}
                </div>
                <div style={{ fontSize: 11, color: 'var(--mu)' }}>
                  {dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} · {m.duration_min} min · Host: {m.host_name}
                </div>
                {m.description && <div style={{ fontSize: 11, color: '#555', marginTop: 3 }}>{m.description}</div>}
              </div>
              {!isCancelled && (
                <button className={`btn sm ${isLive ? 'bp' : 'bo'}`} onClick={() => nav(`/meeting/${m.room_id}`)}>
                  {isLive ? 'Join Now' : 'Open'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
