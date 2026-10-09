"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  imageExists: boolean;
  priority?: boolean;
  className?: string;
  isBento?: boolean;
}

export function ProjectCard({ project, imageExists, priority = false, className, isBento = false }: ProjectCardProps) {
  const CardWrapper = motion.div;
  const href = project.liveUrl || `/projects/${project.slug}`;
  const isExternal = !!project.liveUrl;

  return (
    <CardWrapper
      layout={isBento}
      initial={isBento ? { opacity: 0, scale: 0.95 } : undefined}
      animate={isBento ? { opacity: 1, scale: 1 } : undefined}
      exit={isBento ? { opacity: 0, scale: 0.95 } : undefined}
      transition={isBento ? { duration: 0.4 } : undefined}
      className={cn("group relative overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(198,244,50,0.15)] focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background rounded-2xl bg-[#13131A] border-white/5 hover:border-primary/50", className)}
    >
      {/* Stretched Link covering the entire card */}
      <a 
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="absolute inset-0 z-10 focus:outline-none"
        aria-label={`Open ${project.title} ${isExternal ? "live demo (opens in a new tab)" : "case study"}`}
      >
        <span className="absolute inset-0" aria-hidden="true"></span>
      </a>

      {/* Badges/Buttons above stretched link */}
      <div className="absolute top-4 right-4 z-50 flex gap-2 pointer-events-auto">
        {project.liveUrl && (
          <a 
            href={project.liveUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 bg-background/80 backdrop-blur-md border border-white/10 text-primary hover:bg-primary hover:text-primary-foreground px-3 py-1.5 rounded-full text-xs font-bold transition-colors shadow-sm relative z-50"
          >
            Live demo ↗
          </a>
        )}
        {project.githubUrl && (
          <a 
            href={project.githubUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 bg-background/80 backdrop-blur-md border border-white/10 text-primary hover:bg-primary hover:text-primary-foreground px-3 py-1.5 rounded-full text-xs font-bold transition-colors shadow-sm relative z-50"
          >
            GitHub
          </a>
        )}
      </div>

      {/* Image Area */}
      <div className={cn("relative overflow-hidden w-full bg-[#0A0A0F] border-b border-white/5", isBento ? "absolute inset-0 z-0 h-full" : "h-64 sm:h-72")}>
        {imageExists ? (
          <div className="w-full h-full relative group-hover:scale-[1.02] transition-transform duration-700 ease-out flex items-center justify-center p-4 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(198,244,50,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            {project.imageKind === "phone" ? (
              <div className="relative w-auto h-full aspect-[390/844] rounded-[2rem] border-[6px] border-[#1a1a1a] bg-background shadow-2xl overflow-hidden z-10">
                 <Image src={project.image} alt={project.imageAlt || project.title} fill sizes="(max-width: 768px) 100vw, 50vw" priority={priority} className="object-cover" />
              </div>
            ) : project.imageKind === "screenshot" ? (
              <div className="relative w-full h-full rounded-lg border border-white/10 bg-background shadow-2xl overflow-hidden z-10 flex flex-col">
                <div className="h-6 w-full bg-[#1a1a1a] border-b border-white/5 flex items-center px-3 gap-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="ml-2 flex-1 mx-4 bg-white/5 rounded h-3.5 max-w-[200px]" />
                </div>
                <div className="relative flex-1 w-full bg-muted">
                  <Image src={project.image} alt={project.imageAlt || project.title} fill sizes="(max-width: 768px) 100vw, 50vw" priority={priority} className="object-cover object-top" />
                </div>
              </div>
            ) : (
              <Image src={project.image} alt={project.imageAlt || project.title} fill sizes="(max-width: 768px) 100vw, 50vw" priority={priority} className="object-cover" />
            )}
            
            {isBento && <div className="absolute inset-0 bg-background/80 md:bg-background/40 group-hover:bg-background/80 transition-colors duration-500 z-10" />}
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/5 to-background scale-105 group-hover:scale-100 transition-transform duration-700 ease-out flex items-center justify-center">
            <span className="text-muted-foreground font-mono text-sm">Image Pending</span>
            {isBento && <div className="absolute inset-0 bg-background/80 md:bg-background/40 group-hover:bg-background/80 transition-colors duration-500 z-10" />}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className={cn("relative z-20 flex flex-col flex-1 p-6 md:p-8 justify-end", isBento && "transform md:translate-y-8 group-hover:translate-y-0 transition-transform duration-500")}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 pl-4">
            {project.tech.slice(0, 3).map(t => (
              <Badge key={t} variant="secondary" className="bg-background/80 backdrop-blur-md border-white/5 text-primary">
                {t}
              </Badge>
            ))}
          </div>
          {!isBento && <span className="text-xs text-muted-foreground font-mono">{project.year}</span>}
        </div>
        
        <h3 className="text-2xl md:text-3xl font-display font-bold mb-3 pl-4 group-hover:text-primary transition-colors">{project.title}</h3>
        
        <p className={cn("text-muted-foreground mb-6", isBento ? "md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2" : "line-clamp-2 flex-1")}>
          {project.tagline}
        </p>

        <div className="mt-auto"></div>
      </div>
    </CardWrapper>
  );
}
