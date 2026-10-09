"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProjectCard } from "@/components/ProjectCard";

const categories = ["all", "featured", "ai", "tools"];

interface ProjectsSectionProps {
  imageExistenceMap: Record<string, boolean>;
}

export function ProjectsSection({ imageExistenceMap }: ProjectsSectionProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProjects = projects.filter(
    (p) => activeCategory === "all" || p.category === activeCategory
  ).slice(0, 4); // Take 4 to build the specific bento layout (1 large, 2 medium, 1 wide)

  // Layout assignment based on index to achieve:
  // [ Large (col-span-8 row-span-2) ] [ Medium (col-span-4) ]
  //                                   [ Medium (col-span-4) ]
  // [ Wide (col-span-12)                                    ]
  
  const getBentoClasses = (index: number) => {
    switch(index) {
      case 0: return "md:col-span-8 md:row-span-2 h-[600px]"; // Large
      case 1: return "md:col-span-4 h-[288px]"; // Medium 1
      case 2: return "md:col-span-4 h-[288px]"; // Medium 2
      case 3: return "md:col-span-12 h-[350px]"; // Wide
      default: return "md:col-span-6 h-[300px]"; // Fallback
    }
  };

  return (
    <section className="py-32 container mx-auto px-6" id="projects">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
        <div>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-4">
            Selected <span className="text-primary">Work</span>.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Real-world systems built with modern stacks.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-medium transition-all",
                activeCategory === cat 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-auto">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, idx) => (
            <div key={project.slug} className={getBentoClasses(idx)}>
              <ProjectCard 
                project={project} 
                imageExists={!!imageExistenceMap[project.slug]} 
                isBento={true} 
                priority={idx === 0}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="mt-16 text-center">
        <Link href="/projects" className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-border hover:border-primary text-foreground hover:text-primary transition-colors">
          View All Projects <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  );
}
