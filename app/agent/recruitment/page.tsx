"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { HouseIcon, UserIcon, MagnifyingGlassIcon, ChatIcon, GearIcon, ListChecksIcon } from "@/components/icons";

const sidebarItems = [
  { label: "Home", href: "/agent/dashboard", icon: <HouseIcon size={24} weight="fill" /> },
  { label: "Players", href: "/agent/players", icon: <UserIcon size={24} /> },
  { label: "Scouts", href: "/agent/scouts", icon: <MagnifyingGlassIcon size={24} /> },
  { label: "Messages", href: "/agent/messages", icon: <ChatIcon size={24} /> },
  { label: "Settings", href: "/agent/settings", icon: <GearIcon size={24} /> },
  { label: "Recruitment", href: "/agent/recruitment", icon: <ListChecksIcon size={24} /> },
];

type Card = { id: string; name: string; position: string };
type ColumnKey = "discovered" | "contacted" | "invited" | "trial" | "signed";
type Board = Record<ColumnKey, Card[]>;

const initial: Board = {
  discovered: [
    { id: "p1", name: "Ethan Carter", position: "Forward" },
    { id: "p2", name: "Noah Bennett", position: "Defender" },
  ],
  contacted: [
    { id: "p3", name: "Liam Harper", position: "Midfielder" },
  ],
  invited: [],
  trial: [],
  signed: [],
};

export default function AgentRecruitmentPage() {
  const [board, setBoard] = useState<Board>(initial);

  useEffect(() => {
    const saved = localStorage.getItem("agent_board");
    if (saved) setBoard(JSON.parse(saved));
  }, []);
  useEffect(() => { localStorage.setItem("agent_board", JSON.stringify(board)); }, [board]);

  function move(id: string, from: ColumnKey, to: ColumnKey) {
    if (from === to) return;
    setBoard(prev => {
      const source = prev[from].filter(c => c.id !== id);
      const card = prev[from].find(c => c.id === id)!;
      const target = [...prev[to], card];
      return { ...prev, [from]: source, [to]: target };
    });
  }

  const columns: { key: ColumnKey; title: string }[] = [
    { key: "discovered", title: "Discovered" },
    { key: "contacted", title: "Contacted" },
    { key: "invited", title: "Invited" },
    { key: "trial", title: "Trial" },
    { key: "signed", title: "Signed" },
  ];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <Sidebar title="ScoutHub" subtitle="Recruitment" items={sidebarItems} />
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-white tracking-light text-[32px] font-bold leading-tight">Recruitment Funnel</p>
                <p className="text-[#92adc9] text-sm">Track prospects from discovery to signing</p>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
              {columns.map(col => (
                <div key={col.key} className="rounded-lg border border-[#324d67] bg-[#192633] p-3 min-h-[300px]">
                  <p className="text-white font-semibold mb-3">{col.title}</p>
                  <div className="flex flex-col gap-2">
                    {board[col.key].map(card => (
                      <div key={card.id} className="rounded border border-[#233648] bg-[#111a22] p-3">
                        <p className="text-white text-sm font-medium">{card.name}</p>
                        <p className="text-[#92adc9] text-xs mb-2">{card.position}</p>
                        <div className="flex gap-2 flex-wrap">
                          {columns.map(dest => (
                            <button
                              key={dest.key}
                              disabled={dest.key === col.key}
                              onClick={() => move(card.id, col.key, dest.key)}
                              className={`text-xs px-2 py-1 rounded border ${dest.key === col.key ? "opacity-40 cursor-default" : "hover:bg-[#233648]"} border-[#324d67] text-white`}
                            >
                              {dest.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
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


