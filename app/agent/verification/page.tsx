"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { HouseIcon, UserIcon, MagnifyingGlassIcon, ChatIcon, GearIcon, ShieldCheckIcon, PaperclipIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { label: "Home", href: "/agent/dashboard", icon: <HouseIcon size={24} weight="fill" /> },
  { label: "Players", href: "/agent/players", icon: <UserIcon size={24} /> },
  { label: "Scouts", href: "/agent/scouts", icon: <MagnifyingGlassIcon size={24} /> },
  { label: "Messages", href: "/agent/messages", icon: <ChatIcon size={24} /> },
  { label: "Settings", href: "/agent/settings", icon: <GearIcon size={24} /> },
  { label: "Verification", href: "/agent/verification", icon: <ShieldCheckIcon size={24} /> },
];

type Doc = { id: string; name: string; type: string; status: "pending" | "approved" | "rejected" };

export default function AgentVerificationPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("Certificate of Incorporation");

  useEffect(() => {
    const saved = localStorage.getItem("agent_docs");
    if (saved) setDocs(JSON.parse(saved));
  }, []);
  useEffect(() => { localStorage.setItem("agent_docs", JSON.stringify(docs)); }, [docs]);

  function addDoc() {
    const id = Math.random().toString(36).slice(2, 9);
    setDocs(prev => [{ id, name: name || type, type, status: "pending" }, ...prev]);
    setName("");
  }

  function removeDoc(id: string) {
    setDocs(prev => prev.filter(d => d.id !== id));
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <Sidebar title="ScoutHub" subtitle="Verification" items={sidebarItems} />
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-white tracking-light text-[32px] font-bold leading-tight">Verification</p>
                <p className="text-[#92adc9] text-sm">Upload documents to verify your agency or scout identity</p>
              </div>
            </div>

            <div className="p-4">
              <div className="rounded-lg border border-[#324d67] bg-[#192633] p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="col-span-2 flex items-center gap-2">
                    <PaperclipIcon className="text-[#92adc9]" />
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Document name (optional)"
                      className="flex-1 bg-[#111a22] border border-[#324d67] rounded-lg px-3 py-2 text-white placeholder:text-[#92adc9] focus:outline-none focus:border-[#1172d4]"
                    />
                  </div>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="h-10 px-3 rounded-lg border border-[#324d67] bg-[#111a22] text-white"
                  >
                    <option>Certificate of Incorporation</option>
                    <option>Government ID</option>
                    <option>Agency License</option>
                    <option>Proof of Address</option>
                  </select>
                </div>
                <div className="flex justify-end mt-3">
                  <Button onClick={addDoc}>Upload</Button>
                </div>
              </div>

              <div className="flex overflow-hidden rounded-lg border border-[#324d67] bg-[#111a22]">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-[#192633]">
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Name</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Type</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map((d) => (
                      <tr key={d.id} className="border-t border-t[#324d67]">
                        <td className="px-4 py-3 text-white text-sm">{d.name}</td>
                        <td className="px-4 py-3 text-[#92adc9] text-sm">{d.type}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${d.status === "approved" ? "bg-[#0bda5b]/20 text-[#0bda5b]" : d.status === "rejected" ? "bg-[#ef4444]/20 text-[#ef4444]" : "bg-[#324d67] text-[#92adc9]"}`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button variant="secondary" size="sm">View</Button>
                            <Button variant="outline" size="sm" onClick={() => removeDoc(d.id)}>Remove</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
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


