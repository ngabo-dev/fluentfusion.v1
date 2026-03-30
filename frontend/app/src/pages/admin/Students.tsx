import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import Avatar from '../../components/Avatar'
import Badge from '../../components/Badge'
import { Ban, CheckCircle2, Search, Trash2 } from 'lucide-react'

export default function Students() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = () => { setLoading(true); api.get('/api/admin/users', { params: { role: 'student' } }).then(r => setStudents(r.data)).catch(() => {}).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const filtered = students.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

  async function updateStatus(id: number, s: string) { await api.patch(`/api/admin/users/${id}/status`, { status: s }); load() }
  async function deleteUser(u: any) {
    if (!confirm(`Permanently delete ${u.name}?`)) return
    await api.delete(`/api/admin/users/${u.id}`); load()
  }

  const pulseBadge: any = { thriving: 'k', coasting: 'i', struggling: 'w', burning_out: 'e', disengaged: 'e' }

  if (loading) return <div className="pgload" />

  return (
    <div className="pg">
      <div className="ph"><div><h1>Students</h1><p>{filtered.length} student accounts</p></div></div>
      <div className="ab">
        <div className="sw"><span className="si2"><Search size={16} /></span><input className="inp" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} /></div>
      </div>
      <div className="card">
        <table className="tbl">
          <thead><tr><th>Student</th><th>PULSE</th><th>XP</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>{filtered.map(u => (
            <tr key={u.id}>
              <td><div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Avatar initials={u.avatar_initials || u.name.slice(0,2).toUpperCase()} />
                <div><div style={{ fontSize: 12, fontWeight: 500 }}>{u.name}</div><div style={{ fontSize: 9, color: 'var(--mu)' }}>{u.email}</div></div>
              </div></td>
              <td><Badge variant={pulseBadge[u.pulse_state] || 'm'}>{u.pulse_state?.replace('_',' ') || '—'}</Badge></td>
              <td style={{ fontFamily: 'JetBrains Mono', color: 'var(--neon)' }}>{u.xp?.toLocaleString() || 0}</td>
              <td><span className={`sdot ${u.status === 'active' ? 'sd-a' : u.status === 'banned' ? 'sd-b' : 'sd-p'}`} />{u.status}</td>
              <td style={{ color: 'var(--mu)', fontFamily: 'JetBrains Mono', fontSize: 9 }}>{u.created_at?.slice(0,10)}</td>
              <td><div style={{ display: 'flex', gap: 4 }}>
                {u.status === 'banned'
                  ? <button className="btn bo sm" style={{ color: 'var(--ok)', borderColor: 'rgba(0,255,127,.3)', fontSize: 10 }} onClick={() => updateStatus(u.id, 'active')}><CheckCircle2 size={16} /> Unban</button>
                  : <button className="btn bd sm" onClick={() => updateStatus(u.id, 'banned')}><Ban size={16} /> Ban</button>}
                <button className="btn bd sm" onClick={() => deleteUser(u)}><Trash2 size={16} /></button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}
