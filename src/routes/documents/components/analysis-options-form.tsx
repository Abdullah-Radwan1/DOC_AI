import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AnalysisOptions,
  DEFAULT_ANALYSIS_OPTIONS,
} from "@/lib/types/analysis-options";
import {
  FileJson,
  ShieldAlert,
  Sparkles,
  Check,
  CheckSquare,
} from "lucide-react";

interface AnalysisOptionsFormProps {
  value: AnalysisOptions;
  onChange: (value: AnalysisOptions) => void;
  disabled?: boolean;
}

export function AnalysisOptionsForm({
  value,
  onChange,
  disabled = false,
}: AnalysisOptionsFormProps) {
  const handleContractChange = (
    key: keyof AnalysisOptions["contract"],
    checked: boolean,
  ) => {
    onChange({
      ...value,
      contract: {
        ...value.contract,
        [key]: checked,
      },
    });
  };

  const handleTopLevelChange = (
    key: "missingClauses" | "recommendations" | "compliance",
    checked: boolean,
  ) => {
    onChange({
      ...value,
      [key]: checked,
    });
  };

  const handleSelectAll = () => {
    onChange(DEFAULT_ANALYSIS_OPTIONS);
  };

  const handleClearAll = () => {
    onChange({
      contract: {
        parties: false,
        obligations: false,
        paymentTerms: false,
        penalties: false,
        renewalTerms: false,
        importantDates: false,
      },
      missingClauses: false,
      recommendations: false,
      compliance: false,
    });
  };

  // Check if anything is selected
  const hasSelection =
    value.compliance ||
    value.missingClauses ||
    value.recommendations ||
    Object.values(value.contract).some(Boolean);

  return (
    <Card className="border border-border bg-card/40 backdrop-blur-sm shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand" />
              Analysis Configuration
            </CardTitle>
            <CardDescription className="text-xs">
              Choose which legal audit sections and contract metrics to
              generate.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="text-[11px] h-7 px-2"
              onClick={handleSelectAll}
              disabled={disabled}
            >
              Select All
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="text-[11px] h-7 px-2 text-muted-foreground hover:text-foreground"
              onClick={handleClearAll}
              disabled={disabled}
            >
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        {/* Left: Contract Structure */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-2">
            <FileJson className="h-4 w-4 text-brand/80" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Contract Structure Extraction
            </h3>
          </div>

          <div className="grid gap-3">
            {[
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
            ].map((item) => {
              const checked =
                value.contract[item.id as keyof AnalysisOptions["contract"]];
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 hover:bg-muted/30 p-2 rounded-lg transition-colors cursor-pointer select-none"
                >
                  <Checkbox
                    id={`contract-${item.id}`}
                    checked={checked}
                    disabled={disabled}
                    className="mt-1"
                    onCheckedChange={(c) =>
                      handleContractChange(
                        item.id as keyof AnalysisOptions["contract"],
                        !!c,
                      )
                    }
                  />
                  <div className="space-y-0.5">
                    <Label
                      htmlFor={`contract-${item.id}`}
                      className="text-xs font-medium text-foreground cursor-pointer"
                    >
                      {item.label}
                    </Label>
                    <p className="text-[10px] text-muted-foreground leading-normal max-w-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Legal & Audit Checks */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-2">
            <ShieldAlert className="h-4 w-4 text-brand/80" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Audit & Risk Analytics
            </h3>
          </div>

          <div className="grid gap-3">
            {[
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
            ].map((item) => {
              const checked =
                value[
                  item.id as "compliance" | "missingClauses" | "recommendations"
                ];
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 hover:bg-muted/30 p-2 rounded-lg transition-colors cursor-pointer select-none"
                  onClick={() =>
                    !disabled &&
                    handleTopLevelChange(
                      item.id as
                        | "compliance"
                        | "missingClauses"
                        | "recommendations",
                      !checked,
                    )
                  }
                >
                  <Checkbox
                    id={`top-${item.id}`}
                    checked={checked}
                    disabled={disabled}
                    className="mt-1"
                    onCheckedChange={(c) =>
                      handleTopLevelChange(
                        item.id as
                          | "compliance"
                          | "missingClauses"
                          | "recommendations",
                        !!c,
                      )
                    }
                  />
                  <div className="space-y-0.5">
                    <Label
                      htmlFor={`top-${item.id}`}
                      className="text-xs font-medium text-foreground cursor-pointer"
                    >
                      {item.label}
                    </Label>
                    <p className="text-[10px] text-muted-foreground leading-normal max-w-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {!hasSelection && (
            <div className="mt-4 p-3 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive text-[11px] leading-relaxed">
              ⚠️ Please select at least one analysis component to run. The
              "Analyze" button will remain disabled until you make a selection.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
export default AnalysisOptionsForm;
