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

  return (
    <div className={`layout-content-container flex flex-col ${sidebarWidth} transition-all duration-300`}>
      <div className="flex h-full min-h-[700px] flex-col justify-between bg-[#111a22] p-4">
        <div className="flex flex-col gap-3">
          <button
            onClick={toggleCollapse}
            className="flex items-center justify-center rounded-xl border border-[#233648] bg-[#192633] p-3 text-white hover:border-[#1172d4] hover:bg-[#1f2c3a] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3.5" y="4.5" width="17" height="15" rx="5" />
              <line x1="12" y1="6.5" x2="12" y2="17" />
            </svg>
          </button>

          {user && !isCollapsed && (
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
              <div className="flex flex-col overflow-hidden">
                <h1 className="text-white text-base font-medium leading-normal truncate">
                  {user.name}
                </h1>
                <p className="text-[#92adc9] text-sm font-normal leading-normal truncate">
                  {user.role}
                </p>
              </div>
            </motion.div>
          )}

          {title && !isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <h1 className="text-white text-base font-medium leading-normal">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[#92adc9] text-sm font-normal leading-normal">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            {!isCollapsed && items.map((item) => {
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
        
        {showToggle && (
          <div className="flex items-center justify-center">
            <button
              onClick={toggleCollapse}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-[#192633] hover:bg-[#233648] transition-colors text-white border-0 focus:outline-none focus:ring-0"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
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
        )}
      </div>
    </div>
  );
}

