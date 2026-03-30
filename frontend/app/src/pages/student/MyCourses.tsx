import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/client'
import { BookOpen, Check, CheckCircle2, FileText, FlaskConical, Headphones, Pencil, Pin, Play, Search, Star, Target } from 'lucide-react'

const API_ROOT = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '')

function getYouTubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([-\w]+)/)
  return m ? m[1] : null
}

function LessonPlayer({ lesson }: { lesson: any }) {
  const url: string = lesson.video_url || ''
  const ytId = url ? getYouTubeId(url) : null
  const isUploaded = url.startsWith('/uploads/')
  const isExternal = url && !ytId && !isUploaded

  if (lesson.lesson_type === 'text') {
    return (
      <div style={{ width: '100%', background: 'var(--card2)', border: '1px solid var(--bdr)', borderRadius: 12, padding: 28, marginBottom: 20, minHeight: 200, lineHeight: 1.8, fontSize: 14, color: 'var(--fg)', whiteSpace: 'pre-wrap' }}>
        {lesson.content || <span style={{ color: 'var(--mu)' }}>No content available.</span>}
      </div>
    )
  }

  if (lesson.lesson_type === 'audio') {
    return (
      <div style={{ width: '100%', background: 'var(--card2)', border: '1px solid var(--bdr)', borderRadius: 12, padding: 28, marginBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <Headphones size={48} style={{ color: 'var(--neon)' }} />
        {url ? (
          <audio controls style={{ width: '100%' }} src={isUploaded ? `${API_ROOT}${url}` : url} />
        ) : <span style={{ color: 'var(--mu)', fontSize: 13 }}>No audio file attached.</span>}
      </div>
    )
  }

  // Video lesson
  if (!url) {
    return (
      <div style={{ width: '100%', aspectRatio: '16/9', background: 'var(--card2)', border: '1px solid var(--bdr)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <span style={{ color: 'var(--mu)', fontSize: 13, fontFamily: 'JetBrains Mono' }}>No video attached to this lesson.</span>
      </div>
    )
  }

  if (ytId) {
    return (
      <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  // Uploaded file or direct video URL
  const src = isUploaded ? `${API_ROOT}${url}` : url
  return (
    <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 12, overflow: 'hidden', marginBottom: 20, background: '#000' }}>
      <video
        controls
        style={{ width: '100%', height: '100%', display: 'block' }}
        src={src}
        onError={e => { (e.currentTarget.parentElement!).innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#888;font-size:13px;font-family:JetBrains Mono">Could not load video. <a href="${src}" target="_blank" style="color:#BFFF00;margin-left:8px">Open in new tab →</a></div>` }}
      />
    </div>
  )
}

const TYPE_ICON: Record<string, string> = { video: <Play size={16} />, text: <BookOpen size={16} />, audio: <Headphones size={16} />, quiz: <FileText size={16} />, exercise: '️' }

export default function MyCourses() {
  const nav = useNavigate()
  const [tab, setTab] = useState<'enrolled' | 'catalog'>('enrolled')
  const [enrolled, setEnrolled] = useState<any[]>([])
  const [catalog, setCatalog] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [langFilter, setLangFilter] = useState('')
  const [levelFilter, setLevelFilter] = useState('')
  const [enrolling, setEnrolling] = useState<number | null>(null)
  const [loadingEnrolled, setLoadingEnrolled] = useState(true)

  // Course viewer state
  const [activeCourse, setActiveCourse] = useState<any>(null)
  const [modules, setModules] = useState<any[]>([])
  const [lessons, setLessons] = useState<any[]>([])
  const [activeModule, setActiveModule] = useState<any>(null)
  const [activeLesson, setActiveLesson] = useState<any>(null)
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [marking, setMarking] = useState(false)

  useEffect(() => {
    setLoadingEnrolled(true)
    api.get('/api/student/courses')
      .then(r => setEnrolled(r.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingEnrolled(false))
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

  async function openCourse(c: any) {
    setActiveCourse(c)
    setActiveLesson(null)
    setActiveModule(null)
    // Load sections with lessons
    const r = await api.get(`/api/student/courses/${c.id}/lessons`).catch(() => ({ data: [] }))
    const allLessons: any[] = r.data ?? []
    setLessons(allLessons)
    // Try to get sections
    const sr = await api.get(`/api/instructor/courses/${c.id}/sections`).catch(() => ({ data: [] }))
    const secs: any[] = sr.data ?? []
    if (secs.length > 0) {
      const mods = secs.map((s: any) => ({
        ...s,
        lessons: allLessons.filter((l: any) => l.section_id === s.id)
      }))
      setModules(mods)
      setActiveModule(mods[0])
      setActiveLesson(mods[0]?.lessons?.[0] ?? allLessons[0] ?? null)
    } else {
      setModules([{ id: 0, title: 'Course Content', intro: '', outcomes: '', lessons: allLessons }])
      setActiveModule({ id: 0, title: 'Course Content', lessons: allLessons })
      setActiveLesson(allLessons[0] ?? null)
    }
  }

  async function enroll(courseId: number) {
    setEnrolling(courseId)
    await api.post(`/api/student/courses/${courseId}/enroll`, {}).catch(() => {})
    setEnrolling(null)
    api.get('/api/student/courses').then(r => setEnrolled(r.data ?? [])).catch(() => {})
    loadCatalog()
  }

  async function markDone() {
    if (!activeLesson || !activeCourse) return
    setMarking(true)
    const r = await api.post(`/api/student/courses/${activeCourse.id}/lessons/${activeLesson.id}/complete`, {}).catch(() => null)
    if (r) {
      setCompleted(p => new Set([...p, activeLesson.id]))
      setActiveCourse((c: any) => ({ ...c, completion: r.data.completion }))
      setEnrolled(prev => prev.map(c => c.id === activeCourse.id ? { ...c, completion: r.data.completion } : c))
    }
    setMarking(false)
  }

  const filteredEnrolled = enrolled.filter(c => !search || c.title.toLowerCase().includes(search.toLowerCase()))
  const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels']
  const languages = [...new Set(catalog.map(c => c.language).filter(Boolean))]

  // ── Course viewer ──────────────────────────────────────────────────────────
  if (activeCourse) {
    const moduleLessons: any[] = activeModule?.lessons ?? []
    const allFlat = modules.flatMap(m => m.lessons)
    const flatIdx = allFlat.findIndex((l: any) => l.id === activeLesson?.id)

    return (
      <div style={{ display: 'flex', height: 'calc(100vh - var(--nh))', overflow: 'hidden' }}>
        {/* Left: module + lesson list */}
        <div style={{ width: 280, background: 'var(--bg2)', borderRight: '1px solid var(--bdr)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--bdr)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="btn bo sm" onClick={() => setActiveCourse(null)}>← Back</button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activeCourse.flag_emoji} {activeCourse.title}</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--neon)', marginTop: 2 }}>{activeCourse.completion}% complete</div>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {modules.map((mod, mi) => (
              <div key={mod.id ?? mi}>
                {/* Module header */}
                <div onClick={() => setActiveModule(mod)} style={{ padding: '10px 16px', cursor: 'pointer', background: activeModule?.id === mod.id ? 'rgba(191,255,0,.06)' : 'transparent', borderLeft: `3px solid ${activeModule?.id === mod.id ? 'var(--neon)' : 'transparent'}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: 'var(--mu)', minWidth: 20 }}>M{mi + 1}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, flex: 1 }}>{mod.title}</span>
                  <span style={{ fontSize: 9, color: 'var(--mu)', fontFamily: 'JetBrains Mono' }}>{mod.lessons?.length ?? 0}</span>
                </div>
                {/* Lessons in this module */}
                {activeModule?.id === mod.id && mod.lessons?.map((l: any, li: number) => (
                  <div key={l.id} onClick={() => setActiveLesson(l)} style={{ padding: '8px 16px 8px 36px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, background: activeLesson?.id === l.id ? 'rgba(191,255,0,.1)' : 'transparent', borderLeft: `3px solid ${activeLesson?.id === l.id ? 'var(--neon)' : 'transparent'}` }}>
                    <span style={{ fontSize: 13 }}>{completed.has(l.id) ? '<CheckCircle2 size={16} />' : TYPE_ICON[l.lesson_type] ?? <FileText size={16} />}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: activeLesson?.id === l.id ? 700 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.title}</div>
                      <div style={{ fontSize: 9, color: 'var(--mu)', fontFamily: 'JetBrains Mono' }}>{l.duration_min}min · {l.lesson_type}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--bdr)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 10, color: 'var(--mu)' }}>Progress</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--neon)' }}>{activeCourse.completion}%</span>
            </div>
            <div className="pt"><div className="pf" style={{ width: `${activeCourse.completion}%` }} /></div>
          </div>
        </div>

        {/* Right: lesson content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
          {/* Module intro banner */}
          {activeModule && (activeModule.intro || activeModule.outcomes) && (
            <div style={{ display: 'grid', gridTemplateColumns: activeModule.intro && activeModule.outcomes ? '1fr 1fr' : '1fr', gap: 12, marginBottom: 24 }}>
              {activeModule.intro && (
                <div style={{ padding: 16, background: 'rgba(191,255,0,.04)', border: '1px solid rgba(191,255,0,.15)', borderRadius: 10 }}>
                  <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: 'var(--neon)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}><Pin size={16} /> What to Expect</div>
                  <p style={{ fontSize: 12, color: 'var(--mu)', lineHeight: 1.7, margin: 0 }}>{activeModule.intro}</p>
                </div>
              )}
              {activeModule.outcomes && (
                <div style={{ padding: 16, background: 'rgba(0,255,127,.04)', border: '1px solid rgba(0,255,127,.15)', borderRadius: 10 }}>
                  <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: 'var(--ok)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}><Target size={16} /> Learning Outcomes</div>
                  <p style={{ fontSize: 12, color: 'var(--mu)', lineHeight: 1.7, margin: 0 }}>{activeModule.outcomes}</p>
                </div>
              )}
            </div>
          )}

          {!activeLesson ? (
            <div style={{ color: 'var(--mu)', fontFamily: 'JetBrains Mono', fontSize: 11, textAlign: 'center', paddingTop: 60 }}>Select a lesson to begin</div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 42, height: 42, background: 'rgba(191,255,0,.08)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{TYPE_ICON[activeLesson.lesson_type] ?? <FileText size={16} />}</div>
                <div>
                  <div style={{ fontFamily: 'Syne', fontSize: 17, fontWeight: 800 }}>{activeLesson.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--mu)' }}>{activeLesson.duration_min} min · {activeLesson.lesson_type}</div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  {completed.has(activeLesson.id)
                    ? <span style={{ fontSize: 12, color: 'var(--ok)', fontFamily: 'JetBrains Mono' }}><Check size={16} /> Completed</span>
                    : <button className="btn bo sm" disabled={marking} onClick={markDone}><Check size={16} /> Mark Done</button>
                  }
                </div>
              </div>

              {/* Video/content area */}
              <LessonPlayer lesson={activeLesson} />

              {activeLesson.description && (
                <div className="card2" style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: 'Syne', fontSize: 11, fontWeight: 800, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.05em' }}>About This Lesson</div>
                  <p style={{ fontSize: 12, color: 'var(--mu)', lineHeight: 1.7, margin: 0 }}>{activeLesson.description}</p>
                </div>
              )}

              {/* End-of-module quiz prompt */}
              {activeModule?.has_quiz && moduleLessons.indexOf(activeLesson) === moduleLessons.length - 1 && (
                <div style={{ padding: 18, background: 'rgba(191,255,0,.05)', border: '1px solid rgba(191,255,0,.2)', borderRadius: 10, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 28 }}><FlaskConical size={16} /></span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{activeModule.quiz_title || 'End-of-Module Test'}</div>
                    <div style={{ fontSize: 11, color: 'var(--mu)' }}>Complete this test to unlock the next module</div>
                  </div>
                  <button className="btn bp sm" onClick={() => nav('/dashboard/quizzes')}>Take Test →</button>
                </div>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn bo sm" disabled={flatIdx <= 0} onClick={() => setActiveLesson(allFlat[flatIdx - 1])}>← Previous</button>
                <button className="btn bp sm" disabled={flatIdx >= allFlat.length - 1} onClick={() => setActiveLesson(allFlat[flatIdx + 1])}>Next →</button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // ── Course list ────────────────────────────────────────────────────────────
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
          <span className="si2"><Search size={16} /></span>
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

      {/* Enrolled tab */}
      {tab === 'enrolled' && (
        <>
          {loadingEnrolled && <div className="loading" />}
          {!loadingEnrolled && filteredEnrolled.length === 0 && (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--mu)', fontFamily: 'JetBrains Mono', fontSize: 12 }}>
              No enrolled courses yet.{' '}
              <span style={{ color: 'var(--neon)', cursor: 'pointer' }} onClick={() => setTab('catalog')}>Browse the catalog →</span>
            </div>
          )}
          <div className="g3">
            {filteredEnrolled.map(c => (
              <div key={c.id} className="card" style={{ padding: 0, cursor: 'pointer' }} onClick={() => openCourse(c)}>
                <div style={{ height: 110, background: c.thumbnail_url ? undefined : 'linear-gradient(135deg,#1a2a0a,#0f1f05)', backgroundImage: c.thumbnail_url ? `url(${c.thumbnail_url})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, position: 'relative', borderRadius: '14px 14px 0 0' }}>
                  {!c.thumbnail_url && c.flag_emoji}
                  <div style={{ position: 'absolute', top: 8, right: 8 }}>
                    <span className={`bdg ${c.completion >= 100 ? 'bk' : c.completion > 0 ? 'bn' : 'bm'}`}>
                      {c.completion >= 100 ? 'Done' : c.completion > 0 ? 'In Progress' : 'Not Started'}
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
                  <button className="btn bp sm" style={{ width: '100%' }}><Play size={16} /> Continue Learning</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Catalog tab */}
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
                    {c.price === 0 && <div style={{ position: 'absolute', top: 8, right: 8 }}><span className="bdg bk" style={{ fontSize: 9 }}>FREE</span></div>}
                  </div>
                  <div style={{ padding: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{c.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--mu)', marginBottom: 6 }}>{c.language} · {c.lesson_count} lessons</div>
                    {c.description && <div style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 8, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{c.description}</div>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                      <div className="av avs">{c.instructor_initials}</div>
                      <span style={{ fontSize: 11, color: 'var(--mu)', flex: 1 }}>{c.instructor}</span>
                      {c.rating > 0 && <span style={{ fontSize: 11, color: 'var(--wa)' }}><Star size={16} /> {c.rating}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16, color: c.price === 0 ? 'var(--ok)' : 'var(--neon)' }}>{c.price === 0 ? 'Free' : `$${c.price}`}</span>
                      <span style={{ fontSize: 10, color: 'var(--mu)' }}>{c.student_count} enrolled</span>
                    </div>
                    {isEnrolled
                      ? <button className="btn bo sm" style={{ width: '100%', color: 'var(--ok)', borderColor: 'var(--ok)' }} onClick={() => setTab('enrolled')}><Check size={16} /> Enrolled — Go to Course</button>
                      : <button className="btn bp sm" style={{ width: '100%' }} disabled={enrolling === c.id} onClick={() => enroll(c.id)}>{enrolling === c.id ? 'Enrolling…' : 'Enroll Now'}</button>
                    }
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
