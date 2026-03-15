import React from 'react'
import { useNavigate } from 'react-router-dom'

const features = [
  { icon: '🤖', title: 'AI Personalization', tag: 'SMART LEARNING', desc: 'Our AI engine analyzes your learning patterns, strengths, and weaknesses to build a fully personalized curriculum that adapts in real time.', bullets: ['Adaptive difficulty scaling', 'Personalized vocabulary lists', 'Smart review scheduling (SRS)', 'Learning style detection'] },
  { icon: '🎥', title: 'Live Sessions', tag: 'REAL-TIME PRACTICE', desc: 'Join live classes hosted by certified native-speaker instructors. Practice speaking, get instant feedback, and build real conversational confidence.', bullets: ['Daily live classes', 'Small group sessions (max 12)', '1-on-1 tutoring available', 'Session recordings included'] },
  { icon: '🏆', title: 'Gamification', tag: 'STAY MOTIVATED', desc: 'Learning a language is a marathon. Our gamification system keeps you engaged with daily challenges, streaks, XP points, and competitive leaderboards.', bullets: ['Daily streak tracking', 'XP & level progression', 'Achievement badges', 'Global leaderboards'] },
  { icon: '🌍', title: 'Global Community', tag: 'LEARN TOGETHER', desc: 'Connect with millions of learners worldwide. Practice writing, get corrections, share tips, and make friends who speak the language you\'re learning.', bullets: ['Discussion forums by language', 'Peer correction system', 'Language exchange matching', 'Cultural insights & tips'] },
  { icon: '📊', title: 'Progress Analytics', tag: 'TRACK EVERYTHING', desc: 'Detailed analytics give you a clear picture of your progress. Know exactly where you stand, what to focus on, and how fast you\'re improving.', bullets: ['Fluency score tracking', 'Skill breakdown charts', 'Weekly progress reports', 'PULSE wellness insights'] },
  { icon: '📱', title: 'Learn Anywhere', tag: 'MOBILE FIRST', desc: 'FluentFusion works seamlessly across all your devices. Download lessons for offline use and keep your streak alive even without internet.', bullets: ['iOS & Android apps', 'Offline lesson downloads', 'Cross-device sync', 'Dark mode support'] },
]

export default function Features() {
  const nav = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'DM Sans', sans-serif" }}>

      {/* NAV */}
      <nav style={{ height: 66, background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid #2a2a2a', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', position: 'sticky', top: 0, zIndex: 100 }}>
        <a onClick={() => nav('/')} style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none', cursor: 'pointer' }}>
          <div style={{ width: 38, height: 38, background: '#BFFF00', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🧠</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#fff' }}>
            FLUENT<span style={{ color: '#BFFF00' }}>FUSION</span>
          </div>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {[['Features', '/features'], ['Pricing', '/pricing'], ['Community', '/community']].map(([l, href]) => (
            <a key={String(l)} onClick={() => nav(String(href))} style={{ fontSize: 14, color: String(href) === '/features' ? '#BFFF00' : '#888', textDecoration: 'none', cursor: 'pointer' }}>{String(l)}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => nav('/login')} style={{ padding: '11px 24px', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', background: 'transparent', color: '#888' }}>Login</button>
          <button onClick={() => nav('/signup')} style={{ padding: '11px 24px', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', background: '#BFFF00', color: '#0a0a0a' }}>Get Started</button>
        </div>
      </nav>

      <main style={{ padding: '64px 40px', maxWidth: 1100, margin: '0 auto' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(191,255,0,0.10)', border: '1px solid rgba(191,255,0,0.2)', borderRadius: 99, padding: '4px 14px', marginBottom: 20 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#BFFF00', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Everything You Need</span>
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 16 }}>
            BUILT FOR <span style={{ color: '#BFFF00', textShadow: '0 0 12px rgba(191,255,0,0.55)' }}>REAL</span> FLUENCY
          </div>
          <p style={{ fontSize: 18, color: '#888', maxWidth: 560, margin: '0 auto' }}>
            Every feature is designed with one goal: getting you to speak confidently, faster.
          </p>
        </div>

        {/* Features grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 64 }}>
          {features.map(f => (
            <div key={f.title} style={{ background: '#151515', border: '1px solid #2a2a2a', borderRadius: 14, padding: 28, transition: 'all .2s', cursor: 'default' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(191,255,0,0.25)'; (e.currentTarget as HTMLElement).style.background = 'rgba(191,255,0,0.02)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLElement).style.background = '#151515' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, background: 'rgba(191,255,0,0.10)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#BFFF00', marginBottom: 3 }}>{f.tag}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800, textTransform: 'uppercase' }}>{f.title}</div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: '#888', lineHeight: 1.65, marginBottom: 16 }}>{f.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {f.bullets.map(b => (
                  <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#ccc' }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(0,255,127,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#00FF7F', flexShrink: 0 }}>✓</div>
                    {b}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '48px 40px', background: '#0f0f0f', border: '1px solid #2a2a2a', borderRadius: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(191,255,0,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>
              Ready to Get <span style={{ color: '#BFFF00' }}>Fluent?</span>
            </div>
            <p style={{ color: '#888', fontSize: 16, marginBottom: 28 }}>Join 2 million learners already breaking language barriers.</p>
            <button onClick={() => nav('/signup')} style={{ padding: '15px 48px', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600, cursor: 'pointer', border: 'none', background: '#BFFF00', color: '#0a0a0a', boxShadow: '0 0 24px rgba(191,255,0,0.30)' }}>
              Start for Free →
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
