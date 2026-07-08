import { HeroSection } from "./components/Hero";
import { AnalysisWorkflow } from "./components/AnalysisWorkflow";
import { FeaturesSection } from "./components/FeaturesSection";
import { CTASection } from "./components/CTASection";

export function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-20">
      <HeroSection />
      <AnalysisWorkflow />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}
