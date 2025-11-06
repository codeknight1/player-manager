"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiGet, apiPatch } from "@/app/lib/api";

function formatTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [session]);

  async function loadNotifications() {
    try {
      const list = await apiGet(`notifications?userId=${(session?.user as any)?.id}`);
      setNotifications(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function markRead(id: string) {
    try {
      await apiPatch("notifications", { id, read: true });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <div className="px-8 py-10 text-[#92adc9]">Loading...</div>;
  if (!session) return <div className="px-8 py-10 text-[#92adc9]">Please log in</div>;

  return (
    <div className="relative flex h-auto w-full flex-col px-8 py-10">
      <h1 className="text-white text-3xl font-bold mb-6">Notifications</h1>
      <div className="flex flex-col gap-3">
        {notifications.length === 0 ? (
          <div className="text-[#92adc9]">No notifications yet</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className="rounded-xl border border-[#233648] bg-[#0f1620] p-4 flex items-center justify-between cursor-pointer hover:bg-[#192633] transition-colors"
            >
              <div className="flex items-center gap-3">
                {!n.read && <div className="size-3 rounded-full bg-[#1172d4]"></div>}
                <p className={`text-sm font-medium ${n.read ? "text-[#92adc9]" : "text-white"}`}>{n.title}</p>
              </div>
              <span className="text-[#92adc9] text-xs">{formatTime(n.createdAt)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


