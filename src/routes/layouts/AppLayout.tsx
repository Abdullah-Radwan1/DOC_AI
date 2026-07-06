// app-layout.tsx
import {
  Outlet,
  Link,
  useRouterState,
  Link as RouterLink,
} from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  Info,
  CheckCheck,
  Menu,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { CustomSidebar } from "@/components/app-sidebar";
import {
  useUnreadCount,
  useNotifications,
  useMarkAllRead,
} from "@/hooks/useNotifications";
import type { AppNotification } from "@/lib/schemas";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function notificationIcon(type: AppNotification["type"]) {
  switch (type) {
    case "expiration_warning":
      return <AlertTriangle className="h-4 w-4 text-warning" />;
    case "compliance_alert":
      return <ShieldAlert className="h-4 w-4 text-destructive" />;
    case "system_alert":
    default:
      return <Info className="h-4 w-4 text-primary" />;
  }
}

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function AppLayout() {
  const { user } = useAuth();
  const location = useRouterState({
    select: (state) => state.location.pathname,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthenticated = Boolean(user);
  const showSidebar =
    (isAuthenticated && location.startsWith("/dashboard")) ||
    (isAuthenticated &&
      ["/upload", "/documents", "/documents/$documentId", "/settings", "/notifications"].includes(
        location,
      ));

  // Live notification data
  const { data: unreadData } = useUnreadCount(isAuthenticated);
  const { data: previewData } = useNotifications(
    isAuthenticated ? { limit: 5, status: "unread" } : undefined,
  );
  const markAllRead = useMarkAllRead();

  const unreadCount = unreadData?.count ?? 0;
  const previewNotifications = previewData?.data ?? [];

  return (
    <TooltipProvider delayDuration={100}>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        {showSidebar && (
          <CustomSidebar
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            isMobileOpen={isMobileMenuOpen}
            setIsMobileOpen={setIsMobileMenuOpen}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden relative">
          {/* Top Bar */}
          <header className="h-16 border-b bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
            {user ? (
              <div className="flex items-center gap-4">
                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
                  type="button"
                >
                  <Menu className="w-5 h-5 text-muted-foreground" />
                </button>

                {/* Logo */}
                <RouterLink to="/" className="flex items-center gap-3 min-w-0">
                  <img
                    src="/logo.png"
                    className="w-6 h-6 text-primary-foreground"
                  />
                  <span className="text-lg font-bold tracking-tight text-foreground whitespace-nowrap overflow-hidden">
                    DOCKY
                  </span>
                </RouterLink>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/" className="flex items-center gap-3">
                  <img className="w-9 h-9" src="/logo.png" />
                  <span className="text-xl font-bold tracking-tight text-foreground">
                    DOCKY
                  </span>
                </Link>
              </div>
            )}

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="hidden sm:inline-flex"
                  >
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>

                  {/* Notification Bell Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative" id="notification-bell">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full leading-none">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 bg-popover border">
                      <div className="flex items-center justify-between px-3 py-2">
                        <DropdownMenuLabel className="p-0 font-semibold">
                          Notifications
                          {unreadCount > 0 && (
                            <span className="ml-2 text-xs text-muted-foreground font-normal">
                              {unreadCount} unread
                            </span>
                          )}
                        </DropdownMenuLabel>
                        {unreadCount > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-muted-foreground hover:text-foreground px-2"
                            onClick={() => markAllRead.mutate()}
                          >
                            <CheckCheck className="h-3.5 w-3.5 mr-1" />
                            Mark all read
                          </Button>
                        )}
                      </div>
                      <DropdownMenuSeparator />

                      {previewNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                          <Bell className="h-8 w-8 text-muted-foreground/40 mb-2" />
                          <p className="text-sm text-muted-foreground">
                            No unread notifications
                          </p>
                        </div>
                      ) : (
                        previewNotifications.map((n) => (
                          <DropdownMenuItem
                            key={n.id}
                            className="flex items-start gap-3 py-3 px-3 cursor-pointer focus:bg-accent"
                            asChild
                          >
                            <Link to="/dashboard/notifications">
                              <div className="mt-0.5 shrink-0">
                                {notificationIcon(n.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium leading-tight truncate">
                                  {n.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                  {n.message}
                                </p>
                                <p className="text-[10px] text-muted-foreground/70 mt-1">
                                  {timeAgo(n.createdAt)}
                                </p>
                              </div>
                              {n.status === "unread" && (
                                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                              )}
                            </Link>
                          </DropdownMenuItem>
                        ))
                      )}

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        asChild
                        className="text-center justify-center font-medium cursor-pointer hover:underline"
                      >
                        <Link to="/dashboard/notifications">
                          View all notifications
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                /* Public header action buttons */
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/register">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-4 lg:p-8 w-full max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
