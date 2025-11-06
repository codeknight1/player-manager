import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/header";
import { Providers } from "@/components/providers";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Image from "next/image";

export const metadata: Metadata = {
  title: "PPM - Professional Player Management",
  description: "Complete platform for players, agents, clubs, and academies",
  openGraph: {
    title: "PPM - Professional Player Management",
    description: "Complete platform for players, agents, clubs, and academies",
    type: "website",
    url: "https://ppm.example.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "PPM - Professional Player Management",
    description: "Complete platform for players, agents, clubs, and academies",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#111a22",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <ErrorBoundary>
            <div className="layout-container flex h-full min-h-screen flex-col bg-[#111a22]">
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
                  <a
                    href="/player/login"
                    className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-[#233648] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                  >
                    Log In
                  </a>
                }
              />
              <main className="flex-1">
                {children}
              </main>
            </div>
            <Toaster position="top-right" richColors />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}



