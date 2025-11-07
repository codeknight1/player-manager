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
      where: {
        OR: [{ fromId: userId }, { toId: userId }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        from: { select: { id: true, name: true, email: true } },
        to: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(messages);
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

    const created = await prisma.message.create({
      data: { fromId, toId, content },
    });
    return NextResponse.json(created);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to send message" },
      { status: 500 }
    );
  }
}





