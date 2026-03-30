import React, { useState } from 'react'
import api from '../api/client'
import { Check, X } from 'lucide-react'

const STATES = [
  { value: 'thriving',    label: '🚀 Thriving',    desc: 'High engagement and strong performance' },
  { value: 'coasting',    label: '😐 Coasting',    desc: 'Moderate engagement, not fully challenged' },
  { value: 'struggling',  label: '😓 Struggling',  desc: 'Low performance, need more support' },
  { value: 'burning_out', label: '🔥 Burning Out', desc: 'Declining activity, feeling overwhelmed' },
  { value: 'disengaged',  label: '💤 Disengaged',  desc: 'Very low activity, need re-engagement' },
]

interface Props {
  currentState: string
  onClose: () => void
}

export default function PulseDisagreeModal({ currentState, onClose }: Props) {
  const [selected, setSelected] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  async function submit() {
    setSubmitting(true)
    try {
      await api.post('/api/v1/ethics/pulse-feedback', {
        current_state: currentState,
        disagreed: true,
        user_reported_state: selected || null,
        comment: comment || null,
      })
      setDone(true)
    } catch { /* non-blocking */ }
    setSubmitting(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#151515', border: '1px solid #2a2a2a', borderRadius: 16, padding: 28, width: 'min(480px, 100%)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 18 }}>Disagree with PULSE</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        {done ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: 56, height: 56, background: 'rgba(0,255,127,.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--ok)' }}>
              <Check size={24} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Thank you for your feedback</div>
            <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>
              Your feedback has been recorded and will be reviewed by your instructor. It also helps improve the PULSE model for all learners.
            </p>
            <button onClick={onClose} style={{ marginTop: 20, background: '#BFFF00', color: '#000', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, cursor: 'pointer' }}>
              Close
            </button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 20, lineHeight: 1.6 }}>
              What best describes your current learning state? Your response helps us improve PULSE and will be reviewed by your instructor.
            </p>

            <div style={{ marginBottom: 20 }}>
              {STATES.map(s => (
                <div key={s.value} onClick={() => setSelected(s.value)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 8, marginBottom: 6, cursor: 'pointer', border: `1px solid ${selected === s.value ? '#BFFF00' : '#2a2a2a'}`, background: selected === s.value ? 'rgba(191,255,0,0.05)' : 'transparent', transition: 'all .15s' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${selected === s.value ? '#BFFF00' : '#444'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {selected === s.value && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#BFFF00' }} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 6, fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '.08em' }}>
                Additional comments (optional)
              </label>
              <textarea value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Tell us more about how you're feeling about your learning..."
                style={{ width: '100%', background: '#1f1f1f', border: '1px solid #2a2a2a', borderRadius: 8, padding: 12, color: '#fff', fontSize: 13, resize: 'vertical', outline: 'none', minHeight: 80, lineHeight: 1.6 }} />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={submit} disabled={submitting}
                style={{ flex: 1, background: '#BFFF00', color: '#000', border: 'none', borderRadius: 8, padding: '11px 0', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Submitting…' : 'Submit Feedback'}
              </button>
              <button onClick={onClose}
                style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: 8, padding: '11px 16px', color: '#888', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>

            <p style={{ fontSize: 11, color: '#555', marginTop: 12, textAlign: 'center' }}>
              <a href="/pulse-disclosure" style={{ color: '#BFFF00' }}>Learn how PULSE works →</a>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
