import { NextRequest, NextResponse } from "next/server";
import { supabaseServerClient } from "@/app/lib/supabaseServer";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const normalizedEmail = (email as string).trim().toLowerCase();
    const normalizedRole =
      typeof role === "string" && role.trim().length > 0 ? role.trim().toUpperCase() : "PLAYER";
    if (!["PLAYER", "AGENT", "ACADEMY", "ADMIN"].includes(normalizedRole)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    if (supabaseServerClient) {
      const { data: existingUser, error: existingError } = await supabaseServerClient
        .from("User")
        .select("id")
        .eq("email", normalizedEmail)
        .maybeSingle();
      if (existingError && existingError.code !== "PGRST116") {
        throw existingError;
      }
      if (existingUser) {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 409 }
        );
      }
    } else {
      const existing = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: { id: true },
      });
      if (existing) {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 409 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (supabaseServerClient) {
      const { data: user, error: createError } = await supabaseServerClient
        .from("User")
        .insert({
          email: normalizedEmail,
          password: hashedPassword,
          name: typeof name === "string" ? name.trim() : null,
          role: normalizedRole,
          profileData: null,
          isActive: true,
        })
        .select("id,email,name,role")
        .single();

      if (createError) {
        throw createError;
      }

      return NextResponse.json(
        {
          id: user?.id,
          email: user?.email,
          name: user?.name,
          role: user?.role,
        },
        { status: 201 }
      );
    }

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: typeof name === "string" ? name.trim() : null,
        role: normalizedRole as any,
        isActive: true,
      },
      select: { id: true, email: true, name: true, role: true },
    });

    return NextResponse.json(
      user,
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to register user" },
      { status: 500 }
    );
  }
}

