"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Sidebar } from "@/components/layout/sidebar";
import { HouseIcon, UserIcon, UsersThreeIcon, ChatIcon, BellIcon, CreditCardIcon, EyeIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { apiGet, apiPatch } from "@/app/lib/api";
import { toast } from "sonner";

const sidebarItems = [
  { label: "Home", href: "/player/dashboard", icon: <HouseIcon size={24} weight="fill" /> },
  { label: "My Profile", href: "/player/profile", icon: <UserIcon size={24} /> },
  { label: "Trials", href: "/explore-opportunities", icon: <EyeIcon size={24} /> },
  { label: "Network", href: "/player/network", icon: <UsersThreeIcon size={24} /> },
  { label: "Messages", href: "/player/messages", icon: <ChatIcon size={24} /> },
  { label: "Notifications", href: "/notifications", icon: <BellIcon size={24} /> },
  { label: "Payments", href: "/player/payments", icon: <CreditCardIcon size={24} /> },
];

type Payment = {
  id: string;
  trialId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  trial?: {
    title?: string;
    city?: string;
    createdBy?: {
      name?: string;
    };
  };
};

export default function PlayerPaymentsPage() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id as string | undefined;
  const displayName = session?.user?.name || "Player";
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setPayments([]);
      setLoading(false);
      return;
    }
    loadPayments(userId);
  }, [userId]);

  async function loadPayments(targetUserId: string) {
    setLoading(true);
    try {
      const list = await apiGet(`payments?userId=${targetUserId}`);
      setPayments(list);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load payments");
    } finally {
      setLoading(false);
    }
  }

  const totals = useMemo(() => {
    return payments.reduce(
      (acc, payment) => {
        if (payment.status === "PAID") {
          acc.paid += payment.amount;
        } else if (payment.status === "DUE") {
          acc.due += payment.amount;
        }
        return acc;
      },
      { due: 0, paid: 0 }
    );
  }, [payments]);

  async function handlePay(payment: Payment) {
    if (!userId) {
      toast.error("Please log in to pay");
      return;
    }
    try {
      setProcessing(payment.id);
      await apiPatch("payments", { id: payment.id, status: "PAID" });
      await loadPayments(userId);
      toast.success("Payment completed");
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
    } finally {
      setProcessing(null);
    }
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <Sidebar
            title="TalentVerse"
            subtitle="Player"
            user={{ name: displayName, role: (session?.user as any)?.role || "Player" }}
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
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Reference</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Trial</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Amount</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-[#92adc9] text-sm">
                          Loading payments...
                        </td>
                      </tr>
                    ) : payments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-[#92adc9] text-sm">
                          No payments yet.
                        </td>
                      </tr>
                    ) : (
                      payments.map((payment) => {
                        const trialName = payment.trial?.title || payment.trialId;
                        const location = payment.trial?.city;
                        const host = payment.trial?.createdBy?.name;
                        return (
                          <tr key={payment.id} className="border-t border-[#324d67]">
                            <td className="px-4 py-3 text-[#92adc9] text-sm">{payment.id}</td>
                            <td className="px-4 py-3 text-white text-sm">
                              <div className="flex flex-col gap-1">
                                <span>{trialName}</span>
                                <span className="text-xs text-[#92adc9]">
                                  {location ? `${location}` : null}
                                  {location && host ? " • " : ""}
                                  {host ? `Hosted by ${host}` : ""}
                                </span>
                              </div>
                            </td>
                          <td className="px-4 py-3 text-white text-sm">
                            {payment.currency} {Number(payment.amount || 0).toFixed(2)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                payment.status === "PAID"
                                  ? "bg-[#0bda5b]/20 text-[#0bda5b]"
                                  : payment.status === "PROCESSING"
                                  ? "bg-[#ffa500]/20 text-[#ffa500]"
                                  : "bg-[#324d67] text-[#92adc9]"
                              }`}
                            >
                              {payment.status.toLowerCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Button variant="secondary" size="sm">View</Button>
                              <Button
                                size="sm"
                                disabled={payment.status !== "DUE" || processing === payment.id}
                                onClick={() => handlePay(payment)}
                              >
                                {processing === payment.id ? "Processing..." : "Pay"}
                              </Button>
                            </div>
                          </td>
                          </tr>
                        );
                      })
                    )}
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

