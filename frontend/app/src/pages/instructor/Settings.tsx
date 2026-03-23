import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import Avatar from '../../components/Avatar'
import PasswordStrength, { validatePassword } from '../../components/PasswordStrength'

export default function Settings() {
  const [profile, setProfile] = useState<any>(null)
  const [activeSection, setActiveSection] = useState('👤 Profile')
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [pwErr, setPwErr] = useState('')
  const [pwOk, setPwOk] = useState('')
  useEffect(() => { api.get('/api/instructor/profile').then(r => setProfile(r.data)) }, [])
  if (!profile) return <div className="loading" />

  async function save() {
    await api.patch('/api/instructor/profile', { name: profile.name, bio: profile.bio })
    alert('Profile saved!')
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

  const sections = ['👤 Profile','🔒 Security','🔔 Notification Preferences','💳 Payment Details','🌐 Public Profile']

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
                  <div style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 7 }}>{profile.email}</div>
                  <button className="btn bo sm">Change Avatar</button>
                </div>
              </div>
              <div className="g2">
                <div className="fg"><label className="lbl">Full Name</label><input className="inp" value={profile.name} onChange={e => setProfile((p: any) => ({ ...p, name: e.target.value }))} /></div>
                <div className="fg"><label className="lbl">Email</label><input className="inp" value={profile.email} readOnly style={{ color: 'var(--mu)' }} /></div>
              </div>
              <div className="fg"><label className="lbl">Bio</label><textarea className="inp" rows={3} value={profile.bio || ''} onChange={e => setProfile((p: any) => ({ ...p, bio: e.target.value }))} /></div>
              <div className="g2">
                <div className="fg"><label className="lbl">Languages Taught</label><input className="inp" placeholder="French, Spanish, English" /></div>
                <div className="fg"><label className="lbl">Expertise</label><input className="inp" placeholder="Grammar, Pronunciation, IELTS" /></div>
              </div>
              <div className="fg"><label className="lbl">LinkedIn URL</label><input className="inp" placeholder="https://linkedin.com/in/..." /></div>
              <button className="btn bp" onClick={save}>Save Changes</button>
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
          {!['👤 Profile','🔒 Security'].includes(activeSection) && (
            <div style={{ color: 'var(--mu)', fontSize: 12, padding: '20px 0' }}>Settings for {activeSection.replace(/^[^\s]+\s/, '')} — coming soon.</div>
          )}
        </div>
      </div>
    </div>
  )
}
