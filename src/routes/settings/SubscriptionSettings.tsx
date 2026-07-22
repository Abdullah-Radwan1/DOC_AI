import { motion, Variants } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { usePaddle } from "@/hooks/use-paddle";
import { cancelSubscription } from "@/lib/endpoints/billing-endpoints";
import { LIMITS } from "@/lib/utils/plan-limits";
import { Check, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

const formatLimit = (limit: number) =>
  limit === -1 ? "Unlimited" : `${limit}`;

const plansConfig = [
  {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    description: "Perfect for trying out the platform",
    features: [
      `Up to ${formatLimit(LIMITS.Free.ANALYSES)} AI analyses per month`,
      `Up to ${formatLimit(LIMITS.Free.UPLOADS)} uploads`,
      "Email reminders",
    ],
  },
  {
    id: "Professional",
    name: "Professional",
    priceMonthly: 5,
    description: "For professionals who need comprehensive analysis",
    trialBadge: "1-month free trial",
    features: [
      `Up to ${formatLimit(LIMITS.Professional.ANALYSES)} AI analyses per month`,
      `Up to ${formatLimit(LIMITS.Professional.UPLOADS)} uploads`,
      "Compliance scoring",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "Elite",
    name: "Elite",
    priceMonthly: 20,
    description: "For large teams with advanced requirements",
    features: [
      `Up to ${formatLimit(LIMITS.Elite.ANALYSES)} AI analyses per month`,
      `Up to ${formatLimit(LIMITS.Elite.UPLOADS)} uploads`,
      "Everything in Professional",
    ],
  },
];

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function SubscriptionSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { plan: activePlanId = "free", email } = user ?? {};
  const { openCheckout } = usePaddle();

  const cancelMutation = useMutation({
    mutationFn: () => cancelSubscription(),
    onSuccess: (data) => {
      toast.success(
        data.message ||
          "Your plan will be downgraded at the end of the billing cycle.",
      );
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: (error: unknown) => {
      const msg =
        (error as Record<string, any>)?.response?.data?.message ??
        "Failed to downgrade your plan.";
      toast.error(msg);
    },
  });

  const handleSelectPlan = (planId: string) => {
    if (activePlanId === planId) return;

    if (planId === "free") {
      cancelMutation.mutate();
      return;
    }

    openCheckout(
      planId as "Professional" | "Elite",
      "monthly",
      email ?? undefined,
    );
  };

  return (
    <div className="space-y-6">
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-3 gap-6 pt-6"
      >
        {plansConfig.map((planItem) => {
          const isCurrentPlan = activePlanId === planItem.id;
          const price = planItem.priceMonthly;

          return (
            <motion.div key={planItem.id} variants={itemVariants}>
              <Card
                className={`relative h-full flex flex-col transition-all duration-300 ${
                  planItem.popular
                    ? "border-2 border-primary shadow-lg md:scale-105 z-10"
                    : "border-border shadow-sm"
                }`}
              >
                {planItem.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-brand to-accent text-white px-3 py-0.5 shadow-md">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-2 mt-2">
                  <CardTitle className="text-xl font-bold">
                    {planItem.name}
                  </CardTitle>

                  <CardDescription className="text-sm min-h-[40px] pt-1">
                    {planItem.description}
                  </CardDescription>

                  {planItem.trialBadge && (
                    <div className="pt-1">
                      <span className="text-xs font-semibold text-brand bg-brand/10 px-2 py-1 rounded-md">
                        {planItem.trialBadge}
                      </span>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="text-center pb-6 flex-grow">
                  <div className="mb-6 h-16 flex flex-col justify-center items-center">
                    <div>
                      <span className="text-4xl font-black tracking-tight">
                        ${price}
                      </span>
                      <span className="text-muted-foreground text-sm font-medium">
                        /month
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {planItem.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2.5 text-sm text-left font-medium text-muted-foreground"
                      >
                        <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/90">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="mt-auto pt-4 w-full">
                  {isCurrentPlan ? (
                    <Button
                      variant="outline"
                      className="w-full bg-muted/50 cursor-not-allowed font-semibold"
                      disabled
                    >
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      className={`w-full font-semibold tracking-wide transition-all duration-200 ${
                        planItem.popular
                          ? "bg-gradient-to-r from-brand to-accent text-white hover:opacity-90 shadow-md"
                          : ""
                      }`}
                      onClick={() => handleSelectPlan(planItem.id)}
                      disabled={cancelMutation.isPending}
                    >
                      {planItem.popular && (
                        <Sparkles className="mr-2 h-4 w-4 fill-white/20" />
                      )}

                      {planItem.id === "free" ? (
                        cancelMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Downgrading...
                          </>
                        ) : (
                          "Downgrade to Free"
                        )
                      ) : (
                        `Upgrade to ${planItem.name}`
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
