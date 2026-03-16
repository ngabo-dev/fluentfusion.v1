import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const curriculum = [
  { unit: 'Unit 1 · Greetings & First Impressions', lessons: [
    { num: '01', title: 'Welcome phrases at the front desk', dur: null, done: true },
    { num: '02', title: 'Formal vs informal greetings',      dur: null, done: true },
    { num: '03', title: 'Pronunciation: vowel sounds',       dur: '15 min', done: false },
  ]},
  { unit: 'Unit 2 · Hotel Check-in', lessons: [
    { num: '01', title: 'Check-in procedures vocabulary', dur: '18 min', done: false },
    { num: '02', title: 'Handling special requests',      dur: '20 min', done: false },
  ]},
]

const reviews = [
  { initials: 'AM', name: 'Amina M.',  ago: '2 days ago',  stars: 5, text: 'This course completely transformed how I communicate with hotel guests. The pronunciation exercises are incredible!' },
  { initials: 'KR', name: 'Kagiso R.', ago: '1 week ago',  stars: 5, text: 'Very practical. I use phrases from this course every single day at work. Highly recommend!' },
]

export default function CourseDetails() {
  const [tab, setTab] = useState<'Overview' | 'Curriculum' | 'Instructor' | 'Reviews'>('Overview')
  const [enrolled, setEnrolled] = useState(false)
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100%' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#1a2a1a 0%,#0a0a0a 60%)', borderBottom: '1px solid var(--bdr)', padding: '48px 40px' }}>
        <div style={{ maxWidth: 700 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(191,255,0,0.1)', color: 'var(--neon)', border: '1px solid rgba(191,255,0,0.2)', borderRadius: 6, padding: '3px 10px', fontSize: 12 }}>🇬🇧 English</span>
            <span style={{ background: 'rgba(0,207,255,0.1)', color: '#00CFFF', border: '1px solid rgba(0,207,255,0.2)', borderRadius: 6, padding: '3px 10px', fontSize: 12 }}>Beginner</span>
            <span style={{ background: 'rgba(255,215,0,0.1)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 6, padding: '3px 10px', fontSize: 12 }}>⭐ Bestseller</span>
          </div>
          <div style={{ fontFamily: 'Syne', fontSize: 32, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 12 }}>English for Tourism Workers</div>
          <div style={{ fontSize: 15, color: 'var(--mu)', lineHeight: 1.7, marginBottom: 20 }}>Master professional hospitality English — greetings, room service, guest handling, and more. Designed specifically for tourism workers in Rwanda.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--neon)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>MK</div>
              <span style={{ fontSize: 14, fontWeight: 500 }}>Dr. Mary K.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#FFD700' }}>★★★★★</span>
              <span style={{ fontWeight: 700 }}>4.9</span>
              <span style={{ color: 'var(--mu)' }}>(2,147 reviews)</span>
            </div>
            <span style={{ fontSize: 13, color: 'var(--mu)' }}>12,500 students · 8 units · 48 lessons</span>
          </div>
        </div>
      </div>

      <div style={{ padding: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, alignItems: 'start' }}>
          {/* Left */}
          <div>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--bdr)', marginBottom: 28 }}>
              {(['Overview','Curriculum','Instructor','Reviews'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ padding: '12px 20px', background: 'none', border: 'none', borderBottom: `2px solid ${tab === t ? 'var(--neon)' : 'transparent'}`, color: tab === t ? 'var(--neon)' : 'var(--mu)', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>{t}</button>
              ))}
            </div>

            {tab === 'Overview' && (
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>About This Course</div>
                <p style={{ color: 'var(--mu)', lineHeight: 1.75, fontSize: 14 }}>This comprehensive English course is designed for tourism workers in Rwanda who want to communicate professionally with international guests. You'll learn real-world hospitality phrases, pronunciation tips, and cultural etiquette.</p>
              </div>
            )}

            {tab === 'Curriculum' && (
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Curriculum · 8 Units · 48 Lessons</div>
                <div style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 12, overflow: 'hidden' }}>
                  {curriculum.map((unit, ui) => (
                    <div key={ui}>
                      <div style={{ padding: '16px 20px', background: 'rgba(191,255,0,0.04)', borderBottom: '1px solid var(--bdr)', fontWeight: 700, fontSize: 14 }}>
                        {unit.unit} <span style={{ color: 'var(--mu)', fontWeight: 400, fontSize: 13 }}>{unit.lessons.length} lessons</span>
                      </div>
                      {unit.lessons.map((l, li) => (
                        <div key={li} onClick={() => navigate('/dashboard/lesson')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid var(--bdr)', transition: 'background 0.15s' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                        >
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: l.done ? 'var(--neon)' : 'var(--mu)', marginRight: 12 }}>{l.num}</span>
                            <span style={{ fontSize: 14 }}>{l.title}</span>
                          </div>
                          <span style={{ fontSize: 12, color: l.done ? '#00FF7F' : 'var(--mu)' }}>{l.done ? '✓ Done' : l.dur}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'Instructor' && (
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--neon)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, flexShrink: 0 }}>MK</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Dr. Mary K.</div>
                  <div style={{ fontSize: 13, color: 'var(--mu)', marginBottom: 12 }}>English Language Specialist · 12 years experience</div>
                  <p style={{ fontSize: 14, color: 'var(--mu)', lineHeight: 1.7 }}>Dr. Mary K. is a certified English language instructor with over 12 years of experience teaching hospitality English across East Africa. She holds a PhD in Applied Linguistics from the University of Nairobi.</p>
                </div>
              </div>
            )}

            {tab === 'Reviews' && (
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Student Reviews</div>
                {reviews.map((r, i) => (
                  <div key={i} style={{ paddingBottom: 20, borderBottom: '1px solid var(--bdr)', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--card2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{r.initials}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{r.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--mu)' }}>{r.ago}</div>
                      </div>
                      <span style={{ marginLeft: 'auto', color: '#FFD700' }}>{'★'.repeat(r.stars)}</span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--mu)', margin: 0 }}>{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: sticky enroll card */}
          <div style={{ position: 'sticky', top: 20, background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ height: 200, background: 'linear-gradient(135deg,#1a2a1a,#252525)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>🇬🇧</div>
            <div style={{ padding: 24 }}>
              <div style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, color: 'var(--neon)', marginBottom: 4 }}>FREE</div>
              <div style={{ fontSize: 12, color: 'var(--mu)', marginBottom: 20 }}>Full access · No credit card needed</div>
              <button
                onClick={() => setEnrolled(true)}
                style={{ width: '100%', background: enrolled ? '#00FF7F' : 'var(--neon)', color: '#000', border: 'none', padding: '14px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 15, marginBottom: 12 }}
              >{enrolled ? '✓ Enrolled!' : 'Enroll Now — Free →'}</button>
              {enrolled && (
                <button onClick={() => navigate('/dashboard/lesson')} style={{ width: '100%', background: 'none', border: '1px solid var(--bdr)', color: 'var(--fg)', padding: '10px', borderRadius: 8, cursor: 'pointer', fontSize: 14, marginBottom: 12 }}>Start Learning →</button>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[['📚','48 lessons · 8 units'],['⏱','~12 hours total'],['🏆','Certificate on completion'],['♾️','Lifetime access'],['📱','Mobile & desktop']].map(([ic, txt]) => (
                  <div key={txt} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{ic}</span><span style={{ fontSize: 13, color: 'var(--mu)' }}>{txt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
