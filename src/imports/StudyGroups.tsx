import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import StudentLayout from '../app/components/StudentLayout';
import { API_BASE_URL } from '../app/api/config';

interface StudyGroup {
  id: number;
  name: string;
  language: string;
  member_count: number;
  description: string;
  is_joined: boolean;
  created_by_name: string;
}

const LANGUAGES = [
  'English', 'French', 'Spanish', 'German', 'Mandarin', 'Japanese',
  'Arabic', 'Portuguese', 'Italian', 'Korean', 'Russian', 'Dutch',
];

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('ff_access_token');
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw Object.assign(new Error(err.detail || `HTTP ${res.status}`), { status: res.status });
  }
  return res.json();
}

export default function StudyGroups() {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [joiningId, setJoiningId] = useState<number | null>(null);

  // Create form state
  const [newName, setNewName] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ groups: StudyGroup[] }>('/community/groups');
      setGroups(data.groups || []);
    } catch (err: any) {
      if (err.status === 404) {
        setNotFound(true);
      } else {
        toast.error('Failed to load study groups');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleJoin = async (group: StudyGroup) => {
    setJoiningId(group.id);
    try {
      if (group.is_joined) {
        await apiFetch(`/community/groups/${group.id}/leave`, { method: 'POST' });
        setGroups(prev =>
          prev.map(g => g.id === group.id ? { ...g, is_joined: false, member_count: g.member_count - 1 } : g)
        );
        toast.success(`Left "${group.name}"`);
      } else {
        await apiFetch(`/community/groups/${group.id}/join`, { method: 'POST' });
        setGroups(prev =>
          prev.map(g => g.id === group.id ? { ...g, is_joined: true, member_count: g.member_count + 1 } : g)
        );
        toast.success(`Joined "${group.name}"`);
      }
    } catch {
      toast.error('Action failed. Please try again.');
    } finally {
      setJoiningId(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newLanguage) {
      toast.error('Name and language are required');
      return;
    }
    setCreating(true);
    try {
      await apiFetch('/community/groups', {
        method: 'POST',
        body: JSON.stringify({ name: newName.trim(), language: newLanguage, description: newDescription.trim() }),
      });
      toast.success('Study group created!');
      setShowModal(false);
      setNewName('');
      setNewLanguage('');
      setNewDescription('');
      fetchGroups();
    } catch {
      toast.error('Failed to create group');
    } finally {
      setCreating(false);
    }
  };

  const visibleGroups = activeTab === 'mine' ? groups.filter(g => g.is_joined) : groups;

  return (
    <StudentLayout title="Study Groups" subtitle="Connect with learners worldwide">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-[#111] border border-[#2a2a2a] rounded-lg p-1">
          {(['all', 'mine'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer border-none ${
                activeTab === tab
                  ? 'bg-[#bfff00] text-black'
                  : 'text-[#888] hover:text-white bg-transparent'
              }`}
            >
              {tab === 'all' ? 'All Groups' : 'My Groups'}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#bfff00] text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#d4ff33] transition-colors cursor-pointer border-none"
        >
          + Create Group
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="text-[#bfff00] text-sm">Loading groups...</div>
        </div>
      ) : notFound ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">👥</div>
          <h3 className="text-white text-xl font-bold mb-2">Study groups coming soon</h3>
          <p className="text-[#555] text-sm">Check back later to connect with fellow learners.</p>
        </div>
      ) : visibleGroups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">👥</div>
          <h3 className="text-white text-xl font-bold mb-2">
            {activeTab === 'mine' ? "You haven't joined any groups yet" : 'No groups available'}
          </h3>
          <p className="text-[#555] text-sm">
            {activeTab === 'mine' ? 'Browse All Groups and join one!' : 'Be the first to create a group!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleGroups.map(group => (
            <div
              key={group.id}
              className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-5 flex flex-col gap-3 hover:border-[#3a3a3a] transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-white font-semibold text-base leading-snug">{group.name}</h3>
                <span className="text-[#bfff00] bg-[rgba(191,255,0,0.1)] text-xs px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                  {group.language}
                </span>
              </div>

              {group.description && (
                <p className="text-[#888] text-sm leading-relaxed line-clamp-2">{group.description}</p>
              )}

              <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#1e1e1e]">
                <div className="text-[#555] text-xs flex items-center gap-1">
                  <span>👤</span>
                  <span>{group.member_count} member{group.member_count !== 1 ? 's' : ''}</span>
                </div>
                <button
                  onClick={() => handleJoin(group)}
                  disabled={joiningId === group.id}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer border-none ${
                    group.is_joined
                      ? 'bg-[#1e1e1e] text-[#888] hover:bg-[#2a2a2a] hover:text-white'
                      : 'bg-[#bfff00] text-black hover:bg-[#d4ff33]'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {joiningId === group.id ? '...' : group.is_joined ? 'Leave' : 'Join'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-lg">Create Study Group</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#555] hover:text-white bg-transparent border-none cursor-pointer text-xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label className="text-[#888] text-sm block mb-1.5">Group Name *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. French Beginners Club"
                  maxLength={80}
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#bfff00] transition-colors"
                />
              </div>

              <div>
                <label className="text-[#888] text-sm block mb-1.5">Language *</label>
                <select
                  value={newLanguage}
                  onChange={e => setNewLanguage(e.target.value)}
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#bfff00] transition-colors"
                >
                  <option value="">Select a language</option>
                  {LANGUAGES.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#888] text-sm block mb-1.5">Description</label>
                <textarea
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="What is this group about?"
                  rows={3}
                  maxLength={300}
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#bfff00] transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-[#1e1e1e] text-[#888] hover:text-white py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer border-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-[#bfff00] text-black py-2.5 rounded-lg text-sm font-semibold hover:bg-[#d4ff33] transition-colors cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? 'Creating...' : 'Create Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
