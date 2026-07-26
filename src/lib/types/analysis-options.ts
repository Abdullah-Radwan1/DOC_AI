export interface ContractSectionOptions {
  parties: boolean;
  obligations: boolean;
  paymentTerms: boolean;
  penalties: boolean;
  renewalTerms: boolean; // renewalTerms and terminationTerms combined
  importantDates: boolean;
}

export interface AnalysisOptions {
  contract: ContractSectionOptions;
  missingClauses: boolean;
  /**
   * Optional list of specific clause names the user wants to check for.
   * When provided alongside missingClauses: true, the AI focuses on these
   * specific clauses rather than doing a generic scan.
   */
  specificMissingClauses?: string[];
  recommendations: boolean;
  compliance: boolean;
}

export const DEFAULT_ANALYSIS_OPTIONS: AnalysisOptions = {
  contract: {
    parties: true,
    obligations: true,
    paymentTerms: true,
    penalties: true,
    renewalTerms: true,
    importantDates: true,
  },
  missingClauses: true,
  recommendations: true,
  compliance: true,
};
