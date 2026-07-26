import { z } from "zod";
import {
  DocumentAttentionSchema,
  ExpirationSchema,
  KpisSchema,
  RecentAnalysisSchema,
} from "./analysis_types";
import { ActivitySchema } from "./activity_types";

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

export const DashboardStatsSchema = DashboardSummarySchema;
export type DashboardStats = DashboardSummary;
