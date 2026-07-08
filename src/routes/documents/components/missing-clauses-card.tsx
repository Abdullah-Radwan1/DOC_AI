// components/document/missing-clauses-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface MissingClausesCardProps {
  clauses: any[];
  severityColors: any;
  itemVariants: any;
}

export function MissingClausesCard({
  clauses,
  severityColors,
  itemVariants,
}: MissingClausesCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            <CardTitle>Missing Clauses</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {clauses.map((clause: any, i: number) => {
              const colors =
                severityColors[
                  clause.severity as keyof typeof severityColors
                ] || severityColors.medium;
              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${colors.border}`}
                >
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <AlertCircle className={`h-4 w-4 ${colors.text}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{clause.name}</p>
                      <Badge variant={colors.badge}>{clause.severity}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {clause.recommendation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
