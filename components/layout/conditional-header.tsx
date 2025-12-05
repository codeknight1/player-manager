"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Header } from "./header";
import Image from "next/image";

export function ConditionalHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isHomePage = pathname === "/";
  const isPlayerPage = pathname.startsWith("/player") && session;

  if (isHomePage) {
    return null;
  }

  if (isPlayerPage) {
    return (
      <Header
        title=""
        logo={
          <Image src="/PPM LOGO.png" alt="PPM" width={120} height={28} priority />
        }
      />
    );
  }

  return (
    <Header
      title=""
      logo={
        <Image src="/PPM LOGO.png" alt="PPM" width={120} height={28} priority />
      }
      navItems={[
        { label: "For Players", href: "/for-players" },
        { label: "For Clubs/Agents", href: "/for-clubs" },
        { label: "For Partners/Academies", href: "/for-partners" },
      ]}
      rightAction={
        !session ? (
          <a
            href="/player/login"
            className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-[#FFCC00] text-[#4D148C] text-sm font-bold leading-normal tracking-[0.015em] hover:brightness-110 transition-colors"
          >
            Log In
          </a>
        ) : null
      }
    />
  );
}

