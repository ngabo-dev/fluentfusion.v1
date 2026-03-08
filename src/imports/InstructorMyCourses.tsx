import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { instructorApi } from "../app/api/config";

interface Course {
  id: number;
  title: string;
  description: string;
  language: string;
  level: string;
  is_published: boolean;
  status: "active" | "pending_edit" | "pending_delete" | "rejected";
  enrollment_count: number;
  average_rating: number;
  thumbnail_url: string | null;
  created_at: string;
}

export default function InstructorMyCourses() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    language: "",
    level: "",
    thumbnail_url: ""
  });
  const [deleteReason, setDeleteReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (course: Course) => {
    setSelectedCourse(course);
    setEditData({
      title: course.title,
      description: course.description,
      language: course.language,
      level: course.level,
      thumbnail_url: course.thumbnail_url || ""
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (course: Course) => {
    setSelectedCourse(course);
    setDeleteReason("");
    setShowDeleteModal(true);
  };

  const handleSubmitEdit = async () => {
    if (!selectedCourse) return;
    setSubmitting(true);
    try {
      // Send edit request to admin for approval
      await instructorApi.requestCourseEdit(
        selectedCourse.id, 
        {
          title: editData.title,
          description: editData.description,
          level: editData.level,
          thumbnail_url: editData.thumbnail_url || undefined
        },
        "Updating course content"
      );
      
      // Update local state to show pending
      setCourses(courses.map(c => 
        c.id === selectedCourse.id 
          ? { ...c, status: "pending_edit" as const }
          : c
      ));
      setShowEditModal(false);
      alert('Edit request submitted! Waiting for admin approval.');
    } catch (error) {
      console.error('Failed to submit edit:', error);
      alert('Failed to submit edit request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitDelete = async () => {
    if (!selectedCourse || !deleteReason.trim()) {
      alert('Please provide a reason for deletion');
      return;
    }
    setSubmitting(true);
    try {
      // Send delete request with reason to admin
      await instructorApi.requestCourseDelete(selectedCourse.id, deleteReason);
      
      // Update local state to show pending
      setCourses(courses.map(c => 
        c.id === selectedCourse.id 
          ? { ...c, status: "pending_delete" as const }
          : c
      ));
      setShowDeleteModal(false);
      alert('Delete request submitted! Admin will review your reason and approve or reject.');
    } catch (error) {
      console.error('Failed to submit delete:', error);
      alert('Failed to submit delete request');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 rounded-[4px] text-xs bg-[rgba(0,255,127,0.1)] text-[#00ff7f]">Active</span>;
      case 'pending_edit':
        return <span className="px-2 py-1 rounded-[4px] text-xs bg-[rgba(255,165,0,0.1)] text-orange-400">Pending Edit Approval</span>;
      case 'pending_delete':
        return <span className="px-2 py-1 rounded-[4px] text-xs bg-[rgba(255,0,0,0.1)] text-red-400">Pending Delete Approval</span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded-[4px] text-xs bg-[rgba(255,0,0,0.1)] text-red-500">Rejected</span>;
      default:
        return null;
    }
  };

  const canEdit = (course: Course) => {
    return course.status === 'active' || course.status === 'rejected';
  };

  const canDelete = (course: Course) => {
    return course.status === 'active' && course.enrollment_count === 0;
  };

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="text-[#bfff00]">Loading...</div>
      </div>
    );
  }

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
                  localStorage.removeItem('ff_access_token');
                  localStorage.removeItem('ff_refresh_token');
                  localStorage.removeItem('ff_user');
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
            
            <Link to="/instructor/my-courses" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center bg-[rgba(191,255,0,0.1)] border-l-2 border-[#bfff00]">
              <span className="text-[#bfff00]">📚</span>
              <span className="text-[#bfff00] text-[14px]">My Courses</span>
            </Link>
            
            <Link to="/instructor/create-course" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>➕</span>
              <span className="text-[14px]">Create Course</span>
            </Link>
            
            <Link to="/instructor/students" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>👥</span>
              <span className="text-[14px]">Students</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-[240px] flex-1 p-9">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[32px] text-white font-bold">
                <span className="text-[#bfff00]">My Courses</span>
              </h1>
              <p className="text-[#888] text-[14px] mt-1">
                Manage your courses - edits and deletions require admin approval
              </p>
            </div>
            <Link 
              to="/instructor/create-course"
              className="bg-[#bfff00] text-black px-6 py-3 rounded-[8px] font-semibold no-underline"
            >
              + Create New Course
            </Link>
          </div>

          {/* Course List */}
          {courses.length === 0 ? (
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-8 text-center">
              <div className="text-[48px] mb-4">📚</div>
              <p className="text-[#888]">No courses yet</p>
              <Link 
                to="/instructor/create-course"
                className="text-[#bfff00] hover:underline mt-2 inline-block"
              >
                Create your first course
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {courses.map((course) => (
                <div 
                  key={course.id}
                  className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] overflow-hidden hover:border-[#bfff00] transition-colors"
                >
                  {/* Course Thumbnail */}
                  <div className="h-32 bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a] flex items-center justify-center">
                    <span className="text-4xl">📚</span>
                  </div>
                  
                  {/* Course Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      {getStatusBadge(course.status)}
                      {course.is_published ? (
                        <span className="px-2 py-1 rounded-[4px] text-xs bg-[rgba(0,255,127,0.1)] text-[#00ff7f]">Published</span>
                      ) : (
                        <span className="px-2 py-1 rounded-[4px] text-xs bg-[rgba(255,255,255,0.1)] text-[#888]">Draft</span>
                      )}
                    </div>
                    
                    <h3 className="text-white font-bold text-lg mb-1">{course.title}</h3>
                    <p className="text-[#888] text-sm mb-3 line-clamp-2">{course.description}</p>
                    
                    <div className="flex items-center gap-4 text-[#555] text-sm mb-4">
                      <span>🌍 {course.language}</span>
                      <span>📊 {course.level}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center gap-4">
                        <span className="text-[#888]">👥 {course.enrollment_count} students</span>
                        {course.average_rating > 0 && (
                          <span className="text-[#bfff00]">⭐ {course.average_rating}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Status Message */}
                    {course.status === 'pending_edit' && (
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-[8px] p-3 mb-4">
                        <p className="text-orange-400 text-sm">
                          ⏳ Edit request pending admin approval
                        </p>
                      </div>
                    )}
                    
                    {course.status === 'pending_delete' && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-[8px] p-3 mb-4">
                        <p className="text-red-400 text-sm">
                          ⏳ Delete request pending admin approval
                        </p>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        to={`/instructor/curriculum/${course.id}`}
                        className="flex-1 bg-[#1f1f1f] text-white text-center py-2 rounded-[8px] text-sm hover:bg-[#2a2a2a] no-underline"
                      >
                        📖 Content
                      </Link>
                      
                      {canEdit(course) && (
                        <button
                          onClick={() => handleEditClick(course)}
                          className="flex-1 bg-[#1f1f1f] text-white py-2 rounded-[8px] text-sm hover:bg-[#2a2a2a]"
                        >
                          ✏️ Edit
                        </button>
                      )}
                      
                      {!canEdit(course) && (
                        <button
                          disabled
                          className="flex-1 bg-[#1f1f1f] text-[#555] py-2 rounded-[8px] text-sm cursor-not-allowed"
                        >
                          ✏️ Edit
                        </button>
                      )}
                      
                      {canDelete(course) && (
                        <button
                          onClick={() => handleDeleteClick(course)}
                          className="px-4 bg-red-500/10 text-red-500 py-2 rounded-[8px] text-sm hover:bg-red-500/20"
                        >
                          🗑️
                        </button>
                      )}
                      
                      {!canDelete(course) && course.enrollment_count > 0 && (
                        <span className="px-4 text-[#555] text-xs flex items-center" title="Cannot delete course with enrolled students">
                          🗑️
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]" onClick={() => setShowEditModal(false)}>
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 w-[600px]" onClick={e => e.stopPropagation()}>
            <h2 className="text-white text-[20px] font-bold mb-2">Edit Course</h2>
            <p className="text-[#888] text-sm mb-4">
              Your edit request will be sent to admin for approval.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="text-[#888] text-xs uppercase block mb-2">Course Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
                />
              </div>
              
              <div>
                <label className="text-[#888] text-xs uppercase block mb-2">Description</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  rows={3}
                  className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#888] text-xs uppercase block mb-2">Language</label>
                  <input
                    type="text"
                    value={editData.language}
                    onChange={(e) => setEditData({ ...editData, language: e.target.value })}
                    className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
                  />
                </div>
                <div>
                  <label className="text-[#888] text-xs uppercase block mb-2">Level</label>
                  <select
                    value={editData.level}
                    onChange={(e) => setEditData({ ...editData, level: e.target.value })}
                    className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
                  >
                    <option value="A1">A1 - Beginner</option>
                    <option value="A2">A2 - Elementary</option>
                    <option value="B1">B1 - Intermediate</option>
                    <option value="B2">B2 - Upper Intermediate</option>
                    <option value="C1">C1 - Advanced</option>
                    <option value="C2">C2 - Proficient</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-[#1f1f1f] text-[#888] py-3 rounded-[8px]"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmitEdit}
                  disabled={submitting}
                  className="flex-1 bg-[#bfff00] text-black py-3 rounded-[8px] font-semibold disabled:opacity-50"
                >
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
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 w-[500px]" onClick={e => e.stopPropagation()}>
            <h2 className="text-white text-[20px] font-bold mb-2">Delete Course</h2>
            <p className="text-[#888] text-sm mb-4">
              Your delete request will be sent to admin for approval. Please explain why you want to delete this course.
            </p>
            
            <div className="bg-[#1f1f1f] rounded-[8px] p-4 mb-4">
              <h3 className="text-white font-medium">{selectedCourse.title}</h3>
              <p className="text-[#555] text-sm">{selectedCourse.enrollment_count} students enrolled</p>
            </div>
            
            <div className="mb-4">
              <label className="text-[#888] text-xs uppercase block mb-2">
                Reason for deletion *
              </label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Explain why you want to delete this course..."
                rows={4}
                className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] resize-none"
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-[#1f1f1f] text-[#888] py-3 rounded-[8px]"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitDelete}
                disabled={submitting || !deleteReason.trim()}
                className="flex-1 bg-red-500 text-white py-3 rounded-[8px] font-semibold disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit for Approval'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
