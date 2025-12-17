import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/app/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const role = (token as any)?.role;
    if (role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Only super admins can update tournaments" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, city, date, fee } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (city !== undefined) updateData.city = city;
    if (date !== undefined) updateData.date = new Date(date);
    if (fee !== undefined) updateData.fee = Number(fee);

    const tournament = await prisma.trial.update({
      where: { id: params.id },
      data: updateData,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            apps: true,
            payments: true,
          },
        },
      },
    });

    return NextResponse.json(tournament);
  } catch (e: any) {
    console.error("Error updating tournament:", e);
    return NextResponse.json(
      {
        error: "Failed to update tournament",
        message: e?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const role = (token as any)?.role;
    if (role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Only super admins can delete tournaments" },
        { status: 403 }
      );
    }

    await prisma.trial.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Error deleting tournament:", e);
    return NextResponse.json(
      {
        error: "Failed to delete tournament",
        message: e?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
