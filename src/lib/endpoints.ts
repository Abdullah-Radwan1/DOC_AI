import { api } from "@/lib/api";
import {
  DocumentSchema,
  DashboardStatsSchema,
  UserSchema,
  ComplianceQuerySchema,
  NotificationSchema,
  NotificationListSchema,
  NotificationPreferencesSchema,
  type Document,
  type ActivityLogItem,
  type DashboardStats,
  type User,
  type ComplianceQuery,
  type AppNotification,
  type NotificationList,
  type NotificationPreferences,
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
  if (userId) formData.append("uploadedBy", userId);

  const { data } = await api.post("/documents/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return mapDocument(data);
}

export async function deleteDocument(documentId: string): Promise<void> {
  await api.delete(`/documents/${documentId}`);
}

export async function getDashboardStats(): Promise<DashboardStats | null> {
  try {
    const { data } = await api.get("/dashboard/summary");
    return DashboardStatsSchema.parse(data);
  } catch {
    return null;
  }
}

export async function getActivityLog(_limit = 10): Promise<ActivityLogItem[]> {
  return [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapUser(raw: any): User {
  const user = {
    id: raw.id,
    email: raw.email,
    full_name: raw.fullName ?? raw.full_name ?? null,
    avatar_url: raw.avatarUrl ?? raw.avatar_url ?? null,
    role: raw.role,
    created_at: raw.createdAt ?? raw.created_at,
    updated_at: raw.updatedAt ?? raw.updated_at,
    notification_preferences: {
      allow_email_notifications:
        raw.allowEmailNotifications ?? raw.allow_email_notifications ?? true,
      allow_expiry_reminders:
        raw.allowExpiryReminders ?? raw.allow_expiry_reminders ?? true,
      allow_risk_alerts: raw.allowRiskAlerts ?? raw.allow_risk_alerts ?? true,
      allow_analysis_alerts:
        raw.allowAnalysisAlerts ?? raw.allow_analysis_alerts ?? true,
    },
  };
  return UserSchema.parse(user);
}

// Auth
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data } = await api.get("/auth/me");
    return data?.user ? mapUser(data.user) : null;
  } catch {
    return null;
  }
}

export async function login(email: string, password: string): Promise<User> {
  const { data } = await api.post("/auth/login", { email, password });
  return mapUser(data.user);
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
  return mapUser(data.user);
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

export async function analyzeDocument({
  documentId,
  userId,
  guestId,
  queryText,
}: {
  documentId: string;
  userId?: string;
  guestId?: string;
  queryText: string;
}): Promise<any> {
  const { data } = await api.post("/compliance/analyze", {
    documentId,
    userId,
    guestId,
    queryText,
  });
  return data;
}

export async function getAnalysisResult(requestId: string): Promise<any> {
  const { data } = await api.get(`/compliance/analysis/${requestId}`);
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

// Users
export async function getUserById(id: string): Promise<User> {
  const { data } = await api.get(`/users/${id}`);
  return mapUser(data);
}

// Profile (self-service)
export interface UpdateProfilePayload {
  fullName?: string;
  allowEmailNotifications?: boolean;
  allowExpiryReminders?: boolean;
  allowRiskAlerts?: boolean;
  allowAnalysisAlerts?: boolean;
}

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<User> {
  const { data } = await api.patch("/users/me", payload);
  return mapUser(data);
}

export async function getMyPreferences(): Promise<NotificationPreferences> {
  const { data } = await api.get("/users/me");
  const preferences = NotificationPreferencesSchema.parse({
    allow_email_notifications:
      data?.allow_email_notifications ??
      data?.notification_preferences?.allow_email_notifications ??
      true,
    allow_expiry_reminders:
      data?.allow_expiry_reminders ??
      data?.notification_preferences?.allow_expiry_reminders ??
      true,
    allow_risk_alerts:
      data?.allow_risk_alerts ??
      data?.notification_preferences?.allow_risk_alerts ??
      true,
    allow_analysis_alerts:
      data?.allow_analysis_alerts ??
      data?.notification_preferences?.allow_analysis_alerts ??
      true,
  });
  return preferences;
}

// Password management
export async function changePassword(payload: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<{ message: string }> {
  const { data } = await api.patch("/auth/me/password", payload);
  return data;
}

export async function forgotPassword(
  email: string,
): Promise<{ message: string }> {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
}

export async function resetPassword(payload: {
  token: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<{ message: string }> {
  const { data } = await api.post("/auth/reset-password", payload);
  return data;
}

// Notifications
export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  status?: "unread" | "read" | "archived" | "all";
}

export async function getMyNotifications(
  params?: NotificationQueryParams,
): Promise<NotificationList> {
  const { data } = await api.get("/notifications/me", { params });
  return NotificationListSchema.parse(data);
}

export async function getUnreadCount(): Promise<{ count: number }> {
  const { data } = await api.get("/notifications/me/unread-count");
  return data;
}

export async function markNotificationRead(
  id: string,
): Promise<AppNotification> {
  const { data } = await api.patch(`/notifications/${id}/read`);
  return NotificationSchema.parse(data);
}

export async function markAllNotificationsRead(): Promise<{ message: string }> {
  const { data } = await api.post("/notifications/me/read-all");
  return data;
}
