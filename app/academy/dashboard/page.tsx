"use client";

import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import {
  HouseIcon,
  TrophyIcon,
  UserIcon,
  HandshakeIcon,
  UsersThreeIcon,
  BellIcon,
  ChartBarIcon,
  ShieldCheckIcon,
} from "@/components/icons";

const sidebarItems = [
  {
    label: "Dashboard",
    href: "/academy/dashboard",
    icon: <HouseIcon size={24} weight="fill" />,
  },
  {
    label: "Tournaments",
    href: "/academy/tournaments",
    icon: <TrophyIcon size={24} />,
  },
  {
    label: "Players",
    href: "/academy/players",
    icon: <UserIcon size={24} />,
  },
  {
    label: "Partnerships",
    href: "/academy/partnerships",
    icon: <HandshakeIcon size={24} />,
  },
  {
    label: "Squads",
    href: "/academy/squads",
    icon: <UsersThreeIcon size={24} />,
  },
  {
    label: "Analytics",
    href: "/academy/analytics",
    icon: <ChartBarIcon size={24} />,
  },
  {
    label: "Verification",
    href: "/academy/verification",
    icon: <ShieldCheckIcon size={24} />,
  },
];

export default function AcademyDashboard() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <Sidebar
            title="ProConnect"
            subtitle="Academy Dashboard"
            user={{
              name: "Riverdale Academy",
              role: "Academy",
              avatar:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCq7p1U6u1n7fYVn2x3Q8j0mL0bJb1Vt6g7y0b8q9c2d3e4f5g6h7i8j9k0l1m2n3o4",
            }}
            items={sidebarItems}
          />
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">
                Dashboard
              </p>
            </div>

            <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-2">
              Overview
            </h3>
            <div className="flex flex-wrap gap-4 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#324d67]"
              >
                <p className="text-[#92adc9] text-sm">Registered Players</p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">
                  128
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#324d67]"
              >
                <p className="text-[#92adc9] text-sm">Active Partnerships</p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">
                  6
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#324d67]"
              >
                <p className="text-[#92adc9] text-sm">Upcoming Tournaments</p>
                <p className="text-white tracking-light text-2xl font-bold leading-tight">
                  3
                </p>
              </motion.div>
            </div>

            <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Notifications
            </h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 bg-[#111a22] px-4 min-h-[72px] py-2"
            >
              <div className="text-white flex items-center justify-center rounded-lg bg-[#233648] shrink-0 size-12">
                <BellIcon size={24} />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-white text-base font-medium leading-normal line-clamp-1">
                  New partnership request received
                </p>
                <p className="text-[#92adc9] text-sm font-normal leading-normal line-clamp-2">
                  Elite FC has requested to partner with your academy.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}




