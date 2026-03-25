import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/client'

const LANGUAGES = [
  { flag: '🇫🇷', name: 'French' }, { flag: '🇬🇧', name: 'English' },
  { flag: '🇪🇸', name: 'Spanish' }, { flag: '🇩🇪', name: 'German' },
  { flag: '🇯🇵', name: 'Japanese' }, { flag: '🇨🇳', name: 'Mandarin' },
  { flag: '🇵🇹', name: 'Portuguese' }, { flag: '🇮🇹', name: 'Italian' },
  { flag: '🇷🇺', name: 'Russian' }, { flag: '🇰🇷', name: 'Korean' },
  { flag: '🇸🇦', name: 'Arabic' }, { flag: '🇳🇱', name: 'Dutch' },
]
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels']
const CATEGORIES = ['Language Basics', 'Conversation', 'Grammar', 'Business', 'Travel', 'Exam Prep', 'Culture', 'Writing', 'Pronunciation']

type LessonDraft = { id?: number; title: string; lesson_type: 'video' | 'text' | 'audio'; duration_min: string; description: string; is_preview: boolean }
type Section = { id?: number; title: string; intro: string; outcomes: string; has_quiz: boolean; quiz_title: string; lessons: LessonDraft[] }
const emptyLesson = (): LessonDraft => ({ title: '', lesson_type: 'video', duration_min: '', description: '', is_preview: false })

const NAV = [
  { id: 'basics', label: 'Basic Info', icon: '📋' },
  { id: 'media', label: 'Media', icon: '🖼️' },
  { id: 'curriculum', label: 'Curriculum', icon: '📚' },
  { id: 'pricing', label: 'Pricing', icon: '💳' },
]

export default function CourseEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [active, setActive] = useState('basics')
  const [courseStatus, setCourseStatus] = useState('')
  const [rejectionFeedback, setRejectionFeedback] = useState('')

  const [form, setForm] = useState({
    title: '', subtitle: '', description: '', category: '', language: '', flag_emoji: '',
    level: '', thumbnail_url: '', intro_video_url: '',
    what_you_learn: '', requirements: '', target_audience: '',
  })
  const [sections, setSections] = useState<Section[]>([{ title: 'Module 1', intro: '', outcomes: '', has_quiz: false, quiz_title: '', lessons: [] }])
  const [activeSec, setActiveSec] = useState(0)
  const [lessonDraft, setLessonDraft] = useState<LessonDraft>(emptyLesson())
  const [pricing, setPricing] = useState({ price: 49.99, is_free: false })

  const refs = { basics: useRef<HTMLDivElement>(null), media: useRef<HTMLDivElement>(null), curriculum: useRef<HTMLDivElement>(null), pricing: useRef<HTMLDivElement>(null) }

  useEffect(() => {
    api.get(`/api/instructor/courses/${id}`).then(r => {
      const c = r.data
      setCourseStatus(c.status); setRejectionFeedback(c.rejection_feedback || '')
      setForm({ title: c.title || '', subtitle: c.subtitle || '', description: c.description || '', category: c.category || '', language: c.language || '', flag_emoji: c.flag_emoji || '', level: c.level || '', thumbnail_url: c.thumbnail_url || '', intro_video_url: c.intro_video_url || '', what_you_learn: c.what_you_learn || '', requirements: c.requirements || '', target_audience: c.target_audience || '' })
      setPricing({ price: c.price || 49.99, is_free: c.is_free || false })
      if (c.sections?.length > 0) {
        setSections(c.sections.map((s: any) => ({ id: s.id, title: s.title, intro: s.intro || '', outcomes: s.outcomes || '', has_quiz: s.has_quiz || false, quiz_title: s.quiz_title || '', lessons: (s.lessons || []).map((l: any) => ({ id: l.id, title: l.title, lesson_type: l.lesson_type || 'video', duration_min: l.duration_min?.toString() || '', description: l.description || '', is_preview: l.is_preview || false })) })))
      } else if (c.loose_lessons?.length > 0) {
        setSections([{ title: 'Module 1', intro: '', outcomes: '', has_quiz: false, quiz_title: '', lessons: c.loose_lessons.map((l: any) => ({ id: l.id, title: l.title, lesson_type: l.lesson_type || 'video', duration_min: l.duration_min?.toString() || '', description: l.description || '', is_preview: l.is_preview || false })) }])
      }
    }).catch(() => navigate('/instructor/courses')).finally(() => setLoading(false))
  }, [id])

  const ff = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))
  const setLang = (name: string) => { const l = LANGUAGES.find(x => x.name === name); setForm(p => ({ ...p, language: name, flag_emoji: l?.flag || '' })) }
  function scrollTo(sid: string) { refs[sid as keyof typeof refs]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); setActive(sid) }

  function addLesson() {
    if (!lessonDraft.title.trim()) return
    setSections(p => p.map((s, i) => i === activeSec ? { ...s, lessons: [...s.lessons, { ...lessonDraft }] } : s))
    setLessonDraft(emptyLesson())
  }

  function removeLesson(si: number, li: number) {
    setSections(p => p.map((s, i) => i === si ? { ...s, lessons: s.lessons.filter((_, j) => j !== li) } : s))
  }

  function addSection() { setSections(p => [...p, { title: `Module ${p.length + 1}`, intro: '', outcomes: '', has_quiz: false, quiz_title: '', lessons: [] }]); setActiveSec(sections.length) }

  async function save(andSubmit = false) {
    if (!form.title.trim() || !form.language || !form.level || !form.description.trim()) {
      setError('Title, description, language and level are required'); scrollTo('basics'); return
    }
    const total = sections.reduce((n, s) => n + s.lessons.length, 0)
    if (total === 0) { setError('Add at least 1 lesson'); scrollTo('curriculum'); return }
    setSaving(true); setError('')
    try {
      await api.patch(`/api/instructor/courses/${id}`, { ...form, price: pricing.is_free ? 0 : pricing.price, is_free: pricing.is_free })
      const existing = await api.get(`/api/instructor/courses/${id}/sections`)
      for (const s of existing.data) await api.delete(`/api/instructor/courses/${id}/sections/${s.id}`)
      for (let si = 0; si < sections.length; si++) {
        const sr = await api.post(`/api/instructor/courses/${id}/sections`, { title: sections[si].title, order: si })
        for (let li = 0; li < sections[si].lessons.length; li++) {
          const l = sections[si].lessons[li]
          await api.post(`/api/instructor/courses/${id}/lessons`, { title: l.title, lesson_type: l.lesson_type, duration_min: parseInt(l.duration_min) || null, description: l.description, section_id: sr.data.id, order: li, is_preview: l.is_preview })
        }
      }
      if (andSubmit) await api.post(`/api/instructor/courses/${id}/submit`, {})
      navigate('/instructor/courses')
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Failed to save'); setSaving(false)
    }
  }

  const totalLessons = sections.reduce((n, s) => n + s.lessons.length, 0)

  if (loading) return <div className="loading" />

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--nh))', overflow: 'hidden' }}>

      {/* Left nav */}
      <div style={{ width: 200, background: 'var(--bg2)', borderRight: '1px solid var(--bdr)', display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 18px 20px', borderBottom: '1px solid var(--bdr)', marginBottom: 12 }}>
          <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '.04em' }}>Edit Course</div>
          <div style={{ fontSize: 11, marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 99, fontFamily: 'JetBrains Mono',
            background: courseStatus === 'rejected' ? 'rgba(255,68,68,.1)' : 'rgba(255,255,255,.06)',
            color: courseStatus === 'rejected' ? 'var(--er)' : 'var(--mu)' }}>
            {courseStatus}
          </div>
        </div>
        {NAV.map(n => (
          <div key={n.id} onClick={() => scrollTo(n.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 500, borderLeft: `2px solid ${active === n.id ? 'var(--neon)' : 'transparent'}`, color: active === n.id ? 'var(--neon)' : 'var(--mu)', background: active === n.id ? 'var(--ndim)' : 'transparent', transition: 'all .13s' }}>
            <span style={{ fontSize: 14 }}>{n.icon}</span>{n.label}
          </div>
        ))}
        <div style={{ marginTop: 'auto', padding: '16px 18px', borderTop: '1px solid var(--bdr)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button className="btn bp" onClick={() => save(true)} disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
            {saving ? '…' : '🚀 Resubmit'}
          </button>
          <button className="btn bo sm" onClick={() => save(false)} disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>💾 Save Draft</button>
          <button className="btn bg sm" onClick={() => navigate(-1)} style={{ width: '100%', justifyContent: 'center' }}>Cancel</button>
        </div>
      </div>

      {/* Right scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
        {courseStatus === 'rejected' && rejectionFeedback && (
          <div className="alr ac" style={{ marginBottom: 20 }}>
            <b>Rejection feedback:</b> {rejectionFeedback}
          </div>
        )}
        {error && <div className="alr ac" style={{ marginBottom: 20 }}>{error}</div>}

        {/* Basic Info */}
        <div ref={refs.basics} style={{ marginBottom: 40 }}>
          <SectionHeader icon="📋" title="Basic Info" sub="Core details about your course" />
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="fg" style={{ marginBottom: 0 }}><label className="lbl">Course Title *</label><input className="inp" value={form.title} onChange={e => ff('title', e.target.value)} /></div>
              <div className="fg" style={{ marginBottom: 0 }}><label className="lbl">Subtitle</label><input className="inp" value={form.subtitle} onChange={e => ff('subtitle', e.target.value)} /></div>
            </div>
            <div className="fg" style={{ marginBottom: 0 }}><label className="lbl">Description *</label><textarea className="inp" rows={4} value={form.description} onChange={e => ff('description', e.target.value)} style={{ resize: 'vertical', minHeight: 90 }} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div className="fg" style={{ marginBottom: 0 }}><label className="lbl">Language *</label>
                <select className="inp" value={form.language} onChange={e => setLang(e.target.value)}>
                  <option value="">Select</option>
                  {LANGUAGES.map(l => <option key={l.name} value={l.name}>{l.flag} {l.name}</option>)}
                </select>
              </div>
              <div className="fg" style={{ marginBottom: 0 }}><label className="lbl">Level *</label>
                <select className="inp" value={form.level} onChange={e => ff('level', e.target.value)}>
                  <option value="">Select</option>
                  {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="fg" style={{ marginBottom: 0 }}><label className="lbl">Category</label>
                <select className="inp" value={form.category} onChange={e => ff('category', e.target.value)}>
                  <option value="">Select</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="fg" style={{ marginBottom: 0 }}><label className="lbl">What Students Will Learn</label><textarea className="inp" rows={3} value={form.what_you_learn} onChange={e => ff('what_you_learn', e.target.value)} style={{ resize: 'vertical' }} /></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="fg" style={{ marginBottom: 0 }}><label className="lbl">Requirements</label><input className="inp" value={form.requirements} onChange={e => ff('requirements', e.target.value)} /></div>
                <div className="fg" style={{ marginBottom: 0 }}><label className="lbl">Target Audience</label><input className="inp" value={form.target_audience} onChange={e => ff('target_audience', e.target.value)} /></div>
              </div>
            </div>
          </div>
        </div>

        {/* Media */}
        <div ref={refs.media} style={{ marginBottom: 40 }}>
          <SectionHeader icon="🖼️" title="Media" sub="Thumbnail and intro video" />
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="fg" style={{ marginBottom: 0 }}>
                <label className="lbl">Thumbnail URL</label>
                <input className="inp" value={form.thumbnail_url} onChange={e => ff('thumbnail_url', e.target.value)} />
                {form.thumbnail_url && <img src={form.thumbnail_url} alt="" onError={e => (e.currentTarget.style.display = 'none')} style={{ marginTop: 10, width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--bdr)' }} />}
              </div>
              <div className="fg" style={{ marginBottom: 0 }}>
                <label className="lbl">Intro Video URL</label>
                <input className="inp" value={form.intro_video_url} onChange={e => ff('intro_video_url', e.target.value)} />
                {!form.thumbnail_url && <div style={{ marginTop: 10, height: 140, background: 'var(--card2)', borderRadius: 8, border: '1px solid var(--bdr)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>{form.flag_emoji || '📚'}</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Curriculum */}
        <div ref={refs.curriculum} style={{ marginBottom: 40 }}>
          <SectionHeader icon="📚" title="Curriculum" sub="Organize your course into sections and lessons" />
          <div className="card">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
              {sections.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <div onClick={() => setActiveSec(i)} style={{ padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all .13s', background: activeSec === i ? 'var(--neon)' : 'var(--card2)', color: activeSec === i ? '#000' : 'var(--mu)', border: `1px solid ${activeSec === i ? 'var(--neon)' : 'var(--bdr)'}` }}>
                    {s.title} <span style={{ opacity: .7 }}>({s.lessons.length})</span>
                  </div>
                  {sections.length > 1 && <span onClick={() => { setSections(p => p.filter((_, j) => j !== i)); setActiveSec(Math.max(0, i - 1)) }} style={{ cursor: 'pointer', color: 'var(--mu)', fontSize: 11, padding: '0 2px' }}>✕</span>}
                </div>
              ))}
              <button className="btn bo sm" onClick={addSection}>+ Add Module</button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="lbl">Module Title</label>
              <input className="inp" value={sections[activeSec]?.title} onChange={e => setSections(p => p.map((s, i) => i === activeSec ? { ...s, title: e.target.value } : s))} />
            </div>
            {/* Module intro */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div className="fg" style={{ marginBottom: 0 }}>
                <label className="lbl">📌 What to Expect (module intro)</label>
                <textarea className="inp" rows={3} placeholder="Briefly describe what this module covers..." value={sections[activeSec]?.intro} onChange={e => setSections(p => p.map((s, i) => i === activeSec ? { ...s, intro: e.target.value } : s))} style={{ resize: 'vertical' }} />
              </div>
              <div className="fg" style={{ marginBottom: 0 }}>
                <label className="lbl">🎯 Learning Outcomes (what learners will know)</label>
                <textarea className="inp" rows={3} placeholder="By the end of this module, learners will be able to..." value={sections[activeSec]?.outcomes} onChange={e => setSections(p => p.map((s, i) => i === activeSec ? { ...s, outcomes: e.target.value } : s))} style={{ resize: 'vertical' }} />
              </div>
            </div>
            {sections[activeSec]?.lessons.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                {sections[activeSec].lessons.map((l, li) => (
                  <div key={li} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--card2)', border: '1px solid var(--bdr)', borderRadius: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 16 }}>{l.lesson_type === 'video' ? '📹' : l.lesson_type === 'audio' ? '🎧' : '📝'}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{l.title}{l.is_preview && <span style={{ marginLeft: 8, fontSize: 9, color: 'var(--neon)', fontFamily: 'JetBrains Mono', background: 'rgba(191,255,0,.1)', padding: '2px 6px', borderRadius: 4 }}>FREE PREVIEW</span>}</div>
                      {(l.duration_min || l.description) && <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 2 }}>{l.duration_min ? `${l.duration_min} min` : ''}{l.duration_min && l.description ? ' · ' : ''}{l.description}</div>}
                    </div>
                    <button className="btn bd sm" onClick={() => removeLesson(activeSec, li)}>Remove</button>
                  </div>
                ))}
              </div>
            )}
            {/* End-of-module quiz */}
            <div style={{ margin: '16px 0', padding: 14, background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 10 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: sections[activeSec]?.has_quiz ? 12 : 0 }}>
                <div className={`tgl${sections[activeSec]?.has_quiz ? ' on' : ''}`} onClick={() => setSections(p => p.map((s, i) => i === activeSec ? { ...s, has_quiz: !s.has_quiz } : s))} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>🧪 End-of-module test</span>
                <span style={{ fontSize: 11, color: 'var(--mu)' }}>Students must pass before moving to the next module</span>
              </label>
              {sections[activeSec]?.has_quiz && (
                <input className="inp" placeholder="Quiz title (e.g. Module 1 Assessment)" value={sections[activeSec]?.quiz_title} onChange={e => setSections(p => p.map((s, i) => i === activeSec ? { ...s, quiz_title: e.target.value } : s))} />
              )}
            </div>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>Add Lesson</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 10, marginBottom: 10 }}>
                <input className="inp" placeholder="Lesson title *" value={lessonDraft.title} onChange={e => setLessonDraft(d => ({ ...d, title: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addLesson()} />
                <select className="inp" value={lessonDraft.lesson_type} onChange={e => setLessonDraft(d => ({ ...d, lesson_type: e.target.value as any }))}>
                  <option value="video">📹 Video</option>
                  <option value="text">📝 Text</option>
                  <option value="audio">🎧 Audio</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10, marginBottom: 12 }}>
                <input className="inp" type="number" min={1} placeholder="Duration (min)" value={lessonDraft.duration_min} onChange={e => setLessonDraft(d => ({ ...d, duration_min: e.target.value }))} />
                <input className="inp" placeholder="Short description (optional)" value={lessonDraft.description} onChange={e => setLessonDraft(d => ({ ...d, description: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--mu)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={lessonDraft.is_preview} onChange={e => setLessonDraft(d => ({ ...d, is_preview: e.target.checked }))} />
                  Mark as free preview
                </label>
                <button className="btn bp sm" onClick={addLesson}>+ Add Lesson</button>
              </div>
            </div>
            <div style={{ marginTop: 14, fontSize: 11, color: 'var(--mu)', fontFamily: 'JetBrains Mono' }}>
              {totalLessons} lesson{totalLessons !== 1 ? 's' : ''} across {sections.length} module{sections.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div ref={refs.pricing} style={{ marginBottom: 40 }}>
          <SectionHeader icon="💳" title="Pricing" sub="Set your course price" />
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[{ label: 'Free', val: true, icon: '🎁', sub: 'Maximum reach, no charge' }, { label: 'Paid', val: false, icon: '💳', sub: 'Earn revenue from students' }].map(opt => (
                <div key={opt.label} onClick={() => setPricing(p => ({ ...p, is_free: opt.val }))}
                  style={{ padding: 18, borderRadius: 10, border: `2px solid ${pricing.is_free === opt.val ? 'var(--neon)' : 'var(--bdr)'}`, background: pricing.is_free === opt.val ? 'rgba(191,255,0,.05)' : 'var(--card2)', cursor: 'pointer' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{opt.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{opt.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--mu)' }}>{opt.sub}</div>
                </div>
              ))}
            </div>
            {!pricing.is_free && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'end' }}>
                <div className="fg" style={{ marginBottom: 0 }}><label className="lbl">Price (USD)</label><input className="inp" type="number" min={0} step={0.01} value={pricing.price} onChange={e => setPricing(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} /></div>
                <div style={{ padding: '14px 18px', background: 'var(--card2)', borderRadius: 10, border: '1px solid var(--bdr)' }}>
                  <div style={{ fontSize: 11, color: 'var(--mu)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Your earnings / sale</div>
                  <div style={{ fontFamily: 'Syne', fontSize: 26, fontWeight: 800, color: 'var(--neon)' }}>${(pricing.price * 0.8).toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 2 }}>After 20% platform fee</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 12, marginBottom: 32 }}>
          <div style={{ fontSize: 13, color: 'var(--mu)' }}>
            {form.title ? <><span style={{ color: 'var(--fg)', fontWeight: 600 }}>{form.title}</span> · </> : ''}
            {totalLessons} lesson{totalLessons !== 1 ? 's' : ''} · {pricing.is_free ? 'Free' : `$${pricing.price}`}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn bo" onClick={() => navigate(-1)}>Cancel</button>
            <button className="btn bo" onClick={() => save(false)} disabled={saving}>💾 Save Draft</button>
            <button className="btn bp" onClick={() => save(true)} disabled={saving}>{saving ? 'Saving…' : '🚀 Save & Resubmit'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(191,255,0,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{icon}</div>
      <div>
        <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 15, textTransform: 'uppercase', letterSpacing: '.02em' }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--mu)' }}>{sub}</div>
      </div>
    </div>
  )
}
