// data/projects.ts — Edit this file to add / update projects

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  category: "featured" | "ai" | "web" | "tools";
  tags: string[];
  year: number;
  description: string;
  problem?: string; // Case study section
  approach?: string; // Case study section
  results?: string; // Case study section
  highlights: string[];
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
  image: string; // path under /public/projects/
  imageAlt?: string;
  imageKind?: "screenshot" | "phone" | "art";
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "al-shifa-chatbot",
    title: "Al-Shifa Hospital Appointment Chatbot",
    tagline: "Hybrid Gemini + Ollama LLM with RAG for offline-capable hospital booking",
    category: "featured",
    tags: ["AI", "LLM", "RAG", "Full-Stack", "Healthcare"],
    year: 2026,
    description:
      "A production-ready hospital appointment chatbot that keeps working even when the internet goes down. Built with a React/Vite frontend and an Express/Node.js + SQLite backend, it pairs Google Gemini as the primary cloud model with a local Ollama model as an automatic offline fallback — ensuring patients can always book appointments.",
    problem: "TODO: Write 100+ words about the specific problem this chatbot solves for the hospital (e.g. offline fallback necessity).",
    approach: "TODO: Write 100+ words about your architectural approach, why you chose Gemini + Ollama, and how the RAG layer works.",
    results: "TODO: State the factual results (e.g., uptime, accuracy, latency, number of users tested).",
    highlights: [
      "Hybrid online/offline LLM pipeline — zero-downtime booking",
      "RAG layer grounding answers in verified hospital FAQs",
      "Multi-turn conversational state — cancel & reschedule flows",
      "Custom NLP: parses English & Urdu/Roman-Urdu date/time",
      "Intent detection for appointment domain classification",
    ],
    tech: ["React", "Vite", "Express.js", "Node.js", "SQLite", "Gemini", "Ollama", "RAG"],
    image: "/projects/al-shifa-chatbot-art-v2.webp", 
    imageAlt: "Al-Shifa Hospital Chatbot AI Illustration",
    imageKind: "art",
    liveUrl: "https://chatbot-for-hospital-website.vercel.app/",
    featured: true,
  },
  {
    slug: "plant-disease-detection",
    title: "Plant Disease Detection System",
    tagline: `CNN deep-learning model trained on 90K+ leaf images with full-stack diagnosis app`,
    category: "featured",
    tags: ["Deep Learning", "CNN", "Flask", "React", "Computer Vision"],
    year: 2026,
    description:
      "Final-year project: a CNN-based classifier that identifies crop diseases from leaf photos with high accuracy. The full-stack app lets farmers upload an image, get an instant diagnosis, and receive actionable prevention and treatment recommendations.",
    problem: "TODO: Write 100+ words about the agricultural problem (crop yield loss) and why a deep learning solution was needed.",
    approach: "TODO: Write 100+ words about data collection, preprocessing the 90K+ Kaggle images, CNN architecture, and Flask integration.",
    results: "TODO: State the factual results (e.g., training accuracy, validation loss, inference time).",
    highlights: [
      `CNN trained on 90000+ labeled leaf images (Kaggle dataset)`,
      "High classification accuracy across multiple crop disease categories", // TODO: Add exact accuracy metric if available in CV
      "Flask REST API backend with React + Tailwind CSS frontend",
      "Actionable diagnosis — prevention & treatment advice per disease",
      "Effective team collaboration and academic presentation",
    ],
    tech: ["Python", "TensorFlow", "Keras", "CNN", "Flask", "React", "Tailwind CSS", "Kaggle"],
    image: "/projects/plant-disease-detection.webp",
    imageAlt: "Plant Disease Detection System dashboard",
    imageKind: "screenshot",
    liveUrl: "https://plant-disease-system.vercel.app/",
    featured: true,
  },
  {
    slug: "song-website",
    title: "Songs — Discover Your Next Sound",
    tagline: "Discover emerging artists, listen instantly, and download music you have permission to keep.",
    category: "web",
    tags: ["Music", "Next.js", "Web"],
    year: 2026,
    description:
      "A platform for listeners who care about where their music comes from, and artists who deserve to be heard. Browse trending tracks, stream instantly, and download music cleared by the artists.",
    problem: "TODO: Briefly explain the problem with existing streaming platforms for indie artists.",
    approach: "TODO: Explain the technical approach for audio streaming and license management.",
    results: "TODO: State factual results of the build.",
    highlights: [
      "Discover independent and emerging artists",
      "Instant streaming with no signup wall",
      "Download tracks cleared by artists",
      "Upload tracks and set license terms as an artist"
    ],
    tech: ["Next.js", "Tailwind CSS", "React"], // TODO: verify backend stack with user
    image: "/projects/song-website.webp",
    imageAlt: "Songs Platform home page",
    imageKind: "screenshot",
    liveUrl: "https://song-website-oylp-mqerq9o24-zain-awan.vercel.app/",
    featured: true,
  },
  {
    slug: "text-to-motion",
    title: "Text to Motion",
    tagline: "LLM-powered text → animated motion sequence generator",
    category: "ai",
    tags: ["AI", "LLM", "Python", "Vibe Coding"],
    year: 2025,
    description:
      "Converts natural language text prompts into animated motion sequences using an LLM API, generating visual output from plain English descriptions.",
    highlights: [
      "Natural language → animation pipeline via LLM API",
      "Visual output rendering in Python",
    ],
    tech: ["Python", "LLM API", "Vibe Coding"],
    image: "/projects/text-to-motion-v2.webp",
    imageAlt: "Text to Motion AI Video Generator Concept Art",
    imageKind: "art",
    featured: false,
  },
  {
    slug: "pdf-ocr-reader",
    title: "PDF Reader & Photo OCR",
    tagline: "Extract text from locked PDFs and scanned images via LLM Vision API",
    category: "ai",
    tags: ["OCR", "LLM Vision", "Python", "Vibe Coding"],
    year: 2025,
    description:
      "Extracts text from non-copyable PDFs and scanned images using an LLM vision API — bypassing standard OCR limitations for protected and handwritten documents.",
    highlights: [
      "Handles scanned documents where text cannot be selected",
      "LLM Vision API for high-accuracy extraction",
    ],
    tech: ["Python", "LLM Vision API", "OCR", "Vibe Coding"],
    image: "/projects/pdf-ocr-reader.webp",
    imageAlt: "PDF Reader and Photo OCR screenshot",
    imageKind: "screenshot",
    liveUrl: "https://pdf-to-voice.vercel.app/",
    featured: false,
  },
  {
    slug: "jarvis-voice-assistant",
    title: "Jarvis Voice Assistant",
    tagline: "Iron Man-inspired personal AI voice assistant",
    category: "ai",
    tags: ["Voice AI", "Speech Recognition", "LLM", "Python"],
    year: 2025,
    description:
      "A personal AI voice assistant inspired by Iron Man's Jarvis — responds to voice commands, answers queries, and performs hands-free tasks using speech recognition and an LLM API.",
    highlights: [
      "Voice command recognition and hands-free operation",
      "LLM-backed natural language responses",
    ],
    tech: ["Python", "Speech Recognition", "LLM API", "Vibe Coding"],
    image: "/projects/jarvis-voice-assistant-v2.webp",
    imageAlt: "Jarvis Voice Assistant AI Art",
    imageKind: "art",
    featured: false,
  },
  {
    slug: "bond-checker",
    title: "Prize Bond Website Checker",
    tagline: "Automated prize bond result checker",
    category: "tools",
    tags: ["Web Scraping", "Python", "Automation"],
    year: 2025,
    description:
      "Automatically scrapes prize bond results from the official government website and displays a complete draw history for any bond number.",
    highlights: [
      "Multi-year result lookup via automated web scraping",
      "Displays full draw history for any bond number",
    ],
    tech: ["Python", "Web Scraping", "Vibe Coding"],
    image: "/projects/bond-checker-v2.webp",
    imageAlt: "Prize Bond Checker Application Art",
    imageKind: "art",
    featured: false,
  },
];
