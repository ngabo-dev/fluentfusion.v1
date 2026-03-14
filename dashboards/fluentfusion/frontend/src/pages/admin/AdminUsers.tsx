import React, { useEffect, useState } from 'react';
import { usersApi } from '../../api';
import { PageHeader, Card, Table, TR, TD, Avatar, Badge, StatusBadge, Btn, SearchBar, Select, Modal, Label, Input, FormGroup, Spinner, EmptyState } from '../../components/UI';
import { formatDistanceToNow } from 'date-fns';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser] = useState({ full_name: '', email: '', password: '', role: 'student' });
  const [creating, setCreating] = useState(false);

  const load = () => {
    setLoading(true);
    usersApi.list({ role: role || undefined, search: search || undefined, page, per_page: 20 })
      .then(d => { setUsers(d.items); setTotal(d.total); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [role, page]);
  useEffect(() => {
    const t = setTimeout(load, 400);
    return () => clearTimeout(t);
  }, [search]);

  const ban = async (id: number, active: boolean) => {
    setActionLoading(id);
    try {
      await (active ? usersApi.ban(id) : usersApi.unban(id));
      load();
    } finally { setActionLoading(null); }
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      await usersApi.create(newUser);
      setShowCreate(false);
      setNewUser({ full_name: '', email: '', password: '', role: 'student' });
      load();
    } finally { setCreating(false); }
  };

  return (
    <div>
      <PageHeader title="Users" subtitle={`${total} total users across the platform`}
        actions={<Btn onClick={() => setShowCreate(true)}>+ Add User</Btn>} />

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search users..." />
        <Select value={role} onChange={e => setRole(e.target.value)} style={{ width: 'auto' }}>
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="instructor">Instructors</option>
          <option value="admin">Admins</option>
        </Select>
      </div>

      <Card>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Spinner /></div>
        ) : users.length === 0 ? <EmptyState message="No users found" /> : (
          <Table headers={['User', 'Role', 'Status', 'Country', 'Joined', 'Actions']}>
            {users.map(u => (
              <TR key={u.id}>
                <TD>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar initials={u.avatar_initials} size="sm" />
                    <div>
                      <div style={{ fontWeight: 500 }}>{u.full_name}</div>
                      <div style={{ fontSize: 10, color: 'var(--mu)' }}>{u.email}</div>
                    </div>
                  </div>
                </TD>
                <TD><Badge variant={u.role === 'admin' ? 'neon' : u.role === 'instructor' ? 'info' : 'muted'}>{u.role}</Badge></TD>
                <TD><Badge variant={u.is_active ? 'ok' : 'error'}>{u.is_active ? 'Active' : 'Banned'}</Badge></TD>
                <TD style={{ color: 'var(--mu)' }}>{u.country || '—'}</TD>
                <TD style={{ color: 'var(--mu)', fontSize: 10 }}>
                  {u.created_at ? formatDistanceToNow(new Date(u.created_at), { addSuffix: true }) : '—'}
                </TD>
                <TD>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {actionLoading === u.id ? <Spinner size={14} /> : (
                      <Btn size="sm" variant={u.is_active ? 'danger' : 'outline'}
                        onClick={() => ban(u.id, u.is_active)}>
                        {u.is_active ? 'Ban' : 'Unban'}
                      </Btn>
                    )}
                  </div>
                </TD>
              </TR>
            ))}
          </Table>
        )}
        {/* Pagination */}
        {total > 20 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
            <Btn size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</Btn>
            <span style={{ fontSize: 11, color: 'var(--mu)', lineHeight: '24px' }}>Page {page} of {Math.ceil(total / 20)}</span>
            <Btn size="sm" variant="outline" onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 20)}>Next →</Btn>
          </div>
        )}
      </Card>

      {/* Create User Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add New User">
        <FormGroup><Label>Full Name</Label><Input value={newUser.full_name} onChange={e => setNewUser({ ...newUser, full_name: e.target.value })} placeholder="John Doe" /></FormGroup>
        <FormGroup><Label>Email</Label><Input type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} placeholder="john@example.com" /></FormGroup>
        <FormGroup><Label>Password</Label><Input type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} placeholder="Min 8 chars" /></FormGroup>
        <FormGroup>
          <Label>Role</Label>
          <Select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </Select>
        </FormGroup>
        <Btn loading={creating} onClick={handleCreate} style={{ width: '100%' }}>Create User</Btn>
      </Modal>
    </div>
  );
}
