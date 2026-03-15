import React from 'react'

interface Props {
  label: string
  value: string | number
  sub?: string
  delta?: string
  deltaUp?: boolean
  variant?: 'default' | 'ok' | 'wa' | 'er' | 'in'
}

export default function StatCard({ label, value, sub, delta, deltaUp, variant = 'default' }: Props) {
  return (
    <div className={`sc${variant !== 'default' ? ' ' + variant : ''}`}>
      <div className="sl">{label}</div>
      <div className={`sv${variant !== 'default' ? ' ' + variant : ''}`}>{value}</div>
      {sub && <div className="ss2">{sub}</div>}
      {delta && <div className={`dlt ${deltaUp ? 'dup' : 'ddn'}`}>{delta}</div>}
    </div>
  )
}
