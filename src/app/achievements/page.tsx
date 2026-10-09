import { AchievementsSection } from "@/components/sections/AchievementsSection";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Achievements & Awards",
  description: "A timeline of my academic and professional achievements, awards, and milestones in AI and web development.",
  path: "/achievements",
});

export default function AchievementsPage() {
  return (
    <main className="min-h-screen pt-24 pb-12">
      <AchievementsSection />
    </main>
  );
}
