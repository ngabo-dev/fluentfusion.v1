import React from 'react'
import { Check } from 'lucide-react'

const checks = [
  { label: '8+ characters', test: (p: string) => p.length >= 8 },
  { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'Special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

export function validatePassword(pw: string): string {
  if (pw.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Z]/.test(pw)) return 'Password must include an uppercase letter'
  if (!/[a-z]/.test(pw)) return 'Password must include a lowercase letter'
  if (!/[0-9]/.test(pw)) return 'Password must include a number'
  if (!/[^A-Za-z0-9]/.test(pw)) return 'Password must include a special character'
  return ''
}

export default function PasswordStrength({ password }: { password: string }) {
  if (!password) return null
  const passed = checks.filter(c => c.test(password)).length
  const color = passed <= 2 ? '#FF4444' : passed <= 3 ? '#FFA500' : passed === 4 ? '#BFFF00' : '#00FF7F'

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
        {checks.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < passed ? color : '#2a2a2a', transition: 'background .2s' }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
        {checks.map(c => (
          <span key={c.label} style={{ fontSize: 11, color: c.test(password) ? '#00FF7F' : '#555', display: 'flex', alignItems: 'center', gap: 4 }}>
            {c.test(password) ? <Check size={16} /> : '○'} {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}
