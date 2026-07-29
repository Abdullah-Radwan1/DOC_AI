import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, Loader2, BrainCircuit } from "lucide-react";

interface AnalysisProgressBarProps {
  documentId: string;
  status: string | null | undefined;
  errorMessage?: string | null;
  onComplete?: () => void;
}

const STAGE_LABELS: Record<string, string> = {
  pending: "Queuing analysis…",
  processing: "AI is analyzing your contract…",
  completed: "Analysis complete",
  failed: "Analysis failed",
};

/**
 * Animated linear progress bar that tracks the AI analysis pipeline status.
 * Auto-dismisses 3 seconds after reaching a terminal state.
 */
export function AnalysisProgressBar({
  status,
  errorMessage,
  onComplete,
}: AnalysisProgressBarProps) {
  const [visible, setVisible] = useState(true);
  const [fakeProgress, setFakeProgress] = useState(8);

  const isCompleted = status === "completed";
  const isFailed = status === "failed";
  const isTerminal = isCompleted || isFailed;

  // Animate fake progress while processing
  useEffect(() => {
    if (status === "pending") {
      setFakeProgress(10);
    } else if (status === "processing") {
      // Slowly creep up to 88% while waiting
      const interval = setInterval(() => {
        setFakeProgress((prev) => {
          if (prev >= 88) return prev;
          return prev + Math.random() * 2.5;
        });
      }, 800);
      return () => clearInterval(interval);
    } else if (isCompleted) {
      setFakeProgress(100);
    } else if (isFailed) {
      setFakeProgress(100);
    }
  }, [status, isCompleted, isFailed]);

  // Auto-dismiss after terminal state
  useEffect(() => {
    if (!isTerminal) return;
    if (isCompleted && onComplete) onComplete();
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [isTerminal, isCompleted, onComplete]);

  const progressValue = Math.min(100, Math.max(0, fakeProgress));

  const barColor = isFailed
    ? "from-destructive to-destructive/80"
    : isCompleted
      ? "from-success to-emerald-400"
      : "from-brand via-accent to-brand";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -12, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -12, height: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-4 space-y-3">
            {/* Header row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {isFailed ? (
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                ) : isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                ) : (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <BrainCircuit className="h-4 w-4 text-brand shrink-0" />
                  </motion.div>
                )}
                <span
                  className={`text-sm font-medium ${
                    isFailed
                      ? "text-destructive"
                      : isCompleted
                        ? "text-success"
                        : "text-foreground"
                  }`}
                >
                  {STAGE_LABELS[status ?? "pending"] ?? "Analyzing…"}
                </span>
              </div>
              <span className="text-xs tabular-nums text-muted-foreground">
                {Math.round(progressValue)}%
              </span>
            </div>

            {/* Progress track */}
            <div className="relative h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${barColor}`}
                animate={{ width: `${progressValue}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
              {/* Shimmer while processing */}
              {!isTerminal && (
                <motion.div
                  className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-6rem", "100vw"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}
            </div>

            {/* Error message */}
            {isFailed && errorMessage && (
              <p className="text-xs text-destructive/80 truncate">{errorMessage}</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
