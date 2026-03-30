import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/client'
import { ArrowRight, BookOpen } from 'lucide-react'

export default function CreateCourse() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  async function start() {
    if (!title.trim()) return
    setCreating(true)
    setError('')
    try {
      const res = await api.post('/api/instructor/courses', {
        title: title.trim(),
        description: '',
        language: '',
        level: 'Beginner',
        price: 0,
        is_free: true,
      })
      navigate(`/instructor/courses/${res.data.id}/edit`)
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Failed to create course')
      setCreating(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 520 }}>

        {/* Icon */}
        <div style={{
          width: 56, height: 56, borderRadius: 14, background: 'var(--ndim)',
          border: '1px solid rgba(191,255,0,.2)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', marginBottom: 28, color: 'var(--neon)',
        }}>
          <BookOpen size={24} />
        </div>

        <h1 style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          New Course
        </h1>
        <p style={{ color: 'var(--mu)', fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
          Give your course a working title. You can change everything later inside the course editor.
        </p>

        {error && (
          <div className="alr ac" style={{ marginBottom: 20 }}>{error}</div>
        )}

        <div style={{ marginBottom: 20 }}>
          <label className="lbl">Course Title</label>
          <input
            className="inp"
            autoFocus
            placeholder="e.g. French for Absolute Beginners"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !creating && start()}
            style={{ fontSize: 16 }}
          />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn bo" onClick={() => navigate('/instructor/courses')} style={{ flex: '0 0 auto' }}>
            Cancel
          </button>
          <button
            className="btn bp"
            disabled={!title.trim() || creating}
            onClick={start}
            style={{ flex: 1, opacity: title.trim() && !creating ? 1 : 0.4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {creating ? 'Creating…' : <><span>Create & Open Editor</span><ArrowRight size={16} /></>}
          </button>
        </div>
      </div>
    </div>
  )
}
