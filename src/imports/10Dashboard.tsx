import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { API_BASE_URL, usersApi, liveSessionsApi, gamificationApi } from "../app/api/config";

interface User {
  id: number;
  email: string;
  full_name: string;
  native_language?: string;
  learning_language?: string;
  level?: string;
  xp_points?: number;
  streak_days?: number;
}

interface Course {
  id: number;
  title: string;
  language: string;
  flag: string;
  progress: number;
  units_completed: number;
  total_units: number;
  last_lesson_id?: number;
}

interface LiveSession {
  id: number;
  title: string;
  instructor: string;
  enrolled_count: number;
  scheduled_time: string;
  is_live: boolean;
}

interface DashboardStats {
  xp_points: number;
  xp_today: number;
  current_streak: number;
  best_streak: number;
  lessons_completed: number;
  lessons_this_month: number;
  fluency_score: number;
  time_spent_today: number;
  achievements_unlocked: number;
  next_level_xp: number;
  level: number;
}

interface DailyChallenge {
  challenge: any;
  tasks: any[];
  user_progress: any[];
}

export default function Component10Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [upcomingSession, setUpcomingSession] = useState<LiveSession | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Fetch user profile
        const userData = await usersApi.getProfile();
        setUser(userData);

        // Fetch dashboard stats
        try {
          const statsData = await usersApi.getDashboardStats();
          setStats(statsData);
        } catch (err) {
          console.error("Error fetching dashboard stats:", err);
        }

        // Fetch enrolled courses
        try {
          const coursesRes = await fetch(`${API_BASE_URL}/courses/enrolled`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (coursesRes.ok) {
            const coursesData = await coursesRes.json();
            // Transform API response to match interface
            // Backend returns { courses: [...], total: int }
            const coursesList = Array.isArray(coursesData) ? coursesData : (coursesData.courses || []);
            const transformedCourses: Course[] = coursesList.map((c: any) => ({
              id: c.id,
              title: c.title,
              language: c.language || "English",
              flag: c.flag || "🌍",
              progress: c.progress || 0,
              units_completed: c.units_completed || 0,
              total_units: c.total_units || 1,
              last_lesson_id: c.last_lesson_id
            }));
            setCourses(transformedCourses.slice(0, 3));
          }
        } catch (err) {
          console.error("Error fetching courses:", err);
        }

        // Fetch upcoming live sessions
        try {
          const sessionData = await liveSessionsApi.getUpcomingSessions(1);
          if (sessionData.sessions && sessionData.sessions.length > 0) {
            const session = sessionData.sessions[0];
            setUpcomingSession({
              id: session.id,
              title: session.title || "Live Session",
              instructor: session.instructor_name || "Instructor",
              enrolled_count: session.enrolled_count || 0,
              scheduled_time: session.scheduled_at,
              is_live: session.is_live || false
            });
          }
        } catch (err) {
          console.error("Error fetching sessions:", err);
        }

        // Fetch daily challenge
        try {
          const challengeData = await gamificationApi.getDailyChallenge();
          setDailyChallenge(challengeData);
        } catch (err) {
          console.error("Error fetching daily challenge:", err);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // Get continue learning course (first course with progress)
  const continueCourse = courses.find(c => c.progress > 0 && c.progress < 100);
  
  const displayCourses = courses.length > 0 ? courses : [];
  const displaySession = upcomingSession;

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="text-[#bfff00] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen flex flex-col">
      {/* Navigation */}
      <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-50">
        <div className="absolute border-b border-[#2a2a2a] inset-0 pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="flex items-center justify-between px-[40px] w-full">
            <Link to="/dashboard" className="flex gap-[11px] items-center no-underline">
              <div className="bg-[#bfff00] flex items-center justify-center w-[38px] h-[38px] rounded-[10px]">
                <span className="text-[18px]">🧠</span>
              </div>
              <span className="text-[18px] text-white font-bold">
                FLUENT<span className="text-[#bfff00]">FUSION</span>
              </span>
            </Link>
            <div className="flex gap-[16px] items-center">
              <button className="relative text-[20px]">
                🔔
                <span className="absolute bg-[#bfff00] w-[8px] h-[8px] rounded-[4px] -top-1 -right-1" />
              </button>
              <div
                className="w-[32px] h-[32px] rounded-[16px] flex items-center justify-center text-[13px] font-bold text-black"
                style={{ background: "linear-gradient(135deg, rgb(191, 255, 0) 0%, rgb(143, 239, 0) 100%)" }}
              >
                {user ? getInitials(user.full_name) : "JP"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-66px)]">
        {/* Sidebar */}
        <div className="fixed left-0 top-[66px] w-[240px] h-[calc(100vh-66px)] bg-[#0f0f0f] border-r border-[#2a2a2a] overflow-y-auto">
          <div className="flex flex-col py-5 px-0">
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3">Main</div>
            <Link to="/dashboard" className="w-full bg-[rgba(191,255,0,0.1)] border-l-2 border-[#bfff00] py-3 pl-6 pr-4 flex gap-3 items-center">
              <span className="text-[#bfff00]">⚡</span>
              <span className="text-[#bfff00] text-[14px]">Dashboard</span>
            </Link>
            <Link to="/courses" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📚</span>
              <span className="text-[14px]">My Courses</span>
            </Link>
            <Link to="/practice/flashcards" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>🎯</span>
              <span className="text-[14px]">Practice</span>
            </Link>
            <Link to="/live-sessions" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>🎥</span>
              <span className="text-[14px]">Live Sessions</span>
              <span className="ml-auto bg-[#bfff00] text-black text-[10px] px-2 py-0.5 rounded-[99px]">2</span>
            </Link>
            <Link to="/community" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>🌍</span>
              <span className="text-[14px]">Community</span>
            </Link>
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4">Account</div>
            <Link to="/profile" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>👤</span>
              <span className="text-[14px]">Profile</span>
            </Link>
            <Link to="/settings" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>⚙️</span>
              <span className="text-[14px]">Settings</span>
            </Link>
            <div className="mt-auto pt-[337px] border-t border-[#2a2a2a]">
              <button onClick={handleLogout} className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
                <span>↩</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="ml-[240px] flex-1 p-9 overflow-auto">
          <div className="mb-6">
            <h1 className="text-[26px] text-white font-bold">
              {getGreeting()}, <span className="text-[#bfff00]">{user?.full_name || "Jean Pierre"}</span> 👋
            </h1>
            <p className="text-[#888] text-[14px] mt-1">
              {stats?.current_streak ? (
                <>You're on a {stats.current_streak}-day streak! Keep it up — you're doing amazing.</>
              ) : (
                <>Start your learning journey today! Complete lessons to build your streak.</>
              )}
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-[18px] mb-6">
            <div className="bg-[#151515] rounded-[14px] border border-[#2a2a2a] p-5">
              <div className="text-[#888] text-[10px] uppercase tracking-[1px]">XP Points</div>
              <div className="text-[#bfff00] text-[34px] font-bold mt-2">{stats?.xp_points?.toLocaleString() || "0"}</div>
              <div className="text-[#888] text-[12px] mt-1">+{stats?.xp_today || 0} today</div>
            </div>
            <div className="bg-[#151515] rounded-[14px] border border-[#2a2a2a] p-5">
              <div className="text-[#888] text-[10px] uppercase tracking-[1px]">Daily Streak</div>
              <div className="text-[#bfff00] text-[28px] font-bold mt-2">{stats?.current_streak || 0} 🔥</div>
              <div className="text-[#888] text-[12px] mt-1">Best: {stats?.best_streak || 0} days</div>
            </div>
            <div className="bg-[#151515] rounded-[14px] border border-[#2a2a2a] p-5">
              <div className="text-[#888] text-[10px] uppercase tracking-[1px]">Lessons Done</div>
              <div className="text-[#bfff00] text-[34px] font-bold mt-2">{stats?.lessons_this_month || 0}</div>
              <div className="text-[#888] text-[12px] mt-1">This month</div>
            </div>
            <div className="bg-[#151515] rounded-[14px] border border-[#2a2a2a] p-5">
              <div className="text-[#888] text-[10px] uppercase tracking-[1px]">Fluency Score</div>
              <div className="text-[#bfff00] text-[34px] font-bold mt-2">{stats?.fluency_score || 0}%</div>
              <div className="bg-[#2a2a2a] h-[6px] rounded-[99px] mt-2 overflow-hidden">
                <div className="bg-gradient-to-r from-[#8fef00] to-[#bfff00] h-full rounded-[99px]" style={{ width: `${stats?.fluency_score || 0}%` }} />
              </div>
            </div>
          </div>

          {/* Continue Learning Banner */}
          {continueCourse ? (
          <div className="bg-gradient-to-r from-[rgba(191,255,0,0.1)] to-[rgba(191,255,0,0.04)] rounded-[14px] border border-[rgba(191,255,0,0.2)] p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#bfff00] text-[10px] uppercase tracking-[1.2px]">CONTINUE WHERE YOU LEFT OFF</div>
                <div className="text-white text-[18px] font-bold mt-2">{continueCourse.title}</div>
                <div className="text-[#888] text-[13px] mt-1">Unit {continueCourse.units_completed} of {continueCourse.total_units}</div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="bg-[#2a2a2a] h-[6px] rounded-[99px] w-[200px] overflow-hidden">
                    <div className="bg-gradient-to-r from-[#8fef00] to-[#bfff00] h-full rounded-[99px]" style={{ width: `${continueCourse.progress}%` }} />
                  </div>
                  <span className="text-[#888] text-[12px]">{continueCourse.progress}% complete</span>
                </div>
              </div>
              <Link to={`/lesson/${continueCourse.last_lesson_id || continueCourse.id}`} className="bg-[#bfff00] text-[#0a0a0a] px-6 py-3 rounded-[10px] font-semibold">
                Continue Learning →
              </Link>
            </div>
          </div>
          ) : (
          <div className="bg-gradient-to-r from-[rgba(191,255,0,0.1)] to-[rgba(191,255,0,0.04)] rounded-[14px] border border-[rgba(191,255,0,0.2)] p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#bfff00] text-[10px] uppercase tracking-[1.2px]">START YOUR JOURNEY</div>
                <div className="text-white text-[18px] font-bold mt-2">Browse Courses</div>
                <div className="text-[#888] text-[13px] mt-1">Find the perfect course to start learning</div>
              </div>
              <Link to="/courses" className="bg-[#bfff00] text-[#0a0a0a] px-6 py-3 rounded-[10px] font-semibold">
                Browse Courses →
              </Link>
            </div>
          </div>
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* Enrolled Courses */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-[15px] font-bold">Enrolled Courses</h2>
                <Link to="/courses" className="text-[#bfff00] text-[13px]">View All →</Link>
              </div>
              <div className="flex flex-col gap-3">
                {displayCourses.map((course) => (
                  <Link key={course.id} to={`/course/${course.id}`} className="bg-[#1a1a1a] rounded-[8px] border border-[#2a2a2a] p-4 flex items-center justify-between hover:border-[#444]">
                    <div className="flex items-center gap-4">
                      <span className="text-[24px]">{course.flag}</span>
                      <div>
                        <div className="text-white text-[14px] font-medium">{course.title}</div>
                        <div className="text-[#888] text-[12px]">Unit {course.units_completed} of {course.total_units}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#bfff00] text-[13px] font-semibold">{course.progress}%</span>
                      <div className="bg-[#2a2a2a] h-[4px] rounded-[99px] w-[80px] overflow-hidden">
                        <div className="bg-gradient-to-r from-[#8fef00] to-[#bfff00] h-full rounded-[99px]" style={{ width: `${course.progress}%` }} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Upcoming Live Session */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-[15px] font-bold">Upcoming Live Session</h2>
                <Link to="/live" className="text-[#bfff00] text-[13px]">View All →</Link>
              </div>
              {displaySession ? (
              <div className="bg-[#151515] rounded-[14px] border border-[rgba(0,207,255,0.2)] p-5 mb-4">
                <div className="flex items-center justify-between mb-2">
                  {displaySession.is_live ? (
                    <span className="text-[#00cfff] text-[12px] font-semibold flex items-center gap-1">
                      <span className="w-[6px] h-[6px] bg-[#00cfff] rounded-[3px]" /> LIVE NOW
                    </span>
                  ) : (
                    <span className="text-[#888] text-[12px]">{displaySession.scheduled_time ? new Date(displaySession.scheduled_time).toLocaleString() : 'Coming soon'}</span>
                  )}
                </div>
                <div className="text-white text-[16px] font-bold mb-3">{displaySession.title}</div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-[32px] h-[32px] rounded-[16px] bg-gradient-to-br from-[#bfff00] to-[#8fef00] flex items-center justify-center text-[13px] font-bold text-black">
                    {(displaySession.instructor || "??").split(" ").map(n => n[0]).join("")}
                  </div>
                  <span className="text-[#888] text-[13px]">with {displaySession.instructor} · {displaySession.enrolled_count} enrolled</span>
                </div>
                <button className="w-full bg-[#1a1a1a] border border-[#333] text-white text-[13px] py-2 rounded-[8px]">Set Reminder</button>
              </div>
              ) : (
              <div className="bg-[#151515] rounded-[14px] border border-[#2a2a2a] p-5 mb-4">
                <div className="text-[#888] text-[14px] text-center py-4">No upcoming sessions</div>
                <Link to="/live" className="block w-full bg-[#1a1a1a] border border-[#333] text-white text-[13px] py-2 rounded-[8px] text-center">Browse Sessions</Link>
              </div>
              )}

              {/* Daily Challenge */}
              {dailyChallenge && dailyChallenge.challenge ? (
              <div className="bg-[#151515] rounded-[14px] border border-[#2a2a2a] p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white text-[13px] font-bold uppercase tracking-[0.52px]">Daily Challenge</div>
                  <span className="bg-[rgba(255,184,0,0.1)] text-[#ffb800] text-[11px] px-3 py-1 rounded-[99px]">⏰ 4h left</span>
                </div>
                <div className="text-white text-[14px] mb-3">{dailyChallenge.challenge.title || "Daily Challenge"}</div>
                <div className="flex items-center gap-3">
                  <div className="bg-[#2a2a2a] h-[6px] rounded-[99px] flex-1 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#8fef00] to-[#bfff00] h-full rounded-[99px]" style={{ width: dailyChallenge.challenge.progress ? `${dailyChallenge.challenge.progress}%` : '0%' }} />
                  </div>
                  <span className="text-[#888] text-[12px]">{dailyChallenge.challenge.completed_tasks || 0}/{dailyChallenge.challenge.total_tasks || 0} done</span>
                </div>
              </div>
              ) : (
              <div className="bg-[#151515] rounded-[14px] border border-[#2a2a2a] p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white text-[13px] font-bold uppercase tracking-[0.52px]">Daily Challenge</div>
                  <span className="bg-[rgba(255,184,0,0.1)] text-[#ffb800] text-[11px] px-3 py-1 rounded-[99px]">⏰ Check back later</span>
                </div>
                <div className="text-white text-[14px] mb-3">No challenge available today</div>
                <div className="text-[#888] text-[12px]">Check back tomorrow for new challenges!</div>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
