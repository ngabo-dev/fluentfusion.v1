import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import { Eye, Pencil, Search, Trash2 } from 'lucide-react'

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    api.get('/api/instructor/quizzes')
      .then(r => setQuizzes(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="pgload" />

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Quizzes & Assessments</h1><p>Manage assessments for all your courses</p></div>
        <div className="pa"><button className="btn bp">+ Create Quiz</button></div>
      </div>
      <div className="ab">
        <div className="sw"><span className="si2"><Search size={16} /></span><input className="inp" placeholder="Search quizzes..." /></div>
        <select className="sel" style={{ width: 'auto' }}><option>All Courses</option></select>
      </div>
      <div className="g3">
        {quizzes.map(q => (
          <div key={q.id} className="card">
            <div className="ch"><span className="ch-t" style={{ fontSize: 11 }}>{q.title}</span></div>
            <span className="bdg bi" style={{ marginBottom: 9, display: 'inline-flex' }}>{q.course}</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 12 }}>
              <div style={{ textAlign: 'center' }}><div style={{ fontFamily: 'Syne', fontSize: 17, fontWeight: 800, color: 'var(--neon)' }}>{q.question_count}</div><div style={{ fontSize: 8, color: 'var(--mu)' }}>QUESTIONS</div></div>
              <div style={{ textAlign: 'center' }}><div style={{ fontFamily: 'Syne', fontSize: 17, fontWeight: 800, color: q.avg_score >= 80 ? 'var(--ok)' : 'var(--wa)' }}>{q.avg_score}%</div><div style={{ fontSize: 8, color: 'var(--mu)' }}>AVG SCORE</div></div>
              <div style={{ textAlign: 'center' }}><div style={{ fontFamily: 'Syne', fontSize: 17, fontWeight: 800, color: 'var(--in)' }}>{q.attempts}</div><div style={{ fontSize: 8, color: 'var(--mu)' }}>ATTEMPTS</div></div>
            </div>
            <div className="pt" style={{ marginBottom: 10 }}><div className="pf" style={{ width: `${q.avg_score}%` }} /></div>
            <div style={{ display: 'flex', gap: 5 }}>
              <button className="btn bo sm"><Pencil size={16} />️ Edit</button>
              <button className="btn bg sm"><Eye size={16} /></button>
              <button className="btn bd sm"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
