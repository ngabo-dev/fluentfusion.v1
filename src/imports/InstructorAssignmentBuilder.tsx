import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { instructorApi } from "../app/api/config";
import InstructorLayout from "../app/components/InstructorLayout";

interface Assignment {
  id: number;
  title: string;
  assignment_type: "speaking" | "writing";
  prompt: string;
  rubric: string;
  due_date: string | null;
  course_id: number;
  course_title: string;
  unit_id: number | null;
  created_at: string;
}

interface Submission {
  id: number;
  student_name: string;
  student_email: string;
  content: string;
  audio_url?: string;
  submitted_at: string;
  grade: number | null;
  feedback: string | null;
  graded_at: string | null;
}

export default function InstructorAssignmentBuilder() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId?: string }>();
  const [user, setUser] = useState<any>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [gradingMode, setGradingMode] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    assignment_type: "writing" as "speaking" | "writing",
    prompt: "",
    rubric: "",
    due_date: ""
  });
  const [gradeData, setGradeData] = useState({ grade: 0, feedback: "" });

  useEffect(() => {
    const token = localStorage.getItem('ff_access_token');
    const userData = localStorage.getItem('ff_user');
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      if (parsed.role && !['instructor', 'admin'].includes(parsed.role)) {
        navigate('/dashboard');
        return;
      }
      setUser(parsed);
    } catch (e) {
      navigate('/login');
    }
    fetchData();
  }, [navigate, courseId]);

  // Load submissions when an assignment is selected
  useEffect(() => {
    if (selectedAssignment) {
      instructorApi.getAssignmentSubmissions(selectedAssignment.id)
        .then(res => setSubmissions(res.submissions || []))
        .catch(err => console.error('Failed to load submissions:', err));
    } else {
      setSubmissions([]);
    }
  }, [selectedAssignment]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const assignmentsRes = await instructorApi.getAssignments(courseId ? parseInt(courseId) : undefined);
      setAssignments(assignmentsRes.assignments || []);
      // If a specific assignment is selected, load its submissions
      if (selectedAssignment) {
        const subsRes = await instructorApi.getAssignmentSubmissions(selectedAssignment.id);
        setSubmissions(subsRes.submissions || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async () => {
    if (!newAssignment.title || !newAssignment.prompt || !courseId) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      await instructorApi.createAssignment(parseInt(courseId), {
        title: newAssignment.title,
        assignment_type: newAssignment.assignment_type,
        prompt: newAssignment.prompt,
        rubric: newAssignment.rubric || undefined,
        due_date: newAssignment.due_date || undefined,
      });
      toast.success('Assignment created successfully');
      setShowCreateModal(false);
      setNewAssignment({
        title: "",
        assignment_type: "writing",
        prompt: "",
        rubric: "",
        due_date: ""
      });
      fetchData();
    } catch (error: any) {
      console.error('Failed to create assignment:', error);
      toast.error(error.message || 'Failed to create assignment');
    } finally {
      setSaving(false);
    }
  };

  const handleGrade = async (submissionId: number) => {
    if (!selectedAssignment) return;
    try {
      await instructorApi.gradeSubmission(selectedAssignment.id, submissionId, {
        grade: gradeData.grade,
        feedback: gradeData.feedback || undefined,
      });
      toast.success('Submission graded successfully');
      setGradingMode(false);
      setGradeData({ grade: 0, feedback: "" });
      // Reload submissions
      const subsRes = await instructorApi.getAssignmentSubmissions(selectedAssignment.id);
      setSubmissions(subsRes.submissions || []);
    } catch (error: any) {
      console.error('Failed to grade:', error);
      toast.error(error.message || 'Failed to submit grade');
    }
  };

  const pendingGrading = submissions.filter(s => s.grade === null).length;

  const handleDeleteAssignment = async (assignmentId: number) => {
    if (!window.confirm('Delete this assignment? This cannot be undone.')) return;
    try {
      await instructorApi.deleteAssignment(assignmentId);
      toast.success('Assignment deleted');
      if (selectedAssignment?.id === assignmentId) {
        setSelectedAssignment(null);
        setSubmissions([]);
      }
      setAssignments(prev => prev.filter(a => a.id !== assignmentId));
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete assignment');
    }
  };

  if (loading) {
    return (
      <InstructorLayout title="Assignments &amp; Grading">
        <div className="flex items-center justify-center h-64">
          <div className="text-[#bfff00]">Loading...</div>
        </div>
      </InstructorLayout>
    );
  }

  return (
    <InstructorLayout
      title="Assignments & Grading"
      subtitle="Create assignments and grade student submissions"
      headerAction={
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#bfff00] text-black px-6 py-3 rounded-[8px] font-semibold"
        >
          + Create Assignment
        </button>
      }
    >
      <div>
          <div className="grid grid-cols-3 gap-6">
            {/* Assignments List */}
            <div className="col-span-1">
              <h2 className="text-white font-bold mb-4">Your Assignments</h2>
              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <div 
                    key={assignment.id}
                    onClick={() => setSelectedAssignment(assignment)}
                    className={`p-4 bg-[#151515] border rounded-[14px] cursor-pointer hover:border-[#bfff00] transition-colors ${
                      selectedAssignment?.id === assignment.id ? 'border-[#bfff00]' : 'border-[#2a2a2a]'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{assignment.assignment_type === 'speaking' ? '🎤' : '✏️'}</span>
                        <span className={`px-2 py-0.5 rounded-[4px] text-xs ${
                          assignment.assignment_type === 'speaking' 
                            ? 'bg-[rgba(0,191,255,0.1)] text-[#00bfff]' 
                            : 'bg-[rgba(191,255,0,0.1)] text-[#bfff00]'
                        }`}>
                          {assignment.assignment_type}
                        </span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteAssignment(assignment.id); }}
                        className="text-[#555] hover:text-red-400 text-[11px] transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                    <h3 className="text-white font-medium">{assignment.title}</h3>
                    <p className="text-[#555] text-sm mt-1">{assignment.course_title}</p>
                    {assignment.due_date && (
                      <p className="text-[#888] text-xs mt-2">Due: {new Date(assignment.due_date).toLocaleDateString()}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submissions Panel */}
            <div className="col-span-2">
              {selectedAssignment ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white font-bold">
                      Submissions ({submissions.length})
                    </h2>
                    {pendingGrading > 0 && (
                      <span className="px-3 py-1 rounded-[99px] text-xs bg-orange-500/10 text-orange-400">
                        {pendingGrading} pending grading
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <div 
                        key={submission.id}
                        className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-white font-medium">{submission.student_name}</h3>
                            <p className="text-[#555] text-sm">{submission.student_email}</p>
                            <p className="text-[#888] text-xs mt-1">
                              Submitted: {new Date(submission.submitted_at).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            {submission.grade !== null ? (
                              <div className="text-right">
                                <div className="text-2xl font-bold text-[#bfff00]">{submission.grade}</div>
                                <div className="text-[#555] text-xs">/ 100</div>
                              </div>
                            ) : (
                              <span className="px-3 py-1 rounded-[99px] text-xs bg-orange-500/10 text-orange-400">
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {submission.audio_url && (
                          <div className="mb-4">
                            <audio controls className="w-full">
                              <source src={submission.audio_url} type="audio/mpeg" />
                            </audio>
                          </div>
                        )}
                        
                        <div className="bg-[#1f1f1f] rounded-[8px] p-4 mb-4">
                          <p className="text-white text-sm">{submission.content}</p>
                        </div>
                        
                        {submission.graded_at ? (
                          <div className="bg-[rgba(0,255,127,0.05)] border border-[#00ff7f]/20 rounded-[8px] p-4">
                            <p className="text-[#00ff7f] text-xs font-bold mb-1">Feedback</p>
                            <p className="text-[#888] text-sm">{submission.feedback}</p>
                          </div>
                        ) : (
                          <button
                            onClick={() => setGradingMode(true)}
                            className="w-full bg-[#bfff00] text-black py-2 rounded-[8px] font-semibold"
                          >
                            Grade Submission
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-8 text-center">
                  <div className="text-[48px] mb-4">📝</div>
                  <p className="text-[#888]">Select an assignment to view submissions</p>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]" onClick={() => setShowCreateModal(false)}>
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 w-[600px]" onClick={e => e.stopPropagation()}>
            <h2 className="text-white text-[20px] font-bold mb-4">Create New Assignment</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-[#888] text-xs uppercase block mb-2">Assignment Title *</label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  placeholder="e.g., Introduction Speech"
                  className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
                />
              </div>
              
              <div>
                <label className="text-[#888] text-xs uppercase block mb-2">Assignment Type</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setNewAssignment({ ...newAssignment, assignment_type: 'writing' })}
                    className={`flex-1 py-3 rounded-[8px] border ${
                      newAssignment.assignment_type === 'writing'
                        ? 'bg-[#bfff00] text-black border-[#bfff00]'
                        : 'bg-[#1f1f1f] text-[#888] border-[#2a2a2a]'
                    }`}
                  >
                    ✏️ Writing
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAssignment({ ...newAssignment, assignment_type: 'speaking' })}
                    className={`flex-1 py-3 rounded-[8px] border ${
                      newAssignment.assignment_type === 'speaking'
                        ? 'bg-[#00bfff] text-black border-[#00bfff]'
                        : 'bg-[#1f1f1f] text-[#888] border-[#2a2a2a]'
                    }`}
                  >
                    🎤 Speaking
                  </button>
                </div>
              </div>
              
              <div>
                <label className="text-[#888] text-xs uppercase block mb-2">Prompt/Instructions *</label>
                <textarea
                  value={newAssignment.prompt}
                  onChange={(e) => setNewAssignment({ ...newAssignment, prompt: e.target.value })}
                  placeholder="Describe what students should do..."
                  rows={4}
                  className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] resize-none"
                />
              </div>
              
              <div>
                <label className="text-[#888] text-xs uppercase block mb-2">Grading Rubric</label>
                <textarea
                  value={newAssignment.rubric}
                  onChange={(e) => setNewAssignment({ ...newAssignment, rubric: e.target.value })}
                  placeholder="Describe how to grade (e.g., 1. Content 25pts, 2. Grammar 25pts...)"
                  rows={4}
                  className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] resize-none"
                />
              </div>
              
              <div>
                <label className="text-[#888] text-xs uppercase block mb-2">Due Date</label>
                <input
                  type="datetime-local"
                  value={newAssignment.due_date}
                  onChange={(e) => setNewAssignment({ ...newAssignment, due_date: e.target.value })}
                  className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-[#1f1f1f] text-[#888] py-3 rounded-[8px]"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateAssignment}
                  disabled={saving || !newAssignment.title || !newAssignment.prompt}
                  className="flex-1 bg-[#bfff00] text-black py-3 rounded-[8px] font-semibold disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Create Assignment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grading Modal */}
      {gradingMode && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]" onClick={() => setGradingMode(false)}>
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 w-[500px]" onClick={e => e.stopPropagation()}>
            <h2 className="text-white text-[20px] font-bold mb-4">Grade Submission</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-[#888] text-xs uppercase block mb-2">Score (0-100)</label>
                <input
                  type="number"
                  value={gradeData.grade}
                  onChange={(e) => setGradeData({ ...gradeData, grade: Number(e.target.value) })}
                  min={0}
                  max={100}
                  className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
                />
              </div>
              
              <div>
                <label className="text-[#888] text-xs uppercase block mb-2">Feedback</label>
                <textarea
                  value={gradeData.feedback}
                  onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                  placeholder="Provide feedback to the student..."
                  rows={4}
                  className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] resize-none"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setGradingMode(false)}
                  className="flex-1 bg-[#1f1f1f] text-[#888] py-3 rounded-[8px]"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleGrade(1)}
                  disabled={gradeData.grade < 0 || gradeData.grade > 100}
                  className="flex-1 bg-[#bfff00] text-black py-3 rounded-[8px] font-semibold disabled:opacity-50"
                >
                  Submit Grade
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </InstructorLayout>
  );
}
