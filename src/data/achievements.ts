// data/achievements.ts
export type Achievement = {
  year: number | string;
  title: string;
  org: string;
  description: string;
  icon: string; // lucide icon name
  type: "certification" | "education" | "internship" | "award";
};

export const achievements: Achievement[] = [
  {
    year: "July 2026 - Present",
    title: "Frontend Developer Intern",
    org: "Techsila",
    description:
      "Frontend developer internship building production Next.js/React apps with Zustand state management, Zod validation, and REST API integration.",
    icon: "Briefcase",
    type: "internship",
  },
  {
    year: 2026,
    title: "National IT Skill Test — 78th Percentile",
    org: "National Testing Service (NTS)",
    description:
      "Ranked in the top 22% of all test-takers nationally in the IT Skills assessment, demonstrating broad technical competency across software development and computer science domains.",
    icon: "Trophy",
    type: "award",
  },
  {
    year: 2026,
    title: "BS Computer Science — Final Year",
    org: "University of Haripur",
    description:
      "Completing a 4-year BS in Computer Science, specialising in AI/ML and full-stack development.",
    icon: "GraduationCap",
    type: "education",
  },
  {
    year: 2025,
    title: "Advanced JavaScript (ES6+) — Udemy",
    org: "Udemy",
    description:
      "Completed a comprehensive Advanced JavaScript course covering ES6+, DOM manipulation, async programming, OOP, and REST API integration.",
    icon: "BookOpen",
    type: "certification",
  },

  {
    year: 2024,
    title: "JavaScript Intern",
    org: "Linesquare Technology",
    description:
      "1-month JavaScript internship focused on real-world ES6+ tasks after the 6th semester.",
    icon: "Code2",
    type: "internship",
  },
  {
    year: 2022,
    title: "Enrolled — BS Computer Science",
    org: "University of Haripur",
    description:
      "Started the 4-year undergraduate journey in Computer Science, building foundations in programming, data structures, algorithms, and AI.",
    icon: "School",
    type: "education",
  },
];
