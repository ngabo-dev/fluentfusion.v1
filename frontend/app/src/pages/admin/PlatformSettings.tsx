import React, { useEffect, useState } from 'react'
import api from '../../api/client'

export default function PlatformSettings() {
  const [settings, setSettings] = useState<any>(null)
  const [activeSection, setActiveSection] = useState('General')
  useEffect(() => { api.get('/api/admin/settings').then(r => setSettings(r.data)) }, [])
  if (!settings) return <div className="loading" />

  async function save() {
    await api.patch('/api/admin/settings', settings)
    alert('Settings saved!')
  }

  const sections = ['⚙️ General','💰 Finance','🔒 Security','📧 Email / SMTP','🎙️ Integrations','🛠️ Maintenance']

  return (
    <div className="pg">
      <div className="ph"><div><h1>Platform Settings</h1><p>Global configuration for FluentFusion</p></div></div>
      <div className="slay">
        <div className="snv">
          {sections.map(s => (
            <div key={s} className={`sni${activeSection === s ? ' active' : ''}`} onClick={() => setActiveSection(s)}>{s}</div>
          ))}
        </div>
        <div className="card">
          <div style={{ fontFamily: 'Syne', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--bdr)' }}>
            {activeSection.replace(/^[^\s]+\s/, '')} Settings
          </div>
          {activeSection === '⚙️ General' && (
            <>
              <div className="g2">
                <div className="fg"><label className="lbl">Platform Name</label><input className="inp" value={settings.platform_name} onChange={e => setSettings((s: any) => ({ ...s, platform_name: e.target.value }))} /></div>
                <div className="fg"><label className="lbl">Platform Tagline</label><input className="inp" value={settings.tagline} onChange={e => setSettings((s: any) => ({ ...s, tagline: e.target.value }))} /></div>
              </div>
              <div className="fg"><label className="lbl">Default Language</label>
                <select className="sel" value={settings.default_language} onChange={e => setSettings((s: any) => ({ ...s, default_language: e.target.value }))}>
                  <option>English</option><option>French</option><option>Arabic</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
                {[
                  ['allow_registrations', 'Allow New Registrations', 'Users can sign up for new accounts'],
                  ['require_instructor_verification', 'Require Instructor Verification', 'New instructors must be manually approved'],
                  ['enable_pulse', 'Enable PULSE AI Engine', 'Automatically classify learner states'],
                ].map(([key, label, desc]) => (
                  <div key={String(key)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div><div style={{ fontSize: 12, fontWeight: 500 }}>{label}</div><div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 1 }}>{desc}</div></div>
                    <div className={`tgl${settings[String(key)] ? ' on' : ''}`} onClick={() => setSettings((s: any) => ({ ...s, [String(key)]: !s[String(key)] }))} />
                  </div>
                ))}
              </div>
              <button className="btn bp" onClick={save}>Save General Settings</button>
            </>
          )}
          {activeSection === '💰 Finance' && (
            <>
              <div className="fg"><label className="lbl">Platform Fee (%)</label><input className="inp" type="number" value={settings.platform_fee_pct} onChange={e => setSettings((s: any) => ({ ...s, platform_fee_pct: Number(e.target.value) }))} style={{ width: 120 }} /></div>
              <button className="btn bp" onClick={save}>Save Finance Settings</button>
            </>
          )}
          {!['⚙️ General','💰 Finance'].includes(activeSection) && (
            <div style={{ color: 'var(--mu)', fontSize: 12, padding: '20px 0' }}>Configuration for {activeSection.replace(/^[^\s]+\s/, '')} — coming soon.</div>
          )}
        </div>
      </div>
    </div>
  )
}
