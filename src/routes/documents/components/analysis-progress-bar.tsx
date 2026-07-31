import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
  BrainCircuit,
  Clock,
  Circle,
} from "lucide-react";

interface AnalysisProgressBarProps {
  status: string | null | undefined;
  errorMessage?: string | null;
  onComplete?: () => void;
  onFail?: () => void;
}

// ── Stage definitions ───────────────────────────────────────────────────────
// Each stage "completes" after its targetMs from when status first becomes
// "processing". Times are optimistic estimates; the bar stays on the last
// stage until the terminal status arrives from the server.

const STAGES = [
  {
    id: "chunks",
    label: "Retrieving document content",
    icon: "📄",
    targetMs: 4_000,
  },
  {
    id: "parties",
    label: "Extracting parties & obligations",
    icon: "👥",
    targetMs: 18_000,
  },
  {
    id: "penalties",
    label: "Extracting penalties & payment terms",
    icon: "💰",
    targetMs: 38_000,
  },
  {
    id: "compliance",
    label: "Running compliance check",
    icon: "⚖️",
    targetMs: 65_000,
  },
  {
    id: "findings",
    label: "Analyzing findings & risk level",
    icon: "🔍",
    targetMs: 92_000,
  },
] as const;

function formatElapsed(ms: number): string {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

/**
 * Animated analysis progress bar with named stages and per-stage checkmarks.
 *
 * Stage advancement is time-based (simulated) from when the server reports
 * "processing". The terminal state (completed / failed) is driven by real
 * polling data and always overrides the local timer.
 */
export function AnalysisProgressBar({
  status,
  errorMessage,
  onComplete,
  onFail,
}: AnalysisProgressBarProps) {
  const [visible, setVisible] = useState(true);
  const [elapsedMs, setElapsedMs] = useState(0);

  // Track when we first saw "processing" so elapsed time is accurate
  const processingStartRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isCompleted = status === "completed";
  const isFailed = status === "failed";
  const isProcessing = status === "processing";
  const isTerminal = isCompleted || isFailed;

  // ── Start elapsed-time counter when processing begins ──────────────────
  useEffect(() => {
    if (isProcessing && processingStartRef.current === null) {
      processingStartRef.current = Date.now();
    }
  }, [isProcessing]);

  useEffect(() => {
    if (isProcessing) {
      timerRef.current = setInterval(() => {
        if (processingStartRef.current !== null) {
          setElapsedMs(Date.now() - processingStartRef.current);
        }
      }, 500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isProcessing]);

  // ── Handle terminal states ──────────────────────────────────────────────
  useEffect(() => {
    if (!isTerminal) return;
    if (isCompleted) onComplete?.();
    else if (isFailed) onFail?.();
    const timer = setTimeout(() => setVisible(false), 4_500);
    return () => clearTimeout(timer);
  }, [isTerminal, isCompleted, isFailed, onComplete, onFail]);

  // ── Derive current stage from elapsed time ──────────────────────────────
  const currentStageIndex = (() => {
    if (isCompleted || isFailed) return STAGES.length; // all stages done
    for (let i = 0; i < STAGES.length; i++) {
      if (elapsedMs < STAGES[i].targetMs) return i;
    }
    return STAGES.length - 1; // hold on last stage until completion arrives
  })();

  // ── Overall progress percentage ─────────────────────────────────────────
  const progressPct = (() => {
    if (isCompleted) return 100;
    if (isFailed) return 100;
    const maxMs = STAGES[STAGES.length - 1].targetMs + 8_000;
    const timeBased = Math.min(90, (elapsedMs / maxMs) * 90);
    // Minimum floors so the bar never looks completely empty
    if (!status || status === "pending") return Math.max(timeBased, 5);
    if (isProcessing) return Math.max(timeBased, 12);
    return timeBased;
  })();

  const barColor = isFailed
    ? "from-destructive to-destructive/80"
    : isCompleted
      ? "from-emerald-500 to-green-400"
      : "from-brand via-accent to-brand";

  const headerIcon = isFailed ? (
    <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
  ) : isCompleted ? (
    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
  ) : (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <BrainCircuit className="h-4 w-4 text-brand shrink-0" />
    </motion.div>
  );

  const headerText = isFailed
    ? "Analysis failed"
    : isCompleted
      ? "Analysis complete!"
      : !status || status === "pending"
        ? "Queuing analysis…"
        : "AI is analyzing your contract…";

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
          <div className="rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-4 space-y-4">
            {/* ── Header row ──────────────────────────────────────────────── */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {headerIcon}
                <span
                  className={`text-sm font-semibold ${
                    isFailed
                      ? "text-destructive"
                      : isCompleted
                        ? "text-emerald-500"
                        : "text-foreground"
                  }`}
                >
                  {headerText}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {isProcessing && elapsedMs > 0 && (
                  <>
                    <Clock className="h-3 w-3" />
                    <span className="tabular-nums">{formatElapsed(elapsedMs)}</span>
                    <span className="text-border">·</span>
                  </>
                )}
                <span className="tabular-nums font-semibold">
                  {Math.round(progressPct)}%
                </span>
              </div>
            </div>

            {/* ── Overall progress track ───────────────────────────────────── */}
            <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${barColor}`}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              {/* Shimmer — only while actively processing */}
              {isProcessing && (
                <motion.div
                  className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  animate={{ x: ["-6rem", "100vw"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}
            </div>

            {/* ── Named stages with checkmarks ────────────────────────────── */}
            <div className="grid gap-1.5">
              {STAGES.map((stage, index) => {
                const done = isCompleted || index < currentStageIndex;
                const active = !isCompleted && !isFailed && index === currentStageIndex;
                const pending = !isCompleted && !isFailed && index > currentStageIndex;

                return (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.25 }}
                    className={`flex items-center gap-2.5 text-xs transition-colors duration-400 ${
                      done
                        ? "text-emerald-500"
                        : active
                          ? "text-foreground"
                          : "text-muted-foreground/40"
                    }`}
                  >
                    {/* Status icon */}
                    <span className="shrink-0 w-3.5 flex items-center justify-center">
                      {done ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      ) : active ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1.4,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Loader2 className="h-3.5 w-3.5 text-brand" />
                        </motion.div>
                      ) : (
                        <Circle className="h-3 w-3" />
                      )}
                    </span>

                    {/* Stage label */}
                    <span
                      className={`font-medium leading-none ${
                        active ? "text-foreground" : done ? "text-emerald-600 dark:text-emerald-400" : ""
                      }`}
                    >
                      {stage.label}
                    </span>

                    {/* Blinking ellipsis for the active stage */}
                    {active && (
                      <motion.span
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 1.1, repeat: Infinity }}
                        className="text-brand font-bold"
                      >
                        …
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* ── Error message ──────────────────────────────────────────── */}
            <AnimatePresence>
              {isFailed && errorMessage && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-xs text-destructive/80 truncate pt-1 border-t border-destructive/20"
                >
                  {errorMessage}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
