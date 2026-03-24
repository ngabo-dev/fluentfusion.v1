import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/client'

const TYPE_ICON: Record<string, string> = { video: '▶️', text: '📝', audio: '🎧' }

export default function CourseDetails() {
  const { id } = useParams()
  const nav = useNavigate()
  const [course, setCourse] = useState<any>(null)
  const [tab, setTab] = useState<'Overview' | 'Curriculum' | 'Instructor'>('Overview')
  const [enrolling, setEnrolling] = useState(false)
  const [enrolled, setEnrolled] = useState(false)

  useEffect(() => {
    api.get(`/api/student/catalog/${id}`).then(r => {
      setCourse(r.data)
      setEnrolled(r.data.enrolled)
    }).catch(() => nav('/dashboard/catalog'))
  }, [id])

  async function enroll() {
    setEnrolling(true)
    await api.post(`/api/student/courses/${id}/enroll`, {})
    setEnrolled(true)
    setEnrolling(false)
  }

  if (!course) return <div className="loading" />

  const totalLessons = course.curriculum?.reduce((n: number, s: any) => n + s.lessons.length, 0) ?? course.lesson_count

  return (
    <div style={{ minHeight: '100%' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#1a2a1a 0%,#0a0a0a 60%)', borderBottom: '1px solid var(--bdr)', padding: '48px 40px' }}>
        <button onClick={() => nav('/dashboard/catalog')} style={{ background: 'none', border: 'none', color: 'var(--mu)', cursor: 'pointer', fontSize: 13, marginBottom: 20, padding: 0 }}>← Back to Catalog</button>
        <div style={{ maxWidth: 700 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(191,255,0,0.1)', color: 'var(--neon)', border: '1px solid rgba(191,255,0,0.2)', borderRadius: 6, padding: '3px 10px', fontSize: 12 }}>{course.flag_emoji} {course.language}</span>
            <span style={{ background: 'rgba(0,207,255,0.1)', color: '#00CFFF', border: '1px solid rgba(0,207,255,0.2)', borderRadius: 6, padding: '3px 10px', fontSize: 12 }}>{course.level}</span>
          </div>
          <div style={{ fontFamily: 'Syne', fontSize: 32, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 12 }}>{course.title}</div>
          {course.subtitle && <div style={{ fontSize: 15, color: 'var(--mu)', marginBottom: 12 }}>{course.subtitle}</div>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="av avs">{course.instructor_initials}</div>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{course.instructor}</span>
            </div>
            {course.rating > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#FFD700' }}>★</span>
                <span style={{ fontWeight: 700 }}>{course.rating}</span>
              </div>
            )}
            <span style={{ fontSize: 13, color: 'var(--mu)' }}>{course.student_count} students · {totalLessons} lessons</span>
          </div>
        </div>
      </div>

      <div style={{ padding: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, alignItems: 'start' }}>
          {/* Left */}
          <div>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--bdr)', marginBottom: 28 }}>
              {(['Overview', 'Curriculum', 'Instructor'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ padding: '12px 20px', background: 'none', border: 'none', borderBottom: `2px solid ${tab === t ? 'var(--neon)' : 'transparent'}`, color: tab === t ? 'var(--neon)' : 'var(--mu)', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>{t}</button>
              ))}
            </div>

            {tab === 'Overview' && (
              <div>
                {course.description && <p style={{ color: 'var(--mu)', lineHeight: 1.75, fontSize: 14, marginBottom: 24 }}>{course.description}</p>}
                {course.what_you_learn && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>What You'll Learn</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {course.what_you_learn.split('\n').filter(Boolean).map((item: string, i: number) => (
                        <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--mu)' }}>
                          <span style={{ color: 'var(--neon)', flexShrink: 0 }}>✓</span>{item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {course.requirements && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Requirements</div>
                    <p style={{ fontSize: 13, color: 'var(--mu)' }}>{course.requirements}</p>
                  </div>
                )}
              </div>
            )}

            {tab === 'Curriculum' && (
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Curriculum · {totalLessons} Lessons</div>
                {course.curriculum?.length === 0 && <div style={{ color: 'var(--mu)', fontSize: 13 }}>No lessons added yet.</div>}
                <div style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 12, overflow: 'hidden' }}>
                  {course.curriculum?.map((section: any, si: number) => (
                    <div key={si}>
                      <div style={{ padding: '14px 20px', background: 'rgba(191,255,0,0.04)', borderBottom: '1px solid var(--bdr)', fontWeight: 700, fontSize: 13 }}>
                        {section.title} <span style={{ color: 'var(--mu)', fontWeight: 400 }}>· {section.lessons.length} lessons</span>
                      </div>
                      {section.lessons.map((l: any, li: number) => (
                        <div key={li} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 16px', borderBottom: '1px solid rgba(255,255,255,.04)', fontSize: 13 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span>{TYPE_ICON[l.lesson_type] ?? '📄'}</span>
                            <span>{l.title}</span>
                            {l.is_preview && <span style={{ fontSize: 9, color: 'var(--neon)', fontFamily: 'JetBrains Mono', background: 'rgba(191,255,0,.1)', padding: '2px 6px', borderRadius: 4 }}>FREE</span>}
                          </div>
                          {l.duration_min && <span style={{ fontSize: 11, color: 'var(--mu)' }}>{l.duration_min} min</span>}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'Instructor' && (
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div className="av" style={{ width: 56, height: 56, fontSize: 18, flexShrink: 0 }}>{course.instructor_initials}</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{course.instructor}</div>
                  {course.instructor_bio && <p style={{ fontSize: 14, color: 'var(--mu)', lineHeight: 1.7 }}>{course.instructor_bio}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Right: sticky enroll card */}
          <div style={{ position: 'sticky', top: 20, background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ height: 180, background: course.thumbnail_url ? undefined : 'linear-gradient(135deg,#1a2a1a,#252525)', backgroundImage: course.thumbnail_url ? `url(${course.thumbnail_url})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>
              {!course.thumbnail_url && course.flag_emoji}
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, color: course.price === 0 ? 'var(--ok)' : 'var(--neon)', marginBottom: 4 }}>
                {course.price === 0 ? 'FREE' : `$${course.price}`}
              </div>
              {enrolled ? (
                <button className="btn bp" style={{ width: '100%', marginBottom: 10, justifyContent: 'center' }} onClick={() => nav('/dashboard/lessons')}>
                  ▶ Continue Learning
                </button>
              ) : (
                <button className="btn bp" style={{ width: '100%', marginBottom: 10, justifyContent: 'center' }} disabled={enrolling} onClick={enroll}>
                  {enrolling ? 'Enrolling…' : `Enroll Now${course.price === 0 ? ' — Free' : ''} →`}
                </button>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[['📚', `${totalLessons} lessons`], ['🏆', 'Certificate on completion'], ['♾️', 'Lifetime access']].map(([ic, txt]) => (
                  <div key={txt} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{ic}</span><span style={{ fontSize: 13, color: 'var(--mu)' }}>{txt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
