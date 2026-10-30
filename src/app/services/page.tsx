import { ServicesSection } from "@/components/sections/ServicesSection";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = buildMetadata({
  title: "Services — Full-Stack & AI Solutions",
  description: "Zain Awan offers Full Stack Web Development, AI Integration, Deep Learning model deployment, and custom chatbot development for startups and businesses in Pakistan and worldwide.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <main className="min-h-screen pt-24 pb-12">
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" }
      ])} />
      <div className="container mx-auto px-6 pt-8 pb-4">
        <h1 className="text-4xl md:text-6xl font-display font-bold">
          Services & <span className="text-primary">Capabilities</span>
        </h1>
        <p className="text-xl text-muted-foreground mt-4 max-w-2xl">
          Full-stack engineering, custom AI chatbots, and deep learning solutions tailored for modern businesses.
        </p>
      </div>
      <ServicesSection />
    </main>
  );
}
