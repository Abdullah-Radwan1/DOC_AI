import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useUploadDocument } from "@/hooks/useDocuments";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowRight,
  Shield,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  Loader2,
  Sparkles,
  Zap,
  Lock,
} from "lucide-react";

interface UploadFile {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "analyzing" | "complete" | "error";
  documentId?: string;
}

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const uploadMutation = useUploadDocument();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const simulateUpload = async (uploadFile: UploadFile) => {
    const { file } = uploadFile;

    // Start upload
    setFiles((prev) =>
      prev.map((f) => (f.file === file ? { ...f, status: "uploading" } : f)),
    );

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 80));
      setFiles((prev) =>
        prev.map((f) => (f.file === file ? { ...f, progress: i } : f)),
      );
    }

    // Transition to analyzing
    setFiles((prev) =>
      prev.map((f) =>
        f.file === file ? { ...f, status: "analyzing", progress: 0 } : f,
      ),
    );

    // Simulate analysis progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setFiles((prev) =>
        prev.map((f) => (f.file === file ? { ...f, progress: i } : f)),
      );
    }

    // Create document in database (using fallback IDs for public users)
    try {
      const result = await uploadMutation.mutateAsync({
        organizationId: user?.organization_id || null,
        userId: user?.id || null,
        file: file,
      });

      setFiles((prev) =>
        prev.map((f) =>
          f.file === file
            ? { ...f, status: "complete", documentId: result.id }
            : f,
        ),
      );

      toast.success("Document analyzed successfully!", {
        description:
          "You can now view the detailed compliance score and risk summary.",
        action: {
          label: "View Analysis",
          onClick: () =>
            navigate({
              to: "/documents/$documentId",
              params: { documentId: result.id },
            }),
        },
      });
    } catch {
      setFiles((prev) =>
        prev.map((f) => (f.file === file ? { ...f, status: "error" } : f)),
      );
      toast.error("Analysis failed", {
        description: "There was an error analyzing your document.",
      });
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files).filter(
        (file) => file.type === "application/pdf",
      );

      if (droppedFiles.length === 0) {
        toast.error("Invalid file type", {
          description: "Only PDF files are supported.",
        });
        return;
      }

      const newFiles = droppedFiles.map((file) => ({
        file,
        progress: 0,
        status: "pending" as const,
      }));

      setFiles((prev) => [...prev, ...newFiles]);
      newFiles.forEach((f) => simulateUpload(f));
    },
    [uploadMutation],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter(
      (file) => file.type === "application/pdf",
    );

    if (selectedFiles.length === 0) {
      toast.error("Invalid file type", {
        description: "Only PDF files are supported.",
      });
      return;
    }

    const newFiles = selectedFiles.map((file) => ({
      file,
      progress: 0,
      status: "pending" as const,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((f) => simulateUpload(f));
  };

  const removeFile = (file: File) => {
    setFiles((prev) => prev.filter((f) => f.file !== file));
  };

  const completedFiles = files.filter((f) => f.status === "complete");

  return (
    <div className="max-w-6xl mx-auto space-y-20 py-8 px-4 sm:px-6">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-sm font-medium"
        >
          <Sparkles className="h-4 w-4" />
          Next-Gen Contract Intelligence
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-accent"
        >
          AI-Powered Contract Analysis & Compliance
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
        >
          Upload your contracts, NDAs, or agreements to get instant compliance
          scoring, automated summaries, risk analysis, and audit trails—no
          credit card or login required.
        </motion.p>
      </section>

      {/* Upload & Dropzone Area */}
      <section className="grid lg:grid-cols-5 gap-8 items-start">
        {/* Left Column: Dropzone */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-3 space-y-6"
        >
          <Card className="border border-border/50 shadow-soft overflow-hidden bg-card/40 backdrop-blur-md relative">
            <div
              className={`
                absolute inset-0 pointer-events-none transition-all duration-300
                ${isDragging ? "bg-brand/10 border-2 border-dashed border-brand rounded-lg" : ""}
              `}
            />
            <CardContent className="p-0">
              <label
                className={`
                  relative block min-h-[320px] cursor-pointer
                  flex flex-col items-center justify-center
                  border-2 border-dashed rounded-xl m-4 p-8
                  transition-all duration-300
                    ${
                      isDragging
                        ? "border-brand bg-brand/5"
                        : "border-border/50 hover:border-brand/50 hover:bg-muted/30"
                    }
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div
                  className={`transition-transform duration-300 ${isDragging ? "scale-110" : ""}`}
                >
                  <div
                    className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-sm
                    ${isDragging ? "bg-brand/20" : "bg-muted/50"}
                  `}
                  >
                    <UploadCloud
                      className={`h-8 w-8 ${isDragging ? "text-brand" : "text-muted-foreground"}`}
                    />
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-lg font-medium">
                    {isDragging
                      ? "Drop your PDF here"
                      : "Drag & drop contract PDF"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or{" "}
                    <span className="text-primary font-medium hover:underline">
                      browse files from your device
                    </span>
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-3 rounded-md bg-muted/60 text-xs text-muted-foreground font-medium">
                    <Shield className="h-3.5 w-3.5 text-brand" />
                    PDF contracts up to 10MB
                  </div>
                </div>

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
            </CardContent>
          </Card>

          {/* Upload Queue for Landing Page */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <Card className="border-border/50 bg-card/40 backdrop-blur-md">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">
                          Analysis Queue
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {files.length} file{files.length !== 1 ? "s" : ""} -{" "}
                          {completedFiles.length} complete
                        </CardDescription>
                      </div>
                      {completedFiles.length > 0 && (
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-gradient-to-r from-brand to-accent hover:from-brand-dark hover:to-accent"
                          onClick={() => {
                            const firstFile = completedFiles[0];
                            if (firstFile?.documentId) {
                              navigate({
                                to: "/documents/$documentId",
                                params: { documentId: firstFile.documentId },
                              });
                            }
                          }}
                        >
                          View Results
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {files.map((uploadFile, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className={`
                          flex items-center gap-4 p-4 rounded-lg border transition-colors
                          ${
                            uploadFile.status === "error"
                              ? "border-destructive/30 bg-destructive/5"
                              : "border-border/50 bg-muted/20"
                          }
                        `}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            uploadFile.status === "complete"
                              ? "bg-success/10"
                              : uploadFile.status === "error"
                                ? "bg-destructive/10"
                                : "bg-muted/50"
                          }`}
                        >
                          {uploadFile.status === "complete" ? (
                            <CheckCircle2 className="h-5 w-5 text-success" />
                          ) : uploadFile.status === "error" ? (
                            <AlertCircle className="h-5 w-5 text-destructive" />
                          ) : (
                            <FileText className="h-5 w-5 text-info" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium truncate pr-4">
                              {uploadFile.file.name}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {(uploadFile.file.size / 1024 / 1024).toFixed(2)}{" "}
                              MB
                            </span>
                          </div>

                          {uploadFile.status !== "pending" &&
                            uploadFile.status !== "error" && (
                              <div className="space-y-1">
                                <Progress
                                  value={uploadFile.progress}
                                  className="h-1.5 bg-muted/80"
                                />
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">
                                    {uploadFile.status === "uploading" &&
                                      "Uploading contract..."}
                                    {uploadFile.status === "analyzing" &&
                                      "Analyzing compliance rules..."}
                                    {uploadFile.status === "complete" &&
                                      "AI compliance score complete!"}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {uploadFile.progress}%
                                  </span>
                                </div>
                              </div>
                            )}

                          {uploadFile.status === "error" && (
                            <p className="text-xs text-destructive mt-1">
                              Failed to process. Check your network or file
                              compatibility.
                            </p>
                          )}
                        </div>

                        {uploadFile.status === "complete" &&
                          uploadFile.documentId && (
                            <Button variant="ghost" size="sm" asChild>
                              <Link
                                to="/documents/$documentId"
                                params={{ documentId: uploadFile.documentId }}
                              >
                                View
                                <ArrowRight className="ml-1 h-3.5 w-3.5" />
                              </Link>
                            </Button>
                          )}

                        {uploadFile.status !== "uploading" &&
                          uploadFile.status !== "analyzing" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-muted"
                              onClick={() => removeFile(uploadFile.file)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}

                        {(uploadFile.status === "uploading" ||
                          uploadFile.status === "analyzing") && (
                          <Loader2 className="h-5 w-5 animate-spin text-info" />
                        )}
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right Column: Platform Features */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight">
              Standard Platform Features
            </h3>
            <p className="text-sm text-muted-foreground">
              Evaluate agreements with our lightweight tool or unlock the full
              dashboard by creating a free account.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: Shield,
                title: "Compliance Verification",
                desc: "Audits contracts against standard industry regulations (GDPR, SOC 2, HIPAA, etc.) instantly.",
              },
              {
                icon: Zap,
                title: "Automated Summary",
                desc: "Distills complex, multi-page agreements into high-level executive briefs highlighting key terms.",
              },
              {
                icon: AlertTriangle,
                title: "Risk Identification",
                desc: "Flags unusual obligations, missing signatures, liability exposures, and renewal traps.",
              },
              {
                icon: Lock,
                title: "Secure & Confidential",
                desc: "All documents are processed securely with enterprise-level encryption and private data controls.",
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-xl border border-border/40 bg-card/25 hover:bg-muted/10 transition-colors"
              >
                <div className="p-2.5 h-10 w-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
                  <feat.icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm">{feat.title}</h4>
                  <p className="text-xs text-muted-foreground leading-normal">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Dynamic Visual Mockup / CTA */}
      <section className="bg-gradient-to-br from-brand/5 via-card to-accent/5 border border-brand/15 rounded-3xl p-8 sm:p-12 text-center max-w-5xl mx-auto space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Unlock Full Organization & Audit Logging
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            By creating a free demo profile, you can manage team members,
            customize organization-wide compliance targets, track renewal
            deadlines, and review previous contract logs in a central dashboard.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-brand to-accent hover:from-brand-dark hover:to-accent"
            asChild
          >
            <Link to="/register">Create Free Account</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/login">Sign In Instead</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
