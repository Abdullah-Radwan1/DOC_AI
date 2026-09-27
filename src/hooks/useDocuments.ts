import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as documentEndpoints from "@/lib/endpoints/document-endpoints";
import * as dashboardEndpoints from "@/lib/endpoints/dashboard-endpoints";
import * as analysisEndpoints from "@/lib/endpoints/analysis-endpoints";
import type { ActivityLogItem } from "@/lib/types/activity_types";
import { queryKeys } from "@/lib/query-keys";

export function useDocuments(params?: documentEndpoints.DocumentQueryParams) {
  return useQuery({
    queryKey: queryKeys.documents.list(params),
    queryFn: async () => {
      return documentEndpoints.getDocuments(params);
    },
  });
}

export function useDocument(documentId: string) {
  return useQuery({
    queryKey: queryKeys.documents.byId(documentId),
    queryFn: async () => {
      return documentEndpoints.getDocumentById(documentId);
    },
    enabled: !!documentId,
  });
}

export function useDocumentAnalysis(_documentId: string) {
  return useQuery({
    queryKey: queryKeys.documents.analysis(_documentId),
    queryFn: async () => {
      if (!_documentId) return null;
      return analysisEndpoints.getDocumentAnalysis(_documentId);
    },
    enabled: !!_documentId,
  });
}

export function useActivityLog(_limit = 10) {
  return useQuery({
    queryKey: queryKeys.activity.list(),
    queryFn: async (): Promise<ActivityLogItem[]> => [],
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: async () => {
      try {
        return dashboardEndpoints.getDashboardStats();
      } catch {
        return null;
      }
    },
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      file,
      query: _query,
    }: {
      userId?: string | null;
      file: File;
      query?: string;
    }) => {
      return documentEndpoints.uploadDocument({ userId, file });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documentId }: { documentId: string }) => {
      await documentEndpoints.deleteDocument(documentId);
    },
    onSuccess: (_data, variables) => {
      // refetchType: "all" ensures the list refetches even when it has no
      // active subscribers (e.g. a cached documents page in the background).
      queryClient.invalidateQueries({
        queryKey: queryKeys.documents.list(),
        refetchType: "all",
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() });
      if (variables?.documentId) {
        queryClient.removeQueries({ queryKey: queryKeys.documents.byId(variables.documentId) });
        queryClient.removeQueries({ queryKey: queryKeys.documents.analysis(variables.documentId) });
        queryClient.removeQueries({ queryKey: queryKeys.compliance.byDocument(variables.documentId) });
      }
    },
  });
}

/** Trigger first-time analysis for a document without prior analysis */
export function useAnalyzeDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documentId }: { documentId: string }) => {
      return analysisEndpoints.triggerDocumentAnalysis(documentId);
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        queryKeys.documents.analysisStatus(variables.documentId),
        {
          id: data.requestId,
          status: "pending",
          errorMessage: null,
        },
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
    },
  });
}

/** Clear all findings/risks/compliance issues for a document */
export function useResolveFindings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documentId }: { documentId: string }) => {
      return analysisEndpoints.resolveDocumentFindings(documentId);
    },
    onSuccess: (_data, variables) => {
      if (variables?.documentId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.documents.analysis(variables.documentId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.documents.byId(variables.documentId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.compliance.byDocument(variables.documentId),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
    },
  });
}

/** Poll analysis status for a document (used by the progress bar) */
export function useDocumentAnalysisStatus(
  documentId: string | null | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.documents.analysisStatus(documentId ?? ""),
    queryFn: async () => {
      if (!documentId) return null;
      return analysisEndpoints.getDocumentAnalysisStatus(documentId);
    },
    enabled: !!documentId && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "completed" || status === "failed") {
        return false;
      }
      if (status === "pending" || status === "processing") {
        return 1500;
      }
      // status is null/undefined: keep polling briefly so a just-created
      // request is not missed, then stop so idle documents are not hammered.
      return query.state.dataUpdateCount < 40 ? 1500 : false;
    },
    staleTime: 0,
  });
}
