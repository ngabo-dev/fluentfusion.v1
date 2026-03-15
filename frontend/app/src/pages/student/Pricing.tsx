import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const plans = [
  {
    tier: 'Free', name: 'Starter', monthly: 0, annual: 0, muted: true,
    desc: 'Perfect to try FluentFusion',
    cta: 'Get Started Free', ctaStyle: 'outline',
    features: [
      { inc: true,  label: '3 free courses' },
      { inc: true,  label: 'Basic flashcards' },
      { inc: true,  label: 'Community access' },
      { inc: true,  label: 'Daily streak tracking' },
      { inc: false, label: 'AI Pronunciation feedback' },
      { inc: false, label: 'Live sessions' },
      { inc: false, label: 'Certificates' },
    ],
  },
  {
    tier: 'Pro', name: 'Learner', monthly: 15, annual: 9, popular: true,
    desc: 'billed annually',
    cta: 'Start 7-Day Free Trial →', ctaStyle: 'primary',
    features: [
      { inc: true,  label: 'Unlimited courses' },
      { inc: true,  label: 'AI pronunciation feedback' },
      { inc: true,  label: '2 live sessions / month' },
      { inc: true,  label: 'Completion certificates' },
      { inc: true,  label: 'Offline downloads' },
      { inc: false, label: 'Unlimited live sessions' },
      { inc: false, label: '1-on-1 tutoring' },
    ],
  },
  {
    tier: 'Premium', name: 'Fluent', monthly: 40, annual: 24, muted: true,
    desc: 'billed annually',
    cta: 'Get Fluent →', ctaStyle: 'outline',
    features: [
      { inc: true, label: 'Everything in Pro' },
      { inc: true, label: 'Unlimited live sessions' },
      { inc: true, label: '1-on-1 tutoring sessions' },
      { inc: true, label: 'Priority support' },
      { inc: true, label: 'Custom learning path' },
      { inc: true, label: 'Advanced analytics' },
      { inc: true, label: 'Early access features' },
    ],
  },
]

export default function Pricing() {
  const nav = useNavigate()
  const [annual, setAnnual] = useState(true)

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
            <a key={String(l)} onClick={() => nav(String(href))} style={{ fontSize: 14, color: String(href) === '/pricing' ? '#BFFF00' : '#888', textDecoration: 'none', cursor: 'pointer' }}>{String(l)}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => nav('/login')} style={{ padding: '11px 24px', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', background: 'transparent', color: '#888' }}>Login</button>
          <button onClick={() => nav('/signup')} style={{ padding: '11px 24px', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', background: '#BFFF00', color: '#0a0a0a' }}>Get Started</button>
        </div>
      </nav>

      <main style={{ padding: '64px 40px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 16px' }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 44, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.03em', marginBottom: 12 }}>
            Simple, <span style={{ color: '#BFFF00' }}>Honest</span> Pricing
          </div>
          <div style={{ fontSize: 16, color: '#888' }}>Start free. Upgrade when you're ready. Cancel anytime.</div>

          {/* Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 20 }}>
            <span style={{ fontSize: 14, color: annual ? '#888' : '#fff' }}>Monthly</span>
            <div onClick={() => setAnnual(!annual)} style={{ width: 44, height: 24, borderRadius: 12, background: '#BFFF00', position: 'relative', cursor: 'pointer' }}>
              <div style={{ position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: '#000', top: 3, transition: 'left .2s', left: annual ? 23 : 3 }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: annual ? '#BFFF00' : '#888' }}>
              Annual{' '}
              <span style={{ background: 'rgba(191,255,0,0.12)', borderRadius: 4, padding: '2px 6px', fontSize: 11 }}>Save 40%</span>
            </span>
          </div>
        </div>

        {/* Plans grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 900, margin: '40px auto' }}>
          {plans.map(plan => (
            <div key={plan.tier} style={{ background: '#151515', border: `1px solid ${plan.popular ? '#BFFF00' : '#2a2a2a'}`, borderRadius: 20, padding: 32, position: 'relative', transition: 'all .2s', boxShadow: plan.popular ? '0 0 24px rgba(191,255,0,0.30), 0 0 48px rgba(191,255,0,0.14)' : 'none' }}>
              {plan.popular && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#BFFF00', color: '#000', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 99, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  ⭐ Most Popular
                </div>
              )}
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: plan.popular ? '#BFFF00' : '#888', marginBottom: 8 }}>{plan.tier}</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{plan.name}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 44, fontWeight: 800, lineHeight: 1, margin: '16px 0 4px', color: plan.popular ? '#BFFF00' : '#fff' }}>
                ${annual ? plan.annual : plan.monthly}
                <span style={{ fontSize: 16, fontWeight: 400, color: '#888' }}>/mo</span>
              </div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>
                {plan.annual === 0 ? 'Perfect to try FluentFusion' : (
                  <><s style={{ color: '#555' }}>${plan.monthly}/mo</s> {plan.desc}</>
                )}
              </div>
              <button onClick={() => nav('/signup')}
                style={{ width: '100%', padding: '11px 24px', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 20, transition: 'all .18s', ...(plan.ctaStyle === 'primary' ? { background: '#BFFF00', color: '#0a0a0a', border: 'none', boxShadow: '0 0 24px rgba(191,255,0,0.30)' } : { background: 'transparent', color: '#fff', border: '1px solid #333' }) }}>
                {plan.cta}
              </button>
              {plan.features.map(f => (
                <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', fontSize: 14, color: f.inc ? '#fff' : '#888', borderBottom: '1px solid rgba(42,42,42,0.4)' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0, background: f.inc ? 'rgba(0,255,127,0.12)' : 'rgba(255,255,255,0.04)', color: f.inc ? '#00FF7F' : '#555' }}>
                    {f.inc ? '✓' : '−'}
                  </div>
                  {f.label}
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
