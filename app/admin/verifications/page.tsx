"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { HouseIcon, UserIcon, UsersThreeIcon, ShieldCheckIcon, TrophyIcon, ChartBarIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { apiGet, apiPatch } from "@/app/lib/api";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

const sidebarItems = [
  { label: "Overview", href: "/admin/dashboard", icon: <HouseIcon size={24} weight="fill" /> },
  { label: "Users", href: "/admin/users", icon: <UserIcon size={24} /> },
  { label: "Agencies", href: "/admin/agencies", icon: <UsersThreeIcon size={24} /> },
  { label: "Verifications", href: "/admin/verifications", icon: <ShieldCheckIcon size={24} /> },
  { label: "Tournaments", href: "/admin/tournaments", icon: <TrophyIcon size={24} /> },
  { label: "Analytics", href: "/admin/analytics", icon: <ChartBarIcon size={24} /> },
];

export default function AdminVerificationsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");

  useEffect(() => {
    if (session?.user && (session.user as any).role !== "ADMIN") {
      router.push("/admin/login");
      return;
    }
    loadVerifications();
  }, [session, statusFilter, router]);

  async function loadVerifications() {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      const data = await apiGet(`admin/verifications?${params.toString()}`);
      setVerifications(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load verifications");
    } finally {
      setLoading(false);
    }
  }

  async function updateVerification(id: string, status: string) {
    try {
      await apiPatch(`admin/verifications/${id}`, {
        status,
        reviewedBy: (session?.user as any)?.id || "admin",
      });
      toast.success(`Verification ${status.toLowerCase()}`);
      loadVerifications();
    } catch (err: any) {
      toast.error(err.message || "Failed to update verification");
    }
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <Sidebar
            title="Admin"
            subtitle="Verification Management"
            items={sidebarItems}
            user={{ name: session?.user?.name || "Admin", role: "Super Admin" }}
          />
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">
                Verification Management
              </p>
            </div>

            <div className="px-4 py-3 flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-lg border border-[#324d67] bg-[#192633] text-white"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <Button variant="secondary" onClick={loadVerifications}>
                Refresh
              </Button>
            </div>

            <div className="px-4 pb-4">
              <div className="flex overflow-hidden rounded-lg border border-[#324d67] bg-[#111a22]">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-[#192633]">
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">User</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Document Type</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Document Name</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Submitted</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-[#92adc9]">
                          Loading...
                        </td>
                      </tr>
                    ) : verifications.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-[#92adc9]">
                          No verifications found
                        </td>
                      </tr>
                    ) : (
                      verifications.map((verif, idx) => (
                        <motion.tr
                          key={verif.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-t border-t-[#324d67] hover:bg-[#192633] transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-white text-sm font-medium">{verif.user?.name || "Unknown"}</p>
                              <p className="text-[#92adc9] text-xs">{verif.user?.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[#92adc9] text-sm">{verif.documentType}</td>
                          <td className="px-4 py-3 text-[#92adc9] text-sm">{verif.documentName}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                verif.status === "APPROVED"
                                  ? "bg-[#0bda5b]/20 text-[#0bda5b]"
                                  : verif.status === "REJECTED"
                                  ? "bg-[#ef4444]/20 text-[#ef4444]"
                                  : "bg-[#ffa500]/20 text-[#ffa500]"
                              }`}
                            >
                              {verif.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#92adc9] text-sm">
                            {new Date(verif.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            {verif.status === "PENDING" && (
                              <div className="flex gap-2">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => updateVerification(verif.id, "APPROVED")}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateVerification(verif.id, "REJECTED")}
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                            {verif.status !== "PENDING" && (
                              <span className="text-[#92adc9] text-xs">
                                Reviewed {verif.reviewedAt ? new Date(verif.reviewedAt).toLocaleDateString() : ""}
                              </span>
                            )}
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

