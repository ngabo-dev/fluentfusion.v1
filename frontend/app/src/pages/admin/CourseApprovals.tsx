import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import api from '../../api/client'
import CourseFormModal from '../../components/CourseFormModal'

function ReviewDrawer({ id, onClose, onAction }: { id: number; onClose: () => void; onAction: () => void }) {
  const [course, setCourse] = useState<any>(null)
  const [tab, setTab] = useState('info')

  useEffect(() => {
    api.get(`/api/admin/courses/${id}`).then(r => setCourse(r.data)).catch(() => {})
  }, [id])

  async function act(status: string) {
    await api.patch(`/api/admin/courses/${id}/status`, { status })
    onAction(); onClose()
  }

  const drawer = (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }} onClick={onClose}>
      <div style={{ width: 480, height: '100%', background: 'var(--card)', borderLeft: '1px solid var(--bdr)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        {!course ? (
          <div style={{ padding: 40, color: 'var(--mu)', textAlign: 'center' }}>Loading…</div>
        ) : <>
          {/* Header */}
          <div style={{ padding: '20px 20px 0', borderBottom: '1px solid var(--bdr)', paddingBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16 }}>{course.title}</div>
                <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 3 }}>By {course.instructor} · {course.instructor_email}</div>
              </div>
              <button className="btn bg sm" onClick={onClose}>✕</button>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
              {['info', 'curriculum', 'quizzes', 'pricing'].map(t => (
                <div key={t} onClick={() => setTab(t)}
                  style={{ padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
                    background: tab === t ? 'var(--neon)' : 'var(--card2)', color: tab === t ? '#000' : 'var(--mu)' }}>
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {tab === 'info' && <>
              {course.thumbnail_url
                ? <img src={course.thumbnail_url} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10 }} />
                : <div style={{ height: 100, background: 'rgba(191,255,0,.06)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>{course.flag_emoji || '📚'}</div>
              }
              {[['Language', course.language], ['Level', course.level], ['Students', course.students], ['Created', course.created_at?.slice(0,10)]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '8px 0', borderBottom: '1px solid var(--bdr)' }}>
                  <span style={{ color: 'var(--mu)' }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              {course.description && <div style={{ fontSize: 12, color: 'var(--mu)', lineHeight: 1.6, marginTop: 4 }}>{course.description}</div>}
            </>}

            {tab === 'curriculum' && <>
              <div style={{ fontSize: 12, color: 'var(--mu)', marginBottom: 4 }}>{course.lessons?.length || 0} lessons</div>
              {course.lessons?.length === 0 && <div style={{ color: 'var(--mu)', fontSize: 12, fontFamily: 'JetBrains Mono' }}>No lessons added</div>}
              {course.lessons?.map((l: any, i: number) => (
                <div key={l.id} style={{ padding: '10px 12px', background: 'var(--card2)', borderRadius: 8, border: '1px solid var(--bdr)' }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{i + 1}. {l.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--mu)', marginTop: 3 }}>{l.lesson_type} · {l.duration_min} min</div>
                  {l.description && <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 4 }}>{l.description}</div>}
                </div>
              ))}
            </>}

            {tab === 'quizzes' && <>
              <div style={{ fontSize: 12, color: 'var(--mu)', marginBottom: 4 }}>{course.quizzes?.length || 0} quizzes</div>
              {course.quizzes?.length === 0 && <div style={{ color: 'var(--mu)', fontSize: 12, fontFamily: 'JetBrains Mono' }}>No quizzes added</div>}
              {course.quizzes?.map((q: any) => (
                <div key={q.id} style={{ padding: '10px 12px', background: 'var(--card2)', borderRadius: 8, border: '1px solid var(--bdr)' }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{q.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--mu)', marginTop: 3 }}>{q.question_count} questions · avg score {q.avg_score}%</div>
                </div>
              ))}
            </>}

            {tab === 'pricing' && <>
              <div style={{ padding: 20, background: 'var(--card2)', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 32, color: 'var(--neon)' }}>{course.price === 0 ? 'Free' : `$${course.price}`}</div>
                <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 4 }}>Course price</div>
              </div>
            </>}
          </div>

          {/* Footer actions */}
          {course.status === 'pending' && (
            <div style={{ padding: 16, borderTop: '1px solid var(--bdr)', display: 'flex', gap: 8 }}>
              <button className="btn bp" style={{ flex: 1 }} onClick={() => act('published')}>✓ Approve</button>
              <button className="btn bd" style={{ flex: 1 }} onClick={() => act('rejected')}>✗ Reject</button>
            </div>
          )}
        </>}
      </div>
    </div>
  )
  return ReactDOM.createPortal(drawer, document.body)
}

export default function CourseApprovals() {
  const [courses, setCourses] = useState<any[]>([])
  const [tab, setTab] = useState('pending')
  const [modal, setModal] = useState(false)
  const [review, setReview] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  const load = () => api.get('/api/admin/courses', { params: { status: tab } }).then(r => setCourses(r.data)).catch(() => {})
  useEffect(() => { load() }, [tab])

  async function updateStatus(id: number, status: string) {
    await api.patch(`/api/admin/courses/${id}/status`, { status })
    load()
  }

  const filtered = courses.filter(c => !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor?.toLowerCase().includes(search.toLowerCase()))
  const statusMap: Record<string, string> = { published: 'bk', pending: 'bw', draft: 'bm', rejected: 'be' }

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Course Approvals</h1><p>Review instructor submissions and manage all courses</p></div>
        <button className="btn bp" onClick={() => setModal(true)}>＋ Create Course</button>
      </div>

      {tab === 'pending' && filtered.length > 0 && (
        <div className="alr aw" style={{ marginBottom: 14 }}>
          <span>📚</span>
          <div style={{ flex: 1 }}><b>{filtered.length} course{filtered.length !== 1 ? 's' : ''} awaiting review</b></div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div className="tabs" style={{ flex: 1, marginBottom: 0 }}>
          {['pending', 'published', 'draft', 'rejected'].map(t => (
            <div key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}{tab === t && ` (${filtered.length})`}
            </div>
          ))}
        </div>
        <div className="sw" style={{ maxWidth: 220 }}>
          <span className="si2">🔍</span>
          <input className="inp" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(c => (
          <div key={c.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setReview(c.id)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 64, height: 64, background: 'rgba(191,255,0,.07)', backgroundImage: c.thumbnail_url ? `url(${c.thumbnail_url})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 'var(--r)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
                {!c.thumbnail_url && c.flag_emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{c.title}</div>
                  <span className={`bdg ${statusMap[c.status] || 'bm'}`}>{c.status}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 2 }}>
                  By <b style={{ color: 'var(--fg)' }}>{c.instructor || 'Unknown'}</b> · {c.language} · {c.level} · <span style={{ color: 'var(--neon)' }}>${c.price}</span>
                </div>
                {c.description && <div style={{ fontSize: 11, color: 'var(--mu)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 500 }}>{c.description}</div>}
                <div style={{ fontSize: 9, color: 'var(--mu)', fontFamily: 'JetBrains Mono', marginTop: 3 }}>{c.students} students · Created {c.created_at?.slice(0, 10)}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                <button className="btn bg sm" onClick={() => setReview(c.id)}>👁 Review</button>
                {tab === 'pending' && <>
                  <button className="btn bp sm" onClick={() => updateStatus(c.id, 'published')}>✓</button>
                  <button className="btn bd sm" onClick={() => updateStatus(c.id, 'rejected')}>✗</button>
                </>}
                {tab === 'published' && <button className="btn bg sm" onClick={() => updateStatus(c.id, 'draft')}>Unpublish</button>}
                {(tab === 'draft' || tab === 'rejected') && <button className="btn bp sm" onClick={() => updateStatus(c.id, 'published')}>Publish</button>}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ color: 'var(--mu)', fontSize: 12, padding: 40, textAlign: 'center', fontFamily: 'JetBrains Mono' }}>No {tab} courses</div>
        )}
      </div>

      {review && <ReviewDrawer id={review} onClose={() => setReview(null)} onAction={load} />}

      {modal && (
        <CourseFormModal role="admin" onClose={() => setModal(false)} onSaved={() => { setModal(false); setTab('published'); load() }} />
      )}
    </div>
  )
}
