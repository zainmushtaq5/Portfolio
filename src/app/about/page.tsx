import { personal, stats } from "@/data/personal";
import { achievements } from "@/data/achievements";
import { FileText, ArrowRight, Briefcase, GraduationCap } from "lucide-react";
import Link from "next/link";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = buildMetadata({
  title: "About Zain Awan: Deep Learning & Full-Stack Developer",
  description: "Learn about my background, education, and career journey in AI-powered deep learning and full-stack web development.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "About", path: "/about" }
      ])} />
      {/* Hero Section */}
      <div className="pt-32 pb-16 px-6 border-b border-white/5 bg-[#0A0A0F]">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
            About <span className="text-primary">Me</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
            {personal.bio}
          </p>
          
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/resume" className="flex items-center gap-2 bg-primary text-[#0A0A0F] hover:bg-primary/90 px-6 py-3 rounded-xl transition-colors font-bold">
              <FileText className="w-5 h-5" /> View Resume
            </Link>
            <Link href="/contact" className="flex items-center gap-2 bg-[#13131A] hover:bg-white/5 border border-white/10 px-6 py-3 rounded-xl transition-colors font-medium">
              Let&apos;s Talk <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-5xl pt-16">
        <div className="grid md:grid-cols-3 gap-12">
          
          <div className="md:col-span-2 space-y-16">
            {/* Education */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <GraduationCap className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-display font-bold">Education</h2>
              </div>
              <div className="bg-[#13131A] border border-white/5 rounded-2xl p-8 hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold text-foreground">{personal.education.degree}</h3>
                  <span className="text-sm font-mono text-muted-foreground bg-white/5 px-3 py-1 rounded-full">{personal.education.period}</span>
                </div>
                <p className="text-primary text-lg font-medium mb-4">{personal.education.university}</p>
                <p className="text-muted-foreground">
                  Currently in my final year, specializing in AI-powered deep learning and full-stack web development. Consistently delivering high-quality academic projects.
                </p>
              </div>
            </section>

            {/* Experience / Achievements Timeline */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <Briefcase className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-display font-bold">Experience & Milestones</h2>
              </div>
              <div className="space-y-6">
                {achievements.map((item, idx) => (
                  <div key={idx} className="bg-[#13131A] border border-white/5 rounded-2xl p-8 hover:border-primary/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                      <span className="text-xs font-mono text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">{item.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <span>{item.org}</span>
                      <span>•</span>
                      <span>{item.year}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-[#13131A] border border-white/5 rounded-2xl p-8">
              <h3 className="font-display font-bold text-xl mb-6">By the Numbers</h3>
              <div className="space-y-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <div className="text-4xl font-display font-bold text-foreground mb-1">
                      {stat.displayValue || stat.value}{stat.suffix}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-[#13131A] border border-white/5 rounded-2xl p-8">
              <h3 className="font-display font-bold text-xl mb-6">Core Focus</h3>
              <div className="space-y-3">
                {personal.roles.map((role, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-muted-foreground font-medium">{role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
