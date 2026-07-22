// hooks/use-paddle.ts
import { useCallback, useEffect, useState } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCheckout, syncSubscription } from "../lib/endpoints/billing-endpoints";

type CheckoutPlan = "Professional" | "Elite";
type BillingPeriod = "monthly" | "yearly";

export function usePaddle() {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;

    if (!token) {
      console.warn("Paddle Client Token is missing from env variables.");
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
          const transactionId = event.data?.transaction_id;
          if (transactionId) {
            const toastId = toast.loading("Syncing your subscription plan...");
            try {
              await syncSubscription(transactionId);
              toast.success("Subscription activated successfully!", { id: toastId });
              // Invalidate auth query to refresh user plan immediately in frontend UI
              await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
            } catch (err) {
              console.error("Sync error:", err);
              toast.error("Failed to sync subscription status with backend.", { id: toastId });
            }
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
        console.error("Checkout error:", error);
      }
    },
    [paddle],
  );

  return { paddle, openCheckout };
}
