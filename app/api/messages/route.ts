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
      const { data: messagesData, error } = await supabaseServerClient
        .from("Message")
        .select("id,fromId,toId,content,createdAt")
        .or(`fromId.eq.${userId},toId.eq.${userId}`)
        .order("createdAt", { ascending: false });
      if (error) {
        throw error;
      }
      const userIds = new Set<string>();
      for (const message of messagesData ?? []) {
        if (message.fromId) {
          userIds.add(message.fromId);
        }
        if (message.toId) {
          userIds.add(message.toId);
        }
      }
      const lookup = new Map<string, { id: string; name: string | null; email: string }>();
      if (userIds.size > 0) {
        const { data: users, error: usersError } = await supabaseServerClient
          .from("User")
          .select("id,name,email")
          .in("id", Array.from(userIds));
        if (usersError) {
          throw usersError;
        }
        for (const user of users ?? []) {
          lookup.set(user.id, { id: user.id, name: user.name ?? null, email: user.email });
        }
      }
      const messages = (messagesData ?? []).map((message) => ({
        ...message,
        from: lookup.get(message.fromId ?? "") ?? null,
        to: lookup.get(message.toId ?? "") ?? null,
      }));
      return NextResponse.json(messages);
    }

    const messages = await prisma.message.findMany({
      where: { OR: [{ fromId: userId }, { toId: userId }] },
      orderBy: { createdAt: "desc" },
      include: {
        from: { select: { id: true, name: true, email: true } },
        to: { select: { id: true, name: true, email: true } },
      },
    });
    const response = messages.map((message) => ({
      id: message.id,
      fromId: message.fromId,
      toId: message.toId,
      content: message.content,
      createdAt: message.createdAt,
      from: message.from,
      to: message.to,
    }));
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromId, toId, content } = body;
    if (!fromId || !toId || !content) {
      return NextResponse.json({ error: "fromId, toId and content are required" }, { status: 400 });
    }

    if (supabaseServerClient) {
      const { data, error } = await supabaseServerClient
        .from("Message")
        .insert({ fromId, toId, content })
        .select("id,fromId,toId,content,createdAt")
        .single();
      if (error) {
        throw error;
      }
      return NextResponse.json(data);
    }

    const message = await prisma.message.create({
      data: { fromId, toId, content },
      select: { id: true, fromId: true, toId: true, content: true, createdAt: true },
    });
    return NextResponse.json(message);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to send message" },
      { status: 500 }
    );
  }
}








