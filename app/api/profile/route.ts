import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

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

    let profile: any = {};
    const pd: any = (user as any).profileData;
    if (pd) {
      if (typeof pd === 'string') {
        try {
          const parsed = JSON.parse(pd);
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) profile = parsed;
        } catch {}
      } else if (typeof pd === 'object' && !Array.isArray(pd)) {
        profile = pd;
      }
    }
    
    const response = {
      id: user.id,
      email: user.email,
      name: user.name,
      profile: profile,
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

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        profileData: profileData ? JSON.stringify(profileData) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

