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
import { Bell, Search, FileSearch, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { CustomSidebar } from "@/components/app-sidebar";

export function AppLayout() {
  const { user } = useAuth();
  const location = useRouterState({
    select: (state) => state.location.pathname,
  });
  const [notifications] = useState(3);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const showSidebar =
    (Boolean(user) && location.startsWith("/dashboard")) ||
    (Boolean(user) &&
      [
        "/upload",
        "/documents",
        "/documents/$documentId",
        "/settings",
        "/notifications",
      ].includes(location));

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

                {/* Logo - DOCKY */}
                <RouterLink to="/" className="flex items-center gap-3 min-w-0">
                  <img
                    src="/logo.png"
                    className="w-6 h-6 text-primary-foreground"
                  />
                  <span className="text-lg  font-bold tracking-tight text-foreground whitespace-nowrap overflow-hidden">
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

                  {/* Notifications */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        {notifications > 0 && (
                          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-80 bg-popover border"
                    >
                      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-foreground" />
                          <span className="text-sm font-medium">
                            Analysis Complete
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Contract_Acme_2024.pdf has been analyzed
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-warning" />
                          <span className="text-sm font-medium">
                            High Risk Detected
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Review NDA_TechStart document
                        </span>
                      </DropdownMenuItem>
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
