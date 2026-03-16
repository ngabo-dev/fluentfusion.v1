import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/client'
import Badge from '../../components/Badge'
import Progress from '../../components/Progress'
import CourseFormModal from '../../components/CourseFormModal'

export default function MyCourses() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [modal, setModal] = useState<{ open: boolean; course?: any }>({ open: false })
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get('/api/instructor/courses')
      .then(r => setCourses(Array.isArray(r.data) ? r.data : []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const filtered = courses.filter(c =>
    (!search || c.title?.toLowerCase().includes(search.toLowerCase())) &&
    (!statusFilter || c.status === statusFilter)
  )

  async function submitForReview(id: number) {
    try {
      await api.post(`/api/instructor/courses/${id}/submit`, {})
      load()
    } catch {}
  }

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>My Courses</h1><p>Manage and monitor all your courses</p></div>
        <div className="pa">
          <button className="btn bp" onClick={() => navigate('/instructor/courses/new')}>＋ New Course</button>
        </div>
      </div>

      <div className="ab">
        <div className="sw">
          <span className="si2">🔍</span>
          <input className="inp" placeholder="Search courses…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="sel" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
        </select>
        <button className={`btn ${view === 'grid' ? 'bo' : 'bg'} sm`} onClick={() => setView('grid')}>⊞ Grid</button>
        <button className={`btn ${view === 'list' ? 'bo' : 'bg'} sm`} onClick={() => setView('list')}>☰ List</button>
      </div>

      {loading && (
        <div className="loading" />
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--mu)', fontFamily: 'JetBrains Mono', fontSize: 12 }}>
          No courses yet.{' '}
          <span style={{ color: 'var(--neon)', cursor: 'pointer' }} onClick={() => setModal({ open: true })}>
            Create your first course →
          </span>
        </div>
      )}

      {!loading && filtered.length > 0 && view === 'grid' && (
        <div className="g3">
          {filtered.map(c => (
            <div key={c.id} className="card" style={{ padding: 0 }}>
              <div style={{
                height: 110,
                background: c.thumbnail_url ? undefined : 'linear-gradient(135deg,#1a2a0a,#0f1f05)',
                backgroundImage: c.thumbnail_url ? `url(${c.thumbnail_url})` : undefined,
                backgroundSize: 'cover', backgroundPosition: 'center',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 42, position: 'relative', borderRadius: '14px 14px 0 0'
              }}>
                {!c.thumbnail_url && (c.flag_emoji || '📚')}
                <div style={{ position: 'absolute', top: 8, right: 8 }}>
                  <Badge variant={c.status === 'published' ? 'k' : c.status === 'pending' ? 'w' : 'm'}>{c.status}</Badge>
                </div>
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{c.title}</div>
                <div style={{ fontSize: 10, color: 'var(--mu)', marginBottom: 8 }}>
                  {c.level} · {c.lesson_count ?? 0} lessons
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 11, textAlign: 'center' }}>
                  <div>
                    <div style={{ fontFamily: 'Syne', fontSize: 15, fontWeight: 800, color: 'var(--neon)' }}>{c.students ?? '—'}</div>
                    <div style={{ fontSize: 8, color: 'var(--mu)' }}>STUDENTS</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Syne', fontSize: 15, fontWeight: 800, color: 'var(--wa)' }}>{c.rating ? `${c.rating}★` : '—'}</div>
                    <div style={{ fontSize: 8, color: 'var(--mu)' }}>RATING</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Syne', fontSize: 15, fontWeight: 800, color: 'var(--ok)' }}>{c.revenue ? `$${(c.revenue / 1000).toFixed(1)}k` : '—'}</div>
                    <div style={{ fontSize: 8, color: 'var(--mu)' }}>REVENUE</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  <button className="btn bo sm" onClick={() => setModal({ open: true, course: c })}>✏️ Edit</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length > 0 && view === 'list' && (
        <div className="card">
          <table className="tbl">
            <thead>
              <tr>
                <th>Course</th>
                <th>Status</th>
                <th>Students</th>
                <th>Completion</th>
                <th>Rating</th>
                <th>Revenue</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 20 }}>{c.flag_emoji || '📚'}</span>
                      <div>
                        <div style={{ fontWeight: 500 }}>{c.title}</div>
                        <div style={{ fontSize: 10, color: 'var(--mu)' }}>{c.level} · {c.lesson_count ?? 0} lessons</div>
                      </div>
                    </div>
                  </td>
                  <td><Badge variant={c.status === 'published' ? 'k' : c.status === 'pending' ? 'w' : 'm'}>{c.status}</Badge></td>
                  <td>{c.students ?? '—'}</td>
                  <td>{c.completion ? <Progress pct={Math.round(c.completion)} /> : '—'}</td>
                  <td style={{ color: 'var(--wa)' }}>{c.rating ? `★ ${c.rating}` : '—'}</td>
                  <td style={{ color: 'var(--ok)', fontWeight: 600 }}>{c.revenue ? `$${c.revenue.toLocaleString()}` : '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn bo sm" onClick={() => setModal({ open: true, course: c })}>✏️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal.open && (
        <CourseFormModal
          course={modal.course}
          role="instructor"
          onClose={() => setModal({ open: false })}
          onSaved={() => { setModal({ open: false }); load() }}
        />
      )}
    </div>
  )
}
