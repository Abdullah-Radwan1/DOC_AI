// hooks/use-paddle.ts
import { useCallback, useEffect, useState } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { toast } from "sonner";

type CheckoutPlan = "professional" | "enterprise";

export function usePaddle() {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  console.log(import.meta.env.VITE_PADDLE_SANDBOX);

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
    }).then((paddleInstance) => {
      if (paddleInstance) {
        setPaddle(paddleInstance);
      }
    });
  }, []);

  const openCheckout = useCallback(
    (plan: CheckoutPlan, customerEmail?: string) => {
      if (!paddle) {
        toast.error("Paddle is not ready yet. Please try again in a moment.");
        return;
      }

      const priceId =
        plan === "enterprise"
          ? import.meta.env.VITE_PADDLE_ENTERPRISE_PRICE_ID
          : import.meta.env.VITE_PADDLE_PROFESSIONAL_PRICE_ID;

      if (!priceId) {
        toast.error(
          `Paddle ${plan} price ID is not configured. Add VITE_PADDLE_${plan.toUpperCase()}_PRICE_ID to your env file.`,
        );
        return;
      }

      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: customerEmail ? { email: customerEmail } : undefined,
        settings: {
          displayMode: "overlay",
          theme: "light",
        },
      });
    },
    [paddle],
  );

  return { paddle, openCheckout };
}
