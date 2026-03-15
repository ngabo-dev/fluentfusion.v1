import React from 'react'

interface Bar { value: number; label: string; cls?: string }
interface Props { bars: Bar[]; dual?: Bar[]; height?: number }

export default function BarChart({ bars, dual, height = 100 }: Props) {
  const max = Math.max(...bars.map(b => b.value), ...(dual?.map(b => b.value) ?? []), 1)
  return (
    <div className="cbars" style={{ height }}>
      {bars.map((b, i) => (
        <div className="bwp" key={i}>
          {dual ? (
            <div style={{ display: 'flex', gap: 1, width: '100%', alignItems: 'flex-end', height: height - 14 }}>
              <div className="bar" style={{ flex: 1, height: `${Math.round(b.value / max * 100)}%` }} title={String(b.value)} />
              <div className="bar ib" style={{ flex: 1, height: `${Math.round(dual[i].value / max * 100)}%` }} title={String(dual[i].value)} />
            </div>
          ) : (
            <div className={`bar${b.cls ? ' ' + b.cls : ''}`} style={{ height: `${Math.round(b.value / max * 100)}%` }} title={String(b.value)} />
          )}
          <div className="blbl">{b.label}</div>
        </div>
      ))}
    </div>
  )
}
