import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { instructorApi } from "../app/api/config";

interface Student {
  id: number;
  email: string;
  full_name: string;
  avatar_url?: string;
  courses: {
    course_id: number;
    course_title: string;
    progress: number;
    lessons_completed: number;
    total_lessons: number;
    enrolled_at: string;
    completed: boolean;
  }[];
  last_activity?: string;
}

export default function Component25ManageStudents() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

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
      return;
    }
    fetchStudents();
    fetchCourses();
  }, [navigate]);

  // Fetch data when filters change
  useEffect(() => {
    if (user) {
      fetchStudents();
      fetchCourses();
    }
  }, [page, courseFilter, user]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await instructorApi.getAllStudents();
      let filtered = data.students || [];
      
      // Filter by search
      if (search) {
        filtered = filtered.filter((s: Student) => 
          s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
          s.email?.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Filter by course
      if (courseFilter) {
        filtered = filtered.filter((s: Student) => 
          s.courses?.some((c: any) => c.course_id === parseInt(courseFilter))
        );
      }
      
      setStudents(filtered);
      setTotal(filtered.length);
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

  const getStatus = (student: Student) => {
    const hasCompleted = student.courses?.some((c: any) => c.completed);
    const inProgress = student.courses?.some((c: any) => c.progress > 0 && c.progress < 100);
    const atRisk = student.courses?.some((c: any) => c.progress > 0 && c.progress < 30);
    
    if (hasCompleted) return { label: 'Completed', class: 'bg-[rgba(0,255,127,0.1)] text-[#00ff7f]' };
    if (atRisk) return { label: 'At Risk', class: 'bg-[rgba(255,184,0,0.1)] text-[#ffb800]' };
    if (inProgress) return { label: 'Active', class: 'bg-[rgba(0,255,127,0.1)] text-[#00ff7f]' };
    return { label: 'New', class: 'bg-[rgba(255,255,255,0.06)] text-[#888]' };
  };

  const getOverallProgress = (student: Student) => {
    if (!student.courses || student.courses.length === 0) return 0;
    const total = student.courses.reduce((sum: number, c: any) => sum + (c.progress || 0), 0);
    return Math.round(total / student.courses.length);
  };

  const getLastActive = (student: Student) => {
    // Use the most recent course enrollment
    if (!student.courses || student.courses.length === 0) return 'Never';
    const dates = student.courses
      .filter((c: any) => c.enrolled_at)
      .map((c: any) => new Date(c.enrolled_at));
    if (dates.length === 0) return 'Never';
    const latest = new Date(Math.max(...dates.map(d => d.getTime())));
    const now = new Date();
    const diff = now.getTime() - latest.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;
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

  const paginatedStudents = students.slice((page - 1) * 20, page * 20);

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Navigation */}
      <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-50">
        <div className="absolute border-b border-[#2a2a2a] inset-0 pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="flex items-center justify-between px-[40px] w-full">
            <Link to="/instructor/students" className="flex gap-[11px] items-center no-underline">
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
              <div className="w-[32px] h-[32px] rounded-[16px] flex items-center justify-center"
                   style={{ background: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
                <span className="text-[13px] font-bold text-black">
                  {user?.full_name ? getInitials(user.full_name) : 'U'}
                </span>
              </div>
              <button 
                onClick={() => {
                  localStorage.removeItem('access_token');
                  localStorage.removeItem('refresh_token');
                  localStorage.removeItem('user');
                  navigate('/login');
                }}
                className="text-[#888] hover:text-white text-sm bg-transparent border-none cursor-pointer ml-2"
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
            
            <Link to="/instructor/students" className="w-full bg-[rgba(191,255,0,0.1)] border-l-2 border-[#bfff00] py-3 pl-6 pr-4 flex gap-3 items-center">
              <span className="text-[#bfff00]">👥</span>
              <span className="text-[#bfff00] text-[14px]">Students</span>
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
                Manage <span className="text-[#bfff00]">Students</span>
              </h1>
              <p className="text-[#888] text-[14px] mt-1">
                {total.toLocaleString()} total students across all courses
              </p>
            </div>
            <button className="bg-[#1f1f1f] text-white px-4 py-2 rounded-[8px] border border-[#333]">
              Export CSV
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] flex-1"
              />
              <button type="submit" className="bg-[#bfff00] text-black px-6 py-3 rounded-[8px] font-semibold">
                Search
              </button>
            </form>
            <select 
              value={courseFilter}
              onChange={(e) => { setCourseFilter(e.target.value); setPage(1); }}
              className="bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] min-w-[180px]"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </div>

          {/* Students Table */}
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  <th className="text-left text-[#888] text-[10px] uppercase tracking-[1px] px-6 py-4">Student</th>
                  <th className="text-left text-[#888] text-[10px] uppercase tracking-[1px] px-6 py-4">Course</th>
                  <th className="text-left text-[#888] text-[10px] uppercase tracking-[1px] px-6 py-4">Progress</th>
                  <th className="text-left text-[#888] text-[10px] uppercase tracking-[1px] px-6 py-4">Last Active</th>
                  <th className="text-left text-[#888] text-[10px] uppercase tracking-[1px] px-6 py-4">Status</th>
                  <th className="text-left text-[#888] text-[10px] uppercase tracking-[1px] px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center text-[#888] py-8">Loading...</td>
                  </tr>
                ) : paginatedStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-[#888] py-8">No students found</td>
                  </tr>
                ) : (
                  paginatedStudents.map((student) => {
                    const status = getStatus(student);
                    const progress = getOverallProgress(student);
                    const mainCourse = student.courses?.[0];
                    return (
                      <tr key={student.id} className="border-b border-[#2a2a2a] hover:bg-[#1a1a1a]">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-[32px] h-[32px] rounded-[16px] flex items-center justify-center"
                                 style={{ background: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
                              <span className="text-[13px] font-bold text-black">{getInitials(student.full_name)}</span>
                            </div>
                            <div>
                              <div className="text-white font-medium">{student.full_name}</div>
                              <div className="text-[#555] text-[12px]">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#888]">
                          {mainCourse?.course_title || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-[80px] h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#8fef00] to-[#bfff00]"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-[#bfff00] text-[12px]">{progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#888]">{getLastActive(student)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-[99px] text-[12px] ${status.class}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => setSelectedStudent(student)}
                            className="px-4 py-1.5 rounded-[8px] text-[#888] hover:text-white bg-transparent border border-[#2a2a2a] text-[12px]"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > 20 && (
            <div className="flex justify-center gap-2 mt-6">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="bg-[#1f1f1f] text-white px-4 py-2 rounded-[8px] border border-[#2a2a2a] disabled:opacity-50"
              >
                ← Prev
              </button>
              <span className="text-[#888] py-2">Page {page} of {Math.ceil(total / 20)}</span>
              <button 
                onClick={() => setPage(p => Math.min(Math.ceil(total / 20), p + 1))}
                disabled={page >= Math.ceil(total / 20)}
                className="bg-[#1f1f1f] text-white px-4 py-2 rounded-[8px] border border-[#2a2a2a] disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]" onClick={() => setSelectedStudent(null)}>
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 w-[600px] max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-[48px] h-[48px] rounded-[16px] flex items-center justify-center"
                   style={{ background: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
                <span className="text-[20px] font-bold text-black">{getInitials(selectedStudent.full_name)}</span>
              </div>
              <div>
                <h2 className="text-white text-[20px] font-bold">{selectedStudent.full_name}</h2>
                <p className="text-[#888] text-[14px]">{selectedStudent.email}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="ml-auto text-[#888] hover:text-white text-[24px]">×</button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-[#888] text-[12px] uppercase mb-2">Enrolled Courses</h3>
                {selectedStudent.courses?.map((course: any, index: number) => (
                  <div key={index} className="bg-[#0f0f0f] p-4 rounded-[8px] mb-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">{course.course_title}</span>
                      <span className={`px-2 py-0.5 rounded-[99px] text-[11px] ${
                        course.completed ? 'bg-[rgba(0,255,127,0.1)] text-[#00ff7f]' : 'bg-[rgba(255,255,255,0.06)] text-[#888]'
                      }`}>
                        {course.completed ? 'Completed' : `${course.progress}%`}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#8fef00] to-[#bfff00]"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="text-[#555] text-[12px] mt-1">
                      {course.lessons_completed}/{course.total_lessons} lessons completed
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
