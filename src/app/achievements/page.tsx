import { AchievementsSection } from "@/components/sections/AchievementsSection";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = buildMetadata({
  title: "Achievements & Awards",
  description: "A timeline of my academic and professional achievements, awards, and milestones in AI and web development.",
  path: "/achievements",
});

export default function AchievementsPage() {
  return (
    <main className="min-h-screen pt-24 pb-12">
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Achievements", path: "/achievements" }
      ])} />
      <div className="container mx-auto px-6 pt-8 pb-4 max-w-6xl">
        <h1 className="text-4xl md:text-6xl font-display font-bold">
          Honors & <span className="text-primary">Achievements</span>
        </h1>
        <p className="text-xl text-muted-foreground mt-4 max-w-2xl">
          Academic milestones, hackathons, and certifications recognizing excellence in software engineering and AI.
        </p>
      </div>
      <AchievementsSection />
    </main>
  );
}
