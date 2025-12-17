import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || (token as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [
      totalUsers,
      totalPlayers,
      totalAgents,
      totalAcademies,
      totalTrials,
      totalTournaments,
      totalApplications,
      pendingVerifications,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "PLAYER" } }),
      prisma.user.count({ where: { role: "AGENT" } }),
      prisma.user.count({ where: { role: "ACADEMY" } }),
      prisma.trial.count(),
      prisma.trial.count(),
      prisma.application.count(),
      prisma.verification.count({ where: { status: "PENDING" } }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalPlayers,
      totalAgents,
      totalAcademies,
      totalTrials,
      totalTournaments,
      totalApplications,
      pendingVerifications,
    });
  } catch (e: any) {
    console.error("Error loading admin stats:", e);
    return NextResponse.json(
      {
        error: "Failed to load stats",
        message: e?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
