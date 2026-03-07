import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

export default function Component26AdminUsers() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    instructors: 0,
    banned: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", password: "", full_name: "", role: "student" });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      if (parsed.role !== 'admin') {
        navigate('/dashboard');
        return;
      }
      setUser(parsed);
    } catch (e) {
      navigate('/login');
      return;
    }
    fetchUsers();
    fetchStats();
  }, [navigate, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    
    try {
      let url = 'http://localhost:8000/api/v1/admin/users?limit=50';
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      if (roleFilter) url += `&role=${roleFilter}`;
      if (statusFilter === "active") url += `&is_banned=false`;
      if (statusFilter === "banned") url += `&is_banned=true`;
      
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchStats = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    
    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats({
          totalUsers: data.users?.total || 0,
          activeToday: data.users?.new_today || 0,
          instructors: data.users?.active || 0,
          banned: 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    
    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        setShowCreateModal(false);
        setNewUser({ email: "", password: "", full_name: "", role: "student" });
        fetchUsers();
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleActivate = async (userId: number) => {
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`http://localhost:8000/api/v1/admin/users/${userId}/activate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchUsers();
    } catch (error) {
      console.error('Failed to activate user:', error);
    }
  };

  const handleDeactivate = async (userId: number) => {
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`http://localhost:8000/api/v1/admin/users/${userId}/deactivate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchUsers();
    } catch (error) {
      console.error('Failed to deactivate user:', error);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`http://localhost:8000/api/v1/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleBadge = (role: string) => {
    if (role === 'admin') return { bg: 'bg-[rgba(255,68,68,0.1)]', text: 'text-[#f44]', label: 'Admin' };
    if (role === 'instructor') return { bg: 'bg-[rgba(191,255,0,0.1)]', text: 'text-[#bfff00]', label: 'Instructor' };
    return { bg: 'bg-[rgba(255,255,255,0.06)]', text: 'text-[#888]', label: 'Student' };
  };

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="text-[#bfff00] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Navigation */}
      <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-50">
        <div className="absolute border-b border-[#2a2a2a] inset-0 pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="flex items-center justify-between px-[40px] w-full">
            <Link to="/admin/users" className="flex gap-[11px] items-center no-underline">
              <div className="bg-[#bfff00] flex items-center justify-center w-[38px] h-[38px] rounded-[10px]">
                <span className="text-[18px]">🧠</span>
              </div>
              <span className="text-[18px] text-white font-bold">
                FLUENT<span className="text-[#bfff00]">FUSION</span>
              </span>
            </Link>
            <div className="flex items-center gap-[12px]">
              <div className="bg-[rgba(255,68,68,0.1)] px-[13px] py-[5px] rounded-[99px]">
                <span className="text-[#f44] text-[11px] font-semibold">🛡 Admin</span>
              </div>
              <div className="w-[32px] h-[32px] rounded-[16px] flex items-center justify-center"
                   style={{ background: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
                <span className="text-[13px] font-bold text-black">
                  {user?.full_name ? getInitials(user.full_name) : 'AD'}
                </span>
              </div>
              <button 
                onClick={() => {
                  localStorage.removeItem('access_token');
                  localStorage.removeItem('refresh_token');
                  localStorage.removeItem('user');
                  navigate('/login');
                }}
                className="text-[#888] hover:text-white text-sm bg-transparent border-none cursor-pointer ml-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-66px)]">
        {/* Sidebar */}
        <div className="fixed left-0 top-[66px] w-[240px] h-[calc(100vh-66px)] bg-[#0f0f0f] border-r border-[#2a2a2a] overflow-y-auto">
          <div className="flex flex-col py-5 px-0">
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3">Admin Panel</div>
            
            <Link to="/admin/users" className="w-full bg-[rgba(191,255,0,0.1)] border-l-2 border-[#bfff00] py-3 pl-6 pr-4 flex gap-3 items-center">
              <span className="text-[#bfff00]">👥</span>
              <span className="text-[#bfff00] text-[14px]">Users</span>
            </Link>
            
            <Link to="/admin/courses" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📚</span>
              <span className="text-[14px]">Course Approval</span>
            </Link>
            
            <Link to="/admin/analytics" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📊</span>
              <span className="text-[14px]">Analytics</span>
            </Link>
            
            <Link to="/admin/reports" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📋</span>
              <span className="text-[14px]">Reports</span>
            </Link>
            
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4">Account</div>
            
            <Link to="/profile" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>👤</span>
              <span className="text-[14px]">Profile</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-[240px] flex-1 p-9">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[32px] text-white font-bold">
                User <span className="text-[#bfff00]">Management</span>
              </h1>
              <p className="text-[#888] text-[14px] mt-1">
                {stats.totalUsers.toLocaleString()}+ registered users
              </p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-[#bfff00] text-[#0a0a0a] px-[24px] py-[11px] rounded-[8px] font-semibold hover:opacity-90 transition-opacity"
            >
              + Invite User
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-[18px] mb-8">
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-5">
              <div className="text-[#888] text-[10px] uppercase tracking-[1px]">Total Users</div>
              <div className="text-[#bfff00] text-[34px] font-bold mt-2">
                {loading ? '...' : stats.totalUsers.toLocaleString()}
              </div>
              <div className="text-[#888] text-[11px] mt-1">registered users</div>
            </div>
            
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-5">
              <div className="text-[#888] text-[10px] uppercase tracking-[1px]">Active Today</div>
              <div className="text-[#bfff00] text-[34px] font-bold mt-2">
                {loading ? '...' : stats.activeToday}
              </div>
              <div className="text-[#888] text-[11px] mt-1">new registrations</div>
            </div>
            
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-5">
              <div className="text-[#888] text-[10px] uppercase tracking-[1px]">Instructors</div>
              <div className="text-[#bfff00] text-[34px] font-bold mt-2">
                {loading ? '...' : stats.instructors}
              </div>
              <div className="text-[#888] text-[11px] mt-1">verified</div>
            </div>
            
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-5">
              <div className="text-[#888] text-[10px] uppercase tracking-[1px]">Banned</div>
              <div className="text-[#f44] text-[34px] font-bold mt-2">
                {loading ? '...' : stats.banned}
              </div>
              <div className="text-[#888] text-[11px] mt-1">under review</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-[12px] mb-6">
            <div className="bg-[#1f1f1f] rounded-[8px] px-4 py-3 flex-1 max-w-[380px]">
              <input 
                type="text" 
                placeholder="Search users by name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-[#888] w-full text-[15px] placeholder-[#555]"
              />
            </div>
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#1f1f1f] text-[#888] rounded-[8px] px-4 py-3 min-w-[140px] outline-none border border-[#2a2a2a]"
            >
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#1f1f1f] text-[#888] rounded-[8px] px-4 py-3 min-w-[140px] outline-none border border-[#2a2a2a]"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  <th className="text-left py-3 px-4 text-[#888] text-[10px] uppercase tracking-[1px] font-medium">User</th>
                  <th className="text-left py-3 px-4 text-[#888] text-[10px] uppercase tracking-[1px] font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-[#888] text-[10px] uppercase tracking-[1px] font-medium">Joined</th>
                  <th className="text-left py-3 px-4 text-[#888] text-[10px] uppercase tracking-[1px] font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-[#888] text-[10px] uppercase tracking-[1px] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#888]">Loading...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#888]">No users found</td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const roleBadge = getRoleBadge(u.role);
                    return (
                      <tr key={u.id} className="border-b border-[#2a2a2a] hover:bg-[#1a1a1a]">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-[32px] h-[32px] rounded-[16px] flex items-center justify-center"
                                 style={{ background: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
                              <span className="text-[13px] font-bold text-black">{getInitials(u.full_name)}</span>
                            </div>
                            <div>
                              <div className="text-white text-[13px]">{u.full_name}</div>
                              <div className="text-[#888] text-[11px]">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-[99px] text-[11px] ${roleBadge.bg} ${roleBadge.text}`}>
                            {roleBadge.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#888] text-[13px]">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-3 px-4">
                          {u.is_banned ? (
                            <span className="px-3 py-1 rounded-[99px] text-[11px] bg-[rgba(255,68,68,0.1)] text-[#f44]">Banned</span>
                          ) : u.is_active ? (
                            <span className="px-3 py-1 rounded-[99px] text-[11px] bg-[rgba(0,255,127,0.1)] text-[#00ff7f]">Active</span>
                          ) : (
                            <span className="px-3 py-1 rounded-[99px] text-[11px] bg-[rgba(255,255,255,0.06)] text-[#888]">Inactive</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => navigate(`/admin/users/${u.id}/progress`)}
                              className="px-4 py-1.5 rounded-[8px] text-[#888] hover:text-white bg-transparent border border-[#2a2a2a]"
                            >
                              View
                            </button>
                            {u.is_active ? (
                              <button 
                                onClick={() => handleDeactivate(u.id)}
                                className="px-4 py-1.5 rounded-[8px] text-[#ffb800] hover:text-white bg-transparent border border-[#2a2a2a]"
                              >
                                Deactivate
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleActivate(u.id)}
                                className="px-4 py-1.5 rounded-[8px] text-[#00ff7f] hover:text-white bg-transparent border border-[#2a2a2a]"
                              >
                                Activate
                              </button>
                            )}
                            <button 
                              onClick={() => handleDelete(u.id)}
                              className="px-4 py-1.5 rounded-[8px] text-[#f44] hover:text-white bg-transparent border border-[#2a2a2a]"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 w-[400px]">
            <h2 className="text-white text-[20px] font-bold mb-4">Create New User</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[#888] text-[12px]">Full Name</label>
                <input 
                  type="text" 
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                  className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded-[8px] px-4 py-3 text-white mt-1"
                />
              </div>
              <div>
                <label className="text-[#888] text-[12px]">Email</label>
                <input 
                  type="email" 
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded-[8px] px-4 py-3 text-white mt-1"
                />
              </div>
              <div>
                <label className="text-[#888] text-[12px]">Password</label>
                <input 
                  type="password" 
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded-[8px] px-4 py-3 text-white mt-1"
                />
              </div>
              <div>
                <label className="text-[#888] text-[12px]">Role</label>
                <select 
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded-[8px] px-4 py-3 text-white mt-1"
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 rounded-[8px] text-[#888] border border-[#2a2a2a]"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateUser}
                className="flex-1 py-3 rounded-[8px] bg-[#bfff00] text-[#0a0a0a] font-semibold"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
