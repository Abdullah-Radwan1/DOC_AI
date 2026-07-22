import { z } from "zod";
import { NotificationPreferencesSchema } from "./notification_types";

export const PlanTypeSchema = z.enum(["free", "Professional", "Elite"]);

export const UsageQuotaSchema = z.object({
  uploads_used: z.number(),
  analyses_used: z.number(),
});

export const UserRoleSchema = z.enum([
  "admin",
  "compliance_manager",
  "auditor",
  "viewer",
]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  full_name: z.string().nullable(),
  avatar_url: z.string().nullable().optional(),
  role: UserRoleSchema,
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  notification_preferences: NotificationPreferencesSchema.optional(),
  plan: PlanTypeSchema.optional(),
  billing_cycle: z.enum(["monthly", "yearly"]).optional(),
  usage_quota: UsageQuotaSchema.optional(),
});
export type User = z.infer<typeof UserSchema>;
