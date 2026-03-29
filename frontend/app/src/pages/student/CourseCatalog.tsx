import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/client'
import { Check, Search, Star, X } from 'lucide-react'

const LANGUAGES = ['English','French','Spanish','German','Japanese','Mandarin','Portuguese','Italian','Russian','Korean','Arabic','Kinyarwanda']
const LEVELS = ['Beginner','Intermediate','Advanced','All Levels']

export default function CourseCatalog() {
  const nav = useNavigate()
  const [courses, setCourses] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [lang, setLang] = useState('')
  const [level, setLevel] = useState('')
  const [enrolling, setEnrolling] = useState<number | null>(null)

  useEffect(() => {
    const p: any = {}
    if (search) p.search = search
    if (lang) p.language = lang
    if (level) p.level = level
    api.get('/api/student/catalog', { params: p }).then(r => setCourses(r.data ?? [])).catch(() => {})
  }, [search, lang, level])

  async function enroll(id: number) {
    setEnrolling(id)
    await api.post(`/api/student/courses/${id}/enroll`, {}).catch(() => {})
    setEnrolling(null)
    const p: any = {}
    if (search) p.search = search
    if (lang) p.language = lang
    if (level) p.level = level
    api.get('/api/student/catalog', { params: p }).then(r => setCourses(r.data ?? [])).catch(() => {})
  }

  const levelColor: Record<string, string> = { Beginner: 'var(--ok)', Intermediate: 'var(--wa)', Advanced: 'var(--er)', 'All Levels': 'var(--in)' }

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Course Catalog</h1><p>Explore expert-led language courses</p></div>
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="sw" style={{ flex: 1, maxWidth: 480 }}>
          <span className="si2"><Search size={16} /></span>
          <input className="inp" placeholder="Search courses, instructors, topics…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="inp" style={{ width: 'auto' }} value={lang} onChange={e => setLang(e.target.value)}>
          <option value="">All Languages</option>
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select className="inp" style={{ width: 'auto' }} value={level} onChange={e => setLevel(e.target.value)}>
          <option value="">All Levels</option>
          {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        {(lang || level || search) && <button className="btn bg sm" onClick={() => { setSearch(''); setLang(''); setLevel('') }}>Clear <X size={16} /></button>}
      </div>

      <div style={{ fontSize: 12, color: 'var(--mu)', marginBottom: 16, fontFamily: 'JetBrains Mono' }}>
        {courses.length} course{courses.length !== 1 ? 's' : ''} found
      </div>

      {courses.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--mu)', fontFamily: 'JetBrains Mono', fontSize: 12 }}>No courses found</div>
      )}

      <div className="g3">
        {courses.map(c => (
          <div key={c.id} className="card" style={{ padding: 0, cursor: 'pointer' }} onClick={() => nav(`/dashboard/catalog/${c.id}`)}>
            <div style={{ height: 120, background: c.thumbnail_url ? undefined : 'linear-gradient(135deg,#1a2a0a,#0f1f05)', backgroundImage: c.thumbnail_url ? `url(${c.thumbnail_url})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, position: 'relative', borderRadius: '14px 14px 0 0' }}>
              {!c.thumbnail_url && c.flag_emoji}
              <div style={{ position: 'absolute', top: 8, left: 8 }}>
                <span style={{ background: 'rgba(0,0,0,.6)', color: levelColor[c.level] || 'var(--mu)', fontSize: 9, padding: '3px 8px', borderRadius: 4, fontFamily: 'JetBrains Mono', fontWeight: 700 }}>{c.level}</span>
              </div>
              {c.price === 0 && <div style={{ position: 'absolute', top: 8, right: 8 }}><span className="bdg bk" style={{ fontSize: 9 }}>FREE</span></div>}
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{c.title}</div>
              <div style={{ fontSize: 10, color: 'var(--mu)', marginBottom: 6 }}>{c.language} · {c.lesson_count} lessons</div>
              {c.description && <div style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 8, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{c.description}</div>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <div className="av avs">{c.instructor_initials}</div>
                <span style={{ fontSize: 11, color: 'var(--mu)', flex: 1 }}>{c.instructor}</span>
                {c.rating > 0 && <span style={{ fontSize: 11, color: 'var(--wa)' }}>⭐ {c.rating}</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16, color: c.price === 0 ? 'var(--ok)' : 'var(--neon)' }}>
                  {c.price === 0 ? 'Free' : `$${c.price}`}
                </span>
                <span style={{ fontSize: 10, color: 'var(--mu)' }}>{c.student_count} enrolled</span>
              </div>
              {c.enrolled ? (
                <button className="btn bo sm" style={{ width: '100%', color: 'var(--ok)', borderColor: 'var(--ok)' }} onClick={e => { e.stopPropagation(); nav('/dashboard/courses') }}>
                  <Check size={16} /> Enrolled — Continue
                </button>
              ) : (
                <button className="btn bp sm" style={{ width: '100%' }} disabled={enrolling === c.id} onClick={e => { e.stopPropagation(); enroll(c.id) }}>
                  {enrolling === c.id ? 'Enrolling…' : 'Enroll Now'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
