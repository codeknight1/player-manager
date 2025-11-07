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
    
    const { profileData, password, ...userWithoutSensitive } = user as any;
    const response = {
      ...userWithoutSensitive,
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

    let profile: any = {};
    const pd: any = (updated as any).profileData;
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

    const { profileData: _, password, ...userWithoutSensitive } = updated as any;
    const response = {
      ...userWithoutSensitive,
      profile: profile,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}

