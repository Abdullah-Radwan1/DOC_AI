import { z } from "zod";

// Shared frontend types mapped from backend schemas

export const UserRoleSchema = z.enum([
  "admin",
  "compliance_manager",
  "auditor",
  "viewer",
]);

export const NotificationPreferencesSchema = z.object({
  allow_email_notifications: z.boolean(),
  allow_expiry_reminders: z.boolean(),
  allow_risk_alerts: z.boolean(),
  allow_analysis_alerts: z.boolean(),
});
export type NotificationPreferences = z.infer<
  typeof NotificationPreferencesSchema
>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().nullable(),
  avatar_url: z.string().nullable().optional(),
  role: UserRoleSchema,
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  notification_preferences: NotificationPreferencesSchema.optional(),
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

// ─── Notifications ───────────────────────────────────────────────────────────

export const NotificationTypeSchema = z.enum([
  "expiration_warning",
  "compliance_alert",
  "system_alert",
]);

export const NotificationStatusSchema = z.enum(["unread", "read", "archived"]);

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string(),
  message: z.string(),
  type: NotificationTypeSchema,
  status: NotificationStatusSchema,
  deliveryChannel: z.string(),
  documentId: z.string().uuid().nullable().optional(),
  document: z.object({ originalFileName: z.string() }).nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type AppNotification = z.infer<typeof NotificationSchema>;

export const NotificationListSchema = z.object({
  data: z.array(NotificationSchema),
  meta: z.object({
    totalItems: z.number(),
    itemCount: z.number(),
    itemsPerPage: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
  }),
});
export type NotificationList = z.infer<typeof NotificationListSchema>;

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

// ─── Dashboard Summary (server-aggregated) ────────────────────────────────────

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
  id: z.string().uuid(),
  documentId: z.string().uuid().nullable(),
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
  id: z.string().uuid(),
  fileName: z.string(),
  dashboardStatus: z.string(),
  riskLevel: z.enum(["low", "medium", "high"]).nullable(),
  criticalFindings: z.number(),
  highFindings: z.number(),
  expirationDate: z.string().nullable(),
});

export const ExpirationSchema = z.object({
  id: z.string().uuid(),
  fileName: z.string(),
  expirationDate: z.string(),
  daysUntilExpiration: z.number(),
});

export const ActivitySchema = z.object({
  id: z.string().uuid(),
  action: z.string(),
  entityType: z.string().nullable(),
  entityId: z.string().nullable(),
  userEmail: z.string().nullable(),
  userFullName: z.string().nullable(),
  metadata: z.record(z.unknown()).nullable(),
  createdAt: z.string(),
});

export const DashboardSummarySchema = z.object({
  generatedAt: z.string(),
  kpis: KpisSchema,
  complianceDistribution: z.object({
    compliant: z.number(),
    partial: z.number(),
    non_compliant: z.number(),
    unknown: z.number(),
  }),
  riskDistribution: z.object({
    low: z.number(),
    medium: z.number(),
    high: z.number(),
  }),
  findingsSeverityBreakdown: z.object({
    info: z.number(),
    low: z.number(),
    medium: z.number(),
    high: z.number(),
    critical: z.number(),
  }),
  documentStatusBreakdown: z.object({
    uploaded: z.number(),
    extracting: z.number(),
    chunking: z.number(),
    ready: z.number(),
    failed: z.number(),
  }),
  recentAnalyses: z.array(RecentAnalysisSchema),
  documentsRequiringAttention: z.array(DocumentAttentionSchema),
  upcomingExpirations: z.array(ExpirationSchema),
  recentActivity: z.array(ActivitySchema),
});

export type DashboardSummary = z.infer<typeof DashboardSummarySchema>;

// Legacy alias kept for any imports that still reference DashboardStats
export const DashboardStatsSchema = DashboardSummarySchema;
export type DashboardStats = DashboardSummary;
