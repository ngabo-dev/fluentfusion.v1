import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { instructorApi } from "../app/api/config";
import InstructorLayout from "../app/components/InstructorLayout";

interface CourseProgress {
  course_id: number;
  course_title: string;
  progress: number;
  lessons_completed: number;
  total_lessons: number;
  enrolled_at: string;
  completed: boolean;
}

interface Student {
  id: number;
  email: string;
  full_name: string;
  avatar_url?: string;
  courses: CourseProgress[];
  last_activity?: string;
}

export default function Component25ManageStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const PAGE_SIZE = 20;

  useEffect(() => {
    const token = localStorage.getItem('ff_access_token');
    const userData = localStorage.getItem('ff_user');
    if (!token || !userData) { navigate('/login'); return; }
    try {
      const parsed = JSON.parse(userData);
      if (!['instructor', 'admin', 'super_admin'].includes(parsed.role)) { navigate('/dashboard'); return; }
    } catch { navigate('/login'); return; }
    fetchStudents();
    fetchCourses();
  }, [navigate]);

  useEffect(() => {
    fetchStudents();
  }, [page, courseFilter]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await instructorApi.getAllStudents();
      let filtered: Student[] = data.students || [];

      if (search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter(s => s.full_name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q));
      }

      if (courseFilter) {
        filtered = filtered.filter(s => s.courses?.some(c => c.course_id === parseInt(courseFilter)));
      }

      setTotal(filtered.length);
      setStudents(filtered);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await instructorApi.getMyCourses();
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStudentStatus = (student: Student) => {
    if (!student.courses?.length) return { label: 'New', cls: 'bg-white/5 text-[#888]' };
    if (student.courses.some(c => c.completed)) return { label: 'Completed', cls: 'bg-[rgba(0,255,127,0.1)] text-[#00ff7f]' };
    if (student.courses.some(c => c.progress > 0 && c.progress < 30)) return { label: 'At Risk', cls: 'bg-[rgba(255,184,0,0.1)] text-yellow-400' };
    if (student.courses.some(c => c.progress > 0)) return { label: 'Active', cls: 'bg-[rgba(191,255,0,0.1)] text-[#bfff00]' };
    return { label: 'Enrolled', cls: 'bg-white/5 text-[#888]' };
  };

  const getOverallProgress = (student: Student) => {
    if (!student.courses?.length) return 0;
    return Math.round(student.courses.reduce((s, c) => s + (c.progress || 0), 0) / student.courses.length);
  };

  const getLastActive = (student: Student) => {
    if (!student.courses?.length) return 'Never';
    const dates = student.courses.filter(c => c.enrolled_at).map(c => new Date(c.enrolled_at));
    if (!dates.length) return 'Never';
    const latest = new Date(Math.max(...dates.map(d => d.getTime())));
    const diff = Date.now() - latest.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return latest.toLocaleDateString();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  const paginatedStudents = students.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <InstructorLayout title="Students" subtitle={`${total.toLocaleString()} student${total !== 1 ? 's' : ''} enrolled across all your courses`}>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#151515] border border-[#2a2a2a] text-white rounded-lg px-4 py-2 text-[13px] outline-none focus:border-[#bfff00] transition-colors flex-1"
          />
          <button type="submit" className="bg-[var(--accent-primary)] text-black px-5 py-2 rounded-lg font-semibold text-[13px] hover:opacity-90 transition-opacity">
            Search
          </button>
        </form>
        <select
          value={courseFilter}
          onChange={(e) => { setCourseFilter(e.target.value); setPage(1); }}
          className="bg-[#151515] border border-[#2a2a2a] text-[#888] rounded-lg px-3 py-2 text-[13px] outline-none"
        >
          <option value="">All Courses</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      {/* Students Table */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              {['Student', 'Enrolled In', 'Progress', 'Last Active', 'Status', ''].map(h => (
                <th key={h} className="text-left text-[#555] text-[11px] uppercase tracking-widest px-5 py-3 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center text-[#888] py-10">Loading students...</td></tr>
            ) : paginatedStudents.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="text-center py-12">
                    <div className="text-[40px] mb-3">👥</div>
                    <p className="text-[#888] text-[14px]">{search || courseFilter ? 'No students match your filters.' : 'No students enrolled yet.'}</p>
                  </div>
                </td>
              </tr>
            ) : paginatedStudents.map((student) => {
              const status = getStudentStatus(student);
              const progress = getOverallProgress(student);
              const mainCourse = student.courses?.[0];
              return (
                <tr key={student.id} className="border-b border-[#1a1a1a] last:border-0 hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[12px] font-bold text-black flex-shrink-0"
                           style={{ background: 'linear-gradient(135deg, #bfff00 0%, #8fef00 100%)' }}>
                        {getInitials(student.full_name)}
                      </div>
                      <div>
                        <p className="text-white text-[13px] font-semibold">{student.full_name}</p>
                        <p className="text-[#555] text-[11px]">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-[#888] text-[13px] truncate max-w-[160px]">{mainCourse?.course_title || '—'}</p>
                    {student.courses?.length > 1 && (
                      <p className="text-[#555] text-[11px]">+{student.courses.length - 1} more</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-[70px] h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #8fef00, #bfff00)' }} />
                      </div>
                      <span className="text-[#bfff00] text-[12px] font-semibold">{progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#888] text-[13px]">{getLastActive(student)}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] ${status.cls}`}>{status.label}</span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => setSelectedStudent(student)} className="text-[#bfff00] text-[12px] hover:underline">
                      View →
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="bg-[#151515] text-white px-4 py-2 rounded-lg border border-[#2a2a2a] disabled:opacity-40 text-[13px] hover:border-[#bfff00] transition-colors">← Prev</button>
          <span className="text-[#888] text-[13px]">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="bg-[#151515] text-white px-4 py-2 rounded-lg border border-[#2a2a2a] disabled:opacity-40 text-[13px] hover:border-[#bfff00] transition-colors">Next →</button>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]" onClick={() => setSelectedStudent(null)}>
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6 w-full max-w-[560px] mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center text-[18px] font-bold text-black flex-shrink-0"
                   style={{ background: 'linear-gradient(135deg, #bfff00, #8fef00)' }}>
                {getInitials(selectedStudent.full_name)}
              </div>
              <div className="flex-1">
                <h2 className="text-white text-[18px] font-bold">{selectedStudent.full_name}</h2>
                <p className="text-[#888] text-[13px]">{selectedStudent.email}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-[#555] hover:text-white text-[24px] leading-none">×</button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Courses', value: selectedStudent.courses?.length || 0 },
                { label: 'Avg Progress', value: `${getOverallProgress(selectedStudent)}%` },
                { label: 'Completed', value: selectedStudent.courses?.filter(c => c.completed).length || 0 },
              ].map(s => (
                <div key={s.label} className="bg-[var(--bg-primary)] rounded-lg p-3 text-center">
                  <div className="text-[#bfff00] font-bold text-[18px]">{s.value}</div>
                  <div className="text-[#555] text-[11px]">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Course Progress */}
            <h3 className="text-[#888] text-[11px] uppercase tracking-widest mb-3">Course Progress</h3>
            <div className="space-y-3">
              {selectedStudent.courses?.length === 0 ? (
                <p className="text-[#555] text-[13px]">Not enrolled in any courses.</p>
              ) : selectedStudent.courses?.map((c, i) => (
                <div key={i} className="bg-[#0f0f0f] p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-[13px] font-medium">{c.course_title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${c.completed ? 'bg-[rgba(0,255,127,0.1)] text-[#00ff7f]' : 'bg-white/5 text-[#888]'}`}>
                      {c.completed ? 'Completed' : `${c.progress || 0}%`}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden mb-2">
                    <div className="h-full rounded-full" style={{ width: `${c.progress || 0}%`, background: 'linear-gradient(90deg, #8fef00, #bfff00)' }} />
                  </div>
                  <p className="text-[#555] text-[11px]">{c.lessons_completed || 0}/{c.total_lessons || 0} lessons · Enrolled {c.enrolled_at ? new Date(c.enrolled_at).toLocaleDateString() : 'N/A'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </InstructorLayout>
  );
}
