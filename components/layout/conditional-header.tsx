"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Header } from "./header";
import Image from "next/image";

export function ConditionalHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isHomePage = pathname === "/";

  if (isHomePage) {
    return null;
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
            className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-[#233648] text-white text-sm font-bold leading-normal tracking-[0.015em]"
          >
            Log In
          </a>
        ) : null
      }
    />
  );
}

