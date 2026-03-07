import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { instructorApi } from "../app/api/config";

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
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
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
      alert('Please fill in all fields');
      return;
    }
    setCreating(true);
    try {
      await instructorApi.createAnnouncement(newAnnouncement);
      setShowCreateModal(false);
      setNewAnnouncement({ title: "", content: "", course_id: 0, is_published: true });
      fetchData();
    } catch (error) {
      console.error('Failed to create:', error);
      alert('Failed to create announcement');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await instructorApi.deleteAnnouncement(deleteConfirm.id);
      setDeleteConfirm({ id: 0, show: false });
      fetchData();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete announcement');
    }
  };

  const filteredAnnouncements = announcements.filter(a => {
    if (selectedCourse && a.course_id.toString() !== selectedCourse) return false;
    return true;
  });

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Navigation */}
      <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-50">
        <div className="absolute border-b border-[#2a2a2a] inset-0 pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="flex items-center justify-between px-[40px] w-full">
            <Link to="/instructor/dashboard" className="flex gap-[11px] items-center no-underline">
              <div className="bg-[#bfff00] flex items-center justify-center w-[38px] h-[38px] rounded-[10px]">
                <span className="text-[18px]">🧠</span>
              </div>
              <span className="text-[18px] text-white font-bold">
                FLUENT<span className="text-[#bfff00]">FUSION</span>
              </span>
            </Link>
            <div className="flex items-center gap-[12px]">
              <div className="bg-[rgba(191,255,0,0.1)] px-[13px] py-[5px] rounded-[99px]">
                <span className="text-[#bfff00] text-[11px] font-semibold">📋 Instructor</span>
              </div>
              <button 
                onClick={() => {
                  localStorage.removeItem('access_token');
                  localStorage.removeItem('refresh_token');
                  localStorage.removeItem('user');
                  navigate('/login');
                }}
                className="text-[#888] hover:text-white text-sm bg-transparent border-none cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-66px)]">
        {/* Sidebar */}
        <div className="fixed left-0 top-[66px] w-[240px] h-[calc(100vh-66px)] bg-[#0f0f0f] border-r border-[#2a2a2a] overflow-y-auto">
          <div className="flex flex-col py-5 px-0">
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3">Instructor</div>
            
            <Link to="/instructor/dashboard" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📊</span>
              <span className="text-[14px]">Overview</span>
            </Link>
            
            <Link to="/instructor/create-course" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📚</span>
              <span className="text-[14px]">Create Course</span>
            </Link>
            
            <Link to="/instructor/students" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>👥</span>
              <span className="text-[14px]">Students</span>
            </Link>
            
            <Link to="/instructor/certificates" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>🎓</span>
              <span className="text-[14px]">Certificates</span>
            </Link>
            
            <Link to="/instructor/announcements" className="w-full bg-[rgba(191,255,0,0.1)] border-l-2 border-[#bfff00] py-3 pl-6 pr-4 flex gap-3 items-center">
              <span className="text-[#bfff00]">📢</span>
              <span className="text-[#bfff00] text-[14px]">Announcements</span>
            </Link>
            
            <Link to="/instructor/messages" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>💬</span>
              <span className="text-[14px]">Messages</span>
            </Link>
            
            <Link to="/live-sessions" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>🎥</span>
              <span className="text-[14px]">Live Sessions</span>
            </Link>
            
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4">Account</div>
            
            <Link to="/profile" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>👤</span>
              <span className="text-[14px]">Profile</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-[240px] flex-1 p-9">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[32px] text-white font-bold">
                <span className="text-[#bfff00]">Announcements</span> Management
              </h1>
              <p className="text-[#888] text-[14px] mt-1">
                {announcements.length} announcements posted
              </p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-[#bfff00] text-black px-6 py-3 rounded-[8px] font-semibold"
            >
              + New Announcement
            </button>
          </div>

          {/* Filter */}
          <div className="flex gap-4 mb-6">
            <select 
              title="Filter by course"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] min-w-[180px]"
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
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-8 text-center">
              <div className="text-[48px] mb-4">📢</div>
              <p className="text-[#888]">No announcements yet</p>
              <p className="text-[#555] text-sm mt-2">Create your first announcement to communicate with your students</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAnnouncements.map((announcement) => (
                <div key={announcement.id} className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-bold text-lg">{announcement.title}</h3>
                      <p className="text-[#888] text-sm mt-1">
                        {announcement.course_title} • {announcement.created_at ? new Date(announcement.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {announcement.is_published ? (
                        <span className="px-3 py-1 rounded-[99px] text-[12px] bg-[rgba(0,255,127,0.1)] text-[#00ff7f]">Published</span>
                      ) : (
                        <span className="px-3 py-1 rounded-[99px] text-[12px] bg-[rgba(255,255,255,0.1)] text-[#888]">Draft</span>
                      )}
                      <button 
                        onClick={() => setDeleteConfirm({ id: announcement.id, show: true })}
                        className="px-3 py-1 rounded-[8px] text-[#888] hover:text-red-500 bg-transparent border border-[#2a2a2a] text-[12px]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-[#888] text-[14px] line-clamp-3">{announcement.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]" onClick={() => setShowCreateModal(false)}>
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 w-[600px]" onClick={e => e.stopPropagation()}>
            <h2 className="text-white text-[20px] font-bold mb-4">Create Announcement</h2>
            
            <div className="mb-4">
              <label className="text-[#888] text-[12px] uppercase block mb-2">Course</label>
              <select
                title="Select course"
                value={newAnnouncement.course_id || ""}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, course_id: Number(e.target.value) })}
                className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="text-[#888] text-[12px] uppercase block mb-2">Title</label>
              <input
                type="text"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                placeholder="Announcement title..."
                className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
              />
            </div>
            
            <div className="mb-4">
              <label className="text-[#888] text-[12px] uppercase block mb-2">Content</label>
              <textarea
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                placeholder="Write your announcement..."
                rows={5}
                className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] resize-none"
              />
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <input
                type="checkbox"
                id="publish"
                checked={newAnnouncement.is_published}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, is_published: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="publish" className="text-white text-[14px]">Publish immediately</label>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-[#1f1f1f] text-[#888] py-3 rounded-[8px]"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreate}
                disabled={creating || !newAnnouncement.title || !newAnnouncement.content || !newAnnouncement.course_id}
                className="flex-1 bg-[#bfff00] text-black py-3 rounded-[8px] font-semibold disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create Announcement'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]" onClick={() => setDeleteConfirm({ id: 0, show: false })}>
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 w-[400px]" onClick={e => e.stopPropagation()}>
            <h2 className="text-white text-[20px] font-bold mb-4">Delete Announcement?</h2>
            <p className="text-[#888] mb-6">This action cannot be undone. Students will no longer see this announcement.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirm({ id: 0, show: false })}
                className="flex-1 bg-[#1f1f1f] text-[#888] py-3 rounded-[8px]"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white py-3 rounded-[8px]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
