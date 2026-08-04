// hooks/use-paddle.ts
import { useCallback, useEffect, useState } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCheckout } from "../lib/endpoints/billing-endpoints";
import { queryKeys } from "@/lib/query-keys";

type CheckoutPlan = "Professional" | "Elite";
type BillingPeriod = "monthly" | "yearly";

export function usePaddle() {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;

    if (!token) {
      return;
    }

    initializePaddle({
      environment:
        import.meta.env.VITE_PADDLE_SANDBOX === "true"
          ? "sandbox"
          : "production",
      token: token,
      eventCallback: async (event) => {
        if (event.name === "checkout.completed") {
          const toastId = toast.loading("Updating your subscription...");

          try {
            // Wait 3 seconds to allow the backend to process the Paddle webhook
            await new Promise((resolve) => setTimeout(resolve, 3000));

            await queryClient.invalidateQueries({
              queryKey: queryKeys.auth.me(),
            });

            // Re-fetch again after a short delay just in case the webhook was delayed
            setTimeout(() => {
              queryClient.invalidateQueries({
                queryKey: queryKeys.auth.me(),
              });
            }, 4000);

            toast.success("Subscription activated!", {
              id: toastId,
            });
          } catch (err) {
            toast.error("Failed to refresh your account.", {
              id: toastId,
            });
          }
        }
      },
    }).then((paddleInstance) => {
      if (paddleInstance) {
        setPaddle(paddleInstance);
      }
    });
  }, [queryClient]);

  const openCheckout = useCallback(
    async (
      plan: CheckoutPlan,
      billingPeriod: BillingPeriod,
      customerEmail?: string,
    ) => {
      if (!paddle) {
        toast.error("Paddle is not ready yet. Please try again in a moment.");
        return;
      }

      try {
        const { transactionId } = await createCheckout(plan, billingPeriod);
        if (transactionId) {
          paddle.Checkout.open({
            transactionId: transactionId,
          });
        } else {
          toast.error("Failed to generate checkout URL.");
        }
      } catch (error) {
        toast.error("An error occurred starting checkout.");
        // console.error("Checkout error:", error);
      }
    },
    [paddle],
  );

  return { paddle, openCheckout };
}
