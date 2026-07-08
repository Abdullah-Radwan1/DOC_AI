import { z } from "zod";
import { AIResponseSchema } from "./ai_types";

// Shared frontend types for API responses

// -----------------------------------------------------------------------------
// Upload response schemas
// -----------------------------------------------------------------------------

export const ComplianceQuerySchema = z.object({
  id: z.string(),
  queryText: z.string(),
  status: z.enum(["pending", "processing", "completed", "failed"]),
  documentId: z.string().nullable(),
  userId: z.string(),
  response: AIResponseSchema.nullable().optional(),
  createdAt: z.string(),
});
export type ComplianceQuery = z.infer<typeof ComplianceQuerySchema>;
