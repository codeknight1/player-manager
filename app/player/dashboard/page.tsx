"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import {
  HouseIcon,
  UserIcon,
  UsersThreeIcon,
  ChatIcon,
  BellIcon,
  EyeIcon,
  HandshakeIcon,
  TrophyIcon
} from "@/components/icons";
import { apiGet } from "@/app/lib/api";
import { LogoutButton } from "@/components/auth/logout-button";
import { usePlayerApplications } from "@/app/hooks/usePlayerApplications";
import {
  applicationStatusStyles,
  formatApplicationStatus,
  formatApplicationDate,
  getApplicationTimestamp,
} from "@/app/player/applications/utils";

function useSidebarItems() {
  return useMemo(
    () => [
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
    ],
    []
  );
}

const emptyProfile = {
  firstName: "",
  lastName: "",
  email: "",
  age: 0,
  position: "",
  nationality: "",
  phone: "",
  bio: "",
  avatar: "",
  stats: { goals: 0, assists: 0, matches: 0 },
  uploads: [] as Array<Record<string, any>>,
};

function mapProfilePayload(payload: any) {
  if (!payload) return emptyProfile;

  const profileSource = (() => {
    if (payload?.profile && typeof payload.profile === "object" && !Array.isArray(payload.profile)) {
      return payload.profile;
    }
    if (payload?.profile && typeof payload.profile === "string") {
      try {
        return JSON.parse(payload.profile);
      } catch {
        return {};
      }
    }
    if (payload?.profileData && typeof payload.profileData === "string") {
      try {
        return JSON.parse(payload.profileData);
      } catch {
        return {};
      }
    }
    if (payload?.profileData && typeof payload.profileData === "object") {
      return payload.profileData;
    }
    return {};
  })();

  const name = payload?.name ?? "";
  const nameParts = name.trim().split(" ");
  const stats = typeof profileSource.stats === "object" && profileSource.stats !== null
    ? {
        goals: Number(profileSource.stats.goals) || 0,
        assists: Number(profileSource.stats.assists) || 0,
        matches: Number(profileSource.stats.matches) || 0,
      }
    : emptyProfile.stats;

  const normalizeUploadType = (value: any) => {
    const lower = (value ?? "").toString().toLowerCase();
    if (lower === "video" || lower === "certificate" || lower === "achievement") {
      return lower;
    }
    return "achievement";
  };

  const uploadsSource = (() => {
    if (Array.isArray(payload?.uploads) && payload.uploads.length) {
      return payload.uploads;
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
    ...emptyProfile,
    ...profileSource,
    firstName: profileSource.firstName ?? nameParts[0] ?? "",
    lastName: profileSource.lastName ?? nameParts.slice(1).join(" ") ?? "",
    email: profileSource.email ?? payload?.email ?? "",
    age: Number(profileSource.age) || 0,
    stats,
    uploads,
  };
}

export default function PlayerDashboard() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;
  const [profilePayload, setProfilePayload] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { applications, loading: applicationsLoading } = usePlayerApplications(userId);

  useEffect(() => {
    if (session === undefined) return;

    if (userId) {
      loadData(userId);
    } else {
      setLoading(false);
    }
  }, [session, userId]);

  async function loadData(userId: string) {
    try {
      const [userData, notificationsData] = await Promise.all([
        apiGet(`profile?userId=${userId}`).catch(() => null),
        apiGet(`notifications?userId=${userId}`).catch(() => []),
      ]);
      
      if (userData) {
        setProfilePayload(userData);
      }
      setNotifications(notificationsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const mappedProfile = mapProfilePayload(profilePayload);
  const userName = profilePayload?.name || session?.user?.name || "Player";
  const userRole = (session?.user as any)?.role || "Player";
  const position = mappedProfile.position;
  const age = mappedProfile.age;
  const nationality = mappedProfile.nationality;
  const stats = mappedProfile.stats;
  const applicationPreview = useMemo(() => {
    const entries = [...applications];
    entries.sort((a, b) => {
      const bDate = getApplicationTimestamp(b.trial?.date ?? b.createdAt);
      const aDate = getApplicationTimestamp(a.trial?.date ?? a.createdAt);
      return bDate - aDate;
    });
    return entries.slice(0, 3);
  }, [applications]);

  const displayName = `${mappedProfile.firstName} ${mappedProfile.lastName}`.trim() || userName;
  const displayInfo = [position, age ? `Age ${age}` : "", nationality].filter(Boolean).join(" • ") || "Complete your profile";
  const avatarUrl = mappedProfile.avatar || profilePayload?.avatar || profilePayload?.profile?.avatar;

  const sidebarItems = useSidebarItems();

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 flex-col lg:flex-row gap-6 px-4 md:px-6 py-5">
          <Sidebar
            title="TalentVerse"
            user={{
              name: displayName,
              role: userRole,
              avatar: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || "Player")}&background=1172d4&color=fff`,
            }}
            items={sidebarItems}
          />
          <div className="layout-content-container flex w-full flex-col flex-1 max-w-[960px]">
            <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
              <p className="text-white tracking-light text-[32px] font-bold leading-tight">
                Home
              </p>
              <div className="flex items-center justify-end">
                <LogoutButton />
              </div>
            </div>
            <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              My Profile
            </h3>
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-4 items-center">
                <div
                  className="bg-center bg-no-repeat bg-cover rounded-full h-28 w-28 sm:h-32 sm:w-32"
                  style={{
                    backgroundImage: avatarUrl ? `url("${avatarUrl}")` : undefined,
                    backgroundColor: avatarUrl ? undefined : "#233648",
                  }}
                ></div>
                <div className="flex flex-col justify-center">
                  <p className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
                    {loading ? "Loading..." : displayName}
                  </p>
                  <p className="text-[#92adc9] text-base font-normal leading-normal">
                    {loading ? "Loading profile..." : displayInfo}
                  </p>
                </div>
              </div>
            </div>
            {/* Recent Activity removed: will rely on real notifications/messages elsewhere */}
            <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Notifications
            </h3>
            {loading ? (
              <div className="px-4 text-[#92adc9]">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="px-4 text-[#92adc9]">No notifications yet</div>
            ) : (
              notifications.slice(0, 2).map((notification, idx) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4 bg-[#111a22] px-4 min-h-[72px] py-2"
                >
                  <div className="text-white flex items-center justify-center rounded-lg bg-[#233648] shrink-0 size-12">
                    {!notification.read && <div className="absolute size-2 rounded-full bg-[#1172d4]"></div>}
                    <BellIcon size={24} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className={`text-base font-medium leading-normal line-clamp-1 ${notification.read ? "text-[#92adc9]" : "text-white"}`}>
                      {notification.title}
                    </p>
                    <p className="text-[#92adc9] text-sm font-normal leading-normal line-clamp-2">
                      {notification.body}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
            <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Applications
            </h3>
            <div className="px-4 pb-2">
              {applicationsLoading ? (
                <div className="text-[#92adc9]">Loading applications...</div>
              ) : applicationPreview.length === 0 ? (
                <div className="text-[#92adc9]">
                  No applications yet.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {applicationPreview.map((application) => {
                    const trialTitle = application.trial?.title || "Unknown Trial";
                    const city = application.trial?.city || "Unspecified city";
                    const trialDate = application.trial?.date ?? application.createdAt;
                    const statusKey = (application.status || "").toLowerCase();
                    const badgeClass = applicationStatusStyles[statusKey] ?? applicationStatusStyles.default;
                    const formattedDate = formatApplicationDate(trialDate);
                    const hostName = application.trial?.createdBy?.name;
                    return (
                      <div
                        key={application.id}
                        className="flex flex-col gap-2 rounded-lg border border-[#324d67] bg-[#192633] p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-white text-base font-semibold leading-tight line-clamp-1">
                            {trialTitle}
                          </p>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${badgeClass}`}>
                            {formatApplicationStatus(application.status)}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-[#92adc9]">
                          <span>{city}</span>
                          {hostName && <span>• Hosted by {hostName}</span>}
                          {formattedDate && <span>• {formattedDate}</span>}
                        </div>
                      </div>
                    );
                  })}
                  {applications.length > applicationPreview.length && (
                    <div className="text-[#92adc9] text-sm">
                      Showing {applicationPreview.length} of {applications.length} applications.
                    </div>
                  )}
                </div>
              )}
            </div>
            <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Key Performance Widgets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-2 rounded-lg p-6 border border-[#324d67]"
              >
                <p className="text-white text-base font-medium leading-normal">
                  Goals Scored
                </p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">
                  {loading ? "..." : stats.goals || 0}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-2 rounded-lg p-6 border border-[#324d67]"
              >
                <p className="text-white text-base font-medium leading-normal">
                  Assists
                </p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">
                  {loading ? "..." : stats.assists || 0}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-2 rounded-lg p-6 border border-[#324d67]"
              >
                <p className="text-white text-base font-medium leading-normal">
                  Matches Played
                </p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">
                  {loading ? "..." : stats.matches || 0}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

