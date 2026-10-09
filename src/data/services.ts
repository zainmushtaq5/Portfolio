// data/services.ts
import { siteNumbers } from "./numbers";
export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  deliverables: string[];
  startingAt?: string;
};

export const services: Service[] = [
  {
    id: "fullstack",
    title: "Full-Stack Web Development",
    description:
      "End-to-end web applications built with Next.js, React, and modern backend stacks. From landing pages to SaaS products with auth, database, and API layers.",
    icon: "Globe",
    deliverables: [
      "Next.js / React frontend",
      "Node.js / Flask backend + REST API",
      "PostgreSQL / SQLite database",
      "Deployment on Vercel / Railway",
      "Source code + documentation",
    ],
    startingAt: "Contact for quote", // TODO: Adjust pricing "startingAt" or remove if you prefer not to display pricing
  },
  {
    id: "deep-learning",
    title: "Deep Learning & AI Integration",
    description:
      `Custom CNN image classifiers, LLM-powered chatbots, and AI feature integration. I've shipped a ${siteNumbers.trainingImages / 1000}K-image plant-disease detector and a hybrid Gemini/Ollama hospital chatbot.`,
    icon: "Brain",
    deliverables: [
      "Custom CNN / ML model training",
      "Flask / FastAPI model serving",
      "LLM chatbot with RAG",
      "Offline fallback pipeline",
      "Accuracy report + dataset notes",
    ],
    startingAt: "Contact for quote",
  },
  {
    id: "ai-chatbot",
    title: "AI Chatbot Development",
    description:
      "Conversational AI assistants with memory, intent detection, and multi-turn dialogue. Powered by Gemini or Ollama with a Retrieval-Augmented Generation knowledge base.",
    icon: "MessageSquare",
    deliverables: [
      "Custom LLM system prompt engineering",
      "RAG knowledge base setup",
      "Multi-turn conversation management",
      "Urdu / English NLP support",
      "Web or API integration",
    ],
    startingAt: "Contact for quote",
  },
  {
    id: "frontend",
    title: "Frontend & UI Development",
    description:
      "Pixel-perfect, animated, and responsive UIs. From marketing sites to complex dashboards using React, Next.js, Tailwind, Framer Motion, and Zustand.",
    icon: "Palette",
    deliverables: [
      "Responsive React / Next.js UI",
      "Tailwind CSS + Framer Motion animations",
      "State management with Zustand",
      "REST API integration",
      "Cross-browser testing",
    ],
    startingAt: "Contact for quote",
  },
];

export const whyChooseMe = [
  {
    icon: "Zap",
    title: "Real Projects, Real Impact",
    body: `I've shipped a CNN trained on ${siteNumbers.trainingImages / 1000} K+ images and a hospital chatbot used in production — not just tutorial clones.`,
  },
  {
    icon: "Layers",
    title: "Full-Stack + AI in One",
    body: "I handle the model, the API, and the frontend. No coordination overhead between specialists.",
  },
  {
    icon: "Shield",
    title: "Internship-Proven",
    body: `Worked at Techsila (${siteNumbers.internshipMonthsTechsila} months) building production Next.js apps — I know professional code standards.`,
  },
  {
    icon: "Clock",
    title: "Fast & Communicative",
    body: "Daily updates, clear timelines, and honest scoping. Your time is as valuable as the end product.",
  },
];

// TODO: Confirm your "Process" steps match how you want to work with clients
export const process = [
  {
    step: "01",
    title: "Discovery Call",
    body: "We talk through your goals, constraints, and timeline. I ask the hard questions upfront so there are no surprises later.",
  },
  {
    step: "02",
    title: "Scoping & Proposal",
    body: "I send a written proposal with deliverables, timeline, and fixed price. No hourly billing ambiguity.",
  },
  {
    step: "03",
    title: "Build & Update",
    body: "I build in milestones and share progress after each one. You review, give feedback, and we iterate fast.",
  },
  {
    step: "04",
    title: "Handoff & Support",
    body: `Full source code, documentation, and a ${siteNumbers.postLaunchSupportDays}-day post-launch support window. I don't disappear after delivery.`,
  },
];
