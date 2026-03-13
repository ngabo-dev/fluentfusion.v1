import { useState, useEffect } from 'react';
import { communityApi } from '../app/api/config';
import StudentLayout from '../app/components/StudentLayout';

export default function Component22CommunityFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [liking, setLiking] = useState<number | null>(null);

  const currentUserId = (() => {
    try { return JSON.parse(localStorage.getItem('ff_user') || '{}').id; } catch { return null; }
  })();

  const fetchPosts = (p = 1) => {
    setLoading(true);
    communityApi.getPosts({ page: p, limit: 20 })
      .then(data => {
        setPosts(p === 1 ? data.posts || [] : prev => [...prev, ...(data.posts || [])]);
        setTotal(data.total || 0);
        setPage(p);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => fetchPosts(1), []);

  const submitPost = async () => {
    if (!newPost.trim()) return;
    setPosting(true);
    try {
      await communityApi.createPost({ body: newPost.trim() });
      setNewPost('');
      fetchPosts(1);
    } catch (e) {
      console.error(e);
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: number) => {
    setLiking(postId);
    try {
      const res = await communityApi.likePost(postId);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, like_count: res.like_count } : p));
    } catch (e) {
      console.error(e);
    } finally {
      setLiking(null);
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <StudentLayout title="Community" subtitle="Connect with fellow language learners">
      {/* New Post */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl p-5 mb-6">
        <textarea
          className="w-full bg-transparent text-white text-[14px] resize-none focus:outline-none placeholder-[#555]"
          rows={3}
          placeholder="Share something with the community..."
          value={newPost}
          onChange={e => setNewPost(e.target.value)}
        />
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2a2a2a]">
          <span className="text-[#555] text-[12px]">{newPost.length}/500</span>
          <button
            onClick={submitPost}
            disabled={posting || !newPost.trim() || newPost.length > 500}
            className="bg-[var(--accent-primary)] text-black px-5 py-2 rounded-lg font-semibold text-[13px] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {posting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      {loading && posts.length === 0 ? (
        <div className="flex items-center justify-center min-h-[300px] text-[#888]">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-[48px] mb-3">🌍</div>
          <p className="text-[#888] text-[14px]">No posts yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post: any) => {
            const isOwn = post.user_id === currentUserId;
            const authorName = post.user_name || post.author_name || 'User';
            const initials = authorName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

            return (
              <div key={post.id} className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-5 hover:border-[#3a3a3a] transition-colors">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-black flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #bfff00, #8fef00)' }}
                  >
                    {initials}
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-medium text-[14px]">{authorName}</span>
                    {isOwn && <span className="text-[#555] text-[11px] ml-2">(you)</span>}
                    {post.created_at && (
                      <span className="text-[#555] text-[12px] ml-2">· {timeAgo(post.created_at)}</span>
                    )}
                  </div>
                  {post.post_type && (
                    <span className="text-[#888] text-[11px] bg-[#0f0f0f] px-2 py-1 rounded capitalize">{post.post_type}</span>
                  )}
                </div>

                {/* Body */}
                <p className="text-white text-[14px] leading-relaxed mb-4 whitespace-pre-wrap">{post.body}</p>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-3 border-t border-[var(--border-subtle)]">
                  <button
                    onClick={() => handleLike(post.id)}
                    disabled={liking === post.id}
                    className="flex items-center gap-1.5 text-[#888] hover:text-[#bfff00] transition-colors text-[13px] disabled:opacity-50"
                  >
                    <span>❤️</span>
                    <span>{post.like_count || 0}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-[#888] hover:text-[#bfff00] transition-colors text-[13px]">
                    <span>💬</span>
                    <span>{post.comment_count || 0}</span>
                  </button>
                </div>
              </div>
            );
          })}

          {posts.length < total && (
            <button
              onClick={() => fetchPosts(page + 1)}
              className="w-full py-3 bg-[#151515] border border-[#2a2a2a] text-[#888] rounded-xl text-[13px] hover:border-[#3a3a3a] transition-colors"
            >
              Load more posts
            </button>
          )}
        </div>
      )}
    </StudentLayout>
  );
}
