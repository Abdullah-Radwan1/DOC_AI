import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          plan: string;
          documents_limit: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          plan?: string;
          documents_limit?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          plan?: string;
          documents_limit?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'admin' | 'compliance_manager' | 'auditor' | 'viewer';
          organization_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'compliance_manager' | 'auditor' | 'viewer';
          organization_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'compliance_manager' | 'auditor' | 'viewer';
          organization_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
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
        };
        Insert: {
          id?: string;
          organization_id: string;
          uploaded_by: string;
          filename: string;
          file_size?: number | null;
          status?: 'pending' | 'analyzing' | 'analyzed' | 'failed';
          compliance_score?: number | null;
          risk_level?: 'low' | 'medium' | 'high' | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          uploaded_by?: string;
          filename?: string;
          file_size?: number | null;
          status?: 'pending' | 'analyzing' | 'analyzed' | 'failed';
          compliance_score?: number | null;
          risk_level?: 'low' | 'medium' | 'high' | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      document_analyses: {
        Row: {
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
        };
        Insert: {
          id?: string;
          document_id: string;
          executive_summary?: string | null;
          parties?: Json | null;
          obligations?: Json | null;
          payment_terms?: Json | null;
          renewal_terms?: Json | null;
          penalties?: Json | null;
          governing_law?: string | null;
          missing_clauses?: Json | null;
          unusual_conditions?: Json | null;
          compliance_requirements?: Json | null;
          policy_violations?: Json | null;
          regulatory_issues?: Json | null;
          missing_signatures?: Json | null;
          expiration_detected?: boolean;
          risks?: Json | null;
          recommendations?: Json | null;
          important_dates?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          document_id?: string;
          executive_summary?: string | null;
          parties?: Json | null;
          obligations?: Json | null;
          payment_terms?: Json | null;
          renewal_terms?: Json | null;
          penalties?: Json | null;
          governing_law?: string | null;
          missing_clauses?: Json | null;
          unusual_conditions?: Json | null;
          compliance_requirements?: Json | null;
          policy_violations?: Json | null;
          regulatory_issues?: Json | null;
          missing_signatures?: Json | null;
          expiration_detected?: boolean;
          risks?: Json | null;
          recommendations?: Json | null;
          important_dates?: Json | null;
          created_at?: string;
        };
      };
      activity_log: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string | null;
          action: string;
          entity_type: string | null;
          entity_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id?: string | null;
          action: string;
          entity_type?: string | null;
          entity_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          user_id?: string | null;
          action?: string;
          entity_type?: string | null;
          entity_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
      };
    };
  };
};

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
