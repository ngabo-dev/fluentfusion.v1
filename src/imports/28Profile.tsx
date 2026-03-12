import { useState, useEffect } from 'react';
import { usersApi } from '../app/api/config';
import StudentLayout from '../app/components/StudentLayout';

export default function Component28Profile() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ full_name: '', bio: '', location: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    usersApi.getProfile()
      .then(data => {
        setUser(data);
        setForm({ full_name: data.full_name || '', bio: data.bio || '', location: data.location || '' });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await usersApi.updateProfile(form);
      setUser(updated);
      // Update localStorage
      const stored = localStorage.getItem('ff_user');
      if (stored) {
        const u = JSON.parse(stored);
        localStorage.setItem('ff_user', JSON.stringify({ ...u, ...form }));
      }
      setMessage('Profile updated successfully!');
      setEditing(false);
    } catch {
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  return (
    <StudentLayout title="Profile" subtitle="Manage your public profile">
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px] text-[#888]">Loading...</div>
      ) : (
        <div className="max-w-2xl">
          {/* Avatar + Name */}
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-2xl p-8 mb-6 flex items-center gap-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-[28px] font-bold text-black flex-shrink-0 bg-gradient-to-br from-[#bfff00] to-[#8fef00]"
            >
              {initials}
            </div>
            <div>
              <h2 className="text-white font-bold text-[20px]">{user?.full_name}</h2>
              <p className="text-[#888] text-[13px] mt-1">{user?.email}</p>
              <span className={`inline-block mt-2 text-[11px] px-3 py-1 rounded-full capitalize font-medium ${
                user?.role === 'instructor' ? 'bg-[rgba(0,207,255,0.1)] text-[#00cfff]' : 'bg-[rgba(191,255,0,0.1)] text-[#bfff00]'
              }`}>
                {user?.role}
              </span>
            </div>
          </div>

          {/* Profile Form */}
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-2xl p-6 mb-4">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold">Profile Information</h3>
              <button
                type="button"
                onClick={() => setEditing(!editing)}
                className="text-[#bfff00] text-[13px] hover:underline"
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#888] text-[11px] uppercase tracking-widest mb-2">Full Name</label>
                {editing ? (
                  <input
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-[14px] focus:outline-none focus:border-[#bfff00]"
                    placeholder="Your full name"
                    value={form.full_name}
                    onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                  />
                ) : (
                  <p className="text-white text-[14px] py-3">{user?.full_name || '—'}</p>
                )}
              </div>

              <div>
                <label className="block text-[#888] text-[11px] uppercase tracking-widest mb-2">Email</label>
                <p className="text-[#555] text-[14px] py-3">{user?.email}</p>
              </div>

              <div>
                <label className="block text-[#888] text-[11px] uppercase tracking-widest mb-2">Location</label>
                {editing ? (
                  <input
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-[14px] focus:outline-none focus:border-[#bfff00]"
                    placeholder="City, Country"
                    value={form.location}
                    onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  />
                ) : (
                  <p className="text-white text-[14px] py-3">{user?.location || '—'}</p>
                )}
              </div>

              <div>
                <label className="block text-[#888] text-[11px] uppercase tracking-widest mb-2">Bio</label>
                {editing ? (
                  <textarea
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-[14px] focus:outline-none focus:border-[#bfff00] resize-none"
                    rows={3}
                    placeholder="Tell us about yourself..."
                    value={form.bio}
                    onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                  />
                ) : (
                  <p className="text-white text-[14px] py-3">{user?.bio || '—'}</p>
                )}
              </div>

              {editing && (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-[#bfff00] text-black py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>

            {message && (
              <p className={`mt-4 text-[13px] ${message.includes('success') ? 'text-[#bfff00]' : 'text-red-400'}`}>
                {message}
              </p>
            )}
          </div>

          {/* Account Info */}
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Account</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-[#1a1a1a]">
                <span className="text-[#888] text-[13px]">Email verified</span>
                <span className={`text-[12px] ${user?.is_email_verified ? 'text-[#00ff7f]' : 'text-red-400'}`}>
                  {user?.is_email_verified ? '✓ Verified' : '✗ Not verified'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#1a1a1a]">
                <span className="text-[#888] text-[13px]">Member since</span>
                <span className="text-white text-[13px]">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('en', { month: 'long', year: 'numeric' }) : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[#888] text-[13px]">Account status</span>
                <span className="text-[#00ff7f] text-[12px]">Active</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
