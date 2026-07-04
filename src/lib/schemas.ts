import { z } from "zod";

// Shared frontend types mapped from backend schemas

export const UserRoleSchema = z.enum([
  "admin",
  "compliance_manager",
  "auditor",
  "viewer",
]);

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().nullable(),
  avatar_url: z.string().nullable().optional(),
  role: UserRoleSchema,
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type User = z.infer<typeof UserSchema>;

export const DocumentSchema = z.object({
  id: z.string().uuid(),
  filename: z.string(),
  file_size: z.number().nullable(),
  status: z.string(),
  created_at: z.string(),
  uploaded_by: z.string().nullable(),
  risk_level: z.string().nullable().optional(),
  compliance_score: z.number().nullable().optional(),
  uploader: z
    .object({
      fullName: z.string().nullable(),
      email: z.string(),
    })
    .nullable()
    .optional(),
});
export type Document = z.infer<typeof DocumentSchema>;

export const AIResponseSchema = z.object({
  id: z.string().uuid(),
  requestId: z.string().uuid(),
  response: z.any(),
  confidenceScore: z.number().nullable(),
  createdAt: z.string(),
});
export type AIResponse = z.infer<typeof AIResponseSchema>;

export const ComplianceQuerySchema = z.object({
  id: z.string().uuid(),
  queryText: z.string(),
  status: z.enum(["pending", "processing", "completed", "failed"]),
  documentId: z.string().uuid().nullable(),
  userId: z.string().uuid(),
  response: AIResponseSchema.nullable().optional(),
  createdAt: z.string(),
});
export type ComplianceQuery = z.infer<typeof ComplianceQuerySchema>;

export const ActivityLogItemSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().nullable(),
  action: z.string(),
  entity_type: z.string().nullable(),
  entity_id: z.string().nullable(),
  metadata: z.any(),
  created_at: z.string(),
});
export type ActivityLogItem = z.infer<typeof ActivityLogItemSchema>;

export const DocumentAnalysisSchema = z.object({
  id: z.string().uuid(),
  document_id: z.string().uuid(),
  executive_summary: z.string().nullable(),
  parties: z.any(),
  obligations: z.any(),
  payment_terms: z.any(),
  renewal_terms: z.any(),
  penalties: z.any(),
  governing_law: z.string().nullable(),
  missing_clauses: z.any(),
  unusual_conditions: z.any(),
  compliance_requirements: z.any(),
  policy_violations: z.any(),
  regulatory_issues: z.any(),
  missing_signatures: z.any(),
  expiration_detected: z.boolean(),
  risks: z.any(),
  recommendations: z.any(),
  important_dates: z.any(),
  created_at: z.string(),
});
export type DocumentAnalysis = z.infer<typeof DocumentAnalysisSchema>;

export const DashboardStatsSchema = z.object({
  totalDocuments: z.number(),
  analyzedDocuments: z.number(),
  averageComplianceScore: z.number(),
  highRiskDocuments: z.number(),
  documentsLimit: z.number(),
  monthlyIngestion: z.array(
    z.object({ month: z.string(), documents: z.number() }),
  ),
  complianceTrend: z.array(z.object({ month: z.string(), score: z.number() })),
});
export type DashboardStats = z.infer<typeof DashboardStatsSchema>;
