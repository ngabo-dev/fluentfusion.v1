import React, { useEffect, useState } from 'react'
import api from '../../api/client'

export default function LiveSessions() {
  const [sessions, setSessions] = useState<any[]>([])
  useEffect(() => { api.get('/api/instructor/live-sessions').then(r => setSessions(r.data)) }, [])

  const live = sessions.filter(s => s.status === 'live')
  const upcoming = sessions.filter(s => s.status === 'scheduled')
  const past = sessions.filter(s => s.status === 'completed')

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Live Sessions</h1><p>Schedule and manage your live classes</p></div>
        <div className="pa"><button className="btn bp">+ Schedule Session</button></div>
      </div>
      {live.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
            <span className="lv">● LIVE NOW</span>
            <span style={{ fontSize: 11, color: 'var(--mu)' }}>{live.length} session{live.length > 1 ? 's' : ''} in progress</span>
          </div>
          {live.map(s => {
            const dt = new Date(s.scheduled_at)
            return (
              <div key={s.id} className="sesk" style={{ borderColor: 'rgba(255,68,68,.4)', background: 'rgba(255,68,68,.03)' }}>
                <div className="stb"><div className="hr">{dt.getHours().toString().padStart(2,'0')}</div><div className="ap">{dt.getHours() < 12 ? 'AM' : 'PM'}</div></div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600 }}>{s.title}</div><div style={{ fontSize: 10, color: 'var(--mu)' }}>{s.flag_emoji} {s.course} · {s.attendees} attendees live</div></div>
                <button className="btn bp sm">JOIN LIVE</button>
              </div>
            )
          })}
        </div>
      )}
      {upcoming.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, textTransform: 'uppercase', letterSpacing: '.15em', color: 'var(--mu)', marginBottom: 8 }}>Upcoming</div>
          {upcoming.map(s => {
            const dt = new Date(s.scheduled_at)
            return (
              <div key={s.id} className="sesk">
                <div className="stb"><div className="hr">{dt.getHours().toString().padStart(2,'0')}</div><div className="ap">{dt.getHours() < 12 ? 'AM' : 'PM'}</div></div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 500 }}>{s.title}</div><div style={{ fontSize: 10, color: 'var(--mu)' }}>{s.flag_emoji} {s.course} · {dt.toLocaleDateString()}</div></div>
                <button className="btn bg sm">Cancel</button>
                <button className="btn bo sm">Start</button>
              </div>
            )
          })}
        </div>
      )}
      <div className="card">
        <div className="ch"><span className="ch-t">Past Sessions</span></div>
        <table className="tbl"><thead><tr><th>Session</th><th>Course</th><th>Date</th><th>Attendees</th><th>Duration</th><th>Recording</th></tr></thead>
        <tbody>{past.map(s => (
          <tr key={s.id}>
            <td>{s.title}</td>
            <td>{s.course}</td>
            <td style={{ color: 'var(--mu)' }}>{new Date(s.scheduled_at).toLocaleDateString()}</td>
            <td>{s.attendees}</td>
            <td>{s.duration_min} min</td>
            <td>{s.recording_url ? <span style={{ color: 'var(--in)', cursor: 'pointer' }}>Watch →</span> : <span style={{ color: 'var(--mu)' }}>—</span>}</td>
          </tr>
        ))}</tbody></table>
      </div>
    </div>
  )
}
