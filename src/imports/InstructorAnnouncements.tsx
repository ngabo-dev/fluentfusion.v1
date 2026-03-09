import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { instructorApi } from "../app/api/config";
import InstructorLayout from "../app/components/InstructorLayout";
import { toast } from "sonner";

interface Announcement {
  id: number;
  title: string;
  content: string;
  course_id: number;
  course_title: string;
  is_published: boolean;
  created_at: string | null;
  scheduled_for: string | null;
}

export default function InstructorAnnouncements() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    course_id: 0,
    is_published: true
  });
  const [creating, setCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; show: boolean }>({ id: 0, show: false });

  useEffect(() => {
    const token = localStorage.getItem('ff_access_token');
    const userData = localStorage.getItem('ff_user');
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      if (parsed.role && !['instructor', 'admin'].includes(parsed.role)) {
        navigate('/dashboard');
        return;
      }
      setUser(parsed);
    } catch (e) {
      navigate('/login');
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [announcementsRes, coursesRes] = await Promise.all([
        instructorApi.getAnnouncements({}),
        instructorApi.getMyCourses()
      ]);
      setAnnouncements(announcementsRes.announcements || []);
      setCourses(coursesRes.courses || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content || !newAnnouncement.course_id) {
      toast.error('Please fill in all required fields');
      return;
    }
    setCreating(true);
    try {
      await instructorApi.createAnnouncement(newAnnouncement);
      setShowCreateModal(false);
      setNewAnnouncement({ title: "", content: "", course_id: 0, is_published: true });
      toast.success('Announcement created successfully');
      fetchData();
    } catch (error: any) {
      console.error('Failed to create:', error);
      toast.error(error.message || 'Failed to create announcement');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await instructorApi.deleteAnnouncement(deleteConfirm.id);
      setDeleteConfirm({ id: 0, show: false });
      toast.success('Announcement deleted');
      fetchData();
    } catch (error: any) {
      console.error('Failed to delete:', error);
      toast.error(error.message || 'Failed to delete announcement');
    }
  };

  const filteredAnnouncements = announcements.filter(a => {
    if (selectedCourse && a.course_id.toString() !== selectedCourse) return false;
    return true;
  });

  const headerAction = (
    <button
      onClick={() => setShowCreateModal(true)}
      className="bg-[#bfff00] text-black px-5 py-2.5 rounded-lg font-semibold text-[14px] hover:opacity-90 transition-opacity"
    >
      + New Announcement
    </button>
  );

  return (
    <InstructorLayout
      title="Announcements"
      subtitle={`${announcements.length} announcement${announcements.length !== 1 ? 's' : ''} posted to students`}
      headerAction={headerAction}
    >
      {/* Filter */}
      <div className="mb-6">
        <select
          title="Filter by course"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="bg-[#151515] border border-[#2a2a2a] text-[#888] rounded-lg px-3 py-2 text-[13px] outline-none"
        >
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="text-[#888] text-center py-8">Loading...</div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-12 text-center">
          <div className="text-[48px] mb-4">📢</div>
          <p className="text-[#888] text-[14px]">No announcements yet</p>
          <p className="text-[#555] text-[13px] mt-2">Create your first announcement to communicate with your students</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement) => (
            <div key={announcement.id} className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#3a3a3a] transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold text-[15px]">{announcement.title}</h3>
                  <p className="text-[#888] text-[12px] mt-1">
                    📚 {announcement.course_title} · {announcement.created_at ? new Date(announcement.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {announcement.is_published ? (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[rgba(0,255,127,0.1)] text-[#00ff7f]">Published</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-[#888]">Draft</span>
                  )}
                  <button
                    onClick={() => setDeleteConfirm({ id: announcement.id, show: true })}
                    className="text-[#555] hover:text-red-400 text-[13px] transition-colors px-2"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <p className="text-[#888] text-[13px] line-clamp-3">{announcement.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]" onClick={() => setShowCreateModal(false)}>
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6 w-full max-w-[560px] mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-white text-[18px] font-bold mb-5">Create Announcement</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Course *</label>
                <select
                  title="Select course"
                  value={newAnnouncement.course_id || ""}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, course_id: Number(e.target.value) })}
                  className="w-full bg-[#0f0f0f] text-white rounded-lg px-4 py-2.5 outline-none border border-[#2a2a2a] text-[13px]"
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Title *</label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="Announcement title..."
                  className="w-full bg-[#0f0f0f] text-white rounded-lg px-4 py-2.5 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors text-[13px]"
                />
              </div>
              <div>
                <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Content *</label>
                <textarea
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  placeholder="Write your announcement to students..."
                  rows={5}
                  className="w-full bg-[#0f0f0f] text-white rounded-lg px-4 py-2.5 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors resize-none text-[13px]"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="publish"
                  checked={newAnnouncement.is_published}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, is_published: e.target.checked })}
                  className="w-4 h-4 accent-[#bfff00]"
                />
                <label htmlFor="publish" className="text-white text-[13px]">Publish immediately</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreateModal(false)} className="flex-1 bg-[#0f0f0f] text-[#888] py-2.5 rounded-lg text-[13px] hover:text-white transition-colors">Cancel</button>
                <button
                  onClick={handleCreate}
                  disabled={creating || !newAnnouncement.title || !newAnnouncement.content || !newAnnouncement.course_id}
                  className="flex-1 bg-[#bfff00] text-black py-2.5 rounded-lg font-semibold text-[13px] disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Announcement'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]" onClick={() => setDeleteConfirm({ id: 0, show: false })}>
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6 w-full max-w-[400px] mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-white text-[18px] font-bold mb-2">Delete Announcement?</h2>
            <p className="text-[#888] text-[13px] mb-6">This action cannot be undone. Students will no longer see this announcement.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm({ id: 0, show: false })} className="flex-1 bg-[#0f0f0f] text-[#888] py-2.5 rounded-lg text-[13px] hover:text-white transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-[13px] font-semibold hover:bg-red-500 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </InstructorLayout>
  );
}
