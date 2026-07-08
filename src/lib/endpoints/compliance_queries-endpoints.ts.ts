import { api } from "@/lib/api";
import { ComplianceQuerySchema, type ComplianceQuery } from "@/lib/schemas";

function mapComplianceQuery(raw: any) {
  const response = raw?.response ?? null;

  return {
    id: raw?.id,
    queryText: raw?.queryText ?? raw?.query_text ?? "",
    status: raw?.status ?? "completed",
    documentId: raw?.documentId ?? raw?.document_id ?? null,
    userId: raw?.userId ?? raw?.user_id ?? "",
    response,
    createdAt: raw?.createdAt ?? raw?.created_at ?? new Date().toISOString(),
  };
}

// Compliance Queries
export async function createComplianceQuery({
  queryText,
  userId,
  documentId,
}: {
  queryText: string;
  userId: string;
  documentId?: string;
}): Promise<ComplianceQuery> {
  const { data } = await api.post("/compliance/query", {
    queryText,
    userId,
    documentId,
  });
  return ComplianceQuerySchema.parse(data);
}

export async function getComplianceQueriesByDocument(
  documentId: string,
): Promise<ComplianceQuery[]> {
  const { data } = await api.get(`/compliance/document/${documentId}`);
  const rawQueries = Array.isArray(data) ? data : data ? [data] : [];
  return rawQueries.map((entry: any) => mapComplianceQuery(entry));
}
