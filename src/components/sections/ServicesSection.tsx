"use client";

import { motion } from "framer-motion";
import { whyChooseMe, process } from "@/data/services";
import { Card } from "@/components/ui/card";
import { Zap, Layers, Shield, Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const IconMap: Record<string, React.ElementType> = {
  Zap, Layers, Shield, Clock
};

export function ServicesSection() {
  const getBentoClasses = (idx: number) => {
    switch (idx) {
      case 0: return "md:col-span-8 h-[250px] md:h-[300px]";
      case 1: return "md:col-span-4 h-[250px] md:h-[300px]";
      case 2: return "md:col-span-5 h-[250px] md:h-[300px]";
      case 3: return "md:col-span-7 h-[250px] md:h-[300px]";
      default: return "md:col-span-6 h-[250px]";
    }
  };

  return (
    <section className="py-32 container mx-auto px-6" id="services">
      {/* Why Choose Me */}
      <div className="mb-24">
        <div className="flex flex-col gap-4 mb-16">
          <h2 className="text-4xl md:text-6xl font-display font-bold">
            Why <span className="text-primary">Choose Me</span>.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl">
            I bring production experience, clear communication, and a full-stack skillset.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {whyChooseMe.map((item, idx) => {
            const Icon = IconMap[item.icon] || Zap;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={cn("group", getBentoClasses(idx))}
              >
                <Card className="relative overflow-hidden h-full bg-card p-8 border-border/50 hover:border-primary/40 transition-colors flex flex-col justify-between group/bento">
                  {/* Animated moving grid background */}
                  <div className="absolute inset-0 z-0 opacity-30 group-hover/bento:opacity-60 transition-opacity duration-700 pointer-events-none">
                    <motion.div
                      animate={{
                        x: [0, 40],
                        y: [0, 40],
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-[40px] bg-[linear-gradient(to_right,rgba(198,244,50,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(198,244,50,0.15)_1px,transparent_1px)] bg-[size:40px_40px]"
                      style={{
                        maskImage: "radial-gradient(ellipse at center, black 20%, transparent 80%)",
                        WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 80%)"
                      }}
                    />
                  </div>

                  <div className="relative z-10 bg-[#13131A] border border-white/5 w-fit p-3 rounded-xl text-primary mb-6 group-hover/bento:bg-primary group-hover/bento:text-[#0A0A0F] group-hover/bento:-translate-y-1 transition-all duration-300 shadow-lg">
                    <Icon size={24} />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-display font-bold mb-3 group-hover/bento:text-primary transition-colors duration-300">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.body}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* The Process */}
      <div className="mb-32">
        <div className="flex flex-col gap-4 mb-16">
          <h2 className="text-4xl md:text-6xl font-display font-bold">
            My <span className="text-primary">Process</span>.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl">
            How we go from initial idea to a shipped, production-ready product.
          </p>
        </div>

        <div className="relative border-l border-white/10 ml-4 md:ml-0 md:border-l-0">
          <div className="flex flex-col md:flex-row gap-8 md:gap-6 relative">
            {/* Horizontal line for desktop */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-white/10 z-0" />

            {process.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="flex-1 relative z-10 pl-8 md:pl-0"
              >
                {/* Timeline node */}
                <div className="absolute left-[-41px] md:left-0 top-0 w-12 h-12 rounded-full bg-[#13131A] border border-white/10 flex items-center justify-center text-primary font-mono font-bold group-hover:border-primary transition-colors">
                  {step.step}
                </div>

                <div className="pt-2 md:pt-20">
                  <h3 className="text-xl font-display font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA: Open for first clients */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full relative rounded-3xl overflow-hidden bg-primary/10 border border-primary/20 p-12 md:p-20 text-center"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-primary)_0%,transparent_100%)] opacity-5 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center justify-center max-w-3xl mx-auto">
          <span className="bg-primary/20 text-primary text-sm font-bold uppercase tracking-widest py-1.5 px-4 rounded-full mb-8">
            Available for hire
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-foreground">
            Let&apos;s build something exceptional.
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            I am currently open to taking on my first freelance clients. Bring me your idea, and I&apos;ll handle the AI, the backend, and the pixel-perfect frontend.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-[#0A0A0F] font-bold text-lg px-8 py-4 hover:bg-primary/90 transition-colors shadow-[0_0_30px_rgba(198,244,50,0.3)]">
            Start a Project <ArrowUpRight size={20} />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
