"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { HouseIcon, TrophyIcon, UserIcon, HandshakeIcon, UsersThreeIcon, ChartBarIcon, ShieldCheckIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
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

const seedPlayers = [
  {
    id: 1,
    name: "Alex Johnson",
    age: 17,
    position: "Forward",
    squad: "U17 Boys",
    status: "Active",
    stats: { goals: 15, assists: 8 },
    avatar: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Sarah Williams",
    age: 15,
    position: "Midfielder",
    squad: "U15 Girls",
    status: "Active",
    stats: { goals: 12, assists: 10 },
    avatar: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Michael Brown",
    age: 19,
    position: "Defender",
    squad: "U19 Boys",
    status: "Active",
    stats: { goals: 3, assists: 5 },
    avatar: "https://via.placeholder.com/150",
  },
  {
    id: 4,
    name: "Emma Davis",
    age: 16,
    position: "Goalkeeper",
    squad: "U17 Girls",
    status: "Inactive",
    stats: { goals: 0, assists: 2 },
    avatar: "https://via.placeholder.com/150",
  },
  {
    id: 5,
    name: "James Wilson",
    age: 18,
    position: "Midfielder",
    squad: "U19 Boys",
    status: "Active",
    stats: { goals: 8, assists: 12 },
    avatar: "https://via.placeholder.com/150",
  },
  {
    id: 6,
    name: "Olivia Martinez",
    age: 14,
    position: "Forward",
    squad: "U15 Girls",
    status: "Active",
    stats: { goals: 20, assists: 6 },
    avatar: "https://via.placeholder.com/150",
  },
];

export default function PlayersPage() {
  const { data: session } = useSession();
  const [players, setPlayers] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState({ name: "", age: "", position: "", squad: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      loadPlayers();
    }
  }, [session]);

  async function loadPlayers() {
    try {
      const users = await apiGet("users?role=PLAYER");
      // For now, show all players - in production, filter by academy association
      const mapped = users.map((u: any) => {
        const profile = u.profileData ? JSON.parse(u.profileData) : {};
        return {
          id: u.id,
          name: u.name || "Unknown",
          age: profile.age || 0,
          position: profile.position || "N/A",
          squad: profile.squad || "U17",
          status: "Active" as const,
          stats: profile.stats || { goals: 0, assists: 0 },
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || "P")}&background=1172d4&color=fff`,
        };
      });
      setPlayers(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function addPlayer() {
    if (!session?.user?.id) {
      toast.error("Please log in");
      return;
    }
    try {
      // Create new user as PLAYER
      const user = await apiPost("profile", {
        email: `${draft.name.toLowerCase().replace(/\s+/g, ".")}@academy.local`,
        name: draft.name || "New Player",
        role: "PLAYER",
        profileData: {
          age: draft.age ? Number(draft.age) : 16,
          position: draft.position || "Midfielder",
          squad: draft.squad || "U17",
          stats: { goals: 0, assists: 0 },
        },
      });
      toast.success("Player added!");
      setDraft({ name: "", age: "", position: "", squad: "" });
      setShowAdd(false);
      loadPlayers();
    } catch (err: any) {
      toast.error(err.message || "Failed to add player");
    }
  }

  function removePlayer(id: string) {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    // TODO: In production, mark as inactive or remove association
  }

  const filtered = useMemo(() => {
    if (!search) return players;
    return players.filter((p) => [p.name, p.position, p.squad].some((f) => f?.toLowerCase().includes(search.toLowerCase())));
  }, [players, search]);

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
                  Players
                </p>
                <p className="text-[#92adc9] text-sm font-normal leading-normal">
                  Manage and view all academy players
                </p>
              </div>
              <Button size="lg" onClick={() => setShowAdd(true)}>
                Add New Player
              </Button>
            </div>

            <div className="p-4 flex gap-3">
              <Input
                type="text"
                placeholder="Search players..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 border-[#324d67] bg-[#192633]"
              />
              <Button variant="secondary">Filter</Button>
            </div>

            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-lg border border-[#324d67] bg-[#111a22]">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-[#192633]">
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                        Player
                      </th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                        Age
                      </th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                        Position
                      </th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                        Squad
                      </th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                        Goals
                      </th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                        Assists
                      </th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-[#92adc9]">Loading players...</td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-[#92adc9]">No players found</td>
                      </tr>
                    ) : (
                      filtered.map((player, idx) => (
                      <motion.tr
                        key={player.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-t border-t-[#324d67] hover:bg-[#192633] transition-colors"
                      >
                        <td className="h-[72px] px-4 py-2">
                          <div className="flex items-center gap-3">
                            <div
                              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                              style={{ backgroundImage: `url("${player.avatar}")` }}
                            />
                            <span className="text-white text-sm font-medium leading-normal">
                              {player.name}
                            </span>
                          </div>
                        </td>
                        <td className="h-[72px] px-4 py-2 text-[#92adc9] text-sm font-normal leading-normal">
                          {player.age}
                        </td>
                        <td className="h-[72px] px-4 py-2 text-[#92adc9] text-sm font-normal leading-normal">
                          {player.position}
                        </td>
                        <td className="h-[72px] px-4 py-2 text-[#92adc9] text-sm font-normal leading-normal">
                          {player.squad}
                        </td>
                        <td className="h-[72px] px-4 py-2 text-[#92adc9] text-sm font-normal leading-normal">
                          {player.stats.goals}
                        </td>
                        <td className="h-[72px] px-4 py-2 text-[#92adc9] text-sm font-normal leading-normal">
                          {player.stats.assists}
                        </td>
                        <td className="h-[72px] px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              player.status === "Active"
                                ? "bg-[#0bda5b]/20 text-[#0bda5b]"
                                : "bg-[#324d67] text-[#92adc9]"
                            }`}
                          >
                            {player.status}
                          </span>
                        </td>
                        <td className="h-[72px] px-4 py-2 flex gap-2">
                          <Button variant="secondary" size="sm">View</Button>
                          <Button variant="outline" size="sm" onClick={() => removePlayer(player.id)}>Remove</Button>
                        </td>
                      </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {showAdd && (
              <div className="px-4 pb-6">
                <div className="rounded-lg border border-[#324d67] bg-[#192633] p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Input label="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                  <Input label="Age" type="number" value={draft.age} onChange={(e) => setDraft({ ...draft, age: e.target.value })} />
                  <Input label="Position" value={draft.position} onChange={(e) => setDraft({ ...draft, position: e.target.value })} />
                  <Input label="Squad" value={draft.squad} onChange={(e) => setDraft({ ...draft, squad: e.target.value })} />
                  <div className="col-span-full flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
                    <Button onClick={addPlayer}>Add Player</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


