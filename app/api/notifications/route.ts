import { NextRequest, NextResponse } from "next/server";
import { supabaseServerClient } from "@/app/lib/supabaseServer";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    if (supabaseServerClient) {
      const { data, error } = await supabaseServerClient
        .from("Notification")
        .select("*")
        .eq("userId", userId)
        .order("createdAt", { ascending: false });
      if (error) {
        throw error;
      }
      return NextResponse.json(data ?? []);
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(notifications);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, read } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    if (supabaseServerClient) {
      const { data, error } = await supabaseServerClient
        .from("Notification")
        .update({ read: read === true })
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) {
        throw error;
      }
      return NextResponse.json(data);
    }

    const notification = await prisma.notification.update({
      where: { id },
      data: { read: read === true },
    });
    return NextResponse.json(notification);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update notification" },
      { status: 500 }
    );
  }
}








