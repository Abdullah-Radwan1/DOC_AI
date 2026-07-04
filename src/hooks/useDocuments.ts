import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as endpoints from "@/lib/endpoints";
import type { ActivityLogItem } from "@/lib/schemas";

export function useDocuments() {
  return useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      return endpoints.getDocuments();
    },
  });
}

export function useDocument(documentId: string) {
  return useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      return endpoints.getDocumentById(documentId);
    },
    enabled: !!documentId,
  });
}

export function useDocumentAnalysis(_documentId: string) {
  return useQuery({
    queryKey: ["analysis", _documentId],
    queryFn: async () => {
      if (!_documentId) return null;
      return endpoints.getDocumentAnalysis(_documentId);
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
        return endpoints.getDashboardStats();
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
      return endpoints.uploadDocument({ userId, file });
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
      await endpoints.deleteDocument(documentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}
