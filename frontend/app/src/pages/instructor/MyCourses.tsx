import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/client'
import Badge from '../../components/Badge'
import Progress from '../../components/Progress'
import { BookOpen, Check, Clock, List, Pencil, Plus, Rocket, Search, Star, Trash2, Upload, X } from 'lucide-react'

type Variant = 'n' | 'k' | 'w' | 'e' | 'i' | 'm'
const STATUS_VARIANT: Record<string, Variant> = { published: 'k', approved: 'k', pending: 'w', draft: 'm', rejected: 'e' }

export default function MyCourses() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<number | null>(null)

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

  async function publish(id: number) {
    setActing(id)
    try { await api.post(`/api/instructor/courses/${id}/publish`, {}); load() }
    catch (e: any) { alert(e.response?.data?.detail || 'Failed to publish') }
    finally { setActing(null) }
  }

  async function submitForReview(id: number) {
    setActing(id)
    try { await api.post(`/api/instructor/courses/${id}/submit`, {}); load() }
    catch (e: any) { alert(e.response?.data?.detail || 'Failed to submit') }
    finally { setActing(null) }
  }

  async function deleteCourse(id: number) {
    if (!confirm('Delete this course? This cannot be undone.')) return
    setActing(id)
    try { await api.delete(`/api/instructor/courses/${id}`); load() }
    catch (e: any) { alert(e.response?.data?.detail || 'Cannot delete') }
    finally { setActing(null) }
  }

  function ActionButtons({ c }: { c: any }) {
    const busy = acting === c.id
    return (
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {(c.status === 'draft' || c.status === 'rejected') && (
          <>
            <button className="btn bo sm" onClick={() => navigate(`/instructor/courses/${c.id}/edit`)} disabled={busy}><Pencil size={16} />️ Edit</button>
            <button className="btn bp sm" onClick={() => submitForReview(c.id)} disabled={busy}><Upload size={16} /> Submit</button>
            <button className="btn bd sm" onClick={() => deleteCourse(c.id)} disabled={busy}><Trash2 size={16} /></button>
          </>
        )}
        {c.status === 'pending' && (
          <span style={{ fontSize: 11, color: 'var(--mu)', fontFamily: 'JetBrains Mono' }}><Clock size={16} /> Under review</span>
        )}
        {c.status === 'approved' && (
          <button className="btn bp sm" onClick={() => publish(c.id)} disabled={busy}><Rocket size={16} /> {busy ? '…' : 'Publish'}</button>
        )}
        {c.status === 'published' && (
          <span style={{ fontSize: 11, color: 'var(--ok)', fontFamily: 'JetBrains Mono' }}><Check size={16} /> Live</span>
        )}
      </div>
    )
  }

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>My Courses</h1><p>Manage and monitor all your courses</p></div>
        <button className="btn bp" onClick={() => navigate('/instructor/courses/new')}><Plus size={16} /> New Course</button>
      </div>

      {/* Rejection alerts */}
      {courses.filter(c => c.status === 'rejected').map(c => (
        <div key={c.id} className="alr ac" style={{ marginBottom: 10 }}>
          <b>"{c.title}"</b> was rejected{c.rejection_feedback ? `: ${c.rejection_feedback}` : '.'}{' '}
          <span style={{ color: 'var(--neon)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate(`/instructor/courses/${c.id}/edit`)}>Edit & resubmit →</span>
        </div>
      ))}

      {/* Approved but not published */}
      {courses.filter(c => c.status === 'approved').map(c => (
        <div key={c.id} className="alr aw" style={{ marginBottom: 10 }}>
          <b>"{c.title}"</b> was approved! <span style={{ color: 'var(--neon)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => publish(c.id)}>Publish now →</span>
        </div>
      ))}

      <div className="ab">
        <div className="sw">
          <span className="si2"><Search size={16} /></span>
          <input className="inp" placeholder="Search courses…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="sel" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="published">Published</option>
          <option value="rejected">Rejected</option>
        </select>
        <button className={`btn ${view === 'grid' ? 'bo' : 'bg'} sm`} onClick={() => setView('grid')}>⊞ Grid</button>
        <button className={`btn ${view === 'list' ? 'bo' : 'bg'} sm`} onClick={() => setView('list')}><List size={16} /> List</button>
      </div>

      {loading && <div className="loading" />}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--mu)', fontFamily: 'JetBrains Mono', fontSize: 12 }}>
          No courses yet.{' '}
          <span style={{ color: 'var(--neon)', cursor: 'pointer' }} onClick={() => navigate('/instructor/courses/new')}>
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
                {!c.thumbnail_url && (c.flag_emoji || <BookOpen size={16} />)}
                <div style={{ position: 'absolute', top: 8, right: 8 }}>
                  <Badge variant={STATUS_VARIANT[c.status] || 'm'}>{c.status}</Badge>
                </div>
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{c.title}</div>
                {c.subtitle && <div style={{ fontSize: 10, color: 'var(--mu)', marginBottom: 3 }}>{c.subtitle}</div>}
                <div style={{ fontSize: 10, color: 'var(--mu)', marginBottom: 8 }}>{c.level} · {c.lesson_count ?? 0} lessons</div>
                {c.status === 'rejected' && c.rejection_feedback && (
                  <div style={{ fontSize: 10, color: 'var(--er)', marginBottom: 8, padding: '6px 8px', background: 'rgba(255,68,68,.08)', borderRadius: 6, border: '1px solid rgba(255,68,68,.2)' }}>
                    <X size={16} /> {c.rejection_feedback}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 11, textAlign: 'center' }}>
                  <div>
                    <div style={{ fontFamily: 'Syne', fontSize: 15, fontWeight: 800, color: 'var(--neon)' }}>{c.students ?? '—'}</div>
                    <div style={{ fontSize: 8, color: 'var(--mu)' }}>STUDENTS</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Syne', fontSize: 15, fontWeight: 800, color: 'var(--wa)' }}>{c.rating ? `${c.rating} ⭐` : '—'}</div>
                    <div style={{ fontSize: 8, color: 'var(--mu)' }}>RATING</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Syne', fontSize: 15, fontWeight: 800, color: 'var(--ok)' }}>{c.revenue ? `$${(c.revenue / 1000).toFixed(1)}k` : '—'}</div>
                    <div style={{ fontSize: 8, color: 'var(--mu)' }}>REVENUE</div>
                  </div>
                </div>
                <ActionButtons c={c} />
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
                      <span style={{ fontSize: 20 }}>{c.flag_emoji || <BookOpen size={16} />}</span>
                      <div>
                        <div style={{ fontWeight: 500 }}>{c.title}</div>
                        <div style={{ fontSize: 10, color: 'var(--mu)' }}>{c.level} · {c.lesson_count ?? 0} lessons</div>
                        {c.status === 'rejected' && c.rejection_feedback && (
                          <div style={{ fontSize: 10, color: 'var(--er)' }}><X size={16} /> {c.rejection_feedback}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td><Badge variant={STATUS_VARIANT[c.status] || 'm'}>{c.status}</Badge></td>
                  <td>{c.students ?? '—'}</td>
                  <td>{c.completion ? <Progress pct={Math.round(c.completion)} /> : '—'}</td>
                  <td style={{ color: 'var(--wa)' }}>{c.rating ? `⭐ ${c.rating}` : '—'}</td>
                  <td style={{ color: 'var(--ok)', fontWeight: 600 }}>{c.revenue ? `$${c.revenue.toLocaleString()}` : '—'}</td>
                  <td><ActionButtons c={c} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
