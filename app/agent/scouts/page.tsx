"use client";

import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { HouseIcon, UserIcon, MagnifyingGlassIcon, ChatIcon, GearIcon, TrophyIcon, ShieldCheckIcon, ListChecksIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  {
    label: "Home",
    href: "/agent/dashboard",
    icon: <HouseIcon size={24} weight="fill" />,
  },
  {
    label: "Players",
    href: "/agent/players",
    icon: <UserIcon size={24} />,
  },
  {
    label: "Scouts",
    href: "/agent/scouts",
    icon: <MagnifyingGlassIcon size={24} />,
  },
  {
    label: "Messages",
    href: "/agent/messages",
    icon: <ChatIcon size={24} />,
  },
  {
    label: "Settings",
    href: "/agent/settings",
    icon: <GearIcon size={24} />,
  },
  {
    label: "Trials",
    href: "/agent/trials",
    icon: <TrophyIcon size={24} />,
  },
  {
    label: "Verification",
    href: "/agent/verification",
    icon: <ShieldCheckIcon size={24} />,
  },
  {
    label: "Recruitment",
    href: "/agent/recruitment",
    icon: <ListChecksIcon size={24} />,
  },
];

const scouts = [
  {
    id: 1,
    name: "John Smith",
    region: "North England",
    experience: "10 years",
    playersFound: 45,
    status: "Active",
    avatar: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    region: "South England",
    experience: "8 years",
    playersFound: 32,
    status: "Active",
    avatar: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Michael Brown",
    region: "Scotland",
    experience: "12 years",
    playersFound: 58,
    status: "Active",
    avatar: "https://via.placeholder.com/150",
  },
  {
    id: 4,
    name: "Emma Wilson",
    region: "Wales",
    experience: "6 years",
    playersFound: 28,
    status: "Inactive",
    avatar: "https://via.placeholder.com/150",
  },
];

const scoutStats = [
  { label: "Total Scouts", value: "4" },
  { label: "Active Scouts", value: "3" },
  { label: "Players Discovered", value: "163" },
  { label: "Regions Covered", value: "4" },
];

export default function AgentScoutsPage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <Sidebar
            title="ScoutHub"
            subtitle="Club"
            items={sidebarItems}
          />
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-white tracking-light text-[32px] font-bold leading-tight">
                  Scout Management
                </p>
                <p className="text-[#92adc9] text-sm font-normal leading-normal">
                  Manage your scouting network and track scout performance
                </p>
              </div>
              <Button size="lg">Add New Scout</Button>
            </div>

            <div className="flex flex-wrap gap-4 p-4">
              {scoutStats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#324d67]"
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

            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Your Scout Network
            </h2>
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-lg border border-[#324d67] bg-[#111a22]">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-[#192633]">
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                        Scout
                      </th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                        Region
                      </th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                        Experience
                      </th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                        Players Found
                      </th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {scouts.map((scout, idx) => (
                      <motion.tr
                        key={scout.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="border-t border-t-[#324d67] hover:bg-[#192633] transition-colors"
                      >
                        <td className="h-[72px] px-4 py-2">
                          <div className="flex items-center gap-3">
                            <div
                              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                              style={{ backgroundImage: `url("${scout.avatar}")` }}
                            />
                            <span className="text-white text-sm font-medium leading-normal">
                              {scout.name}
                            </span>
                          </div>
                        </td>
                        <td className="h-[72px] px-4 py-2 text-[#92adc9] text-sm font-normal leading-normal">
                          {scout.region}
                        </td>
                        <td className="h-[72px] px-4 py-2 text-[#92adc9] text-sm font-normal leading-normal">
                          {scout.experience}
                        </td>
                        <td className="h-[72px] px-4 py-2 text-[#92adc9] text-sm font-normal leading-normal">
                          {scout.playersFound}
                        </td>
                        <td className="h-[72px] px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              scout.status === "Active"
                                ? "bg-[#0bda5b]/20 text-[#0bda5b]"
                                : "bg-[#324d67] text-[#92adc9]"
                            }`}
                          >
                            {scout.status}
                          </span>
                        </td>
                        <td className="h-[72px] px-4 py-2">
                          <div className="flex gap-2">
                            <Button variant="secondary" size="sm">
                              View
                            </Button>
                            <Button variant="secondary" size="sm">
                              Contact
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



