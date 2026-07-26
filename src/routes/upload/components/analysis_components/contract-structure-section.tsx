import { FileJson } from "lucide-react";
import { AnalysisOptionCheckboxItem } from "./analysis-option-checkbox-item";
import { AnalysisOptions } from "@/lib/types/analysis-options";

interface ContractStructureSectionProps {
  value: AnalysisOptions["contract"];
  disabled?: boolean;
  onChange: (key: keyof AnalysisOptions["contract"], checked: boolean) => void;
}

const CONTRACT_FIELDS: {
  id: keyof AnalysisOptions["contract"];
  label: string;
  desc: string;
}[] = [
  {
    id: "parties",
    label: "Contracting Parties",
    desc: "Identify legal entities, address records, roles, and signatories.",
  },
  {
    id: "obligations",
    label: "Action Obligations",
    desc: "Track duties, completion dates, frequencies, and references.",
  },
  {
    id: "paymentTerms",
    label: "Payment Terms",
    desc: "Map amounts, currency, billing cycles, and payment conditions.",
  },
  {
    id: "penalties",
    label: "Penalties & Fees",
    desc: "Extract late payment liabilities, breaches, and SLA triggers.",
  },
  {
    id: "renewalTerms",
    label: "Renewal & Termination",
    desc: "Extract exit conditions, automatic renewals, and notice timelines.",
  },
  {
    id: "importantDates",
    label: "Important Timeline Dates",
    desc: "Capture critical dates: effective date, milestones, and renewals.",
  },
];

export function ContractStructureSection({
  value,
  disabled,
  onChange,
}: ContractStructureSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-border/60 pb-2">
        <FileJson className="h-4 w-4 text-brand/80" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Contract Structure Extraction
        </h3>
      </div>

      <div className="grid gap-3">
        {CONTRACT_FIELDS.map((field) => (
          <AnalysisOptionCheckboxItem
            key={field.id}
            id={`contract-${field.id}`}
            label={field.label}
            description={field.desc}
            checked={value[field.id]}
            disabled={disabled}
            onCheckedChange={(checked) => onChange(field.id, checked)}
          />
        ))}
      </div>
    </div>
  );
}
