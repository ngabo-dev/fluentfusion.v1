import React, { useEffect, useState, useRef } from 'react'
import api from '../api/client'
import { useAuth } from './AuthContext'
import { AlertCircle, AlertOctagon, CheckCircle2, Flame, Frown, Hand, Heart, PartyPopper, Plus, Smile, Star, ThumbsUp, X } from 'lucide-react'

const EMOJI_LIST = [<ThumbsUp size={16} />,'️',<Smile size={16} />,<AlertCircle size={16} />,<Frown size={16} />,<AlertOctagon size={16} />,<Flame size={16} />,<PartyPopper size={16} />,<Star size={16} />,<Hand size={16} />,'<CheckCircle2 size={16} />','<CheckCircle2 size={16} />']

interface Props {
  notifId: number
  onClose: () => void
}

export default function NotificationDetailModal({ notifId, onClose }: Props) {
  const { user } = useAuth()
  const [data, setData] = useState<any>(null)
  const [replyText, setReplyText] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [showReactors, setShowReactors] = useState<string | null>(null) // emoji key
  const [submitting, setSubmitting] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  const load = () => api.get(`/api/notifications/${notifId}`).then(r => setData(r.data)).catch(() => {})

  useEffect(() => { load() }, [notifId])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    function handleOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setShowPicker(false)
    }
    document.addEventListener('keydown', handleKey)
    document.addEventListener('mousedown', handleOutside)
    return () => { document.removeEventListener('keydown', handleKey); document.removeEventListener('mousedown', handleOutside) }
  }, [onClose])

  async function react(emoji: string) {
    await api.post(`/api/notifications/${notifId}/react`, { emoji })
    setShowPicker(false)
    load()
  }

  async function sendReply(e: React.FormEvent) {
    e.preventDefault()
    if (!replyText.trim()) return
    setSubmitting(true)
    await api.post(`/api/notifications/${notifId}/reply`, { content: replyText.trim() })
    setReplyText('')
    await load()
    setSubmitting(false)
  }

  if (!data) return (
    <div style={overlay}>
      <div style={modal}>
        <div style={{ color: 'var(--mu)', fontSize: 12, textAlign: 'center', padding: 40 }}>Loading...</div>
      </div>
    </div>
  )

  const myReaction = data.my_reaction

  return (
    <div style={overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={modal}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(191,255,0,.1)', border: '1px solid rgba(191,255,0,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--neon)', flexShrink: 0 }}>
            {data.sender_avatar_url
              ? <img src={data.sender_avatar_url} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
              : data.sender_initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--mu)', fontFamily: 'JetBrains Mono' }}>From {data.sender_name}</div>
            <div style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 800, marginTop: 2 }}>{data.title}</div>
            <div style={{ fontSize: 10, color: 'var(--mu)', fontFamily: 'JetBrains Mono', marginTop: 2 }}>
              {data.sent_at ? new Date(data.sent_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 4 }}><X size={16} /></button>
        </div>

        {/* Message body */}
        <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, padding: '14px 16px', fontSize: 13, lineHeight: 1.7, color: '#ddd', marginBottom: 20, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {data.message}
        </div>

        {/* Reactions row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {data.reactions?.map((r: any) => (
            <div key={r.emoji} style={{ position: 'relative' }}>
              <button
                onClick={() => react(r.emoji)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '4px 10px', borderRadius: 20,
                  background: r.reacted ? 'rgba(191,255,0,.15)' : 'rgba(255,255,255,.05)',
                  border: `1px solid ${r.reacted ? 'rgba(191,255,0,.4)' : '#2a2a2a'}`,
                  cursor: 'pointer', fontSize: 14,
                }}>
                <span>{r.emoji}</span>
                <span style={{ fontSize: 11, color: r.reacted ? 'var(--neon)' : '#aaa', fontWeight: r.reacted ? 700 : 400 }}>{r.count}</span>
              </button>
              {/* Hover to see who reacted */}
              <div
                onMouseEnter={() => setShowReactors(r.emoji)}
                onMouseLeave={() => setShowReactors(null)}
                style={{ position: 'absolute', inset: 0, cursor: 'pointer' }}
              />
              {showReactors === r.emoji && r.users?.length > 0 && (
                <div style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: 0, background: '#222', border: '1px solid #333', borderRadius: 8, padding: '6px 10px', fontSize: 11, color: '#ccc', whiteSpace: 'nowrap', zIndex: 10, boxShadow: '0 4px 16px rgba(0,0,0,.5)' }}>
                  {r.users.slice(0, 8).join(', ')}{r.users.length > 8 ? ` +${r.users.length - 8}` : ''}
                </div>
              )}
            </div>
          ))}

          {/* Add reaction button */}
          <div ref={pickerRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowPicker(p => !p)}
              style={{ padding: '4px 10px', borderRadius: 20, background: 'rgba(255,255,255,.05)', border: '1px solid #2a2a2a', cursor: 'pointer', fontSize: 16, color: '#888' }}>
              {myReaction ? myReaction : <Plus size={16} />}
            </button>
            {showPicker && (
              <div style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: 0, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, padding: 10, display: 'flex', flexWrap: 'wrap', gap: 6, width: 220, zIndex: 20, boxShadow: '0 8px 32px rgba(0,0,0,.6)' }}>
                {EMOJI_LIST.map(e => (
                  <button key={e} onClick={() => react(e)}
                    style={{ fontSize: 20, background: myReaction === e ? 'rgba(191,255,0,.15)' : 'none', border: myReaction === e ? '1px solid rgba(191,255,0,.3)' : '1px solid transparent', borderRadius: 8, padding: '4px 6px', cursor: 'pointer', transition: 'background .1s' }}
                    onMouseEnter={e2 => (e2.currentTarget.style.background = 'rgba(255,255,255,.08)')}
                    onMouseLeave={e2 => (e2.currentTarget.style.background = myReaction === e ? 'rgba(191,255,0,.15)' : 'none')}>
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Replies */}
        {data.allow_replies && (
          <div style={{ borderTop: '1px solid #1f1f1f', paddingTop: 16 }}>
            <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Replies ({data.replies?.length ?? 0})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14, maxHeight: 200, overflowY: 'auto' }}>
              {data.replies?.length === 0 && <div style={{ fontSize: 12, color: 'var(--mu)', textAlign: 'center', padding: '10px 0' }}>No replies yet. Be the first!</div>}
              {data.replies?.map((rep: any) => (
                <div key={rep.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--neon)', flexShrink: 0 }}>
                    {rep.user_avatar_url
                      ? <img src={rep.user_avatar_url} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                      : rep.user_initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>
                      {rep.user_id === user?.id ? 'You' : rep.user_name} · {new Date(rep.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ fontSize: 13, background: rep.user_id === user?.id ? 'rgba(191,255,0,.07)' : '#1a1a1a', border: `1px solid ${rep.user_id === user?.id ? 'rgba(191,255,0,.15)' : '#222'}`, borderRadius: 8, padding: '6px 10px', wordBreak: 'break-word' }}>
                      {rep.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={sendReply} style={{ display: 'flex', gap: 8 }}>
              <input
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                style={{ flex: 1, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none' }}
              />
              <button type="submit" disabled={submitting || !replyText.trim()}
                style={{ padding: '8px 16px', borderRadius: 8, background: '#BFFF00', border: 'none', color: '#0a0a0a', fontWeight: 700, fontSize: 13, cursor: 'pointer', opacity: replyText.trim() ? 1 : 0.4 }}>
                Send
              </button>
            </form>
          </div>
        )}

        {!data.allow_replies && (
          <div style={{ borderTop: '1px solid #1f1f1f', paddingTop: 12, fontSize: 11, color: '#444', fontFamily: 'JetBrains Mono', textAlign: 'center' }}>
            Replies are disabled for this notification
          </div>
        )}
      </div>
    </div>
  )
}

const overlay: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000, padding: 16,
}
const modal: React.CSSProperties = {
  background: '#151515', border: '1px solid #2a2a2a', borderRadius: 16,
  padding: 24, width: '100%', maxWidth: 520, maxHeight: '90vh',
  overflowY: 'auto', fontFamily: "'DM Sans', sans-serif", color: '#fff',
}
