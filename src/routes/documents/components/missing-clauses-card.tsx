// components/document/missing-clauses-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Check, CheckCircle, CheckCircle2 } from "lucide-react";
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
  const noClauses = clauses.length === 0;
  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-[#F59E0B]" />
            <CardTitle>Missing Clauses</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {!noClauses ? (
              clauses.map((clause: any, i: number) => {
                const severity =
                  clause.importance || clause.severity || "medium";
                const colors =
                  severityColors[severity as keyof typeof severityColors] ||
                  severityColors.medium;
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
                        <Badge variant={colors.badge}>{severity}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {clause.reason || clause.recommendation}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground flex gap-1 items-end">
                {" "}
                All set no missing clauses
                <CheckCircle2 size={20} color="green" />
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
