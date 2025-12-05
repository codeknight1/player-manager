"use client";

import { useSession } from "next-auth/react";
import { Sidebar } from "@/components/layout/sidebar";
import {
  HouseIcon,
  UserIcon,
  UsersThreeIcon,
  ChatIcon,
} from "@/components/icons";

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
];

export default function HelpPage() {
  const { data: session } = useSession();

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-white dark:bg-[#111a22] overflow-x-hidden transition-colors">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 flex-col lg:flex-row gap-6 px-4 md:px-6 py-5">
          <Sidebar
            title="TalentVerse"
            user={{
              name: (session?.user?.name as string) || (session?.user?.email as string) || "Player",
              role: (session?.user as any)?.role || "Player",
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent((session?.user?.name as string) || (session?.user?.email as string) || "P")}&background=1172d4&color=fff`,
            }}
            items={sidebarItems}
          />
          <div className="layout-content-container flex w-full flex-col flex-1 max-w-[960px]">
            <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
              <p className="text-gray-900 dark:text-white tracking-light text-[32px] font-bold leading-tight">
                Help & Support
              </p>
            </div>
            <div className="p-4">
              <div className="rounded-lg border border-[#FFCC00] bg-white dark:bg-[#192633] p-6">
                <p className="text-gray-700 dark:text-[#92adc9]">Help page coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

