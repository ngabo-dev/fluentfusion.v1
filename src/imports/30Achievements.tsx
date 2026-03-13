import { useState, useEffect } from 'react';
import { gamificationApi } from '../app/api/config';
import StudentLayout from '../app/components/StudentLayout';

export default function Component30Achievements() {
  const [data, setData] = useState<{ earned: any[]; available: any[]; earned_ids: number[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');

  useEffect(() => {
    gamificationApi.getMyAchievements()
      .then(setData)
      .catch(() => setData({ earned: [], available: [], earned_ids: [] }))
      .finally(() => setLoading(false));
  }, []);

  const rarityColor: Record<string, string> = {
    common: 'var(--text-secondary)',
    uncommon: 'var(--color-success)',
    rare: 'var(--color-info)',
    epic: 'var(--color-warning)',
    legendary: 'var(--color-warning)',
  };

  const filtered = (data?.available || []).filter(a => {
    const isEarned = (data?.earned_ids || []).includes(a.id);
    if (filter === 'earned') return isEarned;
    if (filter === 'locked') return !isEarned;
    return true;
  });

  return (
    <StudentLayout title="Achievements" subtitle="Your earned badges and milestones">
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px] text-[var(--text-secondary)]">Loading...</div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Earned', value: data?.earned_ids.length || 0, color: 'var(--accent-primary)' },
              { label: 'Available', value: data?.available.length || 0, color: 'var(--text-secondary)' },
              { label: 'Completion', value: data?.available.length ? `${Math.round(((data.earned_ids.length) / data.available.length) * 100)}%` : '0%', color: 'var(--color-success)' },
            ].map(c => (
              <div key={c.label} className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl p-5 text-center">
                <div className="text-[var(--text-secondary)] text-[10px] uppercase tracking-widest mb-2">{c.label}</div>
                <div className="text-[32px] font-bold" style={{ color: c.color }}>{c.value}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            {(['all', 'earned', 'locked'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-[13px] font-medium capitalize transition-colors ${
                  filter === f ? 'bg-[var(--accent-primary)] text-black' : 'bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Achievement Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-[48px] mb-3">🏆</div>
              <p className="text-[var(--text-secondary)] text-[14px]">
                {filter === 'earned' ? 'No achievements earned yet. Keep learning!' : 'No achievements found.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((achievement: any) => {
                const isEarned = (data?.earned_ids || []).includes(achievement.id);
                const color = rarityColor[achievement.rarity?.toLowerCase()] || 'var(--text-secondary)';
                return (
                  <div
                    key={achievement.id}
                    className={`bg-[var(--bg-secondary)] border rounded-xl p-5 transition-all ${
                      isEarned ? 'border-[var(--accent-primary-border)]' : 'border-[var(--border-default)] opacity-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-[24px] ${
                        isEarned ? 'bg-[var(--accent-primary-muted)]' : 'bg-[var(--bg-primary)]'
                      }`}>
                        {achievement.icon_name || '🏅'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold text-[13px]">{achievement.name}</span>
                          {isEarned && <span className="text-[var(--accent-primary)] text-[10px]">✓</span>}
                        </div>
                        <p className="text-[var(--text-tertiary)] text-[11px] mb-2">{achievement.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full border capitalize" style={{ color, borderColor: color }}>
                            {achievement.rarity || 'common'}
                          </span>
                          {achievement.xp_reward && (
                            <span className="text-[var(--accent-primary)] text-[10px]">+{achievement.xp_reward} XP</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </StudentLayout>
  );
}
