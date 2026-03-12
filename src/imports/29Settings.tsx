import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../app/api/config';
import StudentLayout from '../app/components/StudentLayout';

interface Settings {
  notif_daily_streak: boolean;
  notif_new_lesson: boolean;
  notif_live_session_reminder: boolean;
  notif_community_replies: boolean;
  notif_achievements: boolean;
  email_weekly_report: boolean;
  email_promotions: boolean;
  email_instructor_messages: boolean;
  theme: string;
}

const DEFAULT_SETTINGS: Settings = {
  notif_daily_streak: true,
  notif_new_lesson: true,
  notif_live_session_reminder: true,
  notif_community_replies: true,
  notif_achievements: true,
  email_weekly_report: true,
  email_promotions: false,
  email_instructor_messages: true,
  theme: 'dark',
};

export default function Component29Settings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('ff_access_token');
    if (!token) return;
    fetch(`${API_BASE_URL}/users/me/settings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) setSettings({ ...DEFAULT_SETTINGS, ...data });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    const token = localStorage.getItem('ff_access_token');
    try {
      await fetch(`${API_BASE_URL}/users/me/settings`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      setMessage('Settings saved!');
    } catch {
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const toggle = (key: keyof Settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-[#bfff00]' : 'bg-[#2a2a2a]'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-[#0a0a0a] transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  const sections = [
    {
      title: 'Push Notifications',
      items: [
        { key: 'notif_daily_streak' as keyof Settings, label: 'Daily streak reminders', sub: 'Get reminded to maintain your streak' },
        { key: 'notif_new_lesson' as keyof Settings, label: 'New lessons available', sub: 'When new content is added to your courses' },
        { key: 'notif_live_session_reminder' as keyof Settings, label: 'Live session reminders', sub: '15 minutes before sessions start' },
        { key: 'notif_community_replies' as keyof Settings, label: 'Community replies', sub: 'When someone replies to your posts' },
        { key: 'notif_achievements' as keyof Settings, label: 'Achievement unlocked', sub: 'Celebrate your milestones' },
      ],
    },
    {
      title: 'Email Notifications',
      items: [
        { key: 'email_weekly_report' as keyof Settings, label: 'Weekly progress report', sub: 'Summary of your weekly activity' },
        { key: 'email_promotions' as keyof Settings, label: 'Promotions and offers', sub: 'Special deals and discounts' },
        { key: 'email_instructor_messages' as keyof Settings, label: 'Instructor messages', sub: 'When instructors send you messages' },
      ],
    },
  ];

  return (
    <StudentLayout title="Settings" subtitle="Manage your preferences">
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px] text-[#888]">Loading...</div>
      ) : (
        <div className="max-w-2xl">
          {sections.map(section => (
            <div key={section.title} className="bg-[#151515] border border-[#2a2a2a] rounded-2xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-5">{section.title}</h3>
              <div className="space-y-4">
                {section.items.map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-[14px]">{item.label}</p>
                      <p className="text-[#555] text-[12px]">{item.sub}</p>
                    </div>
                    <Toggle checked={!!settings[item.key]} onChange={() => toggle(item.key)} />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={saveSettings}
            disabled={saving}
            className="w-full bg-[#bfff00] text-black py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>

          {message && (
            <p className={`mt-4 text-center text-[13px] ${message.includes('saved') ? 'text-[#bfff00]' : 'text-red-400'}`}>
              {message}
            </p>
          )}
        </div>
      )}
    </StudentLayout>
  );
}
