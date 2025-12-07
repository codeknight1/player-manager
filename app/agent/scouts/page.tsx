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
        <div className="gap-1 px-2 sm:px-4 lg:px-6 flex flex-1 justify-center py-3 sm:py-5">
          <Sidebar
            title="ScoutHub"
            subtitle="Club"
            items={sidebarItems}
          />
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3 p-2 sm:p-4">
              <div className="flex flex-col gap-2 sm:gap-3 min-w-0">
                <p className="text-white tracking-light text-2xl sm:text-[28px] lg:text-[32px] font-bold leading-tight">
                  Scout Management
                </p>
                <p className="text-[#92adc9] text-xs sm:text-sm font-normal leading-normal">
                  Manage your scouting network and track scout performance
                </p>
              </div>
              <div className="flex sm:block">
                <Button size="lg" className="w-full sm:w-auto">Add New Scout</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-2 sm:p-4">
              {scoutStats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col gap-2 rounded-lg p-4 sm:p-6 border border-[#324d67]"
                >
                  <p className="text-white text-sm sm:text-base font-medium leading-normal">
                    {stat.label}
                  </p>
                  <p className="text-white tracking-light text-xl sm:text-2xl font-bold leading-tight">
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>

            <h2 className="text-white text-lg sm:text-xl lg:text-[22px] font-bold leading-tight tracking-[-0.015em] px-2 sm:px-4 pb-2 sm:pb-3 pt-3 sm:pt-5">
              Your Scout Network
            </h2>
            <div className="px-2 sm:px-4 py-2 sm:py-3">
              <div className="hidden lg:block overflow-hidden rounded-lg border border-[#324d67] bg-[#111a22]">
                <table className="flex-1 w-full">
                  <thead>
                    <tr className="bg-[#192633]">
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-white text-xs sm:text-sm font-medium leading-normal">
                        Scout
                      </th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-white text-xs sm:text-sm font-medium leading-normal">
                        Region
                      </th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-white text-xs sm:text-sm font-medium leading-normal">
                        Experience
                      </th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-white text-xs sm:text-sm font-medium leading-normal">
                        Players Found
                      </th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-white text-xs sm:text-sm font-medium leading-normal">
                        Status
                      </th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-white text-xs sm:text-sm font-medium leading-normal">
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
                        <td className="h-[72px] px-3 sm:px-4 py-2">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div
                              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 sm:size-10 shrink-0"
                              style={{ backgroundImage: `url("${scout.avatar}")` }}
                            />
                            <span className="text-white text-xs sm:text-sm font-medium leading-normal truncate">
                              {scout.name}
                            </span>
                          </div>
                        </td>
                        <td className="h-[72px] px-3 sm:px-4 py-2 text-[#92adc9] text-xs sm:text-sm font-normal leading-normal">
                          {scout.region}
                        </td>
                        <td className="h-[72px] px-3 sm:px-4 py-2 text-[#92adc9] text-xs sm:text-sm font-normal leading-normal">
                          {scout.experience}
                        </td>
                        <td className="h-[72px] px-3 sm:px-4 py-2 text-[#92adc9] text-xs sm:text-sm font-normal leading-normal">
                          {scout.playersFound}
                        </td>
                        <td className="h-[72px] px-3 sm:px-4 py-2">
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
                        <td className="h-[72px] px-3 sm:px-4 py-2">
                          <div className="flex gap-1 sm:gap-2">
                            <Button variant="secondary" size="sm" className="text-xs">View</Button>
                            <Button variant="secondary" size="sm" className="text-xs">Contact</Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="lg:hidden flex flex-col gap-3">
                {scouts.map((scout, idx) => (
                  <motion.div
                    key={scout.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-col gap-3 rounded-lg border border-[#324d67] bg-[#192633] p-3 sm:p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 shrink-0"
                        style={{ backgroundImage: `url("${scout.avatar}")` }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm sm:text-base font-medium leading-normal truncate">
                          {scout.name}
                        </p>
                        <p className="text-[#92adc9] text-xs sm:text-sm font-normal leading-normal">
                          {scout.region}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium shrink-0 ${
                          scout.status === "Active"
                            ? "bg-[#0bda5b]/20 text-[#0bda5b]"
                            : "bg-[#324d67] text-[#92adc9]"
                        }`}
                      >
                        {scout.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                      <div>
                        <span className="text-[#92adc9]">Experience:</span>
                        <span className="text-white ml-2">{scout.experience}</span>
                      </div>
                      <div>
                        <span className="text-[#92adc9]">Players Found:</span>
                        <span className="text-white ml-2">{scout.playersFound}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button variant="secondary" size="sm" className="flex-1 text-xs">View</Button>
                      <Button variant="secondary" size="sm" className="flex-1 text-xs">Contact</Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



