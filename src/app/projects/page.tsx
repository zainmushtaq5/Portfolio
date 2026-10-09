import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";
import fs from "fs";
import path from "path";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = buildMetadata({
  title: "Projects: AI Chatbots, Deep Learning & Web Apps",
  description: "A complete list of my work, ranging from deep learning models to AI-powered web applications and tools.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-6 py-24 min-h-[80vh]">
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Projects", path: "/projects" }
      ])} />
      <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">All <span className="text-primary">Projects</span></h1>
      <p className="text-muted-foreground max-w-2xl mb-16 text-lg">
        A complete list of my work, ranging from deep learning models to AI-powered web applications and tools.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, idx) => {
          const publicPath = path.join(process.cwd(), "public", project.image.replace(/^\//, ""));
          const imageExists = fs.existsSync(publicPath);
          if (!imageExists && process.env.NODE_ENV === "development") {
            console.warn(`[Dev Warning] Missing image for project: ${project.slug} at ${publicPath}`);
          }
          return (
            <ProjectCard 
              key={project.slug} 
              project={project} 
              imageExists={imageExists} 
              priority={idx < 3}
            />
          );
        })}
      </div>
    </div>
  );
}
