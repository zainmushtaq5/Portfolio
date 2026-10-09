import { projects } from "@/data/projects";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, CheckCircle2 } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import Link from "next/link";
import Image from "next/image";
import fs from "fs";
import path from "path";

import { buildMetadata, projectJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return buildMetadata({ title: "Project Not Found", description: "Not found", path: `/projects/${params.slug}` });
  
  return buildMetadata({
    title: `${project.title}: Case Study`,
    description: project.tagline,
    path: `/projects/${project.slug}`,
    type: "article",
  });
}

export default function ProjectCaseStudy({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);
  
  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <JsonLd data={projectJsonLd({
        name: project.title,
        description: project.tagline,
        path: `/projects/${project.slug}`,
        keywords: project.tech,
        liveUrl: project.liveUrl,
        image: project.image,
      })} />
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Projects", path: "/projects" },
        { name: project.title, path: `/projects/${project.slug}` }
      ])} />

      {/* Hero */}
      <div className="pt-32 pb-16 px-6 border-b border-white/5 bg-[#0A0A0F]">
        <div className="container mx-auto max-w-4xl">
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to projects
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-mono text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
              {project.category}
            </span>
            <span className="text-sm text-muted-foreground">{project.year}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
            {project.title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
            {project.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-10">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#13131A] hover:bg-white/5 border border-white/10 px-6 py-3 rounded-xl transition-colors font-medium">
                <GithubIcon className="w-5 h-5" /> View Source
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-primary text-[#0A0A0F] hover:bg-primary/90 px-6 py-3 rounded-xl transition-colors font-bold">
                <ExternalLink className="w-5 h-5" /> Live Demo
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Large Image Section */}
      <div className="container mx-auto px-6 max-w-5xl -mt-10 relative z-10">
        {(() => {
          const publicPath = path.join(process.cwd(), "public", project.image.replace(/^\//, ""));
          const imageExists = fs.existsSync(publicPath);
          
          if (!imageExists) {
            if (process.env.NODE_ENV === "development") {
              console.warn(`[Dev Warning] Missing image for project: ${project.slug} at ${publicPath}`);
            }
            return null;
          }

          return (
            <div className="w-full flex justify-center mb-16 relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(198,244,50,0.15),transparent_70%)] blur-2xl pointer-events-none" />
              {project.imageKind === "phone" ? (
                <div className="relative w-full max-w-[390px] aspect-[390/844] rounded-[2rem] border-[8px] border-[#1a1a1a] bg-background shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-10 mx-auto">
                  <Image src={project.image} alt={project.imageAlt || project.title} fill sizes="(max-width: 768px) 100vw, 390px" priority className="object-cover" />
                </div>
              ) : project.imageKind === "screenshot" ? (
                <div className="relative w-full rounded-xl border border-white/10 bg-background shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-10 flex flex-col">
                  <div className="h-8 w-full bg-[#1a1a1a] border-b border-white/5 flex items-center px-4 gap-2 shrink-0">
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                    <div className="ml-4 flex-1 mx-4 bg-white/5 rounded h-5 max-w-[300px] flex items-center px-3">
                      <span className="text-[10px] font-mono text-muted-foreground truncate">{project.liveUrl ? new URL(project.liveUrl).hostname : project.title}</span>
                    </div>
                  </div>
                  <div className="relative w-full aspect-[16/10] bg-muted">
                    <Image src={project.image} alt={project.imageAlt || project.title} fill sizes="(max-width: 1024px) 100vw, 1024px" priority className="object-cover object-top" />
                  </div>
                </div>
              ) : (
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10">
                  <Image src={project.image} alt={project.imageAlt || project.title} fill sizes="(max-width: 1024px) 100vw, 1024px" priority className="object-cover" />
                </div>
              )}
            </div>
          );
        })()}
      </div>

      <div className="container mx-auto px-6 max-w-4xl pt-8">
        <div className="grid md:grid-cols-3 gap-12">
          
          <div className="md:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-display font-bold mb-6">Overview</h2>
              <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">
                {project.description}
              </p>
            </section>

            {project.problem && (
              <section>
                <h2 className="text-2xl font-display font-bold mb-6">The Problem</h2>
                <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">
                  {project.problem}
                </p>
              </section>
            )}

            {project.approach && (
              <section>
                <h2 className="text-2xl font-display font-bold mb-6">Approach & Stack</h2>
                <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">
                  {project.approach}
                </p>
              </section>
            )}

            {project.results && (
              <section>
                <h2 className="text-2xl font-display font-bold mb-6">Results</h2>
                <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">
                  {project.results}
                </p>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-display font-bold mb-6">Key Highlights</h2>
              <ul className="space-y-4">
                {project.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-lg leading-relaxed">{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-[#13131A] border border-white/5 rounded-2xl p-6">
              <h3 className="font-display font-bold text-lg mb-4">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span key={tech} className="bg-[#0A0A0F] border border-white/10 px-3 py-1.5 rounded-lg text-sm text-muted-foreground">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-[#13131A] border border-white/5 rounded-2xl p-6">
              <h3 className="font-display font-bold text-lg mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs font-mono uppercase tracking-wider text-primary/80">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
