"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { HouseIcon, UserIcon, MagnifyingGlassIcon, ChatIcon, GearIcon, TrophyIcon, ShieldCheckIcon, ListChecksIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiGet } from "@/app/lib/api";
import { useRouter } from "next/navigation";

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

const players = [
  {
    id: 1,
    name: "Ethan Carter",
    age: 22,
    position: "Forward",
    club: "Manchester United U21",
    rating: 4.8,
    stats: { goals: 25, assists: 12 },
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJZtidvXFYmB-wzdqOfq4eZHjhU0wpZnNngOM3AN_ibtJ0-qb1rvQgq_Yp2KztrJmYCuCHoANvZKEZpbNWlxbYxsAYc5Qfx7WlQr3KKONKGbZnl9NUiyuHQhYOt73rxOa7B2KmvV27NnsT0twI-omuN7jQy3pXUnJvKkT_ixq15ZlSLH3GISXYsIVCPUAW1tEPwuURcRKP5hZbw4S5Gs-GbQXC886Or7WyZYPYClA9PjWxRF_Nh2G0eza26oWieofinGT3MUXY7lMy",
    status: "Available",
  },
  {
    id: 2,
    name: "Liam Harper",
    age: 24,
    position: "Midfielder",
    club: "Liverpool FC Reserves",
    rating: 4.6,
    stats: { goals: 8, assists: 18 },
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhGpr55GXbaRtaA-FUPJJ7eVY-wF6cxtkJq9Mx8Qigrz79rZ8ryuag1TocZOPdaP8bJJnRGeMOGJfsUGV1JqkCvelAH8xzeEv24zP2tP0_bbyuf6e9tuntHNGM1LTU5SRh41dmcrSvvbYxGd-3hcXojU3ZTqaZ8QR2SROyCIuyxJzkJkZXg4gGYjKVB6Bg8WWGAvsudHPTHtllTMBFAN8huHokVxIQiylJDTJa5QWpMsC5g6Qf1mWV7moUNFOp4WJKZuO1bk8AFYw1",
    status: "Under Contract",
  },
  {
    id: 3,
    name: "Noah Bennett",
    age: 21,
    position: "Defender",
    club: "Free Agent",
    rating: 4.5,
    stats: { goals: 3, assists: 5 },
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDxAkyYdmjiZPOzGv6SOfADK8cNtHO5jj2sBvIF5l_RYHy6fGFCXxlyiOlwbAkmgNdFvSsaJy-wfTqh2xWV10IIO9oTvSPMb3Wqa_3-ohofwrfghxAotvwlbjKbvAFUqplwwLsrRwVwczqAJVfQfqS-dC8LrZ8t5_8lCfqLf9veKoCs6GmfyL1FY11UwmM_AOQ9AdwzHu5T99dvrhGMaVu0PGwTzcGsJXWAv6-HLjPkH6QphU9En-zn2a-s-crkYkeP5XoBSMqwMeG",
    status: "Available",
  },
  {
    id: 4,
    name: "Oliver Hayes",
    age: 23,
    position: "Goalkeeper",
    club: "Chelsea FC Academy",
    rating: 4.7,
    stats: { cleanSheets: 15, saves: 120 },
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoI5WzFOS7qKDgZUCQRptt9Jln1fo0JO7SWGjMaUVzsl9Yenc6GQCLE9YeS2j8gdSZF68x0ic-dSUP0m1uCLzxxyzw5VupaJ3RTPRgsDK4iEE82bb4wCtRzHswX4k26wm06133AcLAbskhi3wgml0OTyYrOm1jMtWh7aKQWLn9TvkxY40rbWqIz6igtWThJpC10_e_9tqU-NmS9JFNPng2Il7JvYlyXuhLW_tecV16vCAJi6x13A3qgGt9Sde6dcDOA4rPUfFH6vWb",
    status: "Available",
  },
];

export default function AgentPlayersPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState("");
  const [contract, setContract] = useState("");
  const [ageMax, setAgeMax] = useState<number | "">("");
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [allPlayers, setAllPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(12);

  useEffect(() => {
    loadPlayers();
    const saved = localStorage.getItem("agent_shortlist");
    if (saved) setShortlist(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("agent_shortlist", JSON.stringify(shortlist));
  }, [shortlist]);

  function calculateRating(stats: any) {
    if (!stats) return 4.0;
    let score = 4.0;
    if (stats.goals) score += Math.min(stats.goals / 50, 0.5);
    if (stats.assists) score += Math.min(stats.assists / 30, 0.3);
    if (stats.cleanSheets) score += Math.min(stats.cleanSheets / 20, 0.2);
    return Math.min(Math.round(score * 10) / 10, 5.0);
  }

  async function loadPlayers() {
    try {
      const users = await apiGet("users?role=PLAYER");
      const playersWithProfiles = users.map((u: any) => {
        const profile = u.profileData ? JSON.parse(u.profileData) : {};
        const club = profile.presentClub || profile.club || "Free Agent";
        const hasContract = club !== "Free Agent" && !profile.previousClub;
        
        return {
          id: u.id,
          name: u.name || "Unknown Player",
          age: profile.age || 0,
          position: profile.position || "N/A",
          club: club,
          rating: calculateRating(profile.stats || {}),
          stats: profile.stats || { goals: 0, assists: 0 },
          avatar: profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || "P")}&background=1172d4&color=fff`,
          status: hasContract ? "Under Contract" : "Available",
        };
      });
      setAllPlayers(playersWithProfiles);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return allPlayers.filter((p) => {
      const matchesQuery = query
        ? [p.name, p.position, p.club].some((f) => f?.toLowerCase().includes(query.toLowerCase()))
        : true;
      const matchesPos = position ? p.position?.toLowerCase().includes(position.toLowerCase()) : true;
      const matchesContract = contract ? p.status?.toLowerCase().includes(contract.toLowerCase()) : true;
      const matchesAge = ageMax ? p.age <= Number(ageMax) : true;
      return matchesQuery && matchesPos && matchesContract && matchesAge;
    });
  }, [query, position, contract, ageMax, allPlayers]);

  const displayedPlayers = filtered.slice(0, displayLimit);
  const hasMore = filtered.length > displayLimit;

  function toggleShortlist(id: string) {
    setShortlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

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
            <div className="flex flex-col gap-2 sm:gap-3 p-2 sm:p-4">
              <p className="text-white tracking-light text-2xl sm:text-[28px] lg:text-[32px] font-bold leading-tight">
                Player Database
              </p>
              <p className="text-[#92adc9] text-xs sm:text-sm font-normal leading-normal">
                Search and discover talented players
              </p>
            </div>

            <div className="px-2 sm:px-4 py-2 sm:py-3 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="flex flex-1 items-center rounded-lg border border-[#324d67] bg-[#192633] px-3 sm:px-4">
                <span className="text-[#92adc9] mr-2 sm:mr-3 shrink-0"><MagnifyingGlassIcon size={18} /></span>
                <input
                  type="text"
                  placeholder="Search players..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 min-w-0 bg-transparent text-white text-sm sm:text-base placeholder:text-[#92adc9] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
                <select
                  className="h-10 px-2 sm:px-3 text-xs sm:text-sm rounded-lg border border-[#324d67] bg-[#192633] text-white"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                >
                  <option value="">All Positions</option>
                  <option>Forward</option>
                  <option>Midfielder</option>
                  <option>Defender</option>
                  <option>Goalkeeper</option>
                </select>
                <select
                  className="h-10 px-2 sm:px-3 text-xs sm:text-sm rounded-lg border border-[#324d67] bg-[#192633] text-white"
                  value={contract}
                  onChange={(e) => setContract(e.target.value)}
                >
                  <option value="">Any Status</option>
                  <option>Available</option>
                  <option>Under Contract</option>
                </select>
                <input
                  type="number"
                  placeholder="Max Age"
                  value={ageMax as any}
                  onChange={(e) => setAgeMax(e.target.value ? Number(e.target.value) : "")}
                  className="h-10 w-full sm:w-28 px-2 sm:px-3 text-xs sm:text-sm rounded-lg border border-[#324d67] bg-[#192633] text-white placeholder:text-[#92adc9]"
                />
                <Button variant="secondary" size="sm" className="text-xs sm:text-sm" onClick={() => { setQuery(""); setPosition(""); setContract(""); setAgeMax(""); }}>Reset</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-2 sm:p-4">
              {loading ? (
                <div className="col-span-full text-[#92adc9] text-sm">Loading players...</div>
              ) : filtered.length === 0 ? (
                <div className="col-span-full text-[#92adc9] text-sm">No players found. Try adjusting your filters.</div>
              ) : (
                displayedPlayers.map((player, idx) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col gap-4 rounded-lg border border-[#324d67] p-4 hover:border-[#1172d4] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16"
                      style={{ backgroundImage: `url("${player.avatar}")` }}
                    />
                    <div className="flex-1">
                      <p className="text-white text-base font-bold leading-tight">
                        {player.name}
                      </p>
                      <p className="text-[#92adc9] text-sm font-normal leading-normal">
                        {player.position} • Age {player.age}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[#ffa500] text-sm">★</span>
                        <span className="text-white text-sm font-medium">{player.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#92adc9]">Club:</span>
                      <span className="text-white">{player.club}</span>
                    </div>
                    {player.stats.goals !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-[#92adc9]">Goals:</span>
                        <span className="text-white">{player.stats.goals}</span>
                      </div>
                    )}
                    {player.stats.assists !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-[#92adc9]">Assists:</span>
                        <span className="text-white">{player.stats.assists}</span>
                      </div>
                    )}
                    {player.stats.cleanSheets !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-[#92adc9]">Clean Sheets:</span>
                        <span className="text-white">{player.stats.cleanSheets}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        player.status === "Available"
                          ? "bg-[#0bda5b]/20 text-[#0bda5b]"
                          : "bg-[#324d67] text-[#92adc9]"
                      }`}
                    >
                      {player.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => router.push(`/portfolio/${player.id}`)}
                    >
                      View Profile
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="flex-1" 
                      onClick={() => toggleShortlist(player.id)}
                    >
                      {shortlist.includes(player.id) ? "Remove" : "Shortlist"}
                    </Button>
                  </div>
                </motion.div>
                ))
              )}
            </div>

            <div className="px-2 sm:px-4 py-2 sm:py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              {hasMore && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="text-xs sm:text-sm"
                  onClick={() => setDisplayLimit(prev => prev + 12)}
                >
                  Load More Players ({filtered.length - displayLimit} remaining)
                </Button>
              )}
              <div className="text-[#92adc9] text-xs sm:text-sm">
                Showing {displayedPlayers.length} of {filtered.length} players • Shortlisted: <span className="text-white font-semibold">{shortlist.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



