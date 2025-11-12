"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { HouseIcon, UsersThreeIcon, UserIcon, TrophyIcon, HandshakeIcon, ShieldCheckIcon, ChartBarIcon } from "@/components/icons";
import { apiGet } from "@/app/lib/api";
import { useRouter } from "next/navigation";

const sidebarItems = [
  { label: "Overview", href: "/admin/dashboard", icon: <HouseIcon size={24} weight="fill" /> },
  { label: "Users", href: "/admin/users", icon: <UserIcon size={24} /> },
  { label: "Agencies", href: "/admin/agencies", icon: <UsersThreeIcon size={24} /> },
  { label: "Verifications", href: "/admin/verifications", icon: <ShieldCheckIcon size={24} /> },
  { label: "Tournaments", href: "/admin/tournaments", icon: <TrophyIcon size={24} /> },
  { label: "Analytics", href: "/admin/analytics", icon: <ChartBarIcon size={24} /> },
];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPlayers: 0,
    totalAgents: 0,
    totalAcademies: 0,
    totalTrials: 0,
    totalApplications: 0,
    pendingVerifications: 0,
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
      const data = await apiGet("admin/stats");
      setStats(data);
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
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <Sidebar
            title="Admin"
            subtitle="Super Admin Control Panel"
            items={sidebarItems}
            user={{ name: session?.user?.name || "Admin", role: "Super Admin" }}
          />
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">
                Admin Dashboard
              </p>
            </div>

            <div className="flex flex-wrap gap-4 p-4">
              {[
                { label: "Total Users", value: stats.totalUsers, href: "/admin/users" },
                { label: "Players", value: stats.totalPlayers, href: "/admin/users?role=PLAYER" },
                { label: "Agents", value: stats.totalAgents, href: "/admin/users?role=AGENT" },
                { label: "Academies", value: stats.totalAcademies, href: "/admin/users?role=ACADEMY" },
                { label: "Trials", value: stats.totalTrials, href: "/admin/tournaments" },
                { label: "Applications", value: stats.totalApplications },
                { label: "Pending Verifications", value: stats.pendingVerifications, href: "/admin/verifications", highlight: true },
              ].map((w, idx) => (
                <motion.div
                  key={w.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex min-w-[200px] flex-1 flex-col gap-2 rounded-lg p-6 border ${w.highlight ? "border-[#ffa500] bg-[#ffa500]/10" : "border-[#324d67]"}`}
                >
                  <p className="text-[#92adc9] text-sm">{w.label}</p>
                  <p className="text-white tracking-light text-2xl font-bold leading-tight">{w.value}</p>
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
            <div className="p-4 flex flex-wrap gap-3">
              <a
                href="/admin/users"
                className="flex items-center gap-2 rounded-lg border border-[#324d67] bg-[#192633] px-4 py-3 hover:border-[#1172d4] transition-colors"
              >
                <UserIcon size={20} />
                <span className="text-white text-sm">Manage Users</span>
              </a>
              <a
                href="/admin/verifications"
                className="flex items-center gap-2 rounded-lg border border-[#324d67] bg-[#192633] px-4 py-3 hover:border-[#1172d4] transition-colors"
              >
                <ShieldCheckIcon size={20} />
                <span className="text-white text-sm">Review Verifications</span>
              </a>
              <a
                href="/admin/analytics"
                className="flex items-center gap-2 rounded-lg border border-[#324d67] bg-[#192633] px-4 py-3 hover:border-[#1172d4] transition-colors"
              >
                <ChartBarIcon size={20} />
                <span className="text-white text-sm">View Analytics</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}











