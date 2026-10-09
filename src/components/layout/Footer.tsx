import Link from "next/link";
import Image from "next/image";
import { personal } from "@/data/personal";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-[#050508] border-t border-white/10 pt-20 pb-10 px-6 mt-20 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[100px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-5 lg:col-span-5 flex flex-col items-start">
            <Link href="/" className="block mb-6 relative w-[280px] h-[70px]">
              <Image 
                src="/footer-logo.png" 
                alt="Zain Awan Full Stack Developer" 
                fill 
                className="object-contain object-left" 
                priority 
              />
            </Link>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-sm">
              I deliver production-ready deep learning models and wrap them in robust, pixel-perfect web applications for startups and businesses.
            </p>
            <div className="flex items-center gap-4">
              <a href={personal.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-[#0A0A0F] hover:border-primary transition-all">
                <GithubIcon className="w-5 h-5" />
              </a>
              <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-[#0A0A0F] hover:border-primary transition-all">
                <LinkedinIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="md:col-span-7 lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8 pt-4">
            {/* Quick Links */}
            <div className="flex flex-col">
              <h4 className="text-foreground font-display font-bold mb-6 tracking-wide">Navigation</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link href="/projects" className="hover:text-primary transition-colors">Projects</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div className="flex flex-col">
              <h4 className="text-foreground font-display font-bold mb-6 tracking-wide">Services</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="/#services" className="hover:text-primary transition-colors">AI Integration</Link></li>
                <li><Link href="/#services" className="hover:text-primary transition-colors">Full-Stack Web</Link></li>
                <li><Link href="/#services" className="hover:text-primary transition-colors">Deep Learning</Link></li>
                <li><Link href="/#services" className="hover:text-primary transition-colors">Custom Chatbots</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="flex flex-col col-span-2 md:col-span-1 mt-8 md:mt-0">
              <h4 className="text-foreground font-display font-bold mb-6 tracking-wide">Let&apos;s Work</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li>
                  <a href={`mailto:${personal.email}`} className="hover:text-primary transition-colors inline-flex items-center gap-1 group">
                    Email Me <ArrowUpRight className="w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </li>
                <li>
                  <p className="text-muted-foreground/70">Available for freelance opportunities</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>&copy; {currentYear} Zain Mushtaq. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/contact" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
