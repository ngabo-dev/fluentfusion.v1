import { useState } from 'react'
import { API_BASE_URL } from '../api/client'

async function adminLogin(email: string, password: string): Promise<string> {
  const form = new URLSearchParams()
  form.append('username', email)
  form.append('password', password)
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Login failed')
  return data.access_token
}

const STATES: Record<string, { emoji: string; color: string; desc: string }> = {
  thriving:    { emoji: '🚀', color: '#BFFF00', desc: 'High engagement, high performance' },
  coasting:    { emoji: '😐', color: '#00BFFF', desc: 'Moderate engagement, not challenged' },
  struggling:  { emoji: '😓', color: '#FF8C00', desc: 'Low performance, needs scaffolding' },
  burning_out: { emoji: '🔥', color: '#FF4444', desc: 'Declining metrics, at-risk of churn' },
  disengaged:  { emoji: '💤', color: '#888',    desc: 'Very low activity, near dropout' },
}

type BaseForm = {
  total_clicks: number
  active_days: number
  avg_score: number
  num_assessments: number
  days_to_first_submit: number
  num_of_prev_attempts: number
  studied_credits: number
  days_registered_before_start: number
  withdrew_early: number
  engagement_score: number
  performance_score: number
  decline_index: number
  consistency_score: number
}

// Derive all 31 features the model expects from the base form
function buildFeatures(f: BaseForm): Record<string, number> {
  const avg_clicks_per_day = f.active_days > 0 ? f.total_clicks / f.active_days : 0
  const max_clicks_day     = avg_clicks_per_day * 2.5
  const first_active_day   = f.days_registered_before_start > 0 ? f.days_registered_before_start : 1
  const last_active_day    = first_active_day + f.active_days
  const activity_span      = f.active_days
  const max_score          = Math.min(f.avg_score + 15, 100)
  const min_score          = Math.max(f.avg_score - 20, 0)
  const score_std          = (max_score - min_score) / 4
  const score_range        = max_score - min_score
  const clicks_per_assessment = f.num_assessments > 0 ? f.total_clicks / f.num_assessments : 0
  const score_per_credit   = f.studied_credits > 0 ? f.avg_score / f.studied_credits : 0
  const engagement_x_perf  = f.engagement_score * f.performance_score
  const active_days_x_score = f.active_days * f.avg_score

  return {
    num_of_prev_attempts:         f.num_of_prev_attempts,
    studied_credits:              f.studied_credits,
    gender:                       0,  // encoded: Unknown → 0
    highest_education:            0,
    imd_band:                     0,
    age_band:                     0,
    disability:                   0,
    total_clicks:                 f.total_clicks,
    active_days:                  f.active_days,
    max_clicks_day:               Math.round(max_clicks_day),
    last_active_day:              Math.round(last_active_day),
    first_active_day:             Math.round(first_active_day),
    avg_clicks_per_day:           parseFloat(avg_clicks_per_day.toFixed(2)),
    activity_span:                activity_span,
    avg_score:                    f.avg_score,
    max_score:                    parseFloat(max_score.toFixed(1)),
    min_score:                    parseFloat(min_score.toFixed(1)),
    num_assessments:              f.num_assessments,
    days_to_first_submit:         f.days_to_first_submit,
    score_std:                    parseFloat(score_std.toFixed(2)),
    score_range:                  parseFloat(score_range.toFixed(1)),
    days_registered_before_start: f.days_registered_before_start,
    withdrew_early:               f.withdrew_early,
    engagement_score:             f.engagement_score,
    performance_score:            f.performance_score,
    decline_index:                f.decline_index,
    consistency_score:            f.consistency_score,
    clicks_per_assessment:        parseFloat(clicks_per_assessment.toFixed(2)),
    score_per_credit:             parseFloat(score_per_credit.toFixed(4)),
    engagement_x_perf:            parseFloat(engagement_x_perf.toFixed(4)),
    active_days_x_score:          parseFloat(active_days_x_score.toFixed(2)),
  }
}

const PRESETS: { label: string; values: BaseForm }[] = [
  { label: '🚀 Thriving',    values: { total_clicks: 1500, active_days: 90,  avg_score: 88, num_assessments: 12, days_to_first_submit: 3,   num_of_prev_attempts: 3, studied_credits: 180, days_registered_before_start: 14, withdrew_early: 0, engagement_score: 0.90, performance_score: 0.88, decline_index: 0.05, consistency_score: 0.92 } },
  { label: '😐 Coasting',    values: { total_clicks: 600,  active_days: 45,  avg_score: 62, num_assessments: 6,  days_to_first_submit: 10,  num_of_prev_attempts: 1, studied_credits: 60,  days_registered_before_start: 5,  withdrew_early: 0, engagement_score: 0.50, performance_score: 0.62, decline_index: 0.20, consistency_score: 0.50 } },
  { label: '😓 Struggling',  values: { total_clicks: 200,  active_days: 20,  avg_score: 35, num_assessments: 3,  days_to_first_submit: 25,  num_of_prev_attempts: 2, studied_credits: 60,  days_registered_before_start: 0,  withdrew_early: 0, engagement_score: 0.20, performance_score: 0.35, decline_index: 0.60, consistency_score: 0.20 } },
  { label: '🔥 Burning Out', values: { total_clicks: 100,  active_days: 10,  avg_score: 40, num_assessments: 2,  days_to_first_submit: 30,  num_of_prev_attempts: 1, studied_credits: 60,  days_registered_before_start: 0,  withdrew_early: 1, engagement_score: 0.10, performance_score: 0.40, decline_index: 0.85, consistency_score: 0.10 } },
  { label: '💤 Disengaged',  values: { total_clicks: 20,   active_days: 3,   avg_score: 10, num_assessments: 1,  days_to_first_submit: 200, num_of_prev_attempts: 0, studied_credits: 0,   days_registered_before_start: 0,  withdrew_early: 1, engagement_score: 0.02, performance_score: 0.10, decline_index: 0.95, consistency_score: 0.02 } },
]

const FIELDS: { key: keyof BaseForm; label: string; min: number; max: number; step: number }[] = [
  { key: 'total_clicks',                label: 'Total Clicks',                 min: 0, max: 5000, step: 10   },
  { key: 'active_days',                 label: 'Active Days',                  min: 0, max: 365,  step: 1    },
  { key: 'avg_score',                   label: 'Avg Score (%)',                min: 0, max: 100,  step: 1    },
  { key: 'num_assessments',             label: 'Num Assessments',              min: 0, max: 50,   step: 1    },
  { key: 'days_to_first_submit',        label: 'Days to First Submit',         min: 0, max: 300,  step: 1    },
  { key: 'num_of_prev_attempts',        label: 'Prev Attempts',                min: 0, max: 10,   step: 1    },
  { key: 'studied_credits',             label: 'Studied Credits',              min: 0, max: 600,  step: 10   },
  { key: 'days_registered_before_start',label: 'Days Registered Before Start', min: 0, max: 365,  step: 1    },
  { key: 'withdrew_early',              label: 'Withdrew Early (0 / 1)',       min: 0, max: 1,    step: 1    },
  { key: 'engagement_score',            label: 'Engagement Score (0–1)',       min: 0, max: 1,    step: 0.01 },
  { key: 'performance_score',           label: 'Performance Score (0–1)',      min: 0, max: 1,    step: 0.01 },
  { key: 'decline_index',               label: 'Decline Index (0–1)',          min: 0, max: 1,    step: 0.01 },
  { key: 'consistency_score',           label: 'Consistency Score (0–1)',      min: 0, max: 1,    step: 0.01 },
]

type Result = {
  state_id: number
  state_label: string
  confidence: number
  probabilities: Record<string, number>
}

export default function PulseDemo() {
  const [form, setForm] = useState<BaseForm>(PRESETS[0].values)
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDerived, setShowDerived] = useState(false)

  const [token, setToken] = useState(
    localStorage.getItem('ff_access_token') || sessionStorage.getItem('ff_access_token') || ''
  )
  const [loginEmail, setLoginEmail] = useState('c.okafor@fluentfusion.com')
  const [loginPass, setLoginPass]   = useState('admin123')
  const [loginErr, setLoginErr]     = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  async function handleLogin() {
    setLoginLoading(true); setLoginErr('')
    try {
      const t = await adminLogin(loginEmail, loginPass)
      setToken(t)
    } catch (e: any) {
      setLoginErr(e.message)
    } finally {
      setLoginLoading(false)
    }
  }

  async function predict() {
    setLoading(true); setError(''); setResult(null)
    try {
      const payload = buildFeatures(form)
      const res = await fetch(`${API_BASE_URL}/admin/pulse/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || `HTTP ${res.status}`)
      setResult(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const state = result ? STATES[result.state_label] : null
  const derived = buildFeatures(form)

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e0e0e0', fontFamily: 'DM Sans, sans-serif', padding: '2rem' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', color: '#BFFF00', margin: 0 }}>🧠 PULSE Demo</h1>
          <p style={{ color: '#888', marginTop: 4, fontSize: 14 }}>Adjust learner features and predict their behavioural state using the trained ML model</p>
        </div>

        {/* Auth panel */}
        <div style={{ background: '#111', border: `1px solid ${token ? '#BFFF0033' : '#FF444433'}`, borderRadius: 10, padding: '0.75rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {token ? (
            <>
              <span style={{ color: '#BFFF00', fontSize: 13 }}>✅ Authenticated as Admin</span>
              <button onClick={() => setToken('')} style={{ background: 'transparent', border: '1px solid #333', color: '#666', padding: '3px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Log out</button>
            </>
          ) : (
            <>
              <span style={{ color: '#FF4444', fontSize: 13 }}>🔒 Not authenticated —</span>
              <input value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                style={{ background: '#1a1a1a', border: '1px solid #333', color: '#e0e0e0', padding: '5px 10px', borderRadius: 6, fontSize: 13, width: 210 }} />
              <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)}
                style={{ background: '#1a1a1a', border: '1px solid #333', color: '#e0e0e0', padding: '5px 10px', borderRadius: 6, fontSize: 13, width: 120 }} />
              <button onClick={handleLogin} disabled={loginLoading}
                style={{ background: '#BFFF00', color: '#000', border: 'none', borderRadius: 6, padding: '5px 14px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                {loginLoading ? '...' : 'Login'}
              </button>
              {loginErr && <span style={{ color: '#FF4444', fontSize: 12 }}>{loginErr}</span>}
            </>
          )}
        </div>

        {/* Presets */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {PRESETS.map(p => (
            <button key={p.label} onClick={() => { setForm(p.values); setResult(null) }}
              style={{ background: '#1a1a1a', border: '1px solid #333', color: '#ccc', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
              {p.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* Left: Sliders */}
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#BFFF00', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>Feature Inputs</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {FIELDS.map(f => (
                <div key={f.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <label style={{ fontSize: 12, color: '#aaa' }}>{f.label}</label>
                    <span style={{ fontSize: 12, color: '#BFFF00', fontFamily: 'JetBrains Mono, monospace' }}>{form[f.key]}</span>
                  </div>
                  <input type="range" min={f.min} max={f.max} step={f.step} value={form[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: parseFloat(e.target.value) }))}
                    style={{ width: '100%', accentColor: '#BFFF00' }} />
                </div>
              ))}
            </div>

            {/* Derived features toggle */}
            <div style={{ marginTop: '1.25rem' }}>
              <button onClick={() => setShowDerived(v => !v)}
                style={{ background: 'transparent', border: '1px solid #333', color: '#666', padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, width: '100%' }}>
                {showDerived ? '▲ Hide' : '▼ Show'} auto-computed features (sent to model)
              </button>
              {showDerived && (
                <div style={{ marginTop: 10, background: '#0d0d0d', borderRadius: 8, padding: '10px 12px', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#666', maxHeight: 200, overflowY: 'auto' }}>
                  {Object.entries(derived).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', borderBottom: '1px solid #1a1a1a' }}>
                      <span>{k}</span><span style={{ color: '#BFFF00' }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={predict} disabled={loading || !token}
              style={{ marginTop: '1.25rem', width: '100%', background: token ? '#BFFF00' : '#333', color: token ? '#000' : '#666', border: 'none', borderRadius: 8, padding: '12px', fontWeight: 700, fontSize: 15, cursor: (loading || !token) ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Predicting...' : !token ? '🔒 Login first' : '⚡ Predict PULSE State'}
            </button>

            {error && <p style={{ color: '#FF4444', marginTop: 10, fontSize: 13 }}>{error}</p>}
          </div>

          {/* Right: Result */}
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#BFFF00', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>Prediction Result</h3>

            {!result && (
              <div style={{ color: '#444', textAlign: 'center', marginTop: '5rem', fontSize: 14 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
                Set the sliders and click Predict
              </div>
            )}

            {result && state && (
              <div>
                <div style={{ textAlign: 'center', padding: '1.5rem 1rem', background: '#0d0d0d', borderRadius: 10, marginBottom: '1.5rem', border: `1px solid ${state.color}33` }}>
                  <div style={{ fontSize: 52 }}>{state.emoji}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: state.color, fontFamily: 'Syne, sans-serif', textTransform: 'capitalize', marginTop: 8 }}>
                    {result.state_label.replace('_', ' ')}
                  </div>
                  <div style={{ color: '#777', fontSize: 13, marginTop: 4 }}>{state.desc}</div>
                  <div style={{ marginTop: 10, fontSize: 13, color: '#aaa' }}>
                    Confidence: <span style={{ color: state.color, fontWeight: 700 }}>{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>

                <p style={{ fontSize: 11, color: '#555', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>All State Probabilities</p>
                {Object.entries(result.probabilities)
                  .sort(([, a], [, b]) => b - a)
                  .map(([label, prob]) => {
                    const s = STATES[label]
                    return (
                      <div key={label} style={{ marginBottom: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, fontSize: 12 }}>
                          <span style={{ color: label === result.state_label ? s.color : '#888' }}>
                            {s.emoji} {label.replace('_', ' ')}
                          </span>
                          <span style={{ color: s.color, fontFamily: 'JetBrains Mono, monospace' }}>{(prob * 100).toFixed(1)}%</span>
                        </div>
                        <div style={{ background: '#1a1a1a', borderRadius: 4, height: 6 }}>
                          <div style={{ width: `${prob * 100}%`, height: '100%', background: s.color, borderRadius: 4, transition: 'width 0.5s ease' }} />
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        </div>

        {/* State reference */}
        <div style={{ marginTop: '1.5rem', background: '#111', border: '1px solid #222', borderRadius: 12, padding: '1.25rem 1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem', color: '#BFFF00', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>PULSE State Reference</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
            {Object.entries(STATES).map(([key, s]) => (
              <div key={key} style={{ background: '#0d0d0d', borderRadius: 8, padding: '10px', border: `1px solid ${s.color}22`, textAlign: 'center' }}>
                <div style={{ fontSize: 22 }}>{s.emoji}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: s.color, marginTop: 4, textTransform: 'capitalize' }}>{key.replace('_', ' ')}</div>
                <div style={{ fontSize: 10, color: '#555', marginTop: 3 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
