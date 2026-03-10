import { useState, useEffect } from "react";
import { Link } from "react-router";
import { liveSessionsApi } from "../app/api/config";
import { toast } from "sonner";
import StudentLayout from "../app/components/StudentLayout";

interface LiveSession {
  id: number;
  title: string;
  description?: string;
  instructor_name?: string;
  instructor_id?: number;
  scheduled_at: string;
  duration_min?: number;
  max_participants?: number;
  enrolled_count?: number;
  current_viewers?: number;
  status: "scheduled" | "live" | "ended" | "cancelled";
  language?: string;
  level?: string;
  is_registered?: boolean;
}

export default function Component20LiveSessionsList() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<LiveSession[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "live" | "all">("upcoming");
  const [registeringId, setRegisteringId] = useState<number | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const [upcomingRes, liveRes, allRes] = await Promise.allSettled([
        liveSessionsApi.getUpcomingSessions(20),
        liveSessionsApi.getSessions({ status: "live", limit: 20 }),
        liveSessionsApi.getSessions({ limit: 50 }),
      ]);

      if (upcomingRes.status === "fulfilled") {
        setUpcomingSessions(upcomingRes.value.sessions || []);
      }
      if (liveRes.status === "fulfilled") {
        setLiveSessions(liveRes.value.sessions || []);
      }
      if (allRes.status === "fulfilled") {
        setSessions(allRes.value.sessions || []);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (sessionId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRegisteringId(sessionId);
    try {
      await liveSessionsApi.registerSession(sessionId);
      toast.success("Successfully registered for the session!");
      fetchSessions();
    } catch (error: any) {
      console.error("Failed to register:", error);
      toast.error(error.message || "Failed to register for session");
    } finally {
      setRegisteringId(null);
    }
  };

  const getStatusBadge = (session: LiveSession) => {
    if (session.status === "live") {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] bg-[rgba(0,207,255,0.15)] text-[#00cfff] flex items-center gap-1">
          <span className="w-[6px] h-[6px] bg-[#00cfff] rounded-full inline-block animate-pulse" />
          LIVE
        </span>
      );
    }
    if (session.status === "scheduled") {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] bg-[rgba(191,255,0,0.1)] text-[#bfff00]">
          Scheduled
        </span>
      );
    }
    if (session.status === "ended") {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] bg-[rgba(150,150,150,0.15)] text-[#888]">
          Ended
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] bg-[rgba(255,50,50,0.15)] text-red-400">
        Cancelled
      </span>
    );
  };

  const getLevelColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case "beginner":
      case "a1":
      case "a2":
        return "text-[#00ff7f]";
      case "intermediate":
      case "b1":
      case "b2":
        return "text-yellow-400";
      case "advanced":
      case "c1":
      case "c2":
        return "text-red-400";
      default:
        return "text-[#888]";
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const displayedSessions =
    activeTab === "live"
      ? liveSessions
      : activeTab === "upcoming"
      ? upcomingSessions
      : sessions;

  const tabs = [
    { id: "upcoming" as const, label: "Upcoming", count: upcomingSessions.length },
    { id: "live" as const, label: "Live Now", count: liveSessions.length },
    { id: "all" as const, label: "All Sessions", count: sessions.length },
  ];

  const headerAction = (
    <div className="flex items-center gap-2 text-[#888] text-[13px]">
      <span className="w-2 h-2 bg-[#00cfff] rounded-full animate-pulse" />
      {liveSessions.length > 0 ? `${liveSessions.length} session${liveSessions.length > 1 ? "s" : ""} live now` : "No live sessions now"}
    </div>
  );

  return (
    <StudentLayout
      title="Live Sessions"
      subtitle="Join real-time classes with certified instructors"
      headerAction={headerAction}
    >
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 bg-[#151515] border border-[#2a2a2a] rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-[13px] transition-colors flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-[#bfff00] text-black font-semibold"
                : "text-[#888] hover:text-white"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? "bg-black/20 text-black"
                    : tab.id === "live"
                    ? "bg-[rgba(0,207,255,0.2)] text-[#00cfff]"
                    : "bg-[#2a2a2a] text-[#888]"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div className="text-[#888] text-center py-16">Loading sessions...</div>
      ) : displayedSessions.length === 0 ? (
        <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-12 text-center">
          <div className="text-[48px] mb-4">
            {activeTab === "live" ? "🔴" : "🎥"}
          </div>
          <p className="text-[#888] text-[14px]">
            {activeTab === "live"
              ? "No sessions are live right now"
              : activeTab === "upcoming"
              ? "No upcoming sessions scheduled"
              : "No sessions found"}
          </p>
          <p className="text-[#555] text-[12px] mt-1">Check back later for new sessions</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedSessions.map((session) => (
            <div
              key={session.id}
              className="bg-[#151515] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#3a3a3a] transition-colors"
            >
              {/* Session Header */}
              <div
                className={`h-[120px] flex items-center justify-center relative ${
                  session.status === "live"
                    ? "bg-gradient-to-br from-[rgba(0,207,255,0.15)] to-[rgba(0,207,255,0.05)]"
                    : "bg-[#0f0f0f]"
                }`}
              >
                <div className="text-[56px]">
                  {session.status === "live" ? "🔴" : "🎥"}
                </div>
                <div className="absolute top-3 right-3">{getStatusBadge(session)}</div>
                {session.level && (
                  <div className="absolute bottom-3 left-3">
                    <span className={`text-[10px] font-semibold uppercase ${getLevelColor(session.level)}`}>
                      {session.level}
                    </span>
                  </div>
                )}
              </div>

              {/* Session Body */}
              <div className="p-4">
                <h3 className="text-white font-semibold text-[14px] mb-2 line-clamp-2">
                  {session.title}
                </h3>

                {session.description && (
                  <p className="text-[#888] text-[12px] mb-3 line-clamp-2">{session.description}</p>
                )}

                {/* Instructor */}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-[24px] h-[24px] rounded-full flex items-center justify-center text-[10px] font-bold text-black"
                    style={{ background: "linear-gradient(135deg, #bfff00, #8fef00)" }}
                  >
                    {getInitials(session.instructor_name)}
                  </div>
                  <span className="text-[#888] text-[11px]">
                    {session.instructor_name || "Instructor"}
                  </span>
                  {session.language && (
                    <>
                      <span className="text-[#555] text-[10px]">·</span>
                      <span className="text-[#888] text-[11px]">{session.language}</span>
                    </>
                  )}
                </div>

                {/* Time + Participants */}
                <div className="flex items-center justify-between text-[11px] text-[#555] mb-4">
                  <span>{formatTime(session.scheduled_at)}</span>
                  <span>
                    {session.status === "live"
                      ? `${session.current_viewers || 0} watching`
                      : `${session.enrolled_count || 0} enrolled`}
                    {session.max_participants ? ` / ${session.max_participants}` : ""}
                  </span>
                </div>

                {/* Action Button */}
                {session.status === "live" ? (
                  <Link
                    to={`/live-session/${session.id}`}
                    className="block w-full bg-[#00cfff] text-black text-[12px] font-semibold py-2.5 rounded-lg text-center no-underline hover:opacity-90 transition-opacity"
                  >
                    Join Live Session →
                  </Link>
                ) : session.status === "scheduled" ? (
                  <button
                    onClick={(e) => handleRegister(session.id, e)}
                    disabled={registeringId === session.id || session.is_registered}
                    className={`w-full text-[12px] font-semibold py-2.5 rounded-lg transition-all ${
                      session.is_registered
                        ? "bg-[rgba(191,255,0,0.1)] text-[#bfff00] border border-[rgba(191,255,0,0.3)] cursor-default"
                        : "bg-[#bfff00] text-black hover:opacity-90"
                    } disabled:opacity-50`}
                  >
                    {registeringId === session.id
                      ? "Registering..."
                      : session.is_registered
                      ? "✓ Registered"
                      : "Register"}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-[#1a1a1a] text-[#555] text-[12px] py-2.5 rounded-lg cursor-not-allowed"
                  >
                    Session Ended
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </StudentLayout>
  );
}
