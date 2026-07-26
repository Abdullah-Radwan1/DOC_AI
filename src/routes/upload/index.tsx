import { useDocumentUploadFlow } from "@/hooks/useDocumentUploadFlow";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { UploadInfoCards } from "./components/info-cards";
import { DocumentDropzone } from "./components/document-dropzone";
import { AnalysisConfigSection } from "./components/analysis_components/analysis-config-section";
import { AnalyzingOverlay } from "@/routes/home/components/analysis-loader-overlay";

export function UploadPage() {
  const {
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
    selectedFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    removeFile,
    onSubmit,
  } = useDocumentUploadFlow();

  const isSubmitting = status === "uploading" || status === "analyzing";

  // Full-screen overlay — shown during analysis, dismissible independently
  const [showOverlay, setShowOverlay] = useState(false);
  useEffect(() => {
    if (status === "analyzing") {
      setShowOverlay(true);
    } else {
      // Auto-dismiss once analysis ends (complete/error/idle)
      setShowOverlay(false);
    }
  }, [status]);

  return (
    <>
      {/* Full-screen analysis overlay — fixed z-50, dismissible without stopping analysis */}
      <AnalyzingOverlay
        isVisible={showOverlay && status === "analyzing"}
        onDismiss={() => setShowOverlay(false)}
        fileName={selectedFile?.name}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8 max-w-4xl mx-auto pb-10"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Upload Document</h1>
          <p className="text-muted-foreground">
            Upload a PDF contract for AI-powered analysis
          </p>
        </div>

        <UploadInfoCards />

        <form onSubmit={onSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Details</CardTitle>
              <CardDescription>
                Provide the document you want to analyze and any specific
                questions you have.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <DocumentDropzone
                selectedFile={selectedFile}
                status={status}
                uploadProgress={uploadProgress}
                isDragging={isDragging}
                analysisCompleted={analysisCompleted}
                uploadedDocumentId={uploadedDocumentId}
                fileInputRef={fileInputRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onFileSelect={handleFileSelect}
                onRemove={removeFile}
                uploadStep={uploadStep}
                analysisStep={analysisStep}
                hasPrompt={!!prompt.trim()}
              />

              <AnalysisConfigSection
                prompt={prompt}
                onPromptChange={setPrompt}
                show={!!selectedFile && status === "idle"}
                disabled={isSubmitting}
                analysisOptions={analysisOptions}
                onAnalysisOptionsChange={setAnalysisOptions}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          {selectedFile && status === "idle" && (
            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                disabled={!selectedFile || isSubmitting}
              >
                Upload & Analyze
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </form>

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
    </>
  );
}
