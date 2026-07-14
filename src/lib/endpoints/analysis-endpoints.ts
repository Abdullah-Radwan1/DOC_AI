import { api } from "../api";

export async function getDocumentAnalysis(
  documentId: string,
): Promise<unknown> {
  const { data } = await api.get(`/compliance/document/${documentId}`);

  const rawQueries = Array.isArray(data) ? data : data ? [data] : [];

  const latestQuery =
    rawQueries.find(
      (entry: any) =>
        entry?.response?.AnalysisResult ||
        entry?.response?.analysisResult ||
        entry?.response?.analysis_result,
    ) ?? rawQueries[0];

  if (!latestQuery) {
    return null;
  }

  const responseWrapper = latestQuery?.response ?? null;

  // raw AI JSON from the provider
  const aiPayload =
    responseWrapper?.response ??
    responseWrapper?.aiResponse ??
    responseWrapper?.ai_response ??
    {};

  // persisted DB analysis result
  const analysisResult =
    responseWrapper?.AnalysisResult ??
    responseWrapper?.analysisResult ??
    responseWrapper?.analysis_result ??
    latestQuery?.AnalysisResult ??
    latestQuery?.analysisResult ??
    latestQuery?.analysis_result ??
    {};

  const summary = analysisResult?.summary ?? aiPayload?.summary ?? null;

  return {
    id: analysisResult?.id ?? responseWrapper?.id ?? latestQuery?.id ?? null,

    summary,
    executive_summary: summary,

    overallVerdict:
      analysisResult?.overallVerdict ?? aiPayload?.overallVerdict ?? null,

    confidence: analysisResult?.confidence ?? aiPayload?.confidence ?? null,

    riskLevel: analysisResult?.riskLevel ?? aiPayload?.riskLevel ?? null,

    findings: Array.isArray(analysisResult?.findings)
      ? analysisResult.findings
      : Array.isArray(aiPayload?.findings)
        ? aiPayload.findings
        : [],

    // structured contract data should come from the raw AI payload
    parties: Array.isArray(aiPayload?.parties) ? aiPayload.parties : [],

    obligations: Array.isArray(aiPayload?.obligations)
      ? aiPayload.obligations
      : [],

    payment_terms: Array.isArray(aiPayload?.paymentTerms)
      ? aiPayload.paymentTerms
      : Array.isArray(aiPayload?.payment_terms)
        ? aiPayload.payment_terms
        : [],

    penalties: Array.isArray(aiPayload?.penalties) ? aiPayload.penalties : [],

    renewal_terms: Array.isArray(aiPayload?.renewalTerms)
      ? aiPayload.renewalTerms
      : Array.isArray(aiPayload?.renewal_terms)
        ? aiPayload.renewal_terms
        : [],

    termination_terms:
      aiPayload?.terminationTerms ?? aiPayload?.termination_terms ?? null,

    governing_law: aiPayload?.governingLaw ?? aiPayload?.governing_law ?? null,

    important_dates: Array.isArray(aiPayload?.importantDates)
      ? aiPayload.importantDates
      : Array.isArray(aiPayload?.important_dates)
        ? aiPayload.important_dates
        : [],

    missing_clauses: Array.isArray(aiPayload?.missingClauses)
      ? aiPayload.missingClauses
      : Array.isArray(aiPayload?.missing_clauses)
        ? aiPayload.missing_clauses
        : [],

    compliance_requirements: Array.isArray(aiPayload?.complianceRequirements)
      ? aiPayload.complianceRequirements
      : Array.isArray(aiPayload?.compliance_requirements)
        ? aiPayload.compliance_requirements
        : [],

    rawQueries,
    rawAiResponse: aiPayload,
    rawAnalysisResult: analysisResult,
  };
}

export async function analyzeDocument({
  documentId,
  userId,
  queryText,
}: {
  documentId: string;
  userId?: string;
  queryText: string;
}): Promise<any> {
  const { data } = await api.post("/compliance/analyze", {
    documentId,
    userId,
    queryText,
  });
  return data;
}

export async function getAnalysisResult(requestId: string): Promise<any> {
  const { data } = await api.get(`/compliance/analysis/${requestId}`);
  return data;
}
