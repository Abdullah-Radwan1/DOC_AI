import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, FileSearch, Scale, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: Scale,
    title: "Compliance verdict",
    description:
      "A clear outcome such as compliant, partially compliant, or non-compliant based on the requested rule set.",
  },
  {
    icon: AlertTriangle,
    title: "Risk findings",
    description:
      "Flagged clauses, suspicious obligations, missing protections, and high-risk areas ranked by severity.",
  },
  {
    icon: FileSearch,
    title: "Clause references",
    description:
      "Relevant pages, excerpts, and references so the user can verify why a clause was flagged.",
  },
  {
    icon: Zap,
    title: "Recommendations",
    description:
      "Actionable next steps such as clauses to revise, protections to add, or sections to review legally.",
  },
];

export function FeaturesSection() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.2 }}
    >
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl">What Docky returns</CardTitle>
          <CardDescription>
            The result is shaped by your compliance prompt, not a generic
            summary.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="flex gap-4 rounded-xl border border-border/40 bg-muted/15 p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <feature.icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">{feature.title}</h4>
                <p className="text-xs leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
