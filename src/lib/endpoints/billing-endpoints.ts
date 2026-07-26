import { api } from "../api";

export interface PaddleSubscription {
  id: string;
  userId: string;
  paddleCustomerId: string;
  paddleSubscriptionId: string;
  plan: string;
  billingCycle: string;
  status: string;
  currentPeriodEnd: string | null;
}

export async function createCheckout(
  plan: string,
  billingCycle: string,
): Promise<{ transactionId: string; checkoutUrl: string }> {
  const { data } = await api.post("/billing/checkout", { plan, billingCycle });
  return data;
}

export async function getSubscription(): Promise<PaddleSubscription | null> {
  const { data } = await api.get("/billing/subscription");
  return data?.subscription || null;
}

export async function cancelSubscription(): Promise<{ message: string }> {
  const { data } = await api.delete("/billing/subscription");
  return data;
}

export async function syncSubscription(
  transactionId: string,
): Promise<{ success: boolean; plan: string; status: string }> {
  const { data } = await api.post("/billing/sync", { transactionId });
  return data;
}
