"use client";

import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { HouseIcon, UserIcon, UsersThreeIcon, ChatIcon, BellIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

const connections = [
  {
    id: 1,
    name: "Elite Football Agency",
    type: "Agent",
    location: "London, UK",
    connections: "50+ players",
    status: "Connected",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuArsxZuAN2HY0xCvkexIqzPrIzhGT74o8siOpubRtW7C_TN0xVLL9TImvdy_ewnpeti0i7qdI03gODADB7fZ52e6v0m3UBq9AuWez5M8ojKpAWtuGVRMEx_PpN57WMUfvPdrf_Gmurc85ahnVPDubmu0gNQo23oGmrK3gEB6-xTdTP6VFVYI4OnRofxoVF7dY9ajlm0JHYBUxkg5AfqsSx680dnQItw9IbM1e6biAKe2oilGRMI77sJZbuhBMH3M9Dxpy1RrWQb2EZD",
  },
  {
    id: 2,
    name: "Manchester United FC",
    type: "Club",
    location: "Manchester, UK",
    connections: "200+ players",
    status: "Connected",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCosM_sMNZ3PW6rgilp0vNKvYYweORIsh8nxy63RY0gIVjQpBHyfTvYTR_jkHi-oCKH4ssegDz9l7MIBb5qLNPomyRw4Bg2B497lgDOGqOPmk52XK0ghfiKkaUEDEfLqKdGmbDrR_3-C2gRKrsiYfN4CW-rYlmkpq2umE3S8nUyDJejdmeAamdJPqzuHeRNxX9_JBYtNtIkV_Zzza6RW_mnps1HlqOWveA4712VdV8i82a5fJiIPToFJIeoOwh6S3tq5tdRc2TWwZo",
  },
  {
    id: 3,
    name: "John Smith",
    type: "Scout",
    location: "Birmingham, UK",
    connections: "25 players discovered",
    status: "Pending",
    avatar: "https://via.placeholder.com/150",
  },
];

const suggestions = [
  {
    id: 4,
    name: "FC Barcelona",
    type: "Club",
    location: "Barcelona, Spain",
    mutualConnections: 5,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCosM_sMNZ3PW6rgilp0vNKvYYweORIsh8nxy63RY0gIVjQpBHyfTvYTR_jkHi-oCKH4ssegDz9l7MIBb5qLNPomyRw4Bg2B497lgDOGqOPmk52XK0ghfiKkaUEDEfLqKdGmbDrR_3-C2gRKrsiYfN4CW-rYlmkpq2umE3S8nUyDJejdmeAamdJPqzuHeRNxX9_JBYtNtIkV_Zzza6RW_mnps1HlqOWveA4712VdV8i82a5fJiIPToFJIeoOwh6S3tq5tdRc2TWwZo",
  },
  {
    id: 5,
    name: "Global Sports Management",
    type: "Agent",
    location: "New York, USA",
    mutualConnections: 3,
    avatar: "https://via.placeholder.com/150",
  },
];

export default function PlayerNetworkPage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <Sidebar
            title="TalentVerse"
            user={{
              name: "Sophia Carter",
              role: "Player",
              avatar:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuD8UTAaW5b3J5bJ_37zfFc1ut556yYxVS9S1sL8v-G27rwdivV8u6gMXTmA2eb_GUm05loRuR96IVfC4rEU1SbsqHYkN032pjeblqZ2F0C1W9sy9vskE1xYxLQJ3g3FDvGlpfdfzTnF6iIYG0e8tcRTQfkt67zzV0k-Kvrq8PhWsRHBp7wVn0TMxkYm9OD_dk_kiNgqS18HC4bNVlExyptluVg_orAndeR_kpMcDInDoYqFfGxIUplP9uv9lO7Dmhbj_SK5ZUsqmUNe",
            }}
            items={sidebarItems}
          />
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-white tracking-light text-[32px] font-bold leading-tight">
                  My Network
                </p>
                <p className="text-[#92adc9] text-sm font-normal leading-normal">
                  Manage your connections with clubs, agents, and scouts
                </p>
              </div>
            </div>

            {/* Network Stats */}
            <div className="flex flex-wrap gap-4 p-4">
              {[
                { label: "Total Connections", value: "12" },
                { label: "Clubs", value: "5" },
                { label: "Agents", value: "4" },
                { label: "Scouts", value: "3" },
              ].map((stat, idx) => (
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

            {/* Connections */}
            <div className="p-4">
              <h3 className="text-white text-xl font-bold mb-4">Your Connections</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connections.map((connection, idx) => (
                  <motion.div
                    key={connection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4 p-6 rounded-lg border border-[#324d67] bg-[#192633]"
                  >
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16 flex-shrink-0"
                      style={{ backgroundImage: `url("${connection.avatar}")` }}
                    />
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-white text-base font-bold">
                            {connection.name}
                          </p>
                          <p className="text-[#92adc9] text-sm">{connection.type}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            connection.status === "Connected"
                              ? "bg-[#0bda5b]/20 text-[#0bda5b]"
                              : "bg-[#ffa500]/20 text-[#ffa500]"
                          }`}
                        >
                          {connection.status}
                        </span>
                      </div>
                      <p className="text-[#92adc9] text-xs mb-2">
                        📍 {connection.location}
                      </p>
                      <p className="text-[#92adc9] text-xs mb-3">
                        {connection.connections}
                      </p>
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
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="p-4">
              <h3 className="text-white text-xl font-bold mb-4">
                Suggested Connections
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((suggestion, idx) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4 p-6 rounded-lg border border-[#324d67] bg-[#192633]"
                  >
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16 flex-shrink-0"
                      style={{ backgroundImage: `url("${suggestion.avatar}")` }}
                    />
                    <div className="flex-1 flex flex-col">
                      <div className="mb-2">
                        <p className="text-white text-base font-bold">
                          {suggestion.name}
                        </p>
                        <p className="text-[#92adc9] text-sm">{suggestion.type}</p>
                      </div>
                      <p className="text-[#92adc9] text-xs mb-2">
                        📍 {suggestion.location}
                      </p>
                      <p className="text-[#92adc9] text-xs mb-3">
                        {suggestion.mutualConnections} mutual connections
                      </p>
                      <Button variant="secondary" size="sm" className="mt-auto">
                        Connect
                      </Button>
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






