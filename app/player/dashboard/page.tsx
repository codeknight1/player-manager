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
              avatar:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuD8UTAaW5b3J5bJ_37zfFc1ut556yYxVS9S1sL8v-G27rwdivV8u6gMXTmA2eb_GUm05loRuR96IVfC4rEU1SbsqHYkN032pjeblqZ2F0C1W9sy9vskE1xYxLQJ3g3FDvGlpfdfzTnF6iIYG0e8tcRTQfkt67zzV0k-Kvrq8PhWsRHBp7wVn0TMxkYm9OD_dk_kiNgqS18HC4bNVlExyptluVg_orAndeR_kpMcDInDoYqFfGxIUplP9uv9lO7Dmhbj_SK5ZUsqmUNe",
            }}
            items={sidebarItems}
          />
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">
                Home
              </p>
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
            <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Recent Activity
            </h3>
            <div className="grid grid-cols-[40px_1fr] gap-x-2 px-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center gap-1 pt-3"
              >
                <div className="text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm76.52,147.42H170.9l-9.26-12.76,12.63-36.78,15-4.89,26.24,20.13A87.38,87.38,0,0,1,204.52,171.42Zm-164-34.3L66.71,117l15,4.89,12.63,36.78L85.1,171.42H51.48A87.38,87.38,0,0,1,40.47,137.12Zm10-50.64,5.51,18.6L40.71,116.77A87.33,87.33,0,0,1,50.43,86.48ZM109,152,97.54,118.65,128,97.71l30.46,20.94L147,152Zm91.07-46.92,5.51-18.6a87.33,87.33,0,0,1,9.72,30.29Zm-6.2-35.38-9.51,32.08-15.07,4.89L136,83.79V68.21l29.09-20A88.58,88.58,0,0,1,193.86,69.7ZM146.07,41.87,128,54.29,109.93,41.87a88.24,88.24,0,0,1,36.14,0ZM90.91,48.21l29.09,20V83.79L86.72,106.67l-15.07-4.89L62.14,69.7A88.58,88.58,0,0,1,90.91,48.21ZM63.15,187.42H83.52l7.17,20.27A88.4,88.4,0,0,1,63.15,187.42ZM110,214.13,98.12,180.71,107.35,168h41.3l9.23,12.71-11.83,33.42a88,88,0,0,1-36.1,0Zm55.36-6.44,7.17-20.27h20.37A88.4,88.4,0,0,1,165.31,207.69Z" />
                  </svg>
                </div>
                <div className="w-[1.5px] bg-[#324d67] h-2 grow"></div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-1 flex-col py-3"
              >
                <p className="text-white text-base font-medium leading-normal">
                  Completed a training session
                </p>
                <p className="text-[#92adc9] text-base font-normal leading-normal">
                  2 hours ago
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-[1.5px] bg-[#324d67] h-2"></div>
                <div className="text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z" />
                  </svg>
                </div>
                <div className="w-[1.5px] bg-[#324d67] h-2 grow"></div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-1 flex-col py-3"
              >
                <p className="text-white text-base font-medium leading-normal">
                  Updated profile information
                </p>
                <p className="text-[#92adc9] text-base font-normal leading-normal">
                  Yesterday
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center gap-1 pb-3"
              >
                <div className="w-[1.5px] bg-[#324d67] h-2"></div>
                <UsersThreeIcon size={24} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-1 flex-col py-3"
              >
                <p className="text-white text-base font-medium leading-normal">
                  Joined a new team
                </p>
                <p className="text-[#92adc9] text-base font-normal leading-normal">
                  3 days ago
                </p>
              </motion.div>
            </div>
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

