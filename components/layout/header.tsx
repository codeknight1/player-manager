"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";

interface HeaderProps {
  title?: string;
  logo?: React.ReactNode;
  navItems?: { label: string; href: string }[];
  rightAction?: React.ReactNode;
}

const playerNavItems = [
  { label: "Home", href: "/player/dashboard" },
  { label: "My Profile", href: "/player/profile" },
  { label: "Network", href: "/player/network" },
  { label: "Messages", href: "/player/messages" },
];

export function Header({ 
  title = "TalentVerse",
  logo,
  navItems = [],
  rightAction
}: HeaderProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const hideNav = pathname.startsWith("/player");
  const isPlayerPage = pathname.startsWith("/player");
  const isLoggedIn = !!session;
  
  const mobileNavItems = isPlayerPage && isLoggedIn ? playerNavItems : navItems;
  const showMobileMenu = mobileNavItems.length > 0;

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid px-4 sm:px-6 md:px-10 py-3 bg-[#4D148C] dark:bg-[#111a22] border-transparent dark:border-transparent transition-colors" style={{ borderBottomColor: "var(--brand-orange)" }}>
      <div className="flex items-center gap-4 text-white">
        {logo || (
          <div className="size-4">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="20" fill="var(--brand-purple)" stroke="var(--brand-orange)" strokeWidth="2"></circle>
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="var(--brand-orange)"></path>
            </svg>
          </div>
        )}
        {title ? (
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            {title}
          </h2>
        ) : null}
      </div>
      <div className="flex flex-1 justify-end items-center gap-2 sm:gap-4">
        {!hideNav && navItems.length > 0 && (
          <div className="hidden md:flex items-center gap-9">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[#FFCC00] text-sm font-medium leading-normal hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
        <div className="flex items-center gap-1">
          {showMobileMenu && <MobileMenu navItems={mobileNavItems} />}
          <ThemeToggle />
          <NotificationDropdown />
        </div>
        {rightAction}
      </div>
    </header>
  );
}



