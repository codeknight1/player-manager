import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: { OR: [{ fromId: userId }, { toId: userId }] },
      include: {
        from: { select: { id: true, name: true, email: true } },
        to: { select: { id: true, name: true, email: true } },
      },
    });

    const connectionsMap = new Map<string, { id: string; name: string | null; email: string }>();
    for (const m of messages) {
      const other = m.fromId === userId ? m.to : m.from;
      if (other && !connectionsMap.has(other.id)) {
        connectionsMap.set(other.id, { id: other.id, name: other.name ?? null, email: other.email });
      }
    }

    const connections = Array.from(connectionsMap.values());
    return NextResponse.json({ count: connections.length, connections });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch connections" },
      { status: 500 }
    );
  }
}




