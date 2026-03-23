import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import api from '../api/client'

const WS_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api')
  .replace(/^http/, 'ws').replace('/api', '')

interface Peer {
  user_id: number
  name: string
  initials: string
  audio: boolean
  video: boolean
  stream?: MediaStream
  pc?: RTCPeerConnection
}

interface ChatMsg {
  from: number
  name: string
  initials: string
  text: string
  ts: string
}

const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }]

export default function MeetingRoom() {
  const { roomId } = useParams<{ roomId: string }>()
  const { user } = useAuth()
  const nav = useNavigate()

  const [meeting, setMeeting] = useState<any>(null)
  const [peers, setPeers] = useState<Map<number, Peer>>(new Map())
  const [chat, setChat] = useState<ChatMsg[]>([])
  const [chatInput, setChatInput] = useState('')
  const [panel, setPanel] = useState<'chat' | 'people' | null>('chat')
  const [audioOn, setAudioOn] = useState(true)
  const [videoOn, setVideoOn] = useState(true)
  const [screenSharing, setScreenSharing] = useState(false)
  const [joined, setJoined] = useState(false)
  const [error, setError] = useState('')
  const [ending, setEnding] = useState(false)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const screenStreamRef = useRef<MediaStream | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const pcsRef = useRef<Map<number, RTCPeerConnection>>(new Map())
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Load meeting info
  useEffect(() => {
    if (!roomId) return
    api.get(`/api/meetings/${roomId}`).then(r => setMeeting(r.data)).catch(() => setError('Meeting not found or you are not invited.'))
  }, [roomId])

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chat])

  const sendWS = useCallback((data: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data))
    }
  }, [])

  const createPC = useCallback((peerId: number): RTCPeerConnection => {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS })

    pc.onicecandidate = e => {
      if (e.candidate) sendWS({ type: 'ice-candidate', target: peerId, candidate: e.candidate })
    }

    pc.ontrack = e => {
      const stream = e.streams[0]
      setPeers(prev => {
        const next = new Map(prev)
        const peer = next.get(peerId)
        if (peer) next.set(peerId, { ...peer, stream })
        return next
      })
    }

    // Add local tracks
    localStreamRef.current?.getTracks().forEach(t => pc.addTrack(t, localStreamRef.current!))
    pcsRef.current.set(peerId, pc)
    return pc
  }, [sendWS])

  const joinRoom = useCallback(async () => {
    if (!user || !roomId) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      localStreamRef.current = stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
        localVideoRef.current.muted = true
      }

      const wsUrl = `${WS_BASE}/api/meetings/ws/${roomId}/${user.id}`
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onmessage = async (e) => {
        const data = JSON.parse(e.data)

        if (data.type === 'room-info') {
          // Initiate offers to all existing peers
          for (const peerId of data.peers) {
            const pc = createPC(peerId)
            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)
            sendWS({ type: 'offer', target: peerId, sdp: offer })
          }
          setJoined(true)
        }

        else if (data.type === 'user-joined') {
          setPeers(prev => {
            const next = new Map(prev)
            if (!next.has(data.user_id)) {
              next.set(data.user_id, { user_id: data.user_id, name: data.name, initials: data.initials, audio: true, video: true })
            }
            return next
          })
        }

        else if (data.type === 'offer') {
          const pc = createPC(data.from)
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
          const answer = await pc.createAnswer()
          await pc.setLocalDescription(answer)
          sendWS({ type: 'answer', target: data.from, sdp: answer })
          setPeers(prev => {
            const next = new Map(prev)
            if (!next.has(data.from)) {
              next.set(data.from, { user_id: data.from, name: data.name || 'Peer', initials: '?', audio: true, video: true })
            }
            return next
          })
        }

        else if (data.type === 'answer') {
          const pc = pcsRef.current.get(data.from)
          if (pc) await pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
        }

        else if (data.type === 'ice-candidate') {
          const pc = pcsRef.current.get(data.from)
          if (pc && data.candidate) {
            try { await pc.addIceCandidate(new RTCIceCandidate(data.candidate)) } catch {}
          }
        }

        else if (data.type === 'chat') {
          setChat(prev => [...prev, { from: data.from, name: data.name, initials: data.initials, text: data.text, ts: data.ts }])
        }

        else if (data.type === 'media-state') {
          setPeers(prev => {
            const next = new Map(prev)
            const peer = next.get(data.from)
            if (peer) next.set(data.from, { ...peer, audio: data.audio, video: data.video })
            return next
          })
        }

        else if (data.type === 'user-left') {
          pcsRef.current.get(data.user_id)?.close()
          pcsRef.current.delete(data.user_id)
          setPeers(prev => { const next = new Map(prev); next.delete(data.user_id); return next })
        }

        else if (data.type === 'meeting-ended') {
          cleanup()
          nav(-1)
        }
      }

      ws.onerror = () => setError('Connection error. Please refresh.')
    } catch (err: any) {
      setError('Could not access camera/microphone. Please allow permissions and try again.')
    }
  }, [user, roomId, createPC, sendWS, nav])

  function cleanup() {
    localStreamRef.current?.getTracks().forEach(t => t.stop())
    screenStreamRef.current?.getTracks().forEach(t => t.stop())
    pcsRef.current.forEach(pc => pc.close())
    pcsRef.current.clear()
    wsRef.current?.close()
  }

  function toggleAudio() {
    const track = localStreamRef.current?.getAudioTracks()[0]
    if (track) {
      track.enabled = !track.enabled
      setAudioOn(track.enabled)
      sendWS({ type: 'media-state', audio: track.enabled, video: videoOn })
    }
  }

  function toggleVideo() {
    const track = localStreamRef.current?.getVideoTracks()[0]
    if (track) {
      track.enabled = !track.enabled
      setVideoOn(track.enabled)
      sendWS({ type: 'media-state', audio: audioOn, video: track.enabled })
    }
  }

  async function toggleScreenShare() {
    if (screenSharing) {
      screenStreamRef.current?.getTracks().forEach(t => t.stop())
      screenStreamRef.current = null
      // Restore camera video track in all PCs
      const camTrack = localStreamRef.current?.getVideoTracks()[0]
      if (camTrack) {
        pcsRef.current.forEach(pc => {
          const sender = pc.getSenders().find(s => s.track?.kind === 'video')
          sender?.replaceTrack(camTrack)
        })
      }
      setScreenSharing(false)
      sendWS({ type: 'screen-share', active: false })
    } else {
      try {
        const screen = await navigator.mediaDevices.getDisplayMedia({ video: true })
        screenStreamRef.current = screen
        const screenTrack = screen.getVideoTracks()[0]
        pcsRef.current.forEach(pc => {
          const sender = pc.getSenders().find(s => s.track?.kind === 'video')
          sender?.replaceTrack(screenTrack)
        })
        screenTrack.onended = () => toggleScreenShare()
        setScreenSharing(true)
        sendWS({ type: 'screen-share', active: true })
      } catch {}
    }
  }

  function sendChat(e: React.FormEvent) {
    e.preventDefault()
    if (!chatInput.trim()) return
    sendWS({ type: 'chat', text: chatInput.trim() })
    setChat(prev => [...prev, { from: user!.id, name: user!.name, initials: user!.avatar_initials || '?', text: chatInput.trim(), ts: new Date().toISOString() }])
    setChatInput('')
  }

  async function endMeeting() {
    setEnding(true)
    try {
      await api.patch(`/api/meetings/${roomId}/end`)
      sendWS({ type: 'end-meeting' })
    } catch {}
    cleanup()
    nav(-1)
  }

  function leaveMeeting() {
    cleanup()
    nav(-1)
  }

  // Lobby screen
  if (!joined) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", color: '#fff' }}>
        <div style={{ textAlign: 'center', maxWidth: 440, padding: 40 }}>
          {error ? (
            <>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
              <div style={{ color: '#FF4444', fontSize: 15, marginBottom: 24 }}>{error}</div>
              <button onClick={() => nav(-1)} style={{ padding: '12px 28px', borderRadius: 10, background: '#1f1f1f', border: '1px solid #2a2a2a', color: '#fff', cursor: 'pointer', fontSize: 14 }}>← Go Back</button>
            </>
          ) : meeting ? (
            <>
              <div style={{ width: 64, height: 64, background: 'rgba(191,255,0,0.1)', border: '1px solid rgba(191,255,0,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 20px' }}>📹</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, textTransform: 'uppercase', marginBottom: 8 }}>{meeting.title}</div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>Hosted by {meeting.host_name}</div>
              <div style={{ fontSize: 12, color: '#555', marginBottom: 32, fontFamily: "'JetBrains Mono', monospace" }}>
                {new Date(meeting.scheduled_at).toLocaleString()}
              </div>
              <div style={{ background: '#151515', border: '1px solid #2a2a2a', borderRadius: 12, padding: 16, marginBottom: 24, fontSize: 13, color: '#888' }}>
                📷 Camera and microphone will be requested when you join.
              </div>
              <button onClick={joinRoom}
                style={{ width: '100%', padding: '14px', borderRadius: 10, background: '#BFFF00', color: '#0a0a0a', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer' }}>
                Join Session →
              </button>
              <button onClick={() => nav(-1)} style={{ marginTop: 12, width: '100%', padding: '12px', borderRadius: 10, background: 'transparent', border: '1px solid #2a2a2a', color: '#888', cursor: 'pointer', fontSize: 14 }}>
                Cancel
              </button>
            </>
          ) : (
            <div style={{ color: '#888', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>Loading session...</div>
          )}
        </div>
      </div>
    )
  }

  const peerList = Array.from(peers.values())
  const totalParticipants = peerList.length + 1
  const isHost = meeting?.is_host

  // Grid layout for videos
  const gridCols = totalParticipants <= 1 ? 1 : totalParticipants <= 4 ? 2 : 3

  return (
    <div style={{ height: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column', fontFamily: "'DM Sans', sans-serif", color: '#fff', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ height: 52, background: '#111', borderBottom: '1px solid #1f1f1f', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00FF7F', boxShadow: '0 0 6px #00FF7F' }} />
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14 }}>{meeting?.title}</span>
          <span style={{ fontSize: 11, color: '#555', fontFamily: "'JetBrains Mono', monospace" }}>· {totalParticipants} participant{totalParticipants !== 1 ? 's' : ''}</span>
        </div>
        <div style={{ fontSize: 12, color: '#555', fontFamily: "'JetBrains Mono', monospace" }}>
          {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Video grid */}
        <div style={{ flex: 1, padding: 12, display: 'grid', gap: 8, overflow: 'hidden',
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gridAutoRows: `calc((100% - ${(Math.ceil(totalParticipants / gridCols) - 1) * 8}px) / ${Math.ceil(totalParticipants / gridCols)})`,
        }}>
          {/* Local video */}
          <VideoTile
            label={`${user?.name} (You)`}
            initials={user?.avatar_initials || '?'}
            videoRef={localVideoRef}
            audioOn={audioOn}
            videoOn={videoOn}
            isLocal
          />
          {/* Remote peers */}
          {peerList.map(peer => (
            <RemoteVideoTile key={peer.user_id} peer={peer} />
          ))}
        </div>

        {/* Side panel */}
        {panel && (
          <div style={{ width: 300, background: '#111', borderLeft: '1px solid #1f1f1f', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #1f1f1f' }}>
              {(['chat', 'people'] as const).map(p => (
                <button key={p} onClick={() => setPanel(p)}
                  style={{ flex: 1, padding: '12px', background: 'none', border: 'none', color: panel === p ? '#BFFF00' : '#555', fontWeight: panel === p ? 700 : 400, fontSize: 13, cursor: 'pointer', borderBottom: panel === p ? '2px solid #BFFF00' : '2px solid transparent' }}>
                  {p === 'chat' ? '💬 Chat' : '👥 People'}
                </button>
              ))}
              <button onClick={() => setPanel(null)} style={{ padding: '12px 14px', background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>

            {panel === 'chat' && (
              <>
                <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {chat.length === 0 && <div style={{ color: '#444', fontSize: 12, textAlign: 'center', marginTop: 20 }}>No messages yet</div>}
                  {chat.map((m, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#BFFF00', flexShrink: 0 }}>{m.initials}</div>
                      <div>
                        <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>{m.from === user?.id ? 'You' : m.name} · {new Date(m.ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                        <div style={{ fontSize: 13, background: m.from === user?.id ? 'rgba(191,255,0,0.08)' : '#1a1a1a', border: `1px solid ${m.from === user?.id ? 'rgba(191,255,0,0.2)' : '#222'}`, borderRadius: 8, padding: '6px 10px', wordBreak: 'break-word' }}>{m.text}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={sendChat} style={{ padding: 10, borderTop: '1px solid #1f1f1f', display: 'flex', gap: 8 }}>
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Message..."
                    style={{ flex: 1, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none' }} />
                  <button type="submit" style={{ padding: '8px 14px', background: '#BFFF00', border: 'none', borderRadius: 8, color: '#0a0a0a', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>→</button>
                </form>
              </>
            )}

            {panel === 'people' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
                <div style={{ fontSize: 11, color: '#555', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>{totalParticipants} Participants</div>
                {/* Self */}
                <PersonRow name={`${user?.name} (You)`} initials={user?.avatar_initials || '?'} audio={audioOn} video={videoOn} isHost={isHost} />
                {peerList.map(p => <PersonRow key={p.user_id} name={p.name} initials={p.initials} audio={p.audio} video={p.video} />)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls bar */}
      <div style={{ height: 72, background: '#111', borderTop: '1px solid #1f1f1f', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexShrink: 0 }}>
        <CtrlBtn icon={audioOn ? '🎙️' : '🔇'} label={audioOn ? 'Mute' : 'Unmute'} active={!audioOn} onClick={toggleAudio} />
        <CtrlBtn icon={videoOn ? '📹' : '📷'} label={videoOn ? 'Stop Video' : 'Start Video'} active={!videoOn} onClick={toggleVideo} />
        <CtrlBtn icon="🖥️" label={screenSharing ? 'Stop Share' : 'Share Screen'} active={screenSharing} onClick={toggleScreenShare} />
        <CtrlBtn icon="💬" label="Chat" active={panel === 'chat'} onClick={() => setPanel(p => p === 'chat' ? null : 'chat')} />
        <CtrlBtn icon="👥" label="People" active={panel === 'people'} onClick={() => setPanel(p => p === 'people' ? null : 'people')} />
        <div style={{ width: 1, height: 36, background: '#2a2a2a', margin: '0 4px' }} />
        {isHost ? (
          <button onClick={endMeeting} disabled={ending}
            style={{ padding: '10px 20px', borderRadius: 10, background: '#FF4444', border: 'none', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            ⏹ End for All
          </button>
        ) : (
          <button onClick={leaveMeeting}
            style={{ padding: '10px 20px', borderRadius: 10, background: '#FF4444', border: 'none', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            Leave
          </button>
        )}
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────

function VideoTile({ label, initials, videoRef, audioOn, videoOn, isLocal }: {
  label: string; initials: string; videoRef: React.RefObject<HTMLVideoElement>; audioOn: boolean; videoOn: boolean; isLocal?: boolean
}) {
  return (
    <div style={{ position: 'relative', background: '#151515', borderRadius: 12, overflow: 'hidden', border: '1px solid #2a2a2a' }}>
      <video ref={videoRef} autoPlay playsInline muted={!!isLocal}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: videoOn ? 'block' : 'none' }} />
      {!videoOn && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a1a' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#BFFF00' }}>{initials}</div>
        </div>
      )}
      <div style={{ position: 'absolute', bottom: 8, left: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ background: 'rgba(0,0,0,0.6)', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{label}</span>
        {!audioOn && <span style={{ background: 'rgba(255,68,68,0.8)', borderRadius: 6, padding: '2px 6px', fontSize: 11 }}>🔇</span>}
      </div>
    </div>
  )
}

function RemoteVideoTile({ peer }: { peer: Peer }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (videoRef.current && peer.stream) videoRef.current.srcObject = peer.stream
  }, [peer.stream])
  return (
    <div style={{ position: 'relative', background: '#151515', borderRadius: 12, overflow: 'hidden', border: '1px solid #2a2a2a' }}>
      <video ref={videoRef} autoPlay playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: peer.video ? 'block' : 'none' }} />
      {!peer.video && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a1a' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#BFFF00' }}>{peer.initials}</div>
        </div>
      )}
      <div style={{ position: 'absolute', bottom: 8, left: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ background: 'rgba(0,0,0,0.6)', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{peer.name}</span>
        {!peer.audio && <span style={{ background: 'rgba(255,68,68,0.8)', borderRadius: 6, padding: '2px 6px', fontSize: 11 }}>🔇</span>}
      </div>
    </div>
  )
}

function CtrlBtn({ icon, label, active, onClick }: { icon: string; label: string; active?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '8px 14px', borderRadius: 10, background: active ? 'rgba(255,68,68,0.15)' : '#1a1a1a', border: `1px solid ${active ? 'rgba(255,68,68,0.4)' : '#2a2a2a'}`, color: active ? '#FF4444' : '#aaa', cursor: 'pointer', minWidth: 60, transition: 'all .15s' }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
    </button>
  )
}

function PersonRow({ name, initials, audio, video, isHost }: { name: string; initials: string; audio: boolean; video: boolean; isHost?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #1a1a1a' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#BFFF00', flexShrink: 0 }}>{initials}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{name}</div>
        {isHost && <div style={{ fontSize: 10, color: '#BFFF00', fontFamily: "'JetBrains Mono', monospace" }}>HOST</div>}
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        <span style={{ fontSize: 13, opacity: audio ? 1 : 0.3 }}>🎙️</span>
        <span style={{ fontSize: 13, opacity: video ? 1 : 0.3 }}>📹</span>
      </div>
    </div>
  )
}
