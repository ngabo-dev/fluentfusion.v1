import React from 'react'

interface Props { pct: number }

export default function Progress({ pct }: Props) {
  return (
    <div className="mp">
      <div className="mt"><div className="mf" style={{ width: `${pct}%` }} /></div>
      <span style={{ fontSize: 10, color: 'var(--mu)' }}>{pct}%</span>
    </div>
  )
}
