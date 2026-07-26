import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, BarChart3, Clock, LucideIcon } from "lucide-react";

const FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
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
  { icon: Clock, title: "Fast Results", description: "Results in seconds" },
];

export function UploadInfoCards() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {FEATURES.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="bg-muted/30">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="p-2 rounded-lg bg-brand/10">
                <item.icon className="h-5 w-5 text-brand" />
              </div>
              <div>
                <p className="font-medium text-sm">{item.title}</p>
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
