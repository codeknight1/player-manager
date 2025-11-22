import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const trialId = searchParams.get("trialId");
    const status = searchParams.get("status");
    
    const where: any = {};
    if (userId) where.userId = userId;
    if (trialId) where.trialId = trialId;
    if (status) where.status = status.toUpperCase();
    
    const payments = await prisma.payment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { trial: { include: { createdBy: true } } },
    });
    
    return NextResponse.json(payments);
  } catch (error: any) {
    console.error("Error loading payments:", error);
    return NextResponse.json(
      { error: "Failed to load payments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, trialId, amount, currency } = body;
    
    if (!userId || !trialId) {
      return NextResponse.json(
        { error: "userId and trialId are required" },
        { status: 400 }
      );
    }
    
    const payment = await prisma.payment.upsert({
      where: {
        userId_trialId: {
          userId,
          trialId,
        },
      },
      update: {
        amount: typeof amount === "number" ? amount : undefined,
        currency: currency ? currency.toUpperCase() : undefined,
      },
      create: {
        userId,
        trialId,
        amount: typeof amount === "number" ? amount : 0,
        currency: currency ? currency.toUpperCase() : "USD",
      },
      include: { trial: { include: { createdBy: true } } },
    });
    
    return NextResponse.json(payment);
  } catch (error: any) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
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
    
    const payment = await prisma.payment.update({
      where: { id },
      data: { status: status.toUpperCase() },
      include: { trial: { include: { createdBy: true } } },
    });
    
    return NextResponse.json(payment);
  } catch (error: any) {
    console.error("Error updating payment:", error);
    return NextResponse.json(
      { error: "Failed to update payment" },
      { status: 500 }
    );
  }
}

