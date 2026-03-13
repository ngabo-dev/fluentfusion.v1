import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { adminApi, authApi } from "../app/api/config";

interface Application {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  bio: string;
  expertise: string[];
  submitted_at: string;
  status: "pending" | "approved" | "rejected";
  reviewed_at: string | null;
  rejection_reason: string | null;
}

export default function AdminInstructorApplications() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('ff_access_token');
    const userData = localStorage.getItem('ff_user');
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
    }
    fetchApplications();
  }, [navigate]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getInstructorApplications({});
      setApplications(res.applications || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (appId: number) => {
    setActionLoading(true);
    try {
      await adminApi.approveInstructorApplication(appId);
      setSelectedApp(null);
      await fetchApplications();
    } catch (error) {
      console.error('Failed to approve:', error);
      alert('Failed to approve application');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp || !rejectReason.trim()) return;
    setActionLoading(true);
    try {
      await adminApi.rejectInstructorApplication(selectedApp.id, rejectReason);
      setShowRejectModal(false);
      setSelectedApp(null);
      setRejectReason("");
      await fetchApplications();
    } catch (error) {
      console.error('Failed to reject:', error);
      alert('Failed to reject application');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  const pendingCount = applications.filter(app => app.status === "pending").length;

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Navigation */}
      <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-50">
        <div className="absolute border-b border-[#2a2a2a] inset-0 pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="flex items-center justify-between px-[40px] w-full">
            <Link to="/admin/dashboard" className="flex gap-[11px] items-center no-underline">
              <div className="bg-[#bfff00] flex items-center justify-center w-[38px] h-[38px] rounded-[10px]">
                <span className="text-[18px]">🧠</span>
              </div>
              <span className="text-[18px] text-white font-bold">
                FLUENT<span className="text-[#bfff00]">FUSION</span>
              </span>
            </Link>
            <div className="flex items-center gap-[12px]">
              <div className="bg-[rgba(255,0,0,0.1)] px-[13px] py-[5px] rounded-[99px]">
                <span className="text-[#ff4444] text-[11px] font-semibold">👑 Admin</span>
              </div>
              <button 
                onClick={() => {
                  authApi.logout();
                  window.location.href = '/login';
                }}
                className="text-[#888] hover:text-white text-sm bg-transparent border-none cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-66px)]">
        {/* Sidebar */}
        <div className="fixed left-0 top-[66px] w-[260px] h-[calc(100vh-66px)] bg-[#0f0f0f] border-r border-[#2a2a2a] overflow-y-auto">
          <div className="flex flex-col py-5 px-0">
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3">Main</div>
            
            <Link to="/admin/dashboard" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📊</span>
              <span className="text-[14px]">Dashboard</span>
            </Link>
            
            <Link to="/admin/analytics" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📈</span>
              <span className="text-[14px]">Analytics</span>
            </Link>
            
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4">Management</div>
            
            <Link to="/admin/users" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>👥</span>
              <span className="text-[14px]">Users</span>
            </Link>
            
            <Link to="/admin/instructor-applications" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center bg-[rgba(191,255,0,0.1)] border-l-2 border-[#bfff00]">
              <span className="text-[#bfff00]">📝</span>
              <span className="text-[#bfff00] text-[14px]">Instructor Applications</span>
              {pendingCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingCount}</span>
              )}
            </Link>
            
            <Link to="/admin/courses" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📚</span>
              <span className="text-[14px]">Courses</span>
            </Link>
            
            <Link to="/admin/enrollments" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>🎫</span>
              <span className="text-[14px]">Enrollments</span>
            </Link>
            
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4">Platform</div>
            
            <Link to="/admin/announcements" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📢</span>
              <span className="text-[14px]">Announcements</span>
            </Link>
            
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4">Billing</div>
            
            <Link to="/admin/revenue" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>💰</span>
              <span className="text-[14px]">Revenue</span>
            </Link>
            
            <Link to="/admin/payouts" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>💳</span>
              <span className="text-[14px]">Payouts</span>
            </Link>
            
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4">Settings</div>
            
            <Link to="/admin/settings" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>⚙️</span>
              <span className="text-[14px]">Platform Settings</span>
            </Link>
            
            <Link to="/admin/audit-log" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📜</span>
              <span className="text-[14px]">Audit Log</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-[260px] flex-1 p-9">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[32px] text-white font-bold">
                <span className="text-[#bfff00]">Instructor Applications</span>
              </h1>
              <p className="text-[#888] text-[14px] mt-1">
                {pendingCount} pending application{pendingCount !== 1 ? 's' : ''} waiting for review
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-[8px] text-sm ${
                filter === "all" 
                  ? "bg-[#bfff00] text-black" 
                  : "bg-[#1f1f1f] text-[#888] border border-[#2a2a2a]"
              }`}
            >
              All ({applications.length})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-[8px] text-sm ${
                filter === "pending" 
                  ? "bg-[#bfff00] text-black" 
                  : "bg-[#1f1f1f] text-[#888] border border-[#2a2a2a]"
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`px-4 py-2 rounded-[8px] text-sm ${
                filter === "approved" 
                  ? "bg-[#bfff00] text-black" 
                  : "bg-[#1f1f1f] text-[#888] border border-[#2a2a2a]"
              }`}
            >
              Approved ({applications.filter(a => a.status === "approved").length})
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`px-4 py-2 rounded-[8px] text-sm ${
                filter === "rejected" 
                  ? "bg-[#bfff00] text-black" 
                  : "bg-[#1f1f1f] text-[#888] border border-[#2a2a2a]"
              }`}
            >
              Rejected ({applications.filter(a => a.status === "rejected").length})
            </button>
          </div>

          {/* Applications List */}
          {loading ? (
            <div className="text-[#888] text-center py-8">Loading...</div>
          ) : filteredApplications.length === 0 ? (
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-8 text-center">
              <div className="text-[48px] mb-4">📝</div>
              <p className="text-[#888]">No applications found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((app) => (
                <div 
                  key={app.id} 
                  className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 cursor-pointer hover:border-[#bfff00] transition-colors"
                  onClick={() => setSelectedApp(app)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white font-bold text-lg">{app.user_name}</h3>
                      <p className="text-[#888] text-sm">{app.user_email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {app.status === "pending" && (
                        <span className="px-3 py-1 rounded-[99px] text-[12px] bg-[rgba(255,165,0,0.1)] text-orange-400">Pending</span>
                      )}
                      {app.status === "approved" && (
                        <span className="px-3 py-1 rounded-[99px] text-[12px] bg-[rgba(0,255,127,0.1)] text-[#00ff7f]">Approved</span>
                      )}
                      {app.status === "rejected" && (
                        <span className="px-3 py-1 rounded-[99px] text-[12px] bg-[rgba(255,0,0,0.1)] text-red-500">Rejected</span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-[#888] text-[14px] mb-4">{app.bio}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {app.expertise.map((exp, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-[99px] text-[12px] bg-[#1f1f1f] text-[#888] border border-[#2a2a2a]">
                        {exp}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-[12px] text-[#555]">
                    <span>Submitted: {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : 'N/A'}</span>
                    {app.status === "pending" && (
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(app.id);
                          }}
                          disabled={actionLoading}
                          className="px-4 py-1 rounded-[8px] bg-[#00ff7f] text-black text-sm font-medium hover:bg-[#00dd6f]"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApp(app);
                            setShowRejectModal(true);
                          }}
                          className="px-4 py-1 rounded-[8px] bg-red-500 text-white text-sm font-medium hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedApp && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]" onClick={() => setShowRejectModal(false)}>
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 w-[500px]" onClick={e => e.stopPropagation()}>
            <h2 className="text-white text-[20px] font-bold mb-4">Reject Application</h2>
            <p className="text-[#888] mb-4">
              You are rejecting the application from <span className="text-white">{selectedApp.user_name}</span>.
            </p>
            
            <div className="mb-4">
              <label className="text-[#888] text-[12px] uppercase block mb-2">Rejection Reason</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                rows={4}
                className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] resize-none"
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowRejectModal(false)}
                className="flex-1 bg-[#1f1f1f] text-[#888] py-3 rounded-[8px]"
              >
                Cancel
              </button>
              <button 
                onClick={handleReject}
                disabled={actionLoading || !rejectReason.trim()}
                className="flex-1 bg-red-500 text-white py-3 rounded-[8px] font-semibold disabled:opacity-50"
              >
                {actionLoading ? 'Rejecting...' : 'Reject Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
