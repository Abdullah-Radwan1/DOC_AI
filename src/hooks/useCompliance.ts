import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as endpoints from "@/lib/endpoints";

export function useComplianceQueries(documentId: string) {
  return useQuery({
    queryKey: ["compliance", "document", documentId],
    queryFn: async () => {
      return endpoints.getComplianceQueriesByDocument(documentId);
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
    }: {
      queryText: string;
      userId?: string;
      guestId?: string;
      documentId: string;
    }) => {
      return endpoints.analyzeDocument({
        queryText,
        userId,
        guestId,
        documentId,
      });
    },
    onSuccess: (_, variables) => {
      if (variables.documentId) {
        queryClient.invalidateQueries({
          queryKey: ["compliance", "document", variables.documentId],
        });
        queryClient.invalidateQueries({
          queryKey: ["analysis", variables.documentId],
        });
      }
    },
  });
}
