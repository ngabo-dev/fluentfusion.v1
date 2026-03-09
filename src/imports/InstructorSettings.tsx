import { useState, useEffect } from "react";
import { usersApi } from "../app/api/config";
import InstructorLayout from "../app/components/InstructorLayout";

interface UserProfile {
  full_name: string;
  email: string;
  bio?: string;
  location?: string;
}

export default function InstructorSettings() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [activeTab, setActiveTab] = useState<"account" | "preferences">("account");

  const [notifEnrollments, setNotifEnrollments] = useState(true);
  const [notifSubmissions, setNotifSubmissions] = useState(true);
  const [notifApprovals, setNotifApprovals] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await usersApi.getProfile();
        setProfile(data);
        setFullName(data.full_name || "");
        setBio(data.bio || "");
        setLocation(data.location || "");
        // Load notification preferences from localStorage
        const prefs = localStorage.getItem("ff_instructor_prefs");
        if (prefs) {
          try {
            const parsed = JSON.parse(prefs);
            if (parsed.notifEnrollments !== undefined) setNotifEnrollments(parsed.notifEnrollments);
            if (parsed.notifSubmissions !== undefined) setNotifSubmissions(parsed.notifSubmissions);
            if (parsed.notifApprovals !== undefined) setNotifApprovals(parsed.notifApprovals);
          } catch {
            // ignore
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const savePrefs = (updates: { notifEnrollments?: boolean; notifSubmissions?: boolean; notifApprovals?: boolean }) => {
    const current = { notifEnrollments, notifSubmissions, notifApprovals };
    const merged = { ...current, ...updates };
    localStorage.setItem("ff_instructor_prefs", JSON.stringify(merged));
  };

  const handleSaveAccount = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const updated = await usersApi.updateProfile({ full_name: fullName, bio, location });
      setProfile(updated);
      // Sync to localStorage
      const stored = localStorage.getItem("ff_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          parsed.full_name = fullName;
          localStorage.setItem("ff_user", JSON.stringify(parsed));
        } catch {
          // ignore
        }
      }
      setSuccess("Account settings saved.");
    } catch (err: any) {
      setError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <InstructorLayout title="Settings">
        <div className="flex items-center justify-center h-64">
          <div className="text-[#bfff00] text-xl">Loading...</div>
        </div>
      </InstructorLayout>
    );
  }

  const tabs: { id: "account" | "preferences"; label: string; icon: string }[] = [
    { id: "account", label: "Account", icon: "👤" },
    { id: "preferences", label: "Preferences", icon: "⚙️" },
  ];

  return (
    <InstructorLayout title="Settings" subtitle="Manage your account and preferences">
      {/* Tab Bar */}
      <div className="flex gap-1 bg-[#151515] border border-[#2a2a2a] rounded-[10px] p-1 mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setError(null); setSuccess(null); }}
            className={`px-5 py-2 rounded-[8px] text-[14px] font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-[#bfff00] text-black"
                : "text-[#888] hover:text-white"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-2xl">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-[8px] mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-[8px] mb-6">
            {success}
          </div>
        )}

        {activeTab === "account" && (
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 space-y-5">
            <h3 className="text-white font-semibold text-[16px]">
              Account Information
            </h3>

            <div>
              <label className="text-[#888] text-[10px] uppercase tracking-[1px] block mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors"
              />
            </div>

            <div>
              <label className="text-[#888] text-[10px] uppercase tracking-[1px] block mb-2">
                Email
              </label>
              <input
                type="email"
                value={profile?.email || ""}
                disabled
                className="w-full bg-[#1a1a1a] text-[#555] rounded-[8px] px-4 py-3 border border-[#2a2a2a] cursor-not-allowed"
              />
              <p className="text-[#555] text-[11px] mt-1">
                Email cannot be changed.
              </p>
            </div>

            <div>
              <label className="text-[#888] text-[10px] uppercase tracking-[1px] block mb-2">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell students about yourself..."
                rows={3}
                className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors resize-none"
              />
            </div>

            <div>
              <label className="text-[#888] text-[10px] uppercase tracking-[1px] block mb-2">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., New York, USA"
                className="w-full bg-[#1f1f1f] text-white rounded-[8px] px-4 py-3 outline-none border border-[#2a2a2a] focus:border-[#bfff00] transition-colors"
              />
            </div>

            <button
              onClick={handleSaveAccount}
              disabled={saving}
              className="w-full bg-[#bfff00] text-black font-semibold py-3 rounded-[8px] disabled:opacity-50 hover:bg-[#aeff00] transition-colors"
            >
              {saving ? "Saving..." : "Save Account Settings"}
            </button>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 space-y-6">
            <h3 className="text-white font-semibold text-[16px]">
              Preferences
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-[#2a2a2a]">
                <div>
                  <div className="text-white text-[14px] font-medium">
                    Email notifications
                  </div>
                  <div className="text-[#555] text-[12px]">
                    Receive emails for new enrollments and messages
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifEnrollments}
                    onChange={(e) => { setNotifEnrollments(e.target.checked); savePrefs({ notifEnrollments: e.target.checked }); }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#2a2a2a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#bfff00]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-[#2a2a2a]">
                <div>
                  <div className="text-white text-[14px] font-medium">
                    Student submission alerts
                  </div>
                  <div className="text-[#555] text-[12px]">
                    Get notified when students submit assignments
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifSubmissions}
                    onChange={(e) => { setNotifSubmissions(e.target.checked); savePrefs({ notifSubmissions: e.target.checked }); }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#2a2a2a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#bfff00]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="text-white text-[14px] font-medium">
                    Course approval updates
                  </div>
                  <div className="text-[#555] text-[12px]">
                    Notify me when admin reviews my course submissions
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifApprovals}
                    onChange={(e) => { setNotifApprovals(e.target.checked); savePrefs({ notifApprovals: e.target.checked }); }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#2a2a2a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#bfff00]"></div>
                </label>
              </div>
            </div>

            <p className="text-[#555] text-[12px]">
              Notification preferences are saved to your browser.
            </p>
          </div>
        )}
      </div>
    </InstructorLayout>
  );
}
