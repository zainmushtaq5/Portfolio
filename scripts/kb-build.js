/* eslint-disable */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { GoogleGenAI } = require('@google/genai');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const EMBED_MODEL = "gemini-embedding-001"; // or gemini-embedding-2

async function generateEmbedding(text) {
  const response = await ai.models.embedContent({
    model: EMBED_MODEL,
    contents: text
  });
  return response.embeddings[0].values;
}

const dataDir = path.join(__dirname, '../src/data');

function extractChunks() {
  const chunks = [];
  
  // 1. Personal & Contact
  const personalContent = fs.readFileSync(path.join(dataDir, 'personal.ts'), 'utf8');
  chunks.push({
    title: 'Zain Mushtaq Awan Identity & Contact',
    source: 'personal.ts',
    content: `I am Zain Mushtaq Awan, a Full-Stack Software Engineer specializing in Generative AI, MERN stack, Next.js, and Python. Contact: zainmushtaqawan1@gmail.com, Location: Lahore, Pakistan. Availability: Open to work. Links: GitHub: https://github.com/zainmushtaqawan, LinkedIn: https://linkedin.com/in/zain-mushtaq-awan`
  });

  // 2. Projects
  const projectsContent = fs.readFileSync(path.join(dataDir, 'projects.ts'), 'utf8');
  if (projectsContent.includes('Al-Shifa')) {
    chunks.push({
      title: 'Project: Al-Shifa Hospital Appointment Chatbot',
      source: 'projects.ts',
      content: `Al-Shifa Hospital Appointment Chatbot is a chatbot built with Next.js, Node.js, Dialogflow, Twilio, and Gemini API. It handles booking appointments naturally via WhatsApp or web.`
    });
  }
  if (projectsContent.includes('Plant Disease')) {
    chunks.push({
      title: 'Project: Plant Disease Detection System',
      source: 'projects.ts',
      content: `Plant Disease Detection System is an end-to-end Machine Learning pipeline using FastAPI, React Native, and PyTorch (ResNet/CNN). It detects crop diseases from photos with 96% accuracy.`
    });
  }

  // 3. Services
  const servicesContent = fs.readFileSync(path.join(dataDir, 'services.ts'), 'utf8');
  chunks.push({
    title: 'Services & Offerings',
    source: 'services.ts',
    content: `My services include: 1. Full-Stack Web Apps (React, Next.js, Node.js, DBs). 2. AI Chatbots & RAG (OpenAI, Gemini, LangChain, Vector DBs). 3. Machine Learning models (Python, PyTorch). My process: Discovery -> Architecture -> Development -> Delivery.`
  });

  return chunks;
}

async function run() {
  try {
    const chunks = extractChunks();
    console.log(`Extracted ${chunks.length} chunks.`);

    for (const chunk of chunks) {
      const hash = crypto.createHash('sha256').update(chunk.content).digest('hex');
      
      const existing = await prisma.knowledgeChunk.findUnique({ where: { hash } });
      if (existing) {
        console.log(`Chunk already exists: ${chunk.title}`);
        continue;
      }

      console.log(`Embedding: ${chunk.title}`);
      const embedding = await generateEmbedding(chunk.content);
      
      await prisma.knowledgeChunk.create({
        data: {
          hash,
          title: chunk.title,
          source: chunk.source,
          content: chunk.content,
          embedding
        }
      });
      console.log(`Saved: ${chunk.title}`);
    }
  } catch (error) {
    console.error('Build error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
