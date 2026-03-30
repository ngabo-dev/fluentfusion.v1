import React, { useEffect, useRef, useState } from 'react'

interface Section { id: string; title: string }

interface Props {
  title: string
  version: string
  lastUpdated: string
  badge?: string
  sections: Section[]
  children: React.ReactNode
}

export default function LegalLayout({ title, version, lastUpdated, badge, sections, children }: Props) {
  const [active, setActive] = useState(sections[0]?.id || '')
  const [mobileOpen, setMobileOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    sections.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [sections])

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1f1f1f', padding: '40px 40px 32px' }}>
        <a href="/" style={{ color: '#BFFF00', textDecoration: 'none', fontSize: 13, fontFamily: 'JetBrains Mono', letterSpacing: '.1em' }}>← FLUENTFUSION</a>
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'Syne', fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>
              {title}
            </h1>
            <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#555' }}>Version {version}</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#555' }}>Last updated: {lastUpdated}</span>
              {badge && <span style={{ background: 'rgba(191,255,0,0.1)', color: '#BFFF00', border: '1px solid rgba(191,255,0,0.2)', borderRadius: 6, padding: '2px 10px', fontSize: 11, fontFamily: 'JetBrains Mono' }}>{badge}</span>}
            </div>
          </div>
          {/* Mobile TOC toggle */}
          <button onClick={() => setMobileOpen(p => !p)}
            style={{ display: 'none', background: '#1f1f1f', border: '1px solid #2a2a2a', borderRadius: 8, padding: '8px 14px', color: '#fff', cursor: 'pointer', fontSize: 13 }}
            className="legal-toc-toggle">
            {mobileOpen ? 'Hide' : 'Contents'} ↕
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        {/* Sticky TOC */}
        <nav style={{ position: 'sticky', top: 24, height: 'fit-content', padding: '32px 0 32px 0', borderRight: '1px solid #1f1f1f' }}>
          <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#555', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 12 }}>Contents</div>
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`}
              onClick={() => setActive(s.id)}
              style={{
                display: 'block', padding: '7px 12px 7px 0', fontSize: 13, textDecoration: 'none',
                color: active === s.id ? '#BFFF00' : '#666',
                borderLeft: `2px solid ${active === s.id ? '#BFFF00' : 'transparent'}`,
                paddingLeft: 12, transition: 'all .15s', lineHeight: 1.4,
              }}>
              {s.title}
            </a>
          ))}
        </nav>

        {/* Content */}
        <div ref={contentRef} style={{ padding: '40px 0 80px 48px', maxWidth: 720 }}>
          {children}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .legal-toc-toggle { display: block !important; }
        }
        h2[id] { scroll-margin-top: 24px; }
      `}</style>
    </div>
  )
}

export function LegalSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#BFFF00', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #1f1f1f' }}>
        {title}
      </h2>
      <div style={{ fontSize: 15, lineHeight: 1.8, color: '#ccc' }}>
        {children}
      </div>
    </section>
  )
}

export function LegalTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: 20 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '10px 14px', background: '#111', color: '#BFFF00', fontFamily: 'JetBrains Mono', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', borderBottom: '1px solid #2a2a2a' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #1a1a1a' }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '10px 14px', color: '#aaa', verticalAlign: 'top' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
