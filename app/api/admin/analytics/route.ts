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
      usersByRole,
      activeUsers,
      recentSignups,
      trialsByMonth,
      applicationsByStatus,
      verificationsByStatus,
    ] = await Promise.all([
      prisma.user.groupBy({
        by: ["role"],
        _count: true,
      }),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.trial.findMany({
        orderBy: { createdAt: "desc" },
        take: 12,
      }),
      prisma.application.groupBy({
        by: ["status"],
        _count: true,
      }),
      prisma.verification.groupBy({
        by: ["status"],
        _count: true,
      }),
    ]);

    return NextResponse.json({
      usersByRole,
      activeUsers,
      recentSignups,
      trialsByMonth,
      applicationsByStatus,
      verificationsByStatus,
    });
  } catch (e: any) {
    console.error("Error loading analytics:", e);
    return NextResponse.json(
      {
        error: "Failed to load analytics",
        message: e?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
