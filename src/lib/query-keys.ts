import { NotificationQueryParams } from "./endpoints/notifications-endpoints";
import { DocumentQueryParams } from "./endpoints/document-endpoints";

export const queryKeys = {
  auth: {
    me: () => ["auth", "me"] as const,
  },
  users: {
    byId: (id: string | null | undefined) => ["users", id] as const,
  },
  documents: {
    list: (params?: DocumentQueryParams) => (params ? ["documents", params] as const : ["documents"] as const),
    byId: (id: string) => ["document", id] as const,
    analysis: (id: string) => ["analysis", id] as const,
  },
  activity: {
    list: () => ["activity"] as const,
  },
  dashboard: {
    stats: () => ["dashboard-stats"] as const,
  },
  compliance: {
    byDocument: (documentId: string) => ["compliance", "document", documentId] as const,
  },
  profilePreferences: {
    all: () => ["profile-preferences"] as const,
    details: () => ["profile-preferences", "details"] as const,
  },
  notifications: {
    all: () => ["notifications"] as const,
    list: (params?: NotificationQueryParams) => ["notifications", "list", params] as const,
    unreadCount: () => ["notifications", "unread-count"] as const,
  }
};
