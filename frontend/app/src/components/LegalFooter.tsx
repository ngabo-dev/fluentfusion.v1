import React from 'react'
import { useAuth } from './AuthContext'

export default function LegalFooter() {
  const { token } = useAuth()

  const links = [
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'PULSE AI Disclosure', href: '/pulse-disclosure' },
    { label: "Children's Data Policy", href: '/children' },
    ...(token ? [{ label: 'Data Rights Dashboard', href: '/dashboard/data-rights' }] : []),
  ]

  return (
    <footer style={{ borderTop: '1px solid #1f1f1f', padding: '32px 40px', background: '#0a0a0a', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', marginBottom: 16, justifyContent: 'center' }}>
          {links.map(l => (
            <a key={l.href} href={l.href}
              style={{ fontSize: 12, color: '#555', textDecoration: 'none', transition: 'color .15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#BFFF00')}
              onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
              {l.label}
            </a>
          ))}
        </div>
        <div style={{ textAlign: 'center', fontSize: 11, color: '#333', lineHeight: 1.7 }}>
          FluentFusion is governed by Rwanda Law No. 058/2021 and the EU GDPR.{' '}
          <span style={{ color: '#444' }}>REC Approval: J26BSE087.</span>
          <br />
          © 2026 FluentFusion AI · All rights reserved
        </div>
      </div>
    </footer>
  )
}
