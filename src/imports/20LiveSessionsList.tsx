import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { liveSessionsApi, studentApi, authApi } from "../app/api/config";
import { toast } from "sonner";
import StudentLayout from "../app/components/StudentLayout";
import LiveKitRoom from "./LiveKitRoom";

interface LiveSession {
  id: number;
  title: string;
  description?: string;
  instructor_name?: string;
  instructor_id?: number;
  instructor_avatar?: string;
  language_id?: number;
  language_name?: string;
  scheduled_at: string;
  duration_minutes?: number;
  duration_min?: number;
  max_participants?: number;
  enrolled_count?: number;
  current_viewers?: number;
  status: "scheduled" | "live" | "ended" | "cancelled";
  level?: string;
  is_registered?: boolean;
  stream_url?: string;
  room_name?: string;
}

interface Meeting {
  id: number;
  title: string;
  description: string | null;
  meeting_type: string;
  scheduled_at: string | null;
  duration_minutes: number;
  timezone: string;
  meeting_link: string | null;
  meeting_platform: string | null;
  status: string;
  reason: string | null;
  response: string | null;
  response_note?: string;
  organizer_id: number;
  organizer_name: string;
  organizer_avatar: string | null;
  created_at: string | null;
  invitee_count?: number;
}

type TabType = "upcoming" | "live" | "meetings" | "all";

export default function Component20LiveSessionsList() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<LiveSession[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [registeringId, setRegisteringId] = useState<number | null>(null);
  
  // Modal states
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseChoice, setResponseChoice] = useState<"accepted" | "declined" | null>(null);
  const [responseNote, setResponseNote] = useState("");
  const [respondingMeetingId, setRespondingMeetingId] = useState<number | null>(null);
  
  // LiveKit session state
  const [activeLiveKitSession, setActiveLiveKitSession] = useState<{
    roomName: string;
    sessionId?: number;
    meetingId?: number;
    title: string;
    isHost: boolean;
  } | null>(null);
  
  // Filter state for All Sessions
  const [sessionFilter, setSessionFilter] = useState<"all" | "upcoming" | "completed" | "declined" | "attended">("all");
  const [sessionSort, setSessionSort] = useState<"date" | "instructor" | "course">("date");
  
  // Current user
  const currentUser = authApi.getCurrentUser();

  useEffect(() => {
    fetchAllData();
    
    // Check for upcoming meetings every minute for reminders
    const reminderInterval = setInterval(() => {
      checkMeetingReminders();
    }, 60000);
    
    return () => clearInterval(reminderInterval);
  }, []);

  // Refresh data when tab changes
  useEffect(() => {
    fetchAllData();
  }, [activeTab, sessionFilter]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchSessions(),
        fetchMeetings()
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const results = await Promise.all([
        liveSessionsApi.getUpcomingSessions(50),
        liveSessionsApi.getSessions({ status: "live", limit: 50 }),
        liveSessionsApi.getSessions({ limit: 100 })
      ]);
      
      setUpcomingSessions(results[0].sessions || []);
      setLiveSessions(results[1].sessions || []);
      setSessions(results[2].sessions || []);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    }
  };

  const fetchMeetings = async () => {
    try {
      const result = await studentApi.getMeetings({ limit: 100 });
      setMeetings(result.meetings || []);
    } catch (error: any) {
      console.error("Failed to fetch meetings:", error);
      // Don't show toast here to avoid noise on initial load
    }
  };

  const checkMeetingReminders = () => {
    const now = new Date();
    meetings.forEach((meeting) => {
      if (meeting.scheduled_at && meeting.status === "scheduled" && meeting.response === "accepted") {
        const meetingTime = new Date(meeting.scheduled_at);
        const timeDiff = meetingTime.getTime() - now.getTime();
        const minutesDiff = Math.floor(timeDiff / 60000);
        
        if (minutesDiff === 10 || minutesDiff === 5) {
          toast.info(`⏰ Reminder: "${meeting.title}" starts in ${minutesDiff} minutes!`, {
            duration: 15000,
            action: {
              label: "Join Now",
              onClick: () => handleJoinMeeting(meeting),
            },
          });
        }
      }
    });
  };

  // ==================== ACTIONS ====================

  const handleRegister = async (sessionId: number, e: React.MouseEvent) => {
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

  const handleRespondClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setResponseChoice(null);
    setResponseNote("");
    setShowResponseModal(true);
  };

  const handleConfirmResponse = async () => {
    if (!selectedMeeting || !responseChoice) return;
    
    setRespondingMeetingId(selectedMeeting.id);
    setShowResponseModal(false);
    
    try {
      await studentApi.respondToMeeting(selectedMeeting.id, { 
        response: responseChoice,
        response_note: responseNote || undefined 
      });
      
      toast.success(responseChoice === "accepted" 
        ? "✓ You accepted the meeting invitation!" 
        : "✕ You declined the meeting invitation");
      
      fetchMeetings();
    } catch (error: any) {
      console.error("Failed to respond to meeting:", error);
      toast.error(error.message || "Failed to respond to meeting");
    } finally {
      setRespondingMeetingId(null);
      setSelectedMeeting(null);
      setResponseChoice(null);
      setResponseNote("");
    }
  };

  const handleJoinMeeting = (meeting: Meeting) => {
    // If meeting has an external meeting link, open it
    if (meeting.meeting_link) {
      window.open(meeting.meeting_link, '_blank');
      return;
    }
    
    // Otherwise, join via LiveKit
    const roomName = `meeting-${meeting.id}`;
    setActiveLiveKitSession({
      roomName,
      meetingId: meeting.id,
      title: meeting.title,
      isHost: false,
    });
  };

  const handleJoinSession = (session: LiveSession) => {
    // If session is live and has a stream URL, open it
    if (session.status === "live" && session.stream_url) {
      window.open(session.stream_url, '_blank');
      return;
    }
    
    // If registered, join via LiveKit
    if (session.is_registered || session.status === "live") {
      const roomName = session.room_name || `session-${session.id}`;
      setActiveLiveKitSession({
        roomName,
        sessionId: session.id,
        title: session.title,
        isHost: false,
      });
    }
  };

  const handleLeaveLiveKit = () => {
    setActiveLiveKitSession(null);
    fetchSessions();
  };

  const handleCancelAttendance = async (meetingId: number) => {
    if (!confirm("Are you sure you want to cancel your attendance?")) return;
    
    try {
      await studentApi.respondToMeeting(meetingId, {
        response: "declined",
        response_note: "Cancelled by student"
      });
      toast.success("Attendance cancelled");
      fetchMeetings();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel attendance");
    }
  };

  // ==================== HELPERS ====================

  const getCountdown = (scheduledAt: string) => {
    const now = new Date();
    const scheduled = new Date(scheduledAt);
    const diff = scheduled.getTime() - now.getTime();
    
    if (diff <= 0) return "Starting now";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `In ${days}d ${hours}h`;
    if (hours > 0) return `In ${hours}h ${minutes}m`;
    return `In ${minutes}m`;
  };

  const getStatusBadge = (status: string, response?: string) => {
    if (status === "live") {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] bg-[rgba(0,207,255,0.15)] text-[#00cfff] flex items-center gap-1">
          <span className="w-[6px] h-[6px] bg-[#00cfff] rounded-full inline-block animate-pulse" />
          LIVE
        </span>
      );
    }
    if (status === "scheduled" && response === "accepted") {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] bg-[rgba(191,255,0,0.15)] text-[#bfff00] flex items-center gap-1">
          ✓ Attending
        </span>
      );
    }
    if (status === "scheduled") {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] bg-[rgba(191,255,0,0.1)] text-[#bfff00]">
          Scheduled
        </span>
      );
    }
    if (status === "confirmed") {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] bg-green-500/20 text-green-400">
          Confirmed
        </span>
      );
    }
    if (status === "declined" || response === "declined") {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400">
          Declined
        </span>
      );
    }
    if (status === "ended") {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] bg-[rgba(150,150,150,0.15)] text-[#888]">
          Completed
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] bg-[rgba(255,50,50,0.15)] text-red-400">
        {status}
      </span>
    );
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
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

  const formatFullDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }) + " at " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // ==================== FILTERED DATA ====================

  const getFilteredSessions = () => {
    let filtered = [...sessions];
    
    if (sessionFilter === "upcoming") {
      filtered = filtered.filter(s => s.status === "scheduled");
    } else if (sessionFilter === "completed") {
      filtered = filtered.filter(s => s.status === "ended");
    }
    
    // Sort
    if (sessionSort === "date") {
      filtered.sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
    }
    
    return filtered;
  };

  const getMyMeetings = () => {
    // Show meetings where user has accepted
    return meetings.filter(m => m.response === "accepted");
  };

  const getPendingMeetings = () => {
    // Show meetings that haven't been responded to
    return meetings.filter(m => !m.response && m.status === "scheduled");
  };

  // ==================== RENDER ====================

  const tabs = [
    { id: "upcoming" as const, label: "Upcoming", count: upcomingSessions.length, icon: "📅" },
    { id: "live" as const, label: "Live Now", count: liveSessions.length, icon: "🔴" },
    { id: "meetings" as const, label: "My Meetings", count: meetings.length, icon: "📬" },
    { id: "all" as const, label: "All Sessions", count: sessions.length, icon: "📚" },
  ];

  const headerAction = (
    <div className="flex items-center gap-2 text-[#888] text-[13px]">
      <span className="w-2 h-2 bg-[#00cfff] rounded-full animate-pulse" />
      {liveSessions.length > 0 
        ? `${liveSessions.length} session${liveSessions.length > 1 ? "s" : ""} live now` 
        : "No live sessions"}
    </div>
  );

  return (
    <StudentLayout
      title="Live Sessions"
      subtitle="Join real-time classes with certified instructors"
      headerAction={headerAction}
    >
      {/* Active LiveKit Session */}
      {activeLiveKitSession && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-semibold">
              📹 {activeLiveKitSession.title}
            </h2>
            <button
              onClick={handleLeaveLiveKit}
              className="text-[#888] hover:text-white"
            >
              ✕ Close
            </button>
          </div>
          <LiveKitRoom
            roomName={activeLiveKitSession.roomName}
            sessionId={activeLiveKitSession.sessionId || activeLiveKitSession.meetingId}
            isHost={activeLiveKitSession.isHost}
            onLeave={handleLeaveLiveKit}
          />
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 bg-[#151515] border border-[#2a2a2a] rounded-xl p-1 w-fit overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-[13px] transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-[#bfff00] text-black font-semibold"
                : "text-[#888] hover:text-white"
            }`}
          >
            <span>{tab.icon}</span>
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

      {/* UPCOMING SESSIONS TAB */}
      {activeTab === "upcoming" && (
        <SessionsGrid
          sessions={upcomingSessions}
          loading={loading}
          emptyMessage="No upcoming sessions"
          emptySubtext="Check back later for new scheduled sessions"
          onRegister={handleRegister}
          onSessionClick={(session) => {
            setSelectedSession(session);
            setShowSessionModal(true);
          }}
          onJoin={handleJoinSession}
          registeringId={registeringId}
          showRegisterButton
        />
      )}

      {/* LIVE NOW TAB */}
      {activeTab === "live" && (
        <SessionsGrid
          sessions={liveSessions}
          loading={loading}
          emptyMessage="No sessions live right now"
          emptySubtext="Check back soon for live sessions"
          onRegister={handleRegister}
          onSessionClick={(session) => {
            setSelectedSession(session);
            setShowSessionModal(true);
          }}
          onJoin={handleJoinSession}
          registeringId={registeringId}
          showJoinButton
        />
      )}

      {/* MY MEETINGS TAB */}
      {activeTab === "meetings" && (
        <MeetingsGrid
          meetings={meetings}
          pendingMeetings={getPendingMeetings()}
          acceptedMeetings={getMyMeetings()}
          loading={loading}
          onRespond={handleRespondClick}
          onJoin={handleJoinMeeting}
          onCancel={handleCancelAttendance}
          onMeetingClick={(meeting) => {
            setSelectedMeeting(meeting);
            setShowMeetingModal(true);
          }}
        />
      )}

      {/* ALL SESSIONS TAB */}
      {activeTab === "all" && (
        <div>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <select
              aria-label="Filter sessions"
              value={sessionFilter}
              onChange={(e) => setSessionFilter(e.target.value as any)}
              className="bg-[#151515] text-white text-[13px] px-3 py-2 rounded-lg border border-[#2a2a2a] outline-none focus:border-[#bfff00]"
            >
              <option value="all">All Sessions</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              aria-label="Sort sessions"
              value={sessionSort}
              onChange={(e) => setSessionSort(e.target.value as any)}
              className="bg-[#151515] text-white text-[13px] px-3 py-2 rounded-lg border border-[#2a2a2a] outline-none focus:border-[#bfff00]"
            >
              <option value="date">Sort by Date</option>
              <option value="instructor">Sort by Instructor</option>
            </select>
          </div>
          
          <SessionsGrid
            sessions={getFilteredSessions()}
            loading={loading}
            emptyMessage="No sessions found"
            emptySubtext="Try adjusting your filters"
            onRegister={handleRegister}
            onSessionClick={(session) => {
              setSelectedSession(session);
              setShowSessionModal(true);
            }}
            onJoin={handleJoinSession}
            registeringId={registeringId}
          />
        </div>
      )}

      {/* SESSION DETAILS MODAL */}
      {showSessionModal && selectedSession && (
        <SessionDetailsModal
          session={selectedSession}
          onClose={() => {
            setShowSessionModal(false);
            setSelectedSession(null);
          }}
          onRegister={() => handleRegister(selectedSession.id, {} as any)}
          onJoin={() => handleJoinSession(selectedSession)}
          registering={registeringId === selectedSession.id}
        />
      )}

      {/* MEETING DETAILS MODAL */}
      {showMeetingModal && selectedMeeting && (
        <MeetingDetailsModal
          meeting={selectedMeeting}
          onClose={() => {
            setShowMeetingModal(false);
            setSelectedMeeting(null);
          }}
          onRespond={() => {
            setShowMeetingModal(false);
            handleRespondClick(selectedMeeting);
          }}
          onJoin={() => handleJoinMeeting(selectedMeeting)}
          onCancel={() => {
            handleCancelAttendance(selectedMeeting.id);
            setShowMeetingModal(false);
          }}
        />
      )}

      {/* RESPONSE MODAL */}
      {showResponseModal && selectedMeeting && (
        <ResponseModal
          meeting={selectedMeeting}
          responseChoice={responseChoice}
          setResponseChoice={setResponseChoice}
          responseNote={responseNote}
          setResponseNote={setResponseNote}
          onConfirm={handleConfirmResponse}
          onCancel={() => {
            setShowResponseModal(false);
            setSelectedMeeting(null);
          }}
          loading={respondingMeetingId === selectedMeeting.id}
        />
      )}
    </StudentLayout>
  );
}

// ==================== SUB-COMPONENTS ====================

function SessionsGrid({ 
  sessions, 
  loading, 
  emptyMessage, 
  emptySubtext,
  onRegister,
  onSessionClick,
  onJoin,
  registeringId,
  showRegisterButton,
  showJoinButton
}: {
  sessions: LiveSession[];
  loading: boolean;
  emptyMessage: string;
  emptySubtext: string;
  onRegister: (id: number, e: React.MouseEvent) => void;
  onSessionClick: (session: LiveSession) => void;
  onJoin: (session: LiveSession) => void;
  registeringId: number | null;
  showRegisterButton?: boolean;
  showJoinButton?: boolean;
}) {
  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
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

  const getCountdown = (scheduledAt: string) => {
    const now = new Date();
    const scheduled = new Date(scheduledAt);
    const diff = scheduled.getTime() - now.getTime();
    
    if (diff <= 0) return "Starting now";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#151515] border border-[#2a2a2a] rounded-xl h-[280px] animate-pulse" />
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-12 text-center">
        <div className="text-[48px] mb-4">🎥</div>
        <p className="text-[#888] text-[14px]">{emptyMessage}</p>
        <p className="text-[#555] text-[12px] mt-1">{emptySubtext}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sessions.map((session) => (
        <div
          key={session.id}
          onClick={() => onSessionClick(session)}
          className="bg-[#151515] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#3a3a3a] transition-colors cursor-pointer"
        >
          {/* Session Header */}
          <div
            className={`h-[100px] flex items-center justify-center relative ${
              session.status === "live"
                ? "bg-gradient-to-br from-[rgba(0,207,255,0.15)] to-[rgba(0,207,255,0.05)]"
                : "bg-[#0f0f0f]"
            }`}
          >
            <div className="text-[48px]">
              {session.status === "live" ? "🔴" : "🎥"}
            </div>
            <div className="absolute top-3 right-3">
              <span className={`px-2 py-0.5 rounded text-[10px] ${
                session.status === "live" ? "bg-[rgba(0,207,255,0.15)] text-[#00cfff]" :
                session.status === "scheduled" ? "bg-[rgba(191,255,0,0.1)] text-[#bfff00]" :
                "bg-[#2a2a2a] text-[#888]"
              }`}>
                {session.status === "live" ? "LIVE" : session.status === "scheduled" ? "Upcoming" : session.status}
              </span>
            </div>
            {session.level && (
              <div className="absolute bottom-3 left-3">
                <span className="text-[10px] font-semibold uppercase text-[#888]">
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
              {session.language_name && (
                <>
                  <span className="text-[#555] text-[10px]">·</span>
                  <span className="text-[#888] text-[11px]">{session.language_name}</span>
                </>
              )}
            </div>

            {/* Time + Participants */}
            <div className="flex items-center justify-between text-[11px] text-[#555] mb-4">
              <span>{formatTime(session.scheduled_at)}</span>
              <span>
                {session.status === "live"
                  ? `${session.current_viewers || 0} watching`
                  : `${session.enrolled_count || 0} registered`}
              </span>
            </div>

            {/* Countdown for upcoming */}
            {session.status === "scheduled" && (
              <div className="text-[#bfff00] text-[11px] mb-3">
                ⏰ {getCountdown(session.scheduled_at)}
              </div>
            )}

            {/* Action Button */}
            {session.status === "live" ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onJoin(session);
                }}
                className="w-full bg-[#00cfff] text-black text-[12px] font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity"
              >
                🔴 Join Live Session
              </button>
            ) : session.status === "scheduled" ? (
              <button
                onClick={(e) => onRegister(session.id, e)}
                disabled={registeringId === session.id || session.is_registered}
                className={`w-full text-[12px] font-semibold py-2.5 rounded-lg transition-all ${
                  session.is_registered
                    ? "bg-[rgba(191,255,0,0.1)] text-[#bfff00] border border-[rgba(191,255,0,0.3)]"
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
  );
}

function MeetingsGrid({
  meetings,
  pendingMeetings,
  acceptedMeetings,
  loading,
  onRespond,
  onJoin,
  onCancel,
  onMeetingClick
}: {
  meetings: Meeting[];
  pendingMeetings: Meeting[];
  acceptedMeetings: Meeting[];
  loading: boolean;
  onRespond: (meeting: Meeting) => void;
  onJoin: (meeting: Meeting) => void;
  onCancel: (meetingId: number) => void;
  onMeetingClick: (meeting: Meeting) => void;
}) {
  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "TBD";
    const date = new Date(dateStr);
    return date.toLocaleString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCountdown = (scheduledAt: string | null) => {
    if (!scheduledAt) return "";
    const now = new Date();
    const scheduled = new Date(scheduledAt);
    const diff = scheduled.getTime() - now.getTime();
    
    if (diff <= 0) return "Starting now";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `In ${hours}h ${minutes}m`;
    return `In ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#151515] border border-[#2a2a2a] rounded-xl h-[280px] animate-pulse" />
        ))}
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-12 text-center">
        <div className="text-[48px] mb-4">📬</div>
        <p className="text-[#888] text-[14px]">No meeting invitations</p>
        <p className="text-[#555] text-[12px] mt-1">Your instructors will invite you to meetings here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Invitations */}
      {pendingMeetings.length > 0 && (
        <div>
          <h3 className="text-white font-semibold text-[16px] mb-3 flex items-center gap-2">
            <span>📩</span> Pending Invitations ({pendingMeetings.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingMeetings.map((meeting) => (
              <div
                key={meeting.id}
                onClick={() => onMeetingClick(meeting)}
                className="bg-[#151515] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#bfff00] transition-colors cursor-pointer"
              >
                <div className="h-[100px] flex items-center justify-center relative bg-[#0f0f0f]">
                  <div className="text-[48px]">📩</div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[rgba(191,255,0,0.1)] text-[#bfff00]">
                      Pending
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-[14px] mb-2 line-clamp-2">
                    {meeting.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-[20px] h-[20px] rounded-full flex items-center justify-center text-[8px] font-bold text-black"
                      style={{ background: "linear-gradient(135deg, #bfff00, #8fef00)" }}
                    >
                      {getInitials(meeting.organizer_name)}
                    </div>
                    <span className="text-[#888] text-[11px]">{meeting.organizer_name}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#555] mb-3">
                    <span>{formatTime(meeting.scheduled_at)}</span>
                    <span>{meeting.duration_minutes} min</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRespond(meeting);
                    }}
                    className="w-full bg-[#bfff00] text-black text-[12px] font-semibold py-2 rounded-lg hover:opacity-90"
                  >
                    Respond to Invitation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accepted Meetings */}
      {acceptedMeetings.length > 0 && (
        <div>
          <h3 className="text-white font-semibold text-[16px] mb-3 flex items-center gap-2">
            <span>✓</span> Your Meetings ({acceptedMeetings.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {acceptedMeetings.map((meeting) => {
              const isLive = meeting.scheduled_at && new Date(meeting.scheduled_at) <= new Date(Date.now() + 30 * 60000);
              
              return (
                <div
                  key={meeting.id}
                  onClick={() => onMeetingClick(meeting)}
                  className="bg-[#151515] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#3a3a3a] transition-colors cursor-pointer"
                >
                  <div className="h-[100px] flex items-center justify-center relative bg-[#0f0f0f]">
                    <div className="text-[48px]">{isLive ? "🔴" : "📅"}</div>
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        isLive ? "bg-[rgba(0,207,255,0.15)] text-[#00cfff]" :
                        "bg-green-500/20 text-green-400"
                      }`}>
                        {isLive ? "LIVE SOON" : "Confirmed"}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-[14px] mb-2 line-clamp-2">
                      {meeting.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-[20px] h-[20px] rounded-full flex items-center justify-center text-[8px] font-bold text-black"
                        style={{ background: "linear-gradient(135deg, #bfff00, #8fef00)" }}
                      >
                        {getInitials(meeting.organizer_name)}
                      </div>
                      <span className="text-[#888] text-[11px]">{meeting.organizer_name}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#555] mb-2">
                      <span>{formatTime(meeting.scheduled_at)}</span>
                      <span>{meeting.duration_minutes} min</span>
                    </div>
                    {meeting.scheduled_at && (
                      <div className="text-[#bfff00] text-[11px] mb-3">
                        ⏰ {getCountdown(meeting.scheduled_at)}
                      </div>
                    )}
                    
                    {isLive ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onJoin(meeting);
                        }}
                        className="w-full bg-[#00cfff] text-black text-[12px] font-semibold py-2 rounded-lg hover:opacity-90"
                      >
                        🔴 Join Now
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onJoin(meeting);
                          }}
                          className="flex-1 bg-[#bfff00] text-black text-[12px] font-semibold py-2 rounded-lg hover:opacity-90"
                        >
                          View Details
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCancel(meeting.id);
                          }}
                          className="px-3 bg-red-500/20 text-red-400 text-[12px] rounded-lg hover:bg-red-500/30"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SessionDetailsModal({
  session,
  onClose,
  onRegister,
  onJoin,
  registering
}: {
  session: LiveSession;
  onClose: () => void;
  onRegister: () => void;
  onJoin: () => void;
  registering: boolean;
}) {
  const formatFullDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }) + " at " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getCountdown = (scheduledAt: string) => {
    const now = new Date();
    const scheduled = new Date(scheduledAt);
    const diff = scheduled.getTime() - now.getTime();
    
    if (diff <= 0) return "Starting now";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} days, ${hours} hours`;
    if (hours > 0) return `${hours} hours, ${minutes} minutes`;
    return `${minutes} minutes`;
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl w-[500px] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-start">
          <div>
            <h3 className="text-white font-semibold text-[18px]">{session.title}</h3>
            <p className="text-[#888] text-[13px] mt-1">{session.language_name} • {session.level}</p>
          </div>
          <button onClick={onClose} className="text-[#888] hover:text-white text-[24px]">×</button>
        </div>
        
        <div className="p-6 space-y-4">
          {session.description && (
            <div>
              <label className="text-[#888] text-[12px]">Description</label>
              <p className="text-white text-[14px] mt-1">{session.description}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#888] text-[12px]">Date & Time</label>
              <p className="text-white text-[14px] mt-1">{formatFullDate(session.scheduled_at)}</p>
            </div>
            <div>
              <label className="text-[#888] text-[12px]">Duration</label>
              <p className="text-white text-[14px] mt-1">{session.duration_minutes || session.duration_min || 60} minutes</p>
            </div>
          </div>
          
          <div>
            <label className="text-[#888] text-[12px]">Instructor</label>
            <div className="flex items-center gap-2 mt-1">
              <div
                className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[12px] font-bold text-black"
                style={{ background: "linear-gradient(135deg, #bfff00, #8fef00)" }}
              >
                {session.instructor_name?.[0] || "?"}
              </div>
              <span className="text-white text-[14px]">{session.instructor_name || "Instructor"}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#888] text-[12px]">Registered</label>
              <p className="text-white text-[14px] mt-1">{session.enrolled_count || 0} students</p>
            </div>
            <div>
              <label className="text-[#888] text-[12px]">Max Participants</label>
              <p className="text-white text-[14px] mt-1">{session.max_participants || "Unlimited"}</p>
            </div>
          </div>
          
          {session.status === "scheduled" && (
            <div className="bg-[#0f0f0f] rounded-lg p-4">
              <label className="text-[#888] text-[12px]">Starts in</label>
              <p className="text-[#bfff00] text-[18px] font-semibold mt-1">{getCountdown(session.scheduled_at)}</p>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-[#2a2a2a] flex gap-3">
          <button onClick={onClose} className="flex-1 bg-[#2a2a2a] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#333]">
            Close
          </button>
          {session.status === "live" ? (
            <button onClick={onJoin} className="flex-1 bg-[#00cfff] text-black px-5 py-3 rounded-lg font-semibold hover:opacity-90">
              🔴 Join Live
            </button>
          ) : session.status === "scheduled" ? (
            <button 
              onClick={onRegister} 
              disabled={registering || session.is_registered}
              className={`flex-1 px-5 py-3 rounded-lg font-semibold ${
                session.is_registered
                  ? "bg-[rgba(191,255,0,0.1)] text-[#bfff00] border border-[rgba(191,255,0,0.3)]"
                  : "bg-[#bfff00] text-black hover:opacity-90"
              } disabled:opacity-50`}
            >
              {session.is_registered ? "✓ Registered" : "Register"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MeetingDetailsModal({
  meeting,
  onClose,
  onRespond,
  onJoin,
  onCancel
}: {
  meeting: Meeting;
  onClose: () => void;
  onRespond: () => void;
  onJoin: () => void;
  onCancel: () => void;
}) {
  const formatFullDate = (dateStr: string | null) => {
    if (!dateStr) return "TBD";
    const date = new Date(dateStr);
    return date.toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }) + " at " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getCountdown = (scheduledAt: string | null) => {
    if (!scheduledAt) return "";
    const now = new Date();
    const scheduled = new Date(scheduledAt);
    const diff = scheduled.getTime() - now.getTime();
    
    if (diff <= 0) return "Starting now";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours} hours, ${minutes} minutes`;
    return `${minutes} minutes`;
  };

  const isLive = meeting.scheduled_at && new Date(meeting.scheduled_at) <= new Date(Date.now() + 30 * 60000);
  const canJoin = meeting.response === "accepted" && (isLive || meeting.meeting_link);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl w-[500px] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-start">
          <div>
            <h3 className="text-white font-semibold text-[18px]">{meeting.title}</h3>
            <p className="text-[#888] text-[13px] mt-1">{meeting.meeting_type} • {meeting.organizer_name}</p>
          </div>
          <button onClick={onClose} className="text-[#888] hover:text-white text-[24px]">×</button>
        </div>
        
        <div className="p-6 space-y-4">
          {meeting.description && (
            <div>
              <label className="text-[#888] text-[12px]">Description</label>
              <p className="text-white text-[14px] mt-1">{meeting.description}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#888] text-[12px]">Date & Time</label>
              <p className="text-white text-[14px] mt-1">{formatFullDate(meeting.scheduled_at)}</p>
            </div>
            <div>
              <label className="text-[#888] text-[12px]">Duration</label>
              <p className="text-white text-[14px] mt-1">{meeting.duration_minutes} minutes</p>
            </div>
          </div>
          
          <div>
            <label className="text-[#888] text-[12px]">Organizer</label>
            <div className="flex items-center gap-2 mt-1">
              <div
                className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[12px] font-bold text-black"
                style={{ background: "linear-gradient(135deg, #bfff00, #8fef00)" }}
              >
                {meeting.organizer_name?.[0] || "?"}
              </div>
              <span className="text-white text-[14px]">{meeting.organizer_name}</span>
            </div>
          </div>
          
          {meeting.meeting_link && (
            <div>
              <label className="text-[#888] text-[12px]">Meeting Link</label>
              <a 
                href={meeting.meeting_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#00cfff] text-[14px] mt-1 block hover:underline"
              >
                {meeting.meeting_link}
              </a>
            </div>
          )}
          
          {meeting.scheduled_at && (
            <div className="bg-[#0f0f0f] rounded-lg p-4">
              <label className="text-[#888] text-[12px]">
                {meeting.response === "accepted" ? "Starts in" : "Scheduled for"}
              </label>
              <p className={`text-[18px] font-semibold mt-1 ${meeting.response === "accepted" ? "text-[#bfff00]" : "text-white"}`}>
                {getCountdown(meeting.scheduled_at)}
              </p>
            </div>
          )}
          
          <div>
            <label className="text-[#888] text-[12px]">Your Response</label>
            <p className={`text-[14px] mt-1 ${
              meeting.response === "accepted" ? "text-green-400" :
              meeting.response === "declined" ? "text-red-400" :
              "text-[#bfff00]"
            }`}>
              {meeting.response === "accepted" ? "✓ Accepted" :
               meeting.response === "declined" ? "✕ Declined" :
               "⏳ Pending"}
            </p>
          </div>
        </div>
        
        <div className="p-6 border-t border-[#2a2a2a] flex gap-3">
          <button onClick={onClose} className="flex-1 bg-[#2a2a2a] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#333]">
            Close
          </button>
          
          {!meeting.response && meeting.status === "scheduled" && (
            <button onClick={onRespond} className="flex-1 bg-[#bfff00] text-black px-5 py-3 rounded-lg font-semibold hover:opacity-90">
              Respond
            </button>
          )}
          
          {canJoin && (
            <button onClick={onJoin} className="flex-1 bg-[#00cfff] text-black px-5 py-3 rounded-lg font-semibold hover:opacity-90">
              {isLive ? "🔴 Join Now" : "Join Meeting"}
            </button>
          )}
          
          {meeting.response === "accepted" && !isLive && (
            <button onClick={onCancel} className="px-4 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30">
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ResponseModal({
  meeting,
  responseChoice,
  setResponseChoice,
  responseNote,
  setResponseNote,
  onConfirm,
  onCancel,
  loading
}: {
  meeting: Meeting;
  responseChoice: "accepted" | "declined" | null;
  setResponseChoice: (choice: "accepted" | "declined" | null) => void;
  responseNote: string;
  setResponseNote: (note: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "TBD";
    return new Date(dateStr).toLocaleString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl w-[450px]" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-[#2a2a2a]">
          <h3 className="text-white font-semibold text-[18px]">Meeting Invitation</h3>
        </div>
        
        <div className="p-6">
          <div className="bg-[#0f0f0f] rounded-lg p-4 mb-6">
            <h4 className="text-white font-semibold text-[16px] mb-2">{meeting.title}</h4>
            {meeting.description && (
              <p className="text-[#888] text-[13px] mb-3">{meeting.description}</p>
            )}
            <div className="flex items-center gap-4 text-[#555] text-[12px]">
              <span>📅 {formatTime(meeting.scheduled_at)}</span>
              <span>⏱ {meeting.duration_minutes} min</span>
            </div>
            <div className="mt-2 text-[#888] text-[12px]">
              From: {meeting.organizer_name}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-white text-[13px] font-medium mb-3 block">
              Will you attend?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setResponseChoice("accepted")}
                className={`p-4 rounded-lg border text-[14px] font-medium transition-colors ${
                  responseChoice === "accepted"
                    ? "border-[#bfff00] bg-[#bfff00]/10 text-[#bfff00]"
                    : "border-[#2a2a2a] text-[#888] hover:border-[#3a3a3a]"
                }`}
              >
                ✓ Yes, I will attend
              </button>
              <button
                onClick={() => setResponseChoice("declined")}
                className={`p-4 rounded-lg border text-[14px] font-medium transition-colors ${
                  responseChoice === "declined"
                    ? "border-red-500 bg-red-500/10 text-red-400"
                    : "border-[#2a2a2a] text-[#888] hover:border-[#3a3a3a]"
                }`}
              >
                ✕ No, I won't be available
              </button>
            </div>
          </div>

          <div>
            <label className="text-white text-[13px] font-medium mb-2 block">
              Add a note (optional)
            </label>
            <textarea
              value={responseNote}
              onChange={(e) => setResponseNote(e.target.value)}
              placeholder="Optional message for the instructor..."
              rows={2}
              className="w-full bg-[#0f0f0f] text-white rounded-lg px-4 py-3 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors text-[13px] resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-[#2a2a2a] flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-[#2a2a2a] text-white px-5 py-3 rounded-lg font-semibold text-[14px] hover:bg-[#333]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!responseChoice || loading}
            className="flex-1 bg-[#bfff00] text-black px-5 py-3 rounded-lg font-semibold text-[14px] disabled:opacity-50 hover:opacity-90"
          >
            {loading ? "Sending..." : "Confirm Response"}
          </button>
        </div>
      </div>
    </div>
  );
}
