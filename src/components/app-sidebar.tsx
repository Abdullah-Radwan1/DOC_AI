// components/custom-sidebar.tsx
import { useEffect } from "react";
import {
  Crown,
  LayoutDashboard,
  LogOut,
  Upload,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Bell,
  Sparkles,
  TrendingUp,
  Building2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  useNavigate,
  Link as RouterLink,
  useLocation,
  Link,
} from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { LIMITS } from "@/lib/utils/plan-limits";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/dashboard/upload", icon: Upload, label: "Upload Document" },
  { path: "/dashboard/documents", icon: FileText, label: "Documents" },
  { path: "/dashboard/settings", icon: Settings, label: "Settings" },
];

interface CustomSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

function PlanIcon({ plan }: { plan?: string }) {
  switch (plan) {
    case "Professional":
      return <TrendingUp className="w-3 h-3" />;
    case "elite":
      return <Building2 className="w-3 h-3" />;
    default:
      return <Sparkles className="w-3 h-3" />;
  }
}

function getPlanLabel(plan?: string) {
  switch (plan) {
    case "Professional":
      return "Professional";
    case "Elite":
      return "Elite";
    default:
      return "Free";
  }
}

function getPlanColor(plan?: string) {
  switch (plan) {
    case "Professional":
      return "text-brand bg-brand/10";
    case "Elite":
      return "text-violet-500 bg-violet-500/10";
    default:
      return "text-muted-foreground bg-muted";
  }
}

export function CustomSidebar({
  isOpen,
  setIsOpen,
  isMobileOpen,
  setIsMobileOpen,
}: CustomSidebarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname, setIsMobileOpen]);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileOpen, setIsMobileOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileOpen]);

  const handleSignOut = async () => {
    localStorage.removeItem("DOCKY-mock-user");
    await signOut();
    navigate({ to: "/login" });
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "compliance_manager":
        return "Compliance Mgr";
      case "auditor":
        return "Auditor";
      default:
        return "Viewer";
    }
  };

  // ── Plan & quota data ──────────────────────────────────────────────────────
  const plan = user?.plan;
  console.log(plan);
  const uploadsUsed = user?.usage_quota?.uploads_used ?? 0;
  const analysesUsed = user?.usage_quota?.analyses_used ?? 0;
  const planKey = plan as keyof typeof LIMITS;
  const uploadLimit = LIMITS[planKey]?.UPLOADS ?? LIMITS.Free.UPLOADS;
  const analysisLimit = LIMITS[planKey]?.ANALYSES ?? LIMITS.Free.ANALYSES;
  const uploadPct = Math.min(100, (uploadsUsed / uploadLimit) * 100);
  const analysisPct = Math.min(100, (analysesUsed / analysisLimit) * 100);
  const isFreePlan = plan === "free";
  const sidebarContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b flex-shrink-0">
        <RouterLink to="/" className="flex items-center gap-3 min-w-0">
          <img src="/logo.png" className="w-6 h-6 text-primary-foreground" />
          {(isOpen || isMobileOpen) && (
            <span className="text-lg  font-bold tracking-tight text-foreground whitespace-nowrap overflow-hidden">
              DOCKY
            </span>
          )}
        </RouterLink>

        <div className="flex items-center gap-1">
          {/* Desktop toggle button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:flex items-center justify-center rounded-lg hover:bg-accent transition-colors flex-shrink-0"
            type="button"
          >
            {isOpen ? (
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {/* Mobile close button */}
          {isMobileOpen && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              type="button"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-3 py-4">
        {/* Navigation */}
        <div className="mb-6">
          {(isOpen || isMobileOpen) && (
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Menu
            </p>
          )}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <RouterLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  {(isOpen || isMobileOpen) && (
                    <span className="text-sm font-medium truncate">
                      {item.label}
                    </span>
                  )}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-foreground" />
                  )}
                </RouterLink>
              );
            })}
          </nav>
        </div>

        {/* Plan & Usage Widget */}
        <div className="rounded-xl border bg-card p-4 space-y-3">
          {isOpen || isMobileOpen ? (
            <div className="space-y-3">
              {/* Plan badge */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-card-foreground">
                  Your Plan
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${getPlanColor(plan)}`}
                >
                  <PlanIcon plan={plan} />
                  {getPlanLabel(plan)}
                </span>
              </div>

              {/* Upload usage */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Uploads</span>
                  <span className="font-medium text-foreground">
                    {`${uploadsUsed} / ${uploadLimit}`}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      uploadPct >= 100
                        ? "bg-destructive"
                        : uploadPct >= 75
                          ? "bg-warning"
                          : "bg-foreground"
                    }`}
                    style={{ width: `${uploadPct}%` }}
                  />
                </div>
              </div>

              {/* Analysis usage */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Analyses</span>
                  <span className="font-medium text-foreground">
                    {`${analysesUsed} / ${analysisLimit}`}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      analysisPct >= 100
                        ? "bg-destructive"
                        : analysisPct >= 75
                          ? "bg-warning"
                          : "bg-foreground"
                    }`}
                    style={{ width: `${analysisPct}%` }}
                  />
                </div>
              </div>

              {/* Upgrade CTA for free plan */}
              {isFreePlan && (
                <Link
                  to="/dashboard/settings"
                  className="flex items-center gap-2 text-xs font-medium text-foreground hover:opacity-80 transition-colors"
                  type="button"
                >
                  <Crown className="w-3 h-3" />
                  Upgrade to Pro
                </Link>
              )}
            </div>
          ) : (
            <div className="flex justify-center">
              <Crown className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-3 flex-shrink-0">
        <div
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors duration-150 cursor-pointer ${
            isOpen || isMobileOpen ? "justify-start" : "justify-center"
          }`}
        >
          <div
            className={`relative flex-shrink-0 ${isOpen || isMobileOpen ? "w-8 h-8" : "w-10 h-10"}`}
          >
            <div
              className={`rounded-lg bg-secondary flex items-center justify-center ${
                isOpen || isMobileOpen ? "w-8 h-8" : "w-10 h-10"
              }`}
            >
              <span
                className={`font-semibold text-secondary-foreground ${
                  isOpen || isMobileOpen ? "text-sm" : "text-base"
                }`}
              >
                {user?.full_name?.charAt(0) ||
                  user?.email?.charAt(0).toUpperCase() ||
                  "U"}
              </span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success ring-2 ring-background" />
          </div>
          {(isOpen || isMobileOpen) && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.full_name || "Demo User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {getRoleLabel(user?.role || "viewer")}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSignOut();
                }}
                className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                type="button"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col h-screen sticky top-0 bg-background border-r transition-[width] duration-200 ease-in-out overflow-hidden flex-shrink-0 z-30`}
        style={{ width: isOpen ? "280px" : "80px" }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence mode="wait">
        {isMobileOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence mode="wait">
        {isMobileOpen && (
          <motion.aside
            key="mobile-sidebar"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="fixed top-0 left-0 bottom-0 w-80 bg-background border-r z-50 lg:hidden flex flex-col"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
