import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { instructorApi } from "../app/api/config";
import InstructorLayout from "../app/components/InstructorLayout";
import { toast } from "sonner";

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
    } catch (error: any) {
      console.error('Failed to send:', error);
      toast.error(error.message || 'Failed to send message');
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
    <InstructorLayout title="Messages" subtitle="Direct messages with your students">
      <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl overflow-hidden flex" style={{ height: 'calc(100vh - 240px)', minHeight: '500px' }}>
        {/* Conversations List */}
        <div className="w-[300px] border-r border-[#2a2a2a] flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-[#2a2a2a]">
            <h2 className="text-white font-semibold text-[14px]">Conversations</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-[#888] text-center py-8 text-[13px]">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-[32px] mb-2">💬</div>
                <p className="text-[#888] text-[13px]">No conversations yet</p>
              </div>
            ) : conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`p-4 border-b border-[#1a1a1a] cursor-pointer transition-colors ${
                  selectedConversation?.id === conv.id
                    ? 'bg-[#1a1a1a] border-l-2 border-[#bfff00]'
                    : 'hover:bg-[#1a1a1a] border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-black font-bold text-[13px] flex-shrink-0"
                       style={{ background: 'linear-gradient(135deg, #bfff00, #8fef00)' }}>
                    {conv.student_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-[13px] font-medium truncate">{conv.student_name}</span>
                      <span className="text-[#555] text-[10px] flex-shrink-0 ml-2">{formatTime(conv.last_message_at)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[#888] text-[11px] truncate">{conv.last_message_preview || 'No messages'}</span>
                      {conv.unread_count > 0 && (
                        <span className="bg-[#bfff00] text-black text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 ml-2">{conv.unread_count}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-[#2a2a2a]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold text-[12px]"
                       style={{ background: 'linear-gradient(135deg, #bfff00, #8fef00)' }}>
                    {selectedConversation.student_name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-white font-semibold text-[14px]">{selectedConversation.student_name}</h3>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                      msg.sender_id === user?.id ? 'bg-[#bfff00] text-black' : 'bg-[#1a1a1a] text-white'
                    }`}>
                      <p className="text-[13px]">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${msg.sender_id === user?.id ? 'text-black/50' : 'text-[#555]'}`}>
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
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 bg-[#0f0f0f] text-white rounded-lg px-4 py-2.5 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors text-[13px]"
                  />
                  <button
                    onClick={handleSend}
                    disabled={sending || !newMessage.trim()}
                    className="bg-[#bfff00] text-black px-5 py-2.5 rounded-lg font-semibold text-[13px] disabled:opacity-50 hover:opacity-90 transition-opacity"
                  >
                    {sending ? '...' : 'Send'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-[56px] mb-3">💬</div>
                <p className="text-[#888] text-[14px]">Select a conversation to start messaging</p>
                <p className="text-[#555] text-[12px] mt-1">All messages with your students appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </InstructorLayout>
  );
}
