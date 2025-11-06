"use client";

import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { HouseIcon, TrophyIcon, UserIcon, HandshakeIcon, UsersThreeIcon, ChartBarIcon, ShieldCheckIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

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

const squads = [
  {
    id: 1,
    name: "U17 Boys",
    players: 25,
    active: 20,
    inactive: 5,
    coach: "David Thompson",
    nextMatch: "2024-03-15",
  },
  {
    id: 2,
    name: "U15 Girls",
    players: 20,
    active: 18,
    inactive: 2,
    coach: "Emma Roberts",
    nextMatch: "2024-03-20",
  },
  {
    id: 3,
    name: "U19 Boys",
    players: 22,
    active: 21,
    inactive: 1,
    coach: "Mark Johnson",
    nextMatch: "2024-03-18",
  },
  {
    id: 4,
    name: "U17 Girls",
    players: 18,
    active: 15,
    inactive: 3,
    coach: "Lisa Anderson",
    nextMatch: "2024-03-22",
  },
  {
    id: 5,
    name: "U16 Mixed",
    players: 24,
    active: 22,
    inactive: 2,
    coach: "Chris Brown",
    nextMatch: "2024-03-16",
  },
];

const squadStats = [
  { label: "Total Squads", value: "5" },
  { label: "Total Players", value: "109" },
  { label: "Active Players", value: "96" },
  { label: "Active Coaches", value: "5" },
];

export default function SquadsPage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <Sidebar
            title="ProConnect"
            subtitle="Partner Dashboard"
            items={sidebarItems}
          />
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-white tracking-light text-[32px] font-bold leading-tight">
                  Squads
                </p>
                <p className="text-[#92adc9] text-sm font-normal leading-normal">
                  Manage your academy squads and team composition
                </p>
              </div>
              <Button size="lg">
                Create New Squad
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 p-4">
              {squadStats.map((stat, idx) => (
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

            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-lg border border-[#324d67] bg-[#111a22]">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-[#192633]">
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                        Squad Name
                      </th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                        Coach
                      </th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                        Total Players
                      </th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                        Active
                      </th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                        Inactive
                      </th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                        Next Match
                      </th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {squads.map((squad, idx) => (
                      <motion.tr
                        key={squad.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="border-t border-t-[#324d67] hover:bg-[#192633] transition-colors"
                      >
                        <td className="h-[72px] px-4 py-2 text-white text-sm font-medium leading-normal">
                          {squad.name}
                        </td>
                        <td className="h-[72px] px-4 py-2 text-[#92adc9] text-sm font-normal leading-normal">
                          {squad.coach}
                        </td>
                        <td className="h-[72px] px-4 py-2 text-[#92adc9] text-sm font-normal leading-normal">
                          {squad.players}
                        </td>
                        <td className="h-[72px] px-4 py-2">
                          <span className="px-2 py-1 rounded bg-[#0bda5b]/20 text-[#0bda5b] text-xs font-medium">
                            {squad.active}
                          </span>
                        </td>
                        <td className="h-[72px] px-4 py-2 text-[#92adc9] text-sm font-normal leading-normal">
                          {squad.inactive}
                        </td>
                        <td className="h-[72px] px-4 py-2 text-[#92adc9] text-sm font-normal leading-normal">
                          {new Date(squad.nextMatch).toLocaleDateString()}
                        </td>
                        <td className="h-[72px] px-4 py-2">
                          <div className="flex gap-2">
                            <Button variant="secondary" size="sm">
                              View
                            </Button>
                            <Button variant="secondary" size="sm">
                              Edit
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4">
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="secondary" className="flex flex-col items-start h-auto p-4">
                  <span className="text-white text-base font-bold mb-1">
                    Transfer Player
                  </span>
                  <span className="text-[#92adc9] text-sm text-left">
                    Move players between squads
                  </span>
                </Button>
                <Button variant="secondary" className="flex flex-col items-start h-auto p-4">
                  <span className="text-white text-base font-bold mb-1">
                    Generate Report
                  </span>
                  <span className="text-[#92adc9] text-sm text-left">
                    Create squad performance reports
                  </span>
                </Button>
                <Button variant="secondary" className="flex flex-col items-start h-auto p-4">
                  <span className="text-white text-base font-bold mb-1">
                    Manage Schedule
                  </span>
                  <span className="text-[#92adc9] text-sm text-left">
                    View and edit match schedules
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


