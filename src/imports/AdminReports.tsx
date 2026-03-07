import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { adminApi } from '../app/api/config';

interface Report {
  id: number;
  reporter: { id: number; name: string; email: string };
  report_type: string;
  title: string;
  description: string;
  mentions: any[];
  priority: string;
  status: string;
  created_at: string;
}

export default function AdminReports() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
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
    fetchReports();
  }, [page, statusFilter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAdminReports({
        page,
        limit: 20,
        status: statusFilter || undefined
      });
      setReports(data.reports);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reportId: number, newStatus: string) => {
    try {
      await adminApi.updateReportStatus(reportId, newStatus);
      fetchReports();
      if (selectedReport?.id === reportId) {
        setSelectedReport({ ...selectedReport, status: newStatus });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleAddComment = async () => {
    if (!selectedReport || !commentText.trim()) return;
    try {
      await adminApi.addReportComment(selectedReport.id, commentText);
      setCommentText('');
      // Refresh report details
      const details = await adminApi.getReportDetails(selectedReport.id);
      setSelectedReport({ ...selectedReport, comments: details.comments });
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  // Highlight @mentions in text
  const highlightMentions = (text: string, mentions: any[]) => {
    if (!mentions || mentions.length === 0) return text;
    let result = text;
    mentions.forEach((mention: any) => {
      const mentionText = `@${mention.username}`;
      result = result.replace(
        mentionText,
        `<span class="bg-[rgba(191,255,0,0.2)] text-[#bfff00] px-1 rounded">${mentionText}</span>`
      );
    });
    return result;
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
              <span className="text-[18px] text-white font-bold">FLUENT<span className="text-[#bfff00]">FUSION</span></span>
            </Link>
            <div className="flex items-center gap-[12px]">
              <div className="bg-[rgba(255,68,68,0.1)] px-[13px] py-[5px] rounded-[99px]">
                <span className="text-[#f44] text-[11px] font-semibold">🛡 Admin</span>
              </div>
              <div className="w-[32px] h-[32px] rounded-[16px] flex items-center justify-center"
                   style={{ background: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
                <span className="text-[13px] font-bold text-black">{getUserInitials()}</span>
              </div>
              <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="text-[#888] hover:text-white text-sm">Logout</button>
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
            <Link to="/admin/enrollments" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"><span>🎓</span><span className="text-[14px]">Enrollments</span></Link>
            <Link to="/admin/analytics" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"><span>📊</span><span className="text-[14px]">Analytics</span></Link>
            <Link to="/admin/reports" className="w-full bg-[rgba(191,255,0,0.1)] border-l-2 border-[#bfff00] py-3 pl-6 pr-4 flex gap-3 items-center"><span className="text-[#bfff00]">📋</span><span className="text-[#bfff00] text-[14px]">Reports</span></Link>
            <Link to="/admin/announcements" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"><span>📢</span><span className="text-[14px]">Announcements</span></Link>
            <Link to="/admin/audit-log" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"><span>📝</span><span className="text-[14px]">Audit Log</span></Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-[240px] flex-1 p-9 flex gap-6">
          {/* Reports List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-[32px] text-white font-bold">Reports <span className="text-[#bfff00]">& Concerns</span></h1>
              <select 
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
              >
                <option value="">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2a2a]">
                    <th className="text-left text-[#888] text-[12px] uppercase tracking-[1px] px-6 py-4">Reporter</th>
                    <th className="text-left text-[#888] text-[12px] uppercase tracking-[1px] px-6 py-4">Type</th>
                    <th className="text-left text-[#888] text-[12px] uppercase tracking-[1px] px-6 py-4">Title</th>
                    <th className="text-left text-[#888] text-[12px] uppercase tracking-[1px] px-6 py-4">Priority</th>
                    <th className="text-left text-[#888] text-[12px] uppercase tracking-[1px] px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="text-center text-[#888] py-8">Loading...</td></tr>
                  ) : reports.length === 0 ? (
                    <tr><td colSpan={5} className="text-center text-[#888] py-8">No reports found</td></tr>
                  ) : (
                    reports.map((report) => (
                      <tr 
                        key={report.id} 
                        className={`border-b border-[#2a2a2a] hover:bg-[#1a1a1a] cursor-pointer ${selectedReport?.id === report.id ? 'bg-[#1a1a1a]' : ''}`}
                        onClick={() => setSelectedReport(report)}
                      >
                        <td className="px-6 py-4">
                          <div className="text-white font-medium">{report.reporter?.name}</div>
                          <div className="text-[#555] text-[12px]">{report.reporter?.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-[#1f1f1f] text-[#888] px-3 py-1 rounded-[99px] text-[12px]">{report.report_type}</span>
                        </td>
                        <td className="px-6 py-4 text-white">{report.title}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-[99px] text-[12px] ${
                            report.priority === 'urgent' ? 'bg-[rgba(255,68,68,0.1)] text-[#f44]' :
                            report.priority === 'high' ? 'bg-[rgba(255,184,0,0.1)] text-[#ffb800]' :
                            'bg-[rgba(0,212,255,0.1)] text-[#00d4ff]'
                          }`}>{report.priority}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-[99px] text-[12px] ${
                            report.status === 'resolved' ? 'bg-[rgba(0,255,127,0.1)] text-[#00ff7f]' :
                            report.status === 'closed' ? 'bg-[rgba(136,136,136,0.1)] text-[#888]' :
                            'bg-[rgba(0,212,255,0.1)] text-[#00d4ff]'
                          }`}>{report.status}</span>
                        </td>
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

          {/* Report Details Panel */}
          {selectedReport && (
            <div className="w-[400px] bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 h-fit">
              <h3 className="text-white text-[18px] font-bold mb-4">{selectedReport.title}</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-[#888] text-[12px] uppercase mb-1">Reporter</div>
                  <div className="text-white">{selectedReport.reporter?.name} ({selectedReport.reporter?.email})</div>
                </div>
                <div>
                  <div className="text-[#888] text-[12px] uppercase mb-1">Type</div>
                  <div className="text-white">{selectedReport.report_type}</div>
                </div>
                <div>
                  <div className="text-[#888] text-[12px] uppercase mb-1">Description</div>
                  <div className="text-white text-[14px]" dangerouslySetInnerHTML={{ __html: highlightMentions(selectedReport.description, selectedReport.mentions) }} />
                </div>
                {selectedReport.mentions && selectedReport.mentions.length > 0 && (
                  <div>
                    <div className="text-[#888] text-[12px] uppercase mb-1">Mentions</div>
                    <div className="flex gap-2 flex-wrap">
                      {selectedReport.mentions.map((mention: any, i: number) => (
                        <span key={i} className="bg-[rgba(191,255,0,0.1)] text-[#bfff00] px-2 py-1 rounded text-[12px]">
                          @{mention.username}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-[#888] text-[12px] uppercase mb-1">Status</div>
                  <select 
                    value={selectedReport.status}
                    onChange={(e) => handleStatusChange(selectedReport.id, e.target.value)}
                    className="bg-[#1f1f1f] text-white rounded-[8px] px-3 py-2 outline-none border border-[#2a2a2a] w-full"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="acknowledged">Acknowledged</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Add Comment */}
              <div className="border-t border-[#2a2a2a] pt-4">
                <div className="text-[#888] text-[12px] uppercase mb-2">Add Comment (@mention supported)</div>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Type your response... Use @username to mention users"
                  className="bg-[#1f1f1f] text-white rounded-[8px] px-3 py-2 outline-none border border-[#2a2a2a] w-full h-24 resize-none"
                />
                <button 
                  onClick={handleAddComment}
                  className="bg-[#bfff00] text-black px-4 py-2 rounded-[8px] font-semibold mt-2 w-full"
                >
                  Add Comment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
