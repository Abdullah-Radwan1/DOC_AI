import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";

interface AnalysisOptionCheckboxItemProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
  children?: ReactNode; // for nested expandable content (e.g. specific clauses panel)
}

export function AnalysisOptionCheckboxItem({
  id,
  label,
  description,
  checked,
  disabled,
  onCheckedChange,
  children,
}: AnalysisOptionCheckboxItemProps) {
  return (
    <div className="space-y-0">
      <div className="flex items-start gap-3 hover:bg-muted/30 p-2 rounded-lg transition-colors cursor-pointer select-none">
        <Checkbox
          id={id}
          checked={checked}
          disabled={disabled}
          className="mt-1"
          onCheckedChange={(c) => onCheckedChange(!!c)}
        />
        <div className="space-y-0.5">
          <Label
            htmlFor={id}
            className="text-xs font-medium text-foreground cursor-pointer"
          >
            {label}
          </Label>
          <p className="text-[10px] text-muted-foreground leading-normal max-w-sm">
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
