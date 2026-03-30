import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import Avatar from '../../components/Avatar'
import { useAuth } from '../../components/AuthContext'
import { Trash2, X } from 'lucide-react'

export default function Admins() {
  const { user: me } = useAuth()
  const [admins, setAdmins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = () => { setLoading(true); api.get('/api/admin/admins').then(r => setAdmins(Array.isArray(r.data) ? r.data : [])).catch(() => {}).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  async function deleteAdmin(id: number) {
    if (!confirm('Remove this admin account?')) return
    await api.delete(`/api/admin/admins/${id}`)
    load()
  }

  async function createAdmin() {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('All fields are required'); return
    }
    setSaving(true); setError('')
    try {
      await api.post('/api/admin/admins', form)
      setModal(false)
      setForm({ name: '', email: '', password: '' })
      load()
    } catch (e: any) {
      setError(e.message || 'Failed to create admin')
    } finally {
      setSaving(false)
    }
  }

  const superAdmins = admins.filter((a: any) => a.role === 'super_admin')
  const regularAdmins = admins.filter((a: any) => a.role === 'admin')

  if (loading) return <div className="pgload" />

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Admins</h1><p>{admins.length} admin account{admins.length !== 1 ? 's' : ''}</p></div>
        <div className="pa">
          {me?.role === 'super_admin' && (
            <button className="btn bp" onClick={() => setModal(true)}>+ Add Admin</button>
          )}
        </div>
      </div>

      <div className="card">
        <table className="tbl">
          <thead>
            <tr><th>User</th><th>Role</th><th>Last Active</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {admins.map((a: any) => {
              const isMe = a.id === me?.id
              const isSuperAdmin = a.role === 'super_admin'
              return (
                <tr key={a.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar initials={a.avatar_initials || a.name?.slice(0, 2).toUpperCase()} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>
                          {a.name}
                          {isMe && <span style={{ marginLeft: 6, fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--neon)', background: 'rgba(191,255,0,.1)', padding: '1px 6px', borderRadius: 4, border: '1px solid rgba(191,255,0,.2)' }}>YOU</span>}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--mu)' }}>{a.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {isSuperAdmin
                      ? <span className="bdg be">SUPER ADMIN</span>
                      : <span className="bdg bi">ADMIN</span>
                    }
                  </td>
                  <td style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--mu)' }}>
                    {a.last_active ? new Date(a.last_active).toLocaleDateString() : '—'}
                  </td>
                  <td>
                    <span>
                      <span className={`sdot ${a.status === 'active' ? 'sd-a' : 'sd-b'}`} />
                      {a.status}
                    </span>
                  </td>
                  <td>
                    {/* Super admin is never deletable; only super_admin can delete others */}
                    {!isSuperAdmin && me?.role === 'super_admin' && (
                      <button className="btn bd sm" onClick={() => deleteAdmin(a.id)}><Trash2 size={16} />️ Remove</button>
                    )}
                  </td>
                </tr>
              )
            })}
            {admins.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--mu)', fontFamily: 'JetBrains Mono', fontSize: 12, padding: 32 }}>No admin accounts found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create admin modal — super_admin only */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 14, width: 420, padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16, textTransform: 'uppercase' }}>New Admin</div>
              <button className="btn bg sm" onClick={() => { setModal(false); setError('') }}><X size={16} /></button>
            </div>
            {error && <div className="alr ac">{error}</div>}
            <div className="fg">
              <label className="lbl">Full Name</label>
              <input className="inp" placeholder="e.g. Jane Doe" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="fg">
              <label className="lbl">Email</label>
              <input className="inp" type="email" placeholder="admin@fluentfusion.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="fg">
              <label className="lbl">Password</label>
              <input className="inp" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn bo" style={{ flex: 1 }} onClick={() => { setModal(false); setError('') }}>Cancel</button>
              <button className="btn bp" style={{ flex: 2 }} onClick={createAdmin} disabled={saving}>
                {saving ? 'Creating…' : 'Create Admin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
