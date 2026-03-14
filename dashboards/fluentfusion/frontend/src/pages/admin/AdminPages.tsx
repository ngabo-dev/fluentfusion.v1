import React, { useEffect, useState } from 'react';
import { usersApi, coursesApi, payoutsApi, pulseApi, notificationsApi, auditApi, settingsApi, dashboardApi } from '../../api';
import {
  PageHeader, Card, Table, TR, TD, Avatar, Badge, StatusBadge, Btn, SearchBar,
  Select, Modal, Label, Input, FormGroup, Spinner, EmptyState, Textarea, Toggle,
  PulseBar, StatCard, ProgressBar, Alert, Mono, Tabs
} from '../../components/UI';
import { formatDistanceToNow, format } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// ── Instructors ─────────────────────────────────────────────
export function AdminInstructors() {
  const [instructors, setInstructors] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    usersApi.listInstructors({
      search: search || undefined,
      is_verified: verifiedFilter === '' ? undefined : verifiedFilter === 'true',
    }).then(d => { setInstructors(d.items); setTotal(d.total); }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [verifiedFilter]);
  useEffect(() => { const t = setTimeout(load, 400); return () => clearTimeout(t); }, [search]);

  const verify = async (id: number) => {
    setActionLoading(id);
    try { await usersApi.verify(id); load(); } finally { setActionLoading(null); }
  };
  const ban = async (id: number, active: boolean) => {
    setActionLoading(id);
    try { await (active ? usersApi.ban(id) : usersApi.unban(id)); load(); } finally { setActionLoading(null); }
  };

  return (
    <div>
      <PageHeader title="Instructors" subtitle={`${total} instructors on the platform`} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search instructors..." />
        <Select value={verifiedFilter} onChange={e => setVerifiedFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="">All</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </Select>
      </div>
      <Card>
        {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Spinner /></div> : instructors.length === 0 ? <EmptyState /> : (
          <Table headers={['Instructor', 'Rating', 'Students', 'Revenue', 'Status', 'Actions']}>
            {instructors.map(u => (
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
                <TD><Mono color="var(--neon)">{u.rating?.toFixed(1) || '—'} ⭐</Mono></TD>
                <TD><Mono color="var(--in)">{(u.total_students || 0).toLocaleString()}</Mono></TD>
                <TD><Mono color="var(--ok)">${(u.total_revenue || 0).toLocaleString()}</Mono></TD>
                <TD>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Badge variant={u.is_active ? 'ok' : 'error'}>{u.is_active ? 'Active' : 'Banned'}</Badge>
                    {u.is_verified && <Badge variant="neon">Verified</Badge>}
                  </div>
                </TD>
                <TD>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {actionLoading === u.id ? <Spinner size={14} /> : <>
                      {!u.is_verified && <Btn size="sm" variant="primary" onClick={() => verify(u.id)}>Verify</Btn>}
                      <Btn size="sm" variant={u.is_active ? 'danger' : 'outline'} onClick={() => ban(u.id, u.is_active)}>
                        {u.is_active ? 'Ban' : 'Unban'}
                      </Btn>
                    </>}
                  </div>
                </TD>
              </TR>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}

// ── Courses ──────────────────────────────────────────────────
export function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [rejectModal, setRejectModal] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    coursesApi.list({ status: status || undefined, search: search || undefined, per_page: 30 })
      .then(d => { setCourses(d.items); setTotal(d.total); }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [status]);
  useEffect(() => { const t = setTimeout(load, 400); return () => clearTimeout(t); }, [search]);

  const approve = async (id: number) => {
    setActionLoading(id);
    try { await coursesApi.approve(id); load(); } finally { setActionLoading(null); }
  };
  const reject = async () => {
    if (!rejectModal) return;
    setActionLoading(rejectModal.id);
    try { await coursesApi.reject(rejectModal.id, rejectReason); setRejectModal(null); setRejectReason(''); load(); } finally { setActionLoading(null); }
  };

  return (
    <div>
      <PageHeader title="Courses" subtitle={`${total} courses on the platform`} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search courses..." />
        <Select value={status} onChange={e => setStatus(e.target.value)} style={{ width: 'auto' }}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="draft">Draft</option>
          <option value="rejected">Rejected</option>
        </Select>
      </div>
      <Card>
        {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Spinner /></div> : courses.length === 0 ? <EmptyState icon="📚" message="No courses found" /> : (
          <Table headers={['Course', 'Instructor', 'Language', 'Enrollments', 'Rating', 'Status', 'Actions']}>
            {courses.map(c => (
              <TR key={c.id}>
                <TD><div style={{ fontWeight: 500, maxWidth: 200 }}>{c.title}</div></TD>
                <TD style={{ color: 'var(--mu)' }}>{c.instructor_name}</TD>
                <TD><Badge variant="muted">{c.language} {c.level}</Badge></TD>
                <TD><Mono color="var(--in)">{c.total_enrollments.toLocaleString()}</Mono></TD>
                <TD><Mono color="var(--neon)">{c.rating.toFixed(1)} ⭐</Mono></TD>
                <TD><StatusBadge status={c.status} /></TD>
                <TD>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {actionLoading === c.id ? <Spinner size={14} /> : <>
                      {c.status === 'pending' && <>
                        <Btn size="sm" variant="primary" onClick={() => approve(c.id)}>Approve</Btn>
                        <Btn size="sm" variant="danger" onClick={() => setRejectModal(c)}>Reject</Btn>
                      </>}
                      {c.status !== 'pending' && <span style={{ color: 'var(--mu)', fontSize: 10 }}>{c.status}</span>}
                    </>}
                  </div>
                </TD>
              </TR>
            ))}
          </Table>
        )}
      </Card>
      <Modal open={!!rejectModal} onClose={() => setRejectModal(null)} title="Reject Course">
        <div style={{ marginBottom: 12, fontSize: 12, color: 'var(--mu)' }}>Rejecting: <strong style={{ color: 'var(--fg)' }}>{rejectModal?.title}</strong></div>
        <FormGroup><Label>Rejection Reason</Label><Textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Explain why this course is being rejected..." rows={3} /></FormGroup>
        <Btn variant="danger" onClick={reject} loading={actionLoading === rejectModal?.id} style={{ width: '100%' }}>Confirm Rejection</Btn>
      </Modal>
    </div>
  );
}

// ── Revenue ──────────────────────────────────────────────────
export function AdminRevenue() {
  const [stats, setStats] = useState<any>(null);
  const [trend, setTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardApi.adminStats(), dashboardApi.revenueTrend()])
      .then(([s, t]) => { setStats(s); setTrend(t); }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}><Spinner size={32} /></div>;

  return (
    <div>
      <PageHeader title="Revenue" subtitle="Platform financial overview" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 18 }}>
        <StatCard label="Total Revenue" value={`$${(stats.total_revenue / 1000).toFixed(1)}k`} sub="All time" color="neon" />
        <StatCard label="Monthly Revenue" value={`$${stats.monthly_revenue.toFixed(0)}`} sub="This month" color="ok" accent="ok" />
        <StatCard label="Platform Cut (20%)" value={`$${(stats.total_revenue * 0.2 / 1000).toFixed(1)}k`} sub="After instructor payouts" color="info" accent="info" />
      </div>
      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>12-Month Revenue Trend</div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={trend}>
            <defs>
              <linearGradient id="rg2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#BFFF00" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#BFFF00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`$${v.toFixed(0)}`, 'Revenue']} />
            <Area type="monotone" dataKey="revenue" stroke="#BFFF00" strokeWidth={2} fill="url(#rg2)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>Monthly Enrollments</div>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={trend}>
            <XAxis dataKey="month" tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 8, fontSize: 11 }} />
            <Bar dataKey="enrollments" fill="#00CFFF" radius={[3, 3, 0, 0]} opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ── Payouts ──────────────────────────────────────────────────
export function AdminPayouts() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    payoutsApi.list({ status: statusFilter || undefined })
      .then(setPayouts).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter]);

  const process = async (id: number, status: 'approved' | 'rejected') => {
    setActionLoading(id);
    try { await payoutsApi.update(id, { status }); load(); } finally { setActionLoading(null); }
  };

  const pendingTotal = payouts.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <PageHeader title="Payouts" subtitle="Instructor payout management" />
      {pendingTotal > 0 && (
        <Alert type="warn">
          <span>💰</span>
          <span><strong>${pendingTotal.toFixed(2)}</strong> pending across {payouts.filter(p => p.status === 'pending').length} payout requests</span>
        </Alert>
      )}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </Select>
      </div>
      <Card>
        {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Spinner /></div> : payouts.length === 0 ? <EmptyState icon="💸" message="No payouts found" /> : (
          <Table headers={['Instructor', 'Amount', 'Period', 'Status', 'Actions']}>
            {payouts.map(p => (
              <TR key={p.id}>
                <TD><div style={{ fontWeight: 500 }}>{p.instructor_name}</div></TD>
                <TD><Mono color="var(--neon)">${p.amount.toFixed(2)}</Mono></TD>
                <TD style={{ color: 'var(--mu)', fontSize: 10 }}>
                  {p.period_start ? format(new Date(p.period_start), 'MMM d') : '—'} – {p.period_end ? format(new Date(p.period_end), 'MMM d, yyyy') : '—'}
                </TD>
                <TD><StatusBadge status={p.status} /></TD>
                <TD>
                  {actionLoading === p.id ? <Spinner size={14} /> : p.status === 'pending' ? (
                    <div style={{ display: 'flex', gap: 4 }}>
                      <Btn size="sm" variant="primary" onClick={() => process(p.id, 'approved')}>Approve</Btn>
                      <Btn size="sm" variant="danger" onClick={() => process(p.id, 'rejected')}>Reject</Btn>
                    </div>
                  ) : <span style={{ color: 'var(--mu)', fontSize: 10 }}>{p.processed_at ? format(new Date(p.processed_at), 'MMM d') : '—'}</span>}
                </TD>
              </TR>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}

// ── PULSE ────────────────────────────────────────────────────
export function AdminPulse() {
  const [pulse, setPulse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pulseApi.stats().then(setPulse).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}><Spinner size={32} /></div>;

  const total = pulse?.total || 1;

  return (
    <div>
      <PageHeader title="PULSE Engine" subtitle={`AI-powered learner state analysis · ${total.toLocaleString()} learners`}
        actions={<span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--mu)' }}>Last run: 2h ago</span>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 18 }}>
        {[
          { key: 'thriving', label: '🚀 Thriving', color: 'ok' },
          { key: 'coasting', label: '😐 Coasting', color: 'info' },
          { key: 'struggling', label: '😓 Struggling', color: 'warn' },
          { key: 'burning_out', label: '🔥 Burning Out', color: 'warn' },
          { key: 'disengaged', label: '💤 Disengaged', color: 'error' },
        ].map(item => (
          <StatCard key={item.key} label={item.label} value={pulse?.[item.key] || 0}
            sub={`${Math.round((pulse?.[item.key] || 0) / total * 100)}% of learners`}
            color={item.color} accent={item.color} />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
        <Card>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 14 }}>State Distribution</div>
          <PulseBar {...pulse} />
        </Card>
        <Card>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>At-Risk Detail</div>
          <div style={{ padding: 12, background: 'rgba(255,68,68,.06)', border: '1px solid rgba(255,68,68,.15)', borderRadius: 'var(--r)', marginBottom: 12 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: 'var(--mu)' }}>AT-RISK (BURNING + DISENGAGED)</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 30, fontWeight: 800, color: 'var(--er)' }}>{(pulse?.burning_out || 0) + (pulse?.disengaged || 0)}</div>
            <div style={{ fontSize: 11, color: 'var(--mu)' }}>{Math.round(((pulse?.burning_out || 0) + (pulse?.disengaged || 0)) / total * 100)}% of total</div>
          </div>
          <Alert type="warn">
            <span>⚠️ Learners needing intervention</span>
          </Alert>
        </Card>
      </div>
    </div>
  );
}

// ── Notifications ────────────────────────────────────────────
export function AdminNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', message: '', target_role: 'all', is_email: false, is_push: false });
  const [sending, setSending] = useState(false);

  const load = () => {
    setLoading(true);
    notificationsApi.list().then(setNotifications).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const send = async () => {
    if (!form.title || !form.message) return;
    setSending(true);
    try { await notificationsApi.send(form); setForm({ title: '', message: '', target_role: 'all', is_email: false, is_push: false }); load(); }
    finally { setSending(false); }
  };

  return (
    <div>
      <PageHeader title="Notifications" subtitle="Send platform-wide announcements" />
      <Card style={{ marginBottom: 16, borderColor: 'rgba(191,255,0,.2)' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', marginBottom: 14 }}>Send Notification</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <FormGroup><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Notification title..." /></FormGroup>
          <FormGroup>
            <Label>Target Audience</Label>
            <Select value={form.target_role} onChange={e => setForm({ ...form, target_role: e.target.value })}>
              <option value="all">All Users</option>
              <option value="student">Students Only</option>
              <option value="instructor">Instructors Only</option>
            </Select>
          </FormGroup>
        </div>
        <FormGroup><Label>Message</Label><Textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Write your notification..." rows={3} /></FormGroup>
        <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
            <Toggle checked={form.is_email} onChange={v => setForm({ ...form, is_email: v })} />
            Also send by email
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
            <Toggle checked={form.is_push} onChange={v => setForm({ ...form, is_push: v })} />
            Send as push notification
          </label>
        </div>
        <Btn loading={sending} onClick={send}>Send Now</Btn>
      </Card>

      <Card>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>Notification History</div>
        {loading ? <Spinner /> : (
          <Table headers={['Title', 'Target', 'Sent', 'Recipients', 'Read Rate']}>
            {notifications.map(n => (
              <TR key={n.id}>
                <TD><strong>{n.title}</strong></TD>
                <TD><Badge variant={n.target_role === 'all' ? 'muted' : n.target_role === 'instructor' ? 'info' : 'neon'}>{n.target_role}</Badge></TD>
                <TD style={{ color: 'var(--mu)', fontSize: 10 }}>{format(new Date(n.sent_at), 'MMM d, HH:mm')}</TD>
                <TD><Mono>{n.recipients_count.toLocaleString()}</Mono></TD>
                <TD>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 4, background: 'var(--bdr)', borderRadius: 99 }}>
                      <div style={{ width: `${n.read_rate}%`, height: '100%', background: n.read_rate > 70 ? 'var(--ok)' : n.read_rate > 50 ? 'var(--neon)' : 'var(--wa)', borderRadius: 99 }} />
                    </div>
                    <Mono color={n.read_rate > 70 ? 'var(--ok)' : 'var(--neon)'}>{n.read_rate}%</Mono>
                  </div>
                </TD>
              </TR>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}

// ── Audit Log ────────────────────────────────────────────────
export function AdminAuditLog() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');

  const load = () => {
    setLoading(true);
    auditApi.list({ action_type: typeFilter || undefined })
      .then(setLogs).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [typeFilter]);

  const typeColors: Record<string, string> = {
    USER: 'var(--in)', COURSE: 'var(--wa)', FINANCE: 'var(--neon)', SYSTEM: 'var(--mu)',
  };

  return (
    <div>
      <PageHeader title="Audit Log" subtitle="Complete record of all admin actions"
        actions={<Btn variant="outline" size="sm">Export Log</Btn>} />
      <Alert type="info">
        <span>🔒</span>
        <span>This log records all administrator actions. Entries cannot be modified or deleted.</span>
      </Alert>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="">All Actions</option>
          <option value="USER">User Actions</option>
          <option value="COURSE">Course Actions</option>
          <option value="FINANCE">Financial</option>
          <option value="SYSTEM">System</option>
        </Select>
      </div>
      <Card>
        {loading ? <Spinner /> : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {logs.map(log => (
              <div key={log.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--mu)', minWidth: 70, paddingTop: 2 }}>
                  {format(new Date(log.created_at), 'HH:mm:ss')}
                </span>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 8, padding: '2px 6px',
                  borderRadius: 4, border: `1px solid ${typeColors[log.action_type] || 'var(--bdr)'}`,
                  color: typeColors[log.action_type] || 'var(--mu)', minWidth: 54, textAlign: 'center',
                }}>{log.action_type}</span>
                <span style={{ fontSize: 11, color: 'var(--fg)', flex: 1 }} dangerouslySetInnerHTML={{ __html: log.description.replace(/<b>(.*?)<\/b>/g, '<strong>$1</strong>') }} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ── Platform Settings ────────────────────────────────────────
export function AdminSettings() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [localValues, setLocalValues] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('General');

  useEffect(() => {
    settingsApi.list().then(s => {
      setSettings(s);
      const vals: Record<string, string> = {};
      s.forEach((item: any) => { vals[item.key] = item.value || ''; });
      setLocalValues(vals);
    }).finally(() => setLoading(false));
  }, []);

  const save = async (key: string) => {
    setSaving(key);
    try { await settingsApi.update(key, localValues[key]); }
    finally { setSaving(null); }
  };

  const categoryMap: Record<string, string> = {
    'General': 'general', 'Finance': 'finance', 'Security': 'security',
    'Email / SMTP': 'email', 'Integrations': 'integrations', 'Maintenance': 'maintenance',
  };
  const tabs = ['General', 'Finance', 'Security', 'Email / SMTP', 'Integrations', 'Maintenance'];
  const catSettings = settings.filter(s => s.category === categoryMap[activeTab]);

  const boolKeys = ['allow_registrations', 'require_instructor_verification', 'enable_pulse', 'maintenance_mode'];

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="Platform Settings" subtitle="Global configuration for FluentFusion" />
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {tabs.map(t => (
            <div key={t} onClick={() => setActiveTab(t)} style={{
              padding: '8px 12px', borderRadius: 'var(--r)', cursor: 'pointer', fontSize: 12, fontWeight: 500,
              background: activeTab === t ? 'var(--ndim)' : 'transparent',
              color: activeTab === t ? 'var(--neon)' : 'var(--mu)',
            }}>{t}</div>
          ))}
        </div>
        <Card>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--bdr)' }}>
            {activeTab} Settings
          </div>
          {catSettings.map(s => (
            <div key={s.key} style={{ marginBottom: 16 }}>
              {boolKeys.includes(s.key) ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{s.key.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</div>
                  </div>
                  <Toggle
                    checked={localValues[s.key] === 'true'}
                    onChange={v => {
                      setLocalValues({ ...localValues, [s.key]: String(v) });
                      settingsApi.update(s.key, String(v));
                    }}
                  />
                </div>
              ) : (
                <FormGroup>
                  <Label>{s.key.replace(/_/g, ' ')}</Label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Input value={localValues[s.key] || ''} onChange={e => setLocalValues({ ...localValues, [s.key]: e.target.value })} />
                    <Btn size="sm" variant="outline" onClick={() => save(s.key)} loading={saving === s.key}>Save</Btn>
                  </div>
                </FormGroup>
              )}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
