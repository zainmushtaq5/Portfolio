"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send, MapPin, Mail, Sparkles, Bot } from "lucide-react";
import { personal } from "@/data/personal";
import { motion } from "framer-motion";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email").max(100),
  projectType: z.string().min(1, "Please select a project type"),
  budget: z.string().min(1, "Please select a budget range"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  _honeypot: z.string().max(0), // must be empty
});

type FormData = z.infer<typeof formSchema>;

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _honeypot: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus("success");
        reset();
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openChatbot = () => {
    // We'll dispatch a custom event that the Chatbot component will listen to
    window.dispatchEvent(new CustomEvent("open-chatbot"));
  };

  return (
    <section id="contact" className="py-24 relative bg-background border-t border-white/5">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Let&apos;s <span className="text-primary">Connect</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ready to start a project or need to hire a developer? Fill out the form or chat with my AI assistant.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-[#13131A] border border-white/5 p-8 rounded-3xl shadow-xl">
              <h3 className="text-2xl font-display font-bold mb-6 text-foreground">Send a Message</h3>
              
              {submitStatus === "success" && (
                <div className="bg-primary/20 border border-primary/50 text-primary p-4 rounded-xl mb-6">
                  Message sent successfully! I&apos;ll get back to you soon.
                </div>
              )}
              {submitStatus === "error" && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6">
                  Failed to send message. Please try again later.
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Honeypot */}
                <input type="text" {...register("_honeypot")} className="hidden" aria-hidden="true" tabIndex={-1} />

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-sm font-medium text-muted-foreground">Name</label>
                    <input
                      id="name"
                      {...register("name")}
                      className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email</label>
                    <input
                      id="email"
                      {...register("email")}
                      className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label htmlFor="projectType" className="text-sm font-medium text-muted-foreground">Project Type</label>
                    <select
                      id="projectType"
                      {...register("projectType")}
                      className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
                    >
                      <option value="">Select...</option>
                      <option value="Full-Stack Web App">Full-Stack Web App</option>
                      <option value="AI Chatbot / RAG">AI Chatbot / RAG</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Frontend UI">Frontend UI</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.projectType && <p className="text-red-400 text-xs">{errors.projectType.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="budget" className="text-sm font-medium text-muted-foreground">Budget</label>
                    <select
                      id="budget"
                      {...register("budget")}
                      className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
                    >
                      <option value="">Select...</option>
                      <option value="<$500">&lt; $500</option>
                      <option value="$500 - $1k">$500 - $1k</option>
                      <option value="$1k - $5k">$1k - $5k</option>
                      <option value="$5k+">$5k+</option>
                      <option value="Not Sure">Not Sure</option>
                    </select>
                    {errors.budget && <p className="text-red-400 text-xs">{errors.budget.message}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="message" className="text-sm font-medium text-muted-foreground">Message</label>
                  <textarea
                    id="message"
                    {...register("message")}
                    rows={4}
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                    placeholder="Tell me about your project..."
                  ></textarea>
                  {errors.message && <p className="text-red-400 text-xs">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary text-[#0A0A0F] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>

          {/* Right: Info & AI Chatbot CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col justify-center"
          >
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-display font-bold text-foreground mb-4">Get in Touch</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Whether you have a specific project in mind, need technical advice, or just want to say hi, my inbox is always open.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="w-12 h-12 rounded-full bg-[#13131A] border border-white/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium uppercase tracking-wider">Email</p>
                    <a href={`mailto:${personal.email}`} className="text-foreground hover:text-primary transition-colors">
                      {personal.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="w-12 h-12 rounded-full bg-[#13131A] border border-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium uppercase tracking-wider">Location</p>
                    <p className="text-foreground">{personal.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="w-12 h-12 rounded-full bg-[#13131A] border border-white/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium uppercase tracking-wider">Availability</p>
                    <p className="text-foreground">{personal.availability}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
                  <h4 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" /> Prefer to chat?
                  </h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    Get instant answers about my experience, services, and rates from my custom AI assistant.
                  </p>
                  <button 
                    onClick={openChatbot}
                    className="inline-flex items-center gap-2 bg-[#0A0A0F] text-foreground font-medium px-5 py-2.5 rounded-xl border border-white/10 hover:border-primary/50 hover:text-primary transition-colors text-sm"
                  >
                    Ask my AI Assistant
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
