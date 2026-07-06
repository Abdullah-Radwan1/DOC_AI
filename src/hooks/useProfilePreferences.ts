import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyPreferences, updateProfile } from "@/lib/endpoints";
import type { NotificationPreferences } from "@/lib/schemas";
import { toast } from "sonner";

export const profilePreferenceKeys = {
  all: ["profile-preferences"] as const,
  details: () => [...profilePreferenceKeys.all, "details"] as const,
};

export function useProfilePreferences() {
  const queryClient = useQueryClient();

  const query = useQuery<NotificationPreferences>({
    queryKey: profilePreferenceKeys.details(),
    queryFn: getMyPreferences,
    staleTime: 1000 * 60 * 5,
  });

  const mutation = useMutation({
    mutationFn: async (preferences: NotificationPreferences) => {
      const updatedUser = await updateProfile({
        allowEmailNotifications: preferences.allow_email_notifications,
        allowExpiryReminders: preferences.allow_expiry_reminders,
        allowRiskAlerts: preferences.allow_risk_alerts,
        allowAnalysisAlerts: preferences.allow_analysis_alerts,
      });

      return {
        user: updatedUser,
        preferences,
      };
    },
    onSuccess: ({ user, preferences }) => {
      queryClient.setQueryData(["auth", "me"], { user });
      queryClient.setQueryData(profilePreferenceKeys.details(), preferences);
      toast.success("Notification preferences updated.");
    },
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to update notification preferences.";
      toast.error(msg);
    },
  });

  return {
    ...query,
    savePreferences: mutation.mutate,
    savePreferencesAsync: mutation.mutateAsync,
    isSaving: mutation.isPending,
  };
}
