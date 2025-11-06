"use client";

import { useMemo, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { HouseIcon, UserIcon, UsersThreeIcon, ChatIcon, BellIcon, CreditCardIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { label: "Home", href: "/player/dashboard", icon: <HouseIcon size={24} weight="fill" /> },
  { label: "My Profile", href: "/player/profile", icon: <UserIcon size={24} /> },
  { label: "Network", href: "/player/network", icon: <UsersThreeIcon size={24} /> },
  { label: "Messages", href: "/player/messages", icon: <ChatIcon size={24} /> },
  { label: "Notifications", href: "/notifications", icon: <BellIcon size={24} /> },
  { label: "Payments", href: "/player/payments", icon: <CreditCardIcon size={24} /> },
];

type Invoice = {
  id: string;
  title: string;
  amount: number;
  currency: string;
  status: "due" | "paid" | "processing";
  createdAt: string;
};

const seed: Invoice[] = [
  { id: "INV-1024", title: "Trial Registration - Lagos Showcase", amount: 50, currency: "USD", status: "due", createdAt: "2025-10-20" },
  { id: "INV-1025", title: "Tournament Fee - U21 Cup", amount: 25, currency: "USD", status: "paid", createdAt: "2025-09-15" },
  { id: "INV-1026", title: "Profile Verification", amount: 10, currency: "USD", status: "processing", createdAt: "2025-10-28" },
];

export default function PlayerPaymentsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(seed);
  const totals = useMemo(() => ({
    due: invoices.filter(i => i.status === "due").reduce((s, i) => s + i.amount, 0),
    paid: invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0),
  }), [invoices]);

  function mockPay(id: string) {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: "processing" } : i));
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <Sidebar
            title="TalentVerse"
            subtitle="Player"
            user={{ name: "Sophia Carter", role: "Player" }}
            items={sidebarItems}
          />
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-white tracking-light text-[32px] font-bold leading-tight">Payments</p>
                <p className="text-[#92adc9] text-sm">Manage fees for trials and registrations</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="rounded-lg border border-[#324d67] bg-[#192633] px-3 py-2 text-white">Due: ${totals.due.toFixed(2)}</div>
                <div className="rounded-lg border border-[#324d67] bg-[#192633] px-3 py-2 text-white">Paid: ${totals.paid.toFixed(2)}</div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex overflow-hidden rounded-lg border border-[#324d67] bg-[#111a22]">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-[#192633]">
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Invoice</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Title</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Amount</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="border-t border-t[#324d67]">
                        <td className="px-4 py-3 text-[#92adc9] text-sm">{inv.id}</td>
                        <td className="px-4 py-3 text-white text-sm">{inv.title}</td>
                        <td className="px-4 py-3 text-white text-sm">{inv.currency} {inv.amount.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${inv.status === "paid" ? "bg-[#0bda5b]/20 text-[#0bda5b]" : inv.status === "processing" ? "bg-[#ffa500]/20 text-[#ffa500]" : "bg-[#324d67] text-[#92adc9]"}`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button variant="secondary" size="sm">View</Button>
                            <Button size="sm" disabled={inv.status !== "due"} onClick={() => mockPay(inv.id)}>
                              Pay
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


