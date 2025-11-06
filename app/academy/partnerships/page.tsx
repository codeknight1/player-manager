"use client";

import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { HouseIcon, TrophyIcon, UserIcon, HandshakeIcon, UsersThreeIcon, ChartBarIcon, ShieldCheckIcon } from "@/components/icons";
import Link from "next/link";
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

const partnerships = [
  {
    id: 1,
    name: "Elite FC",
    type: "Club",
    contact: "John Smith",
    email: "john.smith@elitefc.com",
    status: "Active",
    startDate: "2023-01-15",
    playersShared: 12,
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlxZxg7PtbTabtLYqEq-uFjtgIiufXA3Y2aw8Mdno7fnaFhqVfoK2nnojLNNN2aMvdFhoGLz3wB4AjSIMvtL_OMVz7L6myc8gpqbzJEgnTJR4JaXP0iaB2oF7qpQQdU5Fa0ep-s4jHo0psz9i_6Zb-tZ0XN9h9jueDmGUXufwiwdsWlZZ8sCXpGA0bSPalX0tYdJvOfZd9RaogF2IdIN-AJp9G_ML_LnDmQtCXzLZ4pQk9DvoxDcYBAmoRxvrVZUlBOywSLQJB9G-k",
  },
  {
    id: 2,
    name: "ProAgent Sports",
    type: "Agent",
    contact: "Sarah Johnson",
    email: "sarah.j@proagent.com",
    status: "Active",
    startDate: "2023-03-20",
    playersShared: 8,
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlxZxg7PtbTabtLYqEq-uFjtgIiufXA3Y2aw8Mdno7fnaFhqVfoK2nnojLNNN2aMvdFhoGLz3wB4AjSIMvtL_OMVz7L6myc8gpqbzJEgnTJR4JaXP0iaB2oF7qpQQdU5Fa0ep-s4jHo0psz9i_6Zb-tZ0XN9h9jueDmGUXufwiwdsWlZZ8sCXpGA0bSPalX0tYdJvOfZd9RaogF2IdIN-AJp9G_ML_LnDmQtCXzLZ4pQk9DvoxDcYBAmoRxvrVZUlBOywSLQJB9G-k",
  },
  {
    id: 3,
    name: "City Youth Academy",
    type: "Academy",
    contact: "Mike Wilson",
    email: "mike.w@cityacademy.com",
    status: "Pending",
    startDate: "2024-01-10",
    playersShared: 0,
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlxZxg7PtbTabtLYqEq-uFjtgIiufXA3Y2aw8Mdno7fnaFhqVfoK2nnojLNNN2aMvdFhoGLz3wB4AjSIMvtL_OMVz7L6myc8gpqbzJEgnTJR4JaXP0iaB2oF7qpQQdU5Fa0ep-s4jHo0psz9i_6Zb-tZ0XN9h9jueDmGUXufwiwdsWlZZ8sCXpGA0bSPalX0tYdJvOfZd9RaogF2IdIN-AJp9G_ML_LnDmQtCXzLZ4pQk9DvoxDcYBAmoRxvrVZUlBOywSLQJB9G-k",
  },
];

export default function PartnershipsPage() {
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
                  Partnerships
                </p>
                <p className="text-[#92adc9] text-sm font-normal leading-normal">
                  Manage your partnerships with clubs, agents, and other academies
                </p>
              </div>
              <Button size="lg">
                Request Partnership
              </Button>
            </div>

            <div className="flex flex-col gap-4 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {partnerships.map((partnership, idx) => (
                  <motion.div
                    key={partnership.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-col gap-4 rounded-lg border border-[#324d67] p-6 hover:border-[#1172d4] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16"
                        style={{ backgroundImage: `url("${partnership.logo}")` }}
                      />
                      <div className="flex-1">
                        <p className="text-white text-base font-bold leading-tight">
                          {partnership.name}
                        </p>
                        <p className="text-[#92adc9] text-sm font-normal leading-normal">
                          {partnership.type}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          partnership.status === "Active"
                            ? "bg-[#0bda5b]/20 text-[#0bda5b]"
                            : "bg-[#ffa500]/20 text-[#ffa500]"
                        }`}
                      >
                        {partnership.status}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#92adc9]">Contact:</span>
                        <span className="text-white">{partnership.contact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#92adc9]">Email:</span>
                        <span className="text-white truncate ml-2">{partnership.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#92adc9]">Started:</span>
                        <span className="text-white">
                          {new Date(partnership.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#92adc9]">Players Shared:</span>
                        <span className="text-white">{partnership.playersShared}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="secondary" size="sm" className="flex-1">
                        View Details
                      </Button>
                      <Button variant="secondary" size="sm" className="flex-1">
                        Message
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="p-4">
              <div className="rounded-lg border border-[#324d67] p-6">
                <h3 className="text-white text-lg font-bold leading-tight mb-4">
                  Partnership Benefits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex gap-3">
                    <div className="text-[#1172d4] text-xl">✓</div>
                    <div>
                      <p className="text-white text-sm font-medium mb-1">
                        Player Exposure
                      </p>
                      <p className="text-[#92adc9] text-xs">
                        Get your players seen by professional clubs and agents
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-[#1172d4] text-xl">✓</div>
                    <div>
                      <p className="text-white text-sm font-medium mb-1">
                        Trial Opportunities
                      </p>
                      <p className="text-[#92adc9] text-xs">
                        Access to exclusive trial invitations
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-[#1172d4] text-xl">✓</div>
                    <div>
                      <p className="text-white text-sm font-medium mb-1">
                        Networking
                      </p>
                      <p className="text-[#92adc9] text-xs">
                        Connect with industry professionals
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-[#1172d4] text-xl">✓</div>
                    <div>
                      <p className="text-white text-sm font-medium mb-1">
                        Tournament Access
                      </p>
                      <p className="text-[#92adc9] text-xs">
                        Invitations to premium tournaments and showcases
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


