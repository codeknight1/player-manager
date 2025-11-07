import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type PrismaProfile = Record<string, any> | string | null | undefined;

function parseProfile(raw: PrismaProfile, fallback: { name?: string | null; email?: string | null }) {
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

  const [firstName = "", ...rest] = (parsed.firstName
    ?? (fallback.name ? fallback.name.split(" ")[0] : "")).toString().split(" ");
  const lastName = parsed.lastName
    ?? (fallback.name ? fallback.name.split(" ").slice(1).join(" ") : "");

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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { profileData, password, ...userWithoutSensitive } = user as any;
    const response = {
      ...userWithoutSensitive,
      profile: parseProfile(profileData, {
        name: userWithoutSensitive.name,
        email: userWithoutSensitive.email,
      }),
    };
    
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, profileData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) {
      updateData.name = name;
    }
    if (profileData !== undefined) {
      updateData.profileData = JSON.stringify(profileData);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    const { profileData: updatedProfile, password, ...userWithoutSensitive } = updated as any;
    const response = {
      ...userWithoutSensitive,
      profile: parseProfile(updatedProfile, {
        name: userWithoutSensitive.name,
        email: userWithoutSensitive.email,
      }),
    };

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}

