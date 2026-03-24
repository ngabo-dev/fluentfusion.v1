import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import Avatar from '../../components/Avatar'
import PasswordStrength, { validatePassword } from '../../components/PasswordStrength'

export default function Settings() {
  const [profile, setProfile] = useState<any>(null)
  const [form, setForm] = useState({ name: '', bio: '' })
  const [activeSection, setActiveSection] = useState('👤 Profile')
  const [profilePw, setProfilePw] = useState('')
  const [profileMsg, setProfileMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [emailForm, setEmailForm] = useState({ new_email: '', password: '' })
  const [emailMsg, setEmailMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [pwErr, setPwErr] = useState('')
  const [pwOk, setPwOk] = useState('')

  useEffect(() => {
    api.get('/api/instructor/profile').then(r => {
      setProfile(r.data)
      setForm({ name: r.data.name, bio: r.data.bio || '' })
    })
  }, [])

  if (!profile) return <div className="loading" />

  async function saveProfile() {
    setProfileMsg(null)
    if (!profilePw) return setProfileMsg({ ok: false, text: 'Enter your password to save changes' })
    try {
      const r = await api.patch('/api/auth/profile', { current_password: profilePw, name: form.name, bio: form.bio })
      setProfile((p: any) => ({ ...p, name: r.data.name, avatar_initials: r.data.avatar_initials, bio: form.bio }))
      const stored = localStorage.getItem('ff_user')
      if (stored) {
        const u = JSON.parse(stored)
        u.name = r.data.name
        u.avatar_initials = r.data.avatar_initials
        localStorage.setItem('ff_user', JSON.stringify(u))
      }
      setProfilePw('')
      setProfileMsg({ ok: true, text: 'Profile updated!' })
    } catch (e: any) { setProfileMsg({ ok: false, text: e?.response?.data?.detail || e?.message || 'Failed' }) }
  }

  async function requestEmailChange() {
    setEmailMsg(null)
    try {
      await api.post('/api/auth/request-email-change', { current_password: emailForm.password, new_email: emailForm.new_email })
      setEmailMsg({ ok: true, text: 'Confirmation link sent to your new email. Click it to confirm.' })
      setEmailForm({ new_email: '', password: '' })
    } catch (e: any) { setEmailMsg({ ok: false, text: e?.response?.data?.detail || e?.message || 'Failed' }) }
  }

  async function changePassword() {
    setPwErr(''); setPwOk('')
    const err = validatePassword(pwForm.next)
    if (err) return setPwErr(err)
    if (pwForm.next !== pwForm.confirm) return setPwErr('Passwords do not match')
    try {
      await api.patch('/api/instructor/profile/password', { current_password: pwForm.current, new_password: pwForm.next })
      setPwOk('Password updated successfully!')
      setPwForm({ current: '', next: '', confirm: '' })
    } catch (e: any) { setPwErr(e?.response?.data?.detail || 'Failed to update password') }
  }

  const msgBox = (m: { ok: boolean; text: string }) => (
    <div style={{ background: m.ok ? 'rgba(0,255,127,0.08)' : 'rgba(255,68,68,0.08)', border: `1px solid ${m.ok ? 'rgba(0,255,127,0.25)' : 'rgba(255,68,68,0.2)'}`, borderRadius: 8, padding: '8px 12px', color: m.ok ? '#00FF7F' : '#FF4444', fontSize: 13, marginBottom: 14 }}>
      {m.ok ? '✓' : '⚠'} {m.text}
    </div>
  )

  const sections = ['👤 Profile', '📧 Email', '🔒 Security', '🔔 Notification Preferences', '💳 Payment Details', '🌐 Public Profile']

  return (
    <div className="pg">
      <div className="ph"><div><h1>Profile & Settings</h1><p>Manage your account and preferences</p></div></div>
      <div className="slay">
        <div className="snv">
          {sections.map(s => (
            <div key={s} className={`sni${activeSection === s ? ' active' : ''}`} onClick={() => setActiveSection(s)}>{s}</div>
          ))}
        </div>
        <div className="card">
          {activeSection === '👤 Profile' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, paddingBottom: 18, borderBottom: '1px solid var(--bdr)' }}>
                <Avatar initials={profile.avatar_initials || profile.name.slice(0,2).toUpperCase()} size="l" />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>{profile.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--mu)' }}>{profile.email}</div>
                </div>
              </div>
              {profileMsg && msgBox(profileMsg)}
              <div className="g2">
                <div className="fg"><label className="lbl">Full Name</label><input className="inp" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              </div>
              <div className="fg"><label className="lbl">Bio</label><textarea className="inp" rows={3} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} /></div>
              <div className="g2">
                <div className="fg"><label className="lbl">Languages Taught</label><input className="inp" placeholder="French, Spanish, English" /></div>
                <div className="fg"><label className="lbl">Expertise</label><input className="inp" placeholder="Grammar, Pronunciation, IELTS" /></div>
              </div>
              <div className="fg"><label className="lbl">LinkedIn URL</label><input className="inp" placeholder="https://linkedin.com/in/..." /></div>
              <div className="fg"><label className="lbl">Current Password <span style={{ color: 'var(--er)', fontSize: 11 }}>required to save</span></label><input className="inp" type="password" placeholder="Enter your password to confirm changes" value={profilePw} onChange={e => setProfilePw(e.target.value)} /></div>
              <button className="btn bp" onClick={saveProfile}>Save Changes</button>
            </>
          )}
          {activeSection === '📧 Email' && (
            <>
              <div style={{ fontSize: 12, color: 'var(--mu)', marginBottom: 16 }}>Current email: <b style={{ color: 'var(--fg)' }}>{profile.email}</b></div>
              {emailMsg && msgBox(emailMsg)}
              <div className="fg"><label className="lbl">New Email Address</label><input className="inp" type="email" placeholder="your@newemail.com" value={emailForm.new_email} onChange={e => setEmailForm(f => ({ ...f, new_email: e.target.value }))} /></div>
              <div className="fg"><label className="lbl">Current Password <span style={{ color: 'var(--er)', fontSize: 11 }}>required</span></label><input className="inp" type="password" placeholder="••••••••" value={emailForm.password} onChange={e => setEmailForm(f => ({ ...f, password: e.target.value }))} /></div>
              <button className="btn bp" onClick={requestEmailChange}>Send Confirmation Link</button>
              <div style={{ marginTop: 12, fontSize: 11, color: 'var(--mu)', lineHeight: 1.6 }}>A confirmation link will be sent to your new email. Your email only changes after you click it.</div>
            </>
          )}
          {activeSection === '🔒 Security' && (
            <>
              {pwErr && <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: 8, padding: '8px 12px', color: '#FF4444', fontSize: 13, marginBottom: 14 }}>⚠ {pwErr}</div>}
              {pwOk && <div style={{ background: 'rgba(0,255,127,0.08)', border: '1px solid rgba(0,255,127,0.25)', borderRadius: 8, padding: '8px 12px', color: '#00FF7F', fontSize: 13, marginBottom: 14 }}>✓ {pwOk}</div>}
              <div className="fg"><label className="lbl">Current Password</label><input className="inp" type="password" placeholder="••••••••" value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} /></div>
              <div className="fg"><label className="lbl">New Password</label><input className="inp" type="password" placeholder="Min. 8 characters" value={pwForm.next} onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))} /><PasswordStrength password={pwForm.next} /></div>
              <div className="fg"><label className="lbl">Confirm New Password</label><input className="inp" type="password" placeholder="Repeat new password" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} /></div>
              <button className="btn bp" onClick={changePassword}>Update Password</button>
            </>
          )}
          {!(['👤 Profile', '📧 Email', '🔒 Security'].includes(activeSection)) && (
            <div style={{ color: 'var(--mu)', fontSize: 12, padding: '20px 0' }}>Settings for {activeSection.replace(/^[^\s]+\s/, '')} — coming soon.</div>
          )}
        </div>
      </div>
    </div>
  )
}
