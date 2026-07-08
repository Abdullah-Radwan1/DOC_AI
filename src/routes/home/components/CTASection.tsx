import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="mx-auto max-w-5xl rounded-3xl border border-brand/15 bg-gradient-to-br from-brand/5 via-card to-accent/5 p-8 text-center sm:p-12">
      <div className="mx-auto max-w-2xl space-y-4">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Need history, team workspaces, and audit visibility?
        </h2>
        <p className="text-sm leading-7 text-muted-foreground sm:text-base">
          Create an account to save analyses, manage uploaded documents, review
          previous compliance runs, and build a structured internal review
          workflow.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <Button
          size="lg"
          className="bg-gradient-to-r from-brand to-accent hover:from-brand-dark hover:to-accent"
          asChild
        >
          <Link to="/register">Create Free Account</Link>
        </Button>

        <Button variant="outline" size="lg" asChild>
          <Link to="/login">Sign In</Link>
        </Button>
      </div>
    </section>
  );
}
