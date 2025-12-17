"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { HouseIcon, UserIcon, UsersThreeIcon, ShieldCheckIcon, TrophyIcon, ChartBarIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiGet, apiPatch } from "@/app/lib/api";
import { toast } from "sonner";
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

export default function AdminAgenciesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [agencies, setAgencies] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (session?.user && (session.user as any).role !== "ADMIN") {
      router.push("/admin/login");
      return;
    }
    loadAgencies();
  }, [session, statusFilter, router]);

  async function loadAgencies() {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (search) params.append("search", search);
      const data = await apiGet(`admin/agencies?${params.toString()}`);
      setAgencies(data.agencies || []);
      setStats(data.stats || { total: 0, active: 0, inactive: 0 });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load agencies");
    } finally {
      setLoading(false);
    }
  }

  async function updateAgency(agencyId: string, updates: any) {
    try {
      await apiPatch(`admin/users/${agencyId}`, updates);
      toast.success("Agency updated");
      loadAgencies();
    } catch (err: any) {
      toast.error(err.message || "Failed to update agency");
    }
  }

  const filteredAgencies = agencies.filter((a) =>
    search ? a.name?.toLowerCase().includes(search.toLowerCase()) || a.email?.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-2 sm:px-4 lg:px-6 flex flex-1 justify-center py-3 sm:py-5">
          <Sidebar
            title="Admin"
            subtitle="Agency Management"
            items={sidebarItems}
            user={{ name: session?.user?.name || "Admin", role: "Super Admin" }}
          />
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white tracking-light text-2xl sm:text-3xl lg:text-[32px] font-bold leading-tight">
                Agency Management
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
              {[
                { label: "Total Agencies", value: stats.total },
                { label: "Active", value: stats.active },
                { label: "Inactive", value: stats.inactive },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col gap-2 rounded-lg p-4 sm:p-6 border border-[#324d67]"
                >
                  <p className="text-[#92adc9] text-xs sm:text-sm">{stat.label}</p>
                  <p className="text-white tracking-light text-xl sm:text-2xl font-bold leading-tight">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            <div className="px-4 py-3 flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                placeholder="Search agencies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 w-full sm:min-w-64 border-[#324d67] bg-[#192633] min-h-[44px]"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto h-11 sm:h-10 px-3 rounded-lg border border-[#324d67] bg-[#192633] text-white min-h-[44px]"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <Button variant="secondary" onClick={loadAgencies} className="w-full sm:w-auto min-h-[44px]">
                Refresh
              </Button>
            </div>

            <div className="px-4 pb-4">
              <div className="overflow-x-auto rounded-lg border border-[#324d67] bg-[#111a22]">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="bg-[#192633]">
                      <th className="px-2 sm:px-4 py-3 text-left text-white text-xs sm:text-sm font-medium">Agency</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-white text-xs sm:text-sm font-medium">Status</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-white text-xs sm:text-sm font-medium hidden sm:table-cell">Created</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-white text-xs sm:text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-[#92adc9]">
                          Loading...
                        </td>
                      </tr>
                    ) : filteredAgencies.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-[#92adc9]">
                          No agencies found
                        </td>
                      </tr>
                    ) : (
                      filteredAgencies.map((agency, idx) => (
                        <motion.tr
                          key={agency.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-t border-t-[#324d67] hover:bg-[#192633] transition-colors"
                        >
                          <td className="px-2 sm:px-4 py-3">
                            <div>
                              <p className="text-white text-xs sm:text-sm font-medium">{agency.name || "No name"}</p>
                              <p className="text-[#92adc9] text-xs">{agency.email}</p>
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                agency.isActive !== false
                                  ? "bg-[#0bda5b]/20 text-[#0bda5b]"
                                  : "bg-[#ef4444]/20 text-[#ef4444]"
                              }`}
                            >
                              {agency.isActive !== false ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-[#92adc9] text-xs sm:text-sm hidden sm:table-cell">
                            {new Date(agency.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-2 sm:px-4 py-3">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateAgency(agency.id, { isActive: !agency.isActive })}
                                className="min-h-[36px] text-xs sm:text-sm"
                              >
                                {agency.isActive !== false ? "Deactivate" : "Activate"}
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
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
