import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { RefObject } from "react";

type Status = "idle" | "uploading" | "analyzing" | "complete" | "error";

interface DocumentDropzoneProps {
  selectedFile: File | undefined;
  status: Status;
  uploadProgress: number;
  isDragging: boolean;
  analysisCompleted: boolean;
  uploadedDocumentId: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  uploadStep: {
    status: "idle" | "loading" | "success" | "error";
    message: string;
  };
  analysisStep: {
    status: "idle" | "loading" | "success" | "error";
    message: string;
  };
  hasPrompt: boolean;
}

export function DocumentDropzone({
  selectedFile,
  status,
  uploadProgress,
  isDragging,
  analysisCompleted,
  uploadedDocumentId,
  fileInputRef,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onRemove,
  uploadStep,
  analysisStep,
  hasPrompt,
}: DocumentDropzoneProps) {
  return (
    <div className="space-y-2">
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
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
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
              {isDragging ? "Drop PDF here" : "Drag & drop your PDF file"}
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
            onChange={onFileSelect}
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
              ) : status === "analyzing" || status === "uploading" ? (
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
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>

              {status !== "idle" && (
                <div className="mt-3 space-y-2 border-t border-border/40 pt-3">
                  {/* Step 1: Upload */}
                  {uploadStep.status !== "idle" && (
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {uploadStep.status === "loading" ? (
                          <Loader2 className="h-3.5 w-3.5 text-brand animate-spin" />
                        ) : uploadStep.status === "success" ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                        ) : (
                          <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                        )}
                        <span className="font-medium text-foreground">
                          {uploadStep.status === "loading"
                            ? `Uploading document… ${uploadProgress}%`
                            : "Document Upload"}
                        </span>
                      </div>
                      <span
                        className={
                          uploadStep.status === "success"
                            ? "text-success font-medium text-[10px]"
                            : uploadStep.status === "error"
                              ? "text-destructive font-medium text-[10px]"
                              : "text-muted-foreground text-[10px]"
                        }
                      >
                        {uploadStep.status === "loading"
                          ? "In Progress"
                          : uploadStep.status === "success"
                            ? "Success"
                            : "Failed"}
                      </span>
                    </div>
                  )}
                  {uploadStep.status === "loading" && (
                    <Progress value={uploadProgress} className="h-1" />
                  )}
                  {uploadStep.message && (
                    <p
                      className={`text-[10px] pl-5.5 leading-normal ${
                        uploadStep.status === "error"
                          ? "text-destructive/90 font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {uploadStep.message}
                    </p>
                  )}

                  {/* Step 2: Analysis */}
                  {hasPrompt && analysisStep.status !== "idle" && (
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-border/20">
                      <div className="flex items-center gap-2">
                        {analysisStep.status === "loading" ? (
                          <Loader2 className="h-3.5 w-3.5 text-brand animate-spin" />
                        ) : analysisStep.status === "success" ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                        ) : (
                          <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                        )}
                        <span className="font-medium text-foreground">
                          AI Compliance Analysis
                        </span>
                      </div>
                      <span
                        className={
                          analysisStep.status === "success"
                            ? "text-success font-medium text-[10px]"
                            : analysisStep.status === "error"
                              ? "text-destructive font-medium text-[10px]"
                              : "text-muted-foreground text-[10px]"
                        }
                      >
                        {analysisStep.status === "loading"
                          ? "Analyzing..."
                          : analysisStep.status === "success"
                            ? "Success"
                            : "Failed"}
                      </span>
                    </div>
                  )}
                  {analysisStep.status === "loading" && (
                    <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-1/2 bg-brand rounded-full animate-[slide_1.5s_ease-in-out_infinite]" />
                    </div>
                  )}
                  {analysisStep.message && (
                    <p
                      className={`text-[10px] pl-5.5 leading-normal ${
                        analysisStep.status === "error"
                          ? "text-destructive/90 font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {analysisStep.message}
                    </p>
                  )}
                </div>
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
                  onClick={onRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}

            {(status === "uploading" || status === "analyzing") && (
              <Loader2 className="h-5 w-5 animate-spin text-info" />
            )}
          </div>

          {status === "complete" && (
            <Button
              type="button"
              variant="outline"
              onClick={onRemove}
              className="self-start"
            >
              Upload another document
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
