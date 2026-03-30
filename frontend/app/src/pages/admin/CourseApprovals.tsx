import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import api from '../../api/client'
import { BookOpen, Check, Eye, FileText, Headphones, Search, Video, X, User, Tag, Globe, BarChart2, Clock, Users, DollarSign, ChevronDown, ChevronRight } from 'lucide-react'

function CourseModal({ id, onClose, onAction }: { id: number; onClose: () => void; onAction: () => void }) {
  const [course, setCourse] = useState<any>(null)
  const [tab, setTab] = useState('overview')
  const [feedback, setFeedback] = useState('')
  const [acting, setActing] = useState(false)
  const [feedbackErr, setFeedbackErr] = useState('')
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({})

  useEffect(() => {
    api.get(`/api/admin/courses/${id}`).then(r => {
      setCourse(r.data)
      // expand all modules by default
      const exp: Record<number, boolean> = {}
      r.data.modules?.forEach((m: any) => { exp[m.id] = true })
      setExpandedModules(exp)
    }).catch(() => {})
  }, [id])

  async function approve() {
    setActing(true)
    try {
      await api.patch(`/api/admin/courses/${id}/status`, { status: 'approved' })
      onAction(); onClose()
    } catch (e: any) { alert(e.response?.data?.detail || 'Failed') }
    finally { setActing(false) }
  }

  async function reject() {
    if (!feedback.trim()) { setFeedbackErr('Feedback is required when rejecting'); return }
    setFeedbackErr('')
    setActing(true)
    try {
      await api.patch(`/api/admin/courses/${id}/status`, { status: 'rejected', feedback })
      onAction(); onClose()
    } catch (e: any) { alert(e.response?.data?.detail || 'Failed') }
    finally { setActing(false) }
  }

  const LESSON_ICON: Record<string, React.ReactNode> = {
    video: <Video size={13} />, audio: <Headphones size={13} />, text: <FileText size={13} />,
  }

  const totalLessons = course?.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) + (course?.loose_lessons?.length || 0)
  const totalMins = course?.modules?.reduce((acc: number, m: any) =>
    acc + m.lessons?.reduce((a: number, l: any) => a + (l.duration_min || 0), 0), 0) || 0

  const modal = (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <div
        style={{ width: '100%', maxWidth: 860, maxHeight: '90vh', background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {!course ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--mu)' }}>Loading…</div>
        ) : <>

          {/* ── Top banner ── */}
          <div style={{ position: 'relative', height: 160, flexShrink: 0, background: course.thumbnail_url ? `url(${course.thumbnail_url}) center/cover` : 'rgba(191,255,0,.05)', borderBottom: '1px solid var(--bdr)' }}>
            {!course.thumbnail_url && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>
                {course.flag_emoji || '📚'}
              </div>
            )}
            {/* dark overlay for readability */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.2) 100%)' }} />
            <div style={{ position: 'absolute', bottom: 16, left: 20, right: 56 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span className={`bdg ${course.status === 'pending' ? 'bw' : course.status === 'approved' ? 'bk' : course.status === 'rejected' ? 'be' : 'bm'}`}>{course.status}</span>
                {course.flag_emoji && <span style={{ fontSize: 18 }}>{course.flag_emoji}</span>}
              </div>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: '#fff', lineHeight: 1.2 }}>{course.title}</div>
              {course.subtitle && <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', marginTop: 3 }}>{course.subtitle}</div>}
            </div>
            <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,.5)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 8, padding: '4px 8px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}>
              <X size={16} />
            </button>
          </div>

          {/* ── Instructor + stats strip ── */}
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--bdr)', flexShrink: 0, flexWrap: 'wrap' }}>
            {[
              { icon: <User size={13} />, label: 'Instructor', value: `${course.instructor} · ${course.instructor_email}` },
              { icon: <Globe size={13} />, label: 'Language', value: `${course.language} · ${course.level}` },
              { icon: <DollarSign size={13} />, label: 'Price', value: course.is_free ? 'Free' : `$${course.price}` },
              { icon: <Users size={13} />, label: 'Students', value: course.students ?? 0 },
              { icon: <BookOpen size={13} />, label: 'Lessons', value: totalLessons },
              { icon: <Clock size={13} />, label: 'Total time', value: `${totalMins} min` },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ flex: '1 1 140px', padding: '10px 16px', borderRight: '1px solid var(--bdr)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--neon)', flexShrink: 0 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 9, color: 'var(--mu)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)' }}>{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Tabs ── */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--bdr)', flexShrink: 0 }}>
            {['overview', 'curriculum', 'pricing'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: `2px solid ${tab === t ? 'var(--neon)' : 'transparent'}`, color: tab === t ? 'var(--neon)' : 'var(--mu)', cursor: 'pointer', fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>
                {t}
              </button>
            ))}
          </div>

          {/* ── Scrollable body ── */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>

            {/* OVERVIEW */}
            {tab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Left col */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {course.description && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Description</div>
                      <div style={{ fontSize: 13, color: 'var(--mu)', lineHeight: 1.7 }}>{course.description}</div>
                    </div>
                  )}
                  {course.what_you_learn && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>What students will learn</div>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {course.what_you_learn.split('\n').filter(Boolean).map((item: string, i: number) => (
                          <li key={i} style={{ fontSize: 13, color: 'var(--mu)', lineHeight: 1.8 }}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {/* Right col */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {course.requirements && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Requirements</div>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {course.requirements.split('\n').filter(Boolean).map((item: string, i: number) => (
                          <li key={i} style={{ fontSize: 13, color: 'var(--mu)', lineHeight: 1.8 }}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {course.target_audience && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Target Audience</div>
                      <div style={{ fontSize: 13, color: 'var(--mu)', lineHeight: 1.7 }}>{course.target_audience}</div>
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Dates</div>
                    {[
                      ['Submitted', course.submitted_at?.slice(0, 10) || '—'],
                      ['Created', course.created_at?.slice(0, 10) || '—'],
                      ['Approved', course.approved_at?.slice(0, 10) || '—'],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '6px 0', borderBottom: '1px solid var(--bdr)' }}>
                        <span style={{ color: 'var(--mu)' }}>{k}</span>
                        <span style={{ fontWeight: 600 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  {course.category && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Tag size={13} style={{ color: 'var(--neon)' }} />
                      <span style={{ fontSize: 12, color: 'var(--mu)' }}>Category:</span>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{course.category}</span>
                    </div>
                  )}
                  {course.rejection_feedback && (
                    <div style={{ background: 'rgba(255,68,68,.08)', border: '1px solid rgba(255,68,68,.2)', borderRadius: 8, padding: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--er)', marginBottom: 4 }}>Previous Rejection Feedback</div>
                      <div style={{ fontSize: 12, color: '#FF8888' }}>{course.rejection_feedback}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CURRICULUM */}
            {tab === 'curriculum' && (
              <div>
                {course.modules?.length > 0 ? (
                  course.modules.map((m: any) => (
                    <div key={m.id} style={{ marginBottom: 12, border: '1px solid var(--bdr)', borderRadius: 10, overflow: 'hidden' }}>
                      <div
                        onClick={() => setExpandedModules(p => ({ ...p, [m.id]: !p[m.id] }))}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--card2)', cursor: 'pointer' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <BookOpen size={14} style={{ color: 'var(--neon)' }} />
                          <span style={{ fontWeight: 700, fontSize: 13 }}>{m.title}</span>
                          <span style={{ fontSize: 11, color: 'var(--mu)', fontFamily: 'JetBrains Mono' }}>{m.lessons?.length || 0} lessons</span>
                        </div>
                        {expandedModules[m.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </div>
                      {expandedModules[m.id] && (
                        <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {m.lessons?.map((l: any) => (
                            <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--card)', borderRadius: 8, border: '1px solid var(--bdr)' }}>
                              <span style={{ color: 'var(--mu)', flexShrink: 0 }}>{LESSON_ICON[l.lesson_type] || <FileText size={13} />}</span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                                  {l.title}
                                  {l.is_preview && <span style={{ fontSize: 9, color: 'var(--neon)', fontFamily: 'JetBrains Mono', border: '1px solid rgba(191,255,0,.3)', borderRadius: 4, padding: '1px 5px' }}>FREE PREVIEW</span>}
                                </div>
                                {l.description && <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.description}</div>}
                              </div>
                              {l.duration_min > 0 && <span style={{ fontSize: 11, color: 'var(--mu)', fontFamily: 'JetBrains Mono', flexShrink: 0 }}>{l.duration_min}m</span>}
                            </div>
                          ))}
                          {m.quizzes?.map((q: any) => (
                            <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'rgba(191,255,0,.04)', borderRadius: 8, border: '1px solid rgba(191,255,0,.15)' }}>
                              <BarChart2 size={13} style={{ color: 'var(--neon)', flexShrink: 0 }} />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 12, fontWeight: 600 }}>{q.title}</div>
                                <div style={{ fontSize: 11, color: 'var(--mu)' }}>{q.questions?.length || 0} questions · Pass: {q.passing_score}%{q.time_limit_min ? ` · ${q.time_limit_min} min` : ''}</div>
                              </div>
                              <span style={{ fontSize: 9, color: 'var(--neon)', fontFamily: 'JetBrains Mono', border: '1px solid rgba(191,255,0,.3)', borderRadius: 4, padding: '1px 5px' }}>QUIZ</span>
                            </div>
                          ))}
                          {!m.lessons?.length && !m.quizzes?.length && (
                            <div style={{ fontSize: 12, color: 'var(--mu)', fontStyle: 'italic', padding: '8px 10px' }}>No content yet</div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div>
                    {course.loose_lessons?.length > 0 ? (
                      course.loose_lessons.map((l: any, i: number) => (
                        <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--card2)', borderRadius: 8, border: '1px solid var(--bdr)', marginBottom: 6 }}>
                          <span style={{ color: 'var(--mu)' }}>{LESSON_ICON[l.lesson_type] || <FileText size={13} />}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, fontWeight: 600 }}>{i + 1}. {l.title}</div>
                            <div style={{ fontSize: 11, color: 'var(--mu)' }}>{l.lesson_type} · {l.duration_min} min</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ color: 'var(--mu)', fontSize: 13, textAlign: 'center', padding: 40, fontFamily: 'JetBrains Mono' }}>No curriculum added yet</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* PRICING */}
            {tab === 'pricing' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ padding: 28, background: 'var(--card2)', borderRadius: 12, textAlign: 'center', border: '1px solid var(--bdr)' }}>
                  <div style={{ fontSize: 11, color: 'var(--mu)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', marginBottom: 8 }}>Course Price</div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 40, color: 'var(--neon)' }}>{course.is_free ? 'Free' : `$${course.price}`}</div>
                  <div style={{ fontSize: 12, color: 'var(--mu)', marginTop: 6 }}>{course.is_free ? 'No charge to students' : 'One-time purchase'}</div>
                </div>
                {!course.is_free && course.price > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      ['Student pays', `$${course.price}`],
                      ['Platform fee (20%)', `$${(course.price * 0.2).toFixed(2)}`],
                      ['Instructor earns (80%)', `$${(course.price * 0.8).toFixed(2)}`],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--card2)', borderRadius: 10, border: '1px solid var(--bdr)' }}>
                        <span style={{ fontSize: 13, color: 'var(--mu)' }}>{k}</span>
                        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--neon)' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Footer: approve / reject ── */}
          {course.status === 'pending' && (
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--bdr)', background: 'var(--card2)', flexShrink: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 12, alignItems: 'flex-start' }}>
                <div>
                  <label style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.06em', display: 'block', marginBottom: 6 }}>
                    Rejection feedback <span style={{ color: 'var(--mu)' }}>(required to reject)</span>
                  </label>
                  <textarea
                    className="inp" rows={2}
                    placeholder="Explain what needs to be improved before this course can be approved…"
                    value={feedback}
                    onChange={e => { setFeedback(e.target.value); setFeedbackErr('') }}
                    style={{ resize: 'none', width: '100%' }}
                  />
                  {feedbackErr && <div style={{ fontSize: 11, color: 'var(--er)', marginTop: 4 }}>{feedbackErr}</div>}
                </div>
                <button className="btn bp" style={{ alignSelf: 'flex-end', whiteSpace: 'nowrap' }} onClick={approve} disabled={acting}>
                  <Check size={15} /> Approve
                </button>
                <button className="btn bd" style={{ alignSelf: 'flex-end', whiteSpace: 'nowrap' }} onClick={reject} disabled={acting}>
                  <X size={15} /> Reject
                </button>
              </div>
            </div>
          )}
        </>}
      </div>
    </div>
  )

  return ReactDOM.createPortal(modal, document.body)
}

export default function CourseApprovals() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('pending')
  const [review, setReview] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  const load = () => {
    setLoading(true)
    api.get('/api/admin/courses', { params: { status: tab } })
      .then(r => setCourses(r.data)).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [tab])

  const filtered = courses.filter(c =>
    !search || c.title?.toLowerCase().includes(search.toLowerCase()) || c.instructor?.toLowerCase().includes(search.toLowerCase())
  )
  const statusVariant: Record<string, string> = { published: 'bk', approved: 'bk', pending: 'bw', draft: 'bm', rejected: 'be' }

  if (loading) return <div className="pgload" />

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Course Approvals</h1><p>Review instructor submissions and manage all courses</p></div>
      </div>

      {tab === 'pending' && filtered.length > 0 && (
        <div className="alr aw" style={{ marginBottom: 14 }}>
          <span><BookOpen size={16} /></span>
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
          <span className="si2"><Search size={16} /></span>
          <input className="inp" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(c => (
          <div key={c.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setReview(c.id)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 'var(--r)', flexShrink: 0,
                background: c.thumbnail_url ? `url(${c.thumbnail_url}) center/cover` : 'rgba(191,255,0,.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
              }}>
                {!c.thumbnail_url && (c.flag_emoji || <BookOpen size={16} />)}
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
                {c.rejection_feedback && <div style={{ fontSize: 10, color: 'var(--er)', marginTop: 3 }}>✕ {c.rejection_feedback}</div>}
                <div style={{ fontSize: 9, color: 'var(--mu)', fontFamily: 'JetBrains Mono', marginTop: 3 }}>
                  {c.students} students · Submitted {c.submitted_at?.slice(0, 10) || c.created_at?.slice(0, 10)}
                </div>
              </div>
              <div style={{ flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                <button className="btn bg sm" onClick={() => setReview(c.id)}><Eye size={16} /> Review</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ color: 'var(--mu)', fontSize: 12, padding: 40, textAlign: 'center', fontFamily: 'JetBrains Mono' }}>No {tab} courses</div>
        )}
      </div>

      {review && <CourseModal id={review} onClose={() => setReview(null)} onAction={load} />}
    </div>
  )
}
