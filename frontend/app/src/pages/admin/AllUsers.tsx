import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import api from '../../api/client'
import Avatar from '../../components/Avatar'
import Badge from '../../components/Badge'
import { useAuth } from '../../components/AuthContext'

function EditModal({ user, onClose, onSaved }: { user: any; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ name: user.name, email: user.email, role: user.role })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const ff = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  async function save() {
    setSaving(true); setError('')
    try {
      await api.patch(`/api/admin/users/${user.id}`, form)
      onSaved()
    } catch (e: any) { setError(e.message || 'Failed') } finally { setSaving(false) }
  }

  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 14, padding: 24, width: 400, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16 }}>Edit User</div>
          <button className="btn bg sm" onClick={onClose}>✕</button>
        </div>
        {error && <div className="alr ac">{error}</div>}
        <div className="fg"><label className="lbl">Name</label><input className="inp" value={form.name} onChange={e => ff('name', e.target.value)} /></div>
        <div className="fg"><label className="lbl">Email</label><input className="inp" value={form.email} onChange={e => ff('email', e.target.value)} /></div>
        <div className="fg"><label className="lbl">Role</label>
          <select className="inp" value={form.role} onChange={e => ff('role', e.target.value)}>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn bo" onClick={onClose}>Cancel</button>
          <button className="btn bp" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function AllUsers() {
  const { user: me } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<any>(null)

  function load() {
    const params: any = {}
    if (role) params.role = role
    if (status) params.status = status
    if (search) params.search = search
    api.get('/api/admin/users', { params }).then(r => {
      const data: any[] = r.data
      data.sort((a, b) => (b.id === me?.id ? 1 : 0) - (a.id === me?.id ? 1 : 0))
      setUsers(data)
    })
  }

  useEffect(() => { load() }, [role, status, search])

  async function updateStatus(id: number, s: string) {
    await api.patch(`/api/admin/users/${id}/status`, { status: s }); load()
  }

  async function deleteUser(u: any) {
    if (!confirm(`Permanently delete ${u.name}? This cannot be undone.`)) return
    await api.delete(`/api/admin/users/${u.id}`); load()
  }

  const roleBadge: any = { instructor: 'i', student: 'm', admin: 'e', super_admin: 'e' }
  const statusDot: any = { active: 'sd-a', banned: 'sd-b', pending: 'sd-p' }

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>All Users</h1><p>{users.length} accounts shown</p></div>
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
        <table className="tbl">
          <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Joined</th><th>Last Active</th><th>Actions</th></tr></thead>
          <tbody>{users.map(u => (
            <tr key={u.id}>
              <td><div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Avatar initials={u.avatar_initials || u.name.slice(0,2).toUpperCase()} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 500 }}>
                    {u.name}
                    {u.id === me?.id && <span style={{ fontSize: 9, background: 'var(--neon)', color: '#000', borderRadius: 4, padding: '1px 5px', fontWeight: 700 }}>YOU</span>}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--mu)' }}>{u.email}</div>
                </div>
              </div></td>
              <td><Badge variant={roleBadge[u.role] || 'm'}>{u.role.toUpperCase()}</Badge></td>
              <td><span><span className={`sdot ${statusDot[u.status] || 'sd-p'}`} />
                {u.status === 'banned' ? <span style={{ color: 'var(--er)' }}>Banned</span>
                  : u.status === 'pending' ? <span style={{ color: 'var(--wa)' }}>Pending</span>
                  : 'Active'}
              </span></td>
              <td style={{ color: 'var(--mu)', fontFamily: 'JetBrains Mono', fontSize: 9 }}>{u.created_at?.slice(0,10)}</td>
              <td style={{ color: 'var(--mu)', fontFamily: 'JetBrains Mono', fontSize: 9 }}>{u.last_active?.slice(0,10)}</td>
              <td><div style={{ display: 'flex', gap: 4 }}>
                <button className="btn bg sm" onClick={() => setEditing(u)}>✏️ Edit</button>
                {u.id !== me?.id && (
                  u.status === 'banned'
                    ? <button className="btn bo sm" style={{ color: 'var(--ok)', borderColor: 'rgba(0,255,127,.3)', fontSize: 10 }} onClick={() => updateStatus(u.id, 'active')}>✅ Unban</button>
                    : <button className="btn bd sm" onClick={() => updateStatus(u.id, 'banned')}>🚫 Ban</button>
                )}
                {u.id !== me?.id && u.role !== 'super_admin' && (
                  <button className="btn bd sm" onClick={() => deleteUser(u)}>🗑</button>
                )}
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {editing && <EditModal user={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load() }} />}
    </div>
  )
}
