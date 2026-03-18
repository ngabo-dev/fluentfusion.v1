import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../api/client'

const LANG_FLAGS: Record<string, string> = {
  rw:'🇷🇼', en:'🇬🇧', fr:'🇫🇷', es:'🇪🇸', pt:'🇵🇹', zh:'🇨🇳', de:'🇩🇪', ja:'🇯🇵', ar:'🇦🇪', ko:'🇰🇷', it:'🇮🇹', ru:'🇷🇺', hi:'🇮🇳', nl:'🇳🇱', sv:'🇸🇪',
}

const DEFAULT_LANGS = [
  { code:'rw', name:'Kinyarwanda', flag:'🇷🇼', country:'Rwanda' },
  { code:'en', name:'English', flag:'🇬🇧', country:'Global' },
  { code:'fr', name:'French', flag:'🇫🇷', country:'France' },
  { code:'es', name:'Spanish', flag:'🇪🇸', country:'Spain' },
  { code:'de', name:'German', flag:'🇩🇪', country:'Germany' },
  { code:'ja', name:'Japanese', flag:'🇯🇵', country:'Japan' },
  { code:'zh', name:'Mandarin', flag:'🇨🇳', country:'China' },
  { code:'ar', name:'Arabic', flag:'🇦🇪', country:'Arabic World' },
  { code:'ko', name:'Korean', flag:'🇰🇷', country:'Korea' },
]

function OnboardShell({ step, total, children }: { step: number; total: number; children: React.ReactNode }) {
  const nav = useNavigate()
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <nav style={{ height: 60, background: 'rgba(10,10,10,.97)', borderBottom: '1px solid var(--bdr)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => nav('/')}>
          <div className="logo-mark">FF</div>
          <div className="logo-name">Fluent<span>Fusion</span></div>
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--mu)' }}>Step {step} of {total} — Setting up your profile</span>
      </nav>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        {children}
      </div>
    </div>
  )
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{ height: 4, borderRadius: 99, background: i < step ? 'var(--neon)' : 'var(--bdr)', width: i === step - 1 ? 32 : 20, boxShadow: i < step ? '0 0 8px rgba(191,255,0,.4)' : 'none', transition: 'all .3s' }} />
      ))}
    </div>
  )
}

// ─── Step 1: Native Language ───────────────────────────────────────────────
export function OnboardNativeLang() {
  const nav = useNavigate()
  const [selected, setSelected] = useState<string | null>(null)
  const [langs, setLangs] = useState(DEFAULT_LANGS)

  useEffect(() => {
    const token = localStorage.getItem('ff_access_token')
    fetch(`${API_BASE_URL}/languages`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then(r => r.ok ? r.json() : null).then(d => {
        if (d?.languages?.length) setLangs(d.languages.map((l: any) => ({ code: l.code || l.name?.toLowerCase(), name: l.name, flag: LANG_FLAGS[l.code?.toLowerCase()] || '🌐', country: l.country || 'Global' })))
      }).catch(() => {})
  }, [])

  return (
    <OnboardShell step={1} total={4}>
      <div style={{ width: '100%', maxWidth: 640, background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 'var(--rl)', padding: 32 }}>
        <ProgressBar step={1} total={4} />
        <div style={{ display: 'inline-flex', background: 'rgba(191,255,0,.1)', border: '1px solid rgba(191,255,0,.2)', borderRadius: 99, padding: '4px 14px', marginBottom: 16 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--neon)', letterSpacing: '1px', textTransform: 'uppercase' }}>Step 1 of 4</span>
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
          What's your <span style={{ color: 'var(--neon)' }}>Native Language?</span>
        </h1>
        <p style={{ fontSize: 14, color: 'var(--mu)', marginBottom: 28 }}>We'll use this to translate and personalize your experience.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
          {langs.map(l => (
            <button key={l.code} onClick={() => setSelected(l.code)} style={{ padding: '16px 14px', borderRadius: 14, textAlign: 'left', background: selected === l.code ? 'rgba(191,255,0,.1)' : 'var(--card2)', border: `${selected === l.code ? 2 : 1}px solid ${selected === l.code ? 'var(--neon)' : 'var(--bdr)'}`, cursor: 'pointer', transition: 'all .15s' }}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>{l.flag}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>{l.name}</div>
              <div style={{ fontSize: 11, color: 'var(--mu)' }}>{l.country}</div>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button className="btn bg" onClick={() => nav('/onboard/learn-language')}>Skip</button>
          <button className="btn bp" disabled={!selected} onClick={() => { localStorage.setItem('onboarding_native_lang', selected!); nav('/onboard/learn-language') }} style={{ opacity: selected ? 1 : .4 }}>Continue →</button>
        </div>
      </div>
    </OnboardShell>
  )
}

// ─── Step 2: Language to Learn ────────────────────────────────────────────
export function OnboardLearnLang() {
  const nav = useNavigate()
  const [selected, setSelected] = useState<string | null>(null)
  const [langs, setLangs] = useState(DEFAULT_LANGS.map(l => ({ ...l, learners: '↑ Popular' })))

  useEffect(() => {
    const token = localStorage.getItem('ff_access_token')
    fetch(`${API_BASE_URL}/languages`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then(r => r.ok ? r.json() : null).then(d => {
        if (d?.languages?.length) setLangs(d.languages.map((l: any) => ({ code: l.code || l.name?.toLowerCase(), name: l.name, flag: LANG_FLAGS[l.code?.toLowerCase()] || '🌐', country: l.country || 'Global', learners: l.learner_count ? `↑ ${(l.learner_count/1000).toFixed(0)}K learners` : '↑ Popular' })))
      }).catch(() => {})
  }, [])

  return (
    <OnboardShell step={2} total={4}>
      <div style={{ width: '100%', maxWidth: 640, background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 'var(--rl)', padding: 32 }}>
        <ProgressBar step={2} total={4} />
        <div style={{ display: 'inline-flex', background: 'rgba(191,255,0,.1)', border: '1px solid rgba(191,255,0,.2)', borderRadius: 99, padding: '4px 14px', marginBottom: 16 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--neon)', letterSpacing: '1px', textTransform: 'uppercase' }}>Step 2 of 4</span>
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
          What do you want to <span style={{ color: 'var(--neon)' }}>Learn?</span>
        </h1>
        <p style={{ fontSize: 14, color: 'var(--mu)', marginBottom: 28 }}>Pick the language you're most excited to master.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
          {langs.map((l: any) => (
            <button key={l.code} onClick={() => setSelected(l.code)} style={{ padding: '16px 14px', borderRadius: 14, textAlign: 'left', background: selected === l.code ? 'rgba(191,255,0,.1)' : 'var(--card2)', border: `${selected === l.code ? 2 : 1}px solid ${selected === l.code ? 'var(--neon)' : 'var(--bdr)'}`, cursor: 'pointer', transition: 'all .15s' }}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>{l.flag}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>{l.name}</div>
              <div style={{ fontSize: 11, color: 'var(--mu)' }}>{l.country}</div>
              <div style={{ fontSize: 11, color: 'var(--neon)', marginTop: 4 }}>{l.learners}</div>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button className="btn bg" onClick={() => nav('/onboard/native-language')}>← Back</button>
          <button className="btn bp" disabled={!selected} onClick={() => { localStorage.setItem('onboarding_learn_lang', selected!); nav('/onboard/goal') }} style={{ opacity: selected ? 1 : .4 }}>Continue →</button>
        </div>
      </div>
    </OnboardShell>
  )
}

// ─── Step 3: Goal ─────────────────────────────────────────────────────────
const GOALS = [
  { id:'travel', icon:'✈️', title:'Travel', desc:'Navigate new countries and connect with locals while travelling.' },
  { id:'academic', icon:'🎓', title:'Academic', desc:'Study abroad or pursue academic opportunities in a new language.' },
  { id:'business', icon:'💼', title:'Business', desc:'Expand your professional network and career globally.' },
  { id:'conversation', icon:'💬', title:'Conversation', desc:'Make new friends and communicate with people from different cultures.' },
]

export function OnboardGoal() {
  const nav = useNavigate()
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <OnboardShell step={3} total={4}>
      <div style={{ width: '100%', maxWidth: 600, background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 'var(--rl)', padding: 32 }}>
        <ProgressBar step={3} total={4} />
        <div style={{ display: 'inline-flex', background: 'rgba(191,255,0,.1)', border: '1px solid rgba(191,255,0,.2)', borderRadius: 99, padding: '4px 14px', marginBottom: 16 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--neon)', letterSpacing: '1px', textTransform: 'uppercase' }}>Step 3 of 4</span>
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
          What's your <span style={{ color: 'var(--neon)' }}>Learning Goal?</span>
        </h1>
        <p style={{ fontSize: 14, color: 'var(--mu)', marginBottom: 28 }}>This helps us curate the best content for you.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
          {GOALS.map(g => (
            <button key={g.id} onClick={() => setSelected(g.id)} style={{ padding: '22px 20px', borderRadius: 14, textAlign: 'left', display: 'flex', gap: 14, alignItems: 'flex-start', background: selected === g.id ? 'rgba(191,255,0,.1)' : 'var(--card2)', border: `${selected === g.id ? 2 : 1}px solid ${selected === g.id ? 'var(--neon)' : 'var(--bdr)'}`, cursor: 'pointer', transition: 'all .15s' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: selected === g.id ? 'rgba(191,255,0,.15)' : 'rgba(255,255,255,.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{g.icon}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg)', marginBottom: 4 }}>{g.title}</div>
                <div style={{ fontSize: 12, color: 'var(--mu)', lineHeight: 1.5 }}>{g.desc}</div>
              </div>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button className="btn bg" onClick={() => nav('/onboard/learn-language')}>← Back</button>
          <button className="btn bp" disabled={!selected} onClick={() => { localStorage.setItem('onboarding_goal', selected!); nav('/onboard/level') }} style={{ opacity: selected ? 1 : .4 }}>Continue →</button>
        </div>
      </div>
    </OnboardShell>
  )
}

// ─── Step 4: Level ────────────────────────────────────────────────────────
const LEVELS = [
  { id:'beginner', emoji:'🌱', name:'Beginner', desc:'I know very little or nothing. Start from scratch.', dots:[1,0,0] },
  { id:'intermediate', emoji:'🌿', name:'Intermediate', desc:'I know the basics and can handle simple conversations.', dots:[1,1,0] },
  { id:'advanced', emoji:'🌳', name:'Advanced', desc:"I'm fluent and want to polish my skills further.", dots:[1,1,1] },
]

export function OnboardLevel() {
  const nav = useNavigate()
  const [selected, setSelected] = useState<string | null>(null)

  function finish() {
    if (!selected) return
    localStorage.setItem('onboarding_level', selected)
    // Persist all onboarding data to DB
    const token = localStorage.getItem('ff_access_token')
    const payload = {
      native_lang: localStorage.getItem('onboarding_native_lang'),
      learn_lang: localStorage.getItem('onboarding_learn_lang'),
      goal: localStorage.getItem('onboarding_goal'),
      level: selected,
    }
    fetch(`${API_BASE_URL}/student/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(payload),
    }).catch(() => {}) // fire-and-forget — localStorage is the fallback
    nav('/dashboard')
  }

  return (
    <OnboardShell step={4} total={4}>
      <div style={{ width: '100%', maxWidth: 560, background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 'var(--rl)', padding: 32 }}>
        <ProgressBar step={4} total={4} />
        <div style={{ display: 'inline-flex', background: 'rgba(191,255,0,.1)', border: '1px solid rgba(191,255,0,.2)', borderRadius: 99, padding: '4px 14px', marginBottom: 16 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--neon)', letterSpacing: '1px', textTransform: 'uppercase' }}>Step 4 of 4</span>
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
          What's your <span style={{ color: 'var(--neon)' }}>Current Level?</span>
        </h1>
        <p style={{ fontSize: 14, color: 'var(--mu)', marginBottom: 28 }}>Be honest — we'll create the perfect starting point for you.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          {LEVELS.map(l => (
            <button key={l.id} onClick={() => setSelected(l.id)} style={{ padding: '22px 24px', borderRadius: 14, textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: selected === l.id ? 'rgba(191,255,0,.1)' : 'var(--card2)', border: `${selected === l.id ? 2 : 1}px solid ${selected === l.id ? 'var(--neon)' : 'var(--bdr)'}`, cursor: 'pointer', transition: 'all .15s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 26 }}>{l.emoji}</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg)', marginBottom: 4 }}>{l.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--mu)' }}>{l.desc}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                {l.dots.map((f, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: 5, background: f ? 'var(--neon)' : 'var(--bdr)', boxShadow: f ? '0 0 4px rgba(191,255,0,.5)' : 'none' }} />)}
              </div>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button className="btn bg" onClick={() => nav('/onboard/goal')}>← Back</button>
          <button className="btn bp" disabled={!selected} onClick={finish} style={{ padding: '12px 28px', opacity: selected ? 1 : .4 }}>Finish Setup 🎉</button>
        </div>
      </div>
    </OnboardShell>
  )
}
