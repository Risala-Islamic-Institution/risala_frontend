import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { LiveSection } from "@/components/live-section";
import { TeacherMarketplace } from "@/components/teacher-marketplace";
import { LearningPaths } from "@/components/learning-paths";
import { HowItWorks } from "@/components/how-it-works";
import { UstazPortal } from "@/components/ustaz-portal";
import { FinalCTA } from "@/components/final-cta";
import { SiteFooter } from "@/components/site-footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <LiveSection />
        <TeacherMarketplace />
        <LearningPaths />
        <HowItWorks />
        <UstazPortal />
        <FinalCTA />
      </main>
      <SiteFooter />
    </div>
  );
}
