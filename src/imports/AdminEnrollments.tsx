import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { adminApi, authApi } from '../app/api/config';

export default function AdminEnrollments() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const userData = localStorage.getItem('ff_user');
    if (!userData) {
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
    }
  }, [navigate]);

  useEffect(() => {
    fetchEnrollments();
  }, [page]);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getEnrollments({ page, limit: 20 });
      setEnrollments(data.enrollments);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = () => {
    if (user?.full_name) {
      const names = user.full_name.split(' ');
      if (names.length >= 2) return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      return names[0].substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'AD';
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Navigation */}
      <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-50">
        <div className="absolute border-b border-[#2a2a2a] inset-0 pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="flex items-center justify-between px-[40px] w-full">
            <Link to="/admin/analytics" className="flex gap-[11px] items-center no-underline">
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
                <span className="text-[13px] font-bold text-black">{getUserInitials()}</span>
              </div>
              <button onClick={() => { authApi.logout(); window.location.href = '/login'; }} className="text-[#888] hover:text-white text-sm">Logout</button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-66px)]">
        {/* Sidebar */}
        <div className="fixed left-0 top-[66px] w-[240px] h-[calc(100vh-66px)] bg-[#0f0f0f] border-r border-[#2a2a2a] overflow-y-auto">
          <div className="flex flex-col py-5 px-0">
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3">Admin Panel</div>
            <Link to="/admin/users" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"><span>👥</span><span className="text-[14px]">Users</span></Link>
            <Link to="/admin/courses" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"><span>📚</span><span className="text-[14px]">Courses</span></Link>
            <Link to="/admin/enrollments" className="w-full bg-[rgba(191,255,0,0.1)] border-l-2 border-[#bfff00] py-3 pl-6 pr-4 flex gap-3 items-center"><span className="text-[#bfff00]">🎓</span><span className="text-[#bfff00] text-[14px]">Enrollments</span></Link>
            <Link to="/admin/analytics" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"><span>📊</span><span className="text-[14px]">Analytics</span></Link>
            <Link to="/admin/reports" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"><span>📋</span><span className="text-[14px]">Reports</span></Link>
            <Link to="/admin/announcements" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"><span>📢</span><span className="text-[14px]">Announcements</span></Link>
            <Link to="/admin/audit-log" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"><span>📝</span><span className="text-[14px]">Audit Log</span></Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-[240px] flex-1 p-9">
          <h1 className="text-[32px] text-white font-bold mb-8">Enrollment <span className="text-[#bfff00]">Management</span></h1>

          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  <th className="text-left text-[#888] text-[12px] uppercase tracking-[1px] px-6 py-4">Student</th>
                  <th className="text-left text-[#888] text-[12px] uppercase tracking-[1px] px-6 py-4">Course</th>
                  <th className="text-left text-[#888] text-[12px] uppercase tracking-[1px] px-6 py-4">Progress</th>
                  <th className="text-left text-[#888] text-[12px] uppercase tracking-[1px] px-6 py-4">Status</th>
                  <th className="text-left text-[#888] text-[12px] uppercase tracking-[1px] px-6 py-4">Enrolled</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center text-[#888] py-8">Loading...</td></tr>
                ) : enrollments.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-[#888] py-8">No enrollments found</td></tr>
                ) : (
                  enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="border-b border-[#2a2a2a] hover:bg-[#1a1a1a]">
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{enrollment.student?.name}</div>
                        <div className="text-[#555] text-[12px]">{enrollment.student?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-[#888]">{enrollment.course?.title}</td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-[#2a2a2a] h-2 rounded-full">
                          <div className="bg-[#bfff00] h-2 rounded-full" style={{ width: `${enrollment.progress}%` }} />
                        </div>
                        <span className="text-[#888] text-[12px]">{enrollment.progress}%</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-[99px] text-[12px] ${
                          enrollment.is_refunded ? 'bg-[rgba(255,68,68,0.1)] text-[#f44]' :
                          enrollment.progress === 100 ? 'bg-[rgba(0,255,127,0.1)] text-[#00ff7f]' :
                          'bg-[rgba(0,212,255,0.1)] text-[#00d4ff]'
                        }`}>
                          {enrollment.is_refunded ? 'Refunded' : enrollment.progress === 100 ? 'Completed' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#888]">{enrollment.enrolled_at ? new Date(enrollment.enrolled_at).toLocaleDateString() : 'N/A'}</td>
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
