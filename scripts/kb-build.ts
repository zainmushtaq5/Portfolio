import { PrismaClient } from '@prisma/client';
import { GoogleGenAI } from '@google/genai';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { personal } from '../src/data/personal';
import { projects } from '../src/data/projects';
import { services, whyChooseMe, process as processSteps } from '../src/data/services';
import { achievements } from '../src/data/achievements';
import { skillGroups } from '../src/data/skills';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
const EMBED_MODEL = "gemini-embedding-001";

async function generateEmbedding(text: string) {
  const response = await ai.models.embedContent({
    model: EMBED_MODEL,
    contents: text
  });
  return response.embeddings?.[0]?.values || [];
}

function buildOverview() {
  const projList = projects.map(p => `- ${p.title}: ${p.tagline}`).join("\n");
  const servList = services.map(s => `- ${s.title}: ${s.description}`).join("\n");
  
  const overview = `Name: ${personal.name} (First name: ${personal.firstName})
Role: ${personal.roles.join(', ')}
Location: ${personal.location}
Education: ${personal.education.degree} at ${personal.education.university} (${personal.education.period}). Note: No CGPA info provided.
Focus Areas: AI-powered deep learning and full-stack web development.
Availability: ${personal.availability}
Contact: Email at ${personal.email} or via contact page (/contact).
Resume: Available at ${personal.resumeUrl} (or /resume page).
Routes: /, /about, /projects, /services, /resume, /contact, /blog.

PROJECTS:
${projList}

SERVICES:
${servList}
`;

  fs.writeFileSync(path.join(__dirname, '../src/data/overview.ts'), `export const OVERVIEW = \`${overview.replace(/`/g, '\\`')}\`;\n`);
  console.log("Built overview.");
}

function extractChunks() {
  const chunks = [];
  
  // What I do
  chunks.push({
    title: 'What I do',
    source: 'personal.ts',
    content: `I am ${personal.name}, a ${personal.roles.join(', ')}. ${personal.bio}`
  });

  // Why hire me
  chunks.push({
    title: 'Why hire me',
    source: 'services.ts',
    content: whyChooseMe.map(w => `${w.title}: ${w.body}`).join('\n')
  });

  // Services
  chunks.push({
    title: 'Services offered',
    source: 'services.ts',
    content: services.map(s => `${s.title}: ${s.description}. Deliverables: ${s.deliverables.join(', ')}`).join('\n\n')
  });

  // Process
  chunks.push({
    title: 'Working Process & Hiring Process',
    source: 'services.ts',
    content: processSteps.map(p => `${p.step} - ${p.title}: ${p.body}`).join('\n')
  });

  // Tech stack
  const stack = skillGroups.map(g => `${g.category}: ${g.skills.join(', ')}`).join('\n');
  chunks.push({
    title: 'Tech Stack Summary',
    source: 'skills.ts',
    content: `Core technologies: \n${stack}`
  });

  // Each project
  projects.forEach(p => {
    chunks.push({
      title: `Project: ${p.title}`,
      source: 'projects.ts',
      content: `Project Name: ${p.title}\nProblem/Tagline: ${p.tagline}\nDescription: ${p.description}\nTech Stack: ${p.tech.join(', ')}\nOutcomes/Highlights: ${p.highlights.join('; ')}`
    });
  });

  // Internships/experience
  chunks.push({
    title: 'Internships and Experience',
    source: 'achievements.ts',
    content: `I have completed 2 internships, including Techsila. ${whyChooseMe.find(w => w.title.includes('Internship'))?.body || ''}`
  });

  // Education
  chunks.push({
    title: 'Education',
    source: 'personal.ts',
    content: `Degree: ${personal.education.degree}\nUniversity: ${personal.education.university}\nPeriod: ${personal.education.period}`
  });

  // Contact
  chunks.push({
    title: 'Contact',
    source: 'personal.ts',
    content: `Email: ${personal.email}\nPhone: ${personal.phone}\nLocation: ${personal.location}\nGitHub: ${personal.github}\nLinkedIn: ${personal.linkedin}`
  });

  // Resume
  chunks.push({
    title: 'Resume',
    source: 'personal.ts',
    content: `My resume is available at ${personal.resumeUrl} or via the /resume route.`
  });

  // Pricing / Timeline / Availability (Neutral fallback)
  // TODO: Edit this text with your actual approach to pricing and timelines
  chunks.push({
    title: 'Pricing, Timeline, and Availability',
    source: 'manual',
    content: `Cost and timeline depend entirely on the scope of the project (features, integrations, AI needs). I discuss pricing and exact deadlines after receiving a short project brief. I am currently ${personal.availability} for freelance work or roles. Reach out via the contact form to get a custom quote and timeline.`
  });

  return chunks;
}

async function run() {
  try {
    buildOverview();
    
    const chunks = extractChunks();
    console.log(`Extracted ${chunks.length} chunks.`);

    // Clear existing to avoid stale chunks, or we can just upsert.
    await prisma.knowledgeChunk.deleteMany({});
    console.log("Cleared old chunks.");

    for (const chunk of chunks) {
      const hash = crypto.createHash('sha256').update(chunk.content).digest('hex');
      
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
