import { useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useUploadDocument } from "@/hooks/useDocuments";
import { analyzeDocument } from "@/lib/endpoints/analysis-endpoints";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  ArrowRight,
  Shield,
  BarChart3,
  Clock,
  AlertTriangle,
} from "lucide-react";

const uploadFormSchema = z.object({
  file: z.instanceof(File, { message: "A PDF document is required" }),
  prompt: z.string().optional(),
});

type UploadFormValues = z.infer<typeof uploadFormSchema>;

export function UploadPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const uploadMutation = useUploadDocument();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "analyzing" | "complete" | "error"
  >("idle");
  const [uploadedDocumentId, setUploadedDocumentId] = useState<string | null>(
    null,
  );
  // true when the AI analysis query completed successfully (controls button label)
  const [analysisCompleted, setAnalysisCompleted] = useState(false);

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const selectedFile = form.watch("file");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (status !== "idle" && status !== "error") return;

      const droppedFiles = Array.from(e.dataTransfer.files).filter(
        (file) => file.type === "application/pdf",
      );

      if (droppedFiles.length === 0) {
        toast.error("Invalid file type", {
          description: "Only PDF files are supported.",
        });
        return;
      }

      if (droppedFiles.length > 1) {
        toast.error("Multiple files detected", {
          description: "Please upload one document at a time.",
        });
      }

      form.setValue("file", droppedFiles[0], { shouldValidate: true });
    },
    [form, status],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      (file) => file.type === "application/pdf",
    );

    if (files.length === 0) {
      toast.error("Invalid file type", {
        description: "Only PDF files are supported.",
      });
      return;
    }

    form.setValue("file", files[0], { shouldValidate: true });
  };

  const removeFile = () => {
    if (status === "uploading" || status === "analyzing") return;
    form.reset({ file: undefined, prompt: form.getValues("prompt") });
    setStatus("idle");
    setUploadProgress(0);
    setUploadedDocumentId(null);
    setAnalysisCompleted(false);
  };

  const onSubmit = async (values: UploadFormValues) => {
    setStatus("uploading");
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    let documentResult;
    try {
      // 1. Upload Document
      documentResult = await uploadMutation.mutateAsync({
        userId: user?.id || null,
        file: values.file,
      });
    } catch (error: any) {
      clearInterval(progressInterval);
      setStatus("error");
      toast.error("Upload failed", {
        description:
          error?.response?.data?.message ||
          "There was an error uploading your document.",
      });
      return;
    }

    clearInterval(progressInterval);
    setUploadProgress(100);

    // Invalidate notifications so sidebar bell refreshes
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] }); // refresh plan quota

    // 2. Run compliance analysis if a prompt was provided
    if (values.prompt && values.prompt.trim() !== "") {
      // Move to analyzing BEFORE the analysis call so the UI shows the right state
      setStatus("analyzing");
      setUploadProgress(0);

      try {
        await analyzeDocument({
          queryText: values.prompt,
          userId: user?.id,
          documentId: documentResult.id,
        });

        // Only now do we mark as complete and show "View Analysis"
        setStatus("complete");
        setAnalysisCompleted(true);
        setUploadedDocumentId(documentResult.id);

        toast.success("Analysis complete!", {
          description: "Your document has been uploaded and analysed.",
          action: {
            label: "View Analysis",
            onClick: () =>
              navigate({
                to: "/dashboard/documents/$documentId",
                params: { documentId: documentResult.id },
              }),
          },
        });
      } catch (error: any) {
        setStatus("complete");
        setUploadedDocumentId(documentResult.id);

        toast.warning("Upload successful, but analysis failed", {
          description:
            error?.response?.data?.message ||
            "We uploaded your document but couldn't run the compliance check. You can try again on the document page.",
          action: {
            label: "View Document",
            onClick: () =>
              navigate({
                to: "/dashboard/documents/$documentId",
                params: { documentId: documentResult.id },
              }),
          },
        });
      }
    } else {
      // No prompt — just mark the upload as done, show View Document (not View Analysis)
      setStatus("complete");
      setUploadedDocumentId(documentResult.id);

      toast.success("Document uploaded successfully", {
        description: "Your document has been uploaded.",
        action: {
          label: "View Document",
          onClick: () =>
            navigate({
              to: "/dashboard/documents/$documentId",
              params: { documentId: documentResult.id },
            }),
        },
      });
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 max-w-4xl mx-auto pb-10"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Upload Document</h1>
        <p className="text-muted-foreground">
          Upload a PDF contract for AI-powered analysis
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            icon: Shield,
            title: "Secure Processing",
            description: "256-bit encryption",
          },
          {
            icon: BarChart3,
            title: "AI Analysis",
            description: "Advanced compliance scoring",
          },
          {
            icon: Clock,
            title: "Fast Results",
            description: "Results in seconds",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-muted/30">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="p-2 rounded-lg bg-brand/10">
                  <item.icon className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Details</CardTitle>
              <CardDescription>
                Provide the document you want to analyze and any specific
                questions you have.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Drop Zone */}
              <FormField
                control={form.control}
                name="file"
                render={() => (
                  <FormItem>
                    <FormLabel>Document (PDF)</FormLabel>
                    <FormControl>
                      {!selectedFile ? (
                        <div
                          className={`
                            relative block min-h-[250px] cursor-pointer
                            flex flex-col items-center justify-center
                            border-2 border-dashed rounded-lg
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
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div
                            className={`transition-transform duration-300 ${isDragging ? "scale-110" : ""}`}
                          >
                            <div
                              className={`
                                w-16 h-16 rounded-full flex items-center justify-center mb-4
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
                                ? "Drop PDF here"
                                : "Drag & drop your PDF file"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              or{" "}
                              <span className="text-primary font-medium">
                                browse to select file
                              </span>
                            </p>
                            <Badge variant="secondary" className="mt-2">
                              Max 10MB
                            </Badge>
                          </div>

                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,application/pdf"
                            className="hidden"
                            onChange={handleFileSelect}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          <div
                            className={`
                              flex items-center gap-4 p-4 rounded-lg border transition-colors
                              ${
                                status === "error"
                                  ? "border-destructive/50 bg-destructive/5"
                                  : "border-border/50 bg-muted/30"
                              }
                            `}
                          >
                            <div
                              className={`p-2 rounded-lg ${
                                status === "complete"
                                  ? "bg-success/10"
                                  : status === "error"
                                    ? "bg-destructive/10"
                                    : status === "analyzing"
                                      ? "bg-brand/10"
                                      : "bg-muted/50"
                              }`}
                            >
                              {status === "complete" ? (
                                <CheckCircle2 className="h-5 w-5 text-success" />
                              ) : status === "error" ? (
                                <AlertCircle className="h-5 w-5 text-destructive" />
                              ) : status === "analyzing" ? (
                                <Loader2 className="h-5 w-5 text-brand animate-spin" />
                              ) : (
                                <FileText className="h-5 w-5 text-info" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium truncate pr-4">
                                  {selectedFile.name}
                                </p>
                                <span className="text-xs text-muted-foreground">
                                  {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                  MB
                                </span>
                              </div>

                              {status !== "idle" && status !== "error" && (
                                <div className="space-y-1">
                                  {status === "analyzing" ? (
                                    // Indeterminate pulsing bar during AI analysis
                                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                      <div className="h-full w-1/2 bg-brand rounded-full animate-[slide_1.5s_ease-in-out_infinite]" />
                                    </div>
                                  ) : (
                                    <Progress
                                      value={uploadProgress}
                                      className="h-1.5"
                                    />
                                  )}
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">
                                      {status === "uploading" && `Uploading… ${uploadProgress}%`}
                                      {status === "analyzing" && (
                                        <span className="flex items-center gap-1.5 text-brand font-medium">
                                          <Loader2 className="h-3 w-3 animate-spin" />
                                          Running AI compliance analysis…
                                        </span>
                                      )}
                                      {status === "complete" && (
                                        <span className="flex items-center gap-1.5 text-success font-medium">
                                          <CheckCircle2 className="h-3 w-3" />
                                          {analysisCompleted ? "Analysis complete" : "Upload complete"}
                                        </span>
                                      )}
                                    </span>
                                    {status === "uploading" && (
                                      <span className="text-xs text-muted-foreground">
                                        {uploadProgress}%
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {status === "error" && (
                                <p className="text-xs text-destructive mt-1">
                                  Upload failed. Please try again.
                                </p>
                              )}
                            </div>

                            {status === "complete" && uploadedDocumentId && (
                              <Button variant="ghost" size="sm" asChild>
                                <Link
                                  to="/dashboard/documents/$documentId"
                                  params={{ documentId: uploadedDocumentId }}
                                >
                                  {analysisCompleted ? "View Analysis" : "View Document"}
                                  <ArrowRight className="ml-1 h-3 w-3" />
                                </Link>
                              </Button>
                            )}

                            {status !== "uploading" &&
                              status !== "analyzing" &&
                              status !== "complete" && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={removeFile}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}

                            {(status === "uploading" ||
                              status === "analyzing") && (
                              <Loader2 className="h-5 w-5 animate-spin text-info" />
                            )}
                          </div>

                          {/* If completed, show button to upload another */}
                          {status === "complete" && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={removeFile}
                              className="self-start"
                            >
                              Upload another document
                            </Button>
                          )}
                        </div>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Compliance Prompt Textarea */}
              <AnimatePresence>
                {selectedFile && status === "idle" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <FormField
                      control={form.control}
                      name="prompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Compliance Prompt (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., Does this contract include a non-compete clause for California?"
                              className="resize-none min-h-[100px]"
                              {...field}
                              disabled={status !== "idle"}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Submit Button */}
          {selectedFile && status === "idle" && (
            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                disabled={!selectedFile || status !== "idle"}
              >
                Upload & Analyze
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </form>
      </Form>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-start gap-4 p-4 rounded-lg bg-warning/10 border border-warning/20"
      >
        <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-medium">Supported Document Types</p>
          <p className="text-xs text-muted-foreground">
            This platform supports contracts, NDAs, service agreements, privacy
            policies, and other legal documents. For best results, ensure your
            PDFs are text-searchable (not scanned images).
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
