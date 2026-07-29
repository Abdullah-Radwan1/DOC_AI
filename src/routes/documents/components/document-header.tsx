import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  FileText,
  ShieldOff,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DocumentHeaderProps {
  filename?: string;
  createdAt?: string;
  uploadedBy?: string | null;
  itemVariants: any;
  /** Whether the document already has a completed analysis */
  hasAnalysis?: boolean;
  /** Whether analysis is currently in-flight */
  isAnalyzing?: boolean;
  /** Called when user clicks Analyze */
  onAnalyze?: () => void;
  /** Whether resolve is in progress */
  isResolving?: boolean;
  /** Called when user confirms Resolve */
  onResolve?: () => void;
}

export function DocumentHeader({
  filename,
  createdAt,
  uploadedBy,
  itemVariants,
  hasAnalysis,
  isAnalyzing,
  onAnalyze,
  isResolving,
  onResolve,
}: DocumentHeaderProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4"
    >
      <div className="space-y-2">
        <Link
          to="/dashboard/documents"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Documents
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-brand to-accent">
            <FileText className="h-6 w-6 " />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {filename || "Contract_Acme_2024.pdf"}
            </h1>
            <p className="text-muted-foreground text-sm">
              Uploaded on{" "}
              {new Date(createdAt || Date.now()).toLocaleDateString()} by{" "}
              {uploadedBy || "Pending review"}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 lg:mt-8">
        {/* Analyze button — only when no prior analysis */}
        {!hasAnalysis && onAnalyze && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="gap-2"
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isAnalyzing ? "Analyzing…" : "Analyze"}
          </Button>
        )}

        {/* Resolve button — only when analysis exists */}
        {hasAnalysis && onResolve && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isResolving}
                className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                {isResolving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldOff className="h-4 w-4" />
                )}
                {isResolving ? "Resolving…" : "Resolve"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Resolve all findings?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all findings, risks, and
                  compliance issues for this document. The original PDF and
                  extracted contract information will not be affected. This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onResolve}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Yes, resolve all
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </motion.div>
  );
}
