"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { 
  HouseIcon, 
  UserIcon, 
  UsersThreeIcon, 
  ChatIcon, 
  BellIcon,
  EyeIcon
} from "@/components/icons";
import { apiGet } from "@/app/lib/api";
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

export default function PlayerDashboard() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      loadData();
    }
  }, [session]);

  async function loadData() {
    try {
      const [userData, notificationsData] = await Promise.all([
        apiGet(`profile?userId=${(session?.user as any)?.id}`).catch(() => null),
        apiGet(`notifications?userId=${(session?.user as any)?.id}`).catch(() => []),
      ]);
      
      if (userData) {
        setProfile(userData);
      }
      setNotifications(notificationsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const profileData = profile?.profile || null;
  const userName = profile?.name || session?.user?.name || "Player";
  const userRole = (session?.user as any)?.role || "Player";
  const position = profileData?.position || "";
  const age = profileData?.age || 0;
  const nationality = profileData?.nationality || "";
  const stats = profileData?.stats || { goals: 0, assists: 0, matches: 0 };

  const displayName = `${profileData?.firstName || ""} ${profileData?.lastName || ""}`.trim() || userName;
  const displayInfo = [position, age ? `Age ${age}` : "", nationality].filter(Boolean).join(" • ") || "Complete your profile";

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <Sidebar
            title="TalentVerse"
            user={{
              name: displayName,
              role: userRole,
              avatar: profileData?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || "Player")}&background=1172d4&color=fff`,
            }}
            items={sidebarItems}
          />
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">
                Home
              </p>
              <div className="flex items-center gap-3">
                <LogoutButton />
              </div>
            </div>
            <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              My Profile
            </h3>
            <div className="flex p-4 @container">
              <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
                <div className="flex gap-4">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDOzLX2XLK4cGPgrG12yQVwDVzN55gdUdOl00ePXVw3Z5A1UgEbrsVzRIjir0ga836J12KdSr_nUgZLZq2aYElNOnhK6qc81PvZJ1yVee6HbqsjNUMasX0nyC7_bomdKpdp34g14nFi49rRj5HEHrxq4scnI88GXyGirxmU6Oy2P3Eu-AME1mlGv9tSQYzlDDYH6HofYPTbNCNKu_XW7UQ0BDD6lPV7PKm9kViX2Pic4sN1hODMjgEKGt1BnG1j9xMGOUv1TudJFIGq")',
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
              Key Performance Widgets
            </h3>
            <div className="flex flex-wrap gap-4 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#324d67]"
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
                className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#324d67]"
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
                className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#324d67]"
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

