import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { ConditionalHeader } from "@/components/layout/conditional-header";
import { Providers } from "@/components/providers";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.classList.add(theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <Providers>
          <ErrorBoundary>
            <div className="layout-container flex h-full min-h-screen flex-col">
              <ConditionalHeader />
              <main className="flex-1 bg-white dark:bg-[#111a22] transition-colors">
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



