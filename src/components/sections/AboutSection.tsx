"use client";

import { motion } from "framer-motion";
import { personal } from "@/data/personal";
import { skillGroups } from "@/data/skills";
import { stats } from "@/data/personal";
import { Card } from "@/components/ui/card";
import CountUp from "react-countup";
import { MapPin, Mail, Sparkles, Brain, Code2, Monitor, Server, Database } from "lucide-react";

import { useEffect, useState, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

// Map lucide icon strings to actual components
const IconMap: Record<string, React.ElementType> = {
  Code2, Monitor, Server, Brain, Database, Sparkles
};

interface CounterProps {
  value: number;
  decimals?: number;
}

function AnimatedCounter({ value, decimals = 0 }: CounterProps) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted || prefersReducedMotion) {
    return <span>{value.toFixed(decimals)}</span>;
  }

  return (
    <CountUp 
      end={value} 
      duration={2.5} 
      decimals={decimals} 
      useEasing={true}
      enableScrollSpy={true}
      scrollSpyOnce={true}
    />
  );
}

const AnimatedCardBackground = ({ idx = 0 }: { idx?: number }) => (
  <>
    <div className="absolute inset-0 z-0 opacity-30 group-hover/bento:opacity-100 transition-opacity duration-1000 pointer-events-none overflow-hidden rounded-xl">
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 8 + (idx % 2 === 0 ? 0 : 2), repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -ml-[150%] -mt-[150%] w-[300%] h-[300%] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,rgba(198,244,50,0.15)_20%,transparent_40%)]"
      />
      <div
        className="absolute top-1/4 left-1/4 w-full h-full bg-primary/20 blur-[80px] rounded-full"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] mix-blend-overlay" />
    </div>
    <div className="absolute inset-0 bg-background/40 z-0 pointer-events-none rounded-xl" />
  </>
);

export function AboutSection() {
  return (
    <section className="py-32 container mx-auto px-6 relative" id="about">
      <div className="flex flex-col gap-4 mb-16">
        <h2 className="text-4xl md:text-6xl font-display font-bold">
          About <span className="text-primary">Me</span>.
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Bridging the gap between deep learning models and scalable web applications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Row 1: 7 / 5 Layout */}
        
        {/* Story Card (7 cols) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="md:col-span-7"
        >
          <Card className="relative overflow-hidden h-full bg-[#0A0A0F] border border-white/5 p-8 md:p-12 flex flex-col justify-center group/bento shadow-xl hover:border-primary/40 transition-colors">
            <AnimatedCardBackground idx={0} />
            <div className="relative z-10">
              <h3 className="text-2xl font-display font-semibold mb-6 group-hover/bento:text-primary transition-colors">The Story</h3>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {personal.bio}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Quick Facts (5 cols) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-5"
        >
          <Card className="relative overflow-hidden h-full bg-[#0A0A0F] border border-white/5 p-8 flex flex-col justify-between group/bento shadow-xl hover:border-primary/40 transition-colors">
            <AnimatedCardBackground idx={1} />
            <div className="relative z-10">
              <h3 className="text-2xl font-display font-semibold mb-6 group-hover/bento:text-primary transition-colors">Quick Facts</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-muted-foreground">
                  <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <MapPin size={20} />
                  </div>
                  <span className="text-lg">{personal.location}</span>
                </li>
                <li className="flex items-center gap-4 text-muted-foreground">
                  <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <Mail size={20} />
                  </div>
                  <a href={`mailto:${personal.email}`} className="text-lg hover:text-primary transition-colors">
                    {personal.email}
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="relative z-10 mt-12 bg-primary/5 p-6 rounded-2xl border border-primary/10 flex items-center justify-between backdrop-blur-md">
              <span className="font-medium text-foreground">Status</span>
              <span className="flex items-center gap-2 text-primary font-medium">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                {personal.availability}
              </span>
            </div>
          </Card>
        </motion.div>

        {/* Row 2: 4 / 4 / 4 Stats Layout */}
        {stats.slice(0, 3).map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 * idx }}
            className="md:col-span-4"
          >
            <Card className="relative overflow-hidden bg-[#0A0A0F] border border-white/5 p-8 text-center flex flex-col items-center justify-center h-48 group/bento shadow-xl hover:border-primary/40 transition-colors">
              <AnimatedCardBackground idx={idx + 2} />
              <div className="relative z-10 text-5xl font-display font-bold text-primary mb-2 group-hover/bento:scale-110 group-hover/bento:drop-shadow-[0_0_15px_rgba(198,244,50,0.5)] transition-all flex items-center justify-center">
                <AnimatedCounter value={stat.displayValue ?? stat.value} decimals={stat.value % 1 !== 0 ? 2 : 0} />
                <span className="ml-1">{stat.suffix}</span>
              </div>
              <p className="relative z-10 text-muted-foreground font-medium uppercase tracking-wider text-sm">{stat.label}</p>
            </Card>
          </motion.div>
        ))}

        {/* Row 3: Skills (5 / 3 / 4) */}
        {skillGroups.slice(0, 3).map((group, idx) => {
          const Icon = IconMap[group.icon] || Sparkles;
          const colSpan = idx === 0 ? "md:col-span-5" : idx === 1 ? "md:col-span-3" : "md:col-span-4";
          
          return (
            <motion.div 
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              className={`${colSpan}`}
            >
              <Card className="relative overflow-hidden h-full bg-[#0A0A0F] border border-white/5 p-6 group/bento shadow-xl hover:border-primary/40 transition-colors">
                <AnimatedCardBackground idx={idx + 5} />
                <div className="relative z-10 flex items-center gap-3 mb-6">
                  <div className="bg-primary/10 p-2 text-primary rounded-lg group-hover/bento:bg-primary group-hover/bento:text-[#0A0A0F] transition-colors">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-display font-semibold text-xl group-hover/bento:text-primary transition-colors">{group.category}</h3>
                </div>
                <div className="relative z-10 flex flex-wrap gap-2">
                  {group.skills.map(skill => (
                    <span key={skill} className="bg-white/5 text-foreground text-sm px-3 py-1.5 rounded-full border border-white/10 group-hover/bento:border-primary/30 transition-colors backdrop-blur-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
