"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { apiGet, apiPatch, apiPost } from "@/app/lib/api";
import { toast } from "sonner";

const DEFAULT_TRIAL_FEE = 50;

export default function ExploreOpportunitiesPage() {
  const { data: session } = useSession();
  const [trials, setTrials] = useState<any[]>([]);
  const [applications, setApplications] = useState<Record<string, any>>({});
  const [payments, setPayments] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<string | null>(null);
  const userId = (session?.user as any)?.id as string | undefined;

  useEffect(() => {
    loadTrials();
  }, []);

  useEffect(() => {
    if (!userId || trials.length === 0) return;
    loadApplications();
  }, [userId, trials]);

  useEffect(() => {
    if (!userId) return;
    loadPayments();
  }, [userId]);

  async function loadTrials() {
    try {
      const list = await apiGet("trials");
      setTrials(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadApplications() {
    if (!userId) return;
    try {
      const apps = await apiGet(`applications?userId=${userId}`);
      const map: Record<string, any> = {};
      apps.forEach((app: any) => {
        map[app.trialId] = app;
      });
      setApplications(map);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadPayments() {
    if (!userId) return;
    try {
      const list = await apiGet(`payments?userId=${userId}`);
      const map: Record<string, any> = {};
      list.forEach((payment: any) => {
        map[payment.trialId] = payment;
      });
      setPayments(map);
    } catch (err) {
      console.error(err);
    }
  }

  async function ensurePayment(trial: any) {
    if (!userId) return null;
    const existing = payments[trial.id];
    if (existing) {
      return existing;
    }
    try {
      const created = await apiPost("payments", {
        userId,
        trialId: trial.id,
        amount: Number(trial.fee ?? trial.amount ?? DEFAULT_TRIAL_FEE),
      });
      setPayments((prev) => ({ ...prev, [trial.id]: created }));
      return created;
    } catch (err: any) {
      toast.error(err.message || "Unable to create payment invoice");
      return null;
    }
  }

  async function handlePay(trial: any) {
    if (!userId) {
      toast.error("Please log in to pay");
      return;
    }
    try {
      setPaying(trial.id);
      const paymentRecord = (await ensurePayment(trial)) ?? payments[trial.id];
      if (!paymentRecord) {
        return;
      }
      const updated = await apiPatch("payments", {
        id: paymentRecord.id,
        status: "PAID",
      });
      setPayments((prev) => ({ ...prev, [trial.id]: updated }));
      toast.success("Payment completed");
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
    } finally {
      setPaying(null);
    }
  }

  async function apply(trial: any) {
    if (!userId) {
      toast.error("Please log in to apply");
      return;
    }
    try {
      const paymentRecord = payments[trial.id] ?? (await ensurePayment(trial));
      if (!paymentRecord || paymentRecord.status !== "PAID") {
        toast.error("Please complete payment before applying");
        return;
      }
      const app = await apiPost("applications", {
        userId,
        trialId: trial.id,
      });
      setApplications((prev) => ({ ...prev, [trial.id]: app }));
      toast.success("Application submitted!");
      await apiPost("notifications", {
        userId,
        title: "Application Submitted",
        body: `Your application for ${trial.title} has been submitted.`,
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to apply");
    }
  }

  return (
    <div className="relative flex h-auto w-full flex-col px-8 py-10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-white text-3xl font-bold mb-2">Explore Opportunities</h1>
          <p className="text-[#92adc9]">Discover trials, showcases, and scouting opportunities.</p>
        </div>
        <Link
          href="/player/login"
          className="flex items-center justify-center rounded-lg h-10 px-4 bg-[#1172d4] text-white text-sm font-bold"
        >
          Get Started
        </Link>
      </div>

      {loading ? (
        <div className="text-[#92adc9]">Loading opportunities...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trials.length === 0 ? (
            <div className="col-span-full text-[#92adc9]">No opportunities available yet</div>
          ) : (
            trials.map((trial) => {
              const app = applications[trial.id];
              const date = new Date(trial.date);
              const payment = payments[trial.id];
              const paymentStatus = payment?.status || "DUE";
              const isPaid = paymentStatus === "PAID";
              const amount = Number(
                typeof trial.fee === "number" && !Number.isNaN(trial.fee)
                  ? trial.fee
                  : trial.amount ?? payment?.amount ?? DEFAULT_TRIAL_FEE
              );
              const hostName = trial.createdBy?.name || "Club/Academy";
              return (
                <div key={trial.id} className="rounded-xl border border-[#233648] bg-[#0f1620] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-white text-lg font-semibold">{trial.title}</h2>
                    <span className="text-xs text-[#92adc9]">
                      {trial.city} • {date.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[#92adc9] mb-4">
                    Join coaches and scouts for an elite assessment session. Limited spots available.
                  </p>
                  <p className="text-[#92adc9] text-sm mb-3">
                    Hosted by <span className="text-white font-medium">{hostName}</span>
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${isPaid ? "bg-emerald-500/20 text-emerald-300" : "bg-[#324d67] text-[#92adc9]"}`}>
                        Payment {isPaid ? "Completed" : "Required"}
                      </span>
                      <span className="text-[#92adc9] text-xs">
                        Fee ${amount.toFixed(2)}
                      </span>
                    </div>
                    {!isPaid && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePay(trial)}
                        disabled={paying === trial.id}
                      >
                        {paying === trial.id ? "Processing..." : "Pay"}
                      </Button>
                    )}
                  </div>
                  {app ? (
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-[#324d67] text-white">
                        Status: {app.status}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Button size="sm" onClick={() => apply(trial)} disabled={!isPaid}>
                        Apply
                      </Button>
                      <Link href="#" className="rounded-lg h-9 px-4 border border-[#324d67] text-white text-sm font-medium flex items-center">
                        Details
                      </Link>
                    </div>
                  )}
                  {!isPaid && (
                    <p className="text-[#92adc9] text-xs mt-2">
                      Complete payment to enable application.
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}


