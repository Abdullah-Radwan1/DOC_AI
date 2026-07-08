import { z } from "zod";

export const AIResponseSchema = z.object({
  id: z.string(),
  requestId: z.string(),
  response: z.any(),
  confidenceScore: z.number().nullable(),
  createdAt: z.string(),
});
export type AIResponse = z.infer<typeof AIResponseSchema>;
