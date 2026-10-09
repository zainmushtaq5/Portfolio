"use client";

import { useEffect, useRef } from "react";
import { achievements } from "@/data/achievements";
import { Trophy, GraduationCap, BookOpen, Briefcase, Code2, School } from "lucide-react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const IconMap: Record<string, React.ElementType> = {
  Trophy, GraduationCap, BookOpen, Briefcase, Code2, School
};

export function AchievementsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const mobileLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (!containerRef.current) return;

    const items = gsap.utils.toArray<HTMLElement>('.timeline-item');

    // Animate the central lines growing
    if (lineRef.current) {
      gsap.fromTo(lineRef.current, 
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 0.5,
          }
        }
      );
    }
    
    if (mobileLineRef.current) {
      gsap.fromTo(mobileLineRef.current, 
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 0.5,
          }
        }
      );
    }

    // Animate each item
    items.forEach((item, i) => {
      const isLeft = i % 2 === 0;
      gsap.fromTo(item,
        { 
          opacity: 0, 
          x: isLeft ? -50 : 50 
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section className="py-24 relative overflow-hidden bg-background" id="achievements">
      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">
            Journey & <span className="text-primary">Achievements</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Milestones, education, and professional experiences that shaped my path.
          </p>
        </motion.div>

        <div className="relative" ref={containerRef}>
          {/* Central Line (Desktop) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 origin-top hidden md:block" ref={lineRef} />

          {/* Mobile Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border origin-top md:hidden" ref={mobileLineRef} />

          <div className="flex flex-col gap-12 md:gap-24">
            {achievements.map((achievement, index) => {
              const Icon = IconMap[achievement.icon] || Trophy;
              const isEven = index % 2 === 0;

              return (
                <div 
                  key={index} 
                  className={`timeline-item relative flex flex-col md:flex-row items-start ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-8 md:left-1/2 w-10 h-10 -translate-x-1/2 rounded-full bg-background border-4 border-primary flex items-center justify-center z-10 shadow-[0_0_15px_rgba(198,244,50,0.5)]">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>

                  {/* Content Box */}
                  <div className={`w-full md:w-1/2 pl-24 md:pl-0 ${isEven ? "md:pr-16 text-left md:text-right" : "md:pl-16 text-left"}`}>
                    <div className="bg-[#13131A] p-6 md:p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-colors shadow-lg group">
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-mono rounded-full mb-4">
                        {achievement.year}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold font-display mb-2 text-foreground group-hover:text-primary transition-colors">
                        {achievement.title}
                      </h3>
                      <h4 className="text-muted-foreground font-medium mb-4">
                        {achievement.org}
                      </h4>
                      <p className="text-muted-foreground/80 leading-relaxed">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
