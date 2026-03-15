import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usersApi } from '../../api/client'

const LANGS = [
  { flag: '🇷🇼', name: 'Kinyarwanda' },
  { flag: '🇬🇧', name: 'English' },
  { flag: '🇫🇷', name: 'French' },
  { flag: '🇪🇸', name: 'Spanish' },
  { flag: '🇩🇪', name: 'German' },
  { flag: '🇯🇵', name: 'Japanese' },
]

export default function Welcome() {
  const nav = useNavigate()
  const [activeLang, setActiveLang] = useState(0)
  const [stats, setStats] = useState({ active_learners: 0, languages: 0, courses: 0, instructors: 0, success_rate: 0 })

  useEffect(() => {
    usersApi.getPlatformStats().then(d => setStats(d)).catch(() => {})
  }, [])

  const fmt = (n: number, fallback: string) =>
    n >= 1000000 ? (n / 1000000).toFixed(1) + 'M+' : n >= 1000 ? (n / 1000).toFixed(0) + 'K+' : n ? n + '+' : fallback

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{ height: 66, background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid #2a2a2a', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
          <div style={{ width: 38, height: 38, background: '#BFFF00', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🧠</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#fff' }}>
            FLUENT<span style={{ color: '#BFFF00' }}>FUSION</span>
          </div>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {[['Features', '/features'], ['Pricing', '/pricing'], ['Community', '/community']].map(([l, href]) => (
            <a key={String(l)} onClick={() => nav(String(href))} style={{ fontSize: 14, color: '#888', textDecoration: 'none', cursor: 'pointer' }}>{String(l)}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => nav('/login')} style={{ display: 'inline-flex', alignItems: 'center', padding: '11px 24px', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', background: 'transparent', color: '#888', transition: 'all .18s' }}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = '#fff'; (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = '#888'; (e.target as HTMLElement).style.background = 'transparent' }}>
            Login
          </button>
          <button onClick={() => nav('/signup')} style={{ display: 'inline-flex', alignItems: 'center', padding: '11px 24px', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', background: '#BFFF00', color: '#0a0a0a', boxShadow: '0 0 12px rgba(191,255,0,0.25)', transition: 'all .18s' }}
            onMouseEnter={e => { (e.target as HTMLElement).style.background = '#8FEF00' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.background = '#BFFF00' }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: 'calc(100vh - 66px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 40px', position: 'relative', overflow: 'hidden' }}>
        {/* bg glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(191,255,0,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        {/* grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(42,42,42,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(42,42,42,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%)', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 760 }}>
          {/* eyebrow */}
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: '#BFFF00', textTransform: 'uppercase', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <span style={{ display: 'block', width: 32, height: 1, background: '#BFFF00', opacity: 0.5 }} />
            AI-Powered Language Learning
            <span style={{ display: 'block', width: 32, height: 1, background: '#BFFF00', opacity: 0.5 }} />
          </div>

          {/* title */}
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(44px, 6vw, 76px)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1.0, marginBottom: 24 }}>
            BREAKING<br />LANGUAGE<br />
            <span style={{ color: '#BFFF00', textShadow: '0 0 12px rgba(191,255,0,0.55), 0 0 24px rgba(191,255,0,0.28)' }}>BARRIERS</span>
          </h1>

          <p style={{ fontSize: 18, color: '#888', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 40px' }}>
            Master any language with AI-personalized lessons, live sessions, and a global community of learners.
          </p>

          {/* CTA */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 64, flexWrap: 'wrap' }}>
            <button onClick={() => nav('/signup')} style={{ display: 'inline-flex', alignItems: 'center', padding: '15px 36px', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600, cursor: 'pointer', border: 'none', background: '#BFFF00', color: '#0a0a0a', boxShadow: '0 0 12px rgba(191,255,0,0.25)', transition: 'all .18s' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.background = '#8FEF00'; (e.target as HTMLElement).style.boxShadow = '0 0 24px rgba(191,255,0,0.30), 0 0 48px rgba(191,255,0,0.14)' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = '#BFFF00'; (e.target as HTMLElement).style.boxShadow = '0 0 12px rgba(191,255,0,0.25)' }}>
              Get Started Free →
            </button>
            <button onClick={() => nav('/login')} style={{ display: 'inline-flex', alignItems: 'center', padding: '15px 36px', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600, cursor: 'pointer', background: 'transparent', color: '#fff', border: '1px solid #333', transition: 'all .18s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#BFFF00'; (e.currentTarget as HTMLElement).style.color = '#BFFF00' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#333'; (e.currentTarget as HTMLElement).style.color = '#fff' }}>
              Sign In
            </button>
          </div>

          {/* lang pills label */}
          <div style={{ marginBottom: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', color: '#555', textTransform: 'uppercase' }}>
            Select language to learn
          </div>

          {/* lang pills */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {LANGS.map((l, i) => (
              <div key={l.name} onClick={() => setActiveLang(i)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', background: i === activeLang ? 'rgba(191,255,0,0.10)' : '#151515', border: `1px solid ${i === activeLang ? '#BFFF00' : '#2a2a2a'}`, borderRadius: 99, fontSize: 13, fontWeight: 500, cursor: 'pointer', color: i === activeLang ? '#BFFF00' : '#fff', transition: 'all .15s' }}>
                <span style={{ fontSize: 16 }}>{l.flag}</span>
                {l.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap', padding: 32, borderTop: '1px solid #2a2a2a', borderBottom: '1px solid #2a2a2a', background: 'rgba(255,255,255,0.01)' }}>
        {[
          [fmt(stats.active_learners, '2M+'), 'Active Learners'],
          [fmt(stats.languages, '40+'), 'Languages'],
          [fmt(stats.courses, '500+'), 'Courses'],
          [stats.success_rate ? stats.success_rate + '%' : '98%', 'Success Rate'],
          [fmt(stats.instructors, '150+'), 'Expert Instructors'],
        ].map(([val, label]) => (
          <div key={String(label)} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, color: '#BFFF00', textShadow: '0 0 12px rgba(191,255,0,0.55), 0 0 24px rgba(191,255,0,0.28)' }}>{String(val)}</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{String(label)}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, padding: '48px 40px' }}>
        {[
          ['🤖', 'AI Personalization', 'Adaptive lessons that adjust to your pace and learning style in real time.'],
          ['🎥', 'Live Sessions', 'Join real-time classes with certified native-speaker instructors.'],
          ['🏆', 'Gamification', 'Streaks, XP, badges, and leaderboards to keep you motivated daily.'],
          ['🌍', 'Global Community', 'Practice with millions of learners worldwide in discussion threads.'],
        ].map(([icon, title, desc]) => (
          <div key={String(title)} style={{ background: '#151515', border: '1px solid #2a2a2a', borderRadius: 14, padding: 24, textAlign: 'center', transition: 'all .2s', cursor: 'default' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(191,255,0,0.25)'; (e.currentTarget as HTMLElement).style.background = 'rgba(191,255,0,0.03)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLElement).style.background = '#151515' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{String(icon)}</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{String(title)}</div>
            <div style={{ fontSize: 13, color: '#888', lineHeight: 1.55 }}>{String(desc)}</div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer style={{ padding: '28px 40px', borderTop: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
          <div style={{ width: 30, height: 30, background: '#BFFF00', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🧠</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#fff' }}>
            FLUENT<span style={{ color: '#BFFF00' }}>FUSION</span>
          </div>
        </a>
        <div style={{ fontSize: 12, color: '#888' }}>© 2026 FluentFusion AI · All rights reserved</div>
        <div style={{ display: 'flex', gap: 16 }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#" style={{ fontSize: 13, color: '#888', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>

    </div>
  )
}
