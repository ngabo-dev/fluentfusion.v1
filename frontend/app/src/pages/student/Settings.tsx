import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import PasswordStrength, { validatePassword } from '../../components/PasswordStrength'

const PULSE_LABELS: Record<string, string> = { thriving: '🔥 Thriving', coasting: '⚡ Coasting', struggling: '⚠️ Struggling', burning_out: '😮‍💨 Burning Out', disengaged: '💤 Disengaged' }

export default function Settings() {
  const [tab, setTab] = useState('profile')
  const [profile, setProfile] = useState<any>(null)
  const [saved, setSaved] = useState(false)
  const [notifPrefs, setNotifPrefs] = useState({ email: true, sessions: true, quizzes: true, achievements: true })
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [pwErr, setPwErr] = useState('')
  const [pwOk, setPwOk] = useState('')

  useEffect(() => { api.get('/api/student/profile').then(r => setProfile(r.data)) }, [])

  async function changePassword() {
    setPwErr(''); setPwOk('')
    const err = validatePassword(pwForm.next)
    if (err) return setPwErr(err)
    if (pwForm.next !== pwForm.confirm) return setPwErr('Passwords do not match')
    try {
      await api.patch('/api/student/profile/password', { current_password: pwForm.current, new_password: pwForm.next })
      setPwOk('Password updated successfully!')
      setPwForm({ current: '', next: '', confirm: '' })
    } catch (e: any) { setPwErr(e?.response?.data?.detail || 'Failed to update password') }
  }

  async function saveProfile() {
    await api.patch('/api/student/profile', { name: profile.name, bio: profile.bio })
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  if (!profile) return <div className="loading" />

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Settings</h1><p>Manage your account and preferences</p></div>
      </div>
      <div className="slay">
        <div className="snv">
          {[['profile', '👤 Profile'], ['notifications', '🔔 Notifications'], ['security', '🔒 Security'], ['pulse', '🧠 PULSE']].map(([k, label]) => (
            <div key={k} className={`sni${tab === k ? ' active' : ''}`} onClick={() => setTab(k)}>{label}</div>
          ))}
        </div>

        <div>
          {tab === 'profile' && (
            <div className="card">
              <div className="ch"><span className="ch-t">Profile</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: '16px', background: 'var(--card2)', borderRadius: 'var(--r)', border: '1px solid var(--bdr)' }}>
                <div className="av avl">{profile.avatar_initials}</div>
                <div>
                  <div style={{ fontFamily: 'Syne', fontSize: 18, fontWeight: 800 }}>{profile.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 6 }}>{profile.email}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--neon)', background: 'var(--ndim)', padding: '2px 8px', borderRadius: 4 }}>⚡ {profile.xp} XP</span>
                    <span className={`pulse-badge pulse-${profile.pulse_state}`}>{PULSE_LABELS[profile.pulse_state]}</span>
                  </div>
                </div>
              </div>
              <div className="fg"><label className="lbl">Full Name</label><input className="inp" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} /></div>
              <div className="fg"><label className="lbl">Email</label><input className="inp" value={profile.email} disabled style={{ opacity: .5 }} /></div>
              <div className="fg"><label className="lbl">Bio</label><textarea className="inp" rows={3} style={{ resize: 'vertical' }} value={profile.bio ?? ''} onChange={e => setProfile({ ...profile, bio: e.target.value })} placeholder="Tell us about yourself..." /></div>
              <div className="fg">
                <label className="lbl">Member Since</label>
                <div style={{ fontSize: 12, color: 'var(--mu)', padding: '9px 0' }}>{new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
              <button className="btn bp" onClick={saveProfile}>{saved ? '✓ Saved!' : 'Save Changes'}</button>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="card">
              <div className="ch"><span className="ch-t">Notification Preferences</span></div>
              {[
                ['email', '📧 Email Notifications', 'Receive updates via email'],
                ['sessions', '🎙️ Live Session Reminders', 'Get notified before sessions start'],
                ['quizzes', '📝 Quiz Reminders', 'Reminders for upcoming quizzes'],
                ['achievements', '🏆 Achievement Alerts', 'Celebrate your milestones'],
              ].map(([key, label, desc]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 11, color: 'var(--mu)' }}>{desc}</div>
                  </div>
                  <div className={`tgl${notifPrefs[key as keyof typeof notifPrefs] ? ' on' : ''}`} onClick={() => setNotifPrefs(p => ({ ...p, [key]: !p[key as keyof typeof notifPrefs] }))} />
                </div>
              ))}
            </div>
          )}

          {tab === 'security' && (
            <div className="card">
              <div className="ch"><span className="ch-t">Security</span></div>
              {pwErr && <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: 8, padding: '8px 12px', color: '#FF4444', fontSize: 13, marginBottom: 14 }}>⚠ {pwErr}</div>}
              {pwOk && <div style={{ background: 'rgba(0,255,127,0.08)', border: '1px solid rgba(0,255,127,0.25)', borderRadius: 8, padding: '8px 12px', color: '#00FF7F', fontSize: 13, marginBottom: 14 }}>✓ {pwOk}</div>}
              <div className="fg"><label className="lbl">Current Password</label><input className="inp" type="password" placeholder="••••••••" value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} /></div>
              <div className="fg"><label className="lbl">New Password</label><input className="inp" type="password" placeholder="Min. 8 characters" value={pwForm.next} onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))} /><PasswordStrength password={pwForm.next} /></div>
              <div className="fg"><label className="lbl">Confirm New Password</label><input className="inp" type="password" placeholder="Repeat new password" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} /></div>
              <button className="btn bp" onClick={changePassword}>Update Password</button>
              <div style={{ marginTop: 24, padding: '16px', background: 'rgba(255,68,68,.04)', border: '1px solid rgba(255,68,68,.15)', borderRadius: 'var(--r)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--er)', marginBottom: 6 }}>Danger Zone</div>
                <div style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 12 }}>Permanently delete your account and all learning data.</div>
                <button className="btn bd sm">Delete Account</button>
              </div>
            </div>
          )}

          {tab === 'pulse' && (
            <div className="card">
              <div className="ch"><span className="ch-t">PULSE Insights</span></div>
              <div style={{ padding: '20px', background: 'var(--card2)', borderRadius: 'var(--r)', border: '1px solid var(--bdr)', marginBottom: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🧠</div>
                <div style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 800, marginBottom: 6 }}>Your Learning State</div>
                <span className={`pulse-badge pulse-${profile.pulse_state}`} style={{ fontSize: 13, padding: '6px 16px' }}>{PULSE_LABELS[profile.pulse_state]}</span>
                <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 12, lineHeight: 1.6 }}>
                  PULSE tracks your engagement, completion rates, and activity patterns to give you personalized insights.
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[['⚡ XP Points', `${profile.xp} XP`, 'var(--neon)'], ['📚 Courses', 'Active learner', 'var(--in)'], ['🔥 Streak', '7 days', 'var(--wa)'], ['🏆 Rank', 'Top 20%', 'var(--ok)']].map(([label, val, color]) => (
                  <div key={label} style={{ padding: '14px', background: 'var(--card2)', borderRadius: 'var(--r)', border: '1px solid var(--bdr)', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Syne', fontSize: 18, fontWeight: 800, color, marginBottom: 4 }}>{val}</div>
                    <div style={{ fontSize: 10, color: 'var(--mu)' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
