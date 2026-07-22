import { motion } from "framer-motion";
import { Shield, BarChart3, Clock } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const cards = [
  {
    icon: Shield,
    title: "Secure Processing",
    description: "256-bit encryption",
  },
  {
    icon: BarChart3,
    title: "AI Analysis",
    description: "Advanced compliance scoring",
  },
  {
    icon: Clock,
    title: "Fast Results",
    description: "Results in seconds",
  },
];

export function UploadInfoCards() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {cards.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-muted/30">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-brand/10 p-2">
                <item.icon className="h-5 w-5 text-brand" />
              </div>

              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
