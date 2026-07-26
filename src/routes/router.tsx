import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

// Layouts
import { AuthLayout } from "@/routes/layouts/AuthLayout";
import { AppLayout } from "@/routes/layouts/AppLayout";

// Public Pages
import { HomePage } from "@/routes/home";

// Auth Pages
import { LoginPage } from "@/routes/auth/login";
import { RegisterPage } from "@/routes/auth/register";
import { ForgotPasswordPage } from "@/routes/auth/forgot-password";
import { ResetPasswordPage } from "@/routes/auth/reset-password";

// App Pages
import { DashboardPage } from "@/routes/dashboard";
import { UploadPage } from "@/routes/upload";
import { DocumentPage } from "@/routes/documents/$documentId";
import { DocumentsPage } from "@/routes/documents/index";
import { SettingsPage } from "@/routes/settings";
import { NotificationsPage } from "@/routes/notifications";

import { getCurrentUser } from "@/lib/endpoints/auth-endpoints";
import type { User } from "@/lib/schemas";
import { queryKeys } from "@/lib/query-keys";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

// Root Route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="top-right" richColors />
    </>
  ),
});

// Auth helpers
const requireNoAuth = async () => {
  let isAuthenticated = false;
  try {
    const cached = queryClient.getQueryData<{ user: User | null }>(
      queryKeys.auth.me()
    );
    if (cached?.user) {
      isAuthenticated = true;
    } else {
      const data = await queryClient.fetchQuery({
        queryKey: queryKeys.auth.me(),
        queryFn: async () => {
          const user = await getCurrentUser();
          return { user };
        },
      });
      isAuthenticated = !!data?.user;
    }
  } catch (error) {
    isAuthenticated = false;
  }

  if (isAuthenticated) {
    throw redirect({ to: "/dashboard" });
  }
};
const requireAuth = async () => {
  let isAuthenticated = false;
  try {
    // 1. Check if user data is already cached
    const cached = queryClient.getQueryData<{ user: User | null }>(
      queryKeys.auth.me()
    );
    if (cached?.user) {
      isAuthenticated = true;
    } else {
      // 2. Fetch if not cached (handles hard refreshes)
      const data = await queryClient.fetchQuery({
        queryKey: queryKeys.auth.me(),
        queryFn: async () => {
          const user = await getCurrentUser();
          return { user };
        },
      });
      isAuthenticated = !!data?.user;
    }
  } catch (error) {
    isAuthenticated = false;
  }

  // 3. Kick out unauthenticated users
  if (!isAuthenticated) {
    throw redirect({ to: "/login" });
  }
};
// Public Layout Route
const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: AuthLayout,
  beforeLoad: requireNoAuth,
});

// Protected Layout Route
const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  component: AppLayout,
});

// Auth Routes
const loginRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/login",
  component: LoginPage,
});

const HomeRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/",
  component: HomePage,
});

const registerRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/register",
  component: RegisterPage,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/forgot-password",
  component: ForgotPasswordPage,
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/reset-password",
  component: ResetPasswordPage,
});

// App Routes
const dashboardRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/dashboard",
  component: DashboardPage,
  beforeLoad: requireAuth,
});

const uploadRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/dashboard/upload",
  component: UploadPage,
  beforeLoad: requireAuth,
});

const documentsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/dashboard/documents",
  component: DocumentsPage,
  beforeLoad: requireAuth,
});

const documentRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/dashboard/documents/$documentId",
  component: DocumentPage,
  beforeLoad: requireAuth,
});

const settingsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/dashboard/settings",
  component: SettingsPage,
  beforeLoad: requireAuth,
});

const notificationsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/dashboard/notifications",
  component: NotificationsPage,
  beforeLoad: requireAuth,
});

// Route tree
const routeTree = rootRoute.addChildren([
  authLayoutRoute.addChildren([
    loginRoute,
    registerRoute,
    forgotPasswordRoute,
    resetPasswordRoute,
  ]),
  appLayoutRoute.addChildren([
    dashboardRoute,
    uploadRoute,
    documentsRoute,
    documentRoute,
    HomeRoute,
    settingsRoute,
    notificationsRoute,
  ]),
]);

// Create router
export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

// Register router for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export { queryClient };
