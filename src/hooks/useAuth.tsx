import { createContext, useContext, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as endpoints from "@/lib/endpoints";
import type { User, UserRole } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Use React Query to fetch the current user from /auth/me
  // The JWT cookie is sent automatically via `credentials: 'include'` in the axios client
  const { data: userResponse, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const user = await endpoints.getCurrentUser();
      return { user };
    },
    retry: false, // Don't retry on 401 - just means not logged in
    staleTime: 1000 * 60 * 5, // Cache session for 5 minutes
  });

  const user: User | null = userResponse?.user ?? null;

  const signIn = async (email: string, password: string) => {
    try {
      const user = await endpoints.login(email, password);
      // Seed query cache so components re-render immediately
      queryClient.setQueryData(["auth", "me"], { user });
      return { error: null };
    } catch (error: unknown) {
      const msg = (error as any)?.response?.data?.message ?? "Login failed";
      return { error: new Error(msg) };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const user = await endpoints.register(email, password, fullName);
      queryClient.setQueryData(["auth", "me"], { user });
      return { error: null };
    } catch (error: unknown) {
      const msg =
        (error as any)?.response?.data?.message ?? "Registration failed";
      return { error: new Error(msg) };
    }
  };

  const signOut = async () => {
    try {
      await endpoints.logout();
    } catch {
      // Swallow – we always clear local state
    } finally {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.clear();
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading: isLoading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

// ─── Permission helpers ────────────────────────────────────────────────────────
export function getRolePermissions(role: UserRole) {
  const perms = {
    admin: {
      canManageUsers: true,
      canManageOrganization: true,
      canDeleteDocuments: true,
      canViewAllDocuments: true,
      canEditDocuments: true,
      canExportReports: true,
      canManageSubscription: true,
    },
    compliance_manager: {
      canManageUsers: false,
      canManageOrganization: true,
      canDeleteDocuments: true,
      canViewAllDocuments: true,
      canEditDocuments: true,
      canExportReports: true,
      canManageSubscription: false,
    },
    auditor: {
      canManageUsers: false,
      canManageOrganization: false,
      canDeleteDocuments: false,
      canViewAllDocuments: true,
      canEditDocuments: false,
      canExportReports: true,
      canManageSubscription: false,
    },
    viewer: {
      canManageUsers: false,
      canManageOrganization: false,
      canDeleteDocuments: false,
      canViewAllDocuments: true,
      canEditDocuments: false,
      canExportReports: false,
      canManageSubscription: false,
    },
  };
  return perms[role] ?? perms.viewer;
}
