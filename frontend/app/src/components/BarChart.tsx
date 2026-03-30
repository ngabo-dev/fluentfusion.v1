import React, { useState } from 'react'

interface Bar { value: number; label: string; cls?: string }
interface Props {
  bars: Bar[]
  dual?: Bar[]
  height?: number
  legend?: [string, string]
  unit?: string
}

const GRID_LINES = 4

export default function BarChart({ bars, dual, height = 120, legend, unit = '' }: Props) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null)
  const max = Math.max(...bars.map(b => b.value), ...(dual?.map(b => b.value) ?? []), 1)

  const niceMax = (() => {
    const magnitude = Math.pow(10, Math.floor(Math.log10(max)))
    const normalized = max / magnitude
    const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10
    return nice * magnitude
  })()

  const chartH = height
  const labelH = 18
  const yAxisW = 36

  return (
    <div style={{ position: 'relative', userSelect: 'none' }}>
      {/* Legend */}
      {legend && (
        <div style={{ display: 'flex', gap: 14, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--neon)' }} />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{legend[0]}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--in)' }} />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{legend[1]}</span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 0 }}>
        {/* Y-axis labels */}
        <div style={{ width: yAxisW, height: chartH, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: labelH, flexShrink: 0 }}>
          {Array.from({ length: GRID_LINES + 1 }).map((_, i) => {
            const val = niceMax * (1 - i / GRID_LINES)
            const display = val >= 1000 ? `${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k` : String(Math.round(val))
            return (
              <span key={i} style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'var(--mu2)', textAlign: 'right', lineHeight: 1 }}>
                {unit}{display}
              </span>
            )
          })}
        </div>

        {/* Chart area */}
        <div data-chart style={{ flex: 1, position: 'relative' }}>
          {/* Grid lines */}
          <div style={{ position: 'absolute', inset: 0, bottom: labelH, pointerEvents: 'none' }}>
            {Array.from({ length: GRID_LINES + 1 }).map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: 0, right: 0,
                top: `${(i / GRID_LINES) * 100}%`,
                height: 1,
                background: i === GRID_LINES ? 'var(--bdr2)' : 'rgba(255,255,255,.04)',
              }} />
            ))}
          </div>

          {/* Bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: chartH, paddingBottom: labelH, paddingLeft: 4, paddingRight: 4 }}>
            {bars.map((b, i) => {
              const pct = (b.value / niceMax) * 100
              const pct2 = dual ? (dual[i].value / niceMax) * 100 : 0
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: 0 }}>
                  <div style={{ width: '100%', display: 'flex', gap: dual ? 2 : 0, alignItems: 'flex-end', height: chartH - labelH }}>
                    {/* Primary bar */}
                    <div
                      style={{
                        flex: 1,
                        height: `${pct}%`,
                        minHeight: b.value > 0 ? 3 : 0,
                        background: 'linear-gradient(180deg, var(--neon) 0%, rgba(191,255,0,.4) 100%)',
                        borderRadius: '3px 3px 0 0',
                        transition: 'height .35s cubic-bezier(.4,0,.2,1)',
                        cursor: 'pointer',
                        position: 'relative',
                      }}
                      onMouseEnter={e => {
                        const r = (e.target as HTMLElement).getBoundingClientRect()
                        const parent = (e.target as HTMLElement).closest('[data-chart]')?.getBoundingClientRect()
                        setTooltip({ x: r.left - (parent?.left ?? 0) + r.width / 2, y: r.top - (parent?.top ?? 0) - 8, text: `${unit}${b.value.toLocaleString()}` })
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                    {/* Dual bar */}
                    {dual && (
                      <div
                        style={{
                          flex: 1,
                          height: `${pct2}%`,
                          minHeight: dual[i].value > 0 ? 3 : 0,
                          background: 'linear-gradient(180deg, var(--in) 0%, rgba(0,207,255,.3) 100%)',
                          borderRadius: '3px 3px 0 0',
                          transition: 'height .35s cubic-bezier(.4,0,.2,1)',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={e => {
                          const r = (e.target as HTMLElement).getBoundingClientRect()
                          const parent = (e.target as HTMLElement).closest('[data-chart]')?.getBoundingClientRect()
                          setTooltip({ x: r.left - (parent?.left ?? 0) + r.width / 2, y: r.top - (parent?.top ?? 0) - 8, text: `${unit}${dual[i].value.toLocaleString()}` })
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    )}
                  </div>
                  {/* X label */}
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'var(--mu2)', textAlign: 'center', height: labelH, lineHeight: `${labelH}px`, overflow: 'hidden' }}>
                    {b.label}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Tooltip */}
          {tooltip && (
            <div
              style={{
                position: 'absolute',
                left: tooltip.x,
                top: tooltip.y,
                transform: 'translate(-50%, -100%)',
                background: 'var(--card2)',
                border: '1px solid var(--bdr2)',
                borderRadius: 6,
                padding: '4px 9px',
                fontFamily: 'JetBrains Mono',
                fontSize: 10,
                color: 'var(--fg)',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 16px rgba(0,0,0,.4)',
                zIndex: 10,
              }}
            >
              {tooltip.text}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
