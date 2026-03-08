import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { authApi } from "../app/api/config";

interface Assignment {
  id: number;
  title: string;
  assignment_type: "speaking" | "writing";
  prompt: string;
  course_id: number;
  course_title: string;
  due_date: string | null;
  status: "pending" | "submitted" | "graded";
  submission_id?: number;
  grade?: number;
  feedback?: string;
}

export default function StudentAssignments() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState({
    content: "",
    audioBlob: null as File | null
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
      setUser(parsed);
    } catch (e) {
      navigate('/login');
    }
    fetchAssignments();
  }, [navigate]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      // Assignments feature is coming soon - start with empty state
      setAssignments([]);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAssignment || (!submission.content && !submission.audioBlob)) {
      toast.error('Please provide your submission');
      return;
    }
    
    setSubmitting(true);
    try {
      // Assignments submission API coming soon
      setShowSubmitModal(false);
      setSubmission({ content: "", audioBlob: null });
      toast.info('Assignments feature coming soon');
    } catch (error) {
      console.error('Failed to submit:', error);
      toast.error('Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 rounded-[99px] text-xs bg-orange-500/10 text-orange-400">Pending Submission</span>;
      case 'submitted':
        return <span className="px-3 py-1 rounded-[99px] text-xs bg-blue-500/10 text-blue-400">Submitted</span>;
      case 'graded':
        return <span className="px-3 py-1 rounded-[99px] text-xs bg-[rgba(0,255,127,0.1)] text-[#00ff7f]">Graded</span>;
      default:
        return null;
    }
  };

  const pendingCount = assignments.filter(a => a.status === 'pending').length;

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
            <Link to="/dashboard" className="flex gap-[11px] items-center no-underline">
              <div className="bg-[#bfff00] flex items-center justify-center w-[38px] h-[38px] rounded-[10px]">
                <span className="text-[18px]">🧠</span>
              </div>
              <span className="text-[18px] text-white font-bold">
                FLUENT<span className="text-[#bfff00]">FUSION</span>
              </span>
            </Link>
            <div className="flex items-center gap-[12px]">
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
        <div className="fixed left-0 top-[66px] w-[240px] h-[calc(100vh-66px)] bg-[#0f0f0f] border-r border-[#2a2a2a] overflow-y-auto">
          <div className="flex flex-col py-5 px-0">
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3">Learning</div>
            
            <Link to="/dashboard" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>🏠</span>
              <span className="text-[14px]">Home</span>
            </Link>
            
            <Link to="/courses" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📚</span>
              <span className="text-[14px]">My Courses</span>
            </Link>
            
            <Link to="/assignments" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center bg-[rgba(191,255,0,0.1)] border-l-2 border-[#bfff00]">
              <span className="text-[#bfff00]">📝</span>
              <span className="text-[#bfff00] text-[14px]">Assignments</span>
              {pendingCount > 0 && (
                <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingCount}</span>
              )}
            </Link>
            
            <Link to="/live-sessions" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>🎥</span>
              <span className="text-[14px]">Live Classes</span>
            </Link>
            
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4">Progress</div>
            
            <Link to="/progress" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📊</span>
              <span className="text-[14px]">Progress</span>
            </Link>
            
            <Link to="/achievements" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>🏆</span>
              <span className="text-[14px]">Achievements</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-[240px] flex-1 p-9">
          <div className="mb-8">
            <h1 className="text-[32px] text-white font-bold">
              <span className="text-[#bfff00]">Assignments</span>
            </h1>
            <p className="text-[#888] text-[14px] mt-1">
              Complete your assignments and view your grades
            </p>
          </div>

          {assignments.length === 0 ? (
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-8 text-center">
              <div className="text-[48px] mb-4">📝</div>
              <p className="text-[#888]">No assignments yet</p>
              <p className="text-[#555] text-sm mt-2">Enroll in a course to see assignments</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {assignments.map((assignment) => (
                <div 
                  key={assignment.id}
                  className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 hover:border-[#bfff00] transition-colors cursor-pointer"
                  onClick={() => setSelectedAssignment(assignment)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{assignment.assignment_type === 'speaking' ? '🎤' : '✏️'}</span>
                        <span className={`px-2 py-0.5 rounded-[4px] text-xs ${
                          assignment.assignment_type === 'speaking' 
                            ? 'bg-[rgba(0,191,255,0.1)] text-[#00bfff]' 
                            : 'bg-[rgba(191,255,0,0.1)] text-[#bfff00]'
                        }`}>
                          {assignment.assignment_type}
                        </span>
                        {getStatusBadge(assignment.status)}
                      </div>
                      <h3 className="text-white font-bold text-lg">{assignment.title}</h3>
                      <p className="text-[#888] text-sm mt-1">{assignment.course_title}</p>
                    </div>
                    {assignment.grade !== undefined && (
                      <div className="text-right">
                        <div className="text-3xl font-bold text-[#bfff00]">{assignment.grade}</div>
                        <div className="text-[#555] text-xs">/ 100</div>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-[#888] text-sm mb-4 line-clamp-2">{assignment.prompt}</p>
                  
                  <div className="flex items-center justify-between">
                    {assignment.due_date && (
                      <p className="text-[#555] text-sm">
                        Due: {new Date(assignment.due_date).toLocaleDateString()}
                      </p>
                    )}
                    
                    {assignment.status === 'pending' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAssignment(assignment);
                          setShowSubmitModal(true);
                        }}
                        className="bg-[#bfff00] text-black px-4 py-2 rounded-[8px] font-semibold"
                      >
                        Submit
                      </button>
                    )}
                    
                    {assignment.status === 'graded' && assignment.feedback && (
                      <div className="text-right">
                        <p className="text-[#888] text-xs">Feedback:</p>
                        <p className="text-white text-sm">{assignment.feedback}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]" onClick={() => setShowSubmitModal(false)}>
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 w-[700px] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-white text-[20px] font-bold mb-2">{selectedAssignment.title}</h2>
            <p className="text-[#888] text-sm mb-4">{selectedAssignment.course_title}</p>
            
            <div className="bg-[#1f1f1f] rounded-[8px] p-4 mb-6">
              <h3 className="text-[#888] text-xs uppercase mb-2">Instructions</h3>
              <p className="text-white whitespace-pre-line">{selectedAssignment.prompt}</p>
            </div>
            
            {selectedAssignment.assignment_type === 'writing' ? (
              <div className="mb-4">
                <label className="text-[#888] text-xs uppercase block mb-2">Your Response</label>
                <textarea
                  value={submission.content}
                  onChange={(e) => setSubmission({ ...submission, content: e.target.value })}
                  placeholder="Write your response here..."
                  rows={8}
                  className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] resize-none"
                />
              </div>
            ) : (
              <div className="mb-4">
                <label className="text-[#888] text-xs uppercase block mb-2">Record Your Response</label>
                <div className="bg-[#1f1f1f] rounded-[8px] p-6 text-center border border-[#2a2a2a] border-dashed">
                  <div className="text-[48px] mb-4">🎤</div>
                  <p className="text-[#888] mb-4">Click to record your audio response</p>
                  <button className="bg-red-500 text-white px-6 py-2 rounded-full flex items-center gap-2 mx-auto">
                    <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                    Recording...
                  </button>
                  <p className="text-[#555] text-xs mt-4">Maximum duration: 3 minutes</p>
                </div>
              </div>
            )}
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 bg-[#1f1f1f] text-[#888] py-3 rounded-[8px]"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={submitting || (!submission.content && !submission.audioBlob)}
                className="flex-1 bg-[#bfff00] text-black py-3 rounded-[8px] font-semibold disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
