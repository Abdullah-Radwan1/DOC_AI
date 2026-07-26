import { ShieldAlert } from "lucide-react";
import { AnalysisOptionCheckboxItem } from "./analysis-option-checkbox-item";
import { SpecificClausesInput } from "./specific-clauses-input";
import { AnalysisOptions } from "@/lib/types/analysis-options";

type TopLevelKey = "compliance" | "missingClauses" | "recommendations";

interface AuditRiskSectionProps {
  value: AnalysisOptions;
  disabled?: boolean;
  hasSelection: boolean;
  onTopLevelChange: (key: TopLevelKey, checked: boolean) => void;
  onSpecificClausesChange: (clauses: string[]) => void;
}

const TOP_LEVEL_FIELDS: { id: TopLevelKey; label: string; desc: string }[] = [
  {
    id: "compliance",
    label: "Compliance Analysis",
    desc: "Evaluate the document against compliance guidelines and policy rules.",
  },
  {
    id: "missingClauses",
    label: "Missing Clauses Scan",
    desc: "Identify required standard contract clauses omitted from text.",
  },
  {
    id: "recommendations",
    label: "AI Remediation Actions",
    desc: "Generate advice and fixes for checklist items not fully met.",
  },
];

export function AuditRiskSection({
  value,
  disabled,
  hasSelection,
  onTopLevelChange,
  onSpecificClausesChange,
}: AuditRiskSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-border/60 pb-2">
        <ShieldAlert className="h-4 w-4 text-brand/80" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Audit & Risk Analytics
        </h3>
      </div>

      <div className="grid gap-3">
        {TOP_LEVEL_FIELDS.map((field) => (
          <AnalysisOptionCheckboxItem
            key={field.id}
            id={`top-${field.id}`}
            label={field.label}
            description={field.desc}
            checked={value[field.id]}
            disabled={disabled}
            onCheckedChange={(checked) => onTopLevelChange(field.id, checked)}
          >
            {field.id === "missingClauses" && (
              <SpecificClausesInput
                show={value.missingClauses}
                value={value.specificMissingClauses ?? []}
                disabled={disabled}
                onChange={onSpecificClausesChange}
              />
            )}
          </AnalysisOptionCheckboxItem>
        ))}
      </div>

      {!hasSelection && (
        <div className="mt-4 p-3 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive text-[11px] leading-relaxed">
          ⚠️ Please select at least one analysis component to run. The "Analyze"
          button will remain disabled until you make a selection.
        </div>
      )}
    </div>
  );
}
