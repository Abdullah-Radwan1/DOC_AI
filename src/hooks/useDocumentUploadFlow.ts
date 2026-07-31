import { useState, useCallback, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUploadDocument } from "@/hooks/useDocuments";
import { analyzeDocument } from "@/lib/endpoints/analysis-endpoints";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import {
  AnalysisOptions,
  DEFAULT_ANALYSIS_OPTIONS,
} from "@/lib/types/analysis-options";
import { queryKeys } from "@/lib/query-keys";

export type UploadStatus =
  | "idle"
  | "uploading"
  | "analyzing"
  | "complete"
  | "error";

export function useDocumentUploadFlow() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const uploadMutation = useUploadDocument();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [prompt, setPrompt] = useState("");

  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [uploadedDocumentId, setUploadedDocumentId] = useState<string | null>(
    null,
  );
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [analysisOptions, setAnalysisOptions] = useState<AnalysisOptions>(
    DEFAULT_ANALYSIS_OPTIONS,
  );

  const [uploadStep, setUploadStep] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ status: "idle", message: "" });
  const [analysisStep, setAnalysisStep] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ status: "idle", message: "" });

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

      setSelectedFile(droppedFiles[0]);
    },
    [status],
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
    setSelectedFile(files[0]);
  };

  const removeFile = () => {
    if (status === "uploading" || status === "analyzing") return;
    setSelectedFile(undefined);
    setStatus("idle");
    setUploadProgress(0);
    setUploadedDocumentId(null);
    setAnalysisCompleted(false);
    setUploadStep({ status: "idle", message: "" });
    setAnalysisStep({ status: "idle", message: "" });
  };

  const onSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedFile) {
      toast.error("Missing document", {
        description: "Please select a PDF document first.",
      });
      return;
    }

    setStatus("uploading");
    setUploadProgress(0);
    setUploadStep({
      status: "loading",
      message: "Uploading PDF document to server...",
    });
    setAnalysisStep({ status: "idle", message: "" });

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
      documentResult = await uploadMutation.mutateAsync({
        userId: user?.id || null,
        file: selectedFile,
      });
      setUploadStep({
        status: "success",
        message: `Status 201: Document uploaded successfully (ID: ${documentResult.id})`,
      });
    } catch (error: any) {
      clearInterval(progressInterval);
      setStatus("error");
      setUploadStep({
        status: "error",
        message: `Status ${error?.response?.status || "Error"}: ${error?.response?.data?.message || error?.message || "There was an error uploading your document."}`,
      });
      toast.error("Upload failed", {
        description:
          error?.response?.data?.message ||
          "There was an error uploading your document.",
      });
      return;
    }

    clearInterval(progressInterval);
    setUploadProgress(100);

    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() });
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });

    setStatus("analyzing");
    setUploadProgress(0);
    setAnalysisStep({
      status: "loading",
      message: "Sending analysis request to DOCKY AI...",
    });

    try {
      const analysisResult = await analyzeDocument({
        queryText: prompt || "",
        userId: user?.id,
        documentId: documentResult.id,
        options: analysisOptions,
      });

      // The API now returns { requestId } immediately — analysis runs in the
      // background. Don't try to read verdict/riskLevel from the response;
      // those fields only exist after the AI pipeline finishes.
      const requestId = (analysisResult as any)?.requestId ?? 'n/a';

      setAnalysisStep({
        status: "success",
        message: `Status 202: Analysis queued (request: ${requestId}). AI is processing in the background…`,
      });

      setStatus("complete");
      setAnalysisCompleted(true);
      setUploadedDocumentId(documentResult.id);

      toast.success("Document ready — analysis in progress!", {
        description:
          "Track the live stage-by-stage progress on the document page.",
        action: {
          label: "View Progress",
          onClick: () =>
            navigate({
              to: "/dashboard/documents/$documentId",
              params: { documentId: documentResult.id },
            }),
        },
      });
    } catch (error: any) {
      setAnalysisStep({
        status: "error",
        message: `Status ${error?.response?.status || "Error"}: ${error?.response?.data?.message || error?.message || "Failed to analyze document."}`,
      });
      setStatus("complete");
      setUploadedDocumentId(documentResult.id);

      toast.warning("Upload successful, but analysis failed", {
        description:
          error?.response?.data?.message ||
          "We uploaded your document but couldn't run the analysis. You can try again on the document page.",
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

  return {
    selectedFile,
    prompt,
    setPrompt,
    status,
    isDragging,
    uploadProgress,
    uploadedDocumentId,
    analysisCompleted,
    analysisOptions,
    setAnalysisOptions,
    uploadStep,
    analysisStep,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    removeFile,
    onSubmit,
  };
}
