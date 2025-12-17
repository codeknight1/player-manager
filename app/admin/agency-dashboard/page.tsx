"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { HouseIcon, UserIcon, UsersThreeIcon, ShieldCheckIcon, TrophyIcon, ChartBarIcon } from "@/components/icons";
import { apiGet } from "@/app/lib/api";
import { useRouter } from "next/navigation";

const sidebarItems = [
  { label: "Overview", href: "/admin/dashboard", icon: <HouseIcon size={24} weight="fill" /> },
  { label: "Users", href: "/admin/users", icon: <UserIcon size={24} /> },
  { label: "Agencies", href: "/admin/agencies", icon: <UsersThreeIcon size={24} /> },
  { label: "Verifications", href: "/admin/verifications", icon: <ShieldCheckIcon size={24} /> },
  { label: "Trials", href: "/admin/trials", icon: <TrophyIcon size={24} /> },
  { label: "Tournaments", href: "/admin/tournaments", icon: <TrophyIcon size={24} /> },
  { label: "Analytics", href: "/admin/analytics", icon: <ChartBarIcon size={24} /> },
];

export default function AdminAgencyDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalAgencies: 0,
    totalAgents: 0,
    activeAgencies: 0,
    totalTrials: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
      return;
    }
    if (session?.user && (session.user as any).role !== "ADMIN") {
      router.push("/admin/login");
      return;
    }
    if (status === "authenticated") {
      loadStats();
    }
  }, [session, status, router]);

  async function loadStats() {
    try {
      const [agenciesData, tournamentsData] = await Promise.all([
        apiGet("admin/agencies"),
        apiGet("admin/tournaments"),
      ]);
      setStats({
        totalAgencies: agenciesData?.stats?.total || 0,
        totalAgents: agenciesData?.agencies?.length || 0,
        activeAgencies: agenciesData?.stats?.active || 0,
        totalTrials: tournamentsData?.stats?.total || 0,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#111a22]">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-2 sm:px-4 lg:px-6 flex flex-1 justify-center py-3 sm:py-5">
          <Sidebar
            title="Admin"
            subtitle="Agency Overview"
            items={sidebarItems}
            user={{ name: session?.user?.name || "Admin", role: "Super Admin" }}
          />
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white tracking-light text-2xl sm:text-3xl lg:text-[32px] font-bold leading-tight">
                Agency Overview
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
              {[
                { label: "Total Agencies", value: stats.totalAgencies, href: "/admin/agencies" },
                { label: "Active Agencies", value: stats.activeAgencies, href: "/admin/agencies?status=active" },
                { label: "Total Agents", value: stats.totalAgents },
                { label: "Upcoming Tournaments", value: stats.totalTrials, href: "/admin/tournaments" },
              ].map((w, idx) => (
                <motion.div
                  key={w.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col gap-2 rounded-lg p-4 sm:p-6 border border-[#324d67]"
                >
                  <p className="text-[#92adc9] text-xs sm:text-sm">{w.label}</p>
                  <p className="text-white tracking-light text-xl sm:text-2xl font-bold leading-tight">{w.value}</p>
                  {w.href && (
                    <a href={w.href} className="text-[#1172d4] text-xs hover:underline mt-1">
                      View all →
                    </a>
                  )}
                </motion.div>
              ))}
            </div>

            <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-2">
              Quick Actions
            </h3>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="/admin/agencies"
                className="flex items-center justify-center gap-2 rounded-lg border border-[#324d67] bg-[#192633] px-4 py-3 hover:border-[#1172d4] transition-colors min-h-[44px]"
              >
                <UsersThreeIcon size={20} />
                <span className="text-white text-xs sm:text-sm">Manage Agencies</span>
              </a>
              <a
                href="/admin/tournaments"
                className="flex items-center justify-center gap-2 rounded-lg border border-[#324d67] bg-[#192633] px-4 py-3 hover:border-[#1172d4] transition-colors min-h-[44px]"
              >
                <TrophyIcon size={20} />
                <span className="text-white text-xs sm:text-sm">Manage Tournaments</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




