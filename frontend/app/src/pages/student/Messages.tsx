import React, { useEffect, useState, useRef } from 'react'
import api from '../../api/client'
import { useAuth } from '../../components/AuthContext'

export default function Messages() {
  const { user } = useAuth()
  const [contacts, setContacts] = useState<any[]>([])
  const [active, setActive] = useState<any>(null)
  const [msgs, setMsgs] = useState<any[]>([])
  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { api.get('/api/student/messages').then(r => { setContacts(r.data); if (r.data.length) setActive(r.data[0]) }) }, [])
  useEffect(() => {
    if (active) api.get(`/api/student/messages/${active.id}`).then(r => setMsgs(r.data))
  }, [active])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  async function send() {
    if (!text.trim() || !active) return
    await api.post(`/api/student/messages/${active.id}`, { content: text })
    setText('')
    api.get(`/api/student/messages/${active.id}`).then(r => setMsgs(r.data))
  }

  return (
    <div className="pg" style={{ paddingBottom: 0 }}>
      <div className="ph"><div><h1>Messages</h1><p>Chat with your instructors</p></div></div>
      <div className="ml">
        <div className="mls">
          <div className="mlh">Conversations</div>
          {contacts.length === 0 && <div style={{ padding: 16, color: 'var(--mu)', fontSize: 11, textAlign: 'center' }}>No conversations yet</div>}
          {contacts.map(c => (
            <div key={c.id} className={`ci${active?.id === c.id ? ' active' : ''}`} onClick={() => setActive(c)}>
              <div className="av avs">{c.avatar_initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="cn">{c.name}</div>
                  {c.unread > 0 && <span className="sbg">{c.unread}</span>}
                </div>
                <div className="cp">{c.last_message || 'No messages yet'}</div>
                <div style={{ fontSize: 9, color: 'var(--mu2)', fontFamily: 'JetBrains Mono', marginTop: 2 }}>{c.role}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="ma">
          {!active ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--mu)', fontFamily: 'JetBrains Mono', fontSize: 11 }}>Select a conversation</div>
          ) : (
            <>
              <div className="mah">
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <div className="av avm">{active.avatar_initials}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{active.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--mu)', textTransform: 'capitalize' }}>{active.role}</div>
                  </div>
                </div>
              </div>
              <div className="ca">
                {msgs.length === 0 && <div style={{ textAlign: 'center', color: 'var(--mu)', fontSize: 11, fontFamily: 'JetBrains Mono', marginTop: 20 }}>Start the conversation</div>}
                {msgs.map(m => (
                  <div key={m.id} className={`bub ${m.sender_id === user?.id ? 'bus' : 'bai'}`}>
                    {m.content}
                    <div style={{ fontSize: 9, opacity: .6, marginTop: 4, fontFamily: 'JetBrains Mono' }}>
                      {new Date(m.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="mib">
                <input className="inp" placeholder="Type a message..." value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
                <button className="btn bp sm" onClick={send}>Send</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
