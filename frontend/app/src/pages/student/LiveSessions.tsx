import React, { useEffect, useState } from 'react'
import api from '../../api/client'

export default function LiveSessions() {
  const [sessions, setSessions] = useState<any[]>([])
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  useEffect(() => { api.get('/api/student/live-sessions').then(r => setSessions(r.data)) }, [])

  const upcoming = sessions.filter(s => s.status === 'scheduled' || s.status === 'live')
  const past = sessions.filter(s => s.status === 'completed')
  const list = tab === 'upcoming' ? upcoming : past

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Live Sessions</h1><p>Join live classes and watch recordings from your enrolled courses</p></div>
      </div>

      <div className="tabs">
        <div className={`tab${tab === 'upcoming' ? ' active' : ''}`} onClick={() => setTab('upcoming')}>Upcoming ({upcoming.length})</div>
        <div className={`tab${tab === 'past' ? ' active' : ''}`} onClick={() => setTab('past')}>Recordings ({past.length})</div>
      </div>

      {list.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--mu)', fontFamily: 'JetBrains Mono', fontSize: 11 }}>
          {tab === 'upcoming' ? 'No upcoming sessions' : 'No recordings available'}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {list.map(s => {
          const dt = new Date(s.scheduled_at)
          return (
            <div key={s.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ textAlign: 'center', minWidth: 56, background: 'rgba(191,255,0,.07)', borderRadius: 8, padding: '8px 10px' }}>
                <div style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, color: 'var(--neon)', lineHeight: 1 }}>{dt.getDate()}</div>
                <div style={{ fontSize: 9, color: 'var(--mu)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }}>{dt.toLocaleString('en', { month: 'short' })}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 18 }}>{s.flag_emoji}</span>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{s.title}</span>
                  {s.status === 'live' && <span className="lv">LIVE</span>}
                  {s.status === 'completed' && <span className="bdg bk">Recorded</span>}
                </div>
                <div style={{ fontSize: 11, color: 'var(--mu)' }}>{s.course} · {s.duration_min} min · {s.attendees} attendees</div>
                <div style={{ fontSize: 10, color: 'var(--mu)', marginTop: 3, fontFamily: 'JetBrains Mono' }}>
                  {dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div>
                {s.status === 'live' && <button className="btn bp">🔴 Join Now</button>}
                {s.status === 'scheduled' && <button className="btn bo sm">📅 Remind Me</button>}
                {s.status === 'completed' && s.recording_url && <button className="btn bo sm">▶ Watch</button>}
                {s.status === 'completed' && !s.recording_url && <button className="btn bg sm" disabled>No Recording</button>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
