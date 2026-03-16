import React, { useState, useRef, useEffect } from 'react'

const phrases = [
  { text: 'Muraho, amakuru?',       phonetic: '/mu-RA-ho, a-MA-ku-ru/', meaning: 'Hello, how are you?' },
  { text: 'Murakoze cyane',         phonetic: '/mu-ra-KO-ze CHA-ne/',   meaning: 'Thank you very much' },
  { text: 'Ni meza, murakoze',      phonetic: '/ni ME-za, mu-ra-KO-ze/', meaning: 'I am fine, thank you' },
  { text: 'Mwiriwe neza',           phonetic: '/mwi-RI-we NE-za/',       meaning: 'Good evening' },
]

const scores = [
  { label: 'Overall Score',      val: 82, color: 'var(--neon)' },
  { label: 'Tone & Intonation',  val: 91, color: '#00FF7F' },
  { label: 'Vowel Accuracy',     val: 74, color: '#FFD700' },
  { label: 'Rhythm & Pace',      val: 88, color: 'var(--neon)' },
]

export default function SpeakingPractice() {
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [waveBars] = useState(() => Array.from({ length: 40 }, () => Math.random() * 40 + 4))
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const phrase = phrases[phraseIdx]

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [recording])

  function toggleRecord() {
    if (recording) {
      setRecording(false)
      setShowScore(true)
    } else {
      setRecording(true)
      setSeconds(0)
      setShowScore(false)
    }
  }

  function nextPhrase() {
    setPhraseIdx(i => (i + 1) % phrases.length)
    setRecording(false)
    setShowScore(false)
    setSeconds(0)
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div style={{ padding: '32px 28px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>
          Speaking <span style={{ color: 'var(--neon)' }}>Practice</span>
        </h1>
        <p style={{ color: 'var(--mu)', fontSize: 14, marginTop: 6 }}>Record yourself and get instant AI pronunciation feedback</p>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Phrase card */}
        <div style={{ background: 'linear-gradient(135deg,rgba(191,255,0,0.06),rgba(191,255,0,0.02))', border: '1px solid rgba(191,255,0,0.15)', borderRadius: 16, padding: 36, textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.15em', color: 'var(--mu)', textTransform: 'uppercase', marginBottom: 16 }}>Say this phrase:</div>
          <div style={{ fontFamily: 'Syne', fontSize: 36, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', color: 'var(--neon)', marginBottom: 8 }}>{phrase.text}</div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 16, color: 'var(--mu)', marginBottom: 4 }}>{phrase.phonetic}</div>
          <div style={{ fontSize: 15, color: 'var(--mu)', marginBottom: 16 }}>{phrase.meaning}</div>
          <button style={{ background: 'none', border: '1px solid var(--bdr)', color: 'var(--fg)', padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>🔊 Play Native Audio</button>
        </div>

        {/* Record area */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, marginBottom: 28 }}>
          {/* Waveform */}
          <div style={{ width: '100%', height: 56, background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 12, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 3, overflow: 'hidden' }}>
            {recording ? waveBars.map((h, i) => (
              <div key={i} style={{ flexShrink: 0, width: 3, height: h, background: 'var(--neon)', borderRadius: 2, opacity: 0.7, animation: `wave ${0.5 + Math.random() * 0.5}s ease-in-out infinite alternate` }} />
            )) : (
              <span style={{ fontSize: 13, color: 'var(--mu)' }}>{showScore ? 'Recording complete — see your score below' : 'Press the mic to start recording...'}</span>
            )}
          </div>

          {/* Record button */}
          <button
            onClick={toggleRecord}
            style={{
              width: 88, height: 88, borderRadius: '50%', background: recording ? '#cc0000' : '#FF4444',
              border: 'none', cursor: 'pointer', fontSize: 32,
              boxShadow: recording ? '0 0 0 12px rgba(255,68,68,0.2)' : 'none',
              transition: 'all 0.2s',
            }}
          >🎙</button>

          {recording && (
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: '#FF4444' }}>● Recording · {fmt(seconds)}</div>
          )}
        </div>

        {/* AI Score */}
        {showScore && (
          <div style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 12, padding: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>AI Pronunciation Score</div>
            {scores.map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(42,42,42,0.5)' }}>
                <span style={{ fontSize: 14 }}>{s.label}</span>
                <span style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}%</span>
              </div>
            ))}
            <div style={{ marginTop: 16, padding: 14, background: 'rgba(191,255,0,0.05)', border: '1px solid rgba(191,255,0,0.12)', borderRadius: 8 }}>
              <div style={{ fontSize: 13, color: 'var(--neon)', fontWeight: 600, marginBottom: 4 }}>💡 AI Tip</div>
              <div style={{ fontSize: 13, color: 'var(--mu)' }}>Great tone! Try to soften the "ku" syllable — it should be short and light.</div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button onClick={toggleRecord} style={{ background: 'var(--neon)', color: '#000', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>Try Again 🎙</button>
              <button onClick={nextPhrase} style={{ background: 'none', border: '1px solid var(--bdr)', color: 'var(--fg)', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>Next Phrase →</button>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes wave { from { transform: scaleY(0.4); } to { transform: scaleY(1.2); } }`}</style>
    </div>
  )
}
