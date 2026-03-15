import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import Avatar from '../../components/Avatar'

export default function Messages() {
  const [conversations, setConversations] = useState<any[]>([])
  const [active, setActive] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  useEffect(() => {
    api.get('/api/auth/me').then(r => setCurrentUserId(r.data.id))
    api.get('/api/instructor/messages').then(r => {
      setConversations(r.data)
      if (r.data.length > 0) openConversation(r.data[0])
    })
  }, [])

  function openConversation(conv: any) {
    setActive(conv)
    api.get(`/api/instructor/messages/${conv.id}`).then(r => setMessages(r.data))
  }

  async function send() {
    if (!input.trim() || !active) return
    await api.post(`/api/instructor/messages/${active.id}`, { content: input })
    setInput('')
    api.get(`/api/instructor/messages/${active.id}`).then(r => setMessages(r.data))
  }

  return (
    <div className="pg" style={{ padding: '14px 18px' }}>
      <div className="ph" style={{ marginBottom: 14 }}><div><h1>Messages</h1></div></div>
      <div className="ml">
        <div className="mls">
          <div className="mlh">Conversations <span className="sbg" style={{ marginLeft: 5 }}>{conversations.filter(c => c.unread > 0).length}</span></div>
          <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--bdr)' }}><input className="inp" placeholder="Search..." style={{ fontSize: 11, padding: '6px 9px' }} /></div>
          {conversations.map(c => (
            <div key={c.id} className={`ci${active?.id === c.id ? ' active' : ''}`} onClick={() => openConversation(c)}>
              <Avatar initials={c.avatar_initials || c.name.slice(0,2).toUpperCase()} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="cn">{c.name} {c.unread > 0 && <span className="sbg" style={{ fontSize: 8, padding: '0 4px' }}>{c.unread}</span>}</div>
                <div className="cp">{c.last_message}</div>
              </div>
              <div style={{ fontSize: 9, color: 'var(--mu)' }}>{c.last_at ? new Date(c.last_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
            </div>
          ))}
        </div>
        <div className="ma">
          {active ? (
            <>
              <div className="mah">
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <Avatar initials={active.avatar_initials || active.name.slice(0,2).toUpperCase()} />
                  <div><div style={{ fontSize: 12, fontWeight: 600 }}>{active.name}</div></div>
                </div>
                <button className="btn bg sm">View Profile</button>
              </div>
              <div className="ca">
                {messages.map(m => (
                  <div key={m.id} className={`bub ${m.sender_id === currentUserId ? 'bus' : 'bai'}`}>{m.content}</div>
                ))}
              </div>
              <div className="mib">
                <input className="inp" placeholder="Write a message..." style={{ flex: 1 }} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
                <button className="btn bp" onClick={send}>Send ↗</button>
              </div>
            </>
          ) : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--mu)', fontSize: 12 }}>Select a conversation</div>}
        </div>
      </div>
    </div>
  )
}
