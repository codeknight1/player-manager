import { NextRequest, NextResponse } from "next/server";
import { supabaseServerClient } from "@/app/lib/supabaseServer";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = (email as string).trim().toLowerCase();
    let user:
      | {
          id: string;
          email: string;
          password: string | null;
          name: string | null;
          role: string;
          isActive: boolean;
        }
      | null = null;
    if (supabaseServerClient) {
      const { data, error } = await supabaseServerClient
        .from("User")
        .select("id,email,password,name,role,isActive")
        .eq("email", normalizedEmail)
        .maybeSingle();
      if (error && error.code !== "PGRST116") {
        throw error;
      }
      user = data ?? null;
    } else {
      user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: { id: true, email: true, password: true, name: true, role: true, isActive: true },
      });
    }

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Account is inactive" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error: any) {
    console.error("[auth/login] error", error);
    return NextResponse.json(
      { error: "Failed to authenticate" },
      { status: 500 }
    );
  }
}

