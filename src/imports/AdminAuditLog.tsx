import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { adminApi } from '../app/api/config';

export default function AdminAuditLog() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionFilter, setActionFilter] = useState('');
  const [targetTypeFilter, setTargetTypeFilter] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) { navigate('/login'); return; }
    try {
      const parsed = JSON.parse(userData);
      if (parsed.role !== 'admin') { navigate('/dashboard'); return; }
      setUser(parsed);
    } catch (e) { navigate('/login'); }
  }, [navigate]);

  useEffect(() => { fetchLogs(); }, [page, actionFilter, targetTypeFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAuditLogs({
        page,
        limit: 50,
        action: actionFilter || undefined,
        target_type: targetTypeFilter || undefined
      });
      setLogs(data.logs);
      setTotalPages(data.total_pages);
    } catch (error) { console.error('Failed to fetch:', error); }
    finally { setLoading(false); }
  };

  const getUserInitials = () => {
    if (user?.full_name) {
      const names = user.full_name.split(' ');
      return names.length >= 2 ? (names[0][0] + names[names.length - 1][0]).toUpperCase() : names[0].substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'AD';
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-50">
        <div className="absolute border-b border-[#2a2a2a] inset-0 pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="flex items-center justify-between px-[40px] w-full">
            <Link to="/admin/analytics" className="flex gap-[11px] items-center no-underline">
              <div className="bg-[#bfff00] flex items-center justify-center w-[38px] h-[38px] rounded-[10px]"><span className="text-[18px]">🧠</span></div>
              <span className="text-[18px] text-white font-bold">FLUENT<span className="text-[#bfff00]">FUSION</span></span>
            </Link>
            <div className="flex items-center gap-[12px]">
              <div className="bg-[rgba(255,68,68,0.1)] px-[13px] py-[5px] rounded-[99px]"><span className="text-[#f44] text-[11px] font-semibold">🛡 Admin</span></div>
              <div className="w-[32px] h-[32px] rounded-[16px] flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
                <span className="text-[13px] font-bold text-black">{getUserInitials()}</span>
              </div>
              <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="text-[#888] hover:text-white text-sm">Logout</button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-66px)]">
        <div className="fixed left-0 top-[66px] w-[240px] h-[calc(100vh-66px)] bg-[#0f0f0f] border-r border-[#2a2a2a] overflow-y-auto">
          <div className="flex flex-col py-5 px-0">
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3">Admin Panel</div>
            <Link to="/admin/users" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"><span>👥</span><span className="text-[14px]">Users</span></Link>
            <Link to="/admin/courses" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"><span>📚</span><span className="text-[14px]">Courses</span></Link>
            <Link to="/admin/enrollments" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"><span>🎓</span><span className="text-[14px]">Enrollments</span></Link>
            <Link to="/admin/analytics" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"><span>📊</span><span className="text-[14px]">Analytics</span></Link>
            <Link to="/admin/reports" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"><span>📋</span><span className="text-[14px]">Reports</span></Link>
            <Link to="/admin/announcements" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"><span>📢</span><span className="text-[14px]">Announcements</span></Link>
            <Link to="/admin/audit-log" className="w-full bg-[rgba(191,255,0,0.1)] border-l-2 border-[#bfff00] py-3 pl-6 pr-4 flex gap-3 items-center"><span className="text-[#bfff00]">📝</span><span className="text-[#bfff00] text-[14px]">Audit Log</span></Link>
          </div>
        </div>

        <div className="ml-[240px] flex-1 p-9">
          <h1 className="text-[32px] text-white font-bold mb-8">Audit <span className="text-[#bfff00]">Log</span></h1>

          <div className="flex gap-4 mb-6">
            <select value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setPage(1); }} className="bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]">
              <option value="">All Actions</option>
              <option value="create_user">Create User</option>
              <option value="update_user">Update User</option>
              <option value="delete_user">Delete User</option>
              <option value="ban_user">Ban User</option>
              <option value="unban_user">Unban User</option>
              <option value="approve_course">Approve Course</option>
              <option value="reject_course">Reject Course</option>
              <option value="publish_course">Publish Course</option>
            </select>
            <select value={targetTypeFilter} onChange={(e) => { setTargetTypeFilter(e.target.value); setPage(1); }} className="bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]">
              <option value="">All Target Types</option>
              <option value="user">User</option>
              <option value="course">Course</option>
              <option value="payment">Payment</option>
              <option value="certificate">Certificate</option>
            </select>
          </div>

          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  <th className="text-left text-[#888] text-[12px] uppercase tracking-[1px] px-6 py-4">Timestamp</th>
                  <th className="text-left text-[#888] text-[12px] uppercase tracking-[1px] px-6 py-4">Admin</th>
                  <th className="text-left text-[#888] text-[12px] uppercase tracking-[1px] px-6 py-4">Action</th>
                  <th className="text-left text-[#888] text-[12px] uppercase tracking-[1px] px-6 py-4">Target Type</th>
                  <th className="text-left text-[#888] text-[12px] uppercase tracking-[1px] px-6 py-4">Target ID</th>
                  <th className="text-left text-[#888] text-[12px] uppercase tracking-[1px] px-6 py-4">Notes</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center text-[#888] py-8">Loading...</td></tr>
                ) : logs.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-[#888] py-8">No audit logs</td></tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="border-b border-[#2a2a2a] hover:bg-[#1a1a1a]">
                      <td className="px-6 py-4 text-[#888]">{new Date(log.created_at).toLocaleString()}</td>
                      <td className="px-6 py-4 text-white">{log.admin?.name || 'System'}</td>
                      <td className="px-6 py-4"><span className="bg-[rgba(191,255,0,0.1)] text-[#bfff00] px-3 py-1 rounded-[99px] text-[12px]">{log.action}</span></td>
                      <td className="px-6 py-4 text-[#888]">{log.target_type}</td>
                      <td className="px-6 py-4 text-[#888]">{log.target_id}</td>
                      <td className="px-6 py-4 text-[#888] text-[14px] max-w-xs truncate">{log.notes || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="bg-[#1f1f1f] text-white px-4 py-2 rounded-[8px] border border-[#2a2a2a] disabled:opacity-50">Previous</button>
              <span className="text-[#888] py-2">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="bg-[#1f1f1f] text-white px-4 py-2 rounded-[8px] border border-[#2a2a2a] disabled:opacity-50">Next</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
