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

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status === "upcoming") {
      where.date = { gte: new Date() };
    } else if (status === "past") {
      where.date = { lt: new Date() };
    }

    const trials = await prisma.trial.findMany({
      where,
      orderBy: { date: "desc" },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        apps: {
          select: {
            id: true,
            status: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            apps: true,
            payments: true,
          },
        },
      },
    });

    const stats = {
      total: trials.length,
      upcoming: trials.filter((t) => new Date(t.date) >= new Date()).length,
      past: trials.filter((t) => new Date(t.date) < new Date()).length,
      totalApplications: trials.reduce((sum, t) => sum + t._count.apps, 0),
      totalRevenue: trials.reduce((sum, t) => {
        return sum + t._count.payments * t.fee;
      }, 0),
    };

    return NextResponse.json({ trials, stats });
  } catch (e: any) {
    console.error("Error loading trials:", e);
    return NextResponse.json(
      {
        error: "Failed to load trials",
        message: e?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const role = (token as any)?.role;
    if (role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Only super admins can create trials" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, city, date, fee, createdById } = body;

    if (!title || !city || !date) {
      return NextResponse.json(
        { error: "Missing required fields: title, city, date" },
        { status: 400 }
      );
    }

    const trial = await prisma.trial.create({
      data: {
        title,
        city,
        date: new Date(date),
        fee: fee ? Number(fee) : 0,
        createdById: createdById || (token as any)?.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(trial);
  } catch (e: any) {
    console.error("Error creating trial:", e);
    return NextResponse.json(
      {
        error: "Failed to create trial",
        message: e?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
