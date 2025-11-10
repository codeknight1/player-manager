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
      const { data: messages, error } = await supabaseServerClient
        .from("Message")
        .select("fromId,toId")
        .or(`fromId.eq.${userId},toId.eq.${userId}`);
      if (error) {
        throw error;
      }
      const otherIds = new Set<string>();
      for (const message of messages ?? []) {
        if (message.fromId === userId && message.toId) {
          otherIds.add(message.toId);
        } else if (message.toId === userId && message.fromId) {
          otherIds.add(message.fromId);
        }
      }
      let connections: Array<{ id: string; name: string | null; email: string }> = [];
      if (otherIds.size > 0) {
        const { data: users, error: usersError } = await supabaseServerClient
          .from("User")
          .select("id,name,email")
          .in("id", Array.from(otherIds));
        if (usersError) {
          throw usersError;
        }
        connections = (users ?? []).map((user) => ({
          id: user.id,
          name: user.name ?? null,
          email: user.email,
        }));
      }
      return NextResponse.json({ count: connections.length, connections });
    }

    const messages = await prisma.message.findMany({
      where: { OR: [{ fromId: userId }, { toId: userId }] },
      select: { fromId: true, toId: true },
    });
    const otherIds = new Set<string>();
    for (const message of messages) {
      if (message.fromId === userId && message.toId) {
        otherIds.add(message.toId);
      } else if (message.toId === userId && message.fromId) {
        otherIds.add(message.fromId);
      }
    }
    let connections: Array<{ id: string; name: string | null; email: string }> = [];
    if (otherIds.size > 0) {
      const users = await prisma.user.findMany({
        where: { id: { in: Array.from(otherIds) } },
        select: { id: true, name: true, email: true },
      });
      connections = users.map((user) => ({
        id: user.id,
        name: user.name ?? null,
        email: user.email,
      }));
    }
    return NextResponse.json({ count: connections.length, connections });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch connections" },
      { status: 500 }
    );
  }
}








