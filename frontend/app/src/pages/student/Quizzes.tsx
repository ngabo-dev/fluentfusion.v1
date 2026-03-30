import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import { BookOpen, CheckCircle2, Flame, Trophy } from 'lucide-react'

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState<any>(null)
  const [score, setScore] = useState<number | null>(null)
  useEffect(() => {
    api.get('/api/student/quizzes')
      .then(r => setQuizzes(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function startQuiz(q: any) { setActive(q); setScore(null) }
  function submitQuiz() {
    const s = Math.floor(Math.random() * 30) + 65
    setScore(s)
  }

  if (!active && loading) return <div className="pgload" />

  if (active) return (
    <div className="pg">
      <div className="ph">
        <div><h1>{active.title}</h1><p>{active.course} · {active.question_count} questions</p></div>
        <button className="btn bo sm" onClick={() => setActive(null)}>← Back</button>
      </div>
      {score !== null ? (
        <div style={{ maxWidth: 480, margin: '40px auto', textAlign: 'center' }}>
          <div className="card">
            <div style={{ fontSize: 64, marginBottom: 16 }}>{score >= 80 ? <Trophy size={16} /> : score >= 60 ? '<CheckCircle2 size={16} />' : <BookOpen size={16} />}</div>
            <div style={{ fontFamily: 'Syne', fontSize: 32, fontWeight: 800, color: score >= 80 ? 'var(--ok)' : score >= 60 ? 'var(--neon)' : 'var(--wa)', marginBottom: 8 }}>{score}%</div>
            <div style={{ fontSize: 14, color: 'var(--mu)', marginBottom: 24 }}>
              {score >= 80 ? 'Excellent work! <Flame size={16} />' : score >= 60 ? 'Good job! Keep going.' : 'Keep practicing — you\'ll get there!'}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button className="btn bp" onClick={() => setScore(null)}>Retry Quiz</button>
              <button className="btn bo" onClick={() => setActive(null)}>Back to Quizzes</button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          {Array.from({ length: Math.min(active.question_count, 5) }, (_, i) => (
            <div key={i} className="card" style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--mu)', marginBottom: 8 }}>QUESTION {i + 1}</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Sample question {i + 1} for {active.course}?</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {['Option A', 'Option B', 'Option C', 'Option D'].map(opt => (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 12px', background: 'var(--card2)', borderRadius: 'var(--r)', border: '1px solid var(--bdr)', cursor: 'pointer', fontSize: 12 }}>
                    <input type="radio" name={`q${i}`} style={{ accentColor: 'var(--neon)' }} /> {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button className="btn bp" style={{ width: '100%', marginTop: 8 }} onClick={submitQuiz}>Submit Quiz</button>
        </div>
      )}
    </div>
  )

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Quizzes</h1><p>Test your knowledge and track your scores</p></div>
      </div>
      {quizzes.length === 0 && <div style={{ color: 'var(--mu)', textAlign: 'center', padding: 40, fontFamily: 'JetBrains Mono', fontSize: 11 }}>No quizzes available</div>}
      <div className="g3">
        {quizzes.map(q => (
          <div key={q.id} className="card" style={{ cursor: 'pointer' }} onClick={() => startQuiz(q)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 40, height: 40, background: 'rgba(191,255,0,.08)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{q.flag_emoji}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{q.title}</div>
                <div style={{ fontSize: 10, color: 'var(--mu)' }}>{q.course}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14, textAlign: 'center' }}>
              <div><div style={{ fontFamily: 'Syne', fontSize: 18, fontWeight: 800, color: 'var(--neon)' }}>{q.question_count}</div><div style={{ fontSize: 8, color: 'var(--mu)' }}>QUESTIONS</div></div>
              <div><div style={{ fontFamily: 'Syne', fontSize: 18, fontWeight: 800, color: 'var(--wa)' }}>{q.avg_score?.toFixed(0)}%</div><div style={{ fontSize: 8, color: 'var(--mu)' }}>AVG SCORE</div></div>
              <div><div style={{ fontFamily: 'Syne', fontSize: 18, fontWeight: 800, color: 'var(--in)' }}>{q.attempts}</div><div style={{ fontSize: 8, color: 'var(--mu)' }}>ATTEMPTS</div></div>
            </div>
            <button className="btn bp" style={{ width: '100%' }}>Start Quiz →</button>
          </div>
        ))}
      </div>
    </div>
  )
}
