import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  Info,
  ShieldCheck,
  ShieldAlert,
  BellOff,
  MailOpen,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  useNotifications,
  useMarkRead,
  useMarkAllRead,
} from "@/hooks/useNotifications";
import type { AppNotification } from "@/lib/schemas";

// ─── Helpers ─────────────────────────────────────────────────────────────────

type UITone = "warning" | "danger" | "info" | "success";

function getUITone(type: AppNotification["type"]): UITone {
  switch (type) {
    case "expiration_warning":
      return "warning";
    case "compliance_alert":
      return "danger";
    case "system_alert":
    default:
      return "info";
  }
}

const iconMap: Record<UITone, React.ComponentType<{ className?: string }>> = {
  warning: AlertTriangle,
  danger: ShieldAlert,
  info: Info,
  success: ShieldCheck,
};

const toneMap: Record<UITone, string> = {
  warning: "bg-warning/10 text-warning dark:bg-warning/20",
  danger: "bg-destructive/10 text-destructive dark:bg-destructive/20",
  info: "bg-primary/10 text-primary dark:bg-primary/20",
  success: "bg-success/10 text-success dark:bg-success/20",
};

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString();
}

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function NotificationSkeleton() {
  return (
    <div className="flex gap-4 p-5 animate-pulse">
      <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type ActiveTab = "all" | "unread" | "alerts";

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");

  // Fetch all notifications (no server-side filter — we filter client-side for tab counts)
  const { data, isLoading, isError, refetch } = useNotifications({ limit: 100 });
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  const notifications = data?.data ?? [];

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return n.status === "unread";
    if (activeTab === "alerts")
      return n.type === "expiration_warning" || n.type === "compliance_alert";
    return true;
  });

  const unreadCount = notifications.filter((n) => n.status === "unread").length;
  const alertCount = notifications.filter(
    (n) => n.type === "expiration_warning" || n.type === "compliance_alert",
  ).length;

  const handleMarkRead = (n: AppNotification) => {
    if (n.status === "unread") {
      markRead.mutate(n.id);
    }
  };

  const handleMarkAllRead = async () => {
    markAllRead.mutate(undefined, {
      onSuccess: () => toast.success("All notifications marked as read."),
      onError: () => toast.error("Failed to mark all as read."),
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-5xl mx-auto"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Stay on top of contract events, compliance alerts, and expiration warnings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={markAllRead.isPending}
              className="h-9"
            >
              {markAllRead.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCheck className="h-4 w-4 mr-2" />
              )}
              Mark all read
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            className="h-9 text-muted-foreground"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as ActiveTab)}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md grid-cols-3 h-11 bg-muted/50 border border-border/50">
            <TabsTrigger value="all" className="flex items-center gap-2">
              All
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                {notifications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex items-center gap-2">
              Unread
              {unreadCount > 0 && (
                <Badge className="ml-1 px-1.5 py-0 text-xs bg-brand hover:bg-brand-dark">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              Alerts
              {alertCount > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-1 px-1.5 py-0 text-xs"
                >
                  {alertCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Notification List */}
      <motion.div variants={itemVariants}>
        <Card className="border border-border/50 shadow-soft overflow-hidden bg-card/30 backdrop-blur-md">
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {/* Loading state */}
              {isLoading && (
                <>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <NotificationSkeleton key={i} />
                  ))}
                </>
              )}

              {/* Error state */}
              {isError && !isLoading && (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="h-12 w-12 rounded-full bg-destructive/10 grid place-items-center mb-4">
                    <Bell className="h-6 w-6 text-destructive" />
                  </div>
                  <h3 className="font-semibold text-lg">Failed to Load</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
                    Could not fetch your notifications. Please try again.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => refetch()}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              )}

              {/* Notification items */}
              {!isLoading && !isError && (
                <AnimatePresence mode="popLayout" initial={false}>
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((n) => {
                      const tone = getUITone(n.type);
                      const Icon = iconMap[tone];
                      const isUnread = n.status === "unread";

                      return (
                        <motion.div
                          key={n.id}
                          variants={itemVariants}
                          exit="exit"
                          layout
                          onClick={() => handleMarkRead(n)}
                          className={`flex gap-4 p-5 hover:bg-muted/30 cursor-pointer transition-colors duration-200 relative group ${
                            isUnread
                              ? "bg-primary/[0.02] dark:bg-primary/[0.04]"
                              : ""
                          }`}
                        >
                          {/* Tone Icon */}
                          <div
                            className={`h-10 w-10 rounded-xl grid place-items-center shrink-0 transition-transform group-hover:scale-105 duration-200 ${toneMap[tone]}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          {/* Text Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`font-semibold text-sm sm:text-base ${
                                    isUnread
                                      ? "text-foreground"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {n.title}
                                </span>
                                {isUnread && (
                                  <Badge className="bg-accent hover:bg-accent h-5 text-[10px] px-2">
                                    New
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap pt-1">
                                {timeAgo(n.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                              {n.message}
                            </p>
                            {n.document?.originalFileName && (
                              <p className="text-xs text-muted-foreground/70 mt-1">
                                📄 {n.document.originalFileName}
                              </p>
                            )}
                          </div>

                          {/* Actions (visible on hover) */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 self-center">
                            {isUnread && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-muted"
                                title="Mark as read"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markRead.mutate(n.id);
                                }}
                              >
                                <MailOpen className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center p-12 text-center"
                    >
                      <div className="h-12 w-12 rounded-full bg-muted/50 grid place-items-center mb-4 text-muted-foreground">
                        <BellOff className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-lg">No Notifications</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mt-1">
                        {activeTab === "unread"
                          ? "You're all caught up! No unread notifications."
                          : activeTab === "alerts"
                            ? "No compliance alerts or expiration warnings."
                            : "You have no notifications yet."}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
