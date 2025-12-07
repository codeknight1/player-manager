"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { HouseIcon, UserIcon, MagnifyingGlassIcon, ChatIcon, GearIcon, TrophyIcon, ShieldCheckIcon, ListChecksIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { apiGet, apiPost } from "@/app/lib/api";
import { toast } from "sonner";

const sidebarItems = [
  {
    label: "Home",
    href: "/agent/dashboard",
    icon: <HouseIcon size={24} weight="fill" />,
  },
  {
    label: "Players",
    href: "/agent/players",
    icon: <UserIcon size={24} />,
  },
  {
    label: "Scouts",
    href: "/agent/scouts",
    icon: <MagnifyingGlassIcon size={24} />,
  },
  {
    label: "Messages",
    href: "/agent/messages",
    icon: <ChatIcon size={24} />,
  },
  {
    label: "Settings",
    href: "/agent/settings",
    icon: <GearIcon size={24} />,
  },
  {
    label: "Trials",
    href: "/agent/trials",
    icon: <TrophyIcon size={24} />,
  },
  {
    label: "Verification",
    href: "/agent/verification",
    icon: <ShieldCheckIcon size={24} />,
  },
  {
    label: "Recruitment",
    href: "/agent/recruitment",
    icon: <ListChecksIcon size={24} />,
  },
];

interface Scout {
  id: string;
  name: string;
  region: string;
  experience: string;
  playersFound: number;
  status: "Active" | "Inactive";
  avatar?: string;
  email?: string;
  phone?: string;
  userId?: string;
}

export default function AgentScoutsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [scouts, setScouts] = useState<Scout[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedScout, setSelectedScout] = useState<Scout | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    region: "",
    experience: "",
    status: "Active" as "Active" | "Inactive",
  });

  useEffect(() => {
    if (session === undefined) return;
    const userId = (session?.user as any)?.id;
    if (userId) {
      loadScouts(userId);
    } else {
      setLoading(false);
    }
  }, [session]);

  async function loadScouts(userId: string) {
    try {
      const userData = await apiGet(`profile?userId=${userId}`).catch(() => null);
      if (userData) {
        const profileSource = (() => {
          if (userData?.profile && typeof userData.profile === "object" && !Array.isArray(userData.profile)) {
            return userData.profile;
          }
          if (userData?.profileData && typeof userData.profileData === "string") {
            try {
              return JSON.parse(userData.profileData);
            } catch {
              return {};
            }
          }
          if (userData?.profileData && typeof userData.profileData === "object") {
            return userData.profileData;
          }
          return {};
        })();

        const scoutsData = profileSource.scouts || [];
        setScouts(scoutsData.map((s: any) => ({
          id: s.id || Math.random().toString(36).slice(2, 9),
          name: s.name || "",
          region: s.region || "",
          experience: s.experience || "0 years",
          playersFound: s.playersFound || 0,
          status: s.status || "Active",
          avatar: s.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name || "S")}&background=1172d4&color=fff`,
          email: s.email || "",
          phone: s.phone || "",
          userId: s.userId || "",
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function saveScouts(userId: string, updatedScouts: Scout[]) {
    try {
      const userData = await apiGet(`profile?userId=${userId}`).catch(() => null);
      if (!userData) {
        toast.error("Failed to load profile");
        return;
      }

      const profileSource = (() => {
        if (userData?.profile && typeof userData.profile === "object" && !Array.isArray(userData.profile)) {
          return userData.profile;
        }
        if (userData?.profileData && typeof userData.profileData === "string") {
          try {
            return JSON.parse(userData.profileData);
          } catch {
            return {};
          }
        }
        if (userData?.profileData && typeof userData.profileData === "object") {
          return userData.profileData;
        }
        return {};
      })();

      const updatedProfile = {
        ...profileSource,
        scouts: updatedScouts,
      };

      await apiPost("profile", {
        userId,
        profileData: typeof updatedProfile === "string" ? updatedProfile : JSON.stringify(updatedProfile),
      });

      toast.success("Scouts updated successfully");
      loadScouts(userId);
    } catch (err: any) {
      toast.error(err?.message || "Failed to save scouts");
    }
  }

  function handleAddScout() {
    const userId = (session?.user as any)?.id;
    if (!userId) {
      toast.error("Please log in");
      return;
    }

    if (!formData.name || !formData.region) {
      toast.error("Name and region are required");
      return;
    }

    const newScout: Scout = {
      id: Math.random().toString(36).slice(2, 9) + Date.now().toString(36),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      region: formData.region,
      experience: formData.experience || "0 years",
      playersFound: 0,
      status: formData.status,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=1172d4&color=fff`,
    };

    const updatedScouts = [...scouts, newScout];
    saveScouts(userId, updatedScouts);
    setIsAddModalOpen(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      region: "",
      experience: "",
      status: "Active",
    });
  }

  function handleViewScout(scout: Scout) {
    setSelectedScout(scout);
    setIsViewModalOpen(true);
  }

  function handleContactScout(scout: Scout) {
    router.push("/agent/messages");
    if (scout.email) {
      setTimeout(() => {
        toast.info(`Contact ${scout.name} at ${scout.email}`);
      }, 500);
    }
  }

  function handleToggleStatus(scoutId: string) {
    const userId = (session?.user as any)?.id;
    if (!userId) return;

    const updatedScouts = scouts.map((s) =>
      s.id === scoutId ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : s
    );
    saveScouts(userId, updatedScouts);
  }

  const scoutStats = useMemo(() => {
    const totalScouts = scouts.length;
    const activeScouts = scouts.filter((s) => s.status === "Active").length;
    const playersDiscovered = scouts.reduce((sum, s) => sum + (s.playersFound || 0), 0);
    const regions = new Set(scouts.map((s) => s.region).filter(Boolean));
    const regionsCovered = regions.size;

    return [
      { label: "Total Scouts", value: totalScouts.toString() },
      { label: "Active Scouts", value: activeScouts.toString() },
      { label: "Players Discovered", value: playersDiscovered.toString() },
      { label: "Regions Covered", value: regionsCovered.toString() },
    ];
  }, [scouts]);
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-2 sm:px-4 lg:px-6 flex flex-1 justify-center py-3 sm:py-5">
          <Sidebar
            title="ScoutHub"
            subtitle="Club"
            items={sidebarItems}
          />
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3 p-2 sm:p-4">
              <div className="flex flex-col gap-2 sm:gap-3 min-w-0">
                <p className="text-white tracking-light text-2xl sm:text-[28px] lg:text-[32px] font-bold leading-tight">
                  Scout Management
                </p>
                <p className="text-[#92adc9] text-xs sm:text-sm font-normal leading-normal">
                  Manage your scouting network and track scout performance
                </p>
              </div>
              <div className="flex sm:block">
                <Button size="lg" className="w-full sm:w-auto" onClick={() => setIsAddModalOpen(true)}>Add New Scout</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-2 sm:p-4">
              {scoutStats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col gap-2 rounded-lg p-4 sm:p-6 border border-[#324d67]"
                >
                  <p className="text-white text-sm sm:text-base font-medium leading-normal">
                    {stat.label}
                  </p>
                  <p className="text-white tracking-light text-xl sm:text-2xl font-bold leading-tight">
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>

            <h2 className="text-white text-lg sm:text-xl lg:text-[22px] font-bold leading-tight tracking-[-0.015em] px-2 sm:px-4 pb-2 sm:pb-3 pt-3 sm:pt-5">
              Your Scout Network
            </h2>
            <div className="px-2 sm:px-4 py-2 sm:py-3">
              {loading ? (
                <div className="text-[#92adc9] text-sm p-4">Loading scouts...</div>
              ) : scouts.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-[#92adc9] text-sm mb-4">No scouts added yet. Start building your network!</p>
                  <Button onClick={() => setIsAddModalOpen(true)}>Add Your First Scout</Button>
                </div>
              ) : (
                <>
                  <div className="hidden lg:block overflow-hidden rounded-lg border border-[#324d67] bg-[#111a22]">
                    <table className="flex-1 w-full">
                      <thead>
                        <tr className="bg-[#192633]">
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-white text-xs sm:text-sm font-medium leading-normal">
                            Scout
                          </th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-white text-xs sm:text-sm font-medium leading-normal">
                            Region
                          </th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-white text-xs sm:text-sm font-medium leading-normal">
                            Experience
                          </th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-white text-xs sm:text-sm font-medium leading-normal">
                            Players Found
                          </th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-white text-xs sm:text-sm font-medium leading-normal">
                            Status
                          </th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-white text-xs sm:text-sm font-medium leading-normal">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {scouts.map((scout, idx) => (
                      <motion.tr
                        key={scout.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="border-t border-t-[#324d67] hover:bg-[#192633] transition-colors"
                      >
                        <td className="h-[72px] px-3 sm:px-4 py-2">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div
                              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 sm:size-10 shrink-0"
                              style={{ backgroundImage: `url("${scout.avatar}")` }}
                            />
                            <span className="text-white text-xs sm:text-sm font-medium leading-normal truncate">
                              {scout.name}
                            </span>
                          </div>
                        </td>
                        <td className="h-[72px] px-3 sm:px-4 py-2 text-[#92adc9] text-xs sm:text-sm font-normal leading-normal">
                          {scout.region}
                        </td>
                        <td className="h-[72px] px-3 sm:px-4 py-2 text-[#92adc9] text-xs sm:text-sm font-normal leading-normal">
                          {scout.experience}
                        </td>
                        <td className="h-[72px] px-3 sm:px-4 py-2 text-[#92adc9] text-xs sm:text-sm font-normal leading-normal">
                          {scout.playersFound}
                        </td>
                        <td className="h-[72px] px-3 sm:px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              scout.status === "Active"
                                ? "bg-[#0bda5b]/20 text-[#0bda5b]"
                                : "bg-[#324d67] text-[#92adc9]"
                            }`}
                          >
                            {scout.status}
                          </span>
                        </td>
                        <td className="h-[72px] px-3 sm:px-4 py-2">
                          <div className="flex gap-1 sm:gap-2">
                            <Button variant="secondary" size="sm" className="text-xs" onClick={() => handleViewScout(scout)}>View</Button>
                            <Button variant="secondary" size="sm" className="text-xs" onClick={() => handleContactScout(scout)}>Contact</Button>
                          </div>
                        </td>
                      </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="lg:hidden flex flex-col gap-3">
                    {scouts.map((scout, idx) => (
                  <motion.div
                    key={scout.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-col gap-3 rounded-lg border border-[#324d67] bg-[#192633] p-3 sm:p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 shrink-0"
                        style={{ backgroundImage: `url("${scout.avatar}")` }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm sm:text-base font-medium leading-normal truncate">
                          {scout.name}
                        </p>
                        <p className="text-[#92adc9] text-xs sm:text-sm font-normal leading-normal">
                          {scout.region}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium shrink-0 ${
                          scout.status === "Active"
                            ? "bg-[#0bda5b]/20 text-[#0bda5b]"
                            : "bg-[#324d67] text-[#92adc9]"
                        }`}
                      >
                        {scout.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                      <div>
                        <span className="text-[#92adc9]">Experience:</span>
                        <span className="text-white ml-2">{scout.experience}</span>
                      </div>
                      <div>
                        <span className="text-[#92adc9]">Players Found:</span>
                        <span className="text-white ml-2">{scout.playersFound}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button variant="secondary" size="sm" className="flex-1 text-xs" onClick={() => handleViewScout(scout)}>View</Button>
                      <Button variant="secondary" size="sm" className="flex-1 text-xs" onClick={() => handleContactScout(scout)}>Contact</Button>
                    </div>
                    </motion.div>
                  ))}
                </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Scout"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddScout}>
              Add Scout
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Name *"
            placeholder="Enter scout name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border-[#324d67] bg-[#192633]"
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="Enter scout email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="border-[#324d67] bg-[#192633]"
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="Enter scout phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="border-[#324d67] bg-[#192633]"
          />
          <Input
            label="Region *"
            placeholder="Enter scout region"
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            className="border-[#324d67] bg-[#192633]"
            required
          />
          <Input
            label="Experience"
            placeholder="e.g., 10 years"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            className="border-[#324d67] bg-[#192633]"
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })}
              className="w-full h-10 px-3 rounded-lg border border-[#324d67] bg-[#192633] text-white"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={selectedScout ? `Scout: ${selectedScout.name}` : "Scout Details"}
        footer={
          <div className="flex justify-end gap-3">
            {selectedScout && (
              <>
                <Button variant="secondary" onClick={() => selectedScout && handleToggleStatus(selectedScout.id)}>
                  {selectedScout?.status === "Active" ? "Deactivate" : "Activate"}
                </Button>
                <Button variant="secondary" onClick={() => selectedScout && handleContactScout(selectedScout)}>
                  Contact
                </Button>
              </>
            )}
            <Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        {selectedScout && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-16"
                style={{ backgroundImage: `url("${selectedScout.avatar}")` }}
              />
              <div>
                <h3 className="text-white text-lg font-bold">{selectedScout.name}</h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedScout.status === "Active"
                      ? "bg-[#0bda5b]/20 text-[#0bda5b]"
                      : "bg-[#324d67] text-[#92adc9]"
                  }`}
                >
                  {selectedScout.status}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[#92adc9] text-sm">Region</p>
                <p className="text-white font-medium">{selectedScout.region || "N/A"}</p>
              </div>
              <div>
                <p className="text-[#92adc9] text-sm">Experience</p>
                <p className="text-white font-medium">{selectedScout.experience || "N/A"}</p>
              </div>
              <div>
                <p className="text-[#92adc9] text-sm">Players Found</p>
                <p className="text-white font-medium">{selectedScout.playersFound || 0}</p>
              </div>
              {selectedScout.email && (
                <div>
                  <p className="text-[#92adc9] text-sm">Email</p>
                  <p className="text-white font-medium">{selectedScout.email}</p>
                </div>
              )}
              {selectedScout.phone && (
                <div>
                  <p className="text-[#92adc9] text-sm">Phone</p>
                  <p className="text-white font-medium">{selectedScout.phone}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}



