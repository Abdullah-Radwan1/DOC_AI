import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useUploadDocument, useDocument } from "@/hooks/useDocuments";
import { analyzeDocument } from "@/lib/endpoints/analysis-endpoints";
import { api } from "@/lib/api";
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
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  Loader2,
  Clock,
  FileSearch,
  FileWarning,
} from "lucide-react";
import { AnalysisOptionsForm } from "@/routes/documents/components/analysis-options-form";
import {
  AnalysisOptions,
  DEFAULT_ANALYSIS_OPTIONS,
} from "@/lib/types/analysis-options";

// Map DocumentStatus from your schema
type DocumentStatus =
  | "uploaded"
  | "extracting"
  | "chunking"
  | "ready"
  | "failed";

interface UploadFile {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "analyzing" | "complete" | "error";
  documentId?: string;
  documentStatus?: DocumentStatus; // Real status from backend
  errorMessage?: string;
}

const MAX_FILE_SIZE_MB = 20;
const PROMPT_EXAMPLES = [
  "Check this supplier agreement against GDPR obligations and flag missing data processing clauses.",
  "Review this employment contract for risky termination, confidentiality, and liability terms.",
  "Analyze this NDA for enforceability risks, unusual obligations, and missing governing law clauses.",
];

// Map document status to display status
const getDocumentStatusDisplay = (status?: DocumentStatus) => {
  switch (status) {
    case "uploaded":
      return { label: "Uploaded", icon: Clock, color: "text-blue-500" };
    case "extracting":
      return {
        label: "Extracting text",
        icon: FileSearch,
        color: "text-yellow-500",
      };
    case "chunking":
      return {
        label: "Chunking document",
        icon: Loader2,
        color: "text-purple-500",
      };
    case "ready":
      return {
        label: "Ready for analysis",
        icon: CheckCircle2,
        color: "text-green-500",
      };
    case "failed":
      return {
        label: "Processing failed",
        icon: AlertCircle,
        color: "text-red-500",
      };
    default:
      return null;
  }
};

export function AnalysisWorkflow() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const uploadMutation = useUploadDocument();

  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [compliancePrompt, setCompliancePrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisOptions, setAnalysisOptions] = useState<AnalysisOptions>(
    DEFAULT_ANALYSIS_OPTIONS,
  );

  // Polling for document status updates
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(
    null,
  );

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

  // Poll document status for analyzing files
  const pollDocumentStatus = useCallback(async (documentId: string) => {
    try {
      const { data } = await api.get(`/documents/${documentId}/status`);
      return data.status as DocumentStatus;
    } catch (error) {
      console.error("Failed to poll document status:", error);
      return null;
    }
  }, []);

  // Run the AI analysis
  const runAnalysis = useCallback(
    async (documentId: string, file: File) => {
      try {
        let guestId = localStorage.getItem("docky_guest_id");
        if (!guestId && !user?.id) {
          guestId = crypto.randomUUID();
          localStorage.setItem("docky_guest_id", guestId);
        }

        await analyzeDocument({
          documentId,
          userId: user?.id,
          guestId: guestId || undefined,
          queryText: compliancePrompt,
          options: analysisOptions,
        });

        setFiles((prev) =>
          prev.map((f) =>
            f.file === file
              ? {
                  ...f,
                  status: "complete",
                  progress: 100,
                }
              : f,
          ),
        );

        toast.success("Analysis completed", {
          description:
            "Your document has been checked against the compliance prompt.",
          action: {
            label: "View analysis",
            onClick: () =>
              navigate({
                to: "/dashboard/documents/$documentId",
                params: { documentId },
              }),
          },
        });
      } catch (error: any) {
        setFiles((prev) =>
          prev.map((f) =>
            f.file === file
              ? {
                  ...f,
                  status: "error",
                  errorMessage:
                    error?.response?.data?.message || "Analysis failed.",
                }
              : f,
          ),
        );

        toast.error("Analysis failed", {
          description:
            error?.response?.data?.message ||
            "Could not complete the analysis.",
        });
      }
    },
    [user, compliancePrompt, analysisOptions, navigate],
  );
  // Start polling for a document
  const startPolling = useCallback(
    (documentId: string, file: File) => {
      // Clear any existing interval before setting a new one
      if (pollingInterval) clearInterval(pollingInterval);

      const interval = setInterval(async () => {
        const status = await pollDocumentStatus(documentId);

        if (status) {
          setFiles((prev) =>
            prev.map((f) =>
              f.file === file ? { ...f, documentStatus: status } : f,
            ),
          );

          // Update progress based on status
          let progress = 0;
          switch (status) {
            case "uploaded":
              progress = 20;
              break;
            case "extracting":
              progress = 40;
              break;
            case "chunking":
              progress = 70;
              break;
            case "ready":
              progress = 100;
              break;
            case "failed":
              progress = 0;
              break;
          }

          setFiles((prev) =>
            prev.map((f) => (f.file === file ? { ...f, progress } : f)),
          );

          // If ready or failed, stop polling
          if (status === "ready" || status === "failed") {
            clearInterval(interval);
            setPollingInterval(null);

            if (status === "ready") {
              // This will now successfully call the updated runAnalysis function
              await runAnalysis(documentId, file);
            } else if (status === "failed") {
              setFiles((prev) =>
                prev.map((f) =>
                  f.file === file
                    ? {
                        ...f,
                        status: "error",
                        errorMessage:
                          "Document processing failed. Please try again.",
                      }
                    : f,
                ),
              );
              toast.error("Document processing failed");
            }
          }
        }
      }, 2500);

      setPollingInterval(interval);
    },
    // ADD runAnalysis HERE so startPolling recreates when the prompt changes
    [pollingInterval, pollDocumentStatus, runAnalysis],
  );

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    appendFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    appendFiles(Array.from(e.target.files || []));
    e.target.value = "";
  };

  const removeFile = (file: File) => {
    if (hasActiveFiles) return;
    setFiles((prev) => prev.filter((f) => f.file !== file));
  };

  const handleUpload = async (uploadFile: UploadFile) => {
    const { file } = uploadFile;

    setFiles((prev) =>
      prev.map((f) =>
        f.file === file ? { ...f, status: "uploading", progress: 10 } : f,
      ),
    );

    try {
      // Upload the document
      const result = await uploadMutation.mutateAsync({
        userId: user?.id || null,
        file,
      });

      // Store document ID and start polling for status
      setFiles((prev) =>
        prev.map((f) =>
          f.file === file
            ? {
                ...f,
                status: "analyzing",
                documentId: result.id,
                progress: 15,
                documentStatus: "uploaded",
              }
            : f,
        ),
      );

      // Start polling for real document status from backend
      startPolling(result.id, file);
    } catch (error: any) {
      setFiles((prev) =>
        prev.map((f) =>
          f.file === file
            ? {
                ...f,
                status: "error",
                errorMessage:
                  error?.response?.data?.message || "Upload failed.",
              }
            : f,
        ),
      );

      toast.error("Upload failed", {
        description:
          error?.response?.data?.message || "Could not upload document.",
      });
      console.log(error);
    }
  };

  const handleAnalyze = async () => {
    if (!compliancePrompt.trim()) {
      toast.error("Compliance prompt required", {
        description: "Describe what Docky should check.",
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
        await handleUpload(file);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  // Render file status with real backend status
  const renderFileStatus = (uploadFile: UploadFile) => {
    const statusDisplay = getDocumentStatusDisplay(uploadFile.documentStatus);

    if (uploadFile.status === "pending") {
      return (
        <div className="rounded-lg bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          Waiting to analyze
        </div>
      );
    }

    if (uploadFile.status === "error") {
      return (
        <p className="text-xs text-destructive">
          {uploadFile.errorMessage ?? "Failed to process."}
        </p>
      );
    }

    if (uploadFile.status === "complete") {
      return (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-medium text-emerald-600">
              Analysis complete
            </span>
          </div>
        </div>
      );
    }

    // Show real backend status for analyzing files
    if (
      statusDisplay &&
      (uploadFile.status === "uploading" || uploadFile.status === "analyzing")
    ) {
      const Icon = statusDisplay.icon;
      return (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            {uploadFile.documentStatus === "chunking" ? (
              <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
            ) : (
              <Icon className={`h-4 w-4 ${statusDisplay.color}`} />
            )}
            <span className={`text-xs font-medium ${statusDisplay.color}`}>
              {statusDisplay.label}
            </span>
          </div>
          <Progress value={uploadFile.progress} className="h-1.5" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Processing</span>
            <span>{uploadFile.progress}%</span>
          </div>
        </div>
      );
    }

    // Fallback progress
    if (uploadFile.progress > 0 && uploadFile.progress < 100) {
      return (
        <div className="space-y-1.5">
          <Progress value={uploadFile.progress} className="h-1.5" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Processing...</span>
            <span>{uploadFile.progress}%</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
      {/* Left Column - Content */}
      <motion.div
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
        className="lg:col-span-2 flex flex-col"
      >
        {/* Card with prompt and analyze button - flex-1 to fill height */}
        <Card className="flex-1 overflow-hidden border-border/50 bg-card/50 backdrop-blur flex flex-col">
          <CardHeader>
            <CardDescription className="text-sm leading-6">
              Describe what you want checked, upload the PDF, then run the
              analysis.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col space-y-6">
            {/* Prompt Input - flex-1 to take available space */}
            <div className="flex-1 space-y-3">
              <label className="text-sm font-semibold">Compliance prompt</label>

              <Textarea
                value={compliancePrompt}
                onChange={(e) => setCompliancePrompt(e.target.value)}
                placeholder='Example: "Review this vendor agreement against GDPR..."'
                className="min-h-[120px] h-[120px] resize-none text-sm leading-6"
              />

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Quick examples
                </p>
                <div className="flex flex-wrap gap-2">
                  {PROMPT_EXAMPLES.map((example) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() => setCompliancePrompt(example)}
                      className="rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                      {example.length > 60
                        ? `${example.slice(0, 60)}...`
                        : example}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Analysis Module Selection */}
            <AnalysisOptionsForm
              value={analysisOptions}
              onChange={setAnalysisOptions}
              disabled={isSubmitting || hasActiveFiles}
            />

            {/* Analyze Button */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border/50 bg-muted/20 p-4 shrink-0">
              <div className="space-y-1">
                <p className="text-sm font-semibold">
                  Ready to run the analysis?
                </p>
                <p className="text-xs text-muted-foreground">
                  Upload, extract, and evaluate against your prompt.
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
      </motion.div>

      {/* Right Column - Dropzone - Same height as left */}

      <div className="lg:col-span-1 h-full flex flex-col justify-between gap-4">
        {/* Wrap label and dropzone in a flex-1 column container */}
        <div className="w-full flex-1 flex flex-col space-y-3 min-h-[250px]">
          <label className="text-sm font-semibold shrink-0">Upload PDF</label>

          <div
            className={`
        flex-1 rounded-2xl border-2 border-dashed transition-all duration-300
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
            <label className="flex h-full cursor-pointer flex-col items-center justify-center px-4 py-2 text-center">
              <div className="space-y-4">
                <div
                  className={`
              mx-auto flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm
              ${isDragging ? "bg-brand/20" : "bg-muted/50"}
            `}
                >
                  <UploadCloud
                    className={`h-8 w-8 ${
                      isDragging ? "text-brand" : "text-muted-foreground"
                    }`}
                  />
                </div>

                <div className="space-y-">
                  <p className="text-sm font-semibold">
                    {isDragging ? "Drop your PDF here" : "Drag & drop"}
                    <p className="text-sm text-muted-foreground">
                      Upload contracts, policies, NDAs, employment contracts,
                      and similar PDF documents.
                    </p>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF only • up to {MAX_FILE_SIZE_MB}MB
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-lg bg-background/80 px-3 py-1.5 text-xs font-medium shadow-sm border">
                  <FileText className="h-3 w-3" />
                  Browse files
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

        {/* File Queue */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              /* set max-height to half of the container area or force basis-1/2 if preferred */
              className="shrink-0 flex-1 flex flex-col min-h-[200px] max-h-[50%]"
            >
              <Card className="border-border/50 bg-muted/10 h-full flex flex-col overflow-hidden">
                <CardHeader className="pb-3 shrink-0">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-sm">Queue</CardTitle>
                      <CardDescription className="text-xs">
                        {files.length} file{files.length !== 1 ? "s" : ""} •{" "}
                        {completedFiles.length} completed
                        {hasPendingFiles ? " • waiting" : ""}
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
                        View first
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardHeader>

                {/* flex-1 and overflow-y-auto ensures proper internal card scrolling */}
                <CardContent className="space-y-2 flex-1 overflow-y-auto pb-4">
                  {files.map((uploadFile, index) => (
                    <motion.div
                      key={`${uploadFile.file.name}-${index}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className={`
                  flex items-start gap-3 rounded-lg border p-3 transition-colors
                  ${
                    uploadFile.status === "error"
                      ? "border-destructive/30 bg-destructive/5"
                      : "border-border/50 bg-background/50"
                  }
                `}
                    >
                      <div
                        className={`mt-0.5 rounded-lg p-1.5 ${
                          uploadFile.status === "complete"
                            ? "bg-emerald-500/10"
                            : uploadFile.status === "error"
                              ? "bg-destructive/10"
                              : "bg-muted/50"
                        }`}
                      >
                        {uploadFile.status === "complete" ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : uploadFile.status === "error" ? (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        ) : (
                          <FileText className="h-4 w-4 text-info" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {uploadFile.file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(uploadFile.file.size / 1024 / 1024).toFixed(2)}{" "}
                              MB
                            </p>
                          </div>

                          {uploadFile.status !== "uploading" &&
                            uploadFile.status !== "analyzing" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 shrink-0"
                                onClick={() => removeFile(uploadFile.file)}
                                disabled={hasActiveFiles}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                        </div>

                        {renderFileStatus(uploadFile)}
                      </div>

                      {(uploadFile.status === "uploading" ||
                        uploadFile.status === "analyzing") &&
                        !uploadFile.documentStatus && (
                          <Loader2 className="mt-1 h-4 w-4 shrink-0 animate-spin text-info" />
                        )}
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
