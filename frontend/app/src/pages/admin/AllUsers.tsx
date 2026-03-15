import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import Avatar from '../../components/Avatar'
import Badge from '../../components/Badge'

export default function AllUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')

  function load() {
    const params: any = {}
    if (role) params.role = role
    if (status) params.status = status
    if (search) params.search = search
    api.get('/api/admin/users', { params }).then(r => setUsers(r.data))
  }

  useEffect(() => { load() }, [role, status, search])

  async function updateStatus(id: number, s: string) {
    await api.patch(`/api/admin/users/${id}/status`, { status: s })
    load()
  }

  const roleBadge: any = { instructor: 'i', student: 'm', admin: 'e' }
  const statusDot: any = { active: 'sd-a', banned: 'sd-b', pending: 'sd-p' }

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>All Users</h1><p>{users.length} accounts shown</p></div>
        <div className="pa"><button className="btn bp">+ Invite User</button><button className="btn bo sm">Export CSV</button></div>
      </div>
      <div className="ab">
        <div className="sw"><span className="si2">🔍</span><input className="inp" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <select className="sel" style={{ width: 'auto' }} value={role} onChange={e => setRole(e.target.value)}>
          <option value="">All Roles</option><option value="student">Student</option><option value="instructor">Instructor</option><option value="admin">Admin</option>
        </select>
        <select className="sel" style={{ width: 'auto' }} value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All Status</option><option value="active">Active</option><option value="banned">Banned</option><option value="pending">Pending</option>
        </select>
      </div>
      <div className="card">
        <table className="tbl"><thead><tr><th>User</th><th>Role</th><th>Status</th><th>Joined</th><th>Last Active</th><th></th></tr></thead>
        <tbody>{users.map(u => (
          <tr key={u.id}>
            <td><div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Avatar initials={u.avatar_initials || u.name.slice(0,2).toUpperCase()} /><div><div style={{ fontSize: 12, fontWeight: 500 }}>{u.name}</div><div style={{ fontSize: 9, color: 'var(--mu)' }}>{u.email}</div></div></div></td>
            <td><Badge variant={roleBadge[u.role] || 'm'}>{u.role.toUpperCase()}</Badge></td>
            <td><span><span className={`sdot ${statusDot[u.status] || 'sd-p'}`} />{u.status === 'banned' ? <span style={{ color: 'var(--er)' }}>Banned</span> : u.status === 'pending' ? <span style={{ color: 'var(--wa)' }}>Pending</span> : 'Active'}</span></td>
            <td style={{ color: 'var(--mu)', fontFamily: 'JetBrains Mono', fontSize: 9 }}>{u.created_at?.slice(0,10)}</td>
            <td style={{ color: 'var(--mu)', fontFamily: 'JetBrains Mono', fontSize: 9 }}>{u.last_active?.slice(0,10)}</td>
            <td><div style={{ display: 'flex', gap: 4 }}>
              <button className="btn bg sm">👁️</button>
              {u.status === 'banned' ? <button className="btn bo sm" style={{ color: 'var(--ok)', borderColor: 'rgba(0,255,127,.3)', fontSize: 10 }} onClick={() => updateStatus(u.id, 'active')}>✅ Unban</button>
                : u.status === 'pending' ? <button className="btn bo sm" style={{ color: 'var(--ok)', borderColor: 'rgba(0,255,127,.3)', fontSize: 10 }} onClick={() => updateStatus(u.id, 'active')}>✅ Approve</button>
                : <button className="btn bd sm" onClick={() => updateStatus(u.id, 'banned')}>🚫</button>}
            </div></td>
          </tr>
        ))}</tbody></table>
      </div>
    </div>
  )
}
