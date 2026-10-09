import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ContactSection } from "@/components/sections/ContactSection";
import dynamic from "next/dynamic";
const AchievementsSection = dynamic(
  () => import("@/components/sections/AchievementsSection").then(mod => mod.AchievementsSection),
  {
    loading: () => <div className="min-h-[800px] w-full flex items-center justify-center bg-[#0A0A0F]"><div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>
  }
);

import fs from "fs";
import path from "path";

export default async function Home() {
  const videoExists = fs.existsSync(path.join(process.cwd(), "public", "hero-video.mp4"));

  // Check image existence for projects
  const { projects } = await import("@/data/projects");
  const imageExistenceMap: Record<string, boolean> = {};
  for (const project of projects) {
    if (project.image) {
      const publicPath = path.join(process.cwd(), "public", project.image.replace(/^\//, ""));
      const exists = fs.existsSync(publicPath);
      imageExistenceMap[project.slug] = exists;
      if (!exists && process.env.NODE_ENV === "development") {
        console.warn(`[Dev Warning] Missing image for project: ${project.slug} at ${publicPath}`);
      }
    }
  }

  return (
    <div className="flex flex-col w-full">
      <HeroSection hasVideo={videoExists} />
      <AboutSection />
      <ProjectsSection imageExistenceMap={imageExistenceMap} />
      <ServicesSection />

      <AchievementsSection />
      <ContactSection />
      {/* Removed coming soon section */}
    </div>
  );
}
