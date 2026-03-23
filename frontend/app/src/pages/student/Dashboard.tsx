import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/client'
import { useAuth } from '../../components/AuthContext'
import LiveSessionBanner from '../../components/LiveSessionBanner'

const PULSE_LABELS: Record<string, string> = { thriving: '🔥 Thriving', coasting: '⚡ Coasting', struggling: '⚠️ Struggling', burning_out: '😮‍💨 Burning Out', disengaged: '💤 Disengaged' }

export default function Dashboard() {
  const [data, setData] = useState<any>(null)
  const { user } = useAuth()
  const nav = useNavigate()
  useEffect(() => { api.get('/api/student/dashboard').then(r => setData(r.data)) }, [])
  if (!data) return <div className="loading" />

  return (
    <div className="pg">
      <LiveSessionBanner endpoint="/api/meetings" />
      <div className="ph">
        <div>
          <h1>Welcome back, {user?.name?.split(' ')[0] ?? 'Student'} 👋</h1>
          <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="pa">
          <button className="btn bp" onClick={() => nav('/dashboard/courses')}>📚 My Courses</button>
          <button className="btn bo sm" onClick={() => nav('/dashboard/live-sessions')}>🎙️ Live</button>
        </div>
      </div>

      {/* Stat Row */}
      <div className="sr">
        <div className="sc">
          <div className="sl">Enrolled Courses</div>
          <div className="sv">{data.total_courses}</div>
          <div className="ss2">Active enrollments</div>
        </div>
        <div className="sc ok">
          <div className="sl">Avg Completion</div>
          <div className="sv ok">{data.avg_completion?.toFixed(0)}%</div>
          <div className="ss2">Across all courses</div>
        </div>
        <div className="sc wa">
          <div className="sl">Total Spent</div>
          <div className="sv wa">${data.total_spent?.toLocaleString()}</div>
          <div className="ss2">Lifetime investment</div>
        </div>
        <div className="sc in">
          <div className="sl">XP Points</div>
          <div className="sv in">⚡ {data.xp?.toLocaleString()}</div>
          <div className="ss2">
            <span className={`pulse-badge pulse-${data.pulse_state}`}>{PULSE_LABELS[data.pulse_state] ?? data.pulse_state}</span>
          </div>
        </div>
      </div>

      <div className="g21">
        {/* Enrolled Courses */}
        <div className="card">
          <div className="ch">
            <span className="ch-t">My Courses</span>
            <span className="ch-a" onClick={() => nav('/dashboard/courses')}>View All →</span>
          </div>
          {data.enrolled_courses?.length === 0 && <div style={{ color: 'var(--mu)', fontSize: 12, padding: '20px 0', textAlign: 'center' }}>No courses enrolled yet</div>}
          {data.enrolled_courses?.slice(0, 4).map((c: any) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,.04)', cursor: 'pointer' }} onClick={() => nav('/dashboard/courses')}>
              <div style={{ width: 36, height: 36, background: 'rgba(191,255,0,.08)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{c.flag_emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</div>
                <div style={{ fontSize: 10, color: 'var(--mu)', marginBottom: 5 }}>{c.instructor} · {c.level}</div>
                <div className="pt"><div className="pf" style={{ width: `${c.completion}%` }} /></div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'Syne', fontSize: 14, fontWeight: 800, color: 'var(--neon)' }}>{c.completion}%</div>
                <div style={{ fontSize: 9, color: 'var(--mu)' }}>{c.lesson_count} lessons</div>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Sessions */}
        <div className="card">
          <div className="ch">
            <span className="ch-t">Upcoming Sessions</span>
            <span className="ch-a" onClick={() => nav('/dashboard/live-sessions')}>All →</span>
          </div>
          {data.upcoming_sessions?.length === 0 && <div style={{ color: 'var(--mu)', fontSize: 12, padding: '20px 0', textAlign: 'center' }}>No upcoming sessions</div>}
          {data.upcoming_sessions?.map((s: any) => {
            const dt = new Date(s.scheduled_at)
            const hr = dt.getHours().toString().padStart(2, '0')
            const ampm = dt.getHours() < 12 ? 'AM' : 'PM'
            return (
              <div key={s.id} className="sesk" style={s.status === 'live' ? { borderColor: 'rgba(255,68,68,.4)' } : {}}>
                <div className="stb"><div className="hr">{hr}</div><div className="ap">{ampm}</div></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{s.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--mu)' }}>{s.attendees} attendees</div>
                </div>
                {s.status === 'live' ? <span className="lv">LIVE</span> : <span className="sv2">Soon</span>}
              </div>
            )
          })}

          {/* XP Progress */}
          <div style={{ marginTop: 16, padding: '12px', background: 'var(--card2)', borderRadius: 'var(--r)', border: '1px solid var(--bdr)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600 }}>⚡ XP Progress</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--neon)' }}>{data.xp} / {Math.ceil(data.xp / 500) * 500} XP</span>
            </div>
            <div className="xp-bar"><div className="xp-fill" style={{ width: `${(data.xp % 500) / 5}%` }} /></div>
            <div style={{ fontSize: 10, color: 'var(--mu)', marginTop: 5 }}>
              {500 - (data.xp % 500)} XP to next level
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
