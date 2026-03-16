import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/client'

export default function MyCourses() {
  const nav = useNavigate()
  const [tab, setTab] = useState<'enrolled' | 'catalog'>('enrolled')
  const [enrolled, setEnrolled] = useState<any[]>([])
  const [catalog, setCatalog] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [langFilter, setLangFilter] = useState('')
  const [levelFilter, setLevelFilter] = useState('')
  const [enrolling, setEnrolling] = useState<number | null>(null)

  useEffect(() => {
    api.get('/api/student/courses').then(r => setEnrolled(r.data ?? [])).catch(() => {})
  }, [])

  useEffect(() => {
    if (tab === 'catalog') loadCatalog()
  }, [tab, search, langFilter, levelFilter])

  function loadCatalog() {
    const params: any = {}
    if (search) params.search = search
    if (langFilter) params.language = langFilter
    if (levelFilter) params.level = levelFilter
    api.get('/api/student/catalog', { params }).then(r => setCatalog(r.data ?? [])).catch(() => {})
  }

  async function enroll(courseId: number) {
    setEnrolling(courseId)
    await api.post(`/api/student/courses/${courseId}/enroll`, {}).catch(() => {})
    setEnrolling(null)
    // refresh both
    api.get('/api/student/courses').then(r => setEnrolled(r.data ?? [])).catch(() => {})
    loadCatalog()
  }

  const filteredEnrolled = enrolled.filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase())
  )

  const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels']
  const languages = [...new Set(catalog.map(c => c.language).filter(Boolean))]

  return (
    <div className="pg">
      <div className="ph">
        <div>
          <h1>Courses</h1>
          <p>{tab === 'enrolled' ? 'Track your learning progress' : 'Browse and enroll in new courses'}</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div className="tabs" style={{ flex: 1, marginBottom: 0 }}>
          <div className={`tab${tab === 'enrolled' ? ' active' : ''}`} onClick={() => setTab('enrolled')}>
            My Courses {enrolled.length > 0 && `(${enrolled.length})`}
          </div>
          <div className={`tab${tab === 'catalog' ? ' active' : ''}`} onClick={() => setTab('catalog')}>
            Browse Catalog
          </div>
        </div>
        <div className="sw" style={{ maxWidth: 260 }}>
          <span className="si2">🔍</span>
          <input className="inp" placeholder="Search courses…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {tab === 'catalog' && <>
          <select className="sel" style={{ width: 'auto' }} value={langFilter} onChange={e => setLangFilter(e.target.value)}>
            <option value="">All Languages</option>
            {languages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select className="sel" style={{ width: 'auto' }} value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
            <option value="">All Levels</option>
            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </>}
      </div>

      {/* ── Enrolled tab ── */}
      {tab === 'enrolled' && (
        <>
          {filteredEnrolled.length === 0 && (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--mu)', fontFamily: 'JetBrains Mono', fontSize: 12 }}>
              No enrolled courses yet.{' '}
              <span style={{ color: 'var(--neon)', cursor: 'pointer' }} onClick={() => setTab('catalog')}>Browse the catalog →</span>
            </div>
          )}
          <div className="g3">
            {filteredEnrolled.map(c => (
              <div key={c.id} className="card" style={{ padding: 0, cursor: 'pointer' }} onClick={() => nav('/dashboard/lessons', { state: { courseId: c.id, courseTitle: c.title } })}>
                <div style={{ height: 110, background: c.thumbnail_url ? undefined : 'linear-gradient(135deg,#1a2a0a,#0f1f05)', backgroundImage: c.thumbnail_url ? `url(${c.thumbnail_url})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, position: 'relative', borderRadius: '14px 14px 0 0' }}>
                  {!c.thumbnail_url && c.flag_emoji}
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
                    <button className="btn bp sm" onClick={e => { e.stopPropagation(); nav('/dashboard/lessons', { state: { courseId: c.id, courseTitle: c.title } }) }}>▶ Continue</button>
                    <button className="btn bo sm" onClick={e => { e.stopPropagation(); nav('/dashboard/quizzes') }}>📝 Quiz</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Catalog tab ── */}
      {tab === 'catalog' && (
        <>
          {catalog.length === 0 && (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--mu)', fontFamily: 'JetBrains Mono', fontSize: 12 }}>No courses found</div>
          )}
          <div className="g3">
            {catalog.map(c => {
              const isEnrolled = c.enrolled || enrolled.some((e: any) => e.id === c.id)
              return (
                <div key={c.id} className="card" style={{ padding: 0 }}>
                  <div style={{ height: 110, background: c.thumbnail_url ? undefined : 'linear-gradient(135deg,#1a2a0a,#0f1f05)', backgroundImage: c.thumbnail_url ? `url(${c.thumbnail_url})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, position: 'relative', borderRadius: '14px 14px 0 0' }}>
                    {!c.thumbnail_url && c.flag_emoji}
                    <div style={{ position: 'absolute', top: 8, left: 8 }}>
                      <span className="bdg bm" style={{ fontSize: 9 }}>{c.level}</span>
                    </div>
                    {c.price === 0 && (
                      <div style={{ position: 'absolute', top: 8, right: 8 }}>
                        <span className="bdg bk" style={{ fontSize: 9 }}>FREE</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{c.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--mu)', marginBottom: 6 }}>{c.language} · {c.lesson_count} lessons</div>
                    {c.description && (
                      <div style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 8, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{c.description}</div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                      <div className="av avs">{c.instructor_initials}</div>
                      <span style={{ fontSize: 11, color: 'var(--mu)', flex: 1 }}>{c.instructor}</span>
                      {c.rating > 0 && <span style={{ fontSize: 11, color: 'var(--wa)' }}>★ {c.rating}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16, color: c.price === 0 ? 'var(--ok)' : 'var(--neon)' }}>
                        {c.price === 0 ? 'Free' : `$${c.price}`}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--mu)' }}>{c.student_count} enrolled</span>
                    </div>
                    {isEnrolled ? (
                      <button className="btn bo sm" style={{ width: '100%', color: 'var(--ok)', borderColor: 'var(--ok)' }} onClick={() => { setTab('enrolled') }}>
                        ✓ Enrolled — Go to Course
                      </button>
                    ) : (
                      <button className="btn bp sm" style={{ width: '100%' }} disabled={enrolling === c.id} onClick={() => enroll(c.id)}>
                        {enrolling === c.id ? 'Enrolling…' : 'Enroll Now'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
