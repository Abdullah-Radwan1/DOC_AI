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
import { Sparkles } from "lucide-react";
import { ContractStructureSection } from "./contract-structure-section";
import { AuditRiskSection } from "./audit-risk-section";

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
      // Clear specific clauses when unchecking missingClauses
      ...(key === "missingClauses" && !checked
        ? { specificMissingClauses: [] }
        : {}),
    });
  };

  const handleSpecificClausesChange = (clauses: string[]) => {
    onChange({
      ...value,
      specificMissingClauses: clauses,
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
      specificMissingClauses: [],
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
              <Sparkles className="h-4 w-4 " />
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
        <ContractStructureSection
          value={value.contract}
          disabled={disabled}
          onChange={handleContractChange}
        />
        <AuditRiskSection
          value={value}
          disabled={disabled}
          hasSelection={hasSelection}
          onTopLevelChange={handleTopLevelChange}
          onSpecificClausesChange={handleSpecificClausesChange}
        />
      </CardContent>
    </Card>
  );
}

export default AnalysisOptionsForm;
