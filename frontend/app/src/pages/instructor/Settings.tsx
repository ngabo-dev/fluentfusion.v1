import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import Avatar from '../../components/Avatar'

export default function Settings() {
  const [profile, setProfile] = useState<any>(null)
  const [activeSection, setActiveSection] = useState('👤 Profile')
  useEffect(() => { api.get('/api/instructor/profile').then(r => setProfile(r.data)) }, [])
  if (!profile) return <div className="loading" />

  async function save() {
    await api.patch('/api/instructor/profile', { name: profile.name, bio: profile.bio })
    alert('Profile saved!')
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
              <div className="fg"><label className="lbl">Current Password</label><input className="inp" type="password" placeholder="••••••••" /></div>
              <div className="fg"><label className="lbl">New Password</label><input className="inp" type="password" placeholder="••••••••" /></div>
              <div className="fg"><label className="lbl">Confirm New Password</label><input className="inp" type="password" placeholder="••••••••" /></div>
              <button className="btn bp">Update Password</button>
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
