"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { HouseIcon, TrophyIcon, UserIcon, HandshakeIcon, UsersThreeIcon, ChartBarIcon, ShieldCheckIcon } from "@/components/icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { apiGet, apiPost } from "@/app/lib/api";
import { toast } from "sonner";

const sidebarItems = [
  {
    label: "Dashboard",
    href: "/academy/dashboard",
    icon: <HouseIcon size={24} weight="fill" />,
  },
  {
    label: "Tournaments",
    href: "/academy/tournaments",
    icon: <TrophyIcon size={24} />,
  },
  {
    label: "Players",
    href: "/academy/players",
    icon: <UserIcon size={24} />,
  },
  {
    label: "Partnerships",
    href: "/academy/partnerships",
    icon: <HandshakeIcon size={24} />,
  },
  {
    label: "Squads",
    href: "/academy/squads",
    icon: <UsersThreeIcon size={24} />,
  },
  {
    label: "Analytics",
    href: "/academy/analytics",
    icon: <ChartBarIcon size={24} />,
  },
  {
    label: "Verification",
    href: "/academy/verification",
    icon: <ShieldCheckIcon size={24} />,
  },
];

type Tour = { id: number; name: string; category: string; date: string; location: string; participants: number; status: string; image: string };
const seed: Tour[] = [
  {
    id: 1,
    name: "Elite Youth Cup",
    category: "U17 Boys",
    date: "2024-03-15",
    location: "London, UK",
    participants: 24,
    status: "Upcoming",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoCQutrOZAAExqVQcelb-1DvBoDFq1qYwrguSxORgs6dXwH55PVG_JShFVV4F72txrQp4MPypJgNDRr1h-Q7Nv3GyAGP-s0UbeI8aco8hR_aYEsjpnMFBKiC1em5e3b_qt4hy8DPORYnCvryqyJwX85aTiQKsXjE_SDBYsZq-geH3oPkE7BGTj8J1KFR1Pe3LAetXdSBkkn37u9oz5PtmTNFgkIhEuUBvD3w6rXjobOhiZ3w4-F5NcXIgrCRSJzNHWkqR-qGggrdwP",
  },
  {
    id: 2,
    name: "National Academy Showcase",
    category: "U15 Girls",
    date: "2024-04-20",
    location: "Manchester, UK",
    participants: 18,
    status: "Upcoming",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-r66LAQua69QPpqhzCL5855wN4LHM59MTEUxkCpa9AU8SPwI_BpTQHdRRpsX3ie1tWJP66H7ixZd1zHRmy5SZOOrlxyWtt5SQKotuWdfVOLEYjHXBmuGIC2WAs_xTiEkT5VwN6-ZH2xKLUuYVceaAhua2Y5cMy9v_aX9UpsbGDhjQo3RwykOCEgBWQM9asv8C6O5DKl16ypoOfF0exwvmR0oCz3_7SWGjkGPxlJgDvTW4BdLTqkou_PnOoOgJ2t3mrH8_oyrS-c4H",
  },
  {
    id: 3,
    name: "Future Stars Tournament",
    category: "U19 Boys",
    date: "2024-05-10",
    location: "Birmingham, UK",
    participants: 32,
    status: "Upcoming",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzWJp3Za8SmWHOzta_Bk1HOIGy-kEYmMtb42Mn7xKOP3LpqYkBudU0lQ5kdvDdhsZe_BhY0hOlvOUu8hG_8v9wM5trkeE809DEmHm7iU5h10neMVFHNiZkSz2dbNyCr1IPrG7ZgfT8QXoSs6lsdnnGjMT31hHKri9QTTsqWSI0qiNKo7ONTvike06chPBMr4qI5F1NzDTIfcyznFFnOBtSyQZ6z8k04tWq5Lgm31o3VFpLATGjfGlVC57wAAlvBzEbTNGYxv8Y-Tku",
  },
  {
    id: 4,
    name: "Spring Championship",
    category: "U16 Mixed",
    date: "2024-02-28",
    location: "Leeds, UK",
    participants: 20,
    status: "Completed",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoCQutrOZAAExqVQcelb-1DvBoDFq1qYwrguSxORgs6dXwH55PVG_JShFVV4F72txrQp4MPypJgNDRr1h-Q7Nv3GyAGP-s0UbeI8aco8hR_aYEsjpnMFBKiC1em5e3b_qt4hy8DPORYnCvryqyJwX85aTiQKsXjE_SDBYsZq-geH3oPkE7BGTj8J1KFR1Pe3LAetXdSBkkn37u9oz5PtmTNFgkIhEuUBvD3w6rXjobOhiZ3w4-F5NcXIgrCRSJzNHWkqR-qGggrdwP",
  },
];

export default function TournamentsPage() {
  const { data: session } = useSession();
  const [list, setList] = useState<Tour[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [draft, setDraft] = useState({ name: "", category: "U17 Boys", date: "", location: "", participants: "16", fee: "0" });
  const [registerName, setRegisterName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      loadTournaments();
    }
  }, [session]);

  async function loadTournaments() {
    try {
      const trials = await apiGet("trials");
      const mapped: Tour[] = trials.map((t: any) => ({
        id: parseInt(t.id.slice(-6), 36) || Math.random(),
        name: t.title,
        category: "Mixed",
        date: new Date(t.date).toISOString().slice(0, 10),
        location: t.city,
        participants: 0, // TODO: Count applications
        status: new Date(t.date) > new Date() ? "Upcoming" : "Completed",
        image: seed[0].image,
      }));
      setList(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function createTournament() {
    if (!session?.user?.id) {
      toast.error("Please log in");
      return;
    }
    if (!draft.name.trim()) {
      toast.error("Tournament name is required");
      return;
    }
    if (!draft.location.trim()) {
      toast.error("Location is required");
      return;
    }
    if (!draft.date) {
      toast.error("Date is required");
      return;
    }
    setCreating(true);
    try {
      const payload = {
        title: draft.name.trim(),
        city: draft.location.trim(),
        date: draft.date,
        fee: parseFloat(draft.fee) || 0,
        createdById: session.user.id,
      };
      console.log("Creating tournament with payload:", payload);
      await apiPost("trials", payload);
      toast.success("Tournament created successfully!");
      setShowCreate(false);
      setDraft({ name: "", category: "U17 Boys", date: "", location: "", participants: "16", fee: "0" });
      loadTournaments();
    } catch (err: any) {
      console.error("Error creating tournament:", err);
      const errorMsg = err.message || err.error || "Failed to create tournament";
      const details = err.details || err.code;
      toast.error(details ? `${errorMsg}: ${details}` : errorMsg);
    } finally {
      setCreating(false);
    }
  }

  async function registerTeam(id: number) {
    if (!registerName.trim() || !session?.user?.id) {
      toast.error("Enter team name");
      return;
    }
    // In production, create application or registration
    toast.success("Team registered!");
    setRegisterName("");
  }
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <Sidebar
            title="ProConnect"
            subtitle="Partner Dashboard"
            items={sidebarItems}
          />
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-white tracking-light text-[32px] font-bold leading-tight">
                  Tournaments
                </p>
                <p className="text-[#92adc9] text-sm font-normal leading-normal">
                  Manage and track your tournament participation
                </p>
              </div>
              <Button size="lg" onClick={() => setShowCreate(true)}>
                Create New Tournament
              </Button>
            </div>

            <div className="flex flex-col gap-4 p-4">
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
                Upcoming Tournaments
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {list
                  .filter((t) => t.status === "Upcoming")
                  .map((tournament, idx) => (
                    <motion.div
                      key={tournament.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex flex-col gap-4 rounded-lg border border-[#324d67] overflow-hidden hover:border-[#1172d4] transition-colors cursor-pointer"
                    >
                      <div
                        className="w-full bg-center bg-no-repeat aspect-video bg-cover"
                        style={{ backgroundImage: `url("${tournament.image}")` }}
                      />
                      <div className="p-4 flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white text-base font-medium leading-normal">
                              {tournament.name}
                            </p>
                            <p className="text-[#92adc9] text-sm font-normal leading-normal">
                              {tournament.category}
                            </p>
                          </div>
                          <span className="px-2 py-1 rounded bg-[#0bda5b]/20 text-[#0bda5b] text-xs font-medium">
                            {tournament.status}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                          <p className="text-[#92adc9]">
                            📅 {new Date(tournament.date).toLocaleDateString()}
                          </p>
                          <p className="text-[#92adc9]">📍 {tournament.location}</p>
                          <p className="text-[#92adc9]">👥 {tournament.participants} participants</p>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            value={registerName}
                            onChange={(e) => setRegisterName(e.target.value)}
                            placeholder="Register team name"
                            className="flex-1 bg-[#111a22] border border-[#324d67] rounded px-3 py-2 text-white placeholder:text-[#92adc9] focus:outline-none focus:border-[#1172d4]"
                          />
                          <Button variant="secondary" size="sm" onClick={() => registerTeam(tournament.id)}>Register</Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 p-4">
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
                Past Tournaments
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {list
                  .filter((t) => t.status === "Completed")
                  .map((tournament, idx) => (
                    <motion.div
                      key={tournament.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex flex-col gap-4 rounded-lg border border-[#324d67] overflow-hidden opacity-75"
                    >
                      <div
                        className="w-full bg-center bg-no-repeat aspect-video bg-cover"
                        style={{ backgroundImage: `url("${tournament.image}")` }}
                      />
                      <div className="p-4 flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white text-base font-medium leading-normal">
                              {tournament.name}
                            </p>
                            <p className="text-[#92adc9] text-sm font-normal leading-normal">
                              {tournament.category}
                            </p>
                          </div>
                          <span className="px-2 py-1 rounded bg-[#324d67] text-[#92adc9] text-xs font-medium">
                            {tournament.status}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                          <p className="text-[#92adc9]">
                            📅 {new Date(tournament.date).toLocaleDateString()}
                          </p>
                          <p className="text-[#92adc9]">📍 {tournament.location}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
            <Modal
              isOpen={showCreate}
              onClose={() => {
                setShowCreate(false);
                setDraft({ name: "", category: "U17 Boys", date: "", location: "", participants: "16", fee: "0" });
              }}
              title="Create New Tournament"
              footer={
                <div className="flex justify-end gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowCreate(false);
                      setDraft({ name: "", category: "U17 Boys", date: "", location: "", participants: "16", fee: "0" });
                    }}
                    disabled={creating}
                  >
                    Cancel
                  </Button>
                  <Button onClick={createTournament} disabled={creating}>
                    {creating ? "Creating..." : "Create Tournament"}
                  </Button>
                </div>
              }
            >
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#92adc9] text-sm font-medium mb-2">
                      Tournament Name *
                    </label>
                    <Input
                      placeholder="Enter tournament name"
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#92adc9] text-sm font-medium mb-2">
                      Category
                    </label>
                    <select
                      className="w-full bg-[#111a22] border border-[#324d67] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#1172d4]"
                      value={draft.category}
                      onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                    >
                      <option>U15 Girls</option>
                      <option>U16 Mixed</option>
                      <option>U17 Boys</option>
                      <option>U19 Boys</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#92adc9] text-sm font-medium mb-2">
                      Date *
                    </label>
                    <Input
                      type="date"
                      value={draft.date}
                      onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#92adc9] text-sm font-medium mb-2">
                      Location *
                    </label>
                    <Input
                      placeholder="Enter location"
                      value={draft.location}
                      onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#92adc9] text-sm font-medium mb-2">
                      Entry Fee (USD)
                    </label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={draft.fee}
                      onChange={(e) => setDraft({ ...draft, fee: e.target.value })}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-[#92adc9] text-sm font-medium mb-2">
                      Max Participants
                    </label>
                    <Input
                      type="number"
                      placeholder="16"
                      value={draft.participants}
                      onChange={(e) => setDraft({ ...draft, participants: e.target.value })}
                      min="1"
                    />
                  </div>
                </div>
                <p className="text-[#92adc9] text-xs mt-2">
                  * Required fields
                </p>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}


