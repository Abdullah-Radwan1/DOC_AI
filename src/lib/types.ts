// Shared frontend types for API responses

export type UserRole = "admin" | "compliance_manager" | "auditor" | "viewer";

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
}

export interface Document {
  id: string;
  filename: string;
  file_size: number | null;
  status: "uploaded" | "extracting" | "chunking" | "ready" | "failed" | string;
  created_at: string;
  uploaded_by: string | null;
  risk_level?: string | null;
  compliance_score?: number | null;
  uploader?: { fullName: string | null; email: string } | null;
}

export interface DocumentAnalysis {
  id: string;
  document_id: string;
  executive_summary: string | null;
  parties: unknown;
  obligations: unknown;
  payment_terms: unknown;
  renewal_terms: unknown;
  penalties: unknown;
  governing_law: string | null;
  missing_clauses: unknown;
  unusual_conditions: unknown;
  compliance_requirements: unknown;
  policy_violations: unknown;
  regulatory_issues: unknown;
  missing_signatures: unknown;
  expiration_detected: boolean;
  risks: unknown;
  recommendations: unknown;
  important_dates: unknown;
  created_at: string;
}

export interface ActivityLogItem {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: unknown;
  created_at: string;
}

export interface DashboardStats {
  totalDocuments: number;
  analyzedDocuments: number;
  averageComplianceScore: number;
  highRiskDocuments: number;
  documentsLimit: number;
  monthlyIngestion: Array<{ month: string; documents: number }>;
  complianceTrend: Array<{ month: string; score: number }>;
}
