import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
const GOALS = ['Travel & Tourism', 'Business & Career', 'Academic Study', 'Cultural Interest', 'Daily Conversation', 'Exam Preparation']
const STEPS = [
  { label: 'Basic Info', sub: 'Title, language, level' },
  { label: 'Curriculum', sub: 'Lessons & structure' },
  { label: 'Quizzes', sub: 'Practice tests' },
  { label: 'Pricing', sub: 'Free or paid' },
  { label: 'Publish', sub: 'Review & submit' },
]

type Lesson = { title: string; duration: string; type: 'video' | 'text' }
type Quiz = { question: string; options: string[]; answer: number }

export default function CreateCourse() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({ title: '', description: '', language: '', flag_emoji: '', level: '', goal: '', thumbnail_url: '', what_you_learn: '', requirements: '' })
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [lessonDraft, setLessonDraft] = useState<Lesson>({ title: '', duration: '', type: 'video' })
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [quizDraft, setQuizDraft] = useState<Quiz>({ question: '', options: ['', '', '', ''], answer: 0 })
  const [pricing, setPricing] = useState({ price: 49.99, is_free: false, billing: 'one-time' as 'one-time' | 'monthly', certificate: true })

  const ff = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))
  function setLang(name: string) {
    const l = LANGUAGES.find(x => x.name === name)
    setForm(p => ({ ...p, language: name, flag_emoji: l?.flag || '' }))
  }

  function validate() {
    if (step === 0) {
      if (!form.title.trim()) return 'Course title is required'
      if (!form.language) return 'Language is required'
      if (!form.level) return 'Level is required'
    }
    return ''
  }

  function next() {
    const err = validate(); if (err) { setError(err); return }
    setError(''); setStep(s => s + 1)
  }

  function addLesson() {
    if (!lessonDraft.title.trim()) return
    setLessons(l => [...l, lessonDraft]); setLessonDraft({ title: '', duration: '', type: 'video' })
  }

  function addQuiz() {
    if (!quizDraft.question.trim() || quizDraft.options.some(o => !o.trim())) return
    setQuizzes(q => [...q, quizDraft]); setQuizDraft({ question: '', options: ['', '', '', ''], answer: 0 })
  }

  async function submit() {
    setSaving(true); setError('')
    try {
      const payload = { ...form, price: pricing.is_free ? 0 : pricing.price, lessons, quizzes, certificate: pricing.certificate }
      const res = await api.post('/api/instructor/courses', payload)
      await api.post(`/api/instructor/courses/${res.data.id}/submit`, {})
      navigate('/instructor/courses')
    } catch (e: any) {
      setError(e.message || 'Failed to save'); setSaving(false)
    }
  }

  return (
    <div className="pg" style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* Header */}
      <div className="ph">
        <div>
          <h1>Create Course</h1>
          <p>{STEPS[step].sub}</p>
        </div>
        <button className="btn bo sm" onClick={() => navigate(-1)}>✕ Cancel</button>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1, cursor: i < step ? 'pointer' : 'default' }} onClick={() => i < step && setStep(i)}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontFamily: 'JetBrains Mono', fontWeight: 700,
                background: i < step ? 'rgba(191,255,0,.15)' : i === step ? 'var(--neon)' : 'var(--card2)',
                border: `2px solid ${i < step ? 'var(--neon)' : i === step ? 'var(--neon)' : 'var(--bdr)'}`,
                color: i === step ? '#000' : i < step ? 'var(--neon)' : 'var(--mu)' }}>
                {i < step ? '✓' : i + 1}
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: i === step ? 'var(--fg)' : 'var(--mu)', textAlign: 'center', whiteSpace: 'nowrap' }}>{s.label}</div>
            </div>
            {i < STEPS.length - 1 && <div style={{ height: 2, flex: 1, background: i < step ? 'var(--neon)' : 'var(--bdr)', marginBottom: 18, transition: 'background .3s' }} />}
          </React.Fragment>
        ))}
      </div>

      {error && <div className="alr ac" style={{ marginBottom: 14 }}>{error}</div>}

      {/* Step panels */}
      <div className="card">
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="fg"><label className="lbl">Course Title *</label><input className="inp" placeholder="e.g. French for Beginners" value={form.title} onChange={e => ff('title', e.target.value)} /></div>
            <div className="fg"><label className="lbl">Description</label><textarea className="inp" rows={3} placeholder="What will students learn?" value={form.description} onChange={e => ff('description', e.target.value)} style={{ resize: 'vertical', minHeight: 72 }} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="fg" style={{ marginBottom: 0 }}><label className="lbl">Language *</label>
                <select className="inp" value={form.language} onChange={e => setLang(e.target.value)}>
                  <option value="">Select language</option>
                  {LANGUAGES.map(l => <option key={l.name} value={l.name}>{l.flag} {l.name}</option>)}
                </select>
              </div>
              <div className="fg" style={{ marginBottom: 0 }}><label className="lbl">Level *</label>
                <select className="inp" value={form.level} onChange={e => ff('level', e.target.value)}>
                  <option value="">Select level</option>
                  {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="fg" style={{ marginBottom: 0 }}><label className="lbl">Learning Goal</label>
                <select className="inp" value={form.goal} onChange={e => ff('goal', e.target.value)}>
                  <option value="">Select goal</option>
                  {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="fg" style={{ marginBottom: 0 }}><label className="lbl">Thumbnail URL</label><input className="inp" placeholder="https://..." value={form.thumbnail_url} onChange={e => ff('thumbnail_url', e.target.value)} /></div>
            </div>
            <div className="fg"><label className="lbl">What students will learn</label><textarea className="inp" rows={2} placeholder="List key outcomes, one per line" value={form.what_you_learn} onChange={e => ff('what_you_learn', e.target.value)} style={{ resize: 'vertical', minHeight: 60 }} /></div>
            <div className="fg"><label className="lbl">Requirements / Prerequisites</label><input className="inp" placeholder="e.g. No prior knowledge needed" value={form.requirements} onChange={e => ff('requirements', e.target.value)} /></div>
          </div>
        )}

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'var(--card2)', border: '1px solid var(--bdr)', borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Add Lesson</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
                <input className="inp" placeholder="Lesson title" value={lessonDraft.title} onChange={e => setLessonDraft(d => ({ ...d, title: e.target.value }))} />
                <select className="inp" style={{ width: 100 }} value={lessonDraft.type} onChange={e => setLessonDraft(d => ({ ...d, type: e.target.value as any }))}>
                  <option value="video">📹 Video</option><option value="text">📝 Text</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
                <input className="inp" placeholder="Duration e.g. 12:30" value={lessonDraft.duration} onChange={e => setLessonDraft(d => ({ ...d, duration: e.target.value }))} />
                <button className="btn bp sm" onClick={addLesson}>+ Add</button>
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Curriculum · {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}</div>
            {lessons.length === 0
              ? <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--mu)', fontSize: 12, fontFamily: 'JetBrains Mono' }}>No lessons yet</div>
              : lessons.map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--card2)', border: '1px solid var(--bdr)', borderRadius: 8 }}>
                  <span>{l.type === 'video' ? '📹' : '📝'}</span>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{l.title}</div>{l.duration && <div style={{ fontSize: 11, color: 'var(--mu)' }}>{l.duration}</div>}</div>
                  <button className="btn bd sm" onClick={() => setLessons(ls => ls.filter((_, j) => j !== i))}>🗑</button>
                </div>
              ))
            }
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'var(--card2)', border: '1px solid var(--bdr)', borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Add Quiz Question</div>
              <input className="inp" placeholder="Question" value={quizDraft.question} onChange={e => setQuizDraft(d => ({ ...d, question: e.target.value }))} />
              {quizDraft.options.map((opt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="radio" name="answer" checked={quizDraft.answer === i} onChange={() => setQuizDraft(d => ({ ...d, answer: i }))} />
                  <input className="inp" style={{ flex: 1 }} placeholder={`Option ${i + 1}`} value={opt} onChange={e => { const opts = [...quizDraft.options]; opts[i] = e.target.value; setQuizDraft(d => ({ ...d, options: opts })) }} />
                </div>
              ))}
              <div style={{ fontSize: 10, color: 'var(--mu)', fontFamily: 'JetBrains Mono' }}>● = correct answer</div>
              <button className="btn bp sm" style={{ alignSelf: 'flex-start' }} onClick={addQuiz}>+ Add Question</button>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Quiz · {quizzes.length} question{quizzes.length !== 1 ? 's' : ''}</div>
            {quizzes.length === 0
              ? <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--mu)', fontSize: 12, fontFamily: 'JetBrains Mono' }}>No questions yet — quizzes are optional</div>
              : quizzes.map((q, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: 'var(--card2)', border: '1px solid var(--bdr)', borderRadius: 8 }}>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Q{i + 1}. {q.question}</div><div style={{ fontSize: 11, color: 'var(--mu)' }}>✓ {q.options[q.answer]}</div></div>
                  <button className="btn bd sm" onClick={() => setQuizzes(qs => qs.filter((_, j) => j !== i))}>🗑</button>
                </div>
              ))
            }
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              {[{ label: 'Free', val: true, icon: '🎁', sub: 'No charge, maximum reach' }, { label: 'Paid', val: false, icon: '💳', sub: 'Earn revenue from students' }].map(opt => (
                <div key={opt.label} onClick={() => setPricing(p => ({ ...p, is_free: opt.val }))}
                  style={{ flex: 1, padding: 16, borderRadius: 10, border: `2px solid ${pricing.is_free === opt.val ? 'var(--neon)' : 'var(--bdr)'}`, background: pricing.is_free === opt.val ? 'rgba(191,255,0,.06)' : 'var(--card2)', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{opt.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{opt.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 4 }}>{opt.sub}</div>
                </div>
              ))}
            </div>
            {!pricing.is_free && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="fg" style={{ marginBottom: 0 }}><label className="lbl">Price (USD)</label><input className="inp" type="number" min={0} step={0.01} value={pricing.price} onChange={e => setPricing(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} /></div>
                  <div className="fg" style={{ marginBottom: 0 }}><label className="lbl">Billing</label>
                    <select className="inp" value={pricing.billing} onChange={e => setPricing(p => ({ ...p, billing: e.target.value as any }))}>
                      <option value="one-time">One-time payment</option><option value="monthly">Monthly subscription</option>
                    </select>
                  </div>
                </div>
                <div style={{ background: 'var(--card2)', borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div><div style={{ fontSize: 13, fontWeight: 600 }}>Estimated earnings</div><div style={{ fontSize: 11, color: 'var(--mu)' }}>After 20% platform fee</div></div>
                  <div style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 800, color: 'var(--neon)' }}>${(pricing.price * 0.8).toFixed(2)}</div>
                </div>
              </>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--card2)', borderRadius: 10, border: '1px solid var(--bdr)' }}>
              <div><div style={{ fontSize: 13, fontWeight: 600 }}>Include Certificate</div><div style={{ fontSize: 11, color: 'var(--mu)' }}>Students earn a certificate on completion</div></div>
              <div onClick={() => setPricing(p => ({ ...p, certificate: !p.certificate }))}
                style={{ width: 40, height: 22, borderRadius: 11, background: pricing.certificate ? 'var(--neon)' : 'var(--bdr)', cursor: 'pointer', position: 'relative', transition: 'background .2s' }}>
                <div style={{ position: 'absolute', top: 3, left: pricing.certificate ? 20 : 3, width: 16, height: 16, borderRadius: '50%', background: pricing.certificate ? '#000' : 'var(--mu)', transition: 'left .2s' }} />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: 'var(--card2)', borderRadius: 12, padding: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
              <span style={{ fontSize: 48 }}>{form.flag_emoji || '📚'}</span>
              <div>
                <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 18 }}>{form.title || 'Untitled Course'}</div>
                <div style={{ fontSize: 12, color: 'var(--mu)', marginTop: 4 }}>{form.level} · {form.language}{form.goal ? ` · ${form.goal}` : ''}</div>
                <div style={{ fontSize: 12, color: 'var(--neon)', marginTop: 4, fontWeight: 600 }}>{pricing.is_free ? 'Free' : `$${pricing.price}`}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {[{ label: 'Lessons', val: lessons.length, icon: '📹' }, { label: 'Quizzes', val: quizzes.length, icon: '📝' }, { label: 'Certificate', val: pricing.certificate ? 'Yes' : 'No', icon: '🏆' }].map(s => (
                <div key={s.label} style={{ background: 'var(--card2)', borderRadius: 10, padding: '14px 12px', textAlign: 'center', border: '1px solid var(--bdr)' }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: 'var(--neon)' }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{s.label}</div>
                </div>
              ))}
            </div>
            {form.description && <div style={{ fontSize: 13, color: 'var(--mu)', lineHeight: 1.6, padding: '12px 16px', background: 'var(--card2)', borderRadius: 10, border: '1px solid var(--bdr)' }}>{form.description}</div>}
            <div style={{ padding: '12px 16px', background: 'rgba(191,255,0,.06)', border: '1px solid rgba(191,255,0,.2)', borderRadius: 10, fontSize: 12, color: 'var(--mu)' }}>
              ℹ️ Your course will be submitted for admin review before going live.
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        {step > 0 && <button className="btn bo" onClick={() => { setError(''); setStep(s => s - 1) }}>← Back</button>}
        <div style={{ flex: 1 }} />
        {step < 4
          ? <button className="btn bp" onClick={next}>Next: {STEPS[step + 1].label} →</button>
          : <button className="btn bp" onClick={submit} disabled={saving}>{saving ? 'Submitting…' : '🚀 Submit for Review'}</button>
        }
      </div>
    </div>
  )
}
