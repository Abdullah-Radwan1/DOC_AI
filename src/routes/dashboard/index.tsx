import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardStats } from "@/hooks/useDocuments";
import type { DashboardSummary, UpcomingExpiration } from "@/lib/schemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  TrendingUp,
  AlertTriangle,
  Clock,
  Upload,
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";
import { Document } from "@/lib/schemas";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// ─── Small helpers ─────────────────────────────────────────────────────────────

function verdictBadgeVariant(
  verdict: string | null,
): "default" | "secondary" | "destructive" | "outline" {
  switch (verdict) {
    case "compliant":
      return "default";
    case "partial":
      return "secondary";
    case "non_compliant":
      return "destructive";
    default:
      return "outline";
  }
}

function riskColor(level: string | null) {
  if (level === "high") return "text-destructive";
  if (level === "medium") return "text-warning";
  return "text-success";
}

function statusDotColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-success";
    case "failed":
      return "bg-destructive";
    case "processing":
      return "bg-info";
    default:
      return "bg-warning";
  }
}

function dashboardStatusColor(status: string) {
  if (
    status === "Critical Attention Required" ||
    status === "Processing Failed" ||
    status === "Expired"
  )
    return "text-destructive";
  if (status === "Needs Review") return "text-warning";
  if (status === "Compliant") return "text-success";
  return "text-muted-foreground";
}

function formatRelativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// ─── Skeleton loader ─────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 w-64 bg-muted rounded-lg" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2 h-64 bg-muted rounded-xl" />
        <div className="h-64 bg-muted rounded-xl" />
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const { user } = useAuth();
  const { data: summary, isLoading } = useDashboardStats() as {
    data: DashboardSummary | null | undefined;
    isLoading: boolean;
  };

  if (isLoading) return <DashboardSkeleton />;

  const kpis = summary?.kpis;
  const risk = summary?.riskDistribution;
  const severity = summary?.findingsSeverityBreakdown;
  const recentAnalyses = summary?.recentAnalyses ?? [];

  const upcomingExpirations = summary?.upcomingExpirations ?? [];
  const attentionDocs = summary?.documentsRequiringAttention ?? [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.full_name?.split(" ")[0] || "User"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your documents today.
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Link>
        </Button>
      </motion.div>

      {/* ── KPI Cards ───────────────────────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-2"
      >
        {/* Upcoming Expirations */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Expirations</CardTitle>
                    <CardDescription>Next 30 days</CardDescription>
                  </div>
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                {upcomingExpirations.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center">
                    No documents expiring soon
                  </p>
                ) : (
                  <div className="space-y-3">
                    {upcomingExpirations.map((doc: UpcomingExpiration) => (
                      <div
                        key={doc.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-border/50"
                      >
                        <div
                          className={`mt-0.5 p-1.5 rounded-lg ${
                            doc.daysUntilExpiration <= 7
                              ? "bg-destructive/10"
                              : doc.daysUntilExpiration <= 14
                                ? "bg-warning/10"
                                : "bg-brand/10"
                          }`}
                        >
                          <Clock
                            className={`h-4 w-4 ${
                              doc.daysUntilExpiration <= 7
                                ? "text-destructive"
                                : doc.daysUntilExpiration <= 14
                                  ? "text-warning"
                                  : "text-brand"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {doc.fileName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {doc.daysUntilExpiration} days left
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </div>
          </Card>
        </motion.div>

        {/* Analyses */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="relative overflow-hidden h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/10 to-info/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Documents Analysed
                </CardTitle>
                <div className="p-2 rounded-lg bg-accent/10">
                  <BarChart3 className="h-4 w-4 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {kpis?.totalAnalyses ?? 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-success">
                    {kpis?.completedAnalyses ?? 0}
                  </span>
                  &nbsp;completed •&nbsp;
                  <span className="text-warning">
                    {kpis?.pendingAnalyses ?? 0}
                  </span>
                  &nbsp;pending
                </p>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* ── Middle row: Compliance + Risk + Findings ─────────────────────────── */}
      <motion.div
        variants={containerVariants}
        className="grid gap-6 lg:grid-cols-2"
      >
        {/* Risk Distribution */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
              <CardDescription>Across all completed analyses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  label: "High Risk",
                  value: risk?.high ?? 0,
                  icon: <XCircle className="h-4 w-4 text-destructive" />,
                  bg: "bg-destructive/10",
                  bar: "bg-destructive",
                },
                {
                  label: "Medium Risk",
                  value: risk?.medium ?? 0,
                  icon: <AlertTriangle className="h-4 w-4 text-warning" />,
                  bg: "bg-warning/10",
                  bar: "bg-warning",
                },
                {
                  label: "Low Risk",
                  value: risk?.low ?? 0,
                  icon: <CheckCircle2 className="h-4 w-4 text-success" />,
                  bg: "bg-success/10",
                  bar: "bg-success",
                },
              ].map((item) => {
                const total =
                  (risk?.high ?? 0) + (risk?.medium ?? 0) + (risk?.low ?? 0);
                const pct =
                  total > 0 ? Math.round((item.value / total) * 100) : 0;
                return (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.bg}`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">
                          {item.label}
                        </span>
                        <span className="font-semibold">{item.value}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.bar} rounded-full transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Open Findings Severity */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Open Findings</CardTitle>
              <CardDescription>Severity breakdown (unresolved)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  label: "Critical",
                  value: severity?.critical ?? 0,
                  color: "bg-red-600",
                },
                {
                  label: "High",
                  value: severity?.high ?? 0,
                  color: "bg-orange-500",
                },
                {
                  label: "Medium",
                  value: severity?.medium ?? 0,
                  color: "bg-yellow-500",
                },
                {
                  label: "Low",
                  value: severity?.low ?? 0,
                  color: "bg-blue-500",
                },
                {
                  label: "Info",
                  value: severity?.info ?? 0,
                  color: "bg-muted-foreground",
                },
              ].map((item) => {
                const total =
                  (severity?.critical ?? 0) +
                  (severity?.high ?? 0) +
                  (severity?.medium ?? 0) +
                  (severity?.low ?? 0) +
                  (severity?.info ?? 0);
                const pct =
                  total > 0 ? Math.round((item.value / total) * 100) : 0;
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.label}
                      </span>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* ── Recent Analyses ──────────────────────────────────────────────────── */}
      {recentAnalyses.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Analyses</CardTitle>
                  <CardDescription>Latest 5 analysis requests</CardDescription>
                </div>
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border/50">
                {recentAnalyses.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${statusDotColor(item.requestStatus)}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.documentName ?? "Untitled document"}
                      </p>
                      <p
                        className={`text-xs font-medium ${riskColor(item.riskLevel)}`}
                      >
                        {item.riskLevel
                          ? `${item.riskLevel.charAt(0).toUpperCase() + item.riskLevel.slice(1)} risk`
                          : "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.verdict && (
                        <Badge variant={verdictBadgeVariant(item.verdict)}>
                          {item.verdict.replace("_", " ")}
                        </Badge>
                      )}
                      {item.confidenceScore != null && (
                        <span className="text-xs text-muted-foreground">
                          {Math.round(item.confidenceScore * 100)}%
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── Documents Requiring Attention ────────────────────────────────────── */}
      {attentionDocs.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="border-destructive/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Documents Requiring Attention
                  </CardTitle>
                  <CardDescription>
                    Failed or high-risk documents that need action
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border/50">
                {attentionDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {doc.fileName}
                      </p>
                      <p
                        className={`text-xs font-semibold ${dashboardStatusColor(doc.dashboardStatus)}`}
                      >
                        {doc.dashboardStatus}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {doc.criticalFindings > 0 && (
                        <Badge variant="destructive">
                          {doc.criticalFindings} critical
                        </Badge>
                      )}
                      {doc.highFindings > 0 && (
                        <Badge variant="secondary">
                          {doc.highFindings} high
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/dashboard/documents/${doc.id}` as any}>
                        <Eye className="h-4 w-4" />
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
