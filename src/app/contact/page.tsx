import { ContactSection } from "@/components/sections/ContactSection";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = buildMetadata({
  title: "Hire Zain Awan: AI & Web Development Projects",
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
      <ContactSection />
    </main>
  );
}
