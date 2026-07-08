import { z } from "zod";

export const UploadedDocumentSchema = z.object({
  id: z.string().uuid(),
  originalFileName: z.string(),
  mimeType: z.string().nullable().optional(),
  checksum: z.string().nullable().optional(),
  fileSize: z.number().nullable().optional(),
  pageCount: z.number().nullable().optional(),
  totalChunks: z.number().nullable().optional(),
  status: z.enum(["uploaded", "extracting", "chunking", "ready", "failed"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type UploadedDocument = z.infer<typeof UploadedDocumentSchema>;

export const UploadDocumentResponseSchema = z.object({
  document: UploadedDocumentSchema,
  guestToken: z.string().optional(),
});

export type UploadDocumentResponse = z.infer<
  typeof UploadDocumentResponseSchema
>;

export const DocumentSchema = z.object({
  id: z.string(),
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

export const DocumentAnalysisSchema = z.object({
  id: z.string(),
  document_id: z.string(),
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
