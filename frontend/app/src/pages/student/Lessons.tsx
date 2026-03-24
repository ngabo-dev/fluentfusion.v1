import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../../api/client'

const TYPE_ICON: Record<string, string> = { video: '▶️', quiz: '📝', reading: '📖', exercise: '✏️' }

export default function Lessons() {
  const location = useLocation()
  const state = location.state as any
  const [courses, setCourses] = useState<any[]>([])
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [activeLesson, setActiveLesson] = useState<any>(null)
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [marking, setMarking] = useState(false)

  useEffect(() => {
    api.get('/api/student/courses').then(r => {
      setCourses(r.data)
      const initial = state?.courseId ? r.data.find((c: any) => c.id === state.courseId) : r.data[0]
      if (initial) setSelectedCourse(initial)
    })
  }, [])

  useEffect(() => {
    if (selectedCourse) {
      api.get(`/api/student/courses/${selectedCourse.id}/lessons`).then(r => {
        setLessons(r.data)
        setActiveLesson(r.data[0] ?? null)
      })
    }
  }, [selectedCourse])

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Lessons</h1><p>Watch, read and practice your way to fluency</p></div>
        <div className="pa">
          <select className="sel" style={{ width: 220 }} value={selectedCourse?.id ?? ''} onChange={e => setSelectedCourse(courses.find(c => c.id === Number(e.target.value)))}>
            {courses.map(c => <option key={c.id} value={c.id}>{c.flag_emoji} {c.title}</option>)}
          </select>
        </div>
      </div>

      {!selectedCourse ? <div className="loading" /> : (
        <div className="bl" style={{ height: 'calc(100vh - var(--nh) - 110px)' }}>
          {/* Lesson list sidebar */}
          <div className="bls">
            <div className="blh">
              <span style={{ fontFamily: 'Syne', fontSize: 11, fontWeight: 800 }}>{selectedCourse.flag_emoji} {selectedCourse.title}</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--mu)' }}>{lessons.length} lessons</span>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {lessons.length === 0 && <div style={{ padding: 16, color: 'var(--mu)', fontSize: 11, textAlign: 'center' }}>No lessons yet</div>}
              {lessons.map((l, i) => (
                <div key={l.id} className={`li2${activeLesson?.id === l.id ? ' active' : ''}`} onClick={() => setActiveLesson(l)}>
                  <span className="lnum">{String(i + 1).padStart(2, '0')}</span>
                  <div className="lesson-icon">{TYPE_ICON[l.lesson_type] ?? '📄'}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ln">{l.title}</div>
                    <div className="lt">{l.duration_min} min · {l.lesson_type}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Course progress */}
            <div style={{ padding: '10px 14px', borderTop: '1px solid var(--bdr)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 10, color: 'var(--mu)' }}>Course Progress</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--neon)' }}>{selectedCourse.completion}%</span>
              </div>
              <div className="pt"><div className="pf" style={{ width: `${selectedCourse.completion}%` }} /></div>
            </div>
          </div>

          {/* Lesson content */}
          <div className="bc">
            {!activeLesson ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--mu)', fontFamily: 'JetBrains Mono', fontSize: 11 }}>Select a lesson to begin</div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, background: 'rgba(191,255,0,.08)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{TYPE_ICON[activeLesson.lesson_type] ?? '📄'}</div>
                  <div>
                    <div style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 800 }}>{activeLesson.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--mu)' }}>{activeLesson.duration_min} min · {activeLesson.lesson_type}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                    {completed.has(activeLesson.id) ? (
                      <span style={{ fontSize: 12, color: 'var(--ok)', fontFamily: 'JetBrains Mono' }}>✓ Completed</span>
                    ) : (
                      <button className="btn bo sm" disabled={marking} onClick={async () => {
                        setMarking(true)
                        const r = await api.post(`/api/student/courses/${selectedCourse.id}/lessons/${activeLesson.id}/complete`, {}).catch(() => null)
                        if (r) {
                          setCompleted(p => new Set([...p, activeLesson.id]))
                          setSelectedCourse((c: any) => ({ ...c, completion: r.data.completion }))
                        }
                        setMarking(false)
                      }}>✓ Mark Done</button>
                    )}
                  </div>
                </div>

                {/* Video placeholder */}
                <div style={{ width: '100%', aspectRatio: '16/9', background: 'var(--card2)', border: '1px solid var(--bdr)', borderRadius: 'var(--rl)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>{TYPE_ICON[activeLesson.lesson_type] ?? '📄'}</div>
                    <div style={{ fontFamily: 'Syne', fontSize: 14, fontWeight: 800, marginBottom: 6 }}>{activeLesson.title}</div>
                    <button className="btn bp">▶ Play Lesson</button>
                  </div>
                  <div style={{ position: 'absolute', bottom: 12, right: 12, fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--mu)', background: 'rgba(0,0,0,.6)', padding: '3px 8px', borderRadius: 4 }}>{activeLesson.duration_min}:00</div>
                </div>

                {activeLesson.description && (
                  <div className="card2" style={{ marginBottom: 14 }}>
                    <div style={{ fontFamily: 'Syne', fontSize: 11, fontWeight: 800, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.05em' }}>About This Lesson</div>
                    <p style={{ fontSize: 12, color: 'var(--mu)', lineHeight: 1.7 }}>{activeLesson.description}</p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn bo sm" disabled={lessons.indexOf(activeLesson) === 0} onClick={() => setActiveLesson(lessons[lessons.indexOf(activeLesson) - 1])}>← Previous</button>
                  <button className="btn bp sm" disabled={lessons.indexOf(activeLesson) === lessons.length - 1} onClick={() => setActiveLesson(lessons[lessons.indexOf(activeLesson) + 1])}>Next →</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
