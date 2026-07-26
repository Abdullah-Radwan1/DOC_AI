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
import { ArrowRight, Loader2 } from "lucide-react";
import { DocumentDropzone } from "@/routes/upload/components/document-dropzone";
import { AnalysisOptionsForm } from "@/routes/upload/components/analysis_components/analysis-options-form";
import { useDocumentUploadFlow } from "@/hooks/useDocumentUploadFlow";
import { Textarea } from "@/components/ui/textarea";
import { AnalyzingOverlay } from "./analysis-loader-overlay";

const PROMPT_EXAMPLES = [
  "Review this employment contract for risky termination, confidentiality, and liability terms.",
  "Analyze this NDA for enforceability risks, unusual obligations, and missing governing law clauses.",
  "Check this supplier agreement against GDPR obligations",
];

export function AnalysisWorkflow() {
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
  const [showOverlay, setShowOverlay] = useState(false);

  // Show full-screen overlay when analysis starts
  useEffect(() => {
    if (status === "analyzing") {
      setShowOverlay(true);
    } else {
      setShowOverlay(false);
    }
  }, [status]);

  return (
    <>
      {/* Separate Full-Screen Overlay Component */}
      <AnalyzingOverlay
        isVisible={showOverlay && status === "analyzing"}
        onDismiss={() => setShowOverlay(false)}
        fileName={selectedFile?.name}
      />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
      >
        <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur shadow-lg">
          <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
            <CardTitle className="text-xl">AI Compliance Analysis</CardTitle>
            <CardDescription className="text-sm">
              Upload your document, configure the analysis modules, and provide
              a prompt to begin.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            <form onSubmit={onSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left Column - Step 1 Dropzone & Step 3 Prompt */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand border font-bold shadow-sm">
                      1
                    </div>
                    <h3 className="text-lg font-semibold">Upload Document</h3>
                  </div>

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

                  {/* Step 3 - Compliance Prompt */}
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand border font-bold shadow-sm">
                        3
                      </div>
                      <h3 className="text-lg font-semibold">
                        Compliance Prompt
                        <span className="normal-case text-sm font-normal opacity-70 ml-1">
                          (optional)
                        </span>
                      </h3>
                    </div>

                    <div className="space-y-3 bg-card/40 backdrop-blur-sm border border-border p-4 rounded-xl shadow-sm">
                      <Textarea
                        placeholder='Example: "Review this vendor agreement against GDPR..."'
                        className="resize-none min-h-[120px] text-sm leading-relaxed"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isSubmitting}
                      />

                      <div className="space-y-2 pt-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          Quick examples
                        </p>
                        <div className="flex flex-col gap-2">
                          {PROMPT_EXAMPLES.map((example) => (
                            <button
                              key={example}
                              type="button"
                              onClick={() => setPrompt(example)}
                              disabled={isSubmitting}
                              className="text-left rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
                            >
                              {example}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Step 2 */}
                <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand border font-bold shadow-sm">
                        2
                      </div>
                      <h3 className="text-lg font-semibold">
                        Analysis Configuration
                      </h3>
                    </div>
                    <AnalysisOptionsForm
                      value={analysisOptions}
                      onChange={setAnalysisOptions}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border/50 bg-muted/20 p-4 mt-8">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">
                    Ready to run the analysis?
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Upload, extract, and evaluate against your prompt.
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={!selectedFile || isSubmitting}
                  className="min-w-[190px] bg-gradient-to-r from-brand to-accent hover:from-brand-dark hover:to-accent border shadow-md"
                >
                  {isSubmitting ? (
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
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
