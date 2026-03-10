import { useState, useEffect } from "react";
import { instructorApi, sessionApi, usersApi } from "../app/api/config";
import LiveKitRoom from "./LiveKitRoom";
import InstructorLayout from "../app/components/InstructorLayout";
import { toast } from "sonner";

interface Meeting {
  id: number;
  title: string;
  description?: string;
  meeting_type: string;
  scheduled_at: string;
  duration_minutes: number;
  timezone: string;
  meeting_link?: string;
  meeting_platform?: string;
  status: string;
  invitee_count: number;
  invitees?: { id: number; name: string; email: string }[];
  group_name?: string;
  reason?: string;
  created_at?: string;
}

interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
  avatar_url: string | null;
}

export default function InstructorLiveSessions() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeLiveKitSession, setActiveLiveKitSession] = useState<{
    roomName: string;
    sessionId?: number;
    title: string;
  } | null>(null);
  
  // Form state
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDescription, setMeetingDescription] = useState("");
  const [meetingType, setMeetingType] = useState("individual");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [customDuration, setCustomDuration] = useState<number | null>(null);
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingPlatform, setMeetingPlatform] = useState("zoom");
  const [selectedInvitees, setSelectedInvitees] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [liveKitSessions, setLiveKitSessions] = useState<any[]>([]);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);

  useEffect(() => {
    fetchMeetings();
  }, []);

  // Also fetch LiveKit sessions
  useEffect(() => {
    if (showCreateModal && allUsers.length === 0) {
      loadAllUsers();
    }
    // Load LiveKit sessions
    fetchLiveKitSessions();
  }, [showCreateModal]);

  const fetchLiveKitSessions = async () => {
    try {
      const result = await sessionApi.listSessions({ limit: 50 });
      setLiveKitSessions(result.sessions || []);
    } catch (err) {
      console.error("Failed to load LiveKit sessions:", err);
    }
  };

  // Filter users
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults(allUsers);
    } else {
      const filtered = allUsers.filter(
        (u) =>
          u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchQuery, allUsers]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const result = await instructorApi.getMeetings({ limit: 50 });
      setMeetings(result.meetings || []);
    } catch (err: any) {
      setError(err.message || "Failed to load meetings");
    } finally {
      setLoading(false);
    }
  };

  const loadAllUsers = async () => {
    try {
      const res = await instructorApi.getAllUsers({ limit: 100 });
      const otherUsers = (res.users || []).filter((u: User) => u.id !== 4); // Exclude self
      setAllUsers(otherUsers);
      setSearchResults(otherUsers);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  const handleCreateMeeting = async () => {
    if (!meetingTitle.trim()) {
      toast.error("Please enter a meeting title");
      return;
    }
    if (!scheduledDate || !scheduledTime) {
      toast.error("Please select date and time");
      return;
    }

    const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
    
    setCreating(true);
    try {
      // If editing, update the meeting
      if (editingMeeting) {
        // Note: Backend may not have PATCH endpoint yet, but we try
        try {
          await instructorApi.updateMeeting(editingMeeting.id, {
            title: meetingTitle,
            description: meetingDescription,
            meeting_type: meetingType,
            scheduled_at: scheduledAt,
            duration_minutes: duration,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            meeting_link: meetingLink || undefined,
            meeting_platform: meetingLink ? meetingPlatform : undefined,
            invitee_ids: meetingType === "individual" || meetingType === "group" 
              ? selectedInvitees.map(u => u.id) 
              : undefined,
          });
          toast.success("Live session updated!");
        } catch (updateErr: any) {
          console.error("Failed to update meeting:", updateErr);
          toast.error(updateErr.message || "Failed to update meeting - backend may not support updates yet");
        }
      } else {
        // Create new meeting with LiveKit session
        // First create the LiveKit session
        let liveKitSessionId: number | undefined;
        try {
          const languagesResult = await usersApi.getLanguages();
          const defaultLang = languagesResult.languages?.find((l: any) => l.code === 'en') || languagesResult.languages?.[0];
          
          const sessionResult = await sessionApi.createSession({
            title: meetingTitle,
            description: meetingDescription,
            language_id: defaultLang?.id || 1,
            level: "beginner",
            scheduled_at: scheduledAt,
            duration_minutes: duration,
            max_participants: 100,
          });
          liveKitSessionId = sessionResult.session?.id;
          console.log("Created LiveKit session:", sessionResult);
        } catch (lkErr) {
          console.error("Failed to create LiveKit session:", lkErr);
          // Continue without LiveKit - it's optional
        }

        // Then create the meeting record
        await instructorApi.createMeeting({
          title: meetingTitle,
          description: meetingDescription,
          meeting_type: meetingType,
          scheduled_at: scheduledAt,
          duration_minutes: duration,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          meeting_link: meetingLink || undefined,
          meeting_platform: meetingLink ? meetingPlatform : undefined,
          invitee_ids: meetingType === "individual" || meetingType === "group" 
            ? selectedInvitees.map(u => u.id) 
            : undefined,
        });
        
        toast.success("Live session scheduled with LiveKit!");
      }
      
      setShowCreateModal(false);
      resetForm();
      fetchMeetings();
      fetchLiveKitSessions();
    } catch (err: any) {
      toast.error(err.message || "Failed to process meeting");
    } finally {
      setCreating(false);
    }
  };

  const handleCancelMeeting = async (meetingId: number) => {
    if (!confirm("Are you sure you want to cancel this meeting?")) return;
    
    try {
      await instructorApi.cancelMeeting(meetingId);
      toast.success("Meeting cancelled");
      fetchMeetings();
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel meeting");
    }
  };

  const resetForm = () => {
    setMeetingTitle("");
    setMeetingDescription("");
    setMeetingType("individual");
    setScheduledDate("");
    setScheduledTime("");
    setDuration(60);
    setCustomDuration(null);
    setMeetingLink("");
    setMeetingPlatform("zoom");
    setSelectedInvitees([]);
    setSearchQuery("");
  };

  const addInvitee = (user: User) => {
    if (!selectedInvitees.find(u => u.id === user.id)) {
      setSelectedInvitees([...selectedInvitees, user]);
    }
    setSearchQuery("");
  };

  const removeInvitee = (userId: number) => {
    setSelectedInvitees(selectedInvitees.filter(u => u.id !== userId));
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "bg-blue-500/20 text-blue-400";
      case "confirmed":
        return "bg-green-500/20 text-green-400";
      case "declined":
        return "bg-red-500/20 text-red-400";
      case "cancelled":
        return "bg-[#2a2a2a] text-[#888]";
      case "completed":
        return "bg-[#2a2a2a] text-[#888]";
      default:
        return "bg-[#2a2a2a] text-[#888]";
    }
  };

  const filteredMeetings = meetings.filter(m => {
    if (filter === "all") return true;
    return m.status.toLowerCase() === filter;
  });

  const handleStartLiveKit = (meeting: any) => {
    setActiveLiveKitSession({
      roomName: meeting.room_name || `meeting-${meeting.id}`,
      sessionId: meeting.id,
      title: meeting.title,
    });
  };

  const handleLeaveLiveKit = () => {
    setActiveLiveKitSession(null);
    fetchLiveKitSessions();
    fetchMeetings();
  };

  const handleEditMeeting = (meeting: any) => {
    // Populate form with meeting data for editing
    setMeetingTitle(meeting.title || "");
    setMeetingDescription(meeting.description || "");
    setMeetingType(meeting.meeting_type || "individual");
    
    // Parse date and time from scheduled_at
    if (meeting.scheduled_at) {
      const date = new Date(meeting.scheduled_at);
      setScheduledDate(date.toISOString().split('T')[0]);
      setScheduledTime(date.toTimeString().slice(0, 5));
    }
    
    setDuration(meeting.duration_minutes || 60);
    setMeetingLink(meeting.meeting_link || "");
    setMeetingPlatform(meeting.meeting_platform || "zoom");
    
    // Set editing state
    setEditingMeeting(meeting);
    setShowCreateModal(true);
  };

  return (
    <InstructorLayout title="Live Sessions" subtitle="Schedule and manage live teaching sessions">
      {/* Active LiveKit Session */}
      {activeLiveKitSession && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-semibold">
              🔴 Live: {activeLiveKitSession.title}
            </h2>
            <button
              onClick={() => setActiveLiveKitSession(null)}
              className="text-[#888] hover:text-white"
            >
              ✕ Close
            </button>
          </div>
          <LiveKitRoom
            roomName={activeLiveKitSession.roomName}
            sessionId={activeLiveKitSession.sessionId}
            isHost={true}
            onLeave={handleLeaveLiveKit}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {["all", "scheduled", "completed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                filter === f
                  ? "bg-[#bfff00] text-black"
                  : "bg-[#1a1a1a] text-[#888] hover:text-white"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#bfff00] text-black px-5 py-2.5 rounded-lg font-semibold text-[14px] hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span>🎥</span>
          New Live Session
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-[#bfff00] text-xl">Loading...</div>
        </div>
      ) : error ? (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-[8px] mb-6">
          {error}
        </div>
      ) : (
        <>
          {/* LiveKit Sessions Section */}
          {liveKitSessions.length > 0 && (
            <div className="mb-8">
              <h3 className="text-white text-lg font-semibold mb-4">LiveKit Sessions</h3>
              <div className="grid gap-4">
                {liveKitSessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 hover:border-[#3a3a3a] transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-semibold text-[16px]">{session.title}</h3>
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                              session.status === "live" 
                                ? "bg-red-500/20 text-red-400" 
                                : session.status === "scheduled"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-[#2a2a2a] text-[#888]"
                            }`}
                          >
                            {session.status}
                          </span>
                        </div>
                        {session.description && (
                          <p className="text-[#888] text-[13px] mb-3">{session.description}</p>
                        )}
                        <div className="flex items-center gap-6 text-[#555] text-[13px] flex-wrap">
                          <span>📅 {formatDate(session.scheduled_at)}</span>
                          <span>⏱ {session.duration_minutes} min</span>
                          <span>👥 {session.enrolled_count || 0} enrolled</span>
                          {session.room_name && (
                            <span className="text-[#bfff00]">🎥 LiveKit</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {session.status === "scheduled" || session.status === "live" ? (
                          <button
                            onClick={() => handleStartLiveKit(session)}
                            className="bg-[#bfff00] text-black px-4 py-2 rounded-lg font-semibold text-[13px] hover:opacity-90 transition-opacity"
                          >
                            {session.status === "live" ? "Join Live" : "Start Live"}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Meetings Section */}
          {filteredMeetings.length === 0 && liveKitSessions.length === 0 ? (
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-12 text-center">
              <div className="text-[48px] mb-4">🎥</div>
              <h3 className="text-white text-[18px] font-semibold mb-2">
                No live sessions found
              </h3>
              <p className="text-[#888] text-[14px] mb-6">
                Schedule a live session to connect with your students.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#bfff00] text-black px-6 py-3 rounded-lg font-semibold text-[14px] hover:opacity-90 transition-opacity"
              >
                Schedule First Live Session
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 hover:border-[#3a3a3a] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-semibold text-[16px]">
                          {meeting.title}
                        </h3>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(meeting.status)}`}
                        >
                          {meeting.status}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-[rgba(191,255,0,0.1)] text-[#bfff00]">
                          {meeting.meeting_type}
                        </span>
                      </div>
                      {meeting.description && (
                        <p className="text-[#888] text-[13px] mb-3">
                          {meeting.description}
                        </p>
                      )}
                      <div className="flex items-center gap-6 text-[#555] text-[13px] flex-wrap">
                        <span>📅 {formatDate(meeting.scheduled_at)}</span>
                        <span>⏱ {meeting.duration_minutes} min</span>
                        <span>👥 {meeting.invitee_count} invited</span>
                        {meeting.group_name && (
                          <span className="text-[#bfff00]">📢 {meeting.group_name}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      {/* Start Live Button - for all meetings */}
                      <button
                        onClick={() => handleStartLiveKit(meeting)}
                        className="bg-[#bfff00] text-black px-4 py-2 rounded-lg font-semibold text-[13px] hover:opacity-90 transition-opacity flex items-center gap-1"
                      >
                        📹 {meeting.status === "scheduled" ? "Start Live" : "Join Live"}
                      </button>
                      
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEditMeeting(meeting)}
                        className="bg-[#2a2a2a] text-white px-4 py-2 rounded-lg font-medium text-[13px] hover:bg-[#3a3a3a] transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      
                      {/* Cancel Button */}
                      {meeting.status === "scheduled" && (
                        <button
                          onClick={() => handleCancelMeeting(meeting.id)}
                          className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-medium text-[13px] hover:bg-red-500/30 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Meeting Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#2a2a2a]">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-[18px]">
                  {editingMeeting ? "Edit Live Session" : "Schedule LiveKit Session"}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="text-[#888] hover:text-white text-[24px]"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Meeting Title */}
              <div>
                <label className="text-white text-[13px] font-medium mb-2 block">Meeting Title *</label>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="e.g., French Conversation Practice"
                  className="w-full bg-[#0f0f0f] text-white rounded-lg px-4 py-3 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors text-[14px]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-white text-[13px] font-medium mb-2 block">Description</label>
                <textarea
                  value={meetingDescription}
                  onChange={(e) => setMeetingDescription(e.target.value)}
                  placeholder="What will this session cover?"
                  rows={2}
                  className="w-full bg-[#0f0f0f] text-white rounded-lg px-4 py-3 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors text-[14px] resize-none"
                />
              </div>

              {/* Meeting Type */}
              <div>
                <label className="text-white text-[13px] font-medium mb-2 block">Meeting Type *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "individual", label: "One-on-One", icon: "👤" },
                    { value: "group", label: "Group", icon: "👥" },
                    { value: "all_students", label: "All Students", icon: "📚" },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setMeetingType(type.value)}
                      className={`p-3 rounded-lg border text-[13px] font-medium transition-colors ${
                        meetingType === type.value
                          ? "border-[#bfff00] bg-[#bfff00]/10 text-[#bfff00]"
                          : "border-[#2a2a2a] text-[#888] hover:border-[#3a3a3a]"
                      }`}
                    >
                      <span className="block text-lg mb-1">{type.icon}</span>
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-[13px] font-medium mb-2 block">Date *</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-[#0f0f0f] text-white rounded-lg px-4 py-3 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors text-[14px]"
                  />
                </div>
                <div>
                  <label className="text-white text-[13px] font-medium mb-2 block">Time *</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full bg-[#0f0f0f] text-white rounded-lg px-4 py-3 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors text-[14px]"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="text-white text-[13px] font-medium mb-2 block">Duration</label>
                <div className="flex gap-2">
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="flex-1 bg-[#0f0f0f] text-white rounded-lg px-4 py-3 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors text-[14px]"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                    <option value={0}>Custom</option>
                  </select>
                  {duration === 0 && (
                    <input
                      type="number"
                      min={1}
                      max={480}
                      value={customDuration || ''}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCustomDuration(val);
                        if (val > 0) setDuration(val);
                      }}
                      placeholder="Enter minutes"
                      aria-label="Custom duration in minutes"
                      title="Enter custom duration in minutes"
                      className="w-28 bg-[#0f0f0f] text-white rounded-lg px-4 py-3 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors text-[14px]"
                    />
                  )}
                </div>
              </div>

              {/* Invitees (for individual/group) */}
              {(meetingType === "individual" || meetingType === "group") && (
                <div>
                  <label className="text-white text-[13px] font-medium mb-2 block">
                    Invite Participants
                  </label>
                  
                  {/* Selected invitees */}
                  {selectedInvitees.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedInvitees.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-2 bg-[#0f0f0f] px-3 py-1.5 rounded-full"
                        >
                          <span className="text-white text-[12px]">{user.full_name}</span>
                          <button
                            onClick={() => removeInvitee(user.id)}
                            className="text-[#888] hover:text-white text-[14px]"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Search - show all users on focus */}
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchResults(allUsers)}
                    placeholder="Search for participants..."
                    className="w-full bg-[#0f0f0f] text-white rounded-lg px-4 py-3 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors text-[14px] mb-2"
                  />

                  {/* Search results - always show when focused or has query */}
                  {(searchQuery || searchResults.length > 0) && (
                    <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg max-h-48 overflow-y-auto">
                      {searchResults
                        .filter((u) => !selectedInvitees.find((s) => s.id === u.id))
                        .slice(0, 8)
                        .map((user) => (
                          <button
                            key={user.id}
                            onClick={() => addInvitee(user)}
                            className="w-full p-3 text-left hover:bg-[#151515] flex items-center gap-3 border-b border-[#2a2a2a] last:border-0"
                          >
                            <div className="w-8 h-8 rounded-full bg-[#bfff00] flex items-center justify-center text-black font-bold text-[12px]">
                              {user.full_name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-white text-[13px]">{user.full_name}</p>
                              <p className="text-[#888] text-[11px]">{user.email}</p>
                            </div>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Meeting Link - Optional for backup */}
              <div>
                <label className="text-white text-[13px] font-medium mb-2 block">
                  External Meeting Link (Optional - for backup)
                </label>
                <div className="flex gap-2">
                  <select
                    value={meetingPlatform}
                    onChange={(e) => setMeetingPlatform(e.target.value)}
                    className="bg-[#0f0f0f] text-white rounded-lg px-3 py-3 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors text-[14px]"
                  >
                    <option value="zoom">Zoom</option>
                    <option value="google_meet">Google Meet</option>
                    <option value="teams">Microsoft Teams</option>
                    <option value="custom">Custom Link</option>
                  </select>
                  <input
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-[#0f0f0f] text-white rounded-lg px-4 py-3 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors text-[14px]"
                  />
                </div>
                <p className="text-[#888] text-[11px] mt-1">
                  💡 Leave empty - LiveKit will generate a room automatically
                </p>
              </div>
            </div>

            {/* Footer with both buttons in a flex container */}
            <div className="p-6 border-t border-[#2a2a2a] flex gap-3">
              {editingMeeting && (
                <button
                  onClick={() => {
                    setEditingMeeting(null);
                    setMeetingTitle("");
                    setMeetingDescription("");
                    setMeetingType("individual");
                    setScheduledDate("");
                    setScheduledTime("");
                    setDuration(60);
                    setCustomDuration(null);
                    setMeetingLink("");
                    setMeetingPlatform("zoom");
                    setSelectedInvitees([]);
                    setSearchQuery("");
                  }}
                  className="flex-1 bg-[#2a2a2a] text-white px-5 py-3 rounded-lg font-semibold text-[14px] hover:bg-[#333] transition-colors"
                >
                  Cancel Edit
                </button>
              )}
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className={`${editingMeeting ? '' : 'flex-1'} bg-[#2a2a2a] text-white px-5 py-3 rounded-lg font-semibold text-[14px] hover:bg-[#333] transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateMeeting}
                disabled={creating || !meetingTitle || !scheduledDate || !scheduledTime}
                className={`${editingMeeting ? 'flex-1' : 'flex-1'} bg-[#bfff00] text-black px-5 py-3 rounded-lg font-semibold text-[14px] disabled:opacity-50 hover:opacity-90 transition-opacity`}
              >
                {creating ? "Saving..." : editingMeeting ? "Update Live Session" : "Schedule Live Session"}
              </button>
            </div>
          </div>
        </div>
      )}
    </InstructorLayout>
  );
}
