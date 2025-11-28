"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { BellIcon } from "@/components/icons";
import { apiGet, apiPatch } from "@/app/lib/api";

function formatTime(date: Date | string) {
  const now = new Date();
  const notificationDate = typeof date === "string" ? new Date(date) : date;
  const diff = now.getTime() - notificationDate.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationDropdown() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session && isOpen) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [session, isOpen]);

  useEffect(() => {
    if (session) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [session]);

  useEffect(() => {
    const unread = notifications.filter((n) => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  async function loadNotifications() {
    try {
      const userId = (session?.user as any)?.id;
      if (!userId) return;
      setLoading(true);
      const list = await apiGet(`notifications?userId=${userId}`);
      setNotifications(list || []);
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

  if (!session) return null;

  const recentNotifications = notifications.slice(0, 5);
  const hasUnread = unreadCount > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center rounded-lg p-2 text-white hover:bg-white/20 dark:hover:bg-[#192633] transition-colors"
        aria-label="Notifications"
      >
        <BellIcon size={24} />
        {hasUnread && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 dark:bg-[#1172d4] text-white text-[10px] font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-80 max-w-[90vw] bg-white dark:bg-[#111a22] border border-[#FFCC00] rounded-xl shadow-2xl z-50 overflow-hidden transition-colors"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#FFCC00] bg-[#4D148C] transition-colors">
                <h3 className="text-white text-lg font-bold">Notifications</h3>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-600 dark:text-[#92adc9] text-sm">Loading...</div>
                ) : recentNotifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-600 dark:text-[#92adc9] text-sm">No notifications yet</div>
                ) : (
                  recentNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => markRead(notification.id)}
                      className="flex items-start gap-3 p-4 border-b border-[#FFCC00] hover:bg-gray-50 dark:hover:bg-[#192633] transition-colors cursor-pointer"
                    >
                      <div className="relative shrink-0">
                        {!notification.read && (
                          <div className="absolute -top-1 -right-1 size-2 rounded-full bg-blue-600 dark:bg-[#1172d4]"></div>
                        )}
                        <div className="flex items-center justify-center size-10 rounded-lg bg-gray-100 dark:bg-[#233648] text-gray-700 dark:text-white transition-colors">
                          <BellIcon size={20} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium leading-tight mb-1 ${notification.read ? "text-gray-600 dark:text-[#92adc9]" : "text-gray-900 dark:text-white"}`}>
                          {notification.title}
                        </p>
                        {notification.body && (
                          <p className="text-gray-600 dark:text-[#92adc9] text-xs leading-relaxed line-clamp-2">
                            {notification.body}
                          </p>
                        )}
                        <span className="text-gray-500 dark:text-[#6d859f] text-[10px] mt-1 block">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

