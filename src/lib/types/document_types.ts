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
  id: z.string().nullable().optional(),
  analysisRequestId: z.string().nullable().optional(),
  summary: z.string().nullable(),
  analysisOptions: z.any().nullable().optional(),
  contract: z.object({
    expirationDate: z.string().nullable(),
    parties: z.any().nullable(),
    obligations: z.any().nullable(),
    paymentTerms: z.any().nullable(),
    penalties: z.any().nullable(),
    renewalTerms: z.any().nullable(),
    terminationTerms: z.any().nullable(),
    governingLaw: z.string().nullable(),
    importantDates: z.any().nullable(),
    missingClauses: z.any().nullable(),
  }),
  compliance: z.object({
    overallVerdict: z.string().nullable(),
    confidence: z.number().nullable(),
    riskLevel: z.string().nullable(),
    summary: z.object({
      passed: z.number(),
      failed: z.number(),
      partial: z.number(),
      unknown: z.number(),
    }),
    requirements: z.any(),
    findings: z.any(),
  }).nullable(),
  rawQueries: z.any().optional(),
  rawAiResponse: z.any().optional(),
  rawAnalysisResult: z.any().optional(),
});
export type DocumentAnalysis = z.infer<typeof DocumentAnalysisSchema>;
export const UpcomingExpirationSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  expirationDate: z.string(), // The backend converts Date to ISOString
  daysUntilExpiration: z.number(),
});

export type UpcomingExpiration = z.infer<typeof UpcomingExpirationSchema>;
