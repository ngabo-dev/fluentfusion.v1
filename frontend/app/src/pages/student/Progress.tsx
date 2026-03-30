import React from 'react'
import { Crown, Flame, Gem, Globe, GraduationCap, Lightbulb, Target, Trophy, Zap } from 'lucide-react'

const skills = [
  { name: 'Vocabulary', pct: 78, color: 'linear-gradient(90deg,#99cc00,#BFFF00)' },
  { name: 'Grammar',    pct: 65, color: 'linear-gradient(90deg,#00CFFF,#0080FF)' },
  { name: 'Speaking',   pct: 54, color: 'linear-gradient(90deg,#FFD700,#FF8800)' },
  { name: 'Listening',  pct: 82, color: 'linear-gradient(90deg,#99cc00,#BFFF00)' },
  { name: 'Reading',    pct: 71, color: 'linear-gradient(90deg,#00CFFF,#0080FF)' },
  { name: 'Writing',    pct: 48, color: 'linear-gradient(90deg,#FFD700,#FF8800)' },
]

const courses = [
  { name: 'English for Tourism', pct: 62, color: '#BFFF00' },
  { name: 'French Essentials',   pct: 15, color: '#BFFF00' },
  { name: 'Spanish Survival',    pct: 100, color: '#00FF7F' },
]

const bars = [35, 70, 50, 90, 65, 40, 80]
const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

const badges = [
  { icon: <Target size={16} />, name: 'First Lesson',   desc: 'Completed your first lesson', earned: true },
  { icon: <Flame size={16} />, name: '7-Day Streak',   desc: '7 days in a row',             earned: true },
  { icon: <Zap size={16} />, name: 'Speed Learner',  desc: '5 lessons in one day',        earned: true },
  { icon: <Trophy size={16} />, name: 'Perfect Score',  desc: '100% on any quiz',            earned: true },
  { icon: <Gem size={16} />, name: 'Diamond',        desc: '30-day streak',               earned: false },
  { icon: <Globe size={16} />, name: 'Polyglot',       desc: 'Learn 3 languages',           earned: false },
  { icon: <Crown size={16} />, name: 'Top Learner',    desc: 'Rank #1 on leaderboard',      earned: false },
  { icon: <GraduationCap size={16} />, name: 'Graduate',       desc: 'Complete any full course',    earned: false },
]

export default function Progress() {
  return (
    <div style={{ padding: '32px 28px', maxWidth: 1100 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>
          Your <span style={{ color: 'var(--neon)' }}>Progress</span>
        </h1>
        <p style={{ color: 'var(--mu)', fontSize: 14, marginTop: 6 }}>Track your language learning journey in detail</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Courses Completed', value: '3', sub: 'of 5 enrolled' },
          { label: 'Total XP',          value: '4,820', sub: 'Level 6 · Gold' },
          { label: 'Best Streak',       value: '14<Flame size={16} />', sub: 'Current: 7 days' },
          { label: 'Avg Quiz Score',    value: '87%',  sub: null },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontSize: 12, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, color: 'var(--neon)' }}>{s.value}</div>
            {s.sub && <div style={{ fontSize: 12, color: 'var(--mu)', marginTop: 4 }}>{s.sub}</div>}
            {!s.sub && (
              <div style={{ height: 6, background: 'var(--bdr)', borderRadius: 99, marginTop: 8, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '87%', background: 'var(--neon)', borderRadius: 99 }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Course completion + Weekly XP */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>Course Completion</div>
          {courses.map(c => (
            <div key={c.name} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13 }}>{c.name}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: c.color }}>{c.pct}%</span>
              </div>
              <div style={{ height: 6, background: 'var(--bdr)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${c.pct}%`, background: c.color, borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>Weekly Activity (XP)</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 100 }}>
            {bars.map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', height: `${h}%`, background: 'linear-gradient(180deg,var(--neon),#99cc00)', borderRadius: '4px 4px 0 0', boxShadow: '0 0 6px rgba(191,255,0,0.3)' }} />
                <div style={{ fontSize: 11, color: 'var(--mu)' }}>{days[i]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skill Breakdown */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 12, padding: 24, marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>Skill Breakdown · English</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {[skills.slice(0,3), skills.slice(3)].map((col, ci) => (
            <div key={ci}>
              {col.map(s => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  <span style={{ fontSize: 13, width: 90, flexShrink: 0 }}>{s.name}</span>
                  <div style={{ flex: 1, height: 8, background: 'var(--bdr)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, minWidth: 36, textAlign: 'right', color: s.color.includes('CFFF') ? '#00CFFF' : s.color.includes('FFD') ? '#FFD700' : 'var(--neon)' }}>{s.pct}%</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, padding: '14px 18px', background: 'rgba(191,255,0,0.05)', border: '1px solid rgba(191,255,0,0.12)', borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--neon)', marginBottom: 4 }}><Lightbulb size={16} /> AI Suggestion</div>
          <div style={{ fontSize: 13, color: 'var(--mu)' }}>Your Speaking score is the weakest area. Try 3 speaking practice sessions this week to boost it above 70%.</div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Achievements · 4 of 8 Earned</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {badges.map(b => (
            <div key={b.name} style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 12, padding: 18, textAlign: 'center', opacity: b.earned ? 1 : 0.4, filter: b.earned ? 'none' : 'grayscale(1)', transition: 'all 0.2s' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{b.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{b.name}</div>
              <div style={{ fontSize: 11, color: 'var(--mu)' }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
