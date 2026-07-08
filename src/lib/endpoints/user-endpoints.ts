import { api } from "../api";

import { UserSchema, type User } from "@/lib/types/user_types";
import {
  NotificationPreferences,
  NotificationPreferencesSchema,
} from "../types/notification_types";
// Users

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapUser(raw: any): User {
  const user = {
    id: raw.id,
    email: raw.email,
    full_name: raw.fullName ?? raw.full_name ?? null,
    avatar_url: raw.avatarUrl ?? raw.avatar_url ?? null,
    role: raw.role,
    created_at: raw.createdAt ?? raw.created_at,
    updated_at: raw.updatedAt ?? raw.updated_at,
    notification_preferences: {
      allow_email_notifications:
        raw.allowEmailNotifications ?? raw.allow_email_notifications ?? true,
      allow_expiry_reminders:
        raw.allowExpiryReminders ?? raw.allow_expiry_reminders ?? true,
      allow_risk_alerts: raw.allowRiskAlerts ?? raw.allow_risk_alerts ?? true,
      allow_analysis_alerts:
        raw.allowAnalysisAlerts ?? raw.allow_analysis_alerts ?? true,
    },
  };
  return UserSchema.parse(user);
}

export async function getUserById(id: string): Promise<User> {
  const { data } = await api.get(`/users/${id}`);
  return mapUser(data);
}

// Profile (self-service)
export interface UpdateProfilePayload {
  fullName?: string;
  allowEmailNotifications?: boolean;
  allowExpiryReminders?: boolean;
  allowRiskAlerts?: boolean;
  allowAnalysisAlerts?: boolean;
}

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<User> {
  const { data } = await api.patch("/users/me", payload);
  return mapUser(data);
}

export async function getMyPreferences(): Promise<NotificationPreferences> {
  const { data } = await api.get("/users/me");
  const preferences = NotificationPreferencesSchema.parse({
    allow_email_notifications:
      data?.allow_email_notifications ??
      data?.notification_preferences?.allow_email_notifications ??
      true,
    allow_expiry_reminders:
      data?.allow_expiry_reminders ??
      data?.notification_preferences?.allow_expiry_reminders ??
      true,
    allow_risk_alerts:
      data?.allow_risk_alerts ??
      data?.notification_preferences?.allow_risk_alerts ??
      true,
    allow_analysis_alerts:
      data?.allow_analysis_alerts ??
      data?.notification_preferences?.allow_analysis_alerts ??
      true,
  });
  return preferences;
}

// Password management
export async function changePassword(payload: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<{ message: string }> {
  const { data } = await api.patch("/auth/me/password", payload);
  return data;
}

export async function forgotPassword(
  email: string,
): Promise<{ message: string }> {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
}

export async function resetPassword(payload: {
  token: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<{ message: string }> {
  const { data } = await api.post("/auth/reset-password", payload);
  return data;
}
