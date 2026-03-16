import React, { useState, useEffect, useRef } from 'react'

type Question =
  | { type: 'mc';      text: string; options: string[]; answer: number }
  | { type: 'fill';    text: string; blank: string; answer: string }
  | { type: 'listen';  text: string; audio: string; answer: string }

const questions: Question[] = [
  { type: 'mc',   text: 'What is the correct phrase to ask for a guest\'s identification at check-in?', options: ['"Give me your ID please."', '"Could I see your ID and the card you used to book?"', '"Where is your passport?"', '"You need ID."'], answer: 1 },
  { type: 'fill', text: 'Complete the sentence: "You\'re in Room 412, a superior king ______ on the fourth floor."', blank: '______', answer: 'suite' },
  { type: 'listen', text: 'Listen to the audio and type what you hear:', audio: 'Welcome to Kigali Heights Hotel', answer: 'Welcome to Kigali Heights Hotel' },
  { type: 'mc',   text: 'Which phrase means "Thank you very much" in Kinyarwanda?', options: ['Muraho', 'Murakoze cyane', 'Ni meza', 'Mwiriwe'], answer: 1 },
  { type: 'fill', text: 'Complete: "Good ______, welcome to our hotel."', blank: '______', answer: 'evening' },
]

export default function QuizPage() {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [fillVal, setFillVal] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    timerRef.current = setInterval(() => setTimeLeft(t => t > 0 ? t - 1 : 0), 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const q = questions[current]
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  function isCorrect() {
    if (q.type === 'mc') return selected === q.answer
    return (fillVal.trim().toLowerCase() === q.answer.toLowerCase())
  }

  function submit() {
    if (submitted) return
    setSubmitted(true)
    if (isCorrect()) setScore(s => s + 1)
  }

  function next() {
    if (current + 1 >= questions.length) { setDone(true); return }
    setCurrent(c => c + 1)
    setSelected(null)
    setFillVal('')
    setSubmitted(false)
  }

  if (done) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 16, padding: 48, textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>{score >= 4 ? '🏆' : score >= 3 ? '⭐' : '📚'}</div>
        <div style={{ fontFamily: 'Syne', fontSize: 32, fontWeight: 800, color: 'var(--neon)', marginBottom: 8 }}>{Math.round((score / questions.length) * 100)}%</div>
        <div style={{ fontSize: 16, marginBottom: 4 }}>You got {score} of {questions.length} correct</div>
        <div style={{ fontSize: 14, color: 'var(--mu)', marginBottom: 28 }}>Unit 3 · Hotel Check-in Quiz</div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => { setCurrent(0); setScore(0); setDone(false); setSubmitted(false); setSelected(null); setFillVal(''); setTimeLeft(300) }} style={{ background: 'var(--neon)', color: '#000', border: 'none', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>Retry Quiz</button>
          <button style={{ background: 'none', border: '1px solid var(--bdr)', color: 'var(--fg)', padding: '10px 24px', borderRadius: 8, cursor: 'pointer' }}>Back to Lesson</button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '48px 20px', minHeight: '80vh' }}>
      <div style={{ width: '100%', maxWidth: 680 }}>
        {/* Header */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 16, padding: '24px 28px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Unit 3 · Hotel Check-in Quiz</div>
            <div style={{ fontSize: 12, color: 'var(--mu)', marginTop: 2 }}>English for Tourism · {questions.length} Questions</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 800, color: 'var(--neon)' }}>{current + 1}/{questions.length}</div>
              <div style={{ fontSize: 11, color: 'var(--mu)' }}>Progress</div>
            </div>
            <div style={{ width: 1, height: 40, background: 'var(--bdr)' }} />
            <div style={{ background: 'rgba(255,68,68,0.12)', border: '1px solid rgba(255,68,68,0.25)', color: '#FF4444', padding: '6px 14px', borderRadius: 8, fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 600 }}>⏱ {fmt(timeLeft)}</div>
          </div>
        </div>

        {/* Question card */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 16, padding: 32, marginBottom: 16 }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--neon)', marginBottom: 14 }}>
            {q.type === 'mc' ? 'Multiple Choice' : q.type === 'fill' ? 'Fill in the Blank' : 'Listening'} · Question {current + 1}
          </div>
          <div style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.5, marginBottom: 24 }}>{q.text}</div>

          {q.type === 'mc' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.options.map((opt, i) => {
                let bg = 'var(--card2)', border = 'var(--bdr)', color = 'var(--fg)'
                if (submitted) {
                  if (i === q.answer) { bg = 'rgba(0,255,127,0.08)'; border = '#00FF7F'; color = '#00FF7F' }
                  else if (i === selected && i !== q.answer) { bg = 'rgba(255,68,68,0.08)'; border = '#FF4444'; color = '#FF4444' }
                } else if (i === selected) { bg = 'rgba(191,255,0,0.08)'; border = 'var(--neon)' }
                return (
                  <div key={i} onClick={() => !submitted && setSelected(i)} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: '14px 18px', cursor: submitted ? 'default' : 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 12, color, transition: 'all 0.15s' }}>
                    <div style={{ width: 28, height: 28, border: `1px solid ${border}`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700, flexShrink: 0, background: i === selected ? 'var(--neon)' : 'transparent', color: i === selected ? '#000' : 'inherit' }}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    {opt}
                  </div>
                )
              })}
            </div>
          )}

          {(q.type === 'fill' || q.type === 'listen') && (
            <>
              {q.type === 'listen' && (
                <div style={{ background: 'var(--card2)', border: '1px solid var(--bdr)', borderRadius: 10, padding: 20, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, background: 'var(--neon)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#000', cursor: 'pointer', flexShrink: 0 }}>▶</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Play Audio</div>
                    <div style={{ fontSize: 11, color: 'var(--mu)' }}>0:00 / 0:08</div>
                  </div>
                  <div style={{ flex: 1, height: 36, background: 'repeating-linear-gradient(90deg,var(--bdr) 0px,var(--bdr) 2px,transparent 2px,transparent 8px)', borderRadius: 4 }} />
                </div>
              )}
              <input
                value={fillVal}
                onChange={e => !submitted && setFillVal(e.target.value)}
                placeholder="Type your answer..."
                style={{ width: '100%', background: 'var(--card2)', border: `2px solid ${submitted ? (isCorrect() ? '#00FF7F' : '#FF4444') : 'var(--bdr)'}`, borderRadius: 10, padding: 16, fontSize: 18, textAlign: 'center', color: 'var(--fg)', outline: 'none', boxSizing: 'border-box' }}
              />
              {submitted && !isCorrect() && (
                <div style={{ marginTop: 8, fontSize: 13, color: '#00FF7F' }}>Correct answer: <strong>{q.answer}</strong></div>
              )}
            </>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => current > 0 && (setCurrent(c => c - 1), setSubmitted(false), setSelected(null), setFillVal(''))} style={{ background: 'none', border: '1px solid var(--bdr)', color: 'var(--mu)', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>← Previous</button>
          {!submitted
            ? <button onClick={submit} disabled={q.type === 'mc' ? selected === null : fillVal.trim() === ''} style={{ background: 'var(--neon)', color: '#000', border: 'none', padding: '12px 28px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 15, opacity: (q.type === 'mc' ? selected === null : fillVal.trim() === '') ? 0.5 : 1 }}>Submit Answer →</button>
            : <button onClick={next} style={{ background: 'var(--neon)', color: '#000', border: 'none', padding: '12px 28px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>{current + 1 >= questions.length ? 'See Results 🏆' : 'Next Question →'}</button>
          }
        </div>
      </div>
    </div>
  )
}
