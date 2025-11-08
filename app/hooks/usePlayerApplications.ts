"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGet } from "@/app/lib/api";

type PlayerApplication = {
  id: string;
  status: string;
  createdAt?: string;
  trial?: {
    id: string;
    title?: string;
    city?: string;
    date?: string;
    createdBy?: {
      name?: string;
    };
  };
};

export function usePlayerApplications(userId?: string) {
  const [applications, setApplications] = useState<PlayerApplication[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!userId) {
      setApplications([]);
      return;
    }
    setLoading(true);
    try {
      const result = await apiGet(`applications?userId=${userId}`);
      setApplications(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error(error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }
    load();
  }, [userId, load]);

  return useMemo(() => ({ applications, loading, reload: load }), [applications, loading, load]);
}

