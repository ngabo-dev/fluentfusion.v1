import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { adminApi } from "../app/api/config";

interface CourseRequest {
  id: number;
  course_id: number;
  course_title: string;
  instructor_id: number;
  instructor_name: string;
  request_type: "edit" | "delete";
  status: "pending" | "approved" | "rejected";
  old_values: Record<string, any>;
  new_values: Record<string, any>;
  reason: string;
  admin_comment: string | null;
  created_at: string;
  reviewed_at: string | null;
}

export default function AdminCourseApprovals() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<CourseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [selectedRequest, setSelectedRequest] = useState<CourseRequest | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject">("approve");
  const [adminComment, setAdminComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
    fetchRequests();
  }, [navigate]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCourseRequests({ limit: 100 });
      setRequests(res.requests || []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    if (!selectedRequest) return;
    if (reviewAction === "reject" && !adminComment.trim()) {
      toast.error('Please provide a reason for rejecting this request');
      return;
    }
    setSubmitting(true);
    try {
      if (reviewAction === "approve") {
        await adminApi.approveCourseRequest(selectedRequest.id, adminComment || undefined);
      } else {
        await adminApi.rejectCourseRequest(selectedRequest.id, adminComment);
      }
      setShowReviewModal(false);
      setSelectedRequest(null);
      setAdminComment("");
      await fetchRequests();
    } catch (error) {
      console.error('Failed to review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRequests = requests.filter(r => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  const pendingCount = requests.filter(r => r.status === "pending").length;

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="text-[#bfff00]">Loading...</div>
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
                  localStorage.removeItem('ff_access_token');
                  localStorage.removeItem('ff_refresh_token');
                  localStorage.removeItem('ff_user');
                  navigate('/login');
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
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3">Management</div>
            
            <Link to="/admin/users" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>👥</span>
              <span className="text-[14px]">Users</span>
            </Link>
            
            <Link to="/admin/courses" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📚</span>
              <span className="text-[14px]">Courses</span>
            </Link>
            
            <Link to="/admin/course-approvals" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center bg-[rgba(191,255,0,0.1)] border-l-2 border-[#bfff00]">
              <span className="text-[#bfff00]">✅</span>
              <span className="text-[#bfff00] text-[14px]">Course Approvals</span>
              {pendingCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingCount}</span>
              )}
            </Link>
            
            <Link to="/admin/instructor-applications" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📝</span>
              <span className="text-[14px]">Instructor Apps</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-[260px] flex-1 p-9">
          <div className="mb-8">
            <h1 className="text-[32px] text-white font-bold">
              <span className="text-[#bfff00]">Course Approvals</span>
            </h1>
            <p className="text-[#888] text-[14px] mt-1">
              Review and approve instructor requests to edit or delete courses
              {pendingCount > 0 && (
                <span className="ml-2 text-orange-400">
                  • {pendingCount} pending request{pendingCount !== 1 ? 's' : ''}
                </span>
              )}
            </p>
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
              All ({requests.length})
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
              Approved ({requests.filter(r => r.status === "approved").length})
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`px-4 py-2 rounded-[8px] text-sm ${
                filter === "rejected" 
                  ? "bg-[#bfff00] text-black" 
                  : "bg-[#1f1f1f] text-[#888] border border-[#2a2a2a]"
              }`}
            >
              Rejected ({requests.filter(r => r.status === "rejected").length})
            </button>
          </div>

          {/* Requests List */}
          {filteredRequests.length === 0 ? (
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-8 text-center">
              <div className="text-[48px] mb-4">✅</div>
              <p className="text-[#888]">No requests found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div 
                  key={request.id}
                  className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded-[4px] text-xs ${
                          request.request_type === 'edit' 
                            ? 'bg-[rgba(0,191,255,0.1)] text-[#00bfff]' 
                            : 'bg-[rgba(255,0,0,0.1)] text-red-500'
                        }`}>
                          {request.request_type === 'edit' ? '✏️ Edit Request' : '🗑️ Delete Request'}
                        </span>
                        <span className={`px-2 py-1 rounded-[4px] text-xs ${
                          request.status === 'pending' ? 'bg-orange-500/10 text-orange-400' :
                          request.status === 'approved' ? 'bg-[rgba(0,255,127,0.1)] text-[#00ff7f]' :
                          'bg-[rgba(255,0,0,0.1)] text-red-500'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      <h3 className="text-white font-bold text-lg">{request.course_title}</h3>
                      <p className="text-[#888] text-sm">by {request.instructor_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#555] text-sm">
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Request Details */}
                  <div className="bg-[#1f1f1f] rounded-[8px] p-4 mb-4">
                    <h4 className="text-[#888] text-xs uppercase mb-2">Reason</h4>
                    <p className="text-white">{request.reason}</p>
                  </div>
                  
                  {request.request_type === 'edit' && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-[#1f1f1f] rounded-[8px] p-4">
                        <h4 className="text-[#888] text-xs uppercase mb-2">Current Values</h4>
                        <pre className="text-white text-sm whitespace-pre-wrap">
                          {JSON.stringify(request.old_values, null, 2)}
                        </pre>
                      </div>
                      <div className="bg-[rgba(191,255,0,0.05)] border border-[#bfff00]/20 rounded-[8px] p-4">
                        <h4 className="text-[#bfff00] text-xs uppercase mb-2">New Values</h4>
                        <pre className="text-white text-sm whitespace-pre-wrap">
                          {JSON.stringify(request.new_values, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                  
                  {/* Admin Response */}
                  {request.admin_comment && (
                    <div className={`rounded-[8px] p-4 mb-4 ${
                      request.status === 'approved' 
                        ? 'bg-[rgba(0,255,127,0.05)] border border-[#00ff7f]/20'
                        : 'bg-[rgba(255,0,0,0.05)] border border-red-500/20'
                    }`}>
                      <h4 className={`text-xs uppercase mb-2 ${
                        request.status === 'approved' ? 'text-[#00ff7f]' : 'text-red-500'
                      }`}>
                        Admin Comment
                      </h4>
                      <p className="text-white">{request.admin_comment}</p>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  {request.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setReviewAction("approve");
                          setAdminComment("");
                          setShowReviewModal(true);
                        }}
                        className="flex-1 bg-[#00ff7f] text-black py-2 rounded-[8px] font-semibold"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setReviewAction("reject");
                          setAdminComment("");
                          setShowReviewModal(true);
                        }}
                        className="flex-1 bg-red-500 text-white py-2 rounded-[8px] font-semibold"
                      >
                        ✕ Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]" onClick={() => setShowReviewModal(false)}>
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 w-[500px]" onClick={e => e.stopPropagation()}>
            <h2 className="text-white text-[20px] font-bold mb-2">
              {reviewAction === "approve" ? "Approve" : "Reject"} Request
            </h2>
            <p className="text-[#888] text-sm mb-4">
              You're {reviewAction === "approve" ? "approving" : "rejecting"} the {selectedRequest.request_type} request for "{selectedRequest.course_title}"
            </p>
            
            <div className="mb-4">
              <label className="text-[#888] text-xs uppercase block mb-2">
                Admin Comment *
              </label>
              <textarea
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                placeholder={reviewAction === "approve" 
                  ? "Add a comment (optional)..." 
                  : "Explain why you're rejecting this request..."
                }
                rows={4}
                className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] resize-none"
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowReviewModal(false)}
                className="flex-1 bg-[#1f1f1f] text-[#888] py-3 rounded-[8px]"
              >
                Cancel
              </button>
              <button 
                onClick={handleReview}
                disabled={submitting || (reviewAction === "reject" && !adminComment.trim())}
                className={`flex-1 py-3 rounded-[8px] font-semibold disabled:opacity-50 ${
                  reviewAction === "approve" 
                    ? "bg-[#00ff7f] text-black" 
                    : "bg-red-500 text-white"
                }`}
              >
                {submitting ? 'Submitting...' : reviewAction === "approve" ? 'Approve Request' : 'Reject Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
