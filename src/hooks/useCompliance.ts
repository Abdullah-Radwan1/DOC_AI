import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as endpoints from "@/lib/endpoints/analysis-endpoints";
import { getComplianceQueriesByDocument } from "@/lib/endpoints/compliance_queries-endpoints.ts";
import { AnalysisOptions } from "@/lib/types/analysis-options";
import { queryKeys } from "@/lib/query-keys";

export function useComplianceQueries(documentId: string) {
  return useQuery({
    queryKey: queryKeys.compliance.byDocument(documentId),
    queryFn: async () => {
      return getComplianceQueriesByDocument(documentId);
    },
    enabled: !!documentId,
  });
}

export function useAnalyzeDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      queryText,
      userId,
      guestId,
      documentId,
      options,
    }: {
      queryText: string;
      userId?: string;
      guestId?: string;
      documentId: string;
      options?: AnalysisOptions;
    }) => {
      return endpoints.analyzeDocument({
        queryText,
        userId,
        documentId,
        options,
      });
    },
    onSuccess: (_, variables) => {
      if (variables.documentId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.compliance.byDocument(variables.documentId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.documents.analysis(variables.documentId),
        });
      }
    },
  });
}
