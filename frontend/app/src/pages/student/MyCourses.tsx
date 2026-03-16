import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/client'

export default function MyCourses() {
  const [courses, setCourses] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const nav = useNavigate()
  useEffect(() => { api.get('/api/student/courses').then(r => setCourses(r.data)) }, [])

  const filtered = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.language?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>My Courses</h1><p>Track your learning progress across all enrolled courses</p></div>
      </div>
      <div className="ab">
        <div className="sw"><span className="si2">🔍</span><input className="inp" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <select className="sel" style={{ width: 'auto' }}>
          <option>All Courses</option><option>In Progress</option><option>Completed</option>
        </select>
      </div>
      {filtered.length === 0 && <div style={{ color: 'var(--mu)', textAlign: 'center', padding: 40, fontFamily: 'JetBrains Mono', fontSize: 11 }}>No courses found</div>}
      <div className="g3">
        {filtered.map(c => (
          <div key={c.id} className="card" style={{ padding: 0, cursor: 'pointer' }} onClick={() => nav('/dashboard/lessons', { state: { courseId: c.id, courseTitle: c.title } })}>
            <div style={{ height: 110, background: 'linear-gradient(135deg,#1a2a0a,#0f1f05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, position: 'relative', borderRadius: '14px 14px 0 0' }}>
              {c.flag_emoji}
              <div style={{ position: 'absolute', top: 8, right: 8 }}>
                <span className={`bdg ${c.completion >= 100 ? 'bk' : c.completion > 0 ? 'bn' : 'bm'}`}>
                  {c.completion >= 100 ? '✓ Done' : c.completion > 0 ? 'In Progress' : 'Not Started'}
                </span>
              </div>
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{c.title}</div>
              <div style={{ fontSize: 10, color: 'var(--mu)', marginBottom: 8 }}>{c.level} · {c.lesson_count} lessons · {c.language}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <div className="av avs">{c.instructor_initials}</div>
                <span style={{ fontSize: 11, color: 'var(--mu)' }}>{c.instructor}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 10, color: 'var(--mu)' }}>Progress</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--neon)' }}>{c.completion}%</span>
              </div>
              <div className="pt" style={{ marginBottom: 12 }}><div className="pf" style={{ width: `${c.completion}%` }} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <button className="btn bp sm" onClick={e => { e.stopPropagation(); nav('/dashboard/lessons', { state: { courseId: c.id, courseTitle: c.title } }) }}>
                  ▶ Continue
                </button>
                <button className="btn bo sm" onClick={e => { e.stopPropagation(); nav('/dashboard/quizzes') }}>
                  📝 Quiz
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
