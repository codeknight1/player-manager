type PrismaProfile = Record<string, any> | string | null | undefined;

type ProfileFallback = {
  name?: string | null;
  email?: string | null;
};

export function parseProfile(raw: PrismaProfile, fallback: ProfileFallback) {
  const emptyProfile = {
    firstName: "",
    lastName: "",
    email: fallback.email ?? "",
    age: 0,
    position: "",
    nationality: "",
    phone: "",
    bio: "",
    avatar: "",
    stats: { goals: 0, assists: 0, matches: 0 },
    uploads: [] as Array<Record<string, any>>,
  };

  if (!raw) {
    const [firstName = "", ...rest] = (fallback.name ?? "").split(" ");
    return { ...emptyProfile, firstName, lastName: rest.join(" ") };
  }

  let parsed: any = raw;
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {};
    }
  }

  if (typeof parsed !== "object" || Array.isArray(parsed) || parsed === null) {
    parsed = {};
  }

  const stats = typeof parsed.stats === "object" && parsed.stats
    ? {
        goals: typeof parsed.stats.goals === "number" ? parsed.stats.goals : Number(parsed.stats.goals) || 0,
        assists: typeof parsed.stats.assists === "number" ? parsed.stats.assists : Number(parsed.stats.assists) || 0,
        matches: typeof parsed.stats.matches === "number" ? parsed.stats.matches : Number(parsed.stats.matches) || 0,
      }
    : emptyProfile.stats;

  const uploads = Array.isArray(parsed.uploads) ? parsed.uploads : emptyProfile.uploads;

  const [firstName = "", ...rest] = (parsed.firstName ?? (fallback.name ? fallback.name.split(" ")[0] : "")).toString().split(" ");
  const lastName = parsed.lastName ?? (fallback.name ? fallback.name.split(" ").slice(1).join(" ") : "");

  return {
    ...emptyProfile,
    ...parsed,
    firstName,
    lastName,
    email: parsed.email ?? fallback.email ?? emptyProfile.email,
    age: typeof parsed.age === "number" ? parsed.age : Number(parsed.age) || 0,
    stats,
    uploads,
  };
}

