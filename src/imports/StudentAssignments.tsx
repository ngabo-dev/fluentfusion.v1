import { useState, useEffect } from "react";
import { toast } from "sonner";
import { studentApi } from "../app/api/config";
import StudentLayout from "../app/components/StudentLayout";

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
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState({
    content: "",
    audioBlob: null as File | null,
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await studentApi.getAssignments();
      setAssignments(res.assignments || []);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAssignment || (!submission.content && !submission.audioBlob)) {
      toast.error("Please provide your submission");
      return;
    }
    setSubmitting(true);
    try {
      await studentApi.submitAssignment(selectedAssignment.id, {
        content: submission.content || undefined,
      });
      setShowSubmitModal(false);
      setSubmission({ content: "", audioBlob: null });
      toast.success("Assignment submitted successfully!");
      fetchAssignments();
    } catch (error: any) {
      console.error("Failed to submit:", error);
      toast.error(error.message || "Failed to submit assignment");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1 rounded-[99px] text-xs bg-orange-500/10 text-orange-400">
            Pending
          </span>
        );
      case "submitted":
        return (
          <span className="px-3 py-1 rounded-[99px] text-xs bg-blue-500/10 text-blue-400">
            Submitted
          </span>
        );
      case "graded":
        return (
          <span className="px-3 py-1 rounded-[99px] text-xs bg-[rgba(0,255,127,0.1)] text-[#00ff7f]">
            Graded
          </span>
        );
      default:
        return null;
    }
  };

  const pendingCount = assignments.filter((a) => a.status === "pending").length;

  return (
    <StudentLayout title="Assignments" subtitle="Complete your assignments and view your grades">
      {/* Pending alert */}
      {pendingCount > 0 && (
        <div className="mb-6 bg-[rgba(255,165,0,0.08)] border border-[rgba(255,165,0,0.3)] rounded-xl p-4 flex items-center gap-3">
          <span className="text-[20px]">⏰</span>
          <p className="text-orange-300 text-[13px] font-semibold">
            {pendingCount} assignment{pendingCount > 1 ? "s" : ""} pending submission
          </p>
        </div>
      )}

      {loading ? (
        <div className="text-[#888] text-center py-12">Loading assignments...</div>
      ) : assignments.length === 0 ? (
        <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-12 text-center">
          <div className="text-[48px] mb-4">📝</div>
          <p className="text-[#888]">No assignments yet</p>
          <p className="text-[#555] text-sm mt-2">Enroll in a course to see assignments here</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#3a3a3a] transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xl">
                      {assignment.assignment_type === "speaking" ? "🎤" : "✏️"}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        assignment.assignment_type === "speaking"
                          ? "bg-[rgba(0,191,255,0.1)] text-[#00bfff]"
                          : "bg-[rgba(191,255,0,0.1)] text-[#bfff00]"
                      }`}
                    >
                      {assignment.assignment_type}
                    </span>
                    {getStatusBadge(assignment.status)}
                  </div>
                  <h3 className="text-white font-bold text-[16px]">{assignment.title}</h3>
                  <p className="text-[#888] text-[13px] mt-1">{assignment.course_title}</p>
                </div>
                {assignment.grade !== undefined && assignment.grade !== null && (
                  <div className="text-right">
                    <div className="text-[30px] font-bold text-[#bfff00]">{assignment.grade}</div>
                    <div className="text-[#555] text-[11px]">/ 100</div>
                  </div>
                )}
              </div>

              <p className="text-[#888] text-[13px] mb-4 line-clamp-2">{assignment.prompt}</p>

              <div className="flex items-center justify-between">
                {assignment.due_date && (
                  <p className="text-[#555] text-[12px]">
                    Due: {new Date(assignment.due_date).toLocaleDateString()}
                  </p>
                )}
                {assignment.status === "pending" && (
                  <button
                    onClick={() => {
                      setSelectedAssignment(assignment);
                      setShowSubmitModal(true);
                    }}
                    className="bg-[#bfff00] text-black px-5 py-2 rounded-lg font-semibold text-[13px] hover:opacity-90 transition-opacity"
                  >
                    Submit
                  </button>
                )}
                {assignment.status === "graded" && assignment.feedback && (
                  <p className="text-[#888] text-[12px] italic">"{assignment.feedback}"</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Modal */}
      {showSubmitModal && selectedAssignment && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200]"
          onClick={() => setShowSubmitModal(false)}
        >
          <div
            className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6 w-[680px] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-white text-[20px] font-bold mb-1">{selectedAssignment.title}</h2>
            <p className="text-[#888] text-[13px] mb-5">{selectedAssignment.course_title}</p>

            <div className="bg-[#0f0f0f] rounded-xl p-4 mb-6 border border-[#2a2a2a]">
              <h3 className="text-[#555] text-[10px] uppercase tracking-widest mb-2">Instructions</h3>
              <p className="text-white text-[13px] whitespace-pre-line">{selectedAssignment.prompt}</p>
            </div>

            {selectedAssignment.assignment_type === "writing" ? (
              <div className="mb-5">
                <label className="text-[#555] text-[10px] uppercase tracking-widest block mb-2">
                  Your Response
                </label>
                <textarea
                  value={submission.content}
                  onChange={(e) => setSubmission({ ...submission, content: e.target.value })}
                  placeholder="Write your response here..."
                  rows={8}
                  className="w-full bg-[#0f0f0f] text-white rounded-xl px-4 py-3 outline-none border border-[#2a2a2a] focus:border-[#bfff00] resize-none transition-colors text-[13px]"
                />
              </div>
            ) : (
              <div className="mb-5">
                <label className="text-[#555] text-[10px] uppercase tracking-widest block mb-2">
                  Audio Response
                </label>
                <div className="bg-[#0f0f0f] rounded-xl p-6 text-center border border-[#2a2a2a] border-dashed">
                  <div className="text-[48px] mb-3">🎤</div>
                  <p className="text-[#888] text-[13px] mb-3">
                    Record your speaking response
                  </p>
                  <textarea
                    value={submission.content}
                    onChange={(e) => setSubmission({ ...submission, content: e.target.value })}
                    placeholder="Or type your spoken response as text..."
                    rows={4}
                    className="w-full bg-[#151515] text-white rounded-xl px-4 py-3 outline-none border border-[#2a2a2a] focus:border-[#bfff00] resize-none transition-colors text-[13px]"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 bg-[#0f0f0f] text-[#888] py-3 rounded-xl border border-[#2a2a2a] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || (!submission.content && !submission.audioBlob)}
                className="flex-1 bg-[#bfff00] text-black py-3 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                {submitting ? "Submitting..." : "Submit Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
