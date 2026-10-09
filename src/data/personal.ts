import { projects } from "./projects";

import { siteNumbers } from "./numbers";

export const stats = [
  { label: "Projects Completed", value: projects.length, suffix: "+" },
  { label: "Internships", value: 2, suffix: "" }, // Linesquare & Techsila
  { label: "Training Images", value: siteNumbers.trainingImages, displayValue: siteNumbers.trainingImages / 1000, suffix: "K+" },
];

export const personal = {
  name: "Zain Mushtaq",
  firstName: "Zain",
  lastName: "Awan",
  tagline: "CS Final-Year Student",
  roles: [
    "Full-Stack Developer",
    "Deep Learning Engineer",
    "AI Builder",
    "React / Next.js Dev",
  ],
  bio: `Motivated Computer Science final-year student at the University of Haripur, specialising in AI-powered deep learning and full-stack web development. I build real-world systems — from a CNN plant-disease detector trained on ${siteNumbers.trainingImages / 1000} K+ images to a hospital chatbot with a hybrid Gemini / Ollama LLM pipeline. I'm open to freelance work and junior engineering roles.`,
  email: "zainmushtaq661@gmail.com",
  phone: "0300-5179859",
  location: "Wah Cantt, Pakistan",
  availability: "Open to opportunities",
  github: "https://github.com/zainmushtaq5",
  linkedin: "https://linkedin.com/in/zain-mushtaq-375649418",
  resumeUrl: "/resume.pdf",
  education: {
    degree: "BS Computer Science",
    university: "University of Haripur",
    period: "Sep 2022 – Jun 2026",
    // cgpa: "3.26 / 4.00",
  },
} as const;
