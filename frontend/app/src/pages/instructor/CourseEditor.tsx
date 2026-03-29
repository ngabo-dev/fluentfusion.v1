import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/client'
import { BookOpen, ClipboardList, CreditCard, FileText, FlaskConical, Gift, Headphones, Image, Pin, Rocket, Save, Target, Video, X, Plus, Trash2, CheckCircle } from 'lucide-react'

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

type LessonDraft = { id?: number; title: string; lesson_type: 'video' | 'text' | 'audio'; duration_min: string; description: string; is_preview: boolean; video_url: string; content: string }
type QuizQuestion = { id?: number; question_text: string; question_type: string; options: string; correct_answer: string; explanation: string; points: number }
type ModuleQuiz = { id?: number; title: string; position: 'start' | 'middle' | 'end'; passing_score: number; time_limit_min: number | null; is_required: boolean; questions: QuizQuestion[] }
type Module = { id?: number; title: string; description: string; lessons: LessonDraft[]; quizzes: ModuleQuiz[] }

const emptyLesson = (): LessonDraft => ({ title: '', lesson_type: 'video', duration_min: '', description: '', is_preview: false, video_url: '', content: '' })
const emptyQuizQuestion = (): QuizQuestion => ({ question_text: '', question_type: 'multiple_choice', options: JSON.stringify(['', '', '', '']), correct_answer: '', explanation: '', points: 1 })
const emptyQuiz = (): ModuleQuiz => ({ title: '', position: 'end', passing_score: 70, time_limit_min: null, is_required: true, questions: [] })

const NAV = [
  { id: 'basics', label: 'Basic Info', icon: <ClipboardList size={16} /> },
  { id: 'media', label: 'Media', icon: '️' },
  { id: 'curriculum', label: 'Curriculum', icon: <BookOpen size={16} /> },
  { id: 'pricing', label: 'Pricing', icon: <CreditCard size={16} /> },
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
  const [modules, setModules] = useState<Module[]>([{ title: 'Module 1', description: '', lessons: [], quizzes: [] }])
  const [activeModule, setActiveModule] = useState(0)
  const [lessonDraft, setLessonDraft] = useState<LessonDraft>(emptyLesson())
  const [pricing, setPricing] = useState({ price: 49.99, is_free: false })

  const refs = { basics: useRef<HTMLDivElement>(null), media: useRef<HTMLDivElement>(null), curriculum: useRef<HTMLDivElement>(null), pricing: useRef<HTMLDivElement>(null) }

  useEffect(() => {
    api.get(`/api/instructor/courses/${id}`).then(r => {
      const c = r.data
      setCourseStatus(c.status); setRejectionFeedback(c.rejection_feedback || '')
      setForm({ title: c.title || '', subtitle: c.subtitle || '', description: c.description || '', category: c.category || '', language: c.language || '', flag_emoji: c.flag_emoji || '', level: c.level || '', thumbnail_url: c.thumbnail_url || '', intro_video_url: c.intro_video_url || '', what_you_learn: c.what_you_learn || '', requirements: c.requirements || '', target_audience: c.target_audience || '' })
      setPricing({ price: c.price || 49.99, is_free: c.is_free || false })
      if (c.modules?.length > 0) {
        setModules(c.modules.map((m: any) => ({
          id: m.id,
          title: m.title,
          description: m.description || '',
          lessons: (m.lessons || []).map((l: any) => ({ id: l.id, title: l.title, lesson_type: l.lesson_type || 'video', duration_min: l.duration_min?.toString() || '', description: l.description || '', is_preview: l.is_preview || false, video_url: l.video_url || '', content: l.content || '' })),
          quizzes: (m.quizzes || []).map((q: any) => ({
            id: q.id,
            title: q.title,
            position: q.position || 'end',
            passing_score: q.passing_score || 70,
            time_limit_min: q.time_limit_min,
            is_required: q.is_required !== false,
            questions: (q.questions || []).map((qu: any) => ({
              id: qu.id,
              question_text: qu.question_text,
              question_type: qu.question_type || 'multiple_choice',
              options: qu.options || JSON.stringify(['', '', '', '']),
              correct_answer: qu.correct_answer,
              explanation: qu.explanation || '',
              points: qu.points || 1
            }))
          }))
        })))
      } else if (c.loose_lessons?.length > 0) {
        setModules([{ title: 'Module 1', description: '', lessons: c.loose_lessons.map((l: any) => ({ id: l.id, title: l.title, lesson_type: l.lesson_type || 'video', duration_min: l.duration_min?.toString() || '', description: l.description || '', is_preview: l.is_preview || false, video_url: l.video_url || '', content: l.content || '' })), quizzes: [] }])
      }
    }).catch(() => navigate('/instructor/courses')).finally(() => setLoading(false))
  }, [id])

  const ff = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))
  const setLang = (name: string) => { const l = LANGUAGES.find(x => x.name === name); setForm(p => ({ ...p, language: name, flag_emoji: l?.flag || '' })) }
  function scrollTo(sid: string) { refs[sid as keyof typeof refs]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); setActive(sid) }

  function addLesson() {
    if (!lessonDraft.title.trim()) return
    setModules(p => p.map((m, i) => i === activeModule ? { ...m, lessons: [...m.lessons, { ...lessonDraft }] } : m))
    setLessonDraft(emptyLesson())
  }

  function removeLesson(mi: number, li: number) {
    setModules(p => p.map((m, i) => i === mi ? { ...m, lessons: m.lessons.filter((_, j) => j !== li) } : m))
  }

  function addModule() { setModules(p => [...p, { title: `Module ${p.length + 1}`, description: '', lessons: [], quizzes: [] }]); setActiveModule(modules.length) }

  function removeModule(mi: number) {
    if (modules.length <= 1) return
    setModules(p => p.filter((_, i) => i !== mi))
    setActiveModule(Math.max(0, mi - 1))
  }

  function addQuiz() {
    setModules(p => p.map((m, i) => i === activeModule ? { ...m, quizzes: [...m.quizzes, emptyQuiz()] } : m))
  }

  function updateQuiz(mi: number, qi: number, updates: Partial<ModuleQuiz>) {
    setModules(p => p.map((m, i) => i === mi ? { ...m, quizzes: m.quizzes.map((q, j) => j === qi ? { ...q, ...updates } : q) } : m))
  }

  function removeQuiz(mi: number, qi: number) {
    setModules(p => p.map((m, i) => i === mi ? { ...m, quizzes: m.quizzes.filter((_, j) => j !== qi) } : m))
  }

  function addQuizQuestion(mi: number, qi: number) {
    setModules(p => p.map((m, i) => i === mi ? { ...m, quizzes: m.quizzes.map((q, j) => j === qi ? { ...q, questions: [...q.questions, emptyQuizQuestion()] } : q) } : m))
  }

  function updateQuizQuestion(mi: number, qi: number, qqi: number, updates: Partial<QuizQuestion>) {
    setModules(p => p.map((m, i) => i === mi ? { ...m, quizzes: m.quizzes.map((q, j) => j === qi ? { ...q, questions: q.questions.map((qu, k) => k === qqi ? { ...qu, ...updates } : qu) } : q) } : m))
  }

  function removeQuizQuestion(mi: number, qi: number, qqi: number) {
    setModules(p => p.map((m, i) => i === mi ? { ...m, quizzes: m.quizzes.map((q, j) => j === qi ? { ...q, questions: q.questions.filter((_, k) => k !== qqi) } : q) } : m))
  }

  async function save(andSubmit = false) {
    if (!form.title.trim() || !form.language || !form.level || !form.description.trim()) {
      setError('Title, description, language and level are required'); scrollTo('basics'); return
    }
    const total = modules.reduce((n, m) => n + m.lessons.length, 0)
    if (total === 0) { setError('Add at least 1 lesson'); scrollTo('curriculum'); return }
    if (andSubmit) {
      if (modules.length < 1) { setError('Add at least 1 module before submitting'); scrollTo('curriculum'); return }
    }
    
    // Check token expiry before saving
    const expiry = localStorage.getItem('ff_token_expiry') || sessionStorage.getItem('ff_token_expiry')
    if (expiry) {
      const expiryTime = parseInt(expiry, 10)
      const fiveMinutes = 5 * 60 * 1000
      if (Date.now() + fiveMinutes >= expiryTime) {
        const confirmed = window.confirm('Your session will expire in less than 5 minutes. Please save your work and log in again to avoid losing changes. Continue saving?')
        if (!confirmed) return
      }
    }
    
    setSaving(true); setError('')
    try {
      // Sanitize empty strings to null for URL fields
      const sanitizedForm = {
        ...form,
        thumbnail_url: form.thumbnail_url || null,
        intro_video_url: form.intro_video_url || null,
        price: pricing.is_free ? 0 : pricing.price,
        is_free: pricing.is_free
      }
      await api.patch(`/api/instructor/courses/${id}`, sanitizedForm)
      
      // Smart upsert: patch existing, create new, delete removed
      const existingModules = await api.get(`/api/instructor/courses/${id}/modules`)
      const existingModuleIds = new Set(existingModules.data.map((m: any) => m.id))
      const currentModuleIds = new Set(modules.filter(m => m.id).map(m => m.id))
      
      // Delete removed modules
      for (const m of existingModules.data) {
        if (!currentModuleIds.has(m.id)) {
          await api.delete(`/api/instructor/courses/${id}/modules/${m.id}`)
        }
      }
      
      // Upsert modules
      for (let mi = 0; mi < modules.length; mi++) {
        const m = modules[mi]
        let moduleId: number
        if (m.id && existingModuleIds.has(m.id)) {
          // Patch existing module
          await api.patch(`/api/instructor/courses/${id}/modules/${m.id}`, { title: m.title, description: m.description, order: mi })
          moduleId = m.id
        } else {
          // Create new module
          const mr = await api.post(`/api/instructor/courses/${id}/modules`, { title: m.title, description: m.description, order: mi })
          moduleId = mr.data.id
        }
        
        // Get existing lessons for this module
        const existingLessons = await api.get(`/api/instructor/courses/${id}/lessons`)
        const moduleLessons = existingLessons.data.filter((l: any) => l.module_id === moduleId)
        const existingLessonIds = new Set(moduleLessons.map((l: any) => l.id))
        const currentLessonIds = new Set(m.lessons.filter(l => l.id).map(l => l.id))
        
        // Delete removed lessons
        for (const l of moduleLessons) {
          if (!currentLessonIds.has(l.id)) {
            await api.delete(`/api/instructor/courses/${id}/lessons/${l.id}`)
          }
        }
        
        // Upsert lessons
        for (let li = 0; li < m.lessons.length; li++) {
          const l = m.lessons[li]
          const lessonData = {
            title: l.title,
            lesson_type: l.lesson_type,
            duration_min: parseInt(l.duration_min) || null,
            description: l.description,
            video_url: l.video_url || null,
            content: l.content || null,
            module_id: moduleId,
            order: li,
            is_preview: l.is_preview
          }
          if (l.id && existingLessonIds.has(l.id)) {
            // Patch existing lesson
            await api.patch(`/api/instructor/courses/${id}/lessons/${l.id}`, lessonData)
          } else {
            // Create new lesson
            await api.post(`/api/instructor/courses/${id}/lessons`, lessonData)
          }
        }
        
        // Get existing quizzes for this module
        const existingQuizzes = await api.get(`/api/instructor/courses/${id}/modules/${moduleId}/quizzes`)
        const existingQuizIds = new Set(existingQuizzes.data.map((q: any) => q.id))
        const currentQuizIds = new Set(m.quizzes.filter(q => q.id).map(q => q.id))
        
        // Delete removed quizzes
        for (const q of existingQuizzes.data) {
          if (!currentQuizIds.has(q.id)) {
            await api.delete(`/api/instructor/courses/${id}/modules/${moduleId}/quizzes/${q.id}`)
          }
        }
        
        // Upsert quizzes
        for (let qi = 0; qi < m.quizzes.length; qi++) {
          const q = m.quizzes[qi]
          let quizId: number
          if (q.id && existingQuizIds.has(q.id)) {
            // Patch existing quiz
            await api.patch(`/api/instructor/courses/${id}/modules/${moduleId}/quizzes/${q.id}`, { title: q.title, position: q.position, passing_score: q.passing_score, time_limit_min: q.time_limit_min, is_required: q.is_required, order: qi })
            quizId = q.id
          } else {
            // Create new quiz
            const qr = await api.post(`/api/instructor/courses/${id}/modules/${moduleId}/quizzes`, { title: q.title, position: q.position, passing_score: q.passing_score, time_limit_min: q.time_limit_min, is_required: q.is_required, order: qi })
            quizId = qr.data.id
          }
          
          // Get existing questions for this quiz
          const existingQuestions = existingQuizzes.data.find((eq: any) => eq.id === quizId)?.questions || []
          const existingQuestionIds = new Set(existingQuestions.map((qu: any) => qu.id))
          const currentQuestionIds = new Set(q.questions.filter(qu => qu.id).map(qu => qu.id))
          
          // Delete removed questions
          for (const qu of existingQuestions) {
            if (!currentQuestionIds.has(qu.id)) {
              await api.delete(`/api/instructor/courses/${id}/modules/${moduleId}/quizzes/${quizId}/questions/${qu.id}`)
            }
          }
          
          // Upsert questions
          for (let qqi = 0; qqi < q.questions.length; qqi++) {
            const qu = q.questions[qqi]
            const questionData = {
              question_text: qu.question_text,
              question_type: qu.question_type,
              options: qu.options,
              correct_answer: qu.correct_answer,
              explanation: qu.explanation,
              points: qu.points,
              order: qqi
            }
            if (qu.id && existingQuestionIds.has(qu.id)) {
              // Patch existing question
              await api.patch(`/api/instructor/courses/${id}/modules/${moduleId}/quizzes/${quizId}/questions/${qu.id}`, questionData)
            } else {
              // Create new question
              await api.post(`/api/instructor/courses/${id}/modules/${moduleId}/quizzes/${quizId}/questions`, questionData)
            }
          }
        }
      }
      if (andSubmit) await api.post(`/api/instructor/courses/${id}/submit`, {})
      navigate('/instructor/courses')
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Failed to save'); setSaving(false)
    }
  }

  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0)
  const totalQuizzes = modules.reduce((n, m) => n + m.quizzes.length, 0)

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
            {saving ? '…' : courseStatus === 'rejected' ? 'Resubmit' : 'Submit for Review'}
          </button>
          <button className="btn bo sm" onClick={() => save(false)} disabled={saving} style={{ width: '100%', justifyContent: 'center' }}><Save size={16} /> Save Draft</button>
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
          <SectionHeader icon=<ClipboardList size={16} /> title="Basic Info" sub="Core details about your course" />
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
          <SectionHeader icon="️" title="Media" sub="Thumbnail and intro video" />
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
                {!form.thumbnail_url && <div style={{ marginTop: 10, height: 140, background: 'var(--card2)', borderRadius: 8, border: '1px solid var(--bdr)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>{form.flag_emoji || <BookOpen size={16} />}</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Curriculum */}
        <div ref={refs.curriculum} style={{ marginBottom: 40 }}>
          <SectionHeader icon=<BookOpen size={16} /> title="Curriculum" sub="Organize your course into modules with lessons and quizzes" />
          <div className="card">
            {/* Module tabs */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
              {modules.map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <div onClick={() => setActiveModule(i)} style={{ padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all .13s', background: activeModule === i ? 'var(--neon)' : 'var(--card2)', color: activeModule === i ? '#000' : 'var(--mu)', border: `1px solid ${activeModule === i ? 'var(--neon)' : 'var(--bdr)'}` }}>
                    {m.title} <span style={{ opacity: .7 }}>({m.lessons.length} lessons)</span>
                  </div>
                  {modules.length > 1 && <span onClick={() => removeModule(i)} style={{ cursor: 'pointer', color: 'var(--mu)', fontSize: 11, padding: '0 2px' }}><X size={16} /></span>}
                </div>
              ))}
              <button className="btn bo sm" onClick={addModule}>+ Add Module</button>
            </div>

            {/* Module details */}
            <div style={{ marginBottom: 16 }}>
              <label className="lbl">Module Title</label>
              <input className="inp" value={modules[activeModule]?.title} onChange={e => setModules(p => p.map((m, i) => i === activeModule ? { ...m, title: e.target.value } : m))} />
            </div>
            <div className="fg" style={{ marginBottom: 16 }}>
              <label className="lbl">Module Description</label>
              <textarea className="inp" rows={2} placeholder="What will students learn in this module?" value={modules[activeModule]?.description} onChange={e => setModules(p => p.map((m, i) => i === activeModule ? { ...m, description: e.target.value } : m))} style={{ resize: 'vertical' }} />
            </div>

            {/* Lessons */}
            {modules[activeModule]?.lessons.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>
                  Lessons · {modules[activeModule].lessons.length}
                </div>
                {modules[activeModule].lessons.map((l, li) => (
                  <div key={li} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--card2)', border: '1px solid var(--bdr)', borderRadius: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 16 }}>{l.lesson_type === 'video' ? <Video size={16} /> : l.lesson_type === 'audio' ? <Headphones size={16} /> : <FileText size={16} />}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{l.title}{l.is_preview && <span style={{ marginLeft: 8, fontSize: 9, color: 'var(--neon)', fontFamily: 'JetBrains Mono', background: 'rgba(191,255,0,.1)', padding: '2px 6px', borderRadius: 4 }}>FREE PREVIEW</span>}</div>
                      {(l.duration_min || l.description) && <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 2 }}>{l.duration_min ? `${l.duration_min} min` : ''}{l.duration_min && l.description ? ' · ' : ''}{l.description}</div>}
                      {l.video_url && <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 2 }}>Video: {l.video_url}</div>}
                      {l.content && <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 2 }}>Content: {l.content.substring(0, 50)}{l.content.length > 50 ? '...' : ''}</div>}
                    </div>
                    <button className="btn bd sm" onClick={() => removeLesson(activeModule, li)}>Remove</button>
                  </div>
                ))}
              </div>
            )}

            {/* Add lesson form */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>Add Lesson</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 10, marginBottom: 10 }}>
                <input className="inp" placeholder="Lesson title *" value={lessonDraft.title} onChange={e => setLessonDraft(d => ({ ...d, title: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addLesson()} />
                <select className="inp" value={lessonDraft.lesson_type} onChange={e => setLessonDraft(d => ({ ...d, lesson_type: e.target.value as any }))}>
                  <option value="video">Video</option>
                  <option value="text">Text</option>
                  <option value="audio">Audio</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10, marginBottom: 10 }}>
                <input className="inp" type="number" min={1} placeholder="Duration (min)" value={lessonDraft.duration_min} onChange={e => setLessonDraft(d => ({ ...d, duration_min: e.target.value }))} />
                <input className="inp" placeholder="Short description (optional)" value={lessonDraft.description} onChange={e => setLessonDraft(d => ({ ...d, description: e.target.value }))} />
              </div>
              {lessonDraft.lesson_type === 'video' && (
                <div className="fg" style={{ marginBottom: 10 }}>
                  <label className="lbl">Video URL</label>
                  <input className="inp" placeholder="https://..." value={lessonDraft.video_url} onChange={e => setLessonDraft(d => ({ ...d, video_url: e.target.value }))} />
                </div>
              )}
              {lessonDraft.lesson_type === 'text' && (
                <div className="fg" style={{ marginBottom: 10 }}>
                  <label className="lbl">Text Content</label>
                  <textarea className="inp" rows={4} placeholder="Lesson content..." value={lessonDraft.content} onChange={e => setLessonDraft(d => ({ ...d, content: e.target.value }))} style={{ resize: 'vertical' }} />
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--mu)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={lessonDraft.is_preview} onChange={e => setLessonDraft(d => ({ ...d, is_preview: e.target.checked }))} />
                  Mark as free preview
                </label>
                <button className="btn bp sm" onClick={addLesson}>+ Add Lesson</button>
              </div>
            </div>

            {/* Module quizzes */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
                  Module Quizzes · {modules[activeModule]?.quizzes.length || 0}
                </div>
                <button className="btn bo sm" onClick={addQuiz}><Plus size={16} /> Add Quiz</button>
              </div>

              {modules[activeModule]?.quizzes.map((q, qi) => (
                <div key={qi} style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FlaskConical size={16} />
                      <input className="inp" placeholder="Quiz title" value={q.title} onChange={e => updateQuiz(activeModule, qi, { title: e.target.value })} style={{ flex: 1 }} />
                    </div>
                    <button className="btn bd sm" onClick={() => removeQuiz(activeModule, qi)}><Trash2 size={16} /></button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
                    <div className="fg" style={{ marginBottom: 0 }}>
                      <label className="lbl">Position</label>
                      <select className="inp" value={q.position} onChange={e => updateQuiz(activeModule, qi, { position: e.target.value as any })}>
                        <option value="start">Start of Module</option>
                        <option value="middle">Middle of Module</option>
                        <option value="end">End of Module</option>
                      </select>
                    </div>
                    <div className="fg" style={{ marginBottom: 0 }}>
                      <label className="lbl">Passing Score (%)</label>
                      <input className="inp" type="number" min={0} max={100} value={q.passing_score} onChange={e => updateQuiz(activeModule, qi, { passing_score: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div className="fg" style={{ marginBottom: 0 }}>
                      <label className="lbl">Time Limit (min)</label>
                      <input className="inp" type="number" min={1} placeholder="Optional" value={q.time_limit_min || ''} onChange={e => updateQuiz(activeModule, qi, { time_limit_min: parseInt(e.target.value) || null })} />
                    </div>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--mu)', cursor: 'pointer', marginBottom: 12 }}>
                    <input type="checkbox" checked={q.is_required} onChange={e => updateQuiz(activeModule, qi, { is_required: e.target.checked })} />
                    Required to pass before continuing
                  </label>

                  {/* Quiz questions */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>
                      Questions · {q.questions.length}
                    </div>
                    {q.questions.map((qu, qqi) => (
                      <div key={qqi} style={{ background: 'var(--card2)', border: '1px solid var(--bdr)', borderRadius: 8, padding: 12, marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                          <div style={{ fontSize: 12, fontWeight: 600 }}>Q{qqi + 1}</div>
                          <button className="btn bd sm" onClick={() => removeQuizQuestion(activeModule, qi, qqi)}><Trash2 size={16} /></button>
                        </div>
                        <input className="inp" placeholder="Question text" value={qu.question_text} onChange={e => updateQuizQuestion(activeModule, qi, qqi, { question_text: e.target.value })} style={{ marginBottom: 8 }} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                          <input className="inp" placeholder="Options (JSON array)" value={qu.options} onChange={e => updateQuizQuestion(activeModule, qi, qqi, { options: e.target.value })} />
                          <input className="inp" placeholder="Correct answer" value={qu.correct_answer} onChange={e => updateQuizQuestion(activeModule, qi, qqi, { correct_answer: e.target.value })} />
                        </div>
                        <input className="inp" placeholder="Explanation (optional)" value={qu.explanation} onChange={e => updateQuizQuestion(activeModule, qi, qqi, { explanation: e.target.value })} />
                      </div>
                    ))}
                    <button className="btn bo sm" onClick={() => addQuizQuestion(activeModule, qi)}><Plus size={16} /> Add Question</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14, fontSize: 11, color: 'var(--mu)', fontFamily: 'JetBrains Mono' }}>
              {modules.length} module{modules.length !== 1 ? 's' : ''} · {totalLessons} lesson{totalLessons !== 1 ? 's' : ''} · {totalQuizzes} quiz{totalQuizzes !== 1 ? 'zes' : ''}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div ref={refs.pricing} style={{ marginBottom: 40 }}>
          <SectionHeader icon=<CreditCard size={16} /> title="Pricing" sub="Set your course price" />
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[{ label: 'Free', val: true, icon: <Gift size={16} />, sub: 'Maximum reach, no charge' }, { label: 'Paid', val: false, icon: <CreditCard size={16} />, sub: 'Earn revenue from students' }].map(opt => (
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
            {modules.length} module{modules.length !== 1 ? 's' : ''} · {totalLessons} lesson{totalLessons !== 1 ? 's' : ''} · {pricing.is_free ? 'Free' : `$${pricing.price}`}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn bo" onClick={() => navigate(-1)}>Cancel</button>
            <button className="btn bo" onClick={() => save(false)} disabled={saving}><Save size={16} /> Save Draft</button>
            <button className="btn bp" onClick={() => save(true)} disabled={saving}>{saving ? 'Saving…' : courseStatus === 'rejected' ? 'Save & Resubmit' : 'Save & Submit for Review'}</button>
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
