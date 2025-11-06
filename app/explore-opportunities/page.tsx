"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { apiGet, apiPost } from "@/app/lib/api";
import { toast } from "sonner";

export default function ExploreOpportunitiesPage() {
  const { data: session } = useSession();
  const [trials, setTrials] = useState<any[]>([]);
  const [applications, setApplications] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrials();
  }, []);

  useEffect(() => {
    if (!session?.user?.id || trials.length === 0) return;
    loadApplications();
  }, [session, trials]);

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
    if (!session?.user?.id) return;
    try {
      const userId = (session.user as any).id;
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

  async function apply(trialId: string) {
    if (!session?.user?.id) {
      toast.error("Please log in to apply");
      return;
    }
    try {
      const app = await apiPost("applications", {
        userId: (session.user as any).id,
        trialId,
      });
      setApplications((prev) => ({ ...prev, [trialId]: app }));
      toast.success("Application submitted!");
      await apiPost("notifications", {
        userId: (session.user as any).id,
        title: "Application Submitted",
        body: `Your application for ${trials.find((t) => t.id === trialId)?.title} has been submitted.`,
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
                  {app ? (
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-[#324d67] text-white">
                        Status: {app.status}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Button size="sm" onClick={() => apply(trial.id)}>
                        Apply
                      </Button>
                      <Link href="#" className="rounded-lg h-9 px-4 border border-[#324d67] text-white text-sm font-medium flex items-center">
                        Details
                      </Link>
                    </div>
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


