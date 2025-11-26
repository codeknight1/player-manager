import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get("creatorId");
    
    const where: any = {};
    if (creatorId) {
      where.createdById = creatorId;
    }
    
    const trials = await prisma.trial.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { createdBy: true },
    });
    
    return NextResponse.json(trials);
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
        { error: "Forbidden: Only super admins can create trials and tournaments" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, city, date, fee, createdById } = body;
    
    if (!title || !city || !date || !createdById) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: {
            title: !!title,
            city: !!city,
            date: !!date,
            createdById: !!createdById,
          },
        },
        { status: 400 }
      );
    }
    
    const parsedFee =
      typeof fee === "number"
        ? fee
        : fee
        ? Number(fee)
        : 0;
    
    const trial = await prisma.trial.create({
      data: {
        title,
        city,
        date: new Date(date),
        createdById,
        fee: Number.isFinite(parsedFee) ? parsedFee : 0,
      },
      include: { createdBy: true },
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

