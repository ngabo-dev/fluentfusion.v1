import { useState, useEffect } from "react";
import { liveSessionsApi } from "../app/api/config";
import InstructorLayout from "../app/components/InstructorLayout";

interface LiveSession {
  id: number;
  title: string;
  description?: string;
  language?: string;
  scheduled_at: string;
  duration_minutes?: number;
  status: string;
  registered_count?: number;
  max_participants?: number;
  join_url?: string;
}

export default function InstructorLiveSessions() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const result = await liveSessionsApi.getSessions({ limit: 50 });
        setSessions(result.sessions || []);
      } catch (err: any) {
        setError(err.message || "Failed to load live sessions");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

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
      case "live":
      case "active":
        return "bg-green-500/20 text-green-400";
      case "scheduled":
        return "bg-blue-500/20 text-blue-400";
      case "ended":
      case "completed":
        return "bg-[#2a2a2a] text-[#888]";
      default:
        return "bg-[#2a2a2a] text-[#888]";
    }
  };

  if (loading) {
    return (
      <InstructorLayout title="Live Sessions">
        <div className="flex items-center justify-center h-64">
          <div className="text-[#bfff00] text-xl">Loading...</div>
        </div>
      </InstructorLayout>
    );
  }

  return (
    <InstructorLayout
      title="Live Sessions"
      subtitle="Manage and join your scheduled live teaching sessions"
    >
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-[8px] mb-6">
          {error}
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-12 text-center">
          <div className="text-[48px] mb-4">🎥</div>
          <h3 className="text-white text-[18px] font-semibold mb-2">
            No live sessions yet
          </h3>
          <p className="text-[#888] text-[14px]">
            Live sessions will appear here once they are scheduled on the platform.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 flex items-center justify-between hover:border-[#3a3a3a] transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-white font-semibold text-[16px]">
                    {session.title}
                  </h3>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(session.status)}`}
                  >
                    {session.status}
                  </span>
                  {session.language && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[rgba(191,255,0,0.1)] text-[#bfff00]">
                      {session.language}
                    </span>
                  )}
                </div>
                {session.description && (
                  <p className="text-[#888] text-[13px] mb-3">
                    {session.description}
                  </p>
                )}
                <div className="flex items-center gap-6 text-[#555] text-[13px]">
                  <span>📅 {formatDate(session.scheduled_at)}</span>
                  {session.duration_minutes && (
                    <span>⏱ {session.duration_minutes} min</span>
                  )}
                  {session.registered_count !== undefined && (
                    <span>
                      👥 {session.registered_count}
                      {session.max_participants
                        ? ` / ${session.max_participants}`
                        : ""}{" "}
                      registered
                    </span>
                  )}
                </div>
              </div>

              {session.join_url &&
                (session.status === "live" || session.status === "active") && (
                  <a
                    href={session.join_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#bfff00] text-black px-5 py-2.5 rounded-[8px] font-semibold text-[14px] no-underline hover:bg-[#aeff00] transition-colors ml-4 shrink-0"
                  >
                    Join Now
                  </a>
                )}
            </div>
          ))}
        </div>
      )}
    </InstructorLayout>
  );
}
