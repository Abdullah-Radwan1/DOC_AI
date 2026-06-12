import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, Json } from '@/lib/supabase';

export interface Document {
  id: string;
  organization_id: string;
  uploaded_by: string;
  filename: string;
  file_size: number | null;
  status: 'pending' | 'analyzing' | 'analyzed' | 'failed';
  compliance_score: number | null;
  risk_level: 'low' | 'medium' | 'high' | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
  };
}

export interface DocumentAnalysis {
  id: string;
  document_id: string;
  executive_summary: string | null;
  parties: Json | null;
  obligations: Json | null;
  payment_terms: Json | null;
  renewal_terms: Json | null;
  penalties: Json | null;
  governing_law: string | null;
  missing_clauses: Json | null;
  unusual_conditions: Json | null;
  compliance_requirements: Json | null;
  policy_violations: Json | null;
  regulatory_issues: Json | null;
  missing_signatures: Json | null;
  expiration_detected: boolean;
  risks: Json | null;
  recommendations: Json | null;
  important_dates: Json | null;
  created_at: string;
}

export interface ActivityLogItem {
  id: string;
  organization_id: string;
  user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Json | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
  };
}

// Mock data for demo
const generateMockAnalysis = (): DocumentAnalysis => ({
  id: 'mock-analysis-id',
  document_id: '',
  executive_summary: 'This contract establishes a service agreement between the parties for the provision of cloud computing services. The agreement contains standard terms with some notable clauses regarding data privacy and liability limitations. Overall compliance is good with a few areas requiring attention.',
  parties: {
    parties: [
      { name: 'Acme Corporation', role: 'Service Provider', address: '123 Business Ave, San Francisco, CA 94102' },
      { name: 'TechStart Inc.', role: 'Client', address: '456 Innovation Blvd, Austin, TX 78701' },
    ],
  },
  obligations: {
    obligations: [
      { party: 'Acme Corporation', obligation: 'Provide 99.9% uptime guarantee' },
      { party: 'Acme Corporation', obligation: 'Maintain data security compliance' },
      { party: 'TechStart Inc.', obligation: 'Pay invoices within 30 days' },
      { party: 'TechStart Inc.', obligation: 'Provide accurate usage data' },
    ],
  },
  payment_terms: {
    terms: [
      { description: 'Monthly subscription fee', amount: '$5,000', frequency: 'Monthly' },
      { description: 'Late payment penalty', amount: '1.5% per month', frequency: 'On overdue' },
      { description: 'Early termination fee', amount: '3 months of service', frequency: 'On termination' },
    ],
  },
  renewal_terms: {
    terms: [
      { type: 'Auto-renewal', period: '12 months', notice_period: '60 days prior to expiration' },
      { type: 'Price adjustment', description: 'Up to 5% annual increase with 30 days notice' },
    ],
  },
  penalties: {
    penalties: [
      { type: 'Service Level Failure', penalty: '10% credit of monthly fee per 0.1% below SLA' },
      { type: 'Data Breach', penalty: 'Direct damages up to $500,000' },
      { type: 'Confidentiality Breach', penalty: 'Injunctive relief plus damages' },
    ],
  },
  governing_law: 'State of Delaware, United States',
  missing_clauses: {
    clauses: [
      { name: 'Force Majeure', severity: 'medium', recommendation: 'Add clause for unforeseeable circumstances' },
      { name: 'Indemnification', severity: 'high', recommendation: 'Include mutual indemnification for third-party claims' },
      { name: 'Intellectual Property Rights', severity: 'low', recommendation: 'Clarify IP ownership for created materials' },
    ],
  },
  unusual_conditions: {
    conditions: [
      { description: 'Unlimited liability for data breach despite general liability cap', severity: 'high' },
      { description: 'Right to audit clause with only 24 hours notice', severity: 'medium' },
      { description: 'Non-compete clause extending 3 years post-termination', severity: 'medium' },
    ],
  },
  compliance_requirements: {
    requirements: [
      { regulation: 'GDPR', status: 'Partially Compliant', details: 'Data processing clauses present but DPA not attached' },
      { regulation: 'SOC 2', status: 'Compliant', details: 'SOC 2 Type II certification required annually' },
      { regulation: 'HIPAA', status: 'Not Applicable', details: 'No PHI data involved' },
      { regulation: 'CCPA', status: 'Partially Compliant', details: 'California residents notification required' },
    ],
  },
  policy_violations: {
    violations: [
      { policy: 'Data Retention Policy', description: '7-year retention exceeds standard 5-year policy', severity: 'low' },
      { policy: 'Vendor Assessment Policy', description: 'Annual review frequency not stipulated', severity: 'medium' },
    ],
  },
  regulatory_issues: {
    issues: [
      { regulation: 'State Data Privacy Laws', description: 'Virginia and Colorado privacy laws may apply', severity: 'low' },
    ],
  },
  missing_signatures: {
    signatures: [
      { party: 'TechStart Inc.', signatory: 'CEO', status: 'Missing' },
      { party: 'Acme Corporation', signatory: 'Authorized Representative', status: 'Present' },
    ],
  },
  expiration_detected: true,
  risks: {
    risks: [
      { category: 'Legal', description: 'Indemnification clause absent', severity: 'high', impact: 'Potential exposure to third-party claims' },
      { category: 'Financial', description: 'Unlimited data breach liability', severity: 'high', impact: 'Significant financial exposure' },
      { category: 'Operational', description: 'Auto-renewal with limited notice window', severity: 'medium', impact: 'Unexpected contract extension' },
      { category: 'Compliance', description: 'GDPR DPA not attached', severity: 'medium', impact: 'Compliance gap for EU data' },
      { category: 'Legal', description: 'Force majeure clause missing', severity: 'medium', impact: 'No protection for unforeseen events' },
      { category: 'Operational', description: 'Short audit notice period', severity: 'low', impact: 'Limited preparation time' },
    ],
  },
  recommendations: {
    recommendations: [
      { priority: 'critical', title: 'Add Mutual Indemnification Clause', description: 'Include comprehensive indemnification language protecting both parties from third-party claims.' },
      { priority: 'critical', title: 'Cap Data Breach Liability', description: 'Negotiate a reasonable cap on data breach liability aligned with your risk appetite.' },
      { priority: 'high', title: 'Attach Data Processing Agreement', description: 'Add a GDPR-compliant DPA as an exhibit to ensure compliance with EU data protection requirements.' },
      { priority: 'high', title: 'Extend Audit Notice Period', description: 'Request a minimum of 7 business days notice for any audit activities.' },
      { priority: 'medium', title: 'Add Force Majeure Clause', description: 'Include standard force majeure provisions for events beyond reasonable control.' },
      { priority: 'medium', title: 'Clarify Non-Compete Duration', description: 'Reduce non-compete period to 1 year to align with standard market practice.' },
      { priority: 'low', title: 'Add Intellectual Property Clause', description: 'Explicitly define ownership of any IP created during the engagement.' },
    ],
  },
  important_dates: {
    dates: [
      { type: 'Effective Date', date: '2024-01-15', description: 'Contract becomes effective' },
      { type: 'Expiration Date', date: '2025-01-14', description: 'Initial term expires, auto-renews unless terminated' },
      { type: 'Renewal Notice Deadline', date: '2024-11-15', description: 'Last day to provide non-renewal notice' },
      { type: 'Annual Review', date: '2024-07-15', description: 'Scheduled contract review meeting' },
      { type: 'SOC 2 Report Due', date: '2024-03-01', description: 'Annual SOC 2 Type II certification required' },
    ],
  },
  created_at: new Date().toISOString(),
});

export function useDocuments(organizationId: string | null) {
  return useQuery({
    queryKey: ['documents', organizationId],
    queryFn: async () => {
      if (!organizationId) return [];

      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          profiles:profiles!documents_uploaded_by_fkey(full_name, email)
        `)
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Document[];
    },
    enabled: !!organizationId,
  });
}

export function useDocument(documentId: string) {
  return useQuery({
    queryKey: ['document', documentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          profiles:profiles!documents_uploaded_by_fkey(full_name, email)
        `)
        .eq('id', documentId)
        .single();

      if (error) throw error;
      return data as Document;
    },
  });
}

export function useDocumentAnalysis(documentId: string) {
  return useQuery({
    queryKey: ['analysis', documentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_analyses')
        .select('*')
        .eq('document_id', documentId)
        .single();

      if (error) {
        // Return mock data for demo
        if (error.code === 'PGRST116') {
          return generateMockAnalysis() as DocumentAnalysis;
        }
        throw error;
      }
      return data as DocumentAnalysis;
    },
  });
}

export function useActivityLog(organizationId: string | null, limit = 10) {
  return useQuery({
    queryKey: ['activity', organizationId, limit],
    queryFn: async () => {
      if (!organizationId) return [];

      const { data, error } = await supabase
        .from('activity_log')
        .select(`
          *,
          profiles(full_name, email)
        `)
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as ActivityLogItem[];
    },
    enabled: !!organizationId,
  });
}

export function useDashboardStats(organizationId: string | null) {
  return useQuery({
    queryKey: ['dashboard-stats', organizationId],
    queryFn: async () => {
      if (!organizationId) return null;

      const [documentsResult, analyzedResult, highRiskResult, complianceResult] = await Promise.all([
        supabase.from('documents').select('id', { count: 'exact' }).eq('organization_id', organizationId),
        supabase.from('documents').select('id', { count: 'exact' }).eq('organization_id', organizationId).eq('status', 'analyzed'),
        supabase.from('documents').select('id', { count: 'exact' }).eq('organization_id', organizationId).eq('risk_level', 'high'),
        supabase.from('documents').select('compliance_score').eq('organization_id', organizationId).not('compliance_score', 'is', null),
      ]);

      const totalDocs = documentsResult.count || 0;
      const analyzedDocs = analyzedResult.count || 0;
      const highRiskDocs = highRiskResult.count || 0;

      const avgCompliance = complianceResult.data?.length
        ? Math.round(
            complianceResult.data.reduce((sum, doc) => sum + (doc.compliance_score || 0), 0) /
              complianceResult.data.length
          )
        : 78;

      // Return mock data for demo if no real data
      if (totalDocs === 0) {
        return {
          totalDocuments: 12,
          analyzedDocuments: 10,
          averageComplianceScore: 78,
          highRiskDocuments: 3,
          documentsLimit: 3,
          monthlyIngestion: [
            { month: 'Jan', documents: 8 },
            { month: 'Feb', documents: 12 },
            { month: 'Mar', documents: 15 },
            { month: 'Apr', documents: 10 },
            { month: 'May', documents: 18 },
            { month: 'Jun', documents: 12 },
          ],
          complianceTrend: [
            { month: 'Jan', score: 65 },
            { month: 'Feb', score: 70 },
            { month: 'Mar', score: 68 },
            { month: 'Apr', score: 75 },
            { month: 'May', score: 78 },
            { month: 'Jun', score: 78 },
          ],
        };
      }

      return {
        totalDocuments: totalDocs,
        analyzedDocuments: analyzedDocs,
        averageComplianceScore: avgCompliance,
        highRiskDocuments: highRiskDocs,
        documentsLimit: 3,
        monthlyIngestion: [],
        complianceTrend: [],
      };
    },
    enabled: !!organizationId,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      organizationId,
      userId,
      filename,
      fileSize,
    }: {
      organizationId: string;
      userId: string;
      filename: string;
      fileSize: number;
    }) => {
      const { data, error } = await supabase
        .from('documents')
        .insert({
          organization_id: organizationId,
          uploaded_by: userId,
          filename,
          file_size: fileSize,
          status: 'analyzing',
        })
        .select()
        .single();

      if (error) throw error;

      // Simulate analysis
      setTimeout(async () => {
        await supabase
          .from('documents')
          .update({
            status: 'analyzed',
            compliance_score: Math.floor(Math.random() * 30) + 60,
            risk_level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
          })
          .eq('id', data.id);

        // Generate analysis
        const mockAnalysis = generateMockAnalysis();
        await supabase.from('document_analyses').insert({
          ...mockAnalysis,
          id: undefined,
          document_id: data.id,
        });

        queryClient.invalidateQueries({ queryKey: ['documents'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      }, 3000);

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents', variables.organizationId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats', variables.organizationId] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documentId }: { documentId: string; organizationId: string }) => {
      const { error } = await supabase.from('documents').delete().eq('id', documentId);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents', variables.organizationId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats', variables.organizationId] });
    },
  });
}
