import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../../api/client'
import { Check, FileText, Headphones, HelpCircle, Pause, Play, SkipBack, SkipForward, Video, Volume2 } from 'lucide-react'

const TYPE_ICON: Record<string, JSX.Element> = {
  video: <Video size={14} />,
  audio: <Headphones size={14} />,
  text: <FileText size={14} />,
  quiz: <HelpCircle size={14} />,
}

export default function Lessons() {
  const location = useLocation()
  const state = location.state as any

  const [courses, setCourses] = useState<any[]>([])
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [activeLesson, setActiveLesson] = useState<any>(null)
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [marking, setMarking] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState<'Transcript' | 'Notes'>('Transcript')
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

  // Auto-expand the module containing the active lesson
  useEffect(() => {
    if (activeLesson?.module_title) {
      setExpandedModules(prev => new Set([...prev, activeLesson.module_title]))
    }
  }, [activeLesson])

  useEffect(() => {
    api.get('/api/student/courses').then(r => {
      setCourses(r.data)
      const initial = state?.courseId
        ? r.data.find((c: any) => c.id === state.courseId)
        : r.data[0]
      if (initial) setSelectedCourse(initial)
    })
  }, [])

  useEffect(() => {
    if (!selectedCourse) return
    api.get(`/api/student/courses/${selectedCourse.id}/lessons`).then(r => {
      setLessons(r.data)
      const first = r.data[0] ?? null
      setActiveLesson(first)
      setProgress(0)
      // Auto-expand the first module
      if (first?.module_title) setExpandedModules(new Set([first.module_title]))
      else if (first) setExpandedModules(new Set(['Course Content']))
    })
  }, [selectedCourse])

  // Group lessons by module_title (returned by backend)
  const modules: { title: string; lessons: any[] }[] = []
  lessons.forEach(l => {
    const mod = l.module_title || 'Course Content'
    const existing = modules.find(m => m.title === mod)
    if (existing) existing.lessons.push(l)
    else modules.push({ title: mod, lessons: [l] })
  })

  function toggleModule(title: string) {
    setExpandedModules(prev => {
      const next = new Set(prev)
      next.has(title) ? next.delete(title) : next.add(title)
      return next
    })
  }

  async function markDone() {
    if (!activeLesson || !selectedCourse) return
    setMarking(true)
    const r = await api.post(
      `/api/student/courses/${selectedCourse.id}/lessons/${activeLesson.id}/complete`, {}
    ).catch(() => null)
    if (r) {
      setCompleted(p => new Set([...p, activeLesson.id]))
      setSelectedCourse((c: any) => ({ ...c, completion: r.data.completion }))
    }
    setMarking(false)
  }

  const lessonIndex = lessons.findIndex(l => l.id === activeLesson?.id)
  const totalLessons = lessons.length
  const completedCount = completed.size + (selectedCourse?.completed_lessons ?? 0)

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '300px 1fr 300px',
      height: 'calc(100vh - var(--nh))',
      overflow: 'hidden',
      background: 'var(--bg)',
    }}>

      {/* ── LEFT: Module / Lesson sidebar ── */}
      <div style={{
        borderRight: '1px solid var(--bdr)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--bg2)',
      }}>
        {/* Course selector */}
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--bdr)', flexShrink: 0 }}>
          <select
            className="inp"
            style={{ width: '100%', fontSize: 13 }}
            value={selectedCourse?.id ?? ''}
            onChange={e => setSelectedCourse(courses.find(c => c.id === Number(e.target.value)))}
          >
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.flag_emoji} {c.title}</option>
            ))}
          </select>
          {selectedCourse && (
            <div style={{ marginTop: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: 'var(--mu)' }}>Progress</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--neon)' }}>
                  {completedCount}/{totalLessons}
                </span>
              </div>
              <div style={{ height: 3, background: 'var(--bdr)', borderRadius: 99 }}>
                <div style={{
                  height: '100%',
                  width: `${totalLessons ? (completedCount / totalLessons) * 100 : 0}%`,
                  background: 'var(--neon)',
                  borderRadius: 99,
                  transition: 'width .3s',
                }} />
              </div>
            </div>
          )}
        </div>

        {/* Module list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {modules.length === 0 && (
            <div style={{ padding: 20, color: 'var(--mu)', fontSize: 12, textAlign: 'center' }}>
              No lessons yet
            </div>
          )}
          {modules.map((mod, mi) => {
            const open = expandedModules.has(mod.title)
            return (
              <div key={mod.title}>
                {/* Module header */}
                <div
                  onClick={() => toggleModule(mod.title)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--bdr)',
                    background: open ? 'rgba(191,255,0,.03)' : 'transparent',
                    userSelect: 'none',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 2 }}>
                      Module {mi + 1}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{mod.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 2 }}>
                      {mod.lessons.length} lesson{mod.lessons.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <span style={{ color: 'var(--mu)', fontSize: 12, transition: 'transform .2s', transform: open ? 'rotate(90deg)' : 'none' }}>›</span>
                </div>

                {/* Lessons inside module */}
                {open && mod.lessons.map((l, li) => {
                  const isActive = activeLesson?.id === l.id
                  const isDone = completed.has(l.id)
                  return (
                    <div
                      key={l.id}
                      onClick={() => { setActiveLesson(l); setProgress(0); setPlaying(false) }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 16px 10px 24px',
                        cursor: 'pointer',
                        borderBottom: '1px solid rgba(255,255,255,.03)',
                        background: isActive ? 'rgba(191,255,0,.06)' : 'transparent',
                        borderLeft: `3px solid ${isActive ? 'var(--neon)' : 'transparent'}`,
                        transition: 'all .13s',
                      }}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                        background: isDone ? 'rgba(0,255,127,.1)' : isActive ? 'rgba(191,255,0,.1)' : 'var(--card2)',
                        border: `1px solid ${isDone ? 'rgba(0,255,127,.3)' : isActive ? 'rgba(191,255,0,.3)' : 'var(--bdr)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, color: isDone ? 'var(--ok)' : isActive ? 'var(--neon)' : 'var(--mu)',
                        fontFamily: 'JetBrains Mono',
                      }}>
                        {isDone ? <span style={{ fontSize: 11 }}><Check size={16} /></span> : TYPE_ICON[l.lesson_type] ?? <FileText size={11} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 13, fontWeight: isActive ? 600 : 400,
                          color: isActive ? 'var(--fg)' : 'var(--mu)',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {l.title}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--mu2)', marginTop: 2 }}>
                          {l.lesson_type}{l.duration_min ? ` · ${l.duration_min} min` : ''}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── CENTER: Video player + lesson content ── */}
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {!activeLesson ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--mu)', fontFamily: 'JetBrains Mono', fontSize: 12 }}>
            Select a lesson to begin
          </div>
        ) : (
          <>
            {/* Video */}
            <div
              onClick={() => setPlaying(p => !p)}
              style={{
                background: '#000',
                aspectRatio: '16/9',
                flexShrink: 0,
                position: 'relative',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0a1a0a,#000)' }} />
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%',
                  background: 'rgba(191,255,0,.9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto', color: '#000',
                }}>
                  {playing ? <Pause size={24} /> : <Play size={24} />}
                </div>
                <div style={{ marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,.5)' }}>
                  {activeLesson.title}
                </div>
              </div>
              {activeLesson.duration_min && (
                <div style={{
                  position: 'absolute', top: 12, right: 12,
                  background: 'rgba(0,0,0,.7)', padding: '4px 8px',
                  borderRadius: 5, fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--neon)',
                }}>
                  {activeLesson.duration_min}:00
                </div>
              )}
            </div>

            {/* Playback controls */}
            <div style={{
              background: '#0d0d0d', padding: '10px 18px',
              display: 'flex', alignItems: 'center', gap: 12,
              borderBottom: '1px solid var(--bdr)', flexShrink: 0,
            }}>
              <button
                onClick={() => lessonIndex > 0 && setActiveLesson(lessons[lessonIndex - 1])}
                disabled={lessonIndex === 0}
                style={{ background: 'none', border: 'none', color: lessonIndex === 0 ? 'var(--mu2)' : 'var(--fg)', cursor: lessonIndex === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center' }}
              ><SkipBack size={16} /></button>
              <button
                onClick={() => setPlaying(p => !p)}
                style={{ background: 'none', border: 'none', color: 'var(--neon)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >{playing ? <Pause size={18} /> : <Play size={18} />}</button>
              <button
                onClick={() => lessonIndex < totalLessons - 1 && setActiveLesson(lessons[lessonIndex + 1])}
                disabled={lessonIndex === totalLessons - 1}
                style={{ background: 'none', border: 'none', color: lessonIndex === totalLessons - 1 ? 'var(--mu2)' : 'var(--fg)', cursor: lessonIndex === totalLessons - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center' }}
              ><SkipForward size={16} /></button>

              {/* Seek bar */}
              <div
                style={{ flex: 1, height: 4, background: 'var(--bdr)', borderRadius: 99, cursor: 'pointer', position: 'relative' }}
                onClick={e => {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                  setProgress(Math.round(((e.clientX - rect.left) / rect.width) * 100))
                }}
              >
                <div style={{ height: '100%', width: `${progress}%`, background: 'var(--neon)', borderRadius: 99 }} />
              </div>

              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--mu)', whiteSpace: 'nowrap' }}>
                {activeLesson.duration_min ? `${activeLesson.duration_min}:00` : '--:--'}
              </span>
            </div>

            {/* Lesson info */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, marginBottom: 4 }}>
                    {activeLesson.title}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--mu)' }}>
                    {activeLesson.lesson_type}{activeLesson.duration_min ? ` · ${activeLesson.duration_min} min` : ''}
                    {' · '}Lesson {lessonIndex + 1} of {totalLessons}
                  </div>
                </div>
                {completed.has(activeLesson.id) ? (
                  <span style={{ fontSize: 12, color: 'var(--ok)', fontFamily: 'JetBrains Mono', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Check size={16} /> Completed
                  </span>
                ) : (
                  <button
                    className="btn bp sm"
                    disabled={marking}
                    onClick={markDone}
                    style={{ flexShrink: 0 }}
                  >
                    {marking ? '…' : 'Mark Done'}
                  </button>
                )}
              </div>

              {activeLesson.description && (
                <p style={{ fontSize: 13, color: 'var(--mu)', lineHeight: 1.7, marginBottom: 20 }}>
                  {activeLesson.description}
                </p>
              )}

              {/* Prev / Next */}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button
                  className="btn bo sm"
                  disabled={lessonIndex === 0}
                  onClick={() => { setActiveLesson(lessons[lessonIndex - 1]); setProgress(0) }}
                >← Previous</button>
                <button
                  className="btn bp sm"
                  disabled={lessonIndex === totalLessons - 1}
                  onClick={() => { setActiveLesson(lessons[lessonIndex + 1]); setProgress(0) }}
                >Next →</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── RIGHT: Transcript / Notes ── */}
      <div style={{
        borderLeft: '1px solid var(--bdr)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--bg2)',
      }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--bdr)', flexShrink: 0 }}>
          {(['Transcript', 'Notes'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, padding: '14px 0', fontSize: 13, fontWeight: 600,
                color: activeTab === tab ? 'var(--neon)' : 'var(--mu)',
                background: 'none', border: 'none',
                borderBottom: `2px solid ${activeTab === tab ? 'var(--neon)' : 'transparent'}`,
                cursor: 'pointer',
              }}
            >{tab}</button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {activeTab === 'Transcript' && (
            activeLesson ? (
              <div style={{ color: 'var(--mu)', fontSize: 13, lineHeight: 1.8 }}>
                {activeLesson.description
                  ? activeLesson.description
                  : <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}>No transcript available for this lesson.</span>
                }
              </div>
            ) : (
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--mu)' }}>Select a lesson to view transcript.</span>
            )
          )}
          {activeTab === 'Notes' && (
            <textarea
              placeholder="Add your notes here…"
              style={{
                width: '100%', height: 'calc(100% - 8px)',
                background: 'var(--card)', border: '1px solid var(--bdr)',
                borderRadius: 8, padding: 12, color: 'var(--fg)',
                fontSize: 13, resize: 'none', outline: 'none', lineHeight: 1.7,
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
