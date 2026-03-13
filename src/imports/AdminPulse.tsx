import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { authApi } from "../app/api/config";

export default function AdminPulse() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ff_access_token');
    const userData = localStorage.getItem('ff_user');
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      if (parsed.role !== 'admin') {
        navigate('/dashboard');
        return;
      }
      setUser(parsed);
    } catch (e) {
      navigate('/login');
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="text-[#bfff00]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Navigation */}
      <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full z-50">
        <div className="absolute border-b border-[#2a2a2a] inset-0 pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="flex items-center justify-between px-[40px] w-full">
            <Link to="/admin/dashboard" className="flex gap-[11px] items-center no-underline">
              <div className="bg-[#bfff00] flex items-center justify-center w-[38px] h-[38px] rounded-[10px]">
                <span className="text-[18px]">🧠</span>
              </div>
              <span className="text-[18px] text-white font-bold">
                FLUENT<span className="text-[#bfff00]">FUSION</span>
              </span>
            </Link>
            <div className="flex items-center gap-[12px]">
              <div className="bg-[rgba(255,0,0,0.1)] px-[13px] py-[5px] rounded-[99px]">
                <span className="text-[#ff4444] text-[11px] font-semibold">👑 Admin</span>
              </div>
              <button 
                onClick={() => {
                  authApi.logout();
                  window.location.href = '/login';
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
        <div className="fixed left-0 top-[66px] w-[260px] h-[calc(100vh-66px)] bg-[#0f0f0f] border-r border-[#2a2a2a] overflow-y-auto">
          <div className="flex flex-col py-5 px-0">
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3">Main</div>
            
            <Link to="/admin/dashboard" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📊</span>
              <span className="text-[14px]">Dashboard</span>
            </Link>
            
            <Link to="/admin/analytics" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📈</span>
              <span className="text-[14px]">Analytics</span>
            </Link>
            
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4">Management</div>
            
            <Link to="/admin/users" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>👥</span>
              <span className="text-[14px]">Users</span>
            </Link>
            
            <Link to="/admin/courses" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📚</span>
              <span className="text-[14px]">Courses</span>
            </Link>
            
            <Link to="/admin/course-approvals" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>✅</span>
              <span className="text-[14px]">Course Approvals</span>
            </Link>
            
            <Link to="/admin/live-sessions" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>🎙️</span>
              <span className="text-[14px]">Live Sessions</span>
            </Link>
            
            <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4">System</div>
            
            <Link to="/admin/pulse" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center bg-[rgba(191,255,0,0.1)] border-l-2 border-[#bfff00]">
              <span className="text-[#bfff00]">🧠</span>
              <span className="text-[#bfff00] text-[14px]">PULSE Engine</span>
            </Link>
            
            <Link to="/admin/audit-log" className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white">
              <span>📜</span>
              <span className="text-[14px]">Audit Log</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-[260px] flex-1 p-9">
          <div className="mb-8">
            <h1 className="text-[32px] text-white font-bold">
              <span className="text-[#bfff00]">PULSE Engine</span>
            </h1>
            <p className="text-[#888] text-[14px] mt-1">
              AI-powered language learning engine configuration and monitoring
            </p>
          </div>

          {/* PULSE Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6">
              <div className="text-[#888] text-[12px] uppercase">Model Status</div>
              <div className="text-[24px] text-[#00ff7f] font-bold mt-2">Active</div>
              <div className="text-[#555] text-[12px] mt-2">Running</div>
            </div>
            
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6">
              <div className="text-[#888] text-[12px] uppercase">Predictions Today</div>
              <div className="text-[24px] text-white font-bold mt-2">1,234</div>
              <div className="text-[#00ff7f] text-[12px] mt-2">↑ 12%</div>
            </div>
            
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6">
              <div className="text-[#888] text-[12px] uppercase">Accuracy</div>
              <div className="text-[24px] text-white font-bold mt-2">94.5%</div>
              <div className="text-[#00ff7f] text-[12px] mt-2">↑ 2.1%</div>
            </div>
            
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6">
              <div className="text-[#888] text-[12px] uppercase">Avg Response</div>
              <div className="text-[24px] text-white font-bold mt-2">45ms</div>
              <div className="text-[#00ff7f] text-[12px] mt-2">Optimal</div>
            </div>
          </div>

          {/* Model Info */}
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 mb-8">
            <h2 className="text-white font-bold text-lg mb-4">Model Configuration</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[#888] text-[12px] uppercase mb-1">Model Type</div>
                <div className="text-white">Language Proficiency Classifier</div>
              </div>
              <div>
                <div className="text-[#888] text-[12px] uppercase mb-1">Version</div>
                <div className="text-white">v2.4.1</div>
              </div>
              <div>
                <div className="text-[#888] text-[12px] uppercase mb-1">Last Trained</div>
                <div className="text-white">2024-02-15</div>
              </div>
              <div>
                <div className="text-[#888] text-[12px] uppercase mb-1">Training Data</div>
                <div className="text-white">50,000 samples</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-4">
            <button className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-[14px] p-6 hover:border-[#bfff00] transition-colors text-left">
              <div className="text-[24px] mb-3">🔄</div>
              <div className="text-white font-bold">Retrain Model</div>
              <div className="text-[#888] text-sm mt-1">Update with new data</div>
            </button>
            
            <button className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-[14px] p-6 hover:border-[#bfff00] transition-colors text-left">
              <div className="text-[24px] mb-3">📊</div>
              <div className="text-white font-bold">View Metrics</div>
              <div className="text-[#888] text-sm mt-1">Detailed performance logs</div>
            </button>
            
            <button className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-[14px] p-6 hover:border-[#bfff00] transition-colors text-left">
              <div className="text-[24px] mb-3">⚙️</div>
              <div className="text-white font-bold">Settings</div>
              <div className="text-[#888] text-sm mt-1">Configure parameters</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
