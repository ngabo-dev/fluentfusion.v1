import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/client'
import ScheduleMeetingModal from '../../components/ScheduleMeetingModal'

export default function LiveSessions() {
  const nav = useNavigate()
  const [meetings, setMeetings] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')

  useEffect(() => {
    api.get('/api/meetings').then(r => setMeetings(r.data)).catch(() => {})
  }, [])

  async function cancel(roomId: string) {
    if (!confirm('Cancel this session?')) return
    await api.delete(`/api/meetings/${roomId}`)
    setMeetings(prev => prev.map(m => m.room_id === roomId ? { ...m, status: 'cancelled' } : m))
  }

  const live = meetings.filter(m => m.status === 'live')
  const upcoming = meetings.filter(m => m.status === 'scheduled' || m.status === 'live')
  const past = meetings.filter(m => m.status === 'ended' || m.status === 'cancelled')
  const list = tab === 'upcoming' ? upcoming : past

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Sessions & Meetings</h1><p>Schedule and monitor all platform sessions</p></div>
        <div className="pa"><button className="btn bp" onClick={() => setShowModal(true)}>+ Schedule Session</button></div>
      </div>

      {showModal && (
        <ScheduleMeetingModal
          onClose={() => setShowModal(false)}
          onCreated={m => setMeetings(prev => [m, ...prev])}
        />
      )}

      <div className="sr sr3" style={{ marginBottom: 20 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, color: '#FF4444' }}>{live.length}</div>
          <div style={{ fontSize: 11, color: 'var(--mu)' }}>🔴 Live Right Now</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, color: 'var(--neon)' }}>{upcoming.length}</div>
          <div style={{ fontSize: 11, color: 'var(--mu)' }}>Upcoming</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800 }}>{meetings.length}</div>
          <div style={{ fontSize: 11, color: 'var(--mu)' }}>Total Sessions</div>
        </div>
      </div>

      <div className="tabs" style={{ marginBottom: 16 }}>
        <div className={`tab${tab === 'upcoming' ? ' active' : ''}`} onClick={() => setTab('upcoming')}>Upcoming ({upcoming.length})</div>
        <div className={`tab${tab === 'past' ? ' active' : ''}`} onClick={() => setTab('past')}>Past ({past.length})</div>
      </div>

      {list.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--mu)', fontFamily: 'JetBrains Mono', fontSize: 11 }}>
          No sessions found.
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
                  {m.is_host && <span style={{ fontSize: 10, color: '#BFFF00', fontFamily: 'JetBrains Mono', background: 'rgba(191,255,0,0.1)', padding: '2px 6px', borderRadius: 4 }}>YOUR SESSION</span>}
                </div>
                <div style={{ fontSize: 11, color: 'var(--mu)' }}>
                  {dt.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} · {m.duration_min} min · {m.invite_count} invited · Host: {m.host_name}
                </div>
                {m.description && <div style={{ fontSize: 11, color: '#555', marginTop: 3 }}>{m.description}</div>}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {!isCancelled && (
                  <>
                    <button className="btn bp sm" onClick={() => nav(`/meeting/${m.room_id}`)}>
                      {isLive ? '🔴 Join' : '▶ Open'}
                    </button>
                    {m.is_host && tab === 'upcoming' && (
                      <button className="btn bg sm" onClick={() => cancel(m.room_id)}>Cancel</button>
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
