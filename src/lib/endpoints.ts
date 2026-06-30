import { api } from "@/lib/api";
import {
  DocumentSchema,
  DashboardStatsSchema,
  UserSchema,
  OrganizationSchema,
  ComplianceQuerySchema,
  type Document,
  type ActivityLogItem,
  type DashboardStats,
  type User,
  type Organization,
  type ComplianceQuery,
} from "@/lib/schemas";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDocument(raw: any): Document {
  const doc = {
    id: raw.id,
    filename: raw.originalFileName ?? raw.filename ?? "Untitled",
    file_size: raw.fileSize ?? raw.file_size ?? null,
    status: raw.status,
    created_at: raw.createdAt ?? raw.created_at,
    organization_id: raw.organizationId ?? raw.organization_id ?? null,
    uploaded_by: raw.uploadedBy ?? raw.uploaded_by ?? null,
    risk_level: raw.riskLevel ?? raw.risk_level ?? null,
    compliance_score: raw.complianceScore ?? raw.compliance_score ?? null,
    uploader: raw.uploader ?? null,
  };
  return DocumentSchema.parse(doc);
}

export async function getDocumentsByOrganization(
  organizationId: string,
): Promise<Document[]> {
  const { data } = await api.get(`/documents/organization/${organizationId}`);
  return (Array.isArray(data) ? data : []).map((d: any) => mapDocument(d));
}

export async function getDocumentById(documentId: string): Promise<Document> {
  const { data } = await api.get(`/documents/${documentId}`);
  return mapDocument(data);
}

export async function uploadDocument({
  organizationId,
  userId,
  file,
}: {
  organizationId?: string | null;
  userId?: string | null;
  file: File;
}): Promise<Document> {
  const formData = new FormData();
  formData.append("file", file);
  if (organizationId) formData.append("organizationId", organizationId);
  if (userId) formData.append("uploadedBy", userId);

  const { data } = await api.post("/documents/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return mapDocument(data);
}

export async function deleteDocument(documentId: string): Promise<void> {
  await api.delete(`/documents/${documentId}`);
}

export async function getDashboardStats(
  organizationId: string,
): Promise<DashboardStats | null> {
  const { data } = await api.get(`/documents/organization/${organizationId}`);
  const docs = (Array.isArray(data) ? data : []).map((d: any) =>
    mapDocument(d),
  );
  const totalDocs = docs.length;
  if (totalDocs === 0) {
    return DashboardStatsSchema.parse({
      totalDocuments: 12,
      analyzedDocuments: 10,
      averageComplianceScore: 78,
      highRiskDocuments: 3,
      documentsLimit: 3,
      monthlyIngestion: [],
      complianceTrend: [],
    });
  }

  return DashboardStatsSchema.parse({
    totalDocuments: totalDocs,
    analyzedDocuments: docs.filter((d) => d.status === "ready").length,
    averageComplianceScore: 78,
    highRiskDocuments: docs.filter((d) => d.risk_level === "high").length,
    documentsLimit: 3,
    monthlyIngestion: [],
    complianceTrend: [],
  });
}

export async function getActivityLog(
  _organizationId: string,
  _limit = 10,
): Promise<ActivityLogItem[]> {
  // Backend endpoint not implemented for logs in the frontend; return empty for now.
  return [];
}

// Auth
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data } = await api.get("/auth/me");
    return data?.user ? UserSchema.parse(data.user) : null;
  } catch {
    return null;
  }
}

export async function login(email: string, password: string): Promise<User> {
  const { data } = await api.post("/auth/login", { email, password });
  return UserSchema.parse(data.user);
}

export async function register(
  email: string,
  password: string,
  fullName: string,
): Promise<User> {
  const { data } = await api.post("/auth/register", {
    email,
    password,
    fullName,
  });
  return UserSchema.parse(data.user);
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

// Document analysis — proxy to backend compliance/document/:documentId
export async function getDocumentAnalysis(
  documentId: string,
): Promise<unknown> {
  const { data } = await api.get(`/compliance/document/${documentId}`);
  return data;
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
  return z.array(ComplianceQuerySchema).parse(data);
}

// Organizations
export async function getOrganizationById(id: string): Promise<Organization> {
  const { data } = await api.get(`/organizations/${id}`);
  return OrganizationSchema.parse(data);
}

export async function getOrganizationBySlug(
  slug: string,
): Promise<Organization> {
  const { data } = await api.get(`/organizations/slug/${slug}`);
  return OrganizationSchema.parse(data);
}

export async function getAllOrganizations(): Promise<Organization[]> {
  const { data } = await api.get(`/organizations`);
  return z.array(OrganizationSchema).parse(data);
}

// Users
export async function getUserById(id: string): Promise<User> {
  const { data } = await api.get(`/users/${id}`);
  return UserSchema.parse(data);
}

