import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import Avatar from '../../components/Avatar'
import Badge from '../../components/Badge'
import Progress from '../../components/Progress'
import { Eye, MessageSquare, Search } from 'lucide-react'

export default function StudentRoster() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/instructor/students')
      .then(r => setStudents(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const pulseBadge: any = { thriving: 'k', coasting: 'i', struggling: 'w', burning_out: 'e', disengaged: 'e' }

  function timeAgo(dateStr: string) {
    if (!dateStr) return '—'
    const diff = Date.now() - new Date(dateStr).getTime()
    const h = Math.floor(diff / 3600000)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  if (loading) return <div className="pgload" />

  return (
    <div className="pg">
      <div className="ph"><div><h1>Student Roster</h1><p>{students.length} students enrolled across your courses</p></div></div>
      <div className="ab">
        <div className="sw"><span className="si2"><Search size={16} /></span><input className="inp" placeholder="Search students..." /></div>
        <select className="sel" style={{ width: 'auto' }}><option>All Courses</option></select>
        <select className="sel" style={{ width: 'auto' }}><option>All PULSE States</option><option>Thriving</option><option>Coasting</option><option>Struggling</option><option>Burning Out</option><option>Disengaged</option></select>
      </div>
      {students.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--mu)', fontFamily: 'JetBrains Mono', fontSize: 12 }}>
          No students enrolled yet.
        </div>
      ) : (
        <div className="card">
          <table className="tbl">
            <thead><tr><th>Student</th><th>Course</th><th>PULSE</th><th>XP</th><th>Completion</th><th>Last Active</th><th></th></tr></thead>
            <tbody>{students.map(s => (
              <tr key={s.id}>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Avatar initials={s.avatar_initials || s.name.slice(0,2).toUpperCase()} /><div><div style={{ fontSize: 12, fontWeight: 500 }}>{s.name}</div><div style={{ fontSize: 10, color: 'var(--mu)' }}>{s.email}</div></div></div></td>
                <td style={{ fontSize: 11 }}>{s.course}</td>
                <td><Badge variant={pulseBadge[s.pulse_state] || 'm'}>{s.pulse_state?.replace('_',' ')}</Badge></td>
                <td style={{ fontFamily: 'JetBrains Mono', color: 'var(--neon)' }}>{s.xp?.toLocaleString()}</td>
                <td><Progress pct={Math.round(s.completion)} /></td>
                <td style={{ color: s.pulse_state === 'disengaged' ? 'var(--er)' : 'var(--mu)' }}>{timeAgo(s.last_active)}</td>
                <td><div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn bg sm"><Eye size={16} />️</button>
                  {['burning_out','disengaged'].includes(s.pulse_state) ? <button className="btn bp sm"><MessageSquare size={16} /> Message</button> : <button className="btn bg sm"><MessageSquare size={16} /></button>}
                </div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}
