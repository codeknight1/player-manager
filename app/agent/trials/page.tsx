"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { HouseIcon, UserIcon, MagnifyingGlassIcon, ChatIcon, GearIcon, TrophyIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { label: "Home", href: "/agent/dashboard", icon: <HouseIcon size={24} weight="fill" /> },
  { label: "Players", href: "/agent/players", icon: <UserIcon size={24} /> },
  { label: "Scouts", href: "/agent/scouts", icon: <MagnifyingGlassIcon size={24} /> },
  { label: "Messages", href: "/agent/messages", icon: <ChatIcon size={24} /> },
  { label: "Settings", href: "/agent/settings", icon: <GearIcon size={24} /> },
  { label: "Trials", href: "/agent/trials", icon: <TrophyIcon size={24} /> },
];

type Trial = { id: number; title: string; city: string; date: string; status?: "registered" | "invited" };
const MOCK: Trial[] = [
  { id: 1, title: "U21 Regional Showcase", city: "Lagos", date: "Nov 20" },
  { id: 2, title: "Elite Scouting Combine", city: "Accra", date: "Dec 3" },
  { id: 3, title: "Pro Trial Day", city: "Nairobi", date: "Dec 10" },
];

export default function AgentTrialsPage() {
  const [trials, setTrials] = useState<Trial[]>(MOCK);
  const [invites, setInvites] = useState<Record<number, number>>({}); // trialId -> invited count

  useEffect(() => {
    const s1 = localStorage.getItem("agent_trials");
    const s2 = localStorage.getItem("agent_invites");
    if (s1) setTrials(JSON.parse(s1));
    if (s2) setInvites(JSON.parse(s2));
  }, []);
  useEffect(() => { localStorage.setItem("agent_trials", JSON.stringify(trials)); }, [trials]);
  useEffect(() => { localStorage.setItem("agent_invites", JSON.stringify(invites)); }, [invites]);

  function register(id: number) {
    setTrials(prev => prev.map(t => t.id === id ? { ...t, status: "registered" } : t));
  }
  function sendInvite(id: number) {
    setInvites(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setTrials(prev => prev.map(t => t.id === id ? { ...t, status: t.status || "invited" } : t));
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-2 sm:px-4 lg:px-6 flex flex-1 justify-center py-3 sm:py-5">
          <Sidebar title="ScoutHub" subtitle="Club" items={sidebarItems} />
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 w-full">
            <div className="flex flex-col gap-2 sm:gap-3 p-2 sm:p-4">
              <p className="text-white tracking-light text-2xl sm:text-[28px] lg:text-[32px] font-bold leading-tight">Trials & Tournaments</p>
              <p className="text-[#92adc9] text-xs sm:text-sm">Register and send invites to players</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-2 sm:p-4">
              {trials.map(t => (
                <div key={t.id} className="rounded-lg border border-[#324d67] p-3 sm:p-5 bg-[#192633]">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-2">
                    <p className="text-white text-base sm:text-lg font-semibold">{t.title}</p>
                    <span className="text-xs text-[#92adc9]">{t.city} • {t.date}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {t.status && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${t.status === "registered" ? "bg-[#0bda5b]/20 text-[#0bda5b]" : "bg-[#1172d4]/20 text-[#1172d4]"}`}>
                        {t.status}
                      </span>
                    )}
                    {invites[t.id] ? (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-[#324d67] text-white">Invites: {invites[t.id]}</span>
                    ) : null}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button size="sm" className="text-xs sm:text-sm w-full sm:w-auto" onClick={() => register(t.id)} disabled={t.status === "registered"}>Register</Button>
                    <Button variant="secondary" size="sm" className="text-xs sm:text-sm w-full sm:w-auto" onClick={() => sendInvite(t.id)}>Send Invite</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


