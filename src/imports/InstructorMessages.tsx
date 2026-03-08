import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { instructorApi } from "../app/api/config";

interface Conversation {
  id: number;
  student_id: number;
  student_name: string;
  student_avatar: string | null;
  last_message_preview: string;
  last_message_at: string | null;
  unread_count: number;
}

interface Message {
  id: number;
  sender_id: number;
  sender_name: string;
  content: string;
  message_type: string;
  created_at: string | null;
  is_read: boolean;
}

export default function InstructorMessages() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('ff_access_token');
    const userData = localStorage.getItem('ff_user');
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      if (parsed.role && !['instructor', 'admin'].includes(parsed.role)) {
        navigate('/dashboard');
        return;
      }
      setUser(parsed);
    } catch (e) {
      navigate('/login');
    }
    fetchConversations();
  }, [navigate]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await instructorApi.getConversations({});
      setConversations(res.conversations || []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: number) => {
    try {
      const res = await instructorApi.getMessages(conversationId, {});
      setMessages(res.messages || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    setSending(true);
    try {
      await instructorApi.sendMessage({
        student_id: selectedConversation.student_id,
        content: newMessage,
        message_type: "text"
      });
      setNewMessage("");
      fetchMessages(selectedConversation.id);
      fetchConversations();
    } catch (error) {
      console.error('Failed to send:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${Math.floor(hours)}h ago`;
    if (hours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
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
              <button 
                onClick={() => {
                  localStorage.removeItem('ff_access_token');
                  localStorage.removeItem('ff_refresh_token');
                  localStorage.removeItem('ff_user');
                  navigate('/login');
                }}
                className="text-[#888] hover:text-white text-sm bg-transparent border-none cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-66px)]">
        {/* Sidebar */}
        <div className="fixed left-0 top-[66px] w-[240px] h-[calc(100vh-66px)] bg-[#0f0f0f] border-r border-[#2a2a2a] overflow-y-auto">
          <div className="flex flex-col py-5 px-0">
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3">Instructor</div>
            
            <Link to="/instructor/dashboard" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📊</span>
              <span className="text-[14px]">Overview</span>
            </Link>
            
            <Link to="/instructor/create-course" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📚</span>
              <span className="text-[14px]">Create Course</span>
            </Link>
            
            <Link to="/instructor/students" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>👥</span>
              <span className="text-[14px]">Students</span>
            </Link>
            
            <Link to="/instructor/certificates" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>🎓</span>
              <span className="text-[14px]">Certificates</span>
            </Link>
            
            <Link to="/instructor/announcements" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📢</span>
              <span className="text-[14px]">Announcements</span>
            </Link>
            
            <Link to="/instructor/messages" className="w-full bg-[rgba(191,255,0,0.1)] border-l-2 border-[#bfff00] py-3 pl-6 pr-4 flex gap-3 items-center">
              <span className="text-[#bfff00]">💬</span>
              <span className="text-[#bfff00] text-[14px]">Messages</span>
            </Link>
            
            <Link to="/live-sessions" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>🎥</span>
              <span className="text-[14px]">Live Sessions</span>
            </Link>
            
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4">Account</div>
            
            <Link to="/profile" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>👤</span>
              <span className="text-[14px]">Profile</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-[240px] flex-1 flex">
          {/* Conversations List */}
          <div className="w-[350px] border-r border-[#2a2a2a] flex flex-col">
            <div className="p-4 border-b border-[#2a2a2a]">
              <h2 className="text-white font-bold">Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="text-[#888] text-center py-8">Loading...</div>
              ) : conversations.length === 0 ? (
                <div className="text-[#888] text-center py-8">No conversations yet</div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`p-4 border-b border-[#2a2a2a] cursor-pointer hover:bg-[#1a1a1a] ${
                      selectedConversation?.id === conv.id ? 'bg-[#1a1a1a] border-l-2 border-l-[#bfff00]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#bfff00] to-[#8fef00] flex items-center justify-center text-black font-bold">
                        {conv.student_name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium truncate">{conv.student_name}</span>
                          <span className="text-[#555] text-xs">{formatTime(conv.last_message_at)}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[#888] text-sm truncate">{conv.last_message_preview || 'No messages yet'}</span>
                          {conv.unread_count > 0 && (
                            <span className="bg-[#bfff00] text-black text-xs px-2 py-0.5 rounded-full">{conv.unread_count}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-[#2a2a2a]">
                  <h3 className="text-white font-bold">{selectedConversation.student_name}</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        msg.sender_id === user?.id 
                          ? 'bg-[#bfff00] text-black' 
                          : 'bg-[#1f1f1f] text-white'
                      }`}>
                        <p className="text-[14px]">{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.sender_id === user?.id ? 'text-black/60' : 'text-[#555]'}`}>
                          {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-[#2a2a2a]">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type a message..."
                      className="flex-1 bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a]"
                    />
                    <button 
                      onClick={handleSend}
                      disabled={sending || !newMessage.trim()}
                      className="bg-[#bfff00] text-black px-6 py-3 rounded-[8px] font-semibold disabled:opacity-50"
                    >
                      {sending ? '...' : 'Send'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[64px] mb-4">💬</div>
                  <p className="text-[#888]">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
