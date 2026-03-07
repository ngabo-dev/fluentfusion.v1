import { Link, useLocation } from "react-router";

interface SidebarProps {
  onLogout?: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/dashboard") return currentPath === path;
    return currentPath.startsWith(path);
  };

  const navItems = [
    { icon: "⚡", label: "Dashboard", path: "/dashboard", active: currentPath === "/dashboard" },
    { icon: "📚", label: "My Courses", path: "/courses", active: currentPath.startsWith("/courses") || currentPath.startsWith("/course/") },
    { icon: "🎯", label: "Practice", path: "/practice/flashcards", active: currentPath.startsWith("/practice") },
    { icon: "🎥", label: "Live Sessions", path: "/live-sessions", active: currentPath.startsWith("/live") || currentPath.startsWith("/live-") },
    { icon: "🌍", label: "Community", path: "/community", active: currentPath.startsWith("/community") },
  ];

  const accountItems = [
    { icon: "👤", label: "Profile", path: "/profile", active: currentPath.startsWith("/profile") },
    { icon: "⚙️", label: "Settings", path: "/settings", active: currentPath.startsWith("/settings") },
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    window.location.href = "/";
  };

  return (
    <div className="fixed left-0 top-[66px] w-[240px] h-[calc(100vh-66px)] bg-[#0f0f0f] border-r border-[#2a2a2a] overflow-y-auto">
      <div className="flex flex-col py-5 px-0">
        {/* Main Section */}
        <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3">Main</div>
        
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`w-full py-3 pl-6 pr-4 flex gap-3 items-center transition-colors ${
              item.active
                ? "bg-[rgba(191,255,0,0.1)] border-l-2 border-[#bfff00]"
                : "text-[#888] hover:text-white"
            }`}
          >
            <span className={item.active ? "text-[#bfff00]" : ""}>{item.icon}</span>
            <span className={`text-[14px] ${item.active ? "text-[#bfff00] font-medium" : ""}`}>{item.label}</span>
          </Link>
        ))}

        {/* Account Section */}
        <div className="text-[#555] text-[9px] uppercase tracking-[1.35px] px-6 py-3 mt-4">Account</div>
        
        {accountItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`w-full py-3 pl-6 pr-4 flex gap-3 items-center transition-colors ${
              item.active
                ? "bg-[rgba(191,255,0,0.1)] border-l-2 border-[#bfff00]"
                : "text-[#888] hover:text-white"
            }`}
          >
            <span className={item.active ? "text-[#bfff00]" : ""}>{item.icon}</span>
            <span className={`text-[14px] ${item.active ? "text-[#bfff00] font-medium" : ""}`}>{item.label}</span>
          </Link>
        ))}

        {/* Logout */}
        <div className="mt-auto pt-4 border-t border-[#2a2a2a]">
          <button
            onClick={handleLogout}
            className="w-full py-3 pl-6 pr-4 flex gap-3 items-center text-[#888] hover:text-white transition-colors"
          >
            <span>↩</span>
            <span className="text-[14px]">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
