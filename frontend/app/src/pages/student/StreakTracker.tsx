import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import { Flame } from 'lucide-react'

export default function StreakTracker() {
  const [streak, setStreak] = useState<any>(null)

  useEffect(() => {
    api.get('/api/student/dashboard').then(r => setStreak(r.data)).catch(() => {})
  }, [])

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const monthName = now.toLocaleString('default', { month: 'long' })
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7 // Mon=0
  const today = now.getDate()

  // Simulate activity: last 7 days done, day 4 and 17 missed
  const done = new Set<number>()
  const missed = new Set<number>([4, 17])
  for (let d = 1; d < today; d++) if (!missed.has(d)) done.add(d)

  const days = ['M','T','W','T','F','S','S']

  return (
    <div className="pg">
      <div className="ph"><div><h1>Streak Tracker</h1><p>Track your daily learning consistency</p></div></div>

      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Big streak display */}
        <div style={{ textAlign: 'center', marginBottom: 32, padding: 36, background: 'linear-gradient(135deg,rgba(255,120,0,.06),transparent)', border: '1px solid rgba(255,120,0,.2)', borderRadius: 'var(--rl)' }}>
          <span style={{ fontSize: 64, display: 'block', marginBottom: 8, filter: 'drop-shadow(0 0 16px rgba(255,120,0,.5))' }}><Flame size={16} /></span>
          <div style={{ fontFamily: 'Syne', fontSize: 72, fontWeight: 800, lineHeight: 1, color: 'var(--wa)', textShadow: '0 0 24px rgba(255,184,0,.4)' }}>7</div>
          <div style={{ fontSize: 18, fontWeight: 700, margin: '8px 0 4px' }}>Day Streak!</div>
          <div style={{ fontSize: 14, color: 'var(--mu)' }}>Your longest streak: <strong style={{ color: 'var(--fg)' }}>14 days</strong></div>
          <div style={{ marginTop: 16, display: 'inline-flex', gap: 16, background: 'rgba(255,255,255,.04)', border: '1px solid var(--bdr)', borderRadius: 10, padding: '14px 24px' }}>
            {[['7','Current'],['14','Best'],['38','Total Days']].map(([v,l]) => (
              <React.Fragment key={l}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 800, color: l === 'Current' ? 'var(--neon)' : 'var(--fg)' }}>{v}</div>
                  <div style={{ fontSize: 11, color: 'var(--mu)' }}>{l}</div>
                </div>
                {l !== 'Total Days' && <div style={{ width: 1, background: 'var(--bdr)' }} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{monthName} {year}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6, marginBottom: 10 }}>
            {days.map((d, i) => <div key={i} style={{ textAlign: 'center', fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--mu2)', padding: 4 }}>{d}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} style={{ aspectRatio: '1', borderRadius: 8, background: 'var(--card)', border: '1px solid var(--bdr)' }} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1
              const isToday = d === today
              const isDone = done.has(d)
              const isMissed = missed.has(d) && d < today
              return (
                <div key={d} style={{ aspectRatio: '1', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'transform .15s', background: isToday ? 'rgba(191,255,0,.15)' : isDone ? 'linear-gradient(135deg,var(--neon),var(--neon2))' : isMissed ? 'rgba(255,68,68,.1)' : 'var(--card)', border: isToday ? '2px solid var(--neon)' : '1px solid var(--bdr)', color: isToday ? 'var(--neon)' : isDone ? '#000' : isMissed ? 'var(--er)' : 'var(--mu2)', boxShadow: isDone ? '0 0 8px rgba(191,255,0,.3)' : 'none' }}>
                  {d}
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 16, fontSize: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--neon)', display: 'inline-block' }} /> Completed</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(255,68,68,.3)', display: 'inline-block' }} /> Missed</span>
            <span style={{ color: 'var(--neon)', display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, border: '2px solid var(--neon)', display: 'inline-block' }} /> Today</span>
          </div>
        </div>
      </div>
    </div>
  )
}
