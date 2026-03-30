import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import { FileText, FlaskConical, Mic, Video } from 'lucide-react'

const LESSON_ICONS: any = { video: <Video size={16} />, text: <FileText size={16} />, quiz: <FlaskConical size={16} />, live: <Mic size={16} /> }

export default function Lessons() {
  const [courses, setCourses] = useState<any[]>([])
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [selectedLesson, setSelectedLesson] = useState<any>(null)
  const [form, setForm] = useState({ title: '', lesson_type: 'video', video_url: '', duration_min: 15, description: '' })

  useEffect(() => {
    api.get('/api/instructor/courses').then(r => {
      setCourses(r.data)
      if (r.data.length > 0) selectCourse(r.data[0])
    })
  }, [])

  function selectCourse(c: any) {
    setSelectedCourse(c)
    api.get(`/api/instructor/courses/${c.id}/lessons`).then(r => {
      setLessons(r.data)
      if (r.data.length > 0) selectLesson(r.data[0])
    })
  }

  function selectLesson(l: any) {
    setSelectedLesson(l)
    setForm({ title: l.title, lesson_type: l.lesson_type, video_url: l.video_url || '', duration_min: l.duration_min, description: l.description || '' })
  }

  async function saveLesson() {
    if (!selectedLesson || !selectedCourse) return
    await api.patch(`/api/instructor/courses/${selectedCourse.id}/lessons/${selectedLesson.id}`, form)
    api.get(`/api/instructor/courses/${selectedCourse.id}/lessons`).then(r => setLessons(r.data))
  }

  return (
    <div className="pg" style={{ padding: 0 }}>
      <div style={{ padding: '10px 18px', background: 'var(--bg2)', borderBottom: '1px solid var(--bdr)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <select className="sel" style={{ width: 'auto', background: 'transparent', border: 'none', fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: 'var(--fg)' }} value={selectedCourse?.id || ''} onChange={e => { const c = courses.find(c => c.id === Number(e.target.value)); if (c) selectCourse(c) }}>
          {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <span className={`bdg ${selectedCourse?.status === 'published' ? 'bk' : 'bm'}`} style={{ marginLeft: 'auto' }}>{selectedCourse?.status}</span>
        <button className="btn bo sm">Save Draft</button>
        <button className="btn bp sm">Publish</button>
      </div>
      <div className="bl">
        <div className="bls">
          <div className="blh">
            <span style={{ fontFamily: 'Syne', fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>Lessons</span>
            <button className="btn bp sm" style={{ padding: '3px 9px', fontSize: 10 }}>+ Add</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {lessons.map((l, i) => (
              <div key={l.id} className={`li2${selectedLesson?.id === l.id ? ' active' : ''}`} onClick={() => selectLesson(l)}>
                <span className="lnum">{String(i + 1).padStart(2, '0')}</span>
                <span className="ln">{l.title}</span>
                <span className="lt">{LESSON_ICONS[l.lesson_type] || <FileText size={16} />}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bc">
          {selectedLesson ? (
            <>
              <div className="fg"><label className="lbl">Lesson Title</label><input className="inp" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div className="fg">
                <label className="lbl">Lesson Type</label>
                <div className="tabs" style={{ marginBottom: 12 }}>
                  {['video','text','quiz','live'].map(t => (
                    <div key={t} className={`tab${form.lesson_type === t ? ' active' : ''}`} onClick={() => setForm(f => ({ ...f, lesson_type: t }))}>
                      {LESSON_ICONS[t]} {t.charAt(0).toUpperCase() + t.slice(1)}
                    </div>
                  ))}
                </div>
              </div>
              {form.lesson_type === 'video' && <div className="fg"><label className="lbl">Video URL</label><input className="inp" placeholder="https://..." value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} /></div>}
              <div className="fg"><label className="lbl">Duration (min)</label><input className="inp" type="number" value={form.duration_min} onChange={e => setForm(f => ({ ...f, duration_min: Number(e.target.value) }))} style={{ width: 120 }} /></div>
              <div className="fg"><label className="lbl">Description</label><textarea className="inp" rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <button className="btn bp" onClick={saveLesson}>Save Lesson</button>
            </>
          ) : <div style={{ color: 'var(--mu)', fontSize: 12 }}>Select a lesson to edit</div>}
        </div>
      </div>
    </div>
  )
}
