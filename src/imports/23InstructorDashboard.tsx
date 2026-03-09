import { useState, useEffect } from "react";
import { Link } from "react-router";
import { instructorApi } from "../app/api/config";
import InstructorLayout from "../app/components/InstructorLayout";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";

interface DashboardStats {
  totalStudents: number;
  totalEarnings: number;
  activeCourses: number;
  totalCourses: number;
  avgRating: number;
  totalEnrollments: number;
  pendingCourses: number;
}

interface CourseItem {
  id: number;
  title: string;
  language?: string;
  level?: string;
  is_published: boolean;
  approval_status?: string;
  total_enrollments?: number;
  enrollment_count?: number;
  avg_rating?: number;
  average_rating?: number;
  price?: number;
  price_usd?: number;
  thumbnail_url?: string | null;
  created_at?: string;
}

interface EnrollmentItem {
  student_name?: string;
  course_title?: string;
  enrolled_at?: string;
  progress?: number;
}

const generateEnrollmentData = (total: number) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month, i) => ({
    month,
    enrollments: Math.max(0, Math.floor((total / 6) * (0.4 + i * 0.15)))
  }));
};

export default function Component23InstructorDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalEarnings: 0,
    activeCourses: 0,
    totalCourses: 0,
    avgRating: 0,
    totalEnrollments: 0,
    pendingCourses: 0,
  });
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [recentEnrollments, setRecentEnrollments] = useState<EnrollmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [enrollmentChartData, setEnrollmentChartData] = useState<{ month: string; enrollments: number }[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [dashboardResult, coursesResult] = await Promise.allSettled([
        instructorApi.getDashboard(),
        instructorApi.getMyCourses(),
      ]);

      let allCourses: CourseItem[] = [];
      let totalStudents = 0;
      let totalEnrollments = 0;
      let recentEnr: EnrollmentItem[] = [];

      if (dashboardResult.status === 'fulfilled' && dashboardResult.value) {
        const d = dashboardResult.value;
        totalStudents = d.total_students || 0;
        totalEnrollments = d.total_enrollments || 0;
        recentEnr = d.recent_enrollments || [];
        allCourses = d.courses || [];
      }

      if (coursesResult.status === 'fulfilled' && coursesResult.value) {
        const c = coursesResult.value;
        const list: CourseItem[] = Array.isArray(c.courses) ? c.courses : (Array.isArray(c) ? c : []);
        if (list.length > allCourses.length) allCourses = list;
      }

      const active = allCourses.filter((c) => c.is_published).length;
      const pending = allCourses.filter((c) => c.approval_status === 'pending').length;
      const totalEarnings = allCourses.reduce((acc, c) => {
        const price = c.price_usd ?? c.price ?? 0;
        const enrolls = c.total_enrollments ?? c.enrollment_count ?? 0;
        return acc + price * enrolls;
      }, 0);
      const ratedCourses = allCourses.filter((c) => (c.avg_rating ?? c.average_rating ?? 0) > 0);
      const avgRating = ratedCourses.length > 0
        ? ratedCourses.reduce((s, c) => s + (c.avg_rating ?? c.average_rating ?? 0), 0) / ratedCourses.length
        : 0;

      setCourses(allCourses);
      setRecentEnrollments(recentEnr);
      setEnrollmentChartData(generateEnrollmentData(totalEnrollments || totalStudents));
      setStats({ totalStudents, totalEarnings, activeCourses: active, totalCourses: allCourses.length, avgRating, totalEnrollments, pendingCourses: pending });
    } catch (error) {
      console.error('Failed to fetch instructor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner': case 'a1': case 'a2': return 'bg-[rgba(0,255,127,0.1)] text-[#00ff7f]';
      case 'intermediate': case 'b1': case 'b2': return 'bg-[rgba(255,191,0,0.1)] text-yellow-400';
      case 'advanced': case 'c1': case 'c2': return 'bg-[rgba(255,100,100,0.1)] text-red-400';
      default: return 'bg-[rgba(191,255,0,0.1)] text-[#bfff00]';
    }
  };

  const getStatusBadge = (course: CourseItem) => {
    if (course.approval_status === 'pending')
      return <span className="px-2 py-0.5 rounded text-[10px] bg-[rgba(255,165,0,0.15)] text-orange-400">Pending</span>;
    if (course.approval_status === 'rejected')
      return <span className="px-2 py-0.5 rounded text-[10px] bg-[rgba(255,50,50,0.15)] text-red-400">Rejected</span>;
    if (course.is_published)
      return <span className="px-2 py-0.5 rounded text-[10px] bg-[rgba(191,255,0,0.15)] text-[#bfff00]">Published</span>;
    return <span className="px-2 py-0.5 rounded text-[10px] bg-[rgba(150,150,150,0.15)] text-[#888]">Draft</span>;
  };

  const statCards = [
    { label: 'Total Students', value: loading ? '...' : stats.totalStudents.toLocaleString(), icon: '👥', sub: 'enrolled across all courses', color: '#bfff00' },
    { label: 'Total Earnings', value: loading ? '...' : `$${stats.totalEarnings.toLocaleString()}`, icon: '💰', sub: 'lifetime revenue', color: '#00ff7f' },
    { label: 'Active Courses', value: loading ? '...' : `${stats.activeCourses} / ${stats.totalCourses}`, icon: '📚', sub: 'published / total', color: '#bfff00' },
    { label: 'Avg. Rating', value: loading ? '...' : (stats.avgRating > 0 ? stats.avgRating.toFixed(1) : 'N/A'), icon: '⭐', sub: 'from student reviews', color: '#ffd700' },
  ];

  const headerAction = (
    <Link to="/instructor/create-course" className="bg-[#bfff00] text-[#0a0a0a] px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity no-underline text-[14px]">
      + New Course
    </Link>
  );

  return (
    <InstructorLayout title="Instructor Overview" subtitle="Here's a snapshot of your teaching activity" headerAction={headerAction}>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-5 hover:border-[#3a3a3a] transition-colors">
            <div className="flex items-start justify-between mb-3">
              <span className="text-[#888] text-[11px] uppercase tracking-widest">{card.label}</span>
              <span className="text-[20px]">{card.icon}</span>
            </div>
            <div className="text-[28px] font-bold mb-1" style={{ color: card.color }}>{card.value}</div>
            <div className="text-[#555] text-[11px]">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-[#151515] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-[14px] font-semibold">Enrollment Trend</h2>
            <span className="text-[#555] text-[10px]">Estimated distribution</span>
          </div>
          {loading ? (
            <div className="h-[180px] flex items-center justify-center text-[#555]">Loading chart...</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={enrollmentChartData}>
                <defs>
                  <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#bfff00" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#bfff00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="month" stroke="#555" tick={{ fill: '#888', fontSize: 11 }} />
                <YAxis stroke="#555" tick={{ fill: '#888', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8 }} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#bfff00' }} />
                <Area type="monotone" dataKey="enrollments" stroke="#bfff00" fill="url(#enrollGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-white text-[14px] font-semibold mb-4">Students per Course</h2>
          {loading ? (
            <div className="h-[180px] flex items-center justify-center text-[#555]">Loading...</div>
          ) : courses.length === 0 ? (
            <div className="h-[180px] flex items-center justify-center text-[#555] text-[13px]">No courses yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={courses.slice(0, 5).map(c => ({ name: (c.title || '').slice(0, 8) + (c.title?.length > 8 ? '…' : ''), students: c.total_enrollments ?? c.enrollment_count ?? 0 }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="name" stroke="#555" tick={{ fill: '#888', fontSize: 10 }} />
                <YAxis stroke="#555" tick={{ fill: '#888', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8 }} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#bfff00' }} />
                <Bar dataKey="students" fill="#bfff00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* My Courses */}
      <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">My Courses</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[#1a1a1a] rounded-lg p-1 border border-[#2a2a2a]">
              <button onClick={() => setViewMode('grid')} className={`px-3 py-1 rounded text-[12px] transition-colors ${viewMode === 'grid' ? 'bg-[#bfff00] text-black font-semibold' : 'text-[#888] hover:text-white'}`}>
                ▦ Grid
              </button>
              <button onClick={() => setViewMode('list')} className={`px-3 py-1 rounded text-[12px] transition-colors ${viewMode === 'list' ? 'bg-[#bfff00] text-black font-semibold' : 'text-[#888] hover:text-white'}`}>
                ☰ List
              </button>
            </div>
            <Link to="/instructor/my-courses" className="text-[#bfff00] text-[12px] hover:underline no-underline">View All →</Link>
          </div>
        </div>

        {loading ? (
          <div className="text-[#888] py-6 text-center">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-[48px] mb-3">📚</div>
            <p className="text-[#888] mb-4">You haven't created any courses yet.</p>
            <Link to="/instructor/create-course" className="bg-[#bfff00] text-black px-6 py-2.5 rounded-lg font-semibold inline-block no-underline text-[14px]">
              Create Your First Course
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.slice(0, 6).map((course) => (
              <div key={course.id} className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#3a3a3a] transition-colors">
                <div className="h-[130px] bg-[#1a1a1a] relative overflow-hidden">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[40px]">📖</div>
                  )}
                  <div className="absolute top-2 right-2">{getStatusBadge(course)}</div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-[13px] mb-1 truncate">{course.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${getLevelColor(course.level)}`}>{course.level?.toUpperCase() || 'N/A'}</span>
                    {course.language && <span className="text-[#888] text-[11px]">{course.language}</span>}
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#888]">{(course.total_enrollments ?? course.enrollment_count ?? 0)} students</span>
                    <span className="text-[#bfff00] font-bold">{(course.avg_rating ?? course.average_rating ?? 0) > 0 ? `${(course.avg_rating ?? course.average_rating)?.toFixed(1)} ⭐` : 'No ratings'}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Link to={`/instructor/curriculum/${course.id}`} className="flex-1 text-center py-1.5 rounded bg-[#1a1a1a] text-[#bfff00] text-[11px] no-underline hover:bg-[#2a2a2a] transition-colors">Edit</Link>
                    <Link to={`/course/${course.id}`} className="flex-1 text-center py-1.5 rounded bg-[#1a1a1a] text-[#888] text-[11px] no-underline hover:text-white hover:bg-[#2a2a2a] transition-colors">Preview</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {courses.slice(0, 6).map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-xl border border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-[44px] h-[44px] rounded-lg bg-[#1a1a1a] overflow-hidden flex-shrink-0">
                    {course.thumbnail_url ? (
                      <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[20px]">📖</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-semibold text-[14px] truncate">{course.title}</h3>
                      {getStatusBadge(course)}
                    </div>
                    <p className="text-[#888] text-[12px] mt-0.5">{course.language || 'Language'} · {course.level?.toUpperCase() || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 ml-4">
                  <div className="text-center hidden md:block">
                    <div className="text-[#bfff00] font-bold text-[15px]">{(course.total_enrollments ?? course.enrollment_count ?? 0)}</div>
                    <div className="text-[#555] text-[10px]">Students</div>
                  </div>
                  <div className="text-center hidden md:block">
                    <div className="text-white font-semibold text-[14px]">{(course.avg_rating ?? course.average_rating ?? 0) > 0 ? `${(course.avg_rating ?? course.average_rating)?.toFixed(1)} ⭐` : '—'}</div>
                    <div className="text-[#555] text-[10px]">Rating</div>
                  </div>
                  <div className="text-center hidden lg:block">
                    <div className="text-[#bfff00] font-bold text-[14px]">${((course.price_usd ?? course.price ?? 0) * (course.total_enrollments ?? course.enrollment_count ?? 0)).toLocaleString()}</div>
                    <div className="text-[#555] text-[10px]">Earned</div>
                  </div>
                  <Link to={`/instructor/curriculum/${course.id}`} className="text-[#bfff00] text-[12px] no-underline hover:underline whitespace-nowrap">Manage →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Recent Enrollments</h2>
          {loading ? (
            <div className="text-[#888] text-[13px]">Loading...</div>
          ) : recentEnrollments.length === 0 ? (
            <div className="text-[#555] text-[13px] py-4 text-center">No recent enrollments yet</div>
          ) : (
            <div className="space-y-3">
              {recentEnrollments.slice(0, 5).map((enr, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#1a1a1a] last:border-0">
                  <div>
                    <p className="text-white text-[13px]">{enr.student_name || 'Unknown Student'}</p>
                    <p className="text-[#888] text-[11px]">{enr.course_title || 'Course'}</p>
                  </div>
                  <span className="text-[#555] text-[11px]">{enr.enrolled_at ? new Date(enr.enrolled_at).toLocaleDateString() : 'Recently'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { to: '/instructor/create-course', icon: '📚', label: 'Create Course', sub: 'Share your knowledge' },
              { to: '/instructor/students', icon: '👥', label: 'View Students', sub: 'Track progress' },
              { to: '/instructor/announcements', icon: '📣', label: 'Announcements', sub: 'Notify students' },
              { to: '/live-sessions', icon: '🎥', label: 'Live Session', sub: 'Connect in real-time' },
            ].map(action => (
              <Link key={action.to} to={action.to} className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#bfff00] transition-colors no-underline block">
                <span className="text-[24px]">{action.icon}</span>
                <p className="text-white text-[13px] font-semibold mt-2">{action.label}</p>
                <p className="text-[#555] text-[11px]">{action.sub}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {stats.pendingCourses > 0 && (
        <div className="mt-6 bg-[rgba(255,165,0,0.08)] border border-[rgba(255,165,0,0.3)] rounded-xl p-4 flex items-center gap-3">
          <span className="text-[20px]">⏳</span>
          <div>
            <p className="text-orange-300 text-[13px] font-semibold">{stats.pendingCourses} course{stats.pendingCourses > 1 ? 's' : ''} pending admin approval</p>
            <p className="text-[#888] text-[11px]">Your submission{stats.pendingCourses > 1 ? 's are' : ' is'} under review. You'll be notified once approved.</p>
          </div>
          <Link to="/instructor/my-courses" className="ml-auto text-orange-300 text-[12px] no-underline hover:underline whitespace-nowrap">View →</Link>
        </div>
      )}
    </InstructorLayout>
  );
}
