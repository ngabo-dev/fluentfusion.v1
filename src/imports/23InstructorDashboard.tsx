import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { instructorApi } from "../app/api/config";

export default function Component23InstructorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalEarnings: 0,
    activeCourses: 0,
    avgRating: 0
  });
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Auth check - redirect to login if no token
    const token = localStorage.getItem('ff_access_token');
    const userData = localStorage.getItem('ff_user');
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      // Check if user is instructor, admin, or super_admin
      if (parsed.role && !['instructor', 'admin', 'super_admin'].includes(parsed.role)) {
        navigate('/dashboard');
        return;
      }
      setUser(parsed);
    } catch (e) {
      navigate('/login');
      return;
    }
    setIsLoading(false);

    // Fetch instructor data
    const fetchInstructorData = async () => {
      const token = localStorage.getItem('ff_access_token');
      if (!token) return;

      try {
        // Fetch dashboard data
        const dashboardData = await instructorApi.getDashboard();
        
        if (dashboardData) {
          
          // Set courses from dashboard
          setCourses(dashboardData.courses || []);
          
          // Calculate total earnings from courses
          const totalEarnings = (dashboardData.courses || []).reduce((acc: number, c: any) => {
            return acc + (c.price || 0) * (c.total_enrollments || 0);
          }, 0);
          
          setStats({
            totalStudents: dashboardData.total_students || 0,
            totalEarnings,
            activeCourses: dashboardData.total_courses || 0,
            avgRating: 4.8
          });
        }
        
        // Also fetch courses directly for comparison
        const coursesData = await instructorApi.getMyCourses();
        if (coursesData) {
          // Use courses from this endpoint if dashboard doesn't have them
          if (coursesData.courses && coursesData.courses.length > 0 && courses.length === 0) {
            setCourses(coursesData.courses || []);
          }
        }
      } catch (error) {
        console.error('Failed to fetch instructor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('ff_access_token');
    localStorage.removeItem('ff_refresh_token');
    localStorage.removeItem('ff_user');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="text-[#bfff00] text-xl">Loading...</div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen flex flex-col">
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
              <div className="w-[32px] h-[32px] rounded-[16px] flex items-center justify-center"
                   style={{ background: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}>
                <span className="text-[13px] font-bold text-black">
                  {user?.full_name ? getInitials(user.full_name) : 'U'}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-[#888] hover:text-white text-sm bg-transparent border-none cursor-pointer ml-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-row min-h-[calc(100vh-66px)]">
        {/* Sidebar */}
        <div className="fixed left-0 top-[66px] w-[240px] h-[calc(100vh-66px)] bg-[#0f0f0f] border-r border-[#2a2a2a] overflow-y-auto">
          <div className="flex flex-col py-5 px-0">
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3">Instructor</div>
            
            <Link 
              to="/instructor/dashboard"
              className="w-full bg-[rgba(191,255,0,0.1)] border-l-2 border-[#bfff00] py-3 pl-6 pr-4 flex gap-3 items-center"
            >
              <span className="text-[#bfff00]">📊</span>
              <span className="text-[#bfff00] text-[14px]">Overview</span>
            </Link>
            
            <Link 
              to="/instructor/create-course"
              className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"
            >
              <span>📚</span>
              <span className="text-[14px]">Create Course</span>
            </Link>
            
            <Link 
              to="/instructor/students"
              className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"
            >
              <span>👥</span>
              <span className="text-[14px]">Students</span>
            </Link>
            
            <Link 
              to="/live-sessions"
              className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"
            >
              <span>🎥</span>
              <span className="text-[14px]">Live Sessions</span>
            </Link>
            
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4">Account</div>
            
            <Link 
              to="/profile"
              className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"
            >
              <span>👤</span>
              <span className="text-[14px]">Profile</span>
            </Link>
            
            <Link 
              to="/settings"
              className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white"
            >
              <span>⚙️</span>
              <span className="text-[14px]">Settings</span>
            </Link>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="ml-[240px] flex-1 p-9">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[32px] text-white font-bold">
                Instructor <span className="text-[#bfff00]">Overview</span>
              </h1>
              <p className="text-[#888] text-[14px] mt-1">
                Welcome back, {user?.full_name || 'Instructor'}
              </p>
            </div>
            <Link 
              to="/instructor/create-course"
              className="bg-[#bfff00] text-[#0a0a0a] px-[24px] py-[11px] rounded-[8px] font-semibold hover:opacity-90 transition-opacity no-underline"
            >
              + Create New Course
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-[18px] mb-8">
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-5">
              <div className="text-[#888] text-[10px] uppercase tracking-[1px]">Total Students</div>
              <div className="text-[#bfff00] text-[34px] font-bold mt-2">
                {loading ? '...' : stats.totalStudents.toLocaleString()}
              </div>
              <div className="text-[#888] text-[11px] mt-1">across all courses</div>
            </div>
            
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-5">
              <div className="text-[#888] text-[10px] uppercase tracking-[1px]">Total Earnings</div>
              <div className="text-[#bfff00] text-[26px] font-bold mt-2">
                ${loading ? '...' : stats.totalEarnings.toLocaleString()}
              </div>
              <div className="text-[#888] text-[11px] mt-1">lifetime revenue</div>
            </div>
            
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-5">
              <div className="text-[#888] text-[10px] uppercase tracking-[1px]">Active Courses</div>
              <div className="text-[#bfff00] text-[34px] font-bold mt-2">
                {loading ? '...' : stats.activeCourses}
              </div>
              <div className="text-[#888] text-[11px] mt-1">published courses</div>
            </div>
            
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-5">
              <div className="text-[#888] text-[10px] uppercase tracking-[1px]">Avg. Rating</div>
              <div className="text-[#bfff00] text-[34px] font-bold mt-2">
                {stats.avgRating} ⭐
              </div>
              <div className="text-[#888] text-[11px] mt-1">student reviews</div>
            </div>
          </div>

          {/* Courses Performance */}
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 mb-6">
            <h2 className="text-white text-[14px] font-bold uppercase tracking-[0.7px] mb-4">My Courses</h2>
            
            {loading ? (
              <p className="text-[#888]">Loading courses...</p>
            ) : courses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#888] mb-4">You haven't created any courses yet.</p>
                <Link 
                  to="/instructor/create-course"
                  className="bg-[#bfff00] text-[#0a0a0a] px-6 py-3 rounded-[8px] font-semibold inline-block no-underline"
                >
                  Create Your First Course
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-[8px] border border-[#2a2a2a]">
                    <div>
                      <h3 className="text-white font-semibold">{course.title}</h3>
                      <p className="text-[#888] text-[12px]">
                        {course.total_enrollments || 0} students · {course.avg_rating ? `${course.avg_rating} ⭐` : 'No ratings yet'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#bfff00] font-bold">${(course.price || 0) * (course.total_enrollments || 0)}</p>
                      <p className="text-[#888] text-[11px]">total earned</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-6">
            <Link 
              to="/instructor/create-course"
              className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 hover:border-[#bfff00] transition-colors no-underline block"
            >
              <span className="text-[32px]">📚</span>
              <h3 className="text-white font-semibold mt-3">Create New Course</h3>
              <p className="text-[#888] text-[13px] mt-1">Share your knowledge and earn money</p>
            </Link>
            
            <Link 
              to="/live-sessions"
              className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 hover:border-[#bfff00] transition-colors no-underline block"
            >
              <span className="text-[32px]">🎥</span>
              <h3 className="text-white font-semibold mt-3">Host Live Session</h3>
              <p className="text-[#888] text-[13px] mt-1">Connect with students in real-time</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
