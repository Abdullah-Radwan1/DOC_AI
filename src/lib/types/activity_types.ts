import { z } from "zod";

export const ActivityLogItemSchema = z.object({
  id: z.string(),
  user_id: z.string().nullable(),
  action: z.string(),
  entity_type: z.string().nullable(),
  entity_id: z.string().nullable(),
  metadata: z.any(),
  created_at: z.string(),
});
export type ActivityLogItem = z.infer<typeof ActivityLogItemSchema>;
export const ActivitySchema = z.object({
  id: z.string(),
  action: z.string(),
  entityType: z.string().nullable(),
  entityId: z.string().nullable(),
  userEmail: z.string().nullable(),
  userFullName: z.string().nullable(),
  metadata: z.record(z.unknown()).nullable(),
  createdAt: z.string(),
});
