import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

function normalizeType(type: string): "VIDEO" | "CERTIFICATE" | "ACHIEVEMENT" {
  const upper = type?.toUpperCase();
  if (upper === "VIDEO" || upper === "CERTIFICATE" || upper === "ACHIEVEMENT") {
    return upper;
  }
  throw new Error("Invalid upload type");
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const uploads = await prisma.upload.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ uploads });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, uploads } = body ?? {};

    if (!userId || !Array.isArray(uploads)) {
      return NextResponse.json({ error: "userId and uploads array are required" }, { status: 400 });
    }

    const now = new Date();

    await prisma.$transaction([
      prisma.upload.deleteMany({ where: { userId } }),
      prisma.upload.createMany({
        data: uploads.map((upload: any) => ({
          id: upload.id ?? undefined,
          userId,
          name: upload.name ?? "",
          type: normalizeType(upload.type ?? ""),
          url: upload.url ?? null,
          thumbnail: upload.thumbnail ?? null,
          createdAt: upload.createdAt ? new Date(upload.createdAt) : now,
        })),
        skipDuplicates: true,
      }),
    ]);

    const saved = await prisma.upload.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ uploads: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save uploads" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    const userId = request.nextUrl.searchParams.get("userId");

    if (!id || !userId) {
      return NextResponse.json({ error: "id and userId are required" }, { status: 400 });
    }

    await prisma.upload.deleteMany({ where: { id, userId } });

    const uploads = await prisma.upload.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ uploads });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete upload" }, { status: 500 });
  }
}


