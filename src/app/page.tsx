import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ContactSection } from "@/components/sections/ContactSection";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { personJsonLd, websiteJsonLd, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { personal } from "@/data/personal";

const AchievementsSection = dynamic(
  () => import("@/components/sections/AchievementsSection").then(mod => mod.AchievementsSection),
  {
    loading: () => <div className="min-h-[800px] w-full flex items-center justify-center bg-[#0A0A0F]"><div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>
  }
);

import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  // Use the absolute form to bypass the root layout title template.
  // Without this, the template "%s | Zain Awan" would produce
  // "Zain Awan | Full Stack Developer | Zain Awan" on the homepage.
  title: {
    absolute: "Zain Awan | Full Stack Developer",
  },
  description:
    "Portfolio of Zain Awan — Full Stack Developer and AI enthusiast from Pakistan. Building modern web applications with React, Next.js, and AI-powered features.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Zain Awan | Full Stack Developer",
    description:
      "Portfolio of Zain Awan — Full Stack Developer and AI enthusiast from Pakistan. Building modern web applications with React, Next.js, and AI-powered features.",
    url: SITE_URL,
    type: "website",
    siteName: "Zain Awan",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Zain Awan — Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zain Awan | Full Stack Developer",
    description:
      "Portfolio of Zain Awan — Full Stack Developer and AI enthusiast from Pakistan. Building modern web applications with React, Next.js, and AI-powered features.",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
};

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
      <JsonLd data={personJsonLd({
        name: "Zain Awan",
        alternateName: personal.name,
        jobTitle: "Full Stack Developer",
        description: personal.bio,
        sameAs: [personal.github, personal.linkedin],
        knowsAbout: [
          "Full Stack Development",
          "React",
          "Next.js",
          "TypeScript",
          "Python",
          "AI",
          "Deep Learning",
          "TensorFlow",
        ],
        alumniOf: personal.education.university,
      })} />
      <JsonLd data={websiteJsonLd("Zain Awan | Full Stack Developer")} />
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
