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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const where: any = {
      role: "AGENT",
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status === "active") {
      where.isActive = true;
    } else if (status === "inactive") {
      where.isActive = false;
    }

    const agencies = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        profileData: true,
      },
    });

    const stats = {
      total: agencies.length,
      active: agencies.filter((a) => a.isActive).length,
      inactive: agencies.filter((a) => !a.isActive).length,
    };

    return NextResponse.json({ agencies, stats });
  } catch (e: any) {
    console.error("Error loading agencies:", e);
    return NextResponse.json(
      {
        error: "Failed to load agencies",
        message: e?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
