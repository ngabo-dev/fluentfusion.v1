import { useState, useEffect } from 'react';
import { gamificationApi } from '../app/api/config';
import StudentLayout from '../app/components/StudentLayout';

export default function Component31Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [myRank, setMyRank] = useState<any>(null);
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'all_time'>('weekly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      gamificationApi.getLeaderboard(period, 50),
      gamificationApi.getMyRank(period),
    ]).then(([lbRes, rankRes]) => {
      if (lbRes.status === 'fulfilled') setLeaderboard(lbRes.value.leaderboard || []);
      if (rankRes.status === 'fulfilled') setMyRank(rankRes.value);
      setLoading(false);
    });
  }, [period]);

  const currentUserId = (() => {
    try { return JSON.parse(localStorage.getItem('ff_user') || '{}').id; } catch { return null; }
  })();

  const medalColors = ['var(--color-warning)', 'var(--text-tertiary)', 'var(--color-info)'];
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <StudentLayout title="Leaderboard" subtitle="See where you rank among learners">
      {/* Period selector */}
      <div className="flex gap-2 mb-6">
        {(['weekly', 'monthly', 'all_time'] as const).map(p => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium capitalize transition-colors ${
              period === p ? 'bg-[var(--accent-primary)] text-black' : 'bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
            }`}
          >
            {p.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* My Rank Banner */}
      {myRank && (
        <div className="bg-gradient-to-r from-[rgba(var(--accent-primary-rgb),0.1)] to-[rgba(var(--accent-primary-rgb),0.04)] border border-[rgba(var(--accent-primary-rgb),0.2)] rounded-xl p-5 mb-6 flex items-center justify-between">
          <div>
            <div className="text-[var(--accent-primary)] text-[10px] uppercase tracking-widest mb-1">Your Ranking</div>
            <div className="text-white font-bold text-[18px]">
              {myRank.rank ? `#${myRank.rank}` : 'Unranked'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[var(--text-secondary)] text-[11px] mb-1">XP this period</div>
            <div className="text-[var(--accent-primary)] font-bold text-[18px]">{(myRank.xp || 0).toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px] text-[var(--text-secondary)]">Loading...</div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-[48px] mb-3">🏆</div>
          <p className="text-[var(--text-secondary)] text-[14px]">No leaderboard data yet for this period.</p>
          <p className="text-[var(--text-tertiary)] text-[12px] mt-1">Complete lessons and earn XP to appear here!</p>
        </div>
      ) : (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl overflow-hidden">
          {leaderboard.map((entry: any, idx: number) => {
            const isMe = entry.user_id === currentUserId;
            const rank = entry.rank || (idx + 1);
            const avatarBg = rank <= 3
              ? `linear-gradient(135deg, ${medalColors[rank - 1]}, ${medalColors[rank - 1]}88)`
              : 'linear-gradient(135deg, #bfff00, #8fef00)';
            return (
              <div
                key={entry.user_id}
                className={`flex items-center gap-4 p-4 border-b border-[var(--bg-tertiary)] last:border-0 transition-colors ${
                  isMe ? 'bg-[rgba(191,255,0,0.05)]' : 'hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                {/* Rank */}
                <div className="w-8 text-center">
                  {rank <= 3 ? (
                    <span className="text-[20px]">{medals[rank - 1]}</span>
                  ) : (
                    <span className="text-[var(--text-tertiary)] text-[13px] font-bold">#{rank}</span>
                  )}
                </div>

                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-black flex-shrink-0"
                  style={{ background: avatarBg }}
                >
                  {(entry.user_name || '?').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>

                {/* Name */}
                <div className="flex-1">
                  <span className={`font-medium text-[14px] ${isMe ? 'text-[var(--accent-primary)]' : 'text-white'}`}>
                    {entry.user_name || 'User'} {isMe && <span className="text-[11px] text-[var(--text-secondary)]">(you)</span>}
                  </span>
                </div>

                {/* XP */}
                <div className="text-right">
                  <span className="text-[var(--accent-primary)] font-semibold text-[14px]">{(entry.xp || 0).toLocaleString()}</span>
                  <span className="text-[var(--text-tertiary)] text-[11px] ml-1">XP</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </StudentLayout>
  );
}
