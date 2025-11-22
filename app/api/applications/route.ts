import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const trialId = searchParams.get("trialId");
    
    const where: any = {};
    if (userId) where.userId = userId;
    if (trialId) where.trialId = trialId;
    
    const apps = await prisma.application.findMany({
      where,
      include: { user: true, trial: { include: { createdBy: true } } },
    });
    
    return NextResponse.json(apps);
  } catch (e: any) {
    console.error("Error loading applications:", e);
    return NextResponse.json(
      { error: "Failed to load applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, trialId, status } = body;
    
    if (!userId || !trialId) {
      return NextResponse.json(
        { error: "userId and trialId are required" },
        { status: 400 }
      );
    }
    
    const payment = await prisma.payment.findFirst({
      where: {
        userId,
        trialId,
        status: "PAID",
      },
    });
    
    if (!payment) {
      return NextResponse.json(
        { error: "Payment required before applying for this trial" },
        { status: 400 }
      );
    }
    
    const app = await prisma.application.create({
      data: { userId, trialId, status },
      include: { trial: { include: { createdBy: true } } },
    });
    
    return NextResponse.json(app);
  } catch (e: any) {
    console.error("Error creating application:", e);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;
    
    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 }
      );
    }
    
    const app = await prisma.application.update({
      where: { id },
      data: { status },
    });
    
    return NextResponse.json(app);
  } catch (e: any) {
    console.error("Error updating application:", e);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}

