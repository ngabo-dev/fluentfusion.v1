import React, { useEffect, useRef, useState } from 'react'
import { messagesApi } from '../api/client'
import { useAuth } from './AuthContext'
import { playMessageSound } from '../utils/sounds'
import { BarChart2, Check, ClipboardList, FileText, Mic, Minimize2, Paperclip, X } from 'lucide-react'

const BACKEND = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'http://localhost:8000'

type Thread = { id: number; name: string; role: string; avatar_initials: string; last_message: string; last_at: string | null; unread: number }
type Msg = { id: number; sender_id: number; content: string; created_at: string; is_read: boolean; attachment_url?: string; attachment_type?: string; attachment_name?: string }
type Contact = { id: number; name: string; role: string; avatar_initials: string }
type Course = { id: number; title: string; flag_emoji: string }
type Attachment = { url: string; type: string; name: string }

const GROUPS = [
  { label: '@all students',    role: 'student',     course_id: undefined },
  { label: '@all instructors', role: 'instructor',  course_id: undefined },
  { label: '@everyone',        role: undefined,     course_id: undefined },
]

const DOC_ICONS: Record<string, string> = {
  pdf: <FileText size={16} />, doc: <FileText size={16} />, docx: <FileText size={16} />, xls: '<BarChart2 size={16} />', xlsx: '<BarChart2 size={16} />',
  ppt: <ClipboardList size={16} />, pptx: <ClipboardList size={16} />, txt: <FileText size={16} />, csv: '<BarChart2 size={16} />', zip: '<Minimize2 size={16} />️',
}
function docIcon(name?: string) {
  const ext = (name || '').split('.').pop()?.toLowerCase() || ''
  return DOC_ICONS[ext] || <Paperclip size={16} />
}

function AttachmentBubble({ url, type, name, isMine }: { url: string; type: string; name?: string; isMine: boolean }) {
  const full = url.startsWith('http') ? url : `${BACKEND}${url}`
  if (type === 'image') return (
    <a href={full} target="_blank" rel="noreferrer">
      <img src={full} alt={name} style={{ maxWidth: 220, maxHeight: 180, borderRadius: 8, display: 'block', marginBottom: 4, cursor: 'pointer' }} />
    </a>
  )
  if (type === 'audio') return (
    <audio controls src={full} style={{ maxWidth: 220, marginBottom: 4, display: 'block', accentColor: isMine ? '#000' : 'var(--neon)' }} />
  )
  return (
    <a href={full} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 7, background: isMine ? 'rgba(0,0,0,0.15)' : 'var(--bdr)', borderRadius: 8, padding: '7px 10px', marginBottom: 4, textDecoration: 'none', color: isMine ? '#000' : 'var(--fg)', maxWidth: 220 }}>
      <span style={{ fontSize: 20 }}>{docIcon(name)}</span>
      <span style={{ fontSize: 11, fontWeight: 600, wordBreak: 'break-all' }}>{name || 'File'}</span>
    </a>
  )
}

export default function MessagesPage({ role }: { role: 'student' | 'instructor' | 'admin' }) {
  const { user } = useAuth()
  const [threads, setThreads] = useState<Thread[]>([])
  const [threadsLoading, setThreadsLoading] = useState(true)
  const [active, setActive] = useState<Thread | null>(null)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [text, setText] = useState('')
  const [attachment, setAttachment] = useState<Attachment | null>(null)
  const [uploading, setUploading] = useState(false)
  const [recording, setRecording] = useState(false)
  const [showCompose, setShowCompose] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [filterCourse, setFilterCourse] = useState<number | undefined>()
  const [selected, setSelected] = useState<number[]>([])
  const [composeText, setComposeText] = useState('')
  const [composeAttachment, setComposeAttachment] = useState<Attachment | null>(null)
  const [sending, setSending] = useState(false)

  const bottomRef   = useRef<HTMLDivElement>(null)
  const fileRef     = useRef<HTMLInputElement>(null)
  const cFileRef    = useRef<HTMLInputElement>(null)
  const activeRef   = useRef<Thread | null>(null)
  const mediaRef    = useRef<MediaRecorder | null>(null)
  const chunksRef   = useRef<Blob[]>([])
  activeRef.current = active

  const prevUnreadRef = useRef(0)

  const loadThreads = () => messagesApi.getThreads().then(data => {
    setThreadsLoading(false)
    const totalUnread = data.reduce((s: number, t: Thread) => s + (t.unread || 0), 0)
    if (prevUnreadRef.current > 0 && totalUnread > prevUnreadRef.current) playMessageSound()
    prevUnreadRef.current = totalUnread
    setThreads(data)
  }).catch(() => {})

  useEffect(() => { loadThreads() }, [])

  const prevMsgCountRef = useRef(0)

  useEffect(() => {
    if (!active) return
    prevMsgCountRef.current = 0
    messagesApi.getThread(active.id).then(data => {
      prevMsgCountRef.current = data.length
      setMsgs(data)
    }).catch(() => {})
  }, [active])

  useEffect(() => {
    const id = setInterval(() => {
      loadThreads()
      if (activeRef.current) messagesApi.getThread(activeRef.current.id).then(data => {
        if (prevMsgCountRef.current > 0 && data.length > prevMsgCountRef.current) playMessageSound()
        prevMsgCountRef.current = data.length
        setMsgs(data)
      }).catch(() => {})
    }, 3000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  useEffect(() => {
    if (!showCompose) return
    const t = setTimeout(() => {
      messagesApi.getContacts({ search: search || undefined, role: filterRole || undefined, course_id: filterCourse }).then(setContacts).catch(() => {})
    }, search ? 300 : 0)
    return () => clearTimeout(t)
  }, [showCompose, search, filterRole, filterCourse])

  useEffect(() => {
    if (showCompose && role !== 'student') messagesApi.getCoursesList().then(setCourses).catch(() => {})
  }, [showCompose])

  // ── file upload ────────────────────────────────────────────────────────────
  async function handleFile(file: File, forCompose = false) {
    setUploading(true)
    try {
      const res = await messagesApi.upload(file)
      const att = { url: res.url, type: res.attachment_type, name: res.attachment_name }
      forCompose ? setComposeAttachment(att) : setAttachment(att)
    } catch (e: any) {
      alert(e.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  // ── audio recording ────────────────────────────────────────────────────────
  async function toggleRecording() {
    if (recording) {
      mediaRef.current?.stop()
      setRecording(false)
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      chunksRef.current = []
      mr.ondataavailable = e => chunksRef.current.push(e.data)
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const file = new File([blob], `voice-${Date.now()}.webm`, { type: 'audio/webm' })
        await handleFile(file)
      }
      mr.start()
      mediaRef.current = mr
      setRecording(true)
    } catch {
      alert('Microphone access denied')
    }
  }

  // ── send reply ─────────────────────────────────────────────────────────────
  async function sendReply() {
    if ((!text.trim() && !attachment) || !active) return
    await messagesApi.send(text.trim(), [active.id], attachment ?? undefined)
    setText('')
    setAttachment(null)
    messagesApi.getThread(active.id).then(setMsgs)
    loadThreads()
  }

  // ── compose send ───────────────────────────────────────────────────────────
  async function sendCompose() {
    if ((!composeText.trim() && !composeAttachment) || selected.length === 0) return
    setSending(true)
    await messagesApi.send(composeText.trim(), selected, composeAttachment ?? undefined).catch(() => {})
    setSending(false)
    setShowCompose(false)
    setSelected([]); setComposeText(''); setComposeAttachment(null)
    setSearch(''); setFilterRole(''); setFilterCourse(undefined)
    loadThreads()
  }

  function toggleContact(id: number) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  async function selectGroup(g: typeof GROUPS[0]) {
    const list = await messagesApi.getContacts({ role: g.role, course_id: g.course_id }).catch(() => [] as Contact[])
    setSelected(list.map((c: Contact) => c.id))
  }

  const visibleGroups = role === 'admin' ? GROUPS : GROUPS.filter(g => g.role !== undefined)

  return (
    <div className="pg" style={{ paddingBottom: 0 }}>
      <div className="ph">
        <div><h1>Messages</h1><p>Direct &amp; group messaging</p></div>
        <button className="btn bp sm" onClick={() => setShowCompose(true)}>+ New Message</button>
      </div>

      <div className="ml">
        {/* ── thread list ── */}
        <div className="mls">
          <div className="mlh">
            Conversations
            {threads.filter(t => t.unread > 0).length > 0 && <span className="sbg" style={{ marginLeft: 6 }}>{threads.filter(t => t.unread > 0).length}</span>}
          </div>
          {threadsLoading && <div className="loading" />}
          {!threadsLoading && threads.length === 0 && <div style={{ padding: 16, color: 'var(--mu)', fontSize: 11, textAlign: 'center' }}>No conversations yet</div>}
          {!threadsLoading && threads.map(t => (
            <div key={t.id} className={`ci${active?.id === t.id ? ' active' : ''}`} onClick={() => setActive(t)}>
              <div className="av avs">{t.avatar_initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="cn">{t.name}</div>
                  {t.unread > 0 && <span className="sbg">{t.unread}</span>}
                </div>
                <div className="cp">{t.last_message || 'No messages yet'}</div>
                <div style={{ fontSize: 9, color: 'var(--mu)', fontFamily: 'JetBrains Mono', marginTop: 2, textTransform: 'capitalize' }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── chat area ── */}
        <div className="ma">
          {!active ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--mu)', fontFamily: 'JetBrains Mono', fontSize: 11 }}>
              Select a conversation or start a new one
            </div>
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
                {msgs.map(m => {
                  const isMine = m.sender_id === user?.id
                  return (
                    <div key={m.id} className={`bub ${isMine ? 'bus' : 'bai'}`}>
                      {m.attachment_url && m.attachment_type && (
                        <AttachmentBubble url={m.attachment_url} type={m.attachment_type} name={m.attachment_name} isMine={isMine} />
                      )}
                      {m.content && <div>{m.content}</div>}
                      <div style={{ fontSize: 9, marginTop: 4, fontFamily: 'JetBrains Mono', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 4, opacity: .7 }}>
                        {m.created_at ? new Date(m.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
                        {isMine && (
                          <span title={m.is_read ? 'Read' : 'Delivered'} style={{ color: m.is_read ? '#000' : 'rgba(0,0,0,0.4)' }}>
                            {m.is_read ? <Check size={16} /> : '<Check size={16} />'}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </div>

              {/* attachment preview strip */}
              {attachment && (
                <div style={{ padding: '6px 12px', borderTop: '1px solid var(--bdr)', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--card2)' }}>
                  {attachment.type === 'image' && <img src={`${BACKEND}${attachment.url}`} style={{ height: 40, borderRadius: 4 }} />}
                  {attachment.type === 'audio' && <span style={{ fontSize: 18 }}><Mic size={16} /></span>}
                  {attachment.type === 'document' && <span style={{ fontSize: 18 }}>{docIcon(attachment.name)}</span>}
                  <span style={{ fontSize: 11, color: 'var(--mu)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{attachment.name}</span>
                  <button className="btn bg sm" style={{ fontSize: 10 }} onClick={() => setAttachment(null)}><X size={16} /></button>
                </div>
              )}

              <div className="mib">
                {/* hidden file input */}
                <input ref={fileRef} type="file" style={{ display: 'none' }}
                  accept="image/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
                  onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />

                <button className="btn bg sm" title="Attach file" onClick={() => fileRef.current?.click()} disabled={uploading} style={{ fontSize: 16, padding: '0 10px' }}><Paperclip size={16} /></button>
                <button
                  className={`btn sm ${recording ? 'bp' : 'bg'}`}
                  title={recording ? 'Stop recording' : 'Record voice message'}
                  onClick={toggleRecording}
                  style={{ fontSize: 16, padding: '0 10px', ...(recording ? { animation: 'pulse 1s infinite' } : {}) }}
                ><Mic size={16} /></button>
                <input className="inp" placeholder={uploading ? 'Uploading…' : 'Type a message…'} value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendReply()} />
                <button className="btn bp sm" onClick={sendReply} disabled={uploading || (!text.trim() && !attachment)}>Send</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── compose modal ── */}
      {showCompose && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 12, width: 520, maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: 20, gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>New Message</div>
              <button className="btn bg sm" onClick={() => { setShowCompose(false); setSelected([]); setSearch(''); setFilterRole(''); setFilterCourse(undefined); setComposeAttachment(null) }}><X size={16} /></button>
            </div>

            {/* group shortcuts */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {visibleGroups.map(g => (
                <button key={g.label} className="btn bg sm" style={{ fontSize: 10 }} onClick={() => selectGroup(g)}>{g.label}</button>
              ))}
              {role !== 'student' && courses.map(c => (
                <button key={c.id} className="btn bg sm" style={{ fontSize: 10 }} onClick={() => { setFilterCourse(c.id); setFilterRole('student') }}>
                  {c.flag_emoji} {c.title.slice(0, 20)}
                </button>
              ))}
            </div>

            {/* filters */}
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="inp" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, fontSize: 11 }} />
              <select className="inp" value={filterRole} onChange={e => setFilterRole(e.target.value)} style={{ width: 110, fontSize: 11 }}>
                <option value="">All roles</option>
                <option value="student">Students</option>
                <option value="instructor">Instructors</option>
                {role === 'admin' && <option value="admin">Admins</option>}
              </select>
            </div>

            {/* selected chips */}
            {selected.length > 0 && (
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {selected.map(id => {
                  const c = contacts.find(x => x.id === id)
                  return c ? (
                    <span key={id} style={{ background: 'var(--neon)', color: '#000', borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 600, cursor: 'pointer' }} onClick={() => toggleContact(id)}>
                      {c.name} <X size={16} />
                    </span>
                  ) : null
                })}
                <span style={{ fontSize: 10, color: 'var(--mu)', alignSelf: 'center' }}>{selected.length} recipient{selected.length !== 1 ? 's' : ''}</span>
              </div>
            )}

            {/* contact list */}
            <div style={{ overflowY: 'auto', border: '1px solid var(--bdr)', borderRadius: 8, maxHeight: 180 }}>
              {contacts.length === 0 && <div style={{ padding: 16, color: 'var(--mu)', fontSize: 11, textAlign: 'center' }}>No contacts found</div>}
              {contacts.map(c => (
                <div key={c.id} onClick={() => toggleContact(c.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', cursor: 'pointer', background: selected.includes(c.id) ? 'rgba(191,255,0,.08)' : 'transparent', borderBottom: '1px solid var(--bdr)' }}>
                  <div className="av avs" style={{ background: selected.includes(c.id) ? 'var(--neon)' : undefined, color: selected.includes(c.id) ? '#000' : undefined }}>{c.avatar_initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--mu)', textTransform: 'capitalize' }}>{c.role}</div>
                  </div>
                  {selected.includes(c.id) && <span style={{ color: 'var(--neon)', fontSize: 14 }}><Check size={16} /></span>}
                </div>
              ))}
            </div>

            {/* compose attachment preview */}
            {composeAttachment && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--card2)', borderRadius: 8, padding: '6px 10px' }}>
                {composeAttachment.type === 'image' && <img src={`${BACKEND}${composeAttachment.url}`} style={{ height: 36, borderRadius: 4 }} />}
                {composeAttachment.type === 'audio' && <span style={{ fontSize: 18 }}><Mic size={16} /></span>}
                {composeAttachment.type === 'document' && <span style={{ fontSize: 18 }}>{docIcon(composeAttachment.name)}</span>}
                <span style={{ fontSize: 11, color: 'var(--mu)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{composeAttachment.name}</span>
                <button className="btn bg sm" style={{ fontSize: 10 }} onClick={() => setComposeAttachment(null)}><X size={16} /></button>
              </div>
            )}

            {/* message + attach row */}
            <textarea className="inp" placeholder="Write your message…" value={composeText} onChange={e => setComposeText(e.target.value)} rows={3} style={{ resize: 'none', fontSize: 12 }} />

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input ref={cFileRef} type="file" style={{ display: 'none' }}
                accept="image/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0], true)} />
              <button className="btn bg sm" title="Attach file" onClick={() => cFileRef.current?.click()} disabled={uploading} style={{ fontSize: 15 }}><Paperclip size={16} /> Attach</button>
              <button className="btn bp" style={{ flex: 1 }} onClick={sendCompose} disabled={sending || uploading || selected.length === 0 || (!composeText.trim() && !composeAttachment)}>
                {sending ? 'Sending…' : `Send to ${selected.length} recipient${selected.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
