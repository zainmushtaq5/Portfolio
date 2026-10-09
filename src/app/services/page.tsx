import { ServicesSection } from "@/components/sections/ServicesSection";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "AI Chatbot & Full-Stack Web Development Services",
  description: "I offer full-stack web development and AI integration services, including custom AI chatbots, deep learning pipelines, and responsive web applications.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <main className="min-h-screen pt-24 pb-12">
      <ServicesSection />
    </main>
  );
}
