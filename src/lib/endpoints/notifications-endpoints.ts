import { api } from "@/lib/api";
import {
  NotificationSchema,
  NotificationListSchema,
  type AppNotification,
  type NotificationList,
} from "@/lib/types/notification_types";
// Notifications
export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  status?: "unread" | "read" | "archived" | "all";
}

export async function getMyNotifications(
  params?: NotificationQueryParams,
): Promise<NotificationList> {
  const { data } = await api.get("/notifications/me", { params });
  return NotificationListSchema.parse(data);
}

export async function getUnreadCount(): Promise<{ count: number }> {
  const { data } = await api.get("/notifications/me/unread-count");
  return data;
}

export async function markNotificationRead(
  id: string,
): Promise<AppNotification> {
  const { data } = await api.patch(`/notifications/${id}/read`);
  return NotificationSchema.parse(data);
}

export async function markAllNotificationsRead(): Promise<{ message: string }> {
  const { data } = await api.post("/notifications/me/read-all");
  return data;
}
