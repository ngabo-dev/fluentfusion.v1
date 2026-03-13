import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { API_BASE_URL } from '../app/api/config';
import StudentLayout from '../app/components/StudentLayout';

function getRelativeTime(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

interface Thread {
  id: number;
  title: string;
  body: string;
  created_by_name: string;
  created_at: string;
  reply_count: number;
  is_pinned: boolean;
}

interface Reply {
  id: number;
  body: string;
  created_by_name: string;
  created_at: string;
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('ff_access_token');
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

export default function CourseDiscussion() {
  const { courseId } = useParams<{ courseId: string }>();
  const id = courseId || '';

  const [courseName, setCourseName] = useState('');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  // Expanded thread state
  const [expandedThread, setExpandedThread] = useState<number | null>(null);
  const [replies, setReplies] = useState<Record<number, Reply[]>>({});
  const [repliesLoading, setRepliesLoading] = useState<Record<number, boolean>>({});
  const [replyInput, setReplyInput] = useState<Record<number, string>>({});
  const [replySubmitting, setReplySubmitting] = useState<Record<number, boolean>>({});

  // New thread modal
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    Promise.allSettled([
      fetch(`${API_BASE_URL}/courses/${id}`, { headers: authHeaders() }).then(r => r.ok ? r.json() : {}),
      fetch(`${API_BASE_URL}/courses/${id}/discussions`, { headers: authHeaders() }).then(r => r.ok ? r.json() : { threads: [] }),
    ]).then(([courseRes, threadsRes]) => {
      if (courseRes.status === 'fulfilled') setCourseName(courseRes.value?.title || '');
      if (threadsRes.status === 'fulfilled') setThreads(threadsRes.value?.threads || []);
      setLoading(false);
    });
  }, [id]);

  const fetchReplies = async (threadId: number) => {
    setRepliesLoading(prev => ({ ...prev, [threadId]: true }));
    try {
      const res = await fetch(`${API_BASE_URL}/courses/${id}/discussions/${threadId}/replies`, {
        headers: authHeaders(),
      });
      const data = res.ok ? await res.json() : { replies: [] };
      setReplies(prev => ({ ...prev, [threadId]: data.replies || [] }));
    } catch {
      setReplies(prev => ({ ...prev, [threadId]: [] }));
    } finally {
      setRepliesLoading(prev => ({ ...prev, [threadId]: false }));
    }
  };

  const handleThreadClick = (threadId: number) => {
    if (expandedThread === threadId) {
      setExpandedThread(null);
    } else {
      setExpandedThread(threadId);
      if (!replies[threadId]) {
        fetchReplies(threadId);
      }
    }
  };

  const handleReplySubmit = async (threadId: number) => {
    const body = (replyInput[threadId] || '').trim();
    if (!body) return;
    setReplySubmitting(prev => ({ ...prev, [threadId]: true }));
    try {
      const res = await fetch(`${API_BASE_URL}/courses/${id}/discussions/${threadId}/replies`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ body }),
      });
      if (res.ok) {
        setReplyInput(prev => ({ ...prev, [threadId]: '' }));
        fetchReplies(threadId);
        // Update reply_count optimistically
        setThreads(prev => prev.map(t => t.id === threadId ? { ...t, reply_count: t.reply_count + 1 } : t));
      }
    } catch {
      // silently fail
    } finally {
      setReplySubmitting(prev => ({ ...prev, [threadId]: false }));
    }
  };

  const handleNewThread = async () => {
    if (!newTitle.trim()) { setError('Title is required.'); return; }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/courses/${id}/discussions`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ title: newTitle.trim(), body: newBody.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setThreads(prev => [data, ...prev]);
        setShowModal(false);
        setNewTitle('');
        setNewBody('');
      } else {
        setError('Failed to create thread.');
      }
    } catch {
      setError('Failed to create thread.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StudentLayout title="Discussion" subtitle="Course discussions">
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px] text-[#888]">Loading...</div>
      ) : (
        <>
          {/* Course header */}
          {courseName && (
            <div className="mb-6">
              <div className="text-[#555] text-[12px] uppercase tracking-widest mb-1">Course</div>
              <h2 className="text-white text-[20px] font-bold">{courseName}</h2>
            </div>
          )}

          {/* Action bar */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-[#888] text-[13px]">{threads.length} {threads.length === 1 ? 'thread' : 'threads'}</span>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="bg-[#bfff00] text-black px-5 py-2 rounded-lg font-semibold text-[13px] hover:shadow-[0_0_12px_rgba(191,255,0,0.25)] transition-all cursor-pointer border-none"
            >
              + New Thread
            </button>
          </div>

          {/* Thread list */}
          {threads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[260px] bg-[#151515] rounded-xl border border-[#2a2a2a]">
              <div className="text-[40px] mb-3">💬</div>
              <p className="text-[#888] text-[14px]">No discussions yet</p>
              <p className="text-[#555] text-[12px] mt-1">Be the first to start a conversation</p>
            </div>
          ) : (
            <div className="space-y-3">
              {threads.map(thread => (
                <div key={thread.id} className="bg-[#151515] border border-[#2a2a2a] rounded-xl overflow-hidden">
                  {/* Thread header row */}
                  <div
                    className="p-5 cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                    onClick={() => handleThreadClick(thread.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {thread.is_pinned && <span className="text-[13px]" title="Pinned">📌</span>}
                          <span className="text-white font-semibold text-[15px] truncate">{thread.title}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[12px] text-[#555]">
                          <span className="text-[#888]">{thread.created_by_name}</span>
                          <span>·</span>
                          <span>{getRelativeTime(thread.created_at)}</span>
                          <span>·</span>
                          <span>{thread.reply_count} {thread.reply_count === 1 ? 'reply' : 'replies'}</span>
                        </div>
                      </div>
                      <span className="text-[#555] text-[12px] shrink-0 mt-1">
                        {expandedThread === thread.id ? '▲' : '▼'}
                      </span>
                    </div>
                    {thread.body && (
                      <p className="text-[#888] text-[13px] mt-2 line-clamp-2">{thread.body}</p>
                    )}
                  </div>

                  {/* Expanded replies section */}
                  {expandedThread === thread.id && (
                    <div className="border-t border-[#2a2a2a] bg-[#0f0f0f] px-5 py-4">
                      {repliesLoading[thread.id] ? (
                        <div className="text-[#555] text-[13px] py-2">Loading replies...</div>
                      ) : (replies[thread.id] || []).length === 0 ? (
                        <div className="text-[#555] text-[13px] py-2">No replies yet. Be the first!</div>
                      ) : (
                        <div className="space-y-4 mb-4">
                          {(replies[thread.id] || []).map(reply => (
                            <div key={reply.id} className="flex gap-3">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#bfff00] to-[#8fef00] flex items-center justify-center text-[10px] font-bold text-black shrink-0 mt-0.5">
                                {reply.created_by_name?.slice(0, 2).toUpperCase() || 'U'}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-white text-[13px] font-medium">{reply.created_by_name}</span>
                                  <span className="text-[#555] text-[11px]">{getRelativeTime(reply.created_at)}</span>
                                </div>
                                <p className="text-[#aaa] text-[13px]">{reply.body}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply input */}
                      <div className="flex gap-3 mt-4">
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          value={replyInput[thread.id] || ''}
                          onChange={e => setReplyInput(prev => ({ ...prev, [thread.id]: e.target.value }))}
                          onKeyDown={e => { if (e.key === 'Enter') handleReplySubmit(thread.id); }}
                          className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white text-[13px] outline-none focus:border-[#bfff00] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => handleReplySubmit(thread.id)}
                          disabled={replySubmitting[thread.id] || !(replyInput[thread.id] || '').trim()}
                          className="bg-[#bfff00] text-black px-4 py-2 rounded-lg font-semibold text-[13px] cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                        >
                          {replySubmitting[thread.id] ? '...' : 'Reply'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* New Thread Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
              <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6 w-full max-w-lg mx-4">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-white text-[16px] font-bold">New Thread</h3>
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setError(''); setNewTitle(''); setNewBody(''); }}
                    className="text-[#888] hover:text-white text-[20px] bg-transparent border-none cursor-pointer leading-none"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Title</label>
                    <input
                      type="text"
                      placeholder="Thread title..."
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-[14px] outline-none focus:border-[#bfff00] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Body</label>
                    <textarea
                      placeholder="Describe your topic or question..."
                      value={newBody}
                      onChange={e => setNewBody(e.target.value)}
                      rows={4}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-[14px] outline-none focus:border-[#bfff00] transition-colors resize-none"
                    />
                  </div>
                  {error && <p className="text-red-400 text-[12px]">{error}</p>}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setError(''); setNewTitle(''); setNewBody(''); }}
                    className="flex-1 py-2 rounded-lg border border-[#2a2a2a] text-[#888] text-[13px] hover:bg-[#1f1f1f] hover:text-white transition-colors cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleNewThread}
                    disabled={submitting || !newTitle.trim()}
                    className="flex-1 py-2 rounded-lg bg-[#bfff00] text-black font-semibold text-[13px] cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  >
                    {submitting ? 'Posting...' : 'Post Thread'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </StudentLayout>
  );
}
