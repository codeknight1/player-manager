"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { HouseIcon, UserIcon, UsersThreeIcon, ShieldCheckIcon, TrophyIcon, ChartBarIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/app/lib/api";
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

export default function AdminTrialsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [trials, setTrials] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    past: 0,
    totalApplications: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTrial, setSelectedTrial] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    city: "",
    date: "",
    fee: "",
  });

  useEffect(() => {
    if (session?.user && (session.user as any).role !== "ADMIN") {
      router.push("/admin/login");
      return;
    }
    loadTrials();
  }, [session, statusFilter, router]);

  async function loadTrials() {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (search) params.append("search", search);
      const data = await apiGet(`admin/trials?${params.toString()}`);
      setTrials(data.trials || []);
      setStats(data.stats || { total: 0, upcoming: 0, past: 0, totalApplications: 0, totalRevenue: 0 });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load trials");
    } finally {
      setLoading(false);
    }
  }

  async function createTrial() {
    try {
      if (!formData.title || !formData.city || !formData.date) {
        toast.error("Please fill all required fields");
        return;
      }
      await apiPost("admin/trials", {
        ...formData,
        fee: formData.fee ? Number(formData.fee) : 0,
      });
      toast.success("Trial created");
      setShowCreateModal(false);
      setFormData({ title: "", city: "", date: "", fee: "" });
      loadTrials();
    } catch (err: any) {
      toast.error(err.message || "Failed to create trial");
    }
  }

  async function updateTrial(id: string, updates: any) {
    try {
      await apiPatch(`admin/trials/${id}`, updates);
      toast.success("Trial updated");
      setSelectedTrial(null);
      loadTrials();
    } catch (err: any) {
      toast.error(err.message || "Failed to update trial");
    }
  }

  async function deleteTrial(id: string) {
    if (!confirm("Are you sure you want to delete this trial?")) return;
    try {
      await apiDelete(`admin/trials/${id}`);
      toast.success("Trial deleted");
      loadTrials();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete trial");
    }
  }

  const filteredTrials = trials.filter((t) =>
    search
      ? t.title?.toLowerCase().includes(search.toLowerCase()) ||
        t.city?.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-2 sm:px-4 lg:px-6 flex flex-1 justify-center py-3 sm:py-5">
          <Sidebar
            title="Admin"
            subtitle="Trial Management"
            items={sidebarItems}
            user={{ name: session?.user?.name || "Admin", role: "Super Admin" }}
          />
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4">
              <p className="text-white tracking-light text-2xl sm:text-3xl lg:text-[32px] font-bold leading-tight">
                Trial Management
              </p>
              <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto min-h-[44px]">
                Create Trial
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-4">
              {[
                { label: "Total Trials", value: stats.total },
                { label: "Upcoming", value: stats.upcoming },
                { label: "Past", value: stats.past },
                { label: "Total Applications", value: stats.totalApplications },
                { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}` },
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
                placeholder="Search trials..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 w-full sm:min-w-64 border-[#324d67] bg-[#192633] min-h-[44px]"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto h-11 sm:h-10 px-3 rounded-lg border border-[#324d67] bg-[#192633] text-white min-h-[44px]"
              >
                <option value="">All Trials</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
              <Button variant="secondary" onClick={loadTrials} className="w-full sm:w-auto min-h-[44px]">
                Refresh
              </Button>
            </div>

            <div className="px-4 pb-4">
              <div className="overflow-x-auto rounded-lg border border-[#324d67] bg-[#111a22]">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="bg-[#192633]">
                      <th className="px-2 sm:px-4 py-3 text-left text-white text-xs sm:text-sm font-medium">Trial</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-white text-xs sm:text-sm font-medium">Location</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-white text-xs sm:text-sm font-medium">Date</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-white text-xs sm:text-sm font-medium">Fee</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-white text-xs sm:text-sm font-medium">Applications</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-white text-xs sm:text-sm font-medium hidden md:table-cell">Created By</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-white text-xs sm:text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-[#92adc9]">
                          Loading...
                        </td>
                      </tr>
                    ) : filteredTrials.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-[#92adc9]">
                          No trials found
                        </td>
                      </tr>
                    ) : (
                      filteredTrials.map((trial, idx) => {
                        const isUpcoming = new Date(trial.date) >= new Date();
                        return (
                          <motion.tr
                            key={trial.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="border-t border-t-[#324d67] hover:bg-[#192633] transition-colors"
                          >
                            <td className="px-2 sm:px-4 py-3">
                              <p className="text-white text-xs sm:text-sm font-medium">{trial.title}</p>
                            </td>
                            <td className="px-2 sm:px-4 py-3 text-[#92adc9] text-xs sm:text-sm">{trial.city}</td>
                            <td className="px-2 sm:px-4 py-3 text-[#92adc9] text-xs sm:text-sm">
                              {new Date(trial.date).toLocaleDateString()}
                              {isUpcoming && (
                                <span className="ml-1 sm:ml-2 px-1 sm:px-2 py-0.5 rounded text-xs bg-[#0bda5b]/20 text-[#0bda5b]">
                                  Upcoming
                                </span>
                              )}
                            </td>
                            <td className="px-2 sm:px-4 py-3 text-[#92adc9] text-xs sm:text-sm">${trial.fee.toFixed(2)}</td>
                            <td className="px-2 sm:px-4 py-3 text-[#92adc9] text-xs sm:text-sm">{trial._count?.apps || 0}</td>
                            <td className="px-2 sm:px-4 py-3 text-[#92adc9] text-xs sm:text-sm hidden md:table-cell">
                              {trial.createdBy?.name || "Unknown"}
                            </td>
                            <td className="px-2 sm:px-4 py-3">
                              <div className="flex flex-col sm:flex-row gap-2">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => setSelectedTrial(trial)}
                                  className="min-h-[36px] text-xs sm:text-sm"
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteTrial(trial.id)}
                                  className="min-h-[36px] text-xs sm:text-sm"
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {showCreateModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#192633] border border-[#324d67] rounded-lg p-4 sm:p-6 max-w-md w-full my-auto"
                >
                  <h3 className="text-white text-lg sm:text-xl font-bold mb-4">Create Trial</h3>
                  <div className="flex flex-col gap-3">
                    <Input
                      placeholder="Title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-[#111a22] min-h-[44px]"
                    />
                    <Input
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="bg-[#111a22] min-h-[44px]"
                    />
                    <Input
                      type="datetime-local"
                      placeholder="Date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="bg-[#111a22] min-h-[44px]"
                    />
                    <Input
                      type="number"
                      placeholder="Fee"
                      value={formData.fee}
                      onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                      className="bg-[#111a22] min-h-[44px]"
                    />
                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                      <Button variant="secondary" onClick={() => setShowCreateModal(false)} className="flex-1 min-h-[44px]">
                        Cancel
                      </Button>
                      <Button onClick={createTrial} className="flex-1 min-h-[44px]">
                        Create
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {selectedTrial && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#192633] border border-[#324d67] rounded-lg p-4 sm:p-6 max-w-md w-full my-auto"
                >
                  <h3 className="text-white text-lg sm:text-xl font-bold mb-4">Edit Trial</h3>
                  <div className="flex flex-col gap-3">
                    <Input
                      placeholder="Title"
                      value={selectedTrial.title}
                      onChange={(e) =>
                        setSelectedTrial({ ...selectedTrial, title: e.target.value })
                      }
                      className="bg-[#111a22] min-h-[44px]"
                    />
                    <Input
                      placeholder="City"
                      value={selectedTrial.city}
                      onChange={(e) =>
                        setSelectedTrial({ ...selectedTrial, city: e.target.value })
                      }
                      className="bg-[#111a22] min-h-[44px]"
                    />
                    <Input
                      type="datetime-local"
                      placeholder="Date"
                      value={
                        selectedTrial.date
                          ? new Date(selectedTrial.date).toISOString().slice(0, 16)
                          : ""
                      }
                      onChange={(e) =>
                        setSelectedTrial({ ...selectedTrial, date: e.target.value })
                      }
                      className="bg-[#111a22] min-h-[44px]"
                    />
                    <Input
                      type="number"
                      placeholder="Fee"
                      value={selectedTrial.fee}
                      onChange={(e) =>
                        setSelectedTrial({ ...selectedTrial, fee: Number(e.target.value) })
                      }
                      className="bg-[#111a22] min-h-[44px]"
                    />
                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                      <Button variant="secondary" onClick={() => setSelectedTrial(null)} className="flex-1 min-h-[44px]">
                        Cancel
                      </Button>
                      <Button
                        onClick={() =>
                          updateTrial(selectedTrial.id, {
                            title: selectedTrial.title,
                            city: selectedTrial.city,
                            date: selectedTrial.date,
                            fee: selectedTrial.fee,
                          })
                        }
                        className="flex-1 min-h-[44px]"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
