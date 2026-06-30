import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as endpoints from "@/lib/endpoints";
import type { ComplianceQuery } from "@/lib/schemas";

export function useComplianceQueries(documentId: string) {
  return useQuery({
    queryKey: ["compliance", "document", documentId],
    queryFn: async () => {
      return endpoints.getComplianceQueriesByDocument(documentId);
    },
    enabled: !!documentId,
  });
}

export function useCreateComplianceQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      queryText,
      userId,
      documentId,
    }: {
      queryText: string;
      userId: string;
      documentId?: string;
    }) => {
      return endpoints.createComplianceQuery({
        queryText,
        userId,
        documentId,
      });
    },
    onSuccess: (_, variables) => {
      if (variables.documentId) {
        queryClient.invalidateQueries({
          queryKey: ["compliance", "document", variables.documentId],
        });
      }
    },
  });
}
