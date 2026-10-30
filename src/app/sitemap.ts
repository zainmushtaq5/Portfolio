import { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "", priority: 1.0 },
    { path: "/projects", priority: 0.9 },
    { path: "/services", priority: 0.8 },
    { path: "/about", priority: 0.7 },
    { path: "/achievements", priority: 0.7 },
    { path: "/contact", priority: 0.6 },
    { path: "/resume", priority: 0.5 },
  ].map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date("2025-10-01"),
    changeFrequency: "monthly" as const,
    priority: route.priority,
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: new Date("2025-10-01"),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes];
}
