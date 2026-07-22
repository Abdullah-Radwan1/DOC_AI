import { useParams } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useDocument, useDocumentAnalysis } from "@/hooks/useDocuments";
import {
  useAnalyzeDocument,
  useComplianceQueries,
} from "@/hooks/useCompliance";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Target, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Refactored Sub-Components Imports
import { DocumentHeader } from "./components/document-header";
import { StatsGrid } from "./components/stats-grid";
import { ContractAnalysisTabs } from "./components/contract-analysis-tabs";
import { ComplianceProgressCard } from "./components/compliance-progress-card";
import { MissingClausesCard } from "./components/missing-clauses-card";
import { RecommendationsAccordion } from "./components/recommendations-accordion";
import { DocumentChat } from "./components/document-chat";
import { AiAnswerCard } from "./components/ai-answer-card";

import {
  AnalysisOptions,
  DEFAULT_ANALYSIS_OPTIONS,
} from "@/lib/types/analysis-options";
import NotRequestedPlaceholder from "./components/not-requested-placeholder";

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
  const { data: analysis, isLoading: analysisLoading } =
    useDocumentAnalysis(documentId);

  const aiResult =
    (analysis as any)?.AnalysisResult || (analysis as any)?.ai || analysis;

  const aiAnalysis = (() => {
    const baseAnalysis = (analysis as any) || {};
    const result =
      aiResult && typeof aiResult === "object" && !Array.isArray(aiResult)
        ? aiResult
        : baseAnalysis;

    const contract = result?.contract || baseAnalysis?.contract || {};
    const compliance = result?.compliance || baseAnalysis?.compliance || {};
    const summary = result?.summary || baseAnalysis?.summary || "";

    const findings = Array.isArray(compliance?.findings)
      ? compliance.findings
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

    return {
      summary,
      contract: {
        expirationDate: contract.expirationDate ?? null,
        parties: Array.isArray(contract.parties) ? contract.parties : [],
        obligations: Array.isArray(contract.obligations)
          ? contract.obligations
          : [],
        paymentTerms: Array.isArray(contract.paymentTerms)
          ? contract.paymentTerms
          : [],
        penalties: Array.isArray(contract.penalties) ? contract.penalties : [],
        renewalTerms: Array.isArray(contract.renewalTerms)
          ? contract.renewalTerms
          : [],
        terminationTerms: contract.terminationTerms ?? null,
        governingLaw: contract.governingLaw ?? "",
        importantDates: Array.isArray(contract.importantDates)
          ? contract.importantDates
          : [],
        missingClauses: Array.isArray(contract.missingClauses)
          ? contract.missingClauses
          : [],
      },
      compliance: {
        overallVerdict: compliance.overallVerdict ?? null,
        confidence: compliance.confidence ?? null,
        riskLevel: compliance.riskLevel ?? null,
        summary: compliance.summary ?? {
          passed: 0,
          failed: 0,
          partial: 0,
          unknown: 0,
        },
        requirements: Array.isArray(compliance.requirements)
          ? compliance.requirements
          : [],
        findings,
      },
      risks,
      recommendations,
    };
  })();

  const complianceScore =
    document?.compliance_score ??
    Number((analysis as any)?.complianceScore ?? 78);

  const wasRequested = (section: string) => {
    const opts = (analysis as any)?.analysisOptions;
    if (!opts) return true; // Legacy fallback
    if (section === "compliance") return opts.compliance !== false;
    if (section === "missingClauses") return opts.missingClauses !== false;
    if (section === "recommendations") return opts.recommendations !== false;
    return true;
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 max-w-[1400px] mx-auto pb-10">
      {/* ── Left: Analysis content ──────────────────────────────────────── */}
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

        {/* Loading / Processing State */}
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Global Overview Analytics Dashboard */}
            <StatsGrid
              complianceScore={complianceScore}
              risksCount={
                wasRequested("compliance")
                  ? (aiAnalysis?.risks || []).length
                  : 0
              }
              clausesCount={
                wasRequested("missingClauses")
                  ? (aiAnalysis?.contract?.missingClauses || []).length
                  : 0
              }
              datesCount={(aiAnalysis?.contract?.importantDates || []).length}
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
                    {aiAnalysis?.summary || "Summary not available."}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <AiAnswerCard
              answer={(analysis as any)?.answer}
              query={(analysis as any)?.queryText}
              itemVariants={itemVariants}
            />

            {/* Structural Sub-Panels Breakdown */}
            <ContractAnalysisTabs
              aiAnalysis={aiAnalysis}
              analysis={analysis}
              itemVariants={itemVariants}
            />

            {/* Compliance section checking */}
            {!wasRequested("compliance") ? (
              <NotRequestedPlaceholder label="Compliance Analysis" />
            ) : (
              <ComplianceProgressCard
                complianceScore={complianceScore}
                requirements={aiAnalysis?.compliance?.requirements || []}
                itemVariants={itemVariants}
              />
            )}

            {/* Missing clauses checking */}
            {!wasRequested("missingClauses") ? (
              <NotRequestedPlaceholder label="Missing Clauses" />
            ) : (
              <MissingClausesCard
                clauses={aiAnalysis?.contract?.missingClauses || []}
                severityColors={severityColors}
                itemVariants={itemVariants}
              />
            )}

            {/* Recommendations checking */}
            {!wasRequested("recommendations") ? (
              <NotRequestedPlaceholder label="AI Recommendations" />
            ) : (
              <RecommendationsAccordion
                recommendations={aiAnalysis?.recommendations || []}
                itemVariants={itemVariants}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* ── Right: DUCKY AI Chat ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="xl:w-[380px] xl:flex-shrink-0"
      >
        <div
          className="xl:sticky xl:top-6"
          style={{ height: "calc(100vh - 100px)" }}
        >
          <DocumentChat
            documentId={documentId}
            analysisRequestId={
              (analysis as any)?.analysisRequestId ?? undefined
            }
            className="h-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
export default DocumentPage;
