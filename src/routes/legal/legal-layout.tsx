import React, { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  FileText,
  Printer,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export interface TOCItem {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  tocItems: TOCItem[];
  children: React.ReactNode;
}

export function LegalLayout({
  title,
  subtitle,
  lastUpdated,
  tocItems,
  children,
}: LegalLayoutProps) {
  const location = useRouterState({
    select: (s) => s.location.pathname,
  });
  const [activeSection, setActiveSection] = useState<string>(
    tocItems[0]?.id || "",
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      for (let i = tocItems.length - 1; i >= 0; i--) {
        const item = tocItems[i];
        const element = document.getElementById(item.id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocItems]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isPrivacy = location.endsWith("/privacy");
  const isTerms = location.endsWith("/terms");

  return (
    <div className="min-h-screen pb-20 pt-4">
      {/* Top Banner & Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link
            to="/"
            className="hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="text-foreground font-medium">Legal</span>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="text-foreground font-medium">{title}</span>
        </div>

        {/* Hero Header Card */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-card to-background p-6 sm:p-10 shadow-sm">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="gap-1.5 py-1 px-3 border-primary/30 text-primary"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> DOCKY Legal Center
                </Badge>
                <Badge variant="secondary" className="py-1 px-3 text-xs">
                  Last Updated: {lastUpdated}
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                {title}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Quick Actions & Navigation Toggle */}
            <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center gap-3 shrink-0">
              <div className="inline-flex rounded-lg border border-border p-1 bg-muted/50">
                <Link
                  to="/privacy"
                  className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-md transition-all text-center flex items-center justify-center gap-2 ${
                    isPrivacy
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-md transition-all text-center flex items-center justify-center gap-2 ${
                    isTerms
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Terms of Service
                </Link>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="gap-2 text-xs print:hidden"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Sticky TOC Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sticky Sidebar Navigation (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Table of Contents
                </h3>
                <span className="text-xs text-muted-foreground">
                  {tocItems.length} sections
                </span>
              </div>
              <Separator />
              <nav className="space-y-1 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
                {tocItems.map((item, idx) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-all flex items-center justify-between group ${
                        isActive
                          ? "bg-primary/10 font-semibold text-primary border-l-2 border-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      <span className="truncate">
                        <span className="text-muted-foreground/60 mr-2 font-mono text-[10px]">
                          {String(idx + 1).padStart(2, "0")}.
                        </span>
                        {item.title}
                      </span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                          isActive
                            ? "text-primary translate-x-0.5"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                      />
                    </button>
                  );
                })}
              </nav>

              <Separator />

              <div className="pt-1 text-xs text-muted-foreground space-y-2">
                <p className="font-medium text-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Have legal questions?
                </p>
                <p className="text-[11px] leading-relaxed">
                  For inquiries regarding data processing, privacy rights, or
                  terms, contact our support team.
                </p>
                <a
                  href="mailto:dockybusiness4@gmail.com"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  dockybusiness4@gmail.com <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </aside>

          {/* Document Content Area */}
          <main className="lg:col-span-8 bg-card border border-border rounded-xl p-6 sm:p-10 shadow-sm space-y-10 print:border-none print:shadow-none print:p-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
