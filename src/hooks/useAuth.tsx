import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export type UserRole = 'admin' | 'compliance_manager' | 'auditor' | 'viewer';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  organization_id: string | null;
  organization_name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  mockSignIn: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchUserProfile(session.user.id, session.user.email || '');
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserProfile(session.user.id, session.user.email || '');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*, organizations(name)')
        .eq('id', userId)
        .single();

      if (profile) {
        setUser({
          id: userId,
          email,
          full_name: profile.full_name,
          role: profile.role,
          organization_id: profile.organization_id,
          organization_name: profile.organizations?.name,
        });
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      if (data.user) {
        // Create profile
        await supabase.from('profiles').insert({
          id: data.user.id,
          email,
          full_name: fullName,
          role: 'viewer',
        });
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const mockSignIn = async (role: UserRole) => {
    // For demo purposes - simulate login with mock user
    const mockUser: User = {
      id: `mock-${role}-${Date.now()}`,
      email: `${role}@demo.com`,
      full_name: getRoleDisplayName(role),
      role,
      organization_id: 'mock-org-id',
      organization_name: 'Acme Corporation',
    };
    setUser(mockUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, mockSignIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case 'admin':
      return 'Admin User';
    case 'compliance_manager':
      return 'Compliance Manager';
    case 'auditor':
      return 'Auditor';
    case 'viewer':
      return 'Viewer User';
    default:
      return 'User';
  }
}

export function getRolePermissions(role: UserRole) {
  switch (role) {
    case 'admin':
      return {
        canManageUsers: true,
        canManageOrganization: true,
        canDeleteDocuments: true,
        canViewAllDocuments: true,
        canEditDocuments: true,
        canExportReports: true,
        canManageSubscription: true,
      };
    case 'compliance_manager':
      return {
        canManageUsers: false,
        canManageOrganization: true,
        canDeleteDocuments: true,
        canViewAllDocuments: true,
        canEditDocuments: true,
        canExportReports: true,
        canManageSubscription: false,
      };
    case 'auditor':
      return {
        canManageUsers: false,
        canManageOrganization: false,
        canDeleteDocuments: false,
        canViewAllDocuments: true,
        canEditDocuments: false,
        canExportReports: true,
        canManageSubscription: false,
      };
    case 'viewer':
      return {
        canManageUsers: false,
        canManageOrganization: false,
        canDeleteDocuments: false,
        canViewAllDocuments: true,
        canEditDocuments: false,
        canExportReports: false,
        canManageSubscription: false,
      };
    default:
      return {
        canManageUsers: false,
        canManageOrganization: false,
        canDeleteDocuments: false,
        canViewAllDocuments: false,
        canEditDocuments: false,
        canExportReports: false,
        canManageSubscription: false,
      };
  }
}
