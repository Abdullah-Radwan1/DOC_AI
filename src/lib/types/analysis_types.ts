import { z } from "zod";

export const KpisSchema = z.object({
  totalDocuments: z.number(),
  readyDocuments: z.number(),
  processingDocuments: z.number(),
  failedDocuments: z.number(),
  totalAnalyses: z.number(),
  completedAnalyses: z.number(),
  pendingAnalyses: z.number(),
  failedAnalyses: z.number(),
  unreadNotifications: z.number(),
  expiredDocuments: z.number(),
  expiringSoonDocuments: z.number(),
  complianceRate: z.number(),
});

export const RecentAnalysisSchema = z.object({
  id: z.string(),
  documentId: z.string().nullable(),
  documentName: z.string().nullable(),
  requestStatus: z.enum(["pending", "processing", "completed", "failed"]),
  verdict: z
    .enum(["compliant", "partial", "non_compliant", "unknown"])
    .nullable(),
  riskLevel: z.enum(["low", "medium", "high"]).nullable(),
  confidenceScore: z.number().nullable(),
  createdAt: z.string(),
});

export const DocumentAttentionSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  dashboardStatus: z.string(),
  riskLevel: z.enum(["low", "medium", "high"]).nullable(),
  criticalFindings: z.number(),
  highFindings: z.number(),
  expirationDate: z.string().nullable(),
});

export const ExpirationSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  expirationDate: z.string(),
  daysUntilExpiration: z.number(),
});
