import { useState, useEffect } from "react";
import { Link } from "react-router";
import { API_BASE_URL, usersApi, liveSessionsApi, gamificationApi } from "../app/api/config";
import StudentLayout from "../app/components/StudentLayout";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

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

const generateProgressData = (lessonsCompleted: number) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const base = Math.max(1, Math.floor(lessonsCompleted / 7));
  return days.map((day, i) => ({
    day,
    lessons: Math.max(0, base + Math.floor(Math.sin(i) * base * 0.5)),
  }));
};

export default function Component10Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [upcomingSession, setUpcomingSession] = useState<LiveSession | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [progressChartData, setProgressChartData] = useState<{ day: string; lessons: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("ff_access_token");
      if (!token) return;

      try {
        const userData = await usersApi.getProfile();
        setUser(userData);

        try {
          const statsData = await usersApi.getDashboardStats();
          setStats(statsData);
          setProgressChartData(generateProgressData(statsData?.lessons_completed || 0));
        } catch (err) {
          console.error("Error fetching dashboard stats:", err);
        }

        try {
          const coursesRes = await fetch(`${API_BASE_URL}/courses/enrolled`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (coursesRes.ok) {
            const coursesData = await coursesRes.json();
            const coursesList = Array.isArray(coursesData)
              ? coursesData
              : (coursesData.courses || []);
            const transformedCourses: Course[] = coursesList.map((c: any) => ({
              id: c.id,
              title: c.title,
              language: c.language || "English",
              flag: c.flag || "🌍",
              progress: c.progress || 0,
              units_completed: c.units_completed || 0,
              total_units: c.total_units || 1,
              last_lesson_id: c.last_lesson_id,
            }));
            setCourses(transformedCourses.slice(0, 3));
          }
        } catch (err) {
          console.error("Error fetching courses:", err);
        }

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
              is_live: session.is_live || false,
            });
          }
        } catch (err) {
          console.error("Error fetching sessions:", err);
        }

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
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const continueCourse = courses.find((c) => c.progress > 0 && c.progress < 100);

  const statCards = [
    {
      label: "XP Points",
      value: loading ? "..." : (stats?.xp_points?.toLocaleString() || "0"),
      sub: `+${stats?.xp_today || 0} today`,
      icon: "⚡",
      color: "#bfff00",
    },
    {
      label: "Daily Streak",
      value: loading ? "..." : `${stats?.current_streak || 0} 🔥`,
      sub: `Best: ${stats?.best_streak || 0} days`,
      icon: "🔥",
      color: "#ff6b35",
    },
    {
      label: "Lessons Done",
      value: loading ? "..." : (stats?.lessons_this_month || 0).toString(),
      sub: "This month",
      icon: "📚",
      color: "#00ff7f",
    },
    {
      label: "Fluency Score",
      value: loading ? "..." : `${stats?.fluency_score || 0}%`,
      sub: "Overall progress",
      icon: "🎯",
      color: "#bfff00",
    },
  ];

  return (
    <StudentLayout>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-[28px] text-white font-bold">
          {getGreeting()},{" "}
          <span className="text-[#bfff00]">{user?.full_name || "Learner"}</span> 👋
        </h1>
        <p className="text-[#888] text-[14px] mt-1">
          {stats?.current_streak ? (
            <>You're on a {stats.current_streak}-day streak! Keep it up — you're doing amazing.</>
          ) : (
            <>Start your learning journey today! Complete lessons to build your streak.</>
          )}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-5 hover:border-[#3a3a3a] transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-[#888] text-[11px] uppercase tracking-widest">{card.label}</span>
              <span className="text-[20px]">{card.icon}</span>
            </div>
            <div className="text-[28px] font-bold mb-1" style={{ color: card.color }}>
              {card.value}
            </div>
            <div className="text-[#555] text-[11px]">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Continue Learning Banner */}
      <div className="bg-gradient-to-r from-[rgba(191,255,0,0.1)] to-[rgba(191,255,0,0.04)] rounded-xl border border-[rgba(191,255,0,0.2)] p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            {continueCourse ? (
              <>
                <div className="text-[#bfff00] text-[10px] uppercase tracking-[1.2px]">
                  CONTINUE WHERE YOU LEFT OFF
                </div>
                <div className="text-white text-[18px] font-bold mt-2">{continueCourse.title}</div>
                <div className="text-[#888] text-[13px] mt-1">
                  Unit {continueCourse.units_completed} of {continueCourse.total_units}
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="bg-[#2a2a2a] h-[6px] rounded-[99px] w-[200px] overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#8fef00] to-[#bfff00] h-full rounded-[99px]"
                      style={{ width: `${continueCourse.progress}%` }}
                    />
                  </div>
                  <span className="text-[#888] text-[12px]">{continueCourse.progress}% complete</span>
                </div>
              </>
            ) : (
              <>
                <div className="text-[#bfff00] text-[10px] uppercase tracking-[1.2px]">START YOUR JOURNEY</div>
                <div className="text-white text-[18px] font-bold mt-2">Browse Courses</div>
                <div className="text-[#888] text-[13px] mt-1">Find the perfect course to start learning</div>
              </>
            )}
          </div>
          {continueCourse ? (
            <Link
              to={`/lesson/${continueCourse.last_lesson_id || continueCourse.id}`}
              className="bg-[#bfff00] text-[#0a0a0a] px-6 py-3 rounded-lg font-semibold no-underline hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Continue Learning →
            </Link>
          ) : (
            <Link
              to="/courses"
              className="bg-[#bfff00] text-[#0a0a0a] px-6 py-3 rounded-lg font-semibold no-underline hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Browse Courses →
            </Link>
          )}
        </div>
      </div>

      {/* Charts + Session */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-[#151515] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-[14px] font-semibold">Weekly Learning Activity</h2>
            <span className="text-[#555] text-[10px]">Lessons per day</span>
          </div>
          {loading ? (
            <div className="h-[180px] flex items-center justify-center text-[#555]">Loading chart...</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={progressChartData}>
                <defs>
                  <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#bfff00" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#bfff00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="day" stroke="#555" tick={{ fill: '#888', fontSize: 11 }} />
                <YAxis stroke="#555" tick={{ fill: '#888', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8 }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#bfff00' }}
                />
                <Area
                  type="monotone"
                  dataKey="lessons"
                  stroke="#bfff00"
                  fill="url(#progressGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-[14px] font-semibold">Upcoming Session</h2>
            <Link to="/live-sessions" className="text-[#bfff00] text-[12px] hover:underline no-underline">
              View All →
            </Link>
          </div>
          {loading ? (
            <div className="h-[180px] flex items-center justify-center text-[#555]">Loading...</div>
          ) : upcomingSession ? (
            <div>
              {upcomingSession.is_live ? (
                <span className="text-[#00cfff] text-[11px] font-semibold flex items-center gap-1 mb-2">
                  <span className="w-[6px] h-[6px] bg-[#00cfff] rounded-full inline-block" /> LIVE NOW
                </span>
              ) : (
                <span className="text-[#888] text-[11px] mb-2 block">
                  {upcomingSession.scheduled_time
                    ? new Date(upcomingSession.scheduled_time).toLocaleString()
                    : "Coming soon"}
                </span>
              )}
              <div className="text-white font-semibold text-[15px] mb-3">{upcomingSession.title}</div>
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-[11px] font-bold text-black"
                  style={{ background: 'linear-gradient(135deg, #bfff00, #8fef00)' }}
                >
                  {(upcomingSession.instructor || "?").split(" ").map((n) => n[0]).join("")}
                </div>
                <span className="text-[#888] text-[12px]">
                  {upcomingSession.instructor} · {upcomingSession.enrolled_count} enrolled
                </span>
              </div>
              <Link
                to={`/live-session/${upcomingSession.id}`}
                className="block w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-[12px] py-2 rounded-lg text-center no-underline hover:border-[#bfff00] transition-colors"
              >
                {upcomingSession.is_live ? "Join Now" : "View Details"}
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[140px]">
              <div className="text-[36px] mb-2">🎥</div>
              <p className="text-[#888] text-[13px]">No upcoming sessions</p>
              <Link
                to="/live-sessions"
                className="mt-3 text-[#bfff00] text-[12px] hover:underline no-underline"
              >
                Browse sessions →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">My Courses</h2>
            <Link to="/courses" className="text-[#bfff00] text-[12px] hover:underline no-underline">
              View All →
            </Link>
          </div>
          {loading ? (
            <div className="text-[#888] text-[13px]">Loading...</div>
          ) : courses.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-[40px] mb-2">📚</div>
              <p className="text-[#888] text-[13px] mb-3">No courses enrolled yet</p>
              <Link
                to="/courses"
                className="bg-[#bfff00] text-black px-5 py-2 rounded-lg font-semibold text-[13px] inline-block no-underline"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  to={`/course/${course.id}`}
                  className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-xl border border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors no-underline"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[22px]">{course.flag}</span>
                    <div>
                      <div className="text-white text-[13px] font-medium">{course.title}</div>
                      <div className="text-[#888] text-[11px]">
                        Unit {course.units_completed} of {course.total_units}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#bfff00] text-[12px] font-semibold">{course.progress}%</span>
                    <div className="bg-[#2a2a2a] h-[4px] rounded-[99px] w-[60px] overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#8fef00] to-[#bfff00] h-full rounded-[99px]"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { to: "/courses", icon: "📚", label: "Browse Courses", sub: "Discover new lessons" },
                { to: "/live-sessions", icon: "🎥", label: "Live Sessions", sub: "Join real-time classes" },
                { to: "/messages", icon: "💬", label: "Messages", sub: "Chat with instructors" },
                { to: "/practice/flashcards", icon: "🎯", label: "Practice", sub: "Reinforce vocabulary" },
              ].map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#bfff00] transition-colors no-underline block"
                >
                  <span className="text-[24px]">{action.icon}</span>
                  <p className="text-white text-[13px] font-semibold mt-2">{action.label}</p>
                  <p className="text-[#555] text-[11px]">{action.sub}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-semibold">Daily Challenge</h2>
              <span className="bg-[rgba(255,184,0,0.1)] text-[#ffb800] text-[11px] px-3 py-1 rounded-[99px]">
                ⏰ Today
              </span>
            </div>
            {dailyChallenge?.challenge ? (
              <>
                <div className="text-white text-[14px] mb-3">
                  {dailyChallenge.challenge.title || "Daily Challenge"}
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-[#2a2a2a] h-[6px] rounded-[99px] flex-1 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#8fef00] to-[#bfff00] h-full rounded-[99px]"
                      style={{
                        width: dailyChallenge.challenge.progress
                          ? `${dailyChallenge.challenge.progress}%`
                          : "0%",
                      }}
                    />
                  </div>
                  <span className="text-[#888] text-[12px]">
                    {dailyChallenge.challenge.completed_tasks || 0}/
                    {dailyChallenge.challenge.total_tasks || 0} done
                  </span>
                </div>
                <Link
                  to="/daily-challenge"
                  className="mt-3 block w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-[12px] py-2 rounded-lg text-center no-underline hover:border-[#bfff00] transition-colors"
                >
                  Start Challenge
                </Link>
              </>
            ) : (
              <>
                <p className="text-[#888] text-[13px] mb-3">No challenge available today</p>
                <p className="text-[#555] text-[11px]">Check back tomorrow for new challenges!</p>
              </>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
