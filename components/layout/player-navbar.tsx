"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { BellIcon } from "@/components/icons";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { apiGet } from "@/app/lib/api";

function mapProfilePayload(payload: any) {
  if (!payload) return null;
  
  const profileSource = (() => {
    if (payload?.profile && typeof payload.profile === "object" && !Array.isArray(payload.profile)) {
      return payload.profile;
    }
    if (payload?.profile && typeof payload.profile === "string") {
      try {
        return JSON.parse(payload.profile);
      } catch {
        return {};
      }
    }
    if (payload?.profileData && typeof payload.profileData === "string") {
      try {
        return JSON.parse(payload.profileData);
      } catch {
        return {};
      }
    }
    if (payload?.profileData && typeof payload.profileData === "object") {
      return payload.profileData;
    }
    return {};
  })();

  const name = payload?.name ?? "";
  const nameParts = name.trim().split(" ");
  
  return {
    firstName: profileSource.firstName ?? nameParts[0] ?? "",
    lastName: profileSource.lastName ?? nameParts.slice(1).join(" ") ?? "",
    avatar: profileSource.avatar ?? payload?.avatar ?? "",
  };
}

export function PlayerNavbar() {
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState<{
    avatar?: string;
    firstName?: string;
    lastName?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    const userId = (session?.user as any)?.id;
    if (!userId) {
      setLoading(false);
      return;
    }

    async function loadProfile() {
      try {
        const userData = await apiGet(`profile?userId=${userId}`).catch(() => null);
        if (userData) {
          const mapped = mapProfilePayload(userData);
          setProfileData(mapped);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [session]);

  if (!session) return null;

  const userId = (session?.user as any)?.id;
  const displayName = profileData
    ? `${profileData.firstName} ${profileData.lastName}`.trim() || session?.user?.name || "Player"
    : session?.user?.name || "Player";
  const avatarUrl = profileData?.avatar;

  return (
    <div className="flex items-center gap-2">
      <button
        className="flex items-center justify-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <BellIcon size={20} />
      </button>
      <ProfileDropdown
        avatar={avatarUrl}
        userId={userId}
        profileName={displayName}
      />
    </div>
  );
}

