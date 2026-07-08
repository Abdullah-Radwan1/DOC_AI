// pages/document-page.tsx
import { useParams } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useDocument, useDocumentAnalysis } from "@/hooks/useDocuments";
import {
  useAnalyzeDocument,
  useComplianceQueries,
} from "@/hooks/useCompliance";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Target } from "lucide-react";
import { toast } from "sonner";

// Refactored Sub-Components Imports
import { DocumentHeader } from "./components/document-header";
import { StatsGrid } from "./components/stats-grid";
import { ContractAnalysisTabs } from "./components/contract-analysis-tabs";
import { ComplianceProgressCard } from "./components/compliance-progress-card";
import { MissingClausesCard } from "./components/missing-clauses-card";
import { RecommendationsAccordion } from "./components/recommendations-accordion";
import { ImportantDatesTimeline } from "./components/important-dates-timeline";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const severityColors = {
  high: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    border: "border-destructive/30",
    badge: "destructive" as const,
  },
  medium: {
    bg: "bg-warning/10",
    text: "text-warning",
    border: "border-warning/30",
    badge: "secondary" as const,
  },
  low: {
    bg: "bg-info/10",
    text: "text-info",
    border: "border-info/30",
    badge: "outline" as const,
  },
};

export function DocumentPage() {
  const { documentId } = useParams({
    from: "/app/dashboard/documents/$documentId",
  });
  const { data: document, isLoading: docLoading } = useDocument(documentId);
  const { data: analysis = {} as any, isLoading: analysisLoading } =
    useDocumentAnalysis(documentId);
  const { user } = useAuth();
  console.log("doc", document);
  console.log("ana", analysis);
  const { data: queries, isLoading: queriesLoading } =
    useComplianceQueries(documentId);
  const analyzeMutation = useAnalyzeDocument();
  const [newQuery, setNewQuery] = useState("");

  const isLoading = docLoading || analysisLoading || queriesLoading;
  const aiResult =
    (analysis as any)?.AnalysisResult || (analysis as any)?.ai || analysis;

  const aiAnalysis = (() => {
    const baseAnalysis = (analysis as any) || {};

    const result =
      aiResult && typeof aiResult === "object" && !Array.isArray(aiResult)
        ? aiResult
        : baseAnalysis;

    const findings = Array.isArray(result?.findings)
      ? result.findings
      : Array.isArray(baseAnalysis?.findings)
        ? baseAnalysis.findings
        : [];

    const mapSeverity = (s: any) => {
      if (!s) return "medium";
      const v = String(s).toLowerCase();
      if (v.includes("critical")) return "high";
      if (v.includes("high")) return "high";
      if (v.includes("low")) return "low";
      return "medium";
    };

    const risks = findings.map((f: any) => ({
      category: f.title || f.clauseReference || "Finding",
      description: f.description || f.excerpt || "",
      severity: mapSeverity(f.severity),
    }));

    const recommendations = findings
      .filter((f: any) => f.recommendation || f.description)
      .map((f: any) => ({
        priority: mapSeverity(f.severity),
        title: f.title || "Recommendation",
        description: f.recommendation || f.description || f.excerpt || "",
      }));

    const missingClauses = findings
      .filter(
        (f: any) =>
          !!f.clauseReference ||
          /missing clause|missing provision|missing/i.test(
            `${f.title || ""} ${f.description || ""}`,
          ),
      )
      .map((f: any) => ({
        name: f.title || "Missing / risky clause",
        severity: mapSeverity(f.severity),
        recommendation: f.recommendation || f.description || "",
      }));

    return {
      executive_summary:
        result?.summary ||
        result?.executive_summary ||
        result?.overview ||
        baseAnalysis?.executive_summary ||
        baseAnalysis?.executiveSummary ||
        "",

      overallVerdict:
        result?.overallVerdict ??
        result?.overall_verdict ??
        baseAnalysis?.overallVerdict ??
        baseAnalysis?.overall_verdict ??
        null,

      confidence: result?.confidence ?? baseAnalysis?.confidence ?? null,

      riskLevel:
        result?.riskLevel ??
        result?.risk_level ??
        baseAnalysis?.riskLevel ??
        baseAnalysis?.risk_level ??
        null,

      // ---- flat contract data ----
      parties: Array.isArray(result?.parties)
        ? result.parties
        : Array.isArray(baseAnalysis?.parties)
          ? baseAnalysis.parties
          : [],

      obligations: Array.isArray(result?.obligations)
        ? result.obligations
        : Array.isArray(baseAnalysis?.obligations)
          ? baseAnalysis.obligations
          : [],

      payment_terms: Array.isArray(result?.payment_terms)
        ? result.payment_terms
        : Array.isArray(baseAnalysis?.payment_terms)
          ? baseAnalysis.payment_terms
          : [],

      penalties: Array.isArray(result?.penalties)
        ? result.penalties
        : Array.isArray(baseAnalysis?.penalties)
          ? baseAnalysis.penalties
          : [],

      renewal_terms: Array.isArray(result?.renewal_terms)
        ? result.renewal_terms
        : Array.isArray(baseAnalysis?.renewal_terms)
          ? baseAnalysis.renewal_terms
          : [],

      governing_law:
        result?.governing_law ??
        result?.governingLaw ??
        baseAnalysis?.governing_law ??
        baseAnalysis?.governingLaw ??
        "",

      important_dates: Array.isArray(result?.important_dates)
        ? result.important_dates
        : Array.isArray(baseAnalysis?.important_dates)
          ? baseAnalysis.important_dates
          : [],

      // ---- derived UI data from findings ----
      risks,
      recommendations,
      missing_clauses: missingClauses,

      compliance_requirements: Array.isArray(result?.compliance_requirements)
        ? result.compliance_requirements
        : Array.isArray(baseAnalysis?.compliance_requirements)
          ? baseAnalysis.compliance_requirements
          : [],

      findings,
    };
  })();

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const complianceScore =
    document?.compliance_score ??
    Number((analysis as any)?.complianceScore ?? 78);

  return (
    <div className="flex flex-col xl:flex-row gap-6 max-w-[1400px] mx-auto pb-10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 space-y-6 min-w-0"
      >
        {/* Document Header Section */}
        <DocumentHeader
          filename={document?.filename}
          createdAt={document?.created_at}
          uploadedBy={document?.uploader?.fullName || document?.uploaded_by}
          itemVariants={itemVariants}
        />

        {/* Global Overview Analytics Dashboard */}
        <StatsGrid
          complianceScore={complianceScore}
          risksCount={(aiAnalysis?.risks || []).length}
          clausesCount={(aiAnalysis?.missing_clauses || []).length}
          datesCount={(aiAnalysis?.important_dates || []).length}
          itemVariants={itemVariants}
        />

        {/* Executive Summary Statement Card */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-brand/5 via-background to-accent/5 border-brand/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-brand" />
                <CardTitle>Executive Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {aiAnalysis?.executive_summary ||
                  (analysis as any)?.executive_summary ||
                  ""}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Structural Sub-Panels Breakdown */}
        <ContractAnalysisTabs
          aiAnalysis={aiAnalysis}
          analysis={analysis}
          itemVariants={itemVariants}
        />
        <ComplianceProgressCard
          complianceScore={complianceScore}
          requirements={aiAnalysis?.compliance_requirements || []}
          itemVariants={itemVariants}
        />

        <MissingClausesCard
          clauses={aiAnalysis?.missing_clauses || []}
          severityColors={severityColors}
          itemVariants={itemVariants}
        />
        <RecommendationsAccordion
          recommendations={aiAnalysis?.recommendations || []}
          itemVariants={itemVariants}
        />
        <ImportantDatesTimeline
          dates={aiAnalysis?.important_dates || []}
          itemVariants={itemVariants}
        />
      </motion.div>
    </div>
  );
}
