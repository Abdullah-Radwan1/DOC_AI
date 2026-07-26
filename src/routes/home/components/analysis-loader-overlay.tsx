import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  X,
  Sparkles,
  Brain,
  FileCheck,
  ShieldAlert,
} from "lucide-react";

interface AnalyzingOverlayProps {
  isVisible: boolean;
  onDismiss: () => void;
  fileName?: string;
}

const ANALYSIS_PHASES = [
  { icon: Sparkles, text: "Scanning document layout..." },
  { icon: Brain, text: "Extracting legal clauses & key terms..." },
  { icon: ShieldAlert, text: "Checking for compliance risks..." },
  { icon: FileCheck, text: "Generating actionable insights..." },
];

export function AnalyzingOverlay({
  isVisible,
  onDismiss,
  fileName,
}: AnalyzingOverlayProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);

  // Cycle through analysis steps automatically
  useEffect(() => {
    if (!isVisible) {
      setPhaseIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % ANALYSIS_PHASES.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [isVisible]);

  const CurrentIcon = ANALYSIS_PHASES[phaseIndex].icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
        >
          {/* Top Dismiss Button */}
          <div className="absolute top-6 right-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="gap-2 text-muted-foreground hover:text-foreground rounded-full bg-muted/40 hover:bg-muted border border-border/50"
            >
              <span>Minimize overlay</span>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-col items-center text-center max-w-md w-full space-y-6">
            {/* Animated Pulse Ring & Spinner */}
            <div className="relative flex items-center justify-center">
              <span className="absolute h-24 w-24 rounded-full bg-brand/20 animate-ping" />
              <div className="relative h-20 w-20 rounded-2xl bg-card border border-border shadow-xl flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-brand animate-spin" />
              </div>
            </div>

            {/* Header Text */}
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight">
                Analyzing Document
              </h2>
              {fileName && (
                <p className="text-xs text-muted-foreground truncate max-w-xs">
                  {fileName}
                </p>
              )}
            </div>

            {/* Animated Dynamic Subtext */}
            <div className="h-12 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={phaseIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border border-border/40"
                >
                  <CurrentIcon className="h-4 w-4 text-brand animate-pulse" />
                  <span>{ANALYSIS_PHASES[phaseIndex].text}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
