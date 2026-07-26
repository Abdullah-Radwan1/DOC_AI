import { api } from "@/lib/api";
import {
  DashboardStatsSchema,
  type DashboardStats,
} from "@/lib/types/dashboard_types";
import { ActivityLogItem } from "../types/activity_types";
export async function getDashboardStats(): Promise<DashboardStats | null> {
  try {
    const { data } = await api.get("/dashboard/summary");
    return DashboardStatsSchema.parse(data);
  } catch {
    return null;
  }
}

export async function getActivityLog(_limit = 10): Promise<ActivityLogItem[]> {
  return [];
}
