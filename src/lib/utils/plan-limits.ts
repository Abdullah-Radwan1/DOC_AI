/**
 * Plan limits — mirrors the backend UsagePolicyService LIMITS constant.
 * Used by the sidebar to calculate usage percentages without an extra API call.
 */
export const LIMITS = {
  GUEST: {
    UPLOADS: 1,
    ANALYSES: 1,
  },
  FREE: {
    UPLOADS: 3,
    ANALYSES: 3,
  },
  GROWTH: {
    UPLOADS: -1, // Unlimited
    ANALYSES: -1,
  },
  ENTERPRISE: {
    UPLOADS: -1,
    ANALYSES: -1,
  },
} as const;
