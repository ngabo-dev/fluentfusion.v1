import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import api from '../../api/client'

function ReviewDrawer({ id, onClose, onAction }: { id: number; onClose: () => void; onAction: () => void }) {
  const [course, setCourse] = useState<any>(null)
  const [tab, setTab] = useState('info')
  const [feedback, setFeedback] = useState('')
  const [acting, setActing] = useState(false)
  const [feedbackErr, setFeedbackErr] = useState('')

  useEffect(() => {
    api.get(`/api/admin/courses/${id}`).then(r => setCourse(r.data)).catch(() => {})
  }, [id])

  async function approve() {
    setActing(true)
    try {
      await api.patch(`/api/admin/courses/${id}/status`, { status: 'approved' })
      onAction(); onClose()
    } catch (e: any) {
      alert(e.response?.data?.detail || 'Failed')
    } finally { setActing(false) }
  }

  async function reject() {
    if (!feedback.trim()) { setFeedbackErr('Feedback is required when rejecting'); return }
    setFeedbackErr('')
    setActing(true)
    try {
      await api.patch(`/api/admin/courses/${id}/status`, { status: 'rejected', feedback })
      onAction(); onClose()
    } catch (e: any) {
      alert(e.response?.data?.detail || 'Failed')
    } finally { setActing(false) }
  }

  const drawer = (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }} onClick={onClose}>
      <div style={{ width: 500, height: '100%', background: 'var(--card)', borderLeft: '1px solid var(--bdr)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        {!course ? (
          <div style={{ padding: 40, color: 'var(--mu)', textAlign: 'center' }}>Loading…</div>
        ) : <>
          {/* Header */}
          <div style={{ padding: '20px 20px 0', borderBottom: '1px solid var(--bdr)', paddingBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16 }}>{course.title}</div>
                {course.subtitle && <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 2 }}>{course.subtitle}</div>}
                <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 3 }}>By {course.instructor} · {course.instructor_email}</div>
              </div>
              <button className="btn bg sm" onClick={onClose}>✕</button>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
              {['info', 'curriculum', 'pricing'].map(t => (
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
              {[
                ['Language', course.language],
                ['Level', course.level],
                ['Category', course.category || '—'],
                ['Students', course.students ?? 0],
                ['Submitted', course.submitted_at?.slice(0, 10) || '—'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '8px 0', borderBottom: '1px solid var(--bdr)' }}>
                  <span style={{ color: 'var(--mu)' }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              {course.description && <div style={{ fontSize: 12, color: 'var(--mu)', lineHeight: 1.6, marginTop: 4 }}>{course.description}</div>}
              {course.what_you_learn && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>What students will learn</div>
                  <div style={{ fontSize: 12, color: 'var(--mu)', lineHeight: 1.6 }}>{course.what_you_learn}</div>
                </div>
              )}
              {course.requirements && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Requirements</div>
                  <div style={{ fontSize: 12, color: 'var(--mu)' }}>{course.requirements}</div>
                </div>
              )}
              {course.target_audience && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Target Audience</div>
                  <div style={{ fontSize: 12, color: 'var(--mu)' }}>{course.target_audience}</div>
                </div>
              )}
            </>}

            {tab === 'curriculum' && <>
              {/* Sections */}
              {course.sections?.length > 0 ? (
                course.sections.map((s: any, si: number) => (
                  <div key={s.id} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--fg)' }}>📂 {s.title}</div>
                    {s.lessons?.length === 0 && <div style={{ fontSize: 11, color: 'var(--mu)', fontStyle: 'italic', paddingLeft: 12 }}>No lessons</div>}
                    {s.lessons?.map((l: any, li: number) => (
                      <div key={l.id} style={{ padding: '8px 12px', background: 'var(--card2)', borderRadius: 8, border: '1px solid var(--bdr)', marginBottom: 6 }}>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>
                          {l.lesson_type === 'video' ? '📹' : l.lesson_type === 'audio' ? '🎧' : '📝'} {l.title}
                          {l.is_preview && <span style={{ marginLeft: 6, fontSize: 9, color: 'var(--neon)', fontFamily: 'JetBrains Mono' }}>FREE PREVIEW</span>}
                        </div>
                        {(l.duration_min || l.description) && (
                          <div style={{ fontSize: 10, color: 'var(--mu)', marginTop: 3 }}>
                            {l.duration_min ? `${l.duration_min} min` : ''}{l.duration_min && l.description ? ' · ' : ''}{l.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <>
                  <div style={{ fontSize: 12, color: 'var(--mu)', marginBottom: 4 }}>{course.loose_lessons?.length || 0} lessons (no sections)</div>
                  {course.loose_lessons?.map((l: any, i: number) => (
                    <div key={l.id} style={{ padding: '8px 12px', background: 'var(--card2)', borderRadius: 8, border: '1px solid var(--bdr)', marginBottom: 6 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{i + 1}. {l.title}</div>
                      <div style={{ fontSize: 10, color: 'var(--mu)', marginTop: 3 }}>{l.lesson_type} · {l.duration_min} min</div>
                    </div>
                  ))}
                  {!course.loose_lessons?.length && <div style={{ color: 'var(--mu)', fontSize: 12, fontFamily: 'JetBrains Mono' }}>No lessons added</div>}
                </>
              )}
            </>}

            {tab === 'pricing' && <>
              <div style={{ padding: 20, background: 'var(--card2)', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 32, color: 'var(--neon)' }}>{course.price === 0 ? 'Free' : `$${course.price}`}</div>
                <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 4 }}>{course.is_free ? 'Free course' : 'Paid course'}</div>
              </div>
              {!course.is_free && course.price > 0 && (
                <div style={{ padding: '12px 16px', background: 'var(--card2)', borderRadius: 10, display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 12, color: 'var(--mu)' }}>Platform revenue (20%)</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--neon)' }}>${(course.price * 0.2).toFixed(2)}</div>
                </div>
              )}
            </>}
          </div>

          {/* Footer — approve/reject for pending courses */}
          {course.status === 'pending' && (
            <div style={{ padding: 16, borderTop: '1px solid var(--bdr)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="fg" style={{ marginBottom: 0 }}>
                <label className="lbl">Rejection Feedback <span style={{ color: 'var(--mu)' }}>(required to reject)</span></label>
                <textarea className="inp" rows={2} placeholder="Explain what needs to be improved…" value={feedback} onChange={e => { setFeedback(e.target.value); setFeedbackErr('') }} style={{ resize: 'vertical', minHeight: 60 }} />
                {feedbackErr && <div style={{ fontSize: 11, color: 'var(--er)', marginTop: 4 }}>{feedbackErr}</div>}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn bp" style={{ flex: 1 }} onClick={approve} disabled={acting}>✓ Approve</button>
                <button className="btn bd" style={{ flex: 1 }} onClick={reject} disabled={acting}>✗ Reject</button>
              </div>
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
  const [review, setReview] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  const load = () => api.get('/api/admin/courses', { params: { status: tab } }).then(r => setCourses(r.data)).catch(() => {})
  useEffect(() => { load() }, [tab])

  const filtered = courses.filter(c => !search || c.title?.toLowerCase().includes(search.toLowerCase()) || c.instructor?.toLowerCase().includes(search.toLowerCase()))
  const statusVariant: Record<string, string> = { published: 'bk', approved: 'bk', pending: 'bw', draft: 'bm', rejected: 'be' }

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Course Approvals</h1><p>Review instructor submissions and manage all courses</p></div>
      </div>

      {tab === 'pending' && filtered.length > 0 && (
        <div className="alr aw" style={{ marginBottom: 14 }}>
          <span>📚</span>
          <div style={{ flex: 1 }}><b>{filtered.length} course{filtered.length !== 1 ? 's' : ''} awaiting review</b></div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div className="tabs" style={{ flex: 1, marginBottom: 0 }}>
          {['pending', 'approved', 'published', 'draft', 'rejected'].map(t => (
            <div key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
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
                {!c.thumbnail_url && (c.flag_emoji || '📚')}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{c.title}</div>
                  <span className={`bdg ${statusVariant[c.status] || 'bm'}`}>{c.status}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 2 }}>
                  By <b style={{ color: 'var(--fg)' }}>{c.instructor || 'Unknown'}</b> · {c.language} · {c.level} · <span style={{ color: 'var(--neon)' }}>{c.price === 0 ? 'Free' : `$${c.price}`}</span>
                </div>
                {c.description && <div style={{ fontSize: 11, color: 'var(--mu)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 500 }}>{c.description}</div>}
                {c.rejection_feedback && (
                  <div style={{ fontSize: 10, color: 'var(--er)', marginTop: 3 }}>✗ {c.rejection_feedback}</div>
                )}
                <div style={{ fontSize: 9, color: 'var(--mu)', fontFamily: 'JetBrains Mono', marginTop: 3 }}>
                  {c.students} students · Submitted {c.submitted_at?.slice(0, 10) || c.created_at?.slice(0, 10)}
                </div>
              </div>
              <div style={{ flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                <button className="btn bg sm" onClick={() => setReview(c.id)}>👁 Review</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ color: 'var(--mu)', fontSize: 12, padding: 40, textAlign: 'center', fontFamily: 'JetBrains Mono' }}>No {tab} courses</div>
        )}
      </div>

      {review && <ReviewDrawer id={review} onClose={() => setReview(null)} onAction={load} />}
    </div>
  )
}
