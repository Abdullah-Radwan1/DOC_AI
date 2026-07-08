import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as documentEndpoints from "@/lib/endpoints/document-endpoints";
import * as dashboardEndpoints from "@/lib/endpoints/dashboard-endpoints";
import * as analysisEndpoints from "@/lib/endpoints/analysis-endpoints";
import type { ActivityLogItem } from "@/lib/types/activity_types";

export function useDocuments(params?: documentEndpoints.DocumentQueryParams) {
  return useQuery({
    queryKey: ["documents", params],
    queryFn: async () => {
      return documentEndpoints.getDocuments(params);
    },
  });
}

export function useDocument(documentId: string) {
  return useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      return documentEndpoints.getDocumentById(documentId);
    },
    enabled: !!documentId,
  });
}

export function useDocumentAnalysis(_documentId: string) {
  return useQuery({
    queryKey: ["analysis", _documentId],
    queryFn: async () => {
      if (!_documentId) return null;
      return analysisEndpoints.getDocumentAnalysis(_documentId);
    },
    enabled: !!_documentId,
  });
}

export function useActivityLog(_limit = 10) {
  return useQuery({
    queryKey: ["activity"],
    queryFn: async (): Promise<ActivityLogItem[]> => [],
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
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
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documentId }: { documentId: string }) => {
      await documentEndpoints.deleteDocument(documentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}
