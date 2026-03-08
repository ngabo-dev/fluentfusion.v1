import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { adminApi } from '../app/api/config';

export default function AdminAnnouncements() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', summary: '', announcement_type: 'general', priority: 'normal', target_role: '' });

  useEffect(() => {
    const userData = localStorage.getItem('ff_user');
    if (!userData) { navigate('/login'); return; }
    try {
      const parsed = JSON.parse(userData);
      if (parsed.role !== 'admin') { navigate('/dashboard'); return; }
      setUser(parsed);
    } catch (e) { navigate('/login'); }
  }, [navigate]);

  useEffect(() => { fetchAnnouncements(); }, [page]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAnnouncements({ page, limit: 20 });
      setAnnouncements(data.announcements);
      setTotalPages(data.total_pages);
    } catch (error) { console.error('Failed to fetch:', error); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createAnnouncement(formData);
      setShowCreate(false);
      setFormData({ title: '', content: '', summary: '', announcement_type: 'general', priority: 'normal', target_role: '' });
      fetchAnnouncements();
    } catch (error) { console.error('Failed to create:', error); }
  };

  const handlePublish = async (id: number) => {
    try {
      await adminApi.updateAnnouncement(id, { is_published: true });
      fetchAnnouncements();
    } catch (error) { console.error('Failed:', error); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this announcement?')) return;
    try {
      await adminApi.deleteAnnouncement(id);
      fetchAnnouncements();
    } catch (error) { console.error('Failed:', error); }
  };

  const getUserInitials = () => {
    if (user?.full_name) {
      const names = user.full_name.split(' ');
      return names.length >= 2 ? (names[0][0] + names[names.length - 1][0]).toUpperCase() : names[0].substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'AD';
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-50">
        <div className="absolute border-b border-[#2a2a2a] inset-0 pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="flex items-center justify-between px-[40px] w-full">
            <Link to="/admin/analytics" className="flex gap-[11px] items-center no-underline">
              <div className="bg-[#bfff00] flex items-center justify-center w-[38px] h-[38px] rounded-[10px]"><span className="text-[18px]">🧠</span></div>
              <span className="text-[18px] text-white font-bold">FLUENT<span className="text-[#bfff00]">FUSION</span></span>
            </Link>
            <div className="flex items-center gap-[12px]">
              <div className="bg-[rgba(255,68,68,0.1)] px-[13px] py-[5px] rounded-[99px]"><span className="text-[#f44] text-[11px] font-semibold">🛡 Admin</span></div>
              <div className="w-[32px] h-[32px] rounded-[16px] flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
                <span className="text-[13px] font-bold text-black">{getUserInitials()}</span>
              </div>
              <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="text-[#888] hover:text-white text-sm">Logout</button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-66px)]">
        <div className="fixed left-0 top-[66px] w-[240px] h-[calc(100vh-66px)] bg-[#0f0f0f] border-r border-[#2a2a2a] overflow-y-auto">
          <div className="flex flex-col py-5 px-0">
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3">Admin Panel</div>
            <Link to="/admin/users" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"><span>👥</span><span className="text-[14px]">Users</span></Link>
            <Link to="/admin/courses" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"><span>📚</span><span className="text-[14px]">Courses</span></Link>
            <Link to="/admin/enrollments" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"><span>🎓</span><span className="text-[14px]">Enrollments</span></Link>
            <Link to="/admin/analytics" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"><span>📊</span><span className="text-[14px]">Analytics</span></Link>
            <Link to="/admin/reports" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"><span>📋</span><span className="text-[14px]">Reports</span></Link>
            <Link to="/admin/announcements" className="w-full bg-[rgba(191,255,0,0.1)] border-l-2 border-[#bfff00] py-3 pl-6 pr-4 flex gap-3 items-center"><span className="text-[#bfff00]">📢</span><span className="text-[#bfff00] text-[14px]">Announcements</span></Link>
            <Link to="/admin/audit-log" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"><span>📝</span><span className="text-[14px]">Audit Log</span></Link>
          </div>
        </div>

        <div className="ml-[240px] flex-1 p-9">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-[32px] text-white font-bold">Announcements</h1>
            <button onClick={() => setShowCreate(true)} className="bg-[#bfff00] text-black px-6 py-3 rounded-[8px] font-semibold">+ Create</button>
          </div>

          {showCreate && (
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 mb-6">
              <h3 className="text-white text-[18px] font-bold mb-4">Create Announcement</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] w-full" required />
                <textarea placeholder="Content" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] w-full h-32" required />
                <input type="text" placeholder="Summary" value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] w-full" />
                <div className="flex gap-4">
                  <select value={formData.announcement_type} onChange={e => setFormData({...formData, announcement_type: e.target.value})} className="bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]">
                    <option value="general">General</option>
                    <option value="system">System</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="feature">Feature</option>
                    <option value="event">Event</option>
                  </select>
                  <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]">
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <select value={formData.target_role} onChange={e => setFormData({...formData, target_role: e.target.value})} className="bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]">
                    <option value="">All Users</option>
                    <option value="student">Students</option>
                    <option value="instructor">Instructors</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="bg-[#bfff00] text-black px-6 py-3 rounded-[8px] font-semibold">Create</button>
                  <button type="button" onClick={() => setShowCreate(false)} className="bg-[#1f1f1f] text-white px-6 py-3 rounded-[8px] border border-[#2a2a2a]">Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  <th className="text-left text-[#888] text-[12px] uppercase tracking-[1px] px-6 py-4">Title</th>
                  <th className="text-left text-[#888] text-[12px] uppercase tracking-[1px] px-6 py-4">Type</th>
                  <th className="text-left text-[#888] text-[12px] uppercase tracking-[1px] px-6 py-4">Priority</th>
                  <th className="text-left text-[#888] text-[12px] uppercase tracking-[1px] px-6 py-4">Status</th>
                  <th className="text-left text-[#888] text-[12px] uppercase tracking-[1px] px-6 py-4">Views</th>
                  <th className="text-left text-[#888] text-[12px] uppercase tracking-[1px] px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center text-[#888] py-8">Loading...</td></tr>
                ) : announcements.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-[#888] py-8">No announcements</td></tr>
                ) : (
                  announcements.map((ann) => (
                    <tr key={ann.id} className="border-b border-[#2a2a2a] hover:bg-[#1a1a1a]">
                      <td className="px-6 py-4 text-white">{ann.title}</td>
                      <td className="px-6 py-4 text-[#888]">{ann.announcement_type}</td>
                      <td className="px-6 py-4"><span className={`px-3 py-1 rounded-[99px] text-[12px] ${ann.priority === 'urgent' ? 'bg-[rgba(255,68,68,0.1)] text-[#f44]' : 'bg-[rgba(0,212,255,0.1)] text-[#00d4ff]'}`}>{ann.priority}</span></td>
                      <td className="px-6 py-4"><span className={`px-3 py-1 rounded-[99px] text-[12px] ${ann.is_published ? 'bg-[rgba(0,255,127,0.1)] text-[#00ff7f]' : 'bg-[rgba(255,184,0,0.1)] text-[#ffb800]'}`}>{ann.is_published ? 'Published' : 'Draft'}</span></td>
                      <td className="px-6 py-4 text-[#888]">{ann.view_count}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {!ann.is_published && <button onClick={() => handlePublish(ann.id)} className="bg-[#bfff00] text-black px-3 py-1 rounded text-[12px]">Publish</button>}
                          <button onClick={() => handleDelete(ann.id)} className="bg-[#f44] text-white px-3 py-1 rounded text-[12px]">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
