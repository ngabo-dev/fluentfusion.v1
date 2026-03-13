import { useState } from 'react';
import { toast } from 'sonner';
import StudentLayout from '../app/components/StudentLayout';
import { API_BASE_URL } from '../app/api/config';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: string;
}

const DEMO_QUESTIONS: Question[] = [
  { id: 1, question: "_____ is your name?", options: ["Who", "What", "Where", "Which"], correct_answer: "What" },
  { id: 2, question: "I _____ to school every day.", options: ["go", "goes", "going", "went"], correct_answer: "go" },
  { id: 3, question: "She _____ been working here for five years.", options: ["has", "have", "had", "is"], correct_answer: "has" },
  { id: 4, question: "If I _____ rich, I would travel the world.", options: ["am", "were", "will be", "have been"], correct_answer: "were" },
  { id: 5, question: "The report _____ by the manager yesterday.", options: ["was written", "wrote", "has written", "is written"], correct_answer: "was written" },
  { id: 6, question: "Choose the correct word: The movie was _____ boring.", options: ["absolutely", "utterly", "very", "completely"], correct_answer: "very" },
  { id: 7, question: "_____ you mind closing the window?", options: ["Will", "Would", "Can", "Could"], correct_answer: "Would" },
  { id: 8, question: "I wish I _____ more time to study.", options: ["had", "have", "will have", "having"], correct_answer: "had" },
  { id: 9, question: "The problem _____ to be more complex than expected.", options: ["proved", "has proved", "proving", "was proved"], correct_answer: "proved" },
  { id: 10, question: "Not only _____ he pass the exam, but he got the highest score.", options: ["did", "has", "was", "had"], correct_answer: "did" },
  { id: 11, question: "Barely _____ the train left when she arrived at the station.", options: ["had", "has", "did", "was"], correct_answer: "had" },
  { id: 12, question: "She speaks French fluently, _____ she?", options: ["doesn't", "does", "isn't", "is"], correct_answer: "doesn't" },
  { id: 13, question: "The new policy _____ a lot of controversy.", options: ["generated", "has generated", "is generating", "generates"], correct_answer: "generated" },
  { id: 14, question: "Choose the correct sentence:", options: ["He suggested to go there.", "He suggested going there.", "He suggested that go there.", "He suggested went there."], correct_answer: "He suggested going there." },
  { id: 15, question: "The CEO, _____ made the announcement, later resigned.", options: ["who", "which", "that", "whom"], correct_answer: "who" },
  { id: 16, question: "_____ the weather was bad, we went for a walk.", options: ["Despite", "Although", "However", "Nevertheless"], correct_answer: "Although" },
  { id: 17, question: "I would have called you _____ I had your number.", options: ["if", "unless", "when", "as long as"], correct_answer: "if" },
  { id: 18, question: "The negotiations _____ three days before an agreement was reached.", options: ["lasted", "had lasted", "were lasting", "last"], correct_answer: "lasted" },
  { id: 19, question: "She is widely regarded _____ the best linguist of her generation.", options: ["as", "like", "for", "by"], correct_answer: "as" },
  { id: 20, question: "The concept of _____ free will has been debated by philosophers for centuries.", options: ["a", "an", "the", "(no article)"], correct_answer: "(no article)" },
];

const CEFR_COLORS: Record<string, string> = {
  A1: '#888',
  A2: '#aaa',
  B1: '#4da6ff',
  B2: '#7c5cfc',
  C1: '#f5a623',
  C2: '#bfff00',
};

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('ff_access_token');
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw Object.assign(new Error(err.detail || `HTTP ${res.status}`), { status: res.status });
  }
  return res.json();
}

type Stage = 'landing' | 'quiz' | 'results';

export default function PlacementTest() {
  const [stage, setStage] = useState<Stage>('landing');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [loadingStart, setLoadingStart] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ level: string; score: number; description: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const handleStart = async () => {
    setLoadingStart(true);
    try {
      const data = await apiFetch<{ questions: Question[] }>('/practice/placement-test');
      setQuestions(data.questions || DEMO_QUESTIONS);
    } catch (err: any) {
      if (err.status === 404) {
        setQuestions(DEMO_QUESTIONS);
      } else {
        toast.error('Could not load questions, using demo set');
        setQuestions(DEMO_QUESTIONS);
      }
    } finally {
      setLoadingStart(false);
      setCurrentIndex(0);
      setAnswers({});
      setSelectedOption('');
      setStage('quiz');
    }
  };

  const handleNext = () => {
    if (!selectedOption) return;
    const q = questions[currentIndex];
    const updated = { ...answers, [q.id]: selectedOption };
    setAnswers(updated);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption('');
    } else {
      // Submit
      handleSubmit(updated);
    }
  };

  const handleSubmit = async (finalAnswers: Record<number, string>) => {
    setSubmitting(true);
    const payload = Object.entries(finalAnswers).map(([qid, answer]) => ({
      question_id: Number(qid),
      answer,
    }));
    try {
      const data = await apiFetch<{ level: string; score: number; description: string }>(
        '/practice/placement-test/submit',
        { method: 'POST', body: JSON.stringify({ answers: payload }) }
      );
      setResult(data);
    } catch {
      // Compute score locally as fallback
      let correct = 0;
      questions.forEach(q => {
        if (finalAnswers[q.id] === q.correct_answer) correct++;
      });
      const score = Math.round((correct / questions.length) * 100);
      let level = 'A1';
      if (score >= 90) level = 'C2';
      else if (score >= 75) level = 'C1';
      else if (score >= 60) level = 'B2';
      else if (score >= 45) level = 'B1';
      else if (score >= 30) level = 'A2';

      const descriptions: Record<string, string> = {
        A1: 'Beginner', A2: 'Elementary', B1: 'Intermediate',
        B2: 'Upper Intermediate', C1: 'Advanced', C2: 'Proficient',
      };
      setResult({ level, score, description: descriptions[level] });
    } finally {
      setSubmitting(false);
      setStage('results');
    }
  };

  const handleSaveToProfile = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await apiFetch('/users/me/cefr-level', {
        method: 'PUT',
        body: JSON.stringify({ level: result.level }),
      });
      toast.success('CEFR level saved to your profile!');
    } catch {
      toast.error('Could not save level. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleRetake = () => {
    setStage('landing');
    setResult(null);
    setQuestions([]);
    setAnswers({});
    setSelectedOption('');
    setCurrentIndex(0);
  };

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex) / questions.length) * 100 : 0;

  return (
    <StudentLayout title="Placement Test" subtitle="Discover your language level">
      {/* Landing */}
      {stage === 'landing' && (
        <div className="flex flex-col items-center justify-center py-16 text-center max-w-lg mx-auto">
          <div className="w-20 h-20 bg-[rgba(191,255,0,0.1)] rounded-full flex items-center justify-center text-4xl mb-6">
            🎯
          </div>
          <h2 className="text-white text-3xl font-bold mb-3">Find Your Level</h2>
          <p className="text-[#888] text-sm leading-relaxed mb-2">
            Take our 20-question CEFR placement test to discover your current language proficiency level.
            The test covers grammar, vocabulary, and language use across all CEFR levels (A1–C2).
          </p>
          <p className="text-[#555] text-xs mb-8">Takes approximately 10–15 minutes</p>
          <button
            onClick={handleStart}
            disabled={loadingStart}
            className="bg-[#bfff00] text-black px-8 py-3 rounded-xl font-semibold text-base hover:bg-[#d4ff33] transition-colors cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingStart ? 'Loading...' : 'Start Test'}
          </button>
        </div>
      )}

      {/* Quiz */}
      {stage === 'quiz' && currentQuestion && !submitting && (
        <div className="max-w-xl mx-auto">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-[#888] mb-2">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-[#1e1e1e] rounded-full h-2">
              <div
                className="bg-[#bfff00] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question card */}
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6 mb-4">
            <p className="text-white text-lg font-medium leading-relaxed mb-6">{currentQuestion.question}</p>

            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((option, idx) => (
                <label
                  key={idx}
                  className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                    selectedOption === option
                      ? 'border-[#bfff00] bg-[rgba(191,255,0,0.08)]'
                      : 'border-[#2a2a2a] hover:border-[#3a3a3a] bg-[#0f0f0f]'
                  }`}
                >
                  <input
                    type="radio"
                    name="option"
                    value={option}
                    checked={selectedOption === option}
                    onChange={() => setSelectedOption(option)}
                    className="accent-[#bfff00]"
                  />
                  <span className={`text-sm ${selectedOption === option ? 'text-white' : 'text-[#aaa]'}`}>
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={!selectedOption}
            className="w-full bg-[#bfff00] text-black py-3 rounded-xl font-semibold text-sm hover:bg-[#d4ff33] transition-colors cursor-pointer border-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {currentIndex < questions.length - 1 ? 'Next Question' : 'Submit Test'}
          </button>
        </div>
      )}

      {/* Submitting spinner */}
      {submitting && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p className="text-white text-lg font-semibold">Evaluating your answers...</p>
          <p className="text-[#555] text-sm mt-2">This will just take a moment</p>
        </div>
      )}

      {/* Results */}
      {stage === 'results' && result && (
        <div className="flex flex-col items-center justify-center py-10 text-center max-w-md mx-auto">
          <div className="text-5xl mb-6">🏆</div>
          <h2 className="text-white text-2xl font-bold mb-2">Your Result</h2>
          <p className="text-[#888] text-sm mb-8">Based on your answers, your CEFR level is:</p>

          {/* Level badge */}
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-extrabold mb-4 border-4"
            style={{
              color: CEFR_COLORS[result.level] || '#bfff00',
              borderColor: CEFR_COLORS[result.level] || '#bfff00',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            {result.level}
          </div>

          <p className="text-white text-xl font-semibold mb-1">{result.description}</p>
          <p className="text-[#888] text-sm mb-8">Score: {result.score}%</p>

          <div className="flex gap-3 w-full">
            <button
              onClick={handleRetake}
              className="flex-1 bg-[#1e1e1e] text-[#888] hover:text-white py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer border-none"
            >
              Retake Test
            </button>
            <button
              onClick={handleSaveToProfile}
              disabled={saving}
              className="flex-1 bg-[#bfff00] text-black py-3 rounded-xl text-sm font-semibold hover:bg-[#d4ff33] transition-colors cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save to Profile'}
            </button>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
