import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import Avatar from '../../components/Avatar'
import Badge from '../../components/Badge'
import Progress from '../../components/Progress'

export default function Students() {
  const [students, setStudents] = useState<any[]>([])
  useEffect(() => { api.get('/api/admin/users', { params: { role: 'student' } }).then(r => setStudents(r.data)) }, [])

  const pulseBadge: any = { thriving: 'k', coasting: 'i', struggling: 'w', burning_out: 'e', disengaged: 'e' }

  return (
    <div className="pg">
      <div className="ph"><div><h1>Students</h1><p>{students.length} student accounts</p></div></div>
      <div className="ab">
        <div className="sw"><span className="si2">🔍</span><input className="inp" placeholder="Search students..." /></div>
        <select className="sel" style={{ width: 'auto' }}><option>All PULSE States</option><option>Thriving</option><option>Coasting</option><option>Struggling</option><option>Burning Out</option><option>Disengaged</option></select>
        <select className="sel" style={{ width: 'auto' }}><option>All Status</option><option>Active</option><option>Banned</option></select>
      </div>
      <div className="card">
        <table className="tbl"><thead><tr><th>Student</th><th>PULSE State</th><th>XP</th><th>Joined</th><th></th></tr></thead>
        <tbody>{students.map(u => (
          <tr key={u.id}>
            <td><div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Avatar initials={u.avatar_initials || u.name.slice(0,2).toUpperCase()} /><div><div style={{ fontSize: 12, fontWeight: 500 }}>{u.name}</div><div style={{ fontSize: 9, color: 'var(--mu)' }}>{u.email}</div></div></div></td>
            <td><Badge variant={pulseBadge[u.pulse_state] || 'm'}>{u.pulse_state?.replace('_',' ')}</Badge></td>
            <td style={{ fontFamily: 'JetBrains Mono', color: 'var(--neon)' }}>{u.xp?.toLocaleString()}</td>
            <td style={{ color: 'var(--mu)', fontFamily: 'JetBrains Mono', fontSize: 9 }}>{u.created_at?.slice(0,7)}</td>
            <td><div style={{ display: 'flex', gap: 4 }}><button className="btn bg sm">👁️</button><button className="btn bd sm">🚫</button></div></td>
          </tr>
        ))}</tbody></table>
      </div>
    </div>
  )
}
