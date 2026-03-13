import { useState, useEffect } from 'react';
import { gamificationApi } from '../app/api/config';
import StudentLayout from '../app/components/StudentLayout';

export default function Component32DailyChallenge() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const fetchChallenge = () => {
    setLoading(true);
    gamificationApi.getDailyChallenge()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchChallenge, []);

  const completeTask = async (taskId: number) => {
    setCompleting(taskId);
    try {
      const res = await gamificationApi.completeChallengeTask(taskId);
      setMessage(res.is_completed ? `+${res.xp_earned} XP earned!` : 'Progress updated!');
      fetchChallenge();
    } catch {
      setMessage('Failed to update task');
    } finally {
      setCompleting(null);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const challenge = data?.challenge;
  const tasks: any[] = data?.tasks || [];
  const progress = data?.completed_count || 0;
  const total = data?.total_tasks || tasks.length;

  return (
    <StudentLayout title="Daily Challenge" subtitle="Complete today's tasks to earn bonus XP">
      {loading ? (
         <div className="flex items-center justify-center min-h-[400px] text-[var(--text-tertiary)]">Loading...</div>
       ) : !challenge ? (
         <div className="text-center py-24">
           <div className="text-[64px] mb-4">🌙</div>
           <h2 className="text-[var(--text-primary)] font-bold text-[20px] mb-2">No Challenge Today</h2>
           <p className="text-[var(--text-tertiary)] text-[14px]">Check back tomorrow for new challenges!</p>
         </div>
       ) : (
        <>
          {/* Challenge Header */}
          <div className="bg-gradient-to-r from-[rgba(var(--accent-warning-rgb),0.15)] to-[rgba(var(--accent-warning-rgb),0.05)] border border-[rgba(var(--accent-warning-rgb),0.3)] rounded-2xl p-6 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[#ffb800] text-[10px] uppercase tracking-widest">TODAY'S CHALLENGE</span>
                <h2 className="text-white font-bold text-[22px] mt-1">{challenge.title}</h2>
                {challenge.description && <p className="text-[#888] text-[13px] mt-1">{challenge.description}</p>}
              </div>
              {challenge.xp_reward && (
                 <div className="text-right flex-shrink-0 ml-4">
                   <div className="text-[var(--accent-primary)] text-[11px] mb-1">Reward</div>
                   <div className="text-[var(--accent-primary)] font-bold text-[20px]">+{challenge.bonus_xp || challenge.xp_reward} XP</div>
                 </div>
               )}
            </div>

            {/* Overall Progress */}
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-[var(--bg-tertiary)] h-[8px] rounded-[99px] overflow-hidden">
                <div className="bg-gradient-to-r from-[var(--accent-warning)] to-[var(--accent-warning-hover)] h-full rounded-[99px] transition-all"
                  style={{ width: total > 0 ? `${Math.round((progress / total) * 100)}%` : '0%' }}
                />
              </div>
              <span className="text-[#888] text-[12px] whitespace-nowrap">{progress}/{total} done</span>
            </div>

            {message && <p className="mt-3 text-[#bfff00] text-[13px]">{message}</p>}
          </div>

          {/* Tasks */}
          <div className="space-y-3">
            {tasks.map((task: any) => {
              const isCompleted = task.is_completed;
              const userProgress = task.current_count || 0;
              const taskProgress = task.target_count > 1 ? Math.min(userProgress / task.target_count, 1) : (isCompleted ? 1 : 0);

              return (
                <div
                  key={task.id}
                  className={`bg-[#151515] border rounded-xl p-5 transition-all ${
                    isCompleted ? 'border-[rgba(191,255,0,0.3)] opacity-70' : 'border-[#2a2a2a]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[16px] flex-shrink-0 mt-0.5 ${
                        isCompleted ? 'bg-[rgba(191,255,0,0.15)]' : 'bg-[#0f0f0f]'
                      }`}>
                        {isCompleted ? '✅' : task.task_type === 'lesson' ? '📚' : task.task_type === 'quiz' ? '❓' : task.task_type === 'speaking' ? '🎤' : '⚡'}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium text-[14px] mb-0.5 ${isCompleted ? 'text-[#555] line-through' : 'text-white'}`}>
                          {task.description || task.title || `Complete ${task.task_type}`}
                        </p>
                        {task.xp_reward && !isCompleted && (
                          <span className="text-[#bfff00] text-[11px]">+{task.xp_reward} XP</span>
                        )}
                        {task.target_count > 1 && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[#555] text-[11px]">{userProgress}/{task.target_count}</span>
                            </div>
                            <div className="bg-[#2a2a2a] h-[4px] rounded-[99px] overflow-hidden w-32">
                              <div className="bg-[#bfff00] h-full rounded-[99px]" style={{ width: `${taskProgress * 100}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {!isCompleted && (
                      <button
                        onClick={() => completeTask(task.id)}
                        disabled={completing === task.id}
                        className="px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-white text-[12px] rounded-lg hover:border-[#bfff00] transition-colors disabled:opacity-50 whitespace-nowrap flex-shrink-0"
                      >
                        {completing === task.id ? '...' : 'Mark Done'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {progress === total && total > 0 && (
            <div className="mt-8 text-center bg-gradient-to-r from-[rgba(191,255,0,0.1)] to-[rgba(191,255,0,0.04)] border border-[rgba(191,255,0,0.3)] rounded-2xl p-8">
              <div className="text-[48px] mb-2">🏆</div>
              <h3 className="text-white font-bold text-[18px] mb-1">Challenge Complete!</h3>
              <p className="text-[#888] text-[13px]">You've completed all tasks for today. Come back tomorrow!</p>
            </div>
          )}
        </>
      )}
    </StudentLayout>
  );
}
