import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import { useAuth } from '../../components/AuthContext'

const PULSE_COLORS: Record<string, string> = { thriving: 'var(--ok)', coasting: 'var(--neon)', struggling: 'var(--wa)', burning_out: 'var(--er)', disengaged: 'var(--mu)' }
const MEDALS = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const { user } = useAuth()
  const [students, setStudents] = useState<any[]>([])
  useEffect(() => {
    api.get('/api/student/leaderboard').then(r => setStudents(Array.isArray(r.data) ? r.data : []))
  }, [])

  const myRank = students.find(s => s.is_me)?.rank ?? 0

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Leaderboard</h1><p>See how you rank among fellow learners this month</p></div>
        <div className="pa">
          <select className="sel" style={{ width: 'auto' }}>
            <option>All Time</option><option>This Month</option><option>This Week</option>
          </select>
        </div>
      </div>

      {/* Top 3 podium */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
        {students.slice(0, 3).map((s, i) => (
          <div key={s.id} className="card" style={{ textAlign: 'center', padding: '20px 14px', border: i === 0 ? '1px solid rgba(191,255,0,.3)' : '1px solid var(--bdr)', position: 'relative', order: i === 0 ? 0 : i === 1 ? -1 : 1 }}>
            {i === 0 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--neon), transparent)' }} />}
            <div style={{ fontSize: 28, marginBottom: 8 }}>{MEDALS[i]}</div>
            <div className="av avm" style={{ margin: '0 auto 8px' }}>{s.avatar_initials}</div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{s.name}</div>
            <div style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, color: i === 0 ? 'var(--neon)' : i === 1 ? 'var(--wa)' : 'var(--in)', marginBottom: 4 }}>⚡ {s.xp.toLocaleString()}</div>
            <div style={{ fontSize: 9, color: 'var(--mu)', fontFamily: 'JetBrains Mono' }}>XP POINTS</div>
          </div>
        ))}
      </div>

      {/* Full table */}
      <div className="card">
        <div className="ch"><span className="ch-t">Full Rankings</span>{myRank > 0 && <span style={{ fontSize: 10, color: 'var(--neon)', fontFamily: 'JetBrains Mono' }}>Your rank: #{myRank}</span>}</div>
        <table className="tbl">
          <thead><tr><th>#</th><th>Student</th><th>XP Points</th><th>Courses</th><th>Status</th></tr></thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={s.id} style={s.name === user?.name ? { background: 'rgba(191,255,0,.03)' } : {}}>
                <td style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: i < 3 ? 'var(--neon)' : 'var(--mu)' }}>
                  {i < 3 ? MEDALS[i] : `#${i + 1}`}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="av avs">{s.avatar_initials}</div>
                    <span style={{ fontWeight: s.name === user?.name ? 700 : 400 }}>
                      {s.name} {s.name === user?.name && <span style={{ fontSize: 9, color: 'var(--neon)', fontFamily: 'JetBrains Mono' }}>(you)</span>}
                    </span>
                  </div>
                </td>
                <td style={{ fontFamily: 'Syne', fontWeight: 800, color: 'var(--neon)' }}>⚡ {s.xp.toLocaleString()}</td>
                <td style={{ color: 'var(--mu)' }}>{s.courses}</td>
                <td>
                  <span style={{ fontSize: 10, color: PULSE_COLORS[s.pulse_state], fontFamily: 'JetBrains Mono', textTransform: 'capitalize' }}>
                    ● {s.pulse_state.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
