"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  title?: string;
  logo?: React.ReactNode;
  navItems?: { label: string; href: string }[];
  rightAction?: React.ReactNode;
}

export function Header({ 
  title = "TalentVerse",
  logo,
  navItems = [],
  rightAction
}: HeaderProps) {
  const pathname = usePathname();
  const hideNav = pathname.startsWith("/player");
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid px-10 py-3" style={{ borderBottomColor: "var(--brand-orange)" }}>
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
      <div className="flex flex-1 justify-end gap-8">
        {!hideNav && navItems.length > 0 && (
          <div className="hidden md:flex items-center gap-9">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white text-sm font-medium leading-normal hover:text-[#1172d4] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
        {rightAction}
      </div>
    </header>
  );
}



