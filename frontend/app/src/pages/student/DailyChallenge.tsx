import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import { CheckCircle2, Flame, Target } from 'lucide-react'

export default function DailyChallenge() {
  const [timeLeft, setTimeLeft] = useState(4 * 3600 + 32 * 60)

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(id)
  }, [])

  const h = Math.floor(timeLeft / 3600)
  const m = Math.floor((timeLeft % 3600) / 60)
  const s = timeLeft % 60
  const fmt = (n: number) => String(n).padStart(2, '0')

  const tasks = [
    { icon: '<CheckCircle2 size={16} />', label: 'Vocabulary Review', desc: 'Learn 10 new words', xp: '+100 XP', done: true },
    { icon: '<CheckCircle2 size={16} />', label: 'Speaking Practice', desc: 'Record 3 pronunciation exercises', xp: '+100 XP', done: true },
    { icon: <Target size={16} />, label: 'Complete a Lesson', desc: 'Finish any lesson in your enrolled courses', xp: '+100 XP', done: false },
  ]
  const doneCount = tasks.filter(t => t.done).length
  const pct = Math.round((doneCount / tasks.length) * 100)
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="pg">
      <div className="ph"><div><h1>Daily Challenge</h1><p>Complete all tasks today to earn bonus XP and maintain your streak!</p></div></div>

      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg,rgba(191,255,0,.08),rgba(191,255,0,.02))', border: '1px solid rgba(191,255,0,.15)', borderRadius: 'var(--rl)', padding: 36, textAlign: 'center', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
          {/* Timer ring */}
          <div style={{ width: 120, height: 120, position: 'relative', margin: '0 auto 20px' }}>
            <svg viewBox="0 0 120 120" width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="60" cy="60" r="54" fill="none" stroke="var(--bdr)" strokeWidth="8" />
              <circle cx="60" cy="60" r="54" fill="none" stroke="var(--neon)" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={offset}
                style={{ filter: 'drop-shadow(0 0 6px rgba(191,255,0,.5))' }} />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontFamily: 'Syne', fontSize: 18, fontWeight: 800, color: 'var(--neon)' }}>
              {fmt(h)}:{fmt(m)}:{fmt(s)}
            </div>
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '.15em', color: 'var(--mu)', textTransform: 'uppercase', marginBottom: 8 }}>Time Remaining Today</div>
          <div style={{ fontFamily: 'Syne', fontSize: 26, fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>Today's Challenge</div>
          <div style={{ fontSize: 14, color: 'var(--mu)', marginBottom: 16 }}>Complete 3 tasks to earn <span style={{ color: 'var(--neon)', fontWeight: 700 }}>+300 Bonus XP</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
            <div style={{ width: 140, height: 8, background: 'var(--bdr)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,var(--neon2),var(--neon))', borderRadius: 99 }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--neon)' }}>{doneCount} / {tasks.length} done</span>
          </div>
        </div>

        {/* Tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {tasks.map(t => (
            <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', background: t.done ? 'rgba(0,255,127,.04)' : 'rgba(191,255,0,.04)', border: `1px solid ${t.done ? 'rgba(0,255,127,.25)' : 'rgba(191,255,0,.3)'}`, borderRadius: 'var(--rl)', transition: 'all .2s', cursor: 'pointer' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, background: t.done ? 'rgba(0,255,127,.1)' : 'rgba(191,255,0,.12)' }}>{t.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{t.label}</div>
                <div style={{ fontSize: 13, color: 'var(--mu)' }}>{t.desc}</div>
              </div>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: t.done ? 'var(--ok)' : 'var(--neon)', fontWeight: 600 }}>{t.xp} · {t.done ? 'Done' : 'Pending'}</span>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button className="btn bp" style={{ padding: '14px 32px', fontSize: 15 }}>Start Next Task →</button>
          <div style={{ fontSize: 12, color: 'var(--mu)', marginTop: 12 }}>Complete before midnight to keep your 7-day streak <Flame size={16} /></div>
        </div>
      </div>
    </div>
  )
}
