import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const leadSchema = z.object({
  email: z.string().email().max(100),
  source: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const { email, source } = parsed.data;

    // Save Lead to DB
    await prisma.lead.upsert({
      where: { email },
      update: { source: source || "chatbot" },
      create: { email, source: source || "chatbot" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead API Error:", error);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}
