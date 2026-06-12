import { createRouter, createRootRoute, createRoute, Outlet, redirect } from '@tanstack/react-router';
import { AuthProvider } from '@/hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/hooks/useTheme';
import { Toaster } from '@/components/ui/sonner';

// Layouts
import { AuthLayout } from '@/routes/layouts/AuthLayout';
import { AppLayout } from '@/routes/layouts/AppLayout';

// Auth Pages
import { LoginPage } from '@/routes/auth/login';
import { RegisterPage } from '@/routes/auth/register';
import { ForgotPasswordPage } from '@/routes/auth/forgot-password';

// App Pages
import { DashboardPage } from '@/routes/dashboard';
import { UploadPage } from '@/routes/upload';
import { DocumentPage } from '@/routes/documents/$documentId';
import { DocumentsPage } from '@/routes/documents/index';
import { SettingsPage } from '@/routes/settings';

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
      <ThemeProvider defaultTheme="system" storageKey="docintel-theme">
        <AuthProvider>
          <Outlet />
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  ),
});

// Public Layout Route
const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth',
  component: AuthLayout,
});

// Protected Layout Route
const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  beforeLoad: async () => {
    const user = localStorage.getItem('docintel-mock-user');
    if (!user) {
      throw redirect({ to: '/login' });
    }
  },
  component: AppLayout,
});

// Auth Routes
const loginRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/login',
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/register',
  component: RegisterPage,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/forgot-password',
  component: ForgotPasswordPage,
});

// App Routes
const dashboardRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/',
  component: DashboardPage,
});

const uploadRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/upload',
  component: UploadPage,
});

const documentsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/documents',
  component: DocumentsPage,
});

const documentRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/documents/$documentId',
  component: DocumentPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/settings',
  component: SettingsPage,
});

// Route tree
const routeTree = rootRoute.addChildren([
  authLayoutRoute.addChildren([loginRoute, registerRoute, forgotPasswordRoute]),
  appLayoutRoute.addChildren([dashboardRoute, uploadRoute, documentsRoute, documentRoute, settingsRoute]),
]);

// Create router
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
});

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export { queryClient };
