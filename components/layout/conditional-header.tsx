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
  const isAgentPage = pathname.startsWith("/agent");
  const isAdminPage = pathname.startsWith("/admin");
  const isAcademyPage = pathname.startsWith("/academy");
  const isAuthenticatedPage = isPlayerPage || isAgentPage || isAdminPage || isAcademyPage;

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

  if (isAgentPage && session) {
    return (
      <Header
        title=""
        logo={
          <Image src="/PPM LOGO.png" alt="PPM" width={120} height={28} priority />
        }
      />
    );
  }

  // Don't show nav items for authenticated pages (admin, academy)
  if (isAuthenticatedPage) {
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
    />
  );
}

