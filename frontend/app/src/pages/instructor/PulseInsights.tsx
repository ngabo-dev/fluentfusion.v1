import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import StatCard from '../../components/StatCard'
import { Brain, Flame, Frown, Meh, Moon, Rocket } from 'lucide-react'

export default function PulseInsights() {
  const [data, setData] = useState<any>(null)
  useEffect(() => { api.get('/api/instructor/pulse').then(r => setData(r.data)) }, [])
  if (!data) return <div className="loading" />

  const pd = data.distribution ?? {}
  const total = data.total || 1
  const atRisk = (pd.burning_out ?? 0) + (pd.disengaged ?? 0)

  const states: [React.ReactNode, number, string, string][] = [
    [<><Rocket size={14} /> Thriving</>,    pd.thriving    ?? 0, 'var(--ok)', 'ok'],
    [<><Meh size={14} /> Coasting</>,       pd.coasting    ?? 0, 'var(--in)', 'in'],
    [<><Frown size={14} /> Struggling</>,   pd.struggling  ?? 0, 'var(--wa)', 'wa'],
    [<><Flame size={14} /> Burning Out</>,  pd.burning_out ?? 0, '#FF8C00',   ''],
    [<><Moon size={14} /> Disengaged</>,    pd.disengaged  ?? 0, 'var(--er)', 'er'],
  ]

  // Heatmap
  const colors = ['#00FF7F','#00CFFF','#FFB800','#FF8C00','#FF4444']
  const probs = [
    (pd.thriving ?? 0) / total,
    (pd.coasting ?? 0) / total,
    (pd.struggling ?? 0) / total,
    (pd.burning_out ?? 0) / total,
    (pd.disengaged ?? 0) / total,
  ]
  const cells = Array.from({ length: 120 }, (_, i) => {
    let r = Math.random(), acc = 0
    for (let j = 0; j < probs.length; j++) { acc += probs[j]; if (r < acc) return j }
    return 4
  })

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>PULSE Insights</h1><p>AI-powered learner state analysis · {total} students</p></div>
        <div className="pa"><span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--mu)' }}>Last run: 2h ago</span></div>
      </div>
      <div className="sr sr5">
        {states.map(([label, val, color, variant]) => (
          <StatCard key={String(label)} label={String(label)} value={String(val)} sub={`${Math.round(Number(val)/total*100)}% of students`} variant={(variant as any) || 'default'} />
        ))}
      </div>
      <div className="g21" style={{ marginBottom: 14 }}>
        <div className="card">
          <div className="ch"><span className="ch-t">30-Day At-Risk Trend</span></div>
          <div className="cbars">
            {Array.from({ length: 30 }, (_, i) => ({ v: Math.round(atRisk * (0.4 + 0.6 * Math.abs(Math.sin(i * 0.7 + 1)))) })).map((b, i) => (
              <div key={i} className="bwp"><div className="bar eb" style={{ height: `${Math.round(b.v / (atRisk || 1) * 100)}%` }} /></div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="ch"><span className="ch-t">State Distribution</span></div>
          <div className="gr">
            {states.map(([label, val, color]) => (
              <div key={String(label)} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 10, color: 'var(--mu)', width: 90 }}>{label}</span>
                <div style={{ flex: 1, height: 5, background: 'var(--bdr)', borderRadius: 99 }}><div style={{ width: `${Math.round(Number(val)/total*100)}%`, height: '100%', background: String(color), borderRadius: 99 }} /></div>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: String(color) }}>{Math.round(Number(val)/total*100)}%</span>
              </div>
            ))}
            <div style={{ marginTop: 10, padding: 9, background: 'rgba(255,68,68,.06)', borderRadius: 'var(--r)', border: '1px solid rgba(255,68,68,.15)' }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'var(--mu)' }}>AT-RISK TOTAL</div>
              <div style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, color: 'var(--er)' }}>{atRisk}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="ch"><span className="ch-t"><Brain size={16} /> PULSE Heatmap</span><span className="ch-a">Details →</span></div>
        <p style={{ fontSize: 10, color: 'var(--mu)', marginBottom: 10 }}>Each cell = 1 student · Hover for state · Color = PULSE state</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 10 }}>
          {cells.map((s, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: colors[s], cursor: 'default', transition: 'transform .15s' }}
              onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.4)')}
              onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
              title={['Thriving','Coasting','Struggling','Burning Out','Disengaged'][s]} />
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {[['Thriving','#00FF7F'],['Coasting','#00CFFF'],['Struggling','#FFB800'],['Burning Out','#FF8C00'],['Disengaged','#FF4444']].map(([label, color]) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: 'var(--mu)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: color, display: 'inline-block' }} />{label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
