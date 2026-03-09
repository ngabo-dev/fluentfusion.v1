import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { instructorApi } from "../app/api/config";
import InstructorLayout from "../app/components/InstructorLayout";
import { toast } from "sonner";

interface Question {
  id?: number;
  question_text: string;
  question_type: "multiple_choice" | "fill_blank" | "matching" | "audio_response";
  options?: { text: string; is_correct: boolean; order?: number }[];
  correct_answer?: string;
  points: number;
  order_index: number;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  passing_score: number;
  time_limit_minutes?: number;
  allow_retakes: boolean;
  questions: Question[];
}

export default function InstructorQuizBuilder() {
  const navigate = useNavigate();
  const { quizId, courseId } = useParams<{ quizId?: string; courseId?: string }>();
  const [user, setUser] = useState<any>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  const [quizSettings, setQuizSettings] = useState({
    title: "",
    description: "",
    passing_score: 70,
    time_limit_minutes: 0,
    allow_retakes: true
  });
  const [newQuestion, setNewQuestion] = useState<Question>({
    question_text: "",
    question_type: "multiple_choice",
    options: [
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false }
    ],
    correct_answer: "",
    points: 10,
    order_index: 0
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
      if (parsed.role && !['instructor', 'admin', 'super_admin'].includes(parsed.role)) {
        navigate('/dashboard');
        return;
      }
      setUser(parsed);
    } catch (e) {
      navigate('/login');
    }
    
    if (quizId) {
      fetchQuiz();
    } else {
      setLoading(false);
    }
  }, [navigate, quizId]);

  const fetchQuiz = async () => {
    if (!quizId) return;
    setLoading(true);
    try {
      const res = await instructorApi.getQuiz(Number(quizId));
      setQuiz(res.quiz);
      setQuestions(res.questions || []);
      setQuizSettings({
        title: res.quiz.title,
        description: res.quiz.description || "",
        passing_score: res.quiz.passing_score,
        time_limit_minutes: res.quiz.time_limit_minutes || 0,
        allow_retakes: res.quiz.allow_retakes
      });
    } catch (error) {
      console.error('Failed to fetch quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuiz = async () => {
    if (!quizSettings.title) {
      toast.error('Please enter a quiz title');
      return;
    }
    setSaving(true);
    try {
      if (quizId) {
        await instructorApi.updateQuiz(Number(quizId), {
          title: quizSettings.title,
          description: quizSettings.description,
          passing_score: quizSettings.passing_score,
          time_limit: quizSettings.time_limit_minutes ? quizSettings.time_limit_minutes * 60 : undefined,
          allow_retakes: quizSettings.allow_retakes,
        });
        toast.success('Quiz updated successfully');
      } else if (courseId) {
        const res = await instructorApi.createQuiz(Number(courseId), {
          title: quizSettings.title,
          description: quizSettings.description,
          passing_score: quizSettings.passing_score
        });
        toast.success('Quiz created successfully');
        navigate(`/instructor/quiz/${res.quiz_id}`);
      }
    } catch (error: any) {
      console.error('Failed to save quiz:', error);
      toast.error(error.message || 'Failed to save quiz');
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.question_text) {
      toast.error('Please enter a question');
      return;
    }
    
    if (newQuestion.question_type === 'multiple_choice') {
      const hasCorrect = newQuestion.options?.some(o => o.is_correct);
      if (!hasCorrect) {
        toast.error('Please select a correct answer');
        return;
      }
    }

    setSaving(true);
    try {
      if (quizId) {
        const res = await instructorApi.addQuizQuestion(Number(quizId), newQuestion);
        setQuestions([...questions, { ...newQuestion, id: res.question_id }]);
      } else {
        setQuestions([...questions, { ...newQuestion, order_index: questions.length }]);
      }
      
      setNewQuestion({
        question_text: "",
        question_type: "multiple_choice",
        options: [
          { text: "", is_correct: false },
          { text: "", is_correct: false },
          { text: "", is_correct: false },
          { text: "", is_correct: false }
        ],
        correct_answer: "",
        points: 10,
        order_index: questions.length + 1
      });
      setShowAddQuestion(false);
      toast.success('Question added');
    } catch (error: any) {
      console.error('Failed to add question:', error);
      toast.error(error.message || 'Failed to add question');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = (index: number) => {
    if (!window.confirm('Delete this question?')) return;
    setQuestions(questions.filter((_, i) => i !== index));
    toast.success('Question removed');
  };

  const updateOption = (optIndex: number, field: string, value: any) => {
    const updatedOptions = [...(newQuestion.options || [])];
    updatedOptions[optIndex] = { ...updatedOptions[optIndex], [field]: value };
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const headerAction = (
    <button onClick={handleSaveQuiz} disabled={saving} className="bg-[#bfff00] text-black px-5 py-2.5 rounded-lg font-semibold text-[14px] disabled:opacity-50 hover:opacity-90 transition-opacity">
      {saving ? 'Saving...' : 'Save Quiz'}
    </button>
  );

  return (
    <InstructorLayout
      title={quizId ? 'Edit Quiz' : 'Create Quiz'}
      subtitle={quizId ? `Editing quiz for course ${courseId}` : `Creating new quiz for course ${courseId}`}
      headerAction={headerAction}
    >
      {loading ? (
        <div className="text-center py-16 text-[#bfff00]">Loading quiz...</div>
      ) : (
        <>
          {/* Back link */}
          {courseId && (
            <div className="mb-5">
              <Link to={`/instructor/curriculum/${courseId}`} className="text-[#888] text-[13px] hover:text-white transition-colors no-underline">
                ← Back to Curriculum
              </Link>
            </div>
          )}

          {/* Quiz Settings */}
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6 mb-6">
            <h2 className="text-white font-semibold text-[14px] mb-4">Quiz Settings</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Quiz Title *</label>
                <input type="text" value={quizSettings.title} onChange={(e) => setQuizSettings({ ...quizSettings, title: e.target.value })} placeholder="Enter quiz title..." className="w-full bg-[#0f0f0f] text-white rounded-lg px-4 py-2.5 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors text-[13px]" />
              </div>
              <div>
                <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Passing Score (%)</label>
                <input type="number" value={quizSettings.passing_score} onChange={(e) => setQuizSettings({ ...quizSettings, passing_score: Number(e.target.value) })} min={0} max={100} className="w-full bg-[#0f0f0f] text-white rounded-lg px-4 py-2.5 outline-none border border-[#2a2a2a] text-[13px]" />
              </div>
              <div className="col-span-2">
                <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Description</label>
                <textarea value={quizSettings.description} onChange={(e) => setQuizSettings({ ...quizSettings, description: e.target.value })} placeholder="Describe what this quiz covers..." rows={2} className="w-full bg-[#0f0f0f] text-white rounded-lg px-4 py-2.5 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors resize-none text-[13px]" />
              </div>
              <div>
                <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Time Limit (minutes, 0 = no limit)</label>
                <input type="number" value={quizSettings.time_limit_minutes} onChange={(e) => setQuizSettings({ ...quizSettings, time_limit_minutes: Number(e.target.value) })} min={0} className="w-full bg-[#0f0f0f] text-white rounded-lg px-4 py-2.5 outline-none border border-[#2a2a2a] text-[13px]" />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input type="checkbox" id="allowRetakes" checked={quizSettings.allow_retakes} onChange={(e) => setQuizSettings({ ...quizSettings, allow_retakes: e.target.checked })} className="w-4 h-4 accent-[#bfff00]" />
                <label htmlFor="allowRetakes" className="text-white text-[13px]">Allow students to retake this quiz</label>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-white font-semibold">Questions ({questions.length})</h2>
            <button onClick={() => setShowAddQuestion(true)} className="bg-[#bfff00] text-black px-4 py-2 rounded-lg font-semibold text-[13px] hover:opacity-90 transition-opacity">
              + Add Question
            </button>
          </div>

          {questions.length === 0 && !showAddQuestion ? (
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-10 text-center mb-4">
              <div className="text-[40px] mb-3">✏️</div>
              <p className="text-[#888] text-[14px]">No questions yet</p>
              <p className="text-[#555] text-[12px] mt-1">Click "+ Add Question" to add your first question</p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div key={idx} className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[#555] text-[12px] font-mono bg-[#0f0f0f] px-2 py-0.5 rounded">Q{idx + 1}</span>
                      <span className="text-[#888] text-[12px] capitalize">{q.question_type.replace('_', ' ')}</span>
                      <span className="text-[#bfff00] text-[12px]">{q.points} pts</span>
                    </div>
                    <button onClick={() => handleDeleteQuestion(idx)} className="text-[#555] hover:text-red-400 text-[13px] transition-colors">Delete</button>
                  </div>
                  <p className="text-white text-[14px] font-medium mb-3">{q.question_text}</p>
                  {q.question_type === 'multiple_choice' && q.options && (
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className={`flex items-center gap-3 p-2.5 rounded-lg text-[13px] ${opt.is_correct ? 'bg-[rgba(0,255,127,0.08)] border border-[rgba(0,255,127,0.2)]' : 'bg-[#0f0f0f]'}`}>
                          <span className="text-[#555] w-5">{String.fromCharCode(65 + optIdx)}.</span>
                          <span className="text-white">{opt.text}</span>
                          {opt.is_correct && <span className="text-[#00ff7f] text-[10px] ml-auto">✓ Correct</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  {q.question_type === 'fill_blank' && (
                    <p className="text-[#888] text-[12px]">Answer: <span className="text-[#bfff00]">{q.correct_answer}</span></p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add Question Modal */}
          {showAddQuestion && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
              <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6 w-full max-w-[640px] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <h2 className="text-white text-[18px] font-bold mb-5">Add New Question</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Question Type</label>
                    <select title="Question type" value={newQuestion.question_type} onChange={(e) => setNewQuestion({ ...newQuestion, question_type: e.target.value as any })} className="w-full bg-[#0f0f0f] text-white rounded-lg px-4 py-2.5 outline-none border border-[#2a2a2a] text-[13px]">
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="fill_blank">Fill in the Blank</option>
                      <option value="matching">Matching</option>
                      <option value="audio_response">Audio Response</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Question Text *</label>
                    <textarea value={newQuestion.question_text} onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })} placeholder="Enter your question..." rows={3} className="w-full bg-[#0f0f0f] text-white rounded-lg px-4 py-2.5 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors resize-none text-[13px]" />
                  </div>
                  {newQuestion.question_type === 'multiple_choice' && (
                    <div>
                      <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Answer Options (select the correct one)</label>
                      <div className="space-y-2">
                        {newQuestion.options?.map((opt, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <input type="radio" name="correctAnswer" checked={opt.is_correct} onChange={() => { const updated = newQuestion.options?.map((o, i) => ({ ...o, is_correct: i === idx })); setNewQuestion({ ...newQuestion, options: updated }); }} className="w-4 h-4 accent-[#bfff00]" />
                            <input type="text" value={opt.text} onChange={(e) => updateOption(idx, 'text', e.target.value)} placeholder={`Option ${String.fromCharCode(65 + idx)}`} className="flex-1 bg-[#0f0f0f] text-white rounded-lg px-4 py-2 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors text-[13px]" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {newQuestion.question_type === 'fill_blank' && (
                    <div>
                      <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Correct Answer</label>
                      <input type="text" value={newQuestion.correct_answer} onChange={(e) => setNewQuestion({ ...newQuestion, correct_answer: e.target.value })} placeholder="The correct answer..." className="w-full bg-[#0f0f0f] text-white rounded-lg px-4 py-2.5 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors text-[13px]" />
                      <p className="text-[#555] text-[11px] mt-1">Use [blank] in the question text to mark where the blank appears</p>
                    </div>
                  )}
                  <div>
                    <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Points</label>
                    <input type="number" value={newQuestion.points} onChange={(e) => setNewQuestion({ ...newQuestion, points: Number(e.target.value) })} min={1} className="w-32 bg-[#0f0f0f] text-white rounded-lg px-4 py-2.5 outline-none border border-[#2a2a2a] text-[13px]" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowAddQuestion(false)} className="flex-1 bg-[#0f0f0f] text-[#888] py-2.5 rounded-lg text-[13px] hover:text-white transition-colors">Cancel</button>
                    <button onClick={handleAddQuestion} disabled={saving || !newQuestion.question_text} className="flex-1 bg-[#bfff00] text-black py-2.5 rounded-lg font-semibold text-[13px] disabled:opacity-50">
                      {saving ? 'Adding...' : 'Add Question'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </InstructorLayout>
  );
}
