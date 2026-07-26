import { z } from "zod";

export const NotificationTypeSchema = z.enum([
  "expiration_warning",
  "compliance_alert",
  "system_alert",
]);

export const NotificationStatusSchema = z.enum(["unread", "read", "archived"]);

export const NotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  message: z.string(),
  type: NotificationTypeSchema,
  status: NotificationStatusSchema,
  deliveryChannel: z.string(),
  documentId: z.string().nullable().optional(),
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

export const NotificationPreferencesSchema = z.object({
  allow_email_notifications: z.boolean(),
  allow_expiry_reminders: z.boolean(),
  allow_risk_alerts: z.boolean(),
  allow_analysis_alerts: z.boolean(),
});
export type NotificationPreferences = z.infer<
  typeof NotificationPreferencesSchema
>;
