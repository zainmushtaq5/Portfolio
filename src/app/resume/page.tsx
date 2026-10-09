import { Download, ArrowLeft, Briefcase, GraduationCap, Code2 } from "lucide-react";
import Link from "next/link";
import { personal } from "@/data/personal";
import { achievements } from "@/data/achievements";
import { skillGroups } from "@/data/skills";

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Resume",
  description: "View and download my professional resume.",
  path: "/resume",
  noindex: true,
});

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-5xl">
        <Link href="/about" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to About
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">My <span className="text-primary">Resume</span></h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              A detailed overview of my skills, experience, and academic background. 
              You can read it below or download the PDF version.
            </p>
          </div>
          <a 
            href={personal.resumeUrl}
            target="_blank"
            download
            className="flex items-center justify-center gap-2 bg-primary text-[#0A0A0F] hover:bg-primary/90 px-8 py-4 rounded-xl transition-colors font-bold whitespace-nowrap shadow-[0_0_20px_rgba(198,244,50,0.2)]"
          >
            <Download className="w-5 h-5" /> Download PDF
          </a>
        </div>

        {/* HTML CV Container */}
        <div className="bg-[#0A0A0F] border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          {/* Header */}
          <div className="border-b border-white/10 pb-10 mb-10 relative z-10">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">{personal.name}</h2>
            <p className="text-xl text-primary font-medium mb-6">{personal.roles.join(" • ")}</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>{personal.email}</span>
              <span className="hidden md:inline">•</span>
              <span>{personal.phone}</span>
              <span className="hidden md:inline">•</span>
              <span>{personal.location}</span>
            </div>
            <p className="mt-8 text-foreground/80 leading-relaxed max-w-3xl">
              {personal.bio}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16 relative z-10 mb-16">
            
            {/* Left Column (Experience & Education) */}
            <div className="space-y-12">
              
              {/* Experience section */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Briefcase className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-display font-bold">Experience</h3>
                </div>
                <div className="space-y-8">
                  {achievements.filter(a => a.type === "internship").map((job, idx) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-white/10">
                      <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#0A0A0F] border-2 border-primary" />
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                        <h4 className="text-xl font-bold">{job.title}</h4>
                        <span className="text-sm font-mono text-primary bg-primary/10 px-3 py-1 rounded-full">{job.year}</span>
                      </div>
                      <p className="text-white/60 font-medium mb-3">{job.org}</p>
                      <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Education section */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-display font-bold">Education</h3>
                </div>
                <div className="relative pl-6 border-l-2 border-white/10">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#0A0A0F] border-2 border-primary" />
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                    <h4 className="text-xl font-bold">{personal.education.degree}</h4>
                    <span className="text-sm font-mono text-primary bg-primary/10 px-3 py-1 rounded-full">{personal.education.period}</span>
                  </div>
                  <p className="text-white/60 font-medium mb-3">{personal.education.university}</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Specializing in AI-powered deep learning and full-stack web development.
                  </p>
                </div>
              </section>

            </div>

            {/* Right Column (Skills) */}
            <div className="space-y-12">
              
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Code2 className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-display font-bold">Skills</h3>
                </div>
                <div className="space-y-6">
                  {skillGroups.slice(0, 4).map((group, idx) => (
                    <div key={idx}>
                      <h4 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-3">{group.category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {group.skills.map((skill, sIdx) => (
                          <span key={sIdx} className="bg-[#13131A] border border-white/5 text-muted-foreground text-sm px-3 py-1.5 rounded-lg">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </div>

          {/* Full Width Awards Section */}
          <section className="relative z-10 border-t border-white/10 pt-12">
            <h3 className="text-2xl font-display font-bold mb-8 text-center">Awards & Certifications</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {achievements.filter(a => a.type === "award" || a.type === "certification").map((award, idx) => (
                <div key={idx} className="bg-[#13131A] border border-white/5 p-6 rounded-2xl hover:border-primary/50 transition-colors">
                  <h4 className="font-bold text-lg text-foreground mb-1">{award.title}</h4>
                  <p className="text-sm font-medium text-primary mb-3">{award.org}</p>
                  <p className="text-muted-foreground leading-relaxed">{award.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
