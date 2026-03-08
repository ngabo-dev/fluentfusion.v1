import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { instructorApi } from "../app/api/config";

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
      alert('Please enter a quiz title');
      return;
    }
    setSaving(true);
    try {
      if (quizId) {
        // Update quiz - TODO: Add update quiz API
      } else if (courseId) {
        const res = await instructorApi.createQuiz(Number(courseId), {
          title: quizSettings.title,
          description: quizSettings.description,
          passing_score: quizSettings.passing_score
        });
        // Navigate to edit the newly created quiz
        navigate(`/instructor/quiz/${res.quiz_id}`);
      }
    } catch (error) {
      console.error('Failed to save quiz:', error);
      alert('Failed to save quiz');
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.question_text) {
      alert('Please enter a question');
      return;
    }
    
    if (newQuestion.question_type === 'multiple_choice') {
      const hasCorrect = newQuestion.options?.some(o => o.is_correct);
      if (!hasCorrect) {
        alert('Please select a correct answer');
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
    } catch (error) {
      console.error('Failed to add question:', error);
      alert('Failed to add question');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = (index: number) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateOption = (optIndex: number, field: string, value: any) => {
    const updatedOptions = [...(newQuestion.options || [])];
    updatedOptions[optIndex] = { ...updatedOptions[optIndex], [field]: value };
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

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
            <Link to="/instructor/dashboard" className="flex gap-[11px] items-center no-underline">
              <div className="bg-[#bfff00] flex items-center justify-center w-[38px] h-[38px] rounded-[10px]">
                <span className="text-[18px]">🧠</span>
              </div>
              <span className="text-[18px] text-white font-bold">
                FLUENT<span className="text-[#bfff00]">FUSION</span>
              </span>
            </Link>
            <div className="flex items-center gap-[12px]">
              <div className="bg-[rgba(191,255,0,0.1)] px-[13px] py-[5px] rounded-[99px]">
                <span className="text-[#bfff00] text-[11px] font-semibold">📋 Instructor</span>
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
        <div className="fixed left-0 top-[66px] w-[240px] h-[calc(100vh-66px)] bg-[#0f0f0f] border-r border-[#2a2a2a] overflow-y-auto">
          <div className="flex flex-col py-5 px-0">
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3">Instructor</div>
            
            <Link to="/instructor/dashboard" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📊</span>
              <span className="text-[14px]">Overview</span>
            </Link>
            
            <Link to="/instructor/create-course" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📚</span>
              <span className="text-[14px]">Create Course</span>
            </Link>
            
            <Link to="/instructor/students" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>👥</span>
              <span className="text-[14px]">Students</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-[240px] flex-1 p-9">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <Link to="/instructor/dashboard" className="text-[#888] hover:text-white">← Back</Link>
              </div>
              <h1 className="text-[32px] text-white font-bold">
                <span className="text-[#bfff00]">Quiz Builder</span>
              </h1>
              <p className="text-[#888] text-[14px] mt-1">
                {quizId ? 'Edit your quiz' : 'Create a new quiz'}
              </p>
            </div>
            <button 
              onClick={handleSaveQuiz}
              disabled={saving}
              className="bg-[#bfff00] text-black px-6 py-3 rounded-[8px] font-semibold disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Quiz'}
            </button>
          </div>

          {/* Quiz Settings */}
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 mb-6">
            <h2 className="text-white font-bold mb-4">Quiz Settings</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#888] text-xs uppercase block mb-2">Quiz Title *</label>
                <input
                  type="text"
                  value={quizSettings.title}
                  onChange={(e) => setQuizSettings({ ...quizSettings, title: e.target.value })}
                  placeholder="Enter quiz title..."
                  className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
                />
              </div>
              <div>
                <label className="text-[#888] text-xs uppercase block mb-2">Passing Score (%)</label>
                <input
                  type="number"
                  value={quizSettings.passing_score}
                  onChange={(e) => setQuizSettings({ ...quizSettings, passing_score: Number(e.target.value) })}
                  min={0}
                  max={100}
                  className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[#888] text-xs uppercase block mb-2">Description</label>
                <textarea
                  value={quizSettings.description}
                  onChange={(e) => setQuizSettings({ ...quizSettings, description: e.target.value })}
                  placeholder="Enter quiz description..."
                  rows={2}
                  className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] resize-none"
                />
              </div>
              <div>
                <label className="text-[#888] text-xs uppercase block mb-2">Time Limit (minutes, 0 = no limit)</label>
                <input
                  type="number"
                  value={quizSettings.time_limit_minutes}
                  onChange={(e) => setQuizSettings({ ...quizSettings, time_limit_minutes: Number(e.target.value) })}
                  min={0}
                  className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
                />
              </div>
              <div className="flex items-center gap-3 pt-8">
                <input
                  type="checkbox"
                  id="allowRetakes"
                  checked={quizSettings.allow_retakes}
                  onChange={(e) => setQuizSettings({ ...quizSettings, allow_retakes: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="allowRetakes" className="text-white text-sm">Allow students to retake quiz</label>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold">
                Questions ({questions.length})
              </h2>
              <button 
                onClick={() => setShowAddQuestion(true)}
                className="bg-[#bfff00] text-black px-4 py-2 rounded-[8px] font-semibold"
              >
                + Add Question
              </button>
            </div>

            {questions.length === 0 && !showAddQuestion && (
              <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-8 text-center">
                <div className="text-[48px] mb-4">✏️</div>
                <p className="text-[#888]">No questions yet</p>
                <p className="text-[#555] text-sm mt-2">Click "+ Add Question" to create your first question</p>
              </div>
            )}

            {questions.map((q, idx) => (
              <div key={idx} className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[#555] text-sm">Question {idx + 1}</span>
                    <span className="text-[#555] text-sm mx-2">•</span>
                    <span className="text-[#888] text-sm capitalize">{q.question_type.replace('_', ' ')}</span>
                    <span className="text-[#888] text-sm mx-2">•</span>
                    <span className="text-[#bfff00] text-sm">{q.points} points</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteQuestion(idx)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
                <h3 className="text-white font-medium mb-4">{q.question_text}</h3>
                {q.question_type === 'multiple_choice' && q.options && (
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => (
                      <div 
                        key={optIdx} 
                        className={`flex items-center gap-3 p-3 rounded-[8px] ${opt.is_correct ? 'bg-[rgba(0,255,127,0.1)] border border-[#00ff7f]' : 'bg-[#1f1f1f]'}`}
                      >
                        <span className="text-[#555]">{String.fromCharCode(65 + optIdx)}.</span>
                        <span className="text-white">{opt.text}</span>
                        {opt.is_correct && <span className="text-[#00ff7f] text-xs ml-auto">Correct</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Question Modal */}
          {showAddQuestion && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-9">
              <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 w-[700px] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <h2 className="text-white text-[20px] font-bold mb-4">Add New Question</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[#888] text-xs uppercase block mb-2">Question Type</label>
                    <select
                      title="Select question type"
                      value={newQuestion.question_type}
                      onChange={(e) => setNewQuestion({ ...newQuestion, question_type: e.target.value as any })}
                      className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
                    >
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="fill_blank">Fill in the Blank</option>
                      <option value="matching">Matching</option>
                      <option value="audio_response">Audio Response</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[#888] text-xs uppercase block mb-2">Question Text</label>
                    <textarea
                      value={newQuestion.question_text}
                      onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
                      placeholder="Enter your question..."
                      rows={3}
                      className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] resize-none"
                    />
                  </div>

                  {newQuestion.question_type === 'multiple_choice' && (
                    <div>
                      <label className="text-[#888] text-xs uppercase block mb-2">Answer Options</label>
                      <div className="space-y-2">
                        {newQuestion.options?.map((opt, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="correctAnswer"
                              checked={opt.is_correct}
                              onChange={() => {
                                const updated = newQuestion.options?.map((o, i) => ({
                                  ...o,
                                  is_correct: i === idx
                                }));
                                setNewQuestion({ ...newQuestion, options: updated });
                              }}
                              className="w-4 h-4"
                            />
                            <input
                              type="text"
                              value={opt.text}
                              onChange={(e) => updateOption(idx, 'text', e.target.value)}
                              placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                              className="flex-1 bg-[#1f1f1f] text-white rounded-[8px] px-4 py-2 outline-none border border-[#2a2a2a]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {newQuestion.question_type === 'fill_blank' && (
                    <div>
                      <label className="text-[#888] text-xs uppercase block mb-2">Correct Answer</label>
                      <input
                        type="text"
                        value={newQuestion.correct_answer}
                        onChange={(e) => setNewQuestion({ ...newQuestion, correct_answer: e.target.value })}
                        placeholder="Enter the correct answer..."
                        className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
                      />
                      <p className="text-[#555] text-xs mt-2">Use [blank] in the question text to mark where the blank should appear</p>
                    </div>
                  )}

                  <div>
                    <label className="text-[#888] text-xs uppercase block mb-2">Points</label>
                    <input
                      type="number"
                      value={newQuestion.points}
                      onChange={(e) => setNewQuestion({ ...newQuestion, points: Number(e.target.value) })}
                      min={1}
                      className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button 
                      onClick={() => setShowAddQuestion(false)}
                      className="flex-1 bg-[#1f1f1f] text-[#888] py-3 rounded-[8px]"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleAddQuestion}
                      disabled={saving || !newQuestion.question_text}
                      className="flex-1 bg-[#bfff00] text-black py-3 rounded-[8px] font-semibold disabled:opacity-50"
                    >
                      {saving ? 'Adding...' : 'Add Question'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
