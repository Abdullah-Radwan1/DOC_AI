import { api } from "../api";
import { AnalysisOptions } from "../types/analysis-options";

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

  const answer = analysisResult?.answer ?? aiPayload?.answer ?? null;

  const queryText = latestQuery?.queryText ?? latestQuery?.query_text ?? null;

  return {
    id: analysisResult?.id ?? responseWrapper?.id ?? latestQuery?.id ?? null,
    analysisRequestId: latestQuery?.id ?? null,
    queryText,
    summary,
    answer,
    analysisOptions: responseWrapper?.metadata?.options ?? null,

    contract: {
      expirationDate: aiPayload?.contract?.expirationDate ?? null,
      parties: Array.isArray(aiPayload?.contract?.parties)
        ? aiPayload.contract.parties
        : [],
      obligations: Array.isArray(aiPayload?.contract?.obligations)
        ? aiPayload.contract.obligations
        : [],
      paymentTerms: Array.isArray(aiPayload?.contract?.paymentTerms)
        ? aiPayload.contract.paymentTerms
        : [],
      penalties: Array.isArray(aiPayload?.contract?.penalties)
        ? aiPayload.contract.penalties
        : [],
      renewalTerms: Array.isArray(aiPayload?.contract?.renewalTerms)
        ? aiPayload.contract.renewalTerms
        : [],
      terminationTerms: aiPayload?.contract?.terminationTerms ?? null,
      importantDates: Array.isArray(aiPayload?.contract?.importantDates)
        ? aiPayload.contract.importantDates
        : [],
      missingClauses: Array.isArray(aiPayload?.contract?.missingClauses)
        ? aiPayload.contract.missingClauses
        : [],
    },

    compliance: {
      overallVerdict:
        analysisResult?.overallVerdict ??
        aiPayload?.compliance?.overallVerdict ??
        null,
      riskLevel:
        analysisResult?.riskLevel ?? aiPayload?.compliance?.riskLevel ?? null,
      summary: aiPayload?.compliance?.summary ?? {
        passed: 0,
        failed: 0,
        partial: 0,
        unknown: 0,
      },
      requirements: Array.isArray(aiPayload?.compliance?.requirements)
        ? aiPayload.compliance.requirements
        : [],
      findings: Array.isArray(analysisResult?.findings)
        ? analysisResult.findings
        : Array.isArray(aiPayload?.compliance?.findings)
          ? aiPayload.compliance.findings
          : [],
    },

    rawQueries,
    rawAiResponse: aiPayload,
    rawAnalysisResult: analysisResult,
  };
}

export async function analyzeDocument({
  documentId,
  userId,
  queryText,
  options,
}: {
  documentId: string;
  userId?: string;
  queryText?: string;
  options?: AnalysisOptions;
}): Promise<any> {
  const { data } = await api.post("/compliance/analyze", {
    documentId,
    userId,
    queryText,
    options,
  });
  return data;
}

export async function getAnalysisResult(requestId: string): Promise<any> {
  const { data } = await api.get(`/compliance/analysis/${requestId}`);
  return data;
}

/** Trigger first-time AI analysis for an unanalyzed document */
export async function triggerDocumentAnalysis(
  documentId: string,
): Promise<{ requestId: string }> {
  const { data } = await api.post(`/documents/${documentId}/analyze`);
  return data;
}

/** Permanently delete all findings/risks for a document */
export async function resolveDocumentFindings(
  documentId: string,
): Promise<{ success: boolean; deletedCount: number }> {
  const { data } = await api.delete(`/documents/${documentId}/findings`);
  return data;
}

/** Poll the latest analysis request status for a document */
export async function getDocumentAnalysisStatus(
  documentId: string,
): Promise<{ id: string | null; status: string | null; errorMessage: string | null }> {
  const { data } = await api.get(`/compliance/document/${documentId}/status`);
  return data;
}
