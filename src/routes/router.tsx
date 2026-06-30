import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

// App Pages
import { DashboardPage } from "@/routes/dashboard";
import { UploadPage } from "@/routes/upload";
import { DocumentPage } from "@/routes/documents/$documentId";
import { DocumentsPage } from "@/routes/documents/index";
import { SettingsPage } from "@/routes/settings";
import { NotificationsPage } from "@/routes/notifications";

import { api } from "@/lib/api";

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
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  ),
});

// Auth helpers
const requireAuth = async () => {
  try {
    const data = queryClient.getQueryData(["auth", "me"]);
    if (!data) {
      // Try to fetch it if not in cache
      await queryClient.fetchQuery({
        queryKey: ["auth", "me"],
        queryFn: async () => {
          const res = await api.get("/auth/me");
          return res.data;
        },
      });
    }
  } catch (error) {
    throw redirect({ to: "/login" });
  }
};

const requireNoAuth = async () => {
  let isAuthenticated = false;
  try {
    const data = queryClient.getQueryData(["auth", "me"]);
    if (data) {
      isAuthenticated = true;
    } else {
      await queryClient.fetchQuery({
        queryKey: ["auth", "me"],
        queryFn: async () => {
          const res = await api.get("/auth/me");
          return res.data;
        },
      });
      isAuthenticated = true;
    }
  } catch (error) {
    isAuthenticated = false;
  }

  if (isAuthenticated) {
    throw redirect({ to: "/dashboard" });
  }
};

// Home Route (Public)
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

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
  beforeLoad: requireAuth,
});

// Auth Routes
const loginRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/login",
  component: LoginPage,
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

// App Routes
const dashboardRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const uploadRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/upload",
  component: UploadPage,
});

const documentsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/documents",
  component: DocumentsPage,
});

const documentRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/documents/$documentId",
  component: DocumentPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/settings",
  component: SettingsPage,
});

const notificationsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/notifications",
  component: NotificationsPage,
});

// Route tree
const routeTree = rootRoute.addChildren([
  homeRoute,
  authLayoutRoute.addChildren([loginRoute, registerRoute, forgotPasswordRoute]),
  appLayoutRoute.addChildren([
    dashboardRoute,
    uploadRoute,
    documentsRoute,
    documentRoute,
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

