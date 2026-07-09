import type { CheckoutRequest } from "./types";

export async function createStripeCheckoutSession(request: CheckoutRequest) {
  void request;
  throw new Error("Stripe checkout is not implemented yet.");
}
