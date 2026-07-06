import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useUploadDocument } from "@/hooks/useDocuments";
import * as endpoints from "@/lib/endpoints";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  Loader2,
  Zap,
  FileSearch,
  Scale,
} from "lucide-react";

interface UploadFile {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "analyzing" | "complete" | "error";
  documentId?: string;
  errorMessage?: string;
}

const MAX_FILE_SIZE_MB = 20;

function AnimatedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const letters = text.split("");

  return (
    <h1 className={className} aria-label={text}>
      {letters.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.35,
            delay: index * 0.018,
            ease: "easeOut",
          }}
          className="inline-block whitespace-pre"
        >
          {char}
        </motion.span>
      ))}
    </h1>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const uploadMutation = useUploadDocument();

  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [compliancePrompt, setCompliancePrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasPendingFiles = files.some((f) => f.status === "pending");
  const hasActiveFiles = files.some(
    (f) => f.status === "uploading" || f.status === "analyzing",
  );
  const completedFiles = files.filter((f) => f.status === "complete");

  const canAnalyze = useMemo(() => {
    return (
      compliancePrompt.trim().length > 0 &&
      files.length > 0 &&
      files.some((f) => f.status === "pending")
    );
  }, [compliancePrompt, files]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const appendFiles = useCallback(
    (incomingFiles: File[]) => {
      const pdfFiles = incomingFiles.filter(
        (file) => file.type === "application/pdf",
      );

      if (pdfFiles.length === 0) {
        toast.error("Invalid file type", {
          description: "Only PDF files are supported.",
        });
        return;
      }

      const oversized = pdfFiles.find(
        (file) => file.size > MAX_FILE_SIZE_MB * 1024 * 1024,
      );

      if (oversized) {
        toast.error("File too large", {
          description: `Each PDF must be ${MAX_FILE_SIZE_MB}MB or smaller.`,
        });
        return;
      }

      const deduped = pdfFiles.filter(
        (newFile) =>
          !files.some(
            (existing) =>
              existing.file.name === newFile.name &&
              existing.file.size === newFile.size,
          ),
      );

      if (deduped.length === 0) {
        toast.error("File already added", {
          description: "This PDF is already in the analysis queue.",
        });
        return;
      }

      const newFiles: UploadFile[] = deduped.map((file) => ({
        file,
        progress: 0,
        status: "pending",
      }));

      setFiles((prev) => [...prev, ...newFiles]);
    },
    [files],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      appendFiles(droppedFiles);
    },
    [appendFiles],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    appendFiles(selectedFiles);

    // Reset input so selecting the same file again still triggers onChange
    e.target.value = "";
  };

  const removeFile = (file: File) => {
    if (hasActiveFiles) return;
    setFiles((prev) => prev.filter((f) => f.file !== file));
  };

  const simulateUpload = async (uploadFile: UploadFile) => {
    const { file } = uploadFile;

    setFiles((prev) =>
      prev.map((f) =>
        f.file === file ? { ...f, status: "uploading", progress: 0 } : f,
      ),
    );

    // Fake upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 70));
      setFiles((prev) =>
        prev.map((f) => (f.file === file ? { ...f, progress: i } : f)),
      );
    }

    try {
      // 1. Upload the document
      const result = await uploadMutation.mutateAsync({
        userId: user?.id || null,
        file,
      });

      // Update progress state for the file to show analysis is starting
      setFiles((prev) =>
        prev.map((f) =>
          f.file === file ? { ...f, status: "analyzing", documentId: result.id } : f,
        ),
      );

      // 2. Trigger the AI analysis pipeline
      try {
        let guestId = localStorage.getItem("docky_guest_id");
        if (!guestId && !user?.id) {
          guestId = crypto.randomUUID();
          localStorage.setItem("docky_guest_id", guestId);
        }

        let analysisProgress = 0;
        const progressInterval = setInterval(() => {
          analysisProgress += 5;
          if (analysisProgress > 95) analysisProgress = 95;
          setFiles((prev) =>
            prev.map((f) => (f.file === file ? { ...f, progress: analysisProgress } : f)),
          );
        }, 500);

        await endpoints.analyzeDocument({
          documentId: result.id,
          userId: user?.id,
          guestId: guestId || undefined,
          queryText: compliancePrompt,
        });

        clearInterval(progressInterval);

        setFiles((prev) =>
          prev.map((f) =>
            f.file === file
              ? {
                  ...f,
                  status: "complete",
                  progress: 100,
                  documentId: result.id,
                }
              : f,
          ),
        );

        toast.success("Analysis completed", {
          description: "Your document has been checked against the compliance prompt successfully.",
          action: {
            label: "View analysis",
            onClick: () =>
              navigate({
                to: "/dashboard/documents/$documentId",
                params: { documentId: result.id },
              }),
          },
        });
      } catch (analysisError: any) {
        setFiles((prev) =>
          prev.map((f) =>
            f.file === file
              ? {
                  ...f,
                  status: "error",
                  errorMessage: analysisError?.response?.data?.message || "Analysis failed.",
                  documentId: result.id,
                }
              : f,
          ),
        );

        toast.warning("Upload successful, but analysis failed", {
          description: analysisError?.response?.data?.message || "We uploaded your document but couldn't run the compliance check.",
          action: {
            label: "View Document",
            onClick: () =>
              navigate({
                to: "/dashboard/documents/$documentId",
                params: { documentId: result.id },
              }),
          },
        });
      }
    } catch (uploadError: any) {
      setFiles((prev) =>
        prev.map((f) =>
          f.file === file
            ? {
                ...f,
                status: "error",
                errorMessage: uploadError?.response?.data?.message || "Failed to upload this document. Please try again.",
              }
            : f,
        ),
      );

      toast.error("Upload failed", {
        description: uploadError?.response?.data?.message || "We couldn't upload this document.",
      });
    }
  };

  const handleAnalyze = async () => {
    if (!compliancePrompt.trim()) {
      toast.error("Compliance prompt required", {
        description:
          "Describe what the AI should check in the uploaded document.",
      });
      return;
    }

    const pendingFiles = files.filter((f) => f.status === "pending");

    if (pendingFiles.length === 0) {
      toast.error("No pending PDFs", {
        description: "Please add at least one PDF to analyze.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      for (const file of pendingFiles) {
        await simulateUpload(file);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const promptExamples = [
    "Check this supplier agreement against GDPR obligations and flag missing data processing clauses.",
    "Review this employment contract for risky termination, confidentiality, and liability terms.",
    "Analyze this NDA for enforceability risks, unusual obligations, and missing governing law clauses.",
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-20">
      {/* Hero */}

      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-background via-background to-brand/5 p-6 sm:p-10 lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_left,rgba(168,85,247,0.08),transparent_25%)] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <AnimatedText
            text={"AI-Powered Compliance Review for Contracts & Policies"}
            className="mx-auto max-w-5xl text-4xl font-extrabold tracking-tight leading-tight text-foreground sm:text-5xl lg:text-6xl"
          />

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="mx-auto max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg"
          >
            Upload a contract, policy, or agreement, tell the AI what compliance
            rule or risk area to check, and get back an executive summary,
            findings, clause references, and actionable recommendations.
          </motion.p>
        </div>
      </section>

      {/* Main analysis section */}
      <section className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  items-start">
        {/* Left: prompt + upload */}
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="col-span-2 space-y-6"
        >
          <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="space-y-3">
              <div>
                <CardDescription className="mt-2 text-sm leading-6">
                  This should be a single flow: first describe what you want
                  checked, then attach the PDF, then run the analysis.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Prompt input */}
              <div className="space-y-3">
                <label className="text-sm font-semibold">
                  Compliance prompt
                </label>

                <Textarea
                  value={compliancePrompt}
                  onChange={(e) => setCompliancePrompt(e.target.value)}
                  placeholder='Example: "Review this vendor agreement against GDPR and identify risky clauses, missing DPAs, liability concerns, and weak termination terms."'
                  className="min-h-[150px] resize-none text-sm leading-6"
                />

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Example prompts
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {promptExamples.map((example) => (
                      <button
                        key={example}
                        type="button"
                        onClick={() => setCompliancePrompt(example)}
                        className="rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      >
                        {example.length > 80
                          ? `${example.slice(0, 80)}...`
                          : example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Analyze button */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border/50 bg-muted/20 p-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">
                    Ready to run the analysis?
                  </p>
                  <p className="text-xs text-muted-foreground">
                    We’ll upload the PDF, extract its text, and evaluate it
                    against your compliance prompt in one flow.
                  </p>
                </div>

                <Button
                  size="lg"
                  onClick={handleAnalyze}
                  disabled={!canAnalyze || isSubmitting || hasActiveFiles}
                  className="min-w-[190px] bg-gradient-to-r from-brand to-accent hover:from-brand-dark hover:to-accent"
                >
                  {isSubmitting || hasActiveFiles ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze document
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Queue */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <CardTitle className="text-base">
                          Analysis queue
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {files.length} file{files.length !== 1 ? "s" : ""} •{" "}
                          {completedFiles.length} completed
                          {hasPendingFiles ? " • waiting for analysis" : ""}
                        </CardDescription>
                      </div>

                      {completedFiles.length > 0 && (
                        <Button
                          size="sm"
                          onClick={() => {
                            const first = completedFiles[0];
                            if (first?.documentId) {
                              navigate({
                                to: "/dashboard/documents/$documentId",
                                params: { documentId: first.documentId },
                              });
                            }
                          }}
                        >
                          View first result
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {files.map((uploadFile, index) => (
                      <motion.div
                        key={`${uploadFile.file.name}-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className={`
                          flex items-start gap-4 rounded-xl border p-4 transition-colors
                          ${
                            uploadFile.status === "error"
                              ? "border-destructive/30 bg-destructive/5"
                              : "border-border/50 bg-muted/15"
                          }
                        `}
                      >
                        <div
                          className={`mt-0.5 rounded-lg p-2 ${
                            uploadFile.status === "complete"
                              ? "bg-emerald-500/10"
                              : uploadFile.status === "error"
                                ? "bg-destructive/10"
                                : "bg-muted/50"
                          }`}
                        >
                          {uploadFile.status === "complete" ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          ) : uploadFile.status === "error" ? (
                            <AlertCircle className="h-5 w-5 text-destructive" />
                          ) : (
                            <FileText className="h-5 w-5 text-info" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {uploadFile.file.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(uploadFile.file.size / 1024 / 1024).toFixed(
                                  2,
                                )}{" "}
                                MB
                              </p>
                            </div>

                            {uploadFile.status !== "uploading" &&
                              uploadFile.status !== "analyzing" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 shrink-0"
                                  onClick={() => removeFile(uploadFile.file)}
                                  disabled={hasActiveFiles}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                          </div>

                          {uploadFile.status === "pending" && (
                            <div className="rounded-lg bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                              Waiting for you to click{" "}
                              <span className="font-semibold text-foreground">
                                Analyze document
                              </span>
                              .
                            </div>
                          )}

                          {uploadFile.status !== "pending" &&
                            uploadFile.status !== "error" && (
                              <div className="space-y-1.5">
                                <Progress
                                  value={uploadFile.progress}
                                  className="h-1.5"
                                />
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>
                                    {uploadFile.status === "uploading" &&
                                      "Uploading PDF..."}
                                    {uploadFile.status === "analyzing" &&
                                      "Running compliance analysis..."}
                                    {uploadFile.status === "complete" &&
                                      "Analysis completed"}
                                  </span>
                                  <span>{uploadFile.progress}%</span>
                                </div>
                              </div>
                            )}

                          {uploadFile.status === "error" && (
                            <p className="text-xs text-destructive">
                              {uploadFile.errorMessage ??
                                "Failed to process this PDF."}
                            </p>
                          )}

                          {uploadFile.status === "complete" &&
                            uploadFile.documentId && (
                              <Button variant="outline" size="sm" asChild>
                                <Link
                                  to="/dashboard/documents/$documentId"
                                  params={{
                                    documentId: uploadFile.documentId,
                                  }}
                                >
                                  Open analysis
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                        </div>

                        {(uploadFile.status === "uploading" ||
                          uploadFile.status === "analyzing") && (
                          <Loader2 className="mt-1 h-5 w-5 shrink-0 animate-spin text-info" />
                        )}
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right column */}
        {/* Dropzone */}
        <div className="space-y-3 col-span-3  lg:col-span-1">
          <label className="text-sm font-semibold">Document PDF</label>

          <div
            className={`
                    relative rounded-2xl border-2 border-dashed transition-all duration-300
                    ${
                      isDragging
                        ? "border-brand bg-brand/5"
                        : "border-border/60 bg-muted/15 hover:border-brand/50 hover:bg-muted/30"
                    }
                  `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <label className="block cursor-pointer p-8 sm:p-10">
              <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-[280px]">
                <div
                  className={`
                          flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm
                          ${isDragging ? "bg-brand/20" : "bg-muted/50"}
                        `}
                >
                  <UploadCloud
                    className={`h-8 w-8 ${
                      isDragging ? "text-brand" : "text-muted-foreground"
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-lg font-semibold">
                    {isDragging
                      ? "Drop your PDF here"
                      : "Drag & drop your compliance document"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Upload contracts, policies, NDAs, vendor agreements,
                    employment contracts, and similar PDF documents.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF only • up to {MAX_FILE_SIZE_MB}MB per file
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-lg bg-background/80 px-4 py-2 text-sm font-medium shadow-sm border">
                  <FileText className="h-4 w-4" />
                  Browse PDF files
                </div>
              </div>

              <input
                type="file"
                accept=".pdf,application/pdf"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </div>
        </div>
      </section>
      <motion.div
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
        className="lg:col-span-3 space-y-6"
      >
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl">What the AI returns</CardTitle>
            <CardDescription>
              The result should be shaped by the compliance prompt the user
              enters, not just a generic PDF summary.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {[
              {
                icon: Scale,
                title: "Compliance verdict",
                desc: "A clear outcome such as compliant, partially compliant, or non-compliant based on the requested rule set.",
              },
              {
                icon: AlertTriangle,
                title: "Risk findings",
                desc: "Flagged clauses, suspicious obligations, missing protections, and high-risk areas ranked by severity.",
              },
              {
                icon: FileSearch,
                title: "Clause references",
                desc: "Relevant pages, excerpts, and references so the user can verify why a clause was flagged.",
              },
              {
                icon: Zap,
                title: "Recommendations",
                desc: "Actionable next steps such as clauses to revise, protections to add, or sections to review legally.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex gap-4 rounded-xl border border-border/40 bg-muted/15 p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">{item.title}</h4>
                  <p className="text-xs leading-6 text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
      {/* CTA */}
      <section className="mx-auto max-w-5xl rounded-3xl border border-brand/15 bg-gradient-to-br from-brand/5 via-card to-accent/5 p-8 text-center sm:p-12">
        <div className="mx-auto max-w-2xl space-y-4">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Need history, team workspaces, and audit visibility?
          </h2>
          <p className="text-sm leading-7 text-muted-foreground sm:text-base">
            Create an account to save analyses, manage uploaded documents,
            review previous compliance runs, and build a structured internal
            review workflow.
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
    </div>
  );
}
