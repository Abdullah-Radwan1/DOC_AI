// pages/components/ai-answer-card.tsx
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AiAnswerCardProps {
  /** The `answer` field from the AI analysis response. */
  answer?: string | null;
  /** The user's original question, if any — shown as a small label above the answer. */
  query?: string | null;
  itemVariants?: any;
  className?: string;
}

export function AiAnswerCard({
  answer,
  query,
  itemVariants,
  className,
}: AiAnswerCardProps) {
  const hasAnswer = !!answer?.trim();

  return (
    <motion.div variants={itemVariants}>
      <Card
        className={cn(
          "bg-gradient-to-br from-primary/5 via-background to-primary/5 border-primary/20",
          className,
        )}
      >
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>{query ? "Your Answer" : "DUCKY's Take"}</CardTitle>
          </div>
          {query && (
            <p className="text-xs text-muted-foreground mt-1">
              &ldquo;{query}&rdquo;
            </p>
          )}
        </CardHeader>
        <CardContent>
          {hasAnswer ? (
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {answer}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No answer available for this document yet.
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
