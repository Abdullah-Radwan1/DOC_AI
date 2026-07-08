// components/document/recommendations-accordion.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

interface RecommendationsAccordionProps {
  recommendations: any[];
  itemVariants: any;
}

export function RecommendationsAccordion({
  recommendations,
  itemVariants,
}: RecommendationsAccordionProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-destructive";
      case "high":
        return "bg-warning";
      case "medium":
        return "bg-info";
      default:
        return "bg-slate-400";
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-brand" />
            <CardTitle>AI Recommendations</CardTitle>
          </div>
          <CardDescription>
            Prioritized action items based on risk assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="space-y-2">
            {recommendations.map((rec: any, i: number) => (
              <AccordionItem
                key={i}
                value={`rec-${i}`}
                className="border rounded-lg px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${getPriorityColor(rec.priority)}`}
                    />
                    <span className="font-medium text-left">{rec.title}</span>
                    <Badge
                      variant="outline"
                      className="capitalize hidden sm:inline-flex"
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground pl-5">
                    {rec.description}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
}
