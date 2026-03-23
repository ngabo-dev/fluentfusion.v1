import React, { useState, useEffect } from 'react'
import api from '../api/client'

interface Props {
  onClose: () => void
  onCreated: (meeting: any) => void
  courses?: { id: number; title: string }[]
}

export default function ScheduleMeetingModal({ onClose, onCreated, courses = [] }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [duration, setDuration] = useState(60)
  const [audience, setAudience] = useState('individual')
  const [courseId, setCourseId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [contacts, setContacts] = useState<any[]>([])
  const [selected, setSelected] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (audience !== 'individual') { setSelected([]); return }
    const t = setTimeout(() => {
      api.get(`/api/meetings/contacts/search?q=${search}`).then(r => setContacts(r.data)).catch(() => {})
    }, 300)
    return () => clearTimeout(t)
  }, [search, audience])

  function toggleContact(c: any) {
    setSelected(prev => prev.find(p => p.id === c.id) ? prev.filter(p => p.id !== c.id) : [...prev, c])
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    if (!title.trim()) return setErr('Title is required')
    if (!scheduledAt) return setErr('Please set a date and time')
    if (audience === 'individual' && selected.length === 0) return setErr('Select at least one person to invite')
    if (audience === 'course' && !courseId) return setErr('Select a course')
    setLoading(true)
    try {
      const res = await api.post('/api/meetings', {
        title, description, scheduled_at: scheduledAt,
        duration_min: duration, audience,
        course_id: courseId,
        invite_user_ids: selected.map(s => s.id),
      })
      onCreated(res.data)
      onClose()
    } catch (e: any) {
      setErr(e?.response?.data?.detail || 'Failed to schedule session')
    } finally { setLoading(false) }
  }

  const overlay: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: 20,
  }
  const modal: React.CSSProperties = {
    background: '#151515', border: '1px solid #2a2a2a', borderRadius: 16,
    padding: 32, width: '100%', maxWidth: 520, maxHeight: '90vh',
    overflowY: 'auto', position: 'relative',
  }
  const inp: React.CSSProperties = {
    width: '100%', background: '#1f1f1f', border: '1px solid #2a2a2a',
    borderRadius: 8, padding: '10px 14px', color: '#fff',
    fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none',
    boxSizing: 'border-box',
  }
  const lbl: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
    textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888',
    display: 'block', marginBottom: 6,
  }

  const audienceOptions = [
    { value: 'individual', label: '👤 Specific People' },
    { value: 'course', label: '📚 Course Students' },
    { value: 'all_students', label: '🎓 All Students' },
    { value: 'all_instructors', label: '📋 All Instructors' },
    { value: 'everyone', label: '🌍 Everyone' },
  ]

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={modal}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, textTransform: 'uppercase' }}>
            📅 Schedule <span style={{ color: '#BFFF00' }}>Session</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>

        {err && <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: 8, padding: '8px 12px', color: '#FF4444', fontSize: 13, marginBottom: 16 }}>⚠ {err}</div>}

        <form onSubmit={submit}>
          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Session Title</label>
            <input style={inp} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. French B2 — Grammar Review" required />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Description (optional)</label>
            <textarea style={{ ...inp, resize: 'vertical' }} rows={2} value={description} onChange={e => setDescription(e.target.value)} placeholder="What will you cover?" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={lbl}>Date & Time</label>
              <input style={inp} type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} required />
            </div>
            <div>
              <label style={lbl}>Duration (min)</label>
              <input style={inp} type="number" min={15} max={480} value={duration} onChange={e => setDuration(Number(e.target.value))} />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Invite</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {audienceOptions.map(o => (
                <div key={o.value} onClick={() => setAudience(o.value)}
                  style={{ padding: '10px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                    background: audience === o.value ? 'rgba(191,255,0,0.1)' : '#1f1f1f',
                    border: `1px solid ${audience === o.value ? '#BFFF00' : '#2a2a2a'}`,
                    color: audience === o.value ? '#BFFF00' : '#aaa', transition: 'all .15s' }}>
                  {o.label}
                </div>
              ))}
            </div>
          </div>

          {audience === 'course' && courses.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <label style={lbl}>Select Course</label>
              <select style={{ ...inp }} value={courseId ?? ''} onChange={e => setCourseId(Number(e.target.value))}>
                <option value="">— choose course —</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
          )}

          {audience === 'individual' && (
            <div style={{ marginBottom: 16 }}>
              <label style={lbl}>Search People</label>
              <input style={inp} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." />
              {contacts.length > 0 && (
                <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, marginTop: 6, maxHeight: 180, overflowY: 'auto' }}>
                  {contacts.map(c => {
                    const isSelected = selected.find(s => s.id === c.id)
                    return (
                      <div key={c.id} onClick={() => toggleContact(c)}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer',
                          background: isSelected ? 'rgba(191,255,0,0.06)' : 'transparent',
                          borderBottom: '1px solid #222' }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#BFFF00', flexShrink: 0 }}>{c.avatar_initials}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: '#666' }}>{c.role} · {c.email}</div>
                        </div>
                        {isSelected && <span style={{ color: '#BFFF00', fontSize: 16 }}>✓</span>}
                      </div>
                    )
                  })}
                </div>
              )}
              {selected.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {selected.map(s => (
                    <span key={s.id} style={{ background: 'rgba(191,255,0,0.1)', border: '1px solid rgba(191,255,0,0.3)', borderRadius: 99, padding: '3px 10px', fontSize: 12, color: '#BFFF00', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {s.name}
                      <span onClick={() => toggleContact(s)} style={{ cursor: 'pointer', opacity: 0.7 }}>✕</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '13px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', border: 'none', background: '#BFFF00', color: '#0a0a0a', opacity: loading ? 0.7 : 1, marginTop: 8 }}>
            {loading ? 'Scheduling...' : '📅 Schedule Session'}
          </button>
        </form>
      </div>
    </div>
  )
}
