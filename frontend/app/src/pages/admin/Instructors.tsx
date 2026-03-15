import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import Avatar from '../../components/Avatar'
import Badge from '../../components/Badge'

export default function Instructors() {
  const [instructors, setInstructors] = useState<any[]>([])
  const load = () => api.get('/api/admin/instructors').then(r => setInstructors(r.data))
  useEffect(() => { load() }, [])

  async function verify(id: number) { await api.patch(`/api/admin/instructors/${id}/verify`); load() }
  async function ban(id: number) { await api.patch(`/api/admin/users/${id}/status`, { status: 'banned' }); load() }

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Instructors</h1><p>{instructors.length} instructors · {instructors.filter(i => !i.is_verified).length} pending verification</p></div>
        <div className="pa"><button className="btn bp">+ Invite Instructor</button></div>
      </div>
      {instructors.some(i => !i.is_verified) && (
        <div className="alr aw" style={{ marginBottom: 14 }}>
          <span>⚠️</span><div style={{ flex: 1 }}><b>{instructors.filter(i => !i.is_verified).length} instructors awaiting verification</b></div>
          <button className="btn bo sm">Review Now</button>
        </div>
      )}
      <div className="card">
        <table className="tbl"><thead><tr><th>Instructor</th><th>Courses</th><th>Students</th><th>Revenue MTD</th><th>Verified</th><th>Status</th><th></th></tr></thead>
        <tbody>{instructors.map(ins => (
          <tr key={ins.id}>
            <td><div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Avatar initials={ins.avatar_initials || ins.name.slice(0,2).toUpperCase()} /><div><div style={{ fontSize: 12, fontWeight: 500 }}>{ins.name}</div><div style={{ fontSize: 9, color: 'var(--mu)' }}>{ins.email}</div></div></div></td>
            <td>{ins.courses}</td>
            <td style={{ color: 'var(--neon)' }}>{ins.students?.toLocaleString()}</td>
            <td style={{ color: 'var(--ok)' }}>${ins.revenue_mtd?.toFixed(0)}</td>
            <td>{ins.is_verified ? <Badge variant="k">✓ Verified</Badge> : <Badge variant="w">⏳ Pending</Badge>}</td>
            <td><span><span className={`sdot ${ins.status === 'active' ? 'sd-a' : ins.status === 'pending' ? 'sd-p' : 'sd-b'}`} />{ins.status}</span></td>
            <td><div style={{ display: 'flex', gap: 4 }}>
              <button className="btn bg sm">👁️</button>
              {!ins.is_verified && <button className="btn bo sm" style={{ color: 'var(--ok)', borderColor: 'rgba(0,255,127,.3)', fontSize: 10 }} onClick={() => verify(ins.id)}>✓ Verify</button>}
              <button className="btn bd sm" onClick={() => ban(ins.id)}>🚫</button>
            </div></td>
          </tr>
        ))}</tbody></table>
      </div>
    </div>
  )
}
