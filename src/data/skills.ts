// data/skills.ts
export type SkillGroup = {
  category: string;
  icon: string; // lucide icon name
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    icon: "Code2",
    skills: ["Python", "JavaScript (ES6+)", "TypeScript", "C++", "HTML5", "CSS3"],
  },
  {
    category: "AI & Machine Learning",
    icon: "Brain",
    skills: ["TensorFlow", "Keras", "CNN", "LLM pipelines", "RAG", "Gemini", "Ollama"],
  },
  {
    category: "Frontend",
    icon: "Monitor",
    skills: ["React.js", "Next.js", "Tailwind CSS", "Framer Motion", "Zustand", "Zod"],
  },
  {
    category: "Backend",
    icon: "Server",
    skills: ["Node.js", "Express.js", "Flask", "REST APIs", "Prisma ORM"],
  },
  {
    category: "AI / ML",
    icon: "Brain",
    skills: [
      "TensorFlow",
      "Keras",
      "CNN",
      "Deep Learning",
      "Gemini LLM",
      "Ollama",
      "RAG",
      "Image Recognition",
      "LLM APIs",
    ],
  },
  {
    category: "Databases & Tools",
    icon: "Database",
    skills: ["PostgreSQL", "SQLite", "Prisma", "VS Code", "PyCharm", "Kaggle"],
  },
  {
    category: "Other",
    icon: "Sparkles",
    skills: [
      "Web Scraping",
      "Vibe Coding",
      "Speech Recognition",
      "MS Office",
      "Windows Troubleshooting",
    ],
  },
];

