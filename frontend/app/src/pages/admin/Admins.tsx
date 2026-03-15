import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import Avatar from '../../components/Avatar'
import StatCard from '../../components/StatCard'

export default function Admins() {
  const [admins, setAdmins] = useState<any[]>([])
  useEffect(() => { api.get('/api/admin/admins').then(r => setAdmins(r.data)) }, [])

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Admins</h1><p>Platform administration team</p></div>
        <div className="pa"><button className="btn bp">+ Add Admin</button></div>
      </div>
      <div className="sr sr3">
        <StatCard label="Total Admins" value={admins.length} />
        <StatCard label="Superadmins" value="2" variant="er" />
        <StatCard label="Moderators" value="4" variant="in" />
      </div>
      <div className="card">
        <table className="tbl"><thead><tr><th>Admin</th><th>Access Level</th><th>Last Login</th><th></th></tr></thead>
        <tbody>{admins.map((a, i) => (
          <tr key={a.id}>
            <td><div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Avatar initials={a.avatar_initials || a.name.slice(0,2).toUpperCase()} /><div><div style={{ fontSize: 12, fontWeight: 500 }}>{a.name}</div><div style={{ fontSize: 9, color: 'var(--mu)' }}>{a.email}</div></div></div></td>
            <td>{i === 0 ? <span className="bdg be">SUPERADMIN</span> : i === 1 ? <span className="bdg bi">ADMIN</span> : <span className="bdg bm">MODERATOR</span>}</td>
            <td style={{ color: 'var(--mu)', fontFamily: 'JetBrains Mono', fontSize: 9 }}>{a.last_active?.slice(0,10)}</td>
            <td><div style={{ display: 'flex', gap: 4 }}><button className="btn bg sm">👁️</button><button className="btn bg sm">✏️</button></div></td>
          </tr>
        ))}</tbody></table>
      </div>
    </div>
  )
}
