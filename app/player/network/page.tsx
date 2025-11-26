"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { HouseIcon, UserIcon, UsersThreeIcon, ChatIcon, BellIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
];

type Connection = { id: string; name: string | null; email: string };

export default function PlayerNetworkPage() {
  const { data: session } = useSession();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = (session?.user as any)?.id;
    if (!userId) return;
    async function load() {
      try {
        const res = await apiGet(`connections?userId=${userId}`);
        setConnections(res?.connections || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [session]);
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
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
          <div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1">
            <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-3">
                <p className="text-white tracking-light text-[32px] font-bold leading-tight">
                  My Network
                </p>
                <p className="text-[#92adc9] text-sm font-normal leading-normal">
                  Manage your connections with clubs, agents, and scouts
                </p>
              </div>
              <div className="flex items-center gap-3 justify-end">
                <LogoutButton />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {[
                { label: "Total Connections", value: String(connections.length) },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col gap-2 rounded-lg p-6 border border-[#324d67]"
                >
                  <p className="text-white text-base font-medium leading-normal">
                    {stat.label}
                  </p>
                  <p className="text-white tracking-light text-2xl font-bold leading-tight">
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Connections */}
            <div className="p-4">
              <h3 className="text-white text-xl font-bold mb-4">Your Connections</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                  <div className="text-[#92adc9]">Loading...</div>
                ) : connections.length === 0 ? (
                  <div className="text-[#92adc9]">No connections yet</div>
                ) : (
                connections.map((connection, idx) => (
                  <motion.div
                    key={connection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4 p-6 rounded-lg border border-[#324d67] bg-[#192633]"
                  >
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16 flex-shrink-0"
                      style={{ backgroundImage: `url("https://ui-avatars.com/api/?name=${encodeURIComponent(connection.name || connection.email)}&background=1172d4&color=fff")` }}
                    />
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-white text-base font-bold">
                            {connection.name || connection.email}
                          </p>
                          <p className="text-[#92adc9] text-sm">{connection.email}</p>
                        </div>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-[#0bda5b]/20 text-[#0bda5b]">Connected</span>
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <Button variant="secondary" size="sm" className="flex-1">
                          View
                        </Button>
                        <Button variant="secondary" size="sm" className="flex-1">
                          Message
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






