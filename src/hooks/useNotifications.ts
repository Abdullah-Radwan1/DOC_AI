import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  type NotificationQueryParams,
} from "@/lib/endpoints";
import type { AppNotification } from "@/lib/schemas";

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (params?: NotificationQueryParams) =>
    [...notificationKeys.all, "list", params] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Fetches paginated notifications for the logged-in user.
 */
export function useNotifications(params?: NotificationQueryParams) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => getMyNotifications(params),
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Returns the current unread notification count.
 * Polling every 60 seconds to keep the bell badge fresh.
 */
export function useUnreadCount(enabled = true) {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: getUnreadCount,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60, // poll every 60 s
    enabled,
  });
}

/**
 * Marks a single notification as read with optimistic update.
 */
export function useMarkRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onMutate: async (id) => {
      // Optimistically mark as read across all cached list queries
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      queryClient.setQueriesData(
        { queryKey: notificationKeys.all },
        (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((n: AppNotification) =>
              n.id === id ? { ...n, status: "read" } : n,
            ),
          };
        },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * Marks all notifications as read.
 */
export function useMarkAllRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      queryClient.setQueriesData(
        { queryKey: notificationKeys.all },
        (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((n: AppNotification) => ({
              ...n,
              status: "read",
            })),
          };
        },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
