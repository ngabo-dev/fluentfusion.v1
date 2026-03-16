import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import Avatar from '../../components/Avatar'
import Badge from '../../components/Badge'

export default function Instructors() {
  const [instructors, setInstructors] = useState<any[]>([])
  const [search, setSearch] = useState('')

  const load = () => api.get('/api/admin/instructors').then(r => setInstructors(r.data))
  useEffect(() => { load() }, [])

  const filtered = instructors.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

  async function verify(id: number) { await api.patch(`/api/admin/instructors/${id}/verify`); load() }
  async function updateStatus(id: number, s: string) { await api.patch(`/api/admin/users/${id}/status`, { status: s }); load() }
  async function deleteUser(u: any) {
    if (!confirm(`Permanently delete instructor ${u.name}? All their courses will be removed.`)) return
    await api.delete(`/api/admin/users/${u.id}`); load()
  }

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Instructors</h1><p>{filtered.length} instructors · {filtered.filter(i => !i.is_verified).length} pending verification</p></div>
        </div>
      {instructors.some(i => !i.is_verified) && (
        <div className="alr aw" style={{ marginBottom: 14 }}>
          <span>⚠️</span><div style={{ flex: 1 }}><b>{instructors.filter(i => !i.is_verified).length} instructors awaiting verification</b></div>
        </div>
      )}
      <div className="ab">
        <div className="sw"><span className="si2">🔍</span><input className="inp" placeholder="Search instructors..." value={search} onChange={e => setSearch(e.target.value)} /></div>
      </div>
      <div className="card">
        <table className="tbl">
          <thead><tr><th>Instructor</th><th>Courses</th><th>Students</th><th>Revenue</th><th>Verified</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{filtered.map(ins => (
            <tr key={ins.id}>
              <td><div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Avatar initials={ins.avatar_initials || ins.name.slice(0,2).toUpperCase()} />
                <div><div style={{ fontSize: 12, fontWeight: 500 }}>{ins.name}</div><div style={{ fontSize: 9, color: 'var(--mu)' }}>{ins.email}</div></div>
              </div></td>
              <td>{ins.courses}</td>
              <td style={{ color: 'var(--neon)' }}>{ins.students?.toLocaleString()}</td>
              <td style={{ color: 'var(--ok)' }}>${ins.revenue_mtd?.toFixed(0)}</td>
              <td>{ins.is_verified ? <Badge variant="k">✓ Verified</Badge> : <Badge variant="w">⏳ Pending</Badge>}</td>
              <td><span><span className={`sdot ${ins.status === 'active' ? 'sd-a' : ins.status === 'pending' ? 'sd-p' : 'sd-b'}`} />{ins.status}</span></td>
              <td><div style={{ display: 'flex', gap: 4 }}>
                {!ins.is_verified && <button className="btn bo sm" style={{ color: 'var(--ok)', borderColor: 'rgba(0,255,127,.3)', fontSize: 10 }} onClick={() => verify(ins.id)}>✓ Verify</button>}
                {ins.status === 'banned'
                  ? <button className="btn bo sm" style={{ color: 'var(--ok)', borderColor: 'rgba(0,255,127,.3)', fontSize: 10 }} onClick={() => updateStatus(ins.id, 'active')}>✅ Unban</button>
                  : <button className="btn bd sm" onClick={() => updateStatus(ins.id, 'banned')}>🚫 Ban</button>}
                <button className="btn bd sm" onClick={() => deleteUser(ins)}>🗑</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}
