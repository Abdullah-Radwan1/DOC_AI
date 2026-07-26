// components/document/stats-grid.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Shield, AlertTriangle, AlertCircle, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface StatsGridProps {
  complianceScore: number;
  risksCount: number;
  clausesCount: number;
  datesCount: number;
  itemVariants: any;
}

export function StatsGrid({
  complianceScore,
  risksCount,
  clausesCount,
  datesCount,
  itemVariants,
}: StatsGridProps) {
  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-success/10";
    if (score >= 60) return "bg-warning/10";
    return "bg-destructive/10";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getScoreBg(complianceScore)}`}>
              <Shield className={`h-5 w-5 ${getScoreColor(complianceScore)}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{complianceScore}%</p>
              <p className="text-xs text-muted-foreground">Compliance Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{risksCount}</p>
              <p className="text-xs text-muted-foreground">Risk Items</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <AlertCircle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{clausesCount}</p>
              <p className="text-xs text-muted-foreground">Missing Clauses</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand/10">
              <Calendar className="h-5 w-5 text-brand" />
            </div>
            <div>
              <p className="text-2xl font-bold">{datesCount}</p>
              <p className="text-xs text-muted-foreground">Important Dates</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
