"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { LogoutButton } from "@/components/auth/logout-button";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface CollapsibleSidebarProps {
  title?: string;
  subtitle?: string;
  items: SidebarItem[];
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
  defaultCollapsed?: boolean;
  showToggle?: boolean;
}

export function CollapsibleSidebar({ 
  title, 
  subtitle, 
  items, 
  user,
  defaultCollapsed = false,
  showToggle = true
}: CollapsibleSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarWidth = isCollapsed ? "w-16 sm:w-20" : "w-full sm:w-80";

  const sidebarContent = (
    <div className="flex h-full min-h-[700px] flex-col justify-between bg-white dark:bg-[#111a22] p-4 transition-colors border-r border-gray-200 dark:border-gray-800">
      <div className="flex flex-col gap-3">
        {showToggle && (
          <button
            onClick={toggleCollapse}
            className="flex items-center justify-center rounded-lg p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
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
              className={clsx("transition-transform duration-300", isCollapsed ? "rotate-180" : "")}
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        <AnimatePresence mode="wait">
          {user && (
            <motion.div 
              className={clsx("flex items-center", isCollapsed ? "justify-center" : "gap-3")}
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0"
                style={
                  user.avatar
                    ? { backgroundImage: `url("${user.avatar}")` }
                    : { backgroundColor: "#192633" }
                }
              />
              {!isCollapsed && (
                <motion.div 
                  className="flex flex-col overflow-hidden"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-gray-900 dark:text-white text-base font-medium leading-normal truncate">
                    {user.name}
                  </h1>
                  <p className="text-gray-600 dark:text-[#92adc9] text-sm font-normal leading-normal truncate">
                    {user.role}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {title && !isCollapsed && (
            <motion.div 
              className="flex flex-col overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-gray-900 dark:text-white text-base font-medium leading-normal">
                {title}
              </h1>
              {subtitle && (
                <p className="text-gray-600 dark:text-[#92adc9] text-sm font-normal leading-normal">
                  {subtitle}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center rounded-lg transition-all duration-200",
                  isCollapsed ? "justify-center px-2 py-2" : "gap-3 px-3 py-2",
                  isActive
                    ? "bg-[#4D148C]/10 dark:bg-[#233648] border-l-4 border-[#4D148C]"
                    : "hover:bg-gray-100 dark:hover:bg-[#192633]"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="text-gray-700 dark:text-white shrink-0 flex items-center justify-center">
                  {item.icon}
                </div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.p
                      initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                      animate={{ opacity: 1, width: "auto", marginLeft: "0.75rem" }}
                      exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="text-gray-900 dark:text-white text-sm font-medium leading-normal truncate whitespace-nowrap"
                    >
                      {item.label}
                    </motion.p>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <LogoutButton />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <div className={`layout-content-container hidden lg:flex flex-col transition-all duration-300 ease-in-out ${sidebarWidth}`}>
      {sidebarContent}
    </div>
  );
}

