import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { adminApi, authApi } from '../app/api/config';

interface Course {
  id: number;
  title: string;
  slug: string;
  instructor: { id: number; name: string };
  level: string;
  goal: string;
  price_usd: number;
  is_free: boolean;
  is_published: boolean;
  approval_status: string;
  total_enrollments: number;
  avg_rating: number;
  rating_count: number;
  created_at: string;
}

export default function AdminCourses() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('ff_user');
    if (!userData) {
      navigate('/login');
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      if (parsed.role !== 'admin') {
        navigate('/dashboard');
        return;
      }
      setUser(parsed);
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetchCourses();
  }, [page, statusFilter, levelFilter]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getCourses({
        page,
        limit: 20,
        status: statusFilter || undefined,
        level: levelFilter || undefined,
        search: search || undefined
      });
      setCourses(data.courses);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCourses();
  };

  const handleApprove = async (courseId: number) => {
    try {
      await adminApi.approveCourse(courseId);
      fetchCourses();
    } catch (error) {
      console.error('Failed to approve course:', error);
    }
  };

  const handleReject = async (courseId: number) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      try {
        await adminApi.rejectCourse(courseId, reason);
        fetchCourses();
      } catch (error) {
        console.error('Failed to reject course:', error);
      }
    }
  };

  const handlePublish = async (courseId: number) => {
    try {
      await adminApi.publishCourse(courseId);
      fetchCourses();
    } catch (error) {
      console.error('Failed to publish course:', error);
    }
  };

  const handleUnpublish = async (courseId: number) => {
    try {
      await adminApi.unpublishCourse(courseId);
      fetchCourses();
    } catch (error) {
      console.error('Failed to unpublish course:', error);
    }
  };

  const getUserInitials = () => {
  };

 ials = () => {
    if (user?.full_name) {
      const names = user.full_name.split(' ');
      if (names.length >= 2) return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      return names[0].substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'AD';
  };

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen">
      {/* Navigation */}
      <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-50">
        <div className="absolute border-b border-[var(--border-default)] inset-0 pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="flex items-center justify-between px-[40px] w-full">
            <Link to="/admin/analytics" className="flex gap-[11px] items-center no-underline">
              <div className="bg-[var(--accent-primary)] flex items-center justify-center w-[38px] h-[38px] rounded-[10px]">
                <span className="text-[18px]">🧠</span>
              </div>
              <span className="text-[18px] text-[var(--text-primary)] font-bold">
                FLUENT<span className="text-[var(--accent-primary)]">FUSION</span>
              </span>
            </Link>
            <div className="flex items-center gap-[12px]">
              <div className="bg-[rgba(255,68,68,0.1)] px-[13px] py-[5px] rounded-[99px]">
                <span className="text-[var(--color-danger)] text-[11px] font-semibold">🛡 Admin</span>
              </div>
              <div className="w-[32px] h-[32px] rounded-[16px] flex items-center justify-center"
                   style={{ background: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
                <span className="text-[13px] font-bold text-black">{getUserInitials()}</span>
              </div>
              <button
                onClick={() => {
                  authApi.logout();
                  window.location.href = '/login';
                }}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm bg-transparent border-none cursor-pointer ml-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-66px)]">
        {/* Sidebar */}
        <div className="fixed left-0 top-[66px] w-[240px] h-[calc(100vh-66px)] bg-[var(--bg-primary)] border-r border-[var(--border-default)] overflow-y-auto">
          <div className="flex flex-col py-5 px-0">
            <div className="text-[var(--text-disabled)] text-[9px] uppercase tracking-[1.35px] px-6 py-3">Admin Panel</div>

            <Link to="/admin/users" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <span>👥</span>
              <span className="text-[14px]">Users</span>
            </Link>

            <Link to="/admin/courses" className="w-full bg-[var(--accent-primary-muted)] border-l-2 border-[var(--accent-primary)] py-3 pl-6 pr-4 flex gap-3 items-center">
              <span className="text-[var(--accent-primary)]">📚</span>
              <span className="text-[var(--accent-primary)] text-[14px]">Courses</span>
            </Link>

            <Link to="/admin/enrollments" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <span>🎓</span>
              <span className="text-[14px]">Enrollments</span>
            </Link>

            <Link to="/admin/analytics" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <span>📊</span>
              <span className="text-[14px]">Analytics</span>
            </Link>

            <Link to="/admin/reports" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <span>📋</span>
              <span className="text-[14px]">Reports</span>
            </Link>

            <Link to="/admin/announcements" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <span>📢</span>
              <span className="text-[14px]">Announcements</span>
            </Link>

            <Link to="/admin/audit-log" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <span>📝</span>
              <span className="text-[14px]">Audit Log</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-[240px] flex-1 p-9">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[32px] text-[var(--text-primary)] font-bold">
                Course <span className="text-[var(--accent-primary)]">Management</span>
              </h1>
              <p className="text-[var(--text-secondary)] text-[14px] mt-1">
                Manage and approve courses on the platform
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[var(--bg-elevated)] text-[var(--text-primary)] rounded-[8px] px-4 py-3 outline-none border border-[var(--border-default)] flex-1"
              />
              <button type="submit" className="bg-[var(--accent-primary)] text-black px-6 py-3 rounded-[8px] font-semibold">
                Search
              </button>
            </form>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="bg-[var(--bg-elevated)] text-[var(--text-primary)] rounded-[8px] px-4 py-3 outline-none border border-[var(--border-default)]"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
            </select>
            <select
              value={levelFilter}
              onChange={(e) => { setLevelFilter(e.target.value); setPage(1); }}
              className="bg-[var(--bg-elevated)] text-[var(--text-primary)] rounded-[8px] px-4 py-3 outline-none border border-[var(--border-default)]"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Courses Table */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-[14px] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-default)]">
                  <th className="text-left text-[var(--text-secondary)] text-[12px] uppercase tracking-[1px] px-6 py-4">Course</th>
                  <th className="text-left text-[var(--text-secondary)] text-[12px] uppercase tracking-[1px] px-6 py-4">Instructor</th>
                  <th className="text-left text-[var(--text-secondary)] text-[12px] uppercase tracking-[1px] px-6 py-4">Level</th>
                  <th className="text-left text-[var(--text-secondary)] text-[12px] uppercase tracking-[1px] px-6 py-4">Status</th>
                  <th className="text-left text-[var(--text-secondary)] text-[12px] uppercase tracking-[1px] px-6 py-4">Enrollments</th>
                  <th className="text-left text-[var(--text-secondary)] text-[12px] uppercase tracking-[1px] px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center text-[var(--text-secondary)] py-8">Loading...</td>
                  </tr>
                ) : courses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-[var(--text-secondary)] py-8">No courses found</td>
                  </tr>
                ) : (
                  courses.map((course) => (
                    <tr key={course.id} className="border-b border-[var(--border-default)] hover:bg-[var(--bg-tertiary)]">
                      <td className="px-6 py-4">
                        <div className="text-[var(--text-primary)] font-medium">{course.title}</div>
                        <div className="text-[var(--text-tertiary)] text-[12px]">{course.goal}</div>
                      </td>
                      <td className="px-6 py-4 text-[var(--text-secondary)]">{course.instructor.name}</td>
                      <td className="px-6 py-4">
                        <span className="bg-[var(--bg-elevated)] text-[var(--text-secondary)] px-3 py-1 rounded-[99px] text-[12px]">
                          {course.level}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-[99px] text-[12px] ${
                          course.approval_status === 'approved' ? 'bg-[rgba(0,255,127,0.1)] text-[var(--color-success)]' :
                          course.approval_status === 'pending' ? 'bg-[rgba(255,184,0,0.1)] text-[var(--color-warning)]' :
                          'bg-[rgba(255,68,68,0.1)] text-[var(--color-danger)]'
                        }`}>
                          {course.approval_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[var(--text-secondary)]">{course.total_enrollments}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {course.approval_status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(course.id)}
                                className="bg-[var(--color-success)] text-black px-3 py-1 rounded text-[12px] font-medium"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(course.id)}
                                className="bg-[var(--color-danger)] text-white px-3 py-1 rounded text-[12px] font-medium"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {course.approval_status === 'approved' && !course.is_published && (
                            <button
                              onClick={() => handlePublish(course.id)}
                              className="bg-[var(--accent-primary)] text-black px-3 py-1 rounded text-[12px] font-medium"
                            >
                              Publish
                            </button>
                          )}
                          {course.is_published && (
                            <button
                              onClick={() => handleUnpublish(course.id)}
                              className="bg-[var(--color-danger)] text-white px-3 py-1 rounded text-[12px] font-medium"
                            >
                              Unpublish
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="bg-[var(--bg-elevated)] text-[var(--text-primary)] px-4 py-2 rounded-[8px] border border-[var(--border-default)] disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-[var(--text-secondary)] py-2">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="bg-[var(--bg-elevated)] text-[var(--text-primary)] px-4 py-2 rounded-[8px] border border-[var(--border-default)] disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
