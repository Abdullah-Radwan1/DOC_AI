import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as endpoints from "@/lib/endpoints";
import type { Document, DocumentAnalysis, ActivityLogItem } from "@/lib/schemas";

// ─── Helpers ──────────────────────────────────────────────────────────────────
// mapping is handled in the endpoints layer

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useDocuments(organizationId: string | null) {
  return useQuery({
    queryKey: ["documents", organizationId],
    queryFn: async () => {
      if (!organizationId) return [];
      return endpoints.getDocumentsByOrganization(organizationId);
    },
    enabled: !!organizationId,
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

export function useActivityLog(organizationId: string | null, _limit = 10) {
  return useQuery({
    queryKey: ["activity", organizationId],
    queryFn: async (): Promise<ActivityLogItem[]> => [],
    enabled: !!organizationId,
  });
}

export function useDashboardStats(organizationId: string | null) {
  return useQuery({
    queryKey: ["dashboard-stats", organizationId],
    queryFn: async () => {
      if (!organizationId) return null;

      try {
        return endpoints.getDashboardStats(organizationId);
      } catch {
        return null;
      }
    },
    enabled: !!organizationId,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      organizationId,
      userId,
      file,
    }: {
      organizationId?: string | null;
      userId?: string | null;
      file: File;
    }) => {
      return endpoints.uploadDocument({ organizationId, userId, file });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["documents", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard-stats", variables.organizationId],
      });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      documentId,
    }: {
      documentId: string;
      organizationId?: string | null;
    }) => {
      await endpoints.deleteDocument(documentId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["documents", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard-stats", variables.organizationId],
      });
    },
  });
}
