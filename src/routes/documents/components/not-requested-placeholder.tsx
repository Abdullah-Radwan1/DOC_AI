import { Settings2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface NotRequestedPlaceholderProps {
  label: string;
}

export function NotRequestedPlaceholder({ label }: NotRequestedPlaceholderProps) {
  return (
    <Card className="border-dashed border-muted-foreground/30 bg-muted/5 flex items-center justify-center p-6 text-center select-none min-h-[120px]">
      <CardContent className="flex flex-col items-center gap-2 p-0">
        <div className="p-2 bg-muted/40 rounded-full border border-muted-foreground/15 text-muted-foreground/75">
          <Settings2 className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground/80">
            {label} Not Requested
          </h4>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            This section was skipped in the current analysis run. Check this option
            before analyzing to generate and view this section.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
export default NotRequestedPlaceholder;
