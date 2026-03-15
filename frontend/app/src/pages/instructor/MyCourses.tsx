import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import Badge from '../../components/Badge'
import Progress from '../../components/Progress'

export default function MyCourses() {
  const [courses, setCourses] = useState<any[]>([])
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const load = () => api.get('/api/instructor/courses').then(r => setCourses(r.data))
  useEffect(() => { load() }, [])

  async function deleteCourse(id: number) {
    if (confirm('Delete this course?')) { await api.patch(`/api/instructor/courses/${id}`, { status: 'draft' }); load() }
  }

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>My Courses</h1><p>Manage and monitor all your courses</p></div>
        <div className="pa"><button className="btn bp">＋ New Course</button></div>
      </div>
      <div className="ab">
        <div className="sw"><span className="si2">🔍</span><input className="inp" placeholder="Search courses..." /></div>
        <select className="sel" style={{ width: 'auto' }}><option>All Status</option><option>Published</option><option>Draft</option><option>Pending</option></select>
        <button className={`btn ${view === 'grid' ? 'bo' : 'bg'} sm`} onClick={() => setView('grid')}>⊞ Grid</button>
        <button className={`btn ${view === 'list' ? 'bo' : 'bg'} sm`} onClick={() => setView('list')}>☰ List</button>
      </div>
      {view === 'grid' ? (
        <div className="g3">
          {courses.map(c => (
            <div key={c.id} className="card" style={{ padding: 0, cursor: 'pointer' }}>
              <div style={{ height: 110, background: 'linear-gradient(135deg,#1a2a0a,#0f1f05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42, position: 'relative', borderRadius: '14px 14px 0 0' }}>
                {c.flag_emoji}
                <div style={{ position: 'absolute', top: 8, right: 8 }}><Badge variant={c.status === 'published' ? 'k' : c.status === 'pending' ? 'w' : 'm'}>{c.status}</Badge></div>
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{c.title}</div>
                <div style={{ fontSize: 10, color: 'var(--mu)', marginBottom: 10 }}>{c.level} · {c.lesson_count} lessons · {c.language}</div>
                <div className="pt" style={{ marginBottom: 9 }}><div className="pf" style={{ width: `${c.completion || 0}%` }} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 11, textAlign: 'center' }}>
                  <div><div style={{ fontFamily: 'Syne', fontSize: 15, fontWeight: 800, color: 'var(--neon)' }}>{c.students || '—'}</div><div style={{ fontSize: 8, color: 'var(--mu)' }}>STUDENTS</div></div>
                  <div><div style={{ fontFamily: 'Syne', fontSize: 15, fontWeight: 800, color: 'var(--wa)' }}>{c.rating ? `${c.rating}★` : '—'}</div><div style={{ fontSize: 8, color: 'var(--mu)' }}>RATING</div></div>
                  <div><div style={{ fontFamily: 'Syne', fontSize: 15, fontWeight: 800, color: 'var(--ok)' }}>{c.revenue ? `$${(c.revenue/1000).toFixed(1)}k` : '—'}</div><div style={{ fontSize: 8, color: 'var(--mu)' }}>REVENUE</div></div>
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                  <button className="btn bo sm">✏️ Edit</button>
                  <button className="btn bg sm">📊</button>
                  <button className="btn bd sm" style={{ marginLeft: 'auto' }} onClick={() => deleteCourse(c.id)}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <table className="tbl"><thead><tr><th>Course</th><th>Status</th><th>Students</th><th>Completion</th><th>Rating</th><th>Revenue</th><th></th></tr></thead>
          <tbody>{courses.map(c => (
            <tr key={c.id}>
              <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 20 }}>{c.flag_emoji}</span><div><div style={{ fontWeight: 500 }}>{c.title}</div><div style={{ fontSize: 10, color: 'var(--mu)' }}>{c.level} · {c.lesson_count} lessons</div></div></div></td>
              <td><Badge variant={c.status === 'published' ? 'k' : c.status === 'pending' ? 'w' : 'm'}>{c.status}</Badge></td>
              <td>{c.students || '—'}</td>
              <td>{c.completion ? <Progress pct={Math.round(c.completion)} /> : '—'}</td>
              <td style={{ color: 'var(--wa)' }}>{c.rating ? `★ ${c.rating}` : '—'}</td>
              <td style={{ color: 'var(--ok)', fontWeight: 600 }}>{c.revenue ? `$${c.revenue.toLocaleString()}` : '—'}</td>
              <td><div style={{ display: 'flex', gap: 4 }}><button className="btn bo sm">✏️ Edit</button><button className="btn bd sm">🗑️</button></div></td>
            </tr>
          ))}</tbody></table>
        </div>
      )}
    </div>
  )
}
