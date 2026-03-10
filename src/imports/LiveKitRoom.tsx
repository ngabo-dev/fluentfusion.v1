import { useEffect, useState, useRef } from "react";
import { sessionApi } from "../app/api/config";
import { toast } from "sonner";

interface LiveKitRoomProps {
  roomName: string;
  sessionId?: number;
  isHost?: boolean;
  onLeave?: () => void;
}

export default function LiveKitRoom({ roomName, sessionId, isHost = false, onLeave }: LiveKitRoomProps) {
  const [isConnecting, setIsConnecting] = useState(true);
  const [tokenData, setTokenData] = useState<{
    token: string;
    livekit_url: string;
    room_name: string;
    identity: string;
    role: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Get token on mount
  useEffect(() => {
    const getToken = async () => {
      try {
        setIsConnecting(true);
        setError(null);
        
        const role = isHost ? "teacher" : "student";
        const data = await sessionApi.getToken(roomName, role);
        setTokenData(data);
      } catch (err: any) {
        console.error("Failed to get LiveKit token:", err);
        setError(err.message || "Failed to connect to live session");
        toast.error(err.message || "Failed to connect to live session");
      } finally {
        setIsConnecting(false);
      }
    };
    
    getToken();
  }, [roomName, isHost]);

  // Handle starting recording
  const handleStartRecording = async () => {
    if (!sessionId) {
      toast.error("No session ID provided");
      return;
    }
    
    try {
      await sessionApi.startRecording(sessionId);
      setIsRecording(true);
      toast.success("Recording started");
    } catch (err: any) {
      toast.error(err.message || "Failed to start recording");
    }
  };

  // Handle stopping recording
  const handleStopRecording = async () => {
    if (!sessionId) return;
    
    try {
      await sessionApi.stopRecording(sessionId);
      setIsRecording(false);
      toast.success("Recording stopped");
    } catch (err: any) {
      toast.error(err.message || "Failed to stop recording");
    }
  };

  // Handle leaving room
  const handleLeave = () => {
    if (onLeave) onLeave();
  };

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-[#0f0f0f] rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bfff00] mx-auto mb-4"></div>
          <p className="text-white text-lg">Connecting to live session...</p>
        </div>
      </div>
    );
  }

  if (error || !tokenData) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-[#0f0f0f] rounded-lg">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error || "Failed to get token"}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#bfff00] text-black px-6 py-2 rounded-lg font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Build LiveKit room URL
  // For LiveKit Cloud: https://project.livekit.cloud/room/roomname?token=...
  // Convert wss:// to https:// for the HTTP room URL
  const baseUrl = tokenData.livekit_url.replace('wss://', 'https://');
  const roomUrl = `${baseUrl}/room/${encodeURIComponent(tokenData.room_name)}?token=${encodeURIComponent(tokenData.token)}`;

  return (
    <div className="bg-[#0f0f0f] rounded-lg overflow-hidden flex flex-col" style={{ height: "calc(100vh - 200px)", minHeight: "600px" }}>
      {/* LiveKit Room iframe */}
      <iframe
        ref={iframeRef}
        src={roomUrl}
        allow="camera; microphone; fullscreen; display-capture"
        className="flex-1 w-full border-0"
        style={{ minHeight: "500px" }}
      />

      {/* Controls bar */}
      <div className="p-4 border-t border-[#2a2a2a] flex items-center justify-between bg-[#151515]">
        <div className="flex items-center gap-4">
          {/* Session info */}
          <div>
            <h3 className="text-white font-medium">{roomName}</h3>
            <p className="text-[#888] text-sm">
              {isHost ? "Hosting" : "Participating"} • {tokenData.role === "teacher" ? "Instructor" : "Student"}
            </p>
          </div>
        </div>

        {/* Host controls */}
        {isHost && (
          <div className="flex items-center gap-3">
            {/* Recording toggle */}
            <button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isRecording 
                  ? "bg-red-500 text-white animate-pulse" 
                  : "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]"
              }`}
            >
              {isRecording ? "⏹ Stop Recording" : "⏺ Start Recording"}
            </button>

            {/* Leave button */}
            <button
              onClick={handleLeave}
              className="px-6 py-2 rounded-lg font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              Leave Session
            </button>
          </div>
        )}

        {!isHost && (
          <button
            onClick={handleLeave}
            className="px-6 py-2 rounded-lg font-medium bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] transition-colors"
          >
            Leave Session
          </button>
        )}
      </div>
    </div>
  );
}
