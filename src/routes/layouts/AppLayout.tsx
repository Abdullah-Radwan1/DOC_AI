import { Outlet, Link } from "@tanstack/react-router";
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
import {
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Bell,
  Search,
  FileSearch,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export function AppLayout() {
  const { user } = useAuth();
  const [notifications] = useState(3);

  return (
    <div>
      <TooltipProvider delayDuration={100}>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            {/* Sidebar */}
            {user && <AppSidebar />}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden relative">
              {/* Top Bar */}
              <header className="h-16 border-b border-border/50 bg-card/30 backdrop-blur-sm flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
                {user ? (
                  <div className="flex items-center gap-4">
                    <SidebarTrigger className="mr-2" />
                    {/* Search */}
                    <div className="hidden md:flex items-center">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search documents..."
                          className="w-64 lg:w-80 h-9 pl-9 pr-4 rounded-lg bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand to-accent flex items-center justify-center">
                        <FileSearch className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <span className="text-xl font-bold tracking-tight">
                        DocIntel
                      </span>
                    </Link>
                  </div>
                )}

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                  {user ? (
                    /* Notifications & Profile */
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                          <Bell className="h-5 w-5" />
                          {notifications > 0 && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-80 bg-card/95 backdrop-blur-xl border-border/50"
                      >
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex flex-col items-start gap-1">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-brand" />
                            <span className="text-sm font-medium">
                              Analysis Complete
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Contract_Acme_2024.pdf has been analyzed
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex flex-col items-start gap-1">
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
                          className="text-center justify-center text-primary cursor-pointer font-medium hover:underline"
                        >
                          <Link to="/notifications">View all notifications</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    /* Public header action buttons */
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/login">Sign In</Link>
                      </Button>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-brand to-accent hover:from-brand-dark hover:to-accent"
                        asChild
                      >
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
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}
