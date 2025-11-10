import { NextRequest, NextResponse } from "next/server";
import { supabaseServerClient } from "@/app/lib/supabaseServer";
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
    
    if (supabaseServerClient) {
      const { data: user, error: userError } = await supabaseServerClient
        .from("User")
        .select("id,email,name,role,isActive,profileData,createdAt,updatedAt")
        .eq("id", userId)
        .maybeSingle();
      if (userError && userError.code !== "PGRST116") {
        throw userError;
      }
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      const { data: uploadsData, error: uploadsError } = await supabaseServerClient
        .from("Upload")
        .select("*")
        .eq("userId", userId)
        .order("createdAt", { ascending: false });
      if (uploadsError) {
        throw uploadsError;
      }
      const { profileData, ...userWithoutSensitive } = user as any;
      const response = {
        ...userWithoutSensitive,
        profile: parseProfile(profileData ?? null, {
          name: userWithoutSensitive.name,
          email: userWithoutSensitive.email,
        }),
        uploads: uploadsData ?? [],
      };
      return NextResponse.json(response);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { uploads: { orderBy: { createdAt: "desc" } } },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const response = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profile: parseProfile(user.profileData ? JSON.parse(user.profileData) : null, {
        name: user.name,
        email: user.email,
      }),
      uploads: user.uploads,
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
      updateData.profileData = profileData;
    }

    if (supabaseServerClient) {
      const { data: updated, error: updateError } = await supabaseServerClient
        .from("User")
        .update(updateData)
        .eq("id", userId)
        .select("id,email,name,role,isActive,profileData,createdAt,updatedAt")
        .maybeSingle();
      if (updateError) {
        throw updateError;
      }
      const { data: uploadsData, error: uploadsError } = await supabaseServerClient
        .from("Upload")
        .select("*")
        .eq("userId", userId)
        .order("createdAt", { ascending: false });
      if (uploadsError) {
        throw uploadsError;
      }
      const { profileData: updatedProfile, ...userWithoutSensitive } = updated as any;
      const response = {
        ...userWithoutSensitive,
        profile: parseProfile(updatedProfile, {
          name: userWithoutSensitive.name,
          email: userWithoutSensitive.email,
        }),
        uploads: uploadsData ?? [],
      };
      return NextResponse.json(response);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(updateData.name !== undefined ? { name: updateData.name } : {}),
        ...(updateData.profileData !== undefined
          ? { profileData: typeof updateData.profileData === "string" ? updateData.profileData : JSON.stringify(updateData.profileData) }
          : {}),
      },
      include: { uploads: { orderBy: { createdAt: "desc" } } },
    });

    const response = {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
      isActive: updated.isActive,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      profile: parseProfile(updated.profileData ? JSON.parse(updated.profileData) : null, {
        name: updated.name,
        email: updated.email,
      }),
      uploads: updated.uploads,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}

