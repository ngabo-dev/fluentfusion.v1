import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, Heart, MessageSquare } from 'lucide-react'

const posts = [
  { id: 1, flag: '🇷🇼', lang: 'Kinyarwanda', user: 'Amara K.', initials: 'AK', time: '2h ago', body: 'Just completed my 30-day streak in Kinyarwanda! The tonal patterns finally clicked for me. Anyone else find the verb conjugation system fascinating?', likes: 42, comments: 8, tag: 'MILESTONE' },
  { id: 2, flag: '🇫🇷', lang: 'French', user: 'Pierre D.', initials: 'PD', time: '4h ago', body: 'Tip for French learners: stop translating in your head. Start thinking directly in French, even if it\'s just simple sentences. It changed everything for me after 3 months.', likes: 87, comments: 23, tag: 'TIP' },
  { id: 3, flag: '🇯🇵', lang: 'Japanese', user: 'Yuki T.', initials: 'YT', time: '6h ago', body: 'Looking for a language exchange partner! I\'m a native Japanese speaker learning English. Happy to help with Japanese in return. DM me!', likes: 31, comments: 15, tag: 'EXCHANGE' },
  { id: 4, flag: '🇪🇸', lang: 'Spanish', user: 'Carlos M.', initials: 'CM', time: '1d ago', body: 'The live session with Instructor Ana was incredible. Her explanation of the subjunctive mood finally made it click after months of confusion. Highly recommend her classes!', likes: 64, comments: 11, tag: 'REVIEW' },
]

const langs = ['All', '🇷🇼 Kinyarwanda', '🇬🇧 English', '🇫🇷 French', '🇪🇸 Spanish', '🇩🇪 German', '🇯🇵 Japanese']

const tagColors: Record<string, { bg: string; color: string }> = {
  MILESTONE: { bg: 'rgba(191,255,0,0.10)', color: '#BFFF00' },
  TIP: { bg: 'rgba(0,207,255,0.10)', color: '#00CFFF' },
  EXCHANGE: { bg: 'rgba(255,184,0,0.10)', color: '#FFB800' },
  REVIEW: { bg: 'rgba(0,255,127,0.10)', color: '#00FF7F' },
}

export default function Community() {
  const nav = useNavigate()
  const [activeLang, setActiveLang] = useState('All')
  const [liked, setLiked] = useState<Set<number>>(new Set())

  const filtered = activeLang === 'All' ? posts : posts.filter(p => activeLang.includes(p.lang))

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'DM Sans', sans-serif" }}>

      {/* NAV */}
      <nav style={{ height: 66, background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid #2a2a2a', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', position: 'sticky', top: 0, zIndex: 100 }}>
        <a onClick={() => nav('/')} style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none', cursor: 'pointer' }}>
          <div style={{ width: 38, height: 38, background: '#BFFF00', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}><Brain size={16} /></div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#fff' }}>
            FLUENT<span style={{ color: '#BFFF00' }}>FUSION</span>
          </div>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {[['Features', '/features'], ['Pricing', '/pricing'], ['Community', '/community']].map(([l, href]) => (
            <a key={String(l)} onClick={() => nav(String(href))} style={{ fontSize: 14, color: String(href) === '/community' ? '#BFFF00' : '#888', textDecoration: 'none', cursor: 'pointer' }}>{String(l)}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => nav('/login')} style={{ padding: '11px 24px', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', background: 'transparent', color: '#888' }}>Login</button>
          <button onClick={() => nav('/signup')} style={{ padding: '11px 24px', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', background: '#BFFF00', color: '#0a0a0a' }}>Get Started</button>
        </div>
      </nav>

      <main style={{ padding: '64px 40px', maxWidth: 900, margin: '0 auto' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(191,255,0,0.10)', border: '1px solid rgba(191,255,0,0.2)', borderRadius: 99, padding: '4px 14px', marginBottom: 20 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#BFFF00', letterSpacing: '0.2em', textTransform: 'uppercase' }}>2M+ Learners</span>
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 16 }}>
            LEARN WITH THE <span style={{ color: '#BFFF00', textShadow: '0 0 12px rgba(191,255,0,0.55)' }}>WORLD</span>
          </div>
          <p style={{ fontSize: 17, color: '#888', maxWidth: 520, margin: '0 auto 32px' }}>
            Connect with millions of learners. Share tips, find exchange partners, and celebrate milestones together.
          </p>
          <button onClick={() => nav('/signup')} style={{ padding: '13px 36px', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, cursor: 'pointer', border: 'none', background: '#BFFF00', color: '#0a0a0a', boxShadow: '0 0 12px rgba(191,255,0,0.25)' }}>
            Join the Community →
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 0, border: '1px solid #2a2a2a', borderRadius: 14, overflow: 'hidden', marginBottom: 40 }}>
          {[['2M+', 'Active Members'], ['40+', 'Languages'], ['50K+', 'Posts Daily'], ['98%', 'Positive Vibes']].map(([val, label], i) => (
            <div key={String(label)} style={{ flex: 1, textAlign: 'center', padding: '20px 16px', borderRight: i < 3 ? '1px solid #2a2a2a' : 'none', background: '#0f0f0f' }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: '#BFFF00', textShadow: '0 0 12px rgba(191,255,0,0.4)' }}>{String(val)}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{String(label)}</div>
            </div>
          ))}
        </div>

        {/* Language filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {langs.map(l => (
            <div key={l} onClick={() => setActiveLang(l)}
              style={{ padding: '6px 16px', borderRadius: 99, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: `1px solid ${activeLang === l ? '#BFFF00' : '#2a2a2a'}`, background: activeLang === l ? 'rgba(191,255,0,0.10)' : '#151515', color: activeLang === l ? '#BFFF00' : '#888', transition: 'all .15s' }}>
              {l}
            </div>
          ))}
        </div>

        {/* Posts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(post => {
            const tc = tagColors[post.tag] || { bg: 'rgba(255,255,255,0.06)', color: '#888' }
            const isLiked = liked.has(post.id)
            return (
              <div key={post.id} style={{ background: '#151515', border: '1px solid #2a2a2a', borderRadius: 14, padding: 24, transition: 'border-color .2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(191,255,0,0.2)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a2a')}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #BFFF00, #8FEF00)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13, color: '#000' }}>{post.initials}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{post.user}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>{post.flag} {post.lang} · {post.time}</div>
                    </div>
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 99, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', background: tc.bg, color: tc.color }}>
                    {post.tag}
                  </div>
                </div>
                <p style={{ fontSize: 14, color: '#ccc', lineHeight: 1.65, marginBottom: 16 }}>{post.body}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <button onClick={() => setLiked(prev => { const s = new Set(prev); s.has(post.id) ? s.delete(post.id) : s.add(post.id); return s; })}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: isLiked ? '#BFFF00' : '#888', transition: 'color .15s' }}>
                    {isLiked ? <Heart size={16} /> : <Heart size={16} />} {post.likes + (isLiked ? 1 : 0)}
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#888' }}>
                    <MessageSquare size={16} /> {post.comments}
                  </button>
                  <button onClick={() => nav('/signup')} style={{ marginLeft: 'auto', background: 'none', border: '1px solid #2a2a2a', borderRadius: 6, padding: '4px 12px', fontSize: 12, color: '#888', cursor: 'pointer' }}>
                    Reply
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Join CTA */}
        <div style={{ textAlign: 'center', marginTop: 48, padding: '40px', background: '#0f0f0f', border: '1px solid #2a2a2a', borderRadius: 20 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, textTransform: 'uppercase', marginBottom: 10 }}>
            Join the <span style={{ color: '#BFFF00' }}>Conversation</span>
          </div>
          <p style={{ color: '#888', fontSize: 15, marginBottom: 24 }}>Sign up free to post, reply, and connect with learners worldwide.</p>
          <button onClick={() => nav('/signup')} style={{ padding: '13px 40px', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, cursor: 'pointer', border: 'none', background: '#BFFF00', color: '#0a0a0a' }}>
            Create Free Account →
          </button>
        </div>
      </main>
    </div>
  )
}
