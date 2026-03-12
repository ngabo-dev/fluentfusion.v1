import { useEffect, useState, useCallback } from "react";
import { sessionApi } from "../app/api/config";
import { toast } from "sonner";

interface LiveKitRoomProps {
  roomName: string;
  sessionId?: number;
  meetingId?: number;
  isHost?: boolean;
  onLeave?: () => void;
}

export default function LiveKitRoom({ roomName, sessionId, meetingId, isHost = false, onLeave }: LiveKitRoomProps) {
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
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");

  // Get token on mount
  useEffect(() => {
    const getToken = async () => {
      try {
        setIsConnecting(true);
        setError(null);
        setConnectionStatus("connecting");
        
        const role = isHost ? "teacher" : "student";
        console.log(`[LiveKit] Getting token for room: ${roomName}, role: ${role}`);
        
        const data = await sessionApi.getToken(roomName, role);
        console.log("[LiveKit] Token received:", { 
          room_name: data.room_name, 
          livekit_url: data.livekit_url,
          role: data.role
        });
        
        setTokenData(data);
        setConnectionStatus("connected");
      } catch (err: any) {
        console.error("[LiveKit] Failed to get token:", err);
        setError(err.message || "Failed to connect to live session");
        setConnectionStatus("disconnected");
        toast.error(err.message || "Failed to connect to live session");
      } finally {
        setIsConnecting(false);
      }
    };
    
    getToken();
  }, [roomName, isHost]);

  // Build the LiveKit room URL
  const getRoomUrl = useCallback(() => {
    if (!tokenData) return "";
    
    let baseUrl = tokenData.livekit_url;
    if (baseUrl.startsWith('wss://')) {
      baseUrl = baseUrl.replace('wss://', 'https://');
    }
    
    const roomUrl = `${baseUrl}/room/${encodeURIComponent(tokenData.room_name)}?token=${encodeURIComponent(tokenData.token)}`;
    
    console.log("[LiveKit] Room URL:", roomUrl);
    return roomUrl;
  }, [tokenData]);

  // Handle recording
  const handleStartRecording = async () => {
    const id = sessionId || meetingId;
    if (!id) return;
    try {
      await sessionApi.startRecording(id);
      setIsRecording(true);
      toast.success("Recording started");
    } catch (err: any) {
      toast.error(err.message || "Failed to start recording");
    }
  };

  const handleStopRecording = async () => {
    const id = sessionId || meetingId;
    if (!id) return;
    try {
      await sessionApi.stopRecording(id);
      setIsRecording(false);
      toast.success("Recording stopped");
    } catch (err: any) {
      toast.error(err.message || "Failed to stop recording");
    }
  };

  const handleLeave = () => {
    setConnectionStatus("disconnected");
    if (onLeave) onLeave();
  };

  // Loading state
  if (isConnecting) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-[#0f0f0f] rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bfff00] mx-auto mb-4"></div>
          <p className="text-white text-lg">Connecting to live session...</p>
          <p className="text-[#888] text-sm">Room: {roomName}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !tokenData) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-[#0f0f0f] rounded-lg">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-400 text-lg mb-2">{error || "Failed to get token"}</p>
          <p className="text-[#888] text-sm mb-4">Room: {roomName}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-[#bfff00] text-black px-6 py-2 rounded-lg font-semibold hover:opacity-90"
            >
              Retry
            </button>
            <button
              onClick={handleLeave}
              className="bg-[#2a2a2a] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#3a3a3a]"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const roomUrl = getRoomUrl();

  return (
    <div className="bg-[#0f0f0f] rounded-lg overflow-hidden flex flex-col" style={{ height: "calc(100vh - 200px)", minHeight: "600px" }}>
      {/* Header */}
      <div className="px-4 py-3 bg-[#151515] border-b border-[#2a2a2a] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full ${
            connectionStatus === "connected" ? "bg-green-500 animate-pulse" :
            connectionStatus === "connecting" ? "bg-yellow-500 animate-pulse" :
            "bg-red-500"
          }`} />
          <span className="text-white font-medium">{roomName}</span>
          <span className="text-[#888] text-sm">
            {connectionStatus === "connected" ? "● Live" : "Connecting..."}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {isHost && (
            <button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                isRecording 
                  ? "bg-red-500 text-white animate-pulse" 
                  : "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]"
              }`}
            >
              {isRecording ? "⏹ Recording" : "⏺ Record"}
            </button>
          )}
          <button
            onClick={handleLeave}
            className="px-4 py-1.5 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30"
          >
            Leave Session
          </button>
        </div>
      </div>

      {/* LiveKit Room iframe - All controls are inside the iframe */}
      <iframe
        src={roomUrl}
        allow="camera; microphone; fullscreen; display-capture; autoplay"
        className="flex-1 w-full border-0"
        style={{ minHeight: "500px", backgroundColor: "#000" }}
        title="LiveKit Room - Video Conference"
      />
    </div>
  );
}
