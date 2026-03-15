import React, { useEffect, useState } from 'react'
import api from '../../api/client'

export default function CourseApprovals() {
  const [courses, setCourses] = useState<any[]>([])
  const [tab, setTab] = useState('pending')
  const load = () => api.get('/api/admin/courses', { params: { status: tab } }).then(r => setCourses(r.data))
  useEffect(() => { load() }, [tab])

  async function updateStatus(id: number, status: string) {
    await api.patch(`/api/admin/courses/${id}/status`, { status })
    load()
  }

  return (
    <div className="pg">
      <div className="ph"><div><h1>Course Approvals</h1><p>Review and approve instructor submissions</p></div></div>
      {tab === 'pending' && courses.length > 0 && (
        <div className="alr aw" style={{ marginBottom: 14 }}>
          <span>📚</span><div style={{ flex: 1 }}><b>{courses.length} courses awaiting review</b></div>
        </div>
      )}
      <div className="tabs">
        {['pending','published','rejected'].map(t => (
          <div key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)} {tab === t ? `(${courses.length})` : ''}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {courses.map(c => (
          <div key={c.id} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 56, height: 56, background: 'rgba(191,255,0,.07)', borderRadius: 'var(--r)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{c.flag_emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{c.title}</div>
                <div style={{ fontSize: 11, color: 'var(--mu)' }}>By <b style={{ color: 'var(--fg)' }}>{c.instructor}</b> · {c.language} · {c.level}</div>
                <div style={{ fontSize: 9, color: 'var(--mu)', fontFamily: 'JetBrains Mono', marginTop: 2 }}>{c.created_at?.slice(0,10)}</div>
              </div>
              {tab === 'pending' && (
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button className="btn bg sm">Preview</button>
                  <button className="btn bp sm" onClick={() => updateStatus(c.id, 'published')}>✓ Approve</button>
                  <button className="btn bd sm" onClick={() => updateStatus(c.id, 'rejected')}>✗ Reject</button>
                </div>
              )}
            </div>
          </div>
        ))}
        {courses.length === 0 && <div style={{ color: 'var(--mu)', fontSize: 12, padding: 20, textAlign: 'center' }}>No courses in this category</div>}
      </div>
    </div>
  )
}
