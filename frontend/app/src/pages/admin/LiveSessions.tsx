import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import StatCard from '../../components/StatCard'

export default function LiveSessions() {
  const [sessions, setSessions] = useState<any[]>([])
  useEffect(() => { api.get('/api/admin/live-sessions').then(r => setSessions(r.data)) }, [])

  const live = sessions.filter(s => s.status === 'live')
  const scheduled = sessions.filter(s => s.status === 'scheduled')
  const completed = sessions.filter(s => s.status === 'completed')

  return (
    <div className="pg">
      <div className="ph"><div><h1>Live Sessions</h1><p>Monitor all platform sessions</p></div></div>
      <div className="sr sr3">
        <StatCard label="🔴 Live Right Now" value={live.length} sub={`${live.reduce((a,s) => a + s.attendees, 0)} total attendees`} variant="er" />
        <StatCard label="Scheduled Today" value={scheduled.length} sub="Upcoming sessions" variant="wa" />
        <StatCard label="Total This Month" value={sessions.length} sub="↑ 14% vs last month" />
      </div>
      <div className="card">
        <table className="tbl"><thead><tr><th>Session</th><th>Instructor</th><th>Course</th><th>Date/Time</th><th>Attendees</th><th>Status</th><th>Recording</th></tr></thead>
        <tbody>{sessions.map(s => (
          <tr key={s.id}>
            <td><b>{s.title}</b></td>
            <td>{s.instructor}</td>
            <td>{s.course}</td>
            <td style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--mu)' }}>{s.scheduled_at?.slice(0,16).replace('T',' · ')}</td>
            <td>{s.attendees}</td>
            <td>{s.status === 'live' ? <span className="lv">● LIVE</span> : s.status === 'scheduled' ? <span className="sv2">Scheduled</span> : <span className="bdg bk">Completed</span>}</td>
            <td>{s.recording_url ? <span style={{ color: 'var(--in)', cursor: 'pointer' }}>Watch →</span> : <span style={{ color: 'var(--mu)' }}>—</span>}</td>
          </tr>
        ))}</tbody></table>
      </div>
    </div>
  )
}
