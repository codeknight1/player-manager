"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { HouseIcon, UserIcon, UsersThreeIcon, ShieldCheckIcon, TrophyIcon, ChartBarIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiGet, apiPost, apiPatch } from "@/app/lib/api";
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

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(searchParams.get("role") || "");
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    if (session?.user && (session.user as any).role !== "ADMIN") {
      router.push("/admin/login");
      return;
    }
    loadUsers();
  }, [session, roleFilter, router]);

  async function loadUsers() {
    try {
      const params = new URLSearchParams();
      if (roleFilter) params.append("role", roleFilter);
      if (search) params.append("search", search);
      const data = await apiGet(`admin/users?${params.toString()}`);
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function updateUser(userId: string, updates: any) {
    try {
      await apiPatch(`admin/users/${userId}`, updates);
      toast.success("User updated");
      loadUsers();
      setSelectedUser(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to update user");
    }
  }

  const filteredUsers = users.filter((u) =>
    search ? u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <Sidebar
            title="Admin"
            subtitle="User Management"
            items={sidebarItems}
            user={{ name: session?.user?.name || "Admin", role: "Super Admin" }}
          />
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">
                User Management
              </p>
            </div>

            <div className="px-4 py-3 flex gap-3 flex-wrap">
              <Input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 min-w-64 border-[#324d67] bg-[#192633]"
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-10 px-3 rounded-lg border border-[#324d67] bg-[#192633] text-white"
              >
                <option value="">All Roles</option>
                <option value="PLAYER">Players</option>
                <option value="AGENT">Agents</option>
                <option value="ACADEMY">Academies</option>
                <option value="ADMIN">Admins</option>
              </select>
              <Button variant="secondary" onClick={loadUsers}>
                Refresh
              </Button>
            </div>

            <div className="px-4 pb-4">
              <div className="flex overflow-hidden rounded-lg border border-[#324d67] bg-[#111a22]">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-[#192633]">
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">User</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Role</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Created</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-[#92adc9]">
                          Loading...
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-[#92adc9]">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user, idx) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-t border-t-[#324d67] hover:bg-[#192633] transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-white text-sm font-medium">{user.name || "No name"}</p>
                              <p className="text-[#92adc9] text-xs">{user.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-[#324d67] text-[#92adc9]">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                user.isActive !== false
                                  ? "bg-[#0bda5b]/20 text-[#0bda5b]"
                                  : "bg-[#ef4444]/20 text-[#ef4444]"
                              }`}
                            >
                              {user.isActive !== false ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#92adc9] text-sm">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Button variant="secondary" size="sm" onClick={() => setSelectedUser(user)}>
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateUser(user.id, { isActive: !user.isActive })}
                              >
                                {user.isActive !== false ? "Deactivate" : "Activate"}
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

            {selectedUser && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#192633] border border-[#324d67] rounded-lg p-6 max-w-md w-full"
                >
                  <h3 className="text-white text-xl font-bold mb-4">Edit User</h3>
                  <div className="flex flex-col gap-3">
                    <Input label="Name" value={selectedUser.name || ""} disabled className="bg-[#111a22]" />
                    <Input label="Email" value={selectedUser.email || ""} disabled className="bg-[#111a22]" />
                    <div>
                      <label className="text-white text-sm mb-2 block">Role</label>
                      <select
                        value={selectedUser.role}
                        onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                        className="w-full h-10 px-3 rounded-lg border border-[#324d67] bg-[#111a22] text-white"
                      >
                        <option value="PLAYER">PLAYER</option>
                        <option value="AGENT">AGENT</option>
                        <option value="ACADEMY">ACADEMY</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedUser.isActive !== false}
                        onChange={(e) => setSelectedUser({ ...selectedUser, isActive: e.target.checked })}
                        className="rounded"
                      />
                      <label className="text-white text-sm">Active</label>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="secondary" onClick={() => setSelectedUser(null)} className="flex-1">
                        Cancel
                      </Button>
                      <Button
                        onClick={() => updateUser(selectedUser.id, { role: selectedUser.role, isActive: selectedUser.isActive })}
                        className="flex-1"
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

