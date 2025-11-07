import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { parseProfile } from "@/app/lib/profile-utils";

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
    const uploads = await prisma.upload.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    const response = {
      ...userWithoutSensitive,
      profile: parseProfile(profileData, {
        name: userWithoutSensitive.name,
        email: userWithoutSensitive.email,
      }),
      uploads,
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
    const uploads = await prisma.upload.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    const response = {
      ...userWithoutSensitive,
      profile: parseProfile(updatedProfile, {
        name: userWithoutSensitive.name,
        email: userWithoutSensitive.email,
      }),
      uploads,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}

