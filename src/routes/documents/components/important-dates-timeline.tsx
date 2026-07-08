// components/document/important-dates-timeline.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface ImportantDatesTimelineProps {
  dates: any[];
  itemVariants: any;
}

export function ImportantDatesTimeline({
  dates,
  itemVariants,
}: ImportantDatesTimelineProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-brand" />
            <CardTitle>Important Dates</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-6">
              {dates.map((item: any, i: number) => (
                <div key={i} className="relative pl-10">
                  <div className="absolute left-2 top-1 w-4 h-4 rounded-full bg-background border-2 border-brand" />
                  <div className="p-4 rounded-lg border border-border/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-brand" />
                      <span className="font-medium">{item.type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="text-sm font-semibold mt-2">
                      {item.date
                        ? new Date(item.date).toLocaleDateString()
                        : "No Date Provided"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
