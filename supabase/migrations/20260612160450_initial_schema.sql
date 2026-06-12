-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table (multi-tenant)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free',
  documents_limit INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'compliance_manager', 'auditor', 'viewer')),
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_size INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing', 'analyzed', 'failed')),
  compliance_score INTEGER,
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document analyses table (AI analysis results)
CREATE TABLE document_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  executive_summary TEXT,
  parties JSONB,
  obligations JSONB,
  payment_terms JSONB,
  renewal_terms JSONB,
  penalties JSONB,
  governing_law TEXT,
  missing_clauses JSONB,
  unusual_conditions JSONB,
  compliance_requirements JSONB,
  policy_violations JSONB,
  regulatory_issues JSONB,
  missing_signatures JSONB,
  expiration_detected BOOLEAN DEFAULT FALSE,
  risks JSONB,
  recommendations JSONB,
  important_dates JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity log table
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "select_own_organizations" ON organizations FOR SELECT
  TO authenticated USING (id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "insert_organizations" ON organizations FOR INSERT
  TO authenticated WITH CHECK (true);
CREATE POLICY "update_own_organizations" ON organizations FOR UPDATE
  TO authenticated USING (id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- RLS Policies for profiles
CREATE POLICY "select_profiles" ON profiles FOR SELECT
  TO authenticated USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()) OR id = auth.uid());
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (id = auth.uid());
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (id = auth.uid());

-- RLS Policies for documents
CREATE POLICY "select_org_documents" ON documents FOR SELECT
  TO authenticated USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "insert_org_documents" ON documents FOR INSERT
  TO authenticated WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "update_org_documents" ON documents FOR UPDATE
  TO authenticated USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "delete_org_documents" ON documents FOR DELETE
  TO authenticated USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- RLS Policies for document_analyses
CREATE POLICY "select_org_analyses" ON document_analyses FOR SELECT
  TO authenticated USING (document_id IN (SELECT id FROM documents WHERE organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())));
CREATE POLICY "insert_org_analyses" ON document_analyses FOR INSERT
  TO authenticated WITH CHECK (document_id IN (SELECT id FROM documents WHERE organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())));

-- RLS Policies for activity_log
CREATE POLICY "select_org_activity" ON activity_log FOR SELECT
  TO authenticated USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "insert_org_activity" ON activity_log FOR INSERT
  TO authenticated WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Create indexes for performance
CREATE INDEX idx_documents_organization ON documents(organization_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_created ON documents(created_at DESC);
CREATE INDEX idx_analyses_document ON document_analyses(document_id);
CREATE INDEX idx_activity_org ON activity_log(organization_id, created_at DESC);
CREATE INDEX idx_profiles_org ON profiles(organization_id);
