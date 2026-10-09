import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signSessionPayload } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const rawIp = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || "unknown";
    const ip = `login_${rawIp.split(",")[0].trim()}`;

    // Rate Limit: 5 attempts per minute
    const minuteAgo = new Date(Date.now() - 60000);
    const minuteCount = await prisma.rateLimitRequest.count({ where: { ip, createdAt: { gte: minuteAgo } } });
    
    if (minuteCount >= 5) {
      return NextResponse.redirect(new URL("/admin/login?error=ratelimit", req.url));
    }
    await prisma.rateLimitRequest.create({ data: { ip } });

    const formData = await req.formData();
    const password = formData.get("password");

    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!correctPassword || password !== correctPassword) {
      return NextResponse.redirect(new URL("/admin/login?error=invalid", req.url));
    }

    const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    const token = signSessionPayload(exp);
    
    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    return NextResponse.redirect(new URL("/admin", req.url));
  } catch {
    return NextResponse.redirect(new URL("/admin/login?error=server", req.url));
  }
}
