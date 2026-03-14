import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { adminApi, authApi } from "../app/api/config";
import ThemeToggle from "../app/components/ui/ThemeToggle";

// Types
interface AdminUser {
  id: number;
  full_name: string;
  email: string;
  role: 'admin' | 'super_admin';
  created_at: string;
  is_active: boolean;
  last_login?: string;
}

interface AdminStats {
  total_admins: number;
  super_admins: number;
  regular_admins: number;
  active_admins: number;
}

interface AuditLogEntry {
  id: number;
  action: string;
  target_type: string;
  user_name: string;
  created_at: string;
}

interface SystemHealth {
  api: string;
  db: string;
  redis_latency_ms: number;
  pulse: string;
  cdn: string;
}

// Utility functions
const getStatusColor = (status: string) => {
  switch (status) {
    case 'online':
    case 'healthy':
    case 'running':
    case 'ok':
      return 'var(--success)';
    case 'degraded':
      return 'var(--warning)';
    default:
      return 'var(--muted)';
  }
};

export default function AdminAdmins() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'admin' as 'admin' | 'super_admin',
  });

  useEffect(() => {
    const token = localStorage.getItem('ff_access_token');
    const userData = localStorage.getItem('ff_user');
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      if (parsed.role !== 'super_admin') {
        navigate('/dashboard');
        return;
      }
      setUser(parsed);
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled([
        adminApi.getUsers({
          role: 'admin',
          page,
          limit: 20,
        }),
        adminApi.getSystemHealth(),
        adminApi.getAuditLogs({ limit: 5 }),
      ]);

      if (results[0].status === 'fulfilled') {
        const data = results[0].value;
        const allAdmins = data.users || [];
        setAdmins(allAdmins);

        const superAdminCount = allAdmins.filter(a => a.role === 'super_admin').length;
        const regularAdminCount = allAdmins.filter(a => a.role === 'admin').length;
        const activeCount = allAdmins.filter(a => a.is_active).length;

        setStats({
          total_admins: data.total || 0,
          super_admins: superAdminCount,
          regular_admins: regularAdminCount,
          active_admins: activeCount,
        });

        setTotalPages(Math.ceil((data.total || 0) / 20));
      }

      if (results[1].status === 'fulfilled') setSystemHealth(results[1].value);
      
      if (results[2].status === 'fulfilled') {
        setAuditLogs(results[2].value.logs || []);
      }
    } catch (err) {
      console.error('Failed to fetch admins:', err);
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createUser({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        role: formData.role,
      });
      setFormData({ full_name: '', email: '', password: '', role: 'admin' });
      setShowCreateModal(false);
      fetchData();
    } catch (err) {
      console.error('Failed to create admin:', err);
      setError('Failed to create admin user');
    }
  };

  const handleDeactivateAdmin = async (adminId: number) => {
    if (adminId === user?.id) {
      setError('Cannot deactivate yourself');
      return;
    }
    try {
      await adminApi.deactivateUser(adminId);
      setAdmins(admins.map(a => a.id === adminId ? { ...a, is_active: false } : a));
    } catch (err) {
      console.error('Failed to deactivate admin:', err);
    }
  };

  const handleActivateAdmin = async (adminId: number) => {
    try {
      await adminApi.activateUser(adminId);
      setAdmins(admins.map(a => a.id === adminId ? { ...a, is_active: true } : a));
    } catch (err) {
      console.error('Failed to activate admin:', err);
    }
  };

  if (loading && admins.length === 0) {
    return (
      <div className="bg-[var(--bg)] min-h-screen flex items-center justify-center">
        <div className="text-[var(--neon)] text-xl">Loading admins...</div>
      </div>
    );
  }

  return (
    <div className="ff-page min-h-screen">
      {/* Top Navigation */}
      <div className="ff-nav h-[66px] shrink-0 sticky top-0 w-full z-50">
        <div className="absolute inset-0 pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="flex items-center justify-between px-[40px] w-full">
            <Link to="/admin/dashboard" className="flex gap-[11px] items-center no-underline">
              <div className="bg-[var(--neon)] flex items-center justify-center w-[38px] h-[38px] rounded-[10px]">
                <span className="text-[18px]">🧠</span>
              </div>
              <span className="text-[18px] text-white font-bold">
                FLUENT<span className="text-[var(--neon)]">FUSION</span>
              </span>
              <span className="ml-4 px-3 py-1 bg-[rgba(191,255,0,0.1)] text-[var(--neon)] text-xs rounded font-mono">Admin Console</span>
            </Link>
            <div className="flex items-center gap-[12px]">
              <span className="text-[var(--info)] text-xs px-2 py-1 bg-[rgba(0,207,255,0.1)] rounded font-mono">PRODUCTION</span>
              <span className="text-[var(--warning)] text-xs">{new Date().toLocaleString()}</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛡️</span>
                <div>
                  <div className="text-white text-sm font-medium">{user?.full_name || 'Admin'}</div>
                  <div className="text-[var(--neon)] text-xs font-mono uppercase">SUPERADMIN</div>
                </div>
              </div>
              <ThemeToggle />
              <button
                onClick={() => {
                  authApi.logout();
                  window.location.href = '/login';
                }}
                className="text-[var(--muted)] hover:text-white text-sm bg-transparent border-none cursor-pointer ml-4"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-66px)]">
        {/* Sidebar */}
        <div className="ff-sidebar fixed left-0 top-[66px] w-[280px] h-[calc(100vh-66px)] overflow-y-auto">
          <div className="flex flex-col py-5 px-0">
            <div className="text-[var(--muted2)] text-[9px] uppercase tracking-[1.35px] px-6 py-3 font-mono">Platform</div>

            <Link to="/admin/dashboard" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--muted)] hover:text-white">
              <span>▦</span>
              <span className="text-[14px]">Overview</span>
            </Link>

            <div className="text-[var(--muted2)] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4 font-mono">Users</div>

            <Link to="/admin/users" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--muted)] hover:text-white">
              <span>👥</span>
              <span className="text-[14px]">All Users</span>
            </Link>

            <Link to="/admin/students" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--muted)] hover:text-white">
              <span>🎓</span>
              <span className="text-[14px]">Students</span>
            </Link>

            <Link to="/admin/instructors" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--muted)] hover:text-white">
              <span>👩‍🏫</span>
              <span className="text-[14px]">Instructors</span>
            </Link>

            <Link to="/admin/admins" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center bg-[var(--neon-dim)] border-l-2 border-[var(--neon)]">
              <span className="text-[var(--neon)]">🔑</span>
              <span className="text-[var(--neon)] text-[14px]">Admins</span>
            </Link>

            {/* System Status */}
            <div className="mt-6 px-4">
              <div className="p-3 bg-[var(--bg2)] rounded-lg border border-[var(--border)]">
                <div className="text-[var(--muted2)] text-[9px] uppercase tracking-wider mb-2 font-mono">System Status</div>
                <div className="space-y-1.5 text-[10px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">API</span>
                    <span style={{ color: getStatusColor(systemHealth?.api || 'unknown') }}>
                      ● {systemHealth?.api?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-[280px] flex-1 p-6">
          {error && (
            <div className="mb-6 p-4 bg-[rgba(255,68,68,0.1)] border border-[var(--danger)] rounded-lg">
              <p className="text-[var(--danger)] text-[13px]">{error}</p>
            </div>
          )}

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-[32px] text-white font-bold font-head">
              <span className="text-[var(--info)]">// </span>ADMIN MANAGEMENT
            </h1>
            <p className="text-[var(--muted)] text-[14px] mt-1">
              Manage administrator and super admin accounts
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-[10px] mb-6">
            <div className="card p-4">
              <div className="label text-[9px]">TOTAL ADMINS</div>
              <div className="text-[22px] font-mono text-[var(--neon)] mt-1">
                {stats?.total_admins || 0}
              </div>
              <div className="text-[11px] text-[var(--muted)] mt-1">
                Platform admins
              </div>
            </div>

            <div className="card p-4">
              <div className="label text-[9px]">SUPER ADMINS</div>
              <div className="text-[22px] font-mono text-[var(--danger)] mt-1">
                {stats?.super_admins || 0}
              </div>
              <div className="text-[11px] text-[var(--muted)] mt-1">
                Full access
              </div>
            </div>

            <div className="card p-4">
              <div className="label text-[9px]">REGULAR ADMINS</div>
              <div className="text-[22px] font-mono text-[var(--info)] mt-1">
                {stats?.regular_admins || 0}
              </div>
              <div className="text-[11px] text-[var(--muted)] mt-1">
                Limited access
              </div>
            </div>

            <div className="card p-4">
              <div className="label text-[9px]">ACTIVE</div>
              <div className="text-[22px] font-mono text-[var(--success)] mt-1">
                {stats?.active_admins || 0}
              </div>
              <div className="text-[11px] text-[var(--muted)] mt-1">
                Currently active
              </div>
            </div>
          </div>

          {/* Create Admin Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary text-[13px] py-2 px-4"
            >
              + Create New Admin
            </button>
          </div>

          {/* Create Admin Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
              <div className="card p-6 max-w-[500px] w-full mx-4">
                <h2 className="h3 text-white mb-4">Create New Admin</h2>
                <form onSubmit={handleCreateAdmin} className="space-y-4">
                  <div>
                    <label className="label text-[11px] mb-1 block">Full Name</label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-[var(--bg2)] border border-[var(--border)] rounded text-white text-[13px]"
                    />
                  </div>
                  <div>
                    <label className="label text-[11px] mb-1 block">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-[var(--bg2)] border border-[var(--border)] rounded text-white text-[13px]"
                    />
                  </div>
                  <div>
                    <label className="label text-[11px] mb-1 block">Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-[var(--bg2)] border border-[var(--border)] rounded text-white text-[13px]"
                    />
                  </div>
                  <div>
                    <label className="label text-[11px] mb-1 block">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                      className="w-full px-3 py-2 bg-[var(--bg2)] border border-[var(--border)] rounded text-white text-[13px]"
                    >
                      <option value="admin">Regular Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>
                  <div className="flex gap-2 justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="btn-ghost px-4 py-2 text-[12px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary px-4 py-2 text-[12px]"
                    >
                      Create Admin
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Admins Table */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="h3 text-white">Admin Users</h3>
              <button className="btn-ghost text-[11px] py-1 px-3">Export CSV</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-2 px-3 label text-[9px]">Admin</th>
                    <th className="text-center py-2 px-3 label text-[9px]">Role</th>
                    <th className="text-center py-2 px-3 label text-[9px]">Status</th>
                    <th className="text-left py-2 px-3 label text-[9px]">Last Login</th>
                    <th className="text-left py-2 px-3 label text-[9px]">Created</th>
                    <th className="text-left py-2 px-3 label text-[9px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map(admin => (
                    <tr key={admin.id} className="border-b border-[var(--border)] hover:bg-[rgba(6,182,212,0.03)]">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-bold text-black" style={{ background: 'linear-gradient(135deg, var(--neon), var(--neon2))' }}>
                            {getInitials(admin.full_name)}
                          </div>
                          <div>
                            <div className="text-white text-[12px]">{admin.full_name}</div>
                            <div className="text-[10px] text-[var(--muted)]">{admin.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`badge text-[9px] ${
                          admin.role === 'super_admin'
                            ? 'bg-[rgba(239,68,68,0.2)] text-[#ef4444]'
                            : 'bg-[rgba(59,130,246,0.2)] text-[#3b82f6]'
                        }`}>
                          {admin.role === 'super_admin' ? 'SUPER ADMIN' : 'ADMIN'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${admin.is_active ? 'bg-[var(--success)]' : 'bg-[var(--danger)]'}`}></div>
                          <span className="text-[11px] text-[var(--muted)]">{admin.is_active ? 'Active' : 'Inactive'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[10px] font-mono text-[var(--muted)]">
                        {admin.last_login ? new Date(admin.last_login).toLocaleString() : 'Never'}
                      </td>
                      <td className="py-3 px-3 text-[10px] font-mono text-[var(--muted)]">
                        {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex gap-1">
                          <button className="btn-ghost text-[10px] px-1">👁️</button>
                          {admin.id !== user?.id && (
                            <>
                              {admin.is_active ? (
                                <button onClick={() => handleDeactivateAdmin(admin.id)} className="btn-ghost text-[10px] px-1 text-[var(--danger)]">🚫</button>
                              ) : (
                                <button onClick={() => handleActivateAdmin(admin.id)} className="btn-ghost text-[10px] px-1 text-[var(--success)]">✅</button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[var(--muted)] text-[12px]">
                Page {page} of {totalPages} ({stats?.total_admins || 0} total)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="btn-ghost text-[11px] py-1 px-3 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="btn-ghost text-[11px] py-1 px-3 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="card p-5 mt-6">
            <h3 className="h3 text-white mb-4">Recent Admin Activity</h3>
            <div className="space-y-2">
              {auditLogs.length === 0 ? (
                <div className="text-[var(--muted)] text-[12px] text-center py-4">No recent activity</div>
              ) : (
                auditLogs.map(log => (
                  <div key={log.id} className="p-3 bg-[var(--bg2)] rounded flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-3">
                      <span className="text-[var(--muted2)]">{log.target_type || 'System'}</span>
                      <span className="text-[var(--muted)]">{log.action}</span>
                    </div>
                    <span className="text-[var(--muted2)] font-mono">{log.created_at ? new Date(log.created_at).toLocaleDateString() : 'N/A'}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
