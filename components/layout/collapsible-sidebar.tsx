"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";

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
}

export function CollapsibleSidebar({ 
  title, 
  subtitle, 
  items, 
  user,
  defaultCollapsed = false 
}: CollapsibleSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarWidth = isCollapsed ? "w-20" : "w-80";

  return (
    <div className={`layout-content-container flex flex-col ${sidebarWidth} transition-all duration-300`}>
      <div className="flex h-full min-h-[700px] flex-col justify-between bg-[#111a22] p-4">
        <div className="flex flex-col gap-4">
          {user && (
            <motion.div 
              className="flex gap-3 items-center"
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
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col overflow-hidden"
                  >
                    <h1 className="text-white text-base font-medium leading-normal truncate">
                      {user.name}
                    </h1>
                    <p className="text-[#92adc9] text-sm font-normal leading-normal truncate">
                      {user.role}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
          
          {title && (
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col overflow-hidden"
                >
                  <h1 className="text-white text-base font-medium leading-normal">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-[#92adc9] text-sm font-normal leading-normal">
                      {subtitle}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
          
          <div className="flex flex-col gap-2">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-[#233648]"
                      : "hover:bg-[#192633]"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="text-white shrink-0">{item.icon}</div>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.p
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-white text-sm font-medium leading-normal truncate"
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
        
        <button
          onClick={toggleCollapse}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#192633] hover:bg-[#233648] transition-colors text-white"
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
            className={clsx("transition-transform duration-300", isCollapsed ? "" : "rotate-180")}
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

