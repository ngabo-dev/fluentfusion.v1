import { useState, useEffect } from "react";
import { usersApi } from "../app/api/config";
import InstructorLayout from "../app/components/InstructorLayout";

interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
  role: string;
  created_at?: string;
}

export default function InstructorProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await usersApi.getProfile();
        setProfile(data);
        setFullName(data.full_name || "");
        setBio(data.bio || "");
        setLocation(data.location || "");
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const updated = await usersApi.updateProfile({ full_name: fullName, bio, location });
      setProfile(updated);
      // Sync to localStorage so navbar shows updated name
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
      setSuccess("Profile updated successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <InstructorLayout title="Profile">
        <div className="flex items-center justify-center h-64">
          <div className="text-[#bfff00] text-xl">Loading...</div>
        </div>
      </InstructorLayout>
    );
  }

  return (
    <InstructorLayout title="Profile" subtitle="Manage your instructor profile">
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

        {/* Avatar */}
        <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 mb-6 flex items-center gap-6">
          <div
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-[24px] font-bold text-black shrink-0"
            style={{
              background: "linear-gradient(135deg, #bfff00 0%, #8fef00 100%)",
            }}
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(fullName || profile?.full_name || "")
            )}
          </div>
          <div>
            <h2 className="text-white font-bold text-[18px]">
              {profile?.full_name}
            </h2>
            <p className="text-[#888] text-[13px]">{profile?.email}</p>
            <span className="inline-block mt-1 bg-[rgba(191,255,0,0.1)] text-[#bfff00] text-[11px] px-2 py-0.5 rounded-full">
              📋 Instructor
            </span>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6 space-y-5">
          <h3 className="text-white font-semibold text-[16px] mb-4">
            Edit Profile
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
              Email cannot be changed here.
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
              rows={4}
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
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#bfff00] text-black font-semibold py-3 rounded-[8px] disabled:opacity-50 hover:bg-[#aeff00] transition-colors"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {profile?.created_at && (
          <p className="text-[#555] text-[12px] mt-4">
            Member since{" "}
            {new Date(profile.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>
    </InstructorLayout>
  );
}
