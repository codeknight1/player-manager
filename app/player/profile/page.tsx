"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { CollapsibleSidebar } from "@/components/layout/collapsible-sidebar";
import { Modal } from "@/components/ui/modal";
import { HouseIcon, UserIcon, UsersThreeIcon, ChatIcon, BellIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiGet, apiPost } from "@/app/lib/api";
import { toast } from "sonner";
import { LogoutButton } from "@/components/auth/logout-button";

const sidebarItems = [
  {
    label: "Home",
    href: "/player/dashboard",
    icon: <HouseIcon size={24} weight="fill" />,
  },
  {
    label: "My Profile",
    href: "/player/profile",
    icon: <UserIcon size={24} />,
  },
  {
    label: "Network",
    href: "/player/network",
    icon: <UsersThreeIcon size={24} />,
  },
  {
    label: "Messages",
    href: "/player/messages",
    icon: <ChatIcon size={24} />,
  },
  {
    label: "Notifications",
    href: "/notifications",
    icon: <BellIcon size={24} />,
  },
];

export default function PlayerProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    age: 0,
    position: "",
    nationality: "",
    email: "",
    phone: "",
    bio: "",
    avatar: "",
    stats: {
      goals: 0,
      assists: 0,
      matches: 0,
    },
    uploads: [] as { id: string; name: string; type: "video" | "certificate" | "achievement"; url?: string; thumbnail?: string; createdAt?: string }[],
  });
  const [editProfile, setEditProfile] = useState({
    firstName: "",
    lastName: "",
    age: 0,
    position: "",
    nationality: "",
    email: "",
    phone: "",
    bio: "",
    avatar: "",
    stats: {
      goals: 0,
      assists: 0,
      matches: 0,
    },
    uploads: [] as { id: string; name: string; type: "video" | "certificate" | "achievement"; url?: string; thumbnail?: string; createdAt?: string }[],
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const userId = (session?.user as any)?.id;
    if (userId) {
      loadProfile();
    } else if (session === null) {
      setLoading(false);
    }
  }, [session]);

  async function loadProfile() {
    const userId = (session?.user as any)?.id;
    if (!userId) {
      toast.error("No user ID found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const user = await apiGet(`profile?userId=${userId}`);
      
      if (user && !user.error) {
        let profileData: any = {};
        if (user.profile !== null && user.profile !== undefined) {
          if (typeof user.profile === 'object' && !Array.isArray(user.profile)) {
            profileData = user.profile;
          }
        }
        
        const nameParts = user.name ? user.name.split(" ") : [];
        const loadedProfile = {
          firstName: profileData.firstName ?? nameParts[0] ?? "",
          lastName: profileData.lastName ?? nameParts.slice(1).join(" ") ?? "",
          email: user.email ?? profileData.email ?? "",
          age: profileData.age !== undefined && profileData.age !== null ? (typeof profileData.age === 'number' ? profileData.age : parseInt(String(profileData.age))) : 0,
          position: profileData.position ?? "",
          nationality: profileData.nationality ?? "",
          phone: profileData.phone ?? "",
          bio: profileData.bio ?? "",
          avatar: profileData.avatar ?? "",
          stats: (profileData.stats && typeof profileData.stats === 'object' && !Array.isArray(profileData.stats)) ? {
            goals: profileData.stats.goals ?? 0,
            assists: profileData.stats.assists ?? 0,
            matches: profileData.stats.matches ?? 0,
          } : { goals: 0, assists: 0, matches: 0 },
          uploads: Array.isArray(profileData.uploads) ? profileData.uploads : [],
        };
        
        setProfile(loadedProfile);
        setEditProfile(loadedProfile);
        
        if (!profileData || Object.keys(profileData).length === 0) {
          toast.info("Profile is empty. Click 'Edit Profile' to add your information.");
        }
      } else if (user?.error) {
        toast.error(user.error || "Failed to load profile");
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load profile from database");
    } finally {
      setLoading(false);
    }
  }

  function openEditModal() {
    setEditProfile(profile);
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
    setEditProfile(profile);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (base64String) {
        setEditProfile((p) => ({ ...p, avatar: base64String }));
        setUploading(false);
        toast.success("Image uploaded successfully!");
      } else {
        setUploading(false);
        toast.error("Failed to process image");
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.onerror = () => {
      setUploading(false);
      toast.error("Failed to read image file");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  }

  function addUpload(kind: "video" | "certificate" | "achievement") {
    const id = Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
    const timestamp = new Date().toISOString();
    const name = `${kind.charAt(0).toUpperCase() + kind.slice(1)} - ${new Date(timestamp).toLocaleDateString()}`;
    setEditProfile((p) => ({ 
      ...p, 
      uploads: [...p.uploads, { id, name, type: kind, createdAt: timestamp }] 
    }));
    toast.success(`${kind.charAt(0).toUpperCase() + kind.slice(1)} added.`);
  }

  function extractYouTubeId(url: string): string | null {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) {
        return u.pathname.slice(1) || null;
      }
      if (u.searchParams.get("v")) {
        return u.searchParams.get("v");
      }
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts[0] === "shorts" && parts[1]) return parts[1];
      return null;
    } catch {
      return null;
    }
  }

  function addYouTubeVideo() {
    const id = extractYouTubeId(youtubeUrl.trim());
    if (!id) {
      toast.error("Invalid YouTube URL");
      return;
    }
    const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    const name = `YOUTUBE_${id}`;
    setEditProfile((p) => ({
      ...p,
      uploads: [
        { id, name, type: "video", url: `https://www.youtube.com/watch?v=${id}`, thumbnail: thumb },
        ...p.uploads,
      ],
    }));
    setYoutubeUrl("");
    toast.success("YouTube video added!");
  }

  async function handleSave() {
    const userId = (session?.user as any)?.id;
    if (!userId) {
      toast.error("Please log in");
      return;
    }
    setSaving(true);
    try {
      const profilePayload = {
        firstName: editProfile.firstName,
        lastName: editProfile.lastName,
        age: editProfile.age,
        position: editProfile.position,
        nationality: editProfile.nationality,
        phone: editProfile.phone,
        bio: editProfile.bio,
        email: editProfile.email,
        avatar: editProfile.avatar,
        stats: editProfile.stats,
        uploads: editProfile.uploads,
      };
      
      await apiPost("profile", {
        userId: userId,
        name: `${editProfile.firstName} ${editProfile.lastName}`.trim() || session?.user?.name || "Player",
        profileData: profilePayload,
      });
      
      toast.success("Profile saved successfully!");
      await loadProfile();
      closeEditModal();
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  const strength = (() => {
    let s = 0;
    const filledBasics = [profile.firstName, profile.lastName, profile.position, profile.nationality, profile.bio].filter(Boolean).length;
    s += filledBasics * 10;
    if (profile.age) s += 10;
    s += [profile.stats.goals, profile.stats.assists, profile.stats.matches].filter((v) => v !== undefined && v !== null).length * 5;
    if (profile.uploads.length) s += 10;
    return Math.max(10, Math.min(100, s));
  })();


  if (loading) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden">
        <div className="flex items-center justify-center h-screen">
          <p className="text-[#92adc9]">Loading profile...</p>
        </div>
      </div>
    );
  }

  const userId = (session?.user as any)?.id;
  if (!userId) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-[#92adc9] mb-4">Please log in to view your profile</p>
            <Button onClick={() => window.location.href = "/player/login"}>Go to Login</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <CollapsibleSidebar
            title="TalentVerse"
            user={{
              name: `${profile.firstName} ${profile.lastName}`.trim() || session?.user?.name || "Player",
              role: (session?.user as any)?.role || "Player",
              avatar: profile.avatar || undefined,
            }}
            items={sidebarItems}
          />
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-white tracking-light text-[32px] font-bold leading-tight">
                  My Profile
                </p>
                <p className="text-[#92adc9] text-sm font-normal leading-normal">
                  View your profile information
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-48 rounded bg-[#192633] overflow-hidden">
                  <div className="h-full bg-[#1172d4]" style={{ width: `${strength}%` }} />
                </div>
                <span className="text-white text-sm font-medium">Strength {strength}%</span>
                <Button onClick={openEditModal}>Edit Profile</Button>
                <LogoutButton />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-6 p-6 rounded-lg border border-[#324d67] bg-[#192633] m-4"
            >
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 border-2 border-[#324d67] shrink-0"
                style={{
                  backgroundImage: profile.avatar ? `url("${profile.avatar}")` : undefined,
                  backgroundColor: profile.avatar ? undefined : "#192633",
                }}
              />
              <div className="flex-1">
                <h2 className="text-white text-2xl font-bold mb-2">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-[#92adc9] text-base mb-2">
                  {[profile.position, profile.age > 0 ? `Age ${profile.age}` : null, profile.nationality].filter(Boolean).join(" • ") || "Complete your profile"}
                </p>
                {profile.bio && (
                  <p className="text-[#92adc9] text-sm mt-2">{profile.bio}</p>
                )}
              </div>
            </motion.div>

            <div className="p-4">
              <h3 className="text-white text-xl font-bold mb-4">Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col gap-2 rounded-lg p-6 border border-[#324d67] bg-[#192633]"
                >
                  <p className="text-[#92adc9] text-sm font-normal">Goals</p>
                  <p className="text-white text-3xl font-bold">{profile.stats.goals || 0}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col gap-2 rounded-lg p-6 border border-[#324d67] bg-[#192633]"
                >
                  <p className="text-[#92adc9] text-sm font-normal">Assists</p>
                  <p className="text-white text-3xl font-bold">{profile.stats.assists || 0}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col gap-2 rounded-lg p-6 border border-[#324d67] bg-[#192633]"
                >
                  <p className="text-[#92adc9] text-sm font-normal">Matches</p>
                  <p className="text-white text-3xl font-bold">{profile.stats.matches || 0}</p>
                </motion.div>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-white text-xl font-bold mb-4">Profile Information</h3>
              <div className="flex flex-col gap-4 rounded-lg border border-[#324d67] p-6 bg-[#192633]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[#92adc9] text-sm mb-1">First Name</p>
                    <p className="text-white text-base">{profile.firstName || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[#92adc9] text-sm mb-1">Last Name</p>
                    <p className="text-white text-base">{profile.lastName || "—"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[#92adc9] text-sm mb-1">Age</p>
                    <p className="text-white text-base">{profile.age > 0 ? profile.age : "—"}</p>
                  </div>
                  <div>
                    <p className="text-[#92adc9] text-sm mb-1">Position</p>
                    <p className="text-white text-base">{profile.position ? profile.position : "—"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[#92adc9] text-sm mb-1">Nationality</p>
                  <p className="text-white text-base">{profile.nationality ? profile.nationality : "—"}</p>
                </div>
                <div>
                  <p className="text-[#92adc9] text-sm mb-1">Email</p>
                  <p className="text-white text-base">{profile.email || "—"}</p>
                </div>
                <div>
                  <p className="text-[#92adc9] text-sm mb-1">Phone</p>
                  <p className="text-white text-base">{profile.phone ? profile.phone : "—"}</p>
                </div>
                {profile.bio && (
                  <div>
                    <p className="text-[#92adc9] text-sm mb-1">Bio</p>
                    <p className="text-white text-base">{profile.bio}</p>
                  </div>
                )}
              </div>
            </div>

            {profile.uploads.length > 0 && (
              <div className="p-4">
                <h3 className="text-white text-xl font-bold mb-4">Uploads</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {profile.uploads.map((u) => (
                    <div key={u.id} className="rounded border border-[#233648] p-3 bg-[#192633] flex items-center gap-3">
                      {u.type === "video" && u.thumbnail ? (
                        <a href={u.url} target="_blank" rel="noreferrer" className="block shrink-0">
                          <div
                            className="bg-center bg-no-repeat bg-cover rounded w-28 h-16"
                            style={{ backgroundImage: `url('${u.thumbnail}')` }}
                          />
                        </a>
                      ) : (
                        <div className="rounded w-28 h-16 bg-[#111a22] border border-[#324d67] shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{u.name}</p>
                        <p className="text-[#92adc9] text-xs">{u.type}</p>
                        {u.url && (
                          <a href={u.url} target="_blank" rel="noreferrer" className="text-xs text-[#1172d4] underline">Open</a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Edit Profile"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || uploading}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 border-2 border-[#324d67] shrink-0"
                style={{
                  backgroundImage: editProfile.avatar ? `url("${editProfile.avatar}")` : undefined,
                  backgroundColor: editProfile.avatar ? undefined : "#192633",
                }}
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <div className="text-white text-xs">Uploading...</div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-white text-base font-medium">Profile Picture</label>
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  {uploading ? "Uploading..." : "Upload from Device"}
                </Button>
              </div>
              <Input
                type="url"
                label="Or enter image URL"
                value={editProfile.avatar && !editProfile.avatar.startsWith("data:") ? editProfile.avatar : ""}
                onChange={(e) => setEditProfile((p) => ({ ...p, avatar: e.target.value }))}
                placeholder="Enter image URL"
                className="border-[#324d67] bg-[#192633]"
              />
            </div>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-4">Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[#92adc9] text-sm font-normal">Goals</label>
                <input
                  type="number"
                  value={editProfile.stats.goals}
                  onChange={(e) =>
                    setEditProfile((p) => ({
                      ...p,
                      stats: { ...p.stats, goals: parseInt(e.target.value) || 0 },
                    }))
                  }
                  className="bg-[#192633] border border-[#324d67] rounded-lg px-4 py-2 text-white text-2xl font-bold focus:outline-none focus:border-[#1172d4]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#92adc9] text-sm font-normal">Assists</label>
                <input
                  type="number"
                  value={editProfile.stats.assists}
                  onChange={(e) =>
                    setEditProfile((p) => ({
                      ...p,
                      stats: { ...p.stats, assists: parseInt(e.target.value) || 0 },
                    }))
                  }
                  className="bg-[#192633] border border-[#324d67] rounded-lg px-4 py-2 text-white text-2xl font-bold focus:outline-none focus:border-[#1172d4]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#92adc9] text-sm font-normal">Matches</label>
                <input
                  type="number"
                  value={editProfile.stats.matches}
                  onChange={(e) =>
                    setEditProfile((p) => ({
                      ...p,
                      stats: { ...p.stats, matches: parseInt(e.target.value) || 0 },
                    }))
                  }
                  className="bg-[#192633] border border-[#324d67] rounded-lg px-4 py-2 text-white text-2xl font-bold focus:outline-none focus:border-[#1172d4]"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-4">Profile Information</h3>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  label="First Name"
                  value={editProfile.firstName}
                  onChange={(e) => setEditProfile((p) => ({ ...p, firstName: e.target.value }))}
                  className="border-[#324d67] bg-[#192633]"
                />
                <Input
                  type="text"
                  label="Last Name"
                  value={editProfile.lastName}
                  onChange={(e) => setEditProfile((p) => ({ ...p, lastName: e.target.value }))}
                  className="border-[#324d67] bg-[#192633]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Age"
                  value={editProfile.age}
                  onChange={(e) => setEditProfile((p) => ({ ...p, age: parseInt(e.target.value) || 0 }))}
                  className="border-[#324d67] bg-[#192633]"
                />
                <Input
                  type="text"
                  label="Position"
                  value={editProfile.position}
                  onChange={(e) => setEditProfile((p) => ({ ...p, position: e.target.value }))}
                  className="border-[#324d67] bg-[#192633]"
                />
              </div>
              <Input
                type="text"
                label="Nationality"
                value={editProfile.nationality}
                onChange={(e) => setEditProfile((p) => ({ ...p, nationality: e.target.value }))}
                className="border-[#324d67] bg-[#192633]"
              />
              <Input
                type="email"
                label="Email"
                value={editProfile.email}
                onChange={(e) => setEditProfile((p) => ({ ...p, email: e.target.value }))}
                className="border-[#324d67] bg-[#192633]"
              />
              <Input
                type="tel"
                label="Phone"
                value={editProfile.phone}
                onChange={(e) => setEditProfile((p) => ({ ...p, phone: e.target.value }))}
                className="border-[#324d67] bg-[#192633]"
              />
              <div className="flex flex-col">
                <label className="text-white text-base font-medium mb-2">Bio</label>
                <textarea
                  value={editProfile.bio}
                  onChange={(e) => setEditProfile((p) => ({ ...p, bio: e.target.value }))}
                  rows={4}
                  className="bg-[#192633] border border-[#324d67] rounded-lg px-4 py-3 text-white placeholder:text-[#92adc9] focus:outline-none focus:border-[#1172d4] resize-none"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-4">Uploads</h3>
            <div className="rounded-lg border border-[#324d67] p-4 bg-[#192633]">
              <div className="flex gap-3 mb-4 flex-wrap">
                <Button variant="secondary" onClick={() => addUpload("video")}>Add Video</Button>
                <Button variant="secondary" onClick={() => addUpload("certificate")}>Add Certificate</Button>
                <Button variant="secondary" onClick={() => addUpload("achievement")}>Add Achievement</Button>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <input
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="Paste YouTube link"
                  className="flex-1 bg-[#111a22] border border-[#324d67] rounded-lg px-3 py-2 text-white placeholder:text-[#92adc9] focus:outline-none focus:border-[#1172d4]"
                />
                <Button onClick={addYouTubeVideo}>Add YouTube</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {editProfile.uploads.length === 0 && (
                  <div className="rounded border border-[#233648] p-3 text-[#92adc9] text-sm">No uploads yet.</div>
                )}
                {editProfile.uploads.map((u) => (
                  <div key={u.id} className="rounded border border-[#233648] p-3 flex items-center gap-3 bg-[#111a22]">
                    {u.type === "video" && u.thumbnail ? (
                      <a href={u.url} target="_blank" rel="noreferrer" className="block shrink-0">
                        <div
                          className="bg-center bg-no-repeat bg-cover rounded w-28 h-16"
                          style={{ backgroundImage: `url('${u.thumbnail}')` }}
                        />
                      </a>
                    ) : (
                      <div className="rounded w-28 h-16 bg-[#111a22] border border-[#324d67] shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{u.name}</p>
                      <p className="text-[#92adc9] text-xs">{u.type}</p>
                      {u.url && (
                        <a href={u.url} target="_blank" rel="noreferrer" className="text-xs text-[#1172d4] underline">Open</a>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditProfile((p) => ({ ...p, uploads: p.uploads.filter((x) => x.id !== u.id) }))}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
