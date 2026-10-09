"use client";

import { motion, useScroll, useTransform } from "framer-motion";

import { projects } from "@/data/projects";
import { stats, personal } from "@/data/personal";
import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export function HeroSection({ hasVideo = true }: { hasVideo?: boolean }) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, 150]);
  const y3 = useTransform(scrollY, [0, 1000], [0, 100]);

  // Framer motion variants for text reveal
  const container: import("framer-motion").Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const item: import("framer-motion").Variants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  return (
    <section className="relative min-h-[100svh] w-full bg-[#0A0A0F] overflow-hidden flex flex-col justify-center pt-24 pb-12 lg:pt-0 lg:pb-8" id="hero">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#0A0A0F_100%)] z-20" />

        {/* Simplified noise overlay */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay z-30 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:4px_4px]" />

        {/* Faint Lime Glow behind right column */}
        <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-primary/5 shadow-[0_0_100px_50px_rgba(150,255,0,0.1)] z-10 hidden lg:block" />

        {/* Optional video slot - kept underneath overlays */}
        {hasVideo && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            className="w-full h-full object-cover opacity-20 hidden lg:block"
            poster="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        )}
      </div>

      <div className="container relative z-40 px-6 mx-auto h-full flex flex-col justify-center flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column (1-7) */}
          <motion.div
            className="lg:col-span-7 flex flex-col items-start text-left pb-10 lg:pb-0 xl:pb-10"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Status Pill */}
            <motion.div variants={item} className="flex items-center gap-2 mb-8 lg:mb-4 xl:mb-8 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Open for freelance</span>
            </motion.div>

            {/* Name/Role */}
            <motion.div variants={item} className="mb-6 lg:mb-4 xl:mb-6">
              <p className="font-mono text-xs md:text-sm tracking-widest text-muted-foreground uppercase">
                ZAIN AWAN / AI + FULL-STACK DEV
              </p>
            </motion.div>

            {/* Headline */}
            <motion.div variants={item} className="font-display font-bold leading-[1.1] mb-8 lg:mb-5 xl:mb-8">
              <span className="block text-3xl md:text-5xl lg:text-5xl xl:text-6xl text-muted-foreground/60 tracking-tight">I BUILD</span>
              <span className="block text-5xl md:text-7xl lg:text-6xl xl:text-[5.5rem] text-transparent tracking-tighter" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.8)" }}>AI-POWERED</span>
              <span className="block text-4xl md:text-6xl lg:text-5xl xl:text-[5rem] tracking-tight text-white mt-2 lg:mt-1 xl:mt-2">
                WEB <span className="text-primary">PRODUCTS.</span>
              </span>
            </motion.div>

            {/* Subtitle */}
            <motion.p variants={item} className="text-lg md:text-xl lg:text-base xl:text-xl text-muted-foreground max-w-xl lg:max-w-md xl:max-w-xl mb-10 lg:mb-6 xl:mb-10 font-body leading-relaxed">
              I deliver production-ready deep learning models and wrap them in robust, pixel-perfect web applications for startups and businesses.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
              <Link href="/contact" className="w-full sm:w-auto rounded-none bg-primary text-[#0A0A0F] hover:bg-primary/90 font-bold tracking-wide h-14 px-8 border border-primary relative group overflow-hidden inline-flex items-center justify-center transition-colors">
                <span className="relative z-10">Hire Me</span>
                <div className="absolute inset-0 h-full w-full bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              </Link>

              <Link href="/projects" className="w-full sm:w-auto rounded-none border border-white/20 hover:bg-white/5 text-foreground h-14 px-8 backdrop-blur-sm inline-flex items-center justify-center transition-colors">
                See My Work
              </Link>

              <a href={personal.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">
                <Sparkles size={16} className="text-primary" /> View CV
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column (8-12) - Tilted Cards */}
          <div className="lg:col-span-5 relative h-[500px] lg:h-[450px] xl:h-[650px] hidden md:block perspective-1000 ">
            <h2 className="sr-only">Featured Work</h2>
            <div className="absolute inset-0 flex items-center justify-center transform-style-3d">
              {/* Card 1: Al-Shifa (Front) */}
              <motion.div style={{ y: y1 }} className="absolute z-[50]">
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                    rotateZ: [-5, -3, -5]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="w-72 md:w-96 p-5 bg-[#13131A] border border-white/10 rounded-2xl shadow-2xl translate-y-12 translate-x-4 hover:scale-105 transition-transform duration-300 cursor-pointer group"
                >
                  <div className="h-40 md:h-48 bg-muted/20 rounded-lg mb-5 overflow-hidden relative flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(198,244,50,0.15)] transition-shadow">
                    <Image src={projects[1].image} alt={projects[1].title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-display font-semibold text-xl">{projects[1].title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mt-2">{projects[1].tagline}</p>
                </motion.div>
              </motion.div>

              {/* Card 2: Plant Disease (Middle) */}
              <motion.div style={{ y: y2 }} className="absolute z-[40]">
                <motion.div
                  animate={{
                    y: [0, 20, 0],
                    rotateZ: [8, 10, 8]
                  }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="w-72 md:w-96 p-5 bg-[#13131A] border border-white/10 rounded-2xl shadow-xl -translate-y-24 -translate-x-12 hover:scale-105 transition-transform duration-300 cursor-pointer opacity-90 hover:opacity-100 hover:z-[60] group"
                >
                  <div className="h-40 md:h-48 bg-muted/20 rounded-lg mb-5 overflow-hidden relative flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(198,244,50,0.15)] transition-shadow">
                    <Image src={projects[0].image} alt={projects[0].title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-display font-semibold text-xl">{projects[0].title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mt-2">{projects[0].tagline}</p>
                </motion.div>
              </motion.div>

              {/* Card 3: Text to Motion (Back) */}
              <motion.div style={{ y: y3 }} className="absolute z-[30]">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotateZ: [-12, -10, -12]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="w-64 md:w-80 p-5 bg-[#13131A] border border-white/10 rounded-2xl shadow-lg -translate-y-48 translate-x-24 hover:scale-105 transition-transform duration-300 cursor-pointer opacity-70 hover:opacity-100 hover:z-[60] group"
                >
                  <div className="h-32 md:h-40 bg-muted/20 rounded-lg mb-5 overflow-hidden relative flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-shadow">
                    <Image src={projects[2].image} alt={projects[2].title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-display font-semibold text-lg">{projects[2].title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-2">{projects[2].tagline}</p>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Mobile Swipe Row for Cards */}
          <div className="md:hidden flex overflow-x-auto gap-4 pb-8 w-[100vw] -mx-6 px-6 snap-x hide-scrollbar">
            <h2 className="sr-only">Featured Work Mobile</h2>
            {projects.slice(0, 3).map((project, idx) => (
              <div key={idx} className="min-w-[85vw] snap-center bg-[#13131A] border border-white/10 rounded-2xl p-5 shadow-lg">
                <div className="h-48 bg-muted/20 rounded-lg mb-5 overflow-hidden relative">
                  <Image src={project.image} alt={project.title} fill className="object-cover opacity-80" />
                </div>
                <h3 className="font-display font-semibold text-xl">{project.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mt-2">{project.tagline}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom Stats & Marquee Strip */}
      <div className="relative z-40 w-full mt-auto border-t border-white/10 bg-background/50 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-stretch">

          {/* Stats */}
          <div className="flex divide-x divide-white/10 md:w-1/2">
            {stats.slice(0, 3).map((stat) => (
              <div key={stat.label} className="flex-1 py-4 px-6 flex flex-col justify-center">
                <span className="text-xl md:text-2xl font-display font-bold text-primary">
                  {stat.displayValue ?? stat.value}{stat.suffix}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Tech Marquee */}
          <div className="md:w-1/2 border-t md:border-t-0 md:border-l border-white/10 py-4 px-6 flex items-center overflow-hidden relative bg-white/[0.02]">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />

            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
              className="flex whitespace-nowrap gap-12 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>NEXT.JS</span>
              <span>PYTHON</span>
              <span>TENSORFLOW</span>
              <span>REACT</span>
              <span>GEMINI API</span>
              <span>PRISMA</span>
              <span>TAILWIND CSS</span>
              <span>OLLAMA</span>
              {/* Duplicate for seamless loop */}
              <span>NEXT.JS</span>
              <span>PYTHON</span>
              <span>TENSORFLOW</span>
              <span>REACT</span>
              <span>GEMINI API</span>
              <span>PRISMA</span>
              <span>TAILWIND CSS</span>
              <span>OLLAMA</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add hide-scrollbar utility locally */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
      `}} />
    </section>
  );
}
