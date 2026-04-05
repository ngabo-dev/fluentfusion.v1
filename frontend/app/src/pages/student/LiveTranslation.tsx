import React, { useState, useCallback } from 'react'
import { ArrowLeftRight, Copy, Volume2, Loader2, Globe } from 'lucide-react'
import api from '../../api/client'

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'sw', name: 'Swahili', flag: '🇹🇿' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
]

const QUICK_PHRASES = [
  'Hello, how are you?',
  'Thank you very much',
  'Good morning',
  'Good evening',
  'Can you help me?',
  'How much does this cost?',
  'Where is the nearest hospital?',
  'I do not understand',
  'Please speak slowly',
  'I am lost',
  'I would like to visit Volcanoes National Park',
  'How do I get to Kigali?',
]

function LangSelect({ value, onChange, exclude }: { value: string; onChange: (v: string) => void; exclude: string }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        background: '#1a1a1a', border: '1px solid var(--bdr)', color: 'var(--fg)',
        padding: '8px 12px', borderRadius: 8, fontSize: 14, cursor: 'pointer', outline: 'none',
      }}
    >
      {LANGUAGES.filter(l => l.code !== exclude).map(l => (
        <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
      ))}
    </select>
  )
}

export default function LiveTranslation() {
  const [sourceLang, setSourceLang] = useState('en')
  const [targetLang, setTargetLang] = useState('rw')
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState<{ translated_text: string; romanization?: string | null; usage_note?: string | null } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const translate = useCallback(async (text: string, src: string, tgt: string) => {
    if (!text.trim()) { setResult(null); return }
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/api/translate', { text, source_lang: src, target_lang: tgt })
      setResult(res.data)
    } catch (e: any) {
      const msg = e.message || ''
      setError(msg.includes('429') || msg.includes('quota') ? 'Rate limit reached — please wait a moment and try again' : msg || 'Translation failed')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }, [])

  function swap() {
    const prev = sourceLang
    setSourceLang(targetLang)
    setTargetLang(prev)
    setInputText(result?.translated_text || '')
    setResult(null)
  }

  function copy() {
    if (result?.translated_text) {
      navigator.clipboard.writeText(result.translated_text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  function speak(text: string, lang: string) {
    if (!window.speechSynthesis) return
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = lang === 'rw' ? 'rw-RW' : lang
    window.speechSynthesis.speak(utt)
  }

  const srcLang = LANGUAGES.find(l => l.code === sourceLang)!
  const tgtLang = LANGUAGES.find(l => l.code === targetLang)!

  return (
    <div style={{ padding: '32px 28px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>
          Live <span style={{ color: 'var(--neon)' }}>Translation</span>
        </h1>
        <p style={{ color: 'var(--mu)', fontSize: 14, marginTop: 6 }}>
          AI-powered translation with Kinyarwanda support — bridging communication for Rwanda tourism
        </p>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {/* Language selector bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <LangSelect value={sourceLang} onChange={v => { setSourceLang(v); setResult(null) }} exclude={targetLang} />
          <button
            onClick={swap}
            title="Swap languages"
            style={{ background: 'var(--card)', border: '1px solid var(--bdr)', color: 'var(--neon)', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <ArrowLeftRight size={16} />
          </button>
          <LangSelect value={targetLang} onChange={v => { setTargetLang(v); setResult(null) }} exclude={sourceLang} />
          <button
            onClick={() => translate(inputText, sourceLang, targetLang)}
            disabled={loading || !inputText.trim()}
            style={{
              marginLeft: 'auto', background: 'var(--neon)', color: '#000', border: 'none',
              padding: '9px 22px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14,
              opacity: loading || !inputText.trim() ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            {loading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Globe size={15} />}
            Translate
          </button>
        </div>

        {/* Translation panels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {/* Source */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--bdr)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{srcLang.flag} {srcLang.name}</span>
              <button onClick={() => speak(inputText, sourceLang)} style={{ background: 'none', border: 'none', color: 'var(--mu)', cursor: 'pointer', padding: 4 }} title="Listen">
                <Volume2 size={14} />
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={e => { setInputText(e.target.value); if (!e.target.value.trim()) setResult(null) }}
              onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) translate(inputText, sourceLang, targetLang) }}
              placeholder={`Type in ${srcLang.name}… (Ctrl+Enter to translate)`}
              rows={6}
              style={{
                width: '100%', background: 'transparent', border: 'none', color: 'var(--fg)',
                padding: '14px 16px', fontSize: 16, resize: 'none', outline: 'none', boxSizing: 'border-box',
                fontFamily: 'DM Sans',
              }}
            />
            <div style={{ padding: '6px 16px', borderTop: '1px solid var(--bdr)', fontSize: 11, color: 'var(--mu)', textAlign: 'right' }}>
              {inputText.length} chars
            </div>
          </div>

          {/* Target */}
          <div style={{ background: 'var(--card)', border: `1px solid ${result ? 'rgba(191,255,0,0.2)' : 'var(--bdr)'}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--bdr)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{tgtLang.flag} {tgtLang.name}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                {result && (
                  <button onClick={() => speak(result.translated_text, targetLang)} style={{ background: 'none', border: 'none', color: 'var(--mu)', cursor: 'pointer', padding: 4 }} title="Listen">
                    <Volume2 size={14} />
                  </button>
                )}
                <button onClick={copy} style={{ background: 'none', border: 'none', color: copied ? 'var(--neon)' : 'var(--mu)', cursor: 'pointer', padding: 4 }} title="Copy">
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <div style={{ padding: '14px 16px', minHeight: 120, fontSize: 16, fontFamily: 'DM Sans', color: result ? 'var(--fg)' : 'var(--mu)' }}>
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--mu)', fontSize: 14 }}>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Translating…
                </div>
              ) : error ? (
                <span style={{ color: '#FF4444', fontSize: 14 }}>{error}</span>
              ) : result ? (
                <div>
                  <div style={{ fontWeight: 500 }}>{result.translated_text}</div>
                  {result.romanization && (
                    <div style={{ marginTop: 8, fontFamily: 'JetBrains Mono', fontSize: 13, color: 'var(--neon)', opacity: 0.8 }}>
                      /{result.romanization}/
                    </div>
                  )}
                </div>
              ) : (
                <span>Translation will appear here…</span>
              )}
            </div>
            {result?.usage_note && (
              <div style={{ padding: '10px 16px', borderTop: '1px solid var(--bdr)', background: 'rgba(191,255,0,0.04)', fontSize: 12, color: 'var(--mu)' }}>
                💡 {result.usage_note}
              </div>
            )}
          </div>
        </div>

        {/* Quick phrases */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--mu)', marginBottom: 14 }}>
            🇷🇼 Quick Phrases for Rwanda Tourism
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {QUICK_PHRASES.map(phrase => (
              <button
                key={phrase}
                onClick={() => { setInputText(phrase); translate(phrase, sourceLang, targetLang) }}
                style={{
                  background: 'rgba(191,255,0,0.06)', border: '1px solid rgba(191,255,0,0.15)',
                  color: 'var(--fg)', padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 13,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(191,255,0,0.12)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(191,255,0,0.06)')}
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
