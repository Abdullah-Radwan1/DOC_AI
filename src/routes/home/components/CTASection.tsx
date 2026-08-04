import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="mx-auto max-w-5xl rounded-[28px] border border-border/70 bg-white p-8 text-center shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:p-12">
      <div className="mx-auto max-w-2xl space-y-4">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Track Your Documents & Stay Ahead of Compliance Risks
        </h2>
        <p className="text-sm leading-7 text-muted-foreground sm:text-base">
          Create a free account to unlock deep document analysis, save complete
          audit histories, and set up custom alert preferences for instant
          updates.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <Button
          size="lg"
          className="bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#10B981] hover:opacity-95"
          asChild
        >
          <Link to="/register">Create Account</Link>
        </Button>

        <Button variant="outline" size="lg" asChild>
          <Link to="/login">Sign In</Link>
        </Button>
      </div>
    </section>
  );
}
