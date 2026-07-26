/**
 * Plan limits — mirrors the backend UsagePolicyService LIMITS constant.
 * Used by the sidebar to calculate usage percentages without an extra API call.
 */
export const LIMITS = {
  GUEST: {
    UPLOADS: 1,
    ANALYSES: 1,
  },
  Free: {
    UPLOADS: 3,
    ANALYSES: 3,
  },
  Professional: {
    UPLOADS: 10, // Unlimited
    ANALYSES: 10,
  },
  Elite: {
    UPLOADS: 50,
    ANALYSES: 50,
  },
} as const;
