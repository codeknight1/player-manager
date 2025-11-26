import { NextRequest, NextResponse } from "next/server";
import { supabaseServerClient } from "@/app/lib/supabaseServer";
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

  if (supabaseServerClient) {
    const { data, error } = await supabaseServerClient
      .from("Upload")
      .select("*")
      .eq("userId", userId)
      .order("createdAt", { ascending: false });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ uploads: data ?? [] });
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
    const payloads = uploads.map((raw: any) => {
      const identifier = typeof raw.id === "string" && raw.id.trim().length > 0 ? raw.id.trim() : undefined;
      const name = typeof raw.name === "string" ? raw.name : "";
      const type = normalizeType(typeof raw.type === "string" ? raw.type : "");
      const url = typeof raw.url === "string" && raw.url.trim().length > 0 ? raw.url : null;
      const thumbnail = typeof raw.thumbnail === "string" && raw.thumbnail.trim().length > 0 ? raw.thumbnail : null;
      const createdAt = raw.createdAt ? new Date(raw.createdAt) : now;
      return {
        id: identifier,
        name,
        type,
        url,
        thumbnail,
        createdAt,
      };
    });

    console.log("[uploads] payload length", payloads.length);
    console.log("[uploads] payload ids", payloads.map((item) => item.id));

    const upsertPayload = payloads.map((entry) => {
      const base = {
        userId,
        name: entry.name,
        type: entry.type,
        url: entry.url,
        thumbnail: entry.thumbnail,
        createdAt: entry.createdAt.toISOString(),
      };
      if (entry.id) {
        return { ...base, id: entry.id };
      }
      return base;
    });

    if (supabaseServerClient) {
      const { error: upsertError } = await supabaseServerClient
        .from("Upload")
        .upsert(upsertPayload, { onConflict: "id" });
      if (upsertError) {
        throw upsertError;
      }
      const { data: saved, error: fetchError } = await supabaseServerClient
        .from("Upload")
        .select("*")
        .eq("userId", userId)
        .order("createdAt", { ascending: false });
      if (fetchError) {
        throw fetchError;
      }
      console.log("[uploads] saved count", saved?.length ?? 0);
      return NextResponse.json({
        uploads: saved ?? [],
        meta: {
          payloadLength: uploads.length,
          payloadIds: uploads.map((upload: any) => upload.id ?? null),
          savedCount: saved?.length ?? 0,
        },
      });
    }

    await prisma.$transaction(async (tx) => {
      const existing = await tx.upload.findMany({
        where: { userId },
        select: { id: true },
      });
      const existingIds = new Set(existing.map((item) => item.id));
      const seenIds = new Set<string>();
      
      const toUpdate: typeof payloads = [];
      const toCreate: typeof payloads = [];
      
      for (const entry of payloads) {
        if (entry.id && seenIds.has(entry.id)) {
          continue;
        }
        if (entry.id && existingIds.has(entry.id)) {
          toUpdate.push(entry);
          existingIds.delete(entry.id);
        } else {
          toCreate.push(entry);
        }
        if (entry.id) {
          seenIds.add(entry.id);
        }
      }
      
      // Batch create operations
      if (toCreate.length > 0) {
        await Promise.all(
          toCreate.map((entry) =>
            tx.upload.create({
              data: {
                ...(entry.id ? { id: entry.id } : {}),
                userId,
                name: entry.name,
                type: entry.type,
                url: entry.url,
                thumbnail: entry.thumbnail,
                createdAt: entry.createdAt,
              },
            })
          )
        );
      }
      
      // Batch update operations
      if (toUpdate.length > 0) {
        await Promise.all(
          toUpdate.map((entry) =>
            tx.upload.update({
              where: { id: entry.id! },
              data: {
                name: entry.name,
                type: entry.type,
                url: entry.url,
                thumbnail: entry.thumbnail,
                createdAt: entry.createdAt,
              },
            })
          )
        );
      }
      
      // Delete remaining existing uploads that weren't in the payload
      if (existingIds.size > 0) {
        await tx.upload.deleteMany({
          where: {
            userId,
            id: { in: Array.from(existingIds) },
          },
        });
      }
    }, {
      timeout: 30000, // 30 seconds timeout
    });

    const saved = await prisma.upload.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      uploads: saved,
      meta: {
        payloadLength: uploads.length,
        payloadIds: uploads.map((upload: any) => upload.id ?? null),
        savedCount: saved.length,
      },
    });
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

    if (supabaseServerClient) {
      const { error } = await supabaseServerClient.from("Upload").delete().match({ id, userId });
      if (error) {
        throw error;
      }
      const { data, error: fetchError } = await supabaseServerClient
        .from("Upload")
        .select("*")
        .eq("userId", userId)
        .order("createdAt", { ascending: false });
      if (fetchError) {
        throw fetchError;
      }
      return NextResponse.json({ uploads: data ?? [] });
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


