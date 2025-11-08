"use client";

import { useState, useEffect, useRef, ChangeEvent, useMemo } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { CollapsibleSidebar } from "@/components/layout/collapsible-sidebar";
import { Modal } from "@/components/ui/modal";
import { HouseIcon, UserIcon, UsersThreeIcon, ChatIcon, BellIcon, ShareIcon, HandshakeIcon, TrophyIcon, EyeIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiGet, apiPost, apiPut, apiDelete } from "@/app/lib/api";
import { toast } from "sonner";
import { LogoutButton } from "@/components/auth/logout-button";
import { usePlayerApplications } from "@/app/hooks/usePlayerApplications";
import {
  applicationStatusStyles,
  formatApplicationStatus,
  formatApplicationDate,
  getApplicationTimestamp,
} from "@/app/player/applications/utils";

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
    label: "Trials",
    href: "/explore-opportunities",
    icon: <EyeIcon size={24} />,
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
  {
    label: "For Players",
    href: "/for-players",
    icon: <UserIcon size={24} />,
  },
  {
    label: "For Clubs/Agents",
    href: "/for-clubs",
    icon: <HandshakeIcon size={24} />,
  },
  {
    label: "For Partners",
    href: "/for-partners",
    icon: <TrophyIcon size={24} />,
  },
];

export default function PlayerProfilePage() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;
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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputsRef = useRef<Record<string, HTMLInputElement | null>>({});
  const newCertificateInputRef = useRef<HTMLInputElement>(null);
  const newAchievementInputRef = useRef<HTMLInputElement>(null);
  const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"];
  const { applications, loading: applicationsLoading } = usePlayerApplications(userId);
  const sortedApplications = useMemo(() => {
    const entries = [...applications];
    entries.sort((a, b) => {
      const bDate = getApplicationTimestamp(b.trial?.date ?? b.createdAt);
      const aDate = getApplicationTimestamp(a.trial?.date ?? a.createdAt);
      return bDate - aDate;
    });
    return entries;
  }, [applications]);

  async function handleDeleteUpload(uploadId: string) {
    const userId = (session?.user as any)?.id;
    if (!userId) {
      toast.error("Please log in");
      return;
    }
    if (typeof window !== "undefined" && !window.confirm("Remove this upload?")) {
      return;
    }
    try {
      await apiDelete(`uploads?id=${uploadId}&userId=${userId}`);
      setProfile((prev) => ({
        ...prev,
        uploads: prev.uploads.filter((upload) => upload.id !== uploadId),
      }));
      setEditProfile((prev) => ({
        ...prev,
        uploads: prev.uploads.filter((upload) => upload.id !== uploadId),
      }));
      toast.success("Upload removed");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove upload");
    }
  }

  const isPdfSource = (value?: string) => {
    if (!value) {
      return false;
    }
    const normalized = value.toLowerCase().split("?")[0];
    return normalized.startsWith("data:application/pdf") || normalized.endsWith(".pdf");
  };

  const isImageSource = (value?: string) => {
    if (!value) {
      return false;
    }
    const normalized = value.toLowerCase().split("?")[0];
    if (normalized.startsWith("data:image")) {
      return true;
    }
    return imageExtensions.some((ext) => normalized.endsWith(ext));
  };

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });

  useEffect(() => {
    if (session === undefined) {
      return;
    }

    if (userId) {
      loadProfile(userId);
    } else {
      setLoading(false);
    }
  }, [session, userId]);

  function mapProfile(user: any) {
    const profileSource = (() => {
      if (user?.profile && typeof user.profile === "object" && !Array.isArray(user.profile)) {
        return user.profile;
      }
      if (user?.profile && typeof user.profile === "string") {
        try {
          return JSON.parse(user.profile);
        } catch {
          return {};
        }
      }
      if (user?.profileData && typeof user.profileData === "string") {
        try {
          return JSON.parse(user.profileData);
        } catch {
          return {};
        }
      }
      if (user?.profileData && typeof user.profileData === "object") {
        return user.profileData;
      }
      return {};
    })();

    const nameParts = (user?.name ?? "").trim().split(" ");
    const firstName = profileSource.firstName ?? nameParts[0] ?? "";
    const lastName = profileSource.lastName ?? nameParts.slice(1).join(" ") ?? "";

    const stats = typeof profileSource.stats === "object" && profileSource.stats !== null
      ? {
          goals: Number(profileSource.stats.goals) || 0,
          assists: Number(profileSource.stats.assists) || 0,
          matches: Number(profileSource.stats.matches) || 0,
        }
      : { goals: 0, assists: 0, matches: 0 };

    const normalizeUploadType = (value: any) => {
      const lower = (value ?? "").toString().toLowerCase();
      if (lower === "video" || lower === "certificate" || lower === "achievement") {
        return lower as "video" | "certificate" | "achievement";
      }
      return "achievement";
    };

    const uploadsSource = (() => {
      if (Array.isArray(user?.uploads) && user.uploads.length) {
        return user.uploads;
      }
      if (Array.isArray(profileSource.uploads)) {
        return profileSource.uploads;
      }
      return [];
    })();

    const uploads = uploadsSource.map((upload: any) => ({
      id: upload.id ?? Math.random().toString(36).slice(2, 9) + Date.now().toString(36),
      name: upload.name ?? "",
      type: normalizeUploadType(upload.type),
      url: upload.url ?? "",
      thumbnail: upload.thumbnail ?? "",
      createdAt: upload.createdAt ?? new Date().toISOString(),
    }));

    return {
      firstName,
      lastName,
      email: user?.email ?? profileSource.email ?? "",
      age: Number(profileSource.age) || 0,
      position: profileSource.position ?? "",
      nationality: profileSource.nationality ?? "",
      phone: profileSource.phone ?? "",
      bio: profileSource.bio ?? "",
      avatar: profileSource.avatar ?? "",
      stats,
      uploads,
    };
  }

  async function loadProfile(userId: string) {
    try {
      const user = await apiGet(`profile?userId=${userId}`);
      
      if (user && !user.error) {
        const loadedProfile = mapProfile(user);
        setProfile(loadedProfile);
        setEditProfile(loadedProfile);
        
        if (!user.profile && !user.profileData) {
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

  function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
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
    if (kind === "certificate") {
      newCertificateInputRef.current?.click();
      return;
    }
    if (kind === "achievement") {
      newAchievementInputRef.current?.click();
      return;
    }
    const id = Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
    const timestamp = new Date().toISOString();
    const name = `${kind.charAt(0).toUpperCase() + kind.slice(1)} - ${new Date(timestamp).toLocaleDateString()}`;
    setEditProfile((p) => ({
      ...p,
      uploads: [{ id, name, type: kind, createdAt: timestamp, url: "", thumbnail: "" }, ...p.uploads],
    }));
    if (kind === "video") {
      toast.success("Video placeholder added.");
      return;
    }
    toast.success("Upload added.");
  }

  function addAchievementPlaceholder() {
    const id = Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
    const timestamp = new Date().toISOString();
    setEditProfile((prev) => ({
      ...prev,
      uploads: [
        {
          id,
          name: `Achievement - ${new Date(timestamp).toLocaleDateString()}`,
          type: "achievement",
          createdAt: timestamp,
          url: "",
          thumbnail: "",
        },
        ...prev.uploads,
      ],
    }));
    toast.success("Achievement placeholder added.");
  }

  async function handleNewCertificateFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) {
      return;
    }
    const invalidType = files.find((file) => file.type !== "application/pdf");
    if (invalidType) {
      toast.error("Certificates must be PDF files");
      return;
    }
    const oversized = files.find((file) => file.size > 10 * 1024 * 1024);
    if (oversized) {
      toast.error("Certificate size must be less than 10MB");
      return;
    }
    try {
      const entries = await Promise.all(
        files.map(async (file) => {
          const createdAt = new Date().toISOString();
          return {
            id: `${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36)}`,
            name: file.name || `Certificate - ${new Date(createdAt).toLocaleDateString()}`,
            type: "certificate" as const,
            createdAt,
            url: await readFileAsDataUrl(file),
            thumbnail: "",
          };
        })
      );
      setEditProfile((prev) => ({
        ...prev,
        uploads: [...entries, ...prev.uploads],
      }));
      toast.success(entries.length > 1 ? "Certificates added." : "Certificate added.");
    } catch (err: any) {
      toast.error(err.message || "Unable to process certificates");
    }
  }

  async function handleNewAchievementFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) {
      return;
    }
    const invalidType = files.find((file) => !(file.type === "application/pdf" || file.type.startsWith("image/")));
    if (invalidType) {
      toast.error("Achievements accept PDFs or images only");
      return;
    }
    const oversized = files.find((file) => file.size > 10 * 1024 * 1024);
    if (oversized) {
      toast.error("Files must be less than 10MB");
      return;
    }
    try {
      const entries = await Promise.all(
        files.map(async (file) => {
          const createdAt = new Date().toISOString();
          const url = await readFileAsDataUrl(file);
          return {
            id: `${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36)}`,
            name: file.name || `Achievement - ${new Date(createdAt).toLocaleDateString()}`,
            type: "achievement" as const,
            createdAt,
            url,
            thumbnail: file.type.startsWith("image/") ? url : "",
          };
        })
      );
      setEditProfile((prev) => ({
        ...prev,
        uploads: [...entries, ...prev.uploads],
      }));
      toast.success(entries.length > 1 ? "Achievements added." : "Achievement added.");
    } catch (err: any) {
      toast.error(err.message || "Unable to process files");
    }
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
    const entries = youtubeUrl
      .split(/\s|,|\n/)
      .map((item) => item.trim())
      .filter(Boolean);
    if (entries.length === 0) {
      toast.error("Paste at least one YouTube link");
      return;
    }
    const additions: typeof editProfile.uploads = [];
    entries.forEach((entry) => {
      const extracted = extractYouTubeId(entry);
      if (!extracted) {
        return;
      }
      const thumb = `https://i.ytimg.com/vi/${extracted}/hqdefault.jpg`;
      const name = `YouTube ${extracted}`;
      additions.push({
        id: `${extracted}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
        name,
        type: "video",
        url: `https://www.youtube.com/watch?v=${extracted}`,
        thumbnail: thumb,
        createdAt: new Date().toISOString(),
      });
    });
    if (!additions.length) {
      toast.error("No valid YouTube links found");
      return;
    }
    setEditProfile((p) => ({
      ...p,
      uploads: [...additions, ...p.uploads.filter((item) => item.type === "video")],
    }));
    setYoutubeUrl("");
    toast.success(additions.length > 1 ? "YouTube videos added!" : "YouTube video added!");
  }

  function updateUpload(uploadId: string, data: Partial<{ name: string; url?: string; thumbnail?: string }>) {
    setEditProfile((prev) => ({
      ...prev,
      uploads: prev.uploads.map((upload) =>
        upload.id === uploadId
          ? {
              ...upload,
              ...data,
            }
          : upload
      ),
    }));
  }

  function removeUpload(uploadId: string) {
    delete fileInputsRef.current[uploadId];
    setEditProfile((prev) => ({
      ...prev,
      uploads: prev.uploads.filter((upload) => upload.id !== uploadId),
    }));
  }

  function handleUploadAsset(uploadId: string, type: "certificate" | "achievement", file: File) {
    if (type === "certificate" && file.type !== "application/pdf") {
      toast.error("Certificates must be PDF files");
      return;
    }
    if (type === "achievement" && !(file.type === "application/pdf" || file.type.startsWith("image/"))) {
      toast.error("Achievements support images or PDF files");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (!result) {
        toast.error("Failed to process file");
        return;
      }
      setEditProfile((prev) => ({
        ...prev,
        uploads: prev.uploads.map((upload) => {
          if (upload.id !== uploadId) {
            return upload;
          }
          const next = { ...upload, url: result };
          if (file.type.startsWith("image/")) {
            next.thumbnail = result;
          } else {
            next.thumbnail = undefined;
          }
          if (!upload.name || upload.name.startsWith("Certificate") || upload.name.startsWith("Achievement")) {
            next.name = file.name;
          }
          return next;
        }),
      }));
      toast.success("File attached");
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    reader.readAsDataURL(file);
  }

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>, uploadId: string, type: "certificate" | "achievement") {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    handleUploadAsset(uploadId, type, file);
  }

  async function handleSave() {
    const userId = (session?.user as any)?.id;
    if (!userId) {
      toast.error("Please log in");
      return;
    }
    console.log("Saving uploads", editProfile.uploads.map((upload) => ({ id: upload.id, type: upload.type, name: upload.name, hasUrl: Boolean(upload.url) })));

    const hasInvalidCertificate = editProfile.uploads.some(
      (upload) => upload.type === "certificate" && (!upload.url || !isPdfSource(upload.url))
    );
    if (hasInvalidCertificate) {
      toast.error("Attach a PDF file or link for each certificate");
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
      };
      const uploadsPayload = editProfile.uploads.map((upload) => ({
        id: upload.id,
        name: upload.name,
        type: upload.type,
        url: upload.url ?? "",
        thumbnail: upload.thumbnail ?? "",
        createdAt: upload.createdAt ?? new Date().toISOString(),
      }));

      await apiPost("profile", {
        userId: userId,
        name: `${editProfile.firstName} ${editProfile.lastName}`.trim() || session?.user?.name || "Player",
        profileData: profilePayload,
      });
      
      await apiPut("uploads", {
        userId,
        uploads: uploadsPayload.map((upload) => ({
          ...upload,
          type: upload.type.toUpperCase(),
        })),
      });

      await loadProfile(userId);
      
      toast.success("Profile saved successfully!");
      closeEditModal();
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  function shareProfile() {
    const id = (session?.user as any)?.id;
    if (!id) {
      toast.error("Please log in");
      return;
    }
    if (typeof window === "undefined") {
      return;
    }
    const shareUrl = `${window.location.origin}/portfolio/${id}`;
    setShareLink(shareUrl);
    setIsShareModalOpen(true);
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

  const featuredVideo = profile.uploads.find((u) => u.type === "video" && u.url);
  const featuredVideoId = featuredVideo ? extractYouTubeId(featuredVideo.url ?? "") : null;

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 flex-col lg:flex-row gap-6 px-3 md:px-4 py-4 md:py-5">
          <CollapsibleSidebar
            title="TalentVerse"
            user={{
              name: `${profile.firstName} ${profile.lastName}`.trim() || session?.user?.name || "Player",
              role: (session?.user as any)?.role || "Player",
              avatar: profile.avatar || undefined,
            }}
            items={sidebarItems}
            showToggle={false}
          />
          <div className="layout-content-container flex w-full flex-col max-w-[960px] flex-1">
            <div className="flex flex-col gap-2 px-3 pt-2 pb-4 md:flex-row md:items-center md:justify-between md:px-4 md:pt-3">
              <div className="flex flex-col gap-2">
                <p className="text-white tracking-light text-[32px] font-bold leading-tight">
                  My Profile
                </p>
                <p className="text-[#92adc9] text-sm font-normal leading-normal">
                  View your profile information
                </p>
              </div>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
                <div className="h-3 w-full md:w-48 rounded bg-[#192633] overflow-hidden">
                  <div className="h-full bg-[#1172d4]" style={{ width: `${strength}%` }} />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-white text-sm font-medium">Strength {strength}%</span>
                  <Button
                    onClick={shareProfile}
                    className="flex items-center gap-2 rounded-full bg-[#23272b] px-4 py-2 text-white hover:bg-[#2f3338] focus:ring-0"
                  >
                    <ShareIcon size={22} />
                    <span className="text-sm font-medium">Share</span>
                  </Button>
                  <Button onClick={openEditModal}>Edit Profile</Button>
                  <LogoutButton />
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-6 px-4 py-6 md:px-6 rounded-lg border border-[#324d67] bg-[#192633] mx-3 mt-2 mb-4 md:mx-4"
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

            {featuredVideoId && (
              <div className="px-4">
                <div className="aspect-video w-full overflow-hidden rounded-lg border border-[#324d67] bg-[#000]">
                  <iframe
                    src={`https://www.youtube.com/embed/${featuredVideoId}`}
                    title="Featured video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              </div>
            )}

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

            <div className="p-4">
              <h3 className="text-white text-xl font-bold mb-4">Trial Applications</h3>
              {applicationsLoading ? (
                <div className="rounded-lg border border-[#324d67] bg-[#192633] p-4 text-[#92adc9]">
                  Loading applications...
                </div>
              ) : sortedApplications.length === 0 ? (
                <div className="rounded-lg border border-[#324d67] bg-[#192633] p-4 text-[#92adc9] text-sm">
                  No applications yet.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {sortedApplications.map((application) => {
                    const trialTitle = application.trial?.title || "Unknown Trial";
                    const subtitleParts = [application.trial?.city || "Unspecified city"];
                    if (application.trial?.createdBy?.name) {
                      subtitleParts.push(`Hosted by ${application.trial.createdBy.name}`);
                    }
                    const trialDate = formatApplicationDate(application.trial?.date ?? application.createdAt);
                    if (trialDate) {
                      subtitleParts.push(trialDate);
                    }
                    const statusKey = (application.status || "").toLowerCase();
                    const badgeClass = applicationStatusStyles[statusKey] ?? applicationStatusStyles.default;
                    const appliedDate = formatApplicationDate(application.createdAt);
                    return (
                      <div key={application.id} className="rounded-lg border border-[#324d67] bg-[#192633] p-4 flex flex-col gap-2">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-col gap-1">
                            <span className="text-white text-base font-semibold leading-tight">{trialTitle}</span>
                            <span className="text-[#92adc9] text-sm">{subtitleParts.join(" • ")}</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>
                            {formatApplicationStatus(application.status)}
                          </span>
                        </div>
                        {appliedDate && (
                          <span className="text-[#6d859f] text-xs">
                            Applied {appliedDate}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {profile.uploads.length > 0 && (
              <div className="p-4">
                <h3 className="text-white text-xl font-bold mb-4">Uploads ({profile.uploads.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {profile.uploads.map((u) => {
                    const previewSource = isImageSource(u.thumbnail || u.url || "") ? (u.thumbnail || u.url || "") : null;
                    const pdfAttached = isPdfSource(u.url);
                    return (
                      <div key={u.id} className="rounded border border-[#233648] p-3 bg-[#192633] flex items-center gap-3">
                        {u.type === "video" && u.thumbnail ? (
                          <a href={u.url} target="_blank" rel="noreferrer" className="block shrink-0">
                            <div
                              className="bg-center bg-no-repeat bg-cover rounded w-28 h-16"
                              style={{ backgroundImage: `url('${u.thumbnail}')` }}
                            />
                          </a>
                        ) : previewSource ? (
                          <a
                            href={u.url || previewSource}
                            target="_blank"
                            rel="noreferrer"
                            className="block shrink-0"
                          >
                            <div
                              className="bg-center bg-no-repeat bg-cover rounded w-28 h-16"
                              style={{ backgroundImage: `url('${previewSource}')` }}
                            />
                          </a>
                        ) : (
                          <div className="rounded w-28 h-16 bg-[#111a22] border border-[#324d67] shrink-0 flex items-center justify-center text-[10px] font-semibold uppercase text-[#92adc9]">
                            {pdfAttached ? "PDF" : u.type}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{u.name}</p>
                          <p className="text-[#92adc9] text-xs capitalize">{u.type}</p>
                          {u.url && (
                            <a href={u.url} target="_blank" rel="noreferrer" className="text-xs text-[#1172d4] underline">Open</a>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteUpload(u.id)}>
                          Delete
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <input
        ref={newCertificateInputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={handleNewCertificateFiles}
      />
      <input
        ref={newAchievementInputRef}
        type="file"
        accept="application/pdf,image/*"
        multiple
        className="hidden"
        onChange={handleNewAchievementFiles}
      />

      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Profile"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsShareModalOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <Input
              value={shareLink}
              readOnly
              className="h-12"
            />
            <Button
              onClick={async () => {
                if (!shareLink) {
                  return;
                }
                try {
                  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
                    await navigator.clipboard.writeText(shareLink);
                  } else {
                    const input = document.createElement("input");
                    input.value = shareLink;
                    document.body.appendChild(input);
                    input.select();
                    document.execCommand("copy");
                    document.body.removeChild(input);
                  }
                  toast.success("Link copied to clipboard");
                } catch {
                  toast.error("Unable to copy link");
                }
              }}
            >
              Copy Link
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "twitter", label: "Twitter" },
              { key: "linkedin", label: "LinkedIn" },
              { key: "facebook", label: "Facebook" },
              { key: "whatsapp", label: "WhatsApp" },
            ].map((platform) => (
              <Button
                key={platform.key}
                variant="secondary"
                onClick={() => {
                  if (typeof window === "undefined" || !shareLink) {
                    return;
                  }
                  const profileName = `${profile.firstName} ${profile.lastName}`.trim() || "Player profile";
                  const text = `Check out ${profileName} on TalentVerse`;
                  const encodedLink = encodeURIComponent(shareLink);
                  const encodedText = encodeURIComponent(text);
                  let targetUrl = "";
                  if (platform.key === "twitter") {
                    targetUrl = `https://twitter.com/intent/tweet?url=${encodedLink}&text=${encodedText}`;
                  } else if (platform.key === "linkedin") {
                    targetUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`;
                  } else if (platform.key === "facebook") {
                    targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
                  } else if (platform.key === "whatsapp") {
                    targetUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedLink}`;
                  }
                  if (targetUrl) {
                    window.open(targetUrl, "_blank", "noopener,noreferrer");
                  }
                }}
              >
                {platform.label}
              </Button>
            ))}
          </div>
        </div>
      </Modal>

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
                <Button variant="secondary" onClick={() => addUpload("certificate")}>Upload Certificates</Button>
                <Button variant="secondary" onClick={() => addUpload("achievement")}>Upload Achievements</Button>
                <Button variant="outline" onClick={addAchievementPlaceholder}>New Achievement Link</Button>
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
                {editProfile.uploads.map((u) => {
                  if (u.type === "video") {
                    return (
                      <div key={u.id} className="rounded border border-[#233648] p-3 flex items-center gap-3 bg-[#111a22]">
                        {u.thumbnail ? (
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
                          onClick={() => removeUpload(u.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    );
                  }
                  const previewSource = isImageSource(u.thumbnail || u.url || "") ? (u.thumbnail || u.url || "") : null;
                  const pdfAttached = isPdfSource(u.url);
                  const hasFile = Boolean(u.url);
                  const createdDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : null;
                  return (
                    <div key={u.id} className="rounded-2xl border border-[#233648] bg-[#111a22] p-5 shadow-lg shadow-[#0b1824]/20">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap gap-4">
                          {previewSource ? (
                            <a
                              href={u.url || previewSource}
                              target="_blank"
                              rel="noreferrer"
                              className="block shrink-0 overflow-hidden rounded-xl border border-[#324d67]"
                              style={{ width: "112px", height: "72px" }}
                            >
                              <div
                                className="h-full w-full bg-cover bg-center"
                                style={{ backgroundImage: `url('${previewSource}')` }}
                              />
                            </a>
                          ) : (
                            <div className="flex h-[72px] w-[112px] shrink-0 items-center justify-center rounded-xl border border-dashed border-[#324d67] bg-[#0c141b] text-[11px] font-semibold uppercase tracking-wide text-[#92adc9]">
                              {pdfAttached ? "PDF" : u.type}
                            </div>
                          )}
                          <div className="flex min-w-0 flex-1 flex-col gap-3">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <span className="rounded-full bg-[#1172d4]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#56a7ff]">
                                {u.type}
                              </span>
                              {createdDate && <span className="text-xs text-[#6d859f]">Added {createdDate}</span>}
                            </div>
                            <Input
                              label="Title"
                              value={u.name}
                              onChange={(e) => updateUpload(u.id, { name: e.target.value })}
                              className="h-12"
                            />
                            {u.type === "certificate" ? (
                              <Input
                                label="PDF link"
                                type="url"
                                value={u.url && !u.url.startsWith("data:") ? u.url : ""}
                                onChange={(e) => updateUpload(u.id, { url: e.target.value, thumbnail: undefined })}
                                className="h-12"
                                placeholder="https://example.com/certificate.pdf"
                              />
                            ) : (
                              <Input
                                label="Link"
                                type="url"
                                value={u.url && !u.url.startsWith("data:") ? u.url : ""}
                                onChange={(e) => updateUpload(u.id, { url: e.target.value, thumbnail: isImageSource(e.target.value) ? e.target.value : undefined })}
                                className="h-12"
                                placeholder="https://example.com/achievement"
                              />
                            )}
                            {hasFile && (
                              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#233648] bg-[#0c141b] px-3 py-2 text-xs text-[#92adc9]">
                                <span>{pdfAttached ? "PDF attached" : previewSource ? "Image attached" : "Link ready"}</span>
                                {u.url && (
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => u.url && window.open(u.url, "_blank", "noopener,noreferrer")}
                                    className="h-7 px-3 text-xs"
                                  >
                                    View
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <input
                            ref={(el) => {
                              fileInputsRef.current[u.id] = el;
                            }}
                            type="file"
                            accept={u.type === "certificate" ? "application/pdf" : "application/pdf,image/*"}
                            onChange={(event) => handleFileInputChange(event, u.id, u.type)}
                            className="hidden"
                          />
                          <Button
                            variant="secondary"
                            onClick={() => fileInputsRef.current[u.id]?.click()}
                          >
                            {u.type === "certificate" ? "Upload PDF" : "Upload File"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => removeUpload(u.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
