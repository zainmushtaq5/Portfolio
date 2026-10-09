import { NextResponse } from "next/server";
import { after } from "next/server";
import prisma from "@/lib/db";
import { GoogleGenAI } from "@google/genai";
import { buildSystemPrompt } from "@/lib/chatbot-prompt";
import { personal } from "@/data/personal";
import { OVERVIEW } from "@/data/overview";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const rawIp = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || "unknown";
    const ip = rawIp.split(",")[0].trim();
    
    if (false) {
      const minuteAgo = new Date(Date.now() - 60000);
      const dayAgo = new Date(Date.now() - 86400000);
      
      try {
        after(async () => {
          await prisma.rateLimitRequest.deleteMany({
            where: { createdAt: { lt: dayAgo } }
          }).catch(() => {});
        });

        const [minuteCount, dayCount] = await Promise.all([
          prisma.rateLimitRequest.count({ where: { ip, createdAt: { gte: minuteAgo } } }),
          prisma.rateLimitRequest.count({ where: { ip, createdAt: { gte: dayAgo } } })
        ]);
        
        if (minuteCount >= 10) {
          return NextResponse.json({ error: "Per-minute rate limit exceeded. Please wait a moment." }, { status: 429 });
        }
        if (dayCount >= 40) {
          return NextResponse.json({ error: "Per-day rate limit exceeded. Please try again tomorrow." }, { status: 429 });
        }
        
        await prisma.rateLimitRequest.create({ data: { ip } });
      } catch (dbError) {
        console.error("DB Error (Rate Limit):", dbError);
        return NextResponse.json({ error: "Service temporarily unavailable (Database unreachable). Please try again." }, { status: 503 });
      }
    }

    const body = await req.json();
    const { messages, sessionId } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1]?.content;
    if (!lastMessage || lastMessage.length > 500) {
      return NextResponse.json({ error: "Message too long or empty (max 500 characters)" }, { status: 400 });
    }

    try {
      const sessionCount = await prisma.message.count({ where: { sessionId, role: "user" } });
      if (sessionCount >= 20) {
        return NextResponse.json({ error: "Session limit reached. Please start a new conversation." }, { status: 429 });
      }

      await prisma.chatSession.upsert({
        where: { sessionId },
        update: {},
        create: { sessionId },
      });

      await prisma.message.create({
        data: {
          sessionId,
          role: "user",
          content: lastMessage,
        },
      });
    } catch (dbError) {
      console.error("DB Error (Session/Message Save):", dbError);
      return NextResponse.json({ error: "Service temporarily unavailable (Database unreachable). Please try again." }, { status: 503 });
    }

    // Embed current + previous user message
    const previousUserMessage = messages.slice(-3, -1).find((m: { role: string; content: string }) => m.role === "user")?.content || "";
    const embedText = previousUserMessage ? `${previousUserMessage}\n${lastMessage}` : lastMessage;

    let queryEmbedding: number[] = [];
    try {
      const embedRes = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: embedText,
      });
      queryEmbedding = embedRes.embeddings?.[0]?.values || [];
    } catch (e) {
      console.error("Embedding Error:", e);
    }

    let retrievedChunks: { id: string; title: string; text: string }[] = [];
    if (queryEmbedding.length > 0) {
      const dbChunks = await prisma.knowledgeChunk.findMany();
      const dotProduct = (a: number[], b: number[]) => a.reduce((sum, val, i) => sum + val * b[i], 0);
      const magnitude = (a: number[]) => Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
      
      const scoredChunks = dbChunks.map(chunk => {
        const dp = dotProduct(queryEmbedding, chunk.embedding);
        const magQ = magnitude(queryEmbedding);
        const magC = magnitude(chunk.embedding);
        const sim = (magQ && magC) ? dp / (magQ * magC) : 0;
        return { ...chunk, sim };
      });
      
      // Top 6 chunks by similarity, removing arbitrary threshold
      const topChunks = scoredChunks
        .sort((a, b) => b.sim - a.sim)
        .slice(0, 6);
        
      retrievedChunks = topChunks.map(c => ({
          id: c.id,
          title: c.title,
          text: c.content
      }));
    }

    const systemPrompt = buildSystemPrompt({
        ownerName: personal.firstName,
        overview: OVERVIEW,
        chunks: retrievedChunks,
        canary: "[CANARY_SECRET_77X_DO_NOT_REVEAL]"
    });

    // Send last 8 turns only (16 messages total)
    const contextWindow = messages.slice(-16);

    const formattedMessages = contextWindow.map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    if (formattedMessages.length > 0 && formattedMessages[0].role === "model") {
      formattedMessages.shift();
    }

    let assistantReply = "";
    after(async () => {
      if (assistantReply) {
        await prisma.message.create({
          data: {
            sessionId,
            role: "assistant",
            content: assistantReply,
          },
        }).catch(err => console.error("DB Save Error:", err));
      }
    });

    let MODEL = process.env.GEMINI_MODEL;
    if (!MODEL) MODEL = "gemini-3.5-flash";
    const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || "gemini-3.5-flash-lite";

    if (!MODEL) {
      console.error("GEMINI_MODEL missing");
      return NextResponse.json({ error: "AI model configuration is missing on the server. Please try again later." }, { status: 500 });
    }

    const configOptions = {
        systemInstruction: systemPrompt,
        temperature: 0.6,
        topP: 0.9,
        maxOutputTokens: 2048
    };

    let responseStream;
    try {
      responseStream = await ai.models.generateContentStream({
        model: MODEL,
        contents: formattedMessages,
        config: configOptions as Record<string, unknown>,
      });
    } catch (apiError: unknown) {
      const err = apiError as { status?: number; message?: string };
      const status = err.status || 500;
      const reason = err.message || "Unknown error";
      
      // If 400 with thinkingConfig error, fallback to model without thinkingConfig
      if (status === 400 && reason.includes("thinking")) {
          console.warn(`[CHAT] Model ${MODEL} rejected thinkingConfig, retrying without it.`);
          const fallbackConfig = { ...configOptions };
          delete (fallbackConfig as Record<string, unknown>).thinkingConfig;
          responseStream = await ai.models.generateContentStream({
              model: MODEL,
              contents: formattedMessages,
              config: fallbackConfig as Record<string, unknown>,
          });
      } else if (FALLBACK_MODEL && (status === 429 || status === 404 || status === 503 || status === 504 || status >= 500)) {
        console.warn(`[CHAT] Primary model ${MODEL} failed (${status}: ${reason}). Retrying with fallback ${FALLBACK_MODEL} after 1s...`);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          const fallbackConfig = { ...configOptions };
          delete (fallbackConfig as Record<string, unknown>).thinkingConfig; // safe fallback
          responseStream = await ai.models.generateContentStream({
            model: FALLBACK_MODEL,
            contents: formattedMessages,
            config: fallbackConfig as Record<string, unknown>,
          });
        } catch (fallbackError: unknown) {
          console.error(`[CHAT] Fallback model ${FALLBACK_MODEL} failed`, fallbackError);
          return NextResponse.json({ error: "AI is currently unavailable. Please try again later." }, { status: 503 });
        }
      } else {
        console.error(`[CHAT] Gemini API Error with ${MODEL} (${status}: ${reason})`);
        return NextResponse.json({ error: "AI is currently unavailable. Please try again later." }, { status: 503 });
      }
    }

    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    (async () => {
      try {
        if (!responseStream) return;
        for await (const chunk of responseStream) {
          if (chunk.text) {
            assistantReply += chunk.text;
            await writer.write(encoder.encode(chunk.text));
          }
        }
      } catch (e) {
        console.error("Stream error:", e);
      } finally {
        await writer.close();
      }
    })();

    const topChunkTitle = retrievedChunks.length > 0 ? retrievedChunks[0].title : "";
    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Top-Chunk": encodeURIComponent(topChunkTitle),
      },
    });

  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    const err = error as Error;
    return NextResponse.json({ error: "Failed to process chat: " + (err.message || String(error)), stack: err.stack }, { status: 500 });
  }
}
