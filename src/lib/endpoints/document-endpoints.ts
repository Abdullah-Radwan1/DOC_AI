import { api } from "@/lib/api";
import { DocumentSchema, type Document } from "@/lib/schemas";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDocument(raw: any): Document {
  const doc = {
    id: raw.id,
    filename: raw.originalFileName ?? raw.filename ?? "Untitled",
    file_size: raw.fileSize ?? raw.file_size ?? null,
    status: raw.status,
    created_at: raw.createdAt ?? raw.created_at,
    uploaded_by: raw.uploadedBy ?? raw.uploaded_by ?? null,
    risk_level: raw.riskLevel ?? raw.risk_level ?? null,
    compliance_score: raw.complianceScore ?? raw.compliance_score ?? null,
    uploader: raw.uploader ?? null,
  };
  return DocumentSchema.parse(doc);
}

export interface DocumentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  riskLevel?: string;
}

export async function getDocuments(params?: DocumentQueryParams): Promise<{
  data: Document[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}> {
  const { data } = await api.get("/documents", { params });
  return {
    data: (Array.isArray(data?.data) ? data.data : []).map((d: any) =>
      mapDocument(d),
    ),
    meta: data?.meta ?? {
      totalItems: 0,
      itemCount: 0,
      itemsPerPage: 10,
      totalPages: 0,
      currentPage: 1,
    },
  };
}

export async function getDocumentById(documentId: string): Promise<Document> {
  const { data } = await api.get(`/documents/${documentId}`);
  return mapDocument(data);
}

export async function uploadDocument({
  userId,
  file,
}: {
  userId?: string | null;
  file: File;
}): Promise<Document> {
  const formData = new FormData();
  formData.append("file", file);

  if (userId) {
    const { data } = await api.post("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return mapDocument(data);
  } else {
    // Guest upload: backend identifies by IP address automatically.
    // No guestToken management needed on the client.
    const { data } = await api.post("/documents/guest-upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return mapDocument(data.document ?? data);
  }
}

export async function deleteDocument(documentId: string): Promise<void> {
  await api.delete(`/documents/${documentId}`);
}
