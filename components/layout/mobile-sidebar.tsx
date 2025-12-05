"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { clsx } from "clsx";
import { LogoutButton } from "@/components/auth/logout-button";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface MobileSidebarProps {
  title?: string;
  items: SidebarItem[];
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ title, items, user, isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    onClose();
  }, [pathname]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            ref={sidebarRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-[#111a22] z-50 lg:hidden shadow-2xl overflow-y-auto border-r border-[#FFCC00]"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-[#FFCC00] bg-[#4D148C]">
                {title && <h2 className="text-white text-lg font-bold">{title}</h2>}
                <button
                  onClick={onClose}
                  className="flex items-center justify-center rounded-lg p-2 text-white hover:bg-[#192633] transition-colors"
                  aria-label="Close sidebar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col gap-3 p-4">
                {user && (
                  <div className="flex gap-3 items-center pb-4 border-b border-[#FFCC00]">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0"
                      style={
                        user.avatar
                          ? { backgroundImage: `url("${user.avatar}")` }
                          : { backgroundColor: "#192633" }
                      }
                    />
                    <div className="flex flex-col overflow-hidden">
                      <h1 className="text-gray-900 dark:text-white text-base font-medium leading-normal truncate">
                        {user.name}
                      </h1>
                      <p className="text-gray-600 dark:text-[#92adc9] text-sm font-normal leading-normal truncate">
                        {user.role}
                      </p>
                    </div>
                  </div>
                )}

                {title && (
                  <div className="flex flex-col overflow-hidden pb-4 border-b border-[#FFCC00]">
                    <h1 className="text-gray-900 dark:text-white text-base font-medium leading-normal">
                      {title}
                    </h1>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={clsx(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                          isActive
                            ? "bg-[#4D148C]/10 dark:bg-[#233648] border-l-4 border-[#4D148C]"
                            : "hover:bg-gray-100 dark:hover:bg-[#192633]"
                        )}
                      >
                        <div className="text-gray-700 dark:text-white shrink-0">{item.icon}</div>
                        <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal">
                          {item.label}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-auto p-4 border-t border-[#FFCC00]">
                <LogoutButton />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


