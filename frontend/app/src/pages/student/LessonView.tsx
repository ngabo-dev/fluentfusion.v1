import React, { useState } from 'react'

const transcript = [
  { ts: '02:14', text: '"Good evening, welcome to Kigali Heights Hotel. How may I assist you?"' },
  { ts: '02:22', text: '"I have a reservation under the name Johnson."' },
  { ts: '02:28', text: '"Of course, Mr. Johnson. Could I see your ID and the card you used to book?"' },
  { ts: '02:38', text: '"Here you are. Is my room ready?"' },
  { ts: '02:44', text: '"Absolutely. You\'re in Room 412, a superior king suite on the fourth floor."' },
  { ts: '02:52', text: '"Shall I arrange assistance with your luggage, sir?"' },
  { ts: '03:00', text: '"That would be wonderful, thank you."' },
  { ts: '03:06', text: '"Our bellboy will be right with you. Here is your room key card."' },
]

const vocab = ['Check-in', 'Reservation', 'Welcome', 'Room key', 'ID document', 'Luggage', 'Bellboy', 'Suite']

export default function LessonView() {
  const [activeTab, setActiveTab] = useState<'Transcript' | 'Vocabulary' | 'Notes'>('Transcript')
  const [activeTs, setActiveTs] = useState(0)
  const [progress, setProgress] = useState(38)
  const [playing, setPlaying] = useState(false)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', height: '100%', minHeight: 0 }}>
      {/* Main video area */}
      <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#000' }}>
        {/* Video player */}
        <div
          onClick={() => setPlaying(p => !p)}
          style={{ background: '#000', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer', flexShrink: 0 }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0a1a0a,#000)' }} />
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, background: 'rgba(191,255,0,0.9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto' }}>
              {playing ? '⏸' : '▶'}
            </div>
            <div style={{ marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Lesson 5 · Check-in Conversation</div>
          </div>
          <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(0,0,0,0.7)', padding: '5px 10px', borderRadius: 6, fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--neon)' }}>04:32 / 12:15</div>
        </div>

        {/* Controls */}
        <div style={{ background: '#0d0d0d', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0, borderBottom: '1px solid var(--bdr)' }}>
          {['⏮','⏸','⏭'].map(ic => (
            <button key={ic} style={{ background: 'none', border: 'none', color: ic === '⏸' ? 'var(--neon)' : 'var(--fg)', fontSize: 18, cursor: 'pointer', padding: 4 }}>{ic}</button>
          ))}
          <div
            style={{ flex: 1, height: 4, background: 'var(--bdr)', borderRadius: 99, cursor: 'pointer', position: 'relative' }}
            onClick={e => {
              const rect = (e.target as HTMLElement).getBoundingClientRect()
              setProgress(Math.round(((e.clientX - rect.left) / rect.width) * 100))
            }}
          >
            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--neon)', borderRadius: 99 }} />
          </div>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--mu)', whiteSpace: 'nowrap' }}>04:32 / 12:15</span>
          <div style={{ height: 4, width: 80, background: 'var(--bdr)', borderRadius: 99 }}>
            <div style={{ height: '100%', width: '70%', background: 'var(--neon)', borderRadius: 99 }} />
          </div>
          <button style={{ background: 'none', border: 'none', color: 'var(--fg)', fontSize: 16, cursor: 'pointer' }}>🔊</button>
          <button style={{ background: 'none', border: 'none', color: 'var(--fg)', fontSize: 14, cursor: 'pointer' }}>⚙️</button>
        </div>

        {/* Lesson body */}
        <div style={{ padding: '28px 32px', background: 'var(--bg)' }}>
          <div style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>Lesson 5 · Check-in Conversation</div>
          <div style={{ fontSize: 14, color: 'var(--mu)', marginBottom: 24 }}>Learn the essential phrases for welcoming and checking in hotel guests professionally.</div>

          <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Key Vocabulary</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
            {vocab.map(w => (
              <div key={w} style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 8, padding: '8px 14px', fontSize: 13, cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--neon)'; (e.currentTarget as HTMLElement).style.color = 'var(--neon)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--bdr)'; (e.currentTarget as HTMLElement).style.color = 'var(--fg)' }}
              >{w}</div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button style={{ background: 'var(--neon)', color: '#000', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>Practice Exercise →</button>
            <button style={{ background: 'none', border: '1px solid var(--bdr)', color: 'var(--fg)', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>Download Notes</button>
            <button style={{ background: 'none', border: '1px solid rgba(0,255,127,0.3)', color: '#00FF7F', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14, marginLeft: 'auto' }}>✓ Mark as Completed</button>
          </div>
        </div>
      </div>

      {/* Side panel */}
      <div style={{ background: '#111', borderLeft: '1px solid var(--bdr)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--bdr)', flexShrink: 0 }}>
          {(['Transcript', 'Vocabulary', 'Notes'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: 14, textAlign: 'center', fontSize: 13, fontWeight: 600,
              color: activeTab === tab ? 'var(--neon)' : 'var(--mu)',
              background: 'none', border: 'none',
              borderBottom: `2px solid ${activeTab === tab ? 'var(--neon)' : 'transparent'}`,
              cursor: 'pointer',
            }}>{tab}</button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {activeTab === 'Transcript' && transcript.map((line, i) => (
            <div key={i} onClick={() => setActiveTs(i)} style={{
              padding: '8px 10px', borderRadius: 6, fontSize: 13, lineHeight: 1.6,
              color: activeTs === i ? 'var(--fg)' : 'var(--mu)',
              background: activeTs === i ? 'rgba(191,255,0,0.06)' : 'transparent',
              borderLeft: activeTs === i ? '2px solid var(--neon)' : '2px solid transparent',
              cursor: 'pointer', marginBottom: 2,
            }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--neon)', marginRight: 8 }}>{line.ts}</span>
              {line.text}
            </div>
          ))}
          {activeTab === 'Vocabulary' && vocab.map(w => (
            <div key={w} style={{ padding: '10px 0', borderBottom: '1px solid var(--bdr)', fontSize: 13 }}>{w}</div>
          ))}
          {activeTab === 'Notes' && (
            <textarea placeholder="Add your notes here..." style={{ width: '100%', height: 300, background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 8, padding: 12, color: 'var(--fg)', fontSize: 13, resize: 'vertical', outline: 'none' }} />
          )}
        </div>
      </div>
    </div>
  )
}
