import { ContactSection } from "@/components/sections/ContactSection";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = buildMetadata({
  title: "Contact & Hire — Let's Work Together",
  description: "Get in touch to hire Zain Awan for your next AI integration, chatbot, or full-stack web development project.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-24 pb-12">
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" }
      ])} />
      <div className="container mx-auto px-6 pt-8 pb-4 max-w-6xl">
        <h1 className="text-4xl md:text-6xl font-display font-bold">
          Get in <span className="text-primary">Touch</span>
        </h1>
        <p className="text-xl text-muted-foreground mt-4 max-w-2xl">
          Have an inquiry, project proposal, or engineering role? Send a message below or chat with my assistant.
        </p>
      </div>
      <ContactSection />
    </main>
  );
}
