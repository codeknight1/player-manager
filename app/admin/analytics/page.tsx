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
  { label: "Tournaments", href: "/admin/tournaments", icon: <TrophyIcon size={24} /> },
  { label: "Analytics", href: "/admin/analytics", icon: <ChartBarIcon size={24} /> },
];

export default function AdminAnalyticsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user && (session.user as any).role !== "ADMIN") {
      router.push("/admin/login");
      return;
    }
    loadAnalytics();
  }, [session, router]);

  async function loadAnalytics() {
    try {
      const data = await apiGet("admin/analytics");
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
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
            subtitle="System Analytics"
            items={sidebarItems}
            user={{ name: session?.user?.name || "Admin", role: "Super Admin" }}
          />
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">
                System Analytics
              </p>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-[#324d67] bg-[#192633] p-6">
                <h3 className="text-white text-lg font-bold mb-4">Users by Role</h3>
                <div className="flex flex-col gap-3">
                  {analytics?.usersByRole?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-[#92adc9] text-sm">{item.role}</span>
                      <span className="text-white text-lg font-bold">{item._count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-[#324d67] bg-[#192633] p-6">
                <h3 className="text-white text-lg font-bold mb-4">System Overview</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#92adc9] text-sm">Active Users</span>
                    <span className="text-white text-lg font-bold">{analytics?.activeUsers || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-white text-lg font-bold mb-4">Recent Signups</h3>
              <div className="flex overflow-hidden rounded-lg border border-[#324d67] bg-[#111a22]">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-[#192633]">
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Name</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Email</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Role</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics?.recentSignups?.map((user: any, idx: number) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-t border-t-[#324d67] hover:bg-[#192633] transition-colors"
                      >
                        <td className="px-4 py-3 text-white text-sm">{user.name || "No name"}</td>
                        <td className="px-4 py-3 text-[#92adc9] text-sm">{user.email}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded text-xs font-medium bg-[#324d67] text-[#92adc9]">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#92adc9] text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
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















