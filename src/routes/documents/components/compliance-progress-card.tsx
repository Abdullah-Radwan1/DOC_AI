// components/document/compliance-progress-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";

interface ComplianceProgressCardProps {
  complianceScore: number;
  requirements: any[];
  itemVariants: any;
}

export function ComplianceProgressCard({
  complianceScore,
  requirements,
  itemVariants,
}: ComplianceProgressCardProps) {
  const getStatusLabel = (score: number) => {
    if (score >= 80) return "Good Standing";
    if (score >= 60) return "Needs Attention";
    return "Critical Issues";
  };

  const getStatusDesc = (score: number) => {
    if (score >= 80)
      return "Most compliance requirements are met. Minor improvements recommended.";
    if (score >= 60)
      return "Several compliance gaps identified. Review recommendations below.";
    return "Significant compliance issues found. Immediate action required.";
  };

  const getStrokeColor = (score: number) => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand" />
            <CardTitle>Compliance Analysis</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              {requirements.map((req: any, i: number) => {
                const status = String(req.status).toLowerCase();
                const isCompliant = status === "compliant" || status === "met";
                const isNotApplicable =
                  status === "not applicable" || status === "unknown";
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border/50"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">
                          {req.requirement || req.regulation}
                        </p>
                        <Badge
                          variant={isCompliant ? "default" : "secondary"}
                          className="text-xs capitalize"
                        >
                          {req.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {req.reason || req.details}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
