"use client";

import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { HouseIcon, UsersThreeIcon, UserIcon, TrophyIcon, HandshakeIcon } from "@/components/icons";

const sidebarItems = [
  { label: "Overview", href: "/admin/agency-dashboard", icon: <HouseIcon size={24} weight="fill" /> },
  { label: "Agencies", href: "/admin/agency-dashboard", icon: <UsersThreeIcon size={24} /> },
  { label: "Agents", href: "/admin/agency-dashboard", icon: <UserIcon size={24} /> },
  { label: "Tournaments", href: "/admin/agency-dashboard", icon: <TrophyIcon size={24} /> },
  { label: "Partnerships", href: "/admin/agency-dashboard", icon: <HandshakeIcon size={24} /> },
];

export default function AdminAgencyDashboard() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <Sidebar
            title="Admin"
            subtitle="Agency Control Panel"
            items={sidebarItems}
            user={{ name: "Admin", role: "Super Admin" }}
          />
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">
                Agency Dashboard
              </p>
            </div>

            <div className="flex flex-wrap gap-4 p-4">
              {[
                { label: "Total Agencies", value: "42" },
                { label: "Registered Agents", value: "318" },
                { label: "Active Partnerships", value: "109" },
                { label: "Upcoming Tournaments", value: "12" },
              ].map((w, idx) => (
                <motion.div
                  key={w.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#324d67]"
                >
                  <p className="text-[#92adc9] text-sm">{w.label}</p>
                  <p className="text-white tracking-light text-2xl font-bold leading-tight">{w.value}</p>
                </motion.div>
              ))}
            </div>

            <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-2">
              Recent Activity
            </h3>
            <div className="p-4 flex flex-col gap-2">
              {["ProAgent Sports added 3 agents", "Elite FC renewed partnership", "City Youth Academy requested verification"].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between rounded-lg border border-[#324d67] px-4 py-3"
                >
                  <p className="text-white text-sm">{item}</p>
                  <span className="text-[#92adc9] text-xs">just now</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




