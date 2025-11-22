"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Sidebar } from "@/components/layout/sidebar";
import { HouseIcon, TrophyIcon, UserIcon, HandshakeIcon, UsersThreeIcon, ChartBarIcon } from "@/components/icons";
import { apiGet } from "@/app/lib/api";

const sidebarItems = [
  { label: "Dashboard", href: "/academy/dashboard", icon: <HouseIcon size={24} weight="fill" /> },
  { label: "Tournaments", href: "/academy/tournaments", icon: <TrophyIcon size={24} /> },
  { label: "Players", href: "/academy/players", icon: <UserIcon size={24} /> },
  { label: "Partnerships", href: "/academy/partnerships", icon: <HandshakeIcon size={24} /> },
  { label: "Squads", href: "/academy/squads", icon: <UsersThreeIcon size={24} /> },
  { label: "Analytics", href: "/academy/analytics", icon: <ChartBarIcon size={24} /> },
];

const exposure = [
  { label: "Mon", views: 20, interests: 2 },
  { label: "Tue", views: 32, interests: 3 },
  { label: "Wed", views: 45, interests: 5 },
  { label: "Thu", views: 40, interests: 4 },
  { label: "Fri", views: 60, interests: 7 },
  { label: "Sat", views: 75, interests: 9 },
  { label: "Sun", views: 52, interests: 6 },
];

export default function AcademyAnalyticsPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ views: 0, interests: 0, applications: 0 });
  const [recentInterests, setRecentInterests] = useState<any[]>([]);

  useEffect(() => {
    const userId = (session?.user as any)?.id;
    if (userId) {
      loadAnalytics();
      const interval = setInterval(loadAnalytics, 30000);
      return () => clearInterval(interval);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  async function loadAnalytics() {
    try {
      const apps = await apiGet("applications");
      const interests = apps.filter((a: any) => a.status === "ACCEPTED" || a.status === "PENDING").length;
      const recent = apps.slice(0, 3).map((a: any) => ({
        player: a.user?.name || "Unknown",
        trial: a.trial?.title || "Trial",
        when: formatTime(new Date(a.createdAt)),
      }));
      setStats({ views: apps.length * 2, interests, applications: apps.length });
      setRecentInterests(recent);
    } catch (err) {
      console.error(err);
    }
  }

  function formatTime(date: Date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  }

  const totals = useMemo(() => ({
    views: stats.views,
    interests: stats.interests,
    topDay: "Today",
  }), [stats]);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <Sidebar title="ProConnect" subtitle="Analytics" items={sidebarItems} />
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-white tracking-light text-[32px] font-bold leading-tight">Analytics</p>
                <p className="text-[#92adc9] text-sm">Exposure overview for your academy players</p>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border border-[#324d67] bg-[#192633] p-4">
                <p className="text-[#92adc9] text-sm">Scout Views (7d)</p>
                <p className="text-white text-3xl font-bold">{totals.views}</p>
              </div>
              <div className="rounded-lg border border-[#324d67] bg-[#192633] p-4">
                <p className="text-[#92adc9] text-sm">Trial Interests (7d)</p>
                <p className="text-white text-3xl font-bold">{totals.interests}</p>
              </div>
              <div className="rounded-lg border border-[#324d67] bg-[#192633] p-4">
                <p className="text-[#92adc9] text-sm">Peak Day</p>
                <p className="text-white text-3xl font-bold">{totals.topDay}</p>
              </div>
            </div>

            <div className="p-4">
              <div className="rounded-lg border border-[#324d67] bg-[#192633] p-4">
                <p className="text-white font-semibold mb-3">Exposure (mock chart)</p>
                <div className="grid grid-cols-7 gap-2 items-end h-40">
                  {exposure.map((d) => (
                    <div key={d.label} className="flex flex-col items-center gap-1">
                      <div className="w-6 bg-[#1172d4]" style={{ height: `${d.views}%` }} />
                      <span className="text-[#92adc9] text-xs">{d.label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[#92adc9] text-xs mt-2">Bars scale to mock values; replace with real charts later.</p>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-[#324d67] bg-[#192633] p-4">
                <p className="text-white font-semibold mb-2">Top Players (views)</p>
                {[
                  { name: "Alex Johnson", views: 120 },
                  { name: "Sarah Williams", views: 98 },
                  { name: "Michael Brown", views: 80 },
                ].map((p) => (
                  <div key={p.name} className="flex justify-between border-b border-[#324d67] py-2">
                    <span className="text-white text-sm">{p.name}</span>
                    <span className="text-[#92adc9] text-sm">{p.views}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-[#324d67] bg-[#192633] p-4">
                <p className="text-white font-semibold mb-2">Recent Interests</p>
                {recentInterests.length === 0 ? (
                  <div className="text-[#92adc9] text-sm py-2">No recent interests yet</div>
                ) : (
                  recentInterests.map((r, i) => (
                    <div key={i} className="flex justify-between border-b border-[#324d67] py-2">
                      <span className="text-white text-sm">{r.player} • {r.trial}</span>
                      <span className="text-[#92adc9] text-sm">{r.when}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


