import { useState, useEffect } from 'react';
import { gamificationApi, usersApi } from '../app/api/config';
import StudentLayout from '../app/components/StudentLayout';

export default function Component33StreakTracker() {
  const [streak, setStreak] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.allSettled([
      gamificationApi.getStreak(),
      usersApi.getDashboardStats(),
    ]).then(([streakRes, statsRes]) => {
      if (streakRes.status === 'fulfilled') setStreak(streakRes.value);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value);
      setLoading(false);
    });
  }, []);

  const recordToday = async () => {
    setRecording(true);
    try {
      const res = await gamificationApi.recordActivity();
      setMessage(res.message);
      setStreak((prev: any) => prev ? { ...prev, current_streak: res.current_streak, longest_streak: res.longest_streak } : prev);
    } catch {
      setMessage('Activity already recorded today');
    } finally {
      setRecording(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Build a 7-day visual grid based on current streak
  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return {
      label: d.toLocaleDateString('en', { weekday: 'short' }),
      active: streak ? i >= 7 - (streak.current_streak || 0) : false,
    };
  });

  return (
    <StudentLayout title="Streak Tracker" subtitle="Build your daily learning habit">
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px] text-[#888]">Loading...</div>
      ) : (
        <>
          {/* Main streak display */}
          <div className="bg-gradient-to-r from-[rgba(255,107,53,0.15)] to-[rgba(255,107,53,0.05)] border border-[rgba(255,107,53,0.3)] rounded-2xl p-8 mb-8 text-center">
            <div className="text-[72px] mb-2">🔥</div>
            <div className="text-[64px] font-bold text-[#ff6b35] mb-2">{streak?.current_streak || 0}</div>
            <div className="text-white text-[18px] font-semibold mb-1">Day Streak</div>
            <div className="text-[#888] text-[13px]">
              {streak?.current_streak ? `Keep it up! You're on a roll.` : `Start your streak by learning today!`}
            </div>
            <button
              type="button"
              onClick={recordToday}
              disabled={recording}
              className="mt-6 bg-[#ff6b35] text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {recording ? 'Recording...' : '✓ Mark Today as Active'}
            </button>
            {message && <p className="mt-3 text-[#bfff00] text-[13px]">{message}</p>}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Current Streak', value: `${streak?.current_streak || 0} 🔥`, color: '#ff6b35' },
              { label: 'Longest Streak', value: `${streak?.longest_streak || 0} days`, color: '#bfff00' },
              { label: 'Total Active Days', value: streak?.total_active_days || 0, color: '#00ff7f' },
            ].map(card => (
              <div key={card.label} className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-5 text-center">
                <div className="text-[#888] text-[10px] uppercase tracking-widest mb-2">{card.label}</div>
                <div className="text-[28px] font-bold" style={{ color: card.color }}>{card.value}</div>
              </div>
            ))}
          </div>

          {/* 7-Day Calendar */}
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6 mb-6">
            <h2 className="text-white font-semibold mb-5">This Week</h2>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span className="text-[#555] text-[11px]">{day.label}</span>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[18px] ${
                    day.active ? 'bg-[rgba(255,107,53,0.2)] border border-[#ff6b35]' : 'bg-[#0f0f0f] border border-[#2a2a2a]'
                  }`}>
                    {day.active ? '🔥' : '○'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">Streak Tips</h2>
            <div className="space-y-3">
              {[
                { icon: '⏰', tip: 'Set a daily reminder to practice at the same time each day.' },
                { icon: '🎯', tip: 'Even 5 minutes counts — short sessions keep streaks alive.' },
                { icon: '📱', tip: 'Complete a flashcard review before bed to maintain momentum.' },
                { icon: '🏆', tip: `Your best streak is ${streak?.longest_streak || 0} days — beat it!` },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[20px]">{item.icon}</span>
                  <p className="text-[#888] text-[13px]">{item.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </StudentLayout>
  );
}
