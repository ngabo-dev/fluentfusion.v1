import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface Props {
  label: string
  value: string | number
  sub?: string
  delta?: string
  deltaUp?: boolean
  icon?: React.ReactNode
  variant?: 'default' | 'ok' | 'wa' | 'er' | 'in'
}

export default function StatCard({ label, value, sub, delta, deltaUp, icon, variant = 'default' }: Props) {
  const v = variant !== 'default' ? variant : undefined
  return (
    <div className={`sc${v ? ' ' + v : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div className="sl" style={{ marginBottom: 0 }}>{label}</div>
        {icon && (
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: v === 'ok' ? 'rgba(0,255,127,.1)' : v === 'wa' ? 'rgba(255,184,0,.1)' : v === 'er' ? 'rgba(255,68,68,.1)' : v === 'in' ? 'rgba(0,207,255,.1)' : 'rgba(191,255,0,.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: v === 'ok' ? 'var(--ok)' : v === 'wa' ? 'var(--wa)' : v === 'er' ? 'var(--er)' : v === 'in' ? 'var(--in)' : 'var(--neon)',
          }}>
            {icon}
          </div>
        )}
      </div>
      <div className={`sv${v ? ' ' + v : ''}`}>{value}</div>
      {sub && <div className="ss2" style={{ marginTop: 4 }}>{sub}</div>}
      {delta && (
        <div className={`dlt ${deltaUp ? 'dup' : 'ddn'}`} style={{ marginTop: 8 }}>
          {deltaUp === true ? <TrendingUp size={11} /> : deltaUp === false ? <TrendingDown size={11} /> : <Minus size={11} />}
          {delta}
        </div>
      )}
    </div>
  )
}
