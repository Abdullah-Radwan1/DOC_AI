import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  Info,
  ShieldCheck,
  AlertOctagon,
  Trash2,
  MailOpen,
  BellOff,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notifications as initialNotifications } from "@/lib/mock-data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  warning: AlertTriangle,
  success: ShieldCheck,
  danger: AlertOctagon,
  info: Info,
};

const toneMap: Record<string, string> = {
  warning: "bg-warning/10 text-warning dark:bg-warning/20",
  success: "bg-success/10 text-success dark:bg-success/20",
  danger: "bg-destructive/10 text-destructive dark:bg-destructive/20",
  info: "bg-info/10 text-info dark:bg-info/20",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "alerts">(
    "all",
  );

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.read;
    if (activeTab === "alerts")
      return n.type === "warning" || n.type === "danger";
    return true;
  });

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
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
            Stay on top of contract events, compliance alerts, and AI analyses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {notifications.some((n) => !n.read) && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllRead}
              className="h-9"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-9 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear all
            </Button>
          )}
        </div>
      </motion.div>

      {/* Tabs list */}
      <motion.div variants={itemVariants}>
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as any)}
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
              {notifications.filter((n) => !n.read).length > 0 && (
                <Badge className="ml-1 px-1.5 py-0 text-xs bg-brand hover:bg-brand-dark">
                  {notifications.filter((n) => !n.read).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              Alerts
              {notifications.filter(
                (n) => n.type === "warning" || n.type === "danger",
              ).length > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-1 px-1.5 py-0 text-xs"
                >
                  {
                    notifications.filter(
                      (n) => n.type === "warning" || n.type === "danger",
                    ).length
                  }
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Notifications Card List */}
      <motion.div variants={itemVariants}>
        <Card className="border border-border/50 shadow-soft overflow-hidden bg-card/30 backdrop-blur-md">
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((n) => {
                    const Icon = iconMap[n.type] ?? Bell;
                    return (
                      <motion.div
                        key={n.id}
                        variants={itemVariants}
                        exit="exit"
                        layout
                        onClick={() => toggleRead(n.id)}
                        className={`flex gap-4 p-5 hover:bg-muted/30 cursor-pointer transition-colors duration-200 relative group ${
                          !n.read
                            ? "bg-primary/[0.02] dark:bg-primary/[0.04]"
                            : ""
                        }`}
                      >
                        {/* Left Tone Icon */}
                        <div
                          className={`h-10 w-10 rounded-xl grid place-items-center shrink-0 transition-transform group-hover:scale-105 duration-200 ${toneMap[n.type]}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        {/* Middle Text Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`font-semibold text-sm sm:text-base ${!n.read ? "text-foreground font-semibold" : "text-muted-foreground"}`}
                              >
                                {n.title}
                              </span>
                              {!n.read && (
                                <Badge className="bg-accent hover:bg-accent h-5 text-[10px] px-2">
                                  New
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap pt-1">
                              {n.time}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                            {n.body}
                          </p>
                        </div>

                        {/* Action buttons on hover */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 self-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-muted"
                            title={n.read ? "Mark as unread" : "Mark as read"}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRead(n.id);
                            }}
                          >
                            <MailOpen className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            title="Delete"
                            onClick={(e) => deleteNotification(n.id, e)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
                      You are all caught up! No notifications found in this tab.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
