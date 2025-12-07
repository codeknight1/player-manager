"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { PlayerNavbar } from "./player-navbar";
import { MobileSidebar } from "./mobile-sidebar";
import { HouseIcon, UserIcon, UsersThreeIcon, ChatIcon, MagnifyingGlassIcon, GearIcon, TrophyIcon, ShieldCheckIcon, ListChecksIcon } from "@/components/icons";
import { apiGet } from "@/app/lib/api";

interface HeaderProps {
  title?: string;
  logo?: React.ReactNode;
  navItems?: { label: string; href: string }[];
  rightAction?: React.ReactNode;
}

const playerNavItems = [
  { label: "Home", href: "/player/dashboard" },
  { label: "My Profile", href: "/player/profile" },
  { label: "Network", href: "/player/network" },
  { label: "Messages", href: "/player/messages" },
];

export function Header({ 
  title = "TalentVerse",
  logo,
  navItems = [],
  rightAction
}: HeaderProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const hideNav = pathname.startsWith("/player");
  const isPlayerPage = pathname.startsWith("/player");
  const isAgentPage = pathname.startsWith("/agent");
  const isLoggedIn = !!session;
  
  const mobileNavItems = isPlayerPage && isLoggedIn ? playerNavItems : navItems;
  const showMobileMenu = mobileNavItems.length > 0;

  if (isPlayerPage && isLoggedIn) {
    return <PlayerHeader logo={logo} title={title} />;
  }

  if (isAgentPage && isLoggedIn) {
    return <AgentHeader logo={logo} title={title} />;
  }

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white dark:bg-[#111a22] border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3">
        {logo}
        {title && (
          <h2 className="text-gray-900 dark:text-white text-base font-semibold">
            {title}
          </h2>
        )}
      </div>
      <div className="flex items-center gap-3">
        {!hideNav && navItems.length > 0 && (
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 text-sm hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          {showMobileMenu && <MobileMenu navItems={mobileNavItems} />}
          <ThemeToggle />
          {isLoggedIn && <PlayerNavbar />}
          {!isLoggedIn && <NotificationDropdown />}
        </div>
        {rightAction}
      </div>
    </header>
  );
}

function PlayerHeader({ logo, title }: { logo?: React.ReactNode; title?: string }) {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState<{
    avatar?: string;
    firstName?: string;
    lastName?: string;
  } | null>(null);

  const playerNavItems = [
    { label: "Home", href: "/player/dashboard", icon: <HouseIcon size={24} weight="fill" /> },
    { label: "My Profile", href: "/player/profile", icon: <UserIcon size={24} /> },
    { label: "Network", href: "/player/network", icon: <UsersThreeIcon size={24} /> },
    { label: "Messages", href: "/player/messages", icon: <ChatIcon size={24} /> },
  ];

  useEffect(() => {
    if (!session) return;

    const userId = (session?.user as any)?.id;
    if (!userId) return;

    async function loadProfile() {
      try {
        const userData = await apiGet(`profile?userId=${userId}`).catch(() => null);
        if (userData) {
          const profileSource = (() => {
            if (userData?.profile && typeof userData.profile === "object" && !Array.isArray(userData.profile)) {
              return userData.profile;
            }
            if (userData?.profileData && typeof userData.profileData === "string") {
              try {
                return JSON.parse(userData.profileData);
              } catch {
                return {};
              }
            }
            if (userData?.profileData && typeof userData.profileData === "object") {
              return userData.profileData;
            }
            return {};
          })();

          const name = userData?.name ?? "";
          const nameParts = name.trim().split(" ");

          setProfileData({
            firstName: profileSource.firstName ?? nameParts[0] ?? "",
            lastName: profileSource.lastName ?? nameParts.slice(1).join(" ") ?? "",
            avatar: profileSource.avatar ?? userData?.avatar ?? "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    }

    loadProfile();
  }, [session]);

  const displayName = profileData
    ? `${profileData.firstName} ${profileData.lastName}`.trim() || session?.user?.name || "Player"
    : session?.user?.name || "Player";
  const userRole = (session?.user as any)?.role || "Player";

  return (
    <>
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white dark:bg-[#111a22] border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden flex items-center justify-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Open sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          {logo}
          {title && (
            <h2 className="text-gray-900 dark:text-white text-base font-semibold">
              {title}
            </h2>
          )}
        </div>
        <div className="flex items-center gap-3">
          <PlayerNavbar />
        </div>
      </header>
      <MobileSidebar
        title="TalentVerse"
        items={playerNavItems}
        user={{
          name: displayName,
          role: userRole,
          avatar: profileData?.avatar,
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
}

function AgentHeader({ logo, title }: { logo?: React.ReactNode; title?: string }) {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState<{
    avatar?: string;
    firstName?: string;
    lastName?: string;
  } | null>(null);

  const agentNavItems = [
    { label: "Home", href: "/agent/dashboard", icon: <HouseIcon size={24} weight="fill" /> },
    { label: "Players", href: "/agent/players", icon: <UserIcon size={24} /> },
    { label: "Scouts", href: "/agent/scouts", icon: <MagnifyingGlassIcon size={24} /> },
    { label: "Messages", href: "/agent/messages", icon: <ChatIcon size={24} /> },
    { label: "Settings", href: "/agent/settings", icon: <GearIcon size={24} /> },
    { label: "Trials", href: "/agent/trials", icon: <TrophyIcon size={24} /> },
    { label: "Verification", href: "/agent/verification", icon: <ShieldCheckIcon size={24} /> },
    { label: "Recruitment", href: "/agent/recruitment", icon: <ListChecksIcon size={24} /> },
  ];

  useEffect(() => {
    if (!session) return;

    const userId = (session?.user as any)?.id;
    if (!userId) return;

    async function loadProfile() {
      try {
        const userData = await apiGet(`profile?userId=${userId}`).catch(() => null);
        if (userData) {
          const profileSource = (() => {
            if (userData?.profile && typeof userData.profile === "object" && !Array.isArray(userData.profile)) {
              return userData.profile;
            }
            if (userData?.profileData && typeof userData.profileData === "string") {
              try {
                return JSON.parse(userData.profileData);
              } catch {
                return {};
              }
            }
            if (userData?.profileData && typeof userData.profileData === "object") {
              return userData.profileData;
            }
            return {};
          })();

          const name = userData?.name ?? "";
          const nameParts = name.trim().split(" ");

          setProfileData({
            firstName: profileSource.firstName ?? nameParts[0] ?? "",
            lastName: profileSource.lastName ?? nameParts.slice(1).join(" ") ?? "",
            avatar: profileSource.avatar ?? userData?.avatar ?? "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    }

    loadProfile();
  }, [session]);

  const displayName = profileData
    ? `${profileData.firstName} ${profileData.lastName}`.trim() || session?.user?.name || "Agent"
    : session?.user?.name || "Agent";
  const userRole = (session?.user as any)?.role || "Agent";

  return (
    <>
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white dark:bg-[#111a22] border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden flex items-center justify-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Open sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          {logo}
          {title && (
            <h2 className="text-gray-900 dark:text-white text-base font-semibold">
              {title}
            </h2>
          )}
        </div>
        <div className="flex items-center gap-3">
          <PlayerNavbar />
        </div>
      </header>
      <MobileSidebar
        title="ScoutHub"
        items={agentNavItems}
        user={{
          name: displayName,
          role: userRole,
          avatar: profileData?.avatar,
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
}

