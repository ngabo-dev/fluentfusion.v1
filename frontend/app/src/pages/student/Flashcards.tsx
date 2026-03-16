import React, { useState } from 'react'

const deck = [
  { front: 'Muraho',    back: 'Hello',        example: '"Muraho" is used as a general greeting' },
  { front: 'Amakuru',   back: 'How are you?', example: '"Amakuru yawe?" means "How are you doing?"' },
  { front: 'Ni meza',   back: 'I am fine',    example: '"Ni meza cyane" means "I am very fine"' },
  { front: 'Murakoze',  back: 'Thank You',    example: '"Murakoze cyane" means "Thank you very much"' },
  { front: 'Mwiriwe',   back: 'Good evening', example: 'Used as an evening greeting' },
  { front: 'Bwakeye',   back: 'Good morning', example: 'Used as a morning greeting' },
  { front: 'Urakomeye', back: 'Goodbye',      example: 'Informal farewell' },
]

export default function Flashcards() {
  const [idx, setIdx] = useState(3)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState<Set<number>>(new Set([0, 1, 2]))
  const [skipped, setSkipped] = useState<Set<number>>(new Set())

  const card = deck[idx]

  function go(dir: 1 | -1) {
    setIdx(i => (i + dir + deck.length) % deck.length)
    setFlipped(false)
  }

  function markKnow() {
    setKnown(s => new Set([...s, idx]))
    go(1)
  }

  function markSkip() {
    setSkipped(s => new Set([...s, idx]))
    go(1)
  }

  const newCount = deck.length - known.size - skipped.size

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 0 }}>
      {/* Card area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: '0.12em', color: 'var(--mu)', textTransform: 'uppercase', marginBottom: 20 }}>
          Tap card to flip · Kinyarwanda → English
        </div>

        {/* 3D Flip Card */}
        <div
          onClick={() => setFlipped(f => !f)}
          style={{ width: 480, height: 300, perspective: 1200, cursor: 'pointer', marginBottom: 32 }}
        >
          <div style={{
            width: '100%', height: '100%', position: 'relative',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
            transform: flipped ? 'rotateY(180deg)' : 'none',
          }}>
            {/* Front */}
            <div style={{
              position: 'absolute', inset: 0, background: 'var(--card)',
              border: '1px solid rgba(191,255,0,0.2)', borderRadius: 16,
              padding: 40, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              backfaceVisibility: 'hidden',
              boxShadow: '0 0 0 1px rgba(191,255,0,0.08), 0 16px 48px rgba(0,0,0,0.4)',
            }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.12em', color: 'var(--mu)', textTransform: 'uppercase', marginBottom: 16 }}>Kinyarwanda</div>
              <div style={{ fontFamily: 'Syne', fontSize: 48, fontWeight: 800, textTransform: 'uppercase', color: 'var(--neon)', marginBottom: 12 }}>{card.front}</div>
              <div style={{ fontSize: 14, color: 'var(--mu)' }}>Tap to reveal translation →</div>
            </div>
            {/* Back */}
            <div style={{
              position: 'absolute', inset: 0, background: '#0a1520',
              border: '1px solid rgba(0,207,255,0.2)', borderRadius: 16,
              padding: 40, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.12em', color: '#00CFFF', textTransform: 'uppercase', marginBottom: 16 }}>English</div>
              <div style={{ fontFamily: 'Syne', fontSize: 36, fontWeight: 800, textTransform: 'uppercase', color: '#00CFFF', marginBottom: 8 }}>{card.back}</div>
              <div style={{ fontSize: 14, color: 'var(--mu)', fontStyle: 'italic', textAlign: 'center', lineHeight: 1.6 }}>{card.example}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <button onClick={markSkip} title="Skip" style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,68,68,0.12)', color: '#FF4444', border: 'none', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          <button onClick={() => setFlipped(f => !f)} title="Flip" style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(191,255,0,0.08)', color: 'var(--neon)', border: '1px solid rgba(191,255,0,0.2)', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↻</button>
          <button onClick={markKnow} title="I know this" style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(0,255,127,0.12)', color: '#00FF7F', border: 'none', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</button>
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
          <button onClick={() => go(-1)} style={{ background: 'none', border: '1px solid var(--bdr)', color: 'var(--mu)', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>← Previous</button>
          <button style={{ background: 'none', border: '1px solid var(--bdr)', color: 'var(--fg)', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Shuffle Deck</button>
          <button onClick={() => go(1)} style={{ background: 'none', border: '1px solid var(--bdr)', color: 'var(--mu)', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Next →</button>
        </div>
      </div>

      {/* Deck panel */}
      <div style={{ width: 280, background: '#111', borderLeft: '1px solid var(--bdr)', padding: 24, overflowY: 'auto' }}>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Deck · Greetings</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          <span style={{ background: 'rgba(0,255,127,0.12)', color: '#00FF7F', border: '1px solid rgba(0,255,127,0.2)', borderRadius: 6, padding: '3px 10px', fontSize: 12 }}>{known.size} Known</span>
          <span style={{ background: 'rgba(255,68,68,0.12)', color: '#FF4444', border: '1px solid rgba(255,68,68,0.2)', borderRadius: 6, padding: '3px 10px', fontSize: 12 }}>{skipped.size} Learning</span>
          <span style={{ background: 'rgba(136,136,136,0.12)', color: 'var(--mu)', border: '1px solid var(--bdr)', borderRadius: 6, padding: '3px 10px', fontSize: 12 }}>{newCount} New</span>
        </div>
        {deck.map((d, i) => (
          <div
            key={i}
            onClick={() => { setIdx(i); setFlipped(false) }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px', borderRadius: 8, marginBottom: 6, fontSize: 13, cursor: 'pointer',
              background: i === idx ? 'rgba(191,255,0,0.08)' : 'transparent',
              color: i === idx ? 'var(--neon)' : 'var(--fg)',
              transition: 'background 0.15s',
            }}
          >
            <span>{d.front}</span>
            <span style={{ fontSize: 12, color: known.has(i) ? '#00FF7F' : i === idx ? 'var(--neon)' : 'var(--mu)' }}>
              {known.has(i) ? '✓' : i === idx ? '→' : '·'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
