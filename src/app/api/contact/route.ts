import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Simple in-memory rate limiting (Note: In a serverless env like Vercel, this resets per lambda cold start)
const rateLimit = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 3;

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    
    // Rate Limit Check
    const now = Date.now();
    const userLimit = rateLimit.get(ip) || { count: 0, lastReset: now };
    
    if (now - userLimit.lastReset > RATE_LIMIT_WINDOW) {
      userLimit.count = 0;
      userLimit.lastReset = now;
    }
    
    if (userLimit.count >= MAX_REQUESTS) {
      return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 });
    }
    
    userLimit.count += 1;
    rateLimit.set(ip, userLimit);

    const body = await req.json();
    const { name, email, projectType, budget, message, _honeypot } = body;

    // Honeypot check
    if (_honeypot) {
      // Bot detected, silently accept but don't save
      return NextResponse.json({ success: true });
    }

    // Input length caps
    if (!name || name.length > 100) return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    if (!email || email.length > 100) return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    if (!message || message.length > 2000) return NextResponse.json({ error: "Message too long" }, { status: 400 });

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject: `${projectType} - ${budget}`,
        body: message,
      },
    });

    // Optional: Send email via Resend here if API key is present

    return NextResponse.json({ success: true, id: contactMessage.id });
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
