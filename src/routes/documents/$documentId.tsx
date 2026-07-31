import { useState, useEffect } from "react";
import { useParams, useRouter, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  useDocument,
  useDocumentAnalysis,
  useAnalyzeDocument,
  useResolveFindings,
  useDocumentAnalysisStatus,
} from "@/hooks/useDocuments";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Target, BrainCircuit, ArrowLeft, FileSearch } from "lucide-react";
import { toast } from "sonner";

// Refactored Sub-Components Imports
import { DocumentHeader } from "./components/document-header";
import { StatsGrid } from "./components/stats-grid";
import { ContractAnalysisTabs } from "./components/contract-analysis-tabs";
import { MissingClausesCard } from "./components/missing-clauses-card";
import { RecommendationsAccordion } from "./components/recommendations-accordion";
import { DocumentChat } from "./components/document-chat";
import { AiAnswerCard } from "./components/ai-answer-card";
import { AnalysisProgressBar } from "./components/analysis-progress-bar";

import NotRequestedPlaceholder from "./components/not-requested-placeholder";
import { ComplianceProgressCard } from "./components/compliance-progress-card";

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

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);

  const { data: document, isLoading: docLoading } = useDocument(documentId);
  const {
    data: analysis,
    isLoading: analysisLoading,
    refetch: refetchAnalysis,
  } = useDocumentAnalysis(documentId);

  // Status polling — always enabled so we can auto-detect in-progress analyses
  // when navigating directly from the upload page (showProgressBar starts false).
  const { data: statusData } = useDocumentAnalysisStatus(
    documentId,
    true, // always poll; refetchInterval logic stops it once terminal
  );

  const analyzeMutation = useAnalyzeDocument();
  const resolveMutation = useResolveFindings();

  // Auto-show the progress bar if we land on this page while an analysis
  // is already in progress (e.g. navigated here from the upload page).
  useEffect(() => {
    const s = statusData?.status;
    if ((s === "pending" || s === "processing") && !showProgressBar) {
      setShowProgressBar(true);
      setIsAnalyzing(true);
    }
  }, [statusData?.status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (docLoading || analysisLoading) {
    return (
      <div className="flex flex-col xl:flex-row gap-6 max-w-[1400px] mx-auto pb-10">
        <div className="flex-1 space-y-6 min-w-0">
          {/* Header Skeleton */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-[250px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-[60px]" />
                    <Skeleton className="h-3 w-[80px]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Executive Summary Skeleton */}
          <Card>
            <CardContent className="p-6 space-y-3">
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[85%]" />
            </CardContent>
          </Card>

          {/* Tabs/Main content Skeleton */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-2">
                <Skeleton className="h-9 w-[100px]" />
                <Skeleton className="h-9 w-[100px]" />
                <Skeleton className="h-9 w-[100px]" />
              </div>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Chat Sidebar Skeleton */}
        <div className="xl:w-[380px] xl:flex-shrink-0">
          <Card className="h-[calc(100vh-100px)] flex flex-col p-4 space-y-4">
            <Skeleton className="h-8 w-[120px]" />
            <Skeleton className="flex-1 w-full" />
            <Skeleton className="h-10 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  // True only when the AI pipeline has produced real content.
  // A pending / processing / failed AnalysisRequest with no summary does NOT
  // count — that would show empty sections and hide the Analyze button wrongly.
  const hasAnalysis = !!(analysis as any)?.summary;

  const handleAnalyze = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setShowProgressBar(true);
    try {
      await analyzeMutation.mutateAsync({ documentId });
      // Don't reset isAnalyzing here — the analysis is running in the
      // background. The progress bar's onComplete / onFail callbacks handle
      // the final reset so the button stays disabled while AI is working.
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? err?.message ?? "Analysis failed";
      toast.error("Analysis failed", { description: msg });
      setShowProgressBar(false);
      setIsAnalyzing(false);
    }
  };

  const handleProgressComplete = async () => {
    toast.success("Analysis complete", {
      description: "Your contract has been fully analyzed.",
    });
    setIsAnalyzing(false);
    // Await the data refresh so hasAnalysis is true before we hide CASE 2,
    // preventing any flash of the "no analysis" state.
    await refetchAnalysis();
    setTimeout(() => setShowProgressBar(false), 600);
  };

  const handleProgressFail = () => {
    setIsAnalyzing(false);
    // Wait for the progress bar’s internal auto-dismiss (4.5 s) before hiding
    // CASE 2. Once showProgressBar becomes false and hasAnalysis is still false,
    // the page falls to CASE 3 so the user can retry via the Analyze button.
    setTimeout(() => setShowProgressBar(false), 4_600);
  };

  const handleResolve = async () => {
    try {
      const result = await resolveMutation.mutateAsync({ documentId });
      toast.success("Findings resolved", {
        description: `${result.deletedCount} finding(s) have been permanently cleared.`,
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Failed to resolve findings";
      toast.error("Failed to resolve", { description: msg });
    }
  };

  // ─── CASE 2: Analysis currently in progress ──────────────────────────────────
  // Show a focused, full-page view. No sidebar, no empty analysis sections.
  if (isAnalyzing || showProgressBar) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto py-20 space-y-10"
      >
        {/* Back link */}
        <Link
          to="/dashboard/documents"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Documents
        </Link>

        {/* Centred icon + title */}
        <div className="text-center space-y-3">
          <div className="p-4 rounded-2xl bg-brand/10 w-fit mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <BrainCircuit className="h-10 w-10 text-brand" />
            </motion.div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {document?.filename ?? "Analyzing…"}
          </h1>
          <p className="text-muted-foreground">
            AI is processing your contract. This usually takes 1–2 minutes.
          </p>
        </div>

        {/* Live stage-by-stage progress bar */}
        <AnalysisProgressBar
          status={statusData?.status}
          errorMessage={statusData?.errorMessage}
          onComplete={handleProgressComplete}
          onFail={handleProgressFail}
        />

        <p className="text-xs text-muted-foreground text-center">
          You can safely leave this page — the analysis will continue in the
          background. Return here or check the documents list for results.
        </p>
      </motion.div>
    );
  }

  // ─── CASE 3: No completed analysis found ──────────────────────────────────
  // Document exists but the AI pipeline hasn't produced any results yet.
  // Show a 404-style empty state with the Analyze button.
  if (!hasAnalysis) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-[1400px] mx-auto space-y-8 pb-10"
      >
        {/* Keep the header so the user can start an analysis */}
        <DocumentHeader
          filename={document?.filename}
          createdAt={document?.created_at}
          uploadedBy={document?.uploader?.fullName || document?.uploaded_by}
          itemVariants={itemVariants}
          hasAnalysis={false}
          isAnalyzing={isAnalyzing}
          onAnalyze={handleAnalyze}
        />

        {/* 404-style empty state */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="min-h-[55vh] flex flex-col items-center justify-center text-center space-y-6 py-20"
        >
          <div className="p-5 rounded-full bg-muted/60 w-fit">
            <FileSearch className="h-12 w-12 text-muted-foreground/60" />
          </div>
          <div className="space-y-2 max-w-sm">
            <h2 className="text-xl font-semibold">No analysis found</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              This document hasn’t been analyzed yet. Run an AI analysis to
              extract parties, obligations, penalties, compliance requirements,
              and more.
            </p>
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="gap-2"
          >
            <BrainCircuit className="h-4 w-4" />
            {isAnalyzing ? "Starting…" : "Start Analysis"}
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  // ─── CASE 4: Full analysis view ─────────────────────────────────────────────
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
        importantDates: Array.isArray(contract.importantDates)
          ? contract.importantDates
          : [],
        missingClauses: Array.isArray(contract.missingClauses)
          ? contract.missingClauses
          : [],
      },
      compliance: {
        overallVerdict: compliance.overallVerdict ?? null,
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
          hasAnalysis={hasAnalysis}
          isAnalyzing={isAnalyzing}
          onAnalyze={handleAnalyze}
          isResolving={resolveMutation.isPending}
          onResolve={handleResolve}
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

      {/* ── Right: DOCKY AI Chat ─────────────────────────────────────────── */}
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
