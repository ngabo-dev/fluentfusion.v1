import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { instructorApi } from "../app/api/config";
import InstructorLayout from "../app/components/InstructorLayout";
import { toast } from "sonner";

interface Course {
  id: number;
  title: string;
  description: string;
  language: string;
  level: string;
  is_published: boolean;
  status: "active" | "pending_edit" | "pending_delete" | "rejected";
  approval_status?: string;
  enrollment_count: number;
  average_rating: number;
  thumbnail_url: string | null;
  price_usd?: number;
  created_at: string;
}

export default function InstructorMyCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editData, setEditData] = useState({ title: '', description: '', language: '', level: '', thumbnail_url: '' });
  const [deleteReason, setDeleteReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('ff_access_token');
    const userData = localStorage.getItem('ff_user');
    if (!token || !userData) { navigate('/login'); return; }
    try {
      const parsed = JSON.parse(userData);
      if (!['instructor', 'admin', 'super_admin'].includes(parsed.role)) { navigate('/dashboard'); return; }
    } catch { navigate('/login'); return; }
    fetchCourses();
  }, [navigate]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await instructorApi.getMyCourses();
      const courseList = Array.isArray(res.courses) ? res.courses : (Array.isArray(res) ? res : []);
      setCourses(courseList);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (course: Course) => {
    setSelectedCourse(course);
    setEditData({ title: course.title, description: course.description, language: course.language, level: course.level, thumbnail_url: course.thumbnail_url || '' });
    setShowEditModal(true);
  };

  const handleDeleteClick = (course: Course) => {
    setSelectedCourse(course);
    setDeleteReason('');
    setShowDeleteModal(true);
  };

  const handleSubmitEdit = async () => {
    if (!selectedCourse) return;
    setSubmitting(true);
    try {
      await instructorApi.requestCourseEdit(selectedCourse.id, { title: editData.title, description: editData.description, level: editData.level, thumbnail_url: editData.thumbnail_url || undefined }, 'Updating course content');
      setCourses(courses.map(c => c.id === selectedCourse.id ? { ...c, status: 'pending_edit' as const } : c));
      setShowEditModal(false);
      toast.success('Edit request submitted. Waiting for admin approval.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit edit request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitDelete = async () => {
    if (!selectedCourse || !deleteReason.trim()) { toast.error('Please provide a reason for deletion'); return; }
    setSubmitting(true);
    try {
      await instructorApi.requestCourseDelete(selectedCourse.id, deleteReason);
      setCourses(courses.map(c => c.id === selectedCourse.id ? { ...c, status: 'pending_delete' as const } : c));
      setShowDeleteModal(false);
      toast.success('Delete request submitted. Admin will review your request.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit delete request');
    } finally {
      setSubmitting(false);
    }
  };

  const canEdit = (course: Course) => course.status === 'active' || course.status === 'rejected';
  const canDelete = (course: Course) => course.status === 'active' && course.enrollment_count === 0;

  const getStatusBadge = (course: Course) => {
    const status = course.approval_status || course.status;
    if (status === 'pending' || status === 'pending_edit')
      return <span className="px-2 py-0.5 rounded text-[10px] bg-orange-500/10 text-orange-400">Pending Approval</span>;
    if (status === 'pending_delete')
      return <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/10 text-red-400">Pending Delete</span>;
    if (status === 'rejected')
      return <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/10 text-red-500">Rejected</span>;
    if (course.is_published)
      return <span className="px-2 py-0.5 rounded text-[10px] bg-[rgba(191,255,0,0.15)] text-[#bfff00]">Published</span>;
    return <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-[#888]">Draft</span>;
  };

  const getLevelColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner': case 'a1': case 'a2': return 'bg-[rgba(0,255,127,0.1)] text-[#00ff7f]';
      case 'intermediate': case 'b1': case 'b2': return 'bg-[rgba(255,191,0,0.1)] text-yellow-400';
      case 'advanced': case 'c1': case 'c2': return 'bg-red-500/10 text-red-400';
      default: return 'bg-[rgba(191,255,0,0.1)] text-[#bfff00]';
    }
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'published' && c.is_published) ||
      (filterStatus === 'draft' && !c.is_published) ||
      (filterStatus === 'pending' && (c.status === 'pending_edit' || c.approval_status === 'pending')) ||
      (filterStatus === 'rejected' && c.status === 'rejected');
    return matchesSearch && matchesFilter;
  });

  const headerAction = (
    <Link to="/instructor/create-course" className="bg-[#bfff00] text-black px-5 py-2.5 rounded-lg font-semibold no-underline text-[14px] hover:opacity-90 transition-opacity">
      + Create New Course
    </Link>
  );

  return (
    <InstructorLayout title="My Courses" subtitle="Manage your courses — edits and deletions require admin approval" headerAction={headerAction}>
      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#151515] border border-[#2a2a2a] text-white rounded-lg px-4 py-2 text-[13px] outline-none focus:border-[#bfff00] transition-colors w-[200px]"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#151515] border border-[#2a2a2a] text-[#888] rounded-lg px-3 py-2 text-[13px] outline-none"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="flex items-center bg-[#151515] rounded-lg p-1 border border-[#2a2a2a]">
          <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 rounded text-[12px] transition-colors ${viewMode === 'grid' ? 'bg-[#bfff00] text-black font-semibold' : 'text-[#888] hover:text-white'}`}>▦ Grid</button>
          <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded text-[12px] transition-colors ${viewMode === 'list' ? 'bg-[#bfff00] text-black font-semibold' : 'text-[#888] hover:text-white'}`}>☰ List</button>
        </div>
      </div>

      {/* Summary counts */}
      <div className="flex items-center gap-4 mb-5 text-[13px]">
        <span className="text-[#888]">{filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}</span>
        {filterStatus === 'all' && (
          <>
            <span className="text-[#555]">·</span>
            <span className="text-[#bfff00]">{courses.filter(c => c.is_published).length} published</span>
            <span className="text-[#555]">·</span>
            <span className="text-[#888]">{courses.filter(c => !c.is_published).length} drafts</span>
          </>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="text-[#bfff00] text-[14px]">Loading courses...</div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-12 text-center">
          <div className="text-[52px] mb-4">📚</div>
          <h3 className="text-white text-[18px] font-semibold mb-2">{searchQuery || filterStatus !== 'all' ? 'No courses match your filters' : 'No courses yet'}</h3>
          <p className="text-[#888] text-[14px] mb-5">{searchQuery || filterStatus !== 'all' ? 'Try adjusting your search or filters.' : 'Start creating courses to share your knowledge.'}</p>
          {!searchQuery && filterStatus === 'all' && (
            <Link to="/instructor/create-course" className="bg-[#bfff00] text-black px-6 py-2.5 rounded-lg font-semibold inline-block no-underline">
              Create Your First Course
            </Link>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-[#151515] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#3a3a3a] transition-all">
              <div className="h-[140px] bg-[#1a1a1a] relative overflow-hidden">
                {course.thumbnail_url ? (
                  <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[48px]">📖</span>
                  </div>
                )}
                <div className="absolute top-2 right-2">{getStatusBadge(course)}</div>
              </div>
              <div className="p-5">
                <h3 className="text-white font-bold text-[15px] mb-1 truncate">{course.title}</h3>
                <p className="text-[#888] text-[12px] mb-3 line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-[10px] ${getLevelColor(course.level)}`}>{course.level}</span>
                  <span className="text-[#555] text-[11px]">🌍 {course.language}</span>
                  <span className="text-[#888] text-[11px]">👥 {course.enrollment_count}</span>
                  {course.average_rating > 0 && <span className="text-[#bfff00] text-[11px]">⭐ {course.average_rating.toFixed(1)}</span>}
                </div>

                {(course.status === 'pending_edit' || course.approval_status === 'pending') && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2 mb-3">
                    <p className="text-orange-400 text-[11px]">⏳ Pending admin approval</p>
                  </div>
                )}
                {course.status === 'pending_delete' && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-3">
                    <p className="text-red-400 text-[11px]">⏳ Delete request pending</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link to={`/instructor/curriculum/${course.id}`} className="flex-1 bg-[#0f0f0f] text-[#bfff00] text-center py-2 rounded-lg text-[12px] no-underline hover:bg-[#1a1a1a] transition-colors">
                    📖 Curriculum
                  </Link>
                  {canEdit(course) && (
                    <button onClick={() => handleEditClick(course)} className="flex-1 bg-[#0f0f0f] text-white py-2 rounded-lg text-[12px] hover:bg-[#1a1a1a] transition-colors">
                      ✏️ Edit
                    </button>
                  )}
                  {canDelete(course) && (
                    <button onClick={() => handleDeleteClick(course)} className="px-3 bg-red-500/10 text-red-400 py-2 rounded-lg text-[12px] hover:bg-red-500/20 transition-colors">
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left text-[#555] text-[11px] uppercase tracking-widest px-5 py-3 font-normal">Course</th>
                <th className="text-left text-[#555] text-[11px] uppercase tracking-widest px-4 py-3 font-normal hidden md:table-cell">Level</th>
                <th className="text-left text-[#555] text-[11px] uppercase tracking-widest px-4 py-3 font-normal hidden md:table-cell">Students</th>
                <th className="text-left text-[#555] text-[11px] uppercase tracking-widest px-4 py-3 font-normal hidden lg:table-cell">Rating</th>
                <th className="text-left text-[#555] text-[11px] uppercase tracking-widest px-4 py-3 font-normal">Status</th>
                <th className="text-right text-[#555] text-[11px] uppercase tracking-widest px-5 py-3 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course, idx) => (
                <tr key={course.id} className={`border-b border-[#1a1a1a] last:border-0 hover:bg-[#1a1a1a] transition-colors ${idx % 2 === 0 ? '' : 'bg-[#131313]'}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-[40px] h-[40px] rounded-lg bg-[#0f0f0f] overflow-hidden flex-shrink-0">
                        {course.thumbnail_url ? (
                          <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[18px]">📖</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-[13px] font-semibold truncate max-w-[200px]">{course.title}</p>
                        <p className="text-[#555] text-[11px] truncate max-w-[200px]">🌍 {course.language}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${getLevelColor(course.level)}`}>{course.level}</span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-[#bfff00] font-bold text-[14px]">{course.enrollment_count}</span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-white text-[13px]">{course.average_rating > 0 ? `${course.average_rating.toFixed(1)} ⭐` : '—'}</span>
                  </td>
                  <td className="px-4 py-4">{getStatusBadge(course)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/instructor/curriculum/${course.id}`} className="text-[#bfff00] text-[12px] no-underline hover:underline whitespace-nowrap">Curriculum</Link>
                      {canEdit(course) && (
                        <button onClick={() => handleEditClick(course)} className="text-[#888] text-[12px] hover:text-white transition-colors whitespace-nowrap">Edit</button>
                      )}
                      {canDelete(course) && (
                        <button onClick={() => handleDeleteClick(course)} className="text-red-400 text-[12px] hover:text-red-300 transition-colors whitespace-nowrap">Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]" onClick={() => setShowEditModal(false)}>
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6 w-full max-w-[560px] mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-white text-[18px] font-bold mb-1">Edit Course</h2>
            <p className="text-[#888] text-[13px] mb-5">Your edit request will be sent to admin for approval.</p>
            <div className="space-y-4">
              <div>
                <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Course Title</label>
                <input type="text" value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} className="w-full bg-[#0f0f0f] text-white rounded-lg px-4 py-3 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors text-[14px]" />
              </div>
              <div>
                <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Description</label>
                <textarea value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} rows={3} className="w-full bg-[#0f0f0f] text-white rounded-lg px-4 py-3 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors resize-none text-[14px]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Level</label>
                  <select value={editData.level} onChange={(e) => setEditData({ ...editData, level: e.target.value })} className="w-full bg-[#0f0f0f] text-white rounded-lg px-4 py-3 outline-none border border-[#2a2a2a] text-[14px]">
                    {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Thumbnail URL</label>
                  <input type="text" value={editData.thumbnail_url} onChange={(e) => setEditData({ ...editData, thumbnail_url: e.target.value })} placeholder="https://..." className="w-full bg-[#0f0f0f] text-white rounded-lg px-4 py-3 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors text-[14px]" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowEditModal(false)} className="flex-1 bg-[#0f0f0f] text-[#888] py-3 rounded-lg hover:text-white transition-colors">Cancel</button>
                <button onClick={handleSubmitEdit} disabled={submitting} className="flex-1 bg-[#bfff00] text-black py-3 rounded-lg font-semibold disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit for Approval'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6 w-full max-w-[480px] mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-white text-[18px] font-bold mb-1">Delete Course</h2>
            <p className="text-[#888] text-[13px] mb-5">Your delete request will be sent to admin for approval. Please explain why.</p>
            <div className="bg-[#0f0f0f] rounded-lg p-4 mb-4">
              <h3 className="text-white font-semibold text-[14px]">{selectedCourse.title}</h3>
              <p className="text-[#555] text-[12px]">{selectedCourse.enrollment_count} students enrolled</p>
            </div>
            <div className="mb-4">
              <label className="text-[#888] text-[11px] uppercase tracking-widest block mb-2">Reason for deletion *</label>
              <textarea value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} placeholder="Explain why you want to delete this course..." rows={4} className="w-full bg-[#0f0f0f] text-white rounded-lg px-4 py-3 outline-none border border-[#2a2a2a] focus:border-red-500 transition-colors resize-none text-[14px]" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-[#0f0f0f] text-[#888] py-3 rounded-lg hover:text-white transition-colors">Cancel</button>
              <button onClick={handleSubmitDelete} disabled={submitting || !deleteReason.trim()} className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 hover:bg-red-500 transition-colors">
                {submitting ? 'Submitting...' : 'Submit for Approval'}
              </button>
            </div>
          </div>
        </div>
      )}
    </InstructorLayout>
  );
}
