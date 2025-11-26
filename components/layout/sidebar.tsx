"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  title?: string;
  subtitle?: string;
  items: SidebarItem[];
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export function Sidebar({ title, subtitle, items, user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="layout-content-container hidden lg:flex flex-col w-80">
      <div className="flex h-full min-h-[700px] flex-col justify-between bg-[#111a22] p-4">
        <div className="flex flex-col gap-4">
          {user && (
            <div className="flex gap-3">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={
                  user.avatar
                    ? { backgroundImage: `url("${user.avatar}")` }
                    : {}
                }
              ></div>
              <div className="flex flex-col">
                <h1 className="text-white text-base font-medium leading-normal">
                  {user.name}
                </h1>
                <p className="text-[#92adc9] text-sm font-normal leading-normal">
                  {user.role}
                </p>
              </div>
            </div>
          )}
          {title && (
            <div className="flex flex-col">
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
                >
                  <div className="text-white">{item.icon}</div>
                  <p className="text-white text-sm font-medium leading-normal">
                    {item.label}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}



