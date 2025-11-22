import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    
    const users = await prisma.user.findMany({
      where: role ? { role: role as any } : undefined,
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json(users);
  } catch (e: any) {
    console.error("Error loading users:", e);
    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 }
    );
  }
}

